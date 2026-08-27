<template>
  <div class="card">
    <!-- 选项管理 -->
    <div class="opts-head">转盘选项（至少 2 项才能开转）</div>
    <div class="add-row">
      <input v-model="draft" class="input" maxlength="30" placeholder="输入选项，如：食堂 A / 食堂 B" @keyup.enter="addOption" />
      <button class="btn btn-sm" @click="addOption">添加</button>
    </div>
    <div class="opts">
      <span v-for="(o, i) in options" :key="i" class="opt">
        {{ o }}
        <b class="rm" @click="removeOption(i)">×</b>
      </span>
      <span v-if="options.length === 0" class="opts-empty">还没有选项，先添加几个吧</span>
    </div>
    <button class="btn spin" :disabled="loading || options.length < 2" @click="spin">
      <template v-if="loading">转动中…</template>
      <template v-else><LucideIcon name="tool-wheel" :size="18" /> 开转</template>
    </button>

    <!-- 抽中结果 -->
    <div v-if="picked" class="picked" :class="{ rolling: loading }">
      <div class="picked-label">本次抽中</div>
      <div class="picked-text">{{ loading ? '转运中…' : picked }}</div>
      <div class="share-row">
        <button class="btn btn-sm btn-plain" :disabled="loading" @click="doShare">{{ shareUrl ? '重新生成分享链接' : '生成分享链接' }}</button>
        <a v-if="shareUrl" :href="shareUrl" target="_blank" rel="noopener" class="share-link">打开分享页</a>
      </div>
    </div>

    <!-- 历史记录（本地） -->
    <div v-if="history.length" class="history">
      <div class="history-title">历史记录</div>
      <div v-for="(h, i) in history" :key="i" class="history-item num">{{ i + 1 }}. {{ h }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'
import { LucideIcon } from '@/components/icons'

const props = defineProps<{ tool: any }>()
const { loading, showToast, guard, call, shareResult } = useTool(props.tool?.toolKey || 'wheel')

const draft = ref('')
const options = ref<string[]>(['第一食堂', '第二食堂', '第三食堂', '点外卖'])
const picked = ref('')
const history = ref<string[]>([])
const shareUrl = ref('')

function addOption() {
  const v = draft.value.trim()
  if (!v) return
  if (options.value.includes(v)) { showToast('该选项已存在'); return }
  options.value.push(v)
  draft.value = ''
}

function removeOption(i: number) {
  options.value.splice(i, 1)
}

async function spin() {
  if (!guard()) return
  if (options.value.length < 2) { showToast('至少需要 2 个选项'); return }
  picked.value = ''
  const data = await call(() => toolsApi.use(props.tool.toolKey, { options: options.value }))
  if (data) {
    picked.value = data.result.picked
    history.value.unshift(data.result.picked)
    if (history.value.length > 10) history.value.length = 10
    if (shareUrl.value) shareUrl.value = ''
  }
}

async function doShare() {
  shareUrl.value = await shareResult({ picked: picked.value, options: options.value })
  if (shareUrl.value) showToast('分享链接已生成')
}
</script>
<style scoped>
.opts-head { font-size: 13px; color: var(--neutral-500); margin-bottom: 8px; }
.add-row { display: flex; gap: 8px; }
.add-row .input { flex: 1; }
.opts { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 16px; }
.opt { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; background: var(--primary-50); color: var(--primary-500); border-radius: var(--radius-full); font-size: 13px; }
.opt .rm { cursor: pointer; font-weight: 600; }
.opt .rm:hover { color: var(--danger); }
.opts-empty { font-size: 13px; color: var(--neutral-400); }
.spin { min-width: 140px; }
.picked { margin-top: 16px; padding: 20px; text-align: center; background: var(--primary-50); border-radius: var(--radius-lg); }
.picked-label { font-size: 12px; color: var(--neutral-500); margin-bottom: 6px; }
.picked-text { font-size: 28px; font-weight: 700; color: var(--primary-500); }
.picked.rolling .picked-text { animation: blink 0.6s infinite alternate; }
@keyframes blink { from { opacity: 0.3; } to { opacity: 1; } }
.share-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 12px; }
.share-link { font-size: 13px; }
.history { margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--neutral-200); }
.history-title { font-size: 13px; font-weight: 600; color: var(--neutral-700); margin-bottom: 6px; }
.history-item { font-size: 13px; color: var(--neutral-600); padding: 2px 0; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .picked-text { font-size: 22px; }
}
</style>
