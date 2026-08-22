/**
 * i18n 文案守护测试。
 *
 * 验收依据（ spec）：
 * - Requirement 32.5: i18n 文案中为新增菜单与按钮补齐中英文（zh / en）。
 * - Task 28（M3 i18n 与验收）：补齐商品类型 / 销售模式 / 推荐位 / 商品评价 / 售后说明 等所有文案。
 *
 * 本测试通过两个维度守护：
 * 1. zh / en 两份语言包键集合 100% 一致（任何只在一边存在的键都会让本测试失败）。
 * 2. M3 必须存在的 menus.mall.* 关键键全部命中（防止后续重构无意中删除）。
 */

import { describe, expect, it } from 'vitest'
import zh from './langs/zh.json'
import en from './langs/en.json'

type Dict = Record<string, unknown>

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

function get(obj: Dict, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((acc, k) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Dict)[k]
  }, obj)
}

describe('locales (zh.json vs en.json)', () => {
  it('键集合在 zh 与 en 中完全一致', () => {
    const zhKeys = new Set(flattenKeys(zh as Dict))
    const enKeys = new Set(flattenKeys(en as Dict))

    const onlyInZh = [...zhKeys].filter((k) => !enKeys.has(k))
    const onlyInEn = [...enKeys].filter((k) => !zhKeys.has(k))

    expect(onlyInZh, `仅存在于 zh.json 的键: ${onlyInZh.join(', ')}`).toEqual([])
    expect(onlyInEn, `仅存在于 en.json 的键: ${onlyInEn.join(', ')}`).toEqual([])
  })

  it('zh / en 所有叶子值均为非空字符串', () => {
    const collect = (obj: Dict, prefix = ''): Array<[string, unknown]> => {
      const acc: Array<[string, unknown]> = []
      for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          acc.push(...collect(v as Dict, key))
        } else {
          acc.push([key, v])
        }
      }
      return acc
    }
    for (const [key, value] of collect(zh as Dict)) {
      if (typeof value === 'string') {
        expect(value.length, `zh.json 键 ${key} 不应为空字符串`).toBeGreaterThan(0)
      }
    }
    for (const [key, value] of collect(en as Dict)) {
      if (typeof value === 'string') {
        expect(value.length, `en.json 键 ${key} 不应为空字符串`).toBeGreaterThan(0)
      }
    }
  })
})

describe('locales: 商城路由菜单文案', () => {
  const required: string[] = [
    'menus.mall.title',
    'menus.mall.productMgmt',
    'menus.mall.inventoryMgmt',
    'menus.mall.orderMgmt',
    'menus.mall.shopOps',
    'menus.mall.product',
    'menus.mall.productDetail',
    'menus.mall.brand',
    'menus.mall.productService',
    'menus.mall.attributeTemplate',
    'menus.mall.expressCompany',
    'menus.mall.shippingTemplate',
    'menus.mall.warehouse',
    'menus.mall.inbound',
    'menus.mall.outbound',
    'menus.mall.transfer',
    'menus.mall.stocktake',
    'menus.mall.inventoryQuery',
    'menus.mall.inventoryLog',
    'menus.mall.review',
    'menus.mall.aftersaleNotice',
    'menus.mall.aftersaleOrder',
    'menus.mall.order',
    'menus.mall.orderDetail',
    'menus.mall.category'
  ]

  it.each(required)('zh.json 中存在键 %s', (key) => {
    expect(get(zh as Dict, key), `zh.json 缺失关键键: ${key}`).toBeDefined()
  })

  it.each(required)('en.json 中存在键 %s', (key) => {
    expect(get(en as Dict, key), `en.json 缺失关键键: ${key}`).toBeDefined()
  })
})
