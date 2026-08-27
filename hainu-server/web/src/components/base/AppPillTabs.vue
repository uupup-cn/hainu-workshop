<script setup lang="ts">
/** 胶囊分类 Tab — 圆角药丸样式，去重全站 pill tab */
defineProps<{
  items: any[]
  labelKey: string
  valueKey: string
  modelValue: string | number
  wrap?: boolean
}>()
defineEmits<{ 'update:modelValue': [string | number] }>()
</script>

<template>
  <nav class="app-pill" :class="{ wrap }">
    <button
      v-for="it in items"
      :key="it[valueKey]"
      class="app-pill-item"
      :class="{ active: it[valueKey] === modelValue }"
      @click="$emit('update:modelValue', it[valueKey])"
    >
      {{ it[labelKey] }}
    </button>
  </nav>
</template>

<style scoped>
.app-pill {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
  margin-bottom: var(--space-4);
}
.app-pill.wrap {
  flex-wrap: wrap;
  overflow: visible;
  padding-bottom: 0;
}
.app-pill-item {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--neutral-200);
  background: var(--bg-card);
  border-radius: var(--r-full);
  color: var(--fg-2);
  font-size: var(--fs-body);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}
.app-pill-item:hover {
  color: var(--ocean-500);
  border-color: var(--ocean-200);
}
.app-pill-item.active {
  background: var(--ocean-500);
  border-color: var(--ocean-500);
  color: #fff;
}
</style>
