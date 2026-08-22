<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新建活动</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="name" label="活动名称" min-width="160" />
        <ElTableColumn label="类型" width="90"><template #default="{ row }">{{ row.type === 'points' ? '积分' : '免费' }}</template></ElTableColumn>
        <ElTableColumn label="开始时间" width="110"><template #default="{ row }">{{ (row.startTime || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="结束时间" width="110"><template #default="{ row }">{{ (row.endTime || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="奖品数" width="80"><template #default="{ row }">{{ (row.prizes || []).length }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="statusType(row.status)">{{ statusLabel(row.status) }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="260" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openDetail(row)">详情</ElButton><ElButton v-if="row.status !== 'listed'" size="small" type="success" @click="handleList(row, 'listed')">上架</ElButton><ElButton v-else size="small" type="warning" @click="handleList(row, 'off_shelf')">下架</ElButton><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
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
        <ElFormItem label="活动说明"><ElInput v-model="form.description" type="textarea" :rows="3" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="dialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleSave">保存</ElButton></template>
    </ElDialog>
    <ElDrawer v-model="detailVisible" :title="'活动详情 - ' + (detail.name || '')" size="70%">
      <ElCard shadow="never" class="mb-4" header="活动说明">
        <ElInput v-model="detail.description" type="textarea" :rows="3" />
        <div class="mt-2"><ElButton type="primary" @click="handleSaveDescription">保存说明</ElButton></div>
      </ElCard>
      <ElCard shadow="never" class="mb-4" header="奖品管理">
        <div class="mb-4"><ElButton type="primary" plain @click="openPrizeDialog()">新增奖品</ElButton></div>
        <ArtTable :loading="prizeLoading" :data="prizeData" :columns="prizeColumns">
          <ElTableColumn prop="name" label="奖品名称" width="140" />
          <ElTableColumn prop="image" label="图片" />
          <ElTableColumn prop="quantity" label="数量" width="80" />
          <ElTableColumn prop="remaining" label="剩余" width="80" />
          <ElTableColumn prop="probability" label="概率" width="80" />
          <ElTableColumn prop="sortOrder" label="排序" width="80" />
          <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openPrizeDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handlePrizeDelete(row)">删除</ElButton></template></ElTableColumn>
        </ArtTable>
      </ElCard>
      <ElCard shadow="never" header="中奖记录">
        <ArtTable :loading="winnerLoading" :data="winnerData" :columns="winnerColumns" :pagination="{ current: winnerPage, size: winnerSize, total: winnerTotal }" @pagination:current-change="handleWinnerPage" @pagination:size-change="handleWinnerSize">
          <ElTableColumn label="用户" width="120"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
          <ElTableColumn prop="prizeName" label="奖品" width="140" />
          <ElTableColumn prop="pointsConsumed" label="积分消耗" width="90" />
          <ElTableColumn label="中奖时间" width="160"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
        </ArtTable>
      </ElCard>
    </ElDrawer>
    <ElDialog v-model="prizeDialogVisible" :title="prizeDialogTitle" width="520px">
      <ElForm :model="prizeForm" label-width="90px">
        <ElFormItem label="奖品名称"><ElInput v-model="prizeForm.name" /></ElFormItem>
        <ElFormItem label="图片地址"><ElInput v-model="prizeForm.image" /></ElFormItem>
        <ElFormItem label="数量"><ElInputNumber v-model="prizeForm.quantity" :min="0" /></ElFormItem>
        <ElFormItem label="概率"><ElInputNumber v-model="prizeForm.probability" :precision="4" :step="0.01" :min="0" :max="1" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="prizeForm.sortOrder" :min="0" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="prizeDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handlePrizeSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const dialogVisible = ref(false); const dialogTitle = ref(''); const form = ref<any>({})
const detailVisible = ref(false); const detail = ref<any>({})
const prizeLoading = ref(false); const prizeData = ref<any[]>([]); const prizeColumns = ref([])
const prizeDialogVisible = ref(false); const prizeDialogTitle = ref(''); const prizeEditId = ref<number|null>(null); const prizeForm = ref<any>({})
const winnerLoading = ref(false); const winnerData = ref<any[]>([]); const winnerColumns = ref([]); const winnerPage = ref(1); const winnerSize = ref(20); const winnerTotal = ref(0)
const statusMap: Record<string, { label: string; type: 'success' | 'info' | 'warning' }> = { unlisted: { label: '未上架', type: 'info' }, listed: { label: '已上架', type: 'success' }, active: { label: '进行中', type: 'success' }, ended: { label: '已结束', type: 'warning' }, off_shelf: { label: '已下架', type: 'info' } }
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusType(s: string) { return statusMap[s]?.type || 'info' }
async function loadData() { loading.value = true; try { const res: any = await api.fetchAdminLotteryActivities({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openDialog() { dialogTitle.value = '新建活动'; form.value = { type: 'free', pointsCost: 0, maxDrawsPerUser: 1 }; dialogVisible.value = true }
async function handleSave() { try { await api.fetchCreateLotteryActivity(form.value); dialogVisible.value = false; loadData() } catch {} }
async function handleList(row: any, status: string) { await ElMessageBox.confirm(`确认${status === 'listed' ? '上架' : '下架'}该活动？`, '提示'); try { await api.fetchListLotteryActivity(row.id, { status }); loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该活动？', '提示'); try { await api.fetchDeleteLotteryActivity(row.id); loadData() } catch {} }
async function openDetail(row: any) { const res: any = await api.fetchLotteryActivity(row.id); detail.value = res; prizeData.value = res.prizes || []; detailVisible.value = true; winnerPage.value = 1; loadWinners() }
async function handleSaveDescription() { try { await api.fetchUpdateLotteryDescription(detail.value.id, { description: detail.value.description }); } catch {} }
async function loadPrizes() { const res: any = await api.fetchLotteryActivity(detail.value.id); prizeData.value = res.prizes || [] }
function openPrizeDialog(row?: any) { prizeEditId.value = row?.id || null; prizeDialogTitle.value = row ? '编辑奖品' : '新增奖品'; prizeForm.value = row ? {...row, probability: Number(row.probability)} : { quantity: 0, probability: 0, sortOrder: 0 }; prizeDialogVisible.value = true }
async function handlePrizeSave() { try { if (prizeEditId.value) await api.fetchUpdateLotteryPrize(prizeEditId.value, prizeForm.value); else await api.fetchCreateLotteryPrize(detail.value.id, prizeForm.value); prizeDialogVisible.value = false; loadPrizes() } catch {} }
async function handlePrizeDelete(row: any) { await ElMessageBox.confirm('确认删除该奖品？', '提示'); try { await api.fetchDeleteLotteryPrize(row.id); loadPrizes() } catch {} }
async function loadWinners() { winnerLoading.value = true; try { const res: any = await api.fetchLotteryWinners(detail.value.id, { page: winnerPage.value, size: winnerSize.value }); winnerData.value = res.list; winnerTotal.value = res.total } finally { winnerLoading.value = false } }
function handleWinnerPage(val: number) { winnerPage.value = val; loadWinners() }
function handleWinnerSize(val: number) { winnerSize.value = val; winnerPage.value = 1; loadWinners() }
onMounted(loadData)
</script>
