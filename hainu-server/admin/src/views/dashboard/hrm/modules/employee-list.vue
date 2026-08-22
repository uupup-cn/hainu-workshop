<template>
  <article class="art-card-sm flex h-[560px] max-h-[560px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">在职人员</h3>
      <a href="javascript:void(0)" class="text-sm text-g-600">查看全部 →</a>
    </header>
    <ElScrollbar class="min-h-0 flex-1" height="100%">
      <div class="px-5 py-2">
        <div
          v-for="item in employeeRows"
          :key="item.name"
          class="border-b-d flex items-center justify-between gap-4 py-4 last:border-b-0"
        >
          <div class="flex min-w-0 items-center gap-3">
            <img :src="item.avatar" :alt="item.name" class="h-11 w-11 rounded-full object-cover" />
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-[16px] font-semibold text-g-900">{{ item.name }}</p>
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="item.tagClass"
                >
                  {{ item.department }}
                </span>
              </div>
              <p class="mt-1 truncate text-[14px] text-g-600">{{ item.role }}</p>
            </div>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-[14px] text-g-900">{{ item.date }}</p>
            <p class="mt-1 text-[13px] text-g-600">入职日期</p>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { employeeRows } from '../shared'
</script>

<style scoped>
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    background: transparent;
  }
</style>
