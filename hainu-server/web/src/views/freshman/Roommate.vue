<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">找室友</h2></div>

    <!-- 未登录引导 -->
    <div v-if="!userStore.isLoggedIn" class="card login-guide">
      <div class="login-icon"><LucideIcon name="action-profile" :size="48" /></div>
      <p class="login-tip">登录后即可发布找房信息，寻找同宿舍室友与同专业同学</p>
      <button class="btn" @click="userStore.openLoginDialog()">立即登录</button>
    </div>

    <template v-else>
      <!-- 功能状态 -->
      <div v-if="statusLoaded && status && !status.isOpen" class="card notice">
        <LucideIcon name="clock" :size="16" /> 找室友功能当前未开放（{{ fmtDate(status.startDate) }} ~ {{ fmtDate(status.endDate) }}），可先浏览已发布的信息
      </div>

      <AppPillTabs :items="roommateTabs" label-key="label" value-key="value" :model-value="tab" @update:model-value="(v) => switchTab(String(v) as 'hall' | 'mine')" />

      <!-- 信息大厅 -->
      <template v-if="tab === 'hall'">
        <div v-if="hallLoading" class="loading">加载中…</div>
        <div v-else-if="posts.length === 0" class="empty">暂无发布信息，点击右下角「发布」发布第一条吧</div>
        <template v-else>
          <div v-for="p in posts" :key="p.id" class="card post-card">
            <div class="post-head">
              <div class="avatar">{{ (p.name || '').slice(0, 1) }}</div>
              <div class="post-info">
                <div class="name">{{ p.name }}<span v-if="p.campusName" class="tag tag-mint">{{ p.campusName }}</span></div>
                <div class="sub">{{ p.collegeName }} · {{ p.buildingName }} {{ p.roomNumber }}</div>
              </div>
            </div>
            <div class="post-foot">
              <span class="major">{{ p.departmentName }} / {{ p.majorName }}</span>
              <span class="contact">联系方式：{{ p.contact }}</span>
            </div>
          </div>
          <div class="pager">
            <button class="btn btn-plain btn-sm" :disabled="page <= 1" @click="loadPosts(page - 1)">上一页</button>
            <span class="num">第 {{ page }} 页 / 共 {{ total }} 条</span>
            <button class="btn btn-plain btn-sm" :disabled="!hasMore" @click="loadPosts(page + 1)">下一页</button>
          </div>
        </template>
      </template>

      <!-- 我的信息 -->
      <template v-else>
        <div v-if="mineLoading" class="loading">加载中…</div>
        <div v-else-if="!myPost" class="empty">还没有发布信息，点击右下角「发布」填写你的找房信息</div>
        <div v-else class="card">
          <div class="mine-head">
            <h3 class="card-title">{{ myPost.name }} 的找房信息</h3>
            <button class="btn btn-plain btn-sm" @click="openDialog(true)">修改</button>
          </div>
          <div class="fields">
            <div class="field"><span>校区</span><b>{{ myPost.campusName }}</b></div>
            <div class="field"><span>学院（书院）</span><b>{{ myPost.collegeName }}</b></div>
            <div class="field"><span>楼栋 / 房间号</span><b>{{ myPost.buildingName }} {{ myPost.roomNumber }}</b></div>
            <div class="field"><span>系 / 专业</span><b>{{ myPost.departmentName }} / {{ myPost.majorName }}</b></div>
            <div class="field"><span>联系方式</span><b>{{ myPost.contact }}</b></div>
            <div class="field"><span>已修改次数</span><b class="num">{{ myPost.modifyCount }} 次</b></div>
          </div>
          <p class="mine-tip">提示：信息修改有次数限制，请谨慎修改</p>
        </div>
      </template>

      <!-- 发布按钮 -->
      <button class="fab" @click="openDialog(!!myPost)"><LucideIcon name="add" :size="20" /> 发布</button>
    </template>

    <!-- 发布 / 修改 弹窗 -->
    <div v-if="dialogVisible" class="modal-mask" @click.self="dialogVisible = false">
      <div class="modal card">
        <h3 class="card-title">{{ isEdit ? '修改找房信息' : '发布找房信息' }}</h3>
        <label class="form-row">姓名 *<input v-model.trim="form.name" class="input" placeholder="必填" /></label>
        <label class="form-row">联系方式 *<input v-model.trim="form.contact" class="input" placeholder="必填（QQ / 微信 / 电话）" /></label>
        <label class="form-row">校区 *
          <select v-model.number="form.campusId" class="select" @change="onCampusChange">
            <option :value="0">请选择校区</option>
            <option v-for="c in campuses" :key="c.id" :value="c.id">{{ c.campusName }}</option>
          </select>
        </label>
        <label class="form-row">学院（书院） *
          <select v-model.number="form.collegeId" class="select" :disabled="!form.campusId" @change="onCollegeChange">
            <option :value="0">请选择学院</option>
            <option v-for="c in colleges" :key="c.id" :value="c.id">{{ c.collegeName }}</option>
          </select>
        </label>
        <label class="form-row">楼栋 *
          <select v-model.number="form.buildingId" class="select" :disabled="!form.collegeId">
            <option :value="0">请选择楼栋</option>
            <option v-for="b in buildings" :key="b.id" :value="b.id">{{ b.buildingName }}</option>
          </select>
        </label>
        <label class="form-row">学院 *
          <select v-model.number="form.departmentId" class="select" @change="onDepartmentChange">
            <option :value="0">请选择学院</option>
            <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.departmentName }}</option>
          </select>
        </label>
        <label class="form-row">专业 *
          <select v-model.number="form.majorId" class="select" :disabled="!form.departmentId">
            <option :value="0">请选择专业</option>
            <option v-for="m in majors" :key="m.id" :value="m.id">{{ m.majorName }}</option>
          </select>
        </label>
        <label class="form-row">房间号 *<input v-model.trim="form.roomNumber" class="input" placeholder="如 421" /></label>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="modal-actions">
          <button class="btn btn-plain" :disabled="submitting" @click="dialogVisible = false">取消</button>
          <button class="btn" :disabled="submitting" @click="submit">{{ submitting ? '提交中…' : isEdit ? '保存修改' : '发布并匹配' }}</button>
        </div>
      </div>
    </div>

    <!-- 匹配结果弹窗 -->
    <div v-if="matchVisible" class="modal-mask" @click.self="matchVisible = false">
      <div class="modal card">
        <h3 class="card-title">匹配结果</h3>
        <div v-if="matchLoading" class="loading">匹配中…</div>
        <template v-else>
          <template v-if="matchData.roommateMatches.length">
            <h4 class="section-title"><LucideIcon name="nav-home" :size="18" /> 可能的室友（{{ matchData.roommateMatches.length }}）</h4>
            <div v-for="p in matchData.roommateMatches" :key="p.id" class="match-card">
              <div class="name">{{ p.name }}<span v-if="p.campusName" class="tag">{{ p.campusName }}</span></div>
              <div class="sub">{{ p.buildingName }} {{ p.roomNumber }} · {{ p.contact }}</div>
            </div>
          </template>
          <template v-if="matchData.majorMatches.length">
            <h4 class="section-title"><LucideIcon name="zone-freshman" :size="18" /> 同专业同学（{{ matchData.majorMatches.length }}）</h4>
            <div v-for="p in matchData.majorMatches" :key="p.id" class="match-card">
              <div class="name">{{ p.name }}<span v-if="p.majorName" class="tag tag-orange">{{ p.majorName }}</span></div>
              <div class="sub">{{ p.departmentName }} · {{ p.contact }}</div>
            </div>
          </template>
          <div v-if="!matchData.roommateMatches.length && !matchData.majorMatches.length" class="empty">
            暂无匹配<br />
            <button class="btn btn-plain btn-sm" style="margin-top: 12px" @click="goHall">去信息大厅看看</button>
          </div>
          <div class="modal-actions"><button class="btn btn-plain" @click="matchVisible = false">关闭</button></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { roommateApi } from '../../api'
