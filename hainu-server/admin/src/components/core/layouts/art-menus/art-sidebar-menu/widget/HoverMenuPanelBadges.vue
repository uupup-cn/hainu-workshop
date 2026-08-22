<template>
  <!-- 文字徽章：显示 New / Hot / 版本号等短文本 -->
  <span v-if="showTextBadge" class="hover-menu-panel-text-badge">
    {{ showTextBadge }}
  </span>

  <!-- 圆点徽章：纯提示，呼吸动画 -->
  <span v-if="showBadge" class="hover-menu-panel-dot-badge" />
</template>

<script setup lang="ts">
  defineOptions({ name: 'HoverMenuPanelBadges' })

  defineProps<{
    /** 是否显示红点徽章 */
    showBadge?: boolean
    /** 文字徽章内容，空字符串视为不展示 */
    showTextBadge?: string
  }>()
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .hover-menu-panel-dot-badge {
    @apply ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff3860];

    animation: hover-menu-panel-breathe 1.5s ease-in-out infinite;
  }

  .hover-menu-panel-text-badge {
    @apply ml-auto inline-flex h-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[#fd4e4e] px-[5px] text-[10px] font-normal leading-none text-white;
  }

  @keyframes hover-menu-panel-breathe {
    0% {
      opacity: 0.7;
      transform: scale(1);
    }

    50% {
      opacity: 1;
      transform: scale(1.1);
    }

    100% {
      opacity: 0.7;
      transform: scale(1);
    }
  }
</style>
