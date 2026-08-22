<!-- 表格组件 -->
<!-- 支持：el-table 全部属性、事件、插槽，同官方文档写法 -->
<!-- 扩展功能：分页组件、渲染自定义列、loading、表格全局边框、斑马纹、表格尺寸、表头背景配置 -->
<!-- 获取 ref：默认暴露了 elTableRef 外部通过 ref.value.elTableRef 可以调用 el-table 方法 -->
<template>
  <div
    class="art-table"
    :class="{
      'is-empty': isEmpty,
      'is-mobile-card': shouldUseMobileCards,
      'is-header-dragging': isHeaderDragging,
      'is-header-text-selecting': isHeaderTextSelecting
    }"
    :style="containerHeight"
    @dblclick.capture="handleHeaderTextDoubleClick"
  >
    <ElTable
      v-if="!shouldUseMobileCards"
      ref="elTableRef"
      v-loading="!!loading"
      v-bind="mergedTableProps"
      @selection-change="handleSelectionChange"
    >
      <template v-for="columnItem in tableColumns" :key="columnItem.key">
        <!-- 渲染全局序号列 -->
        <ElTableColumn v-if="columnItem.raw.type === 'globalIndex'" v-bind="columnItem.props">
          <template #default="{ $index }">
            <span>{{ getGlobalIndex($index) }}</span>
          </template>
        </ElTableColumn>

        <!-- 渲染展开行 -->
        <ElTableColumn v-else-if="columnItem.raw.type === 'expand'" v-bind="columnItem.props">
          <template #default="{ row }">
            <FormatterCellContent :column="columnItem.raw" :row="row" />
          </template>
        </ElTableColumn>

        <!-- 渲染普通列 -->
        <ElTableColumn v-else v-bind="columnItem.props">
          <template
            v-if="columnItem.raw.useHeaderSlot && columnItem.raw.prop"
            #header="headerScope"
          >
            <slot
              :name="columnItem.raw.headerSlotName || `${columnItem.raw.prop}-header`"
              v-bind="{ ...headerScope, prop: columnItem.raw.prop, label: columnItem.raw.label }"
            >
              {{ columnItem.raw.label }}
            </slot>
          </template>
          <template v-if="columnItem.raw.useSlot && columnItem.raw.prop" #default="slotScope">
            <slot
              v-if="shouldRenderSlotScope(slotScope)"
              :name="columnItem.raw.slotName || columnItem.raw.prop"
              v-bind="{
                ...slotScope,
                prop: columnItem.raw.prop,
                value: columnItem.raw.prop ? slotScope.row[columnItem.raw.prop] : undefined
              }"
            />
          </template>
          <template v-else-if="columnItem.raw.formatter" #default="slotScope">
            <FormatterCellContent :column="columnItem.raw" :row="slotScope.row" />
          </template>
        </ElTableColumn>
      </template>

      <slot v-if="$slots.default" />

      <template #empty>
        <div v-if="loading"></div>
        <ElEmpty v-else :description="emptyText" :image-size="120" />
      </template>
    </ElTable>

    <div v-else ref="mobileCardRef" v-loading="!!loading" class="art-table-mobile">
      <ElEmpty
        v-if="isEmpty && !loading"
        class="art-table-mobile__empty"
        :description="emptyText"
        :image-size="120"
      />

      <div v-else class="art-table-mobile__list">
        <article
          v-for="(row, rowIndex) in mobileRows"
          :key="getMobileRowKey(row, rowIndex)"
          class="art-table-mobile-card"
          @click="handleMobileRowClick(row, rowIndex, $event)"
        >
          <div class="art-table-mobile-card__header">
            <ElCheckbox
              v-if="hasSelectionColumn"
              class="art-table-mobile-card__checkbox"
              :model-value="isMobileRowSelected(row)"
              :disabled="!isMobileRowSelectable(row, rowIndex)"
              @click.stop
              @update:model-value="(checked) => toggleMobileRowSelection(row, rowIndex, checked)"
            />

            <div class="art-table-mobile-card__title-wrap">
              <div v-if="mobilePrimaryColumn" class="art-table-mobile-card__title">
                <MobileCellContent :column="mobilePrimaryColumn" :row="row" :row-index="rowIndex" />
              </div>

              <div v-if="mobileSecondaryColumns.length" class="art-table-mobile-card__subtitle">
                <span
                  v-for="col in mobileSecondaryColumns"
                  :key="getColumnKey(col)"
                  class="art-table-mobile-card__subtitle-item"
                >
                  <MobileCellContent :column="col" :row="row" :row-index="rowIndex" />
                </span>
              </div>
            </div>

            <div v-if="mobileIndexColumn" class="art-table-mobile-card__index">
              {{ getMobileIndex(rowIndex) }}
            </div>
          </div>

          <div v-if="mobileBodyColumns.length" class="art-table-mobile-card__body">
            <div
              v-for="col in mobileBodyColumns"
              :key="getColumnKey(col)"
              class="art-table-mobile-card__field"
              :class="{ 'is-full': getMobileColumnConfig(col).fullWidth }"
            >
              <div class="art-table-mobile-card__label">{{ getMobileColumnLabel(col) }}</div>
              <div class="art-table-mobile-card__value">
                <MobileCellContent :column="col" :row="row" :row-index="rowIndex" />
              </div>
            </div>
          </div>

          <div v-if="mobileActionColumns.length" class="art-table-mobile-card__actions" @click.stop>
            <template v-for="col in mobileActionColumns" :key="getColumnKey(col)">
              <MobileCellContent :column="col" :row="row" :row-index="rowIndex" />
            </template>
          </div>
        </article>
      </div>
    </div>

    <div
      class="pagination custom-pagination"
      v-if="showPagination"
      :class="mergedPaginationOptions?.align"
      ref="paginationRef"
    >
      <ElPagination
        v-bind="mergedPaginationOptions"
        :total="pagination?.total"
        :disabled="loading"
        :page-size="pagination?.size"
        :current-page="pagination?.current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    defineComponent,
    nextTick,
    onUnmounted,
    normalizeClass,
    watch,
    watchEffect,
    getCurrentInstance,
    useAttrs,
    useSlots,
    type PropType,
    type VNodeChild
  } from 'vue'
  import type { ElTable, TableProps } from 'element-plus'
  import { storeToRefs } from 'pinia'
  import { ColumnOption } from '@/types'
  import { useTableStore } from '@/store/modules/table'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useTableHeight } from '@/hooks/core/useTableHeight'
  import { useResizeObserver, useWindowSize } from '@vueuse/core'
  import { useDraggable } from 'vue-draggable-plus'
  import { getColumnPreferenceKey } from '@/utils/table/columnPreferences'

  defineOptions({ name: 'ArtTable' })

  const { width } = useWindowSize()

  const elTableRef = ref<InstanceType<typeof ElTable> | null>(null)
  const mobileCardRef = ref<HTMLElement>()
  const paginationRef = ref<HTMLElement>()
  const tableHeaderRef = ref<HTMLElement>()
  const slots = useSlots()
  const tableStore = useTableStore()
  const { isBorder, isZebra, tableSize, isFullScreen, isHeaderBackground, isMobileCardMode } =
    storeToRefs(tableStore)

  /** 分页配置接口 */
  interface PaginationConfig {
    /** 当前页码 */
    current: number
    /** 每页显示条目个数 */
    size: number
    /** 总条目数 */
    total: number
  }

  /** 分页器配置选项接口 */
  interface PaginationOptions {
    /** 每页显示个数选择器的选项列表 */
    pageSizes?: number[]
    /** 分页器的对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 分页器的布局 */
    layout?: string
    /** 是否显示分页器背景 */
    background?: boolean
    /** 只有一页时是否隐藏分页器 */
    hideOnSinglePage?: boolean
    /** 分页器的大小 */
    size?: 'small' | 'default' | 'large'
    /** 分页器的页码数量 */
    pagerCount?: number
  }

  /** 自动推导最小列宽配置 */
  interface AutoMinWidthOptions {
    /** 推导结果的最小值 */
    min?: number
    /** 推导结果的最大值，避免长内容把列撑得过宽 */
    max?: number
    /** 参与估算的数据行数 */
    sampleSize?: number
    /** 单元格左右留白和安全余量 */
    padding?: number
  }

  /** ArtTable 组件的 Props 接口 */
  interface ArtTableProps extends TableProps<Record<string, any>> {
    /** 加载状态 */
    loading?: boolean
    /** 列渲染配置 */
    columns?: ColumnOption[]
    /** 分页状态 */
    pagination?: PaginationConfig
    /** 分页配置 */
    paginationOptions?: PaginationOptions
    /** 空数据表格高度 */
    emptyHeight?: string
    /** 空数据时显示的文本 */
    emptyText?: string
    /** 空数据时是否保留分页器 */
    showPaginationWhenEmpty?: boolean
    /** 是否开启 ArtTableHeader，解决表格高度自适应问题 */
    showTableHeader?: boolean
    /** 移动端展示模式：auto 自动卡片化，table 始终表格，card 始终卡片 */
    mobileMode?: 'auto' | 'table' | 'card'
    /** 进入移动端卡片模式的断点 */
    mobileBreakpoint?: number
    /** 是否允许拖拽表头调整列顺序 */
    headerDraggable?: boolean
    /** 密集表格优化开关：根据表头和当前数据样本自动推导未配置列的最小宽度 */
    autoMinWidth?: boolean | AutoMinWidthOptions
  }

  const props = withDefaults(defineProps<ArtTableProps>(), {
    columns: () => [],
    fit: true,
    showHeader: true,
    stripe: undefined,
    border: undefined,
    size: undefined,
    emptyText: '暂无数据',
    showPaginationWhenEmpty: false,
    showTableHeader: true,
    mobileMode: 'auto',
    mobileBreakpoint: 768,
    headerDraggable: true,
    autoMinWidth: false
  })
  const instance = getCurrentInstance()
  const attrs = useAttrs()

  const LAYOUT = {
    MOBILE: 'prev, pager, next, sizes, jumper, total',
    IPAD: 'prev, pager, next, jumper, total',
    DESKTOP: 'total, prev, pager, next, sizes, jumper'
  }

  const layout = computed(() => {
    if (width.value < 768) {
      return LAYOUT.MOBILE
    } else if (width.value < 1024) {
      return LAYOUT.IPAD
    } else {
      return LAYOUT.DESKTOP
    }
  })

  // 默认分页配置随窗口宽度响应，避免移动端/桌面切换后分页布局停留在旧值。
  const defaultPaginationOptions = computed<PaginationOptions>(() => ({
    pageSizes: [10, 20, 30, 50, 100],
    align: 'center',
    background: true,
    layout: layout.value,
    hideOnSinglePage: false,
    size: 'default',
    pagerCount: width.value > 1200 ? 7 : 5
  }))

  // 合并分页配置
  const mergedPaginationOptions = computed(() => ({
    ...defaultPaginationOptions.value,
    ...props.paginationOptions
  }))

  // 边框 (优先级：props > store)
  const border = computed(() => props.border ?? isBorder.value)
  // 斑马纹
  const stripe = computed(() => props.stripe ?? isZebra.value)
  // 表格尺寸
  const size = computed(() => props.size ?? tableSize.value)
  // 数据是否为空
  const isEmpty = computed(() => props.data?.length === 0)
  // 是否使用移动端卡片模式
  const shouldUseMobileCards = computed(() => {
    if (!props.columns.length) return false
    if (props.mobileMode === 'card') return true
    if (props.mobileMode === 'table') return false
    return isMobileCardMode.value && width.value < props.mobileBreakpoint
  })

  const mobileRows = computed(() => props.data ?? [])

  const selectedMobileRows = ref<Record<string, any>[]>([])

  const paginationHeight = ref(0)
  const tableHeaderHeight = ref(0)

  // 使用 useResizeObserver 监听分页器高度变化
  useResizeObserver(paginationRef, (entries) => {
    const entry = entries[0]
    if (entry) {
      // 使用 requestAnimationFrame 避免 ResizeObserver loop 警告
      requestAnimationFrame(() => {
        paginationHeight.value = entry.contentRect.height
      })
    }
  })

  // 使用 useResizeObserver 监听表格头部高度变化
  useResizeObserver(tableHeaderRef, (entries) => {
    const entry = entries[0]
    if (entry) {
      // 使用 requestAnimationFrame 避免 ResizeObserver loop 警告
      requestAnimationFrame(() => {
        tableHeaderHeight.value = entry.contentRect.height
      })
    }
  })

  // 分页器与表格之间的间距常量（计算属性，响应 showTableHeader 变化）
  const PAGINATION_SPACING = computed(() => (props.showTableHeader ? 6 : 15))

  // 使用表格高度计算 Hook
  const { containerHeight } = useTableHeight({
    showTableHeader: computed(() => props.showTableHeader),
    paginationHeight,
    tableHeaderHeight,
    paginationSpacing: PAGINATION_SPACING
  })

  // body-wrapper 亚像素高度补偿值，用于消除滚动容器的亚像素高度，
  // 防止 fixed 列分割线在 100%/125% 缩放下错位或底部滚动抖动。
  const subpixelCorrection = ref(0)
  const SUBPIXEL_EPSILON = 0.01

  const getSubpixelCorrection = (heightValue: number) => {
    const fraction = heightValue % 1
    if (fraction < SUBPIXEL_EPSILON || 1 - fraction < SUBPIXEL_EPSILON) return 0
    return Number((1 - fraction).toFixed(3))
  }

  const getCorrectedTableHeight = (baseHeight: string) => {
    if (subpixelCorrection.value <= 0) return baseHeight
    return `calc(${baseHeight} + ${subpixelCorrection.value}px)`
  }

  // 监听 el-table 尺寸变化，用补偿前的 body-wrapper 基准高度推导需要补齐的像素。
  // 测量值扣除当前补偿，避免 ResizeObserver 在补偿后的高度上形成反馈环路。
  useResizeObserver(
    computed(() => elTableRef.value?.$el as HTMLElement | undefined),
    (entries) => {
      const el = entries[0]?.target as HTMLElement | undefined
      const bodyWrapper = el?.querySelector<HTMLElement>('.el-table__body-wrapper')
      if (!bodyWrapper) {
        subpixelCorrection.value = 0
        return
      }

      const baseBodyHeight = bodyWrapper.getBoundingClientRect().height - subpixelCorrection.value
      const needed = getSubpixelCorrection(baseBodyHeight)

      // 仅在值发生实质性变化时更新，避免触发不必要的响应式重算
      if (Math.abs(needed - subpixelCorrection.value) > SUBPIXEL_EPSILON) {
        subpixelCorrection.value = needed
      }
    }
  )

  // 表格高度逻辑
  const height = computed(() => {
    // 全屏模式下占满全屏
    if (isFullScreen.value) return getCorrectedTableHeight('100%')
    // 空数据且非加载状态时固定高度
    if (isEmpty.value && !props.loading) {
      if (hasExplicitTableProp('emptyHeight') && props.emptyHeight) return props.emptyHeight
      return width.value < 768 ? '70vh' : '100%'
    }
    // 使用传入的高度
    if (props.height) return props.height
    // 补偿 body-wrapper 的亚像素高度，使滚动容器获得整数高度
    if (subpixelCorrection.value > 0) return getCorrectedTableHeight('100%')
    // 默认占满容器高度
    return '100%'
  })

  // 表头背景颜色样式
  const headerCellStyle = computed(() => ({
    background: isHeaderBackground.value
      ? 'var(--el-fill-color-lighter)'
      : 'var(--default-box-color)',
    ...(props.headerCellStyle || {}) // 合并用户传入的样式
  }))

  const nativeTableProps = computed(() => {
    const tableProps = { ...props } as Record<string, unknown>
    delete tableProps.loading
    delete tableProps.columns
    delete tableProps.pagination
    delete tableProps.paginationOptions
    delete tableProps.emptyHeight
    delete tableProps.emptyText
    delete tableProps.showPaginationWhenEmpty
    delete tableProps.showTableHeader
    delete tableProps.mobileMode
    delete tableProps.mobileBreakpoint
    delete tableProps.headerDraggable
    delete tableProps.autoMinWidth

    return tableProps as Partial<TableProps<Record<string, any>>>
  })

  // 只有显式传入时才覆盖 ElTable 的原生默认值，避免继承的 Boolean props 把官方默认值冲掉。
  const hasExplicitTableProp = (propName: string): boolean => {
    const rawProps = (instance?.vnode.props || {}) as Record<string, unknown>
    const kebabName = propName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    return propName in rawProps || kebabName in rawProps
  }

  const getCustomHeaderCellClassName = (scope: Record<string, unknown>) => {
    const className = props.headerCellClassName
    return typeof className === 'function' ? className(scope as never) : className
  }

  const isHeaderDragColumn = (col?: ColumnOption) => {
    return !!props.headerDraggable && !!col && !col.fixed && col.headerDraggable !== false
  }

  const getHeaderCellClassName = (scope: Record<string, unknown>) => {
    const columnIndex = Number(scope.columnIndex)
    const columnItem = Number.isFinite(columnIndex) ? tableColumns.value[columnIndex] : undefined
    const customClass = normalizeClass(getCustomHeaderCellClassName(scope))
    const dragClass = isHeaderDragColumn(columnItem?.raw)
      ? 'art-table-header-draggable'
      : 'art-table-header-drag-fixed'

    return normalizeClass([customClass, dragClass])
  }

  const mergedTableProps = computed(() => ({
    ...attrs,
    ...nativeTableProps.value,
    height: height.value,
    stripe: stripe.value,
    border: border.value,
    size: size.value,
    headerCellStyle: headerCellStyle.value,
    headerCellClassName: getHeaderCellClassName,
    // Element Plus 默认值为 true，未显式传入时不应被 ArtTable 覆盖成 false。
    selectOnIndeterminate: hasExplicitTableProp('selectOnIndeterminate')
      ? props.selectOnIndeterminate
      : undefined
  }))

  // 是否显示分页器
  const showPagination = computed(
    () => props.pagination && (!isEmpty.value || props.showPaginationWhenEmpty)
  )

  // Element Plus 在部分场景会先用 $index = -1 进行预渲染。
  // 这对普通展示无影响，但会让 ElForm 错误注册出 lineList.-1.xxx 这类字段。
  const shouldRenderSlotScope = (slotScope: { $index?: number }) => {
    return slotScope.$index === undefined || slotScope.$index >= 0
  }

  // 自动列宽的默认估算参数，避免未配置宽度的短字段被 Element Plus 默认 80px 兜底撑开。
  const AUTO_MIN_WIDTH_DEFAULTS: Required<AutoMinWidthOptions> = {
    min: 56,
    max: 220,
    sampleSize: 20,
    padding: 34
  }

  // 将布尔开关统一归一化为配置对象，方便组件级和列级配置合并。
  const normalizeAutoMinWidthOptions = (
    config?: boolean | AutoMinWidthOptions
  ): AutoMinWidthOptions => (typeof config === 'object' && config !== null ? config : {})

  // 合并默认配置、表格级配置和列级配置；列级配置优先级最高。
  const getAutoMinWidthOptions = (col: ColumnOption): Required<AutoMinWidthOptions> => ({
    ...AUTO_MIN_WIDTH_DEFAULTS,
    ...normalizeAutoMinWidthOptions(props.autoMinWidth),
    ...normalizeAutoMinWidthOptions(col.autoMinWidth)
  })

  // 仅对未手动设置宽度、非特殊列、非固定列执行自动最小宽度推导。
  const shouldAutoMinWidth = (col: ColumnOption) => {
    if (col.width !== undefined || col.minWidth !== undefined) return false
    if (col.autoMinWidth === false) return false
    if (col.type || !col.prop || col.fixed) return false
    return props.autoMinWidth !== false || !!col.autoMinWidth
  }

  // 支持 user.name 这类点路径读取，兼容 Element Plus 表格列 prop 的常见写法。
  const getValueByPath = (row: Record<string, any>, path: string) => {
    return path.split('.').reduce<unknown>((value, key) => {
      if (value && typeof value === 'object') return (value as Record<string, unknown>)[key]
      return undefined
    }, row)
  }

  // 将各种单元格原始值转成可参与宽度估算的文本，空值按表格展示习惯记为 '-'。
  const normalizeText = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'string') return value
    if (['number', 'boolean', 'bigint'].includes(typeof value)) return String(value)
    if (value instanceof Date) return value.toLocaleString()
    if (Array.isArray(value)) return value.map(normalizeText).join(' ')
    return ''
  }

  // 粗略识别 CJK 字符，自动列宽估算时按接近中文字号的宽度计算。
  const isCjkChar = (char: string) =>
    /[\u2e80-\u2eff\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u.test(char)

  // 使用轻量字符宽度估算替代 DOM 测量，避免表格渲染阶段产生额外布局开销。
  const measureTextWidth = (text: string) =>
    Array.from(text).reduce((width, char) => {
      if (isCjkChar(char)) return width + 14
      if (/\s/u.test(char)) return width + 4
      if (/[A-Z0-9]/u.test(char)) return width + 8
      if (/[a-z]/u.test(char)) return width + 7
      return width + 8
    }, 0)

  // 将估算结果限制在可控范围内，避免过短不可读或过长挤占其他列。
  const clampWidth = (widthValue: number, min: number, max: number) =>
    Math.max(min, Math.min(max, widthValue))

  // 根据表头和当前页样本数据推导列的 minWidth，并预留排序/筛选图标空间。
  const inferColumnMinWidth = (col: ColumnOption) => {
    const options = getAutoMinWidthOptions(col)
    const sampleRows = (props.data ?? []).slice(0, options.sampleSize)
    const values = [
      col.label,
      ...sampleRows.map((row) => normalizeText(getValueByPath(row, col.prop as string)))
    ]
      .map(normalizeText)
      .filter(Boolean)

    const contentWidth = Math.max(...values.map(measureTextWidth), 0)
    const affordanceWidth = (col.sortable ? 18 : 0) + (col.filters?.length ? 24 : 0)
    return clampWidth(
      Math.ceil(contentWidth + options.padding + affordanceWidth),
      options.min,
      options.max
    )
  }

  // 清理 ArtTable 扩展属性，避免把自定义字段透传给 ElTableColumn。
  const cleanColumnProps = (col: ColumnOption) => {
    const columnProps = { ...col }

    delete columnProps.useHeaderSlot
    delete columnProps.headerSlotName
    delete columnProps.useSlot
    delete columnProps.slotName
    delete columnProps.mobile
    delete columnProps.checked
    delete columnProps.visible
    delete columnProps.disabled
    delete columnProps.headerDraggable
    delete columnProps.autoMinWidth
    // 普通列的 formatter 由 ArtTable 显式渲染，避免透传给 ElTableColumn 时丢失 VNode。
    delete columnProps.formatter
    if (shouldAutoMinWidth(col)) columnProps.minWidth = inferColumnMinWidth(col)
    return columnProps
  }

  // 生成最终渲染列：保留原始列配置，同时传入清理后的 Element Plus 列属性。
  const tableColumns = computed(() =>
    props.columns.map((col, index) => ({
      raw: col,
      props: cleanColumnProps(col),
      key: getColumnPreferenceKey(col, index)
    }))
  )

  const TABLE_COLUMN_DRAG_SORT_EVENT = 'art-table-column-drag-sort'
  const headerDragTarget = ref<HTMLElement | null>(null)
  const isHeaderDragging = ref(false)
  const isHeaderTextSelecting = ref(false)
  let headerTextSelectTimer = 0

  // 表头拖拽只允许处理未固定且未显式禁用拖拽的列。
  const headerDraggableColumns = computed(() =>
    tableColumns.value.filter((columnItem) => isHeaderDragColumn(columnItem.raw))
  )

  // 返回移动后的新数组，避免直接修改 computed 派生出的列集合。
  const moveItem = <T,>(list: T[], fromIndex: number, toIndex: number) => {
    const next = [...list]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return next
  }

  // 向 ArtTableHeader 广播拖拽后的列顺序，用于同步列偏好配置。
  const dispatchHeaderDragSortEvent = (orderedKeys: string[]) => {
    const tableEl = elTableRef.value?.$el as HTMLElement | undefined
    if (!tableEl) return

    tableEl.dispatchEvent(
      new CustomEvent(TABLE_COLUMN_DRAG_SORT_EVENT, {
        bubbles: true,
        detail: { orderedKeys }
      })
    )
  }

  // 兼容 vue-draggable-plus 与 Sortable 不同事件字段名，统一取拖拽前后索引。
  const getSortableIndex = (
    event: Record<string, unknown>,
    draggableKey: 'oldDraggableIndex' | 'newDraggableIndex',
    fallbackKey: 'oldIndex' | 'newIndex'
  ) => {
    const draggableIndex = event[draggableKey]
    if (typeof draggableIndex === 'number') return draggableIndex

    const fallbackIndex = event[fallbackKey]
    return typeof fallbackIndex === 'number' ? fallbackIndex : -1
  }

  // 获取 Element Plus 表格根节点，后续用于定位表头和横向滚动容器。
  const getTableRootElement = () => elTableRef.value?.$el as HTMLElement | undefined
  const HEADER_DRAG_SCROLL_EDGE = 72
  const HEADER_DRAG_SCROLL_MAX_SPEED = 18
  const HEADER_TEXT_SELECT_DURATION = 1600

  // 双击表头时临时解除拖拽态的 user-select 限制，允许复制表头文字。
  const startHeaderTextSelecting = () => {
    isHeaderTextSelecting.value = true

    if (headerTextSelectTimer) {
      window.clearTimeout(headerTextSelectTimer)
    }

    headerTextSelectTimer = window.setTimeout(() => {
      isHeaderTextSelecting.value = false
      headerTextSelectTimer = 0
    }, HEADER_TEXT_SELECT_DURATION)
  }

  // 找到当前双击所在的表头内容区域，避免把整张表头行都选中。
  const getHeaderTextSelectionTarget = (eventTarget: EventTarget | null) => {
    if (!(eventTarget instanceof HTMLElement)) return null

    const tableEl = getTableRootElement()
    const headerCell = eventTarget.closest<HTMLElement>('.el-table__header-wrapper th')
    if (!tableEl || !headerCell || !tableEl.contains(headerCell)) return null

    return headerCell.querySelector<HTMLElement>('.cell') || headerCell
  }

  // 使用 Selection API 主动选中表头文字，兼容拖拽禁用原生选区的场景。
  const selectHeaderText = (target: HTMLElement) => {
    const text = target.textContent?.trim()
    if (!text) return

    const selection = window.getSelection()
    if (!selection) return

    const range = document.createRange()
    range.selectNodeContents(target)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const handleHeaderTextDoubleClick = (event: MouseEvent) => {
    const target = getHeaderTextSelectionTarget(event.target)
    if (!target) return

    startHeaderTextSelecting()
    nextTick(() => selectHeaderText(target))
  }

  // 获取拖拽时真正需要横向滚动的容器。
  const getHeaderDragScrollElement = () => {
    const tableEl = getTableRootElement()
    return (
      tableEl?.querySelector<HTMLElement>('.el-table__body-wrapper .el-scrollbar__wrap') ||
      tableEl?.querySelector<HTMLElement>('.el-table__body-wrapper')
    )
  }

  // 获取计算鼠标靠近左右边缘距离的视口元素。
  const getHeaderDragScrollViewport = () => {
    const tableEl = getTableRootElement()
    return (
      tableEl?.querySelector<HTMLElement>('.el-table__body-wrapper') ||
      tableEl?.querySelector<HTMLElement>('.el-table__header-wrapper') ||
      tableEl
    )
  }

  let headerDragPointerX: number | null = null
  let headerDragScrollFrame = 0
  let headerDragScrollElement: HTMLElement | null = null
  let headerDragScrollViewport: HTMLElement | null = null

  // 从鼠标或触摸事件中提取横坐标，支持桌面端和触屏设备。
  const getPointerClientX = (event: Event) => {
    if (event instanceof MouseEvent) return event.clientX
    if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
      return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? null
    }
    return null
  }

  // 记录拖拽指针位置，供 requestAnimationFrame 中的自动横向滚动使用。
  const updateHeaderDragPointer = (event: Event) => {
    const clientX = getPointerClientX(event)
    if (clientX !== null) headerDragPointerX = clientX
  }

  // 指针越靠近左右边缘，横向滚动速度越快。
  const getHeaderDragScrollDelta = (clientX: number, rect: DOMRect) => {
    if (clientX < rect.left + HEADER_DRAG_SCROLL_EDGE) {
      const ratio = (rect.left + HEADER_DRAG_SCROLL_EDGE - clientX) / HEADER_DRAG_SCROLL_EDGE
      return -Math.ceil(Math.min(1, ratio) * HEADER_DRAG_SCROLL_MAX_SPEED)
    }

    if (clientX > rect.right - HEADER_DRAG_SCROLL_EDGE) {
      const ratio = (clientX - (rect.right - HEADER_DRAG_SCROLL_EDGE)) / HEADER_DRAG_SCROLL_EDGE
      return Math.ceil(Math.min(1, ratio) * HEADER_DRAG_SCROLL_MAX_SPEED)
    }

    return 0
  }

  // 表头拖拽时自动横向滚动，方便把列拖到当前视口之外的位置。
  const runHeaderDragAutoScroll = () => {
    if (!isHeaderDragging.value) {
      headerDragScrollFrame = 0
      return
    }

    const clientX = headerDragPointerX
    const scrollEl = headerDragScrollElement
    const viewportEl = headerDragScrollViewport

    if (clientX !== null && scrollEl && viewportEl && scrollEl.scrollWidth > scrollEl.clientWidth) {
      const delta = getHeaderDragScrollDelta(clientX, viewportEl.getBoundingClientRect())
      if (delta !== 0) scrollEl.scrollLeft += delta
    }

    headerDragScrollFrame = requestAnimationFrame(runHeaderDragAutoScroll)
  }

  // 启动拖拽自动滚动并绑定全局指针监听，保证拖拽离开表头时仍能感知位置。
  const startHeaderDragAutoScroll = (event?: Event) => {
    if (event) updateHeaderDragPointer(event)
    headerDragScrollElement = getHeaderDragScrollElement() || null
    headerDragScrollViewport = getHeaderDragScrollViewport() || null
    document.addEventListener('mousemove', updateHeaderDragPointer, { passive: true })
    document.addEventListener('dragover', updateHeaderDragPointer, { passive: true })
    document.addEventListener('touchmove', updateHeaderDragPointer, { passive: true })

    if (!headerDragScrollFrame) {
      headerDragScrollFrame = requestAnimationFrame(runHeaderDragAutoScroll)
    }
  }

  // 停止拖拽自动滚动并清理全局监听，避免残留事件和动画帧。
  const stopHeaderDragAutoScroll = () => {
    document.removeEventListener('mousemove', updateHeaderDragPointer)
    document.removeEventListener('dragover', updateHeaderDragPointer)
    document.removeEventListener('touchmove', updateHeaderDragPointer)

    if (headerDragScrollFrame) {
      cancelAnimationFrame(headerDragScrollFrame)
      headerDragScrollFrame = 0
    }

    headerDragPointerX = null
    headerDragScrollElement = null
    headerDragScrollViewport = null
  }

  // 获取 Sortable 包装前的原始事件，用于启动时立即记录指针位置。
  const getSortableOriginalEvent = (event: unknown) => {
    const originalEvent = (event as { originalEvent?: unknown }).originalEvent
    return originalEvent instanceof Event ? originalEvent : null
  }

  // 调整 fallback 拖拽克隆节点样式，让拖拽影子与项目主题保持一致。
  const prepareHeaderDragClone = (event: unknown) => {
    const clone = (event as { clone?: unknown }).clone
    if (!(clone instanceof HTMLElement)) return

    clone.style.backgroundColor = 'var(--default-box-color)'
    clone.style.border = '1px solid color-mix(in srgb, var(--default-border) 80%, transparent)'
    clone.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.096)'
    clone.style.opacity = '1'
  }

  // 拖拽结束后校验索引并产出新的列顺序，交给外层偏好系统保存。
  const handleHeaderDragEnd = (event: Record<string, unknown>) => {
    isHeaderDragging.value = false
    stopHeaderDragAutoScroll()

    const fromIndex = getSortableIndex(event, 'oldDraggableIndex', 'oldIndex')
    const toIndex = getSortableIndex(event, 'newDraggableIndex', 'newIndex')
    const draggableColumns = headerDraggableColumns.value

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= draggableColumns.length ||
      toIndex >= draggableColumns.length ||
      fromIndex === toIndex
    ) {
      return
    }

    const nextColumns = moveItem(draggableColumns, fromIndex, toIndex)
    const orderedKeys = nextColumns.map((columnItem) => columnItem.key)

    emit('column-drag-sort', orderedKeys)
    dispatchHeaderDragSortEvent(orderedKeys)
  }

  // 初始化表头横向拖拽，使用 fallback 模式保证表格复杂 DOM 下行为一致。
  const headerSortable = useDraggable(headerDragTarget, {
    immediate: false,
    animation: 180,
    direction: 'horizontal',
    draggable: '.art-table-header-draggable',
    filter: '.art-table-header-drag-fixed',
    preventOnFilter: false,
    forceFallback: true,
    fallbackTolerance: 4,
    fallbackClass: 'art-table-header-drag-fallback',
    ghostClass: 'art-table-header-drag-ghost',
    chosenClass: 'art-table-header-drag-chosen',
    dragClass: 'art-table-header-dragging',
    onStart: (event) => {
      isHeaderDragging.value = true
      startHeaderDragAutoScroll(getSortableOriginalEvent(event) ?? undefined)
    },
    onClone: prepareHeaderDragClone,
    onEnd: (event) => handleHeaderDragEnd(event as unknown as Record<string, unknown>)
  })

  // 根据当前渲染模式重新寻找表头行节点，移动端卡片模式下禁用拖拽。
  const findHeaderDragTarget = () => {
    if (!props.headerDraggable || shouldUseMobileCards.value || !props.showHeader) {
      headerDragTarget.value = null
      headerSortable.destroy()
      return
    }

    const tableEl = elTableRef.value?.$el as HTMLElement | undefined
    const target = tableEl?.querySelector<HTMLElement>('.el-table__header-wrapper thead tr')

    if (!target) {
      headerDragTarget.value = null
      headerSortable.destroy()
      return
    }

    if (target !== headerDragTarget.value) {
      headerDragTarget.value = target
      headerSortable.start(target)
    }
  }

  // 监听影响表头拖拽目标的关键状态，签名变化后重新绑定拖拽实例。
  const headerDragSignature = computed(() =>
    [
      props.headerDraggable,
      props.showHeader,
      shouldUseMobileCards.value,
      headerDraggableColumns.value.map((columnItem) => columnItem.key).join('|')
    ].join(':')
  )

  // 包一层 formatter 调用，避免空 formatter 影响默认插槽渲染流程。
  const renderFormatterContent = (col: ColumnOption, row: Record<string, any>) => {
    return col.formatter?.(row) ?? null
  }

  // 将 formatter 渲染封装成组件，确保 VNode/字符串等返回值都能稳定渲染。
  const FormatterCellContent = defineComponent({
    name: 'ArtTableFormatterCellContent',
    props: {
      column: {
        type: Object as PropType<ColumnOption>,
        required: true
      },
      row: {
        type: Object as PropType<Record<string, any>>,
        required: true
      }
    },
    setup(cellProps) {
      return () => renderFormatterContent(cellProps.column, cellProps.row)
    }
  })

  // 移动端卡片列配置。mobile 可传 boolean，也可传对象控制隐藏、排序、主标题等行为。
  type MobileColumnConfig = NonNullable<Exclude<ColumnOption['mobile'], boolean>>

  const getMobileColumnConfig = (col: ColumnOption): MobileColumnConfig => {
    if (typeof col.mobile === 'object' && col.mobile !== null) return col.mobile
    return {}
  }

  // 移动端只渲染仍可见的列，兼容列显隐、表格列配置和 mobile.hidden。
  const isColumnVisible = (col: ColumnOption) => {
    if (col.visible === false || col.checked === false) return false
    if (col.mobile === false || getMobileColumnConfig(col).hidden) return false
    return true
  }

  const isSelectionColumn = (col: ColumnOption) => col.type === 'selection'

  const isIndexColumn = (col: ColumnOption) => col.type === 'index' || col.type === 'globalIndex'

  // 卡片主体只展示真实业务列，选择列、序号列和展开列会映射到卡片的独立区域。
  const isDisplayColumn = (col: ColumnOption) => {
    if (!isColumnVisible(col)) return false
    if (isSelectionColumn(col) || isIndexColumn(col) || col.type === 'expand') return false
    return !!(col.prop || col.formatter || col.useSlot)
  }

  const getColumnKey = (col: ColumnOption) => col.prop || col.type || col.label || String(col)

  const getColumnOrder = (col: ColumnOption, index: number) => {
    return getMobileColumnConfig(col).order ?? index
  }

  // 移动端卡片的基础展示列，按 mobile.order 覆盖桌面列顺序。
  const mobileDisplayColumns = computed(() =>
    props.columns
      .map((col, index) => ({ col, index }))
      .filter(({ col }) => isDisplayColumn(col))
      .sort((a, b) => getColumnOrder(a.col, a.index) - getColumnOrder(b.col, b.index))
      .map(({ col }) => col)
  )

  const selectionColumn = computed(() =>
    props.columns.find((col) => isSelectionColumn(col) && isColumnVisible(col))
  )

  const hasSelectionColumn = computed(() => !!selectionColumn.value)

  const mobileIndexColumn = computed(() =>
    props.columns.find((col) => isIndexColumn(col) && isColumnVisible(col))
  )

  // 操作列可通过 mobile.action 显式声明，也会兼容常见 operation/action 字段名。
  const isActionColumn = (col: ColumnOption) => {
    const mobileConfig = getMobileColumnConfig(col)
    if (mobileConfig.action) return true

    const prop = String(col.prop || '').toLowerCase()
    const actionProps = ['operation', 'operate', 'action', 'actions']
    return actionProps.includes(prop)
  }

  const mobileActionColumns = computed(() => mobileDisplayColumns.value.filter(isActionColumn))

  // 未显式配置 primary 时，按常见业务字段自动推断卡片标题列。
  const PRIMARY_COLUMN_LABEL_PATTERN =
    /(名称|标题|编号|单号|编码|键名|主题|账号|账户|用户名|姓名|昵称|角色|部门|岗位|菜单|字典|分类|标签|产品|商品|订单|任务|流程|实例|文件|通知|公告|参数|模块|系统|客户端|应用|服务|接口|路径|地址|邮箱|手机号|联系人|负责人)/
  const PRIMARY_COLUMN_PROP_PATTERN =
    /(^|_)(title|name|no|code|key|account|username|realname|nickname|role|department|dept|post|menu|dict|category|tag|product|goods|order|task|process|workflow|instance|file|notice|notification|param|module|system|client|app|service|api|path|url|email|phone|mobile|contact|owner|leader)$/i

  const isAutoPrimaryColumn = (col: ColumnOption) => {
    const mobileConfig = getMobileColumnConfig(col)
    if (mobileConfig.primary === false || isActionColumn(col)) return false

    const label = String(col.label || '').trim()
    if (label) return PRIMARY_COLUMN_LABEL_PATTERN.test(label)

    const prop = String(col.prop || '').trim()
    return PRIMARY_COLUMN_PROP_PATTERN.test(prop)
  }

  const mobilePrimaryColumn = computed(() => {
    return (
      mobileDisplayColumns.value.find((col) => getMobileColumnConfig(col).primary === true) ||
      mobileDisplayColumns.value.find(isAutoPrimaryColumn)
    )
  })

  // 副标题区域适合放状态、编号、时间等辅助信息，由 mobile.secondary 控制。
  const mobileSecondaryColumns = computed(() =>
    mobileDisplayColumns.value.filter((col) => getMobileColumnConfig(col).secondary)
  )

  // 普通字段区域排除副标题列和操作列，避免同一列在卡片中重复出现。
  const mobileBodyColumns = computed(() => {
    const secondarySet = new Set(mobileSecondaryColumns.value)
    const actionSet = new Set(mobileActionColumns.value)

    return mobileDisplayColumns.value.filter((col) => !secondarySet.has(col) && !actionSet.has(col))
  })

  const getMobileColumnLabel = (col: ColumnOption) => {
    return getMobileColumnConfig(col).label || col.label || col.prop || ''
  }

  const getColumnSlotName = (col: ColumnOption) => col.slotName || col.prop || ''

  const getCellFallbackValue = (col: ColumnOption, row: Record<string, any>) => {
    if (!col.prop) return '-'
    const value = row[col.prop]
    if (value === null || value === undefined || value === '') return '-'
    return value
  }

  const getSlotScope = (col: ColumnOption, row: Record<string, any>, rowIndex: number) => ({
    row,
    column: col,
    $index: rowIndex,
    prop: col.prop,
    value: col.prop ? row[col.prop] : undefined
  })

  // 移动端复用桌面列的 slot / formatter 能力，保证两端展示逻辑一致。
  const renderMobileCellContent = (
    col: ColumnOption,
    row: Record<string, any>,
    rowIndex: number
  ): VNodeChild => {
    if (col.useSlot && col.prop) {
      const slotName = getColumnSlotName(col)
      const slot = slots[slotName]
      if (slot) return slot(getSlotScope(col, row, rowIndex))
    }

    if (col.formatter) return col.formatter(row)

    return getCellFallbackValue(col, row)
  }

  const MobileCellContent = defineComponent({
    name: 'ArtTableMobileCellContent',
    props: {
      column: {
        type: Object as PropType<ColumnOption>,
        required: true
      },
      row: {
        type: Object as PropType<Record<string, any>>,
        required: true
      },
      rowIndex: {
        type: Number,
        required: true
      }
    },
    setup(cellProps) {
      return () => renderMobileCellContent(cellProps.column, cellProps.row, cellProps.rowIndex)
    }
  })

  // globalIndex 在移动端卡片中仍按分页偏移计算序号。
  const getMobileIndex = (rowIndex: number) => {
    return mobileIndexColumn.value?.type === 'globalIndex' ? getGlobalIndex(rowIndex) : rowIndex + 1
  }

  // 解析 Element Plus row-key，支持函数和 a.b.c 形式的嵌套字段；路径只在 rowKey 变化时拆分一次。
  const rowKeyGetter = computed(() => {
    const rowKey = props.rowKey
    if (!rowKey) return undefined
    if (typeof rowKey === 'function') return rowKey

    const keys = String(rowKey).split('.')
    return (row: Record<string, any>) => keys.reduce<any>((value, key) => value?.[key], row)
  })

  const getRowKeyValue = (row: Record<string, any>) => {
    return rowKeyGetter.value?.(row)
  }

  const getMobileRowKey = (row: Record<string, any>, rowIndex: number) => {
    const key = getRowKeyValue(row)
    return key ?? rowIndex
  }

  // 优先通过 row-key 判断同一行，没有 row-key 时退回对象引用比较。
  const getComparableRowKey = (row: Record<string, any>) => {
    return getRowKeyValue(row) ?? row
  }

  const selectedMobileRowKeySet = computed(
    () => new Set(selectedMobileRows.value.map(getComparableRowKey))
  )

  const isMobileRowSelected = (row: Record<string, any>) => {
    return selectedMobileRowKeySet.value.has(getComparableRowKey(row))
  }

  const isMobileRowSelectable = (row: Record<string, any>, rowIndex: number) => {
    const selectable = selectionColumn.value?.selectable
    return typeof selectable === 'function' ? selectable(row, rowIndex) : true
  }

  const handleSelectionChange = (rows: Record<string, any>[]) => {
    selectedMobileRows.value = rows
    emit('selection-change', rows)
  }

  // 移动端卡片选择态需要手动维护，并对外保持 selection-change 事件一致。
  const toggleMobileRowSelection = (
    row: Record<string, any>,
    rowIndex: number,
    checked: boolean | string | number
  ) => {
    if (!isMobileRowSelectable(row, rowIndex)) return

    const rowKey = getComparableRowKey(row)
    const nextRows = selectedMobileRows.value.filter(
      (selectedRow) => getComparableRowKey(selectedRow) !== rowKey
    )
    if (checked) nextRows.push(row)

    selectedMobileRows.value = nextRows
    emit('selection-change', nextRows)
  }

  // 移动端不经过 ElTable，需要手动调用透传进来的原生表格事件监听。
  const callAttrListener = (name: string, ...args: unknown[]) => {
    const listener = attrs[name]
    if (Array.isArray(listener)) {
      listener.forEach((fn) => {
        if (typeof fn === 'function') fn(...args)
      })
      return
    }

    if (typeof listener === 'function') listener(...args)
  }

  const handleMobileRowClick = (row: Record<string, any>, rowIndex: number, event: MouseEvent) => {
    callAttrListener('onRowClick', row, undefined, event)
    callAttrListener('onCellClick', row, undefined, undefined, event)
  }

  // 分页大小变化
  const handleSizeChange = (val: number) => {
    emit('pagination:size-change', val)
  }

  // 分页当前页变化
  const handleCurrentChange = (val: number) => {
    emit('pagination:current-change', val)
    scrollToTop() // 页码改变后滚动到表格顶部
  }

  const { scrollToTop: scrollPageToTop } = useCommon()

  // 滚动表格内容到顶部，并可以联动页面滚动到顶部
  const scrollToTop = () => {
    nextTick(() => {
      if (shouldUseMobileCards.value) {
        mobileCardRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        elTableRef.value?.setScrollTop(0) // 滚动 ElTable 内部滚动条到顶部
      }
      scrollPageToTop() // 调用公共 composable 滚动页面到顶部
    })
  }

  // 全局序号
  const getGlobalIndex = (index: number) => {
    if (!props.pagination) return index + 1
    const { current, size } = props.pagination
    return (current - 1) * size + index + 1
  }

  const emit = defineEmits<{
    (e: 'pagination:size-change', val: number): void
    (e: 'pagination:current-change', val: number): void
    (e: 'selection-change', rows: any[]): void
    (e: 'column-drag-sort', orderedKeys: string[]): void
  }>()

  // 查找并绑定表格头部元素 - 使用 VueUse 优化
  const findTableHeader = () => {
    if (!props.showTableHeader) {
      tableHeaderRef.value = undefined
      return
    }

    const tableHeader = document.getElementById('art-table-header')
    if (tableHeader) {
      tableHeaderRef.value = tableHeader
    } else {
      // 如果找不到表格头部，设置为 undefined，useElementSize 会返回 0
      tableHeaderRef.value = undefined
    }
  }

  watchEffect(
    () => {
      // 访问响应式数据以建立依赖追踪
      void props.data?.length // 追踪数据变化
      const shouldShow = props.showTableHeader

      // 只有在需要显示表格头部时才查找
      if (shouldShow) {
        nextTick(() => {
          findTableHeader()
        })
      } else {
        // 不显示时清空引用
        tableHeaderRef.value = undefined
      }
    },
    { flush: 'post' }
  )

  watch(
    () => props.data,
    () => {
      if (!selectedMobileRows.value.length) return
      const currentRowKeys = new Set(mobileRows.value.map(getComparableRowKey))
      selectedMobileRows.value = selectedMobileRows.value.filter((selectedRow) =>
        currentRowKeys.has(getComparableRowKey(selectedRow))
      )
    }
  )

  watch(
    headerDragSignature,
    () => {
      nextTick(findHeaderDragTarget)
    },
    { flush: 'post', immediate: true }
  )

  onUnmounted(() => {
    if (headerTextSelectTimer) {
      window.clearTimeout(headerTextSelectTimer)
    }

    stopHeaderDragAutoScroll()
    headerSortable.destroy()
  })

  defineExpose({
    scrollToTop,
    elTableRef
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
