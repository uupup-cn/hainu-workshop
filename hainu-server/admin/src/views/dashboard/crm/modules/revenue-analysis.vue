<template>
  <article class="art-card-sm flex flex-1 flex-col overflow-hidden">
    <header class="border-b-d flex items-center px-5 py-3.5">
      <h3 class="text-[18px] font-semibold text-g-900">营收分析</h3>
    </header>
    <div class="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <ArtBarChart
        class="box-border"
        height="350px"
        :data="revenueValues"
        :x-axis-data="months"
        seriesName="收入"
        :showAxisLine="false"
        :showLegend="true"
        barWidth="34%"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import { months, revenueValues } from '../shared'
</script>
