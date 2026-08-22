<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">买卖加密货币</h3>
    </header>
    <div class="space-y-5 px-5 py-5">
      <div class="grid grid-cols-2 rounded-custom-sm bg-g-100 p-1">
        <button
          v-for="tab in tradeTabs"
          :key="tab"
          class="c-p rounded-custom-sm px-4 py-2 text-sm font-semibold tad-200"
          :class="
            activeTradeTab === tab
              ? 'bg-[var(--default-box-color)] text-g-900 shadow-sm dark:bg-g-300 dark:text-white'
              : 'text-g-600 hover:bg-black/[0.04] dark:text-g-800 dark:hover:bg-black/20'
          "
          @click="activeTradeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-[minmax(0,1fr)_74px] gap-2">
          <ElInput v-model="tradeForm.value" placeholder="输入金额" />
          <ElSelect v-model="tradeForm.valueUnit">
            <ElOption label="BTC" value="BTC" />
            <ElOption label="ETH" value="ETH" />
            <ElOption label="USDT" value="USDT" />
          </ElSelect>
        </div>
        <div class="grid grid-cols-[minmax(0,1fr)_74px] gap-2">
          <ElInput v-model="tradeForm.amount" placeholder="获得数量" />
          <ElSelect v-model="tradeForm.amountUnit">
            <ElOption label="USD" value="USD" />
            <ElOption label="BTC" value="BTC" />
            <ElOption label="LTC" value="LTC" />
          </ElSelect>
        </div>
      </div>

      <div class="space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-g-600">价格：</span>
          <span class="font-semibold text-g-800">6.103435 BTC</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-g-600">数量：</span>
          <span class="font-semibold text-g-800">2,344,543.00 LTC</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-g-600">总计：</span>
          <span class="text-[18px] font-semibold text-g-900">22.50 BTC</span>
        </div>
        <p class="font-semibold text-[var(--art-success)]">附加费用：0.30%（0.0001131 BTC）</p>
      </div>

      <div>
        <p class="mb-3 text-[13px] font-semibold uppercase tracking-[0.03em] text-g-700">
          选择支付方式：
        </p>
        <div class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.value"
            class="c-p flex items-center gap-3 rounded-custom-sm border border-[var(--default-border)] px-4 py-3"
          >
            <input v-model="selectedPaymentMethod" type="radio" :value="method.value" />
            <span class="font-medium text-g-800">{{ method.label }}</span>
          </label>
        </div>
      </div>

      <ElButton type="primary" class="!h-11 !w-full !text-base !font-semibold">
        购买加密货币
      </ElButton>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { paymentMethods, tradeTabs } from '../shared'

  const activeTradeTab = ref('买入')

  const tradeForm = reactive({
    value: '',
    valueUnit: 'BTC',
    amount: '',
    amountUnit: 'USD'
  })

  const selectedPaymentMethod = ref('card')
</script>
