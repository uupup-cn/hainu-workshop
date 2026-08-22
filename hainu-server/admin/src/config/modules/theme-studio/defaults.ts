import {
  DEFAULT_BASE_PALETTE_ID,
  DEFAULT_CHART_PALETTE_ID,
  DEFAULT_STYLE_PRESET_ID
} from './constants'
import {
  DEFAULT_THEME_SEMANTIC_TOKENS,
  THEME_BASE_PALETTES,
  THEME_CHART_PALETTES
} from './palettes'
import type { ThemeCustomizerState } from './types'

/** 默认图表颜色序列，来自默认图表色板 */
export const DEFAULT_CHART_THEME_COLORS =
  THEME_CHART_PALETTES.find((palette) => palette.id === DEFAULT_CHART_PALETTE_ID)?.colors ??
  THEME_CHART_PALETTES[0].colors

/** 默认基础背景色板，作为默认主题定制状态的表面色来源 */
const defaultBasePalette =
  THEME_BASE_PALETTES.find((palette) => palette.id === DEFAULT_BASE_PALETTE_ID) ??
  THEME_BASE_PALETTES[0]

/** 默认主题定制器状态。 */
export const DEFAULT_THEME_CUSTOMIZER_STATE: ThemeCustomizerState = {
  stylePresetId: DEFAULT_STYLE_PRESET_ID,
  basePaletteId: DEFAULT_BASE_PALETTE_ID,
  chartPaletteId: DEFAULT_CHART_PALETTE_ID,
  themeSurfaceBgLight: defaultBasePalette.themeSurfaceBgLight,
  themeSurfaceBgDark: defaultBasePalette.themeSurfaceBgDark,
  themeSurfaceBoxLight: defaultBasePalette.themeSurfaceBoxLight,
  themeSurfaceBoxDark: defaultBasePalette.themeSurfaceBoxDark,
  themeBorderLight: defaultBasePalette.themeBorderLight,
  themeBorderDark: defaultBasePalette.themeBorderDark,
  themeBorderDashedLight: defaultBasePalette.themeBorderDashedLight,
  themeBorderDashedDark: defaultBasePalette.themeBorderDashedDark,
  ...DEFAULT_THEME_SEMANTIC_TOKENS,
  chartThemeColors: [...DEFAULT_CHART_THEME_COLORS]
}
