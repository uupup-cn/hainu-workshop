import type { ThemeCustomizerState } from '@/config/modules/theme-studio'

type ThemeCustomizerCssVarKey = Exclude<
  keyof ThemeCustomizerState,
  'stylePresetId' | 'basePaletteId' | 'chartPaletteId' | 'chartThemeColors' | 'themeBaseContent'
>

export const THEME_PRIMARY_CSS_VAR_NAMES = ['--main-color', '--theme-primary-light'] as const

const THEME_PRIMARY_CONTENT_CSS_VAR_NAMES = ['--theme-primary-content-light'] as const
const THEME_SECONDARY_CSS_VAR_NAMES = ['--theme-secondary', '--art-secondary'] as const
const THEME_INFO_CSS_VAR_NAMES = ['--theme-info', '--art-info'] as const
const THEME_SUCCESS_CSS_VAR_NAMES = ['--theme-success', '--art-success'] as const
const THEME_WARNING_CSS_VAR_NAMES = ['--theme-warning', '--art-warning'] as const
const THEME_ERROR_CSS_VAR_NAMES = ['--theme-error', '--art-error', '--art-danger'] as const

export const THEME_CUSTOMIZER_CSS_VAR_MAP: Record<ThemeCustomizerCssVarKey, readonly string[]> = {
  themeSurfaceBgLight: ['--theme-surface-bg-light'],
  themeSurfaceBgDark: ['--theme-surface-bg-dark'],
  themeSurfaceBoxLight: ['--theme-surface-box-light'],
  themeSurfaceBoxDark: ['--theme-surface-box-dark'],
  themeBorderLight: ['--theme-border-light'],
  themeBorderDark: ['--theme-border-dark'],
  themeBorderDashedLight: ['--theme-border-dashed-light'],
  themeBorderDashedDark: ['--theme-border-dashed-dark'],
  themeBaseContentLight: ['--theme-base-content-light'],
  themeBaseContentDark: ['--theme-base-content-dark'],
  themePrimary: THEME_PRIMARY_CSS_VAR_NAMES,
  themePrimaryLight: THEME_PRIMARY_CSS_VAR_NAMES,
  themePrimaryDark: ['--theme-primary-dark'],
  themePrimaryContent: THEME_PRIMARY_CONTENT_CSS_VAR_NAMES,
  themePrimaryContentLight: THEME_PRIMARY_CONTENT_CSS_VAR_NAMES,
  themePrimaryContentDark: ['--theme-primary-content-dark'],
  themeSecondary: THEME_SECONDARY_CSS_VAR_NAMES,
  themeSecondaryContent: ['--theme-secondary-content'],
  themeAccent: ['--theme-accent'],
  themeAccentContent: ['--theme-accent-content'],
  themeNeutral: ['--theme-neutral'],
  themeNeutralContent: ['--theme-neutral-content'],
  themeInfo: THEME_INFO_CSS_VAR_NAMES,
  themeInfoContent: ['--theme-info-content'],
  themeSuccess: THEME_SUCCESS_CSS_VAR_NAMES,
  themeSuccessContent: ['--theme-success-content'],
  themeWarning: THEME_WARNING_CSS_VAR_NAMES,
  themeWarningContent: ['--theme-warning-content'],
  themeError: THEME_ERROR_CSS_VAR_NAMES,
  themeErrorContent: ['--theme-error-content'],
  themeMenuHoverMixLight: ['--theme-menu-hover-mix-light'],
  themeMenuActiveBgMixLight: ['--theme-menu-active-bg-mix-light']
}

export const readRootCssVar = (name: string, fallback: string = '') =>
  typeof document === 'undefined'
    ? fallback
    : getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

export const writeRootCssVar = (name: string, value: string) => {
  if (typeof document === 'undefined') return

  document.documentElement.style.setProperty(name, value)
}

export const writeRootCssVars = (names: readonly string[], value: string) => {
  if (typeof document === 'undefined') return

  names.forEach((name) => {
    document.documentElement.style.setProperty(name, value)
  })
}
