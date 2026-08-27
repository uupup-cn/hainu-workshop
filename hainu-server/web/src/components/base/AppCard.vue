<script setup lang="ts">
/** 信息卡片 — 标题 + 描述 + 箭头 + 任意插槽内容 */
import { LucideIcon } from '@/components/icons'
withDefaults(defineProps<{ title?: string; desc?: string; arrow?: boolean; clickable?: boolean }>(), { arrow: false, clickable: false })
</script>

<template>
  <component
    :is="clickable ? 'div' : 'div'"
    class="app-card"
    :class="{ 'app-card--clickable': clickable }"
  >
    <div v-if="title || $slots.header" class="app-card-head">
      <slot name="header">
        <h3 class="app-card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="app-card-body">
      <slot />
      <p v-if="desc" class="app-card-desc">{{ desc }}</p>
    </div>
    <div v-if="$slots.footer" class="app-card-foot">
      <slot name="footer" />
    </div>
    <LucideIcon v-if="arrow" name="arrow-right" :size="20" class="app-card-arrow" />
  </component>
</template>

<style scoped>
.app-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--r-lg);
  padding: var(--space-5);
  box-shadow: var(--sh-card);
  transition:
    transform var(--dur-base) var(--ease-back),
    box-shadow var(--dur-base) var(--ease-out);
}
.app-card--clickable {
  cursor: pointer;
}
.app-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-float);
}
.app-card-head {
  margin-bottom: var(--space-3);
}
.app-card-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: var(--fw-h3);
  color: var(--fg-1);
}
.app-card-body {
  color: var(--fg-2);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}
.app-card-desc {
  margin: var(--space-2) 0 0;
  color: var(--fg-3);
  font-size: var(--fs-caption);
}
.app-card-foot {
  margin-top: var(--space-4);
  border-top: 1px solid var(--neutral-100);
  padding-top: var(--space-3);
}
.app-card-arrow {
  position: absolute;
  right: var(--space-4);
  top: var(--space-5);
  color: var(--fg-3);
}
</style>
