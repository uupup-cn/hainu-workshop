<template>
  <div class="p-2" v-loading="loading">
    <!-- 顶部统计卡 -->
    <ElRow :gutter="16" class="mb-4">
      <ElCol v-for="card in statCards" :key="card.label" :span="4">
        <ElCard shadow="never">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-gray-500 text-sm">{{ card.label }}</div>
              <div class="text-2xl font-bold mt-2">
                <ArtCountTo :target="card.value" :duration="800" />
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ card.sub }}</div>
            </div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg text-lg"
              :style="{ backgroundColor: card.bg, color: card.color }"
            >
              <ArtSvgIcon :icon="card.icon" />
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 趋势区 -->
    <ElRow :gutter="16" class="mb-4">
      <ElCol :span="12">
        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <ArtSvgIcon icon="ri:user-add-line" class="text-gray-500" />
              <span>近 7 日注册趋势</span>
            </div>
          </template>
          <div class="bar-chart">
            <div v-for="item in users.weekTrend" :key="item.date" class="bar-col">
              <div class="bar-value">{{ item.count }}</div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: barHeight(item.count, registerMax) }" />
              </div>
              <div class="bar-label">{{ formatDate(item.date) }}</div>
            </div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <ArtSvgIcon icon="ri:login-circle-line" class="text-gray-500" />
              <span>近 7 日登录趋势</span>
            </div>
          </template>
          <div class="bar-chart">
            <div v-for="item in activity.loginWeekTrend" :key="item.date" class="bar-col">
              <div class="bar-value">{{ item.count }}</div>
              <div class="bar-track">
                <div class="bar-fill bar-fill-green" :style="{ height: barHeight(item.count, loginMax) }" />
              </div>
              <div class="bar-label">{{ formatDate(item.date) }}</div>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 列表区 -->
    <ElRow :gutter="16">
      <ElCol :span="12">
        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center gap-2">
              <ArtSvgIcon icon="ri:tools-line" class="text-gray-500" />
              <span>Top 工具排行</span>
            </div>
          </template>
          <div
            v-for="(tool, index) in tools.topTools"
            :key="tool.name"
            class="flex items-center gap-3 py-2"
          >
            <span class="rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="w-28 truncate text-sm">{{ tool.name }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full progress-fill"
                :style="{ width: barWidth(tool.count, topToolMax) }"
              />
            </div>
            <span class="w-14 text-right text-sm text-gray-500">{{ tool.count }} 次</span>
          </div>
          <ElEmpty v-if="!tools.topTools.length" description="暂无数据" :image-size="60" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ArtSvgIcon icon="ri:group-line" class="text-gray-500" />
                <span>身份分布</span>
              </div>
              <ElTag type="success" effect="light">认证率 {{ verifiedRateText }}</ElTag>
            </div>
          </template>
          <div v-for="row in identityRows" :key="row.label" class="flex items-center gap-3 py-2">
            <span class="w-16 text-sm">{{ row.label }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full"
                :style="{ width: row.percent + '%', backgroundColor: row.color }"
              />
            </div>
            <span class="w-24 text-right text-sm text-gray-500">
              {{ row.value }} 人（{{ row.percent.toFixed(1) }}%）
            </span>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { fetchDashboardStats, type DashboardStats, type DashboardTrendItem } from '@/api/dashboard'

  defineOptions({ name: 'DashboardAnalysis' })

  const loading = ref(false)
  const stats = ref<DashboardStats | null>(null)

  const users = computed<DashboardStats['users']>(() => stats.value?.users ?? {
    total: 0,
    todayNew: 0,
    weekTrend: [],
    identityDist: { freshman: 0, undergrad: 0, grad: 0 },
    verifiedRate: 0
  })
  const activity = computed<DashboardStats['activity']>(
    () => stats.value?.activity ?? { todayLogins: 0, loginWeekTrend: [], onlineNow: 0 }
  )
  const community = computed<DashboardStats['community']>(
    () => stats.value?.community ?? { posts: 0, confessions: 0, todayPosts: 0, pendingReports: 0 }
  )
  const marketplace = computed<DashboardStats['marketplace']>(
    () => stats.value?.marketplace ?? { activeItems: 0, todayPublished: 0, totalViews: 0, offItems: 0 }
  )
  const tools = computed<DashboardStats['tools']>(
    () => stats.value?.tools ?? { totalUsage: 0, todayUsage: 0, topTools: [] }
  )
  const service = computed<DashboardStats['service']>(
    () => stats.value?.service ?? { pendingFeedback: 0, uptimeDays: 0 }
  )

  /** 顶部 6 个统计卡 */
  const statCards = computed(() => {
    const pendingTotal = community.value.pendingReports + service.value.pendingFeedback
    return [
      {
        label: '用户总数',
        value: users.value.total,
        sub: `今日 +${users.value.todayNew}`,
        icon: 'ri:user-line',
        color: '#377dff',
        bg: 'rgba(55, 125, 255, 0.1)'
      },
      {
        label: '今日登录',
        value: activity.value.todayLogins,
        sub: `当前在线 ${activity.value.onlineNow}`,
        icon: 'ri:login-circle-line',
        color: '#13DEB9',
        bg: 'rgba(19, 222, 185, 0.1)'
      },
      {
        label: '在售商品',
        value: marketplace.value.activeItems,
        sub: `今日发布 ${marketplace.value.todayPublished}`,
        icon: 'ri:shopping-cart-2-line',
        color: '#ffb100',
        bg: 'rgba(255, 177, 0, 0.1)'
      },
      {
        label: '帖子总数',
        value: community.value.posts,
        sub: `今日 +${community.value.todayPosts}`,
        icon: 'ri:chat-3-line',
        color: '#7A7FFF',
        bg: 'rgba(122, 127, 255, 0.1)'
      },
      {
        label: '工具使用',
        value: tools.value.totalUsage,
        sub: `今日 ${tools.value.todayUsage}`,
        icon: 'ri:tools-line',
        color: '#38C0FC',
        bg: 'rgba(56, 192, 252, 0.1)'
      },
      {
        label: '待处理',
        value: pendingTotal,
        sub: '举报/反馈',
        icon: 'ri:alarm-warning-line',
        color: '#ff6b6b',
        bg: 'rgba(255, 107, 107, 0.1)'
      }
    ]
  })

  /** 趋势图最大值（用于计算柱高） */
  const trendMax = (list: DashboardTrendItem[]) =>
    list.reduce((max, item) => Math.max(max, Number(item.count) || 0), 0)

  const registerMax = computed(() => trendMax(users.value.weekTrend))
  const loginMax = computed(() => trendMax(activity.value.loginWeekTrend))
  const topToolMax = computed(() =>
    tools.value.topTools.reduce((max, item) => Math.max(max, Number(item.count) || 0), 0)
  )

  /** 柱状图高度：count / max * 100%（最低 3% 保证 0 值可见） */
  function barHeight(count: number, max: number): string {
    if (max <= 0) return '0%'
    return `${Math.max(((Number(count) || 0) / max) * 100, 3)}%`
  }

  /** 进度条宽度：count / max * 100% */
  function barWidth(count: number, max: number): string {
    if (max <= 0) return '0%'
    return `${Math.min(((Number(count) || 0) / max) * 100, 100)}%`
  }

  /** 日期显示为 MM-DD */
  function formatDate(date: string): string {
    return (date || '').slice(5)
  }

  /** 身份分布三行 */
  const identityRows = computed(() => {
    const dist = users.value.identityDist
    const freshman = dist.freshman || 0
    const undergrad = dist.undergrad || 0
    const grad = dist.grad || 0
    const total = freshman + undergrad + grad
    const toPercent = (value: number) => (total > 0 ? (value / total) * 100 : 0)
    return [
      { label: '新生', value: freshman, percent: toPercent(freshman), color: '#377dff' },
      { label: '本科生', value: undergrad, percent: toPercent(undergrad), color: '#13DEB9' },
      { label: '研究生', value: grad, percent: toPercent(grad), color: '#ffb100' }
    ]
  })

  /** 认证率（0-1 小数转为百分比，>1 视为已是百分比） */
  const verifiedRateText = computed(() => {
    const rate = Number(users.value.verifiedRate) || 0
    const percent = rate > 1 ? rate : rate * 100
    return `${percent.toFixed(1)}%`
  })

  async function loadStats() {
    loading.value = true
    try {
      stats.value = (await fetchDashboardStats()) as DashboardStats
    } finally {
      loading.value = false
    }
  }

  onMounted(loadStats)
</script>

<style scoped lang="scss">
  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 220px;

    .bar-col {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      min-width: 0;
    }

    .bar-value {
      margin-bottom: 4px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .bar-track {
      display: flex;
      align-items: flex-end;
      width: 100%;
      max-width: 36px;
      height: calc(100% - 40px);
    }

    .bar-fill {
      width: 100%;
      border-radius: 4px 4px 0 0;
      background-color: #377dff;
      transition: height 0.4s ease;

      &.bar-fill-green {
        background-color: #13deb9;
      }
    }

    .bar-label {
      margin-top: 6px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    background-color: var(--el-fill-color-light);
    border-radius: 50%;

    &.rank-1 {
      color: #fff;
      background-color: #ff6b6b;
    }

    &.rank-2 {
      color: #fff;
      background-color: #ffb100;
    }

    &.rank-3 {
      color: #fff;
      background-color: #38c0fc;
    }
  }

  .progress-fill {
    background-color: #377dff;
    transition: width 0.4s ease;
  }
</style>
