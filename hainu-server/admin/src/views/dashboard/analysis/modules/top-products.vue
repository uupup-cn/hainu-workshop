<template>
  <div class="art-card-sm h-82 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热门产品</h4>
      </div>
    </div>
    <div class="overflow-auto h-full">
      <ArtTable
        :data="products"
        style="width: 100%"
        size="large"
        :border="false"
        :stripe="false"
        :header-cell-style="{ background: 'transparent' }"
      >
        <ElTableColumn prop="name" label="产品名称" width="200" />
        <ElTableColumn prop="popularity" label="销量">
          <template #default="scope">
            <ElProgress
              :percentage="scope.row.popularity"
              :color="getToneColor(scope.row.popularity)"
              :define-back-color="PROGRESS_TRACK_COLOR"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sales" label="销量" width="80">
          <template #default="scope">
            <span :style="getSalesTagStyle(scope.row.popularity)">{{ scope.row.sales }}</span>
          </template>
        </ElTableColumn>
      </ArtTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  interface Product {
    name: string
    popularity: number
    sales: string
  }

  const COLOR_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75
  } as const

  const PROGRESS_TRACK_COLOR = 'color-mix(in srgb, var(--theme-base-content) 8%, transparent)'

  const POPULARITY_TONES = {
    LOW: {
      color: 'var(--art-success)',
      background: 'color-mix(in srgb, var(--art-success) 12%, transparent)',
      border: 'color-mix(in srgb, var(--art-success) 84%, transparent)'
    },
    MEDIUM: {
      color: 'var(--art-secondary)',
      background: 'color-mix(in srgb, var(--art-secondary) 12%, transparent)',
      border: 'color-mix(in srgb, var(--art-secondary) 84%, transparent)'
    },
    HIGH: {
      color: 'var(--art-primary)',
      background: 'color-mix(in srgb, var(--art-primary) 12%, transparent)',
      border: 'color-mix(in srgb, var(--art-primary) 84%, transparent)'
    },
    VERY_HIGH: {
      color: 'var(--art-warning)',
      background: 'color-mix(in srgb, var(--art-warning) 14%, transparent)',
      border: 'color-mix(in srgb, var(--art-warning) 84%, transparent)'
    }
  } as const

  /**
   * 热门产品列表数据
   * 包含产品名称、热度和销量信息
   */
  const products = computed<Product[]>(() => [
    { name: '智能手机', popularity: 10, sales: '100' },
    { name: '笔记本电脑', popularity: 29, sales: '100' },
    { name: '平板电脑', popularity: 65, sales: '100' },
    { name: '智能手表', popularity: 32, sales: '100' },
    { name: '无线耳机', popularity: 78, sales: '100' },
    { name: '智能音箱', popularity: 41, sales: '100' }
  ])

  /**
   * 根据热度百分比获取对应的主题色调
   * @param percentage 热度百分比 (0-100)
   * @returns 对应的主题色调
   */
  const getTone = (percentage: number) => {
    if (percentage < COLOR_THRESHOLDS.LOW) return POPULARITY_TONES.LOW
    if (percentage < COLOR_THRESHOLDS.MEDIUM) return POPULARITY_TONES.MEDIUM
    if (percentage < COLOR_THRESHOLDS.HIGH) return POPULARITY_TONES.HIGH
    return POPULARITY_TONES.VERY_HIGH
  }

  const getToneColor = (percentage: number) => getTone(percentage).color

  const getSalesTagStyle = (percentage: number): CSSProperties => {
    const tone = getTone(percentage)

    return {
      color: tone.color,
      backgroundColor: tone.background,
      border: `1px solid ${tone.border}`,
      padding: '3px 6px',
      borderRadius: '4px',
      fontSize: '12px'
    }
  }
</script>
