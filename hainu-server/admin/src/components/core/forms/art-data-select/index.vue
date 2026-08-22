<template>
  <div class="art-data-select w-full">
    <div
      v-if="showTrigger"
      role="button"
      tabindex="0"
      class="group flex min-h-9 w-full items-center justify-between gap-2 rounded-custom-xs border border-[var(--default-border)] bg-box px-3 py-1.5 text-left text-sm text-g-900 transition-all duration-200 hover:border-theme/60 hover:bg-hover-color focus:border-theme focus:outline-none"
      :class="{
        'cursor-not-allowed opacity-60 hover:border-[var(--default-border)] hover:bg-box': disabled
      }"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
    >
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        <template v-if="confirmedSelectedItems.length">
          <template v-if="multiple">
            <span
              v-for="item in confirmedSelectedItems.slice(0, 3)"
              :key="String(getRowKey(item))"
              class="inline-flex max-w-[160px] items-center rounded bg-g-200 px-1.5 py-0.5 text-xs text-g-800"
            >
              <span class="truncate">{{ getRowLabel(item) }}</span>
            </span>
            <span v-if="confirmedSelectedItems.length > 3" class="text-xs text-g-600">
              +{{ confirmedSelectedItems.length - 3 }}
            </span>
          </template>
          <span v-else class="truncate">{{ getRowLabel(confirmedSelectedItems[0]) }}</span>
        </template>
        <span v-else class="truncate text-g-500">{{ placeholder }}</span>
      </div>

      <div class="flex shrink-0 items-center gap-1 text-g-500">
        <button
          v-if="clearable && confirmedSelectedItems.length && !disabled"
          type="button"
          class="flex size-5 items-center justify-center rounded text-g-500 opacity-0 transition-all duration-200 hover:bg-g-300 hover:text-g-900 group-hover:opacity-100"
          @click.stop="clearConfirmedSelection"
        >
          <ArtSvgIcon icon="ri:close-line" class="text-base" />
        </button>
        <ArtSvgIcon
          icon="ri:arrow-down-s-line"
          class="text-base transition-transform duration-200"
        />
      </div>
    </div>

    <ElDialog
      v-model="dialogVisible"
      :width="resolvedDialogWidth"
      :fullscreen="fullscreen"
      :show-close="false"
      align-center
      append-to-body
      class="art-data-select-dialog flex max-h-[calc(100dvh_-_48px)] flex-col"
      @opened="syncTreeCheckedState"
      @close="handleClosed"
    >
      <template #header>
        <div
          class="flex items-start justify-between gap-5 border-b border-[var(--default-border)] px-6 py-5"
        >
          <div class="min-w-0">
            <div class="text-[17px] font-semibold leading-6 text-g-900">{{ title }}</div>
            <p class="mt-1 text-xs text-g-600">
              {{ helperText }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-custom-xs text-g-600 transition-all duration-200 hover:bg-hover-color hover:text-g-900 active:scale-95"
              @click="fullscreen = !fullscreen"
            >
              <ArtSvgIcon
                :icon="fullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'"
                class="text-lg"
              />
            </button>
            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-custom-xs text-g-600 transition-all duration-200 hover:bg-hover-color hover:text-g-900 active:scale-95"
              @click="cancel"
            >
              <ArtSvgIcon icon="ri:close-line" class="text-lg" />
            </button>
          </div>
        </div>
      </template>

      <ElScrollbar :max-height="resolvedBodyMaxHeight">
        <div class="flex min-h-0 flex-col gap-4 px-6 py-5">
          <div
            v-if="showSearch || filterOptions.length || $slots.toolbar"
            class="grid grid-cols-1 gap-3"
            :class="toolbarGridClass"
          >
            <ElInput
              v-if="showSearch"
              v-model="searchKeyword"
              clearable
              :placeholder="searchPlaceholder"
              @input="emitSearch"
            >
              <template #prefix>
                <ArtSvgIcon icon="ri:search-line" class="text-base text-g-500" />
              </template>
            </ElInput>

            <ElSelect
              v-if="filterOptions.length"
              v-model="activeFilter"
              clearable
              :placeholder="filterPlaceholder"
              @change="currentPage = 1"
            >
              <ElOption
                v-for="option in filterOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>

            <slot name="toolbar" :selected="draftSelectedItems" :clear="clearDraftSelection" />
          </div>

          <div
            class="grid gap-4"
            :class="selectedPanelVisible ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : 'grid-cols-1'"
          >
            <section
              class="min-w-0 overflow-hidden rounded-custom-xs border border-[var(--default-border)] bg-box shadow-[0_1px_0_rgba(15,23,42,0.02)]"
              :style="contentPanelStyle"
            >
              <div
                v-if="mode === 'table'"
                class="flex h-full flex-col"
                :style="tablePanelStyle"
                v-loading="loading"
              >
                <ElScrollbar class="min-h-0 flex-1">
                  <table
                    class="art-data-select-table min-w-full border-collapse text-sm"
                    :style="tableStyle"
                  >
                    <thead class="sticky top-0 z-10 bg-[var(--default-bg-color)] text-g-700">
                      <tr class="border-b border-[var(--default-border)]">
                        <th class="w-14 px-4 py-3 text-left font-medium">
                          <ElCheckbox
                            v-if="multiple"
                            :model-value="allPageChecked"
                            :indeterminate="pageIndeterminate"
                            :disabled="!pageSelectableRows.length"
                            @change="toggleCurrentPage"
                          />
                        </th>
                        <th
                          v-for="column in normalizedColumns"
                          :key="column.prop"
                          class="whitespace-nowrap px-4 py-3 font-medium"
                          :class="getColumnAlignClass(column.align)"
                          :style="getColumnStyle(column)"
                        >
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in pagedTableRows"
                        :key="String(getRowKey(row))"
                        class="border-b border-[var(--default-border)] transition-colors duration-150 last:border-b-0"
                        :class="[
                          'hover:bg-[var(--art-hover-color)]',
                          isRowDisabled(row) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        ]"
                        @click="handleTableRowClick(row)"
                      >
                        <td class="w-14 px-4 py-3">
                          <ElCheckbox
                            :model-value="isRowSelected(row)"
                            :disabled="isRowDisabled(row)"
                            @change="toggleTableRow(row)"
                            @click.stop
                          />
                        </td>
                        <td
                          v-for="column in normalizedColumns"
                          :key="column.prop"
                          class="min-w-0 px-4 py-3 text-g-800"
                          :class="getColumnAlignClass(column.align)"
                          :style="getColumnStyle(column)"
                        >
                          <slot
                            :name="`cell-${column.prop}`"
                            :row="row"
                            :column="column"
                            :value="row[column.prop]"
                          >
                            <span class="block truncate">{{ getCellText(row, column) }}</span>
                          </slot>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div
                    v-if="!pagedTableRows.length && !loading"
                    class="flex h-full min-h-[280px] items-center justify-center"
                  >
                    <ElEmpty :description="emptyText" :image-size="96" />
                  </div>
                </ElScrollbar>

                <div
                  v-if="showPagination"
                  class="flex flex-col gap-2 border-t border-[var(--default-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span class="text-xs text-g-600">共 {{ filteredTableRows.length }} 条</span>
                  <ElPagination
                    v-model:current-page="currentPage"
                    v-model:page-size="internalPageSize"
                    size="small"
                    background
                    layout="prev, pager, next, sizes"
                    :pager-count="resolvedPagerCount"
                    :page-sizes="pageSizes"
                    :total="filteredTableRows.length"
                    @change="emitPageChange"
                  />
                </div>
              </div>

              <div v-else class="h-full p-3" v-loading="loading">
                <ElScrollbar :height="resolvedTreeHeight">
                  <ElTree
                    v-if="treeDisplayData.length || loading"
                    ref="treeRef"
                    class="art-data-select-tree"
                    :data="treeDisplayData"
                    :node-key="valueKey"
                    :props="treeProps"
                    :show-checkbox="multiple"
                    :check-strictly="treeCheckStrictly"
                    :default-expand-all="defaultExpandAll"
                    :expand-on-click-node="false"
                    :highlight-current="!multiple"
                    :current-node-key="currentTreeKey"
                    empty-text=""
                    @check="syncTreeDraftKeys"
                    @node-click="handleTreeNodeClick"
                  >
                    <template #default="{ data }">
                      <div class="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2.5">
                        <span class="truncate">{{ data[labelKey] }}</span>
                        <ArtSvgIcon
                          v-if="!multiple && currentTreeKey === data[valueKey]"
                          icon="ri:check-line"
                          class="shrink-0 text-base text-g-600"
                        />
                      </div>
                    </template>
                  </ElTree>

                  <div
                    v-else
                    class="flex items-center justify-center"
                    :style="{ height: resolvedTreeHeight }"
                  >
                    <ElEmpty :description="emptyText" :image-size="96" class="-translate-y-4" />
                  </div>
                </ElScrollbar>
              </div>
            </section>

            <aside
              v-if="selectedPanelVisible"
              class="flex min-h-[348px] flex-col overflow-hidden rounded-custom-xs border border-[var(--default-border)] bg-box shadow-[0_1px_0_rgba(15,23,42,0.02)]"
              :style="contentPanelStyle"
            >
              <div
                class="flex items-center justify-between border-b border-[var(--default-border)] bg-[var(--default-bg-color)] px-4 py-3"
              >
                <div class="text-sm font-medium text-g-900"
                  >已选 {{ draftSelectedItems.length }}</div
                >
                <button
                  type="button"
                  class="cursor-pointer text-xs text-theme transition-colors hover:text-theme/80 disabled:cursor-not-allowed disabled:text-g-400"
                  :disabled="!draftSelectedItems.length"
                  @click="clearDraftSelection"
                >
                  {{ clearText }}
                </button>
              </div>

              <ElScrollbar class="min-h-0 flex-1">
                <div
                  v-if="draftSelectedItems.length"
                  class="divide-y divide-[var(--default-border)]"
                >
                  <div
                    v-for="item in draftSelectedItems"
                    :key="String(getRowKey(item))"
                    class="group flex items-start gap-3 px-4 py-3 transition-[background-color] duration-150 hover:bg-hover-color"
                  >
                    <div
                      v-if="mode !== 'tree'"
                      class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded bg-theme/10 text-theme"
                    >
                      <ArtSvgIcon icon="ri:building-4-line" class="text-base" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <slot name="selected-item" :item="item">
                        <div class="truncate text-sm text-g-900">{{ getRowLabel(item) }}</div>
                        <div v-if="getRowSubtitle(item)" class="mt-0.5 truncate text-xs text-g-500">
                          {{ getRowSubtitle(item) }}
                        </div>
                      </slot>
                    </div>
                    <button
                      type="button"
                      class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-g-600 transition-all duration-150 hover:bg-g-200 hover:text-g-900 active:scale-95"
                      @click="removeDraftItem(item)"
                    >
                      <ArtSvgIcon icon="ri:close-line" class="text-base" />
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="flex h-[260px] flex-col items-center justify-center px-5 text-center"
                >
                  <div
                    class="flex size-10 items-center justify-center rounded-full bg-g-200 text-g-500"
                  >
                    <ArtSvgIcon icon="ri:inbox-line" class="text-xl" />
                  </div>
                  <div class="mt-3 text-sm text-g-700">暂无选择</div>
                  <div class="mt-1 text-xs leading-5 text-g-500"
                    >从左侧列表选择后将在这里集中管理</div
                  >
                </div>
              </ElScrollbar>
            </aside>
          </div>
        </div>
      </ElScrollbar>

      <template #footer>
        <div
          class="flex flex-col gap-3 border-t border-[var(--default-border)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="text-xs text-g-600">
            {{ multiple ? `当前已选择 ${draftSelectedItems.length} 项` : singleFooterText }}
          </div>
          <div class="flex justify-end gap-2">
            <ElButton @click="cancel">{{ cancelText }}</ElButton>
            <ElButton type="primary" :disabled="confirmDisabled" @click="confirm">{{
              okText
            }}</ElButton>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, useSlots, watch, type CSSProperties } from 'vue'
  import type { TreeInstance, TreeOptionProps } from 'element-plus'

  defineOptions({ name: 'ArtDataSelect' })

  export type DataSelectKey = string | number
  export type DataSelectMode = 'table' | 'tree'

  export interface DataSelectOption {
    [key: string]: any
    disabled?: boolean
    children?: DataSelectOption[]
  }

  export interface DataSelectColumn {
    prop: string
    label: string
    width?: string | number
    minWidth?: string | number
    align?: 'left' | 'center' | 'right'
    formatter?: (row: DataSelectOption, column: DataSelectColumn) => string | number
  }

  export interface DataSelectFilterOption {
    label: string
    value: string | number | boolean
  }

  interface Props {
    modelValue?: DataSelectKey | DataSelectKey[] | null
    selectedItems?: DataSelectOption[]
    data?: DataSelectOption[]
    columns?: DataSelectColumn[]
    mode?: DataSelectMode
    multiple?: boolean
    title?: string
    placeholder?: string
    helperText?: string
    searchPlaceholder?: string
    filterPlaceholder?: string
    valueKey?: string
    labelKey?: string
    subtitleKey?: string
    childrenKey?: string
    tagKey?: string
    searchKeys?: string[]
    filterKey?: string
    filterOptions?: DataSelectFilterOption[]
    showTrigger?: boolean
    disabled?: boolean
    clearable?: boolean
    showSelectedPanel?: boolean
    showSearch?: boolean
    showPagination?: boolean
    pageSize?: number
    pageSizes?: number[]
    pagerCount?: number
    dialogWidth?: string
    bodyMaxHeight?: string
    maxHeight?: string
    emptyText?: string
    loading?: boolean
    selectOnRowClick?: boolean
    defaultExpandAll?: boolean
    treeCheckStrictly?: boolean
    reserveKeyword?: boolean
    okText?: string
    cancelText?: string
    clearText?: string
    selectable?: (row: DataSelectOption) => boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    selectedItems: () => [],
    data: () => [],
    columns: () => [],
    mode: 'table',
    multiple: true,
    title: '选择数据',
    placeholder: '请选择',
    helperText: '支持搜索、筛选和回显，确认后写入当前表单。',
    searchPlaceholder: '请输入关键词',
    filterPlaceholder: '请选择分类',
    valueKey: 'id',
    labelKey: 'name',
    subtitleKey: 'code',
    childrenKey: 'children',
    tagKey: '',
    searchKeys: () => [],
    filterKey: '',
    filterOptions: () => [],
    showTrigger: true,
    disabled: false,
    clearable: true,
    showSelectedPanel: true,
    showSearch: true,
    showPagination: false,
    pageSize: 10,
    pageSizes: () => [10, 20, 30],
    pagerCount: 5,
    dialogWidth: '',
    bodyMaxHeight: '',
    maxHeight: '',
    emptyText: '暂无数据',
    loading: false,
    selectOnRowClick: true,
    defaultExpandAll: true,
    treeCheckStrictly: true,
    reserveKeyword: false,
    okText: '确定',
    cancelText: '取消',
    clearText: '清空',
    selectable: undefined
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: DataSelectKey | DataSelectKey[] | null): void
    (e: 'update:selectedItems', value: DataSelectOption[]): void
    (e: 'change', value: DataSelectKey | DataSelectKey[] | null, rows: DataSelectOption[]): void
    (e: 'confirm', value: DataSelectKey | DataSelectKey[] | null, rows: DataSelectOption[]): void
    (e: 'cancel'): void
    (e: 'open'): void
    (e: 'close'): void
    (e: 'search', keyword: string): void
    (e: 'clear'): void
    (e: 'page-change', page: number, pageSize: number): void
  }>()

  const dialogVisible = ref(false)
  const fullscreen = ref(false)
  const draftKeys = ref<DataSelectKey[]>([])
  const searchKeyword = ref('')
  const activeFilter = ref<string | number | boolean | ''>('')
  const currentPage = ref(1)
  const internalPageSize = ref(props.pageSize)
  const treeRef = ref<TreeInstance>()
  const slots = useSlots()

  const treeProps = computed<TreeOptionProps>(() => ({
    children: props.childrenKey,
    label: props.labelKey,
    disabled: 'disabled'
  }))

  const selectedPanelVisible = computed(() => props.showSelectedPanel)

  const resolvedDialogWidth = computed(() => {
    if (props.dialogWidth) return props.dialogWidth
    if (props.mode === 'tree') return props.showSelectedPanel ? '780px' : '620px'
    return '1120px'
  })

  const resolvedTreeHeight = computed(() => {
    if (props.maxHeight) return props.maxHeight
    return '320px'
  })

  const resolvedTableHeight = computed(() => props.maxHeight || '348px')

  const resolvedContentHeight = computed(() => {
    if (props.mode === 'tree') return `calc(${resolvedTreeHeight.value} + 24px)`
    if (props.mode === 'table' && selectedPanelVisible.value) return resolvedTableHeight.value
    if (props.mode === 'table' && props.maxHeight) return props.maxHeight
    return undefined
  })

  const contentPanelStyle = computed<CSSProperties>(() => {
    if (!resolvedContentHeight.value) return {}
    return {
      height: resolvedContentHeight.value,
      minHeight: resolvedContentHeight.value
    }
  })

  const tablePanelStyle = computed<CSSProperties>(() => {
    if (resolvedContentHeight.value) {
      return {
        height: '100%',
        minHeight: '100%'
      }
    }

    return {
      minHeight: resolvedTableHeight.value
    }
  })

  const resolvedBodyMaxHeight = computed(() => props.bodyMaxHeight || 'calc(100dvh - 210px)')

  const resolvedPagerCount = computed(() => {
    const count = Math.max(5, Math.min(21, props.pagerCount))
    return count % 2 === 0 ? count - 1 : count
  })

  const toolbarGridClass = computed(() => {
    const hasFilter = props.filterOptions.length > 0
    const hasToolbar = Boolean(slots.toolbar)

    if (hasFilter && hasToolbar) return 'md:grid-cols-[minmax(0,1fr)_220px_auto]'
    if (hasFilter) return 'md:grid-cols-[minmax(0,1fr)_220px]'
    if (hasToolbar) return 'md:grid-cols-[minmax(0,1fr)_auto]'
    return 'grid-cols-1'
  })

  const normalizedColumns = computed<DataSelectColumn[]>(() => {
    if (props.columns.length) return props.columns

    return [
      { prop: props.valueKey, label: 'ID', width: 92 },
      { prop: props.labelKey, label: '名称', minWidth: 220 },
      { prop: props.subtitleKey, label: '编码', minWidth: 120 }
    ]
  })

  const modelKeys = computed<DataSelectKey[]>(() => normalizeKeys(props.modelValue))

  const optionMap = computed(() => {
    const map = new Map<DataSelectKey, DataSelectOption>()
    registerOptions(map, props.data)
    registerOptions(map, props.selectedItems)
    modelKeys.value.forEach((key) => {
      if (!map.has(key)) {
        map.set(key, {
          [props.valueKey]: key,
          [props.labelKey]: String(key)
        })
      }
    })
    draftKeys.value.forEach((key) => {
      if (!map.has(key)) {
        map.set(key, {
          [props.valueKey]: key,
          [props.labelKey]: String(key)
        })
      }
    })
    return map
  })

  const confirmedSelectedItems = computed(
    () =>
      modelKeys.value.map((key) => optionMap.value.get(key)).filter(Boolean) as DataSelectOption[]
  )

  const draftSelectedItems = computed(
    () =>
      draftKeys.value.map((key) => optionMap.value.get(key)).filter(Boolean) as DataSelectOption[]
  )

  const filteredTableRows = computed(() => filterRows(props.data))

  const pagedTableRows = computed(() => {
    if (!props.showPagination) return filteredTableRows.value
    const start = (currentPage.value - 1) * internalPageSize.value
    return filteredTableRows.value.slice(start, start + internalPageSize.value)
  })

  const pageSelectableRows = computed(() =>
    pagedTableRows.value.filter((row) => !isRowDisabled(row))
  )

  const allPageChecked = computed(
    () =>
      pageSelectableRows.value.length > 0 &&
      pageSelectableRows.value.every((row) => draftKeys.value.includes(getRowKey(row)))
  )

  const pageIndeterminate = computed(() => {
    const selectedCount = pageSelectableRows.value.filter((row) =>
      draftKeys.value.includes(getRowKey(row))
    ).length
    return selectedCount > 0 && selectedCount < pageSelectableRows.value.length
  })

  const treeDisplayData = computed(() => markTreeDisabled(filterTree(props.data)))

  const confirmDisabled = computed(() => false)

  const currentTreeKey = computed(() => (props.multiple ? undefined : draftKeys.value[0]))

  const tableMinWidth = computed(() => {
    const selectionColumnWidth = 56
    const fallbackColumnWidth = 132

    return normalizedColumns.value.reduce((total, column) => {
      return total + resolveColumnWidth(column.width ?? column.minWidth, fallbackColumnWidth)
    }, selectionColumnWidth)
  })

  const tableStyle = computed<CSSProperties>(() => ({
    width: '100%',
    minWidth: `${tableMinWidth.value}px`
  }))

  const singleFooterText = computed(() => {
    if (!draftSelectedItems.value.length) return '当前未选择'
    return `当前选择：${getRowLabel(draftSelectedItems.value[0])}`
  })

  watch(
    () => props.modelValue,
    () => {
      if (!dialogVisible.value) {
        draftKeys.value = modelKeys.value
      }
    },
    { immediate: true }
  )

  watch(
    () => props.pageSize,
    (value) => {
      internalPageSize.value = value
    }
  )

  watch([searchKeyword, activeFilter, internalPageSize], () => {
    currentPage.value = 1
    nextTick(syncTreeCheckedState)
  })

  watch(draftKeys, () => {
    nextTick(syncTreeCheckedState)
  })

  function normalizeKeys(value: Props['modelValue']): DataSelectKey[] {
    if (Array.isArray(value)) return value
    if (value === null || value === undefined || value === '') return []
    return [value]
  }

  function registerOptions(map: Map<DataSelectKey, DataSelectOption>, rows: DataSelectOption[]) {
    rows.forEach((row) => {
      map.set(getRowKey(row), row)
      const children = getChildren(row)
      if (children.length) registerOptions(map, children)
    })
  }

  function getChildren(row: DataSelectOption): DataSelectOption[] {
    return Array.isArray(row[props.childrenKey]) ? row[props.childrenKey] : []
  }

  function getRowKey(row: DataSelectOption): DataSelectKey {
    return row[props.valueKey] as DataSelectKey
  }

  function getRowLabel(row: DataSelectOption): string {
    return String(row[props.labelKey] ?? row.label ?? row.name ?? row[props.valueKey] ?? '')
  }

  function getRowSubtitle(row: DataSelectOption): string {
    if (!props.subtitleKey) return ''
    return String(row[props.subtitleKey] ?? '')
  }

  function getCellText(row: DataSelectOption, column: DataSelectColumn) {
    if (column.formatter) return column.formatter(row, column)
    return row[column.prop] ?? '-'
  }

  function getColumnStyle(column: DataSelectColumn): CSSProperties {
    return {
      width: typeof column.width === 'number' ? `${column.width}px` : column.width,
      minWidth: typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
    }
  }

  function resolveColumnWidth(value: DataSelectColumn['width'], fallback: number) {
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.endsWith('px')) {
      const parsed = Number.parseInt(value, 10)
      return Number.isFinite(parsed) ? parsed : fallback
    }
    return fallback
  }

  function getColumnAlignClass(align: DataSelectColumn['align']) {
    if (align === 'center') return 'text-center'
    if (align === 'right') return 'text-right'
    return 'text-left'
  }

  function isRowDisabled(row: DataSelectOption): boolean {
    return Boolean(row.disabled || (props.selectable && !props.selectable(row)))
  }

  function isRowSelected(row: DataSelectOption): boolean {
    return draftKeys.value.includes(getRowKey(row))
  }

  function filterRows(rows: DataSelectOption[]) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    const keys = props.searchKeys.length
      ? props.searchKeys
      : Array.from(
          new Set(
            [
              props.valueKey,
              props.labelKey,
              props.subtitleKey,
              props.tagKey,
              ...normalizedColumns.value.map((column) => column.prop)
            ].filter(Boolean)
          )
        )

    return rows.filter((row) => {
      const keywordMatched =
        !keyword ||
        keys.some((key) =>
          String(row[key] ?? '')
            .toLowerCase()
            .includes(keyword)
        )
      const filterMatched =
        !props.filterKey || activeFilter.value === '' || row[props.filterKey] === activeFilter.value
      return keywordMatched && filterMatched
    })
  }

  function filterTree(rows: DataSelectOption[]): DataSelectOption[] {
    const keyword = searchKeyword.value.trim().toLowerCase()
    const keys = props.searchKeys.length
      ? props.searchKeys
      : [props.valueKey, props.labelKey, props.subtitleKey, props.tagKey].filter(Boolean)

    return rows
      .map((row) => {
        const children = filterTree(getChildren(row))
        const keywordMatched =
          !keyword ||
          keys.some((key) =>
            String(row[key] ?? '')
              .toLowerCase()
              .includes(keyword)
          )
        const filterMatched =
          !props.filterKey ||
          activeFilter.value === '' ||
          row[props.filterKey] === activeFilter.value

        if ((keywordMatched && filterMatched) || children.length) {
          return { ...row, [props.childrenKey]: children }
        }

        return null
      })
      .filter(Boolean) as DataSelectOption[]
  }

  function markTreeDisabled(rows: DataSelectOption[]): DataSelectOption[] {
    return rows.map((row) => ({
      ...row,
      disabled: isRowDisabled(row),
      [props.childrenKey]: markTreeDisabled(getChildren(row))
    }))
  }

  function open() {
    if (props.disabled) return

    draftKeys.value = modelKeys.value
    dialogVisible.value = true
    fullscreen.value = false
    if (!props.reserveKeyword) {
      searchKeyword.value = ''
      activeFilter.value = ''
    }
    emit('open')
    nextTick(syncTreeCheckedState)
  }

  function close() {
    dialogVisible.value = false
  }

  function cancel() {
    emit('cancel')
    close()
  }

  function handleClosed() {
    emit('close')
  }

  function confirm() {
    const value = props.multiple ? [...draftKeys.value] : (draftKeys.value[0] ?? null)
    const rows = [...draftSelectedItems.value]
    emit('update:modelValue', value)
    emit('update:selectedItems', rows)
    emit('change', value, rows)
    emit('confirm', value, rows)
    close()
  }

  function clearConfirmedSelection() {
    const value = props.multiple ? [] : null
    emit('update:modelValue', value)
    emit('update:selectedItems', [])
    emit('change', value, [])
    emit('clear')
  }

  function clearDraftSelection() {
    draftKeys.value = []
    treeRef.value?.setCheckedKeys([])
    emit('clear')
  }

  function removeDraftItem(item: DataSelectOption) {
    const key = getRowKey(item)
    draftKeys.value = draftKeys.value.filter((itemKey) => itemKey !== key)
    treeRef.value?.setChecked(key, false, false)
  }

  function handleTableRowClick(row: DataSelectOption) {
    if (!props.selectOnRowClick || isRowDisabled(row)) return
    toggleTableRow(row)
  }

  function toggleTableRow(row: DataSelectOption) {
    if (isRowDisabled(row)) return

    const key = getRowKey(row)
    if (props.multiple) {
      draftKeys.value = draftKeys.value.includes(key)
        ? draftKeys.value.filter((itemKey) => itemKey !== key)
        : [...draftKeys.value, key]
      return
    }

    draftKeys.value = draftKeys.value.includes(key) ? [] : [key]
  }

  function toggleCurrentPage() {
    if (!props.multiple) return

    const pageKeys = pageSelectableRows.value.map(getRowKey)
    const shouldRemove = pageKeys.every((key) => draftKeys.value.includes(key))
    draftKeys.value = shouldRemove
      ? draftKeys.value.filter((key) => !pageKeys.includes(key))
      : Array.from(new Set([...draftKeys.value, ...pageKeys]))
  }

  function handleTreeNodeClick(row: DataSelectOption) {
    if (props.multiple || isRowDisabled(row)) return
    draftKeys.value = [getRowKey(row)]
  }

  function syncTreeDraftKeys() {
    if (!props.multiple || props.mode !== 'tree') return
    const keys = (treeRef.value?.getCheckedKeys(false) ?? []) as DataSelectKey[]
    draftKeys.value = keys
  }

  function syncTreeCheckedState() {
    if (props.mode !== 'tree' || !props.multiple || !treeRef.value) return
    treeRef.value.setCheckedKeys(draftKeys.value)
  }

  function emitSearch() {
    emit('search', searchKeyword.value)
  }

  function emitPageChange() {
    emit('page-change', currentPage.value, internalPageSize.value)
  }

  defineExpose({
    open,
    close,
    clear: clearDraftSelection,
    confirm
  })
