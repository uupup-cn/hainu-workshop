<template>
  <ElRow :gutter="20" class="flex">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="art-card-sm flex items-center justify-between h-32 px-5 mb-5 max-sm:mb-4">
        <div class="min-w-0 text-start">
          <span class="text-g-700 text-sm">{{ item.des }}</span>
          <ArtCountTo
            class="block text-[26px] font-medium mt-2"
            :target="item.num"
            :duration="1300"
          />
          <div class="flex-c mt-1">
            <span class="text-xs text-g-600">较上周</span>
            <span
              class="ms-1 text-xs font-semibold"
              :class="[item.change.indexOf('+') === -1 ? 'text-danger' : 'text-success']"
            >
              {{ item.change }}
            </span>
          </div>
        </div>
        <div class="size-11 rounded-md flex-cc shrink-0" :class="item.iconClass">
          <ArtSvgIcon :icon="item.icon" class="text-xl" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  interface CardDataItem {
    des: string
    icon: string
    iconClass: string
    startVal: number
    duration: number
    num: number
    change: string
  }

  /**
   * 卡片统计数据列表
   * 展示总访问次数、在线访客数、点击量和新用户等核心数据指标
   */
  const dataList = reactive<CardDataItem[]>([
    {
      des: '总访问次数',
      icon: 'ri:pie-chart-line',
      iconClass: 'bg-primary/12 text-primary',
      startVal: 0,
      duration: 1000,
      num: 9120,
      change: '+20%'
    },
    {
      des: '在线访客数',
      icon: 'ri:group-line',
      iconClass: 'bg-success/12 text-success',
      startVal: 0,
      duration: 1000,
      num: 182,
      change: '+10%'
    },
    {
      des: '点击量',
      icon: 'ri:fire-line',
      iconClass: 'bg-warning/12 text-warning',
      startVal: 0,
      duration: 1000,
      num: 9520,
      change: '-12%'
    },
    {
      des: '新用户',
      icon: 'ri:progress-2-line',
      iconClass: 'bg-secondary/12 text-secondary',
      startVal: 0,
      duration: 1000,
      num: 156,
      change: '+30%'
    }
  ])
</script>
