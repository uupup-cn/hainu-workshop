/**
 * 系统设置默认值配置
 *
 * 统一管理系统设置的所有默认值
 *
 * ## 主要功能
 *
 * - 菜单相关默认配置
 * - 主题相关默认配置
 * - 界面显示默认配置
 * - 功能开关默认配置
 * - 样式相关默认配置
 *
 * ## 注意事项
 *
 * 1. 修改此文件的配置项时，需要同步更新以下文件：
 *    - src/components/core/layouts/art-settings-panel/widget/SettingActions.vue（复制配置和重置配置逻辑）
 *    - src/store/modules/setting.ts（Store 状态定义）
 * 2. 可以通过设置面板的"复制配置"按钮快速生成配置代码
 * 3. 枚举类型的值需要与 src/enums/appEnum.ts 中的定义保持一致
 */

import AppConfig from '@/config'
import {
  SystemThemeEnum,
  MenuTypeEnum,
  MenuColorModeEnum,
  ContainerWidthEnum,
  LayoutDirectionEnum
} from '@/enums/appEnum'
import { BOOTSTRAP_THEME_CUSTOMIZER_STATE } from '@/config/modules/theme-studio/bootstrap-defaults'

/**
 * 系统设置默认值配置
 */
export const SETTING_DEFAULT_CONFIG = {
  /** 菜单类型 */
  menuType: MenuTypeEnum.DUAL_MENU,
  /** 菜单展开宽度 */
  menuOpenWidth: 220,
  /** 菜单是否展开 */
  menuOpen: true,
  /** 双菜单是否显示文本 */
  dualMenuShowText: false,
  /** 双列菜单是否自动隐藏右侧子菜单（hover 左侧时浮层展开，不占用页面宽度） */
  dualMenuAutoHide: false,
  /** 菜单背景模式 */
  menuColorMode: MenuColorModeEnum.LIGHT,
  /** 是否手动覆盖菜单背景模式 */
  menuColorModeOverridden: false,
  /** 不同主题下的菜单背景模式偏好 */
  menuColorModeByTheme: {
    [SystemThemeEnum.LIGHT]: MenuColorModeEnum.LIGHT,
    [SystemThemeEnum.DARK]: MenuColorModeEnum.DARK
  },
  /** 系统主题类型 */
  systemThemeType: SystemThemeEnum.AUTO,
  /** 系统主题模式 */
  systemThemeMode: SystemThemeEnum.AUTO,
  /** 系统主题颜色 */
  systemThemeColor: AppConfig.systemMainColor[0],
  /** 是否显示菜单按钮 */
  showMenuButton: true,
  /** 是否显示快速入口 */
  showFastEnter: true,
  /** 是否显示刷新按钮 */
  showRefreshButton: true,
  /** 是否显示面包屑 */
  showCrumbs: true,
  /** 是否显示工作台标签 */
  showWorkTab: true,
  /** 是否显示语言切换 */
  showLanguage: true,
  /** 布局方向 */
  layoutDirection: LayoutDirectionEnum.LTR,
  /** 是否显示进度条 */
  showNprogress: false,
  /** 是否显示节日文本 */
  showFestivalText: false,
  /** 是否显示水印 */
  watermarkVisible: false,
  /** 是否显示版权合规信息 */
  showComplianceFooter: false,
  /** 侧边栏商业授权卡片是否已最小化 */
  sidebarUpsellMinimized: false,
  /** 是否自动关闭 */
  autoClose: false,
  /** 是否唯一展开 */
  uniqueOpened: true,
  /** 是否色弱模式 */
  colorWeak: false,
  /** 是否刷新 */
  refresh: false,
  /** 是否加载节日烟花 */
  holidayFireworksLoaded: false,
  /** 边框模式 */
  boxBorderMode: true,
  /** 页面过渡效果 */
  pageTransition: 'slide-left',
  /** 标签页样式 */
  tabStyle: 'tab-default',
  /** 自定义圆角 */
  customRadius: '0.5',
  /** 主题配置器是否收起预览 */
  themeCustomizerPreviewCollapsed: false,
  /** 主题定制器 */
  themeCustomizer: BOOTSTRAP_THEME_CUSTOMIZER_STATE,
  /** 容器宽度 */
  containerWidth: ContainerWidthEnum.FULL,
  /** 节日日期 */
  festivalDate: ''
}

/**
 * 获取设置默认值
 * @returns 设置默认值对象
 */
export function getSettingDefaults() {
  return { ...SETTING_DEFAULT_CONFIG }
}

/**
 * 重置为默认设置
 * @param currentSettings 当前设置对象
 */
export function resetToDefaults(currentSettings: Record<string, any>) {
  const defaults = getSettingDefaults()
  Object.keys(defaults).forEach((key) => {
    if (key in currentSettings) {
      currentSettings[key] = defaults[key as keyof typeof defaults]
    }
  })
}
