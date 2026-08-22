<!-- 热力图 -->
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
  import type { HeatmapChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtHeatmapChart' })

  const props = withDefaults(defineProps<HeatmapChartProps>(), {
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    data: () => [],
    xAxisData: () => [],
    yAxisData: () => [],
    min: 0,
    max: 100,

    showAxisLabel: true,
    showAxisLine: false,
    showSplitLine: false,

    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  const {
    chartRef,
    isDark,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getTooltipStyle,
    getAnimationConfig
  } = useChartComponent({
    props,
    checkEmpty: () => !props.data?.length || props.data.every((item) => item.value[2] === 0),
    watchSources: [
      () => props.data,
      () => props.xAxisData,
      () => props.yAxisData,
      () => props.colors
    ],
    generateOptions: (): EChartsOption => {
      return {
        grid: {
          top: 10,
          right: 14,
          bottom: 10,
          left: 14,
          outerBoundsMode: 'same',
          outerBoundsContain: 'axisLabel'
        },
        tooltip: props.showTooltip
          ? getTooltipStyle('item', {
              formatter: (params: { data: { value: [number, number, number] } }) => {
                const [xIndex, yIndex, value] = params.data.value
                return `${props.yAxisData[yIndex]} / ${props.xAxisData[xIndex]}<br/>数值: ${value}`
              }
            })
          : undefined,
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          splitArea: {
            show: true
          },
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel)
        },
        yAxis: {
          type: 'category',
          data: props.yAxisData,
          splitArea: {
            show: true
          },
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel)
        },
        visualMap: {
          show: props.showLegend,
          min: props.min,
          max: props.max,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          textStyle: {
            color: isDark.value ? '#d1d5db' : '#6b7280'
          },
          inRange: {
            color: [isDark.value ? '#172554' : '#e0f2fe', props.colors[0], props.colors[1]]
          }
        },
        series: [
          {
            type: 'heatmap',
            data: props.data,
            label: {
              show: true,
              color: isDark.value ? '#f9fafb' : '#111827',
              fontSize: 12
            },
            itemStyle: {
              borderRadius: 6,
              borderColor: isDark.value ? '#0f172a' : '#ffffff',
              borderWidth: 2
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowColor: isDark.value ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
              }
            },
            ...getAnimationConfig(20, 1000)
          }
        ]
      }
    }
  })
</script>
