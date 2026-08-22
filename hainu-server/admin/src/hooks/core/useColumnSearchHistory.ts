import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useColumnSearchHistoryStore } from '@/store/modules/column-search-history'

interface ColumnSearchHistoryOptions {
  /** 最多保留的历史记录条数 */
  max?: number
}

const DEFAULT_MAX_HISTORY = 5

/**
 * 表头搜索历史记录管理。
 *
 * 按字段维度将最近搜索关键词保存到统一的 Pinia 持久化 store 中，方便客户重复查询高频关键词。
 * storageId 建议使用稳定的业务唯一标识，例如 `system-user-phone`。
 */
export function useColumnSearchHistory(
  storageId: MaybeRefOrGetter<string | undefined>,
  options: ColumnSearchHistoryOptions = {}
) {
  const columnSearchHistoryStore = useColumnSearchHistoryStore()
  const max = computed(() => Math.max(1, options.max || DEFAULT_MAX_HISTORY))
  const historyKey = computed(() => {
    const id = toValue(storageId)?.trim()
    return id || ''
  })
  const history = computed(() =>
    historyKey.value ? columnSearchHistoryStore.getHistory(historyKey.value, max.value) : []
  )

  /** 新增一条搜索历史，并自动去重、截断。 */
  const addHistory = (value: string) => {
    columnSearchHistoryStore.addHistory(historyKey.value, value, max.value)
  }

  /** 清空当前字段的搜索历史。 */
  const clearHistory = () => {
    columnSearchHistoryStore.clearHistory(historyKey.value)
  }

  return {
    history,
    addHistory,
    clearHistory
  }
}
