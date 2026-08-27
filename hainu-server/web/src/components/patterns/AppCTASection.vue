<script setup lang="ts">
/** 全宽 CTA 行动召唤区 — 官网级深色渐变铺满视口宽度 */
defineProps<{ title: string; desc?: string }>()
</script>

<template>
  <section class="app-cta">
    <div class="app-cta-inner">
      <h2 class="app-cta-title">{{ title }}</h2>
      <p v-if="desc" class="app-cta-desc">{{ desc }}</p>
      <div class="app-cta-actions">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.app-cta {
  width: 100%;
  background: linear-gradient(135deg, var(--ocean-900), var(--ocean-700) 55%, var(--fantasy-700));
  color: #fff;
}
.app-cta-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--space-6);
  text-align: center;
}
.app-cta-title {
  font-family: var(--font-display);
  font-size: var(--fs-title-section);
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 var(--space-3);
}
.app-cta-desc {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body-lg);
  opacity: 0.85;
  margin: 0 0 var(--space-8);
}
.app-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}
</style>
