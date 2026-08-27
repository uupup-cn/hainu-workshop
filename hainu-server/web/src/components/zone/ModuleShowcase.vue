<script setup lang="ts">
/** 模块展示网格 — 访客首页全模块入口，替代旧 emoji 宫格 */
import { LucideIcon, type IconName } from '@/components/icons'

defineProps<{
  modules: { icon: IconName; name: string; desc: string; to: string }[]
}>()
</script>

<template>
  <div class="module-grid">
    <router-link v-for="m in modules" :key="m.to" :to="m.to" class="module-card reveal-item">
      <span class="module-ico">
        <LucideIcon :name="m.icon" :size="28" />
      </span>
      <span class="module-name">{{ m.name }}</span>
      <span class="module-desc">{{ m.desc }}</span>
    </router-link>
  </div>
</template>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}
.module-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-5);
  border-radius: var(--r-xl);
  background: var(--bg-card);
  box-shadow: var(--sh-card);
  transition:
    transform var(--dur-base) var(--ease-back),
    box-shadow var(--dur-base) var(--ease-out);
}
.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-float);
}
.module-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--ocean-50), var(--fantasy-300));
  color: var(--ocean-700);
  margin-bottom: var(--space-2);
}
.module-name {
  font-family: var(--font-display);
  font-size: var(--fs-h4);
  font-weight: var(--fw-h4);
  color: var(--fg-1);
}
.module-desc {
  font-size: var(--fs-caption);
  color: var(--fg-3);
  line-height: var(--lh-caption);
}
</style>