import { useUserStore } from '../../store/user'
import { LucideIcon } from '@/components/icons'
import { AppPillTabs } from '@/components/base'

const userStore = useUserStore()

/* ---------- 状态与基础数据 ---------- */
const status = ref<any>(null)
const statusLoaded = ref(false)
const campuses = ref<any[]>([])

/* ---------- 信息大厅 ---------- */
const tab = ref<'hall' | 'mine'>('hall')
const roommateTabs = [
  { label: '信息大厅', value: 'hall' },
  { label: '我的信息', value: 'mine' },
]
const hallLoaded = ref(false)
const hallLoading = ref(false)
const posts = ref<any[]>([])
const page = ref(1)
const total = ref(0)
const hasMore = ref(false)

/* ---------- 我的信息 ---------- */
const mineLoading = ref(false)
const myPost = ref<any>(null)

/* ---------- 发布 / 修改弹窗 ---------- */
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formError = ref('')
const colleges = ref<any[]>([])
const buildings = ref<any[]>([])
const departments = ref<any[]>([])
const majors = ref<any[]>([])
const form = reactive({
  name: '', contact: '', roomNumber: '',
  campusId: 0, collegeId: 0, departmentId: 0, majorId: 0, buildingId: 0,
})

/* ---------- 匹配结果 ---------- */
const matchVisible = ref(false)
const matchLoading = ref(false)
const matchData = ref<any>({ roommateMatches: [], majorMatches: [] })

