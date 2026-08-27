/**
 * 全站轻提示 — 模块级单例，所有页面共享同一实例
 * 用法：const toast = useToast(); toast.success('已保存')
 * 配合 <AppToast /> 挂载一次（DefaultLayout 内）即可全站可用
 */
import { ref } from 'vue'

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info' | 'loading'
export interface ToastItem {
  id: number
  variant: ToastVariant
  message: string
}

const toasts = ref<ToastItem[]>([])
let seed = 0

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function show(message: string, variant: ToastVariant = 'info', duration = 2000) {
  const id = ++seed
  toasts.value.push({ id, message, variant })
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
  return id
}

export function useToast() {
  return {
    toasts,
    show,
    dismiss,
    success: (m: string, d = 2000) => show(m, 'success', d),
    warning: (m: string, d = 2400) => show(m, 'warning', d),
    danger: (m: string, d = 2800) => show(m, 'danger', d),
    info: (m: string, d = 2000) => show(m, 'info', d),
    loading: (m: string) => show(m, 'loading', 0),
  }
}
