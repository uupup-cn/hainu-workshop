<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
    <article
      v-for="card in marketCards"
      :key="card.symbol"
      class="art-card-sm flex items-center justify-between px-5 py-5"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
          :style="{ background: card.logoBg, color: card.logoColor }"
        >
          <span>{{ card.logoText }}</span>
        </div>
        <div>
          <p class="text-[13px] font-medium text-g-700">{{ card.value }}</p>
          <p class="mt-1 text-[14px] font-semibold text-g-900">{{ card.symbol }}</p>
          <p class="mt-2 text-[13px] font-semibold" :class="card.changeClass">
            <ArtSvgIcon :icon="card.changeIcon" class="mr-1 inline text-base" />
            {{ card.change }}
          </p>
        </div>
      </div>
      <svg viewBox="0 0 86 28" class="h-8 w-[86px] shrink-0">
        <path
          :d="buildSparkPath(card.sparkline)"
          fill="none"
          :stroke="card.sparkColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { buildSparkPath, marketCards } from '../shared'
</script>
