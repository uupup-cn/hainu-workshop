// 日志模块的展示字典集中维护，避免后续新增日志类型时只改了后端没同步到筛选项。
type LogTagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

// 登录日志事件筛选项
export const LOGIN_EVENT_OPTIONS = [
  { label: '登录', value: 'LOGIN' },
  { label: '退出', value: 'LOGOUT' },
  { label: '注册', value: 'REGISTER' },
  { label: '续签', value: 'REFRESH' }
] as const

// 登录事件值到文案的映射
export const LOGIN_EVENT_LABELS: Record<string, string> = {
  LOGIN: '登录',
  LOGOUT: '退出',
  REGISTER: '注册',
  REFRESH: '续签'
}

// 操作日志类型筛选项
export const OPERATION_TYPE_OPTIONS = [
  { label: '新增', value: '新增' },
  { label: '编辑', value: '编辑' },
  { label: '删除', value: '删除' },
  { label: '授权', value: '授权' },
  { label: '数据权限', value: '数据权限' },
  { label: '发布', value: '发布' },
  { label: '撤回', value: '撤回' },
  { label: '下线', value: '下线' },
  { label: '上传', value: '上传' },
  { label: '公开', value: '公开' },
  { label: '恢复', value: '恢复' },
  { label: '彻底删除', value: '彻底删除' },
  { label: '执行', value: '执行' },
  { label: '清空', value: '清空' },
  { label: '刷新缓存', value: '刷新缓存' },
  { label: '刷新缓存监控', value: '刷新缓存监控' },
  { label: '强制下线', value: '强制下线' },
  { label: '处置', value: '处置' }
] as const

// 操作类型到标签样式的映射
export const OPERATION_TYPE_TAGS: Record<string, LogTagType> = {
  新增: 'primary',
  编辑: 'warning',
  删除: 'danger',
  授权: 'success',
  数据权限: 'primary',
  发布: 'success',
  撤回: 'warning',
  下线: 'warning',
  上传: 'primary',
  公开: 'success',
  恢复: 'success',
  彻底删除: 'danger',
  执行: 'primary',
  清空: 'danger',
  刷新缓存: 'warning',
  刷新缓存监控: 'warning',
  强制下线: 'danger',
  处置: 'warning'
}

// 将登录事件编码转换为展示文案
export function resolveLoginEventLabel(event?: string | null) {
  if (!event) return '-'
  return LOGIN_EVENT_LABELS[event] || event
}

// 将操作类型转换为标签样式
export function resolveOperationTypeTag(type?: string | null): LogTagType {
  if (!type) return 'info'
  return OPERATION_TYPE_TAGS[type] || 'info'
}
