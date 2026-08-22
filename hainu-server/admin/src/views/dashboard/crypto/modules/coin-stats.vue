<template>
  <article class="art-card-sm flex h-[600px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">币种价格统计</h3>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="divide-y divide-[var(--default-border)]">
        <div
          v-for="item in coinStats"
          :key="item.label"
          class="flex items-center justify-between gap-3 px-5 py-5"
        >
          <div class="min-w-0">
            <p class="text-[15px] text-g-700">{{ item.label }}</p>
            <p v-if="item.tip" class="mt-1 text-[11px] font-semibold" :class="item.tipClass">
              {{ item.tip }}
            </p>
          </div>
          <p class="text-right text-[16px] font-semibold" :class="item.valueClass || 'text-g-900'">
            {{ item.value }}
          </p>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { coinStats } from '../shared'
</script>
