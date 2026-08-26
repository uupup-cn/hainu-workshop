<template>
  <div class="server-monitor-page">
    <!-- 顶部操作栏 -->
    <ElCard shadow="never" class="server-monitor-page__header">
      <div class="server-monitor-page__header-inner">
        <div class="server-monitor-page__title">
          <h2 class="server-monitor-page__title-text">服务器监控</h2>
          <p class="server-monitor-page__title-desc">
            集中巡检主机、CPU、内存、磁盘与进程运行状态，把上线前最需要判断的稳定性信号收束到一屏。
          </p>
          <div class="server-monitor-page__title-meta">
            采样时间：{{ formatDateTime(data?.sampledAt) }}
          </div>
        </div>
        <div class="server-monitor-page__header-actions">
          <ElButton :loading="loading" plain @click="loadData">刷新</ElButton>
        </div>
      </div>
    </ElCard>

    <!-- 健康评分 -->
    <ElCard shadow="never" class="server-monitor-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">健康评分</span>
          <ElTag :type="healthTagType()" effect="light">{{ healthLabel() }}</ElTag>
        </div>
      </template>
      <div class="health-score">
        <div class="health-score__value">{{ data?.health?.score ?? 0 }}</div>
        <div class="health-score__unit">综合评分 / 100</div>
      </div>
      <ElProgress
        class="health-score__bar"
        :percentage="clampPercent(data?.health?.score)"
        :color="getProgressColor(data?.health?.score)"
        :show-text="false"
      />
      <div class="health-warnings">
        <div class="health-warnings__title">告警信息（{{ data?.health?.warnings?.length ?? 0 }} 条）</div>
        <div
          v-for="(warning, index) in data?.health?.warnings"
          :key="index"
          class="health-warnings__item"
        >
          {{ warning }}
        </div>
        <ElEmpty v-if="!data?.health?.warnings?.length" description="暂无告警信息" :image-size="60" />
      </div>
    </ElCard>

    <!-- 资源使用率：CPU / 内存 / 存储 -->
    <ElRow :gutter="16" class="server-monitor-page__meters">
      <ElCol :span="8" :xs="24" :sm="12" :md="8">
        <ElCard shadow="never" class="meter-card">
          <template #header>
            <div class="panel-header">
              <span class="panel-header__title">CPU 使用率</span>
              <ElTag :type="getUsageTagType(data?.cpu?.usagePercent)" effect="light">
                {{ data?.cpu?.usagePercent ?? 0 }}%
              </ElTag>
            </div>
          </template>
          <ElProgress
            :percentage="clampPercent(data?.cpu?.usagePercent)"
            :color="getProgressColor(data?.cpu?.usagePercent)"
          />
          <div class="meter-meta">
            <div class="meter-meta__item">
              <span class="meter-meta__key">型号</span>
              <span class="meter-meta__val">{{ data?.cpu?.model || '-' }}</span>
            </div>
            <div class="meter-meta__item">
              <span class="meter-meta__key">核心数</span>
              <span class="meter-meta__val">{{ data?.cpu?.cores ?? 0 }} 核</span>
            </div>
            <div class="meter-meta__item">
              <span class="meter-meta__key">负载均值</span>
              <span class="meter-meta__val">{{ formatLoadAverage(data?.cpu?.loadAverage) }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="8" :xs="24" :sm="12" :md="8">
        <ElCard shadow="never" class="meter-card">
          <template #header>
            <div class="panel-header">
              <span class="panel-header__title">内存使用率</span>
              <ElTag :type="getUsageTagType(data?.memory?.usagePercent)" effect="light">
                {{ data?.memory?.usagePercent ?? 0 }}%
              </ElTag>
            </div>
          </template>
          <ElProgress
            :percentage="clampPercent(data?.memory?.usagePercent)"
            :color="getProgressColor(data?.memory?.usagePercent)"
          />
          <div class="meter-meta">
            <div class="meter-meta__item">
              <span class="meter-meta__key">已用</span>
              <span class="meter-meta__val">{{ formatBytes(data?.memory?.usedBytes) }}</span>
            </div>
            <div class="meter-meta__item">
              <span class="meter-meta__key">总量</span>
              <span class="meter-meta__val">{{ formatBytes(data?.memory?.totalBytes) }}</span>
            </div>
            <div class="meter-meta__item">
              <span class="meter-meta__key">可用</span>
              <span class="meter-meta__val">{{ formatBytes(data?.memory?.freeBytes) }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="8" :xs="24" :sm="12" :md="8">
        <ElCard shadow="never" class="meter-card">
          <template #header>
            <div class="panel-header">
              <span class="panel-header__title">存储使用率</span>
              <ElTag
                v-if="data?.storage"
                :type="getUsageTagType(data?.storage?.usagePercent)"
                effect="light"
              >
                {{ data?.storage?.usagePercent ?? 0 }}%
              </ElTag>
            </div>
          </template>
          <template v-if="data?.storage">
            <ElProgress
              :percentage="clampPercent(data?.storage?.usagePercent)"
              :color="getProgressColor(data?.storage?.usagePercent)"
            />
            <div class="meter-meta">
              <div class="meter-meta__item">
                <span class="meter-meta__key">已用</span>
                <span class="meter-meta__val">{{ formatBytes(data?.storage?.usedBytes) }}</span>
              </div>
              <div class="meter-meta__item">
                <span class="meter-meta__key">总量</span>
                <span class="meter-meta__val">{{ formatBytes(data?.storage?.totalBytes) }}</span>
              </div>
              <div class="meter-meta__item">
                <span class="meter-meta__key">可用</span>
                <span class="meter-meta__val">{{ formatBytes(data?.storage?.freeBytes) }}</span>
              </div>
            </div>
            <div v-if="data?.storage?.disks?.length" class="disk-list">
              <div class="disk-list__title">磁盘分区</div>
              <div
                v-for="disk in data?.storage?.disks"
                :key="`${disk.filesystem}-${disk.mountpoint}`"
                class="disk-list__item"
              >
                <div class="disk-list__head">
                  <span class="disk-list__mount">{{ disk.mountpoint || '-' }}</span>
                  <span class="disk-list__fs">{{ disk.filesystem || '-' }}</span>
                </div>
                <ElProgress
                  :percentage="clampPercent(disk.usagePercent)"
                  :color="getProgressColor(disk.usagePercent)"
                  :stroke-width="10"
                />
                <div class="disk-list__meta">
                  {{ formatBytes(disk.usedBytes) }} / {{ formatBytes(disk.totalBytes) }}（可用
                  {{ formatBytes(disk.freeBytes) }}）
                </div>
              </div>
            </div>
          </template>
          <ElEmpty v-else description="暂无磁盘数据" :image-size="60" />
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 进程信息 -->
    <ElCard shadow="never" class="server-monitor-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">进程信息</span>
        </div>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-item__key">进程 PID</span>
          <span class="info-item__val">
            {{ data?.process?.pid ? `#${data.process.pid}` : '-' }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-item__key">运行时长</span>
          <span class="info-item__val">{{ formatUptime(data?.process?.uptimeSeconds) }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">RSS 内存</span>
          <span class="info-item__val">{{ formatBytes(data?.process?.rssBytes) }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">堆已用</span>
          <span class="info-item__val">{{ formatBytes(data?.process?.heapUsedBytes) }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">堆总量</span>
          <span class="info-item__val">{{ formatBytes(data?.process?.heapTotalBytes) }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">堆使用率</span>
          <span class="info-item__val">{{ heapUsagePercent() }}%</span>
        </div>
      </div>
    </ElCard>

    <!-- 系统信息 -->
    <ElCard shadow="never" class="server-monitor-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">系统信息</span>
        </div>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-item__key">主机名</span>
          <span class="info-item__val">{{ data?.hostname || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">平台</span>
          <span class="info-item__val">{{ data?.platform || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">系统版本</span>
          <span class="info-item__val">{{ data?.release || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">架构</span>
          <span class="info-item__val">{{ data?.arch || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">Node 版本</span>
          <span class="info-item__val">{{ data?.nodeVersion || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">系统运行时长</span>
          <span class="info-item__val">{{ formatUptime(data?.uptimeSeconds) }}</span>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import type { TagProps } from 'element-plus'
  import { ref, onMounted } from 'vue'
  import { ElCard, ElRow, ElCol, ElTag, ElButton, ElProgress, ElEmpty } from 'element-plus'
  import { fetchSystemResourceMonitor } from '@/api/monitor'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'MonitorServer' })

  const loading = ref(false)
  const data = ref<Api.Monitor.SystemResourceOverview | null>(null)

  const loadData = async () => {
    loading.value = true
    try {
      const res = await fetchSystemResourceMonitor()
      data.value = res ?? null
    } catch (e) {
      console.error('[服务器监控] 加载失败', e)
    } finally {
      loading.value = false
    }
  }

  const healthLabel = (): string => {
    switch (data.value?.health?.level) {
      case 'GOOD':
        return '良好'
      case 'ATTENTION':
        return '关注'
      case 'RISK':
        return '风险'
      default:
        return '待采样'
    }
  }

  const healthTagType = (): TagProps['type'] => {
    switch (data.value?.health?.level) {
      case 'GOOD':
        return 'success'
      case 'ATTENTION':
        return 'warning'
      case 'RISK':
        return 'danger'
      default:
        return 'info'
    }
  }

  const heapUsagePercent = (): number => {
    const used = data.value?.process?.heapUsedBytes ?? 0
    const total = data.value?.process?.heapTotalBytes ?? 0
    if (total <= 0) return 0
    return Math.round((used / total) * 100)
  }

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

  function getUsageTagType(value?: number | null): TagProps['type'] {
    const percent = clampPercent(value)
    if (percent >= 85) return 'danger'
    if (percent >= 70) return 'warning'
    return 'success'
  }

  function formatBytes(bytes?: number | null): string {
    if (bytes == null || Number.isNaN(bytes)) return '-'
    if (bytes <= 0) return '0 B'
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

  function formatLoadAverage(values?: number[] | null): string {
    if (!values?.length) return '-'
    const labels = ['1 分钟', '5 分钟', '15 分钟']
    return values
      .map((item, index) => `${labels[index] ?? ''} ${item}`)
      .filter((item) => item.trim())
      .join(' / ')
  }

  onMounted(loadData)
</script>

<style lang="scss" scoped>
  .server-monitor-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .server-monitor-page__header {
    :deep(.el-card__body) {
      padding: 16px 20px;
    }
  }

  .server-monitor-page__header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .server-monitor-page__title-text {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--art-text-gray-900, #303133);
  }

  .server-monitor-page__title-desc {
    margin: 6px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--art-text-gray-600, #606266);
  }

  .server-monitor-page__title-meta {
    margin-top: 6px;
    font-size: 12px;
    color: var(--art-text-gray-500, #909399);
  }

  .server-monitor-page__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .server-monitor-page__meters {
    margin: 0 !important;
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

  .health-score {
    display: flex;
    align-items: baseline;
    gap: 10px;

    &__value {
      font-size: 38px;
      font-weight: 600;
      line-height: 1.1;
      color: var(--art-text-gray-900, #303133);
    }

    &__unit {
      font-size: 13px;
      color: var(--art-text-gray-500, #909399);
    }

    &__bar {
      margin-top: 14px;
    }
  }

  .health-warnings {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter, #ebeef5);

    &__title {
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--art-text-gray-700, #606266);
    }

    &__item {
      padding: 8px 12px;
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 1.6;
      color: var(--art-text-gray-700, #606266);
      background: var(--art-surface-bg-muted, #f5f7fa);
      border-radius: 6px;
      word-break: break-all;
    }
  }

  .meter-card {
    height: 100%;

    :deep(.el-card__body) {
      padding: 18px 20px;
    }
  }

  .meter-meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px 16px;
    margin-top: 16px;

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
      word-break: break-all;
    }
  }

  .disk-list {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter, #ebeef5);

    &__title {
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--art-text-gray-700, #606266);
    }

    &__item {
      padding: 12px;
      margin-bottom: 10px;
      background: var(--art-surface-bg-muted, #f5f7fa);
      border-radius: 6px;
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    &__mount {
      font-size: 13px;
      font-weight: 600;
      color: var(--art-text-gray-900, #303133);
    }

    &__fs {
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
      word-break: break-all;
    }

    &__meta {
      margin-top: 8px;
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px 20px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

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
    .meter-meta {
      grid-template-columns: 1fr;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
