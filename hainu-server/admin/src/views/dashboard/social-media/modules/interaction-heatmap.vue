<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">互动热力图</h3>
      <div class="text-right">
        <p class="text-sm font-semibold text-[var(--art-success)]">↑ 2.45%</p>
        <p class="mt-1 text-[22px] font-semibold leading-none text-g-900">231,232</p>
      </div>
    </header>
    <div class="px-5 py-5">
      <div class="grid grid-cols-[42px_minmax(0,1fr)] gap-3">
        <div class="grid grid-rows-6 gap-2 text-sm font-medium text-g-700">
          <span v-for="time in heatTimes" :key="time" class="h-8 leading-8">{{ time }}</span>
        </div>
        <div>
          <div class="grid grid-cols-7 gap-2">
            <template v-for="(row, rowIndex) in heatMap" :key="`row-${rowIndex}`">
              <span
                v-for="(cell, cellIndex) in row"
                :key="`cell-${rowIndex}-${cellIndex}`"
                class="h-8 rounded-[6px]"
                :style="{ background: getHeatColor(cell) }"
              ></span>
            </template>
          </div>
          <div class="mt-3 grid grid-cols-7 gap-2 text-center text-sm font-medium text-g-700">
            <span v-for="day in heatDays" :key="day">{{ day }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { getHeatColor, heatDays, heatMap, heatTimes } from '../shared'
</script>
