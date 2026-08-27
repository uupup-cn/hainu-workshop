<template>
  <div id="app">
    <!-- 顶部导航（电脑端） -->
    <header class="topbar">
      <div class="topbar-inner">
        <router-link to="/" class="brand">
          <span class="brand-mark">海</span>
          <span class="brand-name">海大工坊</span>
        </router-link>
        <nav class="topnav">
          <router-link to="/" class="nav-link" :class="{ active: isActive('visitor') }">首页</router-link>
          <router-link to="/freshman" class="nav-link" :class="{ active: isActive('freshman') }">新生专区</router-link>
          <router-link to="/student" class="nav-link" :class="{ active: isActive('student') }">在校生专区</router-link>
        </nav>
        <div class="topbar-right">
          <template v-if="userStore.isLoggedIn">
            <router-link to="/profile" class="user-chip">
              <span class="user-avatar">{{ avatarText }}</span>
              <span>{{ userStore.userInfo?.nickname || '我的' }}</span>
            </router-link>
            <button class="logout-btn" title="退出登录" @click="onLogout">
              <LucideIcon name="action-logout" :size="18" />
            </button>
          </template>
          <template v-else>
            <button class="btn btn-plain btn-sm" @click="userStore.openLoginDialog()">登录</button>
          </template>
        </div>
      </div>
    </header>

    <main class="app-main">
      <slot />
    </main>

    <!-- 全站页脚 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-mark">海</span>
          <div>
            <div class="footer-name">海大工坊</div>
            <div class="footer-slogan">海南大学校园工具一站式入口</div>
          </div>
        </div>
        <nav class="footer-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/freshman">新生专区</router-link>
          <router-link to="/student">在校生专区</router-link>
        </nav>
      </div>
      <div class="footer-bottom">© 2026 海大工坊 · 服务海南大学师生</div>
    </footer>

    <!-- 全站轻提示呈现器（useToast 单例） -->
    <AppToast />

    <!-- 登录弹窗（含小程序扫码登录快捷入口） -->
    <div v-if="userStore.loginDialogVisible" class="dialog-mask" @click.self="userStore.closeLoginDialog()">
      <div class="dialog">
        <h3 class="dialog-title">登录海大工坊</h3>
        <input v-model="loginForm.uid" class="input dialog-input" placeholder="UID" />
        <input
          v-model="loginForm.password"
          class="input dialog-input"
          type="password"
          placeholder="密码"
          @keyup.enter="onLogin"
        />
        <button class="btn dialog-btn" :disabled="loginLoading" @click="onLogin">
          {{ loginLoading ? '登录中…' : '登录' }}
        </button>
        <div class="qr-entry">
          <div class="qr-box">小程序码</div>
          <p class="qr-tip">使用微信扫一扫，快捷登录</p>
        </div>
        <p v-if="loginError" class="dialog-error">{{ loginError }}</p>
      </div>
    </div>

    <!-- 底部 TabBar（手机端，Lucide 图标，第 2 格按身份分流） -->
    <nav class="tabbar">
      <router-link v-for="t in tabItems" :key="t.path" :to="t.path" class="tab">
        <LucideIcon :name="t.icon" :size="22" />
        <span>{{ t.label }}</span>
      </router-link>
    </nav>

    <!-- 悬浮反馈按钮 + 弹窗（仅登录态） -->
    <button v-if="userStore.isLoggedIn" class="feedback-fab" title="问题反馈" @click="fbVisible = true">
      <LucideIcon name="action-feedback" :size="22" />
    </button>
    <div v-if="fbVisible" class="fb-mask" @click.self="fbVisible = false">
      <div class="fb-dialog card">
        <h3 class="card-title">问题反馈</h3>
        <label class="fb-label">问题类型 *</label>
        <select v-model="fbForm.type" class="select fb-select">
          <option value="BUG">功能异常</option>
          <option value="FEATURE">功能建议</option>
          <option value="UX">体验问题</option>
          <option value="PERFORMANCE">性能问题</option>
          <option value="OTHER">其他</option>
        </select>
        <label class="fb-label">问题标题 *</label>
        <input v-model="fbForm.title" class="input" maxlength="50" placeholder="简要描述问题（50 字内）" />
        <label class="fb-label">问题描述 *</label>
        <textarea
          v-model="fbForm.content"
          class="input fb-textarea"
          rows="4"
          maxlength="500"
          placeholder="详细描述你遇到的问题或疑惑（500 字内）"
        ></textarea>
        <label class="fb-label">期望结果（选填）</label>
        <input v-model="fbForm.expectedBehavior" class="input" maxlength="200" placeholder="你期望的正确表现是什么" />
        <label class="fb-label">联系方式（选填）</label>
        <input v-model="fbForm.contact" class="input" placeholder="QQ / 微信 / 邮箱，方便回访" />
        <div class="fb-actions">
          <button class="btn btn-plain btn-sm" @click="fbVisible = false">取消</button>
          <button
            class="btn btn-sm"
            :disabled="!fbForm.content.trim() || !fbForm.title.trim() || fbSubmitting"
            @click="submitFeedback"
          >
            {{ fbSubmitting ? '提交中…' : '提交反馈' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAuth } from '@/composables/useAuth'
import { systemApi, profileApi } from '@/api'
import { LucideIcon, type IconName } from '@/components/icons'
import { AppToast } from '@/components/base'

const userStore = useUserStore()
const { login, identityZone, logout } = useAuth()
const router = useRouter()
const route = useRoute()

const loginForm = reactive({ uid: '', password: '' })
const loginLoading = ref(false)
const loginError = ref('')

// 悬浮反馈
const fbVisible = ref(false)
const fbSubmitting = ref(false)
const fbForm = reactive({ type: 'BUG', title: '', content: '', expectedBehavior: '', contact: '' })

async function submitFeedback() {
  if (!fbForm.content.trim() || !fbForm.title.trim()) return
  fbSubmitting.value = true
  try {
    await profileApi.feedback({
      content: fbForm.content,
      contact: fbForm.contact || undefined,
      type: fbForm.type,
      title: fbForm.title,
      expectedBehavior: fbForm.expectedBehavior || undefined,
    })
    alert('反馈已提交，感谢你的建议')
    fbVisible.value = false
    Object.assign(fbForm, { type: 'BUG', title: '', content: '', expectedBehavior: '', contact: '' })
  } catch (e: any) {
    alert(e?.message || '提交失败，请稍后重试')
  } finally {
    fbSubmitting.value = false
  }
}

// 顶部导航激活态（按专区 meta 判断）
function isActive(zone: 'visitor' | 'freshman' | 'student') {
  if (zone === 'visitor') return route.path === '/' || route.meta.zone === 'visitor'
  return route.meta.zone === zone
}

// 头像首字
const avatarText = computed(() => {
  const n = userStore.userInfo?.nickname || userStore.userInfo?.uid || '我'
  return String(n).slice(0, 1)
})

// 底部 Tab（手机端，Lucide 图标，第 2 格按身份分流到对应专区）
type TabItem = { icon: IconName; label: string; path: string }
const tabItems = computed<TabItem[]>(() => {
  const isFreshman = userStore.userInfo?.identity === 'freshman'
  const zoneTab: TabItem = isFreshman
    ? { icon: 'zone-freshman', label: '新生', path: '/freshman' }
    : { icon: 'zone-student', label: '校园', path: '/student' }
  return [
    { icon: 'nav-home', label: '首页', path: '/' },
    zoneTab,
    { icon: 'module-marketplace', label: '集市', path: '/marketplace' },
    { icon: 'module-schedule', label: '课表', path: '/schedule' },
    { icon: 'action-profile', label: '我的', path: '/profile' },
  ]
})

// 假期模式：campus_mode=holiday 时首次访问进入倒计时启动页
onMounted(async () => {
  try {
    const res = await systemApi.settings()
    if (
      res.data?.campus_mode === 'holiday' &&
      !sessionStorage.getItem('launch_passed') &&
      location.pathname !== '/launch' &&
      location.pathname !== '/login'
    ) {
      router.push('/launch')
    }
  } catch {
    /* 设置读取失败不阻塞 */
  }
})

async function onLogin() {
  if (!loginForm.uid || !loginForm.password) {
    loginError.value = '请输入 UID 和密码'
    return
  }
  loginLoading.value = true
  loginError.value = ''
  try {
    await login(loginForm.uid, loginForm.password)
    Object.assign(loginForm, { uid: '', password: '' })
    router.push(identityZone())
  } catch (e: any) {
    loginError.value = e?.message || '登录失败，请检查 UID 和密码'
  } finally {
    loginLoading.value = false
  }
}

function onLogout() {
  logout()
  router.push('/')
}
</script>

<style scoped>
/* 顶部导航（电脑端） */
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px) saturate(1.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.5);
  border-bottom: 1px solid var(--neutral-200);
}
.topbar-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: 0 var(--space-4);
  height: var(--header-h);
}
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--fg-1);
}
.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--ocean-500), var(--fantasy-500));
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
}
.brand-name {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: var(--fw-h3);
}
.topnav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
  justify-content: center;
}
.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--r-md);
  color: var(--fg-2);
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-h4);
  transition:
    color var(--dur-fast) var(--ease-out),
    background var(--dur-fast) var(--ease-out);
}
.nav-link:hover {
  color: var(--ocean-500);
  background: var(--ocean-50);
}
.nav-link.active {
  color: var(--ocean-500);
  background: var(--ocean-50);
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.user-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  border-radius: var(--r-full);
  background: var(--ocean-50);
  color: var(--ocean-700);
  font-size: var(--fs-body);
}
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-full);
  background: linear-gradient(135deg, var(--ocean-500), var(--teal-500));
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-md);
  color: var(--fg-3);
  transition:
    background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}
