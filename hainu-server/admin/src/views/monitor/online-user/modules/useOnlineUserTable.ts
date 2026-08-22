import { h, reactive, ref } from 'vue'
import { ElTag } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { fetchOnlineUsers } from '@/api/monitor'
import { useTableColumns } from '@/hooks/core/useTableColumns'
import { formatDateTime } from '@/utils'
import { formatOnlineSessionAge } from '../../shared'

type OnlineUserItem = Api.Monitor.OnlineUserItem

interface UseOnlineUserTableOptions {
  openDetail: (row: OnlineUserItem) => void
  handleForceLogout: (row: OnlineUserItem) => void
}

/**
 * 构建在线用户表格的数据源、分页与列定义。
 * 该组合式函数将页面级表格逻辑收敛到单独文件，便于复用和维护。
 */
export function useOnlineUserTable({ openDetail, handleForceLogout }: UseOnlineUserTableOptions) {
  const records = ref<OnlineUserItem[]>([])
  const loading = ref(false)
  const pagination = reactive({
    current: 1,
    size: 20,
    total: 0
  })
  const searchParams = ref<Record<string, any>>({})

  const { columns, columnChecks } = useTableColumns<OnlineUserItem>(() => [
    { type: 'selection' as const },
    {
      prop: 'username',
      label: '账号',
      minWidth: 180,
      formatter: (row: OnlineUserItem) =>
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-g-900' }, row.realName || row.username),
          h('span', { class: 'text-xs text-g-600' }, row.username)
        ])
    },
    {
      prop: 'department',
      label: '部门 / 岗位',
      minWidth: 160,
      formatter: (row: OnlineUserItem) =>
        `${row.department?.name || '未分配'} / ${row.post?.name || '未设置'}`
    },
    {
      prop: 'roles',
      label: '角色',
      minWidth: 180,
      formatter: (row: OnlineUserItem) => row.roles.map((item) => item.name).join(' / ') || '-'
    },
    {
      prop: 'ip',
      label: 'IP',
      minWidth: 140,
      formatter: (row: OnlineUserItem) => row.ip || '-'
    },
    {
      prop: 'deviceType',
      label: '设备',
      width: 100
    },
    {
      prop: 'browser',
      label: '浏览器',
      minWidth: 120
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      formatter: (row: OnlineUserItem) =>
        h(ElTag, { type: row.status === 'ACTIVE' ? 'success' : 'warning', effect: 'light' }, () =>
          row.status === 'ACTIVE' ? '活跃' : '空闲'
        )
    },
    {
      prop: 'lastActiveAt',
      label: '最后活跃',
      minWidth: 170,
      formatter: (row: OnlineUserItem) => formatDateTime(row.lastActiveAt)
    },
    {
      prop: 'sessionAgeMinutes',
      label: '在线时长',
      minWidth: 120,
      formatter: (row: OnlineUserItem) => formatOnlineSessionAge(row.sessionAgeMinutes)
    },
    {
      prop: 'actions',
      label: '操作',
      fixed: 'right',
      width: 120,
      formatter: (row: OnlineUserItem) =>
        h('div', [
          h(ArtButtonTable, {
            type: 'view',
            onClick: () => openDetail(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleForceLogout(row)
          })
        ])
    }
  ])

  /**
   * 拉取在线用户列表，并同步分页摘要信息。
   */
  const getData = async () => {
    loading.value = true

    try {
      const response = await fetchOnlineUsers({
        current: pagination.current,
        size: pagination.size,
        ...searchParams.value
      })
      records.value = response.records
      pagination.total = response.total
      ;(pagination as any).extraSummary = response.summary
    } finally {
      loading.value = false
    }
  }

  /**
   * 替换查询参数并回到第一页。
   */
  const replaceSearchParams = (params: Record<string, any>) => {
    searchParams.value = params
    pagination.current = 1
    getData()
  }

  /**
   * 清空查询参数并重新加载第一页。
   */
  const resetSearchParams = () => {
    searchParams.value = {}
    pagination.current = 1
    getData()
  }

  /**
   * 变更每页条数后重新拉取列表。
   */
  const handleSizeChange = (size: number) => {
    pagination.size = size
    pagination.current = 1
    getData()
  }

  /**
   * 切换分页页码后重新拉取列表。
   */
  const handleCurrentChange = (current: number) => {
    pagination.current = current
    getData()
  }

  return {
    columns,
    columnChecks,
    records,
    loading,
    pagination,
    searchParams,
    replaceSearchParams,
    resetSearchParams,
    getData,
    handleSizeChange,
    handleCurrentChange
  }
}
