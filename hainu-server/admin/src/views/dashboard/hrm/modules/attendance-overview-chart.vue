<template>
  <div ref="chartRef" class="w-full" :style="{ height }"></div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import type { EChartsOption } from '@/plugins/echarts'
  import type { BaseChartProps } from '@/types/component/chart'

  defineOptions({ name: 'AttendanceOverviewChart' })

  interface AttendanceItem {
    label: string
    value: number
    color?: string
  }

  interface Props extends BaseChartProps {
    data: AttendanceItem[]
    total: number
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '210px',
    colors: () => useChartOps().colors
  })

  const chartData = computed(() =>
    props.data.map((item, index) => ({
      name: item.label,
      value: item.value,
      itemStyle: {
        color: item.color || props.colors?.[index % props.colors.length],
        borderRadius: 2
      }
    }))
  )

  const { chartRef, isDark, getAnimationConfig, getTooltipStyle } = useChartComponent({
    props,
    checkEmpty: () => !props.data.length,
    watchSources: [() => props.data, () => props.total],
    generateOptions: (): EChartsOption => {
      const centerColor = isDark.value ? '#e3e3e8' : '#2f3656'

      return {
        tooltip: getTooltipStyle('item', {
          formatter: '{b}: {c}'
        }),
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: '46%',
              style: {
                text: `{title|总计}\n{value|${props.total}}`,
                fill: centerColor,
                align: 'center',
                verticalAlign: 'middle',
                rich: {
                  title: {
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 24,
                    align: 'center'
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 18,
                    align: 'center'
                  }
                }
              }
            }
          ]
        },
        series: [
          {
            type: 'pie',
            radius: ['76%', '100%'],
            center: ['50%', '62%'],
            startAngle: 190,
            endAngle: 350,
            minAngle: 8,
            avoidLabelOverlap: true,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderColor: isDark.value ? '#161618' : '#fff',
              borderWidth: 6
            },
            data: chartData.value,
            color: props.colors,
            ...getAnimationConfig(60, 1200)
          }
        ]
      }
    }
  })
</script>
