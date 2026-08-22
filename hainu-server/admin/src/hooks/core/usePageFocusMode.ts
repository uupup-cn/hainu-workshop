import { computed, onActivated, onMounted, toValue, type MaybeRefOrGetter } from 'vue'
import { storeToRefs } from 'pinia'
import { usePageViewPreferenceStore } from '@/store/modules/page-view-preference'

/**
 * 页面专注模式偏好。
 *
 * 每个页面通过独立 pageKey 持久化自己的专注模式状态；全局专注模式也会让已接入
 * 该 hook 的页面进入专注态。页面仍自行决定哪些模块需要隐藏，hook 只提供状态和常用布局 class。
 */
export function usePageFocusMode(pageKey: MaybeRefOrGetter<string>) {
  const pageViewPreferenceStore = usePageViewPreferenceStore()
  const { globalFocusMode, focusModes, globalFocusExcludedPages } =
    storeToRefs(pageViewPreferenceStore)

  const currentPageKey = computed(() => toValue(pageKey))
  const pageFocusMode = computed(() => focusModes.value[currentPageKey.value] ?? false)
  const isExcludedFromGlobalFocus = computed(
    () => globalFocusExcludedPages.value[currentPageKey.value] ?? false
  )
  const isFocusMode = computed(
    () => pageFocusMode.value || (globalFocusMode.value && !isExcludedFromGlobalFocus.value)
  )

  /** 页面根容器 class：专注模式使用全高布局，方便表格填充剩余空间。 */
  const pageClass = computed(() => [
    'bg-[var(--default-bg-color)]',
    isFocusMode.value ? 'art-full-height' : 'min-h-full'
  ])

  /** 搜索区 class：专注模式隐藏上方辅助模块后，清理搜索区顶部间距。 */
  const searchClass = computed(() => ({
    '!mt-0': isFocusMode.value
  }))

  /** 表格卡片 class：专注模式减少上下留白，普通模式保持原列表页节奏。 */
  const tableCardClass = computed(() => (isFocusMode.value ? 'mt-3 mb-0' : 'mt-5 mb-5'))

  const registerCurrentPageKey = () => {
    pageViewPreferenceStore.setCurrentFocusPageKey(currentPageKey.value)
  }

  const setFocusMode = (value: boolean) => {
    pageViewPreferenceStore.setFocusMode(currentPageKey.value, value)
  }

  const toggleFocusMode = () => {
    if (globalFocusMode.value) {
      pageViewPreferenceStore.setFocusMode(currentPageKey.value, false)
      pageViewPreferenceStore.setGlobalFocusExcluded(currentPageKey.value, isFocusMode.value)
      return
    }

    pageViewPreferenceStore.toggleFocusMode(currentPageKey.value)
  }

  onMounted(registerCurrentPageKey)
  onActivated(registerCurrentPageKey)

  return {
    isFocusMode,
    pageFocusMode,
    isExcludedFromGlobalFocus,
    pageClass,
    searchClass,
    tableCardClass,
    setFocusMode,
    toggleFocusMode
  }
}
