import {
  DEFAULT_CHART_THEME_COLORS,
  DEFAULT_THEME_SEMANTIC_TOKENS,
  DEFAULT_THEME_CUSTOMIZER_STATE,
  THEME_BASE_PALETTES,
  THEME_CHART_PALETTES,
  THEME_STYLE_PRESETS,
  type ThemeBasePalette,
  type ThemeChartPalette,
  type ThemeCustomizerState,
  type ThemeMenuTokens,
  type ThemeSemanticTokens,
  type ThemeStylePreset
} from '@/config/modules/theme-studio'
import { readRootCssVar, THEME_CUSTOMIZER_CSS_VAR_MAP, writeRootCssVars } from './root-css-vars'

interface CreateThemeCustomizerStateOptions {
  /** 是否重置语义色变量，true 时使用 DEFAULT_THEME_SEMANTIC_TOKENS 作为兜底 */
  resetSemanticTokens?: boolean
  /** 主色兜底值，常用于切换基础色板时保留当前主色 */
  primaryFallback?: string
}

/**
 * 归一化十六进制颜色值。
 * @param value 颜色值
 * @returns 小写后的颜色值
 */
export const normalizeThemeColor = (value: string) => value.trim().toLowerCase()

/**
 * 归一化图表颜色序列。
 * @param colors 图表颜色序列
 * @returns 小写后的图表颜色序列
 */
export const normalizeThemeChartColors = (colors: string[]) => colors.map(normalizeThemeColor)

/**
 * 根据 ID 查找整体风格预设。
 * @param presetId 风格预设 ID
 * @returns 匹配的风格预设，未找到时返回 undefined
 */
export const getThemeStylePresetById = (presetId: string): ThemeStylePreset | undefined =>
  THEME_STYLE_PRESETS.find((preset) => preset.id === presetId)

/**
 * 根据 ID 查找基础背景色板。
 * @param paletteId 基础色板 ID
 * @returns 匹配的基础色板，未找到时返回 undefined
 */
export const getThemeBasePaletteById = (paletteId: string): ThemeBasePalette | undefined =>
  THEME_BASE_PALETTES.find((palette) => palette.id === paletteId)

/**
 * 根据 ID 查找图表色板。
 * @param paletteId 图表色板 ID
 * @returns 匹配的图表色板，未找到时返回 undefined
 */
export const getThemeChartPaletteById = (paletteId: string): ThemeChartPalette | undefined =>
  THEME_CHART_PALETTES.find((palette) => palette.id === paletteId)

/**
 * 获取风格预设附带的语义色覆盖。
 * @param preset 风格预设
 * @returns 需要写入主题状态的语义色
 */
const getThemeStylePresetSemanticTokens = (
  preset: ThemeStylePreset | undefined
): Partial<ThemeSemanticTokens & ThemeMenuTokens> =>
  preset
    ? {
        themePrimary: preset.primary,
        themePrimaryLight: preset.semanticTokens?.themePrimaryLight ?? preset.primary,
        themePrimaryDark: preset.semanticTokens?.themePrimaryDark ?? preset.primary,
        themePrimaryContentLight:
          preset.semanticTokens?.themePrimaryContentLight ??
          preset.semanticTokens?.themePrimaryContent ??
          DEFAULT_THEME_SEMANTIC_TOKENS.themePrimaryContentLight,
        themePrimaryContentDark:
          preset.semanticTokens?.themePrimaryContentDark ??
          preset.semanticTokens?.themePrimaryContent ??
          DEFAULT_THEME_SEMANTIC_TOKENS.themePrimaryContentDark,
        ...preset.semanticTokens
      }
    : {}

/**
 * 归一化主题定制器状态。
 *
 * 会过滤 undefined、修正无效预设 ID，并使用默认状态补齐缺失字段。
 * @param state 待归一化的主题定制状态
 * @returns 完整可用的主题定制状态
 */
