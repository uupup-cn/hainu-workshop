<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">受众性别分布</h3>
    </header>
    <div class="px-5 py-5">
      <div class="mb-4 flex items-center justify-center gap-5 text-[13px] font-medium text-g-700">
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ background: artColors.primary }"></span>
          男性
        </span>
        <span class="flex items-center gap-2">
          <span
            class="h-2.5 w-2.5 rounded-full"
            :style="{ background: artColors.secondary }"
          ></span>
          女性
        </span>
      </div>
      <ArtRadarChart
        height="255px"
        :indicator="genderIndicators"
        :data="genderRadarData"
        :showLegend="false"
      />
      <div class="mt-5 grid grid-cols-2 border-t border-[var(--default-border)]">
        <div class="px-4 py-4 text-center">
          <p class="text-sm text-g-600">男性</p>
          <p class="mt-1 text-[24px] font-semibold" :style="{ color: artColors.primary }">13.08K</p>
        </div>
        <div class="border-l border-[var(--default-border)] px-4 py-4 text-center">
          <p class="text-sm text-g-600">女性</p>
          <p class="mt-1 text-[24px] font-semibold" :style="{ color: artColors.secondary }">
            11.02K
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtRadarChart from '@/components/core/charts/art-radar-chart/index.vue'
  import { artColors, genderIndicators, genderRadarData } from '../shared'
</script>
