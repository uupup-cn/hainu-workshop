import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取安全审计概览数据
 */
export function fetchSecurityAuditOverview() {
  return request.get<Api.Audit.SecurityAuditOverviewResponse>({
    url: '/api/v1/security-audit/overview',
    permissionCode: ApiPermissionCode.AUDIT.OVERVIEW
  })
}

/**
 * 获取安全审计事件列表
 */
export function fetchSecurityAuditEvents(params: Api.Audit.SecurityAuditSearchParams) {
  return request.get<Api.Audit.SecurityAuditEventList>({
    url: '/api/v1/security-audit/events',
    params,
    permissionCode: ApiPermissionCode.AUDIT.EVENT_LIST
  })
}

/**
 * 获取安全审计事件详情
 */
export function fetchSecurityAuditEventDetail(id: number) {
  return request.get<Api.Audit.SecurityAuditEventDetail>({
    url: `/api/v1/security-audit/events/${id}`,
    permissionCode: ApiPermissionCode.AUDIT.EVENT_DETAIL
  })
}

/**
 * 更新安全审计事件状态
 */
export function fetchUpdateSecurityAuditStatus(
  id: number,
  data: Api.Audit.UpdateSecurityAuditStatusPayload
) {
  return request.patch<Api.Audit.SecurityAuditEventItem>({
    url: `/api/v1/security-audit/events/${id}/status`,
    data,
    permissionCode: ApiPermissionCode.AUDIT.EVENT_STATUS_UPDATE,
    showSuccessMessage: true
  })
}
