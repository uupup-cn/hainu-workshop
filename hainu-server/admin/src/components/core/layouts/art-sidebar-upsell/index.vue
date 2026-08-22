<!-- 侧边栏底部商业升级入口卡片 -->
<!-- 引流到官网定价页，折叠态收成图标按钮 -->
<template>
  <!-- 最小化态用 Teleport 移出侧边栏 DOM 子树，固定在视口右下角 -->
  <!-- 避免它作为 .menu-left 的后代触发双列菜单的 hover 展开 -->
  <Teleport to="body" :disabled="!minimized">
    <div
      v-if="visible"
      ref="upsellRef"
      class="art-sidebar-upsell"
      :class="{
        'is-collapsed': collapsed && !minimized,
        'is-minimized': minimized,
        'is-restore-ghosting': restoreGhosting
      }"
      :style="floatingPlacementStyle"
    >
      <!-- 最小化态：固定在反馈入口上方，点击恢复为侧边栏卡片 -->
      <template v-if="minimized">
        <button
          type="button"
          class="art-sidebar-upsell__mini-btn"
          :aria-label="$t('sidebarUpsell.restore')"
          @click="handleRestore"
        >
          <span class="art-sidebar-upsell__mini-inner">
            <ArtSvgIcon icon="ri:vip-crown-2-line" />
          </span>
        </button>
      </template>

      <!-- 折叠态：仅显示一个带礼盒图标的小按钮 -->
      <template v-else-if="collapsed">
        <button
          type="button"
          class="art-sidebar-upsell__icon-btn"
          :aria-label="$t('sidebarUpsell.title')"
          @click="handleOpenPricing"
        >
          <ArtSvgIcon icon="ri:vip-crown-2-line" class="art-sidebar-upsell__crown" />
        </button>
      </template>

      <!-- 展开态：完整的升级卡片 -->
      <div v-else class="art-sidebar-upsell__card">
        <button
          type="button"
          class="art-sidebar-upsell__close"
          :aria-label="$t('sidebarUpsell.close')"
          @click="handleMinimize"
        >
          <ArtSvgIcon icon="ri:close-line" />
        </button>

        <div class="art-sidebar-upsell__head">
          <span class="art-sidebar-upsell__icon">
            <ArtSvgIcon icon="ri:vip-crown-2-line" />
          </span>
          <div class="art-sidebar-upsell__title">{{ $t('sidebarUpsell.title') }}</div>
        </div>

        <p class="art-sidebar-upsell__desc">{{ $t('sidebarUpsell.desc') }}</p>

        <div class="art-sidebar-upsell__actions">
          <button type="button" class="art-sidebar-upsell__primary" @click="handleOpenIntro">
            <span>{{ $t('sidebarUpsell.primary') }}</span>
            <ArtSvgIcon icon="ri:arrow-right-line" class="text-[14px]" />
          </button>
          <button type="button" class="art-sidebar-upsell__secondary" @click="handleOpenPricing">
            {{ $t('sidebarUpsell.secondary') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <div
    v-if="minimizeGhostVisible"
    class="art-sidebar-upsell-ghost"
    :class="{ 'is-restoring': ghostMode === 'restore' }"
    :style="minimizeGhostStyle"
  >
    <div class="art-sidebar-upsell-ghost__content">
      <div class="art-sidebar-upsell__head">
        <span class="art-sidebar-upsell__icon">
          <ArtSvgIcon icon="ri:vip-crown-2-line" />
        </span>
        <div class="art-sidebar-upsell__title">{{ $t('sidebarUpsell.title') }}</div>
      </div>

      <p class="art-sidebar-upsell__desc">{{ $t('sidebarUpsell.desc') }}</p>

      <div class="art-sidebar-upsell__actions">
        <div class="art-sidebar-upsell__primary art-sidebar-upsell-ghost__button">
          <span>{{ $t('sidebarUpsell.primary') }}</span>
          <ArtSvgIcon icon="ri:arrow-right-line" class="text-[14px]" />
        </div>
        <div class="art-sidebar-upsell__secondary art-sidebar-upsell-ghost__button">
          {{ $t('sidebarUpsell.secondary') }}
        </div>
      </div>
    </div>

    <div class="art-sidebar-upsell-ghost__mini">
      <span class="art-sidebar-upsell__mini-inner">
        <ArtSvgIcon icon="ri:vip-crown-2-line" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'

  defineOptions({ name: 'ArtSidebarUpsell' })

  interface Props {
    /** 折叠态：仅展示图标按钮，外层（父级菜单）传入 */
    collapsed?: boolean
  }

  withDefaults(defineProps<Props>(), {
    collapsed: false
  })

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const { isRtl, sidebarUpsellMinimized: minimized } = storeToRefs(settingStore)
  const upsellRef = ref<HTMLElement>()
  const minimizeGhostVisible = ref(false)
  const minimizeGhostStyle = shallowRef<CSSProperties>({})
  const restoreGhosting = ref(false)
  const ghostMode = ref<'minimize' | 'restore'>('minimize')
  let ghostTimer: number | undefined
  let reducedMotionQuery: MediaQueryList | undefined

  const MINIMIZE_GHOST_DURATION = 420
  const MOTION_LOCK_CLASS = 'art-sidebar-upsell-motion-lock'

  // 仅在登录后展示，避免登录页之类干扰
  const visible = computed(() => userStore.isLogin)

  const floatingPlacementStyle = computed<CSSProperties>(() => {
    if (!minimized.value) {
      return {}
    }

    return {
      [isRtl.value ? 'left' : 'right']: '1.25rem'
    }
  })

  const prefersReducedMotion = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }

    reducedMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')
    return reducedMotionQuery.matches
  }

  const setMotionOverflowLock = (locked: boolean) => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.classList.toggle(MOTION_LOCK_CLASS, locked)
  }

  const getMiniTargetRect = () => {
    const size = 52
    const edgeOffset = 20
    const bottomOffset = 88
    const left = isRtl.value ? edgeOffset : window.innerWidth - edgeOffset - size
    const top = window.innerHeight - bottomOffset - size

    return { left, top, width: size, height: size }
  }

  const getVisibleCardRect = (element: HTMLElement) => {
    const cardElement = element.querySelector<HTMLElement>('.art-sidebar-upsell__card')
    return (cardElement ?? element).getBoundingClientRect()
  }

  const toPixel = (value: number) => `${Math.round(value * 100) / 100}px`

  const toScale = (fromSize: number, toSize: number) => {
    if (fromSize <= 0 || toSize <= 0) {
      return 1
    }

    return Math.round((fromSize / toSize) * 10000) / 10000
  }

  const buildGhostStyle = (
    fromRect: DOMRect | { left: number; top: number; width: number; height: number },
    toRect: DOMRect | { left: number; top: number; width: number; height: number },
    mode: 'minimize' | 'restore'
  ) => {
    const isRestore = mode === 'restore'
    const layoutRect = isRestore ? toRect : fromRect
    const fromScaleX = isRestore ? toScale(fromRect.width, toRect.width) : 1
    const fromScaleY = isRestore ? toScale(fromRect.height, toRect.height) : 1
    const toScaleX = isRestore ? 1 : toScale(toRect.width, fromRect.width)
    const toScaleY = isRestore ? 1 : toScale(toRect.height, fromRect.height)
    const fromTranslateX = isRestore ? fromRect.left - toRect.left : 0
    const fromTranslateY = isRestore ? fromRect.top - toRect.top : 0
    const toTranslateX = isRestore ? 0 : toRect.left - fromRect.left
    const toTranslateY = isRestore ? 0 : toRect.top - fromRect.top

    return {
      '--upsell-ghost-left': toPixel(layoutRect.left),
      '--upsell-ghost-top': toPixel(layoutRect.top),
      '--upsell-ghost-width': toPixel(layoutRect.width),
      '--upsell-ghost-height': toPixel(layoutRect.height),
      '--upsell-ghost-from-transform': `translate3d(${toPixel(fromTranslateX)}, ${toPixel(
        fromTranslateY
      )}, 0) scale(${fromScaleX}, ${fromScaleY})`,
      '--upsell-ghost-to-transform': `translate3d(${toPixel(toTranslateX)}, ${toPixel(
        toTranslateY
      )}, 0) scale(${toScaleX}, ${toScaleY})`,
      '--upsell-ghost-mini-from-transform': `scale(${toScale(toRect.width, fromRect.width)}, ${toScale(
        toRect.height,
        fromRect.height
      )})`,
      '--upsell-ghost-mini-to-transform': `scale(${toScale(fromRect.width, toRect.width)}, ${toScale(
        fromRect.height,
        toRect.height
      )})`
    } as CSSProperties
  }

  const clearGhostTimer = () => {
    if (typeof window === 'undefined') {
      return
    }

    window.clearTimeout(ghostTimer)
    ghostTimer = undefined
  }

  const resetGhost = () => {
    minimizeGhostVisible.value = false
    minimizeGhostStyle.value = {}
  }

  /**
   * 关闭时用视觉替身完成“卡片收束成按钮”，避免真实节点先变圆再移动。
   */
  const minimizeWithGhost = () => {
    const element = upsellRef.value

    if (!element || prefersReducedMotion()) {
      settingStore.closeSidebarUpsell()
      return
    }

    const firstRect = getVisibleCardRect(element)
    const targetRect = getMiniTargetRect()

    clearGhostTimer()
    setMotionOverflowLock(false)
    ghostMode.value = 'minimize'
    restoreGhosting.value = false
    minimizeGhostStyle.value = buildGhostStyle(firstRect, targetRect, 'minimize')

    minimizeGhostVisible.value = true
    settingStore.closeSidebarUpsell()

    ghostTimer = window.setTimeout(() => {
      resetGhost()
      ghostTimer = undefined
    }, MINIMIZE_GHOST_DURATION)
  }

  /**
   * 从右下角按钮恢复时使用 fixed 替身动画，避免真实侧栏卡片 transform 撑出横向滚动条。
   */
  const restoreWithGhost = async () => {
    const element = upsellRef.value

    if (!element || prefersReducedMotion()) {
      settingStore.openSidebarUpsell()
      return
    }

    const firstRect = element.getBoundingClientRect()

    clearGhostTimer()
    setMotionOverflowLock(true)
    ghostMode.value = 'restore'
    restoreGhosting.value = true

    settingStore.openSidebarUpsell()
    await nextTick()

    const targetElement = upsellRef.value
    const targetRect = targetElement ? getVisibleCardRect(targetElement) : firstRect

    minimizeGhostStyle.value = buildGhostStyle(firstRect, targetRect, 'restore')

    minimizeGhostVisible.value = true

    ghostTimer = window.setTimeout(() => {
      resetGhost()
      restoreGhosting.value = false
      setMotionOverflowLock(false)
      ghostTimer = undefined
    }, MINIMIZE_GHOST_DURATION)
  }

  const handleMinimize = () => {
    minimizeWithGhost()
  }

  const handleRestore = () => {
    restoreWithGhost()
  }

  /**
   * 跳转到官网定价页
   */
  const handleOpenPricing = () => {}

  /**
   * 跳转到官网产品介绍页
   */
  const handleOpenIntro = () => {}

  onBeforeUnmount(() => {
    clearGhostTimer()
    resetGhost()
    restoreGhosting.value = false
    setMotionOverflowLock(false)
  })
