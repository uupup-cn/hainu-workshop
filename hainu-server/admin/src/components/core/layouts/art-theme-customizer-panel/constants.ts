import type { ThemeSemanticTokens } from '@/config/modules/theme-studio'
import { SystemThemeEnum } from '@/enums/appEnum'

export const SYSTEM_THEME_OPTIONS = [
  { label: '浅色', value: SystemThemeEnum.LIGHT },
  { label: '暗色', value: SystemThemeEnum.DARK },
  { label: '系统', value: SystemThemeEnum.AUTO }
] as const

export const PREVIEW_BARS = [
  { month: 'Dec', height: '52%' },
  { month: 'Jan', height: '72%' },
  { month: 'Feb', height: '59%' },
  { month: 'Mar', height: '86%' },
  { month: 'Apr', height: '49%' },
  { month: 'May', height: '92%' }
] as const

export const THEME_ENUM_MAPS = {
  systemTheme: {
    auto: 'SystemThemeEnum.AUTO',
    light: 'SystemThemeEnum.LIGHT',
    dark: 'SystemThemeEnum.DARK'
  }
} as const

export const THEME_BOX_STYLE_OPTIONS = [
  {
    label: '边框',
    value: true,
    description: '轮廓清晰'
  },
  {
    label: '阴影',
    value: false,
    description: '浅浮层次'
  }
] as const

export type AdvancedThemeColorKey = keyof Pick<
  ThemeSemanticTokens,
  'themeSecondary' | 'themeAccent' | 'themeInfo' | 'themeSuccess' | 'themeWarning' | 'themeError'
>

export type AdvancedThemeContentKey = keyof Pick<
  ThemeSemanticTokens,
  | 'themeSecondaryContent'
  | 'themeAccentContent'
  | 'themeInfoContent'
  | 'themeSuccessContent'
  | 'themeWarningContent'
  | 'themeErrorContent'
>

export interface AdvancedThemeColorItem {
  label: string
  key: AdvancedThemeColorKey
  contentKey: AdvancedThemeContentKey
}

export const BRAND_THEME_COLOR_ITEMS: AdvancedThemeColorItem[] = [
  { label: '次级色', key: 'themeSecondary', contentKey: 'themeSecondaryContent' },
  { label: '强调色', key: 'themeAccent', contentKey: 'themeAccentContent' }
]

export const STATUS_THEME_COLOR_ITEMS: AdvancedThemeColorItem[] = [
  { label: '成功色', key: 'themeSuccess', contentKey: 'themeSuccessContent' },
  { label: '警告色', key: 'themeWarning', contentKey: 'themeWarningContent' },
  { label: '信息色', key: 'themeInfo', contentKey: 'themeInfoContent' },
  { label: '危险色', key: 'themeError', contentKey: 'themeErrorContent' }
]

export type ThemeConfigKey =
  | 'systemThemeType'
  | 'systemThemeMode'
  | 'systemThemeColor'
  | 'boxBorderMode'
  | 'customRadius'
  | 'themeCustomizerPreviewCollapsed'
  | 'themeCustomizer'

export interface ThemeConfigItem {
  comment: string
  key: ThemeConfigKey
  enumMap?: Record<string, string>
}

export const THEME_CONFIG_ITEMS: ThemeConfigItem[] = [
  { comment: '系统主题类型', key: 'systemThemeType', enumMap: THEME_ENUM_MAPS.systemTheme },
  { comment: '系统主题模式', key: 'systemThemeMode', enumMap: THEME_ENUM_MAPS.systemTheme },
  { comment: '系统主题颜色', key: 'systemThemeColor' },
  { comment: '边框模式', key: 'boxBorderMode' },
  { comment: '自定义圆角', key: 'customRadius' },
  { comment: '主题配置器收起预览', key: 'themeCustomizerPreviewCollapsed' },
  { comment: '主题定制器', key: 'themeCustomizer' }
]
