import type { ColumnOption } from '@/types/component'

export type DataOutputMode = 'print' | 'export'
export type DataOutputScope = 'current' | 'selected'
export type DataOutputFormat = 'xlsx' | 'csv' | 'json'
/** 获取当前页数据，供打印/导出弹窗按范围拉取数据。 */
export type DataOutputProvider = (
  scope: DataOutputScope
) => Promise<Record<string, any>[]> | Record<string, any>[]

/** 从 ArtTable 列配置中提炼出的打印/导出列描述。 */
export interface DataOutputColumn {
  key: string
  label: string
  prop?: string
  width: number
  checked: boolean
  fixed?: boolean | 'left' | 'right'
  source: ColumnOption
}

/** 打印/导出动作的统一入参。 */
export interface DataOutputPayload {
  columns: DataOutputColumn[]
  rows: Record<string, any>[]
  title: string
  filename: string
  format: DataOutputFormat
  exportOptions?: DataExportOptions
  printOptions?: DataPrintOptions
}

/** 导出文件时的格式化与附加信息配置。 */
export interface DataExportOptions {
  sheetName?: string
  includeIndex?: boolean
  indexColumnTitle?: string
  autoFilter?: boolean
  emptyText?: string
  prettyJson?: boolean
  csvBom?: boolean
  includeMetaSheet?: boolean
  trimText?: boolean
}

/** 打印页面的纸张、密度和展示配置。 */
export interface DataPrintOptions {
  paperSize?: 'A4' | 'A3'
  orientation?: 'portrait' | 'landscape'
  density?: 'compact' | 'standard' | 'comfortable'
  fontSize?: number
  includeIndex?: boolean
  indexColumnTitle?: string
  showMeta?: boolean
  zebra?: boolean
  emptyText?: string
}

/** 标记从 DOM 反查出的行，后续转换时直接按列 key 取文本。 */
const SERIALIZED_ROW_FLAG = '__artSerializedRow'

const isColumnVisible = (column: ColumnOption) => {
  if (column.visible !== undefined) return column.visible
  return column.checked ?? true
}

const toColumnWidth = (value: unknown) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isNaN(parsed)) return parsed
  }
  return 120
}

const isOutputColumn = (column: ColumnOption) => {
  if (column.exportable === false || column.printable === false) return false
  if (column.type === 'selection' || column.type === 'expand') return false
  // 操作列默认不参与输出，只有显式声明 exportable 时才允许导出。
  if (column.prop === 'operation' || column.label === '操作') return column.exportable === true
  return !!column.prop || column.type === 'index' || column.type === 'globalIndex'
}

/** 将表格列统一转换成输出列，并处理重复 prop/type 造成的 key 冲突。 */
export const normalizeOutputColumns = (columns: ColumnOption[]) => {
  const keyCounts = new Map<string, number>()

  return columns.filter(isOutputColumn).map((column, index) => {
    const rawKey = column.prop || column.type || `column_${index}`
    const count = keyCounts.get(rawKey) || 0
    keyCounts.set(rawKey, count + 1)

    return {
      key: count ? `${rawKey}_${count}` : rawKey,
      label:
        column.label ||
        (column.type === 'index' || column.type === 'globalIndex' ? '序号' : rawKey),
      prop: column.prop,
      width: toColumnWidth(column.width || column.minWidth),
      checked: isColumnVisible(column),
      fixed: column.fixed,
      source: column
    } satisfies DataOutputColumn
  })
}

const getByPath = (row: Record<string, any>, path?: string) => {
  if (!path) return undefined
  return path.split('.').reduce<any>((target, key) => target?.[key], row)
}

