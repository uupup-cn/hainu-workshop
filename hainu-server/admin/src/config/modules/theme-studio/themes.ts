import type {
  ThemeAccentPalette,
  ThemeBasePalette,
  ThemeChartPalette,
  ThemeStylePreset
} from './types'
import { getArtId, hexToRgba, mixHex, normalizeRadius } from './utils'

/** Art 主题来源的明暗模式标记 */
type ArtColorScheme = 'light' | 'dark'

interface ArtThemePreset {
  /** Art 主题原始 ID */
  id: string
  /** Art 主题展示名称 */
  name: string
  /** Art 主题明暗模式 */
  scheme: ArtColorScheme
  /** Art base-100，对应主容器背景 */
  base100: string
  /** Art base-200，对应页面背景 */
  base200: string
  /** Art base-300，对应边框或分割背景 */
  base300: string
  /** Art base-content，对应基础文本色 */
  baseContent: string
  /** Art 主题主色 */
  primary: string
  /** Art 主题次级色 */
  secondary: string
  /** Art 主题强调色 */
  accent: string
  /** Art 主题中性色 */
  neutral: string
  /** Art 主题信息状态色 */
  info: string
  /** Art 主题成功状态色 */
  success: string
  /** Art 主题警告状态色 */
  warning: string
  /** Art 主题错误状态色 */
  error: string
  /** Art 主题圆角值，保留原始 rem 单位 */
  radius: string
  /** Art 主题是否默认使用边框盒子模式 */
  boxBorderMode: boolean
}

interface ArtThemeContentPreset {
  /** 主色背景上的内容色 */
  primaryContent: string
  /** 次级色背景上的内容色 */
  secondaryContent: string
  /** 强调色背景上的内容色 */
  accentContent: string
  /** 中性色背景上的内容色 */
  neutralContent: string
  /** 信息色背景上的内容色 */
  infoContent: string
  /** 成功色背景上的内容色 */
  successContent: string
  /** 警告色背景上的内容色 */
  warningContent: string
  /** 错误色背景上的内容色 */
  errorContent: string
}

const ART_THEME_DESCRIPTIONS: Record<string, string> = {
  emerald: '通透青绿，适合增长与效率工具',
  corporate: '克制蓝灰，适合正式企业门户',
  valentine: '柔粉氛围，适合会员与社群产品',
  forest: '深林绿调，适合监控与运维看板',
  cmyk: '高彩印刷感，适合创意编辑工具',
  sunset: '暮光暖调，适合品牌看板与展示页'
}

const getArtDescription = (theme: ArtThemePreset) =>
  ART_THEME_DESCRIPTIONS[theme.id] ??
  `${theme.scheme === 'dark' ? '深色沉浸' : '清爽浅色'}，适合通用业务场景`

const getArtBorderColor = (theme: ArtThemePreset, scheme: ArtColorScheme) => {
  const baseBorder = mixHex(theme.base300, theme.primary, scheme === 'dark' ? 0.12 : 0.06)
  return mixHex(baseBorder, theme.baseContent, scheme === 'dark' ? 0.06 : 0.03)
}

const getArtDashedBorderColor = (theme: ArtThemePreset, scheme: ArtColorScheme) =>
  mixHex(getArtBorderColor(theme, scheme), theme.baseContent, scheme === 'dark' ? 0.08 : 0.06)

const createDarkVariantForLightArtTheme = (theme: ArtThemePreset) => {
  const surfaceBg = mixHex(mixHex(theme.neutral, '#000000', 0.54), theme.primary, 0.04)
  const surfaceBox = mixHex(surfaceBg, '#ffffff', 0.065)
  const borderBase = mixHex(surfaceBox, '#ffffff', 0.16)
  const border = mixHex(borderBase, theme.primary, 0.1)
  const dashedBorder = mixHex(borderBase, theme.baseContent, 0.12)

  return {
    surfaceBg,
    surfaceBox,
    border: hexToRgba(border, 0.76),
    dashedBorder: hexToRgba(dashedBorder, 0.62)
  }
}

