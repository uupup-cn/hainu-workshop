<template>
  <div class="container">
    <button class="btn btn-plain btn-sm back" @click="goBack">← 返回</button>
    <div class="page-header"><h2 class="page-title">{{ campus }} · 生活攻略</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="error" class="empty">{{ error }}</div>
    <div v-else-if="topics.length === 0" class="empty">该校区暂无攻略内容</div>
    <div v-else class="grid">
      <div v-for="t in topics" :key="t.id" class="card topic-card" @click="goDetail(t.topicKey)">
        <div class="topic-icon">{{ icon(t.topicKey) }}</div>
        <div class="topic-name">{{ t.topicTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { freshmanApi } from '../../api'

const ICONS: Record<string, string> = {
  canteen: '🍚', express: '📦', market: '🛒', hospital: '🏥', sport: '⚽', print: '🖨', traffic: '🚌',
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const topics = ref<any[]>([])

const campus = ref(decode(String(route.params.campus)))
const icon = (key: string) => ICONS[key] || '📋'
const goBack = () => router.back()
const goDetail = (key: string) => router.push('/life-detail/' + key)

function decode(s: string) { try { return decodeURIComponent(s) } catch { return s } }

onMounted(async () => {
  try {
    const res = await freshmanApi.lifeTopics(campus.value)
    topics.value = res.data || []
  } catch (e: any) {
    error.value = e.message || '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.back { margin-bottom: 12px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.topic-card { cursor: pointer; text-align: center; padding: 24px 12px; transition: box-shadow 0.2s; }
.topic-card:hover { box-shadow: var(--shadow-float); }
.topic-icon { font-size: 36px; line-height: 1; }
.topic-name { margin-top: 10px; font-size: 14px; font-weight: 500; color: var(--neutral-900); }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .topic-card { padding: 18px 8px; }
}
</style>
