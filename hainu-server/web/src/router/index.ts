import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../views/Home.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/intro', component: () => import('../views/Intro.vue') },
  { path: '/phonebook', component: () => import('../views/Phonebook.vue') },
  { path: '/calendar', component: () => import('../views/Calendar.vue') },
  { path: '/bus', component: () => import('../views/Bus.vue') },
  { path: '/marketplace', component: () => import('../views/Marketplace.vue') },
  { path: '/news', component: () => import('../views/News.vue') },
  { path: '/alumni', component: () => import('../views/Alumni.vue') },
  { path: '/schedule', component: () => import('../views/Schedule.vue') },
  { path: '/profile', component: () => import('../views/Profile.vue') },
]
const router = createRouter({ history: createWebHistory(), routes })
export default router
