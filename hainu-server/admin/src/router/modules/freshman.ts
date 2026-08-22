import { AppRouteRecord } from '@/types/router'
export const freshmanRoutes: AppRouteRecord = {
  path: '/freshman', name: 'Freshman', component: '/index/index',
  meta: { title: '新生模块', icon: 'ri:graduation-cap-line' },
  children: [
    { path: 'guide', name: 'FreshmanGuide', component: '/freshman/guide/index', meta: { title: '入学指南', icon: 'ri:file-list-2-line', keepAlive: true } },
    { path: 'life', name: 'FreshmanLife', component: '/freshman/life/index', meta: { title: '生活攻略', icon: 'ri:restaurant-line', keepAlive: true } },
    { path: 'faq', name: 'FreshmanFaq', component: '/freshman/faq/index', meta: { title: '新生FAQ', icon: 'ri:question-line', keepAlive: true } },
    { path: 'roommate', name: 'FreshmanRoommate', component: '/freshman/roommate/index', meta: { title: '找室友', icon: 'ri:user-add-line', keepAlive: true } }
  ]
}
