/**
 * Task 52 — i18n 完整补齐与一致性校验
 *
 * 验收依据（ spec）：
 * - Requirement 32.5：i18n 文案中为新增菜单与按钮补齐中英文（zh、en）。
 * - Requirement 32.6：菜单勾选时级联展示按钮 / API 权限码（其菜单文案需双语完整）。
 * - tasks.md Task 52：在 `src/locales/langs/zh.json` 与 `en.json` 的 `menus.mall`
 * 路由菜单文案下，zh / en 键集合 100% 一致且值非空；
 * 并写单元测试扫描 zh / en 文件键集合，断言完全相等。
 *
 * 与既有 `locales.spec.ts`（全局键一致性 + M3 关键键白名单）/ `m4-mall-i18n.spec.ts`
 * （M4 库存单据块）的关系：
 * 本文件聚焦 Task 52 自身的"完整补齐"守护，从「整体文件 + menus.mall 路由菜单子树」
 * 两个角度独立校验，保证后续任何回归都至少有一处直接断言。
 */

import { describe, expect, it } from 'vitest'
import zh from './langs/zh.json'
import en from './langs/en.json'

type Dict = Record<string, unknown>

/** 扁平化对象，得到所有叶子节点的 dotted-path 列表。 */
function flattenKeys(obj: Dict, prefix = ''): string[] {
  const out: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flattenKeys(v as Dict, key))
    } else {
      out.push(key)
    }
  }
  return out
}

/** 扁平化对象，得到所有叶子节点的 [dotted-path, value] 列表。 */
function flattenEntries(obj: Dict, prefix = ''): Array<[string, unknown]> {
  const acc: Array<[string, unknown]> = []
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      acc.push(...flattenEntries(v as Dict, key))
    } else {
      acc.push([key, v])
    }
  }
  return acc
}

/** 通过 dotted-path 安全取值。 */
function get(obj: Dict, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((acc, k) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Dict)[k]
  }, obj)
}

const zhDict = zh as unknown as Dict
const enDict = en as unknown as Dict

describe('Task 52: i18n parity 完整文件级校验（zh.json vs en.json）', () => {
  it('全文件扁平化键集合完全相等（断言完全相等）', () => {
    const zhKeys = new Set(flattenKeys(zhDict))
    const enKeys = new Set(flattenKeys(enDict))

    const onlyInZh = [...zhKeys].filter((k) => !enKeys.has(k)).sort()
    const onlyInEn = [...enKeys].filter((k) => !zhKeys.has(k)).sort()

    // 直接断言两个集合的对称差为空 — 等价于"键集合完全相等"。
    expect(onlyInZh, `仅存在于 zh.json 的键: ${onlyInZh.join(', ') || '(none)'}`).toEqual([])
    expect(onlyInEn, `仅存在于 en.json 的键: ${onlyInEn.join(', ') || '(none)'}`).toEqual([])

    // 兼容性断言：两边总数也必须相等（重复保险，避免漏报）。
    expect(zhKeys.size).toBe(enKeys.size)
  })

  it('zh.json 所有叶子值均为非空（字符串或非空数组）', () => {
    for (const [key, value] of flattenEntries(zhDict)) {
      assertNonEmptyLeaf('zh', key, value)
    }
  })

  it('en.json 所有叶子值均为非空（字符串或非空数组）', () => {
    for (const [key, value] of flattenEntries(enDict)) {
      assertNonEmptyLeaf('en', key, value)
    }
  })
})

/**
 * 叶子值校验：
 * - 字符串：长度必须大于 0；
 * - 数组：仅允许非空数组，且每一项也必须是非空字符串（vue-i18n list 风格）；
 * - 其他类型一律视为非法。
 */
function assertNonEmptyLeaf(lang: 'zh' | 'en', key: string, value: unknown): void {
  if (typeof value === 'string') {
    expect(value.length, `[${lang}] ${key} 不应为空字符串`).toBeGreaterThan(0)
    return
  }
  if (Array.isArray(value)) {
    expect(value.length, `[${lang}] ${key} 不应为空数组`).toBeGreaterThan(0)
    value.forEach((item, idx) => {
      expect(typeof item, `[${lang}] ${key}[${idx}] 非字符串`).toBe('string')
      expect((item as string).length, `[${lang}] ${key}[${idx}] 不应为空字符串`).toBeGreaterThan(0)
    })
    return
  }
  expect.fail(`[${lang}] ${key} 叶子值类型非法: ${typeof value}`)
}

describe('Task 52: menus.mall 子树键集合完全一致', () => {
  it('zh / en 在 menus.mall 下扁平化键集合完全相等', () => {
    const zhMall = get(zhDict, 'menus.mall') as Dict | undefined
    const enMall = get(enDict, 'menus.mall') as Dict | undefined

    expect(zhMall, 'zh.json 缺失 menus.mall').toBeDefined()
    expect(enMall, 'en.json 缺失 menus.mall').toBeDefined()

    const zhKeys = new Set(flattenKeys(zhMall as Dict))
    const enKeys = new Set(flattenKeys(enMall as Dict))

    const onlyInZh = [...zhKeys].filter((k) => !enKeys.has(k)).sort()
    const onlyInEn = [...enKeys].filter((k) => !zhKeys.has(k)).sort()

    expect(
      onlyInZh,
      `[menus.mall] 仅存在于 zh.json 的键: ${onlyInZh.join(', ') || '(none)'}`
    ).toEqual([])
    expect(
      onlyInEn,
      `[menus.mall] 仅存在于 en.json 的键: ${onlyInEn.join(', ') || '(none)'}`
    ).toEqual([])
  })

  it('menus.mall 下叶子值均为非空字符串（zh + en）', () => {
    const zhMall = get(zhDict, 'menus.mall') as Dict
    const enMall = get(enDict, 'menus.mall') as Dict

    for (const [key, value] of flattenEntries(zhMall)) {
      expect(typeof value, `[zh] menus.mall.${key} 非字符串`).toBe('string')
      expect((value as string).length, `[zh] menus.mall.${key} 不应为空字符串`).toBeGreaterThan(0)
    }
    for (const [key, value] of flattenEntries(enMall)) {
      expect(typeof value, `[en] menus.mall.${key} 非字符串`).toBe('string')
      expect((value as string).length, `[en] menus.mall.${key} 不应为空字符串`).toBeGreaterThan(0)
    }
  })
})
