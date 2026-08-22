import { onBeforeUnmount, onMounted } from 'vue'
import type { DialogConfigContext } from 'element-plus'

type DialogPointerPosition = {
  x: number
  y: number
}

type DialogAnimationState = {
  animations: Animation[]
  cleanup: () => void
}

const DIALOG_POINTER_POSITION_TIMEOUT = 100
const DIALOG_ENTER_DURATION = 320
const DIALOG_LEAVE_DURATION = 240
const DIALOG_POINTER_ENTER_START_SCALE = 0.2
const DIALOG_POINTER_LEAVE_END_SCALE = 0.2
const DIALOG_CENTER_ENTER_START_SCALE = 0.92
const DIALOG_CENTER_LEAVE_END_SCALE = 0.94
const DIALOG_ENTER_EASING = 'cubic-bezier(0.08, 0.82, 0.17, 1)'
const DIALOG_LEAVE_EASING = 'cubic-bezier(0.78, 0.14, 0.15, 0.86)'

export function useDialogMotion() {
  let dialogPointerPosition: DialogPointerPosition | undefined
  let dialogTransformOriginTimer: number | undefined
  const dialogTransformOriginMap = new WeakMap<HTMLElement, string>()
  const dialogHasPointerOriginMap = new WeakMap<HTMLElement, boolean>()
  const dialogAnimationMap = new WeakMap<HTMLElement, DialogAnimationState>()

  const clearDialogPointerPosition = () => {
    dialogPointerPosition = undefined
    dialogTransformOriginTimer = undefined
  }

  const recordDialogClickPosition = (event: MouseEvent) => {
    dialogPointerPosition = {
      x: event.pageX,
      y: event.pageY
    }

    if (dialogTransformOriginTimer) {
      window.clearTimeout(dialogTransformOriginTimer)
    }

    dialogTransformOriginTimer = window.setTimeout(
      clearDialogPointerPosition,
      DIALOG_POINTER_POSITION_TIMEOUT
    )
  }

  const getElementPageOffset = (el: Element) => {
    const rect = el.getBoundingClientRect()
    const doc = el.ownerDocument
    const win = doc.defaultView ?? window

    return {
      left: rect.left + win.pageXOffset,
      top: rect.top + win.pageYOffset
    }
  }

  const getDialogTransformOrigin = (
    dialogEl: HTMLElement,
    hasPointerOrigin = Boolean(dialogPointerPosition)
  ) => {
    if (!hasPointerOrigin || !dialogPointerPosition) {
      return 'center center'
    }

    const dialogOffset = getElementPageOffset(dialogEl)
    const originX = Math.round(dialogPointerPosition.x - dialogOffset.left)
    const originY = Math.round(dialogPointerPosition.y - dialogOffset.top)

    return `${originX}px ${originY}px`
  }

  const getDialogBaseTransform = (dialogEl: HTMLElement) => {
    const inlineTransform = dialogEl.style.transform.trim()

    if (inlineTransform) {
      return inlineTransform
    }

    const computedTransform = window.getComputedStyle(dialogEl).transform
    return computedTransform && computedTransform !== 'none' ? computedTransform : ''
  }

  const getDialogScaleTransform = (baseTransform: string, scale: number) => {
    const scaleTransform = baseTransform ? `${baseTransform} scale(${scale})` : `scale(${scale})`
    return `${scaleTransform} translateZ(0)`
  }

  const cancelDialogAnimations = (dialogEl: HTMLElement) => {
    dialogAnimationMap.get(dialogEl)?.cleanup()
    dialogAnimationMap.delete(dialogEl)
  }

  const shouldReduceDialogMotion = () => {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }

  const runDialogTransition = (el: Element, done: () => void, type: 'enter' | 'leave') => {
    const rootEl = el as HTMLElement
    const dialogEl = rootEl.querySelector<HTMLElement>('.el-dialog')

    if (!dialogEl) {
      done()
      return
    }

    cancelDialogAnimations(dialogEl)

    if (shouldReduceDialogMotion()) {
      done()
      return
    }

    const isEnter = type === 'enter'
    const duration = isEnter ? DIALOG_ENTER_DURATION : DIALOG_LEAVE_DURATION
    const easing = isEnter ? DIALOG_ENTER_EASING : DIALOG_LEAVE_EASING
    const originalRootBackgroundColor = rootEl.style.backgroundColor
    const originalRootWillChange = rootEl.style.willChange
    const originalDialogOpacity = dialogEl.style.opacity
    const originalDialogTransform = dialogEl.style.transform
    const originalDialogTransformOrigin = dialogEl.style.transformOrigin
    const originalDialogWillChange = dialogEl.style.willChange
    const originalDialogBackfaceVisibility = dialogEl.style.backfaceVisibility
    const targetRootBackgroundColor = window.getComputedStyle(rootEl).backgroundColor
    const baseTransform = getDialogBaseTransform(dialogEl)
    const hasPointerOrigin = isEnter
      ? Boolean(dialogPointerPosition)
      : (dialogHasPointerOriginMap.get(dialogEl) ?? Boolean(dialogPointerPosition))
    const enterStartScale = hasPointerOrigin
      ? DIALOG_POINTER_ENTER_START_SCALE
      : DIALOG_CENTER_ENTER_START_SCALE
    const leaveEndScale = hasPointerOrigin
      ? DIALOG_POINTER_LEAVE_END_SCALE
      : DIALOG_CENTER_LEAVE_END_SCALE
    const dialogTransformOrigin = isEnter
      ? getDialogTransformOrigin(dialogEl, hasPointerOrigin)
      : (dialogTransformOriginMap.get(dialogEl) ?? getDialogTransformOrigin(dialogEl, false))

    if (isEnter) {
      dialogTransformOriginMap.set(dialogEl, dialogTransformOrigin)
      dialogHasPointerOriginMap.set(dialogEl, hasPointerOrigin)
    }

    rootEl.style.willChange = 'background-color'
    rootEl.style.backgroundColor = isEnter ? 'rgba(0, 0, 0, 0)' : targetRootBackgroundColor

    dialogEl.style.transformOrigin = dialogTransformOrigin
    dialogEl.style.willChange = 'transform, opacity'
    dialogEl.style.backfaceVisibility = 'hidden'
    dialogEl.style.opacity = isEnter ? '0' : '1'
    dialogEl.style.transform = getDialogScaleTransform(baseTransform, isEnter ? enterStartScale : 1)

    void rootEl.offsetHeight

    const rootAnimation = rootEl.animate(
      [
        { backgroundColor: isEnter ? 'rgba(0, 0, 0, 0)' : targetRootBackgroundColor },
        { backgroundColor: isEnter ? targetRootBackgroundColor : 'rgba(0, 0, 0, 0)' }
      ],
      {
        duration,
        easing: 'linear',
        fill: 'both'
      }
    )

    const dialogAnimation = dialogEl.animate(
      [
        {
          opacity: isEnter ? 0 : 1,
          transform: getDialogScaleTransform(baseTransform, isEnter ? enterStartScale : 1)
        },
        {
          opacity: isEnter ? 1 : 0,
          transform: getDialogScaleTransform(baseTransform, isEnter ? 1 : leaveEndScale)
        }
      ],
      {
        duration,
        easing,
        fill: 'both'
      }
    )

    const animations = [rootAnimation, dialogAnimation]

    const cleanup = () => {
      animations.forEach((animation) => animation.cancel())
      dialogAnimationMap.delete(dialogEl)
      rootEl.style.backgroundColor = originalRootBackgroundColor
      rootEl.style.willChange = originalRootWillChange
      dialogEl.style.opacity = originalDialogOpacity
      dialogEl.style.transform = originalDialogTransform
      dialogEl.style.transformOrigin = originalDialogTransformOrigin
      dialogEl.style.willChange = originalDialogWillChange
      dialogEl.style.backfaceVisibility = originalDialogBackfaceVisibility
    }

    const animationState: DialogAnimationState = {
      animations,
      cleanup
    }
    dialogAnimationMap.set(dialogEl, animationState)

    const finish = () => {
      if (dialogAnimationMap.get(dialogEl) !== animationState) return

      if (isEnter) {
        cleanup()
        done()
        return
      }

      rootEl.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      dialogEl.style.opacity = '0'
      dialogEl.style.transform = getDialogScaleTransform(baseTransform, leaveEndScale)
      dialogTransformOriginMap.delete(dialogEl)
      dialogHasPointerOriginMap.delete(dialogEl)
      done()
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(cleanup)
      })
    }

    void Promise.all(animations.map((animation) => animation.finished))
      .then(finish)
      .catch(finish)
  }

  const dialogConfig: DialogConfigContext = {
    transition: {
      css: false,
      onEnter: (el, done) => {
        runDialogTransition(el, done, 'enter')
      },
      onLeave: (el, done) => {
        runDialogTransition(el, done, 'leave')
      }
    }
  }

  onMounted(() => {
    document.documentElement.addEventListener('click', recordDialogClickPosition, true)
  })

  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('click', recordDialogClickPosition, true)

    if (dialogTransformOriginTimer) {
      window.clearTimeout(dialogTransformOriginTimer)
    }

    clearDialogPointerPosition()
  })

  return {
    dialogConfig
  }
}
