<template>
  <div>
    <ElCard shadow="never">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn label="置顶" width="80"><template #default="{ row }"><ElSwitch :model-value="row.isPinned" @change="(val: any) => handlePin(row, val)" /></template></ElTableColumn>
        <ElTableColumn label="用户" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn label="版块" width="110"><template #default="{ row }">{{ row.section?.sectionName || '-' }}</template></ElTableColumn>
        <ElTableColumn prop="title" label="标题" width="180" />
        <ElTableColumn label="内容"><template #default="{ row }"><span class="text-gray-500">{{ (row.content || '').slice(0, 50) }}</span></template></ElTableColumn>
        <ElTableColumn prop="likeCount" label="点赞" width="80" />
        <ElTableColumn prop="commentCount" label="评论" width="80" />
        <ElTableColumn label="发布时间" width="110"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
async function loadData() { loading.value = true; try { const res: any = await api.fetchAlumniPosts({ page: page.value, size: size.value, type: 'post' }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handlePin(row: any, val: boolean) { try { await api.fetchUpdateAlumniPostPin(row.id, { isPinned: !!val }); loadData() } catch {} }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该帖子？', '提示'); try { await api.fetchDeleteAlumniPost(row.id); loadData() } catch {} }
onMounted(loadData)
</script>
