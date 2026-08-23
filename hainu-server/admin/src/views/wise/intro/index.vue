<template>
  <div>
    <ArtSearchBar v-model="searchForm" :items="searchItems" :showExpand="false" @search="handleSearch" @reset="handleReset" />
    <ElCard shadow="never" style="margin-top: 12px">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增条目</ElButton></div>
      <ArtTable :loading="loading" :data="pagedData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="entryKey" label="标识" width="100" />
        <ElTableColumn prop="entryTitle" label="标题" width="200" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="更新时间" width="150"><template #default="{ row }">{{ (row.updatedAt || '').slice(0, 16).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="180" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="800px" destroy-on-close>
      <ElForm :model="form" label-width="80px">
        <ElRow :gutter="16">
          <ElCol :span="12"><ElFormItem label="标识"><ElInput v-model="form.entryKey" /></ElFormItem></ElCol>
          <ElCol :span="12"><ElFormItem label="标题"><ElInput v-model="form.entryTitle" /></ElFormItem></ElCol>
        </ElRow>
        <ElRow :gutter="16">
          <ElCol :span="12"><ElFormItem label="排序"><ElInputNumber v-model="form.sortOrder" :min="0" /></ElFormItem></ElCol>
          <ElCol :span="12"><ElFormItem label="启用"><ElSwitch v-model="form.isActive" /></ElFormItem></ElCol>
        </ElRow>
        <ElFormItem label="正文内容">
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
import * as api from '@/api/wise'
const ArtWangEditor = defineAsyncComponent(() => import('@/components/core/forms/art-wang-editor/index.vue'))
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([])
const searchForm = ref({ keyword: '' }); const keyword = ref('')
const searchItems = computed(() => [{ label: '关键词', key: 'keyword', type: 'input', props: { clearable: true, placeholder: '请输入标题关键词' } }])
const page = ref(1); const size = ref(20)
const total = computed(() => filteredData.value.length)
const filteredData = computed(() => { const kw = keyword.value.trim(); if (!kw) return tableData.value; return tableData.value.filter((r: any) => (r.entryTitle || '').includes(kw)) })
const pagedData = computed(() => filteredData.value.slice((page.value - 1) * size.value, page.value * size.value))
const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({})
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchAdminIntroEntries()) as any[] } finally { loading.value = false } }
function handleSearch() { keyword.value = searchForm.value.keyword || ''; page.value = 1 }
function handleReset() { searchForm.value.keyword = ''; keyword.value = ''; page.value = 1 }
function handlePage(val: number) { page.value = val }
function handleSize(val: number) { size.value = val; page.value = 1 }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑条目' : '新增条目'; form.value = row ? { ...row } : { isActive: true, sortOrder: 0, content: '' }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateIntro(editId.value, form.value); else await api.fetchCreateIntro(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该条目？', '提示'); await api.fetchDeleteIntro(row.id); loadData() }
onMounted(loadData)
</script>
