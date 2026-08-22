/**
 * 系统级别枚举定义模块
 *
 * ## 主要功能
 *
 * - 菜单类型枚举（左侧、顶部、混合、双栏、悬浮面板、侧边栏、内容全屏）
 * - 主题类型枚举（亮色、暗色、自动）
 * - 语言类型枚举（中文、英文）
 * - 容器宽度枚举（全屏、固定）
 * - 菜单宽度枚举（收起宽度）
 *
 * @module enums/appEnum
 * @author Ci-Yuu-Plus Team
 */

/**
 * 菜单类型
 */
export enum MenuTypeEnum {
  /** 左侧菜单 */
  LEFT = 'left',
  /** 顶部菜单 */
  TOP = 'top',
  /** 顶部+左侧菜单 */
  TOP_LEFT = 'top-left',
  /** 双栏菜单 */
  DUAL_MENU = 'dual-menu',
  /** 悬浮面板菜单 */
  HOVER_MENU = 'hover-menu',
  /** 侧边栏菜单（顶部通栏 + 侧边导航） */
  SIDEBAR = 'sidebar',
  /** 内容全屏模式（隐藏导航，只显示内容区） */
  CONTENT_FULL = 'content-full'
}

/**
 * 菜单背景模式
 */
export enum MenuColorModeEnum {
  /** 白色菜单 */
  LIGHT = 'light',
  /** 黑色菜单 */
  DARK = 'dark'
}

/**
 * 系统主题
 */
export enum SystemThemeEnum {
  /** 暗色主题 */
  DARK = 'dark',
  /** 亮色主题 */
  LIGHT = 'light',
  /** 自动主题（跟随系统） */
  AUTO = 'auto'
}

/**
 * 菜单宽度
 */
export enum MenuWidth {
  /** 收起宽度 */
  CLOSE = '64px'
}

/**
 * 语言类型
 */
export enum LanguageEnum {
  /** 中文 */
  ZH = 'zh',
  /** 英文 */
  EN = 'en'
}

/**
 * 布局方向
 */
export enum LayoutDirectionEnum {
  /** 从左到右 */
  LTR = 'ltr',
  /** 从右到左 */
  RTL = 'rtl'
}

/**
 * 容器宽度
 */
export enum ContainerWidthEnum {
  /** 全屏宽度 */
  FULL = '100%',
  /** 固定宽度 */
  BOXED = '1200px'
}
