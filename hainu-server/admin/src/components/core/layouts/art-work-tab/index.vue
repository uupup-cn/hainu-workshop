<!-- 标签页 -->
<template>
  <div
    v-if="showWorkTab"
    class="art-work-tab box-border flex-b w-full px-5 mb-3 select-none max-sm:px-[15px]"
    :class="[
      `art-work-tab--${tabStyle}`,
      tabStyle === 'tab-card' ? 'py-1 border-b border-[var(--default-border)]' : '',
      tabStyle === 'tab-google' ? 'pt-1 pb-0 border-b border-[var(--default-border)]' : ''
    ]"
  >
    <div class="-my-1 w-full overflow-hidden py-1" ref="scrollRef">
      <ul class="whitespace-nowrap !bg-transparent flex" :class="tabsContainerClass" ref="tabsRef">
        <li
          class="work-tab-item art-card-xs inline-flex flex-cc h-8 text-xs c-p hover:text-theme group"
          :class="[
            item.path === activeTab ? 'activ-tab !text-theme' : 'text-g-700! dark:text-g-800!',
            tabStyle === 'tab-google' ? 'google-tab relative !h-8 !leading-8 !border-none' : ''
          ]"
          :style="getTabItemStyle(item)"
          v-for="(item, index) in list"
          :key="item.path"
          :ref="item.path"
          :id="`scroll-li-${index}`"
          :data-fixed="item.fixedTab ? 'true' : 'false'"
          @click="clickTab(item)"
          @contextmenu.prevent="(e: MouseEvent) => showMenu(e, item.path)"
        >
          <span class="tab-drag-handle inline-flex min-w-0 items-center gap-1">
            <ArtSvgIcon
              v-show="item.icon"
              :icon="item.icon"
              class="text-base shrink-0"
              :class="item.path === activeTab ? 'text-theme' : 'text-g-600'"
            />
            <span class="truncate">
              {{ item.customTitle || formatMenuTitle(item.title) }}
            </span>
          </span>
          <span
            v-if="list.length > 1 && !item.fixedTab"
            class="tab-close-btn inline-flex flex-cc relative p-1 rounded-full tad-200 hover:bg-g-200"
            :style="{ marginInlineStart: '0.125rem' }"
            @click.stop="closeWorktab('current', item.path)"
          >
            <ArtSvgIcon icon="ri:close-large-fill" class="text-[10px] text-g-600" />
          </span>
          <div
            v-if="tabStyle === 'tab-google'"
            class="line absolute top-0 bottom-0 w-px h-4 my-auto bg-g-400 transition-opacity duration-150"
            :style="{ insetInlineStart: 0 }"
          />
        </li>
      </ul>
    </div>

    <div class="work-tab-actions flex gap-2">
      <div
        class="flex-cc art-card-xs relative top-0 size-8 leading-8 text-center c-p tad-200 hover:!bg-hover-color"
        :style="{
          borderRadius: 'calc(var(--custom-radius) / 2.5 + 0px)',
          marginTop: tabStyle === 'tab-google' ? '-2px' : ''
        }"
        @click="(e: MouseEvent) => showMenu(e, activeTab)"
      >
        <ArtSvgIcon icon="iconamoon:arrow-down-2-thin" class="text-2xl text-g-700" />
      </div>
      <button
        type="button"
        class="work-tab-action-btn art-card-xs max-sm:hidden!"
        :title="t('worktab.btn.contentFull')"
        :aria-label="t('worktab.btn.contentFull')"
        :style="{ marginTop: tabStyle === 'tab-google' ? '-2px' : '' }"
        @click="enterContentFull"
      >
        <ArtSvgIcon icon="ri:fullscreen-line" class="text-base text-g-700" />
      </button>
    </div>

    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="140"
      :border-radius="10"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
  import { LocationQueryRaw, useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { useDraggable, type SortableEvent } from 'vue-draggable-plus'
  import { useBreakpoints } from '@vueuse/core'

  import { useWorktabStore } from '@/store/modules/worktab'
  import { useUserStore } from '@/store/modules/user'
  import { formatMenuTitle } from '@/utils/router'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum } from '@/enums/appEnum'
  import type { MenuItemType } from '@/components/core/others/art-menu-right/types'
  import { useCommon } from '@/hooks/core/useCommon'
  import { WorkTab } from '@/types'

  defineOptions({ name: 'ArtWorkTab' })

  // 类型定义
  interface TouchState {
    startX: number
    currentX: number
  }

  type TabCloseType = 'current' | 'left' | 'right' | 'other' | 'all'

  // 基础设置
  const { t } = useI18n()
  const store = useWorktabStore()
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const { currentRoute } = router
  const settingStore = useSettingStore()
  const { tabStyle, showWorkTab, isRtl } = storeToRefs(settingStore)
  const { opened: list } = storeToRefs(store)
  const breakpoints = useBreakpoints({ sm: 640 })
  const isSmallScreen = breakpoints.smaller('sm')

  // DOM 引用
  const scrollRef = ref<HTMLElement | null>(null)
  const tabsRef = ref<HTMLElement | null>(null)
  const menuRef = ref()

  // 滚动位移直接写入 DOM，避免滚动时驱动整排标签重新渲染
  let currentTranslateX = 0
  let currentTransition = ''
  let transformFrame: number | null = null
  let transitionTimer: ReturnType<typeof setTimeout> | null = null

  const touchState = ref<TouchState>({
    startX: 0,
    currentX: 0
  })

  const clickedPath = ref('')
  const isDragging = ref(false)
  const recentlyDragged = ref(false)
  let recentDragTimer: ReturnType<typeof setTimeout> | null = null

  const applyTabsTransform = () => {
    if (!tabsRef.value) return

    tabsRef.value.style.transform = `translateX(${currentTranslateX}px)`
  }

  const applyTabsTransition = () => {
    if (!tabsRef.value) return

    tabsRef.value.style.transition = currentTransition
  }

  const scheduleTransformUpdate = () => {
    if (transformFrame !== null) return

    transformFrame = requestAnimationFrame(() => {
      transformFrame = null
      applyTabsTransform()
    })
  }

  const flushTransformUpdate = () => {
    if (transformFrame !== null) {
      cancelAnimationFrame(transformFrame)
      transformFrame = null
    }

    applyTabsTransform()
  }

  // 计算属性
  const activeTab = computed(() => currentRoute.value.path)
  const activeTabIndex = computed(() => list.value.findIndex((tab) => tab.path === activeTab.value))
  const tabsContainerClass = computed(() => [
    isRtl.value ? 'float-right' : 'float-left',
    tabStyle.value === 'tab-google' ? (isRtl.value ? 'pr-1' : 'pl-1') : ''
  ])

  const getTabItemStyle = (item: WorkTab) => ({
    marginInlineEnd: tabStyle.value === 'tab-google' ? '0.3rem' : '0.375rem',
    paddingBlock: '0',
    paddingInlineStart: item.fixedTab ? '10px' : '12px',
    paddingInlineEnd: item.fixedTab ? '10px' : '8px',
    borderRadius:
      tabStyle.value === 'tab-google'
        ? 'calc(var(--custom-radius) / 2.5 + 4px) !important'
        : 'calc(var(--custom-radius) / 2.5 + 2px) !important'
  })

  const resolveDirectionalCloseType = (type: TabCloseType): TabCloseType => {
    if (!isRtl.value || type === 'current' || type === 'other' || type === 'all') {
      return type
    }

    return type === 'left' ? 'right' : 'left'
  }

  const isTabOnScreenLeft = (targetIndex: number, baseIndex: number) => {
    return isRtl.value ? targetIndex > baseIndex : targetIndex < baseIndex
  }

  const isTabOnScreenRight = (targetIndex: number, baseIndex: number) => {
    return isRtl.value ? targetIndex < baseIndex : targetIndex > baseIndex
  }

  // 右键菜单逻辑
  const useContextMenu = () => {
    const getClickedTabInfo = () => {
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)
      const currentTab = list.value[clickedIndex]

      return {
        clickedIndex,
        currentTab,
        isLastTab: clickedIndex === list.value.length - 1,
        isOneTab: list.value.length === 1,
        isCurrentTab: clickedPath.value === activeTab.value
      }
    }

    // 检查标签页是否固定
    const checkTabsFixedStatus = (clickedIndex: number) => {
      const logicalLeftTabs = list.value.slice(0, clickedIndex)
      const logicalRightTabs = list.value.slice(clickedIndex + 1)
      const leftTabs = isRtl.value ? logicalRightTabs : logicalLeftTabs
      const rightTabs = isRtl.value ? logicalLeftTabs : logicalRightTabs
      const otherTabs = list.value.filter((_, index) => index !== clickedIndex)

      return {
        areAllLeftTabsFixed: leftTabs.length > 0 && leftTabs.every((tab) => tab.fixedTab),
        areAllRightTabsFixed: rightTabs.length > 0 && rightTabs.every((tab) => tab.fixedTab),
        areAllOtherTabsFixed: otherTabs.length > 0 && otherTabs.every((tab) => tab.fixedTab),
        areAllTabsFixed: list.value.every((tab) => tab.fixedTab)
      }
    }

    // 右键菜单选项
    const menuItems = computed(() => {
      const { clickedIndex, currentTab, isLastTab, isOneTab, isCurrentTab } = getClickedTabInfo()
      const fixedStatus = checkTabsFixedStatus(clickedIndex)
      const isScreenLeftEdge = isRtl.value ? isLastTab : clickedIndex === 0
      const isScreenRightEdge = isRtl.value ? clickedIndex === 0 : isLastTab

      const items = [
        {
          key: 'refresh',
          label: t('worktab.btn.refresh'),
          icon: 'ri:refresh-line',
          disabled: !isCurrentTab
        },
        {
          key: 'fixed',
          label: currentTab?.fixedTab ? t('worktab.btn.unfixed') : t('worktab.btn.fixed'),
          icon: 'ri:pushpin-2-line',
          disabled: false
        },
        ...(!isSmallScreen.value
          ? [
              {
                key: 'contentFull',
                label: t('worktab.btn.contentFull'),
                icon: 'ri:fullscreen-line',
                iconClass: 'work-tab-menu-icon--compact',
                disabled: false,
                showLine: true
              }
            ]
          : []),
        {
          key: 'left',
          label: t('worktab.btn.closeLeft'),
          icon: 'ri:arrow-left-s-line',
          disabled: isScreenLeftEdge || fixedStatus.areAllLeftTabsFixed
        },
        {
          key: 'right',
          label: t('worktab.btn.closeRight'),
          icon: 'ri:arrow-right-s-line',
          disabled: isScreenRightEdge || fixedStatus.areAllRightTabsFixed
        },
        {
          key: 'other',
          label: t('worktab.btn.closeOther'),
          icon: 'ri:close-fill',
          disabled: isOneTab || fixedStatus.areAllOtherTabsFixed
        },
        {
          key: 'all',
          label: t('worktab.btn.closeAll'),
          icon: 'ri:close-circle-line',
          disabled: isOneTab || fixedStatus.areAllTabsFixed
        }
      ]

      return items
    })

    return { menuItems }
  }

  // 滚动逻辑
  const useScrolling = () => {
    const getScrollMetrics = () => {
      if (!scrollRef.value || !tabsRef.value) return null

      const viewportWidth = scrollRef.value.offsetWidth
      const contentWidth = tabsRef.value.offsetWidth
      const overflowWidth = Math.max(contentWidth - viewportWidth, 0)

      return {
        viewportWidth,
        contentWidth,
        overflowWidth,
        minTranslateX: isRtl.value ? 0 : -overflowWidth,
        maxTranslateX: isRtl.value ? overflowWidth : 0
      }
    }

    const clampTranslateX = (value: number) => {
      const metrics = getScrollMetrics()

      if (!metrics) return 0

      return Math.min(Math.max(value, metrics.minTranslateX), metrics.maxTranslateX)
    }

    const setTranslateX = (value: number, immediate = false) => {
      const nextTranslateX = clampTranslateX(value)

      if (nextTranslateX === currentTranslateX) return

      currentTranslateX = nextTranslateX

      if (immediate) {
        flushTransformUpdate()
        return
      }

      scheduleTransformUpdate()
    }

    const setTransition = () => {
      if (transitionTimer) {
        clearTimeout(transitionTimer)
      }

      currentTransition = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)'
      applyTabsTransition()

      transitionTimer = setTimeout(() => {
        currentTransition = ''
        applyTabsTransition()
        transitionTimer = null
      }, 250)
    }

    const getCurrentTabElement = (): HTMLElement | null => {
      return document.getElementById(`scroll-li-${activeTabIndex.value}`)
    }

    const calculateScrollPosition = () => {
      if (!scrollRef.value || !tabsRef.value) return

      flushTransformUpdate()

      const metrics = getScrollMetrics()
      const curTabEl = getCurrentTabElement()

      if (!metrics || !curTabEl) return

      const scrollRect = scrollRef.value.getBoundingClientRect()
      const tabRect = curTabEl.getBoundingClientRect()

      return {
        ...metrics,
        hiddenLeft: Math.max(scrollRect.left - tabRect.left, 0),
        hiddenRight: Math.max(tabRect.right - scrollRect.right, 0)
      }
    }

    const autoPositionTab = () => {
      const positions = calculateScrollPosition()
      if (!positions) return

      const { overflowWidth, hiddenLeft, hiddenRight } = positions

      if (overflowWidth <= 0) {
        setTranslateX(0)
        return
      }

      if (!hiddenLeft && !hiddenRight) {
        return
      }

      requestAnimationFrame(() => {
        if (hiddenLeft > 0) {
          setTranslateX(currentTranslateX + hiddenLeft)
        } else if (hiddenRight > 0) {
          setTranslateX(currentTranslateX - hiddenRight)
        }
      })
    }

    const adjustPositionAfterClose = () => {
      setTranslateX(currentTranslateX, true)
      requestAnimationFrame(autoPositionTab)
    }

    return {
      setTranslateX,
      setTransition,
      autoPositionTab,
      adjustPositionAfterClose
    }
  }

  // 事件处理逻辑
  const useEventHandlers = () => {
    const { setTransition, adjustPositionAfterClose, setTranslateX } = useScrolling()
    let tabEventTarget: HTMLElement | null = null

    const handleWheelScroll = (event: WheelEvent) => {
      if (!scrollRef.value || !tabsRef.value) return
      if (isDragging.value) return

      event.preventDefault()

      if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      // Keep wheel behavior consistent with native horizontal scrolling in both LTR and RTL.
      setTranslateX(currentTranslateX - delta)
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchState.value.startX = event.touches[0].clientX
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!scrollRef.value || !tabsRef.value) return
      if (isDragging.value) return

      touchState.value.currentX = event.touches[0].clientX
      const deltaX = touchState.value.currentX - touchState.value.startX

      setTranslateX(currentTranslateX + deltaX)
      touchState.value.startX = touchState.value.currentX
    }

    const handleTouchEnd = () => {
      setTransition()
    }

    const setupEventListeners = () => {
      if (!tabsRef.value || tabsRef.value === tabEventTarget) return

      cleanupEventListeners()
      tabEventTarget = tabsRef.value
      tabEventTarget.addEventListener('wheel', handleWheelScroll, { passive: false })
      tabEventTarget.addEventListener('touchstart', handleTouchStart, { passive: true })
      tabEventTarget.addEventListener('touchmove', handleTouchMove, { passive: true })
      tabEventTarget.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    const cleanupEventListeners = () => {
      if (!tabEventTarget) return

      tabEventTarget.removeEventListener('wheel', handleWheelScroll)
      tabEventTarget.removeEventListener('touchstart', handleTouchStart)
      tabEventTarget.removeEventListener('touchmove', handleTouchMove)
      tabEventTarget.removeEventListener('touchend', handleTouchEnd)
      tabEventTarget = null
    }

    return {
      setupEventListeners,
      cleanupEventListeners,
      adjustPositionAfterClose
    }
  }

  // 标签页操作逻辑
  const useTabOperations = (adjustPositionAfterClose: () => void) => {
    const clickTab = (item: WorkTab) => {
      if (isDragging.value || recentlyDragged.value) return

      router.push({
        path: item.path,
        query: item.query as LocationQueryRaw
      })
    }

    const closeWorktab = (type: TabCloseType, tabPath: string) => {
      const path = typeof tabPath === 'string' ? tabPath : route.path
      const resolvedType = resolveDirectionalCloseType(type)

      const closeActions = {
        current: () => store.removeTab(path),
        left: () => store.removeLeft(path),
        right: () => store.removeRight(path),
        other: () => store.removeOthers(path),
        all: () => store.removeAll()
      }

      closeActions[resolvedType]?.()

      nextTick(() => {
        adjustPositionAfterClose()
      })
    }

    const showMenu = (e: MouseEvent, path?: string) => {
      if (isDragging.value) return

      clickedPath.value = path || ''
      menuRef.value?.show(e)
      e.preventDefault()
      e.stopPropagation()
    }

    const handleSelect = (item: MenuItemType) => {
      const { key } = item

      if (key === 'refresh') {
        useCommon().refresh()
        return
      }

      if (key === 'fixed') {
        useWorktabStore().toggleFixedTab(clickedPath.value)
        return
      }

      if (key === 'contentFull') {
        enterContentFull()
        return
      }

      const activeIndex = list.value.findIndex((tab) => tab.path === activeTab.value)
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)

      const navigationRules = {
        left: isTabOnScreenLeft(activeIndex, clickedIndex),
        right: isTabOnScreenRight(activeIndex, clickedIndex),
        other: true
      } as const

      const shouldNavigate = navigationRules[key as keyof typeof navigationRules]

      if (shouldNavigate) {
        router.push(clickedPath.value)
      }

      closeWorktab(key as TabCloseType, clickedPath.value)
    }

    return {
      clickTab,
      closeWorktab,
      showMenu,
      handleSelect
    }
  }

  // 组合所有逻辑
  const { menuItems } = useContextMenu()
  const { setTransition, autoPositionTab } = useScrolling()
  const { setupEventListeners, cleanupEventListeners, adjustPositionAfterClose } =
    useEventHandlers()
  const { clickTab, closeWorktab, showMenu, handleSelect } =
    useTabOperations(adjustPositionAfterClose)

  const enterContentFull = () => {
    settingStore.switchMenuLayouts(MenuTypeEnum.CONTENT_FULL)
  }

  const markRecentDrag = () => {
    recentlyDragged.value = true

    if (recentDragTimer) {
      clearTimeout(recentDragTimer)
    }

    recentDragTimer = setTimeout(() => {
      recentlyDragged.value = false
      recentDragTimer = null
    }, 180)
  }

  const handleDragMove = (event: any) => {
    const draggedFixed = event.dragged?.dataset?.fixed
    const relatedFixed = event.related?.dataset?.fixed

    if (!draggedFixed || !relatedFixed) {
      return true
    }

    return draggedFixed === relatedFixed
  }

  const handleDragStart = () => {
    isDragging.value = true
  }

  const handleDragEnd = (event: SortableEvent) => {
    isDragging.value = false

    if (event.oldIndex == null || event.newIndex == null || event.oldIndex === event.newIndex) {
      return
    }

    markRecentDrag()
    store.reorderTabs(list.value.map((tab) => tab.path))

    nextTick(() => {
      setTransition()
      autoPositionTab()
    })
  }

  const draggable = useDraggable(tabsRef, list, {
    immediate: false,
    animation: 180,
    draggable: '.work-tab-item',
    handle: '.tab-drag-handle',
    filter: '.tab-close-btn',
    preventOnFilter: false,
    direction: 'horizontal',
    fallbackTolerance: 4,
    delay: 180,
    delayOnTouchOnly: true,
    touchStartThreshold: 4,
    ghostClass: 'work-tab-ghost',
    chosenClass: 'work-tab-chosen',
    dragClass: 'work-tab-drag',
    onMove: handleDragMove,
    onStart: handleDragStart,
    onEnd: handleDragEnd
  })

  const setupTabDragging = async () => {
    await nextTick()
    if (!tabsRef.value) return

    draggable.start(tabsRef.value)
  }

  const setupTabsDomInteractions = async () => {
    await setupTabDragging()
    setupEventListeners()
    applyTabsTransition()
    flushTransformUpdate()
    autoPositionTab()
  }

  const cleanupTabsDomInteractions = () => {
    cleanupEventListeners()
    draggable.destroy()
    isDragging.value = false
  }

  // 生命周期
  onMounted(() => {
    if (showWorkTab.value) {
      void setupTabsDomInteractions()
    }
  })

  onUnmounted(() => {
    cleanupTabsDomInteractions()

    if (recentDragTimer) {
      clearTimeout(recentDragTimer)
      recentDragTimer = null
    }

    if (transitionTimer) {
      clearTimeout(transitionTimer)
      transitionTimer = null
    }

    if (transformFrame !== null) {
      cancelAnimationFrame(transformFrame)
      transformFrame = null
    }
  })

  // 监听器
  watch(
    () => currentRoute.value,
    () => {
      setTransition()
      autoPositionTab()
    }
  )

  watch(
    () => [userStore.language, isRtl.value, tabStyle.value],
    () => {
      currentTranslateX = 0
      flushTransformUpdate()
      nextTick(() => {
        adjustPositionAfterClose()
      })
    }
  )

  watch(
    showWorkTab,
    (visible) => {
      if (visible) {
        void setupTabsDomInteractions()
        return
      }

      cleanupTabsDomInteractions()
    },
    { flush: 'post' }
  )

  watch(
    () => list.value.length,
    () => {
      nextTick(() => {
        adjustPositionAfterClose()
      })
    }
  )
