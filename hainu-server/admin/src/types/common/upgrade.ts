/**
 * 系统升级日志相关类型定义
 *
 * @module types/common/upgrade
 */

/** 更新日志类型 */
export enum UpgradeLogType {
  /** 新功能 */
  Feature = 'feature',
  /** 修复 */
  Fix = 'fix',
  /** 更新 */
  Update = 'update',
  /** 优化 */
  Optimize = 'optimize'
}

/** 更新日志内容分组 */
export interface UpgradeLogDetailGroup {
  /** 更新类型 */
  type: UpgradeLogType
  /** 更新条目列表 */
  items: string[]
}

/** 更新日志条目 */
export interface UpgradeLog {
  /** 版本号 */
  version: string
  /** 更新标题 */
  title: string
  /** 更新日期 */
  date: string
  /** 更新内容分组 */
  detailGroups?: UpgradeLogDetailGroup[]
  /** 是否需要重新登录 */
  requireReLogin?: boolean
  /** 备注 */
  remark?: string
}
