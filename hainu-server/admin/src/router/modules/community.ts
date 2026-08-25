import { AppRouteRecord } from '@/types/router'
export const communityRoutes: AppRouteRecord = {
  path: '/community', name: 'Community', component: '/index/index',
  meta: { title: '社区模块', icon: 'ri:group-line' },
  children: [
    { path: 'marketplace-category', name: 'CommunityMarketCategory', component: '/community/marketplace-category/index', meta: { title: '分类管理', icon: 'ri:price-tag-3-line', keepAlive: true } },
    { path: 'marketplace-item', name: 'CommunityMarketItem', component: '/community/marketplace-item/index', meta: { title: '商品管理', icon: 'ri:shopping-bag-line', keepAlive: true } },
    { path: 'news', name: 'CommunityNews', component: '/community/news/index', meta: { title: '快讯管理', icon: 'ri:newspaper-line', keepAlive: true } },
    { path: 'alumni/posts', name: 'CommunityPosts', component: '/community/alumni/posts/index', meta: { title: '帖子管理', icon: 'ri:chat-1-line', keepAlive: true } },
    { path: 'alumni/confession', name: 'CommunityConfession', component: '/community/alumni/confession/index', meta: { title: '表白墙管理', icon: 'ri:heart-line', keepAlive: true } },
    { path: 'alumni/section', name: 'CommunitySection', component: '/community/alumni/section/index', meta: { title: '版块管理', icon: 'ri:layout-grid-line', keepAlive: true } },
    { path: 'lottery/activities', name: 'CommunityLotteryActivities', component: '/community/lottery/activities/index', meta: { title: '活动管理', icon: 'ri:gift-2-line', keepAlive: true } },
    { path: 'lottery/prizes', name: 'CommunityLotteryPrizes', component: '/community/lottery/prizes/index', meta: { title: '奖品配置', icon: 'ri:award-line', keepAlive: true } },
    { path: 'lottery/winners', name: 'CommunityLotteryWinners', component: '/community/lottery/winners/index', meta: { title: '中奖记录', icon: 'ri:trophy-line', keepAlive: true } }
  ]
}
