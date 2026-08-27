<script setup lang="ts">
/** 全站轻提示呈现器 — 读取 useToast 单例，Teleport 到 body */
import { useToast, type ToastVariant } from '@/composables/useToast'
import { LucideIcon, type IconName } from '@/components/icons'

const { toasts } = useToast()

function iconFor(v: ToastVariant): IconName {
  switch (v) {
    case 'success':
      return 'check'
    case 'warning':
    case 'danger':
      return 'warning'
    case 'loading':
      return 'refresh'
    default:
      return 'action-bell'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="app-toast-wrap">
      <TransitionGroup name="app-toast">
        <div v-for="t in toasts" :key="t.id" class="app-toast" :class="`v-${t.variant}`">
          <LucideIcon :name="iconFor(t.variant)" :size="16" color="#fff" />
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.app-toast-wrap {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  pointer-events: none;
}
.app-toast {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  max-width: 80vw;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--r-md);
  background: rgba(20, 20, 43, 0.88);
  color: #fff;
  font-size: var(--fs-caption);
  box-shadow: var(--sh-float);
}
.v-success {
  background: rgba(16, 130, 90, 0.94);
}
.v-warning {
  background: rgba(180, 110, 20, 0.94);
}
.v-danger {
  background: rgba(190, 50, 50, 0.94);
}

.app-toast-enter-active,
.app-toast-leave-active {
  transition: all var(--dur-base) var(--ease-back);
}
.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
