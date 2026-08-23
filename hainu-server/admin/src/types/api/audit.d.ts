declare namespace Api {
  /** 审计与日志类型 */
  namespace Audit {
    interface OperationLogItem {
      /** ID */
      id: number
      /** 日志编号 */
      logNo: string
      /** 模块 */
      module: string
      /** 操作类型 */
      operationType: string
      /** 描述 */
      description?: string | null
      /** 请求方法 */
      method: string
      /** 路径 */
      path: string
      /** 用户 ID */
      userId?: number | null
      /** 用户名 */
      username?: string | null
      /** IP 地址 */
      ip?: string | null
      /** 状态 */
      status: string
      /** 耗时（毫秒） */
      durationMs: number
      /** 请求参数 */
      requestParams?: unknown
      /** 响应内容 */
      responsePayload?: unknown
      /** 响应状态码 */
      responseCode?: number | null
      /** 错误信息 */
      errorMessage?: string | null
      /** 创建时间 */
      createdAt: string
    }

    interface LoginLogItem {
      /** ID */
      id: number
      /** 日志编号 */
      logNo: string
      /** 事件类型 */
      event: string
      /** 用户 ID */
      userId?: number | null
      /** 用户名 */
      username?: string | null
      /** IP 地址 */
      ip?: string | null
      /** 归属地 */
      location?: string | null
      /** 设备类型 */
      deviceType?: string | null
      /** 操作系统 */
      os?: string | null
      /** 浏览器 */
      browser?: string | null
      /** 用户代理 */
      userAgent?: string | null
      /** 状态 */
      status: string
      /** 描述 */
      description?: string | null
      /** 创建时间 */
      createdAt: string
    }

    type OperationLogList = Api.Common.PaginatedResponse<OperationLogItem>
    type LoginLogList = Api.Common.PaginatedResponse<LoginLogItem>

    interface OperationLogSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 模块 */
      module?: string
      /** 操作类型 */
      operationType?: string
      /** 用户名 */
      username?: string
      /** 状态 */
      status?: string
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface LoginLogSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 事件类型 */
      event?: string
      /** 用户名 */
      username?: string
      /** 状态 */
      status?: string
      /** IP 地址 */
      ip?: string
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    /** 角色搜索参数 */
  }
}
