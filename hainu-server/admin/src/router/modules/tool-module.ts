import { AppRouteRecord } from '@/types/router'
export const toolModuleRoutes: AppRouteRecord = {
  path: '/tool-module', name: 'ToolModule', component: '/index/index',
  meta: { title: '工具模块', icon: 'ri:tools-line' },
  children: [
    { path: 'manage', name: 'ToolManage', component: '/tool/manage/index', meta: { title: '工具管理', icon: 'ri:hammer-line', keepAlive: true } },
    { path: 'category', name: 'ToolCategory', component: '/tool/category/index', meta: { title: '分类管理', icon: 'ri:folder-line', keepAlive: true } },
    { path: 'usage-log', name: 'ToolUsageLog', component: '/tool/usage-log/index', meta: { title: '使用记录', icon: 'ri:bar-chart-line', keepAlive: true } },
    { path: 'video-parse', name: 'ToolVideoParse', component: '/tool/video-parse/index', meta: { title: '影视解析配置', icon: 'ri:film-line', keepAlive: true } }
  ]
}
