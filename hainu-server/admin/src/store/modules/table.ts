/**
 * 表格状态管理模块
 *
 * 提供表格显示配置的状态管理
 *
 * ## 主要功能
 *
 * - 表格尺寸配置（紧凑、默认、宽松）
 * - 斑马纹显示开关
 * - 边框显示开关
 * - 表头背景显示开关
 * - 移动端卡片模式开关
 * - 全屏模式开关
 *
 * ## 使用场景
 * - 表格组件样式配置
 * - 用户表格偏好设置
 * - 表格工具栏功能控制
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-table
 * - 用户配置跨页面保持
 *
 * @module store/modules/table
 * @author Ci-Yuu-Plus Team
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TableSizeEnum } from '@/enums/formEnum'
import {
  clearLegacyColumnPreferenceStorage,
  type TableColumnPreference
} from '@/utils/table/columnPreferences'

// 表格
export const useTableStore = defineStore(
  'tableStore',
  () => {
    // 表格大小
    const tableSize = ref(TableSizeEnum.DEFAULT)
    // 斑马纹
    const isZebra = ref(false)
    // 边框
    const isBorder = ref(false)
    // 表头背景
    const isHeaderBackground = ref(false)
    // 移动端是否启用卡片模式
    const isMobileCardMode = ref(true)

    // 是否全屏
    const isFullScreen = ref(false)

    // 表格列偏好：按页面或业务表格 key 保存列排序和显隐状态
    const columnPreferences = ref<Record<string, TableColumnPreference>>({})

    /**
     * 设置表格大小
     * @param size 表格大小枚举值
     */
    const setTableSize = (size: TableSizeEnum) => (tableSize.value = size)

    /**
     * 设置斑马纹显示状态
     * @param value 是否显示斑马纹
     */
    const setIsZebra = (value: boolean) => (isZebra.value = value)

    /**
     * 设置表格边框显示状态
     * @param value 是否显示边框
     */
    const setIsBorder = (value: boolean) => (isBorder.value = value)

    /**
     * 设置表头背景显示状态
     * @param value 是否显示表头背景
     */
    const setIsHeaderBackground = (value: boolean) => (isHeaderBackground.value = value)

    /**
     * 设置移动端卡片模式
     * @param value 是否启用移动端卡片模式
     */
    const setIsMobileCardMode = (value: boolean) => (isMobileCardMode.value = value)

    /**
     * 设置是否全屏
     * @param value 是否全屏
     */
    const setIsFullScreen = (value: boolean) => (isFullScreen.value = value)

    /**
     * 获取表格列偏好
     * @param key 页面或业务表格唯一标识
     */
    const getColumnPreference = (key: string) => columnPreferences.value[key] || null

    /**
     * 设置表格列偏好
     * @param key 页面或业务表格唯一标识
     * @param preference 列排序和显隐偏好
     */
    const setColumnPreference = (key: string, preference: TableColumnPreference) => {
      columnPreferences.value = {
        ...columnPreferences.value,
        [key]: preference
      }
    }

    /**
     * 删除表格列偏好
     * @param key 页面或业务表格唯一标识
     */
    const removeColumnPreference = (key: string) => {
      const next = { ...columnPreferences.value }
      delete next[key]
      columnPreferences.value = next
    }

    /**
     * 清空所有表格列偏好
     */
    const clearColumnPreferences = () => {
      columnPreferences.value = {}
      clearLegacyColumnPreferenceStorage()
    }

    return {
      tableSize,
      isZebra,
      isBorder,
      isHeaderBackground,
      isMobileCardMode,
      columnPreferences,
      setTableSize,
      setIsZebra,
      setIsBorder,
      setIsHeaderBackground,
      setIsMobileCardMode,
      isFullScreen,
      setIsFullScreen,
      getColumnPreference,
      setColumnPreference,
      removeColumnPreference,
      clearColumnPreferences
    }
  },
  {
    persist: {
      key: 'table',
      storage: localStorage
    }
  }
)
