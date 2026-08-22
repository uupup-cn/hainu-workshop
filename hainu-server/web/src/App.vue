<template>
  <div id="app">
    <!-- 电脑端顶部导航 -->
    <header class="topbar">
      <div class="topbar-inner">
        <router-link to="/home" class="brand"><span class="brand-dot"></span>海大工坊</router-link>
        <nav class="topnav">
          <router-link to="/intro">海大介绍</router-link>
          <router-link to="/phonebook">电话簿</router-link>
          <router-link to="/calendar">校历</router-link>
          <router-link to="/bus">校园出行</router-link>
          <router-link to="/marketplace">二手集市</router-link>
          <router-link to="/news">快讯</router-link>
          <router-link to="/alumni">校友圈</router-link>
          <router-link to="/schedule">课表</router-link>
        </nav>
        <div class="topbar-right">
          <template v-if="userStore.isLoggedIn">
            <router-link to="/profile" class="user-chip">{{ userStore.userInfo?.nickname || '我的' }}</router-link>
          </template>
          <template v-else>
            <button class="btn btn-sm btn-plain" @click="userStore.openLoginDialog()">登录</button>
          </template>
        </div>
      </div>
    </header>

    <router-view />

    <!-- 电脑端登录弹窗（含小程序扫码登录快捷入口） -->
    <div v-if="userStore.loginDialogVisible" class="dialog-mask" @click.self="userStore.closeLoginDialog()">
      <div class="dialog">
        <h3 class="dialog-title">登录海大工坊</h3>
        <input v-model="loginForm.uid" class="input dialog-input" placeholder="UID" />
        <input v-model="loginForm.password" class="input dialog-input" type="password" placeholder="密码" @keyup.enter="handleLogin" />
        <button class="btn dialog-btn" :disabled="loginLoading" @click="handleLogin">{{ loginLoading ? '登录中…' : '登录' }}</button>
        <div class="qr-entry">
          <div class="qr-box">小程序码</div>
          <p class="qr-tip">使用微信扫一扫，快捷登录</p>
        </div>
        <p v-if="loginError" class="dialog-error">{{ loginError }}</p>
      </div>
    </div>

    <!-- 手机端底部 TabBar -->
    <nav class="tabbar">
      <router-link to="/home" class="tab"><span class="tab-icon">🏠</span><span>首页</span></router-link>
      <router-link to="/intro" class="tab"><span class="tab-icon">🏫</span><span>校园</span></router-link>
      <router-link to="/marketplace" class="tab"><span class="tab-icon">🛒</span><span>集市</span></router-link>
      <router-link to="/schedule" class="tab"><span class="tab-icon">📅</span><span>课表</span></router-link>
      <router-link to="/profile" class="tab"><span class="tab-icon">👤</span><span>我的</span></router-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './store/user'
import { authApi, userApi } from './api'

const userStore = useUserStore()
const router = useRouter()
const loginForm = reactive({ uid: '', password: '' })
const loginLoading = ref(false)
const loginError = ref('')

async function handleLogin() {
  if (!loginForm.uid || !loginForm.password) { loginError.value = '请输入 UID 和密码'; return }
  loginLoading.value = true; loginError.value = ''
  try {
    const res = await authApi.login(loginForm.uid, loginForm.password)
    userStore.setToken(res.data.accessToken)
    await loadProfile()
    userStore.closeLoginDialog()
    router.push('/home')
  } catch (e: any) {
    loginError.value = e?.message || '登录失败，请检查 UID 和密码'
  } finally {
    loginLoading.value = false
  }
}

async function loadProfile() {
  try { const res = await userApi.profile(); userStore.setUserInfo(res.data) } catch { /* 未登录时忽略 */ }
}
if (userStore.isLoggedIn && !userStore.userInfo) loadProfile()
</script>
<style scoped>
/* 顶部导航（电脑端） */
.topbar { position: sticky; top: 0; z-index: 20; background: var(--neutral-0); border-bottom: 1px solid var(--neutral-200); }
.topbar-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; gap: 24px; padding: 0 16px; height: 56px; }
.brand { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: var(--neutral-900); }
.brand-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-500); }
.topnav { display: flex; gap: 4px; flex: 1; overflow-x: auto; }
.topnav a { padding: 6px 12px; border-radius: var(--radius-md); color: var(--neutral-600); font-size: 14px; white-space: nowrap; }
.topnav a:hover { color: var(--primary-500); background: var(--primary-50); }
.topnav a.router-link-active { color: var(--primary-500); font-weight: 500; }
.user-chip { padding: 6px 12px; border-radius: var(--radius-full); background: var(--primary-50); color: var(--primary-500); font-size: 14px; }

/* 登录弹窗 */
.dialog-mask { position: fixed; inset: 0; z-index: 50; background: rgba(17, 24, 39, 0.45); display: flex; align-items: center; justify-content: center; }
.dialog { width: 320px; background: var(--neutral-0); border-radius: var(--radius-xl); padding: 24px; box-shadow: var(--shadow-float); }
.dialog-title { margin: 0 0 16px; font-size: 18px; font-weight: 600; text-align: center; }
.dialog-input { display: block; width: 100%; margin-bottom: 12px; }
.dialog-btn { width: 100%; }
.dialog-error { margin: 8px 0 0; font-size: 12px; color: var(--danger); text-align: center; }
.qr-entry { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--neutral-200); text-align: center; }
.qr-box { width: 96px; height: 96px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); color: var(--neutral-400); font-size: 12px; }
.qr-tip { margin: 0; font-size: 12px; color: var(--neutral-500); }

/* 底部 TabBar（手机端，电脑端隐藏） */
.tabbar { display: none; }

@media (max-width: 768px) {
  .topbar { display: none; }
  .tabbar {
    display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
    background: var(--neutral-0); border-top: 1px solid var(--neutral-200);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0 6px; color: var(--neutral-500); font-size: 11px; }
  .tab-icon { font-size: 20px; line-height: 24px; }
  .tab.router-link-active { color: var(--primary-500); font-weight: 500; }
}
</style>
