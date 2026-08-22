import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取内容分类列表
 */
export function fetchContentCategories(params: Api.Content.CategorySearchParams) {
  return request.get<Api.Content.CategoryList>({
    url: '/api/v1/content-categories',
    params,
    permissionCode: ApiPermissionCode.CONTENT.CATEGORY_LIST
  })
}

/**
 * 获取启用状态的内容分类选项
 */
export function fetchEnabledContentCategories() {
  return request.get<Api.Content.CategoryItem[]>({
    url: '/api/v1/content-categories/enabled/options',
    permissionCode: ApiPermissionCode.CONTENT.CATEGORY_LIST
  })
}

/**
 * 新增内容分类
 */
export function fetchCreateContentCategory(data: Api.Content.CategoryPayload) {
  return request.post<Api.Content.CategoryItem>({
    url: '/api/v1/content-categories',
    data,
    permissionCode: ApiPermissionCode.CONTENT.CATEGORY_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新内容分类
 */
export function fetchUpdateContentCategory(id: number, data: Partial<Api.Content.CategoryPayload>) {
  return request.patch<Api.Content.CategoryItem>({
    url: `/api/v1/content-categories/${id}`,
    data,
    permissionCode: ApiPermissionCode.CONTENT.CATEGORY_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除内容分类
 */
export function fetchDeleteContentCategory(id: number) {
  return request.del<void>({
    url: `/api/v1/content-categories/${id}`,
    permissionCode: ApiPermissionCode.CONTENT.CATEGORY_DELETE,
    showSuccessMessage: true
  })
}
