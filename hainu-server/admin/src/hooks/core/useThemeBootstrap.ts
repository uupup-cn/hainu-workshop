import { watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import AppConfig from '@/config'
import { SystemThemeEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'
import type { SystemThemeTypes } from '@/types/store'
import type { ThemeCustomizerState } from '@/config/modules/theme-studio/types'
import { setElementThemeColor } from '@/utils/ui/colors'

const themeClassNames = Array.from(
  new Set(
    Object.values(AppConfig.systemThemeStyles)
      .flatMap((themeConfig) => themeConfig.className.split(/\s+/))
      .filter(Boolean)
  )
)

const applyHtmlThemeClass = (el: HTMLElement, className: string) => {
  themeClassNames.forEach((name) => el.classList.remove(name))

  className
    .split(/\s+/)
    .filter(Boolean)
    .forEach((name) => el.classList.add(name))
}

let themeCustomizerLoader: Promise<typeof import('@/utils/ui/theme-studio')> | null = null
let themeCustomizerFrameId: number | null = null

const loadThemeCustomizerUtils = () => {
  if (!themeCustomizerLoader) {
    themeCustomizerLoader = import('@/utils/ui/theme-studio')
  }

  return themeCustomizerLoader
}

const applyChartThemeColors = (state: ThemeCustomizerState) => {
  state.chartThemeColors.forEach((color, index) => {
    document.documentElement.style.setProperty(`--chart-color-${index + 1}`, color)
  })
}

const scheduleApplyThemeCustomizerState = (state: ThemeCustomizerState) => {
  if (typeof window === 'undefined') {
    return
  }

  if (themeCustomizerFrameId !== null) {
    cancelAnimationFrame(themeCustomizerFrameId)
  }

  themeCustomizerFrameId = requestAnimationFrame(() => {
    themeCustomizerFrameId = null

    void loadThemeCustomizerUtils().then(({ applyThemeCustomizerState }) => {
      applyThemeCustomizerState(state)
    })
  })
}

export function initializeThemeBootstrap() {
  const settingStore = useSettingStore()
  const prefersDark = usePreferredDark()

  const applyThemeByMode = () => {
    const el = document.documentElement
    let actualTheme = settingStore.systemThemeType

    if (settingStore.systemThemeMode === SystemThemeEnum.AUTO) {
      actualTheme = prefersDark.value ? SystemThemeEnum.DARK : SystemThemeEnum.LIGHT
      settingStore.systemThemeType = actualTheme
    }

    const currentTheme = AppConfig.systemThemeStyles[actualTheme as keyof SystemThemeTypes]
    if (currentTheme) {
      applyHtmlThemeClass(el, currentTheme.className)
    }

    setElementThemeColor(settingStore.systemThemeColor)
    el.style.setProperty('--custom-radius', `${settingStore.customRadius}rem`)
    el.setAttribute('data-box-mode', settingStore.boxBorderMode ? 'border-mode' : 'shadow-mode')
    settingStore.applyMenuColorModeForTheme(actualTheme)

    applyChartThemeColors(settingStore.themeCustomizer)
    scheduleApplyThemeCustomizerState(settingStore.themeCustomizer)
  }

  applyThemeByMode()

  if (settingStore.systemThemeMode === SystemThemeEnum.AUTO) {
    watch(
      prefersDark,
      () => {
        if (settingStore.systemThemeMode === SystemThemeEnum.AUTO) {
          applyThemeByMode()
        }
      },
      { immediate: false }
    )
  }
}
