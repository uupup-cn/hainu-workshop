import * as XLSX from 'xlsx'
import { buildExportPayload, type DataExportPayload } from './data-output'

async function saveBlob(blob: Blob, filename: string) {
  const fileSaver = await import('file-saver')
  const saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default

  saveAs(blob, filename)
}

/** 导出文件相关重依赖只在用户确认导出后加载，避免普通表格页提前下载办公媒体包。 */
export async function exportTableData(payload: DataExportPayload) {
  const { columns, exportOptions, format, outputRows, safeFilename, title } =
    buildExportPayload(payload)

  if (format === 'json') {
    const json =
      exportOptions.prettyJson === false
        ? JSON.stringify(outputRows)
        : JSON.stringify(outputRows, null, 2)
    const blob = new Blob([json], {
      type: 'application/json;charset=utf-8'
    })
    await saveBlob(blob, `${safeFilename}.json`)
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(outputRows)
  worksheet['!cols'] = [
    ...(exportOptions.includeIndex ? [{ wch: 8 }] : []),
    ...columns.map((column) => ({
      wch: Math.min(Math.max(Math.round(column.width / 8), 10), 42)
    }))
  ]

  if (exportOptions.autoFilter !== false && outputRows.length && columns.length) {
    worksheet['!autofilter'] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: {
          r: outputRows.length,
          c: columns.length - 1 + (exportOptions.includeIndex ? 1 : 0)
        }
      })
    }
  }

  const workbook = XLSX.utils.book_new()
  workbook.Props = {
    Title: title,
    Subject: '数据导出',
    Author: '海大工坊',
    Company: '海大工坊',
    CreatedDate: new Date()
  }
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    (exportOptions.sheetName || title).slice(0, 31) || '数据'
  )

  // 说明 sheet 只对 xlsx 有意义，csv/json 会保留纯数据结构。
  if (format === 'xlsx' && exportOptions.includeMetaSheet) {
    const metaWorksheet = XLSX.utils.json_to_sheet([
      { 项目: '文件标题', 内容: title },
      { 项目: '导出时间', 内容: new Date().toLocaleString('zh-CN') },
      { 项目: '数据行数', 内容: outputRows.length },
      { 项目: '字段数量', 内容: columns.length + (exportOptions.includeIndex ? 1 : 0) },
      { 项目: '字段顺序', 内容: Object.keys(outputRows[0] || {}).join(' / ') }
    ])
    metaWorksheet['!cols'] = [{ wch: 14 }, { wch: 80 }]
    XLSX.utils.book_append_sheet(workbook, metaWorksheet, '导出说明')
  }

  if (format === 'csv') {
    const csv = XLSX.write(workbook, { bookType: 'csv', type: 'string' })
    const blob = new Blob([`${exportOptions.csvBom === false ? '' : '\uFEFF'}${csv}`], {
      type: 'text/csv;charset=utf-8'
    })
    await saveBlob(blob, `${safeFilename}.csv`)
    return
  }

  const buffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    compression: true
  })
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  await saveBlob(blob, `${safeFilename}.xlsx`)
}
