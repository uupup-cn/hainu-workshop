<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">帖子总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">今日新增</div><div class="text-2xl font-bold mt-2">{{ stats.today }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">总点赞数</div><div class="text-2xl font-bold mt-2">{{ stats.likes }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">总评论数</div><div class="text-2xl font-bold mt-2">{{ stats.comments }}</div></ElCard></ElCol>
    </ElRow>
    <ArtSearchBar v-model="searchForm" :items="searchItems" :showExpand="false" @search="handleSearch" @reset="handleReset" />
    <ElCard shadow="never" style="margin-top: 12px">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn label="置顶" width="60"><template #default="{ row }"><ElSwitch :model-value="row.isPinned" @change="(val: any) => handlePin(row, val)" /></template></ElTableColumn>
        <ElTableColumn label="用户" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn label="版块" width="100"><template #default="{ row }">{{ row.section?.sectionName || '-' }}</template></ElTableColumn>
        <ElTableColumn prop="title" label="标题" width="150" show-overflow-tooltip />
        <ElTableColumn label="内容摘要" min-width="250"><template #default="{ row }"><span class="text-gray-500">{{ (row.content || '').replace(/<[^>]+>/g, '').slice(0, 60) }}</span></template></ElTableColumn>
        <ElTableColumn prop="likeCount" label="点赞" width="70" />
        <ElTableColumn prop="commentCount" label="评论" width="70" />
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '已上线' : '已下线' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="发布时间" width="150"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 16).replace('T', ' ') || '-' }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="250" fixed="right"><template #default="{ row }">
          <ElButton size="small" link @click="openPreview(row)">预览</ElButton>
          <ElButton size="small" link type="primary" @click="openDialog(row)">编辑</ElButton>
          <ElButton size="small" link :type="row.isActive ? 'warning' : 'success'" @click="handleStatus(row)">{{ row.isActive ? '下线' : '上线' }}</ElButton>
          <ElButton size="small" link @click="handlePin(row, !row.isPinned)">{{ row.isPinned ? '取消置顶' : '置顶' }}</ElButton>
          <ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton>
        </template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="previewVisible" title="帖子预览" width="700px" destroy-on-close>
      <div v-if="previewRow">
        <div class="mb-2 text-gray-500 text-sm">用户：{{ previewRow.user?.nickname || previewRow.user?.uid }} · 版块：{{ previewRow.section?.sectionName || '-' }} · {{ previewRow.isAnonymous ? '匿名' : '实名' }}</div>
        <div v-if="previewRow.title" class="text-lg font-bold mb-2">{{ previewRow.title }}</div>
        <div class="post-content" v-html="previewRow.content"></div>
        <div v-if="(previewRow.images || []).length" class="flex flex-wrap gap-2 mt-3">
          <ElImage v-for="(img, i) in previewRow.images" :key="i" :src="img" :preview-src-list="previewRow.images" fit="cover" style="width: 120px; height: 120px" />
        </div>
        <div class="mt-3 text-gray-500 text-sm">点赞 {{ previewRow.likeCount }} · 评论 {{ previewRow.commentCount }}</div>
      </div>
    </ElDialog>
    <ElDialog v-model="dialogVisible" title="编辑帖子" width="800px" destroy-on-close>
      <ElForm :model="form" label-width="80px">
        <ElRow :gutter="16">
          <ElCol :span="12"><ElFormItem label="标题"><ElInput v-model="form.title" placeholder="选填" /></ElFormItem></ElCol>
          <ElCol :span="12"><ElFormItem label="版块"><ElSelect v-model="form.sectionId" style="width: 100%" clearable placeholder="选填"><ElOption v-for="s in sections" :key="s.id" :label="s.sectionName" :value="s.id" /></ElSelect></ElFormItem></ElCol>
        </ElRow>
        <ElFormItem label="匿名"><ElSwitch v-model="form.isAnonymous" /></ElFormItem>
        <ElFormItem label="内容">
          <ArtWangEditor v-model="form.content" height="400px" :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']" />
        </ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const ArtWangEditor = defineAsyncComponent(() => import('@/components/core/forms/art-wang-editor/index.vue'))
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([])
const searchForm = ref({ keyword: '' })
const searchItems = [{ label: '关键词', key: 'keyword', type: 'input', props: { clearable: true, placeholder: '请输入标题或内容关键词' } }]
const page = ref(1); const size = ref(20); const total = ref(0)
const previewVisible = ref(false); const previewRow = ref<any>(null)
const dialogVisible = ref(false); const editId = ref<number | null>(null); const form = ref<any>({});
const sections = ref<any[]>([])
const stats = computed(() => ({
  total: tableData.value.length,
  today: tableData.value.filter(r => (r.createdAt || '').slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
  likes: tableData.value.reduce((s, r) => s + (Number(r.likeCount) || 0), 0),
  comments: tableData.value.reduce((s, r) => s + (Number(r.commentCount) || 0), 0),
}))
async function loadData() {
  loading.value = true
  try { const res: any = await api.fetchAlumniPosts({ page: page.value, size: size.value, type: 'post', keyword: searchForm.value.keyword || undefined }); tableData.value = res.list; total.value = res.total }
  finally { loading.value = false }
}
async function loadSections() { try { sections.value = (await api.fetchAlumniSections()) as any[] } catch {} }
function handleSearch() { page.value = 1; loadData() }
function handleReset() { searchForm.value.keyword = ''; page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openPreview(row: any) { previewRow.value = row; previewVisible.value = true }
function openDialog(row: any) { editId.value = row.id; form.value = { title: row.title || '', sectionId: row.sectionId ?? null, isAnonymous: !!row.isAnonymous, content: row.content || '' }; dialogVisible.value = true }
async function handleSave() { try { await api.fetchUpdateAlumniPost(editId.value!, form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleStatus(row: any) {
  if (row.isActive) {
    // 下线需填写原因
    const { value } = await ElMessageBox.prompt('请填写下架原因（将作为站内信通知作者）', '下架帖子', { confirmButtonText: '确认下架', cancelButtonText: '取消', inputType: 'textarea', inputPlaceholder: '请输入下架原因…', inputValidator: (v: string) => !!v?.trim() || '请填写下架原因' })
    await api.fetchSetAlumniPostStatus(row.id, false, value.trim())
  } else {
    await api.fetchSetAlumniPostStatus(row.id, true)
  }
  loadData()
}
async function handlePin(row: any, val: boolean) { try { await api.fetchUpdateAlumniPostPin(row.id, { isPinned: !!val }); loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该帖子？删除后评论和点赞将一并清除。', '提示'); try { await api.fetchDeleteAlumniPost(row.id); loadData() } catch {} }
onMounted(() => { loadData(); loadSections() })
</script>
