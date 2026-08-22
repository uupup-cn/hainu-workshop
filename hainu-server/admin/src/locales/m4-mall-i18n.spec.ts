/**
 * M4 库存单据（入库 / 出库 / 调拨 / 盘点）i18n 文案守护测试。
 *
 * 验收依据（ spec）：
 * - Task 34（M4 i18n 与验收）：补 zh / en：入库 / 出库 / 调拨 / 盘点的所有文案。
 * - Requirement 32.5：i18n 文案中为新增菜单与按钮补齐中英文（zh / en）。
 *
 * 该测试聚焦 M4 涉及的四个页面块；全局 zh / en 键集合一致性由
 * `src/locales/locales.spec.ts` 与 Task 52（i18n 完整补齐与一致性校验）覆盖。
 *
 * 守护点：
 * 1. zh / en 在 menus.mall.{inboundPage|outboundPage|transferPage|stocktakePage}
 * 四个块下的"扁平化键集合"完全一致（任何只在一边的键都会让本测试失败）。
 * 2. 该范围内所有叶子值均为非空字符串。
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

const M4_BLOCKS = ['inboundPage', 'outboundPage', 'transferPage', 'stocktakePage'] as const

describe('locales: M4 库存单据 i18n', () => {
  for (const block of M4_BLOCKS) {
    describe(`menus.mall.${block}`, () => {
      const zhBlock = (zh as any)?.menus?.mall?.[block] as Dict | undefined
      const enBlock = (en as any)?.menus?.mall?.[block] as Dict | undefined

      it(`zh.json 与 en.json 均存在 menus.mall.${block} 块`, () => {
        expect(zhBlock, `zh.json 缺失 menus.mall.${block}`).toBeDefined()
        expect(enBlock, `en.json 缺失 menus.mall.${block}`).toBeDefined()
      })

      it(`zh / en 在 menus.mall.${block} 下键集合完全一致`, () => {
        const zhKeys = new Set(flattenKeys(zhBlock as Dict))
        const enKeys = new Set(flattenKeys(enBlock as Dict))

        const onlyInZh = [...zhKeys].filter((k) => !enKeys.has(k)).sort()
        const onlyInEn = [...enKeys].filter((k) => !zhKeys.has(k)).sort()

        expect(
          onlyInZh,
          `[${block}] 仅存在于 zh.json 的键: ${onlyInZh.join(', ') || '(none)'}`
        ).toEqual([])
        expect(
          onlyInEn,
          `[${block}] 仅存在于 en.json 的键: ${onlyInEn.join(', ') || '(none)'}`
        ).toEqual([])
      })

      it(`menus.mall.${block} 下所有叶子值均为非空字符串（zh）`, () => {
        for (const [key, value] of flattenEntries(zhBlock as Dict)) {
          expect(typeof value, `[zh] menus.mall.${block}.${key} 非字符串`).toBe('string')
          expect(
            (value as string).length,
            `[zh] menus.mall.${block}.${key} 不应为空字符串`
          ).toBeGreaterThan(0)
        }
      })

      it(`menus.mall.${block} 下所有叶子值均为非空字符串（en）`, () => {
        for (const [key, value] of flattenEntries(enBlock as Dict)) {
          expect(typeof value, `[en] menus.mall.${block}.${key} 非字符串`).toBe('string')
          expect(
            (value as string).length,
            `[en] menus.mall.${block}.${key} 不应为空字符串`
          ).toBeGreaterThan(0)
        }
      })
    })
  }
})
