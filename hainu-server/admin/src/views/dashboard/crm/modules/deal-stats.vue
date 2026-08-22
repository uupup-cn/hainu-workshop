<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">成交统计</h3>
    </header>
    <div class="px-3 py-3 sm:px-4">
      <div class="h-[280px] sm:h-[320px]">
        <ArtHBarChart
          height="100%"
          class="h-full"
          :data="dealStatsValues"
          :x-axis-data="dealStatsLabels"
          :showAxisLine="false"
          :showLegend="false"
          :showSplitLine="false"
          barWidth="13px"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtHBarChart from '@/components/core/charts/art-h-bar-chart/index.vue'
  import { dealStatsLabels, dealStatsValues } from '../shared'
</script>
