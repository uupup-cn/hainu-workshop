<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">入学指南</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无指南内容</div>
    <div v-else class="grid">
      <div v-for="item in list" :key="item.id" class="card guide-card" @click="goDetail(item.entryKey)">
        <h3 class="card-title">{{ item.entryTitle }}</h3>
        <p class="summary">{{ brief(item) }}</p>
        <span class="link">查看详情 →</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { freshmanApi } from '../../api'

const router = useRouter()
const loading = ref(true)
const list = ref<any[]>([])

const brief = (item: any) => (item.summary || item.content || '').slice(0, 60)
const goDetail = (key: string) => router.push('/guide/' + key)

onMounted(async () => {
  try {
    const res = await freshmanApi.guideEntries()
    list.value = res.data || []
  } catch (e: any) {
    alert(e.message || '加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; }
.guide-card { cursor: pointer; transition: box-shadow 0.2s; }
.guide-card:hover { box-shadow: var(--shadow-float); }
.summary { margin: 0 0 8px; color: var(--neutral-500); font-size: 13px; line-height: 20px; }
.link { font-size: 13px; color: var(--primary-500); }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>