const fmtDate = (d: any) => (d ? new Date(d).toLocaleDateString() : '—')

/* ---------- ID→名称 字典缓存（后端列表仅返回 ID，需按级联接口解析名称） ---------- */
const dict = {
  colleges: new Map<number, Promise<any[]>>(),
  departments: new Map<number, Promise<any[]>>(),
  buildings: new Map<number, Promise<any[]>>(),
  majors: new Map<number, Promise<any[]>>(),
}
function memo(map: Map<number, Promise<any[]>>, id: number, fetcher: () => Promise<any>): Promise<any[]> {
  if (!map.has(id)) map.set(id, fetcher().then((r: any) => r.data || []).catch(() => []))
  return map.get(id)!
}
const nameOf = (list: any[] | undefined, id: number, key: string) => {
  const it = (list || []).find((x: any) => x.id === id)
  return it ? it[key] : ''
}
/** 为帖子补充 campusName / collegeName / buildingName / departmentName / majorName 展示字段 */
async function decorate(list: any[]) {
  if (!list.length) return
  const campusIds = [...new Set(list.map((p: any) => p.campusId))]
  const collegeIds = [...new Set(list.map((p: any) => p.collegeId))]
  const deptIds = [...new Set(list.map((p: any) => p.departmentId))]
  const [collegeLists, deptLists, buildingLists, majorLists] = await Promise.all([
    Promise.all(campusIds.map((c) => memo(dict.colleges, c, () => roommateApi.colleges(c)))),
    departments.value.length ? Promise.resolve([departments.value]) : roommateApi.departments().then((r: any) => { departments.value = r.data || []; return [r.data] }),
    Promise.all(collegeIds.map((c) => memo(dict.buildings, c, () => roommateApi.buildings(c)))),
    Promise.all(deptIds.map((d) => memo(dict.majors, d, () => roommateApi.majors(d)))),
  ])
  list.forEach((p: any) => {
    p.campusName = nameOf(campuses.value, p.campusId, 'campusName')
    p.collegeName = nameOf(collegeLists.flat(), p.collegeId, 'collegeName')
    p.departmentName = nameOf(deptLists.flat(), p.departmentId, 'departmentName')
    p.buildingName = nameOf(buildingLists.flat(), p.buildingId, 'buildingName')
    p.majorName = nameOf(majorLists.flat(), p.majorId, 'majorName')
  })
}

