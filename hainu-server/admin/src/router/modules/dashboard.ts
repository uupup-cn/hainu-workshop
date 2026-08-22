import { AppRouteRecord } from '@/types/router'

export const dashboardRoutes: AppRouteRecord = {
  name: 'Dashboard',
  path: '/dashboard',
  component: '/index/index',
  meta: {
    title: 'menus.dashboard.title',
    icon: 'ri:pie-chart-line'
  },
  children: [
    {
      path: 'operation-overview',
      name: 'DataScreenOperationOverview',
      component: '/data-screen/operation-overview',
      meta: {
        title: 'menus.dataScreen.operationOverview',
        icon: 'ri:pie-chart-2-line',
        keepAlive: false,
        fixedTab: true,
        isFullPage: true
      }
    },
    {
      path: 'console',
      name: 'Console',
      component: '/dashboard/console',
      meta: {
        title: 'menus.dashboard.console',
        icon: 'ri:home-smile-2-line',
        keepAlive: false
      }
    },
    {
      path: 'marketplace-analytics',
      name: 'MarketplaceAnalytics',
      component: '/dashboard/marketplace-analytics/index',
      meta: {
        title: '二手集市分析',
        icon: 'ri:shopping-cart-2-line',
        keepAlive: false
      }
    }
    // 精简版：仅保留数据大屏(运营概览)和控制台
    // analysis, ecommerce, analytics, hrm, jobs, sales, crm, social-media, crypto
  ]
}
