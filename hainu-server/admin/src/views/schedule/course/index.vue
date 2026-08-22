<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4 flex gap-2">
        <ElInput v-model="keyword" placeholder="课程名称搜索" clearable style="width: 220px" @keyup.enter="handleSearch" />
        <ElButton type="primary" plain @click="handleSearch">搜索</ElButton>
      </div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="courseName" label="课程名称" min-width="160" />
        <ElTableColumn prop="teacher" label="教师" width="110" />
        <ElTableColumn prop="location" label="上课地点" width="130" />
        <ElTableColumn prop="weeks" label="周次" width="110" />
        <ElTableColumn label="星期" width="70"><template #default="{ row }">{{ row.dayOfWeek ?? '-' }}</template></ElTableColumn>
        <ElTableColumn label="节次" width="90"><template #default="{ row }">{{ row.startSection ?? '-' }}-{{ row.endSection ?? '-' }}</template></ElTableColumn>
        <ElTableColumn label="用户" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn prop="userIdentity" label="身份" width="90" />
        <ElTableColumn prop="source" label="来源" width="90" />
        <ElTableColumn label="创建时间" width="110"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 10) }}</template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/schedule'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0); const keyword = ref('')
async function loadData() { loading.value = true; try { const res: any = await api.fetchCourses({ page: page.value, size: size.value, keyword: keyword.value || undefined }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handleSearch() { page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
onMounted(loadData)
</script>
