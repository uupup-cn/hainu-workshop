<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">终端会话占比</h3>
      <button class="text-sm text-g-600">
        查看详情 <i class="ri-arrow-down-s-line ml-1"></i>
      </button>
    </header>
    <div class="px-4 py-4">
      <ArtRingChart
        height="320px"
        :data="deviceSessionData"
        :radius="['58%', '70%']"
        :borderRadius="0"
        centerText="4232"
        :showLegend="false"
      />
    </div>
    <div class="mt-4 grid grid-cols-3 border-t border-[var(--default-border)]">
      <div
        v-for="item in deviceStats"
        :key="item.name"
        class="border-r border-[var(--default-border)] px-4 py-4 text-center last:border-r-0"
      >
        <p class="text-[18px] font-semibold text-g-900">{{ item.value }}</p>
        <p class="mt-1 text-sm text-g-600">{{ item.name }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtRingChart from '@/components/core/charts/art-ring-chart/index.vue'
  import { deviceSessionData, deviceStats } from '../shared'
</script>
