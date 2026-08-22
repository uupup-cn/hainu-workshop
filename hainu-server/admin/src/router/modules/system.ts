import { AppRouteRecord } from '@/types/router'

export const systemRoutes: AppRouteRecord = {
  path: '/system',
  name: 'System',
  component: '/index/index',
  meta: {
    title: 'menus.system.title',
    icon: 'ri:user-3-line'
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: '/system/user',
      meta: {
        title: 'menus.system.user',
        icon: 'ri:user-line',
        keepAlive: true
      }
    },
    {
      path: 'role',
      name: 'Role',
      component: '/system/role',
      meta: {
        title: 'menus.system.role',
        icon: 'ri:user-settings-line',
        keepAlive: true
      }
    },
    {
      path: 'department',
      name: 'Department',
      component: '/system/department',
      meta: {
        title: 'menus.system.department',
        icon: 'ri:building-line',
        keepAlive: true
      }
    },
    {
      path: 'post',
      name: 'Post',
      component: '/system/post',
      meta: {
        title: 'menus.system.post',
        icon: 'ri:briefcase-4-line',
        keepAlive: true
      }
    },
    {
      path: 'dict',
      name: 'Dict',
      component: '/system/dict',
      meta: {
        title: 'menus.system.dict',
        icon: 'ri:book-2-line',
        keepAlive: true
      }
    },
    {
      path: 'site-setting',
      name: 'SiteSetting',
      component: '/system/site-setting',
      meta: {
        title: 'menus.system.siteSetting',
        icon: 'ri:global-line',
        keepAlive: true,
        authList: [{ title: '编辑', authMark: 'edit' }]
      }
    },
    {
      path: 'system-param',
      name: 'SystemParam',
      component: '/system/system-param',
      meta: {
        title: 'menus.system.systemParam',
        icon: 'ri:settings-3-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' },
          { title: '刷新缓存', authMark: 'refresh' }
        ]
      }
    },
    {
      path: 'file-center',
      name: 'FileCenter',
      component: '/system/file-center',
      meta: {
        title: 'menus.system.fileCenter',
        icon: 'ri:folder-shield-2-line',
        keepAlive: true,
        authList: [
          { title: '上传', authMark: 'upload' },
          { title: '下载', authMark: 'download' },
          { title: '移动', authMark: 'move' },
          { title: '删除', authMark: 'delete' },
          { title: '公开链接', authMark: 'publicLink' },
          { title: '新建目录', authMark: 'createFolder' }
        ]
      }
    },
    {
      path: 'user-center',
      name: 'UserCenter',
      component: '/system/user-center',
      meta: {
        title: 'menus.system.userCenter',
        icon: 'ri:user-line',
        isHide: true,
        keepAlive: true,
        isHideTab: true
      }
    },
    {
      path: 'menu',
      name: 'Menus',
      component: '/system/menu',
      meta: {
        title: 'menus.system.menu',
        icon: 'ri:menu-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' }
        ]
      }
    },
    {
      path: 'operation-log',
      name: 'OperationLog',
      component: '/system/operation-log',
      meta: {
        title: 'menus.system.operationLog',
        icon: 'ri:file-list-3-line',
        keepAlive: true
      }
    },
    {
      path: 'login-log',
      name: 'LoginLog',
      component: '/system/login-log',
      meta: {
        title: 'menus.system.loginLog',
        icon: 'ri:shield-user-line',
        keepAlive: true
      }
    },
    {
      path: 'feedback',
      name: 'Feedback',
      component: '/system/feedback',
      meta: {
        title: 'menus.system.feedback',
        icon: 'ri:message-2-line',
        keepAlive: true,
        authList: [
          { title: '查看', authMark: 'view' },
          { title: '处理', authMark: 'handle' }
        ]
      }
    },
    {
      path: 'visitor-analytics',
      name: 'SystemVisitorAnalytics',
      component: '/system/visitor-analytics',
      meta: {
        title: 'menus.system.visitorAnalytics',
        icon: 'ri:user-search-line',
        keepAlive: true
      }
    }
  ]
}
