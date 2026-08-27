<script setup lang="ts">
/**
 * 宠物吉祥物装饰 — 原创奇幻精灵（roco.world 风格占位）
 * 正式宠物素材替换时，可改为接受 src 渲染外部 SVG/图片
 */
withDefaults(defineProps<{ size?: number }>(), { size: 120 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="pet-mascot"
  >
    <defs>
      <linearGradient id="pm-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--ocean-500)" />
        <stop offset="1" stop-color="var(--fantasy-500)" />
      </linearGradient>
    </defs>
    <!-- 顶部星芒 -->
    <path d="M96 16 L99 25 L108 28 L99 31 L96 40 L93 31 L84 28 L93 25 Z" fill="var(--amber-300)" />
    <path d="M22 30 L24 35 L29 37 L24 39 L22 44 L20 39 L15 37 L20 35 Z" fill="var(--teal-300)" />
    <!-- 身体 -->
    <path
      d="M60 32 C83 32 97 49 97 68 C97 89 81 101 60 101 C39 101 23 89 23 68 C23 49 37 32 60 32 Z"
      fill="url(#pm-body)"
    />
    <!-- 肚皮高光 -->
    <ellipse cx="60" cy="74" rx="23" ry="19" fill="rgba(255,255,255,0.16)" />
    <!-- 眼睛 -->
    <circle cx="48" cy="60" r="7.5" fill="#0b1a3a" />
    <circle cx="72" cy="60" r="7.5" fill="#0b1a3a" />
    <circle cx="50.5" cy="57.5" r="2.6" fill="#fff" />
    <circle cx="74.5" cy="57.5" r="2.6" fill="#fff" />
    <!-- 腮红 -->
    <circle cx="39" cy="72" r="5.5" fill="var(--coral-400)" opacity="0.7" />
    <circle cx="81" cy="72" r="5.5" fill="var(--coral-400)" opacity="0.7" />
    <!-- 笑容 -->
    <path d="M51 78 Q60 87 69 78" stroke="#0b1a3a" stroke-width="3.2" fill="none" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
.pet-mascot {
  animation: pet-bob 4s var(--ease-out) infinite;
}
@keyframes pet-bob {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pet-mascot {
    animation: none;
  }
}
</style>
