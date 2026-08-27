<script setup lang="ts">
/**
 * 全站统一图标组件 — 仅接受业务语义名（见 icon-registry.ts）
 * 默认 24×24、1.5px 描边、currentColor（随父级文字色），尺寸档 16/20/24/32
 */
import { iconRegistry, type IconName } from './icon-registry'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number
    color?: string
    strokeWidth?: number | string
  }>(),
  {
    size: 24,
    strokeWidth: 1.5,
  },
)
</script>

<template>
  <component
    :is="iconRegistry[name]"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    aria-hidden="true"
    focusable="false"
  />
</template>
