export type ColumnSearchValue = string | number

export interface ColumnSearchOption {
  label: string
  value: ColumnSearchValue
}

/** 表头搜索提交事件参数 */
export interface ColumnSearchSubmitPayload {
  /** 搜索关键词或选择值 */
  value: ColumnSearchValue | ''
}
