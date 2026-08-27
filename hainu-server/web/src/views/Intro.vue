<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">海大介绍</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无内容</div>
    <template v-else>
      <!-- 条目切换 -->
      <AppPillTabs :items="list" label-key="entryTitle" value-key="id" :model-value="active?.id" wrap @update:model-value="(v) => (active = list.find((i) => i.id === v))" />
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
import { AppPillTabs } from '@/components/base'

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
.content { white-space: pre-wrap; color: var(--neutral-700); }
.images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
.images img { width: 100%; border-radius: var(--radius-md); aspect-ratio: 4/3; object-fit: cover; }
@media (max-width: 768px) { .images { grid-template-columns: repeat(2, 1fr); } }
</style>