const ART_THEME_CONTENT_PRESETS: Record<string, ArtThemeContentPreset> = {
  light: {
    primaryContent: '#e0e7ff',
    secondaryContent: '#f9e4f0',
    accentContent: '#084d49',
    neutralContent: '#e4e4e7',
    infoContent: '#042e49',
    successContent: '#004c39',
    warningContent: '#793205',
    errorContent: '#4d0218'
  },
  emerald: {
    primaryContent: '#223d30',
    secondaryContent: '#ffffff',
    accentContent: '#000000',
    neutralContent: '#f9fafb',
    infoContent: '#000000',
    successContent: '#000000',
    warningContent: '#000000',
    errorContent: '#000000'
  },
  corporate: {
    primaryContent: '#ffffff',
    secondaryContent: '#ffffff',
    accentContent: '#ffffff',
    neutralContent: '#ffffff',
    infoContent: '#ffffff',
    successContent: '#ffffff',
    warningContent: '#000000',
    errorContent: '#000000'
  },
  valentine: {
    primaryContent: '#ffffff',
    secondaryContent: '#f8f3fd',
    accentContent: '#014a70',
    neutralContent: '#f9cbe5',
    infoContent: '#005889',
    successContent: '#006044',
    warningContent: '#421104',
    errorContent: '#fef2f2'
  },
  forest: {
    primaryContent: '#000000',
    secondaryContent: '#000c07',
    accentContent: '#010c0b',
    neutralContent: '#cdd3d1',
    infoContent: '#000000',
    successContent: '#000000',
    warningContent: '#000000',
    errorContent: '#000000'
  },
  cmyk: {
    primaryContent: '#020b13',
    secondaryContent: '#130207',
    accentContent: '#161401',
    neutralContent: '#cbcbcb',
    infoContent: '#020a0d',
    successContent: '#e6d5e9',
    warningContent: '#130601',
    errorContent: '#130101'
  },
  sunset: {
    primaryContent: '#160603',
    secondaryContent: '#160409',
    accentContent: '#0c0615',
    neutralContent: '#94a0a9',
    infoContent: '#071213',
    successContent: '#0b120b',
    warningContent: '#140f08',
    errorContent: '#160d0d'
  }
}

export const getArtThemeContent = (theme: ArtThemePreset) =>
  ART_THEME_CONTENT_PRESETS[theme.id] ?? ART_THEME_CONTENT_PRESETS.light

export const createArtBasePalette = (theme: ArtThemePreset): ThemeBasePalette => {
  const isLightTheme = theme.scheme === 'light'
  const content = getArtThemeContent(theme)
  const lightBorderColor = getArtBorderColor(theme, 'light')
  const darkBorderColor = getArtBorderColor(theme, 'dark')
  const darkVariant = isLightTheme ? createDarkVariantForLightArtTheme(theme) : null

  return {
    id: getArtId(theme.id),
    name: theme.name,
    description: getArtDescription(theme),
    swatch: theme.primary,
    preferredThemeMode: theme.scheme,
    themeSurfaceBgLight: isLightTheme ? theme.base200 : mixHex(theme.base200, '#ffffff', 0.9),
    themeSurfaceBgDark: darkVariant?.surfaceBg ?? theme.base200,
    themeSurfaceBoxLight: isLightTheme ? theme.base100 : mixHex(theme.base100, '#ffffff', 0.92),
    themeSurfaceBoxDark: darkVariant?.surfaceBox ?? theme.base100,
    themeBorderLight: isLightTheme ? lightBorderColor : mixHex(lightBorderColor, '#ffffff', 0.76),
    themeBorderDark: darkVariant?.border ?? darkBorderColor,
    themeBorderDashedLight: isLightTheme
      ? getArtDashedBorderColor(theme, 'light')
      : mixHex(getArtDashedBorderColor(theme, 'light'), '#ffffff', 0.72),
    themeBorderDashedDark: darkVariant?.dashedBorder ?? getArtDashedBorderColor(theme, 'dark'),
    themeBaseContent: theme.baseContent,
    themeBaseContentLight: isLightTheme
      ? theme.baseContent
      : mixHex(theme.baseContent, '#000000', 0.72),
    themeBaseContentDark: isLightTheme
      ? mixHex(theme.baseContent, '#ffffff', 0.82)
      : theme.baseContent,
    themePrimary: theme.primary,
    themePrimaryContent: content.primaryContent,
    themeSecondary: theme.secondary,
    themeSecondaryContent: content.secondaryContent,
    themeAccent: theme.accent,
    themeAccentContent: content.accentContent,
    themeNeutral: theme.neutral,
    themeNeutralContent: content.neutralContent,
    themeInfo: theme.info,
    themeInfoContent: content.infoContent,
    themeSuccess: theme.success,
    themeSuccessContent: content.successContent,
    themeWarning: theme.warning,
    themeWarningContent: content.warningContent,
    themeError: theme.error,
    themeErrorContent: content.errorContent
  }
}

