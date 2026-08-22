import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 提交反馈
 */
export function fetchCreateFeedback(data: Api.Interaction.FeedbackPayload) {
  return request.post<Api.Interaction.FeedbackItem>({
    url: '/api/v1/feedback',
    data,
    showSuccessMessage: true
  })
}

/**
 * 获取反馈概览数据
 */
export function fetchFeedbackOverview() {
  return request.get<Api.Interaction.FeedbackOverviewResponse>({
    url: '/api/v1/feedback/overview',
    permissionCode: ApiPermissionCode.FEEDBACK.OVERVIEW
  })
}

/**
 * 获取反馈列表
 */
export function fetchFeedbackList(params: Api.Interaction.FeedbackSearchParams) {
  return request.get<Api.Interaction.FeedbackList>({
    url: '/api/v1/feedback',
    params,
    permissionCode: ApiPermissionCode.FEEDBACK.LIST
  })
}

/**
 * 获取反馈详情
 */
export function fetchFeedbackDetail(id: number) {
  return request.get<Api.Interaction.FeedbackItem>({
    url: `/api/v1/feedback/${id}`,
    permissionCode: ApiPermissionCode.FEEDBACK.DETAIL
  })
}

/**
 * 更新反馈状态
 */
export function fetchUpdateFeedbackStatus(
  id: number,
  data: Api.Interaction.UpdateFeedbackStatusPayload
) {
  return request.patch<Api.Interaction.FeedbackItem>({
    url: `/api/v1/feedback/${id}/status`,
    data,
    permissionCode: ApiPermissionCode.FEEDBACK.STATUS_UPDATE,
    showSuccessMessage: true
  })
}
