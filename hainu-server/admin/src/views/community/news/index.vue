<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增快讯</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn label="置顶" width="70"><template #default="{ row }"><ElTag v-if="row.isPinned" type="warning" size="small">置顶</ElTag></template></ElTableColumn>
        <ElTableColumn prop="title" label="标题" min-width="200" />
        <ElTableColumn label="对象" width="100"><template #default="{ row }">{{ targetLabel(row.target) }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'published' ? 'success' : 'info'">{{ row.status === 'published' ? '已发布' : '草稿' }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="创建时间" width="110"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="标题"><ElInput v-model="form.title" /></ElFormItem>
        <ElFormItem label="内容"><ElInput v-model="form.content" type="textarea" :rows="6" /></ElFormItem>
        <ElFormItem label="目标"><ElSelect v-model="form.target" style="width: 100%"><ElOption label="全部学生" value="all_student" /><ElOption label="新生" value="freshman" /><ElOption label="本科生" value="undergrad" /><ElOption label="研究生" value="grad" /></ElSelect></ElFormItem>
        <ElFormItem label="状态"><ElSelect v-model="form.status" style="width: 100%"><ElOption label="草稿" value="draft" /><ElOption label="已发布" value="published" /></ElSelect></ElFormItem>
        <ElFormItem label="置顶"><ElSwitch v-model="form.isPinned" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="form.sortOrder" :min="0" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({})
const targetMap: Record<string, string> = { all_student: '全部学生', freshman: '新生', undergrad: '本科生', grad: '研究生' }
function targetLabel(v: string) { return targetMap[v] || v }
async function loadData() { loading.value = true; try { const res: any = await api.fetchAdminNews({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑快讯' : '新增快讯'; form.value = row ? {...row} : { target: 'all_student', status: 'draft', isPinned: false, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateNews(editId.value, form.value); else await api.fetchCreateNews(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该快讯？', '提示'); await api.fetchDeleteNews(row.id); loadData() }
onMounted(loadData)
</script>
