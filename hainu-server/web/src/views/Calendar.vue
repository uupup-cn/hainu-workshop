<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">校历</h2><span v-if="setting" class="tag tag-mint">{{ modeText }}</span></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="!setting" class="empty">暂无校历数据</div>
    <div v-else class="card calendar-card">
      <!-- 图片模式 -->
      <img v-if="setting.viewMode === 'image' && setting.imageUrl" :src="setting.imageUrl" alt="校历" class="calendar-img" />
      <!-- 日历模式 -->
      <div v-else-if="events.length" class="events">
        <div v-for="(ev, i) in events" :key="i" class="list-item">
          <span class="ev-date num">{{ ev.date }}</span>
          <span class="ev-name">{{ ev.name }}</span>
          <span v-if="ev.tag" class="tag">{{ ev.tag }}</span>
        </div>
      </div>
      <div v-else class="empty">日历数据整理中</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wiseApi } from '../api'

const loading = ref(true)
const setting = ref<any>(null)
const events = computed(() => {
  const d = setting.value?.calendarData
  if (Array.isArray(d)) return d
  if (d && Array.isArray(d.events)) return d.events
  return []
})
const modeText = computed(() => (setting.value?.viewMode === 'calendar' ? '日历视图' : '图片模式'))

onMounted(async () => {
  try { const res = await wiseApi.calendar(); setting.value = res.data } finally { loading.value = false }
})
</script>
<style scoped>
.calendar-card { text-align: center; }
.calendar-img { max-width: 100%; border-radius: var(--radius-md); }
.events { text-align: left; }
.ev-date { color: var(--primary-500); width: 110px; }
.ev-name { flex: 1; color: var(--neutral-800); }
</style>
