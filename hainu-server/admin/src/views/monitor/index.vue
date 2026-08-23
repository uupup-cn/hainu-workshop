<template>
  <div class="monitor-overview-page flex flex-col gap-4 pb-5">
    <ArtPageHero
      size="lg"
      title="监控总览"
      description="聚合会话、登录、安全、资源与缓存状态，为管理端提供开站前后的稳定性巡检视图。"
      right-class="flex flex-wrap items-center justify-start gap-2 xl:justify-end"
    >
      <template #right>
        <div
          class="flex items-center gap-2 rounded-custom-xs border border-[var(--art-inner-surface-border)] bg-box px-3 h-[36px] text-xs text-g-700 mr-3"
        >
          <ArtSvgIcon icon="ri:time-line" class="size-3.5" />
          {{ formatDateTime(overview?.summary.generatedAt) || '-' }}
        </div>
        <ElButton :loading="loading" plain @click="loadOverview">
          <ArtSvgIcon icon="ri:refresh-line" class="mr-1.5" />
          刷新
        </ElButton>
        <ElButton type="primary" @click="router.push('/monitor/online-user')">
          <ArtSvgIcon icon="ri:user-shared-line" class="mr-1.5" />
          在线用户
        </ElButton>
      </template>

      <template #footer>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div
            v-for="item in statusStrip"
            :key="item.label"
            class="rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-4 py-3"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs text-g-500">{{ item.label }}</span>
              <ElTag size="small" :type="item.tagType" effect="light">{{ item.tag }}</ElTag>
            </div>
            <div class="mt-2 truncate text-sm font-medium text-g-900">{{ item.value }}</div>
          </div>
        </div>
      </template>
    </ArtPageHero>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.label"
        class="art-surface-sm flex min-h-[150px] flex-col justify-between px-5 py-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="text-sm font-medium text-g-600">{{ card.label }}</div>
            <div class="mt-3 flex items-end gap-2">
              <ArtCountTo
                class="text-[1.75rem] font-medium leading-none text-g-900"
                :target="card.value"
                :duration="MONITOR_COUNT_ANIMATION_DURATION"
              />
              <span class="pb-1 text-xs text-g-500">{{ card.unit }}</span>
            </div>
          </div>
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] text-lg"
            :style="card.iconStyle"
          >
            <ArtSvgIcon :icon="card.icon" />
          </div>
        </div>
        <div
          class="mt-5 grid grid-cols-2 gap-2 border-t border-[var(--art-inner-surface-border)] pt-4"
        >
          <div>
            <div class="text-xs text-g-500">{{ card.metaLabel }}</div>
            <div class="mt-1 truncate text-sm font-medium text-g-800">{{ card.metaValue }}</div>
          </div>
          <div>
            <div class="text-xs text-g-500">{{ card.extraLabel }}</div>
            <div class="mt-1 truncate text-sm font-medium text-g-800">{{ card.extraValue }}</div>
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)]">
      <article class="art-surface-sm flex min-w-0 flex-col px-5 py-5 xl:h-[640px]">
        <PanelHeader
          title="登录安全走势"
          description="近 7 日成功与失败登录对比，用于判断异常尝试是否抬头。"
        >
          <ElTag :type="securityTagType" effect="light">风险 {{ securityLabel }}</ElTag>
        </PanelHeader>

        <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div
            v-for="item in loginTrendTiles"
            :key="item.label"
            class="art-surface-muted px-4 py-3"
          >
            <div class="text-xs text-g-500">{{ item.label }}</div>
            <div class="mt-1 text-xl font-semibold text-g-900">
              <ArtCountTo
                v-if="typeof item.value === 'number'"
                :target="item.value"
                :duration="MONITOR_COUNT_ANIMATION_DURATION"
              />
              <template v-else>{{ item.value }}</template>
            </div>
            <div class="mt-1 text-xs text-g-500">{{ item.hint }}</div>
          </div>
        </div>

        <ElScrollbar class="mt-5 -mr-2 min-h-0 xl:flex-1" height="100%">
          <div class="flex flex-col gap-3 pr-2">
            <div
              v-for="item in overview?.loginTrend || []"
              :key="item.date"
              class="rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-4 py-3"
            >
              <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-g-900">{{ item.date }}</span>
                  <ElTag
                    size="small"
                    effect="light"
                    :type="item.failCount > item.successCount ? 'danger' : 'success'"
                  >
                    {{ item.failCount > item.successCount ? '需关注' : '稳定' }}
                  </ElTag>
                </div>
                <span class="text-xs text-g-500"
                  >总尝试 {{ item.successCount + item.failCount }}</span
                >
              </div>
              <div class="grid gap-2">
                <MetricBar
                  label="成功"
                  :value="item.successCount"
                  :width="getTrendWidth(item.successCount)"
                  tone="primary"
                />
                <MetricBar
                  label="失败"
                  :value="item.failCount"
                  :width="getTrendWidth(item.failCount)"
                  tone="danger"
                />
              </div>
            </div>
            <EmptyState v-if="!overview?.loginTrend?.length" text="暂无登录趋势数据" />
          </div>
        </ElScrollbar>
      </article>

      <article class="art-surface-sm flex flex-col px-5 py-5 xl:h-[640px]">
        <PanelHeader title="运行健康" description="主机资源、进程与网络状态的实时巡检摘要。">
          <ElTag :type="systemHealthTagType" effect="light">{{ systemHealthLabel }}</ElTag>
        </PanelHeader>

        <div
          class="mt-5 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs text-g-500">健康评分</div>
              <div class="mt-1 text-3xl font-medium leading-none text-g-900">
                <ArtCountTo :target="systemScoreNum" :duration="MONITOR_SCORE_ANIMATION_DURATION" />
              </div>
            </div>
            <div class="text-right text-xs leading-6 text-g-500">
              <div>{{ overview?.systemResource.hostname || '-' }}</div>
              <div
                >{{ overview?.systemResource.platform || '-' }} /
                {{ overview?.systemResource.arch || '-' }}</div
              >
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div v-for="item in resourceCards" :key="item.label" class="art-surface-muted px-4 py-3">
            <div class="flex items-center justify-between gap-3 text-xs text-g-500">
              <span>{{ item.label }}</span>
              <span>{{ item.value }}</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-[var(--default-bg-color)]">
              <div class="h-full rounded-full" :style="item.barStyle" />
            </div>
            <div class="mt-2 text-xs text-g-500">{{ item.hint }}</div>
          </div>
        </div>

        <div
          class="mt-4 flex-1 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-box p-4"
        >
          <div class="mb-3 flex items-center justify-between gap-3">
            <span class="text-sm font-medium text-g-900">磁盘与网络</span>
            <span class="text-xs text-g-500"
              >在线网卡 {{ overview?.systemResource.network.upInterfaceCount ?? 0 }}</span
            >
          </div>
          <div class="grid gap-3">
            <div v-for="disk in primaryDisks" :key="`${disk.filesystem}-${disk.mountpoint}`">
              <div class="mb-1 flex justify-between gap-3 text-xs text-g-500">
                <span class="truncate">{{ disk.mountpoint }}</span>
                <span>{{ formatPercent(disk.usagePercent) }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-[var(--default-bg-color)]">
                <div
                  class="h-full rounded-full bg-[var(--theme-color)]"
                  :style="{
                    ...MONITOR_PROGRESS_TRANSITION,
                    width: `${clampPercent(disk.usagePercent)}%`
                  }"
                />
              </div>
            </div>
            <EmptyState v-if="!primaryDisks.length" text="暂无磁盘采样" />
          </div>
        </div>

        <ElButton class="mt-4 w-full" plain @click="router.push('/monitor/server')">
          进入服务器监控
        </ElButton>
      </article>
    </section>

    <section
      class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.1fr)_minmax(340px,0.9fr)]"
    >
      <article class="art-surface-sm flex flex-col px-5 py-5 xl:h-[770px]">
        <PanelHeader title="缓存接入" description="Redis 连接、指标与后续面板准备情况。">
          <ElTag :type="cacheTagType" effect="light">{{ cacheStatusText }}</ElTag>
        </PanelHeader>

        <div
          class="mt-5 rounded-[var(--art-radius-surface-sm)] border border-dashed border-[var(--default-border-dashed)] bg-[var(--art-surface-bg-muted)] p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-base font-semibold text-g-900">{{
                overview?.cache.engine || 'Redis'
              }}</div>
              <p class="mt-2 text-sm leading-6 text-g-600">{{
                overview?.cache.message || '缓存监控数据加载中'
              }}</p>
            </div>
            <span class="shrink-0 rounded-full bg-box px-3 py-1 text-xs text-g-600">{{
              cacheConnectionHint
            }}</span>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div
            v-for="metric in cacheMetrics"
            :key="metric.label"
            class="art-surface-muted px-4 py-3"
          >
            <div class="text-xs text-g-500">{{ metric.label }}</div>
            <div class="mt-1 truncate text-sm font-medium text-g-900">{{ metric.value }}</div>
          </div>
        </div>

        <div
          class="mt-4 flex-1 rounded-[var(--art-radius-surface-sm)] border border-[var(--art-inner-surface-border)] bg-box p-4 text-sm leading-6 text-g-600"
        >
          {{ cacheNextStep }}
        </div>

        <div
          class="mt-4 flex items-center justify-between gap-3 border-t border-[var(--art-inner-surface-border)] pt-4"
        >
          <span class="text-xs text-g-500">更新 {{ cacheUpdatedAt }}</span>
          <ElButton plain @click="router.push('/monitor/cache')">缓存监控</ElButton>
        </div>
      </article>

      <article class="art-surface-sm flex min-w-0 flex-col px-5 py-5 xl:h-[770px]">
        <PanelHeader title="最近在线会话" description="聚焦当前活跃账号、设备与最后活动时间。">
          <ElButton link type="primary" @click="router.push('/monitor/online-user')"
            >查看全部</ElButton
          >
        </PanelHeader>

        <ElScrollbar class="mt-5 -mr-2 min-h-0 xl:flex-1" height="100%">
          <div class="grid gap-3 pr-2">
            <div
              v-for="session in overview?.recentSessions || []"
              :key="session.sessionId"
              class="flex flex-col gap-4 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  :style="sessionAvatarStyle"
                >
                  {{ session.realName?.slice(0, 1) || session.username.slice(0, 1).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 text-sm font-medium text-g-900">
                    {{ session.realName || session.username }}
                    <ElTag v-if="session.isCurrentSession" size="small" effect="light">当前</ElTag>
                  </div>
                  <div class="mt-1 truncate text-xs text-g-600">
                    {{ session.department?.name || '未分配部门' }} / {{ session.browser }} /
                    {{ session.os }}
                  </div>
                </div>
              </div>
              <div
                class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-g-600 lg:justify-end"
              >
                <ElTag :type="session.status === 'ACTIVE' ? 'success' : 'warning'" effect="light">
                  {{ session.status === 'ACTIVE' ? '活跃' : '空闲' }}
                </ElTag>
                <span>{{ session.ip || '未知 IP' }}</span>
                <span>{{ formatDateTime(session.lastActiveAt) }}</span>
              </div>
            </div>
            <EmptyState v-if="!overview?.recentSessions?.length" text="暂无在线会话" />
          </div>
        </ElScrollbar>
      </article>

      <article class="art-surface-sm flex flex-col px-5 py-5 xl:h-[770px]">
        <PanelHeader title="登录事件" description="最近认证行为，辅助快速定位异常来源。" />

        <ElScrollbar class="mt-5 -mr-2 min-h-0 xl:flex-1" height="100%">
          <div class="grid gap-3 pr-2">
            <div
              v-for="item in overview?.recentLogins || []"
              :key="item.id"
              class="flex items-start gap-3 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full text-lg"
                :style="item.status === 'SUCCESS' ? successEventIconStyle : dangerEventIconStyle"
              >
                <ArtSvgIcon
                  :icon="
                    item.status === 'SUCCESS' ? 'ri:checkbox-circle-line' : 'ri:close-circle-line'
                  "
                />
              </div>
              <div class="min-w-0">
                <div class="truncate text-sm font-medium text-g-900">
                  {{ item.username || '匿名访问' }} / {{ resolveEventLabel(item.event) }}
                </div>
                <div class="mt-1 text-xs leading-5 text-g-600">
                  {{ item.ip || '未知 IP' }} / {{ item.browser || 'Unknown' }}
                </div>
                <div class="mt-1 text-xs text-g-500">{{ formatDateTime(item.createdAt) }}</div>
              </div>
            </div>
            <EmptyState v-if="!overview?.recentLogins?.length" text="暂无登录事件" />
          </div>
        </ElScrollbar>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { TagProps } from 'element-plus'
  import { fetchMonitorOverview } from '@/api/monitor'
  import { formatDateTime } from '@/utils'
  import {
    getMonitorCacheStatusTagType,
    getMonitorCacheStatusText,
    MONITOR_COUNT_ANIMATION_DURATION,
    MONITOR_PROGRESS_TRANSITION,
    MONITOR_SCORE_ANIMATION_DURATION,
    getMonitorSecurityLabel,
    getMonitorSecurityTagType,
    getMonitorTrendWidth,
    resolveMonitorEventLabel
  } from './shared'

  defineOptions({ name: 'MonitorOverview' })

  interface StatusStripItem {
    label: string
    value: string
    tag: string
    tagType: TagProps['type']
  }

  const PanelHeader = defineComponent({
    props: {
      title: { type: String, required: true },
      description: { type: String, default: '' }
    },
    setup(props, { slots }) {
      return () =>
        h('div', { class: 'flex flex-wrap items-start justify-between gap-3' }, [
          h('div', { class: 'min-w-0' }, [
            h('h3', { class: 'text-lg font-semibold text-g-900' }, props.title),
            props.description
              ? h('p', { class: 'mt-1 text-sm leading-6 text-g-600' }, props.description)
              : null
          ]),
          slots.default
            ? h('div', { class: 'flex shrink-0 items-center gap-2' }, slots.default())
            : null
        ])
    }
  })

  const EmptyState = defineComponent({
    props: {
      text: { type: String, required: true }
    },
    setup(props) {
      return () =>
        h(
          'div',
          {
            class:
              'rounded-[var(--art-radius-surface-xs)] border border-dashed border-[var(--default-border-dashed)] bg-[var(--art-surface-bg-muted)] px-4 py-8 text-center text-sm text-g-500'
          },
          props.text
        )
    }
  })

  const MetricBar = defineComponent({
    props: {
      label: { type: String, required: true },
      value: { type: Number, required: true },
      width: { type: Number, required: true },
      tone: { type: String as PropType<'success' | 'danger' | 'primary'>, default: 'primary' }
    },
    setup(props) {
      const colorMap = {
        success: 'var(--art-success)',
        danger: 'var(--art-danger)',
        primary: 'var(--theme-color)'
      }

      return () =>
        h('div', [
          h('div', { class: 'mb-1 flex items-center justify-between text-xs text-g-500' }, [
            h('span', props.label),
            h('span', String(props.value))
          ]),
          h('div', { class: 'h-2 overflow-hidden rounded-full bg-[var(--default-bg-color)]' }, [
            h('div', {
              class: 'h-full rounded-full',
              style: {
                ...MONITOR_PROGRESS_TRANSITION,
                width: `${props.width}%`,
                background: colorMap[props.tone]
              }
            })
          ])
        ])
    }
  })

  const router = useRouter()
  const loading = ref(false)
  const overview = ref<Api.Monitor.OverviewResponse | null>(null)

  const sessionAvatarStyle = {
    background: 'color-mix(in srgb, var(--art-primary) 14%, transparent)',
    color: 'var(--art-primary)'
  }
  const successEventIconStyle = {
    background: 'color-mix(in srgb, var(--art-success) 16%, transparent)',
    color: 'var(--art-success)'
  }
  const dangerEventIconStyle = {
    background: 'color-mix(in srgb, var(--art-danger) 15%, transparent)',
    color: 'var(--art-danger)'
  }

  const loadOverview = async () => {
    loading.value = true
    try {
      overview.value = await fetchMonitorOverview()
    } finally {
      loading.value = false
    }
  }

  const statusStrip = computed<StatusStripItem[]>(() => [
    {
      label: '安全等级',
      value: `今日失败 ${overview.value?.summary.todayLoginFailCount ?? 0} 次`,
      tag: securityLabel.value,
      tagType: securityTagType.value
    },
    {
      label: '系统健康',
      value: overview.value?.systemResource.health.warnings?.[0] || '暂无资源告警',
      tag: systemHealthLabel.value,
      tagType: systemHealthTagType.value
    },
    {
      label: '缓存状态',
      value: overview.value?.cache.message || '等待缓存概览数据',
      tag: cacheStatusText.value,
      tagType: cacheTagType.value
    }
  ])

  const summaryCards = computed(() => {
    const summary = overview.value?.summary

    return [
      {
        label: '在线会话',
        value: summary?.activeSessionCount ?? 0,
        unit: '个',
        metaLabel: '空闲',
        metaValue: `${summary?.idleSessionCount ?? 0} 个`,
        extraLabel: '总会话',
        extraValue: `${summary?.totalSessionCount ?? 0} 个`,
        icon: 'ri:pulse-line',
        iconStyle: iconStyle('primary')
      },
      {
        label: '在线用户',
        value: summary?.uniqueOnlineUserCount ?? 0,
        unit: '人',
        metaLabel: '用户总量',
        metaValue: `${summary?.totalUsers ?? 0} 人`,
        extraLabel: '在线占比',
        extraValue:
          summary && summary.totalUsers > 0
            ? `${Math.round((summary.uniqueOnlineUserCount / summary.totalUsers) * 100)}%`
            : '0%',
        icon: 'ri:user-shared-line',
        iconStyle: iconStyle('success')
      },
      {
        label: '今日登录',
        value: (summary?.todayLoginSuccessCount ?? 0) + (summary?.todayLoginFailCount ?? 0),
        unit: '次',
        metaLabel: '成功',
        metaValue: `${summary?.todayLoginSuccessCount ?? 0} 次`,
        extraLabel: '失败',
        extraValue: `${summary?.todayLoginFailCount ?? 0} 次`,
        icon: 'ri:shield-check-line',
        iconStyle: iconStyle('warning')
      },
      {
        label: '运行配置',
        value: (summary?.enabledTaskCount ?? 0) + (summary?.systemParamCount ?? 0),
        unit: '项',
        metaLabel: '调度任务',
        metaValue: `${summary?.enabledTaskCount ?? 0} 项`,
        extraLabel: '系统参数',
        extraValue: `${summary?.systemParamCount ?? 0} 项`,
        icon: 'ri:settings-3-line',
        iconStyle: iconStyle('info')
      }
    ]
  })

  const securityLabel = computed(() =>
    getMonitorSecurityLabel(overview.value?.summary.securityLevel)
  )
  const securityTagType = computed(() =>
    getMonitorSecurityTagType(overview.value?.summary.securityLevel)
  )
  const cacheTagType = computed(() => getMonitorCacheStatusTagType(overview.value?.cache.status))
  const cacheStatusText = computed(() => getMonitorCacheStatusText(overview.value?.cache.status))

  const loginTrendSummary = computed(() => {
    const trend = overview.value?.loginTrend || []
    const success = trend.reduce((sum, item) => sum + item.successCount, 0)
    const fail = trend.reduce((sum, item) => sum + item.failCount, 0)
    const total = success + fail

    return {
      success,
      fail,
      successRate: total > 0 ? `${Math.round((success / total) * 100)}%` : '0%'
    }
  })

  const loginTrendTiles = computed(() => [
    { label: '累计成功', value: loginTrendSummary.value.success, hint: '近 7 日通过认证' },
    { label: '累计失败', value: loginTrendSummary.value.fail, hint: '建议关注异常峰值' },
    { label: '成功率', value: loginTrendSummary.value.successRate, hint: '成功 / 总尝试' }
  ])

  const systemHealthLabel = computed(() => {
    switch (overview.value?.systemResource.health.level) {
      case 'RISK':
        return '风险'
      case 'ATTENTION':
        return '关注'
      case 'GOOD':
        return '良好'
      default:
        return '待采样'
    }
  })

  const systemHealthTagType = computed(() => {
    switch (overview.value?.systemResource.health.level) {
      case 'RISK':
        return 'danger'
      case 'ATTENTION':
        return 'warning'
      case 'GOOD':
        return 'success'
      default:
        return 'info'
    }
  })

  const systemScoreNum = computed(() => overview.value?.systemResource.health.score ?? 0)

  const resourceCards = computed(() => {
    const resource = overview.value?.systemResource
    if (!resource) return []

    return [
      {
        label: 'CPU',
        value: formatPercent(resource.cpu.usagePercent),
        hint: `${resource.cpu.cores} 核 / 负载 ${resource.cpu.loadAverage?.[0] ?? '-'}`,
        barStyle: barStyle(resource.cpu.usagePercent, 'primary')
      },
      {
        label: '内存',
        value: formatPercent(resource.memory.usagePercent),
        hint: `${formatBytes(resource.memory.usedBytes)} / ${formatBytes(resource.memory.totalBytes)}`,
        barStyle: barStyle(resource.memory.usagePercent, 'success')
      },
      {
        label: '存储',
        value: formatPercent(resource.storage.usagePercent),
        hint: `${formatBytes(resource.storage.freeBytes)} 可用`,
        barStyle: barStyle(resource.storage.usagePercent, 'warning')
      },
      {
        label: '进程堆内存',
        value: formatPercent(
          (resource.process.heapUsedBytes / Math.max(resource.process.heapTotalBytes, 1)) * 100
        ),
        hint: `PID ${resource.process.pid}`,
        barStyle: barStyle(
          (resource.process.heapUsedBytes / Math.max(resource.process.heapTotalBytes, 1)) * 100,
          'info'
        )
      }
    ]
  })

  const primaryDisks = computed(
    () => overview.value?.systemResource.storage.disks.slice(0, 3) || []
  )

  const cacheMetrics = computed(() => {
    const cache = overview.value?.cache
    const connection = cache?.connection
    const metrics = cache?.metrics

    return [
      { label: '连接地址', value: connection?.urlConfigured ? '已配置' : '未配置' },
      { label: '数据库', value: connection?.database ?? '-' },
      { label: '命中率', value: metrics?.hitRate != null ? `${metrics.hitRate}%` : '-' },
      { label: 'Key 数量', value: metrics?.keyCount != null ? `${metrics.keyCount}` : '-' }
    ]
  })

  const cacheConnectionHint = computed(() =>
    overview.value?.cache.connection.urlConfigured ? '连接参数已配置' : '缺少连接配置'
  )

  const cacheNextStep = computed(() => {
    const cache = overview.value?.cache
    if (!cache) return '等待缓存概览数据返回后，将展示实例接入状态与后续操作建议。'

    if (cache.status === 'CONNECTED') {
      return '当前已经具备监控接入基础，建议优先核对命中率、热点 Key 和慢查询面板是否齐全。'
    }

    if (cache.status === 'PENDING_ACCESS') {
      return '连接信息已经准备，下一步可以补齐实例授权或探活逻辑，完成实时指标接入。'
    }

    if (cache.status === 'ERROR') {
      return '连接异常，建议先检查 Redis 地址、认证信息和网络连通性，再继续接入监控指标。'
    }

    return '当前尚未配置 Redis 连接，建议先补齐地址、库编号和超时时间，完成最小可用接入。'
  })

  const cacheUpdatedAt = computed(() => formatDateTime(overview.value?.cache.updatedAt) || '-')

  const getTrendWidth = (value: number) => getMonitorTrendWidth(overview.value?.loginTrend, value)
  const resolveEventLabel = (event: string) => resolveMonitorEventLabel(event)

  function iconStyle(tone: 'primary' | 'success' | 'warning' | 'info') {
    const colorMap = {
      primary: 'var(--art-primary)',
      success: 'var(--art-success)',
      warning: 'var(--art-warning)',
      info: 'var(--art-info)'
    }

    return {
      background: `color-mix(in srgb, ${colorMap[tone]} 14%, transparent)`,
      color: colorMap[tone]
    }
  }

  function barStyle(value: number, tone: 'primary' | 'success' | 'warning' | 'info') {
    const colorMap = {
      primary: 'var(--theme-color)',
      success: 'var(--art-success)',
      warning: 'var(--art-warning)',
      info: 'var(--art-info)'
    }

    return {
      ...MONITOR_PROGRESS_TRANSITION,
      width: `${clampPercent(value)}%`,
      background: colorMap[tone]
    }
  }

  function clampPercent(value?: number | null) {
    if (value == null || Number.isNaN(value)) return 0
    return Math.max(0, Math.min(100, Math.round(value)))
  }

  function formatPercent(value?: number | null) {
    if (value == null || Number.isNaN(value)) return '-'
    return `${Math.round(value)}%`
  }

  function formatBytes(bytes?: number | null) {
    if (bytes == null || Number.isNaN(bytes)) return '-'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let value = bytes
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex += 1
    }

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }

  onMounted(loadOverview)
</script>
