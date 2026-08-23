import { AppRouteRecord } from '@/types/router'
export const freshmanRoutes: AppRouteRecord = {
  path: '/freshman', name: 'Freshman', component: '/index/index',
  meta: { title: '新生模块', icon: 'ri:graduation-cap-line' },
  children: [
    { path: 'guide', name: 'FreshmanGuide', component: '/freshman/guide/index', meta: { title: '入学指南', icon: 'ri:file-list-2-line', keepAlive: true } },
    { path: 'life', name: 'FreshmanLife', component: '/freshman/life/index', meta: { title: '生活攻略', icon: 'ri:restaurant-line', keepAlive: true } },
    { path: 'faq/category', name: 'FreshmanFaqCategory', component: '/freshman/faq-category/index', meta: { title: '分类管理', icon: 'ri:folder-line', keepAlive: true } },
    { path: 'faq/question', name: 'FreshmanFaqQuestion', component: '/freshman/faq-question/index', meta: { title: '问题管理', icon: 'ri:question-line', keepAlive: true } },
    { path: 'roommate', name: 'FreshmanRoommate', component: '/freshman/roommate/index', meta: { title: '找室友', icon: 'ri:user-add-line', keepAlive: true } }
  ]
}
