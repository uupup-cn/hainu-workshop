<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增线路</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="lineName" label="线路名称" width="160" />
        <ElTableColumn prop="apiUrl" label="接口地址" />
        <ElTableColumn prop="apiKey" label="密钥" width="140" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <ElForm :model="form" label-width="90px">
        <ElFormItem label="线路名称"><ElInput v-model="form.lineName" /></ElFormItem>
        <ElFormItem label="接口地址"><ElInput v-model="form.apiUrl" /></ElFormItem>
        <ElFormItem label="密钥"><ElInput v-model="form.apiKey" /></ElFormItem>
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
import * as api from '@/api/tool-module'
const loading = ref(false); const tableData = ref<any[]>([]); const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({}); const columns = ref([])
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchVideoParseLines() ) as any[] } finally { loading.value = false } }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑' : '新增'; form.value = row ? {...row} : { isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateVideoParseLine(editId.value, form.value); else await api.fetchCreateVideoParseLine(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该线路？', '提示'); await api.fetchDeleteVideoParseLine(row.id); loadData() }
onMounted(loadData)
</script>
