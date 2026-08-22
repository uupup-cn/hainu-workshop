import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取监控概览数据
 */
export function fetchMonitorOverview() {
  return request.get<Api.Monitor.OverviewResponse>({
    url: '/api/v1/monitor/overview',
    permissionCode: ApiPermissionCode.MONITOR.OVERVIEW
  })
}

/**
 * 获取访客分析数据
 */
export function fetchVisitorAnalytics(params: Api.Monitor.VisitorAnalyticsSearchParams) {
  return request.get<Api.Monitor.VisitorAnalyticsResponse>({
    url: '/api/v1/monitor/visitor-analytics',
    params,
    permissionCode: ApiPermissionCode.MONITOR.VISITOR_ANALYTICS_VIEW
  })
}

/**
 * 获取在线用户列表
 */
export function fetchOnlineUsers(params: Api.Monitor.OnlineUserSearchParams) {
  return request.get<Api.Monitor.OnlineUserListResponse>({
    url: '/api/v1/monitor/online-users',
    params,
    permissionCode: ApiPermissionCode.MONITOR.ONLINE_USER_LIST
  })
}

/**
 * 获取在线用户详情
 */
export function fetchOnlineUserDetail(sessionId: string) {
  return request.get<Api.Monitor.OnlineUserItem>({
    url: `/api/v1/monitor/online-users/${sessionId}`,
    permissionCode: ApiPermissionCode.MONITOR.ONLINE_USER_DETAIL
  })
}

/**
 * 强制下线在线用户
 */
export function fetchForceLogoutOnlineUsers(data: Api.Monitor.ForceLogoutPayload) {
  return request.post<Api.Identity.SessionActionResult>({
    url: '/api/v1/monitor/online-users/force-logout',
    data,
    permissionCode: ApiPermissionCode.MONITOR.ONLINE_USER_FORCE_LOGOUT,
    showSuccessMessage: false
  })
}

/**
 * 获取缓存监控数据
 */
export function fetchCacheMonitor() {
  return request.get<Api.Monitor.CacheOverview>({
    url: '/api/v1/monitor/cache',
    permissionCode: ApiPermissionCode.MONITOR.CACHE_VIEW
  })
}

/**
 * 获取系统资源监控数据
 */
export function fetchSystemResourceMonitor() {
  return request.get<Api.Monitor.SystemResourceOverview>({
    url: '/api/v1/monitor/system-resource',
    permissionCode: ApiPermissionCode.MONITOR.SYSTEM_RESOURCE_VIEW
  })
}

/**
 * 刷新缓存监控数据
 */
export function fetchRefreshCacheMonitor() {
  return request.post<{ status: string; message: string; refreshedAt: string }>({
    url: '/api/v1/monitor/cache/refresh',
    permissionCode: ApiPermissionCode.MONITOR.CACHE_REFRESH,
    showSuccessMessage: false
  })
}

/**
 * 按命名空间清理业务缓存
 */
export function fetchClearCacheNamespace(namespace: string) {
  return request.post<{
    namespace: string
    label: string
    deletedKeys: number
    clearedAt: string
  }>({
    url: '/api/v1/monitor/cache/clear',
    data: { namespace },
    permissionCode: ApiPermissionCode.MONITOR.CACHE_REFRESH,
    showSuccessMessage: false
  })
}
