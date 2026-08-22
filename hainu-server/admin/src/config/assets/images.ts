/**
 * 配置图片资源
 *
 * 统一管理设置中心使用的预览图片资源。
 * 包含主题样式、菜单布局的预览图。
 *
 * ## 图片分类
 *
 * - themeStyles: 系统主题预览图（亮色/暗色/自动）
 * - menuLayouts: 菜单布局预览图（左侧/顶部/混合/双栏/侧边栏/内容全屏）
 *
 * @module config/assets/images
 * @author Ci-Yuu-Plus Team
 */

import lightTheme from '@imgs/settings/theme_styles/light.png'
import darkTheme from '@imgs/settings/theme_styles/dark.png'
import systemTheme from '@imgs/settings/theme_styles/system.png'
import verticalLayout from '@imgs/settings/menu_layouts/vertical.png'
import horizontalLayout from '@imgs/settings/menu_layouts/horizontal.png'
import mixedLayout from '@imgs/settings/menu_layouts/mixed.png'
import dualColumnLayout from '@imgs/settings/menu_layouts/dual_column.png'
import hoverMenuLayout from '@imgs/settings/menu_layouts/hover_menu.png'
import sidebarLayout from '@imgs/settings/menu_layouts/sidebar.png'
import contentFullLayout from '@imgs/settings/menu_layouts/content_full.png'

/**
 * 配置中心图片资源对象
 */
export const configImages = {
  /** 系统主题预览图 */
  themeStyles: {
    /** 亮色主题 */
    light: lightTheme,
    /** 暗色主题 */
    dark: darkTheme,
    /** 自动主题（跟随系统） */
    system: systemTheme
  },
  /** 菜单布局预览图 */
  menuLayouts: {
    /** 左侧菜单 */
    vertical: verticalLayout,
    /** 顶部菜单 */
    horizontal: horizontalLayout,
    /** 混合菜单 */
    mixed: mixedLayout,
    /** 双栏菜单 */
    dualColumn: dualColumnLayout,
    /** 悬浮菜单 */
    hoverMenu: hoverMenuLayout,
    /** 侧边栏菜单 */
    sidebar: sidebarLayout,
    /** 内容全屏 */
    contentFull: contentFullLayout
  }
}
