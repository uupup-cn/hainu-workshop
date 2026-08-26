<template>
  <div class="cache-monitor-page">
    <!-- 顶部操作栏 -->
    <ElCard shadow="never" class="cache-monitor-page__header">
      <div class="cache-monitor-page__header-inner">
        <div class="cache-monitor-page__title">
          <h2 class="cache-monitor-page__title-text">缓存监控</h2>
          <p class="cache-monitor-page__title-desc">
            查看 Redis 缓存引擎状态、运行指标与连接配置，未配置 Redis 时展示进程内存兜底信息。
          </p>
          <div class="cache-monitor-page__title-meta">
            更新时间：{{ formatDateTime(cacheInfo?.updatedAt) }}
          </div>
        </div>
        <div class="cache-monitor-page__header-actions">
          <ElButton :loading="loading" plain @click="refreshCacheState">刷新</ElButton>
          <ElButton
            :loading="clearing"
            :disabled="!canClear()"
            type="danger"
            plain
            @click="clearAllNamespaces"
          >
            清理缓存
          </ElButton>
        </div>
      </div>
    </ElCard>

    <!-- 缓存状态 -->
    <ElCard shadow="never" class="cache-monitor-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">缓存状态</span>
          <ElTag :type="getMonitorCacheStatusTagType(cacheInfo?.status)" effect="light">
            {{ getMonitorCacheStatusText(cacheInfo?.status) }}
          </ElTag>
        </div>
      </template>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-item__key">引擎</span>
          <span class="status-item__val">{{ cacheInfo?.engine || '-' }}</span>
        </div>
        <div class="status-item">
          <span class="status-item__key">状态</span>
          <span class="status-item__val">
            <ElTag
              size="small"
              :type="getMonitorCacheStatusTagType(cacheInfo?.status)"
              effect="light"
            >
              {{ getMonitorCacheStatusText(cacheInfo?.status) }}
            </ElTag>
          </span>
        </div>
        <div class="status-item status-item--full">
          <span class="status-item__key">消息</span>
          <span class="status-item__val">{{ cacheInfo?.message || '-' }}</span>
        </div>
      </div>
    </ElCard>

    <!-- 指标卡片 -->
    <ElRow :gutter="16" class="cache-monitor-page__metrics">
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="metric-card">
          <div class="metric-card__label">命中率</div>
          <div class="metric-card__value">
            {{ cacheInfo?.metrics?.hitRate != null ? `${cacheInfo.metrics.hitRate}%` : '-' }}
          </div>
          <ElProgress
            class="metric-card__bar"
            :percentage="clampPercent(cacheInfo?.metrics?.hitRate)"
            :color="getProgressColor(cacheInfo?.metrics?.hitRate)"
            :show-text="false"
          />
          <div class="metric-card__sub">缓存命中效率</div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="metric-card">
          <div class="metric-card__label">Key 数量</div>
          <div class="metric-card__value">{{ cacheInfo?.metrics?.keyCount ?? 0 }}</div>
          <div class="metric-card__sub">缓存键空间</div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="metric-card">
          <div class="metric-card__label">内存使用</div>
          <div class="metric-card__value">{{ cacheInfo?.metrics?.memoryUsed || '-' }}</div>
          <div class="metric-card__sub">已用内存</div>
        </ElCard>
      </ElCol>
      <ElCol :span="6" :xs="24" :sm="12" :md="6">
        <ElCard shadow="never" class="metric-card">
          <div class="metric-card__label">连接数</div>
          <div class="metric-card__value">{{ cacheInfo?.metrics?.connectedClients ?? 0 }}</div>
          <div class="metric-card__sub">客户端连接</div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 连接信息 -->
    <ElCard shadow="never" class="cache-monitor-page__panel">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">连接信息</span>
        </div>
      </template>
      <div v-if="cacheInfo?.connection" class="info-grid">
        <div class="info-item">
          <span class="info-item__key">连接地址</span>
          <span class="info-item__val">
            {{ cacheInfo?.connection?.urlConfigured ? '已配置' : '未配置' }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-item__key">Key 前缀</span>
          <span class="info-item__val">{{ cacheInfo?.connection?.keyPrefix || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">数据库</span>
          <span class="info-item__val">{{ cacheInfo?.connection?.database ?? '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__key">超时时间</span>
          <span class="info-item__val">
            {{
              cacheInfo?.connection?.timeoutMs
                ? `${cacheInfo.connection.timeoutMs}ms`
                : '-'
            }}
          </span>
        </div>
      </div>
      <ElEmpty v-else description="未配置 Redis 连接" :image-size="60" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import {
    ElCard,
    ElRow,
    ElCol,
    ElTag,
    ElButton,
    ElProgress,
    ElEmpty,
    ElMessage,
    ElMessageBox
  } from 'element-plus'
  import {
    fetchCacheMonitor,
    fetchClearCacheNamespace,
    fetchRefreshCacheMonitor
  } from '@/api/monitor'
  import { formatDateTime } from '@/utils'
  import { getMonitorCacheStatusTagType, getMonitorCacheStatusText } from '../shared'

  defineOptions({ name: 'CacheMonitor' })

  const loading = ref(false)
  const clearing = ref(false)
  const cacheInfo = ref<Api.Monitor.CacheOverview | null>(null)

  const loadCacheInfo = async () => {
    loading.value = true
    try {
      const res = await fetchCacheMonitor()
      cacheInfo.value = res ?? null
    } catch (e) {
      console.error('[缓存监控] 加载失败', e)
    } finally {
      loading.value = false
    }
  }

  const refreshCacheState = async () => {
    loading.value = true
    try {
      await fetchRefreshCacheMonitor()
      ElMessage.info('缓存状态已刷新')
      const res = await fetchCacheMonitor()
      cacheInfo.value = res ?? null
    } catch (e) {
      console.error('[缓存监控] 刷新失败', e)
    } finally {
      loading.value = false
    }
  }

  const canClear = () =>
    cacheInfo.value?.actions?.canClear === true &&
    (cacheInfo.value?.manageableNamespaces?.length ?? 0) > 0

  const clearAllNamespaces = async () => {
    const namespaces = cacheInfo.value?.manageableNamespaces ?? []
    if (!namespaces.length) {
      ElMessage.info('暂无可清理的业务缓存命名空间')
      return
    }

    try {
      await ElMessageBox.confirm(
        `确认清理全部 ${namespaces.length} 个业务缓存命名空间吗？系统只会删除受控业务缓存，不会影响登录态、验证码与限流数据。`,
        '清理缓存',
        {
          confirmButtonText: '清理',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    } catch {
      return
    }

    clearing.value = true
    try {
      let total = 0
      for (const ns of namespaces) {
        const result = await fetchClearCacheNamespace(ns.key)
        total += result?.deletedKeys ?? 0
      }
      ElMessage.success(`已清理业务缓存，共删除 ${total} 个 Key`)
      await loadCacheInfo()
    } catch (e) {
      console.error('[缓存监控] 清理失败', e)
    } finally {
      clearing.value = false
    }
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

  onMounted(loadCacheInfo)
</script>

<style lang="scss" scoped>
  .cache-monitor-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .cache-monitor-page__header {
    :deep(.el-card__body) {
      padding: 16px 20px;
    }
  }

  .cache-monitor-page__header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .cache-monitor-page__title-text {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--art-text-gray-900, #303133);
  }

  .cache-monitor-page__title-desc {
    margin: 6px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--art-text-gray-600, #606266);
  }

  .cache-monitor-page__title-meta {
    margin-top: 6px;
    font-size: 12px;
    color: var(--art-text-gray-500, #909399);
  }

  .cache-monitor-page__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cache-monitor-page__metrics {
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

  .status-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 20px;
  }

  .status-item {
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

  .metric-card {
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
      font-size: 26px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--art-text-gray-900, #303133);
      word-break: break-all;
    }

    &__bar {
      margin-top: 12px;
    }

    &__sub {
      margin-top: 8px;
      font-size: 12px;
      color: var(--art-text-gray-500, #909399);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
    .status-grid {
      grid-template-columns: 1fr;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
