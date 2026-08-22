import type { ThemeConfigItem, ThemeConfigKey } from './constants'

type ThemeConfigSource = Record<ThemeConfigKey, unknown>

export const syncDropdownWidth = (isOpen: boolean, triggerEl: HTMLButtonElement | null) => {
  if (!isOpen || !triggerEl || typeof document === 'undefined') return

  const width = Math.round(triggerEl.getBoundingClientRect().width)
  document.documentElement.style.setProperty('--theme-customizer-dropdown-width', `${width}px`)
}

export const getReadableContentColor = (color: string) => {
  const normalized = color.replace('#', '')
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized
  const [red, green, blue] = [0, 2, 4].map((index) => parseInt(fullHex.slice(index, index + 2), 16))
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.62 ? '#18181b' : '#ffffff'
}

const valueToCode = (value: unknown, enumMap?: Record<string, string>) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  if (enumMap && typeof value === 'string' && enumMap[value]) {
    return enumMap[value]
  }

  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  return JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')
}

export const generateThemeConfigCode = (
  source: ThemeConfigSource,
  configItems: ThemeConfigItem[]
) => {
  const lines = ['// 可粘贴到 src/config/setting.ts 的 SETTING_DEFAULT_CONFIG 中继续微调']

  configItems.forEach((item) => {
    lines.push(`  /** ${item.comment} */`)
    lines.push(`  ${item.key}: ${valueToCode(source[item.key], item.enumMap)},`)
  })

  return lines.join('\n')
}
