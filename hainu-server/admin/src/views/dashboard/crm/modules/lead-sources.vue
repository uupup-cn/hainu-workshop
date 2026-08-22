<template>
  <article class="art-card-sm flex h-[674px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-3.5">
      <h3 class="text-[18px] font-semibold text-g-900">潜客来源</h3>
    </header>
    <div class="border-b-d px-4 py-3">
      <div class="mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center">
        <ArtRingChart
          height="100%"
          :data="leadSourceChartData"
          :radius="['0%', '70%']"
          roseType="radius"
          :borderRadius="0"
          :showLegend="false"
        />
      </div>
    </div>

    <ElScrollbar class="h-[380px] flex-1">
      <div
        v-for="source in leadSources"
        :key="source.name"
        class="border-b-d flex min-h-[56px] items-center justify-between gap-3 px-5 py-3.5 last:border-b-0"
      >
        <div class="flex items-center gap-3 text-[13px] font-medium text-g-800">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: source.color }"></span>
          <span>{{ source.name }}</span>
        </div>
        <div class="flex items-center gap-3 text-[13px]">
          <span :class="source.changeClass">{{ source.change }}</span>
          <span class="text-[13px] font-semibold text-g-900">{{ source.value }}</span>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import ArtRingChart from '@/components/core/charts/art-ring-chart/index.vue'
  import { leadSourceChartData, leadSources } from '../shared'
</script>