export const normalizeThemeCustomizerState = (
  state?: Partial<ThemeCustomizerState>
): ThemeCustomizerState => {
  const definedState = Object.fromEntries(
    Object.entries(state ?? {}).filter(([, value]) => value !== undefined)
  ) as Partial<ThemeCustomizerState>

  const isCustomStylePreset = definedState.stylePresetId === 'custom'
  const requestedStylePreset = definedState.stylePresetId
    ? getThemeStylePresetById(definedState.stylePresetId)
    : undefined
  const requestedBasePalette = definedState.basePaletteId
    ? getThemeBasePaletteById(definedState.basePaletteId)
    : undefined
  const isCustomChartPalette =
    definedState.chartPaletteId === 'custom' &&
    definedState.chartThemeColors?.length === DEFAULT_CHART_THEME_COLORS.length
  const requestedChartPalette = definedState.chartPaletteId
    ? getThemeChartPaletteById(definedState.chartPaletteId)
    : undefined
  const basePalette =
    requestedBasePalette ?? getThemeBasePaletteById(DEFAULT_THEME_CUSTOMIZER_STATE.basePaletteId)
  const chartPalette =
    requestedChartPalette ?? getThemeChartPaletteById(DEFAULT_THEME_CUSTOMIZER_STATE.chartPaletteId)
  const shouldKeepThemeTokens = !definedState.basePaletteId || Boolean(requestedBasePalette)
  const preservedState = shouldKeepThemeTokens ? definedState : {}
  const basePaletteTokens = basePalette
    ? {
        themeSurfaceBgLight: basePalette.themeSurfaceBgLight,
        themeSurfaceBgDark: basePalette.themeSurfaceBgDark,
        themeSurfaceBoxLight: basePalette.themeSurfaceBoxLight,
        themeSurfaceBoxDark: basePalette.themeSurfaceBoxDark,
        themeBorderLight: basePalette.themeBorderLight,
        themeBorderDark: basePalette.themeBorderDark,
        themeBorderDashedLight: basePalette.themeBorderDashedLight,
        themeBorderDashedDark: basePalette.themeBorderDashedDark,
        ...(basePalette.themePrimary
          ? {
              themeBaseContent: basePalette.themeBaseContent,
              themeBaseContentLight: basePalette.themeBaseContentLight,
              themeBaseContentDark: basePalette.themeBaseContentDark,
              themePrimary: basePalette.themePrimary,
              themePrimaryLight: basePalette.themePrimaryLight ?? basePalette.themePrimary,
              themePrimaryDark: basePalette.themePrimaryDark ?? basePalette.themePrimary,
              themePrimaryContent: basePalette.themePrimaryContent,
              themePrimaryContentLight:
                basePalette.themePrimaryContentLight ?? basePalette.themePrimaryContent,
              themePrimaryContentDark:
                basePalette.themePrimaryContentDark ?? basePalette.themePrimaryContent,
              themeSecondary: basePalette.themeSecondary,
              themeSecondaryContent: basePalette.themeSecondaryContent,
              themeAccent: basePalette.themeAccent,
              themeAccentContent: basePalette.themeAccentContent,
              themeNeutral: basePalette.themeNeutral,
              themeNeutralContent: basePalette.themeNeutralContent,
              themeInfo: basePalette.themeInfo,
              themeInfoContent: basePalette.themeInfoContent,
              themeSuccess: basePalette.themeSuccess,
              themeSuccessContent: basePalette.themeSuccessContent,
              themeWarning: basePalette.themeWarning,
              themeWarningContent: basePalette.themeWarningContent,
              themeError: basePalette.themeError,
              themeErrorContent: basePalette.themeErrorContent
            }
          : {})
      }
    : {}
  const stylePresetTokens = getThemeStylePresetSemanticTokens(requestedStylePreset)
  const stylePresetId = isCustomStylePreset
    ? 'custom'
    : (requestedStylePreset?.id ?? DEFAULT_THEME_CUSTOMIZER_STATE.stylePresetId)
  const basePaletteId = basePalette?.id ?? DEFAULT_THEME_CUSTOMIZER_STATE.basePaletteId
  const chartPaletteId = isCustomChartPalette
    ? 'custom'
    : (chartPalette?.id ?? DEFAULT_THEME_CUSTOMIZER_STATE.chartPaletteId)
  const chartThemeColors =
    (isCustomChartPalette || requestedChartPalette) &&
    definedState.chartThemeColors?.length === DEFAULT_CHART_THEME_COLORS.length
      ? normalizeThemeChartColors(definedState.chartThemeColors)
      : normalizeThemeChartColors(
          chartPalette?.colors ?? DEFAULT_THEME_CUSTOMIZER_STATE.chartThemeColors
        )

  return {
    ...DEFAULT_THEME_CUSTOMIZER_STATE,
    ...basePaletteTokens,
    ...preservedState,
    ...stylePresetTokens,
    stylePresetId,
    basePaletteId,
    chartPaletteId,
    chartThemeColors
  }
}

/**
 * 将主题定制器状态应用到根节点 CSS 变量。
 * @param state 待应用的主题定制状态
 */
export const applyThemeCustomizerState = (state?: Partial<ThemeCustomizerState>) => {
  if (typeof document === 'undefined') return

  const normalizedState = normalizeThemeCustomizerState(state)
  const rootStyle = document.documentElement.style

  // Let :root / .dark decide the active content color based on the current theme mode.
  rootStyle.removeProperty('--theme-base-content')
  rootStyle.removeProperty('--theme-primary')
  rootStyle.removeProperty('--theme-color')
  rootStyle.removeProperty('--art-primary')
  rootStyle.removeProperty('--theme-primary-content')

  Object.entries(THEME_CUSTOMIZER_CSS_VAR_MAP).forEach(([stateKey, cssVars]) => {
    writeRootCssVars(cssVars, String(normalizedState[stateKey as keyof ThemeCustomizerState]))
  })

  normalizedState.chartThemeColors.forEach((color, index) => {
    rootStyle.setProperty(`--chart-color-${index + 1}`, color)
  })
}

