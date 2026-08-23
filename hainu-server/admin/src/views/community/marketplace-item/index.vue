<template>
  <div>
    <ElCard shadow="never">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="title" label="标题" min-width="160" show-overflow-tooltip />
        <ElTableColumn prop="price" label="价格" width="100" />
        <ElTableColumn label="分类" width="110"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '在售' : '已下架' }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="viewCount" label="浏览量" width="90" />
        <ElTableColumn label="发布时间" width="150"><template #default="{ row }">{{ (row.publishedAt || '').slice(0, 16).replace('T', ' ') || '-' }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([])
const page = ref(1); const size = ref(20); const total = ref(0)
async function loadData() { loading.value = true; try { const res: any = await api.fetchAdminMarketItems({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该商品？', '提示'); await api.fetchDeleteMarketItem(row.id); loadData() }
onMounted(loadData)
</script>
