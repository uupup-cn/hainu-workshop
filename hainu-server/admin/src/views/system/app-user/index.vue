<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4 flex">
        <ElInput v-model="keyword" placeholder="UID / 昵称关键词" style="width: 220px" clearable @keyup.enter="handleSearch" />
        <ElButton type="primary" class="ml-2" @click="handleSearch">搜索</ElButton>
        <ElButton class="ml-2" @click="handleReset">重置</ElButton>
      </div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="uid" label="UID" width="110" />
        <ElTableColumn label="昵称" min-width="140"><template #default="{ row }">{{ row.nickname || '-' }}</template></ElTableColumn>
        <ElTableColumn label="身份" width="100"><template #default="{ row }"><ElTag :type="identityTag(row.identity)" size="small">{{ identityLabel(row.identity) }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="认证状态" width="100"><template #default="{ row }"><ElTag :type="authStatusTag(row.authStatus)" size="small">{{ authStatusLabel(row.authStatus) }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="points" label="积分" width="90" />
        <ElTableColumn label="注册时间" width="110"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" title="编辑用户" width="480px">
      <ElForm :model="form" label-width="90px">
        <ElFormItem label="身份"><ElSelect v-model="form.identity" style="width: 100%"><ElOption label="新生" value="freshman" /><ElOption label="本科生" value="undergrad" /><ElOption label="研究生" value="grad" /></ElSelect></ElFormItem>
        <ElFormItem label="积分"><ElInputNumber v-model="form.points" :min="0" /></ElFormItem>
        <ElFormItem label="积分启用"><ElSwitch v-model="form.pointsEnabled" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/app-user'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const keyword = ref(''); const dialogVisible = ref(false); const editId = ref<number | null>(null); const form = ref<any>({})
const identityMap: Record<string, string> = { freshman: '新生', undergrad: '本科生', grad: '研究生' }
const identityTagMap: Record<string, string> = { freshman: 'warning', undergrad: 'primary', grad: 'success' }
const authStatusMap: Record<string, string> = { unverified: '未认证', pending: '待审核', verified: '已认证' }
const authStatusTagMap: Record<string, string> = { unverified: 'info', pending: 'warning', verified: 'success' }
function identityLabel(v: string) { return identityMap[v] || v }
function identityTag(v: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' { return identityTagMap[v] as 'primary' | 'success' | 'warning' | 'info' | 'danger' || 'info' }
function authStatusLabel(v: string) { return authStatusMap[v] || v }
function authStatusTag(v: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' { return authStatusTagMap[v] as 'primary' | 'success' | 'warning' | 'info' | 'danger' || 'info' }
async function loadData() { loading.value = true; try { const res: any = await api.fetchUserList({ page: page.value, size: size.value, keyword: keyword.value || undefined }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handleSearch() { page.value = 1; loadData() }
function handleReset() { keyword.value = ''; page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openDialog(row: any) { editId.value = row.id; form.value = { identity: row.identity, points: row.points, pointsEnabled: row.pointsEnabled }; dialogVisible.value = true }
async function handleSave() { try { if (editId.value != null) await api.fetchUpdateUser(editId.value, { identity: form.value.identity, points: form.value.points, pointsEnabled: form.value.pointsEnabled }); dialogVisible.value = false; loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm(`确认删除用户 ${row.uid}（${row.nickname || '未设置昵称'}）？`, '提示'); await api.fetchDeleteUser(row.id); loadData() }
onMounted(loadData)
</script>
