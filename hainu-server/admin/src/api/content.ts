import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取内容概览数据
 */
export function fetchContentOverview() {
  return request.get<Api.Content.Overview>({
    url: '/api/v1/contents/overview',
    permissionCode: ApiPermissionCode.CONTENT.OVERVIEW
  })
}

/**
 * 获取内容列表
 */
export function fetchContents(params: Api.Content.SearchParams) {
  return request.get<Api.Content.List>({
    url: '/api/v1/contents',
    params,
    permissionCode: ApiPermissionCode.CONTENT.LIST
  })
}

/**
 * 获取回收站内容列表
 */
export function fetchDeletedContents(params: Api.Content.SearchParams) {
  return request.get<Api.Content.List>({
    url: '/api/v1/contents/recycle-bin',
    params,
    permissionCode: ApiPermissionCode.CONTENT.RECYCLE_LIST
  })
}

/**
 * 获取内容详情
 */
export function fetchContentDetail(id: number) {
  return request.get<Api.Content.Item>({
    url: `/api/v1/contents/${id}`,
    permissionCode: ApiPermissionCode.CONTENT.DETAIL
  })
}

/**
 * 新增内容
 */
export function fetchCreateContent(data: Api.Content.Payload) {
  return request.post<Api.Content.Item>({
    url: '/api/v1/contents',
    data,
    permissionCode: ApiPermissionCode.CONTENT.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新内容
 */
export function fetchUpdateContent(id: number, data: Partial<Api.Content.Payload>) {
  return request.patch<Api.Content.Item>({
    url: `/api/v1/contents/${id}`,
    data,
    permissionCode: ApiPermissionCode.CONTENT.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 发布内容
 */
export function fetchPublishContent(id: number) {
  return request.patch<Api.Content.Item>({
    url: `/api/v1/contents/${id}/publish`,
    permissionCode: ApiPermissionCode.CONTENT.PUBLISH,
    showSuccessMessage: true
  })
}

/**
 * 下线内容
 */
export function fetchOfflineContent(id: number) {
  return request.patch<Api.Content.Item>({
    url: `/api/v1/contents/${id}/offline`,
    permissionCode: ApiPermissionCode.CONTENT.OFFLINE,
    showSuccessMessage: true
  })
}

/**
 * 删除内容
 */
export function fetchDeleteContent(id: number) {
  return request.del<void>({
    url: `/api/v1/contents/${id}`,
    permissionCode: ApiPermissionCode.CONTENT.DELETE,
    showSuccessMessage: true
  })
}

/**
 * 从回收站恢复内容
 */
export function fetchRestoreContent(id: number) {
  return request.patch<Api.Content.Item>({
    url: `/api/v1/contents/${id}/restore`,
    permissionCode: ApiPermissionCode.CONTENT.RECYCLE_RESTORE,
    showSuccessMessage: true
  })
}

/**
 * 永久删除回收站中的内容
 */
export function fetchPurgeContent(id: number) {
  return request.del<void>({
    url: `/api/v1/contents/${id}/purge`,
    permissionCode: ApiPermissionCode.CONTENT.RECYCLE_PURGE,
    showSuccessMessage: true
  })
}
