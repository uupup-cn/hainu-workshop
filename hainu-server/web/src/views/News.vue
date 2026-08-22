<template>
  <div class="container narrow">
    <div class="page-header"><h2 class="page-title">校园快讯</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无快讯</div>
    <template v-else>
      <div v-for="n in list" :key="n.id" class="card news-card" @click="openDetail(n)">
        <div class="news-head">
          <span v-if="n.isPinned" class="tag tag-orange">置顶</span>
          <span class="news-title">{{ n.title }}</span>
        </div>
        <div class="news-meta num">{{ formatTime(n.publishedAt || n.createdAt) }}</div>
      </div>
      <div class="pager" v-if="hasMore">
        <button class="btn btn-sm btn-plain" @click="load(page + 1)">加载更多</button>
      </div>
    </template>

    <!-- 详情弹层 -->
    <div v-if="detail" class="detail-mask" @click.self="detail = null">
      <div class="detail card">
        <h3 class="card-title">{{ detail.title }}</h3>
        <p class="detail-time num">{{ formatTime(detail.publishedAt || detail.createdAt) }}</p>
        <div class="detail-content">{{ detail.content }}</div>
        <button class="btn btn-sm btn-plain" @click="detail = null">关闭</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityApi } from '../api'

const loading = ref(true)
const list = ref<any[]>([])
const page = ref(1)
const hasMore = ref(false)
const detail = ref<any>(null)

function formatTime(t?: string) { return t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '' }

async function openDetail(n: any) {
  try { const res = await communityApi.newsDetail(n.id); detail.value = res.data } catch { detail.value = n }
}

async function load(p = 1) {
  loading.value = true
  try {
    const res = await communityApi.newsList({ page: p, size: 20 })
    const d = res.data || {}
    list.value = p === 1 ? d.list || [] : list.value.concat(d.list || [])
    page.value = p
    hasMore.value = !!d.hasMore
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
<style scoped>
.narrow { max-width: 720px; }
.news-card { cursor: pointer; }
.news-head { display: flex; align-items: center; gap: 8px; }
.news-title { font-size: 15px; font-weight: 600; color: var(--neutral-900); }
.news-meta { margin-top: 4px; font-size: 12px; color: var(--neutral-500); }
.detail-mask { position: fixed; inset: 0; z-index: 40; background: rgba(17, 24, 39, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.detail { width: 560px; max-width: 100%; max-height: 80vh; overflow-y: auto; margin: 0; }
.detail-time { margin: 0 0 12px; font-size: 12px; color: var(--neutral-500); }
.detail-content { white-space: pre-wrap; color: var(--neutral-700); margin-bottom: 16px; }
</style>