/**
 * 获取当前生效的图表颜色序列。
 * @returns 从 CSS 变量读取的图表色板，变量不存在时使用默认色板
 */
export const getThemeChartPalette = () =>
  DEFAULT_CHART_THEME_COLORS.map((fallback, index) =>
    readRootCssVar(`--chart-color-${index + 1}`, fallback)
  )

/**
 * 根据基础背景色板创建新的主题定制器状态。
 *
 * 基础色板只负责表面色时，会保留当前语义色或使用传入兜底值。
 * @param current 当前主题定制器状态
 * @param palette 目标基础背景色板
 * @param options 创建选项
 * @returns 切换基础色板后的主题定制器状态
 */
export const createThemeCustomizerStateFromBasePalette = (
  current: ThemeCustomizerState,
  palette: ThemeBasePalette,
  options: CreateThemeCustomizerStateOptions = {}
): ThemeCustomizerState => {
  const semanticFallback: ThemeSemanticTokens & ThemeMenuTokens = options.resetSemanticTokens
    ? DEFAULT_THEME_SEMANTIC_TOKENS
    : normalizeThemeCustomizerState(current)

  return {
    ...current,
    basePaletteId: palette.id,
    themeSurfaceBgLight: palette.themeSurfaceBgLight,
    themeSurfaceBgDark: palette.themeSurfaceBgDark,
    themeSurfaceBoxLight: palette.themeSurfaceBoxLight,
    themeSurfaceBoxDark: palette.themeSurfaceBoxDark,
    themeBorderLight: palette.themeBorderLight,
    themeBorderDark: palette.themeBorderDark,
    themeBorderDashedLight: palette.themeBorderDashedLight,
    themeBorderDashedDark: palette.themeBorderDashedDark,
    themeBaseContent: palette.themeBaseContent ?? semanticFallback.themeBaseContent,
    themeBaseContentLight:
      palette.themeBaseContentLight ??
      palette.themeBaseContent ??
      semanticFallback.themeBaseContentLight,
    themeBaseContentDark:
      palette.themeBaseContentDark ??
      palette.themeBaseContent ??
      semanticFallback.themeBaseContentDark,
    themePrimary: palette.themePrimary ?? options.primaryFallback ?? semanticFallback.themePrimary,
    themePrimaryLight:
      palette.themePrimaryLight ??
      palette.themePrimary ??
      options.primaryFallback ??
      semanticFallback.themePrimaryLight,
    themePrimaryDark:
      palette.themePrimaryDark ??
      palette.themePrimary ??
      options.primaryFallback ??
      semanticFallback.themePrimaryDark,
    themePrimaryContent: palette.themePrimaryContent ?? semanticFallback.themePrimaryContent,
    themePrimaryContentLight:
      palette.themePrimaryContentLight ??
      palette.themePrimaryContent ??
      semanticFallback.themePrimaryContentLight,
    themePrimaryContentDark:
      palette.themePrimaryContentDark ??
      palette.themePrimaryContent ??
      semanticFallback.themePrimaryContentDark,
    themeSecondary: palette.themeSecondary ?? semanticFallback.themeSecondary,
    themeSecondaryContent: palette.themeSecondaryContent ?? semanticFallback.themeSecondaryContent,
    themeAccent: palette.themeAccent ?? semanticFallback.themeAccent,
    themeAccentContent: palette.themeAccentContent ?? semanticFallback.themeAccentContent,
    themeNeutral: palette.themeNeutral ?? semanticFallback.themeNeutral,
    themeNeutralContent: palette.themeNeutralContent ?? semanticFallback.themeNeutralContent,
    themeInfo: palette.themeInfo ?? semanticFallback.themeInfo,
    themeInfoContent: palette.themeInfoContent ?? semanticFallback.themeInfoContent,
    themeSuccess: palette.themeSuccess ?? semanticFallback.themeSuccess,
    themeSuccessContent: palette.themeSuccessContent ?? semanticFallback.themeSuccessContent,
    themeWarning: palette.themeWarning ?? semanticFallback.themeWarning,
    themeWarningContent: palette.themeWarningContent ?? semanticFallback.themeWarningContent,
    themeError: palette.themeError ?? semanticFallback.themeError,
    themeErrorContent: palette.themeErrorContent ?? semanticFallback.themeErrorContent
  }
}

/**
 * 根据图表色板创建新的主题定制器状态。
 * @param current 当前主题定制器状态
 * @param palette 目标图表色板
 * @returns 切换图表色板后的主题定制器状态
 */
export const createThemeCustomizerStateFromChartPalette = (
  current: ThemeCustomizerState,
  palette: ThemeChartPalette
): ThemeCustomizerState => ({
  ...current,
  chartPaletteId: palette.id,
  chartThemeColors: normalizeThemeChartColors(palette.colors)
})

/**
 * 校验主题颜色是否为合法十六进制颜色。
 * @param value 待校验的颜色值
 * @returns 是否为 #RGB 或 #RRGGBB 格式
 */
export const isValidThemeColor = (value: string) =>
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())