/* ---------- 加载 ---------- */
async function loadPosts(p = 1) {
  hallLoading.value = true
  try {
    const res = await roommateApi.posts(p)
    const data = res.data || {}
    posts.value = data.list || []
    page.value = data.page || p
    total.value = data.total || 0
    hasMore.value = !!data.hasMore
    await decorate(posts.value)
  } catch (e: any) {
    alert(e.message || '加载失败，请稍后重试')
  } finally {
    hallLoading.value = false
  }
}

async function loadMine() {
  mineLoading.value = true
  try {
    const res = await roommateApi.myPost()
    myPost.value = res.data || null
    if (myPost.value) await decorate([myPost.value])
  } catch (e: any) {
    alert(e.message || '加载失败，请稍后重试')
  } finally {
    mineLoading.value = false
  }
}

function switchTab(t: 'hall' | 'mine') {
  tab.value = t
  if (t === 'hall' && !hallLoaded.value) {
    hallLoaded.value = true
    loadPosts(1)
  }
  if (t === 'mine') loadMine()
}

/* ---------- 发布 / 修改 ---------- */
function resetOptions() {
  colleges.value = []
  buildings.value = []
  departments.value = []
  majors.value = []
}

async function openDialog(edit: boolean) {
  isEdit.value = edit
  formError.value = ''
  if (edit && myPost.value) {
    const p = myPost.value
    Object.assign(form, {
      name: p.name, contact: p.contact, roomNumber: p.roomNumber,
      campusId: p.campusId, collegeId: p.collegeId, departmentId: p.departmentId, majorId: p.majorId, buildingId: p.buildingId,
    })
    // 预填级联选项（学院全量加载，不按校区）
    const [cs, bs, ms] = await Promise.all([
      memo(dict.colleges, p.campusId, () => roommateApi.colleges(p.campusId)),
      memo(dict.buildings, p.collegeId, () => roommateApi.buildings(p.collegeId)),
      memo(dict.majors, p.departmentId, () => roommateApi.majors(p.departmentId)),
    ])
    if (!departments.value.length) { const dr = await roommateApi.departments(); departments.value = dr.data || [] }
    colleges.value = cs
    buildings.value = bs
    majors.value = ms
  } else {
    Object.assign(form, { name: '', contact: '', roomNumber: '', campusId: 0, collegeId: 0, departmentId: 0, majorId: 0, buildingId: 0 })
    resetOptions()
  }
  dialogVisible.value = true
}

async function onCampusChange() {
  form.collegeId = 0
  form.buildingId = 0
  colleges.value = []
  buildings.value = []
  if (!form.campusId) return
  colleges.value = await memo(dict.colleges, form.campusId, () => roommateApi.colleges(form.campusId))
}

async function onCollegeChange() {
  form.buildingId = 0
  buildings.value = []
  if (!form.collegeId) return
  buildings.value = await memo(dict.buildings, form.collegeId, () => roommateApi.buildings(form.collegeId))
}

async function onDepartmentChange() {
  form.majorId = 0
  majors.value = []
  if (!form.departmentId) return
  majors.value = await memo(dict.majors, form.departmentId, () => roommateApi.majors(form.departmentId))
}

