<template>
  <div class="container">
    <div class="page-header">
      <h2 class="page-title">我的课表</h2>
      <div v-if="userStore.isLoggedIn" class="header-ops">
        <button class="btn btn-sm" @click="openAdd"><LucideIcon name="add" :size="18" /> 添加课程</button>
        <button class="btn btn-sm btn-plain" @click="openShare"><LucideIcon name="share" :size="18" /> 分享课表</button>
        <button class="btn btn-sm btn-plain" @click="openReplicate"><LucideIcon name="copy" :size="18" /> 复刻课表</button>
      </div>
      <button v-else class="btn btn-sm" @click="userStore.openLoginDialog()">登录后查看完整课表</button>
    </div>

    <div v-if="!userStore.isLoggedIn" class="empty">登录后可查看并管理你的课程表</div>
    <div v-else-if="loading" class="loading">加载中…</div>
    <div v-else class="card table-wrap">
      <div v-if="courses.length === 0" class="empty">课表还是空的，点击「添加课程」开始编排吧</div>
      <table v-else class="course-table">
        <thead>
          <tr><th class="num">节次</th><th v-for="d in 7" :key="d">{{ weekName(d) }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in maxSection" :key="s">
            <td class="sec num">{{ s }}</td>
            <td v-for="d in 7" :key="d" class="cell">
              <div v-for="c in coursesAt(d, s)" :key="c.id" class="course" :style="courseStyle(c)" @click="openEdit(c)">
                {{ c.courseName }}
                <span v-if="c.startSection !== c.endSection" class="sec-range num">{{ c.startSection }}-{{ c.endSection }}节</span>
                <span v-if="c.location" class="loc">{{ c.location }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加 / 编辑课程弹窗 -->
    <AppDialog :visible="courseVisible" @update:visible="(v) => { if (!v) closeCourseDialog() }" :title="editing ? '编辑课程' : '添加课程'">
      <div class="form-row"><label>课程名 *</label><input v-model="form.courseName" class="input" maxlength="100" placeholder="如：高等数学" /></div>
      <div class="form-row"><label>教师</label><input v-model="form.teacher" class="input" maxlength="50" placeholder="选填" /></div>
      <div class="form-row"><label>上课地点</label><input v-model="form.location" class="input" maxlength="100" placeholder="如：3教-201（选填）" /></div>
      <div class="form-row"><label>周次</label><input v-model="form.weeks" class="input" maxlength="50" placeholder="如：1-16（选填）" /></div>
      <div class="form-row"><label>星期 *</label>
        <select v-model="form.dayOfWeek" class="select">
          <option v-for="d in 7" :key="d" :value="d">{{ weekName(d) }}</option>
        </select>
      </div>
      <div class="form-grid">
        <div class="form-row"><label>开始节次 *</label><input v-model.number="form.startSection" class="input num" type="number" min="1" max="12" /></div>
        <div class="form-row"><label>结束节次 *</label><input v-model.number="form.endSection" class="input num" type="number" min="1" max="12" /></div>
      </div>
      <div class="form-row"><label>颜色</label>
        <div class="colors">
          <span v-for="(col, i) in colors" :key="col" class="color-dot" :class="{ active: form.colorId === i + 1 }" :style="{ background: col }" @click="form.colorId = i + 1"></span>
        </div>
      </div>
      <p v-if="dialogError" class="dialog-error">{{ dialogError }}</p>
      <!-- 时间冲突提示 -->
      <div v-if="conflicts.length" class="conflict">
        <div class="conflict-tip"><LucideIcon name="warning" :size="16" /> 与以下课程时间冲突：</div>
        <div v-for="c in conflicts" :key="c.id" class="conflict-item">
          {{ c.courseName }} · {{ weekName(c.dayOfWeek) }} 第{{ c.startSection }}-{{ c.endSection }}节
        </div>
      </div>
      <template #footer>
        <button v-if="editing" class="btn btn-sm btn-danger del" :disabled="submitting" @click="removeCourse">删除课程</button>
        <button class="btn btn-sm btn-plain" :disabled="submitting" @click="closeCourseDialog">取消</button>
        <button v-if="conflicts.length" class="btn btn-sm" :disabled="submitting" @click="submitCourse(true)">{{ submitting ? '处理中…' : '覆盖冲突课程' }}</button>
        <button v-else class="btn btn-sm" :disabled="submitting" @click="submitCourse(false)">{{ submitting ? '保存中…' : editing ? '保存' : '添加' }}</button>
      </template>
    </AppDialog>

    <!-- 分享课表弹窗 -->
    <AppDialog :visible="shareVisible" @update:visible="shareVisible = $event" title="分享课表">
      <div v-if="shareLoading" class="loading">生成中…</div>
      <template v-else>
        <div class="share-code num">{{ shareCode }}</div>
        <p class="share-tip">将分享码发给同身份的同学，对方可一键复刻你的课表快照</p>
        <p class="share-tip">有效期 15 天 · 每人最多 3 个生效分享码</p>
      </template>
      <template #footer>
        <button class="btn btn-sm btn-plain" @click="shareVisible = false">关闭</button>
        <button class="btn btn-sm" :disabled="shareLoading" @click="copyShareCode">复制</button>
      </template>
    </AppDialog>

    <!-- 复刻课表弹窗 -->
    <AppDialog :visible="replicateVisible" @update:visible="replicateVisible = $event" title="复刻课表">
      <div class="form-row"><label>分享码 *</label><input v-model="replicateCode" class="input num" maxlength="8" placeholder="如：A1B2C3" @keyup.enter="submitReplicate" /></div>
      <p class="share-tip">输入同学分享的课表分享码，复刻其课表快照（身份需一致）</p>
      <p v-if="replicateError" class="dialog-error">{{ replicateError }}</p>
      <template #footer>
        <button class="btn btn-sm btn-plain" :disabled="replicating" @click="replicateVisible = false">取消</button>
        <button class="btn btn-sm" :disabled="replicating" @click="submitReplicate">{{ replicating ? '复刻中…' : '开始复刻' }}</button>
      </template>
    </AppDialog>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { courseApi, courseApi2 } from '../api'
import { useToast } from '@/composables/useToast'
import { AppDialog } from '@/components/base'
import { LucideIcon } from '@/components/icons'

const userStore = useUserStore()
const loading = ref(false)
const courses = ref<any[]>([])
const colors = ['#4A90D9', '#52C41A', '#FA8C16', '#722ED1', '#F5222D', '#13C2C2', '#EB2F96', '#8C8C8C']

const toast = useToast()
function showToast(msg: string) {
  toast.show(msg)
}

const maxSection = computed(() => Math.max(5, ...courses.value.map((c) => c.endSection || c.startSection || 0)))
function weekName(d: number) { return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][d - 1] }
function coursesAt(day: number, sec: number) {
  return courses.value.filter((c) => c.dayOfWeek === day && c.startSection !== null && c.startSection! <= sec && c.endSection !== null && c.endSection! >= sec && c.startSection === sec)
}
function colorIndex(c: any) { return c.colorId ? (c.colorId - 1) % colors.length : c.id % colors.length }
function courseStyle(c: any) { return { background: colors[colorIndex(c)] + '22', borderColor: colors[colorIndex(c)] } }

async function load() {
  loading.value = true
  try {
    const res = await courseApi.list()
    courses.value = Array.isArray(res.data) ? res.data : res.data?.list || []
  } finally {
    loading.value = false
  }
}

/* ===== 添加 / 编辑课程 ===== */
const courseVisible = ref(false)
const submitting = ref(false)
const dialogError = ref('')
const editing = ref<any>(null)
const conflicts = ref<any[]>([])
const form = reactive({ courseName: '', teacher: '', location: '', weeks: '', dayOfWeek: 1, startSection: 1, endSection: 2, colorId: 1 })

function requireLogin() {
  if (!userStore.isLoggedIn) { userStore.openLoginDialog(); return false }
  return true
}

function openAdd() {
  if (!requireLogin()) return
  editing.value = null
  conflicts.value = []
  dialogError.value = ''
  Object.assign(form, { courseName: '', teacher: '', location: '', weeks: '', dayOfWeek: 1, startSection: 1, endSection: 2, colorId: 1 })
  courseVisible.value = true
}

function openEdit(c: any) {
  editing.value = c
  conflicts.value = []
  dialogError.value = ''
  Object.assign(form, {
    courseName: c.courseName || '',
    teacher: c.teacher || '',
    location: c.location || '',
    weeks: c.weeks || '',
    dayOfWeek: c.dayOfWeek || 1,
    startSection: c.startSection || 1,
    endSection: c.endSection || c.startSection || 1,
    colorId: c.colorId || 1,
  })
  courseVisible.value = true
}

function closeCourseDialog() {
  if (submitting.value) return
  courseVisible.value = false
  conflicts.value = []
  dialogError.value = ''
}

function validateForm(): string | null {
  if (!form.courseName.trim()) return '请填写课程名'
  const s = Number(form.startSection)
  const e = Number(form.endSection)
  if (!Number.isInteger(s) || s < 1 || s > 12) return '开始节次必须为 1-12 的整数'
  if (!Number.isInteger(e) || e < 1 || e > 12) return '结束节次必须为 1-12 的整数'
  if (s > e) return '开始节次不能大于结束节次'
  return null
}

function buildPayload() {
  return {
    courseName: form.courseName.trim(),
    teacher: form.teacher.trim() || null,
    location: form.location.trim() || null,
    weeks: form.weeks.trim() || null,
    dayOfWeek: Number(form.dayOfWeek),
    startSection: Number(form.startSection),
    endSection: Number(form.endSection),
    colorId: Number(form.colorId),
  }
}

async function submitCourse(force: boolean) {
  const err = validateForm()
  if (err) { dialogError.value = err; return }
  submitting.value = true
  dialogError.value = ''
  try {
    if (editing.value) {
      await courseApi2.update(editing.value.id, buildPayload())
      courseVisible.value = false
      showToast('课程已更新')
    } else {
      const res = await courseApi2.create(force ? { ...buildPayload(), forceOverwrite: true } : buildPayload())
      // 冲突：后端以 200 + code 40012 返回冲突课程列表（api.md §7.1）
      if (res && res.code === 40012) {
        conflicts.value = Array.isArray(res.data) ? res.data : res.data?.conflicts || []
        if (conflicts.value.length) { submitting.value = false; return }
      }
      courseVisible.value = false
      showToast('课程已添加')
    }
    await load()
  } catch (e: any) {
    dialogError.value = e?.message || '保存失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

async function removeCourse() {
  if (!editing.value) return
  if (!window.confirm(`确定删除「${editing.value.courseName}」？删除后不可恢复`)) return
  submitting.value = true
  try {
    await courseApi2.remove(editing.value.id)
    courseVisible.value = false
    showToast('课程已删除')
    await load()
  } catch (e: any) {
    dialogError.value = e?.message || '删除失败'
  } finally {
    submitting.value = false
  }
}

/* ===== 分享课表 ===== */
const shareVisible = ref(false)
const shareLoading = ref(false)
const shareCode = ref('')

async function openShare() {
  if (!requireLogin()) return
  shareCode.value = ''
  shareVisible.value = true
  shareLoading.value = true
  try {
    const res = await courseApi2.share()
    shareCode.value = res.data?.shareCode || res.data?.share_code || ''
  } catch (e: any) {
    shareVisible.value = false
    showToast(e?.message || '生成分享码失败')
  } finally {
    shareLoading.value = false
  }
}

async function copyShareCode() {
  if (!shareCode.value) return
  try {
    await navigator.clipboard.writeText(shareCode.value)
    showToast('分享码已复制')
  } catch {
    showToast('复制失败，请手动复制')
  }
}

/* ===== 复刻课表 ===== */
const replicateVisible = ref(false)
const replicating = ref(false)
const replicateCode = ref('')
const replicateError = ref('')

function openReplicate() {
  if (!requireLogin()) return
  replicateCode.value = ''
  replicateError.value = ''
  replicateVisible.value = true
}

async function submitReplicate() {
  const code = replicateCode.value.trim().toUpperCase()
  if (!code) { replicateError.value = '请输入分享码'; return }
  replicating.value = true
  replicateError.value = ''
  try {
    const res = await courseApi2.replicate(code)
    replicateVisible.value = false
    showToast(`已复刻 ${res.data?.replicated ?? 0} 门课程`)
    await load()
  } catch (e: any) {
    replicateError.value = e?.code === 40006 ? '分享码无效或已停用/过期'
      : e?.code === 40007 ? '分享码身份不匹配，只能复刻同身份同学的课表'
      : e?.message || '复刻失败，请稍后重试'
  } finally {
    replicating.value = false
  }
}

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  await load()
})
</script>
<style scoped>
.header-ops { display: flex; gap: 8px; flex-wrap: wrap; }
.table-wrap { overflow-x: auto; padding: 12px; }
.course-table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 700px; }
.course-table th, .course-table td { border: 1px solid var(--neutral-100); padding: 6px; font-size: 13px; text-align: center; vertical-align: top; }
.course-table th { background: var(--neutral-50); color: var(--neutral-600); font-weight: 500; padding: 8px 6px; }
.sec { color: var(--neutral-500); background: var(--neutral-50); }
.course { border-radius: var(--radius-sm); border-left: 3px solid; padding: 4px 6px; font-size: 12px; color: var(--neutral-800); text-align: left; cursor: pointer; transition: opacity 0.2s; }
.course:hover { opacity: 0.8; }
.loc { display: block; color: var(--neutral-500); font-size: 11px; }
.sec-range { display: block; color: var(--neutral-500); font-size: 11px; }

