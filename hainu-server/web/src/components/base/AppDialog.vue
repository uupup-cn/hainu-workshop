<script setup lang="ts">
/** 模态弹窗 — 标题/描述/内容插槽/底部插槽，遮罩点击与 ESC 关闭 */
import { watch, onUnmounted } from 'vue'
import { LucideIcon } from '@/components/icons'

const props = defineProps<{ visible: boolean; title?: string; desc?: string; wide?: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean]; confirm: []; cancel: [] }>()

function close() {
  emit('update:visible', false)
  emit('cancel')
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
watch(
  () => props.visible,
  (v) => {
    if (v) {
      document.addEventListener('keydown', onEsc)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  },
)
onUnmounted(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="app-dialog">
      <div v-if="visible" class="app-dialog-mask" @click.self="close">
        <div class="app-dialog" :class="{ 'app-dialog--wide': wide }" role="dialog" aria-modal="true">
          <button class="app-dialog-close" aria-label="关闭" @click="close">
            <LucideIcon name="close" :size="20" />
          </button>
          <h3 v-if="title" class="app-dialog-title">{{ title }}</h3>
          <p v-if="desc" class="app-dialog-desc">{{ desc }}</p>
          <div class="app-dialog-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="app-dialog-foot">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}
.app-dialog {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--bg-card);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-float);
  padding: var(--space-6);
}
.app-dialog--wide {
  max-width: 560px;
}
.app-dialog-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: inline-flex;
  color: var(--fg-3);
}
.app-dialog-close:hover {
  color: var(--fg-1);
}
.app-dialog-title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: var(--fw-h2);
  color: var(--fg-1);
  padding-right: var(--space-6);
}
.app-dialog-desc {
  margin: 0 0 var(--space-4);
  color: var(--fg-2);
  font-size: var(--fs-body);
}
.app-dialog-body {
  color: var(--fg-1);
}
.app-dialog-foot {
  margin-top: var(--space-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.app-dialog-enter-active,
.app-dialog-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}
.app-dialog-enter-active .app-dialog,
.app-dialog-leave-active .app-dialog {
  transition: transform var(--dur-base) var(--ease-back), opacity var(--dur-base) var(--ease-out);
}
.app-dialog-enter-from,
.app-dialog-leave-to {
  opacity: 0;
}
.app-dialog-enter-from .app-dialog,
.app-dialog-leave-to .app-dialog {
  transform: scale(0.94) translateY(8px);
  opacity: 0;
}
</style>
