<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">热门成交</h3>
    </header>
    <div class="px-5 py-3">
      <div
        v-for="deal in topDeals"
        :key="deal.name"
        class="flex items-center justify-between gap-3 py-3"
      >
        <div class="flex min-w-0 items-center gap-3">
          <img :src="deal.avatar" :alt="deal.name" class="h-11 w-11 rounded-full object-cover" />
          <div class="min-w-0">
            <p class="truncate text-[15px] font-semibold text-g-900">{{ deal.name }}</p>
            <p class="truncate text-[13px] text-g-600">{{ deal.email }}</p>
          </div>
        </div>
        <p class="text-[16px] font-semibold text-g-900">{{ deal.amount }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { topDeals } from '../shared'
</script>
