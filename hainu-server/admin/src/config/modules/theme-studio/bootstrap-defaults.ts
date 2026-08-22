import type { ThemeCustomizerState } from './types'

/**
 * 首屏主题引导默认值。
 *
 * 这里只保留应用启动阶段真正需要的默认状态，避免为了拿默认主题
 * 把完整 theme-studio 预设、色板和工具链一起拉进入口。
 * 如果更新了主题配置器里的默认 preset / palette，需要同步这里。
 */
export const BOOTSTRAP_THEME_CUSTOMIZER_STATE: ThemeCustomizerState = {
  stylePresetId: 'nova',
  basePaletteId: 'neutral',
  chartPaletteId: 'cobalt',
  themeSurfaceBgLight: '#fafbfc',
  themeSurfaceBgDark: '#070707',
  themeSurfaceBoxLight: '#ffffff',
  themeSurfaceBoxDark: '#161618',
  themeBorderLight: '#e3e8ee',
  themeBorderDark: 'rgba(255, 255, 255, 0.1)',
  themeBorderDashedLight: '#d4d4dc',
  themeBorderDashedDark: '#363843',
  themeBaseContent: '#323251',
  themeBaseContentLight: '#323251',
  themeBaseContentDark: '#e3e3e8',
  themePrimary: '#377dff',
  themePrimaryLight: '#377dff',
  themePrimaryDark: '#377dff',
  themePrimaryContent: '#ffffff',
  themePrimaryContentLight: '#ffffff',
  themePrimaryContentDark: '#ffffff',
  themeSecondary: '#00B7FF',
  themeSecondaryContent: '#06283a',
  themeAccent: '#14b8a6',
  themeAccentContent: '#022c22',
  themeNeutral: '#3f3f46',
  themeNeutralContent: '#f4f4f5',
  themeInfo: '#6e7c8c',
  themeInfoContent: '#082f49',
  themeSuccess: '#00d89f',
  themeSuccessContent: '#052e16',
  themeWarning: '#f59e0b',
  themeWarningContent: '#451a03',
  themeError: '#ef4444',
  themeErrorContent: '#450a0a',
  themeMenuHoverMixLight: '8%',
  themeMenuActiveBgMixLight: '14%',
  chartThemeColors: ['#4A8BFF', '#14deba', '#ffaf20', '#4abeff', '#fa8a6c', '#ffaf20']
}
