<template>
  <div class="p-2">
    <ElRow :gutter="16" class="mb-4">
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">在售商品</div><div class="text-2xl font-bold mt-2">{{ stats.onSale }}</div></ElCard></ElCol>
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">已下架</div><div class="text-2xl font-bold mt-2">{{ stats.offShelf }}</div></ElCard></ElCol>
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">总浏览量</div><div class="text-2xl font-bold mt-2">{{ stats.totalViews }}</div></ElCard></ElCol>
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">商品总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">分类数</div><div class="text-2xl font-bold mt-2">{{ stats.categoryCount }}</div></ElCard></ElCol>
      <ElCol :span="4"><ElCard shadow="never"><div class="text-gray-500 text-sm">今日新增</div><div class="text-2xl font-bold mt-2">{{ stats.today }}</div></ElCard></ElCol>
    </ElRow>
    <ElCard shadow="never" header="分类分布" class="mb-4">
      <div v-loading="catLoading">
        <div v-for="c in categoryStats" :key="c.id" class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm">{{ c.categoryName }}</span>
            <span class="text-sm text-gray-500">{{ c.count }} 件（在售 {{ c.onSale }}）</span>
          </div>
          <ElProgress :percentage="c.percentage" :color="c.onSale > 0 ? '#409eff' : '#909399'" :stroke-width="10" :show-text="false" />
        </div>
        <ElEmpty v-if="!catLoading && categoryStats.length === 0" description="暂无分类数据" />
      </div>
    </ElCard>
    <ElCard shadow="never" header="最近商品">
      <ArtTable :loading="loading" :data="recentItems" :columns="columns">
        <ElTableColumn prop="title" label="标题" min-width="160" show-overflow-tooltip />
        <ElTableColumn label="价格" width="100"><template #default="{ row }">¥{{ Number(row.price).toFixed(2) }}</template></ElTableColumn>
        <ElTableColumn label="分类" width="110"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
        <ElTableColumn label="发布人" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '在售' : '已下架' }}</ElTag></template></ElTableColumn>
        <ElTableColumn prop="viewCount" label="浏览量" width="90" />
        <ElTableColumn label="发布时间" width="150"><template #default="{ row }">{{ (row.publishedAt || '').slice(0, 16).replace('T', ' ') || '-' }}</template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as api from '@/api/community'
const loading = ref(false); const items = ref<any[]>([]); const total = ref(0); const columns = ref([])
const catLoading = ref(false); const categories = ref<any[]>([])
const stats = computed(() => {
  const onSale = items.value.filter(i => i.status === 'active').length
  const offShelf = items.value.filter(i => i.status !== 'active').length
  const totalViews = items.value.reduce((s, i) => s + (Number(i.viewCount) || 0), 0)
  const today = items.value.filter(i => (i.publishedAt || '').slice(0, 10) === new Date().toISOString().slice(0, 10)).length
  return { onSale, offShelf, totalViews, total: total.value, categoryCount: categories.value.length, today }
})
const recentItems = computed(() => items.value.slice(0, 10))
const categoryStats = computed(() => {
  const list = categories.value.map(c => {
    const group = items.value.filter(i => i.categoryId === c.id)
    return { id: c.id, categoryName: c.categoryName, count: group.length, onSale: group.filter(i => i.status === 'active').length }
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count)
  const max = list.reduce((m, c) => Math.max(m, c.count), 0) || 1
  return list.map(c => ({ ...c, percentage: Math.round((c.count / max) * 100) }))
})
async function loadItems() { loading.value = true; try { const res: any = await api.fetchAdminMarketItems({ page: 1, size: 100 }); items.value = res.list || []; total.value = res.total || 0 } finally { loading.value = false } }
async function loadCategories() { catLoading.value = true; try { categories.value = (await api.fetchAdminMarketCategories() ) as any[] } finally { catLoading.value = false } }
onMounted(() => { loadItems(); loadCategories() })
</script>
