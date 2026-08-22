<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">候选人概览</h3>
    </header>
    <div class="relative px-5 py-6">
      <ArtRingChart
        height="210px"
        :data="candidateOverviewData"
        :radius="['62%', '76%']"
        :borderRadius="0"
        :showLegend="true"
        legendPosition="bottom"
        centerText="¥328,460"
      />
    </div>
    <div class="border-t-d">
      <ElScrollbar class="h-[148px]">
        <div>
          <div
            v-for="item in candidateSummary"
            :key="item.label"
            class="border-b-d flex items-center justify-between gap-3 px-5 py-3.5 last:border-b-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-[10px]"
                :style="{ background: item.iconBg, color: item.iconColor }"
              >
                <ArtSvgIcon :icon="item.icon" />
              </div>
              <div>
                <p class="text-[15px] text-g-700">{{ item.label }}</p>
                <p class="mt-1 text-[18px] font-semibold leading-none text-g-900">
                  {{ item.value }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[15px] font-semibold" :class="item.changeClass">{{ item.change }}</p>
              <p class="mt-1 text-sm text-g-600">今年</p>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
  </article>
</template>

<script setup lang="ts">
  import ArtRingChart from '@/components/core/charts/art-ring-chart/index.vue'
  import { candidateOverviewData, candidateSummary } from '../shared'
</script>
