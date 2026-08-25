<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">分享码总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">启用数量</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">停用数量</div><div class="text-2xl font-bold mt-2">{{ stats.disabled }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">已过期</div><div class="text-2xl font-bold mt-2">{{ stats.expired }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="shareCode" label="分享码" width="140" />
        <ElTableColumn label="所有者" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn prop="ownerIdentity" label="身份" width="90" />
        <ElTableColumn label="过期时间" width="160"><template #default="{ row }">{{ (row.expireAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="启用" width="90"><template #default="{ row }"><ElSwitch :model-value="row.status === 'active'" @change="(val: any) => handleToggle(row, val)" /></template></ElTableColumn>
        <ElTableColumn label="创建时间" width="160"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="90" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openPreview(row)">预览</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="previewVisible" title="分享码快照" width="640px" destroy-on-close>
      <div v-if="previewRow">
        <div class="mb-2 text-gray-500 text-sm">分享码：{{ previewRow.shareCode }} · 所有者：{{ previewRow.user?.nickname || previewRow.user?.uid }} · 身份：{{ previewRow.ownerIdentity }}</div>
        <ElInput v-model="snapshotText" type="textarea" :rows="14" readonly />
      </div>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as api from '@/api/schedule'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const previewVisible = ref(false); const previewRow = ref<any>(null); const snapshotText = ref('')
const stats = computed(() => ({
  total: total.value,
  active: tableData.value.filter(r => r.status === 'active').length,
  disabled: tableData.value.filter(r => r.status !== 'active').length,
  expired: tableData.value.filter(r => new Date(r.expireAt).getTime() < Date.now()).length,
}))
async function loadData() { loading.value = true; try { const res: any = await api.fetchShareCodes({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handleToggle(row: any, val: boolean) { try { await api.fetchToggleShareCode(row.id, { status: val ? 'active' : 'disabled' }); loadData() } catch {} }
function openPreview(row: any) { previewRow.value = row; snapshotText.value = JSON.stringify(row.snapshot, null, 2); previewVisible.value = true }
onMounted(loadData)
</script>
