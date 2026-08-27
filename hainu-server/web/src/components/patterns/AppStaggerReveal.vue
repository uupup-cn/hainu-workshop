<script setup lang="ts">
/**
 * 交错揭示 — GSAP 包裹层，子项匹配 selector 依次入场
 * 遵守 prefers-reduced-motion（直接显示终态）
 */
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = withDefaults(
  defineProps<{
    selector?: string
    stagger?: number
    y?: number
    duration?: number
    scrollTrigger?: boolean
  }>(),
  {
    selector: '.reveal-item',
    stagger: 0.06,
    y: 16,
    duration: 0.4,
    scrollTrigger: true,
  },
)

const root = ref<HTMLElement>()
let ctx: gsap.Context | undefined

onMounted(() => {
  if (!root.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = gsap.context(() => {
    const items = root.value!.querySelectorAll<HTMLElement>(props.selector)
    gsap.from(items, {
      opacity: 0,
      scale: 0.92,
      y: props.y,
      duration: props.duration,
      stagger: { each: props.stagger, from: 'start', grid: 'auto' },
      ease: 'back.out(1.4)',
      scrollTrigger: props.scrollTrigger
        ? { trigger: root.value, start: 'top 85%', once: true }
        : undefined,
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="stagger-reveal">
    <slot />
  </div>
</template>
