<template>
  <article class="art-card-sm flex-1 overflow-hidden mb-5">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">平均会话时长</h3>
    </header>
    <div class="flex h-full flex-col px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[color-mix(in_oklab,var(--art-primary)_10%,var(--default-box-color))] text-[var(--art-primary)]"
          >
            <ArtSvgIcon icon="ri:bar-chart-grouped-line" />
          </div>
          <div>
            <p class="text-[18px] font-semibold text-g-900">4分08秒</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-g-600">较上周</p>
          <p class="mt-1 text-sm font-semibold text-[var(--art-success)]">
            1.25% <i class="ri-arrow-up-line"></i>
          </p>
        </div>
      </div>

      <div class="mt-5 flex-1">
        <ArtBarChart
          class="box-border"
          height="215px"
          :data="averageSessionBarValues"
          :x-axis-data="averageSessionDays"
          :showAxisLine="false"
          :showLegend="false"
          :showSplitLine="false"
          barWidth="14px"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtBarChart from '@/components/core/charts/art-bar-chart/index.vue'
  import { averageSessionBarValues, averageSessionDays } from '../shared'
</script>
