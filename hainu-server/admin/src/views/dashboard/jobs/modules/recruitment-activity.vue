<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">招聘动态</h3>
    </header>
    <ElScrollbar class="min-h-0 flex-1">
      <div class="px-5 py-2">
        <div
          v-for="item in recentActivities"
          :key="item.name"
          class="border-b-d flex items-start gap-3 py-3.5 last:border-b-0"
        >
          <img :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full object-cover" />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold text-g-900">{{ item.name }}</span>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="item.tagClass"
              >
                {{ item.tag }}
              </span>
            </div>
            <p class="mt-1 truncate text-[13px] text-g-800">{{ item.content }}</p>
            <p class="mt-1 text-[13px] text-g-600">{{ item.time }}</p>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { recentActivities } from '../shared'
</script>
