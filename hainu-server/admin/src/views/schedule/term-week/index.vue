<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">周制记录数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">启用数量</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">停用数量</div><div class="text-2xl font-bold mt-2">{{ stats.inactive }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">涉及学期</div><div class="text-2xl font-bold mt-2">{{ stats.semesters }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <div class="mb-4 flex gap-2">
        <ElSelect v-model="semesterId" placeholder="按学期筛选" clearable style="width: 200px" @change="loadData">
          <ElOption v-for="s in semesters" :key="s.id" :label="s.semesterName" :value="s.id" />
        </ElSelect>
        <ElButton type="primary" plain @click="openDialog()">新增周制</ElButton>
      </div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn label="学期" width="180"><template #default="{ row }">{{ semesterName(row.semesterId) }}</template></ElTableColumn>
        <ElTableColumn prop="weekNumber" label="周次" width="80" />
        <ElTableColumn prop="startDate" label="开始日期" width="140"><template #default="{ row }">{{ (row.startDate || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn prop="endDate" label="结束日期" width="140"><template #default="{ row }">{{ (row.endDate || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="110"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openDialog(row)">编辑</ElButton><ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="学期"><ElSelect v-model="form.semesterId" placeholder="选择学期" style="width: 100%"><ElOption v-for="s in semesters" :key="s.id" :label="s.semesterName" :value="s.id" /></ElSelect></ElFormItem>
        <ElFormItem label="周次"><ElInputNumber v-model="form.weekNumber" :min="1" :max="30" /></ElFormItem>
        <ElFormItem label="开始日期"><ElDatePicker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" /></ElFormItem>
        <ElFormItem label="结束日期"><ElDatePicker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" /></ElFormItem>
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
const loading = ref(false); const tableData = ref<any[]>([]); const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({}); const columns = ref([]); const semesters = ref<any[]>([]); const semesterId = ref<number|undefined>(undefined)
function semesterName(id: number) { return semesters.value.find(s => s.id === id)?.semesterName || id }
const stats = computed(() => ({
  total: tableData.value.length,
  active: tableData.value.filter(r => r.isActive).length,
  inactive: tableData.value.filter(r => !r.isActive).length,
  semesters: new Set(tableData.value.map(r => r.semesterId)).size,
}))
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchTermWeeks(semesterId.value)) } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑周制' : '新增周制'; form.value = row ? {...row} : { isActive: true, weekNumber: 1 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateTermWeek(editId.value, form.value); else await api.fetchCreateTermWeek(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该周制记录？', '提示'); await api.fetchDeleteTermWeek(row.id); loadData() }
onMounted(async () => { try { semesters.value = (await api.fetchSemesters()) } catch {} ; loadData() })
</script>
