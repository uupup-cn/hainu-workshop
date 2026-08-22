<template>
  <article class="art-card-sm flex h-[490px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">重点客户</h3>
      <a href="javascript:void(0)" class="text-sm text-g-600">查看全部 →</a>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="space-y-3 px-5 py-4">
        <div
          v-for="customer in topCustomers"
          :key="customer.name"
          class="flex items-center justify-between gap-3 rounded-[calc(var(--custom-radius))] border border-dashed border-[var(--default-border-dashed)] px-4 py-3"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-sm font-semibold"
              :class="customer.badgeClass"
            >
              {{ customer.initials }}
            </span>
            <div class="min-w-0">
              <p class="truncate text-[15px] font-semibold text-g-900">{{ customer.name }}</p>
              <p class="truncate text-[13px] text-g-600">{{ customer.email }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[18px] font-semibold leading-none" :class="customer.amountClass">
              {{ customer.amount }}
            </p>
            <p class="mt-1 text-[12px] text-g-600">累计消费</p>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { topCustomers } from '../shared'
</script>
