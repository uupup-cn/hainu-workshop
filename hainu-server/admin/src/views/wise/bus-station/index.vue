<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增车站</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="stationName" label="车站名称" width="160" />
        <ElTableColumn prop="locationDesc" label="位置描述" show-overflow-tooltip />
        <ElTableColumn prop="lines" label="途经线路" show-overflow-tooltip />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="车站名称"><ElInput v-model="form.stationName" /></ElFormItem>
        <ElFormItem label="位置描述"><ElInput v-model="form.locationDesc" /></ElFormItem>
        <ElFormItem label="途经线路"><ElInput v-model="form.lines" placeholder="多个线路用逗号分隔" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="form.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="form.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/wise'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([])
const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({})
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchAdminBusStations()) as any[] } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑车站' : '新增车站'; form.value = row ? { ...row } : { isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateBusStation(editId.value, form.value); else await api.fetchCreateBusStation(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该车站？', '提示'); await api.fetchDeleteBusStation(row.id); loadData() }
onMounted(loadData)
</script>
