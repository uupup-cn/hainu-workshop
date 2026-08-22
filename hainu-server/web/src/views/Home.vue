<template>
  <div class="container">
    <!-- 品牌横幅 -->
    <div class="hero card">
      <h1 class="hero-title">海大工坊</h1>
      <p class="hero-sub">海南大学校园工具一站式入口 · 新生指南 / 校园生活 / 二手集市 / 课程表</p>
      <button v-if="!userStore.isLoggedIn" class="btn hero-btn" @click="userStore.openLoginDialog()">登录后使用完整功能</button>
    </div>

    <!-- 功能宫格 -->
    <div class="grid">
      <div v-for="item in menus" :key="item.path" class="card cell" @click="router.push(item.path)">
        <span class="cell-icon">{{ item.icon }}</span>
        <span class="cell-label">{{ item.label }}</span>
        <span class="cell-desc">{{ item.desc }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()
const menus = [
  { icon: '🏫', label: '海大介绍', desc: '概况 / 校区 / 院系', path: '/intro' },
  { icon: '📞', label: '电话簿', desc: '校园服务电话', path: '/phonebook' },
  { icon: '📅', label: '校历', desc: '学期安排', path: '/calendar' },
  { icon: '🚌', label: '校园出行', desc: '班车 / 车站', path: '/bus' },
  { icon: '🛒', label: '二手集市', desc: '好物淘换', path: '/marketplace' },
  { icon: '📰', label: '快讯', desc: '校园通知', path: '/news' },
  { icon: '💬', label: '校友圈', desc: '帖子 / 表白墙', path: '/alumni' },
  { icon: '🗓', label: '我的课表', desc: '周视图查看', path: '/schedule' },
]
</script>
<style scoped>
.hero { background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); color: #fff; padding: 32px 24px; }
.hero-title { margin: 0 0 8px; font-size: 28px; font-weight: 600; }
.hero-sub { margin: 0 0 16px; font-size: 14px; opacity: 0.9; }
.hero-btn { background: #fff; color: var(--primary-700); }
.hero-btn:hover { background: var(--primary-50); }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cell { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.cell:hover { box-shadow: var(--shadow-float); transform: translateY(-2px); }
.cell-icon { font-size: 28px; line-height: 34px; }
.cell-label { font-size: 16px; font-weight: 600; color: var(--neutral-900); }
.cell-desc { font-size: 12px; color: var(--neutral-500); }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .hero { padding: 24px 16px; }
}
</style>
