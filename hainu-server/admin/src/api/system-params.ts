import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取系统参数列表
 */
export function fetchSystemParams(params: Api.Settings.SystemParamSearchParams) {
  return request.get<Api.Settings.SystemParamListResponse>({
    url: '/api/v1/system-params',
    params,
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.LIST
  })
}

/**
 * 获取系统参数详情
 */
export function fetchSystemParamDetail(id: number) {
  return request.get<Api.Settings.SystemParamItem>({
    url: `/api/v1/system-params/${id}`,
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.DETAIL
  })
}

/**
 * 新增系统参数
 */
export function fetchCreateSystemParam(data: Api.Settings.SystemParamPayload) {
  return request.post<Api.Settings.SystemParamItem>({
    url: '/api/v1/system-params',
    data,
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新系统参数
 */
export function fetchUpdateSystemParam(id: number, data: Partial<Api.Settings.SystemParamPayload>) {
  return request.patch<Api.Settings.SystemParamItem>({
    url: `/api/v1/system-params/${id}`,
    data,
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除系统参数
 */
export function fetchDeleteSystemParams(ids: number[]) {
  return request.del<{ count: number; message: string }>({
    url: '/api/v1/system-params',
    params: { ids: ids.join(',') },
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.DELETE,
    showSuccessMessage: true
  })
}

/**
 * 刷新系统参数缓存
 */
export function fetchRefreshSystemParamCache() {
  return request.post<{ count: number; message: string }>({
    url: '/api/v1/system-params/refresh-cache',
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.REFRESH_CACHE,
    showSuccessMessage: false
  })
}

/**
 * 解析指定系统参数
 */
export function fetchResolveSystemParams(keys: string[]) {
  return request.get<Record<string, unknown>>({
    url: '/api/v1/system-params/resolve',
    params: { keys: keys.join(',') },
    permissionCode: ApiPermissionCode.SYSTEM_PARAM.RESOLVE
  })
}
