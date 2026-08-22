export interface ThemeSurfaceTokens {
  /** 浅色模式下的页面背景色 */
  themeSurfaceBgLight: string
  /** 暗色模式下的页面背景色 */
  themeSurfaceBgDark: string
  /** 浅色模式下的卡片、弹窗等容器背景色 */
  themeSurfaceBoxLight: string
  /** 暗色模式下的卡片、弹窗等容器背景色 */
  themeSurfaceBoxDark: string
  /** 浅色模式下的实线边框色 */
  themeBorderLight: string
  /** 暗色模式下的实线边框色 */
  themeBorderDark: string
  /** 浅色模式下的虚线边框色 */
  themeBorderDashedLight: string
  /** 暗色模式下的虚线边框色 */
  themeBorderDashedDark: string
}

export interface ThemeSemanticTokens {
  /** 基础文本色，兼容旧变量和默认文本场景 */
  themeBaseContent: string
  /** 浅色模式下的基础文本色 */
  themeBaseContentLight: string
  /** 暗色模式下的基础文本色 */
  themeBaseContentDark: string
  /** 主品牌色 */
  themePrimary: string
  /** 浅色模式下的主品牌色 */
  themePrimaryLight: string
  /** 暗色模式下的主品牌色 */
  themePrimaryDark: string
  /** 主品牌色上的文本或图标颜色 */
  themePrimaryContent: string
  /** 浅色模式下主品牌色上的文本或图标颜色 */
  themePrimaryContentLight: string
  /** 暗色模式下主品牌色上的文本或图标颜色 */
  themePrimaryContentDark: string
  /** 次级品牌色 */
  themeSecondary: string
  /** 次级品牌色上的文本或图标颜色 */
  themeSecondaryContent: string
  /** 强调色，用于辅助高亮和特殊状态 */
  themeAccent: string
  /** 强调色上的文本或图标颜色 */
  themeAccentContent: string
  /** 中性色，用于低强调控件或深色块 */
  themeNeutral: string
  /** 中性色上的文本或图标颜色 */
  themeNeutralContent: string
  /** 信息状态色 */
  themeInfo: string
  /** 信息状态色上的文本或图标颜色 */
  themeInfoContent: string
  /** 成功状态色 */
  themeSuccess: string
  /** 成功状态色上的文本或图标颜色 */
  themeSuccessContent: string
  /** 警告状态色 */
  themeWarning: string
  /** 警告状态色上的文本或图标颜色 */
  themeWarningContent: string
  /** 错误或危险状态色 */
  themeError: string
  /** 错误或危险状态色上的文本或图标颜色 */
  themeErrorContent: string
}

export interface ThemeMenuTokens {
  /** 浅色模式下菜单悬停背景混合比例 */
  themeMenuHoverMixLight: string
  /** 浅色模式下菜单选中背景混合比例 */
  themeMenuActiveBgMixLight: string
}

export interface ThemeCustomizerState
  extends ThemeSurfaceTokens,
    ThemeSemanticTokens,
    ThemeMenuTokens {
  /** 当前使用的整体风格预设 ID，custom 表示用户自定义 */
  stylePresetId: string
  /** 当前使用的基础背景色板 ID */
  basePaletteId: string
  /** 当前使用的图表色板 ID，custom 表示用户自定义 */
  chartPaletteId: string
  /** 当前图表主题色序列，会同步写入 --chart-color-* 变量 */
  chartThemeColors: string[]
}

export interface ThemeBasePalette
  extends ThemeSurfaceTokens,
    Partial<ThemeSemanticTokens>,
    Partial<ThemeMenuTokens> {
  /** 基础色板唯一 ID */
  id: string
  /** 基础色板展示名称 */
  name: string
  /** 基础色板说明，用于设置面板描述 */
  description: string
  /** 色板代表色，用于列表色块展示 */
  swatch: string
  /** 建议搭配的明暗模式，未设置时沿用当前系统主题 */
  preferredThemeMode?: 'light' | 'dark'
}

export interface ThemeAccentPalette {
  /** 强调色板唯一 ID */
  id: string
  /** 强调色板展示名称 */
  name: string
  /** 强调色值，通常用于快速切换主色 */
  color: string
}

export interface ThemeChartPalette {
  /** 图表色板唯一 ID */
  id: string
  /** 图表色板展示名称 */
  name: string
  /** 图表颜色序列，按 ECharts 系列顺序写入 */
  colors: string[]
}

export interface ThemeStylePreset {
  /** 风格预设唯一 ID */
  id: string
  /** 风格预设展示名称 */
  name: string
  /** 风格预设说明，用于设置面板描述 */
  description: string
  /** 风格预设主色 */
  primary: string
  /** 全局圆角值，单位为 rem 的数值字符串 */
  radius: string
  /** 是否启用边框盒子模式，false 时使用阴影盒子模式 */
  boxBorderMode: boolean
  /** 关联的基础背景色板 ID */
  basePaletteId: string
  /** 关联的图表色板 ID */
  chartPaletteId: string
  /** 建议搭配的明暗模式，未设置时跟随当前系统主题 */
  preferredThemeMode?: 'light' | 'dark'
  /** 风格预设附带的语义色覆盖，会同步到 --art-secondary、--art-success 等变量 */
  semanticTokens?: Partial<ThemeSemanticTokens & ThemeMenuTokens>
}

export interface ThemeRadiusOption {
  /** 圆角选项唯一 ID */
  id: string
  /** 圆角选项展示名称 */
  name: string
  /** 圆角值，单位为 rem 的数值字符串 */
  value: string
}
