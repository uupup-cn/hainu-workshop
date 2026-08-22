<!-- 柱线混合图 -->
<template>
  <div
    ref="chartRef"
    class="relative w-full"
    :style="{ height: props.height }"
    v-loading="props.loading"
  >
  </div>
</template>

<script setup lang="ts">
  import type { EChartsOption } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { MixedChartDataItem, MixedChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtMixChart' })

  const props = withDefaults(defineProps<MixedChartProps>(), {
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    data: () => [],
    xAxisData: () => [],
    borderRadius: () => [6, 6, 0, 0],

    showAxisLabel: true,
    showAxisLine: true,
    showSplitLine: true,

    showTooltip: true,
    showLegend: true,
    legendPosition: 'bottom'
  })

  const getSeriesColor = (index: number) => props.colors[index % props.colors.length]

  const maxBarValue = computed(() => {
    return props.data
      .filter((item) => item.type === 'bar')
      .flatMap((item) => item.data)
      .reduce((max, value) => Math.max(max, value), 0)
  })

  const maxLineValue = computed(() => {
    return props.data
      .filter((item) => item.type === 'line')
      .flatMap((item) => item.data)
      .reduce((max, value) => Math.max(max, value), 0)
  })

  const createSeriesItem = (
    item: MixedChartDataItem,
    index: number,
    getAnimationConfig: (animationDelay?: number, animationDuration?: number) => any
  ) => {
    const color = getSeriesColor(index)

    if (item.type === 'line') {
      return {
        name: item.name,
        type: 'line' as const,
        yAxisIndex: item.yAxisIndex ?? 1,
        data: item.data,
        smooth: item.smooth ?? true,
        symbol: item.symbol ?? 'circle',
        symbolSize: item.symbolSize ?? 7,
        lineStyle: {
          width: item.lineWidth ?? 3,
          color
        },
        itemStyle: {
          color
        }
      }
    }

    return {
      name: item.name,
      type: 'bar' as const,
      yAxisIndex: item.yAxisIndex ?? 0,
      data: item.data,
      stack: item.stack,
      barWidth: item.barWidth ?? '34%',
      itemStyle: {
        color,
        borderRadius: props.borderRadius
      },
      ...getAnimationConfig()
    }
  }

  const {
    chartRef,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend,
    getAnimationConfig
  } = useChartComponent({
    props,
    checkEmpty: () =>
      !props.data.length ||
      props.data.every((item) => !item.data.length || item.data.every((v) => v === 0)),
    watchSources: [() => props.data, () => props.xAxisData, () => props.colors],
    generateOptions: (): EChartsOption => {
      return {
        color: props.colors,
        grid: getGridWithLegend(props.showLegend, props.legendPosition, {
          top: 20,
          right: 10,
          left: 0
        }),
        tooltip: props.showTooltip ? getTooltipStyle() : undefined,
        legend: props.showLegend ? getLegendStyle(props.legendPosition) : undefined,
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel)
        },
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: maxBarValue.value || undefined,
            axisLabel: getAxisLabelStyle(props.showAxisLabel),
            axisLine: getAxisLineStyle(props.showAxisLine),
            splitLine: getSplitLineStyle(props.showSplitLine)
          },
          {
            type: 'value',
            min: 0,
            max: maxLineValue.value || undefined,
            axisLabel: getAxisLabelStyle(props.showAxisLabel),
            axisLine: getAxisLineStyle(props.showAxisLine),
            splitLine: {
              show: false
            }
          }
        ],
        series: props.data.map((item, index) => createSeriesItem(item, index, getAnimationConfig))
      }
    }
  })
</script>
