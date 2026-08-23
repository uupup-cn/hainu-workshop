<template>
  <div>
    <ElCard shadow="never" header="电话簿条目管理">
      <div class="mb-4 flex gap-2">
        <ElSelect v-model="categoryId" placeholder="全部分类" clearable style="width: 200px" @change="loadEntries"><ElOption v-for="c in catData" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect>
        <ElButton type="primary" plain @click="openEntryDialog()">新增条目</ElButton>
      </div>
      <ArtTable :loading="entryLoading" :data="entryData" :columns="entryColumns">
        <ElTableColumn label="分类" width="160"><template #default="{ row }">{{ catName(row.categoryId) }}</template></ElTableColumn>
        <ElTableColumn prop="departmentName" label="部门名称" width="180" />
        <ElTableColumn prop="phoneNumber" label="电话" width="150" />
        <ElTableColumn prop="description" label="描述" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="操作" width="150" fixed="right" as="right"><template #default="{ row }"><ElButton size="small" @click="openEntryDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleEntryDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="entryDialogVisible" :title="entryDialogTitle" width="500px">
      <ElForm :model="entryForm" label-width="80px">
        <ElFormItem label="分类"><ElSelect v-model="entryForm.categoryId" placeholder="请选择分类" style="width: 100%"><ElOption v-for="c in catData" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect></ElFormItem>
        <ElFormItem label="部门名称"><ElInput v-model="entryForm.departmentName" /></ElFormItem>
        <ElFormItem label="电话"><ElInput v-model="entryForm.phoneNumber" /></ElFormItem>
        <ElFormItem label="描述"><ElInput v-model="entryForm.description" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="entryForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="entryForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="entryDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleEntrySave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/wise'
const catData = ref<any[]>([]); const entryLoading = ref(false); const entryData = ref<any[]>([]); const entryColumns = ref([]); const categoryId = ref<number | ''>('')
const entryDialogVisible = ref(false); const entryDialogTitle = ref(''); const entryEditId = ref<number|null>(null); const entryForm = ref<any>({})
function catName(id: number) { return catData.value.find(c => c.id === id)?.categoryName || id }
async function loadCategories() { catData.value = (await api.fetchAdminPhonebookCategories() ) as any[] }
async function loadEntries() { entryLoading.value = true; try { entryData.value = (await api.fetchAdminPhonebookEntries(categoryId.value ? { categoryId: categoryId.value } : undefined) ) as any[] } finally { entryLoading.value = false } }
function openEntryDialog(row?: any) { entryEditId.value = row?.id || null; entryDialogTitle.value = row ? '编辑条目' : '新增条目'; entryForm.value = row ? {...row} : { categoryId: categoryId.value || undefined, isActive: true, sortOrder: 0 }; entryDialogVisible.value = true }
async function handleEntrySave() { try { if (entryEditId.value) await api.fetchUpdatePhoneEntry(entryEditId.value, entryForm.value); else await api.fetchCreatePhoneEntry(entryForm.value); entryDialogVisible.value = false; loadEntries() } catch {} }
async function handleEntryDelete(row: any) { await ElMessageBox.confirm('确认删除该条目？', '提示'); await api.fetchDeletePhoneEntry(row.id); loadEntries() }
onMounted(() => { loadCategories(); loadEntries() })
</script>
