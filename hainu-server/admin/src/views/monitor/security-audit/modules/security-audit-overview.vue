<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article
      v-for="card in summaryCards"
      :key="card.label"
      class="art-surface-sm min-h-[158px] p-5"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="text-sm font-medium text-g-600">{{ card.label }}</div>
          <ArtCountTo
            class="mt-3 block truncate text-[1.75rem] font-medium leading-none text-g-900"
            :target="Number(card.value)"
            :duration="MONITOR_COUNT_ANIMATION_DURATION"
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
            :style="[MONITOR_PROGRESS_TRANSITION, { width: card.percent, background: card.barBg }]"
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
    <article class="art-surface-sm flex flex-col overflow-hidden p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-g-900">待处理风险分布</h3>
          <p class="mt-1 text-sm leading-6 text-g-600">
            按风险等级查看当前未关闭事件体量，优先处置严重与高危事件。
          </p>
        </div>
        <ElTag :type="overallTagType" effect="light">{{ overallLabel }}</ElTag>
      </div>

      <ElScrollbar class="mt-5" max-height="375px">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div
            class="min-h-full rounded-[var(--art-radius-surface)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-[22px] max-sm:p-[18px]"
          >
            <div class="flex items-start justify-between gap-4">
              <div
                class="inline-flex items-center justify-center rounded-[var(--art-radius-surface-xs)] text-[19px] size-10"
                :class="{
                  'bg-[color-mix(in_srgb,var(--art-danger)_11%,transparent)] text-[var(--art-danger)]':
                    riskToneClass === 'is-danger',
                  'bg-[color-mix(in_srgb,var(--art-warning)_12%,transparent)] text-[var(--art-warning)]':
                    riskToneClass === 'is-warning',
                  'bg-[color-mix(in_srgb,var(--art-success)_11%,transparent)] text-[var(--art-success)]':
                    riskToneClass === 'is-success'
                }"
              >
                <ArtSvgIcon :icon="riskSummary.icon" />
              </div>
              <span class="text-[13px] font-semibold text-g-500">待处理</span>
            </div>

            <div class="mt-8">
              <div class="flex items-end gap-2">
                <ArtCountTo
                  class="text-[38px] font-medium leading-[0.95] text-g-900"
                  :target="totalOpenCount"
                  :duration="MONITOR_SCORE_ANIMATION_DURATION"
                />
                <span class="mb-2 text-sm font-medium text-g-500">件未关闭</span>
              </div>
              <p class="mt-3 text-sm leading-6 text-g-600">{{ riskSummary.description }}</p>
            </div>

            <div class="mt-6">
              <div
                class="flex h-2.5 overflow-hidden rounded-full border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg)]"
                aria-hidden="true"
              >
                <div
                  v-for="item in severityCards"
                  :key="`stack-${item.severity}`"
                  class="min-w-0 h-full"
                  :style="{
                    ...MONITOR_SCORE_PROGRESS_TRANSITION,
                    width: `${getSeverityStackPercent(item.count)}%`,
                    background: getSeveritySolidColor(item.severity)
                  }"
                />
              </div>
              <div
                class="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-g-500"
              >
                <span>严重 {{ criticalCount }}</span>
                <span>高危 {{ highCount }}</span>
                <span>总量 {{ totalOpenCount }}</span>
              </div>
            </div>

            <div
              class="mt-6 flex items-center justify-between gap-3 border-t border-[var(--art-inner-surface-border)] pt-4"
            >
              <div>
                <span class="block text-xs text-g-500">优先处置</span>
                <strong class="mt-1 block text-sm font-semibold text-g-900">
                  {{ riskSummary.focusLabel }}
                </strong>
              </div>
              <ElTag :type="overallTagType" effect="light" size="small">{{ overallLabel }}</ElTag>
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div
                v-for="item in severityCards"
                :key="item.severity"
                class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
              >
                <span class="block text-xs leading-[1.4] text-g-500">
                  {{ getSeverityLabel(item.severity) }}
                </span>
                <strong
                  class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900"
                  >{{ item.count }}</strong
                >
              </div>
            </div>

            <div class="mt-5 flex flex-col gap-3">
              <div
                v-for="item in severityCards"
                :key="`bar-${item.severity}`"
                class="rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-3"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <ElTag :type="getSeverityTagType(item.severity)" effect="light" size="small">
                      {{ getSeverityLabel(item.severity) }}
                    </ElTag>
                  </div>
                  <span class="text-sm font-semibold text-g-900">{{ item.count }}</span>
                </div>
                <div class="mt-2 h-2 overflow-hidden rounded-full bg-[var(--art-surface-bg-muted)]">
                  <div
                    class="h-full rounded-[inherit]"
                    :style="{
                      ...MONITOR_PROGRESS_TRANSITION,
                      width: `${getSeverityPercent(item.count)}%`,
                      background: getSeverityBarBg(item.severity)
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </article>

    <article class="art-surface-sm flex flex-col overflow-hidden p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold text-g-900">高风险 IP</h3>
          <p class="mt-1 text-sm leading-6 text-g-600">短时间内重复触发事件的来源地址。</p>
        </div>
      </div>

      <ElScrollbar class="mt-5" max-height="375px">
        <div class="flex flex-col gap-3">
          <div
            v-for="item in overview?.topRiskIps || []"
            :key="`${item.ip}-${item.lastOccurredAt}`"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-semibold text-g-900">{{ item.ip || '未知 IP' }}</div>
              <ElTag type="danger" effect="light" size="small">风险 {{ item.maxRiskScore }}</ElTag>
            </div>
            <div class="mt-2 text-xs leading-6 text-g-600">
              {{ item.count }} 次关联 · {{ formatDateTime(item.lastOccurredAt) || '-' }}
            </div>
          </div>
          <div
            v-if="!(overview?.topRiskIps || []).length"
            class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-8 text-center"
          >
            <span class="block text-xs leading-[1.4] text-g-500">暂无高风险 IP</span>
          </div>
        </div>
      </ElScrollbar>
    </article>
  </section>

  <section v-if="overview?.recentEvents?.length" class="art-surface-sm p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-g-900">最近高风险事件</h3>
        <p class="mt-1 text-sm leading-6 text-g-600">
          优先查看高危和严重事件，快速确认是否需要处置。
        </p>
      </div>
      <ElTag effect="light" type="danger"> {{ overview.recentEvents.length }} 条 </ElTag>
    </div>

    <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
      <div v-for="item in overview.recentEvents" :key="item.id" class="art-surface-muted p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-g-900">{{ item.title }}</div>
            <div class="mt-1 text-xs text-g-600">
              {{ item.username || '系统' }} · {{ item.ip || '未知 IP' }} ·
              {{ formatDateTime(item.lastOccurredAt) }}
            </div>
          </div>
          <ElTag :type="getSeverityTagType(item.severity)" effect="light" size="small">
            {{ getSeverityLabel(item.severity) }}
          </ElTag>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-g-600">
          <ElTag :type="getStatusTagType(item.status)" effect="light" size="small">
            {{ getStatusLabel(item.status) }}
          </ElTag>
          <span>风险分 {{ item.riskScore }}</span>
          <span>累计 {{ item.occurrenceCount }} 次</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ElTag, ElScrollbar } from 'element-plus'
  import { formatDateTime } from '@/utils'
  import {
    MONITOR_COUNT_ANIMATION_DURATION,
    MONITOR_PROGRESS_TRANSITION,
    MONITOR_SCORE_ANIMATION_DURATION,
    MONITOR_SCORE_PROGRESS_TRANSITION
  } from '../../shared'

  type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

  interface SummaryCard {
    label: string
    value: string | number
    percent: string
    tipLabel: string
    tip: string
    icon: string
    iconStyle: { background: string; color: string }
    barBg: string
  }

  const props = defineProps<{
    overview: Api.Audit.SecurityAuditOverviewResponse | null
    summaryCards: SummaryCard[]
    severityCards: Array<{ severity: Api.Audit.SecurityAuditSeverity; count: number }>
    getSeverityTagType: (severity?: Api.Audit.SecurityAuditSeverity | null) => TagType
    getSeverityLabel: (severity?: Api.Audit.SecurityAuditSeverity | null) => string
    getStatusTagType: (status?: Api.Audit.SecurityAuditStatus | null) => TagType
    getStatusLabel: (status?: Api.Audit.SecurityAuditStatus | null) => string
  }>()

  const toneMap = {
    success: {
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-success) 88%, white), var(--art-success))'
    },
    warning: {
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-warning) 88%, white), var(--art-warning))'
    },
    danger: {
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-danger) 88%, white), var(--art-danger))'
    },
    primary: {
      bar: 'linear-gradient(90deg, color-mix(in srgb, var(--art-primary) 88%, white), var(--art-primary))'
    }
  }

  const totalOpenCount = computed(() =>
    props.severityCards.reduce((total, item) => total + item.count, 0)
  )

  const criticalCount = computed(
    () => props.severityCards.find((s) => s.severity === 'CRITICAL')?.count ?? 0
  )

  const highCount = computed(
    () => props.severityCards.find((s) => s.severity === 'HIGH')?.count ?? 0
  )

  const overallTagType = computed<TagType>(() => {
    if (criticalCount.value > 0) return 'danger'
    if (highCount.value > 0) return 'warning'
    return 'success'
  })

  const overallLabel = computed(() => {
    if (criticalCount.value > 0) return '存在严重风险'
    if (highCount.value > 0) return '需要关注'
    return '整体安全'
  })

  const riskToneClass = computed(() => `is-${overallTagType.value}`)

  const riskSummary = computed(() => {
    if (criticalCount.value > 0) {
      return {
        icon: 'ri:alarm-warning-line',
        focusLabel: '严重事件',
        description: '存在严重级别未关闭事件，建议立即确认影响范围并推进处置。'
      }
    }
    if (highCount.value > 0) {
      return {
        icon: 'ri:error-warning-line',
        focusLabel: '高危事件',
        description: '高危事件仍在待处理队列中，建议优先完成确认和闭环。'
      }
    }
    if (totalOpenCount.value > 0) {
      return {
        icon: 'ri:shield-check-line',
        focusLabel: '中低风险',
        description: '当前未关闭事件以中低风险为主，保持巡检节奏即可。'
      }
    }
    return {
      icon: 'ri:shield-check-line',
      focusLabel: '暂无积压',
      description: '当前没有未关闭审计事件，安全审计队列保持清爽。'
    }
  })

  function getSeverityPercent(count: number) {
    if (!totalOpenCount.value) return 0
    return Math.max(6, Math.round((count / totalOpenCount.value) * 100))
  }

  function getSeverityStackPercent(count: number) {
    if (!totalOpenCount.value || !count) return 0
    return Math.max(8, Math.round((count / totalOpenCount.value) * 100))
  }

  function getSeverityBarBg(severity: Api.Audit.SecurityAuditSeverity) {
    switch (severity) {
      case 'CRITICAL':
        return toneMap.danger.bar
      case 'HIGH':
        return toneMap.warning.bar
      case 'MEDIUM':
        return toneMap.primary.bar
      default:
        return toneMap.success.bar
    }
  }

  function getSeveritySolidColor(severity: Api.Audit.SecurityAuditSeverity) {
    switch (severity) {
      case 'CRITICAL':
        return 'var(--art-danger)'
      case 'HIGH':
        return 'var(--art-warning)'
      case 'MEDIUM':
        return 'var(--art-primary)'
      default:
        return 'var(--art-success)'
    }
  }
</script>
