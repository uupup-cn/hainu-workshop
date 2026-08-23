import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
// import { templateRoutes } from './template'
// import { widgetsRoutes } from './widgets'
import { systemRoutes } from './system'
// import { devToolsRoutes } from './dev-tools'
import { monitorRoutes } from './monitor'
import { notificationRoutes } from './notification'
// import { schedulerRoutes } from './scheduler'
// import { workflowRoutes } from './workflow'
// import { contentRoutes } from './content'
// import { mallRoutes } from './mall'
// import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'
// import { helpRoutes } from './help'
import { wiseRoutes } from './wise'
import { freshmanRoutes } from './freshman'
import { communityRoutes } from './community'
import { scheduleRoutes } from './schedule'
import { toolModuleRoutes } from './tool-module'

/**
 * 导出所有模块化路由（工具箱精简版）
 * 保留：仪表盘(数据大屏+控制台)、工具箱管理、系统管理、内容管理、文件中心、运维与审计、异常页面
 * 临时隐藏：商城、工作流、模板、组件演示、开发工具、监控、调度、结果页、帮助
 * 文件保留，等待最终确认后再删除
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  wiseRoutes,
  freshmanRoutes,
  communityRoutes,
  scheduleRoutes,
  toolModuleRoutes,
  // devToolsRoutes,
  // templateRoutes,
  // widgetsRoutes,
  ...monitorRoutes,
  ...notificationRoutes,
  // ...schedulerRoutes,
  // ...workflowRoutes,
  // contentRoutes, // 模板内容管理（文章/分类/标签）后端无对应接口，菜单为死链，停用待移除
  // mallRoutes,
  // resultRoutes,
  exceptionRoutes,
  // ...helpRoutes
]
