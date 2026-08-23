<template>
  <div class="launch">
    <div class="launch-inner">
      <h1 class="title">海大工坊</h1>
      <p class="sub">{{ holidayText }} · 开学倒计时</p>
      <div class="countdown num">
        <div class="cd-item"><span class="cd-num">{{ days }}</span><span class="cd-label">天</span></div>
        <div class="cd-item"><span class="cd-num">{{ hours }}</span><span class="cd-label">时</span></div>
        <div class="cd-item"><span class="cd-num">{{ minutes }}</span><span class="cd-label">分</span></div>
        <div class="cd-item"><span class="cd-num">{{ seconds }}</span><span class="cd-label">秒</span></div>
      </div>
      <p v-if="targetDate" class="date num">开学日期：{{ targetDate }}</p>
      <p v-else class="date">开学日期待配置，敬请期待</p>
      <button class="btn enter" @click="enter">进入海大工坊</button>
      <p class="tip">假期模式运行中，功能将持续更新</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { systemApi } from '../api'

const router = useRouter()
const target = ref<string>('')
const now = ref(Date.now())
let timer: any = null

const holidayText = computed(() => (target.value ? '' : ''))
const targetDate = computed(() => target.value || '')
const remain = computed(() => Math.max(0, new Date(target.value + 'T00:00:00').getTime() - now.value))
const days = computed(() => String(Math.floor(remain.value / 86400000)).padStart(2, '0'))
const hours = computed(() => String(Math.floor(remain.value / 3600000) % 24).padStart(2, '0'))
const minutes = computed(() => String(Math.floor(remain.value / 60000) % 60).padStart(2, '0'))
const seconds = computed(() => String(Math.floor(remain.value / 1000) % 60).padStart(2, '0'))

function enter() { sessionStorage.setItem('launch_passed', '1'); router.push('/home') }

onMounted(async () => {
  try {
    const res = await systemApi.settings()
    target.value = res.data?.semester_start || ''
  } catch { /* 忽略 */ }
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
<style scoped>
.launch { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, var(--primary-700), var(--primary-900)); color: #fff; padding: 24px; }
.launch-inner { text-align: center; }
.title { margin: 0 0 6px; font-size: 34px; font-weight: 600; }
.sub { margin: 0 0 28px; font-size: 14px; opacity: 0.85; }
.countdown { display: flex; gap: 14px; justify-content: center; }
.cd-item { display: flex; flex-direction: column; align-items: center; background: rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); padding: 14px 16px; min-width: 68px; }
.cd-num { font-size: 30px; font-weight: 600; font-variant-numeric: tabular-nums; }
.cd-label { font-size: 12px; opacity: 0.75; margin-top: 2px; }
.date { margin: 20px 0 24px; font-size: 13px; opacity: 0.85; }
.enter { background: #fff; color: var(--primary-700); font-size: 16px; padding: 12px 44px; }
.enter:hover { background: var(--primary-50); }
.tip { margin-top: 18px; font-size: 12px; opacity: 0.6; }
</style>
