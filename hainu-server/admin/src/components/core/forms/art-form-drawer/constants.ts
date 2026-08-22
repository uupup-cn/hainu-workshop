/**
 * ArtFormDrawer 共享常量
 *
 * 抽离出来以便在 <script setup> 之外（例如单元测试）也能 import 使用，
 * 避免 Vue SFC <script setup> 的 export 限制。
 */

/** 三档宽度档位（像素）：SM=480 / MD=720 / LG=960 */
export const ART_FORM_DRAWER_SIZES = { SM: 480, MD: 720, LG: 960 } as const

/** 宽度档位的字面量类型 */
export type ArtFormDrawerSize = keyof typeof ART_FORM_DRAWER_SIZES

/** loading 遮罩最小展示时长（毫秒，防闪烁） */
export const LOADING_MIN_DURATION = 300
