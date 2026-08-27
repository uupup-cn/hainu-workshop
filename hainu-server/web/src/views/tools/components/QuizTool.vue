<template>
  <!-- 答题卡 -->
  <div v-if="!result" class="card">
    <div class="quiz-head">
      <h3 class="quiz-title">{{ title }}</h3>
      <span class="tag">示例题库 · 正式题库接入后自动替换</span>
    </div>
    <div class="progress num">第 {{ idx + 1 }} / {{ questions.length }} 题</div>
    <div class="bar"><div class="bar-fill" :style="{ width: progressPct + '%' }"></div></div>

    <div class="q-text">{{ questions[idx].text }}</div>
    <div class="opts">
      <label v-for="o in OPTS" :key="o.value" class="opt" :class="{ active: answers[idx] === o.value }">
        <input v-model="answers[idx]" type="radio" :value="o.value" name="quiz-opt" />
        <span>{{ o.label }}</span>
      </label>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <div class="ops">
      <button class="btn btn-plain btn-sm" :disabled="idx === 0" @click="prev">上一题</button>
      <button v-if="idx < questions.length - 1" class="btn btn-sm" @click="next">下一题</button>
      <button v-else class="btn btn-sm" :disabled="loading" @click="submit">{{ loading ? '评测中…' : '提交评测' }}</button>
    </div>
  </div>

  <!-- 结果卡 -->
  <div v-else class="card">
    <!-- MBTI / SBTI：16 型 -->
    <template v-if="variant === 'mbti'">
      <div class="type-big">{{ result.type }}</div>
      <div class="type-name">{{ result.typeName }}</div>
      <div v-for="d in result.dimensions" :key="d.name" class="dim">
        <div class="dim-label num">{{ d.first }} {{ d.firstPct }}%<span class="dim-vs">{{ d.name }}</span>{{ d.second }} {{ d.secondPct }}%</div>
        <div class="bar"><div class="bar-fill" :style="{ width: d.firstPct + '%' }"></div></div>
      </div>
    </template>

    <!-- 黑暗三角：三维度分数 + 等级 -->
    <template v-else-if="variant === 'levels'">
      <div class="overall">综合倾向 <b class="num">{{ result.overall.score }}</b> 分 · {{ result.overall.level }}</div>
      <div v-for="d in result.dimensions" :key="d.key" class="dim">
        <div class="dim-label">{{ d.name }}<span class="tag tag-orange">{{ d.level }}</span><span class="dim-score num">{{ d.score }} / 100</span></div>
        <div class="bar"><div class="bar-fill" :style="{ width: d.score + '%' }"></div></div>
      </div>
    </template>

    <!-- 七宗罪：主导罪 / 美德 + 七维条形 -->
    <template v-else>
      <div class="dominant">主导倾向：{{ result.dominant.sin }} ⇄ {{ result.dominant.virtue }}</div>
      <p class="summary">{{ result.summary }}</p>
      <div v-for="d in result.dimensions" :key="d.key" class="dim">
        <div class="dim-label">{{ d.sin }}<span class="dim-vs">{{ d.virtue }}</span><span class="dim-score num">{{ d.score }}</span></div>
        <div class="bar"><div class="bar-fill" :style="{ width: d.score + '%' }"></div></div>
      </div>
    </template>

    <div class="share-row">
      <button class="btn btn-sm btn-plain" :disabled="loading" @click="doShare">{{ shareUrl ? '重新生成分享链接' : '生成分享链接' }}</button>
      <a v-if="shareUrl" :href="shareUrl" target="_blank" rel="noopener" class="share-link">打开分享页</a>
      <span class="flex"></span>
      <button class="btn btn-sm" :disabled="loading" @click="restart">再测一次</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'
import type { QuizQuestion } from '../quiz-config'

const props = defineProps<{
  tool: any
  title: string
  variant: 'mbti' | 'levels' | 'sins'
  questions: QuizQuestion[]
  mapScores: (answers: number[]) => Record<string, number>
}>()

