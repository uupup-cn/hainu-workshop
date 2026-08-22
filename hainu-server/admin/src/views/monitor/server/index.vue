<template>
  <div class="server-monitor-page flex flex-col gap-4 pb-5">
    <ArtPageHero
      title="服务器监控"
      description="集中巡检主机、进程、网络与磁盘状态，把上线前最需要判断的稳定性信号收束到一屏。"
      content-class="max-w-3xl"
      right-class="flex flex-wrap items-center justify-start gap-3 xl:justify-end"
    >
      <template #right>
        <ElTag :type="healthTagType" effect="light" size="large">{{ healthLabel }}</ElTag>
        <div
          class="inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--art-radius-surface-xs)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] px-3 text-xs text-g-700 h-9"
        >
          <ArtSvgIcon icon="ri:time-line" class="size-3.5" />
          <span>{{ formatDateTime(data?.sampledAt) || '-' }}</span>
        </div>
        <ElButton :loading="loading" type="primary" @click="loadData">
          <template #icon>
            <ArtSvgIcon icon="ri:refresh-line" />
          </template>
          刷新监控
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

    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.label"
        class="art-surface-sm min-h-[158px] p-5 max-sm:p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-medium text-g-600">{{ card.label }}</div>
            <ArtCountTo
              class="mt-3 block truncate text-[28px] font-medium leading-none text-g-900"
              :target="card.num"
              :duration="MONITOR_COUNT_ANIMATION_DURATION"
              :suffix="card.suffix"
            />
          </div>
          <div
            class="inline-flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] text-xl size-[42px]"
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

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.38fr)_minmax(360px,0.92fr)]">
      <article class="art-surface-sm p-5 max-sm:p-4">
        <div class="grid gap-5 lg:grid-cols-[minmax(220px,0.42fr)_minmax(0,1fr)]">
          <div
            class="art-surface-muted flex min-h-[286px] flex-col justify-between p-5 max-lg:min-h-[240px] max-sm:p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div
                class="inline-flex items-center justify-center rounded-[var(--art-radius-surface-xs)] text-[21px] size-[42px]"
                :style="healthIconStyle"
              >
                <ArtSvgIcon icon="ri:pulse-line" />
              </div>
              <span class="text-xs font-semibold text-g-500">实时巡检</span>
            </div>

            <div class="mt-7">
              <ArtCountTo
                class="text-[42px] font-medium leading-none text-g-900 max-sm:text-[34px]"
                :target="healthScore"
                :duration="MONITOR_SCORE_ANIMATION_DURATION"
              />
              <span class="mt-2 block text-xs text-g-500">综合评分 / 100</span>
            </div>

            <div
              class="mt-7 h-2.5 overflow-hidden rounded-full border border-[var(--art-inner-surface-border)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--art-danger)_16%,transparent)_0%,color-mix(in_srgb,var(--art-warning)_16%,transparent)_62%,color-mix(in_srgb,var(--art-success)_16%,transparent)_100%),var(--art-surface-bg)]"
            >
              <div class="h-full rounded-[inherit]" :style="healthScoreBarStyle" />
            </div>

            <div class="mt-2.5 grid grid-cols-3 gap-2 text-xs text-g-500">
              <span>风险</span>
              <span class="text-center">关注</span>
              <span class="text-right">健康</span>
            </div>

            <p class="mt-[18px] text-[13px] leading-[1.6] text-g-700">
              {{ healthScoreNote }}
            </p>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-g-900">健康评分</h3>
                <p class="mt-1 text-sm leading-6 text-g-600">
                  结合 CPU、内存、磁盘、网络与运行时信号，生成当前实例的巡检结论。
                </p>
              </div>
              <ElTag :type="healthTagType" effect="light">{{ healthLabel }}</ElTag>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div
                v-for="item in healthInfoCards"
                :key="item.label"
                class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
              >
                <span class="block text-xs leading-[1.4] text-g-500">{{ item.label }}</span>
                <strong
                  class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900"
                  >{{ item.value }}</strong
                >
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div
                v-for="(warning, index) in warnings"
                :key="warning"
                class="art-surface-muted-xs flex min-h-[64px] items-center gap-2.5 px-4 py-3 text-[13px] leading-[1.55] text-g-700"
                :class="
                  warnings.length % 2 === 1 && index === warnings.length - 1 ? 'lg:col-span-2' : ''
                "
              >
                <ArtSvgIcon icon="ri:alarm-warning-line" class="shrink-0 text-sm leading-none" />
                <span class="min-w-0 [overflow-wrap:anywhere]">{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="art-surface-sm p-5 max-sm:p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">运行环境</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">定位实例、系统版本与进程运行状态。</p>
          </div>
          <div
            class="inline-flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-10 bg-[color-mix(in_srgb,var(--art-primary)_12%,transparent)] text-[var(--art-primary)]"
          >
            <ArtSvgIcon icon="ri:server-line" />
          </div>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="item in environmentItems"
            :key="item.label"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="block text-xs leading-[1.4] text-g-500">{{ item.label }}</span>
            <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
              item.value
            }}</strong>
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <article
        v-for="meter in resourceMeters"
        :key="meter.label"
        class="art-surface-sm min-h-[196px] p-5 max-sm:p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="truncate text-base font-semibold text-g-900">{{ meter.label }}</h3>
            <p class="mt-1 truncate text-sm text-g-500">{{ meter.description }}</p>
          </div>
          <ElTag :type="meter.tagType" effect="light">{{ meter.value }}</ElTag>
        </div>

        <div class="mt-4">
          <div class="flex min-w-0 items-baseline gap-2.5">
            <ArtCountTo
              class="inline-block shrink-0 text-[28px] font-medium leading-none text-g-900"
              :target="meter.num"
              :duration="MONITOR_COUNT_ANIMATION_DURATION"
              suffix="%"
            />
            <span class="inline-block min-w-0 truncate text-xs text-g-500">{{
              meter.caption
            }}</span>
          </div>
        </div>

        <div class="mt-4">
          <div class="h-2 overflow-hidden rounded-full bg-[var(--art-surface-bg-muted)]">
            <div
              class="h-full rounded-[inherit]"
              :style="[
                MONITOR_PROGRESS_TRANSITION,
                { width: meter.percent, background: meter.barBg }
              ]"
            />
          </div>
          <div class="mt-2.5 line-clamp-2 text-[13px] leading-[1.45] text-g-600">
            {{ meter.insight }}
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)]">
      <article class="art-surface-sm flex flex-col p-5 xl:h-[680px]">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">磁盘分区</h3>
            <p class="mt-1 text-sm leading-6 text-g-600"
              >按挂载点查看空间使用，优先暴露高风险分区。</p
            >
          </div>
          <ElTag :type="getUsageTagType(data?.storage.usagePercent)" effect="light">
            {{ `${data?.storage.usagePercent ?? 0}%` }}
          </ElTag>
        </div>

        <ElScrollbar class="mt-5 -mr-2 min-h-0 xl:flex-1" height="100%">
          <div class="flex flex-col gap-2.5 pr-2">
            <div
              v-for="disk in data?.storage.disks || []"
              :key="`${disk.filesystem}-${disk.mountpoint}`"
              class="art-surface-muted p-3.5"
            >
              <div class="flex flex-wrap items-start justify-between gap-2.5">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-g-900">{{ disk.mountpoint }}</div>
                  <div class="mt-0.5 truncate text-xs text-g-500">{{ disk.filesystem }}</div>
                </div>
                <div class="text-right text-sm leading-[1.35] text-g-700">
                  <div>{{ formatBytes(disk.usedBytes) }} / {{ formatBytes(disk.totalBytes) }}</div>
                  <div class="mt-0.5 text-xs text-g-500"
                    >可用 {{ formatBytes(disk.freeBytes) }}</div
                  >
                </div>
              </div>
              <div class="mt-3 flex items-center gap-3">
                <div
                  class="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--art-surface-bg-muted)]"
                >
                  <div
                    class="h-full rounded-[inherit]"
                    :style="{
                      ...MONITOR_PROGRESS_TRANSITION,
                      width: `${clampPercent(disk.usagePercent)}%`,
                      background: getDiskBarBg(disk.usagePercent)
                    }"
                  />
                </div>
                <strong class="w-12 text-right text-sm text-g-900">{{ disk.usagePercent }}%</strong>
              </div>
            </div>
          </div>
        </ElScrollbar>
      </article>

      <article class="art-surface-sm flex flex-col p-5 xl:h-[680px]">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">网络接口</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">展示地址、协议族、内外网与累计流量。</p>
          </div>
          <ElTag effect="light">{{ data?.network.upInterfaceCount ?? 0 }} Up</ElTag>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div
            v-for="item in networkStats"
            :key="item.label"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="block text-xs leading-[1.4] text-g-500">{{ item.label }}</span>
            <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
              item.value
            }}</strong>
          </div>
        </div>

        <ElScrollbar class="mt-5 -mr-2 min-h-0 xl:flex-1" height="100%">
          <div class="flex flex-col gap-3 pr-2">
            <div
              v-for="item in data?.network.interfaces || []"
              :key="item.name"
              class="art-surface-muted p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0 truncate text-sm font-semibold text-g-900">{{ item.name }}</div>
                <ElTag size="small" :type="item.internal ? 'info' : 'success'" effect="light">
                  {{ item.internal ? '内网' : '外网' }}
                </ElTag>
              </div>
              <div class="mt-2 truncate text-xs leading-6 text-g-600">
                {{ item.address || '未获取到地址' }} · {{ item.family }} ·
                {{ item.mac || '无 MAC' }}
              </div>
              <div class="mt-3 grid grid-cols-2 gap-3 text-xs text-g-600">
                <div>接收 {{ formatBytes(item.rxBytes) }}</div>
                <div>发送 {{ formatBytes(item.txBytes) }}</div>
              </div>
            </div>
          </div>
        </ElScrollbar>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { fetchSystemResourceMonitor } from '@/api/monitor'
  import { formatDateTime } from '@/utils'
  import {
    MONITOR_COUNT_ANIMATION_DURATION,
    MONITOR_PROGRESS_TRANSITION,
    MONITOR_SCORE_ANIMATION_DURATION,
    MONITOR_SCORE_PROGRESS_TRANSITION
  } from '../shared'

  defineOptions({ name: 'MonitorServer' })

  const loading = ref(false)
  const data = ref<Api.Monitor.SystemResourceOverview | null>(null)
  const loadAverageLabels = ['1 分钟', '5 分钟', '15 分钟']
  type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

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

  const loadData = async () => {
    loading.value = true
    try {
      data.value = await fetchSystemResourceMonitor()
    } finally {
      loading.value = false
    }
  }

  const clampPercent = (value?: number | null) => Math.min(100, Math.max(0, Number(value ?? 0)))

  const getUsageTone = (value?: number | null) => {
    const percent = clampPercent(value)
    if (percent >= 85) return toneMap.danger
    if (percent >= 70) return toneMap.warning
    return toneMap.success
  }

  const healthScore = computed(() => clampPercent(data.value?.health.score))

  const warnings = computed(() => {
    if (!data.value?.health.warnings.length) {
      return ['当前未发现明显资源风险，可继续关注峰值时段与磁盘增长趋势。']
    }
    return data.value.health.warnings
  })

  const healthTagType = computed(() => {
    switch (data.value?.health.level) {
      case 'GOOD':
        return 'success'
      case 'ATTENTION':
        return 'warning'
      default:
        return 'danger'
    }
  })

  const healthLabel = computed(() => {
    switch (data.value?.health.level) {
      case 'GOOD':
        return '健康良好'
      case 'ATTENTION':
        return '需要关注'
      default:
        return '存在风险'
    }
  })

  const healthTone = computed(() => {
    switch (data.value?.health.level) {
      case 'GOOD':
        return toneMap.success
      case 'ATTENTION':
        return toneMap.warning
      default:
        return toneMap.danger
    }
  })

  const healthIconStyle = computed(() => ({
    color: healthTone.value.color,
    background: healthTone.value.soft
  }))

  const healthScoreBarStyle = computed(() => ({
    ...MONITOR_SCORE_PROGRESS_TRANSITION,
    width: `${healthScore.value}%`,
    background: healthTone.value.bar
  }))

  const healthScoreNote = computed(() => {
    if (healthScore.value >= 85) return '资源表现稳定，可维持当前巡检频率。'
    if (healthScore.value >= 65) return '存在局部压力，建议关注峰值窗口和增长趋势。'
    return '风险项已拉低评分，建议优先处理告警列表中的资源瓶颈。'
  })

  const heroStats = computed(() => [
    { label: '主机', value: data.value?.hostname || '-' },
    { label: '平台', value: data.value?.platform || '-' },
    { label: '系统运行', value: formatDuration(data.value?.uptimeSeconds) },
    { label: '进程 PID', value: data.value?.process.pid ? `#${data.value.process.pid}` : '-' }
  ])

  const summaryCards = computed(() => [
    {
      label: 'CPU 使用率',
      num: data.value?.cpu.usagePercent ?? 0,
      suffix: '%',
      percent: `${clampPercent(data.value?.cpu.usagePercent)}%`,
      tipLabel: `${data.value?.cpu.cores ?? 0} 核`,
      tip: data.value?.cpu.model || '-',
      icon: 'ri:cpu-line',
      iconStyle: { background: toneMap.primary.soft, color: toneMap.primary.color },
      barBg: toneMap.primary.bar
    },
    {
      label: '内存占用',
      num: data.value?.memory.usagePercent ?? 0,
      suffix: '%',
      percent: `${clampPercent(data.value?.memory.usagePercent)}%`,
      tipLabel: '可用内存',
      tip: formatBytes(data.value?.memory.freeBytes),
      icon: 'ri:stack-line',
      iconStyle: { background: toneMap.warning.soft, color: toneMap.warning.color },
      barBg: toneMap.warning.bar
    },
    {
      label: '磁盘占用',
      num: data.value?.storage.usagePercent ?? 0,
      suffix: '%',
      percent: `${clampPercent(data.value?.storage.usagePercent)}%`,
      tipLabel: '总容量',
      tip: formatBytes(data.value?.storage.totalBytes),
      icon: 'ri:hard-drive-3-line',
      iconStyle: { background: toneMap.secondary.soft, color: toneMap.secondary.color },
      barBg: toneMap.secondary.bar
    },
    {
      label: '网络接口',
      num: data.value?.network.upInterfaceCount ?? 0,
      suffix: '',
      percent: `${
        data.value?.network.interfaceCount
          ? clampPercent(
              (data.value.network.upInterfaceCount / data.value.network.interfaceCount) * 100
            )
          : 0
      }%`,
      tipLabel: '外部地址',
      tip: `${data.value?.network.publicIpv4.length ?? 0} 个`,
      icon: 'ri:radar-line',
      iconStyle: { background: toneMap.success.soft, color: toneMap.success.color },
      barBg: toneMap.success.bar
    }
  ])

  const environmentItems = computed(() => [
    { label: '主机名', value: data.value?.hostname || '-' },
    {
      label: '平台版本',
      value: [data.value?.platform, data.value?.release].filter(Boolean).join(' / ') || '-'
    },
    { label: '系统架构', value: data.value?.arch || '-' },
    { label: 'Node 版本', value: data.value?.nodeVersion || '-' },
    { label: '系统运行时长', value: formatDuration(data.value?.uptimeSeconds) },
    { label: '进程运行时长', value: formatDuration(data.value?.process.uptimeSeconds) }
  ])

  const healthInfoCards = computed(() => [
    { label: '健康等级', value: healthLabel.value },
    { label: '告警数量', value: `${data.value?.health.warnings.length ?? 0} 条` },
    { label: '采样时间', value: formatDateTime(data.value?.sampledAt) || '-' }
  ])

  const cpuInsight = computed(() => {
    const usage = data.value?.cpu.usagePercent ?? 0
    if (usage >= 85) return 'CPU 占用偏高，建议结合负载均值排查热点请求。'
    if (usage >= 60) return 'CPU 处于中高位运行区间，继续观察峰值时段。'
    return 'CPU 负载整体平稳，当前没有明显计算压力。'
  })

  const memoryInsight = computed(() => {
    const usage = data.value?.memory.usagePercent ?? 0
    if (usage >= 85) return '内存接近风险阈值，优先检查缓存、长连接和堆增长。'
    if (usage >= 65) return '内存处于关注区间，建议结合 Node RSS 继续跟踪。'
    return '整机内存与进程内存稳定，仍有承载余量。'
  })

  const storageInsight = computed(() => {
    const usage = data.value?.storage.usagePercent ?? 0
    const diskCount = data.value?.storage.disks?.length ?? 0
    if (usage >= 85) return '磁盘整体占用偏高，优先排查日志、上传文件与临时目录。'
    if (diskCount <= 1) return '分区数量较少，建议重点关注单分区容量变化。'
    return '磁盘容量分布相对均衡，继续关注高使用率挂载点。'
  })

  const processInsight = computed(() => {
    const heapUsed = data.value?.process.heapUsedBytes ?? 0
    const heapTotal = data.value?.process.heapTotalBytes ?? 0
    const usage = heapTotal > 0 ? (heapUsed / heapTotal) * 100 : 0
    if (usage >= 80) return 'Node 堆使用率偏高，建议关注内存释放与大对象缓存。'
    if (usage >= 60) return 'Node 堆处于观察区间，可结合业务峰值继续跟踪。'
    return 'Node 进程内存状态平稳，当前堆空间压力较小。'
  })

  const resourceMeters = computed(() => {
    const cpuTone = getUsageTone(data.value?.cpu.usagePercent)
    const memoryTone = getUsageTone(data.value?.memory.usagePercent)
    const storageTone = getUsageTone(data.value?.storage.usagePercent)
    const heapPercent =
      data.value?.process.heapTotalBytes && data.value.process.heapTotalBytes > 0
        ? (data.value.process.heapUsedBytes / data.value.process.heapTotalBytes) * 100
        : 0
    const processTone = getUsageTone(heapPercent)

    return [
      {
        label: 'CPU',
        description: `负载均值 ${formatLoadAverage(data.value?.cpu.loadAverage)}`,
        value: `${data.value?.cpu.usagePercent ?? 0}%`,
        num: data.value?.cpu.usagePercent ?? 0,
        percent: `${clampPercent(data.value?.cpu.usagePercent)}%`,
        caption: `${data.value?.cpu.cores ?? 0} 核心`,
        insight: cpuInsight.value,
        barBg: cpuTone.bar,
        tagType: getUsageTagType(data.value?.cpu.usagePercent)
      },
      {
        label: '内存',
        description: `已用 ${formatBytes(data.value?.memory.usedBytes)}`,
        value: `${data.value?.memory.usagePercent ?? 0}%`,
        num: data.value?.memory.usagePercent ?? 0,
        percent: `${clampPercent(data.value?.memory.usagePercent)}%`,
        caption: `总计 ${formatBytes(data.value?.memory.totalBytes)}`,
        insight: memoryInsight.value,
        barBg: memoryTone.bar,
        tagType: getUsageTagType(data.value?.memory.usagePercent)
      },
      {
        label: '磁盘',
        description: `${data.value?.storage.disks?.length ?? 0} 个分区`,
        value: `${data.value?.storage.usagePercent ?? 0}%`,
        num: data.value?.storage.usagePercent ?? 0,
        percent: `${clampPercent(data.value?.storage.usagePercent)}%`,
        caption: `可用 ${formatBytes(data.value?.storage.freeBytes)}`,
        insight: storageInsight.value,
        barBg: storageTone.bar,
        tagType: getUsageTagType(data.value?.storage.usagePercent)
      },
      {
        label: 'Node 进程',
        description: `RSS ${formatBytes(data.value?.process.rssBytes)}`,
        value: `${Math.round(heapPercent)}%`,
        num: Math.round(heapPercent),
        percent: `${clampPercent(heapPercent)}%`,
        caption: `堆 ${formatBytes(data.value?.process.heapUsedBytes)}`,
        insight: processInsight.value,
        barBg: processTone.bar,
        tagType: getUsageTagType(heapPercent)
      }
    ]
  })

  const networkStats = computed(() => [
    { label: '网卡数量', value: `${data.value?.network.interfaceCount ?? 0}` },
    { label: '外部地址', value: `${data.value?.network.publicIpv4.length ?? 0}` },
    { label: '累计接收', value: formatBytes(data.value?.network.totalRxBytes) },
    { label: '累计发送', value: formatBytes(data.value?.network.totalTxBytes) }
  ])

  const getUsageTagType = (value?: number | null): TagType => {
    if ((value ?? 0) >= 85) return 'danger'
    if ((value ?? 0) >= 70) return 'warning'
    return 'success'
  }

  const getDiskBarBg = (value: number) => getUsageTone(value).bar

  const formatLoadAverage = (values?: number[]) => {
    if (!values?.length) return '-'
    return values.map((item, index) => `${loadAverageLabels[index]} ${item}`).join(' / ')
  }

  const formatBytes = (value?: number | null) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '-'
    if (value <= 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = value
    let index = 0

    while (size >= 1024 && index < units.length - 1) {
      size /= 1024
      index += 1
    }

    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'

    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days} 天 ${hours} 小时`
    if (hours > 0) return `${hours} 小时 ${minutes} 分钟`
    return `${minutes} 分钟`
  }

  onMounted(loadData)
</script>
