import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取后台通知列表
 */
export function fetchNotificationAdminList(params: Api.Interaction.NotificationAdminSearchParams) {
  return request.get<Api.Interaction.NotificationList>({
    url: '/api/v1/notifications/admin',
    params,
    permissionCode: ApiPermissionCode.NOTIFICATION.ADMIN_LIST
  })
}

/**
 * 获取后台通知详情
 */
export function fetchNotificationDetail(id: number) {
  return request.get<Api.Interaction.NotificationItem>({
    url: `/api/v1/notifications/admin/${id}`,
    permissionCode: ApiPermissionCode.NOTIFICATION.ADMIN_DETAIL
  })
}

/**
 * 新建通知
 */
export function fetchCreateNotification(params: Api.Interaction.NotificationPayload) {
  return request.post<Api.Interaction.NotificationItem>({
    url: '/api/v1/notifications/admin',
    data: params,
    permissionCode: ApiPermissionCode.NOTIFICATION.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新通知
 */
export function fetchUpdateNotification(
  id: number,
  params: Partial<Api.Interaction.NotificationPayload>
) {
  return request.patch<Api.Interaction.NotificationItem>({
    url: `/api/v1/notifications/admin/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.NOTIFICATION.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 发布通知
 */
export function fetchPublishNotification(id: number) {
  return request.post<Api.Interaction.NotificationItem>({
    url: `/api/v1/notifications/admin/${id}/publish`,
    permissionCode: ApiPermissionCode.NOTIFICATION.PUBLISH,
    showSuccessMessage: true
  })
}

/**
 * 撤回通知
 */
export function fetchRevokeNotification(id: number) {
  return request.post<Api.Interaction.NotificationItem>({
    url: `/api/v1/notifications/admin/${id}/revoke`,
    permissionCode: ApiPermissionCode.NOTIFICATION.REVOKE,
    showSuccessMessage: false
  })
}

/**
 * 删除通知
 */
export function fetchDeleteNotification(id: number) {
  return request.del<void>({
    url: `/api/v1/notifications/admin/${id}`,
    permissionCode: ApiPermissionCode.NOTIFICATION.DELETE,
    showSuccessMessage: true
  })
}

/**
 * 获取通知收件箱列表
 */
export function fetchNotificationInbox(params?: Partial<Api.Interaction.NotificationInboxQuery>) {
  return request.get<Api.Interaction.NotificationInboxList>({
    url: '/api/v1/notifications/inbox',
    params,
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_LIST
  })
}

/**
 * 获取通知统计信息
 */
export function fetchNotificationStats() {
  return request.get<Api.Interaction.NotificationStats>({
    url: '/api/v1/notifications/stats',
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_STATS
  })
}

/**
 * 获取通知收件箱详情
 */
export function fetchNotificationInboxDetail(id: number) {
  return request.get<Api.Interaction.NotificationInboxItem>({
    url: `/api/v1/notifications/inbox/${id}`,
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_DETAIL
  })
}

/**
 * 标记单条通知已读
 */
export function fetchMarkNotificationRead(id: number) {
  return request.patch<void>({
    url: `/api/v1/notifications/inbox/${id}/read`,
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_READ
  })
}

/**
 * 标记全部通知已读
 */
export function fetchMarkAllNotificationsRead() {
  return request.patch<void>({
    url: '/api/v1/notifications/inbox/read-all',
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_READ_ALL
  })
}

/**
 * 创建通知流短期访问令牌
 */
export function fetchNotificationStreamToken() {
  return request.post<{ token: string }>({
    url: '/api/v1/notifications/stream-token',
    permissionCode: ApiPermissionCode.NOTIFICATION.INBOX_LIST,
    showErrorMessage: false
  })
}
