<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">主页流量趋势</h3>
    </header>
    <div class="px-4 pb-4 pt-5 sm:px-5">
      <ArtLineChart
        height="400px"
        :data="profileVisitSeries"
        :x-axis-data="monthLabels"
        :showLegend="true"
        legendPosition="top"
        :showAreaColor="false"
        :showTooltip="true"
        :showAxisLine="false"
        :showSplitLine="true"
        symbol="circle"
        :symbolSize="7"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtLineChart from '@/components/core/charts/art-line-chart/index.vue'
  import { monthLabels, profileVisitSeries } from '../shared'
</script>
