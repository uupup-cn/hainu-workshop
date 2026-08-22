<!-- 右键菜单 -->
<template>
  <div class="menu-right">
    <Transition
      :css="false"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="rendered"
        ref="contextMenuRef"
        :style="menuStyle"
        class="context-menu art-surface-pop min-w-[var(--menu-width)] w-[var(--menu-width)]"
      >
        <ul class="menu-list m-0 list-none" :style="menuListStyle">
          <template v-for="item in menuItems" :key="item.key">
            <li v-if="isDividerItem(item)" class="menu-divider"></li>
            <li v-else-if="isGroupItem(item)" class="menu-group-title">{{ item.label }}</li>

            <!-- 普通菜单项 -->
            <li
              v-else-if="!item.children"
              class="menu-item relative flex-c gap-2 c-p select-none rounded transition-colors duration-150 hover:bg-g-200"
              :class="{ 'is-disabled': item.disabled, 'has-line': item.showLine }"
              :style="menuItemStyle"
              @click="handleMenuClick(item)"
            >
              <span
                v-if="item.icon"
                class="menu-icon-slot"
                :class="item.iconVariant === 'box' ? 'is-box' : ''"
                :style="getIconSlotStyle(item)"
              >
                <ArtSvgIcon
                  :class="[
                    item.iconVariant === 'box' ? 'text-sm' : 'text-base text-g-800',
                    item.iconClass
                  ]"
                  :icon="item.icon"
                />
              </span>
              <span
                class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                >{{ item.label }}</span
              >
            </li>

            <!-- 子菜单 -->
            <li
              v-else
              class="menu-item submenu relative flex-c c-p select-none rounded transition-colors duration-150 hover:bg-g-200"
              :class="{ 'is-open-left': getSubmenuPlacement(item.key).direction === 'left' }"
              :style="menuItemStyle"
              @mouseenter="updateSubmenuPlacement($event, item)"
              @focusin="updateSubmenuPlacement($event, item)"
            >
              <div class="submenu-title flex-c w-full gap-2">
                <span
                  v-if="item.icon"
                  class="menu-icon-slot"
                  :class="item.iconVariant === 'box' ? 'is-box' : ''"
                  :style="getIconSlotStyle(item)"
                >
                  <ArtSvgIcon
                    :class="[
                      item.iconVariant === 'box' ? 'text-sm' : 'text-base text-g-800',
                      item.iconClass
                    ]"
                    :icon="item.icon"
                  />
                </span>
                <span
                  class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                  >{{ item.label }}</span
                >
                <ArtSvgIcon
                  icon="ri:arrow-right-s-line"
                  class="submenu-arrow shrink-0 text-base text-g-500"
                />
              </div>
              <ul
                class="submenu-list art-surface-pop pointer-events-none absolute top-0 z-[2001] w-max min-w-max list-none opacity-0"
                :style="getSubmenuListStyle(item)"
              >
                <template v-for="child in item.children" :key="child.key">
                  <li v-if="isDividerItem(child)" class="menu-divider mx-1.5"></li>
                  <li v-else-if="isGroupItem(child)" class="menu-group-title mx-1.5">
                    {{ child.label }}
                  </li>
                  <li
                    v-else
                    class="menu-item relative mx-1.5 flex-c gap-2 c-p select-none rounded transition-colors duration-150 hover:bg-g-200"
                    :class="{ 'is-disabled': child.disabled, 'has-line': child.showLine }"
                    :style="menuItemStyle"
                    @click="handleMenuClick(child)"
                  >
                    <span
                      v-if="child.icon"
                      class="menu-icon-slot"
                      :class="child.iconVariant === 'box' ? 'is-box' : ''"
                      :style="getIconSlotStyle(child)"
                    >
                      <ArtSvgIcon
                        :class="[
                          child.iconVariant === 'box' ? 'text-sm' : 'text-base text-g-800',
                          child.iconClass
                        ]"
                        :icon="child.icon"
                      />
                    </span>
                    <span
                      class="menu-label flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-g-800"
                      >{{ child.label }}</span
                    >
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import type { MenuItemType } from './types'

  defineOptions({ name: 'ArtMenuRight' })

  interface Props {
    menuItems: MenuItemType[]
    /** 菜单宽度 */
    menuWidth?: number
    /** 子菜单宽度 */
    submenuWidth?: number
    /** 菜单项高度 */
    itemHeight?: number
    /** 边界距离 */
    boundaryDistance?: number
    /** 菜单内边距 */
    menuPadding?: number
    /** 菜单项水平内边距 */
    itemPaddingX?: number
    /** 菜单圆角 */
    borderRadius?: number
    /** 动画持续时间 */
    animationDuration?: number
    /** 是否在重复打开时立即更新位置，不播放离场再入场动画 */
    instantReposition?: boolean
    /** 菜单文字尺寸 */
    size?: 'small' | 'medium'
  }

  const props = withDefaults(defineProps<Props>(), {
    menuWidth: 120,
    submenuWidth: 150,
    itemHeight: 32,
    boundaryDistance: 10,
    menuPadding: 5,
    itemPaddingX: 6,
    borderRadius: 6,
    animationDuration: 180,
    instantReposition: false,
    size: 'small'
  })

  const emit = defineEmits<{
    (e: 'select', item: MenuItemType): void
    (e: 'show'): void
    (e: 'hide'): void
  }>()

  const visible = ref(false)
  const rendered = ref(false)
  const isLeaving = ref(false)
  const position = ref({ x: 0, y: 0 })
  const submenuPlacementMap = ref<
    Record<string, { top: number; direction: 'left' | 'right'; maxHeight: number }>
  >({})
  const contextMenuRef = ref<HTMLElement>()
  const settingStore = useSettingStore()

  // 用于清理定时器和事件监听器
  let showTimer: number | null = null
  let pendingOpenPosition: { x: number; y: number } | null = null
  let eventListenersAdded = false

  const isDividerItem = (item: MenuItemType) => item.showLine && !item.label && !item.children
  const isGroupItem = (item: MenuItemType) => item.type === 'group'

  const getIconSlotStyle = (item: MenuItemType): CSSProperties | undefined => {
    if (item.iconVariant !== 'box') return undefined

    return {
      color: item.iconColor || 'var(--default-box-color)',
      background: item.iconBg || 'var(--theme-color)'
    }
  }

  // 计算菜单样式
  const menuStyle = computed(
    (): CSSProperties =>
      ({
        position: 'fixed' as const,
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        zIndex: 2000,
        width: `${props.menuWidth}px`,
        '--menu-width': `${props.menuWidth}px`
      }) as CSSProperties
  )

  // 计算菜单列表样式
  const menuListStyle = computed(
    (): CSSProperties => ({
      padding: `${props.menuPadding}px`
    })
  )

  // 计算菜单项样式
  const menuItemStyle = computed(
    (): CSSProperties => ({
      height: `${props.itemHeight}px`,
      padding: `0 ${props.itemPaddingX}px`,
      borderRadius: '4px',
      fontSize: props.size === 'medium' ? '13px' : '12px'
    })
  )

  const getSubmenuPlacement = (key: string) =>
    submenuPlacementMap.value[key] || {
      top: -4,
      direction: settingStore.isRtl ? 'left' : 'right',
      maxHeight: Math.max(120, window.innerHeight - props.boundaryDistance * 2)
    }

  const calculateSubmenuHeight = (items: MenuItemType[] = []): number => {
    let totalHeight = props.menuPadding * 2

    items.forEach((item, index) => {
      if (isDividerItem(item)) {
        totalHeight += 7
        return
      }
      if (isGroupItem(item)) {
        totalHeight += index === 0 ? 20 : 32
        return
      }
      totalHeight += props.itemHeight
      if (item.showLine) {
        totalHeight += 6
      }
    })

    return totalHeight
  }

  const updateSubmenuPlacement = (event: MouseEvent | FocusEvent, item: MenuItemType) => {
    const menuItemElement = event.currentTarget as HTMLElement | null
    if (!menuItemElement || !item.children?.length) return

    const itemRect = menuItemElement.getBoundingClientRect()
    const submenuHeight = calculateSubmenuHeight(item.children)
    const maxHeight = Math.max(120, window.innerHeight - props.boundaryDistance * 2)
    const fittedHeight = Math.min(submenuHeight, maxHeight)
    const minTop = props.boundaryDistance - itemRect.top
    const maxTop = window.innerHeight - props.boundaryDistance - fittedHeight - itemRect.top
    const top = Math.min(Math.max(-4, minTop), maxTop)
    const rightSpace = window.innerWidth - itemRect.right - props.boundaryDistance
    const leftSpace = itemRect.left - props.boundaryDistance
    const preferLeft = settingStore.isRtl
    const canOpenRight = rightSpace >= props.submenuWidth - 4
    const canOpenLeft = leftSpace >= props.submenuWidth - 4
    let direction: 'left' | 'right' = 'right'

    if (preferLeft && canOpenLeft) {
      direction = 'left'
    } else if (!preferLeft && canOpenRight) {
      direction = 'right'
    } else if (canOpenLeft) {
      direction = 'left'
    }

    submenuPlacementMap.value = {
      ...submenuPlacementMap.value,
      [item.key]: {
        top,
        direction,
        maxHeight
      }
    }
  }

  const getSubmenuListStyle = (item: MenuItemType): CSSProperties => {
    const placement = getSubmenuPlacement(item.key)
    return {
      minWidth: `${props.submenuWidth}px`,
      padding: `${props.menuPadding}px 0`,
      borderRadius: `${props.borderRadius}px`,
      top: `${placement.top}px`,
      right: placement.direction === 'left' ? 'calc(100% - 4px)' : 'auto',
      left: placement.direction === 'right' ? 'calc(100% - 4px)' : 'auto',
      maxHeight: `${placement.maxHeight}px`,
      overflowY: 'auto'
    }
  }

  // 计算菜单高度（用于边界检测）
  const calculateMenuHeight = (): number => {
    let totalHeight = props.menuPadding * 2 // 上下内边距

    props.menuItems.forEach((item) => {
      if (isDividerItem(item)) {
        totalHeight += 7
        return
      }
      if (isGroupItem(item)) {
        totalHeight += 32
        return
      }
      totalHeight += props.itemHeight
      if (item.showLine) {
        totalHeight += 6 // 分割线额外高度
      }
    })

    return totalHeight
  }

  // 优化的位置计算函数
  const calculatePosition = (e: MouseEvent) => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const menuHeight = calculateMenuHeight()

    let x = e.clientX
    let y = e.clientY

    // 检查右边界 - 优先显示在鼠标右侧，如果空间不足则显示在左侧
    if (x + props.menuWidth > screenWidth - props.boundaryDistance) {
      x = Math.max(props.boundaryDistance, x - props.menuWidth)
    }

    // 检查下边界 - 优先显示在鼠标下方，如果空间不足则向上调整
    if (y + menuHeight > screenHeight - props.boundaryDistance) {
      y = Math.max(props.boundaryDistance, screenHeight - menuHeight - props.boundaryDistance)
    }

    // 确保不会超出边界
    x = Math.max(
      props.boundaryDistance,
      Math.min(x, screenWidth - props.menuWidth - props.boundaryDistance)
    )
    y = Math.max(
      props.boundaryDistance,
      Math.min(y, screenHeight - menuHeight - props.boundaryDistance)
    )

    return { x, y }
  }

  const clampPositionToViewport = (nextPosition: { x: number; y: number }) => {
    const menuElement = contextMenuRef.value
    const menuWidth = menuElement?.offsetWidth || props.menuWidth
    const menuHeight = menuElement?.offsetHeight || calculateMenuHeight()
    const maxX = window.innerWidth - menuWidth - props.boundaryDistance
    const maxY = window.innerHeight - menuHeight - props.boundaryDistance

    return {
      x: Math.max(props.boundaryDistance, Math.min(nextPosition.x, maxX)),
      y: Math.max(props.boundaryDistance, Math.min(nextPosition.y, maxY))
    }
  }

  const alignMenuToViewport = async () => {
    await nextTick()
    if (!rendered.value || !contextMenuRef.value) return

    const nextPosition = clampPositionToViewport(position.value)
    if (nextPosition.x === position.value.x && nextPosition.y === position.value.y) return

    position.value = nextPosition
  }

  // 添加事件监听器
  const addEventListeners = () => {
    if (eventListenersAdded) return

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('contextmenu', handleDocumentContextmenu)
    document.addEventListener('keydown', handleKeydown)
    eventListenersAdded = true
  }

  // 移除事件监听器
  const removeEventListeners = () => {
    if (!eventListenersAdded) return

    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('contextmenu', handleDocumentContextmenu)
    document.removeEventListener('keydown', handleKeydown)
    eventListenersAdded = false
  }

  // 处理文档点击事件
  const handleDocumentClick = (e: Event) => {
    // 检查点击是否在菜单内部
    const target = e.target as Element
    const menuElement = document.querySelector('.context-menu')
    if (menuElement && menuElement.contains(target)) {
      return
    }
    hide()
  }

  // 处理文档右键事件
  const handleDocumentContextmenu = () => {
    hide()
  }

  // 处理键盘事件
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hide()
    }
  }

  const clearShowTimer = () => {
    if (showTimer) {
      window.clearTimeout(showTimer)
      showTimer = null
    }
  }

  const openAtPosition = (nextPosition: { x: number; y: number }) => {
    position.value = nextPosition
    visible.value = true
    rendered.value = true
    void alignMenuToViewport()

    emit('show')
    addEventListenersAfterOpen()
  }

  const show = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    clearShowTimer()

    const nextPosition = calculatePosition(e)

    if (rendered.value || isLeaving.value) {
      if (props.instantReposition) {
        pendingOpenPosition = null
        isLeaving.value = false
        openAtPosition(nextPosition)
        return
      }

      // 已显示时重新右键，需要先走一次离场，再在新位置触发入场动画。
      pendingOpenPosition = nextPosition
      removeEventListeners()
      if (!isLeaving.value) {
        visible.value = false
        emit('hide')
        rendered.value = false
      }
      return
    }

    openAtPosition(nextPosition)
  }

  const addEventListenersAfterOpen = () => {
    // 延迟添加事件监听器，避免立即触发关闭
    showTimer = window.setTimeout(
      () => {
        if (visible.value) {
          addEventListeners()
        }
        showTimer = null
      },
      props.instantReposition ? 0 : 50
    ) // 减少延迟时间，提升响应性
  }

  const hide = () => {
    if (!visible.value) return

    pendingOpenPosition = null
    submenuPlacementMap.value = {}
    visible.value = false
    rendered.value = false
    emit('hide')

    clearShowTimer()

    // 移除事件监听器
    removeEventListeners()
  }

  const handleMenuClick = (item: MenuItemType) => {
    if (item.disabled) return
    emit('select', item)
    hide()
  }

  const shouldReduceMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const cancelMenuAnimations = (element: HTMLElement) => {
    element.getAnimations?.().forEach((animation) => animation.cancel())
  }

  const playMenuAnimation = (
    element: HTMLElement,
    keyframes: Parameters<HTMLElement['animate']>[0],
    options: Parameters<HTMLElement['animate']>[1],
    done: () => void
  ) => {
    cancelMenuAnimations(element)

    if (shouldReduceMotion()) {
      done()
      return
    }

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      element.style.opacity = ''
      element.style.transform = ''
      element.style.filter = ''
      done()
    }

    const animation = element.animate(keyframes, options)
    animation.addEventListener('finish', finish, { once: true })
    animation.addEventListener('cancel', finish, { once: true })
  }

  // 动画钩子函数
  const onBeforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.transformOrigin = settingStore.isRtl ? 'top right' : 'top left'
    element.style.opacity = '0'
    element.style.transform = 'translate3d(0, -4px, 0) scale(0.96)'
    element.style.filter = 'blur(1px)'
  }

  const onEnter = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    playMenuAnimation(
      element,
      [
        { opacity: 0, filter: 'blur(1px)', transform: 'translate3d(0, -4px, 0) scale(0.96)' },
        { opacity: 1, filter: 'blur(0)', transform: 'translate3d(0, 0, 0) scale(1)' }
      ],
      {
        duration: props.animationDuration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both'
      },
      done
    )
  }

  const onBeforeLeave = (el: Element) => {
    isLeaving.value = true
    cancelMenuAnimations(el as HTMLElement)
  }

  const onLeave = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    playMenuAnimation(
      element,
      [
        { opacity: 1, filter: 'blur(0)', transform: 'translate3d(0, 0, 0) scale(1)' },
        { opacity: 0, filter: 'blur(1px)', transform: 'translate3d(0, -3px, 0) scale(0.97)' }
      ],
      {
        duration: Math.max(120, props.animationDuration - 40),
        easing: 'cubic-bezier(0.4, 0, 1, 1)',
        fill: 'both'
      },
      done
    )
  }

  const onAfterLeave = () => {
    isLeaving.value = false

    // 确保清理所有资源
    removeEventListeners()

    if (pendingOpenPosition) {
      const nextPosition = pendingOpenPosition
      pendingOpenPosition = null
      openAtPosition(nextPosition)
      return
    }

    clearShowTimer()
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    removeEventListeners()
    pendingOpenPosition = null
    clearShowTimer()
  })

  // 导出方法供父组件调用
  defineExpose({
    show,
    hide,
    visible: computed(() => visible.value && rendered.value)
  })
