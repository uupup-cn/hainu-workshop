<template>
  <div
    class="security-audit-page flex flex-col gap-4"
    :class="isFocusMode ? 'art-full-height' : 'pb-5'"
  >
    <ArtPageHero
      v-if="!isFocusMode"
      title="安全审计中心"
      description="将登录风险、权限变更、审计日志修改和敏感操作失败统一沉淀为可处置事件，便于上线前后巡检和留痕。"
      content-class="max-w-3xl"
      right-class="flex flex-wrap items-center justify-start gap-3 xl:justify-end"
    >
      <template #right>
        <ElTag :type="overallHealthType" effect="light" size="large">{{
          overallHealthLabel
        }}</ElTag>
        <div
          class="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--art-radius-surface-xs)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] px-3 text-xs text-g-700 h-9"
        >
          <ArtSvgIcon icon="ri:time-line" class="size-3.5" />
          <span>{{ formatDateTime(overview?.summary.generatedAt) || '-' }}</span>
        </div>
        <ElButton :loading="overviewLoading" type="primary" @click="refreshAll">
          <template #icon>
            <ArtSvgIcon icon="ri:refresh-line" />
          </template>
          刷新审计
        </ElButton>
      </template>

      <template #footer>
        <div class="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div
            v-for="item in heroStats"
            :key="item.label"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="block text-xs leading-[1.4] text-g-500">{{ item.label }}</span>
            <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
              item.value
            }}</strong>
          </div>
        </div>
      </template>
    </ArtPageHero>

    <SecurityAuditOverviewPanel
      v-if="!isFocusMode"
      :overview="overview"
      :summary-cards="summaryCards"
      :severity-cards="severityCards"
      :get-severity-tag-type="getSeverityTagType"
      :get-severity-label="getSeverityLabel"
      :get-status-tag-type="getStatusTagType"
      :get-status-label="getStatusLabel"
    />

    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="security-audit-table-card art-table-card mt-0! card-p0" shadow="never">
      <div
        v-if="!isFocusMode"
        class="flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-4 max-sm:flex-col"
      >
        <div class="min-w-0">
          <h2 class="text-lg font-semibold text-g-900">事件处置列表</h2>
          <p class="mt-1 text-sm leading-6 text-g-600">
            聚合待处理、已确认和已关闭事件，支持按风险等级、来源与触发时间快速定位。
          </p>
        </div>
        <div
          class="flex min-w-[18rem] flex-wrap justify-end gap-2 max-sm:min-w-0 max-sm:justify-start"
        >
          <ElTag effect="light" type="danger">未关闭 {{ overview?.summary.openCount ?? 0 }}</ElTag>
          <ElTag effect="light" type="warning">
            严重 {{ overview?.summary.criticalOpenCount ?? 0 }}
          </ElTag>
          <ElTag effect="light" type="info">当前页 {{ data.length }} 条</ElTag>
        </div>
      </div>

      <ArtTableHeader
        v-model:columns="columnChecks"
        full-class="security-audit-table-card"
        :class="{ 'pt-4': !isFocusMode }"
        :loading="loading"
        :data="data"
        data-output-title="安全审计事件"
        export-file-name="安全审计事件"
        @refresh="refreshAll"
      >
        <template #left>
          <div v-if="isFocusMode" class="flex flex-wrap items-center gap-2">
            <ElTag effect="light" type="danger">
              未关闭 {{ overview?.summary.openCount ?? 0 }}
            </ElTag>
            <ElTag effect="light" type="warning">
              严重 {{ overview?.summary.criticalOpenCount ?? 0 }}
            </ElTag>
            <ElTag effect="light" type="info">当前页 {{ data.length }} 条</ElTag>
          </div>
        </template>
        <template #right>
          <ArtFocusModeButton :active="isFocusMode" @click="toggleFocusMode" />
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        emptyHeight="360px"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <SecurityAuditDetailDrawer
      v-model:visible="detailVisible"
      :detail-loading="detailLoading"
      :detail="detail"
      :formatted-payload="formattedPayload"
      :formatted-operation-log="formattedOperationLog"
      :formatted-login-log="formattedLoginLog"
      :get-severity-tag-type="getSeverityTagType"
      :get-severity-label="getSeverityLabel"
      :get-status-tag-type="getStatusTagType"
      :get-status-label="getStatusLabel"
      :get-event-type-label="getEventTypeLabel"
    />

    <SecurityAuditStatusDialog
      v-model:visible="statusDialogVisible"
      v-model:status-form="statusForm"
      :submitting="statusSubmitting"
      @submit="submitStatusUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElTag } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { useTable } from '@/hooks/core/useTable'
  import {
    fetchSecurityAuditEventDetail,
    fetchSecurityAuditEvents,
    fetchSecurityAuditOverview,
    fetchUpdateSecurityAuditStatus
  } from '@/api/security-audit'
  import { formatDateTime } from '@/utils'
  import { useAuth } from '@/hooks/core/useAuth'
  import SecurityAuditDetailDrawer from './modules/security-audit-detail-drawer.vue'
  import SecurityAuditOverviewPanel from './modules/security-audit-overview.vue'
  import SecurityAuditStatusDialog from './modules/security-audit-status-dialog.vue'

  defineOptions({ name: 'SecurityAuditPage' })

  type SecurityAuditItem = Api.Audit.SecurityAuditEventItem
  type SecurityAuditDetail = Api.Audit.SecurityAuditEventDetail
  type SecurityAuditOverview = Api.Audit.SecurityAuditOverviewResponse
  type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

  const { hasAuth } = useAuth()
  const { isFocusMode, toggleFocusMode } = usePageFocusMode('monitor.securityAudit')

  const overviewLoading = ref(false)
  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detail = ref<SecurityAuditDetail | null>(null)
  const overview = ref<SecurityAuditOverview | null>(null)
  const statusDialogVisible = ref(false)
  const statusSubmitting = ref(false)
  const currentStatusEventId = ref<number | null>(null)

  const toneMap = {
    primary: {
      color: 'var(--art-primary)',
      soft: 'color-mix(in srgb, var(--art-primary) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-primary) 88%, white), var(--art-primary))'
    },
    secondary: {
      color: 'var(--art-secondary)',
      soft: 'color-mix(in srgb, var(--art-secondary) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-secondary) 88%, white), var(--art-secondary))'
    },
    success: {
      color: 'var(--art-success)',
      soft: 'color-mix(in srgb, var(--art-success) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-success) 88%, white), var(--art-success))'
    },
    warning: {
      color: 'var(--art-warning)',
      soft: 'color-mix(in srgb, var(--art-warning) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-warning) 88%, white), var(--art-warning))'
    },
    danger: {
      color: 'var(--art-danger)',
      soft: 'color-mix(in srgb, var(--art-danger) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-danger) 88%, white), var(--art-danger))'
    }
  }

  const searchForm = ref<{
    keyword: string
    severity: '' | Api.Audit.SecurityAuditSeverity
    status: '' | Api.Audit.SecurityAuditStatus
    eventType: string
    unresolvedOnly: '' | 'true'
    daterange: string[] | undefined
  }>({
    keyword: '',
    severity: '',
    status: '',
    eventType: '',
    unresolvedOnly: '',
    daterange: undefined
  })

  const statusForm = reactive<Api.Audit.UpdateSecurityAuditStatusPayload>({
    status: 'ACKNOWLEDGED',
    remark: ''
  })

  const overallHealthType = computed<TagType>(() => {
    const critical = overview.value?.summary.criticalOpenCount ?? 0
    const open = overview.value?.summary.openCount ?? 0
    if (critical > 0) return 'danger'
    if (open > 5) return 'warning'
    return 'success'
  })

  const overallHealthLabel = computed(() => {
    const critical = overview.value?.summary.criticalOpenCount ?? 0
    const open = overview.value?.summary.openCount ?? 0
    if (critical > 0) return '存在严重风险'
    if (open > 5) return '需要关注'
    return '整体安全'
  })

  const heroStats = computed(() => [
    { label: '未关闭', value: `${overview.value?.summary.openCount ?? 0} 件` },
    { label: '严重未处理', value: `${overview.value?.summary.criticalOpenCount ?? 0} 件` },
    { label: '今日新增', value: `${overview.value?.summary.todayCount ?? 0} 件` },
    { label: '今日已处置', value: `${overview.value?.summary.handledTodayCount ?? 0} 件` }
  ])

  const summaryCards = computed(() => [
    {
      label: '未关闭事件',
      value: overview.value?.summary.openCount ?? 0,
      percent: `${Math.min(100, (overview.value?.summary.openCount ?? 0) * 2)}%`,
      tipLabel: '优先级',
      tip: '仍需跟进的审计事件',
      icon: 'ri:shield-flash-line',
      iconStyle: { background: toneMap.warning.soft, color: toneMap.warning.color },
      barBg: toneMap.warning.bar
    },
    {
      label: '严重未处理',
      value: overview.value?.summary.criticalOpenCount ?? 0,
      percent: `${Math.min(100, (overview.value?.summary.criticalOpenCount ?? 0) * 5)}%`,
      tipLabel: '风险',
      tip: '优先关注的严重级别事件',
      icon: 'ri:alarm-warning-line',
      iconStyle: { background: toneMap.danger.soft, color: toneMap.danger.color },
      barBg: toneMap.danger.bar
    },
    {
      label: '今日新增',
      value: overview.value?.summary.todayCount ?? 0,
      percent: `${Math.min(100, (overview.value?.summary.todayCount ?? 0) * 3)}%`,
      tipLabel: '趋势',
      tip: '当天新触发的安全审计事件',
      icon: 'ri:radar-line',
      iconStyle: { background: toneMap.primary.soft, color: toneMap.primary.color },
      barBg: toneMap.primary.bar
    },
    {
      label: '今日已处置',
      value: overview.value?.summary.handledTodayCount ?? 0,
      percent: `${Math.min(100, (overview.value?.summary.handledTodayCount ?? 0) * 4)}%`,
      tipLabel: '效率',
      tip: '当天完成确认或关闭的事件',
      icon: 'ri:checkbox-circle-line',
      iconStyle: { background: toneMap.success.soft, color: toneMap.success.color },
      barBg: toneMap.success.bar
    }
  ])

  const severityCards = computed<
    Array<{ severity: Api.Audit.SecurityAuditSeverity; count: number }>
  >(() => {
    const map = new Map(
      (overview.value?.severityBuckets || []).map((item) => [item.severity, item.count])
    )
    return (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Api.Audit.SecurityAuditSeverity[]).map(
      (severity) => ({
        severity,
        count: map.get(severity) || 0
      })
    )
  })

  const eventTypeOptions = [
    { label: '疑似暴力破解', value: 'LOGIN_BRUTE_FORCE' },
    { label: '新 IP 登录', value: 'LOGIN_NEW_IP' },
    { label: '敏感操作失败', value: 'SENSITIVE_OPERATION_FAILURE' },
    { label: '高权限配置变更', value: 'PRIVILEGE_CHANGE' },
    { label: '审计日志被修改', value: 'AUDIT_LOG_TAMPERING' },
    { label: '管理员强制下线', value: 'SESSION_FORCE_LOGOUT' }
  ]

  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '编号、标题、用户、IP、路径' }
    },
    {
      label: '风险等级',
      key: 'severity',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择风险等级',
        options: [
          { label: '低', value: 'LOW' },
          { label: '中', value: 'MEDIUM' },
          { label: '高', value: 'HIGH' },
          { label: '严重', value: 'CRITICAL' }
        ]
      }
    },
    {
      label: '处置状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择处置状态',
        options: [
          { label: '待处理', value: 'OPEN' },
          { label: '已确认', value: 'ACKNOWLEDGED' },
          { label: '已处理', value: 'RESOLVED' },
          { label: '忽略', value: 'IGNORED' }
        ]
      }
    },
    {
      label: '事件类型',
      key: 'eventType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择事件类型',
        options: eventTypeOptions
      }
    },
    {
      label: '范围',
      key: 'unresolvedOnly',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '全部事件',
        options: [{ label: '仅未关闭', value: 'true' }]
      }
    },
    {
      label: '触发时间',
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

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    getData,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchSecurityAuditEvents,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        {
          prop: 'auditNo',
          label: '事件编号',
          minWidth: 190,
          showOverflowTooltip: true
        },
        {
          prop: 'title',
          label: '事件标题',
          minWidth: 200,
          showOverflowTooltip: true
        },
        {
          prop: 'severity',
          label: '风险等级',
          width: 110,
          formatter: (row) =>
            h(ElTag, { type: getSeverityTagType(row.severity), effect: 'light' }, () =>
              getSeverityLabel(row.severity)
            )
        },
        {
          prop: 'status',
          label: '处置状态',
          width: 110,
          formatter: (row) =>
            h(ElTag, { type: getStatusTagType(row.status), effect: 'light' }, () =>
              getStatusLabel(row.status)
            )
        },
        {
          prop: 'riskScore',
          label: '风险分',
          width: 90
        },
        {
          prop: 'username',
          label: '关联用户',
          minWidth: 120,
          formatter: (row) => row.username || '-'
        },
        {
          prop: 'ip',
          label: '来源 IP',
          minWidth: 140,
          formatter: (row) => row.ip || '-'
        },
        {
          prop: 'occurrenceCount',
          label: '触发次数',
          width: 100
        },
        {
          prop: 'lastOccurredAt',
          label: '最近触发',
          minWidth: 170,
          formatter: (row) => formatDateTime(row.lastOccurredAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 130,
          align: 'center',
          formatter: (row) =>
            h('div', [
              hasAuth('view')
                ? h(ArtButtonTable, {
                    type: 'view',
                    onClick: () => handleView(row.id)
                  })
                : null,
              hasAuth('edit')
                ? h(ArtButtonTable, {
                    type: 'edit',
                    onClick: () => openStatusDialog(row)
                  })
                : null
            ])
        }
      ]
    }
  })

  const formattedPayload = computed(() => formatJson(detail.value?.payload))
  const formattedOperationLog = computed(() => formatJson(detail.value?.operationLog))
  const formattedLoginLog = computed(() => formatJson(detail.value?.loginLog))

  function getSeverityTagType(severity?: Api.Audit.SecurityAuditSeverity | null) {
    switch (severity) {
      case 'LOW':
        return 'info'
      case 'MEDIUM':
        return 'warning'
      case 'HIGH':
        return 'danger'
      case 'CRITICAL':
        return 'danger'
      default:
        return 'info'
    }
  }

  function getSeverityLabel(severity?: Api.Audit.SecurityAuditSeverity | null) {
    switch (severity) {
      case 'LOW':
        return '低'
      case 'MEDIUM':
        return '中'
      case 'HIGH':
        return '高'
      case 'CRITICAL':
        return '严重'
      default:
        return '-'
    }
  }

  function getStatusTagType(status?: Api.Audit.SecurityAuditStatus | null) {
    switch (status) {
      case 'OPEN':
        return 'danger'
      case 'ACKNOWLEDGED':
        return 'warning'
      case 'RESOLVED':
        return 'success'
      case 'IGNORED':
        return 'info'
      default:
        return 'info'
    }
  }

  function getStatusLabel(status?: Api.Audit.SecurityAuditStatus | null) {
    switch (status) {
      case 'OPEN':
        return '待处理'
      case 'ACKNOWLEDGED':
        return '已确认'
      case 'RESOLVED':
        return '已处理'
      case 'IGNORED':
        return '忽略'
      default:
        return '-'
    }
  }

  function getEventTypeLabel(type?: string | null) {
    return eventTypeOptions.find((item) => item.value === type)?.label || type || '-'
  }

  function formatJson(value: unknown) {
    if (!value) return '-'
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  async function loadOverview() {
    overviewLoading.value = true
    try {
      overview.value = await fetchSecurityAuditOverview()
    } finally {
      overviewLoading.value = false
    }
  }

  async function handleView(id: number) {
    detailVisible.value = true
    detailLoading.value = true
    try {
      detail.value = await fetchSecurityAuditEventDetail(id)
    } finally {
      detailLoading.value = false
    }
  }

  function openStatusDialog(row: SecurityAuditItem) {
    currentStatusEventId.value = row.id
    statusForm.status = row.status
    statusForm.remark = row.handledRemark || ''
    statusDialogVisible.value = true
  }

  async function submitStatusUpdate() {
    if (!currentStatusEventId.value) return

    statusSubmitting.value = true
    try {
      await fetchUpdateSecurityAuditStatus(currentStatusEventId.value, {
        status: statusForm.status,
        remark: statusForm.remark?.trim() || undefined
      })
      statusDialogVisible.value = false
      await Promise.all([refreshData(), loadOverview()])
      if (detailVisible.value && detail.value?.id === currentStatusEventId.value) {
        detail.value = await fetchSecurityAuditEventDetail(currentStatusEventId.value)
      }
    } finally {
      statusSubmitting.value = false
    }
  }

  function handleSearch() {
    const params = searchForm.value
    const [startTime, endTime] = Array.isArray(params.daterange)
      ? params.daterange
      : [undefined, undefined]
    replaceSearchParams({
      keyword: params.keyword || undefined,
      severity: params.severity || undefined,
      status: params.status || undefined,
      eventType: params.eventType || undefined,
      unresolvedOnly: params.unresolvedOnly === 'true',
      startTime,
      endTime
    })
    getData()
  }

  function handleReset() {
    Object.assign(searchForm.value, {
      keyword: '',
      severity: '',
      status: '',
      eventType: '',
      unresolvedOnly: '',
      daterange: undefined
    })
    resetSearchParams()
    getData()
  }

  async function refreshAll() {
    await Promise.all([refreshData(), loadOverview()])
  }

  onMounted(async () => {
    await Promise.all([loadOverview(), getData()])
  })
</script>
