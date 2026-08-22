import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取字典类型列表
 */
export function fetchDictTypes(params: Api.Content.DictTypeSearchParams) {
  return request.get<Api.Content.DictTypeList>({
    url: '/api/v1/dicts/types',
    params,
    permissionCode: ApiPermissionCode.DICT.TYPE_LIST
  })
}

/**
 * 新增字典类型
 */
export function fetchCreateDictType(params: Api.Content.DictTypePayload) {
  return request.post<Api.Content.DictTypeItem>({
    url: '/api/v1/dicts/types',
    data: params,
    permissionCode: ApiPermissionCode.DICT.TYPE_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新字典类型
 */
export function fetchUpdateDictType(id: number, params: Partial<Api.Content.DictTypePayload>) {
  return request.patch<Api.Content.DictTypeItem>({
    url: `/api/v1/dicts/types/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.DICT.TYPE_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除字典类型
 */
export function fetchDeleteDictType(id: number) {
  return request.del<void>({
    url: `/api/v1/dicts/types/${id}`,
    permissionCode: ApiPermissionCode.DICT.TYPE_DELETE,
    showSuccessMessage: true
  })
}

/**
 * 获取字典数据列表
 */
export function fetchDictData(params: Api.Content.DictDataSearchParams) {
  return request.get<Api.Content.DictDataList>({
    url: '/api/v1/dicts/data',
    params,
    permissionCode: ApiPermissionCode.DICT.DATA_LIST
  })
}

/**
 * 新增字典数据
 */
export function fetchCreateDictData(params: Api.Content.DictDataPayload) {
  return request.post<Api.Content.DictDataItem>({
    url: '/api/v1/dicts/data',
    data: params,
    permissionCode: ApiPermissionCode.DICT.DATA_CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新字典数据
 */
export function fetchUpdateDictData(id: number, params: Partial<Api.Content.DictDataPayload>) {
  return request.patch<Api.Content.DictDataItem>({
    url: `/api/v1/dicts/data/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.DICT.DATA_UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除字典数据
 */
export function fetchDeleteDictData(id: number) {
  return request.del<void>({
    url: `/api/v1/dicts/data/${id}`,
    permissionCode: ApiPermissionCode.DICT.DATA_DELETE,
    showSuccessMessage: true
  })
}
