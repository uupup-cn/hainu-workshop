import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取操作日志列表
 */
export function fetchOperationLogs(params: Api.Audit.OperationLogSearchParams) {
  return request.get<Api.Audit.OperationLogList>({
    url: '/api/v1/logs/operation',
    params,
    permissionCode: ApiPermissionCode.LOG.OPERATION_LIST
  })
}

/**
 * 获取操作日志详情
 */
export function fetchOperationLogDetail(id: number) {
  return request.get<Api.Audit.OperationLogItem>({
    url: `/api/v1/logs/operation/${id}`,
    permissionCode: ApiPermissionCode.LOG.OPERATION_DETAIL
  })
}

/**
 * 导出操作日志
 */
export function fetchExportOperationLogs(params: Api.Audit.OperationLogSearchParams) {
  return request.get<Api.Audit.OperationLogItem[]>({
    url: '/api/v1/logs/operation/export',
    params,
    permissionCode: ApiPermissionCode.LOG.OPERATION_EXPORT
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
    permissionCode: ApiPermissionCode.LOG.OPERATION_DELETE
  })
}

/**
 * 清空操作日志
 */
export function fetchClearOperationLogs() {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/operation/clear',
    permissionCode: ApiPermissionCode.LOG.OPERATION_CLEAR
  })
}

/**
 * 获取登录日志列表
 */
export function fetchLoginLogs(params: Api.Audit.LoginLogSearchParams) {
  return request.get<Api.Audit.LoginLogList>({
    url: '/api/v1/logs/login',
    params,
    permissionCode: ApiPermissionCode.LOG.LOGIN_LIST
  })
}

/**
 * 获取登录日志详情
 */
export function fetchLoginLogDetail(id: number) {
  return request.get<Api.Audit.LoginLogItem>({
    url: `/api/v1/logs/login/${id}`,
    permissionCode: ApiPermissionCode.LOG.LOGIN_DETAIL
  })
}

/**
 * 导出登录日志
 */
export function fetchExportLoginLogs(params: Api.Audit.LoginLogSearchParams) {
  return request.get<Api.Audit.LoginLogItem[]>({
    url: '/api/v1/logs/login/export',
    params,
    permissionCode: ApiPermissionCode.LOG.LOGIN_EXPORT
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
    permissionCode: ApiPermissionCode.LOG.LOGIN_DELETE
  })
}

/**
 * 清空登录日志
 */
export function fetchClearLoginLogs() {
  return request.del<{ count: number }>({
    url: '/api/v1/logs/login/clear',
    permissionCode: ApiPermissionCode.LOG.LOGIN_CLEAR
  })
}
