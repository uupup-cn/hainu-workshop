<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">在售商品数</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">已下架数</div><div class="text-2xl font-bold mt-2">{{ stats.off }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">总浏览量</div><div class="text-2xl font-bold mt-2">{{ stats.views }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">商品总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
    </ElRow>
    <ArtSearchBar v-model="searchForm" :items="searchItems" :showExpand="false" @search="handleSearch" @reset="handleReset" />
    <ElCard shadow="never" style="margin-top: 12px">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn label="商品信息" min-width="280"><template #default="{ row }"><div class="flex items-center gap-2">
          <ElImage v-if="row.images && row.images[0]" :src="row.images[0]" fit="cover" :preview-src-list="row.images" :preview-teleported="true" style="width: 40px; height: 40px; border-radius: 4px; flex-shrink: 0" />
          <div v-else class="flex items-center justify-center text-gray-400" style="width: 40px; height: 40px; border-radius: 4px; background: #f5f5f5; flex-shrink: 0; font-size: 12px">无图</div>
          <div class="flex-1 overflow-hidden"><div class="font-bold truncate">{{ row.title }}</div><div class="text-gray-500 text-xs truncate">{{ (row.description || '').replace(/<[^>]+>/g, '').slice(0, 40) }}</div></div>
        </div></template></ElTableColumn>
        <ElTableColumn label="价格" width="100"><template #default="{ row }">￥{{ Number(row.price || 0).toFixed(2) }}</template></ElTableColumn>
        <ElTableColumn label="分类" width="100"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
        <ElTableColumn label="发布者" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid || '-' }}</template></ElTableColumn>
        <ElTableColumn prop="viewCount" label="浏览量" width="80" />
        <ElTableColumn label="状态" width="100"><template #default="{ row }"><ElTag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="发布时间" width="150"><template #default="{ row }">{{ (row.publishedAt || '').slice(0, 16).replace('T', ' ') || '-' }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="200" fixed="right"><template #default="{ row }">
          <ElButton size="small" link @click="openPreview(row)">预览</ElButton>
          <ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton>
        </template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="previewVisible" title="商品预览" width="700px" destroy-on-close>
      <div v-if="previewRow">
        <h3 class="text-lg font-bold mb-3">{{ previewRow.title }}</h3>
        <div v-if="(previewRow.images || []).length" class="flex flex-wrap gap-2 mb-3">
          <ElImage v-for="(img, i) in previewRow.images" :key="i" :src="img" :preview-src-list="previewRow.images" fit="cover" style="width: 120px; height: 120px" />
        </div>
        <div class="text-2xl font-bold text-red-500 mb-3">￥{{ Number(previewRow.price || 0).toFixed(2) }}</div>
        <div v-if="previewRow.description" class="post-content mb-3" v-html="previewRow.description"></div>
        <div class="text-gray-500 text-sm space-y-1">
          <div>联系方式：{{ previewRow.contact || '-' }}</div>
          <div>分类：{{ previewRow.category?.categoryName || '-' }}</div>
          <div>浏览量：{{ previewRow.viewCount || 0 }}</div>
          <div>发布时间：{{ (previewRow.publishedAt || '').slice(0, 16).replace('T', ' ') || '-' }}</div>
          <div>发布者：{{ previewRow.user?.nickname || previewRow.user?.uid || '-' }}</div>
        </div>
      </div>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([])
const searchForm = ref({ status: '', categoryId: '' as number | string, keyword: '' })
const categories = ref<any[]>([])
const searchItems = computed(() => [
  { label: '状态', key: 'status', type: 'select', props: { clearable: true, placeholder: '全部状态', options: [{ label: '在售', value: 'active' }, { label: '已下架', value: 'off' }, { label: '自动下架', value: 'auto_off' }, { label: '已过期', value: 'expired' }] } },
  { label: '分类', key: 'categoryId', type: 'select', props: { clearable: true, placeholder: '全部分类', options: categories.value.map((c: any) => ({ label: c.categoryName, value: c.id })) } },
  { label: '关键词', key: 'keyword', type: 'input', props: { clearable: true, placeholder: '请输入商品标题关键词' } }
])
const page = ref(1); const size = ref(20); const total = ref(0)
const previewVisible = ref(false); const previewRow = ref<any>(null)
type TagType = 'success' | 'info' | 'warning' | 'danger' | 'primary'
const statusMap: Record<string, { label: string; type: TagType }> = {
  active: { label: '在售', type: 'success' },
  off: { label: '已下架', type: 'info' },
  auto_off: { label: '自动下架', type: 'warning' },
  expired: { label: '已过期', type: 'danger' }
}
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusTagType(s: string): TagType { return statusMap[s]?.type || 'info' }
const stats = computed(() => ({
  active: tableData.value.filter(r => r.status === 'active').length,
  off: tableData.value.filter(r => r.status !== 'active').length,
  views: tableData.value.reduce((s, r) => s + (Number(r.viewCount) || 0), 0),
  total: tableData.value.length,
}))
async function loadData() {
  loading.value = true
  try { const res: any = await api.fetchAdminMarketItems({ page: page.value, size: size.value, status: searchForm.value.status || undefined, categoryId: searchForm.value.categoryId || undefined, keyword: searchForm.value.keyword || undefined }); tableData.value = res.list; total.value = res.total }
  finally { loading.value = false }
}
async function loadCategories() { try { categories.value = (await api.fetchAdminMarketCategories()) as any[] } catch {} }
function handleSearch() { page.value = 1; loadData() }
function handleReset() { searchForm.value.status = ''; searchForm.value.categoryId = ''; searchForm.value.keyword = ''; page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openPreview(row: any) { previewRow.value = row; previewVisible.value = true }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该商品？', '提示'); try { await api.fetchDeleteMarketItem(row.id); loadData() } catch {} }
onMounted(() => { loadData(); loadCategories() })
</script>
