<template>
  <div class="monitor-overview-page">
    <!-- 顶部操作栏 -->
    <ElCard shadow="never" class="monitor-overview-page__header">
      <div class="monitor-overview-page__header-inner">
        <div class="monitor-overview-page__title">
          <h2 class="monitor-overview-page__title-text">监控总览</h2>
          <p class="monitor-overview-page__title-desc">
            聚合会话、登录、安全、资源与缓存状态，为管理端提供开站前后的稳定性巡检视图。
          </p>
          <div class="monitor-overview-page__title-meta">
            生成时间：{{ formatDateTime(overview?.summary?.generatedAt) }}
          </div>
        </div>
        <div class="monitor-overview-page__header-actions">
          <ElButton :loading="loading" plain @click="loadOverview">刷新</ElButton>
        </div>
      </div>
    </ElCard>

    <!-- 顶部统计卡片 -->
    <ElRow :gutter="16" class="monitor-overview-page__summary">
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="summary-card">
          <div class="summary-card__label">在线会话</div>
          <div class="summary-card__value">{{ overview?.summary?.activeSessionCount ?? 0 }}</div>
          <div class="summary-card__sub">
            空闲 {{ overview?.summary?.idleSessionCount ?? 0 }} / 总会话
            {{ overview?.summary?.totalSessionCount ?? 0 }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="summary-card">
          <div class="summary-card__label">在线用户</div>
          <div class="summary-card__value">{{ overview?.summary?.uniqueOnlineUserCount ?? 0 }}</div>
          <div class="summary-card__sub">
            用户总量 {{ overview?.summary?.totalUsers ?? 0 }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="summary-card">
          <div class="summary-card__label">今日登录</div>
          <div class="summary-card__value">
            {{ (overview?.summary?.todayLoginSuccessCount ?? 0) + (overview?.summary?.todayLoginFailCount ?? 0) }}
          </div>
          <div class="summary-card__sub">
            成功 {{ overview?.summary?.todayLoginSuccessCount ?? 0 }} / 失败
            {{ overview?.summary?.todayLoginFailCount ?? 0 }}
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="summary-card">
          <div class="summary-card__label">待处理</div>
          <div class="summary-card__value">{{ pendingTotal }}</div>
          <div class="summary-card__sub">
            举报 {{ pendingReportCount }} / 反馈 {{ pendingFeedbackCount }}
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 系统资源 -->
    <ElCard shadow="never" class="monitor-overview-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">系统资源</span>
          <ElTag :type="systemHealthTagType" effect="light">{{ systemHealthLabel }}</ElTag>
        </div>
      </template>
      <div class="resource-grid">
        <div class="resource-item">
          <div class="resource-item__label">CPU 使用率</div>
          <ElProgress
            :percentage="clampPercent(overview?.systemResource?.cpu?.usagePercent)"
            :color="getProgressColor(overview?.systemResource?.cpu?.usagePercent)"
          />
          <div class="resource-item__hint">
            {{ overview?.systemResource?.cpu?.cores ?? 0 }} 核
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item__label">内存使用率</div>
          <ElProgress
            :percentage="clampPercent(overview?.systemResource?.memory?.usagePercent)"
            :color="getProgressColor(overview?.systemResource?.memory?.usagePercent)"
          />
          <div class="resource-item__hint">
            {{ formatBytes(overview?.systemResource?.memory?.usedBytes) }} /
            {{ formatBytes(overview?.systemResource?.memory?.totalBytes) }}
          </div>
        </div>
      </div>
      <div class="resource-meta">
        <div class="resource-meta__item">
          <span class="resource-meta__key">主机名</span>
          <span class="resource-meta__val">{{ overview?.systemResource?.hostname || '-' }}</span>
        </div>
        <div class="resource-meta__item">
          <span class="resource-meta__key">平台</span>
          <span class="resource-meta__val">{{ overview?.systemResource?.platform || '-' }}</span>
        </div>
        <div class="resource-meta__item">
          <span class="resource-meta__key">架构</span>
          <span class="resource-meta__val">{{ overview?.systemResource?.arch || '-' }}</span>
        </div>
        <div class="resource-meta__item">
          <span class="resource-meta__key">Node 版本</span>
          <span class="resource-meta__val">{{ overview?.systemResource?.nodeVersion || '-' }}</span>
        </div>
        <div class="resource-meta__item">
          <span class="resource-meta__key">运行时间</span>
          <span class="resource-meta__val">
            {{ formatUptime(overview?.systemResource?.uptimeSeconds) }}
          </span>
        </div>
        <div class="resource-meta__item">
          <span class="resource-meta__key">健康评分</span>
          <span class="resource-meta__val">
            {{ overview?.systemResource?.health?.score ?? 0 }}
            <ElTag size="small" :type="systemHealthTagType" effect="light" class="resource-meta__tag">
              {{ systemHealthLabel }}
            </ElTag>
          </span>
        </div>
      </div>
    </ElCard>

    <!-- 缓存状态 -->
    <ElCard shadow="never" class="monitor-overview-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">缓存状态</span>
          <ElTag :type="cacheTagType" effect="light">{{ cacheStatusText }}</ElTag>
        </div>
      </template>
      <div class="cache-grid">
        <div class="cache-item">
          <span class="cache-item__key">引擎</span>
          <span class="cache-item__val">{{ overview?.cache?.engine || '-' }}</span>
        </div>
        <div class="cache-item">
          <span class="cache-item__key">状态</span>
          <span class="cache-item__val">
            <ElTag size="small" :type="cacheTagType" effect="light">{{ cacheStatusText }}</ElTag>
          </span>
        </div>
        <div class="cache-item cache-item--full">
          <span class="cache-item__key">消息</span>
          <span class="cache-item__val">{{ overview?.cache?.message || '-' }}</span>
        </div>
        <div class="cache-item">
          <span class="cache-item__key">命中率</span>
          <span class="cache-item__val">
            {{ overview?.cache?.metrics?.hitRate != null ? `${overview.cache.metrics.hitRate}%` : '-' }}
          </span>
        </div>
        <div class="cache-item">
          <span class="cache-item__key">Key 数量</span>
          <span class="cache-item__val">
            {{ overview?.cache?.metrics?.keyCount != null ? overview.cache.metrics.keyCount : '-' }}
          </span>
        </div>
      </div>
    </ElCard>

    <!-- 登录趋势 -->
    <ElCard shadow="never" class="monitor-overview-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">登录趋势（近 7 日）</span>
        </div>
      </template>
      <ElTable :data="loginTrendData" stripe border style="width: 100%">
        <ElTableColumn prop="date" label="日期" min-width="140" />
        <ElTableColumn prop="successCount" label="成功" min-width="100" align="center" />
        <ElTableColumn prop="failCount" label="失败" min-width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="row.failCount > 0 ? 'danger' : 'info'" size="small" effect="light">
              {{ row.failCount }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="总计" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.successCount + row.failCount }}
          </template>
        </ElTableColumn>
      </ElTable>
      <ElEmpty v-if="!loginTrendData.length" description="暂无登录趋势数据" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { TagProps } from 'element-plus'
  import { ref, onMounted, computed } from 'vue'
  import {
    ElCard,
    ElRow,
    ElCol,
    ElTag,
    ElButton,
    ElProgress,
    ElTable,
    ElTableColumn,
    ElEmpty
  } from 'element-plus'
  import { fetchMonitorOverview } from '@/api/monitor'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'MonitorOverview' })

  const loading = ref(false)
  const overview = ref<Api.Monitor.OverviewResponse | null>(null)

  const loginTrendData = computed(() => overview.value?.loginTrend ?? [])

  // 概览汇总中部分动态字段（待处理举报/反馈）未在类型定义中声明，
  // 这里通过索引签名安全读取，缺失时回退为 0。
  const summaryRecord = computed(() => overview.value?.summary as (Record<string, unknown> | undefined))
  const pendingReportCount = computed(() => Number(summaryRecord.value?.pendingReportCount ?? 0))
  const pendingFeedbackCount = computed(() => Number(summaryRecord.value?.pendingFeedbackCount ?? 0))
  const pendingTotal = computed(() => pendingReportCount.value + pendingFeedbackCount.value)

  const loadOverview = async () => {
    loading.value = true
    try {
      const data = await fetchMonitorOverview()
      overview.value = data ?? null
    } catch (e) {
      console.error('[监控概览] 加载失败', e)
    } finally {
      loading.value = false
    }
  }

  const systemHealthLabel = computed(() => {
    switch (overview.value?.systemResource?.health?.level) {
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

  const systemHealthTagType = computed<TagProps['type']>(() => {
    switch (overview.value?.systemResource?.health?.level) {
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

  const cacheTagType = computed<TagProps['type']>(() => {
    switch (overview.value?.cache?.status) {
      case 'CONNECTED':
        return 'success'
      case 'PENDING_ACCESS':
        return 'warning'
      case 'ERROR':
        return 'danger'
      default:
        return 'info'
    }
  })

  const cacheStatusText = computed(() => {
    switch (overview.value?.cache?.status) {
      case 'CONNECTED':
        return '已连接'
      case 'PENDING_ACCESS':
        return '待接入'
      case 'ERROR':
        return '异常'
      default:
        return '未配置'
    }
  })

  function clampPercent(value?: number | null): number {
    if (value == null || Number.isNaN(value)) return 0
    return Math.max(0, Math.min(100, Math.round(value)))
  }

  function getProgressColor(value?: number | null): string {
    const percent = clampPercent(value)
    if (percent >= 90) return '#f56c6c'
    if (percent >= 70) return '#e6a23c'
    return '#67c23a'
  }

  function formatBytes(bytes?: number | null): string {
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

  function formatUptime(seconds?: number | null): string {
    if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return '-'
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const parts: string[] = []
    if (days > 0) parts.push(`${days} 天`)
    if (hours > 0) parts.push(`${hours} 小时`)
    if (minutes > 0) parts.push(`${minutes} 分钟`)
    return parts.length > 0 ? parts.join(' ') : `${Math.round(seconds)} 秒`
  }

  onMounted(loadOverview)
</script>

<style lang="scss" scoped>
  .monitor-overview-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .monitor-overview-page__header {
    :deep(.el-card__body) {
      padding: 16px 20px;
    }
  }

  .monitor-overview-page__header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .monitor-overview-page__title-text {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--art-text-gray-900, #303133);
  }

  .monitor-overview-page__title-desc {
    margin: 6px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--art-text-gray-600, #606266);
  }

  .monitor-overview-page__title-meta {
    margin-top: 6px;
    font-size: 12px;
    color: var(--art-text-gray-500, #909399);
  }

  .monitor-overview-page__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .monitor-overview-page__summary {
    margin: 0 !important;
  }

  .summary-card {
    height: 100%;

    :deep(.el-card__body) {
      padding: 18px 20px;
    }

    &__label {
      font-size: 13px;
      color: var(--art-text-gray-600, #606266);
    }

    &__value {
      margin-top: 8px;
      font-size: 28px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--art-text-gray-900, #303133);
    }

    &__sub {
      margin-top: 8px;
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    &__title {
      font-size: 15px;
      font-weight: 600;
      color: var(--art-text-gray-900, #303133);
    }
  }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .resource-item {
    &__label {
      margin-bottom: 8px;
      font-size: 13px;
      color: var(--art-text-gray-600, #606266);
    }

    &__hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }
  }

  .resource-meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 20px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter, #ebeef5);

    &__item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__key {
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }

    &__val {
      font-size: 13px;
      font-weight: 500;
      color: var(--art-text-gray-800, #303133);
    }

    &__tag {
      margin-left: 6px;
    }
  }

  .cache-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 20px;
  }

  .cache-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &--full {
      grid-column: 1 / -1;
    }

    &__key {
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }

    &__val {
      font-size: 13px;
      font-weight: 500;
      color: var(--art-text-gray-800, #303133);
      word-break: break-all;
    }
  }

  @media (width <= 768px) {
    .resource-grid {
      grid-template-columns: 1fr;
    }

    .resource-meta {
      grid-template-columns: 1fr;
    }

    .cache-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
