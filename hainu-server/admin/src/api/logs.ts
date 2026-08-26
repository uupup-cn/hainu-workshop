import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 标准化分页响应。
 *
 * 后端返回标准分页 `{ records, total, current, size }`，但部分历史接口/页面可能
 * 期望 `list` 字段。这里统一兜底：始终返回 `records` 数组与 `total` 数值，
 * 避免空列表或字段缺失时页面白屏（useTable 默认适配器虽支持多字段，仍在此收口）。
 */
function normalizeLogPage<T>(response: unknown): Api.Common.PaginatedResponse<T> {
  if (!response || typeof response !== 'object') {
    return { records: [], total: 0, current: 1, size: 20 }
  }
  const res = response as Record<string, unknown>
  const records = (Array.isArray(res.records)
    ? res.records
    : Array.isArray(res.list)
      ? res.list
      : Array.isArray(res.data)
        ? res.data
        : []) as T[]
  const total =
    typeof res.total === 'number' ? res.total : typeof res.count === 'number' ? res.count : records.length
  return {
    records,
    total,
    current: typeof res.current === 'number' ? res.current : 1,
    size: typeof res.size === 'number' ? res.size : 20
  }
}

/**
 * 获取操作日志列表
 */
export async function fetchOperationLogs(params: Api.Audit.OperationLogSearchParams) {
  const response = await request.get<Api.Audit.OperationLogList>({
    url: '/api/v1/logs/operation',
    params,
    
  })
  return normalizeLogPage<Api.Audit.OperationLogItem>(response)
}

/**
 * 获取操作日志详情
 */
export function fetchOperationLogDetail(id: number) {
  return request.get<Api.Audit.OperationLogItem>({
    url: `/api/v1/logs/operation/${id}`,
    
  })
}

/**
 * 导出操作日志
 */
export function fetchExportOperationLogs(params: Api.Audit.OperationLogSearchParams) {
  return request.get<Api.Audit.OperationLogItem[]>({
    url: '/api/v1/logs/operation/export',
    params,
    
  })
}

/**
 * 删除操作日志
 */
export function fetchDeleteOperationLogs(ids: number[]) {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/operation',
    params: {
      ids: ids.join(',')
    },
    
  })
}

/**
 * 清空操作日志
 */
export function fetchClearOperationLogs() {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/operation/clear',
    
  })
}

/**
 * 获取登录日志列表
 */
export async function fetchLoginLogs(params: Api.Audit.LoginLogSearchParams) {
  const response = await request.get<Api.Audit.LoginLogList>({
    url: '/api/v1/logs/login',
    params,
    
  })
  return normalizeLogPage<Api.Audit.LoginLogItem>(response)
}

/**
 * 获取登录日志详情
 */
export function fetchLoginLogDetail(id: number) {
  return request.get<Api.Audit.LoginLogItem>({
    url: `/api/v1/logs/login/${id}`,
    
  })
}

/**
 * 导出登录日志
 */
export function fetchExportLoginLogs(params: Api.Audit.LoginLogSearchParams) {
  return request.get<Api.Audit.LoginLogItem[]>({
    url: '/api/v1/logs/login/export',
    params,
    
  })
}

/**
 * 删除登录日志
 */
export function fetchDeleteLoginLogs(ids: number[]) {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/login',
    params: {
      ids: ids.join(',')
    },
    
  })
}

/**
 * 清空登录日志
 */
export function fetchClearLoginLogs() {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/login/clear',
    
  })
}
