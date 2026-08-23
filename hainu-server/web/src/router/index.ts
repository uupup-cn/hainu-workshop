import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/launch', component: () => import('../views/Launch.vue') },
  { path: '/home', component: () => import('../views/Home.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  // 新生模块
  { path: '/guide', component: () => import('../views/freshman/Guide.vue') },
  { path: '/guide/:key', component: () => import('../views/freshman/GuideDetail.vue') },
  { path: '/life', component: () => import('../views/freshman/Life.vue') },
  { path: '/life/:campus', component: () => import('../views/freshman/LifeTopics.vue') },
  { path: '/life-detail/:key', component: () => import('../views/freshman/LifeDetail.vue') },
  { path: '/faq', component: () => import('../views/freshman/Faq.vue') },
  { path: '/roommate', component: () => import('../views/freshman/Roommate.vue') },
  // 智慧海大
  { path: '/intro', component: () => import('../views/Intro.vue') },
  { path: '/phonebook', component: () => import('../views/Phonebook.vue') },
  { path: '/calendar', component: () => import('../views/Calendar.vue') },
  { path: '/map', component: () => import('../views/wise/Map.vue') },
  { path: '/bus', component: () => import('../views/Bus.vue') },
  // 社区模块
  { path: '/marketplace', component: () => import('../views/Marketplace.vue') },
  { path: '/news', component: () => import('../views/News.vue') },
  { path: '/alumni', component: () => import('../views/Alumni.vue') },
  // 课表模块
  { path: '/schedule', component: () => import('../views/Schedule.vue') },
  // 工具箱
  { path: '/tools', component: () => import('../views/tools/Tools.vue') },
  { path: '/tools/:key', component: () => import('../views/tools/ToolPage.vue') },
  // 个人中心
  { path: '/profile', component: () => import('../views/Profile.vue') },
]
const router = createRouter({ history: createWebHistory(), routes })
export default router
