/**
 * 工具组件通用逻辑 — 登录拦截 / loading / 轻提示 / 分享链接
 */
import { ref } from 'vue'
import { useUserStore } from '../../../store/user'
import { toolsApi } from '../../../api'

export function useTool(toolKey: string) {
  const userStore = useUserStore()
  const loading = ref(false)
  const toast = ref('')
  let toastTimer: ReturnType<typeof setTimeout> | undefined

  function showToast(msg: string) {
    toast.value = msg
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (toast.value = ''), 2500)
  }

  /** 调用前登录校验：未登录弹登录窗并返回 false */
  function guard(): boolean {
    if (!userStore.isLoggedIn) {
      userStore.openLoginDialog()
      return false
    }
    return true
  }

  /** 统一包装工具接口调用：管理 loading，异常弹 message，成功返回 data，失败返回 null */
  async function call<T = any>(fn: () => Promise<any>): Promise<T | null> {
    loading.value = true
    try {
      const res = await fn()
      return (res?.data ?? res) as T
    } catch (e: any) {
      showToast(e?.message || '操作失败，请稍后重试')
      return null
    } finally {
      loading.value = false
    }
  }

  /** 生成结果分享链接（api.md §6.3 share_type=link） */
  async function shareResult(resultData: any): Promise<string> {
    if (!guard()) return ''
    try {
      const res = await toolsApi.share(toolKey, { shareType: 'link', resultData })
      return res?.data?.shareUrl || res?.data?.share_url || ''
    } catch (e: any) {
      showToast(e?.message || '生成分享链接失败')
      return ''
    }
  }

  return { loading, toast, showToast, guard, call, shareResult }
}
