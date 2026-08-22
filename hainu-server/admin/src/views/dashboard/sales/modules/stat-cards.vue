<template>
  <div class="h-full space-y-5">
    <article
      v-for="card in statCards"
      :key="card.title"
      class="art-card-sm rounded-[0px]! relative overflow-hidden px-5 py-6"
    >
      <span class="absolute inset-y-0 left-0 w-[3px]" :style="{ background: card.accent }"></span>
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[13px] font-semibold text-g-800">{{ card.title }}</p>
          <p class="mt-3 text-[18px] font-semibold text-g-900 sm:text-[20px]">{{ card.value }}</p>
          <p class="mt-3 text-[13px]">
            <span class="font-semibold" :class="card.changeClass">
              <ArtSvgIcon :icon="card.changeIcon" class="mr-1 inline text-base" />
              {{ card.change }}
            </span>
            <span class="text-g-600">本月</span>
          </p>
        </div>
        <div
          class="flex h-11 w-11 items-center justify-center rounded-[10px]"
          :class="card.iconClass"
        >
          <ArtSvgIcon :icon="card.icon" class="text-lg" />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { statCards } from '../shared'
</script>
