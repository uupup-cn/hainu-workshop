<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4 flex gap-2">
        <ElSelect v-model="campus" placeholder="全部校区" clearable style="width: 160px" @change="loadData"><ElOption v-for="c in campuses" :key="c.campusName" :label="c.campusName" :value="c.campusName" /></ElSelect>
        <ElButton type="primary" plain @click="openDialog()">新增主题</ElButton>
      </div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <ElTableColumn prop="campus" label="校区" width="110" />
        <ElTableColumn prop="topicKey" label="标识" width="120" />
        <ElTableColumn prop="topicTitle" label="主题标题" width="180" />
        <ElTableColumn label="内容"><template #default="{ row }"><span class="text-gray-500">{{ (row.content || '').slice(0, 40) }}</span></template></ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="校区"><ElSelect v-model="form.campus" placeholder="请选择校区" style="width: 100%"><ElOption v-for="c in campuses" :key="c.campusName" :label="c.campusName" :value="c.campusName" /></ElSelect></ElFormItem>
        <ElFormItem label="标识"><ElInput v-model="form.topicKey" /></ElFormItem>
        <ElFormItem label="主题标题"><ElInput v-model="form.topicTitle" /></ElFormItem>
        <ElFormItem label="内容"><ElInput v-model="form.content" type="textarea" :rows="6" /></ElFormItem>
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
import * as api from '@/api/freshman'
const loading = ref(false); const tableData = ref<any[]>([]); const campuses = ref<any[]>([]); const campus = ref(''); const dialogVisible = ref(false); const dialogTitle = ref(''); const editId = ref<number|null>(null); const form = ref<any>({}); const columns = ref([])
async function loadData() { loading.value = true; try { tableData.value = (await api.fetchAdminLifeTopics(campus.value ? { campus: campus.value } : undefined) ) as any[] } finally { loading.value = false } }
async function loadCampuses() { campuses.value = (await api.fetchLifeCampuses() ) as any[] }
function openDialog(row?: any) { editId.value = row?.id || null; dialogTitle.value = row ? '编辑' : '新增'; form.value = row ? {...row} : { campus: campus.value, isActive: true, sortOrder: 0 }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value) await api.fetchUpdateLifeTopic(editId.value, form.value); else await api.fetchCreateLifeTopic(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该主题？', '提示'); await api.fetchDeleteLifeTopic(row.id); loadData() }
onMounted(() => { loadCampuses(); loadData() })
</script>
