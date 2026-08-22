import mittBus from '@/utils/sys/mittBus'
import { nextTick, onActivated, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface UseQuickActionDialogOptions {
  /** URL 查询参数中用于识别当前快捷操作的值。 */
  actionKey: string
  /** 等待页面切换完成后真正执行的弹窗打开逻辑。 */
  onTrigger: () => void
  /** 页面级弹窗关闭事件的回调，通常由全局搜索导航前触发。 */
  onCloseDialogs: () => void
  /** 延迟执行快捷操作，给路由跳转和页面过渡预留时间。 */
  delay?: number
}

/**
 * 通过 URL 上的 quickAction 查询参数触发页面内弹窗。
 *
 * 使用场景：全局搜索跳转到目标页面后，页面根据 quickAction 自动打开“新增”等操作弹窗。
 */
export const useQuickActionDialog = ({
  actionKey,
  onTrigger,
  onCloseDialogs,
  delay = 320
}: UseQuickActionDialogOptions) => {
  const route = useRoute()
  const router = useRouter()
  const quickActionTimer = ref<number | null>(null)
  const isWaitingForTransition = ref(false)

  /** 只处理当前页面关心的快捷操作，避免其他 quickAction 误触发。 */
  const isMatchedQuickAction = () => route.query.quickAction === actionKey

  /** 动作执行后移除 URL 参数，避免刷新或返回时重复打开弹窗。 */
  const clearQuickAction = async () => {
    const nextQuery = { ...route.query }
    delete nextQuery.quickAction
    await router.replace({ query: nextQuery })
  }

  /** 路由变化或组件卸载时清理未执行的延迟任务。 */
  const clearQuickActionTimer = () => {
    if (quickActionTimer.value) {
      window.clearTimeout(quickActionTimer.value)
      quickActionTimer.value = null
    }
  }

  const triggerAction = () => {
    clearQuickActionTimer()
    quickActionTimer.value = window.setTimeout(() => {
      // 延迟期间如果 quickAction 已变化，放弃执行，避免打开错误页面的弹窗。
      if (!isMatchedQuickAction()) {
        quickActionTimer.value = null
        isWaitingForTransition.value = false
        return
      }

      onTrigger()
      void clearQuickAction()
      quickActionTimer.value = null
      isWaitingForTransition.value = false
    }, delay)
  }

  const queueQuickAction = () => {
    isWaitingForTransition.value = true

    // 等待当前 DOM 更新周期结束，确保目标页面已完成基础渲染。
    void nextTick(() => {
      if (!isWaitingForTransition.value || !isMatchedQuickAction()) {
        return
      }

      triggerAction()
    })
  }

  const resetQuickActionState = () => {
    isWaitingForTransition.value = false
    clearQuickActionTimer()
  }

  onMounted(() => {
    // 导航触发前关闭当前页面弹窗，避免旧弹窗残留到新页面。
    mittBus.on('closePageDialogs', onCloseDialogs)
  })

  onActivated(() => {
    if (isMatchedQuickAction()) {
      queueQuickAction()
    }
  })

  watch(
    () => route.query.quickAction,
    (quickAction) => {
      if (quickAction !== actionKey) {
        resetQuickActionState()
        return
      }

      queueQuickAction()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    mittBus.off('closePageDialogs', onCloseDialogs)
    resetQuickActionState()
  })

  return {
    clearQuickAction
  }
}
