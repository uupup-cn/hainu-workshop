<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">生活攻略</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无校区数据</div>
    <div v-else class="grid">
      <div v-for="c in list" :key="c.id" class="card campus-card" @click="goTopics(c.campusName)">
        <div class="campus-icon"><LucideIcon name="campus" :size="40" /></div>
        <div class="campus-name">{{ c.campusName }}</div>
        <div class="campus-tip">查看生活攻略 <LucideIcon name="arrow-right" :size="14" /></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { freshmanApi } from '../../api'
import { LucideIcon } from '@/components/icons'

const router = useRouter()
const loading = ref(true)
const list = ref<any[]>([])

const goTopics = (campusName: string) => router.push('/life/' + encodeURIComponent(campusName))

onMounted(async () => {
  try {
    const res = await freshmanApi.lifeCampuses()
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
.campus-card { cursor: pointer; text-align: center; padding: 32px 20px; transition: box-shadow 0.2s; }
.campus-card:hover { box-shadow: var(--shadow-float); }
.campus-icon { color: var(--ocean-500); line-height: 1; }
.campus-name { margin-top: 12px; font-size: 18px; font-weight: 600; color: var(--neutral-900); }
.campus-tip { margin-top: 8px; font-size: 13px; color: var(--primary-500); display: inline-flex; align-items: center; gap: 2px; }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>
