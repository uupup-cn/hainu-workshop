<template>
  <div>
    <ElCard shadow="never">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="shareCode" label="分享码" width="140" />
        <ElTableColumn label="所有者" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn prop="ownerIdentity" label="身份" width="90" />
        <ElTableColumn label="过期时间" width="160"><template #default="{ row }">{{ (row.expireAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="80"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="启用" width="90"><template #default="{ row }"><ElSwitch :model-value="row.status === 'active'" @change="(val: any) => handleToggle(row, val)" /></template></ElTableColumn>
        <ElTableColumn label="创建时间" width="160"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/schedule'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
async function loadData() { loading.value = true; try { const res: any = await api.fetchShareCodes({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handleToggle(row: any, val: boolean) { try { await api.fetchToggleShareCode(row.id, { status: val ? 'active' : 'disabled' }); loadData() } catch {} }
onMounted(loadData)
</script>
