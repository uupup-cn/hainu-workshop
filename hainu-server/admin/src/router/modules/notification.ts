import { AppRouteRecord } from '@/types/router'

export const notificationRoutes: AppRouteRecord[] = [
  {
    path: '/notification',
    name: 'Notification',
    component: '/index/index',
    meta: {
      title: 'menus.notification.title',
      icon: 'ri:notification-3-line'
    },
    children: [
      {
        path: 'manage',
        name: 'NotificationManage',
        component: '/system/notification',
        meta: {
          title: 'menus.notification.manage',
          icon: 'ri:notification-3-line',
          keepAlive: true,
          authList: [
            { title: '新增', authMark: 'add' },
            { title: '复制', authMark: 'copy' },
            { title: '编辑', authMark: 'edit' },
            { title: '删除', authMark: 'delete' },
            { title: '发布', authMark: 'publish' },
            { title: '撤回', authMark: 'revoke' },
            { title: '查看', authMark: 'view' }
          ]
        }
      },
      {
        path: 'inbox',
        name: 'NotificationInbox',
        component: '/system/notification/inbox',
        meta: {
          title: 'menus.notification.inbox',
          icon: 'ri:inbox-line',
          keepAlive: true,
          isHide: true,
          activePath: '/notification/inbox'
        }
      },
      {
        path: 'detail/:id',
        name: 'NotificationDetail',
        component: '/system/notification/detail',
        meta: {
          title: 'menus.notification.detail',
          icon: 'ri:file-text-line',
          keepAlive: false,
          isHide: true,
          isHideTab: true,
          activePath: '/notification/manage'
        }
      }
    ]
  }
]
