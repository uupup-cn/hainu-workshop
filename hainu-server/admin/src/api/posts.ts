import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取岗位列表
 */
export function fetchPosts(params: Api.Access.PostSearchParams) {
  return request.get<Api.Access.PostList>({
    url: '/api/v1/posts',
    params,
    permissionCode: ApiPermissionCode.POST.LIST
  })
}

/**
 * 新增岗位
 */
export function fetchCreatePost(params: Api.Access.PostPayload) {
  return request.post<Api.Access.PostItem>({
    url: '/api/v1/posts',
    data: params,
    permissionCode: ApiPermissionCode.POST.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新岗位
 */
export function fetchUpdatePost(id: number, params: Partial<Api.Access.PostPayload>) {
  return request.patch<Api.Access.PostItem>({
    url: `/api/v1/posts/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.POST.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除岗位
 */
export function fetchDeletePost(id: number) {
  return request.del<void>({
    url: `/api/v1/posts/${id}`,
    permissionCode: ApiPermissionCode.POST.DELETE,
    showSuccessMessage: true
  })
}
