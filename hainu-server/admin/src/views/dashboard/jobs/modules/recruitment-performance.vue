<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">招聘绩效</h3>
    </header>
    <div class="px-4 pb-3 pt-3 sm:px-5">
      <ArtBarChart
        class="box-border"
        height="340px"
        :data="performanceData"
        :x-axis-data="performanceMonths"
        :showAxisLine="false"
        :showLegend="true"
        :showSplitLine="true"
        barWidth="26%"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import { performanceData, performanceMonths } from '../shared'
</script>
