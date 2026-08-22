<template>
  <div class="flex flex-col gap-4" :class="isFocusMode ? 'art-full-height' : 'pb-5'">
    <section v-if="!isFocusMode" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in summaryCards" :key="card.label" class="art-surface-sm px-5 py-5">
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-g-600">{{ card.label }}</span>
          <div
            class="flex size-11 items-center justify-center rounded-[calc(var(--custom-radius)+4px)] text-lg"
            :style="{ background: card.iconBg, color: card.iconColor }"
          >
            <ArtSvgIcon :icon="card.icon" />
          </div>
        </div>
        <div class="text-3xl font-semibold tracking-tight text-g-900">{{ card.value }}</div>
        <div class="mt-2 text-xs leading-6 text-g-500">{{ card.tip }}</div>
      </article>
    </section>

    <section
      v-if="!isFocusMode"
      class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]"
    >
      <article class="art-surface-sm px-5 py-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">反馈状态分布</h3>
            <p class="mt-1 text-sm leading-6 text-g-600"
              >优先关注待处理和处理中反馈，缩短外部体验闭环。</p
            >
          </div>
        </div>

        <ElScrollbar class="mt-5" max-height="300px" wrap-class="pr-2">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="item in overview?.statusBuckets || []"
              :key="item.status"
              class="art-surface-muted p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <ElTag :type="getStatusTagType(item.status)" effect="light">
                  {{ getStatusLabel(item.status) }}
                </ElTag>
                <span class="text-2xl font-semibold text-g-900">{{ item.count }}</span>
              </div>
              <div class="mt-2 text-xs text-g-500"
                >当前处于 {{ getStatusLabel(item.status) }} 的反馈量</div
              >
            </div>
          </div>
        </ElScrollbar>
      </article>

      <article class="art-surface-sm px-5 py-5">
        <div>
          <h3 class="text-lg font-semibold text-g-900">最新反馈</h3>
          <p class="mt-1 text-sm leading-6 text-g-600"
            >快速查看刚刚收到的问题，决定是否需要优先处理。</p
          >
        </div>

        <ElScrollbar class="mt-5" max-height="300px" wrap-class="pr-2">
          <div class="flex flex-col gap-3">
            <div
              v-for="item in overview?.latestRecords || []"
              :key="item.id"
              class="art-surface-muted p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-g-900">{{ item.title }}</div>
                  <div class="mt-1 text-xs text-g-600">
                    {{ getTypeLabel(item.type) }} · {{ item.submitter?.username || '匿名账号' }} ·
                    {{ formatDateTime(item.createdAt) }}
                  </div>
                </div>
                <ElTag :type="getPriorityTagType(item.priority)" effect="light">
                  {{ getPriorityLabel(item.priority) }}
                </ElTag>
              </div>
              <div class="mt-3 flex items-center justify-between gap-3">
                <ElTag :type="getStatusTagType(item.status)" effect="light">
                  {{ getStatusLabel(item.status) }}
                </ElTag>
                <ElButton text type="primary" @click="handleView(item.id)">查看</ElButton>
              </div>
            </div>
            <ElEmpty
              v-if="!(overview?.latestRecords || []).length"
              description="暂无反馈"
              :image-size="120"
            />
          </div>
        </ElScrollbar>
      </article>
    </section>

    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="art-table-card mt-0!" shadow="never">
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshAll"
      >
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

    <ElDrawer v-model="detailVisible" title="反馈详情" :size="detailDrawerSize">
      <div v-loading="detailLoading">
        <ElDescriptions :column="2">
          <ElDescriptionsItem label="反馈编号">{{ detail?.feedbackNo || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="反馈类型">{{ getTypeLabel(detail?.type) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="处理状态">
            <ElTag :type="getStatusTagType(detail?.status)">{{
              getStatusLabel(detail?.status)
            }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="优先级">
            <ElTag :type="getPriorityTagType(detail?.priority)">{{
              getPriorityLabel(detail?.priority)
            }}</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="提交账号">{{
            detail?.submitter?.username || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="联系人">
            {{ detail?.contactName || '-' }} {{ detail?.contact ? ` / ${detail.contact}` : '' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="页面标题">{{ detail?.pageTitle || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="页面路径">{{ detail?.pagePath || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器环境">
            {{ detail?.browser || '-' }} / {{ detail?.os || '-' }} / {{ detail?.deviceType || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="来源 IP">{{ detail?.ip || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="提交时间">{{
            formatDateTime(detail?.createdAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="处理人">{{
            detail?.handler?.username || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="处理时间">{{
            formatDateTime(detail?.handledAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="标题" :span="2">{{ detail?.title || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="详细描述" :span="2">
            <div class="whitespace-pre-wrap leading-7 text-g-700">{{ detail?.content || '-' }}</div>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="期望结果" :span="2">
            <div class="whitespace-pre-wrap leading-7 text-g-700">{{
              detail?.expectedBehavior || '-'
            }}</div>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处理备注" :span="2">
            <div class="whitespace-pre-wrap leading-7 text-g-700">{{
              detail?.handledRemark || '-'
            }}</div>
          </ElDescriptionsItem>
        </ElDescriptions>

        <div class="mt-4">
          <div class="mb-2 text-sm font-medium text-g-700">扩展上下文</div>
          <pre class="rounded-lg bg-[var(--art-gray-100)] p-4 text-xs leading-6 text-g-800">{{
            formattedExtra
          }}</pre>
        </div>
      </div>
    </ElDrawer>

    <ElDialog v-model="statusDialogVisible" title="处理反馈" width="560px">
      <ElForm label-position="top">
        <ElFormItem label="处理状态">
          <ElRadioGroup v-model="statusForm.status">
            <ElRadioButton label="NEW">待处理</ElRadioButton>
            <ElRadioButton label="TRIAGING">分析中</ElRadioButton>
            <ElRadioButton label="PLANNED">已规划</ElRadioButton>
            <ElRadioButton label="IN_PROGRESS">处理中</ElRadioButton>
            <ElRadioButton label="RESOLVED">已解决</ElRadioButton>
            <ElRadioButton label="CLOSED">已关闭</ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="优先级">
          <ElRadioGroup v-model="statusForm.priority">
            <ElRadioButton label="LOW">低</ElRadioButton>
            <ElRadioButton label="MEDIUM">中</ElRadioButton>
            <ElRadioButton label="HIGH">高</ElRadioButton>
            <ElRadioButton label="URGENT">紧急</ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="处理备注">
          <ElInput
            v-model="statusForm.handledRemark"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
            placeholder="记录问题分析结果、处理动作或暂不处理原因，方便后续追踪"
          />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton @click="statusDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="statusSubmitting" @click="handleUpdateStatus"
          >保存</ElButton
        >
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElTag } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import {
    fetchFeedbackDetail,
    fetchFeedbackList,
    fetchFeedbackOverview,
    fetchUpdateFeedbackStatus
  } from '@/api/feedback'
  import { ApiPermissionCode } from '@/constants/api-permissions'
  import { useAuth } from '@/hooks/core/useAuth'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { useTable } from '@/hooks/core/useTable'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'FeedbackPage' })

  const { hasApiPermission } = useAuth()
  const { isFocusMode, toggleFocusMode } = usePageFocusMode('system.feedback')

  const { width } = useWindowSize()
  const detailDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '760px'
  })

  const showSearchBar = ref(false)
  const overviewLoading = ref(false)
  const detailLoading = ref(false)
  const detailVisible = ref(false)
  const statusDialogVisible = ref(false)
  const statusSubmitting = ref(false)
  const currentRowId = ref<number>()

  const overview = ref<Api.Interaction.FeedbackOverviewResponse>()
  const detail = ref<Api.Interaction.FeedbackItem>()

  const searchForm = ref({
    keyword: '',
    type: '' as Api.Interaction.FeedbackType | '',
    status: '' as Api.Interaction.FeedbackStatus | '',
    priority: '' as Api.Interaction.FeedbackPriority | '',
    daterange: undefined as string[] | undefined
  })

  const statusForm = reactive<Api.Interaction.UpdateFeedbackStatusPayload>({
    status: 'TRIAGING',
    priority: 'MEDIUM',
    handledRemark: ''
  })

  // 构建反馈筛选项
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: {
        placeholder: '编号 / 标题 / 描述 / 联系方式 / 页面路径',
        clearable: true
      }
    },
    {
      label: '反馈类型',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择',
        clearable: true,
        options: typeOptions.value
      }
    },
    {
      label: '处理状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择',
        clearable: true,
        options: statusOptions.value
      }
    },
    {
      label: '优先级',
      key: 'priority',
      type: 'select',
      props: {
        placeholder: '请选择',
        clearable: true,
        options: priorityOptions.value
      }
    },
    {
      label: '提交时间',
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

  // 构建反馈类型选项
  const typeOptions = computed(() => [
    { label: 'Bug 反馈', value: 'BUG' },
    { label: '功能建议', value: 'FEATURE' },
    { label: '体验问题', value: 'UX' },
    { label: '性能问题', value: 'PERFORMANCE' },
    { label: '其他', value: 'OTHER' }
  ])

  // 构建反馈状态选项
  const statusOptions = computed(() => [
    { label: '待处理', value: 'NEW' },
    { label: '分析中', value: 'TRIAGING' },
    { label: '已规划', value: 'PLANNED' },
    { label: '处理中', value: 'IN_PROGRESS' },
    { label: '已解决', value: 'RESOLVED' },
    { label: '已关闭', value: 'CLOSED' }
  ])

  // 构建反馈优先级选项
  const priorityOptions = computed(() => [
    { label: '低', value: 'LOW' },
    { label: '中', value: 'MEDIUM' },
    { label: '高', value: 'HIGH' },
    { label: '紧急', value: 'URGENT' }
  ])

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchFeedbackList,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        {
          prop: 'feedbackNo',
          label: '反馈编号',
          minWidth: 180
        },
        {
          prop: 'title',
          label: '标题',
          minWidth: 220,
          showOverflowTooltip: true
        },
        {
          prop: 'type',
          label: '类型',
          width: 110,
          formatter: (row) => getTypeLabel(row.type)
        },
        {
          prop: 'status',
          label: '状态',
          width: 110,
          formatter: (row) =>
            h(ElTag, { type: getStatusTagType(row.status), effect: 'light' }, () =>
              getStatusLabel(row.status)
            )
        },
        {
          prop: 'priority',
          label: '优先级',
          width: 100,
          formatter: (row) =>
            h(ElTag, { type: getPriorityTagType(row.priority), effect: 'light' }, () =>
              getPriorityLabel(row.priority)
            )
        },
        {
          prop: 'contactName',
          label: '联系人',
          minWidth: 130,
          formatter: (row) => row.contactName || row.submitter?.username || '-'
        },
        {
          prop: 'pagePath',
          label: '页面路径',
          minWidth: 180,
          showOverflowTooltip: true,
          formatter: (row) => row.pagePath || '-'
        },
        {
          prop: 'createdAt',
          label: '提交时间',
          minWidth: 170,
          formatter: (row) => formatDateTime(row.createdAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 130,
          align: 'center',
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'view',
                onClick: () => handleView(row.id)
              }),
              hasApiPermission(ApiPermissionCode.FEEDBACK.STATUS_UPDATE)
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

  // 格式化扩展信息
  const formattedExtra = computed(() => JSON.stringify(detail.value?.extra || {}, null, 2))

  // 构建反馈概览卡片
  const summaryCards = computed(() => [
    {
      label: '反馈总量',
      value: overview.value?.summary.totalCount ?? 0,
      tip: '累计收到的全部用户反馈',
      icon: 'ri:message-2-line',
      iconBg: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
      iconColor: 'var(--color-primary)'
    },
    {
      label: '待推进',
      value: overview.value?.summary.activeCount ?? 0,
      tip: '待处理、分析中、已规划、处理中',
      icon: 'ri:stack-line',
      iconBg: 'color-mix(in srgb, var(--color-warning) 16%, transparent)',
      iconColor: 'var(--color-warning)'
    },
    {
      label: '今日新增',
      value: overview.value?.summary.todayCount ?? 0,
      tip: '今天新收到的体验反馈',
      icon: 'ri:flashlight-line',
      iconBg: 'color-mix(in srgb, var(--color-secondary) 14%, transparent)',
      iconColor: 'var(--color-secondary)'
    },
    {
      label: '已闭环',
      value: overview.value?.summary.resolvedCount ?? 0,
      tip: '已解决或已关闭的反馈',
      icon: 'ri:checkbox-circle-line',
      iconBg: 'color-mix(in srgb, var(--color-success) 16%, transparent)',
      iconColor: 'var(--color-success)'
    }
  ])

  onMounted(() => {
    loadOverview()
  })

  // 获取反馈类型文案
  function getTypeLabel(type?: Api.Interaction.FeedbackType | null) {
    switch (type) {
      case 'BUG':
        return 'Bug 反馈'
      case 'FEATURE':
        return '功能建议'
      case 'UX':
        return '体验问题'
      case 'PERFORMANCE':
        return '性能问题'
      case 'OTHER':
        return '其他'
      default:
        return '-'
    }
  }

  // 获取反馈状态文案
  function getStatusLabel(status?: Api.Interaction.FeedbackStatus | null) {
    switch (status) {
      case 'NEW':
        return '待处理'
      case 'TRIAGING':
        return '分析中'
      case 'PLANNED':
        return '已规划'
      case 'IN_PROGRESS':
        return '处理中'
      case 'RESOLVED':
        return '已解决'
      case 'CLOSED':
        return '已关闭'
      default:
        return '-'
    }
  }

  // 获取反馈状态标签类型
  function getStatusTagType(status?: Api.Interaction.FeedbackStatus | null) {
    switch (status) {
      case 'NEW':
        return 'danger'
      case 'TRIAGING':
        return 'warning'
      case 'PLANNED':
        return 'info'
      case 'IN_PROGRESS':
        return 'warning'
      case 'RESOLVED':
        return 'success'
      case 'CLOSED':
        return 'info'
      default:
        return 'info'
    }
  }

  // 获取反馈优先级文案
  function getPriorityLabel(priority?: Api.Interaction.FeedbackPriority | null) {
    switch (priority) {
      case 'LOW':
        return '低'
      case 'MEDIUM':
        return '中'
      case 'HIGH':
        return '高'
      case 'URGENT':
        return '紧急'
      default:
        return '-'
    }
  }

  // 获取反馈优先级标签类型
  function getPriorityTagType(priority?: Api.Interaction.FeedbackPriority | null) {
    switch (priority) {
      case 'LOW':
        return 'info'
      case 'MEDIUM':
        return 'warning'
      case 'HIGH':
        return 'danger'
      case 'URGENT':
        return 'danger'
      default:
        return 'info'
    }
  }

  /**
   * 加载反馈概览统计，未授权时直接跳过。
   */
  async function loadOverview() {
    if (!hasApiPermission(ApiPermissionCode.FEEDBACK.OVERVIEW)) return
    overviewLoading.value = true
    try {
      overview.value = await fetchFeedbackOverview()
    } finally {
      overviewLoading.value = false
    }
  }

  /**
   * 打开反馈详情抽屉并加载详情数据。
   * @param id 反馈记录 ID。
   */
  async function handleView(id: number) {
    detailVisible.value = true
    detailLoading.value = true
    try {
      detail.value = await fetchFeedbackDetail(id)
    } finally {
      detailLoading.value = false
    }
  }

  // 打开状态变更弹窗
  function openStatusDialog(row: Api.Interaction.FeedbackItem) {
    currentRowId.value = row.id
    statusForm.status = row.status
    statusForm.priority = row.priority
    statusForm.handledRemark = row.handledRemark || ''
    statusDialogVisible.value = true
  }

  /**
   * 提交反馈状态和优先级变更。
   */
  async function handleUpdateStatus() {
    if (!currentRowId.value) return
    statusSubmitting.value = true
    try {
      await fetchUpdateFeedbackStatus(currentRowId.value, statusForm)
      statusDialogVisible.value = false
      await Promise.all([refreshData(), loadOverview()])
      if (detailVisible.value) {
        await handleView(currentRowId.value)
      }
    } finally {
      statusSubmitting.value = false
    }
  }

  /**
   * 提交反馈筛选条件并刷新列表。
   */
  async function handleSearch() {
    const params = {
      ...searchForm.value,
      startTime: searchForm.value.daterange?.[0],
      endTime: searchForm.value.daterange?.[1]
    } as Record<string, unknown>

    Object.keys(params).forEach((key) => {
      const value = params[key]
      if (value === '' || value == null) {
        delete params[key]
      }
    })

    await replaceSearchParams(params as Partial<Api.Interaction.FeedbackSearchParams>)
  }

  /**
   * 重置反馈筛选条件并刷新概览。
   */
  async function handleReset() {
    await resetSearchParams()
    await loadOverview()
  }

  /**
   * 同时刷新反馈列表和概览统计。
   */
  async function refreshAll() {
    await Promise.all([refreshData(), loadOverview()])
  }
</script>
