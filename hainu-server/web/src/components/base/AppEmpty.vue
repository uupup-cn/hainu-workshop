<script setup lang="ts">
/** 空状态 — 图标 + 标题 + 描述 + 可选按钮 */
import { LucideIcon, type IconName } from '@/components/icons'
withDefaults(defineProps<{ icon?: IconName; title?: string; desc?: string }>(), {
  icon: 'search',
  title: '暂无数据',
})
</script>

<template>
  <div class="app-empty">
    <span class="app-empty-ico">
      <LucideIcon :name="icon" :size="48" :stroke-width="1.25" />
    </span>
    <h3 class="app-empty-title">{{ title }}</h3>
    <p v-if="desc" class="app-empty-desc">{{ desc }}</p>
    <div v-if="$slots.default" class="app-empty-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-12) 0;
}
.app-empty-ico {
  display: inline-flex;
  color: var(--fg-3);
  margin-bottom: var(--space-4);
}
.app-empty-title {
  margin: 0 0 var(--space-1);
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: var(--fw-h3);
  color: var(--fg-2);
}
.app-empty-desc {
  margin: 0;
  color: var(--fg-3);
  font-size: var(--fs-caption);
}
.app-empty-action {
  margin-top: var(--space-5);
}
</style>
