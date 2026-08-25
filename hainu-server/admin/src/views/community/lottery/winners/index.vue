<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <div class="flex items-center gap-3">
        <span class="text-gray-500 text-sm">选择活动：</span>
        <ElSelect v-model="activityId" placeholder="请选择活动" filterable style="width: 280px" @change="onActivityChange">
          <ElOption v-for="a in activities" :key="a.id" :label="a.name" :value="a.id" />
        </ElSelect>
        <ElTag v-if="current" :type="statusType(current.status)" size="small">{{ statusLabel(current.status) }}</ElTag>
      </div>
    </ElCard>
    <template v-if="activityId">
      <ElRow :gutter="16" class="mb-3">
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">中奖总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">参与人次</div><div class="text-2xl font-bold mt-2">{{ stats.draws }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">积分消耗</div><div class="text-2xl font-bold mt-2">{{ stats.points }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">中奖率</div><div class="text-2xl font-bold mt-2">{{ stats.rate }}%</div></ElCard></ElCol>
      </ElRow>
      <ElCard shadow="never" header="中奖记录">
        <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
          <ElTableColumn label="用户" width="120"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
          <ElTableColumn label="是否中奖" width="100"><template #default="{ row }"><ElTag :type="row.isWin ? 'success' : 'info'" size="small">{{ row.isWin ? '中奖' : '未中' }}</ElTag></template></ElTableColumn>
          <ElTableColumn prop="prizeName" label="奖品" min-width="140"><template #default="{ row }">{{ row.prizeName || '-' }}</template></ElTableColumn>
          <ElTableColumn prop="pointsConsumed" label="积分消耗" width="100" />
          <ElTableColumn label="中奖时间" width="170"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
        </ArtTable>
      </ElCard>
    </template>
    <ElCard v-else shadow="never"><ElEmpty description="请先选择一个活动" /></ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as api from '@/api/community'
const activities = ref<any[]>([]); const activityId = ref<number | undefined>(undefined); const current = ref<any>(null)
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const statusMap: Record<string, { label: string; type: 'success' | 'info' | 'warning' }> = { unlisted: { label: '未上架', type: 'info' }, listed: { label: '已上架', type: 'success' }, active: { label: '进行中', type: 'success' }, ended: { label: '已结束', type: 'warning' }, off_shelf: { label: '已下架', type: 'info' } }
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusType(s: string) { return statusMap[s]?.type || 'info' }
const stats = computed(() => ({
  total: tableData.value.filter(r => r.isWin).length,
  draws: total.value,
  points: tableData.value.reduce((s, r) => s + (Number(r.pointsConsumed) || 0), 0),
  rate: total.value ? ((tableData.value.filter(r => r.isWin).length / total.value) * 100).toFixed(1) : '0.0',
}))
async function loadActivities() { try { const res: any = await api.fetchAdminLotteryActivities({ page: 1, size: 100 }); activities.value = res.list } catch {} }
async function onActivityChange() { if (!activityId.value) return; try { const res: any = await api.fetchLotteryActivity(activityId.value); current.value = res } catch {}; page.value = 1; loadWinners() }
async function loadWinners() { if (!activityId.value) return; loading.value = true; try { const res: any = await api.fetchLotteryWinners(activityId.value, { page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadWinners() }
function handleSize(val: number) { size.value = val; page.value = 1; loadWinners() }
onMounted(loadActivities)
</script>
