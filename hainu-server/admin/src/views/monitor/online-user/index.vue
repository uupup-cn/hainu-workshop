<template>
  <div
    class="online-user-page flex flex-col gap-5"
    :class="isFocusMode ? 'art-full-height' : 'pb-5'"
  >
    <ArtPageHero
      v-if="!isFocusMode"
      title="在线用户"
      description="统一查看当前在线会话、设备指纹、最近活跃时间与账号归属，支持按会话粒度强制下线，满足后台运营前的安全巡检需求。"
    >
      <template #right>
        <div class="flex flex-wrap items-center justify-end gap-2 max-md:justify-start">
          <div
            v-for="item in heroBadges"
            :key="item.label"
            class="inline-flex items-center gap-[0.45rem] whitespace-nowrap rounded-full border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-[0.85rem] text-[0.8125rem] text-g-700 min-h-9"
          >
            <ArtSvgIcon :icon="item.icon" class="size-3.5" />
            <span>{{ item.label }}</span>
            <ArtCountTo
              class="font-[650] text-g-900"
              :target="item.value"
              :duration="MONITOR_COUNT_ANIMATION_DURATION"
            />
          </div>
        </div>
        <ElButton :loading="loading" type="primary" plain @click="loadList">
          <template #icon>
            <ArtSvgIcon icon="ri:refresh-line" />
          </template>
          刷新会话
        </ElButton>
      </template>
    </ArtPageHero>

    <section v-if="!isFocusMode" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.label"
        class="min-h-[9.875rem] rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-5 shadow-[var(--art-surface-shadow-sm)]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-medium text-g-600">{{ card.label }}</div>
            <ArtCountTo
              class="mt-3 block text-[1.75rem] font-medium leading-none text-g-900"
              :target="card.num"
              :duration="MONITOR_COUNT_ANIMATION_DURATION"
              :suffix="card.suffix"
            />
          </div>
          <div
            class="inline-flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] text-xl size-[2.625rem]"
            :style="card.iconStyle"
          >
            <ArtSvgIcon :icon="card.icon" />
          </div>
        </div>

        <div class="mt-5">
          <div class="h-2 overflow-hidden rounded-full bg-[var(--art-surface-bg-muted)]">
            <div
              class="h-full rounded-[inherit]"
              :style="[
                MONITOR_PROGRESS_TRANSITION,
                { width: card.percent, background: card.barBg }
              ]"
            />
          </div>
          <div class="mt-3 flex items-center justify-between gap-3 text-xs">
            <span class="text-g-500">{{ card.tipLabel }}</span>
            <span class="truncate font-medium text-g-700">{{ card.tip }}</span>
          </div>
        </div>
      </article>
    </section>

    <section
      v-if="!isFocusMode"
      class="grid grid-cols-[minmax(0,1.52fr)_minmax(22rem,0.86fr)] items-stretch gap-5 max-[1180px]:grid-cols-1"
    >
      <article
        class="min-h-[22.25rem] min-w-0 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[1.35rem] shadow-[var(--art-surface-shadow-sm)]"
      >
        <div class="flex items-start justify-between gap-4 max-md:flex-col">
          <div class="flex items-start gap-3">
            <div class="max-w-[38rem]">
              <h2 class="m-0 text-lg font-[650] leading-[1.4] tracking-normal text-g-900">
                会话态势
              </h2>
              <p class="mt-1 text-sm leading-[1.6] text-g-600">
                按活跃度和设备来源快速判断是否需要清理、复核或继续观察。
              </p>
            </div>
          </div>
          <ElTag :type="sessionFocus.type" effect="light">{{ sessionFocus.label }}</ElTag>
        </div>

        <div
          class="mt-[1.35rem] flex items-stretch divide-x divide-[var(--art-inner-surface-border)] rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] max-md:flex-col max-md:divide-x-0 max-md:divide-y"
        >
          <div
            v-for="item in sessionMix"
            :key="item.label"
            class="flex flex-1 items-center gap-4 px-5 py-[1.35rem]"
          >
            <div
              class="flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-10"
              :style="{ background: item.iconBg }"
            >
              <ArtSvgIcon :icon="item.icon" class="text-base" :style="{ color: item.iconColor }" />
            </div>
            <div class="min-w-0">
              <div class="flex items-baseline gap-2">
                <ArtCountTo
                  class="text-[1.375rem] font-semibold leading-none text-g-900"
                  :target="Number(item.value)"
                  :duration="MONITOR_COUNT_ANIMATION_DURATION"
                />
                <span class="text-[0.8125rem] font-medium text-g-600">{{ item.label }}</span>
              </div>
              <p class="mt-1.5 truncate text-xs text-g-500">{{ item.tip }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 items-stretch gap-4 max-[1180px]:grid-cols-1">
          <div
            class="min-h-[11.25rem] min-w-0 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-[1.25rem]"
          >
            <div class="flex items-center justify-between gap-4">
              <span class="text-[0.9375rem] font-[650] text-g-900">浏览器分布</span>
              <ElTag size="small" effect="light"
                >集中度 {{ browserOverview.concentrationLabel }}</ElTag
              >
            </div>
            <div class="mt-5 flex items-center gap-8">
              <div class="relative flex shrink-0 items-center justify-center size-[7.5rem]">
                <div class="absolute inset-0 rounded-full" :style="{ background: donutGradient }" />
                <div
                  class="relative flex flex-col items-center justify-center rounded-full bg-[var(--art-surface-bg-muted)] size-[6rem]"
                >
                  <ArtCountTo
                    class="text-lg font-semibold leading-none text-g-900"
                    :target="browserOverview.totalCount"
                    :duration="MONITOR_COUNT_ANIMATION_DURATION"
                  />
                  <span class="mt-1 text-[0.6875rem] text-g-500">总会话</span>
                </div>
              </div>
              <div class="flex min-w-0 flex-col gap-2.5">
                <div
                  v-for="item in browserStatsWithShare.slice(0, 4)"
                  :key="item.name"
                  class="flex items-center gap-2 text-[0.8125rem]"
                >
                  <span
                    class="shrink-0 rounded-full size-2.5"
                    :style="{ background: item.dotColor }"
                  />
                  <span class="min-w-0 truncate text-g-600">#{{ item.rank }} {{ item.name }}</span>
                  <strong class="ml-auto shrink-0 tabular-nums font-semibold text-g-900">{{
                    item.count
                  }}</strong>
                  <span class="shrink-0 tabular-nums text-g-600">{{ item.share }}</span>
                </div>
                <ElEmpty
                  v-if="!browserStatsWithShare.length"
                  description="暂无浏览器数据"
                  :image-size="60"
                />
              </div>
            </div>
            <p class="mt-5 flex items-center gap-1.5 text-xs text-g-500">
              <ArtSvgIcon icon="ri:information-line" class="shrink-0 size-3.5" />
              <span>{{ browserOverview.insight }}</span>
            </p>
          </div>

          <div
            class="min-w-0 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-[1.25rem]"
          >
            <div class="flex items-center justify-between gap-4">
              <span class="text-[0.9375rem] font-[650] text-g-900">设备来源</span>
              <ElTag size="small" effect="light">{{ deviceStats.length }} 类</ElTag>
            </div>
            <div class="mt-5 flex flex-col gap-5">
              <div v-for="item in deviceStats" :key="item.name">
                <div class="flex items-center gap-3">
                  <div
                    class="flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-8 bg-[color-mix(in_srgb,var(--art-primary)_10%,transparent)] text-[var(--art-primary)]"
                  >
                    <ArtSvgIcon :icon="item.icon" class="text-base" />
                  </div>
                  <span class="min-w-0 truncate text-[0.8125rem] font-medium text-g-700">{{
                    item.name
                  }}</span>
                  <div class="ml-auto flex items-center gap-2">
                    <strong class="tabular-nums font-semibold text-g-900">{{ item.count }}</strong>
                    <span class="tabular-nums text-[0.8125rem] text-g-600">{{ item.share }}</span>
                  </div>
                </div>
                <div
                  class="mt-2.5 ml-11 h-[0.45rem] overflow-hidden rounded-full bg-[var(--art-surface-bg)]"
                >
                  <span
                    class="block min-w-0 h-full rounded-full"
                    :style="[
                      MONITOR_PROGRESS_TRANSITION,
                      { width: item.barWidth, background: item.color }
                    ]"
                  />
                </div>
              </div>
              <ElEmpty v-if="!deviceStats.length" description="暂无设备数据" :image-size="92" />
            </div>
            <p class="mt-5 flex items-center gap-1.5 text-xs text-g-500">
              <ArtSvgIcon icon="ri:information-line" class="shrink-0 size-3.5" />
              <span
                >检测到 {{ deviceStats.length }} 类设备，{{
                  deviceStats[0]?.name || 'PC'
                }}
                为主要来源</span
              >
            </p>
          </div>
        </div>
      </article>

      <article
        class="min-w-0 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[1.35rem] shadow-[var(--art-surface-shadow-sm)]"
      >
        <div class="flex items-start justify-between gap-4 max-md:flex-col">
          <div class="max-w-[38rem]">
            <h2 class="m-0 text-lg font-[650] leading-[1.4] tracking-normal text-g-900">
              处置建议
            </h2>
            <p class="mt-1 text-sm leading-[1.6] text-g-600">
              结合当前会话状态给出优先处理方向。
            </p>
          </div>
          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] px-3 py-1.5 text-xs font-medium text-[var(--art-primary)] shadow-[var(--art-surface-shadow-sm)]"
          >
            <ArtSvgIcon icon="ri:sparkling-line" class="size-3" />
            {{ managementAdviceLevel }}
          </span>
        </div>

        <div class="mt-5 flex flex-col gap-3">
          <div
            class="flex items-start gap-[0.85rem] rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-[1.05rem] py-4"
          >
            <div
              class="flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-9 bg-[color-mix(in_srgb,var(--art-primary)_12%,transparent)] text-[var(--art-primary)]"
            >
              <ArtSvgIcon icon="ri:radar-line" />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-g-900">{{ managementHeadline.title }}</div>
              <p class="mt-[0.4rem] text-xs leading-[1.6] text-g-500">{{
                managementHeadline.description
              }}</p>
            </div>
          </div>

          <div
            v-for="item in managementAdviceItems"
            :key="item.title"
            class="flex items-start gap-[0.85rem] rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-[1.05rem] py-4"
          >
            <div
              class="flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-9"
              :style="{ background: item.iconBg, color: item.iconColor }"
            >
              <ArtSvgIcon :icon="item.icon" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="text-sm font-medium text-g-900">{{ item.title }}</div>
                <ElTag size="small" :type="item.tagType" effect="light">{{ item.tag }}</ElTag>
              </div>
              <p class="mt-[0.4rem] text-xs leading-[1.6] text-g-500">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </article>
    </section>

    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="online-user-table-card art-table-card mt-0! card-p0" shadow="never">
      <div v-if="!isFocusMode" class="border-b border-[var(--art-inner-surface-border)] pb-4">
        <div class="min-w-0">
          <h2 class="m-0 text-lg font-[650] leading-[1.4] tracking-normal text-g-900">
            在线会话列表
          </h2>
          <p class="mt-1 text-sm leading-[1.6] text-g-600">
            逐条查看账号、角色、来源、设备和活跃时间，必要时按会话强制下线。
          </p>
        </div>
      </div>

      <ArtTableHeader
        v-model:columns="columnChecks"
        full-class="online-user-table-card"
        :class="{ 'pt-4': !isFocusMode }"
        :loading="loading"
        :data="records"
        :selected-data="selectedRows"
        data-output-title="在线会话列表"
        export-file-name="在线会话列表"
        @refresh="loadList"
      >
        <template #left>
          <div class="flex flex-wrap items-center gap-2">
            <ElButton
              v-auth="'forceLogout'"
              type="danger"
              plain
              :disabled="selectedRows.length === 0"
              @click="handleBatchForceLogout"
            >
              <template #icon>
                <ArtSvgIcon icon="ri:logout-box-r-line" />
              </template>
              强制下线
            </ElButton>
            <ElTag type="info" effect="light">当前页 {{ records.length }} 条</ElTag>
            <ElTag v-if="selectedRows.length" type="primary" effect="light">
              已选 {{ selectedRows.length }} 项
            </ElTag>
          </div>
        </template>
        <template #right>
          <ArtFocusModeButton :active="isFocusMode" @click="toggleFocusMode" />
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="records"
        :columns="columns"
        :pagination="pagination"
        emptyHeight="360px"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <ElDrawer v-model="detailVisible" title="在线会话详情" :size="detailDrawerSize">
      <div v-loading="detailLoading" class="space-y-4">
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="用户名">{{ detail?.username || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="姓名">{{ detail?.realName || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="所属部门">{{
            detail?.department?.name || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="岗位">{{ detail?.post?.name || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="角色" :span="2">
            {{ detail?.roles?.map((item) => item.name).join(' / ') || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="会话状态">
            <ElTag :type="detail?.status === 'ACTIVE' ? 'success' : 'warning'" effect="light">
              {{ detail?.status === 'ACTIVE' ? '活跃' : '空闲' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="是否当前会话">
            {{ detail?.isCurrentSession ? '是' : '否' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="IP 地址">{{ detail?.ip || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="设备类型">{{ detail?.deviceType || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="浏览器">{{ detail?.browser || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="操作系统">{{ detail?.os || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="登录时间">{{
            formatDateTime(detail?.loginAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="最后活跃">{{
            formatDateTime(detail?.lastActiveAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="最近续签">{{
            formatDateTime(detail?.lastRefreshAt)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="会话时长">{{
            formatOnlineSessionAge(detail?.sessionAgeMinutes)
          }}</ElDescriptionsItem>
          <ElDescriptionsItem label="User Agent" :span="2">
            {{ detail?.userAgent || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import type { TagProps } from 'element-plus'
  import { ElEmpty, ElMessage, ElMessageBox } from 'element-plus'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import { fetchForceLogoutOnlineUsers, fetchOnlineUserDetail } from '@/api/monitor'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { formatDateTime } from '@/utils'
  import {
    MONITOR_COUNT_ANIMATION_DURATION,
    MONITOR_PROGRESS_TRANSITION,
    createOnlineUserSearchForm,
    formatOnlineSessionAge
  } from '../shared'
  import { useOnlineUserTable } from './modules/useOnlineUserTable'

  defineOptions({ name: 'OnlineUser' })

  type OnlineUserItem = Api.Monitor.OnlineUserItem
  type AdviceTagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

  const toneMap = {
    primary: {
      color: 'var(--art-primary)',
      soft: 'color-mix(in srgb, var(--art-primary) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-primary) 88%, white), var(--art-primary))'
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
    info: {
      color: 'var(--art-info)',
      soft: 'color-mix(in srgb, var(--art-info) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-info) 88%, white), var(--art-info))'
    }
  }

  const { isFocusMode, toggleFocusMode } = usePageFocusMode('monitor.onlineUser')
  const { width } = useWindowSize()
  const detailDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '720px'
  })

  const selectedRows = ref<OnlineUserItem[]>([])
  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detail = ref<OnlineUserItem | null>(null)

  const searchForm = ref(createOnlineUserSearchForm())

  /**
   * 生成在线用户搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '用户名 / 姓名 / IP / 部门' }
    },
    {
      label: '会话状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择会话状态',
        options: [
          { label: '活跃', value: 'ACTIVE' },
          { label: '空闲', value: 'IDLE' }
        ]
      }
    },
    {
      label: '设备类型',
      key: 'deviceType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择设备类型',
        options: [
          { label: 'PC', value: 'pc' },
          { label: 'Mobile', value: 'mobile' }
        ]
      }
    },
    {
      label: '角色编码',
      key: 'roleCode',
      type: 'input',
      props: { clearable: true, placeholder: '例如：R_SUPER' }
    }
  ])

  /**
   * 同步表格选中行。
   */
  function handleSelectionChange(rows: OnlineUserItem[]) {
    selectedRows.value = rows
  }

  /**
   * 打开会话详情抽屉并加载详情。
   */
  async function openDetail(row: OnlineUserItem) {
    detailVisible.value = true
    detailLoading.value = true
    try {
      detail.value = await fetchOnlineUserDetail(row.sessionId)
    } finally {
      detailLoading.value = false
    }
  }

  /**
   * 强制下线单个会话。
   */
  async function handleForceLogout(row: OnlineUserItem) {
    await ElMessageBox.confirm(
      `确认强制下线账号“${row.realName || row.username}”的当前会话吗？`,
      '强制下线',
      {
        type: 'warning'
      }
    )

    await fetchForceLogoutOnlineUsers({
      sessionIds: [row.sessionId],
      reason: '管理员手动下线'
    })
    ElMessage.success('会话已下线')
    if (detail.value?.sessionId === row.sessionId) {
      detailVisible.value = false
    }
    loadList()
  }

  const {
    columns,
    columnChecks,
    records,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    getData,
    handleSizeChange,
    handleCurrentChange
  } = useOnlineUserTable({
    openDetail,
    handleForceLogout
  })

  /**
   * 提取在线用户概览信息。
   */
  const summary = computed(
    () =>
      (pagination as any).extraSummary || {
        activeCount: 0,
        idleCount: 0,
        uniqueUserCount: 0,
        browserStats: []
      }
  )

  const totalOnlineSessions = computed(() => summary.value.activeCount + summary.value.idleCount)

  const heroBadges = computed(() => [
    {
      label: '活跃会话',
      value: summary.value.activeCount,
      icon: 'ri:pulse-line'
    },
    {
      label: '空闲会话',
      value: summary.value.idleCount,
      icon: 'ri:time-line'
    },
    {
      label: '在线用户',
      value: summary.value.uniqueUserCount,
      icon: 'ri:user-shared-line'
    }
  ])

  const summaryCards = computed(() => [
    {
      label: '在线会话',
      num: totalOnlineSessions.value,
      suffix: '',
      percent: `${Math.min(100, totalOnlineSessions.value * 4)}%`,
      tipLabel: '会话',
      tip: `活跃 ${summary.value.activeCount}，空闲 ${summary.value.idleCount}`,
      icon: 'ri:global-line',
      iconStyle: { background: toneMap.primary.soft, color: toneMap.primary.color },
      barBg: toneMap.primary.bar
    },
    {
      label: '在线用户',
      num: summary.value.uniqueUserCount,
      suffix: '',
      percent: `${Math.min(100, summary.value.uniqueUserCount * 5)}%`,
      tipLabel: '账号',
      tip: '去重后的当前在线账号数量',
      icon: 'ri:user-3-line',
      iconStyle: { background: toneMap.success.soft, color: toneMap.success.color },
      barBg: toneMap.success.bar
    },
    {
      label: '空闲占比',
      num: idleShare.value,
      suffix: '%',
      percent: `${idleShare.value}%`,
      tipLabel: '清理',
      tip: idleShare.value >= 50 ? '建议优先清理长期空闲会话' : '空闲会话处于可控区间',
      icon: 'ri:timer-flash-line',
      iconStyle: { background: toneMap.warning.soft, color: toneMap.warning.color },
      barBg: toneMap.warning.bar
    },
    {
      label: '浏览器来源',
      num: browserOverview.value.categoryCount,
      suffix: '',
      percent: `${browserOverview.value.topShareNumber}%`,
      tipLabel: '主力',
      tip: `主力来源 ${browserOverview.value.topName}，占比 ${browserOverview.value.topShare}`,
      icon: 'ri:chrome-line',
      iconStyle: { background: toneMap.info.soft, color: toneMap.info.color },
      barBg: toneMap.info.bar
    }
  ])

  const idleShare = computed(() => {
    if (!totalOnlineSessions.value) return 0
    return Math.round((summary.value.idleCount / totalOnlineSessions.value) * 100)
  })

  const activeShare = computed(() => {
    if (!totalOnlineSessions.value) return 0
    return Math.round((summary.value.activeCount / totalOnlineSessions.value) * 100)
  })

  const sessionFocus = computed<{ label: string; type: TagProps['type'] }>(() => {
    if (summary.value.idleCount > summary.value.activeCount) {
      return { label: '空闲偏高', type: 'warning' }
    }
    if (summary.value.activeCount > 20) {
      return { label: '高活跃时段', type: 'primary' }
    }
    return { label: '状态平稳', type: 'success' }
  })

  const sessionMix = computed(() => [
    {
      label: '活跃会话',
      value: summary.value.activeCount,
      icon: 'ri:chat-smile-2-line',
      iconBg: 'color-mix(in srgb, var(--art-success) 14%, transparent)',
      iconColor: 'var(--art-success)',
      width: `${Math.max(activeShare.value, summary.value.activeCount > 0 ? 8 : 0)}%`,
      color:
        'linear-gradient(90deg, var(--art-success), color-mix(in srgb, var(--art-success) 68%, white))',
      tip: `${activeShare.value}% 的会话仍在近期活跃`
    },
    {
      label: '空闲会话',
      value: summary.value.idleCount,
      icon: 'ri:leaf-line',
      iconBg: 'color-mix(in srgb, var(--art-warning) 14%, transparent)',
      iconColor: 'var(--art-warning)',
      width: `${Math.max(idleShare.value, summary.value.idleCount > 0 ? 8 : 0)}%`,
      color:
        'linear-gradient(90deg, var(--art-warning), color-mix(in srgb, var(--art-warning) 68%, white))',
      tip: `${idleShare.value}% 的会话可作为清理候选`
    },
    {
      label: '账号复用度',
      value: totalOnlineSessions.value
        ? `${Math.max(totalOnlineSessions.value - summary.value.uniqueUserCount, 0)}`
        : 0,
      icon: 'ri:group-line',
      iconBg: 'color-mix(in srgb, var(--art-primary) 14%, transparent)',
      iconColor: 'var(--art-primary)',
      width: `${Math.min(
        100,
        Math.max(
          totalOnlineSessions.value
            ? Math.round(
                ((totalOnlineSessions.value - summary.value.uniqueUserCount) /
                  totalOnlineSessions.value) *
                  100
              )
            : 0,
          totalOnlineSessions.value > summary.value.uniqueUserCount ? 8 : 0
        )
      )}%`,
      color:
        'linear-gradient(90deg, var(--art-primary), color-mix(in srgb, var(--art-primary) 68%, white))',
      tip: '同一账号多会话数量，用于识别跨设备登录'
    }
  ])

  /**
   * 浏览器分布数据，补齐排行、占比和颜色。
   */
  const browserStatsWithShare = computed(() => {
    const stats = summary.value.browserStats || []
    const total = stats.reduce((sum: number, item: { count: number }) => sum + item.count, 0)
    const browserColors = [
      'linear-gradient(90deg, var(--art-primary), color-mix(in srgb, var(--art-primary) 76%, white))',
      'linear-gradient(90deg, var(--art-success), color-mix(in srgb, var(--art-success) 76%, white))',
      'linear-gradient(90deg, var(--art-warning), color-mix(in srgb, var(--art-warning) 76%, white))',
      'linear-gradient(90deg, var(--art-danger), color-mix(in srgb, var(--art-danger) 78%, white))',
      'linear-gradient(90deg, var(--art-info), color-mix(in srgb, var(--art-info) 76%, white))',
      'linear-gradient(90deg, var(--art-gray-600), color-mix(in srgb, var(--art-gray-600) 78%, white))'
    ]
    const dotColors = [
      'var(--art-primary)',
      'var(--art-success)',
      'var(--art-warning)',
      'var(--art-danger)',
      'var(--art-info)',
      'var(--art-gray-600)'
    ]

    return [...stats]
      .sort((a, b) => b.count - a.count)
      .map((item: { name: string; count: number }, index: number) => {
        const shareNumber = total > 0 ? Math.round((item.count / total) * 100) : 0
        return {
          ...item,
          rank: index + 1,
          share: `${shareNumber}%`,
          shareNumber,
          barWidth: `${Math.max(shareNumber, item.count > 0 ? 10 : 0)}%`,
          color: browserColors[index % browserColors.length],
          dotColor: dotColors[index % dotColors.length],
          tip: `${item.count} 个会话，占比 ${shareNumber}%`
        }
      })
  })

  /**
   * 浏览器总览信息。
   */
  const browserOverview = computed(() => {
    const stats = browserStatsWithShare.value
    const topItem = stats[0]
    const secondaryItem = stats[1]
    const total = stats.reduce((sum, item) => sum + item.count, 0)
    const categoryCount = stats.length
    const topShareNumber = topItem?.shareNumber || 0

    return {
      topName: topItem?.name || '暂无数据',
      topCount: topItem?.count ?? 0,
      topShare: topItem?.share || '0%',
      topShareNumber,
      totalCount: total,
      categoryCount,
      secondaryName: secondaryItem?.name || '暂无次级来源',
      concentrationLabel: topShareNumber >= 80 ? '高' : topShareNumber >= 50 ? '中' : '低',
      insight:
        categoryCount <= 2
          ? '浏览器来源较集中，建议重点保障主力浏览器兼容性，并留意少量来源的异常访问。'
          : topShareNumber >= 70
            ? '主力浏览器占比较高，建议优先关注大盘浏览器体验，再补长尾兼容性。'
            : '浏览器来源较分散，建议结合设备类型与地区信息观察长尾来源。'
    }
  })

  const donutGradient = computed(() => {
    const stats = browserStatsWithShare.value
    if (!stats.length) return 'var(--art-inner-surface-border)'
    const dotColors = [
      'var(--art-primary)',
      'var(--art-success)',
      'var(--art-warning)',
      'var(--art-danger)',
      'var(--art-info)',
      'var(--art-gray-600)'
    ]
    let accumulated = 0
    const segments = stats.map((item, idx) => {
      const start = accumulated
      accumulated += item.shareNumber
      return `${dotColors[idx % dotColors.length]} ${start}% ${accumulated}%`
    })
    return `conic-gradient(${segments.join(', ')})`
  })

  const deviceStats = computed(() => {
    const deviceMap = new Map<string, number>([
      ['pc', 0],
      ['mobile', 0]
    ])
    records.value.forEach((item) => {
      const name = item.deviceType || '未知设备'
      deviceMap.set(name, (deviceMap.get(name) || 0) + 1)
    })
    const total = records.value.length
    const colors = [
      'linear-gradient(90deg, var(--art-primary), color-mix(in srgb, var(--art-primary) 72%, white))',
      'linear-gradient(90deg, var(--art-success), color-mix(in srgb, var(--art-success) 72%, white))',
      'linear-gradient(90deg, var(--art-warning), color-mix(in srgb, var(--art-warning) 72%, white))',
      'linear-gradient(90deg, var(--art-info), color-mix(in srgb, var(--art-info) 72%, white))'
    ]
    const iconMap: Record<string, string> = {
      pc: 'ri:computer-line',
      mobile: 'ri:smartphone-line'
    }

    return Array.from(deviceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => {
        const shareNumber = total > 0 ? Math.round((count / total) * 100) : 0
        return {
          name,
          count,
          icon: iconMap[name] || 'ri:device-line',
          share: `${shareNumber}%`,
          barWidth: `${Math.max(shareNumber, count > 0 ? 8 : 0)}%`,
          color: colors[index % colors.length]
        }
      })
  })

  /**
   * 管理建议等级。
   */
  const managementAdviceLevel = computed(() => {
    if (summary.value.idleCount > summary.value.activeCount) return '建议优先清理空闲会话'
    if (summary.value.activeCount > 20) return '建议关注高活跃时段'
    return '当前会话状态平稳'
  })

  /**
   * 管理建议顶部焦点。
   */
  const managementHeadline = computed(() => {
    if (summary.value.idleCount > summary.value.activeCount) {
      return {
        title: '优先处理长期空闲会话',
        description: '空闲会话数量较高，建议先做清理，减少旧 token 残留和误占用风险。'
      }
    }

    return {
      title: '优先关注高权限在线账号',
      description: '先排查长时间在线、跨设备切换和异常来源的管理员会话，再处理长尾风险。'
    }
  })

  /**
   * 管理建议列表。
   */
  const managementAdviceItems = computed<
    Array<{
      title: string
      tag: string
      tagType: AdviceTagType
      icon: string
      iconBg: string
      iconColor: string
      description: string
    }>
  >(() => [
    {
      title: '优先检查高权限账号',
      tag: '高优先级',
      tagType: 'danger',
      icon: 'ri:shield-user-line',
      iconBg: 'color-mix(in srgb, var(--art-danger) 12%, transparent)',
      iconColor: 'var(--art-danger)',
      description: '重点关注长时间在线、跨设备切换和异常地区登录的管理员会话。'
    },
    {
      title: '处理空闲会话',
      tag: summary.value.idleCount > 0 ? `${summary.value.idleCount} 个待关注` : '状态正常',
      tagType: summary.value.idleCount > 0 ? 'warning' : 'success',
      icon: 'ri:time-line',
      iconBg: 'color-mix(in srgb, var(--art-warning) 12%, transparent)',
      iconColor: '#b7791f',
      description:
        summary.value.idleCount > 0
          ? '上线前可以先清理长期空闲会话，减少旧 token 保留和误占用风险。'
          : '当前空闲会话压力较低，可以继续观察会话活跃变化。'
    },
    {
      title: '联动缓存监控',
      tag: '扩展能力',
      tagType: 'info',
      icon: 'ri:database-2-line',
      iconBg: 'color-mix(in srgb, var(--art-primary) 12%, transparent)',
      iconColor: 'var(--art-primary)',
      description: 'Redis 接入后可继续串联会话续签、热点 Key 和命中率，排查异常来源会更直接。'
    }
  ])

  /**
   * 刷新在线用户列表。
   */
  function loadList() {
    return getData()
  }

  /**
   * 批量强制下线当前选中的会话。
   */
  async function handleBatchForceLogout() {
    await ElMessageBox.confirm(
      `确认强制下线选中的 ${selectedRows.value.length} 个会话吗？`,
      '批量强制下线',
      {
        type: 'warning'
      }
    )

    await fetchForceLogoutOnlineUsers({
      sessionIds: selectedRows.value.map((item) => item.sessionId),
      reason: '管理员批量下线'
    })
    selectedRows.value = []
    loadList()
  }

  /**
   * 提交筛选条件并刷新列表。
   */
  function handleSearch() {
    replaceSearchParams({
      ...searchForm.value
    })
  }

  /**
   * 重置筛选条件并重新加载列表。
   */
  function handleReset() {
    searchForm.value = createOnlineUserSearchForm()
    resetSearchParams()
  }

  onMounted(loadList)
</script>
