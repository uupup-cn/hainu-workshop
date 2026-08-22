<!-- 左侧菜单 / 双列菜单 / 悬浮面板菜单 -->
<template>
  <template v-if="showLeftMenu || isDualMenu">
    <div
      v-if="!isMobileScreen"
      class="layout-sidebar"
      :class="{
        'no-border': menuList.length === 0,
        'is-sidebar-layout': isSidebarLayout,
        'is-hover-menu-layout': isHoverMenu,
        'is-dual-menu': isDualMenu,
        'is-dual-auto-hide': isDualAutoHide
      }"
      :style="
        isDualAutoHide
          ? { '--dual-rail-width': dualRailWidth, '--dual-overlay-width': dualOverlayWidth }
          : undefined
      "
      @mouseenter="cancelHoverPanelClose"
      @mouseleave="scheduleHoverPanelClose"
    >
      <!-- 悬浮面板菜单（左侧固定，右侧 Hover 展开） -->
      <div
        v-if="isHoverMenu"
        class="hover-menu-left"
        :class="{ 'is-collapsed': !menuOpen }"
        :style="{ width: `${hoverMenuRailWidth}px`, background: getMenuTheme.background }"
      >
        <div class="hover-menu-header" @click="navigateToHome">
          <ArtLogo class="logo" />
          <p :style="{ color: getMenuTheme.systemNameColor }">{{ siteBrandName }}</p>
        </div>

        <ElScrollbar ref="hoverMenuScrollbarRef" class="hover-menu-scroll">
          <ul>
            <li
              v-for="menu in firstLevelMenus"
              :key="menu.path"
              :data-hover-menu-path="menu.path"
              @mouseenter="handleHoverFirstLevelEnter(menu)"
              @focusin="handleHoverFirstLevelEnter(menu)"
              @click="handleHoverFirstLevelClick(menu)"
            >
              <button
                type="button"
                :class="{ 'is-active': menu.path === activeHoverMenuPath }"
                :title="$t(menu.meta.title)"
              >
                <ArtSvgIcon class="hover-menu-icon" :icon="menu.meta.icon" />
                <span>{{ $t(menu.meta.title) }}</span>
                <div v-if="menu.meta.showBadge" class="art-badge art-badge-dual" />
              </button>
            </li>
          </ul>
        </ElScrollbar>

        <!-- 商业升级入口（悬浮菜单 rail 底部，折叠时收成图标） -->
        <div v-if="showSidebarUpsell" class="hover-menu-footer">
          <ArtSidebarUpsell :collapsed="!menuOpen" />
        </div>
      </div>

      <HoverMenuPanel
        v-if="isHoverMenu"
        :visible="persistentHoverPanelVisible"
        :menu="hoverPanelMenu"
        :all-menus="firstLevelMenus"
        :active-path="routerPath"
        :rail-width="hoverMenuRailWidth"
        @panel-enter="cancelHoverPanelClose"
        @panel-leave="scheduleHoverPanelClose"
        @navigate="closeHoverPanel"
      />

      <!-- 双列菜单（左侧） -->
      <div
        v-if="isDualMenu"
        class="dual-menu-left"
        :style="{ width: dualRailWidth, background: getMenuTheme.background }"
      >
        <ArtLogo class="logo" @click="navigateToHome" />

        <ElScrollbar ref="dualMenuScrollbarRef" class="dual-menu-scroll">
          <ul>
            <li
              v-for="menu in firstLevelMenus"
              :key="menu.path"
              :data-dual-menu-path="menu.path"
              @click="handleDualFirstLevelSelect(menu)"
            >
              <ElTooltip
                class="box-item"
                effect="dark"
                :content="$t(menu.meta.title)"
                :placement="tooltipPlacement"
                :offset="15"
                :hide-after="0"
                :disabled="dualMenuShowText"
              >
                <div
                  :class="{ 'is-active': menu.path === activeFirstLevelMenuPath }"
                  :style="{
                    height: dualMenuShowText ? '60px' : '46px'
                  }"
                >
                  <ArtSvgIcon
                    class="menu-icon"
                    :icon="menu.meta.icon"
                    :style="{
                      marginBottom: dualMenuShowText ? '5px' : '0',
                      color: getMenuTheme.iconColor
                    }"
                  />
                  <span
                    v-if="dualMenuShowText"
                    class="text-md"
                    :style="{ color: getMenuTheme.textColor }"
                  >
                    {{ $t(menu.meta.title) }}
                  </span>
                  <div v-if="menu.meta.showBadge" class="art-badge art-badge-dual" />
                </div>
              </ElTooltip>
            </li>
          </ul>
        </ElScrollbar>

        <div class="dual-menu-bottom">
          <div class="dual-menu-bottom__line"></div>

          <div class="dual-menu-bottom__actions">
            <ArtIconButton
              :style="{ color: getMenuTheme.iconColor }"
              icon="ri:arrow-left-right-line"
              @click="toggleDualMenuMode"
            />
            <ArtIconButton
              :class="{ 'bg-hover-color': dualMenuAutoHide }"
              :style="{ color: getMenuTheme.iconColor }"
              icon="ri:pushpin-2-line"
              @click="toggleDualMenuAutoHide"
            />
            <ArtIconButton
              :style="{ color: getMenuTheme.iconColor }"
              icon="ri:account-circle-line"
              @click="goUserCenter"
            />
          </div>

          <div class="dual-menu-bottom__avatar" @click="goUserCenter">
            <img :src="userAvatar" alt="用户头像" class="dual-menu-bottom__avatar-img" />
          </div>
        </div>
      </div>

      <!-- 左侧菜单 || 双列菜单（右侧） -->
      <div
        v-if="!isHoverMenu"
        v-show="menuList.length > 0"
        class="menu-left"
        :class="`menu-left-${getMenuTheme.theme} menu-left-${!menuOpen ? 'close' : 'open'}`"
        :style="{ background: getMenuTheme.background }"
      >
        <!-- Logo、系统名称 -->
        <div
          v-if="!isSidebarLayout"
          class="header"
          @click="navigateToHome"
          :style="{
            background: getMenuTheme.background
          }"
        >
          <ArtLogo v-if="!isDualMenu" class="logo" />

          <p
            :class="{ 'is-dual-menu-name': isDualMenu }"
            :style="{
              color: getMenuTheme.systemNameColor,
              opacity: !menuOpen ? 0 : 1
            }"
          >
            {{ siteBrandName }}
          </p>
        </div>
        <ElScrollbar
          :style="scrollbarStyle"
          :view-style="scrollbarViewStyle"
          :wrap-style="scrollbarWrapStyle"
        >
          <ElMenu
            ref="menuRef"
            :class="'el-menu-' + getMenuTheme.theme"
            :collapse="!menuOpen"
            :default-active="routerPath"
            :text-color="getMenuTheme.textColor"
            :unique-opened="menuUniqueOpened"
            :background-color="getMenuTheme.background"
            :default-openeds="defaultOpenedMenus"
            :popper-class="`menu-left-popper menu-left-${getMenuTheme.theme}-popper`"
            :show-timeout="50"
            :hide-timeout="50"
          >
            <SidebarSubmenu :list="menuList" :theme="getMenuTheme" @close="handleMenuClose" />
          </ElMenu>
        </ElScrollbar>

        <!-- 商业升级入口（始终展示在侧边栏底部，折叠时收成图标） -->
        <div v-if="showSidebarUpsell" class="menu-left-footer">
          <ArtSidebarUpsell :collapsed="!menuOpen" />
        </div>

        <!-- 双列菜单右侧折叠按钮 -->
        <div class="dual-menu-collapse-btn" v-if="isDualMenu" @click="toggleMenuVisibility">
          <ArtSvgIcon class="text-g-500/70" :icon="collapseIcon" />
        </div>
      </div>
    </div>

    <!-- 移动端独立使用 Drawer，避免复用桌面端折叠侧栏带来的定位和动画干扰 -->
    <ElDrawer
      v-else
      v-model="mobileDrawerVisible"
      class="art-mobile-menu-drawer"
      :class="{ 'is-rtl': isRtl }"
      :direction="mobileDrawerDirection"
      :size="mobileDrawerSize"
      :style="mobileDrawerStyle"
      :append-to-body="true"
      :lock-scroll="true"
      :with-header="false"
      :destroy-on-close="false"
      @opened="syncActiveMenu"
    >
      <div class="mobile-menu-shell" :class="{ 'is-rtl': isRtl }">
        <!-- Drawer 顶部仅保留品牌入口，点击后会先关闭抽屉再跳首页 -->
        <div class="mobile-menu-header">
          <button
            type="button"
            class="mobile-menu-brand"
            @click="handleMobileHomeClick"
            :aria-label="siteBrandName"
          >
            <ArtLogo class="mobile-menu-brand__logo" />
            <span class="mobile-menu-brand__name">{{ siteBrandName }}</span>
          </button>
        </div>

        <!-- 顶部左侧 / 双列菜单在移动端补一层一级菜单切换，避免只能看到当前分组 -->
        <div v-if="showMobileSectionTabs" class="mobile-menu-sections">
          <button
            v-for="menu in firstLevelMenus"
            :key="menu.path"
            type="button"
            class="mobile-menu-section"
            :class="{ 'is-active': menu.path === activeFirstLevelMenuPath }"
            @click="handleMobileSectionSelect(menu)"
          >
            <ArtSvgIcon class="mobile-menu-section__icon" :icon="menu.meta.icon" />
            <span class="mobile-menu-section__text">{{ $t(menu.meta.title) }}</span>
          </button>
        </div>

        <!-- 主菜单区仍复用 SidebarSubmenu，只把数据源切换成移动端专用列表 -->
        <ElScrollbar class="mobile-menu-scroll">
          <ElMenu
            ref="menuRef"
            :class="['art-mobile-menu-nav', 'el-menu-' + getMenuTheme.theme]"
            :collapse="false"
            :default-active="routerPath"
            :text-color="getMenuTheme.textColor"
            :unique-opened="menuUniqueOpened"
            :background-color="getMenuTheme.background"
            :default-openeds="defaultOpenedMenus"
            :popper-class="`menu-left-popper menu-left-${getMenuTheme.theme}-popper`"
            :show-timeout="50"
            :hide-timeout="50"
          >
            <SidebarSubmenu
              :list="mobileMenuList"
              :isMobile="true"
              :theme="getMenuTheme"
              @close="handleMenuClose"
            />
          </ElMenu>
        </ElScrollbar>

        <!-- 移动端底部商业升级入口 -->
        <div v-if="showSidebarUpsell" class="mobile-menu-footer">
          <ArtSidebarUpsell />
        </div>
      </div>
    </ElDrawer>
  </template>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import type { ScrollbarInstance } from 'element-plus'
  import AppConfig from '@/config'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum'
  import { useMenuStore } from '@/store/modules/menu'
  import { useUserStore } from '@/store/modules/user'
  import type { AppRouteRecord } from '@/types/router'
  import { isIframe } from '@/utils/navigation'
  import { handleMenuJump } from '@/utils/navigation'
  import SidebarSubmenu from './widget/SidebarSubmenu.vue'
  import HoverMenuPanel from './widget/HoverMenuPanel.vue'
  import ArtSidebarUpsell from '@/components/core/layouts/art-sidebar-upsell/index.vue'
  import { isCommercialEntryEnabled } from '@/hooks/core/useCommercial'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useWindowSize } from '@vueuse/core'
  import defaultAvatar from '@imgs/user/avatar.webp'

  defineOptions({ name: 'ArtSidebarMenu' })

  const MOBILE_BREAKPOINT = 800
  const MENU_CLOSE_WIDTH = MenuWidth.CLOSE

  const route = useRoute()
  const router = useRouter()
  const siteSettingsStore = useSiteSettingsStore()
  const settingStore = useSettingStore()
  const menuStore = useMenuStore()
  const userStore = useUserStore()

  const {
    menuOpenWidth,
    getMenuOpenWidth,
    menuType,
    uniqueOpened,
    dualMenuShowText,
    dualMenuAutoHide,
    menuOpen,
    getMenuTheme,
    isRtl
  } = storeToRefs(settingStore)
  const { info: userInfo } = storeToRefs(userStore)

  // 组件内部状态
  const menuRef = ref<any>()
  const dualMenuScrollbarRef = ref<ScrollbarInstance>()
  const hoverMenuScrollbarRef = ref<ScrollbarInstance>()
  const selectedFirstLevelMenuPath = ref('')
  const hoveredFirstLevelMenu = ref<AppRouteRecord>()
  const hoverPanelVisible = ref(false)
  let hoverPanelCloseTimer: ReturnType<typeof setTimeout> | null = null

  // 使用 VueUse 的窗口尺寸监听
  const { width } = useWindowSize()

  // 菜单宽度相关
  const menuopenwidth = computed(() => getMenuOpenWidth.value)
  const menuclosewidth = computed(() => MENU_CLOSE_WIDTH)

  // 菜单类型判断
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)
  const isSidebarLayout = computed(() => menuType.value === MenuTypeEnum.SIDEBAR)
  const isHoverMenu = computed(() => menuType.value === MenuTypeEnum.HOVER_MENU)
  const showLeftMenu = computed(
    () =>
      menuType.value === MenuTypeEnum.LEFT ||
      menuType.value === MenuTypeEnum.HOVER_MENU ||
      menuType.value === MenuTypeEnum.TOP_LEFT ||
      menuType.value === MenuTypeEnum.SIDEBAR
  )
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)

  // 双列菜单左侧轨道宽度（是否显示文本决定宽度）
  const dualRailWidth = computed(() => (dualMenuShowText.value ? '80px' : '64px'))
  // 双列菜单右侧子菜单浮层宽度（展开/折叠分别对应不同宽度）
  const dualOverlayWidth = computed(() =>
    menuOpen.value ? getMenuOpenWidth.value : MENU_CLOSE_WIDTH
  )
  // 双列菜单是否开启右侧子菜单自动隐藏（仅在双列布局下生效）
  const isDualAutoHide = computed(() => isDualMenu.value && dualMenuAutoHide.value)

  // 移动端屏幕判断（使用 computed 避免重复计算）
  const isMobileScreen = computed(() => width.value < MOBILE_BREAKPOINT)

  // 移动端抽屉与全局 menuOpen 共用同一份开关状态，避免桌面/移动状态分叉
  const mobileDrawerVisible = computed({
    get: () => isMobileScreen.value && menuOpen.value,
    set: (visible: boolean) => settingStore.setMenuOpen(visible)
  })

  // Drawer 方向和宽度都直接从运行态计算，保证 RTL 与设置中心宽度即时生效
  const mobileDrawerDirection = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
  const mobileDrawerSize = computed(() => {
    const viewportWidth = Math.max(width.value - 16, 240)
    return `${Math.min(menuOpenWidth.value, viewportWidth)}px`
  })
  const mobileDrawerStyle = computed<CSSProperties>(() => ({
    '--el-drawer-size': mobileDrawerSize.value,
    width: mobileDrawerSize.value,
    maxWidth: mobileDrawerSize.value
  }))

  // 路由相关
  const routerPath = computed(() => String(route.meta.activePath || route.path))
  const siteBrandName = computed(() => siteSettingsStore.siteBrandName || AppConfig.systemInfo.name)
  const userAvatar = computed(() => userInfo.value.avatar || defaultAvatar)
  const tooltipPlacement = computed(() => (isRtl.value ? 'left' : 'right'))
  const collapseIcon = computed(() => {
    if (isRtl.value) {
      return menuOpen.value ? 'ri:arrow-right-wide-fill' : 'ri:arrow-left-wide-fill'
    }

    return menuOpen.value ? 'ri:arrow-left-wide-fill' : 'ri:arrow-right-wide-fill'
  })
  const hoverMenuRailWidth = computed(() => (menuOpen.value ? menuOpenWidth.value : 64))

  // 菜单数据
  const firstLevelMenus = computed(() => {
    return menuStore.menuList.filter((menu) => !menu.meta.isHide)
  })
  const showMobileSectionTabs = computed(() => {
    return (isDualMenu.value || isTopLeftMenu.value) && firstLevelMenus.value.length > 0
  })

  const menuContainsPath = (menu: AppRouteRecord, targetPath: string): boolean => {
    if (menu.path === targetPath) return true
    return Array.isArray(menu.children)
      ? menu.children.some((child) => menuContainsPath(child, targetPath))
      : false
  }

  const routeMatchedFirstLevelMenuPath = computed(() => {
    const activePath = routerPath.value
    const matchedMenu = firstLevelMenus.value.find((menu) => menuContainsPath(menu, activePath))

    if (matchedMenu) return matchedMenu.path

    const currentTopPath = `/${route.path.split('/')[1] || ''}`
    return firstLevelMenus.value.find((menu) => menu.path === currentTopPath)?.path || ''
  })

  const activeFirstLevelMenuPath = computed(() => {
    if (isDualMenu.value) {
      return selectedFirstLevelMenuPath.value || routeMatchedFirstLevelMenuPath.value
    }

    return routeMatchedFirstLevelMenuPath.value
  })
  const activeHoverMenuPath = computed(() => {
    return hoverPanelMenu.value?.path || routeMatchedFirstLevelMenuPath.value
  })

  const menuList = computed(() => {
    const allMenus = menuStore.menuList

    // 如果不是顶部左侧菜单或双列菜单，直接返回完整菜单列表
    if (!isTopLeftMenu.value && !isDualMenu.value) {
      return allMenus
    }

    // 双列菜单左侧一级菜单只负责切换分组，右侧展示该分组下所有子菜单。
    if (isDualMenu.value) {
      const selectedPath = activeFirstLevelMenuPath.value
      if (selectedPath) {
        const selectedMenu = allMenus.find((menu) => menu.path === selectedPath)
        return selectedMenu?.children ?? []
      }
    }

    // 处理 iframe 路径
    if (isIframe(route.path)) {
      return findIframeMenuList(route.path, allMenus)
    }

    // 处理一级菜单
    if (route.meta.isFirstLevel) {
      return []
    }

    // 返回当前顶级路径对应的子菜单
    const currentTopPath = `/${route.path.split('/')[1]}`
    const currentMenu = allMenus.find((menu) => menu.path === currentTopPath)
    return currentMenu?.children ?? []
  })

  // 移动端菜单列表:
  // 1. 普通左侧菜单直接复用当前 menuList
  // 2. 顶部左侧 / 双列菜单优先展示当前一级菜单的 children
  // 3. 首次进入且当前无 children 时，回退到激活一级菜单对应的分组
  const mobileMenuList = computed(() => {
    if (!showMobileSectionTabs.value) {
      return menuList.value
    }

    if (menuList.value.length > 0) {
      return menuList.value
    }

    const fallbackPath = activeFirstLevelMenuPath.value || firstLevelMenus.value[0]?.path
    if (!fallbackPath) {
      return []
    }

    return menuStore.menuList.find((menu) => menu.path === fallbackPath)?.children ?? []
  })

  const isVisibleMenu = (menu: AppRouteRecord): boolean => {
    return !menu.meta.isHide
  }

  const getMenuIndex = (menu: AppRouteRecord): string => {
    return menu.path || menu.meta.title
  }

  const hasDefaultOpenChildren = (menu: AppRouteRecord): boolean => {
    return Array.isArray(menu.children) && menu.children.some((child) => isVisibleMenu(child))
  }

  const collectDefaultOpenedMenus = (menus: AppRouteRecord[]): string[] => {
    const openedMenus: string[] = []

    const walk = (items: AppRouteRecord[]) => {
      items.forEach((item) => {
        if (!isVisibleMenu(item)) {
          return
        }

        if (hasDefaultOpenChildren(item)) {
          openedMenus.push(getMenuIndex(item))
          walk(item.children ?? [])
        }
      })
    }

    walk(menus)
    return openedMenus
  }

  // 只在双列菜单右侧默认展开所有分组，其他菜单布局沿用 Element Plus 原始展开行为。
  const defaultOpenedMenus = computed(() => {
    if (!isDualMenu.value) {
      return []
    }

    const visibleMenuList = isMobileScreen.value ? mobileMenuList.value : menuList.value
    return collectDefaultOpenedMenus(visibleMenuList)
  })

  const menuUniqueOpened = computed(() => {
    if (!isDualMenu.value) {
      return uniqueOpened.value
    }

    // 双列菜单有多个分组默认展开时，手风琴模式会把展开状态压回单开。
    return uniqueOpened.value && defaultOpenedMenus.value.length <= 1
  })

  const openDefaultMenus = async () => {
    if (!isDualMenu.value) {
      return
    }

    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    defaultOpenedMenus.value.forEach((index) => {
      try {
        menuRef.value?.open?.(index)
      } catch {
        // ElMenu may not have registered a just-rendered submenu yet; default-openeds still covers first paint.
      }
    })
  }

  const syncActiveMenu = async () => {
    await nextTick()
    menuRef.value?.updateActiveIndex?.(routerPath.value)
  }

  /**
   * 双列菜单左侧一级菜单自动滚动到当前激活分组。
   * 例如用户把左侧一级菜单滚到底部后，再通过多标签页切回顶部菜单页面，
   * 这里会把对应的一级菜单项滚回可见区域，避免菜单状态和页面状态脱节。
   */
  const scrollDualActiveMenuIntoView = async (behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!isDualMenu.value || isMobileScreen.value) {
      return
    }

    await nextTick()

    const wrapRef = dualMenuScrollbarRef.value?.wrapRef
    const activePath = activeFirstLevelMenuPath.value

    if (!wrapRef || !activePath) {
      return
    }

    const activeItem = Array.from(
      wrapRef.querySelectorAll<HTMLElement>('[data-dual-menu-path]')
    ).find((item) => item.dataset.dualMenuPath === activePath)

    if (!activeItem) {
      return
    }

    const padding = 8
    const itemTop = activeItem.offsetTop
    const itemBottom = itemTop + activeItem.offsetHeight
    const visibleTop = wrapRef.scrollTop
    const visibleBottom = visibleTop + wrapRef.clientHeight

    if (itemTop < visibleTop + padding) {
      wrapRef.scrollTo({ top: Math.max(itemTop - padding, 0), behavior })
      return
    }

    if (itemBottom > visibleBottom - padding) {
      wrapRef.scrollTo({ top: itemBottom - wrapRef.clientHeight + padding, behavior })
    }
  }

  // 商业升级入口（仅登录后展示，避免登录页等干扰）
  // 客户交付前可在 src/config/index.ts 关闭 commercial.enabled
  const showSidebarUpsell = computed(() => isCommercialEntryEnabled() && userStore.isLogin)

  // 在 flex 布局下 ElScrollbar 自身高度由 .menu-left 的 flex 自动收敛，
  // 这里只保留双列菜单收起时的视觉位移逻辑
  const scrollbarStyle = computed(() => {
    if (isSidebarLayout.value) {
      return {}
    }

    const isCollapsed = isDualMenu.value && !menuOpen.value
    return {
      marginTop: isCollapsed ? '-50px' : '0',
      transition: 'margin-top 0.3s ease, height 0.3s ease'
    }
  })

  // 让 ElScrollbar 内部 view 充满 wrap，配合 .el-menu 的 flex: 1 把菜单顶到底，避免菜单较少时仍出现滚动条
  const scrollbarWrapStyle = computed<CSSProperties>(() => ({
    height: '100%'
  }))

  const scrollbarViewStyle = computed<CSSProperties>(() => ({
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  }))

  /**
   * 查找 iframe 对应的二级菜单列表
   */
  const findIframeMenuList = (
    currentPath: string,
    menuList: AppRouteRecord[]
  ): AppRouteRecord[] => {
    // 递归查找包含当前路径的菜单项
    const hasPath = (items: AppRouteRecord[]): boolean => {
      for (const item of items) {
        if (item.path === currentPath) {
          return true
        }
        if (item.children && hasPath(item.children)) {
          return true
        }
      }
      return false
    }

    // 遍历一级菜单查找匹配的子菜单
    for (const menu of menuList) {
      if (menu.children && hasPath(menu.children)) {
        return menu.children
      }
    }
    return []
  }

  const { homePath } = useCommon()

  /**
   * 导航到首页
   */
  const navigateToHome = (): void => {
    router.push(homePath.value)
  }

  /**
   * 切换菜单显示/隐藏
   */
  const toggleMenuVisibility = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  // 移动端统一通过这里关闭抽屉，后续如果要补埋点或动画钩子只改一处
  const closeMobileMenu = (): void => {
    if (!isMobileScreen.value) {
      return
    }

    mobileDrawerVisible.value = false
  }

  const handleMobileHomeClick = (): void => {
    closeMobileMenu()
    navigateToHome()
  }

  const hasVisibleChildren = (menu: AppRouteRecord): boolean => {
    return Array.isArray(menu.children) && menu.children.some((child) => !child.meta.isHide)
  }

  const fallbackHoverPanelMenu = computed(() => {
    return (
      firstLevelMenus.value.find((menu) => menu.path === routeMatchedFirstLevelMenuPath.value) ||
      firstLevelMenus.value[0]
    )
  })

  const hoverPanelMenu = computed(() => hoveredFirstLevelMenu.value || fallbackHoverPanelMenu.value)

  const persistentHoverPanelVisible = computed(() => hoverPanelVisible.value)

  const clearHoverPanelCloseTimer = (): void => {
    if (!hoverPanelCloseTimer) return

    clearTimeout(hoverPanelCloseTimer)
    hoverPanelCloseTimer = null
  }

  const openHoverPanel = (menu: AppRouteRecord): void => {
    clearHoverPanelCloseTimer()
    hoveredFirstLevelMenu.value = menu
    hoverPanelVisible.value = hasVisibleChildren(menu)
  }

  const closeHoverPanel = (): void => {
    clearHoverPanelCloseTimer()
    hoverPanelVisible.value = false
    hoveredFirstLevelMenu.value = undefined
  }

  const scheduleHoverPanelClose = (): void => {
    if (!isHoverMenu.value) return

    clearHoverPanelCloseTimer()
    hoverPanelCloseTimer = setTimeout(() => {
      closeHoverPanel()
    }, 120)
  }

  const cancelHoverPanelClose = (): void => {
    clearHoverPanelCloseTimer()
  }

  const handleHoverFirstLevelEnter = (menu: AppRouteRecord): void => {
    openHoverPanel(menu)
  }

  const handleHoverFirstLevelClick = (menu: AppRouteRecord): void => {
    if (hasVisibleChildren(menu)) {
      openHoverPanel(menu)
      return
    }

    closeHoverPanel()
    handleMenuJump(menu, true)
  }

  const selectFirstLevelMenu = (menu: AppRouteRecord): void => {
    selectedFirstLevelMenuPath.value = menu.path
    syncActiveMenu()
  }

  const handleDualFirstLevelSelect = (menu: AppRouteRecord): void => {
    if (!hasVisibleChildren(menu)) {
      handleMenuJump(menu)
      return
    }

    selectFirstLevelMenu(menu)
    if (!menuOpen.value) {
      settingStore.setMenuOpen(true)
    }
  }

  // 一级菜单切换：双列菜单只切换分组；顶部左侧菜单保持跳转到目标分组的原行为。
  const handleMobileSectionSelect = (menu: AppRouteRecord): void => {
    if (isDualMenu.value && hasVisibleChildren(menu)) {
      selectFirstLevelMenu(menu)
      return
    }

    closeMobileMenu()
    handleMenuJump(menu, true)
  }

  /**
   * 处理菜单关闭（来自子组件）
   */
  const handleMenuClose = (): void => {
    closeMobileMenu()
  }

  /**
   * 切换双列菜单模式
   */
  const toggleDualMenuMode = (): void => {
    settingStore.setDualMenuShowText(!dualMenuShowText.value)
  }

  /**
   * 切换双列菜单右侧子菜单自动隐藏
   * 开启后右侧子菜单收起为浮层，hover 左侧轨道时才浮出，不占用页面宽度
   */
  const toggleDualMenuAutoHide = (): void => {
    settingStore.setDualMenuAutoHide(!dualMenuAutoHide.value)
  }

  const goUserCenter = (): void => {
    router.push('/system/user-center')
  }

  /**
   * 监听窗口尺寸变化，自动处理移动端菜单
   */
  watch(isMobileScreen, (mobile, previousMobile) => {
    if (previousMobile !== undefined && mobile !== previousMobile) {
      settingStore.setMenuOpen(false)
    }
  })

  watch(routerPath, () => {
    if (isHoverMenu.value) {
      closeHoverPanel()
    }
  })

  watch([routerPath, menuList, mobileDrawerVisible], () => {
    syncActiveMenu()
    openDefaultMenus()
  })

  watch([activeFirstLevelMenuPath, firstLevelMenus, isDualMenu, isMobileScreen], () => {
    scrollDualActiveMenuIntoView()
    openDefaultMenus()
  })

  watch(
    routeMatchedFirstLevelMenuPath,
    (matchedPath) => {
      if (matchedPath) {
        selectedFirstLevelMenuPath.value = matchedPath
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    syncActiveMenu()
    openDefaultMenus()
    scrollDualActiveMenuIntoView('auto')
  })

  onUnmounted(() => {
    clearHoverPanelCloseTimer()
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>

<style lang="scss" src="./mobile-drawer.scss"></style>

<style lang="scss">
  @use './theme';

  .layout-sidebar {
    .menu-left-open {
      width: v-bind(menuopenwidth);
    }

    .menu-left-close {
      width: v-bind(menuclosewidth);
      overflow: visible;

      .header {
        gap: 0;
        justify-content: center;
        padding-right: 0;
        padding-left: 0;

        p {
          width: 0;
          min-width: 0;
          max-width: 0;
          margin: 0;
          font-size: 0;
          opacity: 0 !important;
        }
      }
    }

    // 展开的宽度
    .el-menu:not(.el-menu--collapse) {
      width: v-bind(menuopenwidth);
    }

    // 折叠后宽度
    .el-menu--collapse {
      width: v-bind(menuclosewidth);
    }

    .header .logo {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
