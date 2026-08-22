import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取工具分类列表
 */
export function fetchGetToolCategoryList(params: Api.Toolbox.CategorySearchParams) {
  return request.get<Api.Toolbox.CategoryList>({
    url: '/api/v1/toolbox/category',
    params,
    permissionCode: ApiPermissionCode.TOOLBOX.CATEGORY_LIST
  })
}

/**
 * 新增工具分类
 */
export function fetchAddToolCategory(data: Api.Toolbox.CategoryPayload) {
  return request.post<Api.Toolbox.CategoryInfo>({
    url: '/api/v1/toolbox/category',
    data,
    permissionCode: ApiPermissionCode.TOOLBOX.CATEGORY_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新工具分类
 */
export function fetchEditToolCategory(id: number, data: Partial<Api.Toolbox.CategoryPayload>) {
  return request.patch<Api.Toolbox.CategoryInfo>({
    url: `/api/v1/toolbox/category/${id}`,
    data,
    permissionCode: ApiPermissionCode.TOOLBOX.CATEGORY_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除工具分类
 */
export function fetchDeleteToolCategory(id: number) {
  return request.del<void>({
    url: `/api/v1/toolbox/category/${id}`,
    permissionCode: ApiPermissionCode.TOOLBOX.CATEGORY_DELETE,
    showSuccessMessage: true
  })
}

/**
 * 获取工具列表
 */
export function fetchGetToolList(params: Api.Toolbox.ToolSearchParams) {
  return request.get<Api.Toolbox.ToolList>({
    url: '/api/v1/toolbox/tool',
    params,
    permissionCode: ApiPermissionCode.TOOLBOX.TOOL_LIST
  })
}

/**
 * 新增工具
 */
export function fetchAddTool(data: Api.Toolbox.ToolPayload) {
  return request.post<Api.Toolbox.ToolInfo>({
    url: '/api/v1/toolbox/tool',
    data,
    permissionCode: ApiPermissionCode.TOOLBOX.TOOL_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新工具
 */
export function fetchEditTool(id: number, data: Partial<Api.Toolbox.ToolPayload>) {
  return request.patch<Api.Toolbox.ToolInfo>({
    url: `/api/v1/toolbox/tool/${id}`,
    data,
    permissionCode: ApiPermissionCode.TOOLBOX.TOOL_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除工具
 */
export function fetchDeleteTool(id: number) {
  return request.del<void>({
    url: `/api/v1/toolbox/tool/${id}`,
    permissionCode: ApiPermissionCode.TOOLBOX.TOOL_DELETE,
    showSuccessMessage: true
  })
}

/**
 * 切换工具状态（启用/禁用）
 */
export function fetchToggleToolStatus(id: number, enabled: boolean) {
  return request.patch({
    url: `/api/v1/toolbox/tool/${id}/status`,
    data: { enabled },
    permissionCode: ApiPermissionCode.TOOLBOX.TOOL_ENABLE,
    showSuccessMessage: true
  })
}

/**
 * 获取工具使用日志
 */
export function fetchGetToolLogList(params: Api.Toolbox.LogSearchParams) {
  return request.get<Api.Toolbox.LogList>({
    url: '/api/v1/toolbox/log',
    params,
    permissionCode: ApiPermissionCode.TOOLBOX.LOG_LIST
  })
}