.logout-btn:hover {
  background: var(--neutral-100);
  color: var(--danger);
}

.app-main {
  min-height: calc(100vh - var(--header-h));
}

/* 登录弹窗 */
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  width: 320px;
  background: var(--bg-card);
  border-radius: var(--r-xl);
  padding: var(--space-6);
  box-shadow: var(--sh-float);
}
.dialog-title {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-h3);
  font-weight: var(--fw-h3);
  text-align: center;
}
.dialog-input {
  display: block;
  width: 100%;
  margin-bottom: var(--space-3);
}
.dialog-btn {
  width: 100%;
}
.dialog-error {
  margin: var(--space-2) 0 0;
  font-size: var(--fs-caption);
  color: var(--danger);
  text-align: center;
}
.qr-entry {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--neutral-200);
  text-align: center;
}
.qr-box {
  width: 96px;
  height: 96px;
  margin: 0 auto var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--r-md);
  color: var(--fg-3);
  font-size: var(--fs-caption);
}
.qr-tip {
  margin: 0;
  font-size: var(--fs-caption);
  color: var(--fg-3);
}

/* 底部 TabBar（手机端，电脑端隐藏） */
.tabbar {
  display: none;
}

@media (max-width: 768px) {
  .topbar {
    display: none;
  }
  .tabbar {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: var(--bg-card);
    border-top: 1px solid var(--neutral-200);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--space-2) 0 6px;
    color: var(--fg-3);
    font-size: var(--fs-label);
  }
  .tab.router-link-active {
    color: var(--ocean-500);
    font-weight: var(--fw-label);
  }
}

