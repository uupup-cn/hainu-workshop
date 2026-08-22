<!-- 布局内容 -->
<template>
  <div
    ref="layoutContentRef"
    class="layout-content"
    :class="{
      'overflow-auto': isFullPage,
      'layout-content--full-height-page': hasFullHeightPage,
      'layout-content--flow-page': !hasFullHeightPage
    }"
    :style="containerStyle"
  >
    <div id="app-content-header">
      <!-- 节日滚动 -->
      <ArtFestivalTextScroll v-if="!isFullPage" />

      <!-- 路由信息调试 -->
      <div
        v-if="isOpenRouteInfo === 'true'"
        class="px-2 py-1.5 mb-3 text-sm text-g-500 bg-g-200 border-full-d rounded-md"
      >
        router meta：{{ route.meta }}
      </div>
    </div>

    <RouterView v-if="isRefresh" v-slot="{ Component, route }" :style="contentStyle">
      <Transition
        :name="showTransitionMask ? '' : actualTransition"
        :mode="actualTransition ? 'out-in' : undefined"
      >
        <KeepAlive v-if="route.meta.keepAlive" :max="10" :exclude="keepAliveExclude">
          <component class="art-page-view" :is="Component" :key="route.path" />
        </KeepAlive>
        <component v-else class="art-page-view" :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <ArtComplianceFooter
      v-if="shouldShowComplianceFooter"
      :is-full-height-page="hasFullHeightPage"
    />

    <!-- 全屏页面切换过渡遮罩（用于提升页面切换视觉体验） -->
    <Teleport to="body">
      <div
        v-show="showTransitionMask"
        class="fixed inset-0 z-[2000] w-screen h-screen pointer-events-none bg-box"
      />
    </Teleport>
  </div>
</template>
<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useRoute } from 'vue-router'
  import { MenuTypeEnum } from '@/enums/appEnum'
  import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight'
  import { useSettingStore } from '@/store/modules/setting'
  import { useWorktabStore } from '@/store/modules/worktab'
  import { usePageViewPreferenceStore } from '@/store/modules/page-view-preference'

  defineOptions({ name: 'ArtPageContent' })

  const route = useRoute()
  const settingStore = useSettingStore()
  const pageViewPreferenceStore = usePageViewPreferenceStore()
  const { pageTransition, containerWidth, refresh, menuType, showWorkTab, showComplianceFooter } =
    storeToRefs(settingStore)
  const { globalFocusMode, globalFocusHideWorkTab } = storeToRefs(pageViewPreferenceStore)

  const DEFAULT_CONTENT_EXTRA_SPACING = 15
  const SIDEBAR_CONTENT_TOP_PADDING = 16
  const SIDEBAR_HEADER_BORDER_HEIGHT = 1
  const SIDEBAR_WORKTAB_BORDER_HEIGHT = 1
  const CONTENT_FULL_VERTICAL_PADDING = 16
  const shouldRenderWorkTab = computed(
    () => showWorkTab.value && !(globalFocusMode.value && globalFocusHideWorkTab.value)
  )

  const layoutExtraSpacing = computed(() => {
    if (menuType.value === MenuTypeEnum.CONTENT_FULL) {
      return CONTENT_FULL_VERTICAL_PADDING * 2
    }

    if (menuType.value === MenuTypeEnum.SIDEBAR) {
      return (
        SIDEBAR_CONTENT_TOP_PADDING +
        SIDEBAR_HEADER_BORDER_HEIGHT +
        (shouldRenderWorkTab.value ? SIDEBAR_WORKTAB_BORDER_HEIGHT : 0)
      )
    }

    return DEFAULT_CONTENT_EXTRA_SPACING
  })
  const layoutHeaderIds = computed(() =>
    menuType.value === MenuTypeEnum.CONTENT_FULL
      ? ['', 'app-content-header']
      : ['app-header', 'app-content-header']
  )
  const layoutExtraHeaderId = computed(() =>
    menuType.value !== MenuTypeEnum.CONTENT_FULL && shouldRenderWorkTab.value
      ? 'app-worktab'
      : undefined
  )
  const { containerMinHeight } = useAutoLayoutHeight(layoutHeaderIds, {
    extraHeaderId: layoutExtraHeaderId,
    extraSpacing: layoutExtraSpacing
  })
  const { keepAliveExclude } = storeToRefs(useWorktabStore())

  const layoutContentRef = ref<HTMLElement>()
  const isRefresh = shallowRef(true)
  const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO
  const showTransitionMask = ref(false)
  const hasFullHeightPage = ref(false)
  let fullHeightObserver: MutationObserver | null = null

  // 标记是否是首次加载（浏览器刷新）
  const isFirstLoad = ref(true)

  // 检查当前路由是否需要使用无基础布局模式
  const isFullPage = computed(() => route.matched.some((r) => r.meta?.isFullPage))
  const prevIsFullPage = ref(isFullPage.value)
  const shouldShowComplianceFooter = computed(() => showComplianceFooter.value && !isFullPage.value)

  // 切换动画名称：首次加载、从全屏返回时不使用动画
  const actualTransition = computed(() => {
    if (isFirstLoad.value) return ''
    if (prevIsFullPage.value && !isFullPage.value) return ''
    return pageTransition.value
  })

  // 监听全屏状态变化，显示过渡遮罩
  watch(isFullPage, (val, oldVal) => {
    if (val !== oldVal) {
      showTransitionMask.value = true
      // 延迟隐藏遮罩，给足时间让页面完成切换
      setTimeout(() => {
        showTransitionMask.value = false
      }, 50)
    }

    nextTick(() => {
      prevIsFullPage.value = val
    })
  })

  const containerStyle = computed(
    (): CSSProperties =>
      isFullPage.value
        ? {
            position: 'fixed',
            inset: '0',
            width: '100%',
            height: '100vh',
            zIndex: 2500,
            background: 'var(--default-bg-color)'
          }
        : {
            maxWidth: containerWidth.value
          }
  )

  const contentStyle = computed(
    (): CSSProperties =>
      menuType.value === MenuTypeEnum.CONTENT_FULL || !hasFullHeightPage.value
        ? {}
        : {
            minHeight: containerMinHeight.value
          }
  )

  const updateFullHeightPageState = () => {
    const contentEl = layoutContentRef.value
    if (!contentEl) {
      hasFullHeightPage.value = false
      return
    }

    hasFullHeightPage.value = Boolean(
      contentEl.querySelector(
        '.art-page-view.art-full-height, .art-page-view .art-full-height, .art-page-view.page-content, .art-page-view .page-content'
      )
    )
  }

  const reload = () => {
    isRefresh.value = false
    nextTick(() => {
      isRefresh.value = true
    })
  }

  watch(refresh, reload, { flush: 'post' })
  watch(
    () => route.fullPath,
    () => {
      nextTick(updateFullHeightPageState)
    },
    { flush: 'post' }
  )

  // 组件挂载后标记首次加载完成
  onMounted(() => {
    // 延迟一帧，确保首次渲染完成
    nextTick(() => {
      isFirstLoad.value = false
      updateFullHeightPageState()
    })

    if (layoutContentRef.value) {
      fullHeightObserver = new MutationObserver(updateFullHeightPageState)
      fullHeightObserver.observe(layoutContentRef.value, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      })
    }
  })

  onBeforeUnmount(() => {
    fullHeightObserver?.disconnect()
    fullHeightObserver = null
  })
</script>
