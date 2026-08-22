<template>
  <div class="art-full-height">
    <ArtSearchBar
      v-show="showSearchBar"
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        :data="data"
        :selected-data="selectedRows"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton
              type="danger"
              plain
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
            >
              删除
            </ElButton>
            <ElButton type="danger" plain :disabled="data.length === 0" @click="handleClear">
              清空
            </ElButton>
            <ElButton plain :disabled="loading || data.length === 0" @click="handleExport">
              导出
            </ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <ElDrawer
      v-model="detailVisible"
      title="登录日志详情"
      :size="detailDrawerSize"
      class="login-log-detail-drawer"
    >
      <div v-loading="detailLoading" class="login-log-detail-drawer__content">
        <ElDescriptions :column="isMobileLayout ? 1 : 2" border>
          <ElDescriptionsItem label="访问编号">{{ detail?.logNo || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="访问事件">{{
            getEventLabel(detail?.event)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="用户ID">{{ detail?.userId ?? '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="用户名称">{{ detail?.username || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="设备类型">{{ detail?.deviceType || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="访问地址">{{ detail?.ip || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="登录地点">{{ detail?.location || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detail?.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detail?.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detail?.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ detail?.status === 'SUCCESS' ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="访问时间">
            {{ formatDateTime(detail?.createdAt) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="描述">{{ detail?.description || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="User Agent" :span="isMobileLayout ? 1 : 2">
            {{ detail?.userAgent || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import * as XLSX from 'xlsx'
  import FileSaver from 'file-saver'
  import { useWindowSize } from '@vueuse/core'
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import {
    fetchClearLoginLogs,
    fetchDeleteLoginLogs,
    fetchExportLoginLogs,
    fetchLoginLogDetail,
    fetchLoginLogs
  } from '@/api/logs'
  import { LOGIN_EVENT_OPTIONS, resolveLoginEventLabel } from '@/constants/logs'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'LoginLog' })

  type LoginLogItem = Api.Audit.LoginLogItem

  const showSearchBar = ref(false)
  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detail = ref<LoginLogItem | null>(null)
  const selectedRows = ref<LoginLogItem[]>([])
  const { width } = useWindowSize()
  const isMobileLayout = computed(() => width.value < 768)
  const detailDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '720px'
  })

  const searchForm = ref({
    event: '',
    username: '',
    status: '',
    ip: '',
    daterange: undefined as string[] | undefined
  })

  /**
   * 构建登录日志搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '访问事件',
      key: 'event',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择访问事件',
        options: LOGIN_EVENT_OPTIONS
      }
    },
    {
      label: '用户名称',
      key: 'username',
      type: 'input',
      props: { clearable: true, placeholder: '请输入用户名称' }
    },
    {
      label: '访问地址',
      key: 'ip',
      type: 'input',
      props: { clearable: true, placeholder: '请输入 IP 地址' }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '成功', value: 'SUCCESS' },
          { label: '失败', value: 'FAIL' }
        ]
      }
    },
    {
      label: '访问时间',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  ])

  // 根据事件类型返回文案
  const getEventLabel = (event?: string | null) => resolveLoginEventLabel(event)

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    searchParams,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchLoginLogs,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        {
          prop: 'logNo',
          label: '访问编号',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'userId',
          label: '用户ID',
          width: 100,
          formatter: (row) => row.userId ?? '-'
        },
        {
          prop: 'username',
          label: '用户名称',
          minWidth: 120,
          formatter: (row) => row.username || '-'
        },
        {
          prop: 'deviceType',
          label: '设备类型',
          width: 100,
          formatter: (row) => row.deviceType || '-'
        },
        {
          prop: 'ip',
          label: '地址',
          minWidth: 130,
          formatter: (row) => row.ip || '-'
        },
        {
          prop: 'location',
          label: '登录地点',
          minWidth: 120,
          formatter: (row) => row.location || '-'
        },
        {
          prop: 'os',
          label: '操作系统',
          minWidth: 120,
          formatter: (row) => row.os || '-'
        },
        {
          prop: 'browser',
          label: '浏览器',
          minWidth: 110,
          formatter: (row) => row.browser || '-'
        },
        {
          prop: 'status',
          label: '状态',
          width: 90,
          formatter: (row) =>
            h(ElTag, { type: row.status === 'SUCCESS' ? 'success' : 'danger' }, () =>
              row.status === 'SUCCESS' ? '成功' : '失败'
            )
        },
        {
          prop: 'description',
          label: '描述',
          minWidth: 120,
          formatter: (row) => row.description || '-'
        },
        {
          prop: 'createdAt',
          label: '访问时间',
          minWidth: 170,
          formatter: (row) => formatDateTime(row.createdAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'view',
                onClick: () => handleView(row.id)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => handleDelete(row)
              })
            ])
        }
      ]
    }
  })

  // 提交筛选条件并刷新列表
  const handleSearch = async () => {
    const params = searchForm.value
    const [startTime, endTime] = Array.isArray(params.daterange)
      ? params.daterange
      : [undefined, undefined]
    await replaceSearchParams({
      event: params.event || undefined,
      username: params.username || undefined,
      status: params.status || undefined,
      ip: params.ip || undefined,
      startTime,
      endTime
    })
  }

  // 重置筛选条件并重新查询
  const handleReset = () => {
    Object.assign(searchForm.value, {
      event: '',
      username: '',
      status: '',
      ip: '',
      daterange: undefined
    })
    resetSearchParams()
  }

  // 打开登录日志详情
  const handleView = async (id: number) => {
    detailVisible.value = true
    detailLoading.value = true
    try {
      detail.value = await fetchLoginLogDetail(id)
    } catch (error) {
      console.error(error)
      ElMessage.error('获取日志详情失败')
    } finally {
      detailLoading.value = false
    }
  }

  // 同步表格选中项
  const handleSelectionChange = (selection: LoginLogItem[]) => {
    selectedRows.value = selection
  }

  // 删除单条登录日志
  const handleDelete = async (row: LoginLogItem) => {
    try {
      await ElMessageBox.confirm('确定删除这条登录日志吗？', '删除登录日志', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteLoginLogs([row.id])
      ElMessage.success('删除成功')
      selectedRows.value = selectedRows.value.filter((item) => item.id !== row.id)
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 批量删除选中的登录日志
  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确定删除选中的 ${selectedRows.value.length} 条登录日志吗？`,
        '批量删除登录日志',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await fetchDeleteLoginLogs(selectedRows.value.map((item) => item.id))
      ElMessage.success('删除成功')
      selectedRows.value = []
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 按当前筛选条件清空登录日志
  const handleClear = async () => {
    try {
      await ElMessageBox.confirm('确定清空全部登录日志吗？该操作不可恢复。', '清空登录日志', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchClearLoginLogs()
      ElMessage.success('清空成功')
      selectedRows.value = []
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 导出当前筛选条件下的登录日志
  const handleExport = async () => {
    try {
      const records = await fetchExportLoginLogs({ ...searchParams })
      if (!records.length) {
        ElMessage.warning('暂无可导出的数据')
        return
      }

      const exportData = records.map((item) => ({
        访问编号: item.logNo,
        访问事件: getEventLabel(item.event),
        用户ID: item.userId ?? '-',
        用户名称: item.username || '-',
        设备类型: item.deviceType || '-',
        访问地址: item.ip || '-',
        登录地点: item.location || '-',
        操作系统: item.os || '-',
        浏览器: item.browser || '-',
        状态: item.status === 'SUCCESS' ? '成功' : '失败',
        描述: item.description || '-',
        访问时间: formatDateTime(item.createdAt)
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '登录日志')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      FileSaver.saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        `登录日志-${timestamp}.xlsx`
      )
      ElMessage.success(`导出成功，共 ${records.length} 条`)
    } catch (error) {
      console.error(error)
      ElMessage.error('导出失败')
    }
  }
</script>

<style lang="scss" scoped>
  .login-log-detail-drawer__content {
    min-width: 0;
  }

  @media (width <= 767px) {
    :deep(.login-log-detail-drawer .el-drawer__body) {
      padding: 16px;
      overflow-x: hidden;
    }

    :deep(.login-log-detail-drawer .el-descriptions__cell) {
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    :deep(.login-log-detail-drawer .el-descriptions__label) {
      width: 104px;
      min-width: 104px;
      white-space: nowrap;
    }
  }
</style>
