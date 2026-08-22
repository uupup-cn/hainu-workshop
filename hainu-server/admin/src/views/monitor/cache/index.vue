<template>
  <div class="cache-monitor-page flex flex-col gap-4 pb-5">
    <ArtPageHero
      title="缓存监控"
      :description="heroDescription"
      content-class="max-w-3xl"
      right-class="flex flex-wrap items-center justify-start gap-3 xl:justify-end"
    >
      <template #right>
        <ElTag :type="statusTagType" effect="light" size="large">{{ statusText }}</ElTag>
        <ElButton
          v-auth="'refresh'"
          :loading="loading"
          :disabled="cacheInfo?.actions.canRefresh === false"
          type="primary"
          @click="refreshCacheState"
        >
          <template #icon>
            <ArtSvgIcon icon="ri:refresh-line" />
          </template>
          刷新状态
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
              v-if="card.num !== null"
              class="mt-3 block truncate text-3xl font-semibold leading-none text-g-900"
              :target="card.num"
              :duration="MONITOR_COUNT_ANIMATION_DURATION"
              :suffix="card.suffix"
            />
            <div v-else class="mt-3 truncate text-3xl font-semibold leading-none text-g-900">
              —
            </div>
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
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-g-900">连接与指标</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">
              读取 Redis 连接配置、运行指标与当前业务缓存状态。
            </p>
          </div>
          <ElTag :type="statusTagType" effect="light">{{ statusText }}</ElTag>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in connectionItems"
            :key="item.label"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="block text-xs leading-[1.4] text-g-500">{{ item.label }}</span>
            <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
              item.value
            }}</strong>
          </div>
        </div>

        <div v-if="isConnected" class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div
            v-for="warning in insights"
            :key="warning"
            class="art-surface-muted-xs flex min-h-[46px] items-center gap-2.5 px-3.5 py-2.5 text-[13px] leading-[1.5] text-g-700"
          >
            <ArtSvgIcon icon="ri:lightbulb-line" class="shrink-0 text-[var(--art-primary)]" />
            <span>{{ warning }}</span>
          </div>
        </div>
      </article>

      <article class="art-surface-sm p-5 max-sm:p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">状态阶段</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">{{ cacheInfo?.message }}</p>
          </div>
          <div
            class="inline-flex shrink-0 items-center justify-center rounded-[var(--art-radius-surface-xs)] size-10 bg-[color-mix(in_srgb,var(--art-warning)_12%,transparent)] text-[var(--art-warning)]"
          >
            <ArtSvgIcon icon="ri:database-2-line" />
          </div>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="item in statusItems"
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

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)]">
      <article class="art-surface-sm p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">业务缓存命名空间</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">
              只允许清理受控业务缓存，避免误删登录态、验证码、限流与分布式锁等运行数据。
            </p>
          </div>
          <ElTag effect="light" :type="cacheInfo?.actions.canClear ? 'success' : 'info'">
            {{ cacheInfo?.actions.canClear ? '可清理' : '只读' }}
          </ElTag>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div v-for="item in namespaceCards" :key="item.key" class="art-surface-muted p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-start gap-3">
                <div
                  class="flex shrink-0 items-center justify-center rounded-full text-base size-9"
                  :style="{ background: item.iconBg, color: item.iconColor }"
                >
                  <ArtSvgIcon :icon="item.icon" />
                </div>
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-g-900">{{ item.label }}</div>
                  <div class="mt-1 text-xs leading-5 text-g-600">{{ item.description }}</div>
                </div>
              </div>
              <ElButton
                v-auth="'refresh'"
                class="shrink-0"
                size="small"
                plain
                :loading="clearingNamespace === item.key"
                :disabled="!cacheInfo?.actions.canClear"
                @click="clearNamespace(item)"
              >
                清理
              </ElButton>
            </div>
          </div>
        </div>

        <div
          v-if="!namespaceCards.length"
          class="mt-5 rounded-[var(--art-radius-surface-xs)] border border-dashed border-[var(--art-inner-surface-border)] px-4 py-8 text-center text-sm text-g-500"
        >
          暂无可管理的业务缓存命名空间
        </div>
      </article>

      <article class="art-surface-sm p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-g-900">运行诊断</h3>
            <p class="mt-1 text-sm leading-6 text-g-600">
              根据 Redis 连接状态和实时指标给出排查重点。
            </p>
          </div>
          <ElTag effect="light" :type="diagnosticTone">{{ diagnostics.length }} 项</ElTag>
        </div>

        <div class="mt-5 flex flex-col gap-3">
          <div v-for="item in diagnostics" :key="item.title" class="art-surface-muted p-4">
            <div class="flex items-start gap-3">
              <div
                class="flex shrink-0 items-center justify-center rounded-full text-base size-9"
                :style="{ background: item.iconBg, color: item.iconColor }"
              >
                <ArtSvgIcon :icon="item.icon" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-g-900">{{ item.title }}</div>
                <div class="mt-1 text-xs leading-5 text-g-600">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    fetchCacheMonitor,
    fetchClearCacheNamespace,
    fetchRefreshCacheMonitor
  } from '@/api/monitor'
  import { formatDateTime } from '@/utils'
  import {
    MONITOR_COUNT_ANIMATION_DURATION,
    MONITOR_PROGRESS_TRANSITION,
    getMonitorCacheStatusTagType,
    getMonitorCacheStatusText
  } from '../shared'

  defineOptions({ name: 'CacheMonitor' })

  const loading = ref(false)
  const clearingNamespace = ref('')
  const cacheInfo = ref<Api.Monitor.CacheOverview | null>(null)

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
    info: {
      color: 'var(--art-info)',
      soft: 'color-mix(in srgb, var(--art-info) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-info) 88%, white), var(--art-info))'
    },
    danger: {
      color: 'var(--art-danger)',
      soft: 'color-mix(in srgb, var(--art-danger) 14%, transparent)',
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-danger) 88%, white), var(--art-danger))'
    }
  }

  const namespaceMeta: Record<
    string,
    { icon: string; iconBg: string; iconColor: string; description: string }
  > = {
    'site-settings': {
      icon: 'ri:settings-3-line',
      iconBg: toneMap.primary.soft,
      iconColor: toneMap.primary.color,
      description: '登录页、站点名称、主题配置等公开站点缓存。'
    },
    menus: {
      icon: 'ri:menu-search-line',
      iconBg: toneMap.secondary.soft,
      iconColor: toneMap.secondary.color,
      description: '菜单树、当前用户菜单和前端按钮权限缓存。'
    },
    'api-permissions': {
      icon: 'ri:shield-keyhole-line',
      iconBg: toneMap.warning.soft,
      iconColor: toneMap.warning.color,
      description: '角色接口权限缓存，适合权限调整后主动刷新。'
    },
    'system-params': {
      icon: 'ri:list-settings-line',
      iconBg: toneMap.success.soft,
      iconColor: toneMap.success.color,
      description: '系统参数解析结果缓存，参数修改后可按需清理。'
    },
    dicts: {
      icon: 'ri:book-2-line',
      iconBg: toneMap.info.soft,
      iconColor: toneMap.info.color,
      description: '字典类型和字典数据缓存，适合字典维护后刷新。'
    }
  }

  const loadCacheInfo = async () => {
    loading.value = true
    try {
      cacheInfo.value = await fetchCacheMonitor()
    } finally {
      loading.value = false
    }
  }

  const refreshCacheState = async () => {
    await fetchRefreshCacheMonitor()
    ElMessage.info('缓存状态已刷新')
    await loadCacheInfo()
  }

  const isConnected = computed(() => cacheInfo.value?.status === 'CONNECTED')

  const statusTagType = computed(() => getMonitorCacheStatusTagType(cacheInfo.value?.status))
  const statusText = computed(() => getMonitorCacheStatusText(cacheInfo.value?.status))

  const heroDescription = computed(() => {
    if (isConnected.value)
      return 'Redis 已作为生产增强能力启用，页面展示实时指标并支持受控业务缓存清理。'
    return 'Redis 是可选增强能力；未配置时系统仍可运行，配置后自动启用缓存、限流和在线状态增强。'
  })

  const heroStats = computed(() => [
    { label: '引擎', value: cacheInfo.value?.engine || 'Redis' },
    { label: '状态', value: statusText.value },
    { label: 'Key 数量', value: cacheInfo.value?.metrics.keyCount ?? '—' },
    { label: '内存', value: cacheInfo.value?.metrics.memoryUsed || '—' }
  ])

  const clampPercent = (value?: number | null) => Math.min(100, Math.max(0, Number(value ?? 0)))

  const summaryCards = computed(() => {
    const hitRate = cacheInfo.value?.metrics.hitRate ?? 0
    const keyCount = cacheInfo.value?.metrics.keyCount ?? 0
    const clients = cacheInfo.value?.metrics.connectedClients ?? 0
    const opsPerSec = cacheInfo.value?.metrics.opsPerSec ?? 0

    return [
      {
        label: '命中率',
        num: isConnected.value ? hitRate : null,
        suffix: '%',
        percent: `${clampPercent(hitRate)}%`,
        tipLabel: '缓存效率',
        tip: hitRate >= 90 ? '优秀' : hitRate >= 70 ? '良好' : hitRate > 0 ? '需优化' : '待接入',
        icon: 'ri:focus-3-line',
        iconStyle: { background: toneMap.primary.soft, color: toneMap.primary.color },
        barBg: toneMap.primary.bar
      },
      {
        label: 'Key 数量',
        num: isConnected.value ? keyCount : null,
        suffix: '',
        percent: `${clampPercent(Math.min(keyCount / 100, 100))}%`,
        tipLabel: '键空间',
        tip: isConnected.value ? `${keyCount} 个活跃键` : '待接入',
        icon: 'ri:key-2-line',
        iconStyle: { background: toneMap.secondary.soft, color: toneMap.secondary.color },
        barBg: toneMap.secondary.bar
      },
      {
        label: 'Ops/s',
        num: isConnected.value ? opsPerSec : null,
        suffix: '',
        percent: `${clampPercent(Math.min(opsPerSec / 1000, 100) * 100)}%`,
        tipLabel: '吞吐量',
        tip: isConnected.value ? `每秒 ${opsPerSec} 次操作` : '待接入',
        icon: 'ri:speed-line',
        iconStyle: { background: toneMap.warning.soft, color: toneMap.warning.color },
        barBg: toneMap.warning.bar
      },
      {
        label: '客户端连接',
        num: isConnected.value ? clients : null,
        suffix: '',
        percent: `${clampPercent(Math.min(clients / 50, 1) * 100)}%`,
        tipLabel: '活跃连接',
        tip: isConnected.value ? `${clients} 个客户端` : '待接入',
        icon: 'ri:link',
        iconStyle: { background: toneMap.success.soft, color: toneMap.success.color },
        barBg: toneMap.success.bar
      }
    ]
  })

  const connectionItems = computed(() => [
    { label: '连接地址', value: cacheInfo.value?.connection.urlConfigured ? '已配置' : '未配置' },
    { label: 'Key 前缀', value: cacheInfo.value?.connection.keyPrefix || '未设置' },
    { label: '数据库', value: cacheInfo.value?.connection.database ?? '—' },
    {
      label: '超时时间',
      value: cacheInfo.value?.connection.timeoutMs
        ? `${cacheInfo.value.connection.timeoutMs}ms`
        : '—'
    },
    { label: '内存使用', value: cacheInfo.value?.metrics.memoryUsed || '—' },
    {
      label: '每秒操作',
      value:
        cacheInfo.value?.metrics.opsPerSec != null
          ? `${cacheInfo.value.metrics.opsPerSec} ops/s`
          : '—'
    }
  ])

  const insights = computed(() => {
    const items: string[] = []
    const hitRate = cacheInfo.value?.metrics.hitRate ?? 0
    const keyCount = cacheInfo.value?.metrics.keyCount ?? 0

    if (hitRate >= 90) items.push('命中率优秀，缓存策略运行良好。')
    else if (hitRate >= 70) items.push('命中率良好，可关注热点 Key 分布进一步优化。')
    else if (hitRate > 0) items.push('命中率偏低，建议排查缓存穿透与过期策略。')

    if (keyCount > 10000) items.push('Key 数量较多，建议定期清理过期键与大 Key。')
    else if (keyCount > 0) items.push('键空间规模适中，继续关注增长趋势。')

    if (!items.length) items.push('缓存运行平稳，当前无明显风险信号。')
    return items
  })

  const statusHeadline = computed(() => {
    if (isConnected.value) return { title: 'Redis 已进入实时监控阶段', badge: '实时阶段' }
    if (cacheInfo.value?.status === 'PENDING_ACCESS')
      return { title: '连接信息已准备，等待实例接入', badge: '待接入' }
    if (cacheInfo.value?.status === 'ERROR')
      return { title: '连接异常，建议先修复接入链路', badge: '需排障' }
    return { title: '当前仍处于产品预置阶段', badge: '预置阶段' }
  })

  const statusItems = computed(() => [
    { label: '当前阶段', value: statusHeadline.value.badge },
    { label: '引擎类型', value: cacheInfo.value?.engine || 'Redis' },
    { label: '更新时间', value: formatDateTime(cacheInfo.value?.updatedAt) || '—' },
    {
      label: '建议动作',
      value:
        cacheInfo.value?.status === 'ERROR'
          ? '检查连接'
          : isConnected.value
            ? '持续观测'
            : '接入实例'
    }
  ])

  const namespaceCards = computed(() =>
    (cacheInfo.value?.manageableNamespaces || []).map((item) => ({
      ...item,
      ...(namespaceMeta[item.key] || {
        icon: 'ri:database-2-line',
        iconBg: toneMap.primary.soft,
        iconColor: toneMap.primary.color,
        description: '受控业务缓存命名空间。'
      })
    }))
  )

  const diagnostics = computed(() => {
    const status = cacheInfo.value?.status
    const hitRate = cacheInfo.value?.metrics.hitRate ?? 0
    const keyCount = cacheInfo.value?.metrics.keyCount ?? 0
    const clients = cacheInfo.value?.metrics.connectedClients ?? 0
    const opsPerSec = cacheInfo.value?.metrics.opsPerSec ?? 0
    const items: Array<{
      title: string
      description: string
      icon: string
      iconBg: string
      iconColor: string
    }> = []

    if (status === 'ERROR') {
      items.push({
        title: '连接异常',
        description: cacheInfo.value?.message || '请检查 REDIS_URL、密码、网络和安全组配置。',
        icon: 'ri:error-warning-line',
        iconBg: toneMap.danger.soft,
        iconColor: toneMap.danger.color
      })
      return items
    }

    if (status === 'NOT_CONFIGURED') {
      items.push({
        title: 'Redis 未配置',
        description: '当前环境未配置 REDIS_URL，系统会使用数据库和内存兜底能力继续运行。',
        icon: 'ri:information-line',
        iconBg: toneMap.info.soft,
        iconColor: toneMap.info.color
      })
      items.push({
        title: '生产增强建议',
        description: '生产环境建议启用 Redis，以获得跨实例限流、在线状态、验证码和核心缓存能力。',
        icon: 'ri:rocket-line',
        iconBg: toneMap.primary.soft,
        iconColor: toneMap.primary.color
      })
      return items
    }

    items.push({
      title: hitRate >= 70 || hitRate === 0 ? '命中率状态正常' : '命中率偏低',
      description:
        hitRate >= 70 || hitRate === 0
          ? '当前命中率没有明显异常，继续观察业务访问高峰即可。'
          : '建议检查系统参数、字典、菜单权限等缓存是否频繁失效。',
      icon: hitRate >= 70 || hitRate === 0 ? 'ri:checkbox-circle-line' : 'ri:pulse-line',
      iconBg: hitRate >= 70 || hitRate === 0 ? toneMap.success.soft : toneMap.warning.soft,
      iconColor: hitRate >= 70 || hitRate === 0 ? toneMap.success.color : toneMap.warning.color
    })

    items.push({
      title: keyCount > 10000 ? 'Key 数量较高' : 'Key 空间可控',
      description:
        keyCount > 10000
          ? '建议关注过期策略和业务缓存前缀，必要时按命名空间清理。'
          : `当前 ${keyCount} 个 Key，规模仍处于可控范围。`,
      icon: 'ri:key-2-line',
      iconBg: keyCount > 10000 ? toneMap.warning.soft : toneMap.secondary.soft,
      iconColor: keyCount > 10000 ? toneMap.warning.color : toneMap.secondary.color
    })

    items.push({
      title: '连接与吞吐',
      description: `${clients} 个客户端连接，当前每秒约 ${opsPerSec} 次操作。`,
      icon: 'ri:exchange-line',
      iconBg: toneMap.info.soft,
      iconColor: toneMap.info.color
    })

    return items
  })

  const diagnosticTone = computed(() => {
    if (cacheInfo.value?.status === 'ERROR') return 'danger'
    if (cacheInfo.value?.status === 'NOT_CONFIGURED') return 'info'
    return 'success'
  })

  const clearNamespace = async (item: { key: string; label: string }) => {
    try {
      await ElMessageBox.confirm(
        `确认清理“${item.label}”缓存吗？系统只会删除该业务命名空间下的缓存。`,
        '清理缓存',
        {
          confirmButtonText: '清理',
          cancelButtonText: '取消',
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        }
      )
    } catch {
      return
    }

    clearingNamespace.value = item.key
    try {
      const result = await fetchClearCacheNamespace(item.key)
      ElMessage.success(
        `已清理“${result.label || item.label}”缓存，删除 ${result.deletedKeys} 个 Key`
      )
      await loadCacheInfo()
    } finally {
      clearingNamespace.value = ''
    }
  }

  onMounted(loadCacheInfo)
</script>
