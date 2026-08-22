<template>
  <article class="art-card-sm flex flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">资产概览</h3>
    </header>
    <div class="flex flex-1 flex-col space-y-5 px-5 py-5">
      <ArtRingChart
        height="180px"
        :data="assetRingData"
        :radius="['62%', '78%']"
        :borderRadius="0"
        centerText="254"
        :showLegend="false"
      />
      <div class="space-y-4 border-t border-dashed border-[var(--default-border)] pt-4">
        <div
          v-for="item in assetOverviewRows"
          :key="item.label"
          class="flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-[10px]"
              :class="item.iconClass"
            >
              <ArtSvgIcon :icon="item.icon" class="text-lg" />
            </div>
            <div>
              <p class="text-[14px] font-semibold text-g-600">{{ item.label }}</p>
              <p class="mt-1 text-[17px] font-semibold text-g-900">{{ item.value }}</p>
            </div>
          </div>
          <div class="text-right text-sm">
            <p class="text-g-600">本年度</p>
            <p class="mt-1 font-semibold" :class="item.changeClass">{{ item.change }}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtRingChart from '@/components/core/charts/art-ring-chart/index.vue'
  import { assetOverviewRows, assetRingData } from '../shared'
</script>
