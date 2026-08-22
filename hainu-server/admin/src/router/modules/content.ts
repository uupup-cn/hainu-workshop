import { AppRouteRecord } from '@/types/router'

export const contentRoutes: AppRouteRecord = {
  path: '/content',
  name: 'Content',
  component: '/index/index',
  meta: {
    title: 'menus.content.title',
    icon: 'ri:newspaper-line'
  },
  children: [
    {
      path: 'content-list',
      name: 'ContentList',
      component: '/content/list',
      meta: {
        title: 'menus.content.contentList',
        icon: 'ri:layout-grid-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' },
          { title: '发布', authMark: 'publish' },
          { title: '下线', authMark: 'offline' },
          { title: '预览', authMark: 'preview' }
        ]
      }
    },
    {
      path: 'detail/:id',
      name: 'ContentDetail',
      component: '/content/detail',
      meta: {
        title: 'menus.content.contentDetail',
        isHide: true,
        keepAlive: false,
        activePath: '/content/content-list'
      }
    },
    {
      path: 'category',
      name: 'ContentCategory',
      component: '/content/category',
      meta: {
        title: 'menus.content.category',
        icon: 'ri:folder-chart-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' }
        ]
      }
    },
    {
      path: 'tag',
      name: 'ContentTag',
      component: '/content/tag',
      meta: {
        title: 'menus.content.tag',
        icon: 'ri:price-tag-3-line',
        keepAlive: true,
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' }
        ]
      }
    },
    {
      path: 'recycle',
      name: 'ContentRecycle',
      component: '/content/recycle',
      meta: {
        title: 'menus.content.recycle',
        icon: 'ri:delete-bin-6-line',
        keepAlive: false,
        authList: [
          { title: '恢复', authMark: 'restore' },
          { title: '彻底删除', authMark: 'purge' }
        ]
      }
    }
  ]
}
