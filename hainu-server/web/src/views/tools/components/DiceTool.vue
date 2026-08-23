<template>
  <div class="card">
    <div class="row">
      <label>骰子数</label>
      <select v-model="count" class="select">
        <option v-for="n in 10" :key="n" :value="n">{{ n }} 个</option>
      </select>
      <button class="btn" :disabled="loading" @click="roll">{{ loading ? '投掷中…' : '🎲 掷一下' }}</button>
    </div>

    <div v-if="result" class="result">
      <div class="dice-list">
        <div v-for="(v, i) in result.rolls" :key="i" class="die num"><span class="die-face">🎲</span>{{ v }}</div>
      </div>
      <div class="total num">总和：<b>{{ result.total }}</b></div>
      <div class="share-row">
        <button class="btn btn-sm btn-plain" :disabled="loading" @click="doShare">{{ shareUrl ? '重新生成分享链接' : '生成分享链接' }}</button>
        <a v-if="shareUrl" :href="shareUrl" target="_blank" rel="noopener" class="share-link">打开分享页</a>
      </div>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-if="toast" class="toast">{{ toast }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'

const props = defineProps<{ tool: any }>()
const { loading, toast, showToast, guard, call, shareResult } = useTool(props.tool?.toolKey || 'dice')

const count = ref(1)
const result = ref<any>(null)
const shareUrl = ref('')
const error = ref('')

async function roll() {
  if (!guard()) return
  error.value = ''
  const data = await call(() => toolsApi.use(props.tool.toolKey, { count: Number(count.value) }))
  if (data) result.value = data.result
}

async function doShare() {
  shareUrl.value = await shareResult(result.value)
  if (shareUrl.value) showToast('分享链接已生成')
}
</script>
<style scoped>
.row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.row label { color: var(--neutral-600); font-size: 14px; }
.result { margin-top: 16px; }
.dice-list { display: flex; flex-wrap: wrap; gap: 10px; }
.die { display: flex; flex-direction: column; align-items: center; font-size: 16px; font-weight: 600; color: var(--neutral-800); }
.die-face { font-size: 36px; line-height: 44px; }
.total { margin-top: 12px; font-size: 16px; color: var(--neutral-700); }
.total b { font-size: 22px; color: var(--primary-500); }
.share-row { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.share-link { font-size: 13px; }
.error { margin: 10px 0 0; color: var(--danger); font-size: 13px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .die-face { font-size: 30px; line-height: 38px; }
}
</style>
