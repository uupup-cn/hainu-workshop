<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">节次总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">上午节次</div><div class="text-2xl font-bold mt-2">{{ stats.morning }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">下午节次</div><div class="text-2xl font-bold mt-2">{{ stats.afternoon }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">晚上节次</div><div class="text-2xl font-bold mt-2">{{ stats.evening }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增节次</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="sectionNumber" label="节次编号" width="100" />
        <ElTableColumn label="时段" width="90"><template #default="{ row }"><ElTag :type="periodTagType(row.period)" size="small">{{ periodLabel(row.period) }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="startTime" label="开始时间" width="110" />
        <ElTableColumn prop="endTime" label="结束时间" width="110" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openDialog(row)">编辑</ElButton><ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="节次编号"><ElInput v-model="form.sectionNumber" /></ElFormItem>
        <ElFormItem label="时段"><ElSelect v-model="form.period" style="width: 100%" placeholder="请选择时段"><ElOption label="上午" value="morning" /><ElOption label="下午" value="afternoon" /><ElOption label="晚上" value="evening" /></ElSelect></ElFormItem>
        <ElFormItem label="开始时间"><ElInput v-model="form.startTime" /></ElFormItem>
        <ElFormItem label="结束时间"><ElInput v-model="form.endTime" /></ElFormItem>
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
const periodMap: Record<string, { label: string; type: 'success' | 'warning' | 'info' }> = { morning: { label: '上午', type: 'success' }, afternoon: { label: '下午', type: 'warning' }, evening: { label: '晚上', type: 'info' } }
function periodLabel(p: string) { return periodMap[p]?.label || p || '-' }
function periodTagType(p: string) { return periodMap[p]?.type || 'info' }
const stats = computed(() => ({
  total: tableData.value.length,
  morning: tableData.value.filter(r => r.period === 'morning').length,
  afternoon: tableData.value.filter(r => r.period === 'afternoon').length,
  evening: tableData.value.filter(r => r.period === 'evening').length,
}))
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchSections() ) } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑节次' : '新增节次'; form.value = row ? {...row} : { isActive: true, sortOrder: 0, period: 'morning' }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateSection(editId.value, form.value); else await api.fetchCreateSection(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该节次？', '提示'); await api.fetchDeleteSection(row.id); loadData() }
onMounted(loadData)
</script>
