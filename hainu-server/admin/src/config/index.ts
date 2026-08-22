/**
 * 系统全局配置
 *
 * 这是系统的核心配置文件，集中管理所有全局配置项。
 * 包含系统信息、主题样式、菜单布局、颜色方案等所有可配置项。
 *
 * ## 主要功能
 *
 * - 系统信息 - 系统名称等基础信息
 * - 主题配置 - 亮色/暗色/自动主题的样式配置
 * - 菜单配置 - 菜单布局、宽度等配置
 * - 颜色方案 - 系统主色和预设颜色列表
 * - 快速入口 - 快速入口应用和链接配置
 * - 顶部栏配置 - 顶部栏功能模块配置
 *
 * ## 配置项说明
 *
 * - systemInfo: 系统基础信息（名称等）
 * - systemThemeStyles: 系统主题样式映射
 * - settingThemeList: 可选的系统主题列表
 * - menuLayoutList: 可选的菜单布局列表
 * - systemMainColor: 预设的系统主色列表
 * - fastEnter: 快速入口配置
 * - headerBar: 顶部栏功能配置
 *
 * @module config
 * @author Ci-Yuu-Plus Team
 */

import { MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { SystemConfig } from '@/types/config'
import { configImages } from './assets/images'
import fastEnterConfig from './modules/fastEnter'
import { headerBarConfig } from './modules/headerBar'

const appConfig: SystemConfig = {
  // 商业化品牌入口（购买授权、官方文档外链、项目介绍弹窗等）可一键关闭所有供应商相关引流入口
  commercial: {
    enabled: true
  },
  // 系统信息
  systemInfo: {
    name: 'Ci-Yuu-Plus' // 系统名称
  },
  // 系统主题
  systemThemeStyles: {
    [SystemThemeEnum.LIGHT]: { className: '' },
    [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
  },
  // 系统主题列表
  settingThemeList: [
    {
      name: 'Light',
      theme: SystemThemeEnum.LIGHT,
      color: ['#fff', '#fff'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.themeStyles.light
    },
    {
      name: 'Dark',
      theme: SystemThemeEnum.DARK,
      color: ['#22252A'],
      leftLineColor: '#3F4257',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.dark
    },
    {
      name: 'System',
      theme: SystemThemeEnum.AUTO,
      color: ['#fff', '#22252A'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.system
    }
  ],
  // 菜单布局列表
  menuLayoutList: [
    {
      name: 'Dual Column',
      value: MenuTypeEnum.DUAL_MENU,
      img: configImages.menuLayouts.dualColumn
    },
    { name: 'Left', value: MenuTypeEnum.LEFT, img: configImages.menuLayouts.vertical },
    { name: 'Top', value: MenuTypeEnum.TOP, img: configImages.menuLayouts.horizontal },
    { name: 'Mixed', value: MenuTypeEnum.TOP_LEFT, img: configImages.menuLayouts.mixed },
    {
      name: 'Hover Panel',
      value: MenuTypeEnum.HOVER_MENU,
      img: configImages.menuLayouts.hoverMenu
    },
    { name: 'Sidebar', value: MenuTypeEnum.SIDEBAR, img: configImages.menuLayouts.sidebar }
    // {
    //   name: 'Content Full',
    //   value: MenuTypeEnum.CONTENT_FULL,
    //   img: configImages.menuLayouts.contentFull
    // }
  ],
  // 系统主色
  systemMainColor: [
    '#377DFF',
    '#B48DF3',
    '#5D87FF',
    '#60C041',
    '#38C0FC',
    '#F9901F',
    '#FF80C8'
  ] as const,
  // 快速入口配置
  fastEnter: fastEnterConfig,
  // 顶部栏功能配置
  headerBar: headerBarConfig
}

export default Object.freeze(appConfig)
