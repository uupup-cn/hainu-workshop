<template>
  <div class="card">
    <input v-model="expression" class="input expr num" placeholder="如：sin(pi/2)+2^10" @keyup.enter="calc" />
    <!-- 常用输入按钮 -->
    <div class="keys">
      <button v-for="k in keys" :key="k.insert" class="key num" @click="insert(k)">{{ k.label }}</button>
    </div>
    <button class="btn calc-btn" :disabled="loading" @click="calc">{{ loading ? '计算中…' : '计算' }}</button>

    <div v-if="result" class="result">
      <div class="expr-line num">{{ result.expression }} =</div>
      <div class="value num">{{ result.value }}</div>
      <div class="share-row">
        <button class="btn btn-sm btn-plain" :disabled="loading" @click="doShare">{{ shareUrl ? '重新生成分享链接' : '生成分享链接' }}</button>
        <a v-if="shareUrl" :href="shareUrl" target="_blank" rel="noopener" class="share-link">打开分享页</a>
      </div>
    </div>
    <p v-if="error" class="error"><LucideIcon name="warning" :size="16" /> {{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'
import { LucideIcon } from '@/components/icons'

const props = defineProps<{ tool: any }>()
const { loading, showToast, guard, shareResult } = useTool(props.tool?.toolKey || 'calculator')

const expression = ref('')
const result = ref<any>(null)
const error = ref('')
const shareUrl = ref('')

/** label 为按钮显示，insert 为实际插入文本 */
const keys = [
  { label: '7', insert: '7' }, { label: '8', insert: '8' }, { label: '9', insert: '9' }, { label: '÷', insert: '/' }, { label: '(', insert: '(' },
  { label: '4', insert: '4' }, { label: '5', insert: '5' }, { label: '6', insert: '6' }, { label: '×', insert: '*' }, { label: ')', insert: ')' },
  { label: '1', insert: '1' }, { label: '2', insert: '2' }, { label: '3', insert: '3' }, { label: '-', insert: '-' }, { label: '^', insert: '^' },
  { label: '0', insert: '0' }, { label: '.', insert: '.' }, { label: '%', insert: '%' }, { label: '+', insert: '+' }, { label: 'Del', insert: '' },
  { label: 'sin(', insert: 'sin(' }, { label: 'cos(', insert: 'cos(' }, { label: 'tan(', insert: 'tan(' }, { label: 'sqrt(', insert: 'sqrt(' }, { label: 'log(', insert: 'log(' },
  { label: 'pi', insert: 'pi' }, { label: 'e', insert: 'e' }, { label: 'abs(', insert: 'abs(' }, { label: 'exp(', insert: 'exp(' }, { label: '清空', insert: '' , clear: true },
]

function insert(k: { insert: string; clear?: boolean }) {
  if (k.clear) { expression.value = ''; return }
  if (k.insert === '') { expression.value = expression.value.slice(0, -1); return }
  expression.value += k.insert
}

async function calc() {
  if (!guard()) return
  if (!expression.value.trim()) { error.value = '请输入表达式'; return }
  loading.value = true
  error.value = ''
  try {
    const res = await toolsApi.use(props.tool.toolKey, { expression: expression.value })
    result.value = res.data.result
  } catch (e: any) {
    result.value = null
    error.value = e?.message || '计算失败'
  } finally {
    loading.value = false
  }
}

async function doShare() {
  shareUrl.value = await shareResult(result.value)
  if (shareUrl.value) showToast('分享链接已生成')
}
</script>
<style scoped>
.expr { width: 100%; font-size: 16px; }
.keys { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 12px 0; }
.key { padding: 8px 0; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50); color: var(--neutral-800); font-size: 14px; cursor: pointer; }
.key:hover { border-color: var(--primary-500); color: var(--primary-500); }
.calc-btn { width: 100%; }
.result { margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--neutral-200); }
.expr-line { font-size: 14px; color: var(--neutral-500); word-break: break-all; }
.value { font-size: 26px; font-weight: 700; color: var(--primary-500); word-break: break-all; }
.share-row { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.share-link { font-size: 13px; }
.error { margin: 10px 0 0; color: var(--danger); font-size: 13px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .keys { grid-template-columns: repeat(5, 1fr); }
  .key { padding: 10px 0; font-size: 15px; }
}
</style>
