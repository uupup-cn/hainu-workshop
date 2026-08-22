import { defineStore } from 'pinia'
import { ref } from 'vue'

type PageFocusModeMap = Record<string, boolean>

export const usePageViewPreferenceStore = defineStore(
  'pageViewPreferenceStore',
  () => {
    const globalFocusMode = ref(false)
    const globalFocusHideWorkTab = ref(false)
    const currentFocusPageKey = ref('')
    const focusModes = ref<PageFocusModeMap>({})
    const globalFocusExcludedPages = ref<PageFocusModeMap>({})

    const isFocusMode = (pageKey: string) => focusModes.value[pageKey] ?? false

    const setGlobalFocusMode = (value: boolean) => {
      globalFocusMode.value = value
      globalFocusExcludedPages.value = {}
    }

    const setGlobalFocusHideWorkTab = (value: boolean) => {
      globalFocusHideWorkTab.value = value
    }

    const setCurrentFocusPageKey = (pageKey: string) => {
      currentFocusPageKey.value = pageKey
    }

    const toggleGlobalFocusMode = () => {
      globalFocusMode.value = !globalFocusMode.value
      globalFocusExcludedPages.value = {}
    }

    const setFocusMode = (pageKey: string, value: boolean) => {
      focusModes.value = {
        ...focusModes.value,
        [pageKey]: value
      }

      if (value) {
        setGlobalFocusExcluded(pageKey, false)
      }
    }

    const toggleFocusMode = (pageKey: string) => {
      setFocusMode(pageKey, !isFocusMode(pageKey))
    }

    const isGlobalFocusExcluded = (pageKey: string) =>
      globalFocusExcludedPages.value[pageKey] ?? false

    const setGlobalFocusExcluded = (pageKey: string, value: boolean) => {
      globalFocusExcludedPages.value = {
        ...globalFocusExcludedPages.value,
        [pageKey]: value
      }
    }

    return {
      globalFocusMode,
      globalFocusHideWorkTab,
      currentFocusPageKey,
      focusModes,
      globalFocusExcludedPages,
      isFocusMode,
      isGlobalFocusExcluded,
      setGlobalFocusMode,
      setGlobalFocusHideWorkTab,
      setCurrentFocusPageKey,
      toggleGlobalFocusMode,
      setFocusMode,
      toggleFocusMode,
      setGlobalFocusExcluded
    }
  },
  {
    persist: {
      key: 'page-view-preference',
      storage: localStorage
    }
  }
)
