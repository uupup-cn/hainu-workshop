<script setup lang="ts">
/** 标签 — 6 变体，可关闭 */
import { LucideIcon } from '@/components/icons'
withDefaults(
  defineProps<{
    type?: 'primary' | 'mint' | 'orange' | 'success' | 'warning' | 'danger'
    size?: 'default' | 'small'
    closable?: boolean
  }>(),
  { type: 'primary', size: 'default', closable: false },
)
defineEmits<{ close: [] }>()
</script>

<template>
  <span class="app-tag" :class="[`app-tag--${type}`, { 'app-tag--small': size === 'small' }]">
    <slot />
    <button v-if="closable" class="app-tag-close" @click="$emit('close')">
      <LucideIcon name="close" :size="12" />
    </button>
  </span>
</template>

<style scoped>
.app-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0 var(--space-2);
  height: 22px;
  border-radius: var(--r-sm);
  font-size: var(--fs-label);
  font-weight: var(--fw-label);
  line-height: var(--lh-label);
}
.app-tag--small {
  height: 20px;
}
.app-tag--primary {
  background: var(--ocean-50);
  color: var(--ocean-500);
}
.app-tag--mint {
  background: var(--teal-50);
  color: var(--teal-600);
}
.app-tag--orange {
  background: var(--amber-50);
  color: var(--amber-600);
}
.app-tag--success {
  background: var(--success-bg);
  color: var(--success);
}
.app-tag--warning {
  background: var(--warning-bg);
  color: var(--warning);
}
.app-tag--danger {
  background: var(--danger-bg);
  color: var(--danger);
}
.app-tag-close {
  display: inline-flex;
  border: none;
  background: none;
  padding: 0;
  color: currentColor;
  opacity: 0.6;
}
.app-tag-close:hover {
  opacity: 1;
}
</style>
