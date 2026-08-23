<template>
  <div class="card">
    <div class="row">
      <label>难度</label>
      <select v-model.number="gridSize" class="select" @change="restart">
        <option v-for="n in 6" :key="n" :value="n + 4">{{ n + 4 }} × {{ n + 4 }}</option>
      </select>
      <span class="timer num">⏱ {{ (elapsed / 1000).toFixed(1) }}s</span>
      <span class="next num">下一个：{{ nextNum }}</span>
    </div>
    <p class="rule">按 1 → {{ gridSize * gridSize }} 的顺序依次点击，点错会闪红，计时从首次点击开始</p>

    <!-- 数字方格 -->
    <div v-if="!result" class="grid" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
      <button
        v-for="n in cells" :key="n"
        class="cell num"
        :class="{ done: clicked.includes(n), wrong: wrongCell === n, next: !finished && n === nextNum }"
        @click="clickCell(n)"
      >{{ n }}</button>
    </div>

    <!-- 结果 -->
    <div v-else class="result">
      <div class="rating">{{ result.rating }}</div>
      <div class="meta num">{{ result.grid }} × {{ result.grid }} · 用时 {{ result.seconds }} 秒</div>
      <div class="share-row">
        <button class="btn btn-sm btn-plain" :disabled="loading" @click="doShare">{{ shareUrl ? '重新生成分享链接' : '生成分享链接' }}</button>
        <a v-if="shareUrl" :href="shareUrl" target="_blank" rel="noopener" class="share-link">打开分享页</a>
      </div>
      <button class="btn again" :disabled="loading" @click="restart">🔄 再来一局</button>
    </div>
  </div>
  <div v-if="toast" class="toast">{{ toast }}</div>
</template>
<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'

const props = defineProps<{ tool: any }>()
const { loading, toast, showToast, guard, call, shareResult } = useTool(props.tool?.toolKey || 'schulte')

const gridSize = ref(5)
const cells = ref<number[]>([])
const clicked = ref<number[]>([])
const wrongCell = ref(0)
const finished = ref(false)
const elapsed = ref(0)
const result = ref<any>(null)
const shareUrl = ref('')
let startedAt = 0
let timer: ReturnType<typeof setInterval> | undefined
let wrongTimer: ReturnType<typeof setTimeout> | undefined

const total = computed(() => gridSize.value * gridSize.value)
const nextNum = computed(() => Math.min(clicked.value.length + 1, total.value))

function shuffle(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function restart() {
  stopTimers()
  clicked.value = []
  wrongCell.value = 0
  finished.value = false
  elapsed.value = 0
  startedAt = 0
  result.value = null
  shareUrl.value = ''
  cells.value = shuffle(total.value)
}

function stopTimers() {
  clearInterval(timer)
  timer = undefined
  clearTimeout(wrongTimer)
  wrongTimer = undefined
}

function clickCell(n: number) {
  if (finished.value || result.value) return
  if (startedAt === 0) {
    // 首次点击前校验登录（结果需登录后提交评测）
    if (!guard()) return
    startedAt = Date.now()
    timer = setInterval(() => { elapsed.value = Date.now() - startedAt }, 100)
  }
  if (n === clicked.value.length + 1) {
    clicked.value.push(n)
    if (clicked.value.length === total.value) finish()
  } else {
    // 点错闪红
    wrongCell.value = n
    clearTimeout(wrongTimer)
    wrongTimer = setTimeout(() => (wrongCell.value = 0), 400)
  }
}

async function finish() {
  finished.value = true
  stopTimers()
  const timeMs = Date.now() - startedAt
  elapsed.value = timeMs
  const data = await call(() => toolsApi.use(props.tool.toolKey, { grid: gridSize.value, timeMs }))
  if (data) result.value = data.result
}

async function doShare() {
  shareUrl.value = await shareResult(result.value)
  if (shareUrl.value) showToast('分享链接已生成')
}

onMounted(restart)
onUnmounted(stopTimers)
</script>
<style scoped>
.row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.row label { color: var(--neutral-600); font-size: 14px; }
.timer { font-size: 16px; font-weight: 600; color: var(--primary-500); }
.next { font-size: 13px; color: var(--neutral-500); }
.rule { margin: 8px 0 12px; font-size: 12px; color: var(--neutral-400); }
.grid { display: grid; gap: 6px; }
.cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-0); font-size: 16px; color: var(--neutral-800); cursor: pointer; user-select: none; transition: background 0.15s; }
.cell:hover { border-color: var(--primary-500); }
.cell.next { border-color: var(--primary-100); }
.cell.done { background: var(--success-bg); color: var(--success); border-color: transparent; }
.cell.wrong { background: var(--danger-bg); color: var(--danger); border-color: var(--danger); }
.result { text-align: center; padding: 12px 0; }
.rating { font-size: 34px; font-weight: 700; color: var(--primary-500); }
.meta { margin-top: 6px; font-size: 14px; color: var(--neutral-500); }
.share-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; }
.share-link { font-size: 13px; }
.again { margin-top: 14px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .cell { font-size: 14px; }
  .grid { gap: 4px; }
}
</style>
