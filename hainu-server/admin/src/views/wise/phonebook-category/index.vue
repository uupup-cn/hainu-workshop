<template>
  <div>
    <ElCard shadow="never" header="电话簿分类管理">
      <div class="mb-4"><ElButton type="primary" plain @click="openCatDialog()">新增分类</ElButton></div>
      <ArtTable :loading="catLoading" :data="catData" :columns="catColumns">
        <ElTableColumn label="校区" width="140"><template #default="{ row }">{{ campusName(row.campusId) }}</template></ElTableColumn>
        <ElTableColumn prop="categoryName" label="分类名称" width="200" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="操作" width="150" fixed="right" as="right"><template #default="{ row }"><ElButton size="small" @click="openCatDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleCatDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="catDialogVisible" :title="catDialogTitle" width="500px">
      <ElForm :model="catForm" label-width="80px">
        <ElFormItem label="校区"><ElSelect v-model="catForm.campusId" placeholder="请选择校区" style="width: 100%"><ElOption v-for="c in campuses" :key="c.id" :label="c.campusName" :value="c.id" /></ElSelect></ElFormItem>
        <ElFormItem label="分类名称"><ElInput v-model="catForm.categoryName" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="catForm.sortOrder" :min="0" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="catDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleCatSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/wise'
import { fetchCampuses } from '@/api/campus-data'
const campuses = ref<any[]>([]); const catLoading = ref(false); const catData = ref<any[]>([]); const catColumns = ref([])
const catDialogVisible = ref(false); const catDialogTitle = ref(''); const catEditId = ref<number|null>(null); const catForm = ref<any>({})
function campusName(id: number) { return campuses.value.find(c => c.id === id)?.campusName || id }
async function loadCampuses() { campuses.value = (await fetchCampuses() ) as any[] }
async function loadCategories() { catLoading.value = true; try { catData.value = (await api.fetchAdminPhonebookCategories() ) as any[] } finally { catLoading.value = false } }
function openCatDialog(row?: any) { catEditId.value = row?.id || null; catDialogTitle.value = row ? '编辑分类' : '新增分类'; catForm.value = row ? {...row} : { sortOrder: 0 }; catDialogVisible.value = true }
async function handleCatSave() { try { if (catEditId.value) await api.fetchUpdatePhonebookCategory(catEditId.value, catForm.value); else await api.fetchCreatePhonebookCategory(catForm.value); catDialogVisible.value = false; loadCategories() } catch {} }
async function handleCatDelete(row: any) { await ElMessageBox.confirm('确认删除该分类？', '提示'); await api.fetchDeletePhonebookCategory(row.id); loadCategories() }
onMounted(() => { loadCampuses(); loadCategories() })
</script>
