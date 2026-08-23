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
    },
    {
      path: 'analysis',
      name: 'DashboardAnalysis',
      component: '/dashboard/analysis/index',
      meta: {
        title: '分析仪表',
        icon: 'ri:bar-chart-2-line',
        keepAlive: false
      }
    }
    // 精简版：控制台 + 二手集市分析 + 分析仪表（演示仪表盘已删除）
  ]
}
