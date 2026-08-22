<template>
  <div class="container narrow">
    <div class="page-header"><h2 class="page-title">个人中心</h2></div>

    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="card center">
      <p class="tip">登录后可管理个人信息、通知与隐私设置</p>
      <button class="btn" @click="userStore.openLoginDialog()">登录</button>
    </div>

    <!-- 已登录：资料卡 -->
    <template v-else>
      <div class="card">
        <div class="profile-head">
          <span class="avatar">{{ (userStore.userInfo?.nickname || '友').slice(0, 1) }}</span>
          <div>
            <div class="nickname">{{ userStore.userInfo?.nickname || '海大用户' }}</div>
            <div class="uid num">UID：{{ userStore.userInfo?.uid || '-' }}</div>
          </div>
        </div>
        <div class="rows">
          <div class="list-item"><span>身份</span><span class="tag">{{ identityText }}</span></div>
          <div class="list-item"><span>认证状态</span><span class="tag" :class="authClass">{{ authText }}</span></div>
          <div class="list-item"><span>积分</span><span class="num strong">{{ userStore.userInfo?.points ?? 0 }}</span></div>
          <div class="list-item"><span>邮箱</span><span class="num">{{ userStore.userInfo?.email || '-' }}</span></div>
          <div class="list-item"><span>QQ</span><span class="num">{{ userStore.userInfo?.qq || '-' }}</span></div>
        </div>
      </div>
      <div class="card center">
        <button class="btn btn-plain" @click="handleLogout">退出登录</button>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { userApi } from '../api'

const userStore = useUserStore()
const router = useRouter()

const identityText = computed(() => ({ freshman: '新生', undergrad: '本科生', grad: '研究生' } as any)[userStore.userInfo?.identity] || '未设置')
const authText = computed(() => ({ unverified: '未认证', pending: '待审核', verified: '已认证' } as any)[userStore.userInfo?.authStatus] || '未认证')
const authClass = computed(() => (userStore.userInfo?.authStatus === 'verified' ? 'tag-mint' : ''))

async function handleLogout() {
  userStore.logout()
  router.push('/home')
}

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  try { const res = await userApi.profile(); userStore.setUserInfo(res.data) } catch { /* 忽略 */ }
})
</script>
<style scoped>
.narrow { max-width: 720px; }
.center { text-align: center; }
.tip { color: var(--neutral-500); margin: 8px 0 16px; }
.profile-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--primary-50); color: var(--primary-500); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; }
.nickname { font-size: 18px; font-weight: 600; color: var(--neutral-900); }
.uid { font-size: 12px; color: var(--neutral-500); }
.rows { border-top: 1px solid var(--neutral-100); }
.strong { font-weight: 600; color: var(--neutral-900); }
</style>
