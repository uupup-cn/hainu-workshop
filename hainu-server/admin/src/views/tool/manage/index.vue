<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增工具</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="toolName" label="工具名称" width="140" />
        <ElTableColumn prop="toolKey" label="工具标识" width="130" />
        <ElTableColumn label="分类" width="110"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
        <ElTableColumn label="积分" width="90"><template #default="{ row }">{{ row.pointsEnabled ? row.pointsCost : '免费' }}</template></ElTableColumn>
        <ElTableColumn label="计费模式" width="100"><template #default="{ row }">{{ pointsModeLabel(row.pointsMode) }}</template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <ElForm :model="form" label-width="90px">
        <ElFormItem label="工具名称"><ElInput v-model="form.toolName" /></ElFormItem>
        <ElFormItem label="工具标识"><ElInput v-model="form.toolKey" :disabled="!!editId" placeholder="创建后不可修改" /></ElFormItem>
        <ElFormItem label="分类"><ElSelect v-model="form.categoryId" placeholder="请选择分类" style="width: 100%"><ElOption v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect></ElFormItem>
        <ElFormItem label="启用积分"><ElSwitch v-model="form.pointsEnabled" /></ElFormItem>
        <ElFormItem label="积分消耗"><ElInputNumber v-model="form.pointsCost" :min="0" :disabled="!form.pointsEnabled" /></ElFormItem>
        <ElFormItem label="计费模式"><ElSelect v-model="form.pointsMode" style="width: 100%" :disabled="!form.pointsEnabled"><ElOption label="免费" value="free" /><ElOption label="按次计费" value="per_use" /><ElOption label="一次买断" value="one_time" /></ElSelect></ElFormItem>
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
const loading = ref(false); const tableData = ref<any[]>([]); const categories = ref<any[]>([]); const columns = ref([])
const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({})
const pointsModeMap: Record<string, string> = { free: '免费', per_use: '按次计费', one_time: '一次买断' }
function pointsModeLabel(v: string) { return pointsModeMap[v] || v }
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchTools() ) as any[] } finally { loading.value = false } }
async function loadCategories() { categories.value = (await api.fetchToolCategories() ) as any[] }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑工具' : '新增工具'; form.value = row ? {...row} : { pointsEnabled: false, pointsCost: 0, pointsMode: 'free', isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateTool(editId.value, form.value); else await api.fetchCreateTool(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该工具？', '提示'); await api.fetchDeleteTool(row.id); loadData() }
onMounted(() => { loadData(); loadCategories() })
</script>
