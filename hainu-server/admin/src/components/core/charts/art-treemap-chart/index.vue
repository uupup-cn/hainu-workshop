<!-- 矩形树图 -->
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
  import type { TreemapChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtTreemapChart' })

  const props = withDefaults(defineProps<TreemapChartProps>(), {
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    data: () => [],
    showLabel: true,
    breadcrumbHeight: 22,

    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  const { chartRef, isDark, getTooltipStyle } = useChartComponent({
    props,
    checkEmpty: () => !props.data?.length || props.data.every((item) => item.value === 0),
    watchSources: [() => props.data, () => props.colors],
    generateOptions: (): EChartsOption => {
      return {
        color: props.colors,
        tooltip: props.showTooltip
          ? getTooltipStyle('item', {
              formatter: '{b}: {c}'
            })
          : undefined,
        series: [
          {
            type: 'treemap',
            roam: false,
            nodeClick: false,
            breadcrumb: {
              show: false,
              height: props.breadcrumbHeight
            },
            label: {
              show: props.showLabel,
              formatter: '{b}',
              color: '#fff',
              fontSize: 13
            },
            upperLabel: {
              show: false
            },
            itemStyle: {
              gapWidth: 4,
              borderColor: isDark.value ? '#111827' : '#fff',
              borderWidth: 2,
              borderRadius: 8
            },
            emphasis: {
              itemStyle: {
                borderColor: props.colors[0]
              }
            },
            levels: [
              {
                colorSaturation: [0.35, 0.65],
                itemStyle: {
                  gapWidth: 4,
                  borderColor: isDark.value ? '#111827' : '#fff'
                }
              }
            ],
            data: props.data
          }
        ]
      }
    }
  })
</script>