/* 悬浮反馈按钮 */
.feedback-fab {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 30;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ocean-500), var(--fantasy-500));
  color: #fff;
  box-shadow: var(--sh-float);
  transition:
    transform var(--dur-base) var(--ease-back),
    box-shadow var(--dur-base) var(--ease-out);
}
.feedback-fab:hover {
  transform: scale(1.1);
  box-shadow: var(--sh-hero);
}
.fb-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.fb-dialog {
  width: 460px;
  max-width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  margin: 0;
}
.fb-textarea {
  display: block;
  width: 100%;
  resize: vertical;
}
.fb-select {
  display: block;
  width: 100%;
}
.fb-label {
  display: block;
  margin: var(--space-3) 0 var(--space-1);
  font-size: 13px;
  color: var(--fg-2);
}
.fb-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

@media (max-width: 768px) {
  .feedback-fab {
    bottom: calc(var(--tabbar-h) + 16px + env(safe-area-inset-bottom));
  }
}

/* 全站页脚 */
.site-footer {
  background: var(--ocean-900);
  color: rgba(255, 255, 255, 0.72);
}
.footer-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-10) var(--space-6) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.footer-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--ocean-500), var(--fantasy-500));
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
}
.footer-name {
  font-family: var(--font-display);
  font-size: var(--fs-h4);
  font-weight: var(--fw-h4);
  color: #fff;
}
.footer-slogan {
  font-size: var(--fs-caption);
  color: rgba(255, 255, 255, 0.55);
}
.footer-nav {
  display: flex;
  gap: var(--space-6);
}
.footer-nav a {
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--fs-body);
}
.footer-nav a:hover {
  color: #fff;
}
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: var(--space-4);
  font-size: var(--fs-caption);
  color: rgba(255, 255, 255, 0.45);
}
@media (max-width: 768px) {
  .site-footer {
    padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  }
  .footer-inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
