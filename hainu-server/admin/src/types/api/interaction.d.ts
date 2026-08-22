declare namespace Api {
  /** 通知与反馈类型 */
  namespace Interaction {
    type NotificationType = 'SYSTEM' | 'ANNOUNCEMENT' | 'ALERT' | 'UPDATE'
    type NotificationStatus = 'DRAFT' | 'PUBLISHED' | 'REVOKED'
    type NotificationTargetType = 'ALL' | 'ROLE' | 'DEPARTMENT' | 'USER'

    interface NotificationOperator {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface NotificationRoleRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
    }

    interface NotificationDepartmentRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
    }

    interface NotificationUserRef {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface NotificationItem {
      /** ID */
      id: number
      /** 标题 */
      title: string
      /** 汇总信息 */
      summary?: string | null
      /** 内容 */
      content: string
      /** 类型 */
      type: NotificationType
      /** 状态 */
      status: NotificationStatus
      /** 目标类型 */
      targetType: NotificationTargetType
      /** 目标角色 ID 列表 */
      targetRoleIds: number[]
      /** 目标部门 ID 列表 */
      targetDepartmentIds: number[]
      /** 目标用户 ID 列表 */
      targetUserIds: number[]
      /** 发布时间 */
      publishedAt?: string | null
      /** 撤销时间 */
      revokedAt?: string | null
      /** 过期时间 */
      expiresAt?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 创建人 */
      createdBy?: NotificationOperator | null
      /** 更新人 */
      updatedBy?: NotificationOperator | null
      /** 接收人数 */
      recipientCount: number
      /** 已读数量 */
      readCount: number
      /** 目标角色列表 */
      targetRoles?: NotificationRoleRef[]
      /** 目标部门列表 */
      targetDepartments?: NotificationDepartmentRef[]
      /** 目标用户列表 */
      targetUsers?: NotificationUserRef[]
    }

    type NotificationList = Api.Common.PaginatedResponse<NotificationItem>

    interface NotificationAdminSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 类型 */
      type?: NotificationType
      /** 状态 */
      status?: NotificationStatus
      /** 目标类型 */
      targetType?: NotificationTargetType
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface NotificationPayload {
      /** 标题 */
      title: string
      /** 汇总信息 */
      summary?: string
      /** 内容 */
      content: string
      /** 类型 */
      type: NotificationType
      /** 目标类型 */
      targetType: NotificationTargetType
      /** 状态 */
      status?: NotificationStatus
      /** 过期时间 */
      expiresAt?: string
      /** 目标角色 ID 列表 */
      targetRoleIds?: number[]
      /** 目标部门 ID 列表 */
      targetDepartmentIds?: number[]
      /** 目标用户 ID 列表 */
      targetUserIds?: number[]
    }

    interface NotificationInboxItem {
      /** ID */
      id: number
      /** 接收记录 ID */
      recipientId: number
      /** 标题 */
      title: string
      /** 汇总信息 */
      summary?: string | null
      /** 内容 */
      content: string
      /** 类型 */
      type: NotificationType
      /** 是否已读 */
      isRead: boolean
      /** 已读时间 */
      readAt?: string | null
      /** 发布时间 */
      publishedAt: string
      /** 创建人 */
      createdBy?: NotificationOperator | null
    }

    interface NotificationInboxList {
      /** 记录列表 */
      records: NotificationInboxItem[]
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
      /** 未读数量 */
      unreadCount: number
    }

    interface NotificationInboxQuery {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 是否仅看未读 */
      onlyUnread?: boolean
    }

    interface NotificationStats {
      /** 未读数量 */
      unreadCount: number
    }

    type FeedbackType = 'BUG' | 'FEATURE' | 'UX' | 'PERFORMANCE' | 'OTHER'
    type FeedbackStatus = 'NEW' | 'TRIAGING' | 'PLANNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    type FeedbackPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

    interface FeedbackOperator {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface FeedbackItem {
      /** ID */
      id: number
      /** 反馈编号 */
      feedbackNo: string
      /** 类型 */
      type: FeedbackType
      /** 状态 */
      status: FeedbackStatus
      /** 优先级 */
      priority: FeedbackPriority
      /** 标题 */
      title: string
      /** 内容 */
      content: string
      /** 期望结果 */
      expectedBehavior?: string | null
      /** 联系人姓名 */
      contactName?: string | null
      /** 联系方式 */
      contact?: string | null
      /** 页面标题 */
      pageTitle?: string | null
      /** 页面路径 */
      pagePath?: string | null
      /** 页面地址 */
      pageUrl?: string | null
      /** 浏览器 */
      browser?: string | null
      /** 操作系统 */
      os?: string | null
      /** 设备类型 */
      deviceType?: string | null
      /** 用户代理 */
      userAgent?: string | null
      /** IP 地址 */
      ip?: string | null
      /** 扩展数据 */
      extra?: Record<string, any> | null
      /** 处理备注 */
      handledRemark?: string | null
      /** 处理时间 */
      handledAt?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 提交人信息 */
      submitter?: FeedbackOperator | null
      /** 处理器 */
      handler?: FeedbackOperator | null
    }

    type FeedbackList = Api.Common.PaginatedResponse<FeedbackItem>

    interface FeedbackOverviewResponse {
      /** 汇总信息 */
      summary: {
        /** 总数量 */
        totalCount: number
        /** 活跃数量 */
        activeCount: number
        /** 今日数量 */
        todayCount: number
        /** 已解决数量 */
        resolvedCount: number
        /** 生成时间 */
        generatedAt: string
      }
      /** 状态分布 */
      statusBuckets: Array<{
        /** 状态 */
        status: FeedbackStatus
        /** 数量 */
        count: number
      }>
      /** 类型分布 */
      typeBuckets: Array<{
        /** 类型 */
        type: FeedbackType
        /** 数量 */
        count: number
      }>
      /** 最新记录 */
      latestRecords: FeedbackItem[]
    }

    interface FeedbackSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 类型 */
      type?: FeedbackType | ''
      /** 状态 */
      status?: FeedbackStatus | ''
      /** 优先级 */
      priority?: FeedbackPriority | ''
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface FeedbackPayload {
      /** 类型 */
      type: FeedbackType
      /** 优先级 */
      priority?: FeedbackPriority
      /** 标题 */
      title: string
      /** 内容 */
      content: string
      /** 期望结果 */
      expectedBehavior?: string
      /** 联系人姓名 */
      contactName?: string
      /** 联系方式 */
      contact?: string
      /** 页面标题 */
      pageTitle?: string
      /** 页面路径 */
      pagePath?: string
      /** 页面地址 */
      pageUrl?: string
      /** 浏览器 */
      browser?: string
      /** 操作系统 */
      os?: string
      /** 设备类型 */
      deviceType?: string
      /** 扩展数据 */
      extra?: Record<string, any>
    }

    interface UpdateFeedbackStatusPayload {
      /** 状态 */
      status: FeedbackStatus
      /** 优先级 */
      priority?: FeedbackPriority
      /** 处理备注 */
      handledRemark?: string
    }
  }
}
