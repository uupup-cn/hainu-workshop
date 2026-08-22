<template>
  <article class="art-card-sm max-h-[560px] overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">部门分布</h3>
    </header>
    <div class="px-10 py-5">
      <ArtHBarChart
        height="460px"
        :data="departmentValues"
        :x-axis-data="departmentLabels"
        :showAxisLine="false"
        :showLegend="false"
        :showSplitLine="false"
        barWidth="18px"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtHBarChart from '@/components/core/charts/art-h-bar-chart/index.vue'
  import { departmentLabels, departmentValues } from '../shared'
</script>
