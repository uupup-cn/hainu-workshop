<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">高引荐页面</h3>
    </header>
    <div class="px-5 py-5">
      <div class="flex items-end gap-3">
        <span class="text-[20px] font-semibold text-g-900">4,968</span>
        <span class="text-sm font-semibold text-[var(--art-success)]">
          1.38 <i class="ri-arrow-up-line"></i>
        </span>
        <span class="text-sm text-g-600">较上周对比</span>
      </div>
      <div class="mt-4 flex h-2.5 overflow-hidden rounded-full bg-g-200">
        <span
          v-for="segment in referralSegments"
          :key="segment.color"
          class="h-full rounded-full"
          :style="{ width: segment.width, background: segment.color }"
        ></span>
      </div>
      <div class="mt-5 space-y-4">
        <div
          v-for="page in referralRows"
          :key="page.url"
          class="flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ background: page.color }"></span>
            <span class="text-[14px] text-g-800">{{ page.url }}</span>
          </div>
          <span class="font-medium text-g-700">{{ page.value }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { referralRows, referralSegments } from '../shared'
</script>
