<template>
  <article class="art-card-sm flex h-full flex-col overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h2 class="text-[20px] font-semibold text-g-900">销售总览</h2>
      <div class="inline-flex rounded-[10px] bg-g-100 p-1">
        <button
          v-for="tab in overviewTabs"
          :key="tab.key"
          class="c-p rounded-custom-sm px-4 py-1 text-sm font-medium tad-200"
          :class="
            activeOverviewTab === tab.key
              ? 'bg-theme text-white shadow-sm'
              : 'text-g-600 hover:text-g-900'
          "
          @click="activeOverviewTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </header>

    <div class="px-4 pb-2 pt-4 sm:px-5">
      <div class="mb-3 flex flex-wrap items-center gap-4 text-[13px] font-medium text-g-700">
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: overviewColors[0] }"></span>
          订单总量
        </span>
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: overviewColors[1] }"></span>
          销售总额
        </span>
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: overviewColors[2] }"></span>
          营收
        </span>
      </div>
      <SalesOverviewChart
        :x-axis="currentOverviewData.xAxis"
        :orders="currentOverviewData.orders"
        :sales="currentOverviewData.sales"
        :revenue="currentOverviewData.revenue"
      />
    </div>

    <footer class="mt-auto grid grid-cols-1 border-t border-[var(--default-border)] md:grid-cols-3">
      <div
        v-for="metric in overviewSummary"
        :key="metric.label"
        class="border-b border-[var(--default-border)] px-5 py-4 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
      >
        <p class="text-[15px] text-g-700">{{ metric.label }}</p>
        <p class="mt-1 text-[24px] font-semibold text-g-900">{{ metric.value }}</p>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import SalesOverviewChart from './sales-overview-chart.vue'
  import {
    overviewChartMap,
    overviewSummary,
    overviewTabs,
    type OverviewTabKey,
    useSalesUiConfig
  } from '../shared'

  const activeOverviewTab = ref<OverviewTabKey>('day')
  const currentOverviewData = computed(() => overviewChartMap[activeOverviewTab.value])
  const { overviewColors } = useSalesUiConfig()
</script>
