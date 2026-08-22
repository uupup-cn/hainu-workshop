<template>
  <div>
    <ElCard shadow="never" class="mb-4" header="问题分类">
      <div class="mb-4"><ElButton type="primary" plain @click="openCatDialog()">新增分类</ElButton></div>
      <ArtTable :loading="catLoading" :data="catData" :columns="catColumns">
        <ElTableColumn prop="categoryName" label="分类名称" width="200" />
        <ElTableColumn label="问题数" width="100"><template #default="{ row }">{{ questionCount(row.id) }}</template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openCatDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleCatDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElCard shadow="never" header="问题列表">
      <div class="mb-4 flex gap-2">
        <ElSelect v-model="categoryId" placeholder="全部分类" clearable style="width: 180px" @change="loadQuestions"><ElOption v-for="c in catData" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect>
        <ElButton type="primary" plain @click="openQaDialog()">新增问题</ElButton>
      </div>
      <ArtTable :loading="qaLoading" :data="qaData" :columns="qaColumns">
        <ElTableColumn label="分类" width="140"><template #default="{ row }">{{ catName(row.categoryId) }}</template></ElTableColumn>
        <ElTableColumn prop="question" label="问题" min-width="200" />
        <ElTableColumn label="回答"><template #default="{ row }"><span class="text-gray-500">{{ (row.answer || '').slice(0, 50) }}</span></template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openQaDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleQaDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="catDialogVisible" :title="catDialogTitle" width="500px">
      <ElForm :model="catForm" label-width="80px">
        <ElFormItem label="分类名称"><ElInput v-model="catForm.categoryName" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="catForm.sortOrder" :min="0" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="catDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleCatSave">保存</ElButton></template>
    </ElDialog>
    <ElDialog v-model="qaDialogVisible" :title="qaDialogTitle" width="560px">
      <ElForm :model="qaForm" label-width="80px">
        <ElFormItem label="分类"><ElSelect v-model="qaForm.categoryId" placeholder="请选择分类" style="width: 100%"><ElOption v-for="c in catData" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect></ElFormItem>
        <ElFormItem label="问题"><ElInput v-model="qaForm.question" /></ElFormItem>
        <ElFormItem label="回答"><ElInput v-model="qaForm.answer" type="textarea" :rows="6" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="qaForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="qaForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="qaDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleQaSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/freshman'
const catLoading = ref(false); const catData = ref<any[]>([]); const catColumns = ref([])
const qaLoading = ref(false); const qaData = ref<any[]>([]); const qaColumns = ref([]); const categoryId = ref<number | ''>('')
const catDialogVisible = ref(false); const catDialogTitle = ref(''); const catEditId = ref<number|null>(null); const catForm = ref<any>({})
const qaDialogVisible = ref(false); const qaDialogTitle = ref(''); const qaEditId = ref<number|null>(null); const qaForm = ref<any>({})
function catName(id: number) { return catData.value.find(c => c.id === id)?.categoryName || id }
function questionCount(id: number) { return qaData.value.filter(q => q.categoryId === id).length }
async function loadCategories() { catLoading.value = true; try { catData.value = (await api.fetchAdminFaqCategories() ) as any[] } finally { catLoading.value = false } }
async function loadQuestions() { qaLoading.value = true; try { qaData.value = (await api.fetchAdminFaqQuestions(categoryId.value ? { categoryId: categoryId.value } : undefined) ) as any[] } finally { qaLoading.value = false } }
function openCatDialog(row?: any) { catEditId.value = row?.id || null; catDialogTitle.value = row ? '编辑分类' : '新增分类'; catForm.value = row ? {...row} : { sortOrder: 0 }; catDialogVisible.value = true }
async function handleCatSave() { try { if (catEditId.value) await api.fetchUpdateFaqCategory(catEditId.value, catForm.value); else await api.fetchCreateFaqCategory(catForm.value); catDialogVisible.value = false; loadCategories() } catch {} }
async function handleCatDelete(row: any) { await ElMessageBox.confirm('确认删除该分类？', '提示'); await api.fetchDeleteFaqCategory(row.id); loadCategories() }
function openQaDialog(row?: any) { qaEditId.value = row?.id || null; qaDialogTitle.value = row ? '编辑问题' : '新增问题'; qaForm.value = row ? {...row} : { categoryId: categoryId.value || undefined, isActive: true, sortOrder: 0 }; qaDialogVisible.value = true }
async function handleQaSave() { try { if (qaEditId.value) await api.fetchUpdateFaqQuestion(qaEditId.value, qaForm.value); else await api.fetchCreateFaqQuestion(qaForm.value); qaDialogVisible.value = false; loadQuestions() } catch {} }
async function handleQaDelete(row: any) { await ElMessageBox.confirm('确认删除该问题？', '提示'); await api.fetchDeleteFaqQuestion(row.id); loadQuestions() }
onMounted(() => { loadCategories(); loadQuestions() })
</script>
