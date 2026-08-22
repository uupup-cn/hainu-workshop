<template>
  <button
    type="button"
    class="ml-2 flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium tad-200 md:ml-0 md:mr-2.5"
    :class="
      active
        ? 'bg-primary/10 text-primary hover:bg-primary/15'
        : 'bg-g-300/55 text-g-700 hover:bg-g-300 dark:bg-g-300/40'
    "
    :aria-label="active ? '退出专注' : '专注模式'"
    @click="emit('click')"
  >
    <ArtSvgIcon :icon="active ? 'ri:brain-ai-3-line' : 'ri:brain-3-line'" class="text-base" />
    <span>{{ active ? '退出专注' : '专注模式' }}</span>
  </button>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtFocusModeButton' })

  /**
   * 专注模式切换按钮。
   *
   * 只负责统一入口样式和文案；具体状态持久化与页面布局切换由 usePageFocusMode 处理。
   */
  defineProps<{
    /** 是否处于专注模式。 */
    active?: boolean
  }>()

  const emit = defineEmits<{
    /** 点击按钮时通知页面切换专注模式。 */
    (e: 'click'): void
  }>()
</script>
