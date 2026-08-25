import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取监控概览数据
 *
 * 后端 `monitor/overview` 返回的 `systemResource` 中 `storage`、`network` 可能为 `null`
 * （os 模块在某些环境下采集不到磁盘/网卡数据），而页面会访问
 * `systemResource.storage.disks`、`systemResource.network.upInterfaceCount` 等字段，
 * 直接使用会导致白屏。这里在 API 层做一次结构归一化，把可能为 null 的子对象补齐为
 * 空结构，确保页面始终能正常渲染（即使数据为空也显示"暂无采样"而非报错）。
 */
export async function fetchMonitorOverview() {
  const response = await request.get<Api.Monitor.OverviewResponse>({
    url: '/api/v1/monitor/overview',
    permissionCode: ApiPermissionCode.MONITOR.OVERVIEW
  })

  if (!response) return response

  const resource = response.systemResource
  const safeStorage = resource?.storage ?? {
    totalBytes: 0,
    usedBytes: 0,
    freeBytes: 0,
    usagePercent: 0,
    disks: []
  }
  const safeNetwork = resource?.network ?? {
    interfaceCount: 0,
    upInterfaceCount: 0,
    publicIpv4: [],
    totalRxBytes: 0,
    totalTxBytes: 0,
    interfaces: []
  }
  const safeHealth = resource?.health ?? { score: 0, level: 'GOOD', warnings: [] }
  const safeCpu = resource?.cpu ?? {
    model: '',
    cores: 0,
    usagePercent: 0,
    loadAverage: []
  }
  const safeMemory = resource?.memory ?? {
    totalBytes: 0,
    usedBytes: 0,
    freeBytes: 0,
    usagePercent: 0
  }
  const safeProcess = resource?.process ?? {
    pid: 0,
    uptimeSeconds: 0,
    rssBytes: 0,
    heapUsedBytes: 0,
    heapTotalBytes: 0
  }

  return {
    ...response,
    summary: response.summary ?? {
      totalUsers: 0,
      activeSessionCount: 0,
      idleSessionCount: 0,
      uniqueOnlineUserCount: 0,
      totalSessionCount: 0,
      todayLoginSuccessCount: 0,
      todayLoginFailCount: 0,
      todayRefreshCount: 0,
      todayOperationCount: 0,
      enabledTaskCount: 0,
      systemParamCount: 0,
      securityLevel: 'LOW',
      generatedAt: new Date().toISOString()
    },
    loginTrend: Array.isArray(response.loginTrend) ? response.loginTrend : [],
    recentSessions: Array.isArray(response.recentSessions) ? response.recentSessions : [],
    recentLogins: Array.isArray(response.recentLogins) ? response.recentLogins : [],
    systemResource: resource
      ? {
          ...resource,
          health: safeHealth,
          cpu: safeCpu,
          memory: safeMemory,
          storage: safeStorage,
          network: safeNetwork,
          process: safeProcess
        }
      : response.systemResource,
    cache: response.cache
  }
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