</script>

<style scoped>
  .menu-right {
    --menu-width: v-bind('props.menuWidth + "px"');
    --border-radius: v-bind('props.borderRadius + "px"');
  }

  .menu-item.has-line {
    margin-bottom: 6px;
  }

  .menu-item.has-line::after {
    position: absolute;
    right: 0;
    bottom: -3px;
    left: 0;
    height: 1px;
    content: '';
    background-color: var(--art-gray-300);
  }

  .menu-divider {
    height: 7px;
    margin: 3px 0;
    list-style: none;
    border-top: 1px solid var(--art-gray-300);
  }

  .menu-group-title {
    height: 28px;
    padding: 10px 10px 4px;
    font-size: 12px;
    font-weight: 600;
    line-height: 12px;
    color: var(--art-gray-500);
    list-style: none;
    border-top: 1px solid var(--art-gray-300);
  }

  .menu-group-title:not(:first-child) {
    margin-top: 4px;
  }

  .menu-group-title:first-child {
    height: 20px;
    padding-top: 4px;
    border-top: 0;
  }

  .menu-item.is-disabled {
    color: var(--el-text-color-disabled);
    cursor: not-allowed;
  }

  .menu-item.is-disabled:hover {
    background-color: transparent !important;
  }

  .menu-item.is-disabled i:not(.submenu-arrow),
  .menu-item.is-disabled :deep(.art-svg-icon) {
    color: var(--el-text-color-disabled) !important;
  }

  .menu-icon-slot {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1rem;
  }

  .menu-icon-slot.is-box {
    width: 20px;
    height: 20px;
    color: var(--default-box-color);
    border-radius: calc(var(--custom-radius) / 2);
  }

  .menu-icon-slot.is-box :deep(.art-svg-icon) {
    color: currentcolor !important;
  }

  .menu-item.is-disabled .menu-label {
    color: var(--el-text-color-disabled) !important;
  }

  .menu-item.submenu:hover .submenu-list {
    pointer-events: auto;
    visibility: visible;
    opacity: 1;
    transform: translateX(4px) scale(1);
  }

  .menu-item.submenu.is-open-left:hover .submenu-list {
    transform: translateX(-4px) scale(1);
  }

  .menu-item.submenu:hover .submenu-title .submenu-arrow {
    transform: rotate(90deg);
  }

  .submenu-arrow {
    transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .submenu-list {
    top: -4px;
    visibility: hidden;
    transition:
      opacity 150ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 150ms cubic-bezier(0.16, 1, 0.3, 1),
      visibility 0s linear 150ms;
    transform: translateX(0) scale(0.98);
    transform-origin: top left;
    will-change: opacity, transform;
  }

  .menu-item.submenu.is-open-left .submenu-list {
    transform-origin: top right;
  }

  [dir='rtl'] .submenu-list {
    transform-origin: top right;
  }

  .menu-item.submenu::after {
    position: absolute;
    top: 0;
    right: -8px;
    width: 8px;
    height: 100%;
    content: '';
  }

  .menu-item.submenu.is-open-left::after {
    right: auto;
    left: -8px;
  }

  [dir='rtl'] .menu-item.submenu::after {
    right: auto;
    left: -8px;
  }

  [dir='rtl'] .menu-item.submenu:hover .submenu-list {
    transform: translateX(-4px) scale(1);
  }

  .context-menu {
    transform-origin: top left;
    will-change: opacity, transform, filter;
  }
</style>
