/**
 * 系统设置状态管理模块
 *
 * 提供完整的系统设置状态管理
 *
 * ## 主要功能
 *
 * - 菜单布局配置（左侧、顶部、混合、双栏）
 * - 主题管理（亮色、暗色、自动）
 * - 菜单颜色跟随主题配置器
 * - 界面显示开关（面包屑、标签页、语言切换等）
 * - 功能开关（手风琴模式、色弱模式、水印等）
 * - 样式配置（边框、圆角、容器宽度、页面过渡）
 * - 节日功能配置
 * - Element Plus 主题色动态设置
 *
 * ## 使用场景
 *
 * - 设置面板配置管理
 * - 主题切换和样式定制
 * - 界面功能开关控制
 * - 用户偏好设置持久化
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-setting
 * - 支持跨版本数据迁移
 *
 * @module store/modules/setting
 * @author Ci-Yuu-Plus Team
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuThemeType } from '@/types/store'
import {
  SystemThemeEnum,
  MenuTypeEnum,
  MenuColorModeEnum,
  ContainerWidthEnum,
  LayoutDirectionEnum
} from '@/enums/appEnum'
import { setElementThemeColor } from '@/utils/ui/colors'
import { StorageConfig } from '@/utils'
import { SETTING_DEFAULT_CONFIG } from '@/config/setting'
import type { ThemeCustomizerState } from '@/config/modules/theme-studio/types'

type ActualSystemTheme = Exclude<SystemThemeEnum, SystemThemeEnum.AUTO>

let echartsThemeRefreshLoader: Promise<() => void> | null = null
let themeCustomizerUtilsLoader: Promise<typeof import('@/utils/ui/theme-studio')> | null = null
let themeCustomizerRequestId = 0

const loadEChartsThemeRefresher = async () => {
  if (!echartsThemeRefreshLoader) {
    echartsThemeRefreshLoader = import('@/plugins/echarts').then(
      (module) => module.refreshEChartsTheme
    )
  }

  return echartsThemeRefreshLoader
}

const loadThemeCustomizerUtils = async () => {
  if (!themeCustomizerUtilsLoader) {
    themeCustomizerUtilsLoader = import('@/utils/ui/theme-studio')
  }

  return themeCustomizerUtilsLoader
}

const scheduleEChartsThemeRefresh = () => {
  if (typeof window === 'undefined') {
    return
  }

  requestAnimationFrame(() => {
    void loadEChartsThemeRefresher().then((refresh) => {
      refresh()
    })
  })
}

/**
 * 系统设置状态管理
 * 管理应用的菜单、主题、界面显示等各项设置
 */
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    // 菜单相关设置
    /** 菜单类型 */
    const menuType = ref(SETTING_DEFAULT_CONFIG.menuType)
    /** 进入内容全屏前的菜单类型 */
    const beforeContentFullMenuType = ref<MenuTypeEnum>(SETTING_DEFAULT_CONFIG.menuType)
    /** 菜单展开宽度 */
    const menuOpenWidth = ref(SETTING_DEFAULT_CONFIG.menuOpenWidth)
    /** 菜单是否展开 */
    const menuOpen = ref(SETTING_DEFAULT_CONFIG.menuOpen)
    /** 双菜单是否显示文本 */
    const dualMenuShowText = ref(SETTING_DEFAULT_CONFIG.dualMenuShowText)
    /** 双列菜单是否自动隐藏右侧子菜单（hover 左侧时浮层展开，不占用页面宽度） */
    const dualMenuAutoHide = ref(SETTING_DEFAULT_CONFIG.dualMenuAutoHide)
    /** 菜单背景模式 */
    const menuColorMode = ref<MenuColorModeEnum>(SETTING_DEFAULT_CONFIG.menuColorMode)
    /** 是否手动覆盖菜单背景模式 */
    const menuColorModeOverridden = ref(SETTING_DEFAULT_CONFIG.menuColorModeOverridden)
    /** 不同主题下的菜单背景模式偏好 */
    const menuColorModeByTheme = ref<Record<ActualSystemTheme, MenuColorModeEnum>>({
      ...SETTING_DEFAULT_CONFIG.menuColorModeByTheme
    })

    // 主题相关设置
    /** 系统主题类型 */
    const systemThemeType = ref(SETTING_DEFAULT_CONFIG.systemThemeType)
    /** 系统主题模式 */
    const systemThemeMode = ref(SETTING_DEFAULT_CONFIG.systemThemeMode)
    /** 菜单主题跟随主题配置器语义变量 */
    const getMenuTheme = computed(
      (): MenuThemeType => ({
        theme: 'design',
        background: 'var(--theme-menu-bg)',
        systemNameColor: 'var(--theme-menu-heading)',
        iconColor: 'var(--theme-menu-icon)',
        textColor: 'var(--theme-menu-text)'
      })
    )
    /** 系统主题颜色 */
    const systemThemeColor = ref(SETTING_DEFAULT_CONFIG.systemThemeColor)

    // 界面显示设置
    /** 是否显示菜单按钮 */
    const showMenuButton = ref(SETTING_DEFAULT_CONFIG.showMenuButton)
    /** 是否显示快速入口 */
    const showFastEnter = ref(SETTING_DEFAULT_CONFIG.showFastEnter)
    /** 是否显示刷新按钮 */
    const showRefreshButton = ref(SETTING_DEFAULT_CONFIG.showRefreshButton)
    /** 是否显示面包屑 */
    const showCrumbs = ref(SETTING_DEFAULT_CONFIG.showCrumbs)
    /** 是否显示工作台标签 */
    const showWorkTab = ref(SETTING_DEFAULT_CONFIG.showWorkTab)
    /** 是否显示语言切换 */
    const showLanguage = ref(SETTING_DEFAULT_CONFIG.showLanguage)
    /** 布局方向 */
    const layoutDirection = ref(SETTING_DEFAULT_CONFIG.layoutDirection)
    /** 是否显示进度条 */
    const showNprogress = ref(SETTING_DEFAULT_CONFIG.showNprogress)
    /** 是否显示节日文本 */
    const showFestivalText = ref(SETTING_DEFAULT_CONFIG.showFestivalText)
    /** 是否显示水印 */
    const watermarkVisible = ref(SETTING_DEFAULT_CONFIG.watermarkVisible)
    /** 是否显示版权合规信息 */
    const showComplianceFooter = ref(SETTING_DEFAULT_CONFIG.showComplianceFooter)
    /** 侧边栏商业授权卡片是否已最小化 */
    const sidebarUpsellMinimized = ref(SETTING_DEFAULT_CONFIG.sidebarUpsellMinimized)
    /** 项目介绍弹窗是否已关闭 */
    const projectIntroDismissed = ref(false)

    // 功能设置
    /** 是否自动关闭 */
    const autoClose = ref(SETTING_DEFAULT_CONFIG.autoClose)
    /** 是否唯一展开 */
    const uniqueOpened = ref(SETTING_DEFAULT_CONFIG.uniqueOpened)
    /** 是否色弱模式 */
    const colorWeak = ref(SETTING_DEFAULT_CONFIG.colorWeak)
    /** 是否刷新 */
    const refresh = ref(SETTING_DEFAULT_CONFIG.refresh)
    /** 是否加载节日烟花 */
    const holidayFireworksLoaded = ref(SETTING_DEFAULT_CONFIG.holidayFireworksLoaded)

    // 样式设置
    /** 边框模式 */
    const boxBorderMode = ref(SETTING_DEFAULT_CONFIG.boxBorderMode)
    /** 页面过渡效果 */
    const pageTransition = ref(SETTING_DEFAULT_CONFIG.pageTransition)
    /** 标签页样式 */
    const tabStyle = ref(SETTING_DEFAULT_CONFIG.tabStyle)
    /** 自定义圆角 */
    const customRadius = ref(SETTING_DEFAULT_CONFIG.customRadius)
    /** 主题配置器是否收起预览 */
    const themeCustomizerPreviewCollapsed = ref(
      SETTING_DEFAULT_CONFIG.themeCustomizerPreviewCollapsed
    )
    /** 主题定制器 */
    const themeCustomizer = ref<ThemeCustomizerState>({
      ...SETTING_DEFAULT_CONFIG.themeCustomizer,
      chartThemeColors: [...SETTING_DEFAULT_CONFIG.themeCustomizer.chartThemeColors]
    })
    /** 容器宽度 */
    const containerWidth = ref(SETTING_DEFAULT_CONFIG.containerWidth)

    // 节日相关
    /** 节日日期 */
    const festivalDate = ref('')

    /**
     * 判断是否为暗色模式
     */
    const isDark = computed((): boolean => {
      return systemThemeType.value === SystemThemeEnum.DARK
    })

    /**
     * 当前是否为 RTL 模式
     */
    const isRtl = computed((): boolean => {
      return layoutDirection.value === LayoutDirectionEnum.RTL
    })

    /**
     * 获取菜单展开宽度
     */
    const getMenuOpenWidth = computed((): string => {
      return menuOpenWidth.value + 'px' || SETTING_DEFAULT_CONFIG.menuOpenWidth + 'px'
    })

    /**
     * 获取自定义圆角
     */
    const getCustomRadius = computed((): string => {
      return customRadius.value + 'rem' || SETTING_DEFAULT_CONFIG.customRadius + 'rem'
    })

    /**
     * 是否显示烟花
     * 根据当前日期和节日日期判断是否显示烟花效果
     */
    const isShowFireworks = (date: string): boolean => {
      return Boolean(date) && festivalDate.value !== date
    }

    /**
     * 切换菜单布局
     * @param type 菜单类型
     */
    const switchMenuLayouts = (type: MenuTypeEnum) => {
      if (type === MenuTypeEnum.CONTENT_FULL && menuType.value !== MenuTypeEnum.CONTENT_FULL) {
        beforeContentFullMenuType.value = menuType.value
      }

      menuType.value = type
    }

    /**
     * 退出内容全屏布局
     */
    const exitContentFullLayout = () => {
      const targetMenuType =
        beforeContentFullMenuType.value === MenuTypeEnum.CONTENT_FULL
          ? SETTING_DEFAULT_CONFIG.menuType
          : beforeContentFullMenuType.value

      switchMenuLayouts(targetMenuType)
    }

    /**
     * 设置菜单展开宽度
     * @param width 宽度值
     */
    const setMenuOpenWidth = (width: number) => {
      menuOpenWidth.value = width
    }

    /**
     * 设置全局主题
     * @param theme 主题类型
     * @param themeMode 主题模式
     */
    const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
      systemThemeType.value = theme
      systemThemeMode.value = themeMode
      localStorage.setItem(StorageConfig.THEME_KEY, theme)
    }

    /**
     * 切换菜单样式
     * @param theme 菜单主题
     */
    /**
     * 设置Element Plus主题颜色
     * @param theme 主题颜色
     */
    const setElementTheme = (theme: string) => {
      systemThemeColor.value = theme
      setElementThemeColor(theme)
      scheduleEChartsThemeRefresh()
    }

    /**
     * 设置主题定制器状态
     * @param nextThemeCustomizer 新的主题定制器配置
     */
    const setThemeCustomizer = async (nextThemeCustomizer: ThemeCustomizerState) => {
      const requestId = ++themeCustomizerRequestId
      const { normalizeThemeCustomizerState, applyThemeCustomizerState } =
        await loadThemeCustomizerUtils()
      const normalizedThemeCustomizer = normalizeThemeCustomizerState(nextThemeCustomizer)

      if (requestId !== themeCustomizerRequestId) {
        return
      }

      themeCustomizer.value = {
        ...normalizedThemeCustomizer,
        chartThemeColors: [...normalizedThemeCustomizer.chartThemeColors]
      }
      applyThemeCustomizerState(themeCustomizer.value)
      scheduleEChartsThemeRefresh()
    }

    /**
     * 设置主题配置器预览折叠状态
     * @param collapsed 是否收起预览
     */
    const setThemeCustomizerPreviewCollapsed = (collapsed: boolean) => {
      themeCustomizerPreviewCollapsed.value = collapsed
    }

    /**
     * 设置盒子质感模式
     * @param enabled true 为边框模式，false 为阴影模式
     */
    const setBoxBorderMode = (enabled: boolean) => {
      boxBorderMode.value = enabled
      document.documentElement.setAttribute(
        'data-box-mode',
        enabled ? 'border-mode' : 'shadow-mode'
      )
    }

    /**
     * 切换边框模式
     */
    const setBorderMode = () => {
      setBoxBorderMode(!boxBorderMode.value)
    }

    /**
     * 设置容器宽度
     * @param width 容器宽度枚举值
     */
    const setContainerWidth = (width: ContainerWidthEnum) => {
      containerWidth.value = width
    }

    /**
     * 切换唯一展开模式
     */
    const setUniqueOpened = () => {
      uniqueOpened.value = !uniqueOpened.value
    }

    /**
     * 切换菜单按钮显示
     */
    const setButton = () => {
      showMenuButton.value = !showMenuButton.value
    }

    /**
     * 切换快速入口显示
     */
    const setFastEnter = () => {
      showFastEnter.value = !showFastEnter.value
    }

    /**
     * 切换自动关闭
     */
    const setAutoClose = () => {
      autoClose.value = !autoClose.value
    }

    /**
     * 切换刷新按钮显示
     */
    const setShowRefreshButton = () => {
      showRefreshButton.value = !showRefreshButton.value
    }

    /**
     * 切换面包屑显示
     */
    const setCrumbs = () => {
      showCrumbs.value = !showCrumbs.value
    }

    /**
     * 设置工作台标签显示
     * @param show 是否显示
     */
    const setWorkTab = (show: boolean) => {
      showWorkTab.value = show
    }

    /**
     * 切换语言切换显示
     */
    const setLanguage = () => {
      showLanguage.value = !showLanguage.value
    }

    /**
     * 设置布局方向
     * @param direction 布局方向
     */
    const setLayoutDirection = (direction: LayoutDirectionEnum) => {
      layoutDirection.value = direction
    }

    /**
     * 切换进度条显示
     */
    const setNprogress = () => {
      showNprogress.value = !showNprogress.value
    }

    /**
     * 切换色弱模式
     */
    const setColorWeak = () => {
      colorWeak.value = !colorWeak.value
    }

    /**
     * 设置页面过渡效果
     * @param transition 过渡效果名称
     */
    const setPageTransition = (transition: string) => {
      pageTransition.value = transition
    }

    /**
     * 设置标签页样式
     * @param style 样式名称
     */
    const setTabStyle = (style: string) => {
      tabStyle.value = style
    }

    /**
     * 设置菜单展开状态
     * @param open 是否展开
     */
    const setMenuOpen = (open: boolean) => {
      menuOpen.value = open
    }

    /**
     * 刷新页面
     */
    const reload = () => {
      refresh.value = !refresh.value
    }

    /**
     * 设置水印显示
     * @param visible 是否显示
     */
    const setWatermarkVisible = (visible: boolean) => {
      watermarkVisible.value = visible
    }

    /**
     * 设置版权合规信息显示
     * @param visible 是否显示
     */
    const setComplianceFooterVisible = (visible: boolean) => {
      showComplianceFooter.value = visible
    }

    /**
     * 设置侧边栏商业授权卡片最小化状态
     * @param minimized 是否最小化
     */
    const setSidebarUpsellMinimized = (minimized: boolean) => {
      sidebarUpsellMinimized.value = minimized
    }

    /**
     * 关闭侧边栏商业授权卡片
     */
    const closeSidebarUpsell = () => {
      setSidebarUpsellMinimized(true)
    }

    /**
     * 展开侧边栏商业授权卡片
     */
    const openSidebarUpsell = () => {
      setSidebarUpsellMinimized(false)
    }

    /**
     * 设置项目介绍弹窗关闭状态
     * @param dismissed 是否已关闭
     */
    const setProjectIntroDismissed = (dismissed: boolean) => {
      projectIntroDismissed.value = dismissed
    }

    /**
     * 设置自定义圆角
     * @param radius 圆角值
     */
    const setCustomRadius = (radius: string) => {
      customRadius.value = radius
      document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
    }

    /**
     * 设置节日烟花加载状态
     * @param isLoad 是否已加载
     */
    const setholidayFireworksLoaded = (isLoad: boolean) => {
      holidayFireworksLoaded.value = isLoad
    }

    /**
     * 设置节日文本显示
     * @param show 是否显示
     */
    const setShowFestivalText = (show: boolean) => {
      showFestivalText.value = show
    }

    const setFestivalDate = (date: string) => {
      festivalDate.value = date
    }

    const setDualMenuShowText = (show: boolean) => {
      dualMenuShowText.value = show
    }

    const setDualMenuAutoHide = (autoHide: boolean) => {
      dualMenuAutoHide.value = autoHide
    }

    const getActualThemeKey = (
      theme: SystemThemeEnum = systemThemeType.value
    ): ActualSystemTheme =>
      theme === SystemThemeEnum.DARK ? SystemThemeEnum.DARK : SystemThemeEnum.LIGHT

    const applyMenuColorModeToRoot = (mode: MenuColorModeEnum, overridden = true) => {
      menuColorMode.value = mode
      menuColorModeOverridden.value = overridden

      if (overridden) {
        document.documentElement.setAttribute('data-menu-color-mode', mode)
      } else {
        document.documentElement.removeAttribute('data-menu-color-mode')
      }
    }

    const setMenuColorMode = (mode: MenuColorModeEnum) => {
      const actualTheme = getActualThemeKey()
      const nextMode = actualTheme === SystemThemeEnum.DARK ? MenuColorModeEnum.DARK : mode

      menuColorModeByTheme.value = {
        ...menuColorModeByTheme.value,
        [actualTheme]: nextMode
      }
      applyMenuColorModeToRoot(nextMode)
    }

    const applyMenuColorModeForTheme = (theme: SystemThemeEnum) => {
      const actualTheme = getActualThemeKey(theme)
      const mode =
        actualTheme === SystemThemeEnum.DARK
          ? MenuColorModeEnum.DARK
          : (menuColorModeByTheme.value[actualTheme] ??
            SETTING_DEFAULT_CONFIG.menuColorModeByTheme[actualTheme])

      applyMenuColorModeToRoot(mode, menuColorModeOverridden.value)
    }

    const setMenuColorModeByTheme = (preferences: Record<ActualSystemTheme, MenuColorModeEnum>) => {
      menuColorModeByTheme.value = {
        ...SETTING_DEFAULT_CONFIG.menuColorModeByTheme,
        ...preferences,
        [SystemThemeEnum.DARK]: MenuColorModeEnum.DARK
      }
    }

    const setMenuColorModeOverridden = (overridden: boolean) => {
      menuColorModeOverridden.value = overridden
      applyMenuColorModeToRoot(menuColorMode.value, overridden)
    }

    return {
      menuType,
      menuOpenWidth,
      menuColorMode,
      menuColorModeOverridden,
      menuColorModeByTheme,
      systemThemeType,
      systemThemeMode,
      systemThemeColor,
      boxBorderMode,
      uniqueOpened,
      showMenuButton,
      showFastEnter,
      showRefreshButton,
      showCrumbs,
      autoClose,
      showWorkTab,
      showLanguage,
      layoutDirection,
      showNprogress,
      colorWeak,
      pageTransition,
      tabStyle,
      menuOpen,
      refresh,
      watermarkVisible,
      showComplianceFooter,
      sidebarUpsellMinimized,
      customRadius,
      themeCustomizerPreviewCollapsed,
      themeCustomizer,
      holidayFireworksLoaded,
      showFestivalText,
      festivalDate,
      dualMenuShowText,
      dualMenuAutoHide,
      containerWidth,
      projectIntroDismissed,
      getMenuTheme,
      isDark,
      getMenuOpenWidth,
      getCustomRadius,
      isRtl,
      isShowFireworks,
      switchMenuLayouts,
      exitContentFullLayout,
      setMenuOpenWidth,
      setGlopTheme,
      setElementTheme,
      setBoxBorderMode,
      setBorderMode,
      setContainerWidth,
      setUniqueOpened,
      setButton,
      setFastEnter,
      setAutoClose,
      setShowRefreshButton,
      setCrumbs,
      setWorkTab,
      setLanguage,
      setLayoutDirection,
      setNprogress,
      setColorWeak,
      setPageTransition,
      setTabStyle,
      setMenuOpen,
      reload,
      setWatermarkVisible,
      setComplianceFooterVisible,
      setSidebarUpsellMinimized,
      closeSidebarUpsell,
      openSidebarUpsell,
      setProjectIntroDismissed,
      setCustomRadius,
      setThemeCustomizerPreviewCollapsed,
      setThemeCustomizer,
      setholidayFireworksLoaded,
      setShowFestivalText,
      setFestivalDate,
      setDualMenuShowText,
      setDualMenuAutoHide,
      setMenuColorMode,
      setMenuColorModeOverridden,
      applyMenuColorModeForTheme,
      setMenuColorModeByTheme
    }
  },
  {
    persist: {
      key: 'setting',
      storage: localStorage
    }
  }
)
