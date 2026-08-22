<template>
  <div class="container narrow">
    <div class="page-header"><h2 class="page-title">校友圈</h2></div>

    <!-- 帖子 / 表白墙切换 -->
    <div class="tabs">
      <button class="tab" :class="{ active: type === 'post' }" @click="switchType('post')">帖子</button>
      <button class="tab" :class="{ active: type === 'confession' }" @click="switchType('confession')">表白墙</button>
      <select v-if="type === 'post'" v-model="sectionId" class="select" @change="load(1)">
        <option :value="undefined">全部版块</option>
        <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.sectionName }}</option>
      </select>
    </div>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无内容</div>
    <template v-else>
      <div v-for="p in list" :key="p.id" class="card post-card">
        <div class="post-head">
          <span class="avatar">{{ p.isAnonymous ? '匿' : '友' }}</span>
          <div>
            <div class="author">{{ p.isAnonymous ? '匿名同学' : 'UID ' + (p.userId || '') }}</div>
            <div class="time num">{{ formatTime(p.createdAt) }}</div>
          </div>
          <span v-if="p.isPinned" class="tag tag-orange">置顶</span>
        </div>
        <div v-if="p.title" class="post-title">{{ p.title }}</div>
        <div class="post-content">{{ p.content }}</div>
        <div class="post-footer num">❤️ {{ p.likeCount || 0 }} · 💬 {{ p.commentCount || 0 }}</div>
      </div>
      <div class="pager" v-if="hasMore">
        <button class="btn btn-sm btn-plain" @click="load(page + 1)">加载更多</button>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityApi } from '../api'

const loading = ref(true)
const type = ref('post')
const sections = ref<any[]>([])
const sectionId = ref<number | undefined>(undefined)
const list = ref<any[]>([])
const page = ref(1)
const hasMore = ref(false)

function formatTime(t?: string) { return t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '' }

function switchType(t: string) { type.value = t; load(1) }

async function load(p = 1) {
  loading.value = true
  try {
    const res = await communityApi.alumniPosts({ type: type.value, section_id: sectionId.value, page: p, size: 20 })
    const d = res.data || {}
    list.value = p === 1 ? d.list || [] : list.value.concat(d.list || [])
    page.value = p
    hasMore.value = !!d.hasMore
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await load(1)
  try { const res = await communityApi.alumniSections(); sections.value = res.data || [] } catch { /* 需登录 */ }
})
</script>
<style scoped>
.narrow { max-width: 720px; }
.tabs { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.tab { padding: 6px 16px; border: 1px solid var(--neutral-200); background: var(--neutral-0); border-radius: var(--radius-full); color: var(--neutral-600); font-size: 14px; cursor: pointer; }
.tab.active { background: var(--primary-500); border-color: var(--primary-500); color: #fff; }
.post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--primary-50); color: var(--primary-500); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
.author { font-size: 14px; font-weight: 500; color: var(--neutral-800); }
.time { font-size: 12px; color: var(--neutral-500); }
.post-title { font-size: 16px; font-weight: 600; color: var(--neutral-900); margin-bottom: 4px; }
.post-content { color: var(--neutral-700); white-space: pre-wrap; }
.post-footer { margin-top: 10px; font-size: 12px; color: var(--neutral-500); }
</style>
