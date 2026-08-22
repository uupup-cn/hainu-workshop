<!-- 表格头部，包含表格大小、刷新、全屏、列设置、其他设置 -->
<template>
  <div ref="tableHeaderRef" class="flex-cb max-md:!block" id="art-table-header">
    <div class="flex-wrap">
      <slot name="left"></slot>
    </div>

    <div class="flex-c md:justify-end max-md:mt-3 max-sm:!hidden">
      <slot name="beforeRight"></slot>
      <div
        v-if="showSearchBar != null"
        class="button"
        @click="search"
        :class="showSearchBar ? 'active !bg-theme hover:!bg-theme/80' : ''"
      >
        <ArtSvgIcon icon="ri:search-line" :class="showSearchBar ? 'text-white' : 'text-g-700'" />
      </div>
      <div
        v-if="shouldShow('refresh')"
        class="button"
        @click="refresh"
        :class="{ loading: loading && isManualRefresh }"
      >
        <ArtSvgIcon
          icon="ri:refresh-line"
          :class="loading && isManualRefresh ? 'animate-spin text-g-600' : ''"
        />
      </div>

      <ElDropdown
        v-if="shouldShow('size')"
        popper-class="art-table-size-dropdown"
        @command="handleTableSizeChange"
      >
        <div class="button">
          <ArtSvgIcon icon="ri:arrow-up-down-fill" />
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="(item, index) in tableSizeOptions"
              :key="item.value"
              :command="item.value"
              :class="[
                '!justify-center',
                index === tableSizeOptions.length - 1 ? '!mb-0' : '!mb-[3px]',
                tableSize === item.value ? '!bg-g-300/55' : ''
              ]"
            >
              {{ item.label }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div v-if="shouldShow('fullscreen')" class="button" @click="toggleFullScreen">
        <ArtSvgIcon :icon="isFullScreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'" />
      </div>

      <!-- 列设置 -->
      <ElPopover v-if="shouldShow('columns')" placement="bottom" trigger="click" :width="180">
        <template #reference>
          <div class="button">
            <ArtSvgIcon icon="ri:align-right" />
          </div>
        </template>
        <div>
          <ElScrollbar max-height="380px">
            <VueDraggable
              v-model="columns"
              :disabled="false"
              filter=".fixed-column"
              :prevent-on-filter="false"
              @move="checkColumnMove"
            >
              <div
                v-for="item in columns"
                :key="item.prop || item.type"
                class="column-option flex-c gap-2"
                :class="{ 'fixed-column': item.fixed }"
              >
                <div
                  class="drag-icon h-4.5 shrink-0 flex-cc text-g-700"
                  :class="item.fixed ? 'cursor-default text-g-300' : 'cursor-move'"
                >
                  <ArtSvgIcon
                    :icon="item.fixed ? 'ri:unpin-line' : 'ri:drag-move-2-fill'"
                    class="text-base"
                  />
                </div>
                <ElCheckbox
                  :model-value="getColumnVisibility(item)"
                  @update:model-value="(val) => updateColumnVisibility(item, val)"
                  :disabled="item.disabled"
                  class="flex-1 min-w-0 [&_.el-checkbox__label]:overflow-hidden [&_.el-checkbox__label]:text-ellipsis [&_.el-checkbox__label]:whitespace-nowrap"
                  >{{
                    item.label || (item.type === 'selection' ? t('table.selection') : '')
                  }}</ElCheckbox
                >
              </div>
            </VueDraggable>
          </ElScrollbar>
          <div v-if="enableColumnsStorage" class="column-actions">
            <button class="column-action-btn" type="button" @click="resetColumnPreferences">
              <ArtSvgIcon icon="ri:restart-line" class="column-action-icon" />
              <span>重置</span>
            </button>
            <button class="column-action-btn" type="button" @click="saveColumnPreferences">
              <ArtSvgIcon icon="ri:save-3-line" class="column-action-icon" />
              <span>保存</span>
            </button>
          </div>
        </div>
      </ElPopover>
      <!-- 其他设置 -->
      <ElPopover
        v-if="shouldShow('settings')"
        v-model:visible="settingsPopoverVisible"
        placement="bottom-end"
        trigger="click"
        :width="190"
        popper-class="art-table-header-settings-popover"
      >
        <template #reference>
          <div class="button">
            <ArtSvgIcon icon="ri:settings-line" />
          </div>
        </template>
        <div class="settings-options">
          <ElCheckbox v-if="showZebra" v-model="isZebra" :value="true" class="settings-switch">{{
            t('table.zebra')
          }}</ElCheckbox>
          <ElCheckbox v-if="showBorder" v-model="isBorder" :value="true" class="settings-switch">{{
            t('table.border')
          }}</ElCheckbox>
          <ElCheckbox
            v-if="showHeaderBackground"
            v-model="isHeaderBackground"
            :value="true"
            class="settings-switch"
            >{{ t('table.headerBackground') }}</ElCheckbox
          >

          <template v-if="showDataOutput">
            <ElDivider class="settings-divider" />
            <div class="settings-actions">
              <button class="settings-action" type="button" @click="openDataOutput('print')">
                <ArtSvgIcon icon="ri:printer-line" class="settings-action-icon" />
                <span>打印</span>
              </button>
              <button
                class="settings-action is-primary"
                type="button"
                @click="openDataOutput('export')"
              >
                <ArtSvgIcon icon="ri:file-excel-2-line" class="settings-action-icon" />
                <span>导出</span>
              </button>
            </div>
          </template>
        </div>
      </ElPopover>
      <slot name="right"></slot>
    </div>

    <ArtDataOutputDialog
      v-model="dataOutputVisible"
      :mode="dataOutputMode"
      :columns="columns"
      :data="data"
      :selected-data="selectedData"
      :data-provider="dataProvider"
      :title="dataOutputTitle"
      :filename="exportFileName"
      :fallback-container="dataOutputContainer"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent, ref, onMounted, onUnmounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { TableSizeEnum } from '@/enums/formEnum'
  import { useTableStore } from '@/store/modules/table'
  import { VueDraggable } from 'vue-draggable-plus'
  import { useI18n } from 'vue-i18n'
  import type { ColumnOption } from '@/types/component'
  import { ElMessage, ElScrollbar } from 'element-plus'
  import {
    LEGACY_COLUMN_PREFERENCE_STORAGE_PREFIX,
    createColumnPreferenceSnapshot,
    getColumnPreferenceKey,
    mergeColumnsWithPreference,
    parseColumnPreference
  } from '@/utils/table/columnPreferences'
  import type { DataOutputMode, DataOutputProvider } from './data-output'

  defineOptions({ name: 'ArtTableHeader' })

  const { t } = useI18n()
  const ArtDataOutputDialog = defineAsyncComponent(
    () => import('@/components/core/tables/art-data-output-dialog/index.vue')
  )

  interface Props {
    /** 斑马纹 */
    showZebra?: boolean
    /** 边框 */
    showBorder?: boolean
    /** 表头背景 */
    showHeaderBackground?: boolean
    /** 全屏 class */
    fullClass?: string
    /** 组件布局，子组件名用逗号分隔 */
    layout?: string
    /** 加载中 */
    loading?: boolean
    /** 搜索栏显示状态 */
    showSearchBar?: boolean
    /** 当前表格数据，未传入时会从当前表格 DOM 降级提取 */
    data?: Record<string, any>[]
    /** 当前页数据提供器，用于打印/导出 */
    dataProvider?: DataOutputProvider
    /** 表格当前勾选的数据，用于“选择的数据”打印/导出 */
    selectedData?: Record<string, any>[]
    /** 打印标题 */
    dataOutputTitle?: string
    /** 导出文件名前缀 */
    exportFileName?: string
    /** 是否在设置面板展示打印、导出入口 */
    showDataOutput?: boolean
    /** 是否保存列排序和显隐偏好 */
    enableColumnsStorage?: boolean
    /** 列偏好的本地存储 key，多表页面建议显式传入 */
    columnsStorageKey?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    showZebra: true,
    showBorder: true,
    showHeaderBackground: true,
    fullClass: 'art-page-view',
    layout: 'search,refresh,size,fullscreen,columns,settings',
    showSearchBar: undefined,
    data: () => [],
    selectedData: () => [],
    dataOutputTitle: '表格数据',
    exportFileName: '导出数据',
    showDataOutput: true,
    enableColumnsStorage: true
  })

  const columns = defineModel<ColumnOption[]>('columns', {
    required: false,
    default: () => []
  })

  const emit = defineEmits<{
    (e: 'refresh'): void
    (e: 'search'): void
    (e: 'update:showSearchBar', value: boolean): void
  }>()

  /**
   * 获取列的显示状态
   * 优先使用 visible 字段，如果不存在则使用 checked 字段
   */
  const getColumnVisibility = (col: ColumnOption): boolean => {
    if (col.visible !== undefined) {
      return col.visible
    }
    return col.checked ?? true
  }

  /**
   * 更新列的显示状态
   * 同时更新 checked 和 visible 字段以保持兼容性
   */
  const updateColumnVisibility = (col: ColumnOption, value: boolean | string | number): void => {
    const boolValue = !!value
    col.checked = boolValue
    col.visible = boolValue
  }

  /** 表格大小选项配置 */
  const tableSizeOptions = [
    { value: TableSizeEnum.SMALL, label: t('table.sizeOptions.small') },
    { value: TableSizeEnum.DEFAULT, label: t('table.sizeOptions.default') },
    { value: TableSizeEnum.LARGE, label: t('table.sizeOptions.large') }
  ]

  const tableStore = useTableStore()
  const route = useRoute()
  const { tableSize, isZebra, isBorder, isHeaderBackground } = storeToRefs(tableStore)
  const tableHeaderRef = ref<HTMLElement>()
  const settingsPopoverVisible = ref(false)
  const dataOutputVisible = ref(false)
  const dataOutputMode = ref<DataOutputMode>('export')
  const defaultColumns = ref<ColumnOption[]>([])
  const TABLE_COLUMN_DRAG_SORT_EVENT = 'art-table-column-drag-sort'

  interface TableColumnDragSortDetail {
    orderedKeys: string[]
  }

  const dataOutputContainer = computed(
    () => tableHeaderRef.value?.closest('.el-card') as HTMLElement | null
  )

  const columnPreferenceKey = computed(
    () => props.columnsStorageKey || (route.name ? String(route.name) : route.path || 'default')
  )

  /** 解析 layout 属性，转换为数组 */
  const layoutItems = computed(() => {
    return props.layout.split(',').map((item) => item.trim())
  })

  /**
   * 检查组件是否应该显示
   * @param componentName 组件名称
   * @returns 是否显示
   */
  const shouldShow = (componentName: string) => {
    return layoutItems.value.includes(componentName)
  }

  const cloneColumns = (source: ColumnOption[]) => source.map((column) => ({ ...column }))

  const cacheDefaultColumns = () => {
    if (!defaultColumns.value.length && columns.value.length) {
      defaultColumns.value = cloneColumns(columns.value)
    }
  }

  const saveColumnPreferences = () => {
    if (!props.enableColumnsStorage || !columns.value.length) return

    tableStore.setColumnPreference(
      columnPreferenceKey.value,
      createColumnPreferenceSnapshot(columns.value)
    )
    ElMessage.success('列设置已保存')
  }

  const resetColumnPreferences = () => {
    if (!props.enableColumnsStorage || !defaultColumns.value.length) return

    tableStore.removeColumnPreference(columnPreferenceKey.value)
    columns.value = cloneColumns(defaultColumns.value)
    ElMessage.success('列设置已重置')
  }

  const restoreColumnPreferences = () => {
    if (!props.enableColumnsStorage || !columns.value.length) return

    try {
      const preference =
        migrateLegacyColumnPreference() || tableStore.getColumnPreference(columnPreferenceKey.value)
      if (!preference) return

      columns.value = mergeColumnsWithPreference(columns.value, preference)
    } catch {
      // Ignore invalid saved preferences and keep the table usable.
    }
  }

  const isSameTableHost = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false

    const headerHost = tableHeaderRef.value?.closest('.el-card')
    const tableHost = target.closest('.el-card')

    return !!headerHost && headerHost === tableHost
  }

  const applyHeaderDragSort = (orderedKeys: string[]) => {
    if (orderedKeys.length < 2 || !columns.value.length) return

    const orderedKeySet = new Set(orderedKeys)
    const currentEntries = columns.value.map((column, index) => ({
      column,
      key: getColumnPreferenceKey(column, index)
    }))
    const entryByKey = new Map(currentEntries.map((entry) => [entry.key, entry]))
    const orderedMovableColumns = orderedKeys
      .map((key) => entryByKey.get(key)?.column)
      .filter((column): column is ColumnOption => !!column && !column.fixed)

    if (orderedMovableColumns.length < 2) return

    const movableQueue = [...orderedMovableColumns]
    const nextColumns = currentEntries.map((entry) => {
      if (entry.column.fixed || !orderedKeySet.has(entry.key)) return entry.column
      return movableQueue.shift() ?? entry.column
    })

    const currentOrder = currentEntries.map((entry) => entry.key).join('|')
    const nextOrder = nextColumns
      .map((column, index) => getColumnPreferenceKey(column, index))
      .join('|')

    if (currentOrder === nextOrder) return

    columns.value = nextColumns
  }

  const handleTableColumnDragSort = (event: Event) => {
    if (!isSameTableHost(event.target)) return

    const { orderedKeys } = (event as CustomEvent<TableColumnDragSortDetail>).detail || {}
    if (!Array.isArray(orderedKeys)) return

    applyHeaderDragSort(orderedKeys)
  }

  const migrateLegacyColumnPreference = () => {
    if (typeof window === 'undefined') return null

    try {
      const legacyKey = `${LEGACY_COLUMN_PREFERENCE_STORAGE_PREFIX}:${columnPreferenceKey.value}`
      const preference = parseColumnPreference(window.localStorage.getItem(legacyKey))
      window.localStorage.removeItem(legacyKey)

      if (preference) {
        tableStore.setColumnPreference(columnPreferenceKey.value, preference)
      }

      return preference
    } catch {
      return null
    }
  }

  /**
   * 拖拽移动事件处理 - 防止固定列位置改变
   * @param evt move事件对象
   * @returns 是否允许移动
   */
  const checkColumnMove = (event: any) => {
    // 拖拽进入的目标 DOM 元素
    const toElement = event.related as HTMLElement
    // 如果目标位置是 fixed 列，则不允许移动
    if (toElement && toElement.classList.contains('fixed-column')) {
      return false
    }
    return true
  }

  /** 搜索事件处理 */
  const search = () => {
    // 切换搜索栏显示状态
    emit('update:showSearchBar', !props.showSearchBar)
    emit('search')
  }

  /** 刷新事件处理 */
  const refresh = () => {
    isManualRefresh.value = true
    emit('refresh')
  }

  /**
   * 表格大小变化处理
   * @param command 表格大小枚举值
   */
  const handleTableSizeChange = (command: TableSizeEnum) => {
    useTableStore().setTableSize(command)
  }

  const openDataOutput = (mode: DataOutputMode) => {
    dataOutputMode.value = mode
    settingsPopoverVisible.value = false
    dataOutputVisible.value = true
  }

  /** 是否手动点击刷新 */
  const isManualRefresh = ref(false)

  /** 加载中 */
  const isFullScreen = ref(false)

  /** 保存原始的 overflow 样式，用于退出全屏时恢复 */
  const originalOverflow = ref('')

  /**
   * 切换全屏状态
   * 进入全屏时会隐藏页面滚动条，退出时恢复原状态
   */
  const toggleFullScreen = () => {
    const el = document.querySelector(`.${props.fullClass}`)
    if (!el) return

    isFullScreen.value = !isFullScreen.value

    if (isFullScreen.value) {
      // 进入全屏：保存原始样式并隐藏滚动条
      originalOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      el.classList.add('el-full-screen')
      tableStore.setIsFullScreen(true)
    } else {
      // 退出全屏：恢复原始样式
      document.body.style.overflow = originalOverflow.value
      el.classList.remove('el-full-screen')
      tableStore.setIsFullScreen(false)
    }
  }

  /**
   * ESC键退出全屏的事件处理器
   * 需要保存引用以便在组件卸载时正确移除监听器
   */
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullScreen.value) {
      toggleFullScreen()
    }
  }

  /** 组件挂载时注册全局事件监听器 */
  onMounted(() => {
    cacheDefaultColumns()
    restoreColumnPreferences()
    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener(TABLE_COLUMN_DRAG_SORT_EVENT, handleTableColumnDragSort)
  })

  watch(
    () => columns.value.length,
    () => {
      cacheDefaultColumns()
      restoreColumnPreferences()
    },
    { flush: 'post' }
  )

  watch(columnPreferenceKey, restoreColumnPreferences, { flush: 'post' })

  /** 组件卸载时清理资源 */
  onUnmounted(() => {
    // 移除事件监听器
    document.removeEventListener('keydown', handleEscapeKey)
    document.removeEventListener(TABLE_COLUMN_DRAG_SORT_EVENT, handleTableColumnDragSort)

    // 如果组件在全屏状态下被卸载，恢复页面滚动状态
    if (isFullScreen.value) {
      document.body.style.overflow = originalOverflow.value
      const el = document.querySelector(`.${props.fullClass}`)
      if (el) {
        el.classList.remove('el-full-screen')
      }
    }
  })
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .button {
    @apply ml-2 
    size-8 
    flex 
    items-center 
    justify-center 
    cursor-pointer 
    rounded-md 
    bg-g-300/55
    dark:bg-g-300/40
    text-g-700  
    hover:bg-g-300 
    md:ml-0 
    md:mr-2.5;
  }

  .settings-divider {
    margin: 4px 0 0;
  }

  .column-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .column-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
    color: var(--art-gray-700);
    white-space: nowrap;
    cursor: pointer;
    background: var(--el-fill-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 999px;
    transition:
      color 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease;
  }

  .column-action-btn:hover {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color);
  }

  .column-action-icon {
    margin-right: 6px;
    font-size: 14px;
  }

  .settings-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .settings-switch {
    width: 100%;
    height: 24px;
    margin-right: 0;
    font-weight: 400;
    color: var(--art-gray-700);
  }

  .settings-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    margin: 4px 0;
  }

  .settings-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 28px;
    padding: 0 10px;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    background: var(--el-fill-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 999px;
    transition:
      color 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease;
  }

  .settings-action.is-primary {
    background: var(--el-fill-color);
  }

  .settings-action:hover,
  .settings-action.is-primary:hover {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color);
  }

  .settings-action-icon {
    margin-right: 6px;
  }
</style>

<style>
  .art-table-size-dropdown .el-dropdown-menu {
    min-width: 88px;
  }
</style>
