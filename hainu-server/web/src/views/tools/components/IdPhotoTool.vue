<template>
  <div class="card">
    <div class="row">
      <label>照片规格</label>
      <select v-model="size" class="select" @change="loadSpec">
        <option value="one">一寸</option>
        <option value="two">二寸</option>
        <option value="small-two">小二寸</option>
      </select>
      <label class="file-label">
        选择照片
        <input type="file" accept="image/*" class="file-hidden" @change="pickFile" />
      </label>
    </div>

    <!-- 规格说明（后端返回） -->
    <div v-if="spec" class="spec num">
      {{ spec.name }}：{{ spec.widthPx }} × {{ spec.heightPx }} 像素（{{ spec.widthMm }} × {{ spec.heightMm }} mm）
    </div>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- 裁剪结果（canvas 常驻，v-show 控制显隐，保证裁剪时已挂载） -->
    <div v-show="preview" class="crop-result">
      <canvas ref="canvasRef" class="preview"></canvas>
      <div class="crop-actions">
        <button class="btn" @click="download"><LucideIcon name="download" :size="18" /> 下载照片</button>
        <span class="tip">按规格比例居中裁剪（cover），请上传正面清晰照片效果更佳</span>
      </div>
    </div>
    <div v-if="!preview" class="empty hint">选择本地照片后自动裁剪为所选规格</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toolsApi } from '../../../api'
import { useTool } from '../composables/use-tool'
import { LucideIcon } from '@/components/icons'

const props = defineProps<{ tool: any }>()
const { showToast, guard, call } = useTool(props.tool?.toolKey || 'id-photo')

const size = ref('one')
const spec = ref<any>(null)
const error = ref('')
const preview = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
let srcImg: HTMLImageElement | null = null

/** 拉取规格（像素 / 毫米），切换规格后如有照片则重新裁剪 */
async function loadSpec() {
  if (!guard()) return
  error.value = ''
  const data = await call(() => toolsApi.use(props.tool.toolKey, { size: size.value }))
  if (data) {
    spec.value = data.result
    recrop()
  }
}

function pickFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { error.value = '请选择图片文件'; return }
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      srcImg = img
      recrop()
    }
    img.onerror = () => { error.value = '图片加载失败，请换一张试试' }
    img.src = String(reader.result)
  }
  reader.readAsDataURL(file)
  // 允许重复选择同一文件
  ;(e.target as HTMLInputElement).value = ''
}

/** 按所选规格比例 cover 居中裁剪，结果绘制到 canvas */
function recrop() {
  const canvas = canvasRef.value
  if (!canvas || !spec.value || !srcImg) return
  const w = spec.value.widthPx
  const h = spec.value.heightPx
  canvas.width = w
  canvas.height = h
  const scale = Math.max(w / srcImg.width, h / srcImg.height)
  const dw = srcImg.width * scale
  const dh = srcImg.height * scale
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(srcImg, (w - dw) / 2, (h - dh) / 2, dw, dh)
  preview.value = canvas.toDataURL('image/jpeg', 0.92)
}

function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) { showToast('导出失败'); return }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `证件照-${spec.value?.name || size.value}.jpg`
    a.click()
    URL.revokeObjectURL(a.href)
  }, 'image/jpeg', 0.92)
}

onMounted(loadSpec)
</script>
<style scoped>
.row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.row > label:first-child { color: var(--neutral-600); font-size: 14px; }
.file-label { display: inline-flex; padding: 7px 16px; font-size: 14px; border-radius: var(--radius-md); background: var(--primary-50); color: var(--primary-500); cursor: pointer; }
.file-label:hover { background: var(--primary-100); }
.file-hidden { display: none; }
.spec { margin-top: 12px; font-size: 13px; color: var(--neutral-500); }
.crop-result { margin-top: 16px; display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.preview { max-width: 180px; max-height: 240px; width: auto; height: auto; border: 1px solid var(--neutral-200); border-radius: var(--radius-md); box-shadow: var(--shadow-card); }
.crop-actions { display: flex; flex-direction: column; gap: 8px; }
.tip { font-size: 12px; color: var(--neutral-400); max-width: 220px; }
.hint { padding: 24px 0; }
.error { margin: 10px 0 0; color: var(--danger); font-size: 13px; }
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }
@media (max-width: 768px) {
  .crop-result { flex-direction: column; align-items: center; }
  .crop-actions { align-items: center; text-align: center; }
}
</style>
