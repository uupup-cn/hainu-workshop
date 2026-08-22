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
      title="操作日志详情"
      :size="detailDrawerSize"
      class="operation-log-detail-drawer"
    >
      <div v-loading="detailLoading" class="operation-log-detail-drawer__content">
        <ElDescriptions :column="isMobileLayout ? 1 : 2" border>
          <ElDescriptionsItem label="日志编号">{{ detail?.logNo || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统模块">{{ detail?.module || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作类型">
            <ElTag :type="getOperationTypeTag(detail?.operationType)">
              {{ detail?.operationType || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作人员">{{ detail?.username || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求方式">{{ detail?.method || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="请求地址">{{ detail?.path || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作IP">{{ detail?.ip || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="响应码">{{ detail?.responseCode ?? '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="detail?.status === 'SUCCESS' ? 'success' : 'danger'">
              {{ detail?.status === 'SUCCESS' ? '成功' : '失败' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="消耗时间">
            {{ detail ? `${detail.durationMs} 毫秒` : '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作时间">
            {{ formatDateTime(detail?.createdAt) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="操作描述">
            {{ detail?.description || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="错误信息" :span="isMobileLayout ? 1 : 2">
            {{ detail?.errorMessage || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>

        <div class="mt-4">
          <div class="mb-2 text-sm font-medium text-g-700">请求参数</div>
          <pre
            class="operation-log-detail-drawer__payload rounded-lg bg-[var(--art-gray-100)] p-4 text-xs leading-6 text-g-800"
            >{{ formattedRequestParams }}</pre
          >
        </div>

        <div class="mt-4">
          <div class="mb-2 text-sm font-medium text-g-700">返回参数</div>
          <pre
            class="operation-log-detail-drawer__payload rounded-lg bg-[var(--art-gray-100)] p-4 text-xs leading-6 text-g-800"
            >{{ formattedResponsePayload }}</pre
          >
        </div>
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
    fetchClearOperationLogs,
    fetchDeleteOperationLogs,
    fetchExportOperationLogs,
    fetchOperationLogDetail,
    fetchOperationLogs
  } from '@/api/logs'
  import { OPERATION_TYPE_OPTIONS, resolveOperationTypeTag } from '@/constants/logs'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'OperationLog' })

  type OperationLogItem = Api.Audit.OperationLogItem

  const showSearchBar = ref(false)
  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detail = ref<OperationLogItem | null>(null)
  const selectedRows = ref<OperationLogItem[]>([])
  const { width } = useWindowSize()
  const isMobileLayout = computed(() => width.value < 768)
  const detailDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '720px'
  })

  const searchForm = ref({
    module: '',
    operationType: '',
    username: '',
    status: '',
    daterange: undefined as string[] | undefined
  })

  /**
   * 构建操作日志搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '系统模块',
      key: 'module',
      type: 'input',
      props: { clearable: true, placeholder: '请输入系统模块' }
    },
    {
      label: '操作类型',
      key: 'operationType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择操作类型',
        options: OPERATION_TYPE_OPTIONS
      }
    },
    {
      label: '操作人员',
      key: 'username',
      type: 'input',
      props: { clearable: true, placeholder: '请输入操作人员' }
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
      label: '操作时间',
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

  // 根据操作类型返回标签样式
  const getOperationTypeTag = (type?: string | null) => resolveOperationTypeTag(type)

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
      apiFn: fetchOperationLogs,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        {
          prop: 'logNo',
          label: '日志编号',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'module',
          label: '系统模块',
          minWidth: 120
        },
        {
          prop: 'operationType',
          label: '操作类型',
          minWidth: 100,
          formatter: (row) =>
            h(ElTag, { type: getOperationTypeTag(row.operationType) }, () => row.operationType)
        },
        {
          prop: 'username',
          label: '操作人员',
          minWidth: 110,
          formatter: (row) => row.username || '-'
        },
        {
          prop: 'ip',
          label: '操作地址',
          minWidth: 140,
          formatter: (row) => row.ip || '-'
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
          prop: 'createdAt',
          label: '操作日期',
          minWidth: 170,
          formatter: (row) => formatDateTime(row.createdAt)
        },
        {
          prop: 'durationMs',
          label: '消耗时间',
          width: 110,
          formatter: (row) => `${row.durationMs}毫秒`
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

  // 格式化请求参数展示内容
  const formattedRequestParams = computed(() => {
    if (!detail.value?.requestParams) return '-'
    try {
      return JSON.stringify(detail.value.requestParams, null, 2)
    } catch {
      return String(detail.value.requestParams)
    }
  })

  // 格式化响应结果展示内容
  const formattedResponsePayload = computed(() => {
    if (!detail.value?.responsePayload) return '-'
    try {
      return JSON.stringify(detail.value.responsePayload, null, 2)
    } catch {
      return String(detail.value.responsePayload)
    }
  })

  // 提交筛选条件并刷新列表
  const handleSearch = async () => {
    const params = searchForm.value
    const [startTime, endTime] = Array.isArray(params.daterange)
      ? params.daterange
      : [undefined, undefined]
    await replaceSearchParams({
      module: params.module || undefined,
      operationType: params.operationType || undefined,
      username: params.username || undefined,
      status: params.status || undefined,
      startTime,
      endTime
    })
  }

  // 重置筛选条件并重新查询
  const handleReset = () => {
    Object.assign(searchForm.value, {
      module: '',
      operationType: '',
      username: '',
      status: '',
      daterange: undefined
    })
    resetSearchParams()
  }

  // 打开日志详情并加载数据
  const handleView = async (id: number) => {
    detailVisible.value = true
    detailLoading.value = true
    try {
      detail.value = await fetchOperationLogDetail(id)
    } catch (error) {
      console.error(error)
      ElMessage.error('获取日志详情失败')
    } finally {
      detailLoading.value = false
    }
  }

  // 同步表格选中项
  const handleSelectionChange = (selection: OperationLogItem[]) => {
    selectedRows.value = selection
  }

  // 删除单条操作日志
  const handleDelete = async (row: OperationLogItem) => {
    try {
      await ElMessageBox.confirm('确定删除这条操作日志吗？', '删除操作日志', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteOperationLogs([row.id])
      ElMessage.success('删除成功')
      selectedRows.value = selectedRows.value.filter((item) => item.id !== row.id)
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 批量删除选中的操作日志
  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确定删除选中的 ${selectedRows.value.length} 条操作日志吗？`,
        '批量删除操作日志',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await fetchDeleteOperationLogs(selectedRows.value.map((item) => item.id))
      ElMessage.success('删除成功')
      selectedRows.value = []
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 按当前筛选条件清空日志
  const handleClear = async () => {
    try {
      await ElMessageBox.confirm('确定清空全部操作日志吗？该操作不可恢复。', '清空操作日志', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchClearOperationLogs()
      ElMessage.success('清空成功')
      selectedRows.value = []
      refreshData()
    } catch (error) {
      if (error === 'cancel' || error === 'close') return
      console.error(error)
    }
  }

  // 导出当前筛选条件下的日志
  const handleExport = async () => {
    try {
      const records = await fetchExportOperationLogs({ ...searchParams })
      if (!records.length) {
        ElMessage.warning('暂无可导出的数据')
        return
      }

      const exportData = records.map((item) => ({
        日志编号: item.logNo,
        系统模块: item.module,
        操作类型: item.operationType,
        操作人员: item.username || '-',
        操作地址: item.ip || '-',
        状态: item.status === 'SUCCESS' ? '成功' : '失败',
        操作日期: formatDateTime(item.createdAt),
        消耗时间: `${item.durationMs}毫秒`,
        请求方式: item.method,
        请求地址: item.path,
        操作描述: item.description || '-',
        响应码: item.responseCode ?? '-',
        错误信息: item.errorMessage || '-'
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '操作日志')
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      FileSaver.saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        `操作日志-${timestamp}.xlsx`
      )
      ElMessage.success(`导出成功，共 ${records.length} 条`)
    } catch (error) {
      console.error(error)
      ElMessage.error('导出失败')
    }
  }
</script>

<style lang="scss" scoped>
  .operation-log-detail-drawer__content {
    min-width: 0;
  }

  .operation-log-detail-drawer__payload {
    max-width: 100%;
    overflow-x: auto;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  @media (width <= 767px) {
    :deep(.operation-log-detail-drawer .el-drawer__body) {
      padding: 16px;
      overflow-x: hidden;
    }

    :deep(.operation-log-detail-drawer .el-descriptions__cell) {
      word-break: break-word;
      overflow-wrap: anywhere;
    }
  }
</style>
