/**
 * useLayoutHeight - 页面布局高度管理
 *
 * 自动计算和管理页面内容区域的高度，确保内容区域能够正确填充剩余空间。
 * 监听头部元素高度变化，动态调整内容区域高度，避免出现滚动条或布局错乱。
 *
 * ## 主要功能
 *
 * 1. 动态高度计算 - 根据头部元素高度自动计算内容区域高度
 * 2. 响应式监听 - 自动监听元素尺寸变化并更新高度
 * 3. CSS 变量同步 - 自动更新 CSS 变量，方便全局使用
 * 4. 灵活配置 - 支持自定义间距、CSS 变量名等
 * 5. 自动查找模式 - 提供通过 ID 自动查找元素的便捷方式
 *
 * @module useLayoutHeight
 * @author Ci-Yuu-Plus Team
 */

import { ref, computed, watch, onMounted, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { useElementSize } from '@vueuse/core'

/**
 * 页面容器高度配置
 */
interface LayoutHeightOptions {
  /** 额外的间距（默认 15px） */
  extraSpacing?: MaybeRef<number>
  /** 额外参与高度扣减的头部元素 ID */
  extraHeaderId?: MaybeRef<string | undefined>
  /** 是否自动更新 CSS 变量（默认 true） */
  updateCssVar?: boolean
  /** CSS 变量名称（默认 '--art-full-height'） */
  cssVarName?: string
}

export function useLayoutHeight(options: LayoutHeightOptions = {}) {
  const { extraSpacing = 15, updateCssVar = true, cssVarName = '--art-full-height' } = options

  // 元素引用
  const headerRef = ref<HTMLElement>()
  const contentHeaderRef = ref<HTMLElement>()
  const auxiliaryHeaderRef = ref<HTMLElement>()

  // 使用 VueUse 自动监听元素尺寸变化
  const { height: headerHeight } = useElementSize(headerRef)
  const { height: contentHeaderHeight } = useElementSize(contentHeaderRef)
  const { height: auxiliaryHeaderHeight } = useElementSize(auxiliaryHeaderRef)

  // 计算容器最小高度（响应式）
  const containerMinHeight = computed(() => {
    const totalHeight =
      headerHeight.value +
      contentHeaderHeight.value +
      auxiliaryHeaderHeight.value +
      unref(extraSpacing)
    return `calc(100vh - ${totalHeight}px)`
  })

  if (updateCssVar) {
    watch(
      containerMinHeight,
      (newHeight) => {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(cssVarName, newHeight)
        })
      },
      { immediate: true }
    )
  }

  return {
    /** 容器最小高度（响应式） */
    containerMinHeight,
    /** 头部元素引用 */
    headerRef,
    /** 内容头部元素引用 */
    contentHeaderRef,
    /** 额外头部元素引用 */
    extraHeaderRef: auxiliaryHeaderRef,
    /** 头部高度（响应式） */
    headerHeight,
    /** 内容头部高度（响应式） */
    contentHeaderHeight,
    /** 额外头部高度（响应式） */
    extraHeaderHeight: auxiliaryHeaderHeight
  }
}

/**
 * 通过 ID 自动查找元素的布局高度管理
 * 适用于无法直接获取元素引用的场景
 *
 * @param headerIds 头部元素的 ID 数组
 * @param options 配置选项
 *
 * ```
 */
export function useAutoLayoutHeight(
  headerIds: MaybeRef<string[]> = ['app-header', 'app-content-header'],
  options: LayoutHeightOptions = {}
) {
  const {
    extraSpacing = 15,
    extraHeaderId,
    updateCssVar = true,
    cssVarName = '--art-full-height'
  } = options

  // 创建元素引用
  const headerRef = ref<HTMLElement>()
  const contentHeaderRef = ref<HTMLElement>()
  const extraHeaderRef = ref<HTMLElement>()

  // 使用 VueUse 自动监听元素尺寸变化
  const { height: headerHeight } = useElementSize(headerRef)
  const { height: contentHeaderHeight } = useElementSize(contentHeaderRef)
  const { height: extraHeaderHeight } = useElementSize(extraHeaderRef)
  const effectiveExtraHeaderHeight = computed(() =>
    extraHeaderRef.value &&
    typeof document !== 'undefined' &&
    document.body.contains(extraHeaderRef.value)
      ? extraHeaderHeight.value
      : 0
  )

  // 计算容器最小高度（响应式）
  const containerMinHeight = computed(() => {
    const totalHeight =
      headerHeight.value +
      contentHeaderHeight.value +
      effectiveExtraHeaderHeight.value +
      unref(extraSpacing)
    return `calc(100vh - ${totalHeight}px)`
  })

  if (updateCssVar) {
    watch(
      containerMinHeight,
      (newHeight) => {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(cssVarName, newHeight)
        })
      },
      { immediate: true }
    )
  }

  const resolveElements = () => {
    if (typeof document !== 'undefined') {
      // 使用 nextTick 确保 DOM 完全渲染
      requestAnimationFrame(() => {
        const currentHeaderIds = unref(headerIds)
        const currentExtraHeaderId = unref(extraHeaderId)
        const header = currentHeaderIds[0] ? document.getElementById(currentHeaderIds[0]) : null
        const contentHeader = currentHeaderIds[1]
          ? document.getElementById(currentHeaderIds[1])
          : null
        const extraHeader = currentExtraHeaderId
          ? document.getElementById(currentExtraHeaderId)
          : null

        headerRef.value = header || undefined
        contentHeaderRef.value = contentHeader || undefined
        extraHeaderRef.value = extraHeader || undefined
      })
    }
  }

  // 在 DOM 挂载后查找元素
  onMounted(() => {
    resolveElements()
  })

  watch(
    [() => unref(headerIds).join('|'), () => unref(extraHeaderId)],
    () => {
      resolveElements()
    },
    { flush: 'post' }
  )

  return {
    /** 容器最小高度（响应式） */
    containerMinHeight,
    /** 头部元素引用 */
    headerRef,
    /** 内容头部元素引用 */
    contentHeaderRef,
    /** 额外头部元素引用 */
    extraHeaderRef,
    /** 头部高度（响应式） */
    headerHeight,
    /** 内容头部高度（响应式） */
    contentHeaderHeight,
    /** 额外头部高度（响应式） */
    extraHeaderHeight
  }
}
