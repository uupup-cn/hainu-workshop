<template>
  <div>
    <ElRow :gutter="16" class="mb-3">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">课程总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">启用课程</div><div class="text-2xl font-bold mt-2">{{ stats.active }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">涉及教师</div><div class="text-2xl font-bold mt-2">{{ stats.teachers }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">涉及用户</div><div class="text-2xl font-bold mt-2">{{ stats.users }}</div></ElCard></ElCol>
    </ElRow>
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
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="创建时间" width="150"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 16).replace('T', ' ') || '-' }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton size="small" link type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/schedule'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0); const keyword = ref('')
const stats = computed(() => ({
  total: total.value,
  active: tableData.value.filter(r => r.isActive).length,
  teachers: new Set(tableData.value.map(r => r.teacher).filter(Boolean)).size,
  users: new Set(tableData.value.map(r => r.userId)).size,
}))
async function loadData() { loading.value = true; try { const res: any = await api.fetchCourses({ page: page.value, size: size.value, keyword: keyword.value || undefined }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handleSearch() { page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该课程？', '提示'); try { await api.fetchDeleteCourse(row.id); loadData() } catch {} }
onMounted(loadData)
</script>
