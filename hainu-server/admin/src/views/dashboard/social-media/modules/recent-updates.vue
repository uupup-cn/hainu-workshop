<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">最近动态</h3>
    </header>
    <div class="space-y-1 px-5 py-3">
      <div
        v-for="item in activities"
        :key="item.platform"
        class="flex items-start justify-between gap-3 py-3"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full text-lg"
            :class="item.iconClass"
          >
            <ArtSvgIcon :icon="item.icon" class="text-lg" />
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-g-900">{{ item.platform }}</p>
            <p class="mt-1 truncate text-[13px] text-g-600">{{ item.content }}</p>
          </div>
        </div>
        <span
          class="whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold"
          :class="item.tagClass"
        >
          {{ item.time }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { activities } from '../shared'
</script>
