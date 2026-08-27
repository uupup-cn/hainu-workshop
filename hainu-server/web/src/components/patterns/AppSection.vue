<script setup lang="ts">
/** 全宽区块 — 官网级节奏：区块 100% 宽度铺满，内容居中限宽 */
withDefaults(
  defineProps<{
    bg?: 'page' | 'white' | 'none'
    kicker?: string
    title?: string
    sub?: string
  }>(),
  { bg: 'none' },
)
</script>

<template>
  <section class="app-section" :class="bg !== 'none' ? `bg-${bg}` : ''">
    <div class="app-section-inner">
      <header v-if="kicker || title" class="app-section-head">
        <p v-if="kicker" class="app-section-kicker">{{ kicker }}</p>
        <h2 v-if="title" class="app-section-title">{{ title }}</h2>
        <p v-if="sub" class="app-section-sub">{{ sub }}</p>
      </header>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.app-section {
  width: 100%;
  padding: var(--section-pad-y) var(--space-6);
}
.app-section.bg-page {
  background: var(--bg-page);
}
.app-section.bg-white {
  background: var(--bg-card);
}
.app-section-inner {
  max-width: var(--container-max);
  margin: 0 auto;
}
.app-section-head {
  text-align: center;
  margin-bottom: clamp(32px, 5vw, 56px);
}
.app-section-kicker {
  display: inline-block;
  font-size: var(--fs-label);
  font-weight: var(--fw-label);
  letter-spacing: 0.24em;
  color: var(--ocean-500);
  margin: 0 0 var(--space-3);
}
.app-section-title {
  font-family: var(--font-display);
  font-size: var(--fs-title-section);
  line-height: 1.25;
  font-weight: 800;
  color: var(--fg-1);
  margin: 0 0 var(--space-3);
}
.app-section-sub {
  color: var(--fg-3);
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body-lg);
  margin: 0;
}
</style>
