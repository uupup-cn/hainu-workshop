/**
 * 将十六进制颜色转换为 RGB 三元组。
 * @param hex 十六进制颜色，支持 #RGB 和 #RRGGBB
 * @returns RGB 通道数组
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '')
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  return [
    parseInt(fullHex.slice(0, 2), 16),
    parseInt(fullHex.slice(2, 4), 16),
    parseInt(fullHex.slice(4, 6), 16)
  ]
}

/**
 * 将 RGB 三元组转换为十六进制颜色。
 * @param rgb RGB 通道数组
 * @returns 标准 #RRGGBB 颜色字符串
 */
export const rgbToHex = ([red, green, blue]: [number, number, number]) =>
  `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`

/**
 * 按权重混合两个十六进制颜色。
 * @param source 源颜色
 * @param target 目标颜色
 * @param targetWeight 目标颜色权重，范围会被限制在 0 到 1
 * @returns 混合后的十六进制颜色
 */
export const mixHex = (source: string, target: string, targetWeight: number) => {
  const sourceRgb = hexToRgb(source)
  const targetRgb = hexToRgb(target)
  const weight = Math.max(0, Math.min(1, targetWeight))

  return rgbToHex(
    sourceRgb.map((channel, index) =>
      Math.round(channel * (1 - weight) + targetRgb[index] * weight)
    ) as [number, number, number]
  )
}

/**
 * 将十六进制颜色转换为 rgba() 字符串。
 * @param hex 十六进制颜色
 * @param opacity 透明度
 * @returns rgba() 颜色字符串
 */
export const hexToRgba = (hex: string, opacity: number) => {
  const [red, green, blue] = hexToRgb(hex)
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

/**
 * 归一化圆角值，去掉 rem 单位以匹配主题定制器的存储格式。
 * @param radius 原始圆角值
 * @returns 不带单位的圆角数值字符串
 */
export const normalizeRadius = (radius: string) => radius.replace('rem', '') || '0'

/**
 * 为 Art 主题生成项目内唯一 ID。
 * @param themeId Art 主题原始 ID
 * @returns 带 art- 前缀的主题 ID
 */
export const getArtId = (themeId: string) => `art-${themeId}`
