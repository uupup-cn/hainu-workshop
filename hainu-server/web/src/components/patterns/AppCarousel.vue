<script setup lang="ts">
/**
 * 幻灯片轮播 — 自动切换 + 左右箭头 + 圆点指示器
 * 占位阶段用渐变背景 + 图标 + 文案充当幻灯片，后续可替换为实图
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { LucideIcon, type IconName } from '@/components/icons'

export interface CarouselSlide {
  key: string
  gradient: string
  icon: IconName
  title: string
  subtitle: string
}

const props = withDefaults(defineProps<{ slides: CarouselSlide[]; interval?: number; flush?: boolean }>(), {
  interval: 5000,
})

const current = ref(0)
let timer: number | undefined

function go(i: number) {
  current.value = (i + props.slides.length) % props.slides.length
}
function next() {
  go(current.value + 1)
}
function prev() {
  go(current.value - 1)
}
function pause() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}
function resume() {
  if (!timer) timer = window.setInterval(next, props.interval)
}

onMounted(() => {
  timer = window.setInterval(next, props.interval)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="carousel" :class="{ 'carousel--flush': flush }" @mouseenter="pause" @mouseleave="resume">
    <div
      v-for="(s, i) in slides"
      :key="s.key"
      class="slide"
      :class="{ active: i === current }"
      :style="{ background: s.gradient }"
    >
      <div class="slide-content">
        <LucideIcon :name="s.icon" :size="56" color="rgba(255,255,255,0.94)" :stroke-width="1.5" />
        <h2 class="slide-title">{{ s.title }}</h2>
        <p class="slide-subtitle">{{ s.subtitle }}</p>
      </div>
    </div>
    <button class="arrow prev" aria-label="上一张" @click="prev">
      <LucideIcon name="arrow-left" :size="24" color="#fff" />
    </button>
    <button class="arrow next" aria-label="下一张" @click="next">
      <LucideIcon name="arrow-right" :size="24" color="#fff" />
    </button>
    <div class="dots">
      <button
        v-for="(s, i) in slides"
        :key="s.key"
        class="dot"
        :class="{ active: i === current }"
        :aria-label="`第 ${i + 1} 张`"
        @click="go(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: var(--r-2xl);
  overflow: hidden;
  box-shadow: var(--sh-hero);
}
.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out);
}
.slide.active {
  opacity: 1;
}
.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  color: #fff;
  padding: var(--space-6);
}
.slide-title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: var(--fw-h1);
  line-height: var(--lh-h1);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
}
.slide-subtitle {
  font-size: var(--fs-body-lg);
  opacity: 0.92;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: var(--r-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  transition: background var(--dur-fast) var(--ease-out);
}
.arrow:hover {
  background: rgba(255, 255, 255, 0.32);
}
.arrow.prev {
  left: var(--space-4);
}
.arrow.next {
  right: var(--space-4);
}
.dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: var(--space-4);
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--r-full);
  background: rgba(255, 255, 255, 0.5);
  transition: width var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.dot.active {
  width: 24px;
  background: #fff;
}

@media (max-width: 768px) {
  .carousel {
    height: 280px;
    border-radius: var(--r-xl);
  }
  .slide-title {
    font-size: var(--fs-h2);
  }
  .slide-subtitle {
    font-size: var(--fs-body);
  }
}

/* 全幅模式：铺满视口宽度，官网级横幅 */
.carousel.carousel--flush {
  border-radius: 0;
  box-shadow: none;
  height: 62vh;
  min-height: 360px;
}
@media (max-width: 768px) {
  .carousel.carousel--flush {
    height: 48vh;
    min-height: 280px;
  }
}
</style>
