<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <article
      v-for="card in statCards"
      :key="card.title"
      class="art-card-sm flex items-center justify-between rounded-[calc(var(--custom-radius)+4px)] px-5 py-7"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full text-xl text-white"
          :style="{ background: card.iconBg }"
        >
          <ArtSvgIcon :icon="card.icon" class="text-xl text-white" />
        </div>
        <div>
          <p class="text-[13px] font-medium text-g-700">{{ card.title }}</p>
          <p class="mt-1 text-[18px] font-semibold leading-none text-g-900">{{ card.value }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[13px] font-semibold" :class="card.changeClass">
          <ArtSvgIcon :icon="card.changeIcon" class="mr-1 inline text-base" />{{ card.change }}
        </p>
        <p class="mt-1 text-xs text-g-600">本年</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { statCards } from '../shared'
</script>
