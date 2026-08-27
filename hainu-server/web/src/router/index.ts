import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAuth } from '@/composables/useAuth'

declare module 'vue-router' {
  interface RouteMeta {
    zone?: 'visitor' | 'freshman' | 'student' | 'shared'
    requiresAuth?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'visitor', component: () => import('@/views/VisitorHome.vue'), meta: { zone: 'visitor', title: '首页' } },
  { path: '/home', redirect: '/' },
  { path: '/launch', name: 'launch', component: () => import('@/views/Launch.vue'), meta: { zone: 'shared', title: '开学倒计时' } },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue'), meta: { zone: 'shared', title: '登录' } },

  // 专区（登录后按身份跳转）
  { path: '/freshman', name: 'freshman', component: () => import('@/views/zones/FreshmanZone.vue'), meta: { zone: 'freshman', requiresAuth: true, title: '新生专区' } },
  { path: '/student', name: 'student', component: () => import('@/views/zones/StudentZone.vue'), meta: { zone: 'student', requiresAuth: true, title: '在校生专区' } },

  // 新生模块（叶子页 path 不变，保深链）
  { path: '/guide', name: 'guide', component: () => import('@/views/freshman/Guide.vue'), meta: { zone: 'freshman', title: '入学指南' } },
  { path: '/guide/:key', name: 'guideDetail', component: () => import('@/views/freshman/GuideDetail.vue'), meta: { zone: 'freshman', title: '指南详情' } },
  { path: '/life', name: 'life', component: () => import('@/views/freshman/Life.vue'), meta: { zone: 'freshman', title: '生活攻略' } },
  { path: '/life/:campus', name: 'lifeTopics', component: () => import('@/views/freshman/LifeTopics.vue'), meta: { zone: 'freshman', title: '生活主题' } },
  { path: '/life-detail/:key', name: 'lifeDetail', component: () => import('@/views/freshman/LifeDetail.vue'), meta: { zone: 'freshman', title: '主题详情' } },
  { path: '/faq', name: 'faq', component: () => import('@/views/freshman/Faq.vue'), meta: { zone: 'freshman', title: 'FAQ' } },
  { path: '/roommate', name: 'roommate', component: () => import('@/views/freshman/Roommate.vue'), meta: { zone: 'freshman', title: '找室友' } },

  // 智慧海大
  { path: '/intro', name: 'intro', component: () => import('@/views/Intro.vue'), meta: { zone: 'student', title: '海大介绍' } },
  { path: '/phonebook', name: 'phonebook', component: () => import('@/views/Phonebook.vue'), meta: { zone: 'student', title: '电话簿' } },
  { path: '/calendar', name: 'calendar', component: () => import('@/views/Calendar.vue'), meta: { zone: 'student', title: '校历' } },
  { path: '/map', name: 'map', component: () => import('@/views/wise/Map.vue'), meta: { zone: 'student', title: '校园地图' } },
  { path: '/bus', name: 'bus', component: () => import('@/views/Bus.vue'), meta: { zone: 'student', title: '校园出行' } },

  // 社区模块
  { path: '/marketplace', name: 'marketplace', component: () => import('@/views/Marketplace.vue'), meta: { zone: 'student', title: '二手集市' } },
  { path: '/news', name: 'news', component: () => import('@/views/News.vue'), meta: { zone: 'student', title: '快讯' } },
  { path: '/alumni', name: 'alumni', component: () => import('@/views/Alumni.vue'), meta: { zone: 'student', title: '校友圈' } },

  // 课表模块
  { path: '/schedule', name: 'schedule', component: () => import('@/views/Schedule.vue'), meta: { zone: 'student', title: '我的课表' } },

  // 工具箱
  { path: '/tools', name: 'tools', component: () => import('@/views/tools/Tools.vue'), meta: { zone: 'student', title: '工具箱' } },
  { path: '/tools/:key', name: 'toolPage', component: () => import('@/views/tools/ToolPage.vue'), meta: { zone: 'student', title: '工具' } },

  // 个人中心
  { path: '/profile', name: 'profile', component: () => import('@/views/Profile.vue'), meta: { zone: 'student', title: '个人中心' } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const { ensureProfile, identityZone } = useAuth()

  // 已登录但用户信息缺失时先补全（用于按身份跳转判断）
  if (userStore.isLoggedIn && !userStore.userInfo?.uid) {
    await ensureProfile()
  }

  // 已登录访问登录页 → 跳对应专区
  if (to.path === '/login' && userStore.isLoggedIn) {
    return { path: identityZone() }
  }
  // 需鉴权但未登录 → 弹登录弹窗并回访客首页
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    userStore.openLoginDialog()
    return { path: '/' }
  }
  // 登录后仍可访问访客首页（首页不限制），仅登录动作自动跳专区
  return true
})

export default router
