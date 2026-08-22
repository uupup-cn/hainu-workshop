<template>
  <article class="art-card-sm flex h-[600px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">交易历史</h3>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="space-y-1 px-5 py-3">
        <div
          v-for="item in transactionHistory"
          :key="`${item.type}-${item.time}`"
          class="flex items-center justify-between gap-3 py-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold"
              :class="item.iconClass"
            >
              <span v-if="item.iconText">{{ item.iconText }}</span>
              <ArtSvgIcon v-else :icon="item.icon!" class="text-lg" />
            </div>
            <div>
              <p class="text-[14px] font-semibold text-g-900">{{ item.type }}</p>
              <p class="mt-1 text-[13px] text-g-600">{{ item.time }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[14px] text-g-900">{{ item.amount }}</p>
            <span
              class="mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold"
              :class="item.statusClass"
            >
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { transactionHistory } from '../shared'
</script>