</script>

<style lang="scss" scoped>
  :global(html.art-sidebar-upsell-motion-lock),
  :global(html.art-sidebar-upsell-motion-lock body) {
    overflow-x: hidden;
    overflow-x: clip;
  }

  .art-sidebar-upsell {
    box-sizing: border-box;
    width: 100%;
    padding: 0 12px 12px;
    transform-origin: top left;

    &.is-collapsed {
      padding: 0 0 12px;
      text-align: center;
    }

    &.is-minimized {
      position: fixed;
      bottom: calc(1.5rem + 52px + 0.75rem);
      z-index: 1190;
      width: 52px;
      height: 52px;
      padding: 0;
      pointer-events: auto;
    }

    &.is-restore-ghosting {
      pointer-events: none;
      visibility: hidden;
    }
  }

  .art-sidebar-upsell__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    color: var(--theme-primary-content);
    cursor: pointer;
    background: var(--color-primary);
    border: none;
    border-radius: calc(var(--custom-radius) / 2);
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--color-primary) 88%, var(--theme-base-content));
      transform: translateY(-1px);
    }

    .art-sidebar-upsell__crown {
      font-size: 18px;
    }
  }

  .art-sidebar-upsell__mini-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    padding: 0;
    color: var(--art-gray-800);
    cursor: pointer;
    background: var(--default-box-color);
    border: 1px solid var(--default-border);
    border-radius: 50%;
    box-shadow: 0 16px 32px rgb(15 23 42 / 14%);
    transition:
      box-shadow 0.2s ease,
      transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
      background-color 0.2s ease;

    &:hover {
      box-shadow: 0 20px 40px rgb(15 23 42 / 18%);
      transform: translateY(-2px);
    }
  }

  .art-sidebar-upsell__mini-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--theme-primary-content);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: 50%;
  }

  .art-sidebar-upsell-ghost {
    position: fixed;
    top: var(--upsell-ghost-top);
    left: var(--upsell-ghost-left);
    z-index: 1191;
    box-sizing: border-box;
    width: var(--upsell-ghost-width);
    height: var(--upsell-ghost-height);
    padding: 14px;
    overflow: hidden;
    pointer-events: none;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary) 10%, transparent),
        color-mix(in srgb, var(--color-secondary) 12%, transparent)
      ),
      var(--default-box-color);
    border: 1px solid color-mix(in srgb, var(--color-primary) 22%, var(--default-border));
    border-radius: calc(var(--custom-radius) / 2 + 2px);
    box-shadow: 0 18px 42px color-mix(in srgb, var(--theme-base-content) 16%, transparent);
    transform: var(--upsell-ghost-from-transform);
    transform-origin: top left;
    animation: sidebar-upsell-minimize-ghost 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: transform, opacity;
    contain: layout paint style;
    backface-visibility: hidden;

    &.is-restoring {
      animation-name: sidebar-upsell-restore-ghost;

      .art-sidebar-upsell-ghost__content {
        animation-name: sidebar-upsell-restore-content;
      }

      .art-sidebar-upsell-ghost__mini {
        animation-name: sidebar-upsell-restore-mini;
      }

      .art-sidebar-upsell__mini-inner {
        animation-name: sidebar-upsell-restore-mini-inner;
      }

      &::before {
        animation-name: sidebar-upsell-restore-orb;
      }
    }

    &::before {
      position: absolute;
      top: -28px;
      right: -32px;
      width: 96px;
      height: 96px;
      content: '';
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--color-primary) 18%, transparent) 0%,
        transparent 65%
      );
      animation: sidebar-upsell-ghost-orb 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }

  .art-sidebar-upsell-ghost__content {
    position: relative;
    z-index: 1;
    animation: sidebar-upsell-ghost-content 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .art-sidebar-upsell-ghost__button {
    pointer-events: none;
  }

  .art-sidebar-upsell-ghost__mini {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: sidebar-upsell-ghost-mini 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;

    .art-sidebar-upsell__mini-inner {
      animation: sidebar-upsell-ghost-mini-inner 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }

  .art-sidebar-upsell__card {
    position: relative;
    box-sizing: border-box;
    padding: 14px;
    overflow: hidden;
    color: var(--art-gray-800);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary) 10%, transparent),
        color-mix(in srgb, var(--color-secondary) 12%, transparent)
      ),
      var(--default-box-color);
    border: 1px solid color-mix(in srgb, var(--color-primary) 22%, var(--default-border));
    border-radius: calc(var(--custom-radius) / 2 + 2px);

    &:hover,
    &:focus-within {
      .art-sidebar-upsell__close {
        opacity: 1;
      }
    }

    &::before {
      position: absolute;
      top: -28px;
      right: -32px;
      width: 96px;
      height: 96px;
      pointer-events: none;
      content: '';
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--color-primary) 18%, transparent) 0%,
        transparent 65%
      );
    }
  }

  .art-sidebar-upsell__close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    color: var(--art-gray-500);
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: calc(var(--custom-radius) / 2);
    opacity: 0;
    transition:
      opacity 0.18s ease,
      color 0.18s ease,
      background-color 0.18s ease;

    &:hover {
      color: var(--art-gray-700);
      background: color-mix(in srgb, var(--theme-base-content) 6%, transparent);
    }

    .art-svg-icon {
      font-size: 15px;
    }
  }

  .art-sidebar-upsell__head {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;
  }

  .art-sidebar-upsell__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    color: var(--theme-primary-content);
    background: var(--color-primary);
    border-radius: calc(var(--custom-radius) / 2);

    .art-svg-icon {
      font-size: 15px;
    }
  }

  .art-sidebar-upsell__title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--art-gray-900);
  }

  .art-sidebar-upsell__desc {
    position: relative;
    z-index: 1;
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--art-gray-700);
  }

  .art-sidebar-upsell__actions {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .art-sidebar-upsell__primary {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--theme-primary-content);
    cursor: pointer;
    background: var(--color-primary);
    border: none;
    border-radius: calc(var(--custom-radius) / 2);
    transition:
      background-color 0.2s,
      transform 0.2s;

    &:hover {
      background: color-mix(in srgb, var(--color-primary) 88%, var(--theme-base-content));
      transform: translateY(-1px);
    }
  }

  .art-sidebar-upsell__secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
    color: var(--art-gray-700);
    cursor: pointer;
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--art-gray-900) 18%, var(--default-border));
    border-radius: calc(var(--custom-radius) / 2);
    transition:
      color 0.2s,
      background-color 0.2s,
      border-color 0.2s;

    &:hover {
      color: var(--art-gray-900);
      background-color: color-mix(in srgb, var(--art-gray-900) 4%, transparent);
      border-color: color-mix(in srgb, var(--art-gray-900) 28%, var(--default-border));
    }
  }

  @keyframes sidebar-upsell-minimize-ghost {
    0% {
      border-radius: calc(var(--custom-radius) / 2 + 2px);
      opacity: 1;
      transform: var(--upsell-ghost-from-transform);
    }

    58% {
      border-radius: calc(var(--custom-radius) + 8px);
      opacity: 1;
    }

    100% {
      border-color: var(--default-border);
      border-radius: 50%;
      opacity: 1;
      transform: var(--upsell-ghost-to-transform);
    }
  }

  @keyframes sidebar-upsell-restore-ghost {
    0% {
      border-color: var(--default-border);
      border-radius: 50%;
      opacity: 1;
      transform: var(--upsell-ghost-from-transform);
    }

    42% {
      border-radius: calc(var(--custom-radius) + 8px);
      opacity: 1;
    }

    100% {
      border-radius: calc(var(--custom-radius) / 2 + 2px);
      opacity: 1;
      transform: var(--upsell-ghost-to-transform);
    }
  }

  @keyframes sidebar-upsell-ghost-content {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    38% {
      opacity: 0.92;
    }

    72% {
      opacity: 0;
      transform: scale(0.94);
    }

    100% {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  @keyframes sidebar-upsell-restore-content {
    0%,
    42% {
      opacity: 0;
      transform: scale(0.9);
    }

    72% {
      opacity: 0.92;
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes sidebar-upsell-ghost-mini {
    0%,
    58% {
      opacity: 0;
      transform: scale(0.72);
    }

    78% {
      opacity: 1;
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes sidebar-upsell-ghost-mini-inner {
    0%,
    58% {
      transform: scale(1);
    }

    100% {
      transform: var(--upsell-ghost-mini-to-transform);
    }
  }

  @keyframes sidebar-upsell-restore-mini {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    22% {
      opacity: 1;
    }

    58%,
    100% {
      opacity: 0;
      transform: scale(0.72);
    }
  }

  @keyframes sidebar-upsell-restore-mini-inner {
    0%,
    58% {
      transform: var(--upsell-ghost-mini-from-transform);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes sidebar-upsell-ghost-orb {
    0%,
    44% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes sidebar-upsell-restore-orb {
    0% {
      opacity: 0;
    }

    56%,
    100% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .art-sidebar-upsell,
    .art-sidebar-upsell-ghost,
    .art-sidebar-upsell-ghost__content,
    .art-sidebar-upsell-ghost__mini,
    .art-sidebar-upsell-ghost__mini .art-sidebar-upsell__mini-inner,
    .art-sidebar-upsell__mini-btn,
    .art-sidebar-upsell__icon-btn,
    .art-sidebar-upsell__primary,
    .art-sidebar-upsell__secondary,
    .art-sidebar-upsell__close {
      transition: none;
      animation: none;
    }
  }
</style>
