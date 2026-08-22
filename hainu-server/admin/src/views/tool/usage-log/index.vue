<template>
  <div>
    <ElCard shadow="never">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn label="工具" width="140"><template #default="{ row }">{{ row.tool?.toolName || row.tool?.toolKey || '-' }}</template></ElTableColumn>
        <ElTableColumn label="用户" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn prop="pointsConsumed" label="积分消耗" width="90" />
        <ElTableColumn label="已分享" width="80"><template #default="{ row }">{{ row.isShared ? '是' : '否' }}</template></ElTableColumn>
        <ElTableColumn prop="shareType" label="分享类型" width="90" />
        <ElTableColumn label="使用时间" width="160"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 19).replace('T', ' ') }}</template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/tool-module'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
async function loadData() { loading.value = true; try { const res: any = await api.fetchToolUsageLogs({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
onMounted(loadData)
</script>
