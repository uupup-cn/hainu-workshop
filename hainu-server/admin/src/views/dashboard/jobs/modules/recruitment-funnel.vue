<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">招聘漏斗</h3>
    </header>
    <ElScrollbar class="min-h-0 flex-1">
      <div class="px-5 py-5">
        <div class="flex h-3 overflow-hidden rounded-full bg-g-200">
          <span
            v-for="item in acquisitionProgress"
            :key="item.label"
            class="h-full"
            :style="{ width: item.percent, background: item.color }"
          ></span>
        </div>
        <div class="mt-5 space-y-2">
          <div
            v-for="item in acquisitionProgress"
            :key="`${item.label}-detail`"
            class="border-b-d flex items-center justify-between gap-3 py-4 last:border-b-0"
          >
            <span class="flex items-center gap-2 text-[15px] text-g-800">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ background: item.color }"></span>
              {{ item.label }}
            </span>
            <span
              class="rounded-full px-2.5 py-1 text-[12px] font-semibold"
              :style="{ background: item.badgeBg, color: item.color }"
            >
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { acquisitionProgress } from '../shared'
</script>
