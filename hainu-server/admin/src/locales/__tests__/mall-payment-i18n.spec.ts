/**
 * Task 42 — mall.payment.* zh / en i18n 全量补齐
 *
 * 验收依据（ spec）：
 * - Requirement 16.5：i18n 文案中为新增菜单 / 按钮 / 通道编码枚举 / 错误码补齐中英文（zh / en），
 * 且通过 jest 单元测试守护 zh / en 键集合 100% 一致。
 *
 * 本文件聚焦 `mall.payment` 子树：
 * 1. zh / en 在 `mall.payment` 下扁平化键集合完全相等（对称差为空）。
 * 2. 所有叶子值均为非空字符串。
 * 3. `menus.mall` 下 payment 相关菜单键存在且非空。
 */

import { describe, expect, it } from 'vitest'
import zh from '../langs/zh.json'
import en from '../langs/en.json'

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

describe('Task 42: mall.payment.* i18n 键集合一致性', () => {
  it('zh / en 在 mall.payment 下扁平化键集合完全相等', () => {
    const zhPayment = get(zhDict, 'mall.payment') as Dict | undefined
    const enPayment = get(enDict, 'mall.payment') as Dict | undefined

    expect(zhPayment, 'zh.json 缺失 mall.payment').toBeDefined()
    expect(enPayment, 'en.json 缺失 mall.payment').toBeDefined()

    const zhKeys = new Set(flattenKeys(zhPayment as Dict))
    const enKeys = new Set(flattenKeys(enPayment as Dict))

    const onlyInZh = [...zhKeys].filter((k) => !enKeys.has(k)).sort()
    const onlyInEn = [...enKeys].filter((k) => !zhKeys.has(k)).sort()

    expect(
      onlyInZh,
      `[mall.payment] 仅存在于 zh.json 的键: ${onlyInZh.join(', ') || '(none)'}`
    ).toEqual([])
    expect(
      onlyInEn,
      `[mall.payment] 仅存在于 en.json 的键: ${onlyInEn.join(', ') || '(none)'}`
    ).toEqual([])

    // 双重保险：总数也必须相等
    expect(zhKeys.size).toBe(enKeys.size)
  })

  it('zh.json mall.payment 所有叶子值均为非空字符串', () => {
    const zhPayment = get(zhDict, 'mall.payment') as Dict
    for (const [key, value] of flattenEntries(zhPayment)) {
      expect(typeof value, `[zh] mall.payment.${key} 非字符串`).toBe('string')
      expect((value as string).length, `[zh] mall.payment.${key} 不应为空字符串`).toBeGreaterThan(0)
    }
  })

  it('en.json mall.payment 所有叶子值均为非空字符串', () => {
    const enPayment = get(enDict, 'mall.payment') as Dict
    for (const [key, value] of flattenEntries(enPayment)) {
      expect(typeof value, `[en] mall.payment.${key} 非字符串`).toBe('string')
      expect((value as string).length, `[en] mall.payment.${key} 不应为空字符串`).toBeGreaterThan(0)
    }
  })

  it('menus.mall 下 payment 相关菜单键存在且非空（zh + en）', () => {
    const paymentMenuKeys = ['paymentChannel', 'paymentTransaction', 'paymentWebhook']

    for (const menuKey of paymentMenuKeys) {
      const zhVal = get(zhDict, `menus.mall.${menuKey}`)
      const enVal = get(enDict, `menus.mall.${menuKey}`)

      expect(zhVal, `zh.json 缺失 menus.mall.${menuKey}`).toBeDefined()
      expect(enVal, `en.json 缺失 menus.mall.${menuKey}`).toBeDefined()
      expect(typeof zhVal, `[zh] menus.mall.${menuKey} 非字符串`).toBe('string')
      expect(typeof enVal, `[en] menus.mall.${menuKey} 非字符串`).toBe('string')
      expect((zhVal as string).length, `[zh] menus.mall.${menuKey} 不应为空字符串`).toBeGreaterThan(
        0
      )
      expect((enVal as string).length, `[en] menus.mall.${menuKey} 不应为空字符串`).toBeGreaterThan(
        0
      )
    }
  })
})
