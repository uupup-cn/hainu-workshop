import { ElTag } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import type { ColumnOption } from '@/types/component'
import { formatDateTime } from '@/utils'
import {
  getNotificationStatusTag,
  getNotificationStatusText,
  getNotificationTargetSummary,
  getNotificationTypeTag,
  getNotificationTypeText
} from '../shared'

type NotificationItem = Api.Interaction.NotificationItem
type NotificationStatus = Api.Interaction.NotificationStatus

type UseNotificationColumnsOptions = {
  hasAuth: (code: string) => boolean
  openEditDialog: (id: number, status: NotificationStatus) => void
  openCopyDialog: (id: number) => void
  handlePublish: (row: NotificationItem) => void
  handleRevoke: (row: NotificationItem) => void
  handleDelete: (row: NotificationItem) => void
  goDetail: (id: number) => void
}

/**
 * 创建通知列表表格列配置，集中维护展示格式、状态操作和权限控制。
 * @param options 页面传入的权限判断与行级操作回调。
 * @returns 通知列表表格列配置。
 */
export function createNotificationColumns(
  options: UseNotificationColumnsOptions
): ColumnOption<NotificationItem>[] {
  const {
    hasAuth,
    openEditDialog,
    openCopyDialog,
    handlePublish,
    handleRevoke,
    handleDelete,
    goDetail
  } = options

  return [
    { type: 'index', width: 60, label: '序号' },
    {
      prop: 'title',
      label: '通知标题',
      minWidth: 220,
      formatter: (row: NotificationItem) =>
        h(
          'div',
          {
            class: 'cursor-pointer',
            onClick: () => goDetail(row.id)
          },
          [
            h('div', { class: 'text-g-900 line-clamp-1' }, row.title || '-'),
            h('div', { class: 'text-xs text-g-500 mt-1 line-clamp-1' }, row.summary || '-')
          ]
        )
    },
    {
      prop: 'type',
      label: '通知类型',
      formatter: (row: NotificationItem) =>
        h(ElTag, { type: getNotificationTypeTag(row.type) }, () =>
          getNotificationTypeText(row.type)
        )
    },
    {
      prop: 'targetType',
      label: '发送范围',
      formatter: (row: NotificationItem) => getNotificationTargetSummary(row)
    },
    {
      prop: 'status',
      label: '状态',
      formatter: (row: NotificationItem) =>
        h(ElTag, { type: getNotificationStatusTag(row.status) }, () =>
          getNotificationStatusText(row.status)
        )
    },
    {
      prop: 'recipientCount',
      label: '接收人数',
      align: 'center'
    },
    {
      prop: 'readCount',
      label: '已读人数',
      align: 'center'
    },
    {
      prop: 'createdBy.username',
      label: '创建人',
      formatter: (row: NotificationItem) => row.createdBy?.username || '-'
    },
    {
      prop: 'publishedAt',
      label: '发布时间',
      formatter: (row: NotificationItem) =>
        row.publishedAt ? formatDateTime(row.publishedAt) : '-'
    },
    {
      prop: 'updatedAt',
      label: '更新时间',
      formatter: (row: NotificationItem) => (row.updatedAt ? formatDateTime(row.updatedAt) : '-')
    },
    {
      prop: 'operation',
      label: '操作',
      width: 260,
      fixed: 'right',
      formatter: (row: NotificationItem) =>
        h('div', [
          hasAuth('view')
            ? h(ArtButtonTable, {
                type: 'view',
                onClick: () => goDetail(row.id)
              })
            : null,
          hasAuth('edit') && row.status !== 'REVOKED'
            ? h(ArtButtonTable, {
                type: 'edit',
                onClick: () => openEditDialog(row.id, row.status)
              })
            : null,
          hasAuth('copy')
            ? h(ArtButtonTable, {
                type: 'add',
                icon: 'ri:file-copy-line',
                onClick: () => openCopyDialog(row.id)
              })
            : null,
          hasAuth('publish') && row.status === 'DRAFT'
            ? h(ArtButtonTable, {
                icon: 'ri:send-plane-line',
                iconClass: 'bg-success/12 text-success hover:bg-success/90 hover:text-white',
                onClick: () => handlePublish(row)
              })
            : null,
          hasAuth('revoke') && row.status === 'PUBLISHED'
            ? h(ArtButtonTable, {
                icon: 'ri:forbid-2-line',
                iconClass: 'bg-warning/12 text-warning hover:bg-warning/90 hover:text-white',
                onClick: () => handleRevoke(row)
              })
            : null,
          hasAuth('delete') && row.status !== 'PUBLISHED'
            ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
            : null
        ])
    }
  ]
}
