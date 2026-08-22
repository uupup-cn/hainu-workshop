<!-- 顶部栏 -->
<template>
  <div
    class="art-header-bar w-full bg-[var(--default-bg-color)]"
    :class="[
      isSidebarLayout ? '!bg-box border-b border-[var(--default-border)]' : '',
      !isSidebarLayout && (tabStyle === 'tab-card' || tabStyle === 'tab-google')
        ? 'mb-5 max-sm:mb-3 !bg-box'
        : ''
    ]"
  >
    <div
      class="relative box-border flex-b h-15 leading-15 select-none"
      :class="[
        !isSidebarLayout && (tabStyle === 'tab-card' || tabStyle === 'tab-google')
          ? 'border-b border-[var(--default-border)]'
          : ''
      ]"
    >
      <div class="flex-c flex-1 min-w-0 leading-15" style="display: flex">
        <!-- 系统信息  -->
        <div class="flex-c c-p" @click="toHome" v-if="showHeaderBrand">
          <ArtLogo class="overflow-hidden align-[-0.15em] fill-current" :style="brandLogoStyle" />
          <p v-if="width >= 1400" class="my-0 mx-2 text-lg" :style="brandNameStyle">
            {{ siteBrandName }}
          </p>
        </div>

        <ArtLogo
          class="!hidden overflow-hidden align-[-0.15em] fill-current"
          :style="compactLogoStyle"
          @click="toHome"
        />

        <!-- 菜单按钮 -->
        <ArtIconButton
          v-if="showMenuToggle"
          icon="ri:menu-2-fill"
          :style="menuButtonStyle"
          @click="visibleMenu"
        />

        <!-- 刷新按钮 -->
        <ArtIconButton
          v-if="shouldShowRefreshButton"
          icon="ri:refresh-line"
          class="refresh-btn max-sm:!hidden"
          :style="refreshButtonStyle"
          @click="reload"
        />

        <!-- 快速入口 -->
        <ArtFastEnter v-if="shouldShowFastEnter && width >= headerBarFastEnterMinWidth">
          <ArtIconButton icon="ri:function-line" :style="fastEnterButtonStyle" />
        </ArtFastEnter>

        <!-- 面包屑 -->
        <ArtBreadcrumb
          v-if="
            shouldShowBreadcrumb && (isLeftMenu || isDualMenu || isHoverMenu || isSidebarLayout)
          "
        />

        <!-- 顶部菜单 -->
        <ArtHorizontalMenu v-if="isTopMenu" :list="menuList" />

        <!-- 混合菜单-顶部 -->
        <ArtMixedMenu v-if="isTopLeftMenu" :list="menuList" />
      </div>

      <div class="flex-c gap-2.5">
        <!-- 搜索 -->
        <div
          v-if="shouldShowGlobalSearch"
          class="flex-cb w-40 h-9 px-2.5 c-p border border-g-400 rounded-custom-sm max-md:!hidden"
          @click="openSearchDialog"
        >
          <div class="flex-c">
            <ArtSvgIcon icon="ri:search-line" class="text-sm text-g-500" />
            <span class="text-xs font-normal text-g-500" :style="searchLabelStyle">
              {{ $t('topBar.search.title') }}
            </span>
          </div>
          <div class="flex-c h-5 px-1.5 text-g-500/80 border border-g-400 rounded">
            <ArtSvgIcon v-if="isWindows" icon="vaadin:ctrl-a" class="text-sm" />
            <ArtSvgIcon v-else icon="ri:command-fill" class="text-xs" />
            <span class="text-xs" :style="searchShortcutStyle">k</span>
          </div>
        </div>

        <!-- 全屏按钮 -->
        <ArtIconButton
          v-if="shouldShowFullscreen"
          :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-fill'"
          :class="[!isFullscreen ? 'full-screen-btn' : 'exit-full-screen-btn']"
          :style="fullscreenButtonStyle"
          class="max-md:!hidden"
          @click="toggleFullScreen"
        />

        <!-- 国际化按钮 -->
        <ElDropdown
          @command="changeLanguage"
          popper-class="langDropDownStyle"
          v-if="shouldShowLanguage"
        >
          <ArtIconButton icon="ri:translate-2" class="language-btn text-[19px]" />
          <template #dropdown>
            <ElDropdownMenu>
              <div v-for="item in languageOptions" :key="item.value" class="lang-btn-item">
                <ElDropdownItem
                  :command="item.value"
                  :class="{ 'is-selected': locale === item.value }"
                >
                  <span class="menu-txt">{{ item.label }}</span>
                  <ArtSvgIcon icon="ri:check-fill" v-if="locale === item.value" />
                </ElDropdownItem>
              </div>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <!-- 通知按钮 -->
        <ArtIconButton
          v-if="shouldShowNotification"
          icon="ri:notification-2-line"
          class="notice-button relative"
          @click="visibleNotice"
        >
          <div
            v-if="hasUnread"
            class="absolute top-2 size-1.5 !bg-danger rounded-full"
            :style="statusDotStyle"
          ></div>
        </ArtIconButton>

        <!-- 聊天按钮 -->
        <ArtIconButton
          v-if="shouldShowChat"
          icon="ri:message-3-line"
          class="chat-button relative"
          @click="openChat"
        >
          <div
            class="breathing-dot absolute top-2 size-1.5 !bg-success rounded-full"
            :style="statusDotStyle"
          ></div>
        </ArtIconButton>

        <!-- 设置按钮 -->
        <div v-if="shouldShowSettings">
          <ArtIconButton icon="ri:settings-line" class="setting-btn" @click="openSetting" />
        </div>

        <!-- 主题配置按钮 -->
        <div v-if="shouldShowThemeCustomizer" class="theme-customizer-entry relative">
          <ArtIconButton
            icon="ri:palette-line"
            class="theme-customizer-btn"
            @click="openThemeCustomizer"
          />
          <span class="theme-customizer-dot"></span>
        </div>

        <!-- 主题切换按钮 -->
        <ArtIconButton
          v-if="shouldShowThemeToggle"
          @click="themeAnimation"
          :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'"
        />

        <!-- 全局专注模式 -->
        <div
          class="group/focus-mode flex h-8.5 items-center overflow-hidden rounded text-g-600 tad-200 hover:bg-hover-color dark:text-g-800 max-md:!hidden"
        >
          <ElTooltip
            :content="
              isCurrentFocusMode
                ? '退出全局专注模式，恢复页面辅助内容显示'
                : '开启全局专注模式，隐藏非核心内容，聚焦表格操作体验'
            "
            placement="bottom"
          >
            <button
              type="button"
              class="relative flex size-8.5 cursor-pointer items-center justify-center rounded text-xl outline-none tad-200 focus-visible:ring-2 focus-visible:ring-primary/30"
              :aria-label="isCurrentFocusMode ? '退出全局专注' : '全局专注模式'"
              @click="toggleGlobalFocusMode"
            >
              <ArtSvgIcon
                :icon="isCurrentFocusMode ? 'ri:brain-ai-3-line' : 'ri:brain-3-line'"
                class="text-[21px]"
                :class="{ 'text-primary': isCurrentFocusMode }"
              />
              <span class="theme-customizer-dot"></span>
              <span class="sr-only">{{ isCurrentFocusMode ? '退出专注' : '专注模式' }}</span>
            </button>
          </ElTooltip>

          <ElPopover placement="bottom-end" trigger="click" :width="210">
            <template #reference>
              <button
                type="button"
                class="flex h-8.5 w-5 cursor-pointer items-center justify-center rounded outline-none tad-200 hover:bg-hover-color focus-visible:ring-2 focus-visible:ring-primary/30"
                title="专注模式设置，可配置是否隐藏标签页"
                aria-label="专注模式设置，可配置是否隐藏标签页"
              >
                <ArtSvgIcon
                  icon="ri:arrow-down-s-line"
                  class="text-sm opacity-70 group-hover/focus-mode:opacity-100 dark:opacity-100"
                />
              </button>
            </template>

            <div class="py-1">
              <div class="mb-3 text-sm font-medium text-g-900">专注模式设置</div>
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-sm text-g-800">隐藏标签页</div>
                  <div class="mt-1 text-xs leading-5 text-g-500">仅在全局专注开启时生效</div>
                </div>
                <ElSwitch
                  :model-value="globalFocusHideWorkTab"
                  @update:model-value="setGlobalFocusHideWorkTab"
                />
              </div>
            </div>
          </ElPopover>
        </div>

        <!-- 用户头像、菜单 -->
        <ArtUserMenu />
      </div>
    </div>

    <!-- 标签页 -->
    <ArtWorkTab v-if="!isSidebarLayout && shouldRenderWorkTab" />

    <!-- 通知 -->
    <ArtNotification v-model:value="showNotice" ref="notice" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useFullscreen, useWindowSize } from '@vueuse/core'
  import { LanguageEnum, MenuTypeEnum } from '@/enums/appEnum'
  import { useNotificationStore } from '@/store/modules/notification'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useMenuStore } from '@/store/modules/menu'
  import { usePageViewPreferenceStore } from '@/store/modules/page-view-preference'
  import AppConfig from '@/config'
  import { languageOptions } from '@/locales'
  import { mittBus } from '@/utils/sys'
  import { themeAnimation } from '@/utils/ui/animation'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useHeaderBar } from '@/hooks/core/useHeaderBar'
  import ArtUserMenu from './widget/ArtUserMenu.vue'

  defineOptions({ name: 'ArtHeaderBar' })

  // 检测操作系统类型
  const isWindows = navigator.userAgent.includes('Windows')

  const router = useRouter()
  const { locale } = useI18n()
  const { width } = useWindowSize()

  const notificationStore = useNotificationStore()
  const siteSettingsStore = useSiteSettingsStore()
  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const pageViewPreferenceStore = usePageViewPreferenceStore()

  // 顶部栏功能配置
  const {
    shouldShowMenuButton,
    shouldShowRefreshButton,
    shouldShowFastEnter,
    shouldShowBreadcrumb,
    shouldShowGlobalSearch,
    shouldShowFullscreen,
    shouldShowNotification,
    shouldShowChat,
    shouldShowLanguage,
    shouldShowSettings,
    shouldShowThemeCustomizer,
    shouldShowThemeToggle,
    fastEnterMinWidth: headerBarFastEnterMinWidth
  } = useHeaderBar()

  const { menuOpen, menuType, isDark, tabStyle } = storeToRefs(settingStore)

  const { hasUnread } = storeToRefs(notificationStore)
  const { language } = storeToRefs(userStore)
  const { menuList } = storeToRefs(menuStore)
  const { globalFocusMode, globalFocusHideWorkTab, currentFocusPageKey, focusModes } =
    storeToRefs(pageViewPreferenceStore)
  const siteBrandName = computed(() => siteSettingsStore.siteBrandName || AppConfig.systemInfo.name)

  const showNotice = ref(false)
  const notice = ref(null)

  // 菜单类型判断
  const isLeftMenu = computed(() => menuType.value === MenuTypeEnum.LEFT)
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)
  const isHoverMenu = computed(() => menuType.value === MenuTypeEnum.HOVER_MENU)
  const isTopMenu = computed(() => menuType.value === MenuTypeEnum.TOP)
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)
  const isSidebarLayout = computed(() => menuType.value === MenuTypeEnum.SIDEBAR)
  const showHeaderBrand = computed(() => isTopMenu.value || isSidebarLayout.value)
  const showMenuToggle = computed(
    () =>
      (isLeftMenu.value || isDualMenu.value || isSidebarLayout.value || isHoverMenu.value) &&
      shouldShowMenuButton.value
  )
  const shouldRenderWorkTab = computed(
    () => !(globalFocusMode.value && globalFocusHideWorkTab.value)
  )
  const isCurrentFocusMode = computed(
    () => globalFocusMode.value || !!focusModes.value[currentFocusPageKey.value]
  )

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const brandLogoStyle = computed(() => ({
    paddingInlineStart: '1.125rem'
  }))
  const brandNameStyle = computed(() => ({
    marginInlineStart: '0.5rem'
  }))
  const compactLogoStyle = computed(() => ({
    paddingInlineStart: '0.875rem'
  }))
  const menuButtonStyle = computed(() => ({
    marginInlineStart: '0.75rem'
  }))
  const refreshButtonStyle = computed(() => ({
    marginInlineStart:
      !isLeftMenu.value && !isHoverMenu.value && !isSidebarLayout.value ? '10px' : '0.75rem'
  }))
  const fastEnterButtonStyle = computed(() => ({
    marginInlineStart: '0.75rem'
  }))
  const searchLabelStyle = computed(() => ({
    marginInlineStart: '0.25rem'
  }))
  const searchShortcutStyle = computed(() => ({
    marginInlineStart: '0.125rem'
  }))
  const fullscreenButtonStyle = computed(() => ({
    marginInlineStart: '0.75rem'
  }))
  const statusDotStyle = computed(() => ({
    insetInlineEnd: '0.5rem'
  }))

  onMounted(() => {
    initLanguage()
    notificationStore.init()
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    notificationStore.disconnectStream()
    document.removeEventListener('click', bodyCloseNotice)
  })

  /**
   * 切换全屏状态
   */
  const toggleFullScreen = (): void => {
    toggleFullscreen()
  }

  /**
   * 切换全局专注模式。
   */
  const toggleGlobalFocusMode = (): void => {
    if (isCurrentFocusMode.value) {
      pageViewPreferenceStore.setGlobalFocusMode(false)
      if (currentFocusPageKey.value) {
        pageViewPreferenceStore.setFocusMode(currentFocusPageKey.value, false)
      }
      return
    }

    pageViewPreferenceStore.setGlobalFocusMode(true)
  }

  /**
   * 设置全局专注模式下是否隐藏标签页。
   */
  const setGlobalFocusHideWorkTab = (value: string | number | boolean): void => {
    pageViewPreferenceStore.setGlobalFocusHideWorkTab(Boolean(value))
  }

  /**
   * 切换菜单显示/隐藏状态
   */
  const visibleMenu = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  const { homePath } = useCommon()
  const { refresh } = useCommon()

  /**
   * 跳转到首页
   */
  const toHome = (): void => {
    router.push(homePath.value)
  }

  /**
   * 刷新页面
   * @param {number} time - 延迟时间，默认为0毫秒
   */
  const reload = (time: number = 0): void => {
    setTimeout(() => {
      refresh()
    }, time)
  }

  /**
   * 初始化语言设置
   */
  const initLanguage = (): void => {
    locale.value = language.value
  }

  /**
   * 切换系统语言
   * @param {LanguageEnum} lang - 目标语言类型
   */
  const changeLanguage = (lang: LanguageEnum): void => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
    reload(50)
  }

  /**
   * 打开设置面板
   */
  const openSetting = (): void => {
    mittBus.emit('openSetting')
  }

  /**
   * 打开全局搜索对话框
   */
  const openSearchDialog = (): void => {
    mittBus.emit('openSearchDialog')
  }

  /**
   * 点击页面其他区域关闭通知面板
   * @param {Event} e - 点击事件对象
   */
  const bodyCloseNotice = (e: any): void => {
    if (!showNotice.value) return

    const target = e.target as HTMLElement

    // 检查是否点击了通知按钮或通知面板内部
    const isNoticeButton = target.closest('.notice-button')
    const isNoticePanel = target.closest('.art-notification-panel')

    if (!isNoticeButton && !isNoticePanel) {
      showNotice.value = false
    }
  }

  /**
   * 切换通知面板显示状态
   */
  const visibleNotice = (): void => {
    showNotice.value = !showNotice.value
  }

  /**
   * 打开聊天窗口
   */
  const openChat = (): void => {
    mittBus.emit('openChat')
  }

  /**
   * 打开主题配置
   */
  const openThemeCustomizer = (): void => {
    mittBus.emit('openThemeCustomizer')
  }
