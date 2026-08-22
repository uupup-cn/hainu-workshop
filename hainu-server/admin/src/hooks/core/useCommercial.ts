/**
 * useCommercial - 商业化品牌入口开关
 *
 * 集中管理与产品供应商相关的引流入口（购买授权卡片、官方文档外链、项目介绍弹窗等）。
 * 客户交付前在 `src/config/index.ts` 中将 `commercial.enabled` 置为 `false`，
 * 即可一键关闭所有相关品牌入口。
 *
 * @module hooks/core/useCommercial
 * @author Ci-Yuu-Plus Team
 */
import AppConfig from '@/config'

/**
 * 是否启用商业化品牌入口
 * @returns boolean，默认 true，仅当显式置为 false 时生效
 */
export function isCommercialEntryEnabled(): boolean {
  return AppConfig.commercial?.enabled !== false
}

export function useCommercial() {
  return {
    enabled: isCommercialEntryEnabled()
  }
}
