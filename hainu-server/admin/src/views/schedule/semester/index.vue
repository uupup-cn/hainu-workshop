<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">学期总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">启用数量</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">停用数量</div><div class="text-2xl font-bold mt-2">{{ stats.inactive }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">进行中学期</div><div class="text-2xl font-bold mt-2">{{ stats.ongoing }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增学期</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="semesterName" label="学期名称" min-width="160" />
        <ElTableColumn label="开始日期" width="130"><template #default="{ row }">{{ (row.startDate || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="结束日期" width="130"><template #default="{ row }">{{ (row.endDate || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="110"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openDialog(row)">编辑</ElButton><ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="学期名称"><ElInput v-model="form.semesterName" /></ElFormItem>
        <ElFormItem label="开始日期"><ElDatePicker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" /></ElFormItem>
        <ElFormItem label="结束日期"><ElDatePicker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" /></ElFormItem>
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
function isOngoing(row: any) { const now = Date.now(); const s = new Date(row.startDate).getTime(); const e = new Date(row.endDate).getTime(); return s <= now && now <= e }
const stats = computed(() => ({
  total: tableData.value.length,
  active: tableData.value.filter(r => r.isActive).length,
  inactive: tableData.value.filter(r => !r.isActive).length,
  ongoing: tableData.value.filter(isOngoing).length,
}))
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchSemesters() ) } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑学期' : '新增学期'; form.value = row ? {...row} : { isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateSemester(editId.value, form.value); else await api.fetchCreateSemester(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该学期？关联周制记录将一并清除。', '提示'); await api.fetchDeleteSemester(row.id); loadData() }
onMounted(loadData)
</script>