</script>

<style scoped>
  :global(.art-data-select-dialog) {
    max-width: calc(100vw - 24px);
    padding: 0;
    overflow: hidden;
    background: var(--default-box-color);
    border: 1px solid var(--default-border);
    border-radius: var(--art-radius-surface-sm);
    box-shadow: 0 24px 70px rgb(15 23 42 / 16%);
  }

  :global(.art-data-select-dialog .el-dialog__header) {
    flex: 0 0 auto;
    padding: 0;
    margin: 0;
  }

  :global(.art-data-select-dialog .el-dialog__body) {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    padding: 0 !important;
    overflow: hidden;
  }

  :global(.art-data-select-dialog .el-dialog__footer) {
    flex: 0 0 auto;
    padding: 0;
  }

  :global(.art-data-select-dialog.is-fullscreen) {
    width: 100vw !important;
    max-width: 100vw;
    max-height: 100dvh;
    border-radius: 0;
  }

  :global(.art-data-select-dialog .el-pagination.is-background .btn-prev),
  :global(.art-data-select-dialog .el-pagination.is-background .btn-next),
  :global(.art-data-select-dialog .el-pagination.is-background .el-pager li) {
    min-width: 28px;
    color: var(--art-gray-800);
    background-color: var(--default-bg-color);
    border: 1px solid transparent;
  }

  :global(.art-data-select-dialog .el-pagination.is-background .btn-prev:hover),
  :global(.art-data-select-dialog .el-pagination.is-background .btn-next:hover),
  :global(.art-data-select-dialog .el-pagination.is-background .el-pager li:hover) {
    color: var(--theme-color);
    background-color: var(--art-hover-color);
  }

  :global(.art-data-select-dialog .el-pagination.is-background .el-pager li.is-active) {
    color: #fff;
    background-color: var(--theme-color);
    border-color: var(--theme-color);
  }

  :global(.art-data-select-dialog .el-pagination.is-background .btn-prev:disabled),
  :global(.art-data-select-dialog .el-pagination.is-background .btn-next:disabled) {
    color: var(--art-gray-500);
    background-color: var(--default-bg-color);
  }

  .art-data-select-table {
    table-layout: fixed;
  }

  .art-data-select-table th,
  .art-data-select-table td {
    vertical-align: middle;
  }

  .art-data-select-table th {
    line-height: 1.25;
  }

  .art-data-select-tree {
    padding: 6px 4px;
  }

  .art-data-select-tree :deep(.el-tree-node__content) {
    height: 32px;
    min-height: 32px;
    border-radius: calc(var(--custom-radius) / 2);
  }

  .art-data-select-tree :deep(.el-tree-node__label) {
    overflow: hidden;
    font-size: 14px;
    color: var(--art-gray-900);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .art-data-select-tree :deep(.el-tree-node__content:hover),
  .art-data-select-tree :deep(.el-tree-node:focus > .el-tree-node__content) {
    background-color: var(--art-hover-color);
  }
</style>
