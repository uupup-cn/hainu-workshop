<template>
  <div class="container narrow">
    <div class="page-header"><h2 class="page-title">个人中心</h2></div>

    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="card center">
      <p class="tip">登录后可管理个人信息、通知与隐私设置</p>
      <button class="btn" @click="userStore.openLoginDialog()">登录</button>
    </div>

    <template v-else>
      <!-- 资料头 -->
      <div class="card">
        <div class="profile-head">
          <span class="avatar">{{ (userStore.userInfo?.nickname || '友').slice(0, 1) }}</span>
          <div>
            <div class="nickname">{{ userStore.userInfo?.nickname || '海大用户' }}</div>
            <div class="uid num">UID：{{ userStore.userInfo?.uid || '-' }} · {{ identityText }}</div>
          </div>
          <div class="badges">
            <span class="tag" :class="authClass">{{ authText }}</span>
            <span v-if="info?.pointsEnabled" class="tag tag-orange num">积分 {{ info?.points ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 功能 Tab -->
      <AppPillTabs :items="tabs" label-key="label" value-key="key" :model-value="tab" wrap @update:model-value="(v) => switchTab(String(v))" />

      <!-- 资料编辑 -->
      <div v-if="tab === 'info'" class="card">
        <div class="form-row"><label>昵称</label><input v-model="form.nickname" class="input" maxlength="20" /></div>
        <div class="form-row"><label>邮箱</label><input v-model="form.email" class="input num" placeholder="选填" /></div>
        <div class="form-row"><label>QQ</label><input v-model="form.qq" class="input num" placeholder="选填" /></div>
        <div class="form-row"><label>微信</label><input v-model="form.wechat" class="input" placeholder="选填" /></div>
        <button class="btn" :disabled="saving" @click="saveProfile">{{ saving ? '保存中…' : '保存资料' }}</button>
      </div>

      <!-- 修改密码 -->
      <div v-else-if="tab === 'password'" class="card">
        <div class="form-row"><label>原密码</label><input v-model="pwd.oldPassword" type="password" class="input" /></div>
        <div class="form-row"><label>新密码</label><input v-model="pwd.newPassword" type="password" class="input" maxlength="32" /></div>
        <div class="form-row"><label>确认新密码</label><input v-model="pwd.confirm" type="password" class="input" maxlength="32" /></div>
        <button class="btn" @click="savePassword">修改密码</button>
      </div>

      <!-- 隐私设置 -->
      <div v-else-if="tab === 'privacy'" class="card">
        <div class="list-item">
          <div><div class="row-title">开启隐私模式</div><div class="row-desc">开启后，他人查看你的主页仅展示勾选的字段</div></div>
          <input v-model="privacy.privacyEnabled" type="checkbox" class="switch" @change="savePrivacy" />
        </div>
        <template v-if="privacy.privacyEnabled">
          <div v-for="f in privacyFields" :key="f.key" class="list-item">
            <div class="row-title">{{ f.label }}</div>
            <input v-model="privacy.privacyFields[f.key]" type="checkbox" class="switch" @change="savePrivacy" />
          </div>
        </template>
      </div>

      <!-- 认证 -->
      <div v-else-if="tab === 'auth'" class="card">
        <div class="auth-status">
          <span class="tag" :class="authClass">{{ authText }}</span>
          <span v-if="authInfo?.rejectCount" class="row-desc num">已驳回 {{ authInfo.rejectCount }}/3 次</span>
          <span v-if="authInfo?.reviewRemark" class="row-desc">驳回理由：{{ authInfo.reviewRemark }}</span>
        </div>
        <template v-if="info?.authStatus !== 'verified' && info?.authStatus !== 'pending'">
          <div class="form-row"><label>真实姓名</label><input v-model="auth.realName" class="input" /></div>
          <div class="form-row"><label>学号</label><input v-model="auth.studentNo" class="input num" /></div>
          <div class="form-row"><label>专业</label><input v-model="auth.major" class="input" /></div>
          <div class="form-row">
            <label>证明图片</label>
            <div class="proof">
              <input type="file" accept="image/*" class="input file" @change="pickProof" />
              <a v-if="auth.proofImage" :href="auth.proofImage" target="_blank" class="row-desc">已选择，点击预览</a>
            </div>
          </div>
          <p v-if="authRejects >= 3" class="row-desc danger">认证申请次数已用完（3 次），如有疑问请联系客服</p>
          <button v-else class="btn" :disabled="authLoading" @click="submitAuth">{{ authLoading ? '提交中…' : '提交认证申请' }}</button>
        </template>
        <p v-else-if="info?.authStatus === 'pending'" class="row-desc">认证申请审核中，请耐心等待管理员审核</p>
        <p v-else class="row-desc">你已完成学生认证 <LucideIcon name="fantasy-sparkles" :size="16" /> 认证后可使用积分与发布功能</p>
      </div>

      <!-- 通知中心 -->
      <div v-else-if="tab === 'notify'" class="card">
        <div v-if="notifyList.length === 0" class="empty">暂无通知</div>
        <div v-for="n in notifyList" :key="n.id" class="notice" :class="{ unread: !n.isRead }" @click="readNotify(n)">
          <div class="notice-title">{{ n.title }}<span v-if="!n.isRead" class="dot"></span></div>
          <div class="notice-content">{{ n.content }}</div>
          <div class="notice-time num">{{ formatTime(n.publishTime) }}</div>
        </div>
      </div>

      <!-- 反馈 -->
      <div v-else-if="tab === 'feedback'" class="card">
        <textarea v-model="fb.content" class="input fb-input" rows="4" maxlength="500" placeholder="告诉我们你的建议或遇到的问题（500 字内）"></textarea>
        <input v-model="fb.contact" class="input" placeholder="联系方式（选填）" style="margin-top: 8px" />
        <button class="btn" style="margin-top: 8px" :disabled="!fb.content.trim()" @click="sendFeedback">提交反馈</button>
        <template v-if="fbList.length">
          <div class="fb-history-title">我的反馈记录</div>
          <div v-for="f in fbList" :key="f.id" class="list-item">
            <div class="notice-content">{{ f.content }}</div>
            <span class="tag">{{ f.status === 'handled' ? '已处理' : '待处理' }}</span>
          </div>
        </template>
      </div>

      <div class="card center"><button class="btn btn-plain" @click="handleLogout">退出登录</button></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { profileApi } from '../api'
import { LucideIcon } from '@/components/icons'
import { AppPillTabs } from '@/components/base'

const userStore = useUserStore()
const router = useRouter()
const tabs = [
  { key: 'info', label: '资料' }, { key: 'password', label: '密码' }, { key: 'privacy', label: '隐私' },
  { key: 'auth', label: '认证' }, { key: 'notify', label: '通知' }, { key: 'feedback', label: '反馈' },
]
const tab = ref('info')
const info = ref<any>(null)
const saving = ref(false)
const form = reactive<any>({ nickname: '', email: '', qq: '', wechat: '' })
const pwd = reactive({ oldPassword: '', newPassword: '', confirm: '' })
const privacy = reactive<any>({ privacyEnabled: false, privacyFields: {} })
const privacyFields = [
  { key: 'email', label: '公开邮箱' }, { key: 'qq', label: '公开 QQ' }, { key: 'wechat', label: '公开微信' }, { key: 'identity', label: '公开身份' },
]
const auth = reactive({ realName: '', studentNo: '', major: '', proofImage: '' })
const authInfo = ref<any>(null)
const authLoading = ref(false)
const authRejects = computed(() => authInfo.value?.rejectCount || 0)
const notifyList = ref<any[]>([])
const fb = reactive({ content: '', contact: '' })
const fbList = ref<any[]>([])

const identityText = computed(() => ({ freshman: '新生', undergrad: '本科生', grad: '研究生' } as any)[info.value?.identity || userStore.userInfo?.identity] || '未设置')
const authText = computed(() => ({ unverified: '未认证', pending: '待审核', verified: '已认证' } as any)[info.value?.authStatus] || '未认证')
const authClass = computed(() => (info.value?.authStatus === 'verified' ? 'tag-mint' : ''))
function formatTime(t?: string) { return t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '' }

function switchTab(key: string) {
  tab.value = key
  if (key === 'notify') loadNotify()
  if (key === 'feedback') loadFeedback()
}

async function loadProfile() {
  try {
    const res = await profileApi.info()
    info.value = res.data
    Object.assign(form, { nickname: res.data.nickname || '', email: res.data.email || '', qq: res.data.qq || '', wechat: res.data.wechat || '' })
    userStore.setUserInfo(res.data)
  } catch { /* 忽略 */ }
}

async function saveProfile() {
  if (!form.nickname.trim()) return
  saving.value = true
  try {
    const res = await profileApi.update({ nickname: form.nickname, email: form.email || null, qq: form.qq || null, wechat: form.wechat || null })
    info.value = res.data
    alert('资料已保存')
  } catch (e: any) { alert(e?.message || '保存失败') } finally { saving.value = false }
}

async function savePassword() {
  if (!pwd.oldPassword || pwd.newPassword.length < 6) { alert('请填写原密码，新密码至少 6 位'); return }
  if (pwd.newPassword !== pwd.confirm) { alert('两次输入的新密码不一致'); return }
  try { await profileApi.changePassword({ oldPassword: pwd.oldPassword, newPassword: pwd.newPassword }); alert('密码修改成功'); Object.assign(pwd, { oldPassword: '', newPassword: '', confirm: '' }) }
  catch (e: any) { alert(e?.message || '修改失败') }
}

async function loadPrivacy() {
  try {
    const res = await profileApi.privacy()
    privacy.privacyEnabled = !!res.data.privacyEnabled
    privacy.privacyFields = res.data.privacyFields || {}
    for (const f of privacyFields) if (!(f.key in privacy.privacyFields)) privacy.privacyFields[f.key] = false
  } catch { /* 忽略 */ }
}

async function savePrivacy() {
  try { await profileApi.updatePrivacy({ privacyEnabled: privacy.privacyEnabled, privacyFields: privacy.privacyFields }) } catch (e: any) { alert(e?.message || '保存失败') }
}

async function loadAuthStatus() {
  try { const res = await profileApi.authStatus(); authInfo.value = res.data } catch { /* 忽略 */ }
}

async function pickProof(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 4 * 1024 * 1024) { alert('图片不能超过 4MB'); return }
  const base64 = await new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(',')[1]); r.readAsDataURL(file) })
  try {
    const res = await profileApi.uploadImage(file.name, base64)
    auth.proofImage = res.data.url
    alert('图片已上传')
  } catch (err: any) { alert(err?.message || '上传失败') }
}

