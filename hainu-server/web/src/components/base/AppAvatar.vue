<script setup lang="ts">
/** 头像 — 文字 / 图片 / 图标，圆形或方形，可认证角标 */
import { computed } from 'vue'
import { LucideIcon, type IconName } from '@/components/icons'
const props = withDefaults(
  defineProps<{
    src?: string
    text?: string
    icon?: IconName
    size?: 24 | 32 | 40 | 48 | 64 | 80
    shape?: 'circle' | 'square'
    verified?: boolean
  }>(),
  { size: 40, shape: 'circle', icon: 'action-profile' },
)
const px = computed(() => `${props.size}px`)
</script>

<template>
  <span class="app-avatar" :class="`app-avatar--${shape}`" :style="{ width: px, height: px }">
    <img v-if="src" :src="src" alt="" class="app-avatar-img" />
    <span v-else-if="text" class="app-avatar-text">{{ text.slice(0, 1) }}</span>
    <LucideIcon v-else :name="icon" :size="size * 0.5" />
    <span v-if="verified" class="app-avatar-verified">
      <LucideIcon name="check" :size="12" color="#fff" />
    </span>
  </span>
</template>

<style scoped>
.app-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--ocean-500), var(--teal-500));
  color: #fff;
  overflow: hidden;
}
.app-avatar--circle {
  border-radius: var(--r-full);
}
.app-avatar--square {
  border-radius: var(--r-md);
}
.app-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.app-avatar-text {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.5em;
}
.app-avatar-verified {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 18px;
  height: 18px;
  border-radius: var(--r-full);
  background: var(--teal-500);
  border: 2px solid var(--bg-card);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
