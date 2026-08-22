<!-- 漏斗图 -->
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
  import type { FunnelChartProps } from '@/types/component/chart'

  defineOptions({ name: 'ArtFunnelChart' })

  const props = withDefaults(defineProps<FunnelChartProps>(), {
    height: useChartOps().chartHeight,
    loading: false,
    isEmpty: false,
    colors: () => useChartOps().colors,

    data: () => [],
    sort: 'descending',
    showLabel: true,

    showTooltip: true,
    showLegend: false,
    legendPosition: 'bottom'
  })

  const { chartRef, isDark, getAnimationConfig, getTooltipStyle, getLegendStyle } =
    useChartComponent({
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
          legend: props.showLegend ? getLegendStyle(props.legendPosition) : undefined,
          series: [
            {
              name: '漏斗图',
              type: 'funnel',
              top: props.showLegend && props.legendPosition === 'top' ? 40 : 10,
              bottom: props.showLegend && props.legendPosition === 'bottom' ? 40 : 10,
              left: props.showLegend && props.legendPosition === 'left' ? 100 : '10%',
              right: props.showLegend && props.legendPosition === 'right' ? 100 : '10%',
              min: 0,
              minSize: '20%',
              maxSize: '100%',
              sort: props.sort,
              gap: 4,
              label: {
                show: props.showLabel,
                position: 'inside',
                color: '#fff',
                formatter: '{b}'
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                borderRadius: 6,
                borderColor: isDark.value ? '#1f1f1f' : '#fff',
                borderWidth: 2
              },
              emphasis: {
                label: {
                  color: '#fff'
                }
              },
              data: props.data,
              ...getAnimationConfig(80, 1200)
            }
          ]
        }
      }
    })
</script>