export const createArtAccentPalette = (theme: ArtThemePreset): ThemeAccentPalette => ({
  id: getArtId(theme.id),
  name: theme.name,
  color: theme.primary
})

export const createArtChartPalette = (theme: ArtThemePreset): ThemeChartPalette => ({
  id: getArtId(theme.id),
  name: theme.name,
  colors: [theme.primary, theme.secondary, theme.accent, theme.info, theme.success, theme.warning]
})

export const createArtStylePreset = (theme: ArtThemePreset): ThemeStylePreset => ({
  id: getArtId(theme.id),
  name: theme.name,
  description: getArtDescription(theme),
  primary: theme.primary,
  radius: normalizeRadius(theme.radius),
  boxBorderMode: true,
  basePaletteId: getArtId(theme.id),
  chartPaletteId: getArtId(theme.id),
  preferredThemeMode: theme.scheme
})

export const ART_THEME_PRESETS: ArtThemePreset[] = [
  {
    id: 'emerald',
    name: 'Emerald',
    scheme: 'light',
    base100: '#ffffff',
    base200: '#F8F8F8',
    base300: '#EFEFEF',
    baseContent: '#333c4d',
    primary: '#66cc8a',
    secondary: '#377cfb',
    accent: '#f68067',
    neutral: '#333c4d',
    info: '#00b5ff',
    success: '#00a96e',
    warning: '#ffbe00',
    error: '#ff5861',
    radius: '0.5rem',
    boxBorderMode: true
  },
  {
    id: 'corporate',
    name: 'Corporate',
    scheme: 'light',
    base100: '#ffffff',
    base200: '#F8F9F9',
    base300: '#F0F0F2',
    baseContent: '#181a2a',
    primary: '#0082ce',
    secondary: '#61738d',
    accent: '#009689',
    neutral: '#000000',
    info: '#0090b5',
    success: '#00a43b',
    warning: '#fdc700',
    error: '#ff6266',
    radius: '0.5rem',
    boxBorderMode: true
  },
  {
    id: 'valentine',
    name: 'Valentine',
    scheme: 'light',
    base100: '#fcf2f8',
    base200: '#f9e4f0',
    base300: '#FAD6EA',
    baseContent: '#c5005a',
    primary: '#F873B9',
    secondary: '#BE93F9',
    accent: '#5DE8B3',
    neutral: '#830c41',
    info: '#51e8fb',
    success: '#5ce8b3',
    warning: '#FFB86C',
    error: '#f82834',
    radius: '0.5rem',
    boxBorderMode: true
  },
  {
    id: 'forest',
    name: 'Forest',
    scheme: 'dark',
    base100: '#1b1717',
    base200: '#161212',
    base300: '#2E2424',
    baseContent: '#cac9c9',
    primary: '#1fb854',
    secondary: '#1eb88e',
    accent: '#1fb8ab',
    neutral: '#19362d',
    info: '#00b5ff',
    success: '#00a96e',
    warning: '#ffbe00',
    error: '#ff5861',
    radius: '0.5rem',
    boxBorderMode: true
  },
  {
    id: 'cmyk',
    name: 'Cmyk',
    scheme: 'light',
    base100: '#ffffff',
    base200: '#eeeeee',
    base300: '#EEEEEE',
    baseContent: '#161616',
    primary: '#45aeee',
    secondary: '#e8488a',
    accent: '#fff234',
    neutral: '#1a1a1a',
    info: '#4ba8c0',
    success: '#823290',
    warning: '#ee8134',
    error: '#e93f33',
    radius: '0.5rem',
    boxBorderMode: true
  },
  {
    id: 'sunset',
    name: 'Sunset',
    scheme: 'dark',
    base100: '#121c22',
    base200: '#0e171e',
    base300: '#091319',
    baseContent: '#9fb9d0',
    primary: '#ff865b',
    secondary: '#fd6f9c',
    accent: '#b387fa',
    neutral: '#1b262c',
    info: '#89e0eb',
    success: '#addfad',
    warning: '#f1c892',
    error: '#ffbbbd',
    radius: '0.5rem',
    boxBorderMode: true
  }
]
