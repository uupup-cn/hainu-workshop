<!-- 仪表盘 -->
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
  import { storeToRefs } from 'pinia'
  import type { EChartsOption } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import { useSettingStore } from '@/store/modules/setting'
  import type { GaugeChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtGaugeChart' })

  const { themeCustomizer } = storeToRefs(useSettingStore())

  const props = withDefaults(defineProps<GaugeChartProps>(), {
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => [],

    value: 0,
    name: '完成率',
    min: 0,
    max: 100,
    unit: '%',
    startAngle: 210,
    endAngle: -30,
    splitNumber: 10,
    showProgress: true,
    axisLineWidth: 14
  })

  const percentValue = computed(() => {
    const range = props.max - props.min
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (props.value - props.min) / range))
  })

  const resolvedColors = computed(() => {
    return props.colors?.length ? props.colors : themeCustomizer.value.chartThemeColors
  })

  const gaugeColor = computed(() => resolvedColors.value[0])

  const { chartRef, isDark } = useChartComponent({
    props,
    checkEmpty: () => false,
    watchSources: [() => props.value, () => props.max, () => props.min, () => resolvedColors.value],
    generateOptions: (): EChartsOption => {
      return {
        series: [
          {
            name: props.name,
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '84%',
            min: props.min,
            max: props.max,
            startAngle: props.startAngle,
            endAngle: props.endAngle,
            splitNumber: props.splitNumber,
            progress: {
              show: props.showProgress,
              roundCap: true,
              width: props.axisLineWidth,
              itemStyle: {
                color: gaugeColor.value
              }
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: props.axisLineWidth,
                color: [
                  [percentValue.value, gaugeColor.value],
                  [1, isDark.value ? '#2f2f2f' : '#edf1f7']
                ]
              }
            },
            axisTick: {
              distance: -(props.axisLineWidth + 4),
              splitNumber: 5,
              lineStyle: {
                width: 1,
                color: isDark.value ? '#555' : '#d5d9e3'
              }
            },
            splitLine: {
              distance: -(props.axisLineWidth + 4),
              length: 12,
              lineStyle: {
                width: 2,
                color: isDark.value ? '#777' : '#c3c9d4'
              }
            },
            axisLabel: {
              distance: 30,
              color: isDark.value ? '#9ca3af' : '#7b8190',
              fontSize: 12
            },
            pointer: {
              show: true,
              length: '52%',
              width: 5,
              itemStyle: {
                color: gaugeColor.value
              }
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 12,
              itemStyle: {
                color: gaugeColor.value,
                borderColor: isDark.value ? '#111' : '#fff',
                borderWidth: 4
              }
            },
            detail: {
              valueAnimation: true,
              offsetCenter: [0, '66%'],
              formatter: `{value}${props.unit}`,
              color: isDark.value ? '#f3f4f6' : '#1f2937',
              fontSize: 28,
              fontWeight: 700
            },
            title: {
              offsetCenter: [0, '44%'],
              color: isDark.value ? '#9ca3af' : '#8a90a2',
              fontSize: 13
            },
            data: [
              {
                value: props.value,
                name: props.name
              }
            ]
          }
        ]
      }
    }
  })
</script>
