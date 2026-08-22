<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">受众年龄指标</h3>
    </header>
    <div class="space-y-5 px-5 py-5">
      <div
        v-for="item in ageMetrics"
        :key="item.label"
        class="grid grid-cols-[48px_minmax(0,1fr)_46px] items-center gap-3"
      >
        <span class="text-sm text-g-700">{{ item.label }}</span>
        <div class="h-4 rounded-full bg-g-200">
          <div
            class="h-full rounded-full"
            :style="{
              width: `${item.value}%`,
              background: `linear-gradient(90deg, ${artColors.primary}, color-mix(in oklab, var(--art-primary) 70%, var(--art-secondary)))`
            }"
          ></div>
        </div>
        <span class="text-right text-sm font-medium text-g-700">{{ item.count }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { ageMetrics, artColors } from '../shared'
</script>
