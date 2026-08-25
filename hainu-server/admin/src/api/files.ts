import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取文件列表
 *
 * 后端返回标准分页 `{ records, total, current, size }`，但页面依赖 `summary`
 * 汇总字段（总文件数/私有/公开数量）。后端未返回该字段时这里补齐零值，
 * 避免页面访问 `response.summary.total` 时因 `summary` 为 undefined 而白屏。
 */
export async function fetchFileList(params: Api.Files.FileSearchParams) {
  const response = await request.get<Api.Files.FileListResponse>({
    url: '/api/v1/files',
    params,
    permissionCode: ApiPermissionCode.FILE.LIST
  })

  // 数据适配：后端未返回 summary 时补零值，records 统一为数组
  const records = Array.isArray(response?.records) ? response.records : []
  const total = typeof response?.total === 'number' ? response.total : records.length
  const summary: Api.Files.FileListSummary = response?.summary ?? {
    total,
    privateCount: records.filter((item) => item.visibility !== 'PUBLIC').length,
    publicCount: records.filter((item) => item.visibility === 'PUBLIC').length
  }

  return {
    ...response,
    records,
    total,
    current: response?.current ?? params.current ?? 1,
    size: response?.size ?? params.size ?? 12,
    summary
  }
}

/**
 * 获取文件详情
 */
export function fetchFileDetail(id: number) {
  return request.get<Api.Files.FileAssetItem>({
    url: `/api/v1/files/${id}`,
    permissionCode: ApiPermissionCode.FILE.DETAIL
  })
}

/**
 * 创建上传票据
 */
export function fetchCreateUploadTicket(data: Api.Files.CreateUploadTicketPayload) {
  return request.post<Api.Files.UploadTicketPayload>({
    url: '/api/v1/files/upload-tickets',
    data,
    permissionCode: ApiPermissionCode.FILE.CREATE_UPLOAD_TICKET
  })
}

/**
 * 通过代理接口上传文件
 */
export function fetchProxyUploadFile(
  formData: FormData,
  params?: { folderId?: number; visibility?: Api.Files.Visibility }
) {
  return request.post<Api.Files.FileAssetItem>({
    url: '/api/v1/files/upload-proxy',
    data: formData,
    params,
    permissionCode: ApiPermissionCode.FILE.PROXY_UPLOAD
  })
}

/**
 * 完成文件上传
 */
export function fetchCompleteUpload(id: number, data: Api.Files.CompleteUploadPayload) {
  return request.post<Api.Files.FileAssetItem>({
    url: `/api/v1/files/${id}/complete`,
    data,
    permissionCode: ApiPermissionCode.FILE.COMPLETE
  })
}

/**
 * 生成文件公开链接
 */
export function fetchGeneratePublicLink(id: number) {
  return request.post<Api.Files.PublicLinkPayload>({
    url: `/api/v1/files/${id}/public-link`,
    permissionCode: ApiPermissionCode.FILE.PUBLIC_LINK
  })
}

/**
 * 获取文件下载地址
 */
export function fetchFileDownloadUrl(id: number) {
  return request.post<{ url: string; expiresAt: string }>({
    url: `/api/v1/files/${id}/download-url`,
    permissionCode: ApiPermissionCode.FILE.DOWNLOAD_URL
  })
}

/**
 * 删除文件
 */
export function fetchDeleteFile(id: number) {
  return request.del<{ success: boolean }>({
    url: `/api/v1/files/${id}`,
    permissionCode: ApiPermissionCode.FILE.DELETE,
    showSuccessMessage: true
  })
}

/**
 * 批量移动文件
 */
export function fetchBatchMoveFiles(data: Api.Files.BatchMoveFilesPayload) {
  return request.post<{ count: number }>({
    url: '/api/v1/files/batch/move',
    data,
    permissionCode: ApiPermissionCode.FILE.BATCH_MOVE,
    showSuccessMessage: true
  })
}

/**
 * 批量删除文件
 */
export function fetchBatchDeleteFiles(data: Api.Files.BatchDeleteFilesPayload) {
  return request.post<{ count: number }>({
    url: '/api/v1/files/batch/delete',
    data,
    permissionCode: ApiPermissionCode.FILE.BATCH_DELETE,
    showSuccessMessage: true
  })
}

/**
 * 获取文件夹树
 */
export function fetchFileFolderTree() {
  return request.get<Api.Files.FileFolderNode[]>({
    url: '/api/v1/file-folders/tree',
    permissionCode: ApiPermissionCode.FILE_FOLDER.TREE
  })
}

/**
 * 新增文件夹
 */
export function fetchCreateFileFolder(data: Api.Files.CreateFileFolderPayload) {
  return request.post<Api.Files.FileFolderNode>({
    url: '/api/v1/file-folders',
    data,
    permissionCode: ApiPermissionCode.FILE_FOLDER.CREATE,
    showSuccessMessage: true
  })
}

/**
 * 更新文件夹
 */
export function fetchUpdateFileFolder(id: number, data: Api.Files.UpdateFileFolderPayload) {
  return request.patch<Api.Files.FileFolderNode>({
    url: `/api/v1/file-folders/${id}`,
    data,
    permissionCode: ApiPermissionCode.FILE_FOLDER.UPDATE,
    showSuccessMessage: true
  })
}

/**
 * 删除文件夹
 */
export function fetchDeleteFileFolder(id: number) {
  return request.del<{ success: boolean }>({
    url: `/api/v1/file-folders/${id}`,
    permissionCode: ApiPermissionCode.FILE_FOLDER.DELETE,
    showSuccessMessage: true
  })
}
