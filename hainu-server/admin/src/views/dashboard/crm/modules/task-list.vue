<template>
  <article class="art-card-sm flex min-h-[520px] flex-1 flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-3.5">
      <h3 class="text-[18px] font-semibold text-g-900">任务列表</h3>
      <div class="flex shrink-0 items-center gap-2 text-sm font-medium">
        <button
          type="button"
          class="cursor-pointer rounded-[8px] px-5 py-2 text-[14px] font-medium transition-all duration-200"
          :class="
            activeTaskFilter === 'today'
              ? 'bg-theme/15 text-theme'
              : 'bg-transparent text-g-600 hover:text-theme dark:text-g-300'
          "
          @click="activeTaskFilter = 'today'"
        >
          今日
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-[8px] px-5 py-2 text-[14px] font-medium transition-all duration-200"
          :class="
            activeTaskFilter === 'todo'
              ? 'bg-theme/15 text-theme'
              : 'bg-transparent text-g-600 hover:text-theme dark:text-g-300'
          "
          @click="activeTaskFilter = 'todo'"
        >
          待办
        </button>
      </div>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div
        v-for="task in visibleTasks"
        :key="task.title"
        class="border-b-d flex items-start justify-between gap-4 px-5 py-3 last:border-b-0"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-start gap-3">
            <ElCheckbox :model-value="task.done" class="mt-0.5 shrink-0 !mr-0" />
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-[15px] text-g-900">{{ task.title }}</p>
              </div>
              <div
                class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-g-600"
              >
                <span>{{ task.code }}</span>
                <span class="flex items-center gap-1">
                  <i class="ri-user-line text-[12px]"></i>
                  {{ task.owner }}
                </span>
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="task.badgeClass"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[98px] shrink-0 text-right">
          <p class="text-[14px] font-semibold text-g-800">{{ task.date }}</p>
          <p class="mt-1 text-[12px] text-g-600">截止日期</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { tasks } from '../shared'

  const activeTaskFilter = ref<'today' | 'todo'>('todo')

  const visibleTasks = computed(() => {
    if (activeTaskFilter.value === 'today') {
      return tasks.filter((task) => !task.done)
    }

    return tasks
  })
</script>