</script>

<style lang="scss" scoped>
  /* Custom animations */
  @keyframes rotate180 {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0);
    }

    25% {
      transform: rotate(-5deg);
    }

    50% {
      transform: rotate(5deg);
    }

    75% {
      transform: rotate(-5deg);
    }

    100% {
      transform: rotate(0);
    }
  }

  @keyframes expand {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.9);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes moveUp {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-3px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes breathing {
    0% {
      opacity: 0.4;
      transform: scale(0.9);
    }

    50% {
      opacity: 1;
      transform: scale(1.1);
    }

    100% {
      opacity: 0.4;
      transform: scale(0.9);
    }
  }

  /* Hover animation classes */
  .refresh-btn:hover :deep(.art-svg-icon) {
    animation: rotate180 0.5s;
  }

  .language-btn:hover :deep(.art-svg-icon) {
    animation: moveUp 0.4s;
  }

  .setting-btn:hover :deep(.art-svg-icon) {
    animation: rotate180 0.5s;
  }

  .theme-customizer-btn:hover :deep(.art-svg-icon) {
    animation: moveUp 0.4s;
  }

  .theme-customizer-entry {
    display: inline-flex;
  }

  .theme-customizer-dot {
    position: absolute;
    inset-inline-end: 8px;
    top: 7px;
    width: 8px;
    height: 8px;
    pointer-events: none;
    background: linear-gradient(135deg, #ff5c6c 0%, #ff7d7d 100%);
    border: 1.5px solid rgb(255 255 255 / 92%);
    border-radius: 999px;
    box-shadow:
      0 0 0 3px rgb(255 92 108 / 12%),
      0 4px 10px rgb(255 92 108 / 24%);
    animation: breathing 1.8s ease-in-out infinite;
  }

  .full-screen-btn:hover :deep(.art-svg-icon) {
    animation: expand 0.6s forwards;
  }

  .exit-full-screen-btn:hover :deep(.art-svg-icon) {
    animation: shrink 0.6s forwards;
  }

  .notice-button:hover :deep(.art-svg-icon) {
    animation: shake 0.5s ease-in-out;
  }

  .chat-button:hover :deep(.art-svg-icon) {
    animation: shake 0.5s ease-in-out;
  }

  /* Breathing animation for chat dot */
  .breathing-dot {
    animation: breathing 1.5s ease-in-out infinite;
  }

  /* iPad breakpoint adjustments */
  @media screen and (width <= 768px) {
    .logo2 {
      display: block !important;
    }
  }

  @media screen and (width <= 640px) {
    .btn-box {
      width: 40px;
    }
  }
</style>
