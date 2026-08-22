<!-- 折线图卡片 -->
<template>
  <div
    class="art-card-sm overflow-hidden"
    :class="isMiniChart ? 'flex h-full flex-col p-5' : 'relative'"
    :style="{ height: `${height}rem` }"
  >
    <template v-if="isMiniChart">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-2xl font-medium leading-none">
            {{ value }}
          </p>
          <p class="mt-1 text-sm text-g-500">{{ label }}</p>
        </div>
        <div ref="chartRef" class="h-15 w-4/10 shrink-0"></div>
      </div>

      <div class="mt-auto flex items-center justify-between gap-4">
        <div class="text-sm font-medium" :class="percentage > 0 ? 'text-success' : 'text-danger'">
          {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
        </div>
        <div v-if="date" class="text-xs text-g-500">
          {{ date }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mb-2.5 flex-b items-start p-5">
        <div>
          <p class="text-2xl font-medium leading-none">
            {{ value }}
          </p>
          <p class="mt-1 text-sm text-g-500">{{ label }}</p>
        </div>
        <div class="text-sm font-medium" :class="percentage > 0 ? 'text-success' : 'text-danger'">
          {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
        </div>
        <div v-if="date" class="absolute bottom-5 right-5 text-xs text-g-500">
          {{ date }}
        </div>
      </div>
      <div
        ref="chartRef"
        class="absolute bottom-0 left-0 right-0 box-border w-full"
        :style="{ height: `calc(${height}rem - 5rem)` }"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { graphic, type EChartsOption } from '@/plugins/echarts'
  import { getCssVar, hexToRgba } from '@/utils/ui'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'

  defineOptions({ name: 'ArtLineChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标签 */
    label: string
    /** 百分比 */
    percentage: number
    /** 日期 */
    date?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 是否显示区域颜色 */
    showAreaColor?: boolean
    /** 图表数据 */
    chartData: number[]
    /** 是否为迷你图表 */
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 11
  })

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: !props.chartData?.length || props.chartData.every((val) => val === 0)
    },
    checkEmpty: () => !props.chartData?.length || props.chartData.every((val) => val === 0),
    watchSources: [() => props.chartData, () => props.color, () => props.showAreaColor],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: props.chartData,
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,
              color: computedColor
            },
            areaStyle: props.showAreaColor
              ? {
                  color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: props.color
                        ? hexToRgba(props.color, 0.2).rgba
                        : hexToRgba(getCssVar('--el-color-primary'), 0.2).rgba
                    },
                    {
                      offset: 1,
                      color: props.color
                        ? hexToRgba(props.color, 0.01).rgba
                        : hexToRgba(getCssVar('--el-color-primary'), 0.01).rgba
                    }
                  ])
                }
              : undefined
          }
        ]
      }
    }
  })
</script>
