<template>
  <div
    ref="chartRef"
    class="relative w-full"
    :style="{ height: props.height }"
    v-loading="props.loading"
  ></div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from '@/plugins/echarts'
  import { useChartComponent, useChartOps } from '@/hooks/core/useChart'
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'SalesOverviewChart' })

  interface Props {
    height?: string
    loading?: boolean
    xAxis: string[]
    orders: number[]
    sales: number[]
    revenue: number[]
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '340px',
    loading: false
  })
  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)

  const isEmpty = computed(
    () =>
      !props.xAxis.length || (!props.orders.length && !props.sales.length && !props.revenue.length)
  )

  const {
    chartRef,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getTooltipStyle,
    getAnimationConfig
  } = useChartComponent({
    props: {
      height: props.height,
      loading: props.loading,
      isEmpty: isEmpty.value
    },
    checkEmpty: () => isEmpty.value,
    watchSources: [() => props.xAxis, () => props.orders, () => props.sales, () => props.revenue],
    generateOptions: (): EChartsOption => {
      const [ordersColor, salesColor, revenueColor] = useChartOps().colors
      const barAnimation = getAnimationConfig()
      const lineAnimation = getAnimationConfig(200, 1800)

      return {
        grid: {
          top: 28,
          left: isRtl.value ? 12 : 0,
          right: isRtl.value ? 0 : 12,
          bottom: 24,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel'
        },
        tooltip: getTooltipStyle('axis', {
          axisPointer: {
            type: 'shadow'
          }
        }),
        xAxis: {
          type: 'category',
          data: props.xAxis,
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(false),
          axisLabel: getAxisLabelStyle(true)
        },
        yAxis: {
          type: 'value',
          position: isRtl.value ? 'right' : 'left',
          axisLine: getAxisLineStyle(false),
          axisTick: getAxisTickStyle(),
          axisLabel: getAxisLabelStyle(false),
          splitLine: getSplitLineStyle(true)
        },
        series: [
          {
            name: '订单总量',
            type: 'bar',
            data: props.orders,
            barWidth: '28%',
            legendHoverLink: false,
            emphasis: {
              disabled: true
            },
            itemStyle: {
              color: ordersColor,
              borderRadius: [4, 4, 0, 0]
            },
            ...barAnimation
          },
          {
            name: '销售总额',
            type: 'bar',
            data: props.sales,
            barWidth: '28%',
            legendHoverLink: false,
            emphasis: {
              disabled: true
            },
            itemStyle: {
              color: salesColor,
              borderRadius: [4, 4, 0, 0]
            },
            ...barAnimation
          },
          {
            name: '营收',
            type: 'line',
            data: props.revenue,
            smooth: true,
            symbol: 'none',
            legendHoverLink: false,
            emphasis: {
              disabled: true
            },
            lineStyle: {
              width: 3,
              color: revenueColor
            },
            itemStyle: {
              color: revenueColor
            },
            ...lineAnimation
          }
        ]
      }
    }
  })
</script>
