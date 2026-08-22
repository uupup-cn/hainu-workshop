import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取角色列表
 */
export function fetchRolesList(params: Api.Access.RoleSearchParams) {
  return request.get<Api.Access.RoleList>({
    url: '/api/v1/roles',
    params,
    permissionCode: ApiPermissionCode.ROLE.LIST
  })
}

/**
 * 新增角色
 */
export function fetchAddRole(params: Api.Access.AddRoleParams) {
  return request.post<Api.Access.RoleListItem>({
    url: '/api/v1/roles',
    data: params,
    permissionCode: ApiPermissionCode.ROLE.CREATE
  })
}

/**
 * 更新角色
 */
export function fetchEditRole(id: number, params: Api.Access.EditRoleParams) {
  return request.patch<Api.Access.RoleListItem>({
    url: `/api/v1/roles/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.ROLE.UPDATE
  })
}

/**
 * 删除角色
 */
export function fetchDeleteRole(id: number) {
  return request.del({
    url: `/api/v1/roles/${id}`,
    permissionCode: ApiPermissionCode.ROLE.DELETE
  })
}

/**
 * 获取角色权限详情
 */
export function fetchRolePermissions(id: number) {
  return request.get<Api.Access.RolePermissionData>({
    url: `/api/v1/roles/${id}/permissions`,
    permissionCode: ApiPermissionCode.ROLE.PERMISSION_DETAIL
  })
}

/**
 * 更新角色权限
 */
export function fetchUpdateRolePermissions(
  id: number,
  permissionKeys: string[],
  apiPermissionCodes: string[]
) {
  return request.patch<Api.Access.RolePermissionData>({
    url: `/api/v1/roles/${id}/permissions`,
    // 页面权限和接口权限统一一次提交，确保角色授权保存时状态一致。
    data: { permissionKeys, apiPermissionCodes },
    permissionCode: ApiPermissionCode.ROLE.PERMISSION_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 获取接口权限目录
 */
export function fetchApiPermissionCatalog() {
  return request.get<Api.Access.ApiPermissionCatalogModule[]>({
    // 角色授权页按服务端目录渲染接口权限树，前端不自行推导接口项。
    url: '/api/v1/api-permissions/catalog',
    permissionCode: ApiPermissionCode.API_PERMISSION.CATALOG
  })
}

/**
 * 获取角色数据权限元信息
 */
export function fetchRoleDataPermissionMeta() {
  return request.get<Api.Access.RoleDataPermissionMetaResponse>({
    url: '/api/v1/roles/data-permissions/meta',
    permissionCode: ApiPermissionCode.ROLE.DATA_META
  })
}

/**
 * 获取角色数据权限详情
 */
export function fetchRoleDataPermissions(id: number) {
  return request.get<Api.Access.RoleDataPermissionResponse>({
    url: `/api/v1/roles/${id}/data-permissions`,
    permissionCode: ApiPermissionCode.ROLE.DATA_DETAIL
  })
}

/**
 * 更新角色数据权限
 */
export function fetchUpdateRoleDataPermissions(
  id: number,
  policies: Api.Access.RoleDataPermissionPolicy[]
) {
  return request.patch<Api.Access.RoleDataPermissionResponse>({
    url: `/api/v1/roles/${id}/data-permissions`,
    data: { policies },
    permissionCode: ApiPermissionCode.ROLE.DATA_UPDATE,
    showSuccessMessage: true
  })
}
