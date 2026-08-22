/**
 * 统一格式化日期时间，默认输出本地时区的 YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(
  value?: string | number | Date | null,
  pattern = 'YYYY-MM-DD HH:mm:ss'
) {
  if (value === null || value === undefined || value === '') return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return useDateFormat(date, pattern).value
}
