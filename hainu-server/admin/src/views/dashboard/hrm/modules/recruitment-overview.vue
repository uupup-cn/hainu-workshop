<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">招聘概览</h3>
    </header>
    <div
      class="grid grid-cols-1 border-b border-dashed border-[var(--default-border)] sm:grid-cols-2"
    >
      <div class="px-5 py-4 text-center">
        <p class="text-[15px] text-g-600">累计录用人数</p>
        <p class="mt-2 text-[26px] font-semibold leading-none text-g-900">624</p>
      </div>
      <div
        class="px-5 py-4 text-center sm:border-l sm:border-dashed sm:border-[var(--default-border)]"
      >
        <p class="text-[15px] text-g-600">累计反馈数</p>
        <p class="mt-2 text-[26px] font-semibold leading-none text-g-900">2,036</p>
      </div>
    </div>
    <div class="px-4 pb-4 pt-4 sm:px-5">
      <ArtBarChart
        height="345px"
        :data="candidateChartData"
        :colors="[getCssVar('--theme-color'), getCssVar('--el-color-primary-light-8')]"
        :x-axis-data="months"
        :showAxisLine="false"
        :showLegend="true"
        legendPosition="bottom"
        :showSplitLine="true"
        :borderRadius="2"
        barWidth="30%"
        stack
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import { getCssVar } from '@/utils/ui'
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import { candidateChartData, months } from '../shared'
</script>
