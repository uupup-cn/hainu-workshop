<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">海大介绍</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无内容</div>
    <template v-else>
      <!-- 条目切换 -->
      <div class="tabs">
        <button v-for="item in list" :key="item.id" class="tab" :class="{ active: active?.id === item.id }" @click="active = item">{{ item.entryTitle }}</button>
      </div>
      <div class="card">
        <h3 class="card-title">{{ active?.entryTitle }}</h3>
        <div class="content">{{ active?.content }}</div>
        <div v-if="images.length" class="images"><img v-for="(img, i) in images" :key="i" :src="img" alt="校园风光" /></div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wiseApi } from '../api'

const loading = ref(true)
const list = ref<any[]>([])
const active = ref<any>(null)
const images = computed(() => (Array.isArray(active.value?.images) ? active.value.images : []))

onMounted(async () => {
  try {
    const res = await wiseApi.introEntries()
    list.value = res.data || []
    active.value = list.value[0] || null
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.tab { padding: 6px 16px; border: 1px solid var(--neutral-200); background: var(--neutral-0); border-radius: var(--radius-full); color: var(--neutral-600); font-size: 14px; cursor: pointer; }
.tab.active { background: var(--primary-500); border-color: var(--primary-500); color: #fff; }
.content { white-space: pre-wrap; color: var(--neutral-700); }
.images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
.images img { width: 100%; border-radius: var(--radius-md); aspect-ratio: 4/3; object-fit: cover; }
@media (max-width: 768px) { .images { grid-template-columns: repeat(2, 1fr); } }
</style>
