declare namespace Api.Toolbox {
  /** 工具分类 */
  interface CategoryInfo {
    id: number
    name: string
    icon: string
    sort: number
    description: string
    toolCount: number
    enabled: boolean
    createdAt: string
    updatedAt: string
  }

  type CategoryList = Api.Common.PaginatedResponse<CategoryInfo>

  interface CategorySearchParams extends Partial<Api.Common.CommonSearchParams> {
    name?: string
    enabled?: boolean
  }

  interface CategoryPayload {
    name: string
    icon?: string
    sort?: number
    description?: string
    enabled?: boolean
  }

  /** 工具类型 */
  type ToolType = 'builtin' | 'api-proxy' | 'link'

  /** 工具信息 */
  interface ToolInfo {
    id: number
    name: string
    description: string
    categoryId: number
    categoryName: string
    icon: string
    type: ToolType
    route: string
    linkUrl?: string
    apiConfig?: ApiProxyConfig
    sort: number
    enabled: boolean
    visitCount: number
    createdAt: string
    updatedAt: string
  }

  type ToolList = Api.Common.PaginatedResponse<ToolInfo>

  interface ToolSearchParams extends Partial<Api.Common.CommonSearchParams> {
    name?: string
    categoryId?: number
    type?: ToolType
    enabled?: boolean
  }

  interface ToolPayload {
    name: string
    description?: string
    categoryId: number
    icon?: string
    type: ToolType
    route?: string
    linkUrl?: string
    apiConfig?: ApiProxyConfig
    sort?: number
  }

  /** API 代理配置（用于 api-proxy 类型的工具） */
  interface ApiProxyConfig {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: string
    headers?: Record<string, string>
    timeout?: number
  }

  /** 工具使用日志 */
  interface LogInfo {
    id: number
    toolId: number
    toolName: string
    userId: number
    username: string
    type: ToolType
    requestUrl?: string
    requestMethod?: string
    statusCode?: number
    duration: number
    ip: string
    createdAt: string
  }

  type LogList = Api.Common.PaginatedResponse<LogInfo>

  interface LogSearchParams extends Partial<Api.Common.CommonSearchParams> {
    toolName?: string
    startDate?: string
    endDate?: string
  }
}