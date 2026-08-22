<template>
  <div
    v-loading="loading"
    class="flex flex-col gap-5"
    :class="isFocusMode ? 'art-full-height' : 'mb-5'"
  >
    <section
      v-if="!isFocusMode"
      class="overflow-hidden art-card-sm border border-[var(--default-border)] bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(56,189,248,0.03)_42%,transparent_72%)] px-5 py-5 sm:px-6"
    >
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-4xl">
          <h1 class="text-2xl font-semibold tracking-tight text-g-900">用户统计</h1>
          <p class="mt-3 text-sm leading-7 text-g-600">
            面向共享账号场景，以
            IP、设备、浏览器、访问时间、活跃路径等信号近似识别独立访问者，输出趋势、画像与异常提示，帮助运营在上线前建立可持续的用户洞察能力。
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div
            class="rounded-full border border-[var(--default-border)] bg-box px-4 py-2 text-sm text-g-700"
          >
            最近聚合
            <span class="ml-2 font-semibold text-g-900">{{ formatDateTime(snapshotAt) }}</span>
          </div>
          <div
            class="rounded-full border border-[var(--default-border)] bg-box px-4 py-2 text-sm text-g-700"
          >
            识别规则
            <span class="ml-2 font-semibold text-g-900">IP + UA + 时间窗 + 行为序列</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!isFocusMode" class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="art-card-sm relative overflow-hidden px-5 py-5"
      >
        <span class="absolute inset-y-0 left-0 w-[3px]"></span>
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-[13px] font-medium text-g-700">{{ card.title }}</div>
            <div class="mt-3 text-[28px] font-semibold tracking-tight text-g-900">{{
              card.value
            }}</div>
            <div class="mt-2 text-xs text-g-500">{{ card.desc }}</div>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-[8px] text-lg"
            :style="{ background: card.iconBg, color: card.iconColor }"
          >
            <ArtSvgIcon :icon="card.icon" />
          </div>
        </div>
        <div
          v-if="card.meta"
          class="mt-4 grid grid-cols-2 overflow-hidden rounded-custom-sm border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)]"
        >
          <div
            v-for="item in card.meta"
            :key="item.label"
            class="border-r border-[var(--art-inner-surface-border)] px-3 py-2 last:border-r-0"
          >
            <div class="text-[11px] text-g-500">{{ item.label }}</div>
            <div class="mt-1 text-sm font-semibold text-g-900">{{ item.value }}</div>
          </div>
        </div>
        <div class="mt-4 text-[13px]">
          <span class="font-semibold" :class="card.changeClass">{{ card.change }}</span>
          <span class="ml-2 text-g-600">{{ card.tip }}</span>
        </div>
      </article>
    </section>

    <section
      v-if="!isFocusMode"
      class="visitor-analytics-row visitor-analytics-row--engine grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.35fr)_380px]"
    >
      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header
          class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 class="text-[18px] font-semibold text-g-900">近 7 日访问趋势</h2>
            <p class="mt-1 text-sm text-g-600"
              >同时观察访问次数、识别访客数与高置信度访客占比，判断共享账号的实际覆盖规模。</p
            >
          </div>
          <div class="inline-flex rounded-[8px] bg-g-100 p-1">
            <button
              v-for="tab in trendTabs"
              :key="tab.key"
              class="c-p rounded-custom-sm px-4 py-1 text-sm font-medium tad-200"
              :class="
                activeTrendTab === tab.key
                  ? 'bg-theme text-white shadow-sm'
                  : 'text-g-600 hover:text-g-900'
              "
              @click="activeTrendTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </header>

        <div class="visitor-trend-body px-4 pb-3 pt-4 sm:px-5">
          <div class="mb-4 flex flex-wrap items-center gap-4 text-[13px] font-medium text-g-700">
            <span class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-primary"></span>
              访问次数
            </span>
            <span class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-secondary"></span>
              识别访客
            </span>
            <span class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-success"></span>
              高置信度
            </span>
          </div>
          <ArtLineChart
            class="visitor-chart"
            height="100%"
            :data="trendChartData"
            :xAxisData="trendLabels"
            :showLegend="false"
            symbol="circle"
            :symbolSize="7"
          />
        </div>

        <footer
          class="visitor-card-footer grid grid-cols-1 border-t border-[var(--default-border)] md:grid-cols-3"
        >
          <div
            v-for="metric in trendFooterMetrics"
            :key="metric.label"
            class="border-b border-[var(--default-border)] px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div class="text-sm text-g-600">{{ metric.label }}</div>
            <div class="mt-1 text-[24px] font-semibold text-g-900">{{ metric.value }}</div>
            <div class="mt-1 text-xs text-g-500">{{ metric.tip }}</div>
          </div>
        </footer>
      </article>

      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d px-5 py-4">
          <h2 class="text-[18px] font-semibold text-g-900">识别引擎说明</h2>
          <p class="mt-1 text-sm text-g-600"
            >解释当前“疑似独立访客”识别口径，便于运营理解和校准。</p
          >
        </header>

        <ElScrollbar class="visitor-card-scroll">
          <div class="space-y-4 px-5 py-5">
            <div v-for="rule in identityRules" :key="rule.title" class="art-surface-muted p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-semibold text-g-900">{{ rule.title }}</div>
                <div class="text-sm font-semibold text-g-900">{{ rule.weight }}</div>
              </div>
              <div class="mt-2 text-sm leading-6 text-g-600">{{ rule.desc }}</div>
            </div>

            <div class="art-surface-sm p-4">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-g-900">置信度分层</span>
                <span class="text-xs text-g-500">建议用于运营打标</span>
              </div>
              <div class="mt-4 space-y-3">
                <div v-for="bucket in confidenceBuckets" :key="bucket.label">
                  <div class="mb-1 flex items-center justify-between text-xs text-g-600">
                    <span>{{ bucket.label }}</span>
                    <span>{{ bucket.count }} 人</span>
                  </div>
                  <ElProgress
                    :stroke-width="8"
                    :percentage="bucket.percent"
                    :color="bucket.color"
                    :show-text="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </ElScrollbar>
      </article>
    </section>

    <section
      v-if="!isFocusMode"
      class="visitor-analytics-row visitor-analytics-row--profile grid grid-cols-1 gap-5 xl:grid-cols-3"
    >
      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d flex items-center justify-between px-5 py-4">
          <h3 class="text-[18px] font-semibold text-g-900">设备画像</h3>
          <span class="text-sm text-g-600">按会话归因</span>
        </header>
        <div class="visitor-chart-body px-4 py-4">
          <ArtRingChart
            class="visitor-chart"
            height="100%"
            :data="deviceDistribution"
            :radius="['58%', '72%']"
            :borderRadius="0"
            centerText="设备"
            :showLegend="false"
          />
        </div>
        <div class="visitor-card-footer grid grid-cols-3 border-t border-[var(--default-border)]">
          <div
            v-for="item in deviceStats"
            :key="item.name"
            class="border-r border-[var(--default-border)] px-4 py-4 text-center last:border-r-0"
          >
            <div class="text-[20px] font-semibold text-g-900">{{ item.value }}</div>
            <div class="mt-1 text-sm text-g-600">{{ item.name }}</div>
          </div>
        </div>
      </article>

      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d flex items-center justify-between px-5 py-4">
          <h3 class="text-[18px] font-semibold text-g-900">浏览器分布</h3>
          <span class="text-sm text-g-600">兼容性判断</span>
        </header>
        <ElScrollbar class="visitor-card-scroll">
          <div class="space-y-3 px-5 py-5">
            <div v-for="item in browserBreakdown" :key="item.name" class="art-surface-muted p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-[8px] text-base"
                    :style="{ background: item.iconBg, color: item.iconColor }"
                  >
                    <ArtSvgIcon :icon="item.icon" />
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-g-900">{{ item.name }}</div>
                    <div class="mt-1 text-xs text-g-500">{{ item.note }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold text-g-900">{{ item.count }}</div>
                  <div class="mt-1 text-xs text-g-500">{{ item.percent }}%</div>
                </div>
              </div>
              <ElProgress
                class="mt-3"
                :stroke-width="8"
                :percentage="item.percent"
                :show-text="false"
                :color="item.barColor"
              />
            </div>
          </div>
        </ElScrollbar>
      </article>

      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d flex items-center justify-between px-5 py-4">
          <h3 class="text-[18px] font-semibold text-g-900">高活跃时段</h3>
          <span class="text-sm text-g-600">北京时间</span>
        </header>
        <div class="visitor-chart-body px-4 pb-4 pt-4 sm:px-5">
          <ArtBarChart
            class="visitor-chart"
            height="100%"
            :data="hourlyActivityValues"
            :xAxisData="hourlyActivityLabels"
            :showLegend="false"
            :showTooltip="true"
            :showSplitLine="true"
            barWidth="36%"
          />
        </div>
      </article>
    </section>

    <section
      v-if="!isFocusMode"
      class="visitor-analytics-row visitor-analytics-row--risk grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
    >
      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d flex items-center justify-between px-5 py-4">
          <div>
            <h3 class="text-[18px] font-semibold text-g-900">共享账号复用排行</h3>
            <p class="mt-1 text-sm text-g-600"
              >识别被多个疑似访客共同使用的账号，优先观察账号授权与运营归因。</p
            >
          </div>
        </header>
        <ElScrollbar class="visitor-card-scroll">
          <div class="space-y-3 px-5 py-5">
            <div
              v-for="item in sharedAccountRanking"
              :key="item.account"
              class="art-surface-muted p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="text-sm font-semibold text-g-900">{{ item.account }}</div>
                  <div class="mt-1 text-xs text-g-500">
                    {{ item.visitors }} 个疑似访客 · {{ item.sessions }} 次会话
                  </div>
                </div>
                <ElTag :type="item.tagType" effect="light">{{ item.label }}</ElTag>
              </div>
              <ElProgress
                class="mt-3"
                :stroke-width="8"
                :percentage="item.percent"
                :show-text="false"
                :color="item.color"
              />
            </div>
          </div>
        </ElScrollbar>
      </article>

      <article class="art-card-sm visitor-fixed-card overflow-hidden">
        <header class="border-b-d flex items-center justify-between px-5 py-4">
          <div>
            <h3 class="text-[18px] font-semibold text-g-900">异常提示</h3>
            <p class="mt-1 text-sm text-g-600">识别潜在异常共享、夜间高频和跨区域切换行为。</p>
          </div>
        </header>
        <ElScrollbar class="visitor-card-scroll">
          <div class="space-y-3 px-5 py-5">
            <div v-for="alert in anomalyAlerts" :key="alert.title" class="art-surface-muted p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-sm font-semibold text-g-900">{{ alert.title }}</div>
                  <div class="mt-2 text-sm leading-6 text-g-600">{{ alert.desc }}</div>
                </div>
                <ElTag :type="alert.type" effect="light">{{ alert.level }}</ElTag>
              </div>
            </div>
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

    <ElCard class="visitor-analytics-table-card art-table-card mt-0! card-p0" shadow="never">
      <div
        v-if="!isFocusMode"
        class="flex flex-col gap-3 border-b border-[var(--art-inner-surface-border)] pb-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h3 class="text-[18px] font-semibold text-g-900">疑似访客明细</h3>
          <p class="mt-1 text-sm text-g-600"
            >查看识别结果、归属账号、风险等级与访问特征，支持运营进一步打标。</p
          >
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <ElTag type="info" effect="light">共 {{ totalVisitors }} 人</ElTag>
          <ElTag type="success" effect="light">业务 {{ summary.businessVisitorCount }} 人</ElTag>
          <ElTag type="warning" effect="light">演示 {{ summary.demoVisitorCount }} 人</ElTag>
          <ElTag type="primary" effect="light">高风险 {{ highRiskCount }} 人</ElTag>
        </div>
      </div>

      <ArtTableHeader
        v-model:columns="columnChecks"
        full-class="visitor-analytics-table-card"
        :class="{ 'pt-4': !isFocusMode }"
        :loading="loading"
        :data="currentRecords"
        data-output-title="疑似访客明细"
        export-file-name="疑似访客明细"
        @refresh="loadData"
      >
        <template #left>
          <div v-if="isFocusMode" class="flex flex-wrap items-center gap-2">
            <ElTag type="info" effect="light">共 {{ totalVisitors }} 人</ElTag>
            <ElTag type="success" effect="light">业务 {{ summary.businessVisitorCount }} 人</ElTag>
            <ElTag type="warning" effect="light">演示 {{ summary.demoVisitorCount }} 人</ElTag>
            <ElTag type="primary" effect="light">高风险 {{ highRiskCount }} 人</ElTag>
          </div>
        </template>
        <template #right>
          <ArtFocusModeButton :active="isFocusMode" @click="toggleFocusMode" />
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="currentRecords"
        :columns="columns"
        :pagination="tablePagination"
        row-key="id"
        empty-text="暂无符合条件的访客数据"
        empty-height="360px"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #visitorInfo="{ row }">
          <button class="flex items-center gap-3 text-left c-p" @click="openDetail(row)">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-theme/10 text-sm font-semibold text-theme"
            >
              {{ row.alias.slice(0, 2) }}
            </div>
            <div class="min-w-0">
              <div class="truncate font-medium text-g-900">{{ row.alias }}</div>
              <div class="mt-1 truncate text-[13px] text-g-500">{{ row.signature }}</div>
            </div>
          </button>
        </template>

        <template #account="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-g-900">{{ row.account }}</span>
            <ElTag v-if="row.isDemoAccount" type="info" effect="light" size="small">演示</ElTag>
          </div>
          <div class="mt-1 text-[12px] text-g-500">{{ row.sessionCount }} 次会话</div>
        </template>

        <template #source="{ row }">
          <div class="text-sm text-g-900">{{ row.ip }}</div>
          <div class="mt-1 text-[12px] text-g-500">{{ row.location }}</div>
        </template>

        <template #device="{ row }">
          <div class="text-sm text-g-900">{{ row.deviceLabel }} / {{ row.browser }}</div>
          <div class="mt-1 text-[12px] text-g-500">{{ row.os }}</div>
        </template>

        <template #confidence="{ row }">
          <div class="font-semibold text-g-900">{{ row.confidence }}%</div>
          <div class="mt-1 text-[12px]" :class="getConfidenceClass(row.confidence)">
            {{ getConfidenceLabel(row.confidence) }}
          </div>
        </template>

        <template #riskLevel="{ row }">
          <ElTag :type="getRiskTagType(row.riskLevel)" effect="light">
            {{ getRiskLabel(row.riskLevel) }}
          </ElTag>
        </template>

        <template #operation="{ row }">
          <ArtButtonTable type="view" @click="openDetail(row)" />
        </template>
      </ArtTable>
    </ElCard>

    <ElDrawer v-model="detailVisible" title="访客画像详情" :size="detailDrawerSize">
      <template v-if="activeVisitor">
        <div class="space-y-4">
          <section class="art-surface-sm p-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-full bg-theme/10 text-lg font-semibold text-theme"
                >
                  {{ activeVisitor.alias.slice(0, 2) }}
                </div>
                <div>
                  <div class="text-lg font-semibold text-g-900">{{ activeVisitor.alias }}</div>
                  <div class="mt-1 text-sm text-g-600">{{ activeVisitor.signature }}</div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <ElTag :type="getRiskTagType(activeVisitor.riskLevel)" effect="light">
                  {{ getRiskLabel(activeVisitor.riskLevel) }}
                </ElTag>
                <ElTag type="primary" effect="light">
                  置信度 {{ activeVisitor.confidence }}%
                </ElTag>
              </div>
            </div>
          </section>

          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="归属账号">
              <span>{{ activeVisitor.account }}</span>
              <ElTag
                v-if="activeVisitor.isDemoAccount"
                class="ml-2"
                type="info"
                effect="light"
                size="small"
              >
                公开演示
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="疑似访客类型">{{
              activeVisitor.visitorType
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="来源 IP">{{ activeVisitor.ip }}</ElDescriptionsItem>
            <ElDescriptionsItem label="来源地区">{{ activeVisitor.location }}</ElDescriptionsItem>
            <ElDescriptionsItem label="设备类型">{{
              activeVisitor.deviceLabel
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="浏览器">{{ activeVisitor.browser }}</ElDescriptionsItem>
            <ElDescriptionsItem label="操作系统">{{ activeVisitor.os }}</ElDescriptionsItem>
            <ElDescriptionsItem label="首访时间">{{
              formatDateTime(activeVisitor.firstVisitAt)
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="最近访问">{{
              formatDateTime(activeVisitor.lastVisitAt)
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="会话数">{{ activeVisitor.sessionCount }}</ElDescriptionsItem>
            <ElDescriptionsItem label="访问页面数">{{
              activeVisitor.pageViewCount
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="平均停留">{{
              activeVisitor.avgDuration
            }}</ElDescriptionsItem>
            <ElDescriptionsItem label="常访问模块" :span="2">
              {{ activeVisitor.topPaths.join(' / ') }}
            </ElDescriptionsItem>
          </ElDescriptions>

          <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article class="art-surface-sm p-5">
              <div class="text-base font-semibold text-g-900">识别依据</div>
              <div class="mt-4 space-y-3">
                <div
                  v-for="signal in activeVisitor.signals"
                  :key="signal.label"
                  class="art-surface-muted p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-medium text-g-900">{{ signal.label }}</span>
                    <span class="text-sm font-semibold text-g-900">{{ signal.score }} 分</span>
                  </div>
                  <div class="mt-1 text-xs leading-6 text-g-600">{{ signal.desc }}</div>
                </div>
              </div>
            </article>

            <article class="art-surface-sm p-5">
              <div class="text-base font-semibold text-g-900">运营建议</div>
              <ul class="mt-4 space-y-3 text-sm leading-7 text-g-600">
                <li v-for="item in activeVisitor.suggestions" :key="item">{{ item }}</li>
              </ul>
            </article>
          </section>
        </div>
      </template>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import ArtLineChart from '@/components/core/charts/art-line-chart/index.vue'
  import ArtRingChart from '@/components/core/charts/art-ring-chart/index.vue'
  import { fetchVisitorAnalytics } from '@/api/monitor'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import type { LineDataItem } from '@/types/component/chart'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'VisitorAnalytics' })

  type RiskLevel = Api.Monitor.VisitorAnalyticsRiskLevel
  type DeviceType = Api.Monitor.VisitorAnalyticsDeviceType
  type VisitorType = Api.Monitor.VisitorAnalyticsVisitorType
  type TrendTab = '7d' | '14d'
  type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

  type VisitorProfile = Api.Monitor.VisitorAnalyticsRecord

  const { isFocusMode, toggleFocusMode } = usePageFocusMode('system.visitorAnalytics')
  const { width } = useWindowSize()
  const detailDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '760px'
  })

  const loading = ref(false)
  const analyticsData = ref<Api.Monitor.VisitorAnalyticsResponse | null>(null)
  const activeTrendTab = ref<TrendTab>('7d')
  const detailVisible = ref(false)
  const activeVisitor = ref<VisitorProfile | null>(null)

  const pagination = reactive({
    current: 1,
    size: 20
  })

  const searchForm = ref({
    keyword: '',
    riskLevel: '',
    deviceType: '',
    visitorType: ''
  })

  const { columns, columnChecks } = useTableColumns<VisitorProfile>(() => [
    {
      prop: 'visitorInfo',
      label: '访客画像',
      minWidth: 220,
      fixed: 'left',
      useSlot: true,
      mobile: { primary: true }
    },
    {
      prop: 'account',
      label: '归属账号',
      minWidth: 150,
      useSlot: true,
      mobile: { secondary: true }
    },
    {
      prop: 'source',
      label: '来源信息',
      minWidth: 170,
      useSlot: true
    },
    {
      prop: 'device',
      label: '设备 / 浏览器',
      minWidth: 180,
      useSlot: true
    },
    {
      prop: 'confidence',
      label: '置信度',
      minWidth: 120,
      useSlot: true
    },
    {
      prop: 'riskLevel',
      label: '风险等级',
      minWidth: 120,
      useSlot: true
    },
    {
      prop: 'lastVisitAt',
      label: '最近访问',
      minWidth: 170,
      formatter: (row) => formatDateTime(row.lastVisitAt)
    },
    {
      prop: 'operation',
      label: '操作',
      width: 110,
      fixed: 'right',
      align: 'center',
      useSlot: true,
      mobile: { action: true }
    }
  ])

  /**
   * 构建访客分析搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '访客别名 / 账号 / IP / 地区' }
    },
    {
      label: '风险等级',
      key: 'riskLevel',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择风险等级',
        options: [
          { label: '低风险', value: 'LOW' },
          { label: '中风险', value: 'MEDIUM' },
          { label: '高风险', value: 'HIGH' }
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
          { label: '桌面端', value: 'desktop' },
          { label: '移动端', value: 'mobile' },
          { label: '平板', value: 'tablet' }
        ]
      }
    },
    {
      label: '访客类型',
      key: 'visitorType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择访客类型',
        options: [
          { label: '稳定办公访客', value: '稳定办公访客' },
          { label: '移动巡检访客', value: '移动巡检访客' },
          { label: '夜间活跃访客', value: '夜间活跃访客' },
          { label: '高频切换访客', value: '高频切换访客' }
        ]
      }
    }
  ])

  const trendTabs = [
    { key: '7d', label: '近 7 天' },
    { key: '14d', label: '近 14 天' }
  ] as const

  /**
   * 获取当前统计快照时间，数据未加载时回退为当前时间。
   */
  const snapshotAt = computed(() => analyticsData.value?.snapshotAt || new Date().toISOString())

  /**
   * 归一化接口汇总数据，避免空数据导致页面展示异常。
   */
  const summary = computed(() => ({
    visitorCount: analyticsData.value?.summary.visitorCount || 0,
    businessVisitorCount: analyticsData.value?.summary.businessVisitorCount || 0,
    demoVisitorCount: analyticsData.value?.summary.demoVisitorCount || 0,
    lifetimeVisitorCount: analyticsData.value?.summary.lifetimeVisitorCount || 0,
    lifetimeDemoVisitorCount: analyticsData.value?.summary.lifetimeDemoVisitorCount || 0,
    totalSessions: analyticsData.value?.summary.totalSessions || 0,
    totalPageViews: analyticsData.value?.summary.totalPageViews || 0,
    highRisk: analyticsData.value?.summary.highRiskCount || 0,
    highConfidence: analyticsData.value?.summary.highConfidenceCount || 0,
    averageConfidence: analyticsData.value?.summary.averageConfidence || 0,
    accountReuseRate: analyticsData.value?.summary.accountReuseRate || 0
  }))

  /**
   * 构建顶部核心指标卡片。
   */
  const summaryCards = computed(() => [
    {
      title: '发布以来演示访客',
      value: formatNumber(summary.value.lifetimeDemoVisitorCount),
      desc: '历史去重估算，非自然人',
      change: '长期累计',
      tip: '用于判断公开演示入口的真实触达规模',
      changeClass: 'text-success',
      icon: 'ri:group-2-line',
      iconBg: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
      iconColor: 'var(--color-primary)',
      meta: [
        { label: '全站指纹', value: `${formatNumber(summary.value.lifetimeVisitorCount)} 人` },
        { label: '当前演示', value: `${formatNumber(summary.value.demoVisitorCount)} 人` }
      ]
    },
    {
      title: '演示账号访客',
      value: formatNumber(summary.value.demoVisitorCount),
      desc: '当前窗口内的演示访客画像',
      change: '已隔离',
      tip: '不参与业务账号复用与风险均值',
      changeClass: 'text-primary',
      icon: 'ri:shield-user-line',
      iconBg: 'color-mix(in srgb, var(--color-secondary) 14%, transparent)',
      iconColor: 'var(--color-secondary)',
      meta: [
        { label: '业务访客', value: `${formatNumber(summary.value.businessVisitorCount)} 人` },
        { label: '复用率', value: `${summary.value.accountReuseRate}x` }
      ]
    },
    {
      title: '高风险画像',
      value: formatNumber(summary.value.highRisk),
      desc: '跨区域切换、夜间高频或多端突变访客',
      change: '重点复核',
      tip: '建议优先运营与安全协同排查',
      changeClass: 'text-danger',
      icon: 'ri:alarm-warning-line',
      iconBg: 'color-mix(in srgb, var(--color-danger) 14%, transparent)',
      iconColor: 'var(--color-danger)',
      meta: [
        { label: '业务访客', value: `${formatNumber(summary.value.businessVisitorCount)} 人` },
        { label: '高风险', value: `${formatNumber(summary.value.highRisk)} 人` }
      ]
    },
    {
      title: '平均识别置信度',
      value: `${summary.value.averageConfidence}%`,
      desc: '当前样本中识别准确度的整体参考值',
      change: '实时校准',
      tip: '后续可继续叠加更细粒度埋点提升精度',
      changeClass: 'text-success',
      icon: 'ri:fingerprint-line',
      iconBg: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
      iconColor: 'var(--color-success)',
      meta: [
        { label: '高置信度', value: `${formatNumber(summary.value.highConfidence)} 人` },
        { label: '当前识别', value: `${formatNumber(summary.value.visitorCount)} 人` }
      ]
    }
  ])

  /**
   * 当前趋势数据源。
   */
  const trendSource = computed(() => analyticsData.value?.trends)

  /**
   * 当前趋势图横轴标签。
   */
  const trendLabels = computed(() => trendSource.value?.[activeTrendTab.value]?.labels || [])

  /**
   * 当前趋势图折线数据。
   */
  const trendChartData = computed<LineDataItem[]>(() => [
    {
      name: '访问次数',
      data: [...(trendSource.value?.[activeTrendTab.value]?.visits || [])]
    },
    {
      name: '识别访客',
      data: [...(trendSource.value?.[activeTrendTab.value]?.visitors || [])]
    },
    {
      name: '高置信度',
      data: [...(trendSource.value?.[activeTrendTab.value]?.trusted || [])]
    }
  ])

  /**
   * 计算趋势图底部辅助指标。
   */
  const trendFooterMetrics = computed(() => {
    const current = trendSource.value?.[activeTrendTab.value]
    if (!current || current.labels.length === 0) {
      return [
        { label: '峰值访问', value: '0 次', tip: '暂无趋势数据' },
        { label: '峰值识别访客', value: '0 人', tip: '暂无趋势数据' },
        { label: '高置信度占比', value: '0%', tip: '暂无趋势数据' }
      ]
    }
    const lastIndex = current.labels.length - 1
    const trustedRate =
      current.visitors[lastIndex] > 0
        ? Math.round((current.trusted[lastIndex] / current.visitors[lastIndex]) * 100)
        : 0

    return [
      {
        label: '峰值访问',
        value: `${Math.max(...current.visits)} 次`,
        tip: `${current.labels[lastIndex]} 为当前峰值日`
      },
      {
        label: '峰值识别访客',
        value: `${Math.max(...current.visitors)} 人`,
        tip: '帮助评估共享账号真实覆盖规模'
      },
      {
        label: '高置信度占比',
        value: `${trustedRate}%`,
        tip: '高于 80% 表示规则稳定度较好'
      }
    ]
  })

  /**
   * 访客识别规则说明列表。
   */
  const identityRules = computed(() => analyticsData.value?.identityRules || [])

  /**
   * 识别置信度分桶数据。
   */
  const confidenceBuckets = computed(() => analyticsData.value?.confidenceBuckets || [])

  /**
   * 设备分布原始数据。
   */
  const deviceDistribution = computed(() => analyticsData.value?.deviceDistribution || [])

  /**
   * 转换为图表组件需要的设备统计格式。
   */
  const deviceStats = computed(() =>
    deviceDistribution.value.map((item) => ({
      name: item.name,
      value: item.value
    }))
  )

  /**
   * 浏览器分布数据。
   */
  const browserBreakdown = computed(() => analyticsData.value?.browserBreakdown || [])

  /**
   * 小时活跃度横轴标签。
   */
  const hourlyActivityLabels = computed(() => analyticsData.value?.hourlyActivity.labels || [])

  /**
   * 小时活跃度数值。
   */
  const hourlyActivityValues = computed(() => analyticsData.value?.hourlyActivity.values || [])

  /**
   * 共享账号风险排行。
   */
  const sharedAccountRanking = computed(() => analyticsData.value?.sharedAccountRanking || [])
  const anomalyAlerts = computed<
    Array<{ title: string; desc: string; level: string; type: TagType }>
  >(() => analyticsData.value?.anomalyAlerts || [])
  /**
   * 当前页访客画像列表。
   */
  const currentRecords = computed(() => analyticsData.value?.records.records || [])

  /**
   * 当前筛选条件下的访客总数。
   */
  const totalVisitors = computed(() => analyticsData.value?.records.total || 0)

  /**
   * ArtTable 内置分页需要的分页数据。
   */
  const tablePagination = computed(() => ({
    current: pagination.current,
    size: pagination.size,
    total: totalVisitors.value
  }))

  /**
   * 高风险访客数量。
   */
  const highRiskCount = computed(() => analyticsData.value?.summary.highRiskCount || 0)

  // 加载访客统计数据
  async function loadData() {
    loading.value = true
    try {
      analyticsData.value = await fetchVisitorAnalytics({
        current: pagination.current,
        size: pagination.size,
        keyword: searchForm.value.keyword || undefined,
        riskLevel: (searchForm.value.riskLevel || undefined) as RiskLevel | undefined,
        deviceType: (searchForm.value.deviceType || undefined) as DeviceType | undefined,
        visitorType: (searchForm.value.visitorType || undefined) as VisitorType | undefined
      })
    } finally {
      loading.value = false
    }
  }

  // 提交筛选条件并刷新列表
  function handleSearch() {
    pagination.current = 1
    loadData()
  }

  // 重置筛选条件并重新查询
  function handleReset() {
    searchForm.value = {
      keyword: '',
      riskLevel: '',
      deviceType: '',
      visitorType: ''
    }
    pagination.current = 1
    loadData()
  }

  // 打开访客画像详情
  function openDetail(row: VisitorProfile) {
    activeVisitor.value = row
    detailVisible.value = true
  }

  // 切换每页条数后重新加载数据
  function handleSizeChange(size: number) {
    pagination.size = size
    pagination.current = 1
    loadData()
  }

  // 翻页后重新加载数据
  function handleCurrentChange(current: number) {
    pagination.current = current
    loadData()
  }

  // 获取风险等级文案
  function getRiskLabel(level: RiskLevel) {
    const map: Record<RiskLevel, string> = {
      LOW: '低风险',
      MEDIUM: '中风险',
      HIGH: '高风险'
    }

    return map[level]
  }

  // 获取风险等级标签类型
  function getRiskTagType(level: RiskLevel) {
    const map: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'danger'
    }

    return map[level]
  }

  // 获取置信度分层文案
  function getConfidenceLabel(confidence: number) {
    if (confidence >= 80) return '高可信'
    if (confidence >= 60) return '中可信'
    return '待校准'
  }

  // 获取置信度对应样式
  function getConfidenceClass(confidence: number) {
    if (confidence >= 80) return 'text-success'
    if (confidence >= 60) return 'text-warning'
    return 'text-danger'
  }

  // 格式化数字显示
  function formatNumber(value: number) {
    return new Intl.NumberFormat('zh-CN').format(value || 0)
  }

  onMounted(() => {
    loadData()
  })
</script>

<style scoped lang="scss">
  .visitor-analytics-row {
    align-items: stretch;
  }

  .visitor-analytics-row--engine {
    --visitor-row-height: 620px;
  }

  .visitor-analytics-row--profile {
    --visitor-row-height: 430px;
  }

  .visitor-analytics-row--risk {
    --visitor-row-height: 432px;
  }

  .visitor-fixed-card {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .visitor-analytics-row > .visitor-fixed-card {
    height: var(--visitor-row-height);
  }

  .visitor-fixed-card > header,
  .visitor-card-footer {
    flex-shrink: 0;
  }

  .visitor-card-scroll {
    flex: 1;
    min-height: 0;
  }

  .visitor-card-scroll :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }

  .visitor-trend-body,
  .visitor-chart-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }

  .visitor-chart {
    flex: 1;
    min-height: 0;
  }

  @media (width <= 1279px) {
    .visitor-analytics-row > .visitor-fixed-card {
      height: auto;
    }

    .visitor-card-scroll {
      max-height: var(--visitor-row-height);
    }

    .visitor-trend-body {
      min-height: 360px;
    }

    .visitor-chart-body {
      min-height: 300px;
    }
  }

  @media (width <= 767px) {
    .visitor-card-scroll {
      max-height: 360px;
    }
  }
</style>
