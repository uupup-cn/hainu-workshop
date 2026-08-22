<template>
  <article class="art-card-sm flex h-[520px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">最近交易</h3>
      <button class="text-g-600">
        <i class="ri-more-2-fill text-lg"></i>
      </button>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div>
        <div
          v-for="transaction in transactions"
          :key="transaction.orderNo"
          class="border-b-d px-5 py-4 last:border-b-0"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-[15px] font-semibold text-g-900">
                订单号 - {{ transaction.orderNo }}
              </p>
              <p class="mt-1 text-[13px] text-g-600">{{ transaction.items }} 件商品</p>
            </div>
            <div class="text-right">
              <p class="text-[18px] font-semibold leading-none text-g-900">
                {{ transaction.price }}
              </p>
              <p class="mt-1 text-[13px] text-g-600">{{ transaction.date }}</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between gap-3">
            <span
              class="rounded-full px-3 py-1 text-[11px] font-semibold"
              :class="getInvoiceStatusClass(transaction.status)"
            >
              {{ transaction.status }}
            </span>
            <div class="flex items-center">
              <img
                v-for="(item, index) in transaction.avatars"
                :key="`${transaction.orderNo}-${index}`"
                :src="item"
                alt="头像"
                class="-ml-2 h-8 w-8 rounded-full border-2 border-white object-cover first:ml-0 dark:border-[var(--default-box-color)]"
              />
              <span
                v-if="transaction.extra"
                class="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-[11px] font-semibold text-white dark:border-[var(--default-box-color)]"
              >
                +{{ transaction.extra }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { getInvoiceStatusClass, transactions } from '../shared'
</script>
