import { ElTag } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import type { ColumnOption } from '@/types/component'
import { formatDateTime } from '@/utils'
import { resolveValueTypeLabel, resolveValueTypeTag } from '../shared'

type SystemParamItem = Api.Settings.SystemParamItem

type UseSystemParamColumnsOptions = {
  hasAuth: (code: string) => boolean
  openDialog: (mode: 'add' | 'edit', row?: SystemParamItem) => void
  handleDelete: (row: SystemParamItem) => void
}

/**
 * 创建系统参数表格列配置，统一封装展示、权限按钮和行级操作。
 * @param options 页面注入的权限判断与操作回调。
 * @returns 系统参数表格列配置。
 */
export function createSystemParamColumns(
  options: UseSystemParamColumnsOptions
): ColumnOption<SystemParamItem>[] {
  const { hasAuth, openDialog, handleDelete } = options

  return [
    {
      type: 'selection',
      width: 48,
      selectable: (row: SystemParamItem) => !row.builtIn
    },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'name', label: '参数名称', minWidth: 180 },
    {
      prop: 'key',
      label: '参数键名',
      minWidth: 220,
      formatter: (row: SystemParamItem) =>
        h('div', { class: 'font-mono text-xs text-g-700' }, row.key)
    },
    {
      prop: 'groupName',
      label: '分组',
      width: 120,
      formatter: (row: SystemParamItem) =>
        h(ElTag, { type: 'info', effect: 'plain' }, () => row.groupName)
    },
    {
      prop: 'valueType',
      label: '类型',
      width: 110,
      formatter: (row: SystemParamItem) =>
        h(ElTag, { type: resolveValueTypeTag(row.valueType), effect: 'light' }, () =>
          resolveValueTypeLabel(row.valueType)
        )
    },
    {
      prop: 'value',
      label: '当前值',
      minWidth: 240,
      formatter: (row: SystemParamItem) =>
        h(
          'div',
          { class: 'max-w-[360px] truncate font-mono text-xs text-g-700', title: row.value },
          row.value
        )
    },
    {
      prop: 'enabled',
      label: '状态',
      width: 100,
      formatter: (row: SystemParamItem) =>
        h(ElTag, { type: row.enabled ? 'success' : 'info' }, () => (row.enabled ? '启用' : '禁用'))
    },
    {
      prop: 'builtIn',
      label: '属性',
      width: 100,
      formatter: (row: SystemParamItem) =>
        h(ElTag, { type: row.builtIn ? 'warning' : 'primary', effect: 'light' }, () =>
          row.builtIn ? '内置' : '自定义'
        )
    },
    {
      prop: 'updatedAt',
      label: '最后更新',
      width: 180,
      formatter: (row: SystemParamItem) => formatDateTime(row.updatedAt)
    },
    {
      prop: 'updatedByUser',
      label: '更新人',
      width: 120,
      formatter: (row: SystemParamItem) => row.updatedByUser?.username || '-'
    },
    {
      prop: 'operation',
      label: '操作',
      width: 140,
      fixed: 'right',
      formatter: (row: SystemParamItem) =>
        h('div', { class: 'flex items-center gap-1' }, [
          hasAuth('edit')
            ? h(ArtButtonTable, { type: 'edit', onClick: () => openDialog('edit', row) })
            : null,
          hasAuth('delete')
            ? h(ArtButtonTable, {
                type: 'delete',
                disabled: row.builtIn,
                onClick: () => handleDelete(row)
              })
            : null
        ])
    }
  ]
}
