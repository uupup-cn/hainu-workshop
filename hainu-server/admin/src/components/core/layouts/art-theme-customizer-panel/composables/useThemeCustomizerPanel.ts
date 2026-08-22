import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { SystemThemeEnum } from '@/enums/appEnum'
import { SETTING_DEFAULT_CONFIG } from '@/config/setting'
import {
  THEME_ACCENT_PALETTES,
  THEME_CHART_PALETTES,
  THEME_RADIUS_OPTIONS,
  THEME_STYLE_PRESETS,
  type ThemeBasePalette,
  type ThemeCustomizerState,
  type ThemeStylePreset
} from '@/config/modules/theme-studio'
import { useSettingStore } from '@/store/modules/setting'
import { useTheme } from '@/hooks/core/useTheme'
import { consumeMittEvent, mittBus } from '@/utils/sys'
import {
  createThemeCustomizerStateFromBasePalette,
  createThemeCustomizerStateFromChartPalette,
  getThemeBasePaletteById,
  getThemeChartPaletteById,
  getThemeStylePresetById,
  isValidThemeColor,
  normalizeThemeColor
} from '@/utils/ui'
import {
  BRAND_THEME_COLOR_ITEMS,
  PREVIEW_BARS,
  SYSTEM_THEME_OPTIONS,
  STATUS_THEME_COLOR_ITEMS,
  THEME_BOX_STYLE_OPTIONS,
  THEME_CONFIG_ITEMS,
  type AdvancedThemeColorItem
} from '../constants'
import { generateThemeConfigCode, getReadableContentColor, syncDropdownWidth } from '../utils'

