/**
 * 表头搜索历史状态管理模块
 *
 * ## 主要功能
 *
 * - 搜索历史：按字段维度记录表头搜索关键词，方便客户复用高频查询条件
 * - 持久化存储：通过 Pinia persistedstate 将所有字段历史集中保存到一个 localStorage key
 * - 存储加密：写入 localStorage 前使用 AES 加密，避免手机号等关键词以明文形式暴露
 *
 * ## 存储结构
 *
 * localStorage key：sys-v{version}-column-search-history
 * store state：{ histories: Record<string, string[]> }
 *
 * @module store/modules/column-search-history
 */
import { defineStore, type StateTree } from 'pinia'
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

// 按业务字段保存搜索历史，例如 system-user-phone、system-user-username。
type ColumnSearchHistoryMap = Record<string, string[]>

// Pinia 持久化 key，最终会被全局 StorageKeyManager 包装成 sys-v{version}-column-search-history。
const COLUMN_SEARCH_HISTORY_STORE_KEY = 'column-search-history'
// 加密内容前缀，用于区分当前加密格式，避免误解析非本模块数据。
const ENCRYPTED_STORAGE_PREFIX = 'aes:'
// 前端本地存储加密密钥。用于降低 localStorage 明文暴露风险，不用于替代后端安全控制。
const STORAGE_ENCRYPTION_KEY = 'art-design-pro-x-column-search-history'

/**
 * 规范化搜索历史。
 *
 * 会自动过滤非字符串、空字符串、重复值，并按最大条数截断。
 * @param value 待处理的历史数据。
 * @param max 最大保留条数。
 */
const normalizeHistory = (value: unknown, max: number) => {
  if (!Array.isArray(value)) return []

  const seen = new Set<string>()
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen.has(item)) return false
      seen.add(item)
      return true
    })
    .slice(0, max)
}

/**
 * 表头搜索历史持久化序列化器。
 *
 * Pinia persistedstate 在写入 localStorage 前调用 serialize，在读取 localStorage 后调用 deserialize。
 * 这里统一对整个 store payload 加密/解密，组件和 hook 仍然可以按普通对象使用。
 */
const columnSearchHistorySerializer = {
  /**
   * 将 store state 序列化为 AES 密文。
   * @param data Pinia store state。
   */
  serialize(data: StateTree) {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), STORAGE_ENCRYPTION_KEY).toString()

    return `${ENCRYPTED_STORAGE_PREFIX}${ciphertext}`
  },
  /**
   * 将 localStorage 中的 AES 密文还原为 store state。
   * 解密失败时返回空对象，避免异常数据影响页面渲染。
   * @param data localStorage 中保存的字符串。
   */
  deserialize(data: string) {
    try {
      if (!data.startsWith(ENCRYPTED_STORAGE_PREFIX)) return {}

      const ciphertext = data.slice(ENCRYPTED_STORAGE_PREFIX.length)
      const plaintext = CryptoJS.AES.decrypt(ciphertext, STORAGE_ENCRYPTION_KEY).toString(
        CryptoJS.enc.Utf8
      )

      return plaintext ? JSON.parse(plaintext) : {}
    } catch (error) {
      console.warn('[ColumnSearch] 搜索历史解密失败:', error)
      return {}
    }
  }
}

export const useColumnSearchHistoryStore = defineStore(
  'columnSearchHistoryStore',
  () => {
    // 所有表头搜索历史集中存储，避免为每个字段生成一个 localStorage key。
    const histories = ref<ColumnSearchHistoryMap>({})

    /**
     * 统一清洗字段 key。
     * @param key 字段唯一标识。
     */
    const normalizeKey = (key: string) => key.trim()

    /**
     * 获取指定字段的搜索历史。
     * @param key 字段唯一标识，例如 system-user-phone。
     * @param max 返回条数上限。
     */
    const getHistory = (key: string, max: number) => {
      const historyKey = normalizeKey(key)
      return historyKey ? normalizeHistory(histories.value[historyKey] || [], max) : []
    }

    /**
     * 新增一条字段搜索历史。
     * @param key 字段唯一标识。
     * @param value 搜索关键词。
     * @param max 存储条数上限。
     */
    const addHistory = (key: string, value: string, max: number) => {
      const historyKey = normalizeKey(key)
      const keyword = value.trim()
      if (!historyKey || !keyword) return

      histories.value = {
        ...histories.value,
        [historyKey]: normalizeHistory([keyword, ...(histories.value[historyKey] || [])], max)
      }
    }

    /**
     * 清空指定字段搜索历史。
     * @param key 字段唯一标识。
     */
    const clearHistory = (key: string) => {
      const historyKey = normalizeKey(key)
      if (!historyKey) return

      const next = { ...histories.value }
      delete next[historyKey]
      histories.value = next
    }

    return {
      histories,
      getHistory,
      addHistory,
      clearHistory
    }
  },
  {
    persist: {
      key: COLUMN_SEARCH_HISTORY_STORE_KEY,
      storage: localStorage,
      serializer: columnSearchHistorySerializer,
      // hydration 后立即重写一次，确保本地存储保持 AES 加密格式。
      afterHydrate: ({ store }) => {
        store.$persist()
      }
    }
  }
)
