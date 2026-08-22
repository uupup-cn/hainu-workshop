<template>
  <article class="art-card-sm flex h-[490px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">最近动态</h3>
      <a href="javascript:void(0)" class="text-sm text-g-600">查看全部 →</a>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="relative px-5 py-4">
        <span
          class="absolute top-6 bottom-6 w-px bg-[var(--default-border)]"
          :style="timelineLineStyle"
        ></span>
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="relative grid grid-cols-[74px_18px_minmax(0,1fr)] gap-3 py-3"
        >
          <div class="text-right">
            <p class="text-[15px] font-semibold text-g-900">{{ activity.date }}</p>
            <p class="mt-1 text-[12px] text-g-600">{{ activity.time }}</p>
          </div>
          <div class="relative flex justify-center">
            <span
              class="relative z-10 mt-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-[var(--default-box-color)]"
              :style="{ background: activity.color }"
            ></span>
          </div>
          <p class="text-[15px] leading-7 text-g-800" v-html="activity.content"></p>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useSettingStore } from '@/store/modules/setting'
  import { activities } from '../shared'

  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)

  const timelineLineStyle = computed(() => ({
    [isRtl.value ? 'right' : 'left']: '115px'
  }))
</script>
