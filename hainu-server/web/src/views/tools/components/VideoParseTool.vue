<template>
  <div class="card">
    <div class="row">
      <input v-model="videoUrl" class="input url" placeholder="粘贴视频播放页链接（支持各大平台）" @keyup.enter="parse" />
      <select v-model="lineId" class="select">
        <option v-if="lines.length === 0" :value="0">暂无可用线路</option>
        <option v-for="l in lines" :key="l.id" :value="l.id">{{ l.lineName }}</option>
      </select>
      <button class="btn" :disabled="loading || !lineId" @click="parse">
        <template v-if="loading">解析中…</template>
        <template v-else><LucideIcon name="tool-play" :size="18" /> 解析</template>
      </button>
    </div>
    <p v-if="error" class="error"><LucideIcon name="warning" :size="16" /> {{ error }}</p>

    <div v-if="parseUrl" class="result">
      <div class="line-tip">解析线路：{{ lineName }} · 如播放异常请更换线路重试</div>
      <a class="btn open-btn" :href="parseUrl" target="_blank" rel="noopener"><LucideIcon name="arrow-right" :size="16" /> 打开播放页（新窗口）</a>
      <iframe :src="parseUrl" class="player" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" referrerpolicy="no-referrer" allowfullscreen></iframe>
      <div class="iframe-tip">部分平台禁止嵌入播放，打不开时请点击上方「打开播放页」</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'
import { LucideIcon } from '@/components/icons'

const props = defineProps<{ tool: any }>()
const { loading, guard, call } = useTool(props.tool?.toolKey || 'video-parse')

const videoUrl = ref('')
const lineId = ref(0)
const lines = ref<any[]>([])
const parseUrl = ref('')
const lineName = ref('')
const error = ref('')

onMounted(async () => {
  const data = await call(() => toolsApi.videoLines())
  if (data) {
    lines.value = Array.isArray(data) ? data : data?.list || []
    if (lines.value.length) lineId.value = lines.value[0].id
  }
})

async function parse() {
  if (!guard()) return
  if (!videoUrl.value.trim()) { error.value = '请输入视频链接'; return }
  if (!lineId.value) { error.value = '请选择解析线路'; return }
  error.value = ''
  const data = await call(() => toolsApi.videoParse(videoUrl.value.trim(), Number(lineId.value)))
  if (data) {
    parseUrl.value = data.parseUrl || ''
    lineName.value = data.lineName || ''
  }
}
</script>
<style scoped>
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.url { flex: 1; min-width: 220px; }
.result { margin-top: 16px; }
.line-tip { font-size: 12px; color: var(--neutral-500); margin-bottom: 10px; }
.open-btn { text-decoration: none; }
.player { width: 100%; height: 420px; margin-top: 12px; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-900); }
.iframe-tip { margin-top: 8px; font-size: 12px; color: var(--neutral-400); }
.error { margin: 10px 0 0; color: var(--danger); font-size: 13px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .player { height: 240px; }
  .url { min-width: 100%; }
}
</style>
