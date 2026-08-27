<script setup lang="ts">
/** 专区全幅头图 — 官网级 100% 宽度渐变横幅，内容居中限宽 */
import { LucideIcon, type IconName } from '@/components/icons'
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: IconName
    kicker?: string
    accent?: 'ocean' | 'teal' | 'amber' | 'fantasy'
  }>(),
  { accent: 'ocean' },
)
</script>

<template>
  <section class="zone-hero" :class="`accent-${accent}`">
    <div class="zone-hero-glow" aria-hidden="true"></div>
    <div class="zone-hero-inner">
      <div class="zone-hero-text">
        <p v-if="kicker" class="zone-hero-kicker">{{ kicker }}</p>
        <h1 class="zone-hero-title">{{ title }}</h1>
        <p v-if="subtitle" class="zone-hero-sub">{{ subtitle }}</p>
      </div>
      <span v-if="icon" class="zone-hero-ico">
        <LucideIcon :name="icon" :size="40" color="#fff" />
      </span>
    </div>
  </section>
</template>

<style scoped>
.zone-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  color: #fff;
}
.zone-hero-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  right: -120px;
  top: -180px;
  border-radius: var(--r-full);
  background: rgba(255, 255, 255, 0.1);
  filter: blur(80px);
  pointer-events: none;
}
.zone-hero-inner {
  position: relative;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: clamp(64px, 10vw, 112px) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}
.zone-hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 720px;
}
.zone-hero-kicker {
  display: inline-block;
  align-self: flex-start;
  padding: var(--space-1) var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--r-full);
  font-size: var(--fs-caption);
  letter-spacing: 0.18em;
  margin: 0;
}
.zone-hero-title {
  font-family: var(--font-display);
  font-size: var(--fs-display-xl);
  font-weight: 900;
  line-height: 1.15;
  margin: 0;
}
.zone-hero-sub {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body-lg);
  opacity: 0.88;
  margin: 0;
}
.zone-hero-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: var(--r-xl);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  flex-shrink: 0;
}

.accent-ocean {
  background: linear-gradient(135deg, var(--ocean-900), var(--ocean-500));
}
.accent-teal {
  background: linear-gradient(135deg, var(--ocean-900), var(--teal-600));
}
.accent-amber {
  background: linear-gradient(135deg, var(--ocean-900), var(--amber-600));
}
.accent-fantasy {
  background: linear-gradient(135deg, var(--ocean-900), var(--fantasy-600));
}

@media (max-width: 768px) {
  .zone-hero-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-12) var(--space-4);
  }
  .zone-hero-title {
    font-size: clamp(36px, 10vw, 52px);
  }
}
</style>
