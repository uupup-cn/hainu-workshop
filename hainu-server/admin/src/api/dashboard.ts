import request from '@/utils/http'

// 分析仪表统计数据（GET /api/v1/admin/dashboard/stats 响应 data 结构）
export interface DashboardTrendItem {
  /** 日期（YYYY-MM-DD） */
  date: string
  /** 数量 */
  count: number
}

export interface DashboardTopToolItem {
  /** 工具名称 */
  name: string
  /** 使用次数 */
  count: number
}

export interface DashboardStats {
  users: {
    total: number
    todayNew: number
    weekTrend: DashboardTrendItem[]
    identityDist: { freshman: number; undergrad: number; grad: number }
    verifiedRate: number
  }
  activity: {
    todayLogins: number
    loginWeekTrend: DashboardTrendItem[]
    onlineNow: number
  }
  community: {
    posts: number
    confessions: number
    todayPosts: number
    pendingReports: number
  }
  marketplace: {
    activeItems: number
    todayPublished: number
    totalViews: number
    offItems: number
  }
  tools: {
    totalUsage: number
    todayUsage: number
    topTools: DashboardTopToolItem[]
  }
  service: {
    pendingFeedback: number
    uptimeDays: number
  }
}

/**
 * 获取分析仪表统计数据
 */
export function fetchDashboardStats() {
  return request.get<DashboardStats>({
    url: '/api/v1/admin/dashboard/stats'
  })
}
