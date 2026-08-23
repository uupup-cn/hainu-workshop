declare namespace Api {
  /** 监控与观测类型 */
  namespace Monitor {
    type MonitorSecurityLevel = 'LOW' | 'MEDIUM' | 'HIGH'

    interface MonitorTrendItem {
      /** 日期 */
      date: string
      /** 成功次数 */
      successCount: number
      /** 失败次数 */
      failCount: number
    }

    interface MonitorRecentLoginItem {
      /** ID */
      id: number
      /** 日志编号 */
      logNo: string
      /** 事件类型 */
      event: string
      /** 状态 */
      status: string
      /** 用户名 */
      username?: string | null
      /** IP 地址 */
      ip?: string | null
      /** 浏览器 */
      browser?: string | null
      /** 操作系统 */
      os?: string | null
      /** 创建时间 */
      createdAt: string
      /** 描述 */
      description?: string | null
    }

    interface OnlineUserRoleItem {
      /** ID */
      id: number
      /** 编码 */
      code: string
      /** 名称 */
      name: string
    }

    interface OnlineUserItem {
      /** 会话 ID */
      sessionId: string
      /** 用户 ID */
      userId: number
      /** 用户名 */
      username: string
      /** 真实姓名 */
      realName?: string | null
      /** 手机号 */
      phone?: string | null
      /** 邮箱 */
      email?: string | null
      /** 头像 */
      avatar?: string | null
      /** 部门信息 */
      department?: Api.Identity.UserDepartmentRef | null
      /** 岗位信息 */
      post?: Api.Identity.UserPostRef | null
      /** 角色列表 */
      roles: OnlineUserRoleItem[]
      /** IP 地址 */
      ip?: string | null
      /** 用户代理 */
      userAgent?: string | null
      /** 浏览器 */
      browser: string
      /** 操作系统 */
      os: string
      /** 设备类型 */
      deviceType: 'pc' | 'mobile'
      /** 登录时间 */
      loginAt: string
      /** 最后活跃时间 */
      lastActiveAt: string
      /** 最后刷新时间 */
      lastRefreshAt?: string | null
      /** 撤销时间 */
      revokedAt?: string | null
      /** 撤销原因 */
      revokeReason?: string | null
      /** 状态 */
      status: 'ACTIVE' | 'IDLE'
      /** 不活跃时长（分钟） */
      inactiveMinutes: number
      /** 是否当前会话 */
      isCurrentSession: boolean
      /** 会话时长（分钟） */
      sessionAgeMinutes: number
    }

    interface OnlineUserSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 部门 ID */
      departmentId?: number | string
      /** 状态 */
      status?: 'ACTIVE' | 'IDLE'
      /** 设备类型 */
      deviceType?: 'pc' | 'mobile'
      /** 角色编码 */
      roleCode?: string
    }

    interface OnlineUserListResponse extends Api.Common.PaginatedResponse<OnlineUserItem> {
      /** 汇总信息 */
      summary: {
        /** 总条数 */
        total: number
        /** 活跃数量 */
        activeCount: number
        /** 空闲数量 */
        idleCount: number
        /** 去重用户数量 */
        uniqueUserCount: number
        /** 浏览器统计 */
        browserStats: Array<{
          /** 名称 */
          name: string
          /** 数量 */
          count: number
        }>
        /** 生成时间 */
        generatedAt: string
      }
    }

    interface ForceLogoutPayload {
      /** 会话 ID 列表 */
      sessionIds: string[]
      /** 原因 */
      reason?: string
    }

    interface MonitorCacheOverview {
      /** 是否启用 */
      enabled: boolean
      /** 引擎类型 */
      engine: string
      /** 状态 */
      status: 'NOT_CONFIGURED' | 'PENDING_ACCESS' | 'CONNECTED' | 'ERROR'
      /** 提示信息 */
      message: string
      /** 连接信息 */
      connection: {
        /** 是否已配置 URL */
        urlConfigured: boolean
        /** 键名前缀 */
        keyPrefix?: string | null
        /** 数据库编号 */
        database?: number | null
        /** 超时时间（毫秒） */
        timeoutMs?: number | null
      }
      /** 指标信息 */
      metrics: {
        /** 命中率 */
        hitRate?: number | null
        /** 键名数量 */
        keyCount?: number | null
        /** 已用内存 */
        memoryUsed?: string | null
        /** 已连接客户端数 */
        connectedClients?: number | null
        /** 每秒操作数 */
        opsPerSec?: number | null
      }
      /** 可管理缓存命名空间 */
      manageableNamespaces: Array<{
        /** 命名空间键 */
        key: string
        /** 展示名称 */
        label: string
      }>
      /** 规划中的面板列表 */
      plannedPanels: string[]
      /** 可执行操作 */
      actions: {
        /** 是否可刷新 */
        canRefresh: boolean
        /** 是否可清理 */
        canClear: boolean
      }
      /** 更新时间 */
      updatedAt: string
    }

    interface MonitorSystemResourceDiskItem {
      /** 文件系统 */
      filesystem: string
      /** 挂载点 */
      mountpoint: string
      /** 总字节数 */
      totalBytes: number
      /** 已用字节数 */
      usedBytes: number
      /** 可用字节数 */
      freeBytes: number
      /** 使用率 */
      usagePercent: number
    }

    interface MonitorSystemResourceNetworkInterface {
      /** 名称 */
      name: string
      /** MAC 地址 */
      mac?: string | null
      /** 地址 */
      address?: string | null
      /** 是否内网地址 */
      internal: boolean
      /** 协议族 */
      family: string
      /** 是否在线 */
      isUp: boolean
      /** 接收字节数 */
      rxBytes?: number | null
      /** 发送字节数 */
      txBytes?: number | null
    }

    interface MonitorSystemResourceOverview {
      /** 主机名 */
      hostname: string
      /** 平台 */
      platform: string
      /** 系统版本 */
      release: string
      /** 架构 */
      arch: string
      /** Node.js 版本 */
      nodeVersion: string
      /** 采样时间 */
      sampledAt: string
      /** 运行时长（秒） */
      uptimeSeconds: number
      /** 健康信息 */
      health: {
        /** 评分 */
        score: number
        /** 等级 */
        level: 'GOOD' | 'ATTENTION' | 'RISK'
        /** 警告信息 */
        warnings: string[]
      }
      /** CPU 信息 */
      cpu: {
        /** 模型标识 */
        model: string
        /** 核心数 */
        cores: number
        /** 使用率 */
        usagePercent: number
        /** 平均负载 */
        loadAverage: number[]
      }
      /** 内存信息 */
      memory: {
        /** 总字节数 */
        totalBytes: number
        /** 已用字节数 */
        usedBytes: number
        /** 可用字节数 */
        freeBytes: number
        /** 使用率 */
        usagePercent: number
      }
      /** 存储信息 */
      storage: {
        /** 总字节数 */
        totalBytes: number
        /** 已用字节数 */
        usedBytes: number
        /** 可用字节数 */
        freeBytes: number
        /** 使用率 */
        usagePercent: number
        /** 磁盘列表 */
        disks: MonitorSystemResourceDiskItem[]
      }
      /** 网络信息 */
      network: {
        /** 网卡数量 */
        interfaceCount: number
        /** 在线网卡数量 */
        upInterfaceCount: number
        /** 公网 IPv4 列表 */
        publicIpv4: string[]
        /** 总接收字节数 */
        totalRxBytes: number
        /** 总发送字节数 */
        totalTxBytes: number
        /** 网卡列表 */
        interfaces: MonitorSystemResourceNetworkInterface[]
      }
      /** 进程信息 */
      process: {
        /** 进程 ID */
        pid: number
        /** 运行时长（秒） */
        uptimeSeconds: number
        /** RSS 内存字节数 */
        rssBytes: number
        /** 已用堆内存字节数 */
        heapUsedBytes: number
        /** 堆内存总字节数 */
        heapTotalBytes: number
      }
    }

    interface MonitorOverviewResponse {
      /** 汇总信息 */
      summary: {
        /** 用户总数 */
        totalUsers: number
        /** 活跃会话数 */
        activeSessionCount: number
        /** 空闲会话数 */
        idleSessionCount: number
        /** 在线用户去重数 */
        uniqueOnlineUserCount: number
        /** 会话总数 */
        totalSessionCount: number
        /** 今日登录成功次数 */
        todayLoginSuccessCount: number
        /** 今日登录失败次数 */
        todayLoginFailCount: number
        /** 今日刷新次数 */
        todayRefreshCount: number
        /** 今日操作次数 */
        todayOperationCount: number
        /** 启用任务数 */
        enabledTaskCount: number
        /** 系统参数数量 */
        systemParamCount: number
        /** 安全等级 */
        securityLevel: MonitorSecurityLevel
        /** 生成时间 */
        generatedAt: string
      }
      /** 登录趋势 */
      loginTrend: MonitorTrendItem[]
      /** 最近会话 */
      recentSessions: OnlineUserItem[]
      /** 最近登录记录 */
      recentLogins: MonitorRecentLoginItem[]
      /** 系统资源 */
      systemResource: MonitorSystemResourceOverview
      /** 缓存概览 */
      cache: MonitorCacheOverview
    }
    type SecurityLevel = MonitorSecurityLevel
    type TrendItem = MonitorTrendItem
    type RecentLoginItem = MonitorRecentLoginItem
    type CacheOverview = MonitorCacheOverview
    type SystemResourceDiskItem = MonitorSystemResourceDiskItem
    type SystemResourceNetworkInterface = MonitorSystemResourceNetworkInterface
    type SystemResourceOverview = MonitorSystemResourceOverview
    type OverviewResponse = MonitorOverviewResponse
  }
}
