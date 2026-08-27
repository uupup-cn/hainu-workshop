<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">校园出行</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <template v-else>
      <!-- 视图切换 -->
      <AppPillTabs :items="busTabs" label-key="label" value-key="value" :model-value="tab" @update:model-value="tab = String($event)" />

      <div v-if="tab === 'schedule'" class="card">
        <div v-if="schedules.length === 0" class="empty">暂无班车时刻</div>
        <div v-for="s in schedules" :key="s.id" class="list-item">
          <div>
            <div class="line">{{ s.lineName }} <span class="tag tag-mint">{{ s.departureTime }}</span></div>
            <div class="route">{{ s.departurePlace }} <LucideIcon name="arrow-right" :size="14" /> {{ s.destination }}</div>
            <div v-if="s.notes" class="notes">{{ s.notes }}</div>
          </div>
        </div>
      </div>

      <div v-if="tab === 'station'" class="card">
        <div v-if="stations.length === 0" class="empty">暂无车站信息</div>
        <div v-for="s in stations" :key="s.id" class="list-item">
          <div>
            <div class="line">{{ s.stationName }}</div>
            <div v-if="s.locationDesc" class="notes">{{ s.locationDesc }}</div>
            <div v-if="s.lines" class="route">途经：{{ s.lines }}</div>
          </div>
        </div>
      </div>

      <div v-if="tab === 'guide'" class="card">
        <div v-if="!guide" class="empty">指南整理中</div>
        <div v-else class="content">{{ guide.content }}</div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { wiseApi } from '../api'
import { LucideIcon } from '@/components/icons'
import { AppPillTabs } from '@/components/base'

const loading = ref(true)
const tab = ref('schedule')
const busTabs = [
  { label: '班车时刻', value: 'schedule' },
  { label: '车站信息', value: 'station' },
  { label: '乘车指南', value: 'guide' },
]
const schedules = ref<any[]>([])
const stations = ref<any[]>([])
const guide = ref<any>(null)

onMounted(async () => {
  try {
    const [a, b, c] = await Promise.all([wiseApi.busSchedules(), wiseApi.busStations(), wiseApi.busGuide()])
    schedules.value = a.data || []
    stations.value = b.data || []
    guide.value = c.data
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.line { font-size: 15px; font-weight: 500; color: var(--neutral-900); }
.route { font-size: 13px; color: var(--neutral-600); margin-top: 2px; display: inline-flex; align-items: center; gap: 4px; }
.notes { font-size: 12px; color: var(--neutral-500); margin-top: 2px; }
.content { white-space: pre-wrap; color: var(--neutral-700); }
</style>
