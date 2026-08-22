<template>
  <div class="login-wrap">
    <div class="login-card">
      <h1 class="title">海大工坊</h1>
      <p class="sub">使用 UID 和密码登录网页端</p>
      <input v-model="uid" class="input field" placeholder="UID" @keyup.enter="handleLogin" />
      <input v-model="password" class="input field" type="password" placeholder="密码" @keyup.enter="handleLogin" />
      <button class="btn login-btn" :disabled="loading" @click="handleLogin">{{ loading ? '登录中…' : '登 录' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="divider"><span>其他登录方式</span></div>
      <div class="qr-box">小程序码</div>
      <p class="tip">未注册用户请使用微信小程序授权登录</p>
      <router-link to="/home" class="back">先逛逛 →</router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { authApi, userApi } from '../api'

const uid = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

async function handleLogin() {
  if (!uid.value || !password.value) { error.value = '请输入 UID 和密码'; return }
  loading.value = true; error.value = ''
  try {
    const res = await authApi.login(uid.value, password.value)
    userStore.setToken(res.data.accessToken)
    try { const p = await userApi.profile(); userStore.setUserInfo(p.data) } catch { /* 忽略 */ }
    router.push('/home')
  } catch (e: any) {
    error.value = e?.message || '登录失败，请检查 UID 和密码'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.login-wrap { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 24px 16px; }
.login-card { width: 360px; max-width: 100%; background: var(--neutral-0); border-radius: var(--radius-xl); box-shadow: var(--shadow-card); padding: 32px 28px; text-align: center; }
.title { margin: 0; font-size: 26px; font-weight: 600; color: var(--primary-500); }
.sub { margin: 6px 0 20px; font-size: 13px; color: var(--neutral-500); }
.field { display: block; width: 100%; margin-bottom: 12px; text-align: left; }
.login-btn { width: 100%; }
.error { margin: 8px 0 0; font-size: 12px; color: var(--danger); }
.divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 12px; color: var(--neutral-400); font-size: 12px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--neutral-200); }
.qr-box { width: 110px; height: 110px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: var(--radius-md); color: var(--neutral-400); font-size: 13px; }
.tip { margin: 0; font-size: 12px; color: var(--neutral-500); }
.back { display: inline-block; margin-top: 14px; font-size: 13px; }
</style>