async function submitAuth() {
  if (!auth.realName || !auth.studentNo || !auth.major || !auth.proofImage) { alert('请完整填写认证信息并上传证明图片'); return }
  authLoading.value = true
  try { await profileApi.authApply({ ...auth }); alert('认证申请已提交，等待审核'); await loadProfile(); await loadAuthStatus() }
  catch (e: any) { alert(e?.message || '提交失败') } finally { authLoading.value = false }
}

async function loadNotify() {
  try { const res = await profileApi.notifications(); notifyList.value = res.data?.list || [] } catch { /* 忽略 */ }
}

async function readNotify(n: any) {
  if (n.isRead) return
  try { await profileApi.readNotification(n.id); n.isRead = true } catch { /* 忽略 */ }
}

async function loadFeedback() {
  try { const res = await profileApi.feedbackList(); fbList.value = res.data?.list || [] } catch { /* 忽略 */ }
}

async function sendFeedback() {
  try { await profileApi.feedback({ content: fb.content, contact: fb.contact || undefined }); alert('反馈已提交，感谢你的建议'); fb.content = ''; fb.contact = ''; loadFeedback() }
  catch (e: any) { alert(e?.message || '提交失败') }
}

async function handleLogout() {
  userStore.logout()
  router.push('/')
}

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  await loadProfile()
  loadPrivacy()
  loadAuthStatus()
})
</script>
<style scoped>
.narrow { max-width: 720px; }
.center { text-align: center; }
.tip { color: var(--neutral-500); margin: 8px 0 16px; }
.profile-head { display: flex; align-items: center; gap: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--primary-50); color: var(--primary-500); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; }
.nickname { font-size: 18px; font-weight: 600; color: var(--neutral-900); }
.uid { font-size: 12px; color: var(--neutral-500); }
.badges { margin-left: auto; display: flex; gap: 8px; }
.form-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form-row label { width: 80px; flex-shrink: 0; color: var(--neutral-600); font-size: 14px; }
.form-row .input { flex: 1; }
.row-title { font-size: 14px; font-weight: 500; color: var(--neutral-800); }
.row-desc { font-size: 12px; color: var(--neutral-500); }
.row-desc.danger { color: var(--danger); }
.switch { width: 18px; height: 18px; accent-color: var(--primary-500); }
.auth-status { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.proof { flex: 1; display: flex; align-items: center; gap: 8px; }
.file { padding: 6px; }
.notice { padding: 12px 0; border-bottom: 1px solid var(--neutral-100); cursor: pointer; }
.notice:last-child { border-bottom: none; }
.notice.unread .notice-title { font-weight: 600; }
.notice-title { font-size: 15px; color: var(--neutral-900); position: relative; padding-right: 12px; }
.dot { position: absolute; top: 6px; right: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--danger); }
.notice-content { font-size: 13px; color: var(--neutral-600); margin-top: 4px; }
.notice-time { font-size: 12px; color: var(--neutral-400); margin-top: 4px; }
.fb-input { display: block; width: 100%; resize: vertical; }
.fb-history-title { margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--neutral-200); font-weight: 600; color: var(--neutral-700); }
@media (max-width: 768px) {
  .form-row { flex-direction: column; align-items: stretch; gap: 4px; }
  .form-row label { width: auto; }
  .badges { flex-direction: column; align-items: flex-end; }
}
</style>
