<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">颜色总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">启用数量</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">停用数量</div><div class="text-2xl font-bold mt-2">{{ stats.inactive }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">排序上限</div><div class="text-2xl font-bold mt-2">{{ stats.maxSort }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增颜色</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="colorName" label="颜色名称" width="180" />
        <ElTableColumn label="颜色值" width="160"><template #default="{ row }"><div class="flex items-center gap-2"><span class="inline-block rounded border" :style="{ background: row.colorValue, width: '20px', height: '20px' }" /><span>{{ row.colorValue }}</span></div></template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openDialog(row)">编辑</ElButton><ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="颜色名称"><ElInput v-model="form.colorName" /></ElFormItem>
        <ElFormItem label="颜色值"><ElInput v-model="form.colorValue" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="form.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="form.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/schedule'
const loading = ref(false); const tableData = ref<any[]>([]); const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({}); const columns = ref([])
const stats = computed(() => ({
  total: tableData.value.length,
  active: tableData.value.filter(r => r.isActive).length,
  inactive: tableData.value.filter(r => !r.isActive).length,
  maxSort: tableData.value.reduce((m, r) => Math.max(m, Number(r.sortOrder) || 0), 0),
}))
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchCourseColors() ) } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑颜色' : '新增颜色'; form.value = row ? {...row} : { isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateCourseColor(editId.value, form.value); else await api.fetchCreateCourseColor(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该颜色？', '提示'); await api.fetchDeleteCourseColor(row.id); loadData() }
onMounted(loadData)
</script>
