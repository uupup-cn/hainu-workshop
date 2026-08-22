declare namespace Api {
  /** 文件资源类型 */
  namespace Files {
    type FileVisibility = 'PRIVATE' | 'PUBLIC'
    type FileStatus = 'PENDING' | 'UPLOADING' | 'ACTIVE' | 'FAILED' | 'DELETED'
    type FileKind = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'ARCHIVE' | 'OTHER'
    type StorageProviderType = 'ALIYUN_OSS' | 'TENCENT_COS' | 'QINIU' | 'LOCAL'

    interface FileFolderRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 别名标识 */
      slug: string
    }

    interface FileCreatorRef {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface FileAssetItem {
      /** ID */
      id: number
      /** 文件编号 */
      fileNo: string
      /** 提供方 */
      provider: StorageProviderType
      /** 存储桶 */
      bucket: string
      /** 对象键 */
      objectKey: string
      /** 原始文件名 */
      originalName: string
      /** 显示名称 */
      displayName: string
      /** 扩展名 */
      extension?: string | null
      /** MIME 类型 */
      mimeType: string
      /** 文件类型 */
      kind: FileKind
      /** 文件大小 */
      size: number
      /** ETag */
      etag?: string | null
      /** 宽度 */
      width?: number | null
      /** 高度 */
      height?: number | null
      /** 时长 */
      duration?: number | null
      /** 页数 */
      pageCount?: number | null
      /** 可见性 */
      visibility: FileVisibility
      /** 状态 */
      status: FileStatus
      /** 标签列表 */
      tags: string[]
      /** 备注 */
      remark?: string | null
      /** 元数据 */
      metadata?: Record<string, unknown> | null
      /** 公开访问令牌 */
      publicToken?: string | null
      /** 公开链接过期时间 */
      publicUrlExpiresAt?: string | null
      /** 文件夹信息 */
      folder?: FileFolderRef | null
      /** 创建人信息 */
      creator?: FileCreatorRef | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    interface FileListSummary {
      /** 总条数 */
      total: number
      /** 私有数量 */
      privateCount: number
      /** 公开数量 */
      publicCount: number
    }

    interface FileListResponse extends Api.Common.PaginatedResponse<FileAssetItem> {
      /** 汇总信息 */
      summary: FileListSummary
    }

    interface FileSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 文件夹 ID */
      folderId?: number
      /** 文件类型 */
      kind?: FileKind | ''
      /** 可见性 */
      visibility?: FileVisibility | ''
      /** 状态 */
      status?: FileStatus | ''
      /** 提供方 */
      provider?: StorageProviderType | ''
      /** 是否仅图片 */
      imageOnly?: boolean
      /** 是否仅文档 */
      documentOnly?: boolean
    }

    interface CreateUploadTicketPayload {
      /** 文件名 */
      fileName: string
      /** MIME 类型 */
      mimeType: string
      /** 文件大小 */
      size: number
      /** 文件夹 ID */
      folderId?: number
      /** 可见性 */
      visibility?: FileVisibility
    }

    interface UploadTicketPayload {
      /** 文件信息 */
      file: FileAssetItem
      /** 会话 ID */
      sessionId: string
      /** 提供方 */
      provider: StorageProviderType
      /** 存储桶 */
      bucket: string
      /** 对象键 */
      objectKey: string
      /** 上传地址 */
      uploadUrl: string
      /** 请求方法 */
      method: 'POST' | 'PUT'
      /** 请求头 */
      headers: Record<string, string>
      /** 表单数据 */
      formData: Record<string, string>
      /** 过期时间 */
      expiresAt: string
    }

    interface CompleteUploadPayload {
      /** 会话 ID */
      sessionId?: string
      /** ETag */
      etag?: string
      /** 文件大小 */
      size?: number
      /** MIME 类型 */
      mimeType?: string
    }

    interface PublicLinkPayload {
      /** 令牌 */
      token: string
      /** 可见性 */
      visibility: FileVisibility
      /** 公开访问地址 */
      publicUrl: string
    }

    interface UpdateFilePayload {
      /** 显示名称 */
      displayName?: string
      /** 文件夹 ID */
      folderId?: number | null
      /** 可见性 */
      visibility?: FileVisibility
      /** 标签列表 */
      tags?: string[]
      /** 备注 */
      remark?: string
    }

    interface BatchMoveFilesPayload {
      /** ID 列表 */
      ids: number[]
      /** 文件夹 ID */
      folderId: number
    }

    interface BatchDeleteFilesPayload {
      /** ID 列表 */
      ids: number[]
    }

    interface FileFolderNode {
      /** ID */
      id: number
      /** 父级 ID */
      parentId?: number | null
      /** 名称 */
      name: string
      /** 别名标识 */
      slug: string
      /** 可见性 */
      visibility: FileVisibility
      /** 排序 */
      sort: number
      /** 文件数量 */
      fileCount: number
      /** 子级列表 */
      children: FileFolderNode[]
    }

    interface CreateFileFolderPayload {
      /** 名称 */
      name: string
      /** 父级 ID */
      parentId?: number
      /** 可见性 */
      visibility?: FileVisibility
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    interface UpdateFileFolderPayload {
      /** 名称 */
      name?: string
      /** 可见性 */
      visibility?: FileVisibility
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }
    type Visibility = FileVisibility
    type Status = FileStatus
    type Kind = FileKind
  }
}
