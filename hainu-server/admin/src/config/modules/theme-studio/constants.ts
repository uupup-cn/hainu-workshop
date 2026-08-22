/** 默认整体风格预设 ID */
export const DEFAULT_STYLE_PRESET_ID = 'nova'

/** 手写基础色板 ID，供风格预设配置时获得自动补全。 */
export const basePalette = {
  neutral: 'neutral',
  stone: 'stone',
  zinc: 'zinc',
  mauve: 'mauve',
  olive: 'olive',
  mist: 'mist',
  taupe: 'taupe',
  raycast: 'raycast',
  linear: 'linear',
  profound: 'profound',
  searchable: 'searchable',
  unkey: 'unkey',
  duffel: 'duffel'
} as const

/** 手写图表色板 ID，供风格预设配置时获得自动补全。 */
export const chartPalette = {
  purple: 'purple',
  cobalt: 'cobalt',
  sky: 'sky',
  blush: 'blush',
  grove: 'grove',
  ember: 'ember',
  mono: 'mono',
  solar: 'solar',
  raycast: 'raycast',
  linear: 'linear',
  profound: 'profound',
  searchable: 'searchable',
  unkey: 'unkey',
  duffel: 'duffel'
} as const

/** 默认基础背景色板 ID */
export const DEFAULT_BASE_PALETTE_ID = basePalette.neutral
/** 默认图表色板 ID */
export const DEFAULT_CHART_PALETTE_ID = chartPalette.cobalt
