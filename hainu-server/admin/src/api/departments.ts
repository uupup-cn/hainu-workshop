import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取部门列表
 */
export function fetchDepartments(params?: Api.Access.DepartmentSearchParams) {
  return request.get<Api.Access.DepartmentItem[]>({
    url: '/api/v1/departments',
    params,
    permissionCode: ApiPermissionCode.DEPARTMENT.LIST
  })
}

/**
 * 新增部门
 */
export function fetchCreateDepartment(params: Api.Access.DepartmentPayload) {
  return request.post<Api.Access.DepartmentItem>({
    url: '/api/v1/departments',
    data: params,
    permissionCode: ApiPermissionCode.DEPARTMENT.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新部门
 */
export function fetchUpdateDepartment(id: number, params: Partial<Api.Access.DepartmentPayload>) {
  return request.patch<Api.Access.DepartmentItem>({
    url: `/api/v1/departments/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.DEPARTMENT.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除部门
 */
export function fetchDeleteDepartment(id: number) {
  return request.del<void>({
    url: `/api/v1/departments/${id}`,
    permissionCode: ApiPermissionCode.DEPARTMENT.DELETE,
    showSuccessMessage: true
  })
}
