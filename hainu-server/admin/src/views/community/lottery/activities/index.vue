<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">活动总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">已上架</div><div class="text-2xl font-bold mt-2">{{ stats.listed }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">未上架</div><div class="text-2xl font-bold mt-2">{{ stats.unlisted }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">已下架</div><div class="text-2xl font-bold mt-2">{{ stats.offShelf }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新建活动</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="name" label="活动名称" min-width="160" />
        <ElTableColumn label="类型" width="90"><template #default="{ row }"><ElTag :type="row.type === 'points' ? 'warning' : 'success'" size="small">{{ row.type === 'points' ? '积分' : '免费' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="开始时间" width="150"><template #default="{ row }">{{ (row.startTime || '').slice(0, 16).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="结束时间" width="150"><template #default="{ row }">{{ (row.endTime || '').slice(0, 16).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="奖品数" width="80"><template #default="{ row }">{{ (row.prizes || []).length }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="100"><template #default="{ row }"><ElTag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="220" fixed="right"><template #default="{ row }">
          <ElButton v-if="row.status !== 'listed'" size="small" link type="success" @click="handleList(row, 'listed')">上架</ElButton>
          <ElButton v-else size="small" link type="warning" @click="handleList(row, 'off_shelf')">下架</ElButton>
          <ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton>
        </template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <ElForm :model="form" label-width="100px">
        <ElFormItem label="活动名称"><ElInput v-model="form.name" /></ElFormItem>
        <ElFormItem label="类型"><ElSelect v-model="form.type" style="width: 100%"><ElOption label="免费" value="free" /><ElOption label="积分" value="points" /></ElSelect></ElFormItem>
        <ElFormItem label="开始时间"><ElDatePicker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" /></ElFormItem>
        <ElFormItem label="结束时间"><ElDatePicker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" /></ElFormItem>
        <ElFormItem label="积分消耗"><ElInputNumber v-model="form.pointsCost" :min="0" :disabled="form.type !== 'points'" /></ElFormItem>
        <ElFormItem label="每人次数"><ElInputNumber v-model="form.maxDrawsPerUser" :min="1" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const dialogVisible = ref(false); const dialogTitle = ref(''); const form = ref<any>({})
const statusMap: Record<string, { label: string; type: 'success' | 'info' | 'warning' }> = { unlisted: { label: '未上架', type: 'info' }, listed: { label: '已上架', type: 'success' }, active: { label: '进行中', type: 'success' }, ended: { label: '已结束', type: 'warning' }, off_shelf: { label: '已下架', type: 'info' } }
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusType(s: string) { return statusMap[s]?.type || 'info' }
const stats = computed(() => ({
  total: total.value,
  listed: tableData.value.filter(r => r.status === 'listed').length,
  unlisted: tableData.value.filter(r => r.status === 'unlisted').length,
  offShelf: tableData.value.filter(r => r.status === 'off_shelf').length,
}))
async function loadData() { loading.value = true; try { const res: any = await api.fetchAdminLotteryActivities({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openDialog() { dialogTitle.value = '新建活动'; form.value = { type: 'free', pointsCost: 0, maxDrawsPerUser: 1 }; dialogVisible.value = true }
async function handleSave() { try { await api.fetchCreateLotteryActivity(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleList(row: any, status: string) { await ElMessageBox.confirm(`确认${status === 'listed' ? '上架' : '下架'}该活动？`, '提示'); try { await api.fetchListLotteryActivity(row.id, { status }); loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该活动？关联奖品和中奖记录将一并清除。', '提示'); try { await api.fetchDeleteLotteryActivity(row.id); loadData() } catch {} }
onMounted(loadData)
</script>
