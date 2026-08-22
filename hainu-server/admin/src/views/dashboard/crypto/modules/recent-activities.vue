<template>
  <article class="art-card-sm flex h-[600px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">最近动态</h3>
      <a href="javascript:void(0)" class="flex items-center gap-1 text-sm text-g-600">
        <span>查看全部</span>
        <ArtSvgIcon icon="ri:arrow-right-line" class="text-base" />
      </a>
    </header>
    <ElScrollbar class="w-full flex-1">
      <div class="space-y-1 px-5 py-3">
        <div
          v-for="item in recentActivities"
          :key="item.name"
          class="flex items-center justify-between gap-3 py-3"
        >
          <div class="flex items-center gap-3">
            <img :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full" />
            <div>
              <p class="text-[14px] font-semibold text-g-900">{{ item.name }}</p>
              <p class="mt-1 text-[13px] text-g-600">{{ item.asset }}</p>
            </div>
          </div>
          <div class="text-right text-sm">
            <p class="text-g-600">{{ item.date }}</p>
            <p class="mt-1 text-[12px] font-semibold" :class="item.typeClass">{{ item.type }}</p>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { recentActivities } from '../shared'
</script>
