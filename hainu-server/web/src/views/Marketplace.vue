<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">二手集市</h2></div>

    <!-- 搜索与分类 -->
    <div class="toolbar">
      <select v-model="categoryId" class="select" @change="load(1)">
        <option :value="undefined">全部分类</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.categoryName }}</option>
      </select>
      <input v-model="keyword" class="input search" placeholder="搜索商品关键词" @keyup.enter="load(1)" />
      <button class="btn btn-sm" @click="load(1)">搜索</button>
    </div>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="items.length === 0" class="empty">暂无在售商品</div>
    <div v-else class="goods">
      <div v-for="it in items" :key="it.id" class="card goods-card">
        <div class="goods-imgs">
          <img v-if="cover(it)" :src="cover(it)" alt="" />
          <span v-else class="placeholder">📦</span>
        </div>
        <div class="goods-body">
          <div class="goods-title">{{ it.title }}</div>
          <div class="goods-meta">
            <span class="tag">{{ it.category?.categoryName || '未分类' }}</span>
            <span class="goods-views num">{{ it.viewCount || 0 }} 浏览</span>
          </div>
          <div class="goods-footer">
            <span class="price num">￥{{ it.price }}</span>
            <span class="contact">{{ it.contact }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pager" v-if="hasMore">
      <button class="btn btn-sm btn-plain" @click="load(page + 1)">加载更多</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityApi } from '../api'

const loading = ref(true)
const categories = ref<any[]>([])
const items = ref<any[]>([])
const categoryId = ref<number | undefined>(undefined)
const keyword = ref('')
const page = ref(1)
const hasMore = ref(false)

function cover(it: any): string {
  const imgs = Array.isArray(it.images) ? it.images : []
  return imgs[0] || ''
}

async function load(p = 1) {
  loading.value = true
  try {
    const res = await communityApi.marketplaceItems({ category: categoryId.value, keyword: keyword.value || undefined, page: p, size: 20 })
    const d = res.data || {}
    items.value = p === 1 ? d.list || [] : items.value.concat(d.list || [])
    page.value = p
    hasMore.value = !!d.hasMore
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try { const res = await communityApi.marketplaceCategories(); categories.value = res.data || [] } catch { /* 游客也可浏览分类 */ }
  await load(1)
})
</script>
<style scoped>
.toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
.search { flex: 1; }
.goods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.goods-card { display: flex; gap: 12px; padding: 14px; margin-bottom: 0; }
.goods-imgs img, .placeholder { width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover; }
.placeholder { display: flex; align-items: center; justify-content: center; background: var(--neutral-50); font-size: 28px; }
.goods-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.goods-title { font-size: 15px; font-weight: 600; color: var(--neutral-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goods-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.goods-views { font-size: 12px; color: var(--neutral-500); }
.goods-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.price { font-size: 18px; font-weight: 600; color: var(--danger); }
.contact { font-size: 12px; color: var(--neutral-500); }
@media (max-width: 768px) { .goods { grid-template-columns: 1fr; } }
</style>
