import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { systemRoutes } from './system'
import { monitorRoutes } from './monitor'
import { notificationRoutes } from './notification'
import { exceptionRoutes } from './exception'
import { wiseRoutes } from './wise'
import { freshmanRoutes } from './freshman'
import { communityRoutes } from './community'
import { scheduleRoutes } from './schedule'
import { toolModuleRoutes } from './tool-module'

/**
 * 导出所有模块化路由（工具箱精简版）
 * 保留：仪表盘、智慧海大、新生模块、社区模块、课表模块、工具模块、系统管理、运维与审计、异常页面
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  wiseRoutes,
  freshmanRoutes,
  communityRoutes,
  scheduleRoutes,
  toolModuleRoutes,
  ...monitorRoutes,
  ...notificationRoutes,
  exceptionRoutes
]
