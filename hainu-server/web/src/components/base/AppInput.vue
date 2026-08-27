<script setup lang="ts">
/** 输入框 — 标签 / 占位 / 清除 / 错误 / 帮助文本 */
import { computed } from 'vue'
import { LucideIcon } from '@/components/icons'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    type?: string
    error?: string | boolean
    helper?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  { type: 'text', clearable: true },
)
const emit = defineEmits<{ 'update:modelValue': [string]; enter: [] }>()

const errorText = computed(() => (typeof props.error === 'string' ? props.error : ''))
const hasError = computed(() => !!props.error)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="app-input" :class="{ 'has-error': hasError }">
    <label v-if="label" class="app-input-label">{{ label }}</label>
    <div class="app-input-box">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input-el"
        @input="onInput"
        @keyup.enter="emit('enter')"
      />
      <button v-if="clearable && modelValue && !disabled" class="app-input-clear" aria-label="清除" @click="clear">
        <LucideIcon name="close" :size="16" />
      </button>
    </div>
    <p v-if="errorText" class="app-input-error">
      <LucideIcon name="warning" :size="14" />
      {{ errorText }}
    </p>
    <p v-else-if="helper" class="app-input-helper">{{ helper }}</p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.app-input-label {
  font-size: var(--fs-h4);
  font-weight: var(--fw-h4);
  color: var(--fg-1);
}
.app-input-box {
  position: relative;
  display: flex;
  align-items: center;
}
.app-input-el {
  width: 100%;
  height: 48px;
  padding: 0 var(--space-3);
  font-size: var(--fs-body);
  border: 1px solid var(--neutral-200);
  border-radius: var(--r-md);
  background: var(--bg-card);
  color: var(--fg-1);
  outline: none;
  transition:
    border-color var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}
.app-input-el:focus {
  border-color: var(--ocean-500);
  box-shadow: 0 0 0 3px var(--ocean-50);
}
.app-input-el:disabled {
  background: var(--neutral-50);
  color: var(--fg-3);
  cursor: not-allowed;
}
.app-input-clear {
  position: absolute;
  right: var(--space-2);
  display: inline-flex;
  color: var(--fg-3);
}
.has-error .app-input-el {
  border-color: var(--danger);
}
.has-error .app-input-el:focus {
  box-shadow: 0 0 0 3px var(--danger-bg);
}
.app-input-error {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin: 0;
  font-size: var(--fs-caption);
  color: var(--danger);
}
.app-input-helper {
  margin: 0;
  font-size: var(--fs-caption);
  color: var(--fg-3);
}
</style>
