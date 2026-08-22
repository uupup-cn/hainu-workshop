<!-- 布局容器 -->
<template>
  <div
    class="app-layout"
    :class="{
      'app-layout--sidebar': isSidebarLayout,
      'app-layout--content-full': isContentFullLayout
    }"
  >
    <template v-if="isContentFullLayout">
      <main id="app-main">
        <div id="app-content">
          <ArtPageContent />
        </div>
      </main>
    </template>

    <template v-else-if="isSidebarLayout">
      <main id="app-main">
        <div id="app-header">
          <ArtHeaderBar />
        </div>
        <div class="app-body">
          <aside id="app-sidebar">
            <ArtSidebarMenu />
          </aside>
          <div class="app-content-shell">
            <div v-if="showWorkTab" id="app-worktab">
              <ArtWorkTab />
            </div>
            <div id="app-content">
              <ArtPageContent />
            </div>
          </div>
        </div>
      </main>
    </template>

    <template v-else>
      <aside id="app-sidebar">
        <ArtSidebarMenu />
      </aside>

      <main id="app-main">
        <div id="app-header">
          <ArtHeaderBar />
        </div>
        <div id="app-content">
          <ArtPageContent />
        </div>
      </main>
    </template>

    <div id="app-global">
      <ArtGlobalComponent />
    </div>

    <button
      v-if="isContentFullLayout"
      type="button"
      class="content-full-settings-entry"
      :class="{
        'is-collapse-ready': contentFullEntryCollapseReady,
        'is-collapsed': contentFullEntryCollapsed
      }"
      :aria-label="contentFullEntryLabel"
      :title="contentFullEntryLabel"
      @mouseenter="handleContentFullEntryMouseenter"
      @mouseleave="handleContentFullEntryMouseleave"
      @click="handleContentFullEntryClick"
      @dblclick.stop.prevent="handleContentFullEntryDblclick"
    >
      <ArtSvgIcon :icon="contentFullEntryIcon" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { MenuTypeEnum } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useCeremony } from '@/hooks/core/useCeremony'
  import { mittBus } from '@/utils/sys'

  defineOptions({ name: 'AppLayout' })

  const settingStore = useSettingStore()
  const { openFestival, cleanup } = useCeremony()
  const { menuType, showWorkTab, isRtl } = storeToRefs(settingStore)
  const isSidebarLayout = computed(() => menuType.value === MenuTypeEnum.SIDEBAR)
  const isContentFullLayout = computed(() => menuType.value === MenuTypeEnum.CONTENT_FULL)
  const contentFullEntryCollapsed = ref(false)
  const contentFullEntryCollapseReady = ref(false)
  let contentFullEntryHoverTimer: ReturnType<typeof setTimeout> | null = null
  let contentFullEntryClickTimer: ReturnType<typeof setTimeout> | null = null

  const contentFullEntryLabel = computed(() => {
    if (contentFullEntryCollapsed.value) return '展开设置入口'
    if (contentFullEntryCollapseReady.value) return '收起设置入口'
    return '打开设置，双击收起'
  })

  const contentFullEntryIcon = computed(() => {
    if (contentFullEntryCollapsed.value) {
      return isRtl.value ? 'ri:arrow-right-s-line' : 'ri:arrow-left-s-line'
    }

    if (contentFullEntryCollapseReady.value) {
      return isRtl.value ? 'ri:arrow-left-s-line' : 'ri:arrow-right-s-line'
    }

    return 'ri:settings-3-line'
  })

  const clearContentFullEntryHoverTimer = () => {
    if (!contentFullEntryHoverTimer) return

    clearTimeout(contentFullEntryHoverTimer)
    contentFullEntryHoverTimer = null
  }

  const clearContentFullEntryClickTimer = () => {
    if (!contentFullEntryClickTimer) return

    clearTimeout(contentFullEntryClickTimer)
    contentFullEntryClickTimer = null
  }

  const isElementVisible = (element: Element) => {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    const hasSize = rect.width > 0 && rect.height > 0

    return hasSize && style.display !== 'none' && style.visibility !== 'hidden'
  }

  const hasActiveOverlay = () =>
    Array.from(
      document.querySelectorAll(
        '.context-menu, .el-overlay, .el-popper, .el-message, .el-notification'
      )
    ).some(isElementVisible)

  const isEditableTarget = (target: EventTarget | null) => {
    const element = target instanceof HTMLElement ? target : null
    if (!element) return false

    return Boolean(element.closest('input, textarea, select, [contenteditable="true"]'))
  }

  const handleContentFullEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !isContentFullLayout.value) return
    if (isEditableTarget(event.target) || hasActiveOverlay()) return

    event.preventDefault()
    settingStore.exitContentFullLayout()
  }

  const openSetting = () => {
    mittBus.emit('openSetting')
  }

  const handleContentFullEntryMouseenter = () => {
    if (contentFullEntryCollapsed.value) return

    clearContentFullEntryHoverTimer()
    contentFullEntryHoverTimer = setTimeout(() => {
      contentFullEntryCollapseReady.value = true
      contentFullEntryHoverTimer = null
    }, 1000)
  }

  const handleContentFullEntryMouseleave = () => {
    clearContentFullEntryHoverTimer()

    if (!contentFullEntryCollapsed.value) {
      contentFullEntryCollapseReady.value = false
    }
  }

  const handleContentFullEntryClick = () => {
    if (contentFullEntryCollapsed.value) {
      clearContentFullEntryClickTimer()
      contentFullEntryCollapsed.value = false
      contentFullEntryCollapseReady.value = false
      return
    }

    clearContentFullEntryClickTimer()
    contentFullEntryClickTimer = setTimeout(() => {
      if (contentFullEntryCollapseReady.value) {
        contentFullEntryCollapsed.value = true
        contentFullEntryCollapseReady.value = false
        clearContentFullEntryHoverTimer()
        contentFullEntryClickTimer = null
        return
      }

      openSetting()
      contentFullEntryClickTimer = null
    }, 220)
  }

  const handleContentFullEntryDblclick = () => {
    if (contentFullEntryCollapsed.value) return

    clearContentFullEntryClickTimer()
    clearContentFullEntryHoverTimer()
    contentFullEntryCollapsed.value = true
    contentFullEntryCollapseReady.value = false
  }

  watch(isContentFullLayout, (fullLayout) => {
    if (fullLayout) return

    contentFullEntryCollapsed.value = false
    contentFullEntryCollapseReady.value = false
    clearContentFullEntryHoverTimer()
    clearContentFullEntryClickTimer()
  })

  onMounted(() => {
    window.addEventListener('keydown', handleContentFullEscape)
    openFestival()
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleContentFullEscape)
    cleanup()
    clearContentFullEntryHoverTimer()
    clearContentFullEntryClickTimer()
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
