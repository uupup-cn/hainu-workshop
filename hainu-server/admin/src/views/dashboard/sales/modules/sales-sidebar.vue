<template>
  <div class="flex h-full flex-col space-y-5">
    <div class="flex flex-col gap-3 lg:flex-row 2xl:flex-col">
      <div class="flex flex-1 items-center gap-3">
        <ElDatePicker
          v-model="dateRange"
          class="w-full"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD"
        />
        <ArtIconButton
          icon="ri:refresh-line"
          class="size-9 shrink-0 border border-[var(--default-border)] text-[18px]"
        />
        <ArtIconButton
          icon="ri:filter-3-line"
          class="size-9 shrink-0 border border-[var(--default-border)] text-[18px]"
        />
      </div>
    </div>

    <article
      class="relative overflow-hidden rounded-[calc(var(--custom-radius))] bg-theme/88 px-5 py-5 text-white shadow-sm"
    >
      <div
        class="absolute top-5 h-24 w-24 rounded-full bg-white/10 blur-2xl"
        :style="heroGlowStyle"
      />
      <div
        class="absolute -bottom-10 h-28 w-28 rounded-full border border-white/20"
        :style="heroRingStyle"
      ></div>
      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="max-w-[210px]">
          <p class="text-[12px] font-medium text-white/80">销售助手</p>
          <h3 class="mt-2 text-[18px] font-semibold leading-tight">你好，周子航</h3>
          <p class="mt-2 text-sm leading-6 text-white/85">
            这里是今日销售快报，新的订单、成交客户与回款情况都已更新。
          </p>
          <ElButton class="mt-4 bg-white! !text-black" type="primary">
            升级专业版
            <i :class="upgradeArrowIcon" :style="upgradeArrowStyle"></i>
          </ElButton>
        </div>
        <div class="flex h-24 w-24 items-end justify-center rounded-full bg-white/10 p-4">
          <i class="ri-presentation-line text-[48px] text-white/90"></i>
        </div>
      </div>
    </article>

    <article class="art-card-sm flex-1 overflow-hidden">
      <header class="border-b-d flex items-center justify-between px-5 py-4">
        <h3 class="text-[18px] font-semibold text-g-900">访客设备分布</h3>
        <a href="javascript:void(0)" class="text-sm text-g-600">
          查看报告 {{ isRtl ? '←' : '→' }}
        </a>
      </header>
      <div class="px-4 py-4">
        <ArtRadarChart
          height="240px"
          :indicator="deviceIndicators"
          :data="deviceRadarData"
          :colors="deviceRadarColors"
          :showLegend="false"
          :disableEmphasis="true"
        />
        <div
          class="mt-1 flex flex-wrap items-center justify-center gap-4 pb-1 text-[13px] font-medium text-g-700"
        >
          <span v-for="item in deviceLegend" :key="item.name" class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ background: item.color }"></span>
            {{ item.name }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ArtRadarChart from '@/components/core/charts/art-radar-chart/index.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { deviceIndicators, deviceLegend, deviceRadarColors, deviceRadarData } from '../shared'

  const dateRange = ref(['2026-04-01', '2026-05-01'])
  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)
  const heroGlowStyle = computed(() => ({
    insetInlineEnd: '-1.75rem'
  }))
  const heroRingStyle = computed(() => ({
    insetInlineEnd: '2rem'
  }))
  const upgradeArrowStyle = computed(() => ({
    marginInlineStart: '0.25rem'
  }))
  const upgradeArrowIcon = computed(() =>
    isRtl.value ? 'ri-arrow-left-line' : 'ri-arrow-right-line'
  )
</script>
