<script setup lang="ts">
/** 分类横向 Tab — 选中下划线指示器，横向可滚动 */
interface SegItem {
  label: string
  value: string | number
}
defineProps<{ tabs: SegItem[]; modelValue: string | number }>()
defineEmits<{ 'update:modelValue': [string | number] }>()
</script>

<template>
  <nav class="app-seg">
    <button
      v-for="t in tabs"
      :key="t.value"
      class="app-seg-item"
      :class="{ active: t.value === modelValue }"
      @click="$emit('update:modelValue', t.value)"
    >
      {{ t.label }}
    </button>
  </nav>
</template>

<style scoped>
.app-seg {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  border-bottom: 1px solid var(--neutral-100);
  padding-bottom: 1px;
}
.app-seg-item {
  position: relative;
  flex-shrink: 0;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: none;
  color: var(--fg-2);
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-h4);
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out);
}
.app-seg-item:hover {
  color: var(--ocean-500);
}
.app-seg-item.active {
  color: var(--ocean-500);
}
.app-seg-item.active::after {
  content: '';
  position: absolute;
  left: var(--space-4);
  right: var(--space-4);
  bottom: -1px;
  height: 3px;
  border-radius: var(--r-full);
  background: var(--ocean-500);
}
</style>
