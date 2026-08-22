<template>
  <Transition name="hover-menu-panel">
    <div
      v-show="visible"
      class="hover-menu-panel"
      :style="panelStyle"
      @mouseenter="$emit('panel-enter')"
      @mouseleave="$emit('panel-leave')"
    >
      <!-- 顶部搜索框：支持按名称、拼音、首字母过滤 -->
      <div class="hover-menu-panel__search">
        <ElInput
          v-model="keyword"
          clearable
          :placeholder="$t('search.placeholder')"
          @keyup.enter="jumpFirstResult"
        >
          <template #prefix>
            <ArtSvgIcon icon="ri:search-line" class="text-g-500" />
          </template>
        </ElInput>
      </div>

      <ElScrollbar class="hover-menu-panel__scroll">
        <div
          v-if="displayGroups.length > 0"
          class="hover-menu-panel__columns"
          :class="{ 'is-leaf-only': isLeafOnlyLayout }"
        >
          <!-- 多列布局：分组按权重均衡分布到各列 -->
          <div
            v-for="(column, columnIndex) in displayColumns"
            :key="columnIndex"
            class="hover-menu-panel__column"
            :style="columnStyle"
          >
            <section
              v-for="group in column"
              :key="group.key"
              class="hover-menu-panel__group"
              :class="{ 'is-leaf': isLeafGroup(group) }"
            >
              <!-- 叶子分组：本身就是可跳转页面，没有子项 -->
              <button
                v-if="isLeafGroup(group) && group.route"
                type="button"
                class="hover-menu-panel__entry hover-menu-panel__leaf-item"
                :class="{ 'is-active': group.route.path === activePath }"
                @click="goPage(group.route)"
              >
                <!-- <ArtSvgIcon
                  v-if="group.icon"
                  :icon="group.icon"
                  class="hover-menu-panel__leaf-icon"
                /> -->
                <span class="hover-menu-panel__label">{{ group.title }}</span>
                <ItemBadges :show-badge="group.showBadge" :show-text-badge="group.showTextBadge" />
              </button>

              <!-- 目录分组标题（含子项） -->
              <button
                v-else
                type="button"
                class="hover-menu-panel__entry hover-menu-panel__title"
                :class="{ 'is-clickable': group.route }"
                @click="group.route && goPage(group.route)"
              >
                <ArtSvgIcon
                  v-if="group.icon"
                  :icon="group.icon"
                  class="hover-menu-panel__title-icon"
                />
                <span class="hover-menu-panel__label">{{ group.title }}</span>
                <ItemBadges :show-badge="group.showBadge" :show-text-badge="group.showTextBadge" />
              </button>

              <!-- 目录分组下的三级子项 -->
              <div v-if="group.children.length > 0" class="hover-menu-panel__items">
                <button
                  v-for="item in group.children"
                  :key="item.path"
                  type="button"
                  class="hover-menu-panel__entry hover-menu-panel__item"
                  :class="{ 'is-active': item.path === activePath }"
                  @click="goPage(item.route)"
                >
                  <!-- <ArtSvgIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    class="hover-menu-panel__item-icon"
                  /> -->
                  <span class="hover-menu-panel__label">{{ item.title }}</span>
                  <ItemBadges :show-badge="item.showBadge" :show-text-badge="item.showTextBadge" />
                </button>
              </div>
            </section>
          </div>
        </div>

        <div v-else class="hover-menu-panel__empty">
          {{ $t('search.noResult') }}
        </div>
      </ElScrollbar>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useWindowSize } from '@vueuse/core'
  import { pinyin } from 'pinyin-pro'
  import type { AppRouteRecord } from '@/types/router'
  import { formatMenuTitle } from '@/utils/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { useSettingStore } from '@/store/modules/setting'
  import ItemBadges from './HoverMenuPanelBadges.vue'

  defineOptions({ name: 'HoverMenuPanel' })

  // ===== 类型定义 =====

  interface Props {
    /** 面板是否可见 */
    visible: boolean
    /** 当前 hover 命中的一级菜单，决定面板内容 */
    menu?: AppRouteRecord
    /** 全部一级菜单，搜索时跨分组使用 */
    allMenus: AppRouteRecord[]
    /** 当前激活路径，用于高亮 active 项 */
    activePath: string
    /** 左侧 rail 宽度，决定面板左侧偏移 */
    railWidth: number
  }

  /** 面板内子项（三级菜单或目录下的可跳转页面） */
  interface HoverMenuLeaf {
    title: string
    path: string
    icon?: string
    route: AppRouteRecord
    showBadge?: boolean
    showTextBadge?: string
  }

  /** 面板内分组（二级菜单：可能是目录或可跳转的叶子页面） */
  interface HoverMenuGroup {
    key: string
    title: string
    icon?: string
    /** 自身可跳转时存在；纯目录为 undefined */
    route?: AppRouteRecord
    children: HoverMenuLeaf[]
    showBadge?: boolean
    showTextBadge?: string
  }

  // ===== 布局参数（避免散落的魔法数字） =====

  /** 列与列之间间距（与 .hover-menu-panel__columns 的 gap-x-7 对齐） */
  const COLUMN_GAP = 28
  /** 面板内容左右内边距合计（与 .hover-menu-panel__columns 的 px-6 对齐） */
  const PANEL_HORIZONTAL_PADDING = 48
  /** 面板与右侧视口的安全距离 */
  const PANEL_VIEWPORT_INSET = 24
  /** 列宽下限：保证两个汉字 + 图标也不会显得局促 */
  const MIN_COLUMN_WIDTH = 143
  /** 列宽上限：避免长文本被无限拉宽 */
  const MAX_COLUMN_WIDTH = 260
  /** 面板宽度下限 */
  const MIN_PANEL_WIDTH = 280
  /** 面板宽度上限 */
  const MAX_PANEL_WIDTH = 1120

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    menu: undefined,
    allMenus: () => [],
    activePath: '',
    railWidth: 180
  })

  const emit = defineEmits<{
    (e: 'panel-enter'): void
    (e: 'panel-leave'): void
    (e: 'navigate'): void
  }>()

  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)
  const { width } = useWindowSize()
  const keyword = ref('')

  // ===== 路由判定与数据采集 =====

  /**
   * 判断菜单项是否在面板中可见（隐藏菜单不展示）。
   */
  const isVisibleRoute = (item: AppRouteRecord): boolean => !item.meta.isHide

  /**
   * 判断菜单项是否能直接跳转。
   * 既要有可识别的目标（path / 外链 / iframe），也要有承载组件。
   */
  const isNavigableRoute = (item: AppRouteRecord): boolean => {
    const hasTarget = !!(item.path?.trim() || item.meta.link || item.meta.isIframe === true)
    const hasComponent = !!(item.component || item.meta.link || item.meta.isIframe === true)
    return isVisibleRoute(item) && hasTarget && hasComponent
  }

  /**
   * 取格式化后的菜单标题（处理 i18n key 与显示文案）。
   */
  const getRouteTitle = (item: AppRouteRecord): string => formatMenuTitle(item.meta.title)

  /**
   * 取菜单可见的子项。
   */
  const getVisibleChildren = (item: AppRouteRecord): AppRouteRecord[] =>
    item.children?.filter(isVisibleRoute) ?? []

  /**
   * 把可跳转的菜单项转换为面板叶子节点。
   */
  const toLeaf = (item: AppRouteRecord): HoverMenuLeaf => ({
    title: getRouteTitle(item),
    path: item.path || item.meta.title,
    icon: item.meta.icon,
    route: item,
    showBadge: item.meta.showBadge,
    showTextBadge: item.meta.showTextBadge
  })

  /**
   * 把菜单项转换为面板分组。
   * @param children 已采集的子叶子（可为空）
   */
  const toGroup = (item: AppRouteRecord, children: HoverMenuLeaf[]): HoverMenuGroup => ({
    key: item.path || item.meta.title,
    title: getRouteTitle(item),
    icon: item.meta.icon,
    route: isNavigableRoute(item) ? item : undefined,
    children,
    showBadge: item.meta.showBadge,
    showTextBadge: item.meta.showTextBadge
  })

  /**
   * 递归收集叶子节点。遇到目录则下钻，遇到可跳转的最末端节点则收为 leaf。
   */
  const collectLeaves = (items: AppRouteRecord[]): HoverMenuLeaf[] => {
    return items.flatMap((item) => {
      if (!isVisibleRoute(item)) return []

      const children = getVisibleChildren(item)
      if (children.length > 0) {
        const childLeaves = collectLeaves(children)
        if (childLeaves.length > 0) return childLeaves
      }

      return isNavigableRoute(item) ? [toLeaf(item)] : []
    })
  }

  /**
   * 由当前一级菜单构造面板的分组列表。
   * - 一级菜单本身就是叶子时，把它作为唯一 leaf 分组
   * - 否则把它的二级菜单转成分组，每个分组带上自己的子叶子
   */
  const buildGroups = (menu?: AppRouteRecord): HoverMenuGroup[] => {
    if (!menu) return []

    const children = getVisibleChildren(menu)

    if (children.length === 0 && isNavigableRoute(menu)) {
      return [toGroup(menu, [])]
    }

    return children
      .map((child) => toGroup(child, collectLeaves(getVisibleChildren(child))))
      .filter((group) => group.children.length > 0 || group.route)
  }

  /** 当前 hover 命中的一级菜单转出的分组 */
  const currentGroups = computed(() => buildGroups(props.menu))

  /** 是否是不带子项的叶子分组 */
  const isLeafGroup = (group: HoverMenuGroup): boolean => {
    return group.children.length === 0 && Boolean(group.route)
  }

  /** 全量搜索域：遍历所有一级菜单展开成 (group, leaves) */
  const searchableGroups = computed<HoverMenuGroup[]>(() => {
    return props.allMenus
      .filter(isVisibleRoute)
      .map((menu) => toGroup(menu, collectLeaves(getVisibleChildren(menu))))
  })

  // ===== 搜索匹配 =====

  /**
   * 归一化搜索文本：去空白与常见分隔符，转小写。
   */
  const normalizeSearchText = (text: string): string => text.toLowerCase().replace(/[\s/_-]+/g, '')

  /**
   * 子序列匹配：query 的字符按顺序出现在 source 中即可。
   * 用于支持类似 "yhgl" 命中 "yonghuguanli" 的首字母模糊查询。
   */
  const matchSubsequence = (source: string, query: string): boolean => {
    if (!source || !query) return false

    let queryIndex = 0
    for (let i = 0; i < source.length && queryIndex < query.length; i += 1) {
      if (source[i] === query[queryIndex]) queryIndex += 1
    }
    return queryIndex === query.length
  }

  /**
   * 综合匹配菜单标题。
   * 同时尝试三种来源：原文、全拼、首字母，命中其一即可。
   */
  const matchMenuKeyword = (title: string, query: string): boolean => {
    const sources = [
      normalizeSearchText(title),
      normalizeSearchText(pinyin(title, { toneType: 'none' })),
      normalizeSearchText(pinyin(title, { toneType: 'none', pattern: 'first' }))
    ]

    return sources.some((source) => source.includes(query) || matchSubsequence(source, query))
  }

  /**
   * 面板最终展示的分组列表。
   * - 无关键词：展示当前一级菜单
   * - 有关键词：跨菜单全量过滤，子项命中或自身命中（且为叶子分组）的才保留
   */
  const displayGroups = computed<HoverMenuGroup[]>(() => {
    const query = normalizeSearchText(keyword.value)
    if (!query) return currentGroups.value

    return searchableGroups.value
      .map((group) => ({
        ...group,
        children: group.children.filter((item) => matchMenuKeyword(item.title, query))
      }))
      .filter((group) => {
        if (group.children.length > 0) return true
        // 子项无命中时，仅当 group 自身可跳转且标题命中才作为叶子保留
        return Boolean(group.route) && matchMenuKeyword(group.title, query)
      })
  })

  // ===== 自适应布局 =====

  /**
   * 计算文本"视觉宽度"权重：CJK 算 2，其他算 1。
   * 用来推断列宽下限。
   */
  const textWeight = (text: string): number => {
    return Array.from(text).reduce((total, char) => {
      return total + (/[\u2e80-\u9fff]/.test(char) ? 2 : 1)
    }, 0)
  }

  /** 当前展示集合中最长的标题权重 */
  const longestTextWeight = computed(() => {
    return displayGroups.value.reduce((max, group) => {
      const childMax = group.children.reduce(
        (acc, item) => Math.max(acc, textWeight(item.title)),
        0
      )
      return Math.max(max, textWeight(group.title), childMax)
    }, 8)
  })

  /** 当前展示集合是否全部都是叶子分组（决定使用紧凑布局） */
  const isLeafOnlyLayout = computed(() => {
    return displayGroups.value.length > 0 && displayGroups.value.every(isLeafGroup)
  })

  /**
   * 估算分组的视觉权重，供按列均衡分配使用。
   * 叶子分组按 1 计；目录分组以 1.8 起步、每个子项加 0.85。
   */
  const getGroupWeight = (group: HoverMenuGroup): number => {
    if (isLeafGroup(group)) return 1
    return 1.8 + group.children.length * 0.85
  }

  /**
   * 根据分组数 / 总权重决定列数（不超过可用宽度允许的列数）。
   */
  const decideColumnCount = (totalWeight: number, groupCount: number, maxByWidth: number) => {
    const ideal = (() => {
      if (isLeafOnlyLayout.value) {
        if (groupCount <= 8) return 1
        if (groupCount <= 16) return 2
        if (groupCount <= 27) return 3
        return 4
      }

      if (totalWeight <= 8) return 1
      if (totalWeight <= 16) return 2
      if (totalWeight <= 28) return 3
      return 4
    })()

    return Math.min(ideal, maxByWidth)
  }

  /**
   * 综合所有约束推算面板尺寸。
   */
  const layoutMetrics = computed(() => {
    const groupCount = Math.max(displayGroups.value.length, 1)
    const availableWidth = Math.max(
      width.value - props.railWidth - PANEL_VIEWPORT_INSET,
      MIN_PANEL_WIDTH
    )
    const cappedWidth = Math.min(availableWidth, MAX_PANEL_WIDTH)

    const columnWidth = Math.min(
      Math.max(longestTextWeight.value * 7 + 48, MIN_COLUMN_WIDTH),
      MAX_COLUMN_WIDTH
    )
    const maxByWidth = Math.max(
      1,
      Math.floor((cappedWidth + COLUMN_GAP) / (columnWidth + COLUMN_GAP))
    )
    const totalWeight = displayGroups.value.reduce((sum, g) => sum + getGroupWeight(g), 0)

    const columns = decideColumnCount(totalWeight, groupCount, maxByWidth)
    const contentWidth =
      columns * columnWidth + (columns - 1) * COLUMN_GAP + PANEL_HORIZONTAL_PADDING
    const panelWidth = Math.min(cappedWidth, Math.max(contentWidth, MIN_PANEL_WIDTH))

    return { columns, columnWidth, panelWidth }
  })

  /** 面板的容器定位与宽度（考虑 RTL） */
  const panelStyle = computed<CSSProperties>(() => {
    const inlineOffset = `${props.railWidth}px`
    return {
      width: `${layoutMetrics.value.panelWidth}px`,
      insetInlineStart: isRtl.value ? 'auto' : inlineOffset,
      insetInlineEnd: isRtl.value ? inlineOffset : 'auto'
    }
  })

  /** 单列宽度，由 layoutMetrics 推得 */
  const columnStyle = computed<CSSProperties>(() => ({
    width: `${layoutMetrics.value.columnWidth}px`,
    flexBasis: `${layoutMetrics.value.columnWidth}px`
  }))

  /**
   * 把分组分配到 N 列。
   * - 叶子分组列表：按数量平均切片，保持顺序稳定
   * - 含目录的混合列表：按权重最小列优先分配，避免某列过载
   */
  const displayColumns = computed<HoverMenuGroup[][]>(() => {
    const columnCount = layoutMetrics.value.columns
    const groups = displayGroups.value

    if (columnCount <= 1) return [groups]

    if (isLeafOnlyLayout.value) {
      const size = Math.ceil(groups.length / columnCount)
      return Array.from({ length: columnCount }, (_, index) =>
        groups.slice(index * size, index * size + size)
      ).filter((column) => column.length > 0)
    }

    const columns = Array.from({ length: columnCount }, () => [] as HoverMenuGroup[])
    const weights = Array.from({ length: columnCount }, () => 0)

    groups.forEach((group) => {
      const targetIndex = weights.indexOf(Math.min(...weights))
      columns[targetIndex].push(group)
      weights[targetIndex] += getGroupWeight(group)
    })

    return columns.filter((column) => column.length > 0)
  })

  // ===== 跳转交互 =====

  /** 搜索回车时跳到的首个候选 */
  const firstResult = computed(() => {
    const firstGroup = displayGroups.value[0]
    return firstGroup?.children[0]?.route || firstGroup?.route
  })

  /**
   * 跳转到目标菜单页面，并通知父组件可以关闭面板。
   */
  const goPage = (item: AppRouteRecord): void => {
    handleMenuJump(item)
    emit('navigate')
  }

  /**
   * 搜索框回车：如有命中，跳转到首项。
   */
  const jumpFirstResult = (): void => {
    if (firstResult.value) goPage(firstResult.value)
  }

  // 面板隐藏时清空搜索词，避免下次打开仍然停在过滤态
  watch(
    () => props.visible,
    (visible) => {
      if (!visible) keyword.value = ''
    }
  )
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .hover-menu-panel {
    @apply fixed top-0 z-[1200] flex h-screen flex-col border-r;

    background: var(--theme-menu-bg, var(--default-box-color));
    border-color: var(--theme-menu-border, var(--default-border));
    box-shadow: 4px 0 16px rgb(15 23 42 / 8%);
  }

  [dir='rtl'] .hover-menu-panel {
    box-shadow: -4px 0 16px rgb(15 23 42 / 8%);
  }

  .hover-menu-panel__search {
    @apply shrink-0 px-6 pb-4 pt-5;
  }

  .hover-menu-panel__scroll {
    @apply min-h-0 flex-1;
  }

  .hover-menu-panel__columns {
    @apply flex items-start gap-x-7 px-6 pb-8 pt-1;
  }

  .hover-menu-panel__columns.is-leaf-only {
    @apply gap-x-4;
  }

  .hover-menu-panel__column {
    @apply flex shrink-0 flex-col gap-1.5;
  }

  /* 分组容器：目录类 hover 出浅色卡片，叶子类无 padding 直接贴边 */
  .hover-menu-panel__group {
    @apply min-w-0 rounded-custom-xs p-1;

    transition:
      background-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .hover-menu-panel__group:not(.is-leaf):hover {
    background: #fff;
    box-shadow: 0 0 12px rgb(0 0 0 / 8%);
  }

  .dark .hover-menu-panel__group:not(.is-leaf):hover {
    background: var(--default-box-color);
    box-shadow: 0 0 12px rgb(0 0 0 / 40%);
  }

  .hover-menu-panel__group.is-leaf {
    @apply flex p-0;
  }

  /* 通用 button 行：title / leaf-item / item 三类共享的基础样式 */
  .hover-menu-panel__entry {
    @apply flex min-h-7 w-full max-w-full items-center gap-1.5 rounded-custom-xs px-1.5 text-left leading-7;
  }

  .hover-menu-panel__entry.is-active {
    color: var(--theme-menu-active-text);
    background: var(--theme-menu-active-bg);
  }

  /* 目录标题（非 clickable 时不响应 hover 视觉） */
  .hover-menu-panel__title {
    @apply mb-1.5 text-[15px] font-medium;

    color: var(--theme-menu-heading);
  }

  .hover-menu-panel__title.is-clickable {
    @apply cursor-pointer;
  }

  .hover-menu-panel__title.is-clickable:hover {
    color: var(--theme-menu-active-text);
    background: var(--theme-menu-hover);
  }

  .hover-menu-panel__title.is-clickable:hover .hover-menu-panel__title-icon {
    color: var(--theme-menu-active-icon);
  }

  .hover-menu-panel__title-icon {
    @apply shrink-0 text-[1.05rem];

    color: var(--theme-menu-icon);
  }

  /* 三级子项 */
  .hover-menu-panel__items {
    @apply flex flex-col items-start gap-1;
  }

  .hover-menu-panel__item {
    @apply cursor-pointer gap-1 text-[13px];

    color: var(--theme-menu-text);
  }

  .hover-menu-panel__item:hover {
    color: var(--theme-menu-active-text);
    background: var(--theme-menu-hover);
  }

  .hover-menu-panel__item:hover .hover-menu-panel__item-icon,
  .hover-menu-panel__item.is-active .hover-menu-panel__item-icon {
    color: var(--theme-menu-active-icon);
  }

  .hover-menu-panel__item-icon {
    @apply shrink-0 text-[15px];

    color: var(--theme-menu-icon);
  }

  /* 叶子分组（一级菜单本身可跳转） */
  .hover-menu-panel__leaf-item {
    @apply cursor-pointer text-sm font-normal;

    color: var(--theme-menu-text);
  }

  .hover-menu-panel__leaf-item:hover {
    color: var(--theme-menu-active-text);
    background: var(--theme-menu-hover);
  }

  .hover-menu-panel__leaf-item:hover .hover-menu-panel__leaf-icon,
  .hover-menu-panel__leaf-item.is-active .hover-menu-panel__leaf-icon {
    color: var(--theme-menu-active-icon);
  }

  .hover-menu-panel__leaf-icon {
    @apply shrink-0 text-base;

    color: var(--theme-menu-icon);
  }

  .hover-menu-panel__label {
    @apply min-w-0 flex-1 truncate;
  }

  .hover-menu-panel__empty {
    @apply px-6 py-10 text-center text-sm text-g-500;
  }

  /* 入场：扩展曲线，从更远滑入更"弹" */
  .hover-menu-panel-enter-active {
    transition:
      opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* 离场：收尾果断，时长更短，避免黏滞感 */
  .hover-menu-panel-leave-active {
    pointer-events: none;
    transition:
      opacity 140ms cubic-bezier(0.4, 0, 1, 1),
      transform 140ms cubic-bezier(0.4, 0, 1, 1);
  }

  .hover-menu-panel-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }

  .hover-menu-panel-leave-to {
    opacity: 0;
    transform: translateX(-4px);
  }

  [dir='rtl'] .hover-menu-panel-enter-from {
    transform: translateX(10px);
  }

  [dir='rtl'] .hover-menu-panel-leave-to {
    transform: translateX(4px);
  }
</style>
