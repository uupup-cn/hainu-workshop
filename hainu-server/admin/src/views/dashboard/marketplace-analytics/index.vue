<template>
  <div class="p-2">
    <ElRow :gutter="16" class="mb-4">
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">在售商品</div><div class="text-2xl font-bold mt-2">{{ stats.onSale }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">已下架</div><div class="text-2xl font-bold mt-2">{{ stats.offShelf }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">总浏览量</div><div class="text-2xl font-bold mt-2">{{ stats.totalViews }}</div></ElCard></ElCol>
      <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">商品总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never" header="最近商品" class="mb-4">
      <ArtTable :loading="loading" :data="recentItems" :columns="columns">
        <ElTableColumn prop="title" label="标题" min-width="160" />
        <ElTableColumn prop="price" label="价格" width="100" />
        <ElTableColumn label="分类" width="110"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
        <ElTableColumn label="发布人" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '在售' : '已下架' }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="viewCount" label="浏览量" width="90" />
        <ElTableColumn label="发布时间" width="110"><template #default="{ row }">{{ (row.publishedAt || '').slice(0, 10) }}</template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElCard shadow="never" header="分类分布（最近 100 件商品）">
      <ArtTable :loading="catLoading" :data="categoryStats" :columns="catColumns">
        <ElTableColumn prop="categoryName" label="分类名称" width="200" />
        <ElTableColumn prop="count" label="商品数量" width="120" />
        <ElTableColumn prop="onSale" label="在售数量" width="120" />
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as api from '@/api/community'
const loading = ref(false); const items = ref<any[]>([]); const total = ref(0); const columns = ref([])
const catLoading = ref(false); const categories = ref<any[]>([]); const catColumns = ref([])
const stats = computed(() => {
  const onSale = items.value.filter(i => i.status === 'active').length
  const offShelf = items.value.filter(i => i.status !== 'active').length
  const totalViews = items.value.reduce((s, i) => s + (Number(i.viewCount) || 0), 0)
  return { onSale, offShelf, totalViews, total: total.value }
})
const recentItems = computed(() => items.value.slice(0, 10))
const categoryStats = computed(() => categories.value.map(c => {
  const list = items.value.filter(i => i.categoryId === c.id)
  return { categoryName: c.categoryName, count: list.length, onSale: list.filter(i => i.status === 'active').length }
}))
async function loadItems() { loading.value = true; try { const res: any = await api.fetchMarketItems({ page: 1, size: 100 }); items.value = res.list || []; total.value = res.total || 0 } finally { loading.value = false } }
async function loadCategories() { catLoading.value = true; try { categories.value = (await api.fetchAdminMarketCategories() ) as any[] } finally { catLoading.value = false } }
onMounted(() => { loadItems(); loadCategories() })
</script>
