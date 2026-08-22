import type { ColumnOption } from '@/types/component'

export const LEGACY_COLUMN_PREFERENCE_STORAGE_PREFIX = 'art-table-header:columns:v1'

/**
 * 单列用户偏好。
 *
 * 这里只保存稳定标识和显隐状态，不保存 label、width、formatter 等完整列配置。
 * 这样业务代码更新列定义后，本地偏好只负责恢复用户操作过的部分。
 */
export interface TableColumnPreferenceItem {
  key: string
  visible: boolean
}

/**
 * 表格列偏好快照。
 *
 * columns 数组顺序代表用户保存时的列顺序，version 用于后续存储结构升级。
 */
export interface TableColumnPreference {
  version: 1
  columns: TableColumnPreferenceItem[]
  updatedAt: number
}

/**
 * Element Plus 特殊列没有 prop，需要映射成稳定 key，避免保存后无法恢复。
 */
const SPECIAL_COLUMN_KEYS: Record<string, string> = {
  selection: '__selection__',
  expand: '__expand__',
  index: '__index__',
  globalIndex: '__globalIndex__'
}

/**
 * 获取列偏好的稳定标识。
 *
 * 推荐业务列都配置 prop；label 和 index 只是兜底，列名或顺序变化时不如 prop 稳定。
 */
export const getColumnPreferenceKey = <T>(column: ColumnOption<T>, index = 0) => {
  if (column.type && SPECIAL_COLUMN_KEYS[column.type]) return SPECIAL_COLUMN_KEYS[column.type]
  if (column.prop) return column.prop
  if (column.key) return String(column.key)
  if (column.label) return `label:${column.label}`
  return `column:${index}`
}

/**
 * 获取列当前显隐状态，兼容项目内同时存在的 visible 和 checked 字段。
 */
export const getColumnPreferenceVisibility = <T>(column: ColumnOption<T>) => {
  if (column.visible !== undefined) return column.visible
  return column.checked ?? true
}

const isColumnFixed = <T>(column: ColumnOption<T>) => Boolean(column.fixed)

/**
 * 根据当前列配置生成可持久化的偏好快照。
 */
export const createColumnPreferenceSnapshot = <T>(
  columns: ColumnOption<T>[]
): TableColumnPreference => ({
  version: 1,
  updatedAt: Date.now(),
  columns: columns.map((column, index) => ({
    key: getColumnPreferenceKey(column, index),
    visible: getColumnPreferenceVisibility(column)
  }))
})

/**
 * 解析本地存储里的列偏好。
 *
 * 非法 JSON、未知版本、字段结构异常都会返回 null，调用方可以直接忽略。
 */
export const parseColumnPreference = (rawValue: string | null): TableColumnPreference | null => {
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue) as Partial<TableColumnPreference>
    if (parsed.version !== 1 || !Array.isArray(parsed.columns)) return null

    const columns = parsed.columns
      .filter(
        (column): column is TableColumnPreferenceItem =>
          typeof column?.key === 'string' && typeof column.visible === 'boolean'
      )
      .filter((column, index, list) => list.findIndex((item) => item.key === column.key) === index)

    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
      columns
    }
  } catch {
    return null
  }
}

/**
 * 清理旧版本列偏好本地存储。
 */
export const clearLegacyColumnPreferenceStorage = () => {
  if (typeof window === 'undefined') return

  const legacyKeyPrefix = `${LEGACY_COLUMN_PREFERENCE_STORAGE_PREFIX}:`

  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith(legacyKeyPrefix)) {
      window.localStorage.removeItem(key)
    }
  })
}

/**
 * 将保存的用户偏好合并到当前代码里的列定义。
 *
 * 合并原则：
 * - 当前代码里的列定义是基准，确保 formatter、width、fixed 等配置始终使用最新版。
 * - 偏好里存在但当前代码已删除的列会被忽略。
 * - 当前代码新增的列会追加到已恢复的可移动列后面，并使用代码里的默认显隐状态。
 * - fixed 列保持当前代码定义的位置，不受历史拖拽顺序影响。
 */
export const mergeColumnsWithPreference = <T>(
  columns: ColumnOption<T>[],
  preference: TableColumnPreference | null
) => {
  if (!preference?.columns.length) return columns

  const columnsByKey = new Map(
    columns.map((column, index) => [getColumnPreferenceKey(column, index), column])
  )
  const visibilityByKey = new Map(preference.columns.map((column) => [column.key, column.visible]))
  const orderedKeys = preference.columns.map((column) => column.key)
  const usedMovableKeys = new Set<string>()

  /**
   * disabled 列不接受用户偏好覆盖，避免用户通过历史存储绕过不可配置列。
   */
  const applyVisibility = (column: ColumnOption<T>, index: number) => {
    const key = getColumnPreferenceKey(column, index)
    const visible = column.disabled
      ? getColumnPreferenceVisibility(column)
      : (visibilityByKey.get(key) ?? getColumnPreferenceVisibility(column))

    return {
      ...column,
      checked: visible,
      visible
    }
  }

  /**
   * 先按用户保存顺序恢复仍然存在的可移动列，删除过的列自然会被跳过。
   */
  const restoredMovableColumns = orderedKeys
    .map((key) => {
      const column = columnsByKey.get(key)
      if (!column || isColumnFixed(column)) return null
      usedMovableKeys.add(key)
      return column
    })
    .filter(Boolean) as ColumnOption<T>[]

  /**
   * 再补上当前代码中新加入或没有历史偏好的可移动列。
   */
  const newMovableColumns = columns.filter((column, index) => {
    const key = getColumnPreferenceKey(column, index)
    return !isColumnFixed(column) && !usedMovableKeys.has(key)
  })

  const movableColumns = [...restoredMovableColumns, ...newMovableColumns]

  /**
   * 用当前代码的列位置作为骨架：fixed 列留在原位置，可移动列按合并后的队列填回去。
   */
  return columns.map((column, index) => {
    if (isColumnFixed(column)) return applyVisibility(column, index)
    return applyVisibility(movableColumns.shift() ?? column, index)
  })
}
