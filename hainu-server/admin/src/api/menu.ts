import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取菜单列表
 */
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus',
    permissionCode: ApiPermissionCode.MENU.LIST
  })
}

/**
 * 获取菜单管理列表
 */
export function fetchGetMenuManageList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus/manage',
    permissionCode: ApiPermissionCode.MENU.MANAGE_LIST
  })
}

/**
 * 新增菜单
 */
export function fetchCreateMenu(params: Api.Navigation.CreateMenuParams) {
  return request.post<AppRouteRecord>({
    url: '/api/v3/system/menus',
    data: params,
    permissionCode: ApiPermissionCode.MENU.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新菜单
 */
export function fetchUpdateMenu(id: number, params: Api.Navigation.UpdateMenuParams) {
  return request.patch<AppRouteRecord>({
    url: `/api/v3/system/menus/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.MENU.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 更新菜单排序
 */
export function fetchUpdateMenuSort(params: Api.Navigation.UpdateMenuSortParams) {
  return request.patch<void>({
    url: '/api/v3/system/menus/sort',
    data: params,
    permissionCode: ApiPermissionCode.MENU.SORT,
    showSuccessMessage: true
  })
}

/**
 * 删除菜单
 */
export function fetchDeleteMenu(id: number) {
  return request.del<void>({
    url: `/api/v3/system/menus/${id}`,
    permissionCode: ApiPermissionCode.MENU.DELETE,
    showSuccessMessage: true
  })
}

/**
 * 新增菜单权限
 */
export function fetchCreateMenuAuth(params: Api.Navigation.CreateMenuAuthParams) {
  return request.post<void>({
    url: '/api/v3/system/menus/auths',
    data: params,
    permissionCode: ApiPermissionCode.MENU.AUTH_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新菜单权限
 */
export function fetchUpdateMenuAuth(
  parentId: number,
  authMark: string,
  params: Api.Navigation.UpdateMenuAuthParams
) {
  return request.patch<void>({
    url: `/api/v3/system/menus/${parentId}/auths/${authMark}`,
    data: params,
    permissionCode: ApiPermissionCode.MENU.AUTH_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除菜单权限
 */
export function fetchDeleteMenuAuth(parentId: number, authMark: string) {
  return request.del<void>({
    url: `/api/v3/system/menus/${parentId}/auths/${authMark}`,
    permissionCode: ApiPermissionCode.MENU.AUTH_DELETE,
    showSuccessMessage: true
  })
}