export function useThemeCustomizerPanel() {
  const visible = ref(false)
  const styleTriggerRef = ref<HTMLButtonElement | null>(null)
  const basePaletteTriggerRef = ref<HTMLButtonElement | null>(null)
  const accentPaletteTriggerRef = ref<HTMLButtonElement | null>(null)
  const radiusTriggerRef = ref<HTMLButtonElement | null>(null)
  const chartPaletteTriggerRef = ref<HTMLButtonElement | null>(null)

  const settingStore = useSettingStore()
  const { switchThemeStyles } = useTheme()
  const { copy } = useClipboard()
  const {
    themeCustomizer,
    systemThemeColor,
    customRadius,
    themeCustomizerPreviewCollapsed,
    boxBorderMode,
    systemThemeMode,
    systemThemeType
  } = storeToRefs(settingStore)
  const isCompactMode = computed(() => themeCustomizerPreviewCollapsed.value)
  const colorPickerSnapshots = new Map<string, ThemeCustomizerState>()

  let previousBodyOverflow: string | null = null

  const lockBodyScroll = () => {
    if (typeof document === 'undefined' || previousBodyOverflow !== null) return

    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined' || previousBodyOverflow === null) return

    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = null
  }

  const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && visible.value) {
      close()
    }
  }

  const themePredefineColors = computed(() =>
    Array.from(
      new Set(
        [
          ...THEME_ACCENT_PALETTES.map((item) => item.color),
          ...THEME_CHART_PALETTES.flatMap((item) => item.colors),
          ...THEME_STYLE_PRESETS.flatMap(
            (preset) =>
              [
                preset.primary,
                preset.semanticTokens?.themeSecondary,
                preset.semanticTokens?.themeAccent,
                preset.semanticTokens?.themeInfo,
                preset.semanticTokens?.themeSuccess,
                preset.semanticTokens?.themeWarning,
                preset.semanticTokens?.themeError
              ].filter(Boolean) as string[]
          ),
          themeCustomizer.value.themeSecondary,
          themeCustomizer.value.themeAccent,
          themeCustomizer.value.themeInfo,
          themeCustomizer.value.themeSuccess,
          themeCustomizer.value.themeWarning,
          themeCustomizer.value.themeError
        ].map(normalizeThemeColor)
      )
    )
  )

  const advancedThemeColorItems = computed(() => [
    {
      title: '品牌辅助色',
      items: BRAND_THEME_COLOR_ITEMS
    },
    {
      title: '状态语义色',
      items: STATUS_THEME_COLOR_ITEMS
    }
  ])

  const boxStyleOptions = computed(() =>
    THEME_BOX_STYLE_OPTIONS.map((option) => ({
      ...option,
      active: boxBorderMode.value === option.value
    }))
  )

  const tonePreviewItems = computed(() => [
    {
      label: 'Secondary',
      color: themeCustomizer.value.themeSecondary,
      contentColor: themeCustomizer.value.themeSecondaryContent
    },
    {
      label: 'Accent',
      color: themeCustomizer.value.themeAccent,
      contentColor: themeCustomizer.value.themeAccentContent
    },
    {
      label: 'Success',
      color: themeCustomizer.value.themeSuccess,
      contentColor: themeCustomizer.value.themeSuccessContent
    }
  ])

  const statusPreviewItems = computed(() => [
    {
      label: 'Info',
      color: themeCustomizer.value.themeInfo,
      contentColor: themeCustomizer.value.themeInfoContent
    },
    {
      label: 'Warning',
      color: themeCustomizer.value.themeWarning,
      contentColor: themeCustomizer.value.themeWarningContent
    },
    {
      label: 'Danger',
      color: themeCustomizer.value.themeError,
      contentColor: themeCustomizer.value.themeErrorContent
    }
  ])

  const activeStylePreset = computed(() =>
    getThemeStylePresetById(themeCustomizer.value.stylePresetId)
  )
  const activeBasePalette = computed(() =>
    getThemeBasePaletteById(themeCustomizer.value.basePaletteId)
  )
  const activeChartPalette = computed(() =>
    getThemeChartPaletteById(themeCustomizer.value.chartPaletteId)
  )
  const activeAccentPalette = computed(() => {
    const currentColor = systemThemeColor.value.toLowerCase()
    return THEME_ACCENT_PALETTES.find((palette) => palette.color.toLowerCase() === currentColor)
  })
  const activeRadiusOption = computed(() =>
    THEME_RADIUS_OPTIONS.find((option) => option.value === customRadius.value)
  )
  const isDarkTheme = computed(() => systemThemeType.value === SystemThemeEnum.DARK)

  const getBasePalettePreviewStyle = (palette: ThemeBasePalette) => {
    const previewMode = palette.preferredThemeMode ?? systemThemeType.value
    const isDarkPreview = previewMode === SystemThemeEnum.DARK
    const surfaceBg = isDarkPreview ? palette.themeSurfaceBgDark : palette.themeSurfaceBgLight
    const surfaceBox = isDarkPreview ? palette.themeSurfaceBoxDark : palette.themeSurfaceBoxLight
    const borderColor = isDarkPreview ? palette.themeBorderDark : palette.themeBorderLight

    return {
      background: `linear-gradient(135deg, ${surfaceBg} 0%, ${surfaceBg} 45%, ${surfaceBox} 45%, ${surfaceBox} 100%)`,
      borderColor
    }
  }

  const getStylePresetSwatches = (preset: ThemeStylePreset) => {
    const chartColors = getThemeChartPaletteById(preset.chartPaletteId)?.colors ?? []
    const semanticColors = [
      preset.semanticTokens?.themeSecondary,
      preset.semanticTokens?.themeSuccess,
      preset.semanticTokens?.themeWarning
    ].filter(Boolean) as string[]

    return Array.from(new Set([preset.primary, ...semanticColors, ...chartColors])).slice(0, 4)
  }

  const isMobileViewport = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

  const open = () => {
    if (isMobileViewport() && !themeCustomizerPreviewCollapsed.value) {
      settingStore.setThemeCustomizerPreviewCollapsed(true)
    }

    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const toggleCompactMode = () => {
    settingStore.setThemeCustomizerPreviewCollapsed(!themeCustomizerPreviewCollapsed.value)
  }

  const markStylePresetAsCustom = (state: ThemeCustomizerState = themeCustomizer.value) =>
    state.stylePresetId === 'custom'
      ? state
      : {
          ...state,
          stylePresetId: 'custom'
        }

  const cloneThemeCustomizerState = (
    state: ThemeCustomizerState = themeCustomizer.value
  ): ThemeCustomizerState => ({
    ...state,
    chartThemeColors: [...state.chartThemeColors]
  })

  const getAdvancedThemePickerKey = (item: AdvancedThemeColorItem) => `advanced:${item.key}`
  const getChartPickerKey = (index: number) => `chart:${index}`

  const rememberColorPickerSnapshot = (key: string) => {
    if (!colorPickerSnapshots.has(key)) {
      colorPickerSnapshots.set(key, cloneThemeCustomizerState())
    }
  }

  const restoreColorPickerSnapshot = (key: string) => {
    const snapshot = colorPickerSnapshots.get(key)
    if (!snapshot) return

    settingStore.setThemeCustomizer(snapshot)
    colorPickerSnapshots.delete(key)
  }

  const clearColorPickerSnapshot = (key: string) => {
    colorPickerSnapshots.delete(key)
  }

  const setBoxMode = (nextBoxBorderMode: boolean) => {
    settingStore.setBoxBorderMode(nextBoxBorderMode)
  }

  const selectStylePreset = (command: string | number | object) => {
    const preset = getThemeStylePresetById(String(command))
    if (!preset) return

    const basePalette = getThemeBasePaletteById(preset.basePaletteId)
    const chartPalette = getThemeChartPaletteById(preset.chartPaletteId)
    if (!basePalette || !chartPalette) return

    let nextState: ThemeCustomizerState = createThemeCustomizerStateFromBasePalette(
      themeCustomizer.value,
      basePalette,
      {
        resetSemanticTokens: true,
        primaryFallback: preset.primary
      }
    )
    nextState = createThemeCustomizerStateFromChartPalette(nextState, chartPalette)
    nextState.stylePresetId = preset.id

    settingStore.setElementTheme(preset.primary)
    settingStore.setCustomRadius(preset.radius)
    settingStore.setThemeCustomizer(nextState)
    setBoxMode(preset.boxBorderMode)

    if (preset.preferredThemeMode) {
      switchThemeStyles(preset.preferredThemeMode as SystemThemeEnum)
    }
  }

  const selectBasePalette = (command: string | number | object) => {
    const palette = getThemeBasePaletteById(String(command))
    if (!palette) return

    settingStore.setThemeCustomizer(
      markStylePresetAsCustom(
        createThemeCustomizerStateFromBasePalette(themeCustomizer.value, palette)
      )
    )

    if (palette.preferredThemeMode) {
      switchThemeStyles(palette.preferredThemeMode as SystemThemeEnum)
    }
  }

  const selectAccentPalette = (command: string | number | object) => {
    const color = String(command)
    if (!isValidThemeColor(color)) return

    settingStore.setElementTheme(color)
    const contentColor = getReadableContentColor(color)
    settingStore.setThemeCustomizer({
      ...themeCustomizer.value,
      stylePresetId: 'custom',
      themePrimary: color,
      themePrimaryLight: color,
      themePrimaryDark: color,
      themePrimaryContent: contentColor,
      themePrimaryContentLight: contentColor,
      themePrimaryContentDark: contentColor
    })
  }

  const selectRadius = (command: string | number | object) => {
    settingStore.setCustomRadius(String(command))
    settingStore.setThemeCustomizer(markStylePresetAsCustom())
  }

  const selectChartPalette = (command: string | number | object) => {
    const palette = getThemeChartPaletteById(String(command))
    if (!palette) return

    settingStore.setThemeCustomizer(
      markStylePresetAsCustom(
        createThemeCustomizerStateFromChartPalette(themeCustomizer.value, palette)
      )
    )
  }

  const selectBoxStyle = (nextBoxBorderMode: boolean) => {
    setBoxMode(nextBoxBorderMode)
  }

  const updateAdvancedThemeColor = (item: AdvancedThemeColorItem, value: string | null) => {
    if (!value || !isValidThemeColor(value)) return

    const normalizedColor = normalizeThemeColor(value)

    const nextThemeCustomizer: ThemeCustomizerState = {
      ...themeCustomizer.value,
      stylePresetId: 'custom',
      [item.key]: normalizedColor,
      [item.contentKey]: getReadableContentColor(normalizedColor)
    }

    settingStore.setThemeCustomizer(nextThemeCustomizer)
  }

  const updateChartColor = (index: number, value: string | null) => {
    if (!value || !isValidThemeColor(value)) return

    const nextColors = [...themeCustomizer.value.chartThemeColors]
    nextColors[index] = normalizeThemeColor(value)

    settingStore.setThemeCustomizer(
      markStylePresetAsCustom({
        ...themeCustomizer.value,
        chartPaletteId: 'custom',
        chartThemeColors: nextColors
      })
    )
  }

  const previewAdvancedThemeColor = (item: AdvancedThemeColorItem, value: string | null) => {
    const key = getAdvancedThemePickerKey(item)
    rememberColorPickerSnapshot(key)
    updateAdvancedThemeColor(item, value)
  }

  const commitAdvancedThemeColor = (item: AdvancedThemeColorItem, value: string | null) => {
    const key = getAdvancedThemePickerKey(item)
    rememberColorPickerSnapshot(key)
    updateAdvancedThemeColor(item, value)
    clearColorPickerSnapshot(key)
  }

  const handleAdvancedThemeColorVisibleChange = (
    item: AdvancedThemeColorItem,
    isVisible: boolean
  ) => {
    const key = getAdvancedThemePickerKey(item)

    if (isVisible) {
      rememberColorPickerSnapshot(key)
      return
    }

    restoreColorPickerSnapshot(key)
  }

  const previewChartColor = (index: number, value: string | null) => {
    const key = getChartPickerKey(index)
    rememberColorPickerSnapshot(key)
    updateChartColor(index, value)
  }

  const commitChartColor = (index: number, value: string | null) => {
    const key = getChartPickerKey(index)
    rememberColorPickerSnapshot(key)
    updateChartColor(index, value)
    clearColorPickerSnapshot(key)
  }

  const handleChartColorVisibleChange = (index: number, isVisible: boolean) => {
    const key = getChartPickerKey(index)

    if (isVisible) {
      rememberColorPickerSnapshot(key)
      return
    }

    restoreColorPickerSnapshot(key)
  }

  const resetTheme = () => {
    switchThemeStyles(SETTING_DEFAULT_CONFIG.systemThemeMode)
    settingStore.setElementTheme(SETTING_DEFAULT_CONFIG.systemThemeColor)
    settingStore.setCustomRadius(SETTING_DEFAULT_CONFIG.customRadius)
    settingStore.setThemeCustomizer(SETTING_DEFAULT_CONFIG.themeCustomizer)
    setBoxMode(SETTING_DEFAULT_CONFIG.boxBorderMode)
  }

  const randomizeTheme = () => {
    const currentId = themeCustomizer.value.stylePresetId
    const candidates = THEME_STYLE_PRESETS.filter((preset) => preset.id !== currentId)
    const nextPreset =
      candidates[Math.floor(Math.random() * candidates.length)] ?? THEME_STYLE_PRESETS[0]

    selectStylePreset(nextPreset.id)
  }

  const copyThemeConfig = async () => {
    try {
      await copy(
        generateThemeConfigCode(
          {
            systemThemeType: settingStore.systemThemeType,
            systemThemeMode: settingStore.systemThemeMode,
            systemThemeColor: settingStore.systemThemeColor,
            boxBorderMode: settingStore.boxBorderMode,
            customRadius: settingStore.customRadius,
            themeCustomizerPreviewCollapsed: settingStore.themeCustomizerPreviewCollapsed,
            themeCustomizer: settingStore.themeCustomizer
          },
          THEME_CONFIG_ITEMS
        )
      )
      ElMessage.success('当前主题配置已复制，可继续在代码中微调')
    } catch (error) {
      console.error('复制主题配置失败:', error)
      ElMessage.error('复制失败，请稍后重试')
    }
  }

  const switchSystemTheme = (theme: SystemThemeEnum) => {
    switchThemeStyles(theme)
  }

  watch(visible, (isVisible) => {
    if (isVisible) {
      lockBodyScroll()
      return
    }

    unlockBodyScroll()
  })

  onMounted(() => {
    mittBus.on('openThemeCustomizer', open)
    window.addEventListener('keydown', handleDocumentKeydown)

    const pendingOpen = consumeMittEvent('openThemeCustomizer')
    if (pendingOpen.found) {
      nextTick(() => {
        open()
      })
    }
  })

  onUnmounted(() => {
    mittBus.off('openThemeCustomizer', open)
    window.removeEventListener('keydown', handleDocumentKeydown)
    unlockBodyScroll()
  })

  return {
    visible,
    isCompactMode,
    styleTriggerRef,
    basePaletteTriggerRef,
    accentPaletteTriggerRef,
    radiusTriggerRef,
    chartPaletteTriggerRef,
    themePredefineColors,
    advancedThemeColorItems,
    boxStyleOptions,
    tonePreviewItems,
    statusPreviewItems,
    themeCustomizer,
    systemThemeColor,
    customRadius,
    boxBorderMode,
    systemThemeMode,
    systemThemeType,
    activeStylePreset,
    activeBasePalette,
    activeChartPalette,
    activeAccentPalette,
    activeRadiusOption,
    isDarkTheme,
    systemThemeOptions: SYSTEM_THEME_OPTIONS,
    previewBars: PREVIEW_BARS,
    getBasePalettePreviewStyle,
    getStylePresetSwatches,
    toggleCompactMode,
    switchSystemTheme,
    selectStylePreset,
    selectBasePalette,
    selectAccentPalette,
    selectRadius,
    selectChartPalette,
    selectBoxStyle,
    previewAdvancedThemeColor,
    commitAdvancedThemeColor,
    handleAdvancedThemeColorVisibleChange,
    previewChartColor,
    commitChartColor,
    handleChartColorVisibleChange,
    updateAdvancedThemeColor,
    updateChartColor,
    resetTheme,
    randomizeTheme,
    copyThemeConfig,
    close,
    syncDropdownWidth
  }
}
