<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">浏览器使用洞察</h3>
    </header>
    <div class="space-y-1 px-5 py-3">
      <div
        v-for="browser in browserRows"
        :key="browser.name"
        class="flex items-center justify-between gap-3 py-3"
      >
        <div class="flex items-center gap-3">
          <span class="text-[28px]">{{ browser.emoji }}</span>
          <div>
            <p class="font-semibold text-g-900">{{ browser.name }}</p>
            <p class="text-[13px] text-g-600">{{ browser.company }}</p>
          </div>
        </div>
        <div class="min-w-[70px] text-right">
          <p class="font-semibold text-g-900">{{ browser.value }}</p>
          <span
            class="mt-2 ml-auto block h-1.5 w-12 rounded-full"
            :style="{ background: browser.color }"
          ></span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { browserRows } from '../shared'
</script>