async function submit() {
  if (!form.name || !form.contact) { formError.value = '请填写姓名和联系方式'; return }
  if (!form.campusId || !form.collegeId || !form.buildingId || !form.departmentId || !form.majorId || !form.roomNumber) {
    formError.value = '请完整选择校区 / 学院 / 楼栋 / 系 / 专业并填写房间号'
    return
  }
  submitting.value = true
  formError.value = ''
  const payload = {
    name: form.name, contact: form.contact, roomNumber: form.roomNumber,
    campusId: form.campusId, collegeId: form.collegeId, departmentId: form.departmentId,
    majorId: form.majorId, buildingId: form.buildingId,
  }
  try {
    if (isEdit.value && myPost.value) {
      await roommateApi.update(myPost.value.id, payload)
      dialogVisible.value = false
      alert('修改成功')
      await loadMine()
    } else {
      await roommateApi.publish(payload)
      dialogVisible.value = false
      await Promise.all([loadMine(), hallLoaded.value ? loadPosts(1) : Promise.resolve()])
      await doMatch(payload)
    }
  } catch (e: any) {
    if (e.code === 40008) formError.value = `${e.message}（当前已修改 ${myPost.value?.modifyCount ?? 0} 次）`
    else if (e.code === 40009) formError.value = e.message || '已存在发布信息'
    else formError.value = e.message || '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

/* ---------- 匹配 ---------- */
async function doMatch(payload: any) {
  matchVisible.value = true
  matchLoading.value = true
  try {
    const res = await roommateApi.match(payload)
    matchData.value = res.data || { roommateMatches: [], majorMatches: [] }
    await Promise.all([decorate(matchData.value.roommateMatches || []), decorate(matchData.value.majorMatches || [])])
  } catch (e: any) {
    matchData.value = { roommateMatches: [], majorMatches: [] }
    alert(e.message || '匹配失败，请稍后重试')
  } finally {
    matchLoading.value = false
  }
}

function goHall() {
  matchVisible.value = false
  switchTab('hall')
}

/* ---------- 初始化 ---------- */
onMounted(async () => {
  if (!userStore.isLoggedIn) return
  try {
    const [st, cs] = await Promise.all([roommateApi.status(), roommateApi.campuses()])
    status.value = st.data
    campuses.value = cs.data || []
  } catch (e: any) {
    alert(e.message || '加载失败，请稍后重试')
  } finally {
    statusLoaded.value = true
  }
  hallLoaded.value = true
  loadPosts(1)
  loadMine()
  // 学院列表全量加载（不按校区过滤，学院可跨校区）
  roommateApi.departments().then((r: any) => { departments.value = r.data || [] }).catch(() => {})
})
</script>
<style scoped>
.login-guide { text-align: center; padding: 48px 20px; }
.login-icon { font-size: 48px; line-height: 1; }
.login-tip { margin: 12px 0 20px; color: var(--neutral-500); }
.notice { background: var(--warning-bg); color: var(--orange-500); font-size: 13px; }
.post-head { display: flex; align-items: center; gap: 12px; }
.avatar { width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); background: var(--primary-50); color: var(--primary-500); font-size: 18px; font-weight: 600; }
.name { font-size: 15px; font-weight: 600; color: var(--neutral-900); display: flex; align-items: center; gap: 8px; }
.sub { margin-top: 2px; font-size: 12px; color: var(--neutral-500); }
.post-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--neutral-100); font-size: 13px; }
.major { color: var(--neutral-600); }
.contact { color: var(--primary-500); }
.mine-head { display: flex; align-items: center; justify-content: space-between; }
.fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 24px; }
.field { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--neutral-100); font-size: 14px; }
.field span { color: var(--neutral-500); }
.field b { font-weight: 500; color: var(--neutral-900); text-align: right; }
.mine-tip { margin: 12px 0 0; font-size: 12px; color: var(--neutral-400); }
.fab { position: fixed; right: 32px; bottom: 40px; z-index: 90; padding: 12px 24px; border: none; border-radius: var(--radius-full); background: var(--primary-500); color: #fff; font-size: 15px; cursor: pointer; box-shadow: var(--shadow-float); }
.fab:hover { background: var(--primary-700); }
.modal-mask { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(17, 24, 39, 0.45); }
.modal { width: 100%; max-width: 460px; max-height: 86vh; overflow-y: auto; }
.form-row { display: block; margin-bottom: 10px; font-size: 13px; color: var(--neutral-600); }
.form-row .input, .form-row .select { display: block; width: 100%; margin-top: 4px; }
.form-error { margin: 4px 0 8px; font-size: 13px; color: var(--danger); }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }
.section-title { margin: 12px 0 8px; font-size: 15px; color: var(--neutral-900); }
.match-card { padding: 10px 12px; margin-bottom: 8px; border: 1px solid var(--neutral-100); border-radius: var(--radius-md); }
@media (max-width: 768px) {
  .fields { grid-template-columns: 1fr; }
  .fab { right: 16px; bottom: calc(72px + env(safe-area-inset-bottom)); }
  .post-foot { flex-direction: column; align-items: flex-start; gap: 4px; }
}
</style>
