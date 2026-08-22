import type { TagProps } from 'element-plus'

export const MONITOR_COUNT_ANIMATION_DURATION = 1200
export const MONITOR_SCORE_ANIMATION_DURATION = 1500

export const MONITOR_PROGRESS_TRANSITION = {
  transition: `width ${MONITOR_COUNT_ANIMATION_DURATION}ms ease`
}

export const MONITOR_SCORE_PROGRESS_TRANSITION = {
  transition: `width ${MONITOR_SCORE_ANIMATION_DURATION}ms ease`
}

/**
 * 生成在线用户页的默认筛选表单。
 * 通过工厂函数创建，可在重置筛选时复用同一份默认结构。
 */
export function createOnlineUserSearchForm() {
  return {
    keyword: '',
    status: '',
    deviceType: '',
    roleCode: ''
  }
}

/**
 * 获取缓存状态对应的标签类型。
 */
export function getMonitorCacheStatusTagType(
  status?: Api.Monitor.CacheOverview['status']
): TagProps['type'] {
  switch (status) {
    case 'CONNECTED':
      return 'success'
    case 'PENDING_ACCESS':
      return 'warning'
    case 'ERROR':
      return 'danger'
    default:
      return 'info'
  }
}

/**
 * 获取缓存状态对应的展示文案。
 */
export function getMonitorCacheStatusText(status?: Api.Monitor.CacheOverview['status']) {
  switch (status) {
    case 'CONNECTED':
      return '已连接'
    case 'PENDING_ACCESS':
      return '待接入'
    case 'ERROR':
      return '异常'
    default:
      return '未配置'
  }
}

/**
 * 获取监控概览页安全等级标签类型。
 */
export function getMonitorSecurityTagType(
  level?: Api.Monitor.OverviewResponse['summary']['securityLevel']
): TagProps['type'] {
  switch (level) {
    case 'HIGH':
      return 'danger'
    case 'MEDIUM':
      return 'warning'
    default:
      return 'success'
  }
}

/**
 * 获取监控概览页安全等级文案。
 */
export function getMonitorSecurityLabel(
  level?: Api.Monitor.OverviewResponse['summary']['securityLevel']
) {
  switch (level) {
    case 'HIGH':
      return '高'
    case 'MEDIUM':
      return '中'
    default:
      return '低'
  }
}

/**
 * 计算登录趋势条宽度。
 * 为了保证小流量数据也可见，非零值会保留最小展示宽度。
 */
export function getMonitorTrendWidth(
  trend: Api.Monitor.OverviewResponse['loginTrend'] = [],
  value: number
) {
  const max = Math.max(...trend.flatMap((item) => [item.successCount, item.failCount]), 1)

  return Math.max((value / max) * 100, value > 0 ? 8 : 0)
}

/**
 * 将登录事件类型映射为页面展示文案。
 */
export function resolveMonitorEventLabel(event: string) {
  const eventLabelMap: Record<string, string> = {
    LOGIN: '登录',
    LOGOUT: '退出',
    REGISTER: '注册',
    REFRESH: '续签'
  }

  return eventLabelMap[event] || event
}

/**
 * 将在线时长分钟数转换为可读文案。
 */
export function formatOnlineSessionAge(minutes?: number) {
  if (!minutes) return '-'
  if (minutes < 60) return `${minutes} 分钟`

  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return restMinutes > 0 ? `${hours} 小时 ${restMinutes} 分钟` : `${hours} 小时`
}
