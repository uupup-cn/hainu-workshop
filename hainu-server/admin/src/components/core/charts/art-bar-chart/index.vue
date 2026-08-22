<!-- 柱状图 -->
<template>
  <div ref="chartRef" :style="{ height: props.height }" v-loading="props.loading"> </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { EChartsOption } from '@/plugins/echarts'
  import type { BarChartProps, BarDataItem } from '@/types/component/chart'
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'ArtBarChart' })

  const { themeCustomizer } = storeToRefs(useSettingStore())

  const props = withDefaults(defineProps<BarChartProps>(), {
    // 基础配置
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => [],
    borderRadius: 2,

    // 数据配置
    data: () => [0, 0, 0, 0, 0, 0, 0],
    xAxisData: () => [],
    seriesName: '',
    barWidth: '40%',
    stack: false,

    // 轴线显示配置
    showAxisLabel: true,
    showAxisLine: true,
    showSplitLine: true,

    // 交互配置
    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  // 判断是否为多数据
  const isMultipleData = computed(() => {
    return (
      Array.isArray(props.data) &&
      props.data.length > 0 &&
      typeof props.data[0] === 'object' &&
      'name' in props.data[0]
    )
  })

  const resolvedColors = computed(() => {
    return props.colors?.length ? props.colors : themeCustomizer.value.chartThemeColors
  })

  // 获取颜色配置
  const getColor = (customColor?: string, index?: number) => {
    if (customColor) return customColor

    if (index !== undefined) {
      return resolvedColors.value[index % resolvedColors.value.length]
    }

    return resolvedColors.value[0]
  }

  // 获取基础样式配置
  const getBaseItemStyle = (color: string | undefined) => ({
    borderRadius: props.borderRadius,
    color
  })

  // 创建系列配置
  const createSeriesItem = (config: {
    name?: string
    data: number[]
    color?: string
    barWidth?: string | number
    stack?: string
  }) => {
    const animationConfig = getAnimationConfig()

    return {
      name: config.name,
      data: config.data,
      type: 'bar' as const,
      stack: config.stack,
      itemStyle: getBaseItemStyle(config.color),
      barWidth: config.barWidth || props.barWidth,
      ...animationConfig
    }
  }

  // 使用新的图表组件抽象
  const {
    chartRef,
    getAxisLineStyle,
    getAxisLabelStyle,
    getAxisTickStyle,
    getSplitLineStyle,
    getAnimationConfig,
    getTooltipStyle,
    getLegendStyle,
    getGridWithLegend
  } = useChartComponent({
    props,
    checkEmpty: () => {
      // 检查单数据情况
      if (Array.isArray(props.data) && typeof props.data[0] === 'number') {
        const singleData = props.data as number[]
        return !singleData.length || singleData.every((val) => val === 0)
      }

      // 检查多数据情况
      if (Array.isArray(props.data) && typeof props.data[0] === 'object') {
        const multiData = props.data as BarDataItem[]
        return (
          !multiData.length ||
          multiData.every((item) => !item.data?.length || item.data.every((val) => val === 0))
        )
      }

      return true
    },
    watchSources: [() => props.data, () => props.xAxisData, () => resolvedColors.value],
    generateOptions: (): EChartsOption => {
      const options: EChartsOption = {
        grid: getGridWithLegend(props.showLegend, props.legendPosition, {
          top: 15,
          right: 0,
          left: 0
        }),
        tooltip: props.showTooltip ? getTooltipStyle() : undefined,
        xAxis: {
          type: 'category',
          data: props.xAxisData,
          axisTick: getAxisTickStyle(),
          axisLine: getAxisLineStyle(props.showAxisLine),
          axisLabel: getAxisLabelStyle(props.showAxisLabel)
        },
        yAxis: {
          type: 'value',
          axisLabel: getAxisLabelStyle(props.showAxisLabel),
          axisLine: getAxisLineStyle(props.showAxisLine),
          splitLine: getSplitLineStyle(props.showSplitLine)
        }
      }

      // 添加图例配置
      if (props.showLegend) {
        options.legend = getLegendStyle(props.legendPosition)
      }

      // 生成系列数据
      if (isMultipleData.value) {
        const multiData = props.data as BarDataItem[]
        options.series = multiData.map((item, index) => {
          const computedColor = getColor(undefined, index)

          return createSeriesItem({
            name: item.name,
            data: item.data,
            color: computedColor,
            barWidth: item.barWidth,
            stack: props.stack ? item.stack || 'total' : undefined
          })
        })
      } else {
        // 单数据情况
        const singleData = props.data as number[]
        const computedColor = getColor()

        options.series = [
          createSeriesItem({
            name: props.seriesName || '系列1',
            data: singleData,
            color: computedColor
          })
        ]
      }

      return options
    }
  })
</script>