</script>

<style scoped>
  .work-tab-item {
    will-change: transform;
  }

  .tab-drag-handle {
    cursor: grab;
  }

  .tab-drag-handle:active {
    cursor: grabbing;
  }

  .work-tab-ghost {
    opacity: 0.4;
  }

  .work-tab-chosen {
    z-index: 2;
  }

  .work-tab-drag {
    opacity: 0.95;
  }

  .work-tab-actions {
    direction: ltr;
    flex-shrink: 0;
  }

  .work-tab-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    color: var(--art-gray-700);
    cursor: pointer;
    background: var(--default-box-color);
    border: 1px solid var(--art-surface-border);
    border-radius: calc(var(--custom-radius) / 2.5 + 0px);
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .work-tab-action-btn:hover {
    color: var(--theme-color);
    background: var(--art-gray-200);
  }

  :global(.work-tab-menu-icon--compact) {
    font-size: 0.875rem !important;
  }

  .google-tab.activ-tab {
    --google-tab-active-bg: var(--el-color-primary-light-9);

    z-index: 2;
    color: var(--theme-color) !important;
    background-color: var(--google-tab-active-bg) !important;
    border-bottom: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .google-tab.activ-tab::before,
  .google-tab.activ-tab::after {
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 20px;
    pointer-events: none;
    content: '';
    border-radius: 50%;
    box-shadow: 0 0 0 30px var(--google-tab-active-bg);
  }

  .google-tab.activ-tab::before {
    left: -20px;
    clip-path: inset(50% -10px 0 50%);
  }

  .google-tab.activ-tab::after {
    right: -20px;
    clip-path: inset(50% 50% 0 -10px);
  }

  .dark .google-tab.activ-tab {
    --google-tab-active-bg: var(--art-active-color);

    color: var(--art-gray-800) !important;
    background-color: var(--google-tab-active-bg) !important;
  }

  .dark .google-tab.activ-tab::before,
  .dark .google-tab.activ-tab::after {
    box-shadow: 0 0 0 30px var(--google-tab-active-bg);
  }

  .google-tab:not(.activ-tab):hover {
    box-sizing: border-box;
    color: var(--art-gray-600) !important;
    background-color: var(--art-gray-200) !important;
    border-bottom: 1px solid var(--default-box-color) !important;
    border-radius: calc(var(--custom-radius) / 2.5 + 4px) !important;
  }

  .dark .google-tab:not(.activ-tab):hover {
    background-color: var(--art-hover-color) !important;
  }

  .google-tab:hover .line,
  .google-tab.activ-tab .line,
  .google-tab:first-child .line {
    opacity: 0;
  }

  .google-tab {
    z-index: 1;
  }

  .google-tab:hover + .google-tab .line,
  .google-tab.activ-tab + .google-tab .line {
    opacity: 0;
  }

  .google-tab::before,
  .google-tab::after {
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 20px;
    content: '';
    border-radius: 50%;
    box-shadow: 0 0 0 30px transparent;
  }

  .google-tab::before {
    left: -20px;
    clip-path: inset(50% -10px 0 50%);
  }

  .google-tab::after {
    right: -20px;
    clip-path: inset(50% 50% 0 -10px);
  }

  .google-tab i:hover {
    color: var(--art-gray-700);
    background: var(--art-gray-300);
  }

  @media only screen and (width <= 768px) {
    .box-border.flex.justify-between {
      padding-right: 0.625rem;
      padding-left: 0.625rem;
    }
  }

  @media only screen and (width <= 640px) {
    .box-border.flex.justify-between {
      padding-right: 0.9375rem;
      padding-left: 0.9375rem;
    }
  }
</style>
