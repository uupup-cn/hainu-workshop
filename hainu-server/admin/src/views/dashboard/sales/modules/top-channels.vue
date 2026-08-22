<template>
  <article class="art-card-sm flex h-[490px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">渠道表现</h3>
      <button class="text-g-600">
        <i class="ri-more-2-fill text-lg"></i>
      </button>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="px-5 py-3">
        <div
          v-for="channel in topChannels"
          :key="channel.name"
          class="flex items-center justify-between gap-3 py-3"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[18px]"
              :class="channel.logoClass"
            >
              <ArtSvgIcon :icon="channel.logoIcon" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-[15px] font-semibold text-g-900">{{ channel.name }}</p>
              <p class="truncate text-[13px] text-g-600">{{ channel.desc }}</p>
            </div>
          </div>
          <div class="w-[112px] shrink-0 text-right">
            <p class="text-[13px] font-semibold" :class="channel.changeClass">
              {{ channel.change }}
            </p>
            <div class="mt-1 flex items-center justify-end gap-2">
              <span class="text-[20px] font-semibold leading-none text-g-900">
                {{ channel.value }}
              </span>
            </div>
            <div class="mt-2 ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-g-200">
              <span
                class="block h-full rounded-full"
                :style="{ width: channel.barWidth, background: channel.barColor }"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { topChannels } from '../shared'
</script>