const { loading, showToast, guard, call, shareResult } = useTool(props.tool?.toolKey)

/** 5 档同意度：-2 ~ +2 */
const OPTS = [
  { value: -2, label: '非常不同意' },
  { value: -1, label: '不同意' },
  { value: 0, label: '中立' },
  { value: 1, label: '同意' },
  { value: 2, label: '非常同意' },
]

const idx = ref(0)
const answers = ref<Array<number | null>>(props.questions.map(() => null))
const error = ref('')
const result = ref<any>(null)
const shareUrl = ref('')

const progressPct = computed(() => {
  const done = answers.value.filter((a) => a !== null).length
  return Math.round((done / props.questions.length) * 100)
})

function prev() {
  if (idx.value > 0) { idx.value--; error.value = '' }
}

function next() {
  if (answers.value[idx.value] === null) { error.value = '请先选择一个同意度'; return }
  error.value = ''
  if (idx.value < props.questions.length - 1) idx.value++
}

async function submit() {
  const firstEmpty = answers.value.findIndex((a) => a === null)
  if (firstEmpty >= 0) { idx.value = firstEmpty; error.value = `第 ${firstEmpty + 1} 题还未作答`; return }
  if (!guard()) return
  error.value = ''
  const scores = props.mapScores(answers.value as number[])
  const data = await call(() => toolsApi.use(props.tool.toolKey, { scores }))
  if (data) result.value = data.result
}

async function doShare() {
  shareUrl.value = await shareResult(result.value)
  if (shareUrl.value) showToast('分享链接已生成')
}

function restart() {
  result.value = null
  shareUrl.value = ''
  answers.value = props.questions.map(() => null)
  idx.value = 0
  error.value = ''
}
</script>
<style scoped>
.quiz-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.quiz-title { margin: 0; font-size: 17px; font-weight: 600; color: var(--neutral-900); }
.progress { font-size: 13px; color: var(--neutral-500); margin-bottom: 6px; }
.bar { height: 6px; border-radius: var(--radius-full); background: var(--neutral-100); overflow: hidden; }
.bar-fill { height: 100%; background: var(--primary-500); border-radius: var(--radius-full); transition: width 0.3s; }
.q-text { margin: 18px 0 14px; font-size: 16px; font-weight: 500; color: var(--neutral-900); }
.opts { display: flex; flex-direction: column; gap: 8px; }
.opt { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); cursor: pointer; font-size: 14px; color: var(--neutral-700); }
.opt:hover { border-color: var(--primary-500); }
.opt.active { border-color: var(--primary-500); background: var(--primary-50); color: var(--primary-700); }
.opt input { accent-color: var(--primary-500); }
.error { margin: 10px 0 0; font-size: 12px; color: var(--danger); }
.ops { display: flex; justify-content: space-between; gap: 8px; margin-top: 16px; }

/* 结果卡 */
.type-big { font-size: 44px; font-weight: 800; letter-spacing: 6px; text-align: center; color: var(--primary-500); }
.type-name { font-size: 18px; text-align: center; color: var(--neutral-700); margin: 4px 0 18px; }
.overall { font-size: 15px; color: var(--neutral-700); margin-bottom: 14px; text-align: center; }
.overall b { color: var(--primary-500); font-size: 20px; }
.dominant { font-size: 20px; font-weight: 600; text-align: center; color: var(--neutral-900); }
.summary { font-size: 13px; color: var(--neutral-500); text-align: center; margin: 8px 0 16px; }
.dim { margin-bottom: 12px; }
.dim-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--neutral-700); margin-bottom: 4px; }
.dim-vs { color: var(--neutral-400); font-size: 12px; }
.dim-score { margin-left: auto; color: var(--neutral-500); font-size: 12px; }
.dim .bar { height: 8px; }
.share-row { display: flex; align-items: center; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
.share-row .flex { flex: 1; }
.share-link { font-size: 13px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .type-big { font-size: 36px; }
}
</style>
