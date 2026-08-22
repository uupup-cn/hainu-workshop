<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">受众趋势</h3>
    </header>
    <div class="px-4 pb-5 pt-16 sm:px-5">
      <ArtBarChart
        class="box-border"
        height="355px"
        :data="audienceBarValues"
        :x-axis-data="months"
        :showAxisLine="false"
        :showLegend="false"
        :showSplitLine="true"
        barWidth="28%"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import { audienceBarValues, months } from '../shared'
</script>
