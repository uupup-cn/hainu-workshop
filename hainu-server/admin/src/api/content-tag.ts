import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取内容标签列表
 */
export function fetchContentTags(params: Api.Content.TagSearchParams) {
  return request.get<Api.Content.TagList>({
    url: '/api/v1/content-tags',
    params,
    permissionCode: ApiPermissionCode.CONTENT.TAG_LIST
  })
}

/**
 * 获取启用状态的内容标签选项
 */
export function fetchEnabledContentTags() {
  return request.get<Api.Content.TagItem[]>({
    url: '/api/v1/content-tags/enabled/options',
    permissionCode: ApiPermissionCode.CONTENT.TAG_LIST
  })
}

/**
 * 新增内容标签
 */
export function fetchCreateContentTag(data: Api.Content.TagPayload) {
  return request.post<Api.Content.TagItem>({
    url: '/api/v1/content-tags',
    data,
    permissionCode: ApiPermissionCode.CONTENT.TAG_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新内容标签
 */
export function fetchUpdateContentTag(id: number, data: Partial<Api.Content.TagPayload>) {
  return request.patch<Api.Content.TagItem>({
    url: `/api/v1/content-tags/${id}`,
    data,
    permissionCode: ApiPermissionCode.CONTENT.TAG_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除内容标签
 */
export function fetchDeleteContentTag(id: number) {
  return request.del<void>({
    url: `/api/v1/content-tags/${id}`,
    permissionCode: ApiPermissionCode.CONTENT.TAG_DELETE,
    showSuccessMessage: true
  })
}
