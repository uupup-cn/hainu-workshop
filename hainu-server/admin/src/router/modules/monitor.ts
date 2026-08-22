import { AppRouteRecord } from '@/types/router'

export const monitorRoutes: AppRouteRecord[] = [
  {
    path: '/monitor',
    name: 'Monitor',
    component: '/index/index',
    meta: {
      title: 'menus.monitor.title',
      icon: 'ri:pulse-line'
    },
    children: [
      {
        path: 'overview',
        name: 'MonitorOverview',
        component: '/monitor/index',
        meta: {
          title: 'menus.monitor.overview',
          icon: 'ri:dashboard-horizontal-line',
          keepAlive: true
        }
      },
      {
        path: 'online-user',
        name: 'OnlineUser',
        component: '/monitor/online-user',
        meta: {
          title: 'menus.monitor.onlineUser',
          icon: 'ri:user-shared-line',
          keepAlive: true,
          authList: [
            { title: '查看', authMark: 'view' },
            { title: '强制下线', authMark: 'forceLogout' }
          ]
        }
      },
      {
        path: 'server',
        name: 'MonitorServer',
        component: '/monitor/server',
        meta: {
          title: 'menus.monitor.server',
          icon: 'ri:server-line',
          keepAlive: true
        }
      },
      {
        path: 'cache',
        name: 'CacheMonitor',
        component: '/monitor/cache',
        meta: {
          title: 'menus.monitor.cache',
          icon: 'ri:database-2-line',
          keepAlive: true,
          authList: [
            { title: '查看', authMark: 'view' },
            { title: '刷新', authMark: 'refresh' }
          ]
        }
      },
      {
        path: 'security-audit',
        name: 'SecurityAudit',
        component: '/monitor/security-audit',
        meta: {
          title: 'menus.monitor.securityAudit',
          icon: 'ri:alarm-warning-line',
          keepAlive: true,
          authList: [
            { title: '查看', authMark: 'view' },
            { title: '编辑', authMark: 'edit' }
          ]
        }
      }
    ]
  }
]