/** 把单元格值压平成适合写入文件或打印表格的文本。 */
const stringifyValue = (value: any): string | number => {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toLocaleString('zh-CN')
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (Array.isArray(value)) return value.map(stringifyValue).filter(Boolean).join(' / ')

  if (typeof value === 'object') {
    if (typeof value.children === 'string' || typeof value.children === 'number') {
      return value.children
    }
    if (Array.isArray(value.children)) {
      return value.children.map(stringifyValue).filter(Boolean).join(' ')
    }
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  return String(value)
}

/** 按可见列和输出选项构造最终二维表数据。 */
export const buildOutputRows = (
  rows: Record<string, any>[],
  columns: DataOutputColumn[],
  options: Pick<
    DataExportOptions,
    'includeIndex' | 'indexColumnTitle' | 'emptyText' | 'trimText'
  > = {}
) => {
  return rows.map((row, index) => {
    const item: Record<string, string | number> = {}
    const isSerialized = row[SERIALIZED_ROW_FLAG] === true

    if (options.includeIndex) {
      item[options.indexColumnTitle || '序号'] = index + 1
    }

    columns.forEach((column) => {
      let value: any

      // DOM 降级提取出的行已经是展示文本，不再执行 formatter 或路径取值。
      if (isSerialized) {
        value = row[column.key]
      } else if (column.source.type === 'index' || column.source.type === 'globalIndex') {
        value = index + 1
      } else if (column.source.formatter) {
        value = column.source.formatter(row)
      } else if (Object.prototype.hasOwnProperty.call(row, column.key)) {
        value = row[column.key]
      } else {
        value = getByPath(row, column.prop)
      }

      const rawText = stringifyValue(value)
      const text = options.trimText && typeof rawText === 'string' ? rawText.trim() : rawText
      item[column.label] = text === '' ? options.emptyText || '' : text
    })

    return item
  })
}

/** 当调用方没有传入 data 时，从当前 Element Plus 表格 DOM 中提取已渲染文本。 */
export const extractRowsFromCurrentTable = (
  container: HTMLElement | null | undefined,
  columns: DataOutputColumn[]
) => {
  const root = container || document.body
  const table =
    root.querySelector('.art-table .el-table') || document.querySelector('.art-table .el-table')
  const bodyRows = Array.from(table?.querySelectorAll('.el-table__body-wrapper tbody tr') || [])
  const headerLabels = Array.from(
    table?.querySelectorAll('.el-table__header-wrapper th') || []
  ).map((cell) => (cell.textContent || '').trim())
  const visibleColumns = columns.filter((column) => column.checked)

  return bodyRows.map((row) => {
    const cells = Array.from(row.querySelectorAll('td'))
    const serializedRow: Record<string, any> = { [SERIALIZED_ROW_FLAG]: true }
    const usedIndexes = new Set<number>()

    visibleColumns.forEach((column) => {
      // 优先用表头文本匹配真实 DOM 列，避免列拖拽、固定列影响单元格顺序。
      let cellIndex = headerLabels.findIndex(
        (label, index) => label === column.label && !usedIndexes.has(index)
      )

      if (cellIndex < 0) {
        cellIndex = visibleColumns.findIndex((item) => item.key === column.key)
      }

      usedIndexes.add(cellIndex)
      serializedRow[column.key] = (cells[cellIndex]?.textContent || '').trim()
    })

    return serializedRow
  })
}

/** 当调用方没有传入 selectedData 时，从当前 Element Plus 表格 DOM 中提取已勾选行。 */
export const extractRowsFromSelectedTable = (
  container: HTMLElement | null | undefined,
  columns: DataOutputColumn[],
  sourceRows: Record<string, any>[] = []
) => {
  const root = container || document.body
  const table =
    root.querySelector('.art-table .el-table') || document.querySelector('.art-table .el-table')
  const bodyRows = Array.from(table?.querySelectorAll('.el-table__body-wrapper tbody tr') || [])
  const selectedIndexes = bodyRows
    .map((row, index) => {
      const isChecked = !!row.querySelector(
        '.el-checkbox.is-checked, .el-checkbox__input.is-checked'
      )
      return isChecked ? index : -1
    })
    .filter((index) => index >= 0)

  if (sourceRows.length) {
    return selectedIndexes.map((index) => sourceRows[index]).filter(Boolean)
  }

  const headerLabels = Array.from(
    table?.querySelectorAll('.el-table__header-wrapper th') || []
  ).map((cell) => (cell.textContent || '').trim())
  const visibleColumns = columns.filter((column) => column.checked)

  return selectedIndexes.map((rowIndex) => {
    const row = bodyRows[rowIndex]
    const cells = Array.from(row.querySelectorAll('td'))
    const serializedRow: Record<string, any> = { [SERIALIZED_ROW_FLAG]: true }
    const usedIndexes = new Set<number>()

    visibleColumns.forEach((column) => {
      let cellIndex = headerLabels.findIndex(
        (label, index) => label === column.label && !usedIndexes.has(index)
      )

      if (cellIndex < 0) {
        cellIndex = visibleColumns.findIndex((item) => item.key === column.key)
      }

      usedIndexes.add(cellIndex)
      serializedRow[column.key] = (cells[cellIndex]?.textContent || '').trim()
    })

    return serializedRow
  })
}

const sanitizeFilename = (filename: string) => {
  return filename.replace(/[\\/:*?"<>|]/g, '_').trim() || '导出数据'
}

export type DataExportPayload = Pick<
  DataOutputPayload,
  'columns' | 'rows' | 'filename' | 'format' | 'title' | 'exportOptions'
>

/** 根据用户选择的格式导出表格数据。 */
export const exportTableData = async (payload: DataExportPayload) => {
  const { exportTableData } = await import('./data-export')
  return exportTableData(payload)
}

export const buildExportPayload = ({
  columns,
  rows,
  filename,
  format,
  title,
  exportOptions = {}
}: DataExportPayload) => {
  const outputRows = buildOutputRows(rows, columns, exportOptions)
  const safeFilename = sanitizeFilename(filename)

  return {
    columns,
    exportOptions,
    format,
    outputRows,
    safeFilename,
    title
  }
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** 生成隐藏 iframe 打印页，避免污染当前应用 DOM 和路由状态。 */
export const printTableData = ({
  columns,
  rows,
  title,
  printOptions = {}
}: Omit<DataOutputPayload, 'format'>) => {
  const outputRows = buildOutputRows(rows, columns, printOptions)
  const headers = outputRows[0] ? Object.keys(outputRows[0]) : columns.map((column) => column.label)
  const headerHtml = headers.map((label) => `<th>${escapeHtml(label)}</th>`).join('')
  const rowHtml = outputRows
    .map((row) => {
      const cells = headers.map((label) => `<td>${escapeHtml(row[label])}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .join('')
  const densityMap = {
    compact: { th: '6px 6px', td: '5px 6px', line: 1.35 },
    standard: { th: '8px 7px', td: '7px', line: 1.45 },
    comfortable: { th: '10px 8px', td: '9px 8px', line: 1.55 }
  }
  const density = densityMap[printOptions.density || 'standard']
  const fontSize = printOptions.fontSize || 12
  const paperSize = printOptions.paperSize || 'A4'
  const orientation = printOptions.orientation || 'portrait'

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const printDocument = iframe.contentWindow?.document
  if (!printDocument || !iframe.contentWindow) {
    document.body.removeChild(iframe)
    throw new Error('无法创建打印窗口')
  }

  printDocument.open()
  printDocument.write(`<!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: ${paperSize} ${orientation}; margin: 14mm 12mm; }
          * { box-sizing: border-box; }
          body { margin: 0; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .print-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 2px solid #111827; }
          h1 { margin: 0; font-size: 20px; line-height: 1.3; font-weight: 700; }
          .meta { color: #64748b; font-size: 12px; white-space: nowrap; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          th { padding: ${density.th}; border: 1px solid #cbd5e1; background: #f1f5f9; color: #0f172a; font-size: ${fontSize}px; text-align: left; }
          td { padding: ${density.td}; border: 1px solid #e2e8f0; color: #334155; font-size: ${fontSize}px; line-height: ${density.line}; word-break: break-word; }
          ${printOptions.zebra === false ? '' : 'tr:nth-child(even) td { background: #f8fafc; }'}
          .empty { padding: 32px 0; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${escapeHtml(title)}</h1>
          ${
            printOptions.showMeta === false
              ? ''
              : `<div class="meta">共 ${outputRows.length} 条 · ${new Date().toLocaleString('zh-CN')}</div>`
          }
        </div>
        ${
          outputRows.length
            ? `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowHtml}</tbody></table>`
            : '<div class="empty">暂无可打印数据</div>'
        }
      </body>
    </html>`)
  printDocument.close()

  iframe.onload = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    window.setTimeout(() => {
      document.body.removeChild(iframe)
    }, 500)
  }
}
