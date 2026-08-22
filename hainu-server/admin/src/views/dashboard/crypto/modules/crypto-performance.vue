<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">加密货币表现</h3>
    </header>
    <div class="space-y-5 px-5 py-5">
      <div class="rounded-custom-sm border border-dashed border-[var(--default-border)] px-4 py-4">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white"
              :style="{ background: artColors.warning }"
            >
              ₿
            </div>
            <div>
              <p class="text-[18px] font-semibold text-g-900">比特币 - BTC</p>
              <p class="mt-1 text-sm text-g-600">主力币种 · 24 小时走势</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span class="text-[18px] text-g-900">$43,182.56 USD</span>
            <span class="text-[var(--art-success)]">0.28%（24小时）</span>
            <span class="text-g-700">
              开盘 <span class="text-[var(--art-success)]">6612.98</span>
            </span>
            <span class="text-g-700">
              最高 <span class="text-[var(--art-success)]">6625.97</span>
            </span>
            <span class="text-g-700">
              最低 <span class="text-[var(--art-danger)]">6612.34</span>
            </span>
            <span class="text-g-700">
              收盘 <span class="text-[var(--art-success)]">6623.45</span>
            </span>
          </div>
        </div>
      </div>

      <ArtKLineChart height="420px" :data="kLineData" :showDataZoom="false" />
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtKLineChart from '@/components/core/charts/art-k-line-chart/index.vue'
  import { artColors, kLineData } from '../shared'
</script>
