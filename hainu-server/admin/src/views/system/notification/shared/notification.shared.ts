import type { FormRules } from 'element-plus'

type NotificationItem = Api.Interaction.NotificationItem
type NotificationPayload = Api.Interaction.NotificationPayload
type NotificationType = Api.Interaction.NotificationType
type NotificationStatus = Api.Interaction.NotificationStatus
type NotificationTargetType = Api.Interaction.NotificationTargetType

export type NotificationDialogMode = 'add' | 'edit'

export const notificationTypeOptions = [
  { label: '系统通知', value: 'SYSTEM' },
  { label: '公告通知', value: 'ANNOUNCEMENT' },
  { label: '预警通知', value: 'ALERT' },
  { label: '更新通知', value: 'UPDATE' }
] satisfies Array<{ label: string; value: NotificationType }>

export const notificationStatusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '已发布', value: 'PUBLISHED' },
  { label: '已撤回', value: 'REVOKED' }
] satisfies Array<{ label: string; value: NotificationStatus }>

export const notificationTargetTypeOptions = [
  { label: '全员', value: 'ALL' },
  { label: '按部门', value: 'DEPARTMENT' },
  { label: '按角色', value: 'ROLE' },
  { label: '指定用户', value: 'USER' }
] satisfies Array<{ label: string; value: NotificationTargetType }>

/**
 * 创建通知管理搜索表单的默认值。
 * @returns 通知查询表单初始值。
 */
export function createNotificationSearchForm() {
  return {
    keyword: '',
    type: undefined as NotificationType | undefined,
    status: undefined as NotificationStatus | undefined,
    targetType: undefined as NotificationTargetType | undefined,
    daterange: undefined as string[] | undefined
  }
}

/**
 * 创建通知新增/编辑表单的默认值。
 * @returns 通知提交载荷初始值。
 */
export function createNotificationForm(): NotificationPayload {
  return {
    title: '',
    summary: '',
    content: '',
    type: 'SYSTEM',
    targetType: 'ALL',
    status: 'PUBLISHED',
    expiresAt: '',
    targetRoleIds: [],
    targetDepartmentIds: [],
    targetUserIds: []
  }
}

/**
 * 移除富文本标签并压缩空白字符，用于内容必填校验。
 * @param html 富文本 HTML 字符串。
 * @returns 纯文本内容。
 */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 校验通知发送范围是否已选择对应目标对象。
 * @param targetType 当前发送范围类型。
 * @param payload 通知表单载荷。
 * @param callback Element Plus 表单校验回调。
 */
export function validateTargetSelection(
  targetType: NotificationTargetType,
  payload: NotificationPayload,
  callback: (error?: Error) => void
) {
  if (targetType === 'ALL') {
    callback()
    return
  }

  if (
    (targetType === 'DEPARTMENT' &&
      (!payload.targetDepartmentIds || !payload.targetDepartmentIds.length)) ||
    (targetType === 'ROLE' && (!payload.targetRoleIds || !payload.targetRoleIds.length)) ||
    (targetType === 'USER' && (!payload.targetUserIds || !payload.targetUserIds.length))
  ) {
    callback(new Error('请补充当前发送范围的目标对象'))
    return
  }

  callback()
}

/**
 * 创建通知表单校验规则。
 * @param getTargetType 获取当前发送范围类型的方法。
 * @param getPayload 获取最新通知表单载荷的方法。
 * @returns Element Plus 表单校验规则。
 */
export function createNotificationRules(
  getTargetType: () => NotificationTargetType,
  getPayload: () => NotificationPayload
): FormRules {
  return {
    title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
    targetType: [{ required: true, message: '请选择发送范围', trigger: 'change' }],
    content: [
      {
        validator: (_rule, value, callback) => {
          const text = stripHtml(value || '')
          if (!text) {
            callback(new Error('请输入通知内容'))
            return
          }
          callback()
        },
        trigger: 'change'
      }
    ],
    targetDepartmentIds: [
      {
        validator: (_rule, _value, callback) =>
          validateTargetSelection(getTargetType(), getPayload(), callback),
        trigger: 'change'
      }
    ],
    targetRoleIds: [
      {
        validator: (_rule, _value, callback) =>
          validateTargetSelection(getTargetType(), getPayload(), callback),
        trigger: 'change'
      }
    ],
    targetUserIds: [
      {
        validator: (_rule, _value, callback) =>
          validateTargetSelection(getTargetType(), getPayload(), callback),
        trigger: 'change'
      }
    ]
  }
}

/**
 * 获取通知类型的中文展示名称。
 * @param type 通知类型枚举。
 * @returns 通知类型名称。
 */
export function getNotificationTypeText(type: NotificationType) {
  return (
    {
      SYSTEM: '系统通知',
      ANNOUNCEMENT: '公告通知',
      ALERT: '预警通知',
      UPDATE: '更新通知'
    }[type] || type
  )
}

/**
 * 获取通知状态的中文展示名称。
 * @param status 通知状态枚举。
 * @returns 通知状态名称。
 */
export function getNotificationStatusText(status: NotificationStatus) {
  return (
    {
      DRAFT: '草稿',
      PUBLISHED: '已发布',
      REVOKED: '已撤回'
    }[status] || status
  )
}

/**
 * 获取通知类型对应的标签颜色。
 * @param type 通知类型枚举。
 * @returns Element Plus 标签类型。
 */
export function getNotificationTypeTag(
  type: NotificationType
): 'primary' | 'success' | 'warning' | 'danger' {
  switch (type) {
    case 'ANNOUNCEMENT':
      return 'success'
    case 'ALERT':
      return 'danger'
    case 'UPDATE':
      return 'warning'
    default:
      return 'primary'
  }
}

/**
 * 获取通知状态对应的标签颜色。
 * @param status 通知状态枚举。
 * @returns Element Plus 标签类型。
 */
export function getNotificationStatusTag(
  status: NotificationStatus
): 'info' | 'success' | 'warning' {
  switch (status) {
    case 'PUBLISHED':
      return 'success'
    case 'REVOKED':
      return 'warning'
    default:
      return 'info'
  }
}

/**
 * 安全读取数组长度，避免接口返回空值时展示异常。
 */
const getSafeLength = (value: unknown) => (Array.isArray(value) ? value.length : 0)

/**
 * 生成人可读的通知发送范围摘要。
 * @param row 通知列表行数据。
 * @returns 发送范围摘要文本。
 */
export function getNotificationTargetSummary(row: NotificationItem) {
  if (row.targetType === 'ALL') return '全员'
  if (row.targetType === 'ROLE') return `按角色 (${getSafeLength(row.targetRoleIds)})`
  if (row.targetType === 'DEPARTMENT') {
    return `按部门 (${getSafeLength(row.targetDepartmentIds)})`
  }
  return `指定用户 (${getSafeLength(row.targetUserIds)})`
}
