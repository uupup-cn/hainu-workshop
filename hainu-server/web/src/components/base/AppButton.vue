<script setup lang="ts">
/** 通用按钮 — 5 变体 × 3 尺寸，loading + 图标插槽，Lucide 图标 */
import { computed } from 'vue'
import { LucideIcon, type IconName } from '@/components/icons'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'weak' | 'danger' | 'text'
    size?: 'large' | 'default' | 'small'
    block?: boolean
    loading?: boolean
    disabled?: boolean
    icon?: IconName
  }>(),
  { variant: 'primary', size: 'default' },
)

const cls = computed(() => [`app-btn--${props.variant}`, `app-btn--${props.size}`, { 'app-btn--block': props.block }])
</script>

<template>
  <button class="app-btn" :class="cls" :disabled="disabled || loading">
    <span v-if="loading" class="app-btn-spinner" aria-hidden="true" />
    <LucideIcon v-else-if="icon" :name="icon" :size="size === 'small' ? 16 : 20" />
    <span class="app-btn-label"><slot /></span>
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  border: none;
  border-radius: var(--r-md);
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: var(--fw-button);
  line-height: var(--lh-button);
  transition:
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}
.app-btn:active {
  transform: translateY(1px);
}
.app-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 变体 */
.app-btn--primary {
  background: var(--ocean-500);
  color: var(--fg-on-primary);
}
.app-btn--primary:hover:not(:disabled) {
  background: var(--ocean-700);
}
.app-btn--secondary {
  background: var(--bg-card);
  color: var(--ocean-500);
  border: 1px solid var(--neutral-200);
}
.app-btn--secondary:hover:not(:disabled) {
  background: var(--ocean-50);
}
.app-btn--weak {
  background: var(--ocean-50);
  color: var(--ocean-500);
}
.app-btn--weak:hover:not(:disabled) {
  background: var(--ocean-100);
}
.app-btn--danger {
  background: var(--danger);
  color: #fff;
}
.app-btn--danger:hover:not(:disabled) {
  background: #c72626;
}
.app-btn--text {
  background: transparent;
  color: var(--ocean-500);
}
.app-btn--text:hover:not(:disabled) {
  color: var(--ocean-700);
}

/* 尺寸 */
.app-btn--large {
  height: 48px;
  padding: 0 var(--space-6);
  font-size: var(--fs-button);
}
.app-btn--default {
  height: 40px;
  padding: 0 var(--space-5);
  font-size: var(--fs-button);
}
.app-btn--small {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--fs-caption);
}

.app-btn--block {
  width: 100%;
}

.app-btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--r-full);
  animation: app-btn-spin 0.8s linear infinite;
}
@keyframes app-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
