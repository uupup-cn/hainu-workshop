<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">员工结构</h3>
    </header>
    <div class="px-5 py-5">
      <div class="flex h-5 overflow-hidden rounded-full bg-g-200">
        <span
          v-for="segment in employeeStatusSegments"
          :key="segment.label"
          class="flex items-center justify-center text-[12px] font-semibold text-white"
          :style="{ width: segment.percent, background: segment.color }"
        >
          {{ segment.percent }}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <div
          v-for="item in employeeStatusItems"
          :key="item.label"
          class="flex items-center justify-between gap-3 text-[15px]"
        >
          <span class="flex items-center gap-2 text-g-800">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ background: item.color }"></span>
            {{ item.label }}
          </span>
          <span class="font-semibold text-g-900">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { employeeStatusItems, employeeStatusSegments } from '../shared'
</script>
