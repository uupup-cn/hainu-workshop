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

    type SecurityAuditSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    type SecurityAuditStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED'

    interface SecurityAuditEventItem {
      /** ID */
      id: number
      /** 审计编号 */
      auditNo: string
      /** 事件类型 */
      eventType: string
      /** 标题 */
      title: string
      /** 严重级别 */
      severity: SecurityAuditSeverity
      /** 状态 */
      status: SecurityAuditStatus
      /** 风险分值 */
      riskScore: number
      /** 来源类型 */
      sourceType: string
      /** 发生次数 */
      occurrenceCount: number
      /** 首次发生时间 */
      firstOccurredAt: string
      /** 最后发生时间 */
      lastOccurredAt: string
      /** 用户 ID */
      userId?: number | null
      /** 用户名 */
      username?: string | null
      /** IP 地址 */
      ip?: string | null
      /** 模块 */
      module?: string | null
      /** 请求方法 */
      method?: string | null
      /** 路径 */
      path?: string | null
      /** 描述 */
      description?: string | null
      /** 载荷数据 */
      payload?: unknown
      /** 登录日志 ID */
      loginLogId?: number | null
      /** 操作日志 ID */
      operationLogId?: number | null
      /** 处理人 ID */
      handledBy?: number | null
      /** 处理备注 */
      handledRemark?: string | null
      /** 处理时间 */
      handledAt?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 处理器 */
      handler?: {
        /** ID */
        id: number
        /** 用户名 */
        username: string
      } | null
    }

    interface SecurityAuditEventDetail extends SecurityAuditEventItem {
      /** 实际处理人信息 */
      actor?: {
        /** ID */
        id: number
        /** 用户名 */
        username: string
      } | null
      /** 登录日志 */
      loginLog?: LoginLogItem | null
      /** 操作日志 */
      operationLog?: OperationLogItem | null
    }

    type SecurityAuditEventList = Api.Common.PaginatedResponse<SecurityAuditEventItem>

    interface SecurityAuditSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 严重级别 */
      severity?: SecurityAuditSeverity | ''
      /** 状态 */
      status?: SecurityAuditStatus | ''
      /** 事件类型 */
      eventType?: string
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
      /** 是否仅未处理 */
      unresolvedOnly?: boolean
    }

    interface SecurityAuditOverviewResponse {
      /** 汇总信息 */
      summary: {
        /** 未处理数量 */
        openCount: number
        /** 严重未处理数量 */
        criticalOpenCount: number
        /** 今日数量 */
        todayCount: number
        /** 今日处理数量 */
        handledTodayCount: number
        /** 生成时间 */
        generatedAt: string
      }
      /** 严重级别分布 */
      severityBuckets: Array<{
        /** 严重级别 */
        severity: SecurityAuditSeverity
        /** 数量 */
        count: number
      }>
      /** 高风险 IP 列表 */
      topRiskIps: Array<{
        /** IP 地址 */
        ip?: string | null
        /** 数量 */
        count: number
        /** 最大风险评分 */
        maxRiskScore: number
        /** 最后发生时间 */
        lastOccurredAt?: string | null
      }>
      /** 最近事件 */
      recentEvents: SecurityAuditEventItem[]
    }

    interface UpdateSecurityAuditStatusPayload {
      /** 状态 */
      status: SecurityAuditStatus
      /** 备注 */
      remark?: string
    }

    /** 角色搜索参数 */
  }
}