/* 弹窗（与 Marketplace.vue 弹窗风格一致） */
.dialog-mask { position: fixed; inset: 0; z-index: 50; background: rgba(17, 24, 39, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.dialog { width: 380px; max-width: 100%; max-height: 85vh; overflow-y: auto; background: var(--neutral-0); border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-float); }
.dialog-title { margin: 0 0 14px; font-size: 17px; font-weight: 600; color: var(--neutral-900); }
.form-row { margin-bottom: 10px; }
.form-row label { display: block; margin-bottom: 4px; font-size: 12px; color: var(--neutral-500); }
.form-row .input, .form-row .select { width: 100%; }
.form-grid { display: flex; gap: 10px; }
.form-grid .form-row { flex: 1; }
.dialog-actions { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 14px; }
.dialog-actions .spacer { flex: 1; }
.dialog-error { margin: 4px 0 0; font-size: 12px; color: var(--danger); }
.btn-danger { background: var(--danger); }
.btn-danger:hover { background: #dc2626; }
.del { margin-right: auto; }

/* 颜色选择 */
.colors { display: flex; gap: 10px; flex-wrap: wrap; padding: 4px 0; }
.color-dot { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.15s; }
.color-dot.active { border-color: var(--neutral-900); transform: scale(1.15); }

/* 冲突提示 */
.conflict { margin-top: 10px; padding: 10px 12px; background: var(--danger-bg); border-radius: var(--radius-md); }
.conflict-tip { font-size: 13px; font-weight: 500; color: var(--danger); }
.conflict-item { font-size: 12px; color: var(--neutral-700); padding: 2px 0; }

/* 分享 / 复刻 */
.share-code { font-size: 40px; font-weight: 700; letter-spacing: 8px; text-align: center; color: var(--primary-500); margin: 12px 0; user-select: all; }
.share-tip { margin: 4px 0 0; font-size: 12px; color: var(--neutral-500); text-align: center; }

/* 轻提示 */
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }

@media (max-width: 768px) {
  .header-ops { gap: 6px; }
  .share-code { font-size: 32px; letter-spacing: 6px; }
}
</style>
