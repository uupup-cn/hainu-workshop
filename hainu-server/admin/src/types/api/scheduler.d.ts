declare namespace Api {
  /** 调度任务类型 */
  namespace Scheduler {
    type ScheduledTaskStatus = 'ENABLED' | 'DISABLED'
    type ScheduledTaskExecutionStatus = 'RUNNING' | 'SUCCESS' | 'FAIL' | 'SKIPPED'
    type ScheduledTaskTriggerType = 'SCHEDULED' | 'MANUAL'
    type ScheduledTaskConcurrencyPolicy = 'FORBID' | 'ALLOW'
    type ScheduledTaskHandler =
      | 'CLEANUP_OPERATION_LOGS'
      | 'CLEANUP_LOGIN_LOGS'
      | 'CLEANUP_TASK_LOGS'
      | 'EXPIRE_NOTIFICATIONS'

    interface ScheduledTaskHandlerParamSchema {
      /** 键名 */
      key: string
      /** 显示名称 */
      label: string
      /** 类型 */
      type: 'number' | 'string' | 'boolean'
      /** 是否必填 */
      required?: boolean
      /** 最小值 */
      min?: number
      /** 最大值 */
      max?: number
      /** 默认值 */
      defaultValue?: number | string | boolean
      /** 描述 */
      description?: string
    }

    interface ScheduledTaskHandlerOption {
      /** 值 */
      value: ScheduledTaskHandler
      /** 显示名称 */
      label: string
      /** 描述 */
      description: string
      /** 业务分类 */
      businessCategory: string
      /** 默认 Cron 表达式 */
      defaultCronExpression: string
      /** 推荐时区 */
      recommendedTimeZone: string
      /** 参数结构 */
      paramsSchema: ScheduledTaskHandlerParamSchema[]
    }

    interface ScheduledTaskOperator {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface ScheduledTaskItem {
      /** ID */
      id: number
      /** 任务编号 */
      taskNo: string
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 处理器 */
      handler: ScheduledTaskHandler
      /** Cron 表达式 */
      cronExpression: string
      /** 时区 */
      timeZone: string
      /** 状态 */
      status: ScheduledTaskStatus
      /** 并发策略 */
      concurrencyPolicy: ScheduledTaskConcurrencyPolicy
      /** 参数 */
      params?: Record<string, unknown> | null
      /** 备注 */
      remark?: string | null
      /** 排序 */
      sort: number
      /** 最后执行时间 */
      lastRunAt?: string | null
      /** 最后成功时间 */
      lastSuccessAt?: string | null
      /** 下次执行时间 */
      nextRunAt?: string | null
      /** 最后执行状态 */
      lastStatus?: ScheduledTaskExecutionStatus | null
      /** 上次执行耗时（毫秒） */
      lastDurationMs?: number | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 创建人 */
      createdBy?: number | null
      /** 更新人 */
      updatedBy?: number | null
      /** 创建人名称 */
      creatorName?: string | null
      /** 更新人名称 */
      updaterName?: string | null
      /** 是否运行中 */
      isRunning?: boolean
      /** 日志数量 */
      logCount?: number
      /** 处理器元信息 */
      handlerMeta?: ScheduledTaskHandlerOption
      /** 最近日志 */
      recentLogs?: ScheduledTaskLogItem[]
    }

    type ScheduledTaskList = Api.Common.PaginatedResponse<ScheduledTaskItem>

    interface ScheduledTaskSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 处理器 */
      handler?: ScheduledTaskHandler
      /** 状态 */
      status?: ScheduledTaskStatus
    }

    interface ScheduledTaskPayload {
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 处理器 */
      handler: ScheduledTaskHandler
      /** Cron 表达式 */
      cronExpression: string
      /** 时区 */
      timeZone?: string
      /** 状态 */
      status?: ScheduledTaskStatus
      /** 并发策略 */
      concurrencyPolicy?: ScheduledTaskConcurrencyPolicy
      /** 参数 */
      params?: Record<string, unknown>
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    interface ScheduledTaskCronPreviewPayload {
      /** Cron 表达式 */
      cronExpression: string
      /** 时区 */
      timeZone?: string
      /** 数量 */
      count?: number
    }

    interface ScheduledTaskCronPreviewItem {
      /** 执行时间 */
      runAt: string
      /** 展示文本 */
      displayText: string
    }

    interface ScheduledTaskCronPreviewResult {
      /** 表达式 */
      expression: string
      /** 时区 */
      timeZone: string
      /** 描述 */
      description: string
      /** 后续执行时间列表 */
      nextRuns: ScheduledTaskCronPreviewItem[]
      /** 警告信息 */
      warnings: string[]
    }

    interface ScheduledTaskLogItem {
      /** ID */
      id: number
      /** 日志编号 */
      logNo: string
      /** 任务 ID */
      taskId: number
      /** 任务名称 */
      taskName: string
      /** 任务编码 */
      taskCode: string
      /** 处理器 */
      handler: ScheduledTaskHandler
      /** 触发类型 */
      triggerType: ScheduledTaskTriggerType
      /** 状态 */
      status: ScheduledTaskExecutionStatus
      /** 开始时间 */
      startedAt: string
      /** 结束时间 */
      finishedAt?: string | null
      /** 耗时（毫秒） */
      durationMs?: number | null
      /** 提示信息 */
      message?: string | null
      /** 错误信息 */
      errorMessage?: string | null
      /** 结果载荷 */
      resultPayload?: unknown
      /** 操作人用户 ID */
      operatorUserId?: number | null
      /** 操作人用户名 */
      operatorUsername?: string | null
      /** 创建时间 */
      createdAt: string
    }

    type ScheduledTaskLogList = Api.Common.PaginatedResponse<ScheduledTaskLogItem>

    interface ScheduledTaskLogSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 任务 ID */
      taskId?: string | number
      /** 关键词 */
      keyword?: string
      /** 处理器 */
      handler?: ScheduledTaskHandler
      /** 触发类型 */
      triggerType?: ScheduledTaskTriggerType
      /** 状态 */
      status?: ScheduledTaskExecutionStatus
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }
  }
}
