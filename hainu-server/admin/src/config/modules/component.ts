/**
 * 全局组件配置
 *
 * 统一管理系统级全局组件的注册。
 * 这些组件会在应用启动时全局注册，可在任何地方使用。
 *
 * ## 主要功能
 *
 * - 组件配置 - 集中管理全局组件的配置信息
 * - 异步加载 - 使用 defineAsyncComponent 实现按需加载
 * - 开关控制 - 支持通过 enabled 字段启用/禁用组件
 * - 配置查询 - 提供工具函数快速查询组件配置
 *
 * @module config/component
 * @author Ci-Yuu-Plus Team
 */

import { defineAsyncComponent } from 'vue'

const createGlobalComponentConfig = (
  name: string,
  key: string,
  loader: () => Promise<any>,
  enabled = true
): GlobalComponentConfig => ({
  name,
  key,
  loader,
  component: defineAsyncComponent(loader),
  enabled
})

/**
 * 全局组件配置列表
 */
export const globalComponentsConfig: GlobalComponentConfig[] = [
  createGlobalComponentConfig(
    '项目介绍',
    'project-intro-dialog',
    () => import('@/components/core/layouts/art-project-intro-dialog/index.vue')
  ),
  createGlobalComponentConfig(
    '反馈入口',
    'feedback-widget',
    () => import('@/components/core/layouts/art-feedback-widget/index.vue')
  ),
  createGlobalComponentConfig(
    '设置面板',
    'settings-panel',
    () => import('@/components/core/layouts/art-settings-panel/index.vue')
  ),
  createGlobalComponentConfig(
    '主题配置',
    'theme-customizer-panel',
    () => import('@/components/core/layouts/art-theme-customizer-panel/index.vue')
  ),
  createGlobalComponentConfig(
    '全局搜索',
    'global-search',
    () => import('@/components/core/layouts/art-global-search/index.vue')
  ),
  createGlobalComponentConfig(
    '锁屏',
    'screen-lock',
    () => import('@/components/core/layouts/art-screen-lock/index.vue')
  ),
  createGlobalComponentConfig(
    '礼花效果',
    'fireworks-effect',
    () => import('@/components/core/layouts/art-fireworks-effect/index.vue')
  ),
  createGlobalComponentConfig(
    '水印效果',
    'watermark',
    () => import('@/components/core/others/art-watermark/index.vue')
  )
]

/**
 * 全局组件配置接口
 */
export interface GlobalComponentConfig {
  /** 组件名称 */
  name: string
  /** 组件标识 */
  key: string
  /** 组件 */
  component: any
  /** 异步加载器 */
  loader?: () => Promise<any>
  /** 是否启用 */
  enabled?: boolean
  /** 组件描述 */
  description?: string
}

/**
 * 获取启用的全局组件
 * @returns 已启用的组件配置列表
 */
export const getEnabledGlobalComponents = () => {
  return globalComponentsConfig.filter((config) => config.enabled !== false)
}

/**
 * 根据 key 获取组件配置
 * @param key 组件标识
 * @returns 组件配置对象
 */
export const getGlobalComponentByKey = (key: string) => {
  return globalComponentsConfig.find((config) => config.key === key)
}
