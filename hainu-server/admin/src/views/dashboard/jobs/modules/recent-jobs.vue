<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">近期岗位</h3>
    </header>
    <ElScrollbar class="min-h-0 flex-1">
      <div class="px-5 py-2">
        <div
          v-for="item in recentJobs"
          :key="item.title"
          class="border-b-d flex items-center justify-between gap-3 py-4 last:border-b-0"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold"
              :style="{ background: item.avatarBg, color: item.avatarColor }"
            >
              {{ item.avatarText }}
            </span>
            <div class="min-w-0">
              <p class="truncate text-[14px] font-semibold text-g-900">{{ item.title }}</p>
              <p class="mt-1 truncate text-[14px] text-g-600">{{ item.company }}</p>
            </div>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-[13px] text-g-800">{{ item.type }}</p>
            <span
              class="mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :class="item.tagClass"
            >
              {{ item.tag }}
            </span>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { recentJobs } from '../shared'
</script>
