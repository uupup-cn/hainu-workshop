<!-- 全局搜索组件 -->
<template>
  <div class="layout-search">
    <ElDialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <ElInput
        v-model.trim="searchVal"
        :placeholder="$t('search.placeholder')"
        @input="search"
        @blur="searchBlur"
        ref="searchInput"
        :prefix-icon="Search"
        class="h-12"
      >
        <template #suffix>
          <div
            class="h-4.5 flex-cc rounded border border-g-300 dark:!bg-g-200/50 !bg-box px-1.5 text-g-500"
          >
            <ArtSvgIcon icon="fluent:arrow-enter-left-20-filled" />
          </div>
        </template>
      </ElInput>
      <ElScrollbar
        class="search-result-scrollbar mt-5"
        max-height="370px"
        ref="searchResultScrollbar"
        :native="false"
      >
        <div class="result w-full" v-show="searchResult.length">
          <div
            class="box !mt-0 c-p text-base leading-none"
            v-for="(item, index) in searchResult"
            :key="item.key"
          >
            <div
              class="mt-2 min-h-14 flex-cb rounded-custom-sm bg-g-200/50 px-4 py-3 text-sm text-g-700"
              :class="
                isHighlighted(index)
                  ? 'highlighted !bg-theme/70 !text-white [&_.search-path]:!text-white/80 [&_.action-badge]:!bg-white/15 [&_.action-badge]:!text-white'
                  : ''
              "
              @click="searchGoPage(item)"
              @mousemove="highlightOnHover(index)"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <span>
                    <template
                      v-for="(part, partIndex) in getHighlightParts(
                        item.title,
                        item.titleHighlight
                      )"
                      :key="`title-${partIndex}`"
                    >
                      <span :class="part.highlight ? 'search-match-highlight' : ''">{{
                        part.text
                      }}</span>
                    </template>
                  </span>
                  <span
                    v-if="item.kind === 'action'"
                    class="action-badge rounded bg-theme/10 px-1.5 py-0.5 text-[10px] font-medium text-theme"
                  >
                    操作
                  </span>
                </div>
                <div class="search-path mt-1 truncate text-xs text-g-500">
                  <template
                    v-for="(part, partIndex) in getHighlightParts(
                      item.pathLabel,
                      item.pathHighlight
                    )"
                    :key="`path-${partIndex}`"
                  >
                    <span :class="part.highlight ? 'search-match-highlight' : ''">{{
                      part.text
                    }}</span>
                  </template>
                </div>
              </div>
              <ArtSvgIcon
                v-show="isHighlighted(index)"
                icon="fluent:arrow-enter-left-20-filled"
                class="ml-3 shrink-0"
              />
            </div>
          </div>
        </div>

        <div v-show="!searchVal && searchResult.length === 0">
          <div v-if="recentEntries.length" class="history-result">
            <div class="flex-cb text-xs text-g-500">
              <p>{{ $t('search.recentTitle') }}</p>
              <button
                type="button"
                class="search-section-clear flex-cc"
                :title="$t('search.clearRecent')"
                @click.stop="clearHistory"
              >
                <ArtSvgIcon icon="ri:delete-bin-line" class="text-xs" />
              </button>
            </div>
            <div class="mt-1.5 w-full">
              <div
                class="box mt-2 min-h-14 c-p flex-cb rounded-custom-sm bg-g-200/50 px-4 py-3 text-sm text-g-800"
                v-for="(entry, index) in recentEntries"
                :key="`recent-${entry.item.key}`"
                :class="
                  emptyStateIndex === index
                    ? 'highlighted !bg-theme/70 !text-white [&_.search-path]:!text-white/80 [&_.selected-icon]:!text-white [&_.action-badge]:!bg-white/15 [&_.action-badge]:!text-white'
                    : ''
                "
                @click="searchGoPage(entry.item)"
                @mousemove="highlightEmptyState(index)"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-sm font-medium">
                    <span>{{ entry.item.title }}</span>
                    <span
                      v-if="entry.item.kind === 'action'"
                      class="action-badge rounded bg-theme/10 px-1.5 py-0.5 text-[10px] font-medium text-theme"
                    >
                      操作
                    </span>
                  </div>
                  <div class="search-path mt-1 truncate text-xs text-g-500">{{
                    entry.item.pathLabel
                  }}</div>
                </div>
                <div
                  class="size-5 selected-icon ml-3 shrink-0 select-none rounded-full text-g-500 flex-cc c-p"
                  :title="$t('search.removeRecent')"
                  @click.stop="deleteHistory(entry.historyIndex)"
                >
                  <ArtSvgIcon icon="ri:close-large-fill" class="text-xs" />
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="frequentItems.length"
            class="frequent-result"
            :class="recentEntries.length ? 'mt-5' : ''"
          >
            <div class="flex-cb text-xs text-g-500">
              <p>{{ $t('search.frequentTitle') }}</p>
              <button
                type="button"
                class="search-section-clear flex-cc"
                :title="$t('search.clearFrequent')"
                @click.stop="clearFrequentItems"
              >
                <ArtSvgIcon icon="ri:delete-bin-line" class="text-xs" />
              </button>
            </div>
            <div class="mt-1.5 w-full">
              <div
                class="box mt-2 min-h-14 c-p flex-cb rounded-custom-sm bg-g-200/50 px-4 py-3 text-sm text-g-800"
                v-for="(item, index) in frequentItems"
                :key="`frequent-${item.key}`"
                :class="
                  emptyStateIndex === index + recentEntries.length
                    ? 'highlighted !bg-theme/70 !text-white [&_.search-path]:!text-white/80 [&_.selected-icon]:!text-white [&_.action-badge]:!bg-white/15 [&_.action-badge]:!text-white'
                    : ''
                "
                @click="searchGoPage(item)"
                @mousemove="highlightEmptyState(index + recentEntries.length)"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-sm font-medium">
                    <span>{{ item.title }}</span>
                    <span
                      v-if="item.kind === 'action'"
                      class="action-badge rounded bg-theme/10 px-1.5 py-0.5 text-[10px] font-medium text-theme"
                    >
                      操作
                    </span>
                  </div>
                  <div class="search-path mt-1 truncate text-xs text-g-500">{{
                    item.pathLabel
                  }}</div>
                </div>
                <div
                  class="size-5 selected-icon ml-3 shrink-0 select-none rounded-full text-g-500 flex-cc c-p"
                  :title="$t('search.removeFrequent')"
                  @click.stop="deleteFrequentItem(item.key)"
                >
                  <ArtSvgIcon icon="ri:close-large-fill" class="text-xs" />
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!recentEntries.length && !frequentItems.length"
            class="mt-5 flex flex-col items-center justify-center pb-6 text-center text-g-500"
          >
            <p class="text-sm">{{ $t('search.emptyState') }}</p>
          </div>
        </div>

        <div
          v-show="Boolean(searchVal) && searchResult.length === 0"
          class="mt-10 pb-6 text-center text-g-500"
        >
          <ArtSvgIcon icon="ri:search-eye-line" class="text-2xl" />
          <p class="mt-3 text-sm">{{ $t('search.noResult') }}</p>
          <p class="mt-1 text-xs">{{ $t('search.noResultTip') }}</p>
        </div>
      </ElScrollbar>

      <template #footer>
        <div class="dialog-footer box-border flex-c border-t-d pt-4.5 pb-1">
          <div class="flex-cc">
            <ArtSvgIcon icon="fluent:arrow-enter-left-20-filled" class="keyboard" />
            <span class="mr-3.5 text-xs text-g-700">{{ $t('search.selectKeydown') }}</span>
          </div>
          <div class="flex-c">
            <ArtSvgIcon icon="ri:arrow-up-wide-fill" class="keyboard" />
            <ArtSvgIcon icon="ri:arrow-down-wide-fill" class="keyboard" />
            <span class="mr-3.5 text-xs text-g-700">{{ $t('search.switchKeydown') }}</span>
          </div>
          <div class="flex-c">
            <i class="keyboard !w-8 flex-cc"><p class="text-[10px] font-medium">ESC</p></i>
            <span class="mr-3.5 text-xs text-g-700">{{ $t('search.exitKeydown') }}</span>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { AppRouteRecord } from '@/types/router'
  import { Search } from '@element-plus/icons-vue'
  import { consumeMittEvent, mittBus } from '@/utils/sys'
  import { useMenuStore } from '@/store/modules/menu'
  import { handleMenuJump } from '@/utils/navigation'
  import { type ScrollbarInstance } from 'element-plus'
  import { router } from '@/router'
  import {
    buildSearchMenuIndex,
    getFrequentMenuItems,
    getRouteSearchKey,
    searchMenuItems,
    type SearchHighlightRange,
    type SearchMenuItem
  } from './search-utils'

  defineOptions({ name: 'ArtGlobalSearch' })

  const userStore = useUserStore()
  const { menuList } = storeToRefs(useMenuStore())

  const showSearchDialog = ref(false)
  const searchVal = ref('')
  const historyMaxLength = 10

  const { searchHistory: historyResult, searchUsageMap } = storeToRefs(userStore)

  const searchInput = ref<HTMLInputElement | null>(null)
  const highlightedIndex = ref(0)
  const emptyStateIndex = ref(0)
  const searchResultScrollbar = ref<ScrollbarInstance>()
  const isKeyboardNavigating = ref(false) // 新增状态：是否正在使用键盘导航
  const SEARCH_DIALOG_CLOSE_DELAY = 220
  const ACTION_NAVIGATION_DELAY = 260

  const menuIndex = computed(() => buildSearchMenuIndex(menuList.value))
  const menuIndexMap = computed(
    () => new Map(menuIndex.value.map((item) => [item.key, item] as const))
  )
  const searchResult = computed(() =>
    searchMenuItems(menuList.value, searchVal.value, searchUsageMap.value).slice(0, 20)
  )
  const recentEntries = computed(() =>
    historyResult.value
      .map((item, historyIndex) => ({
        historyIndex,
        item: menuIndexMap.value.get(getRouteSearchKey(item))
      }))
      .filter((entry): entry is { historyIndex: number; item: SearchMenuItem } =>
        Boolean(entry.item)
      )
      .slice(0, historyMaxLength)
  )
  const recentItems = computed(() => recentEntries.value.map((entry) => entry.item))
  const frequentItems = computed(() => {
    const recentKeys = new Set(recentItems.value.map((item) => item.key))
    return getFrequentMenuItems(menuList.value, searchUsageMap.value, 6).filter(
      (item) => !recentKeys.has(item.key)
    )
  })
  const emptyStateItems = computed(() => [...recentItems.value, ...frequentItems.value])

  // 生命周期钩子
  onMounted(() => {
    mittBus.on('openSearchDialog', openSearchDialog)
    document.addEventListener('keydown', handleKeydown)

    const pendingOpen = consumeMittEvent('openSearchDialog')
    if (pendingOpen.found) {
      nextTick(() => {
        openSearchDialog()
      })
    }
  })

  onUnmounted(() => {
    mittBus.off('openSearchDialog', openSearchDialog)
    document.removeEventListener('keydown', handleKeydown)
  })

  // 处理全局快捷键，并在弹窗打开时接管上下键与回车键。
  const handleKeydown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey

    if (isCommandKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      openSearchDialog()
    }

    // 当搜索对话框打开时，处理方向键和回车键
    if (showSearchDialog.value) {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        highlightPrevious()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        highlightNext()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        selectHighlighted()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        showSearchDialog.value = false
      }
    }
  }

  // 延迟聚焦输入框，避免弹窗动画尚未完成时焦点抢占失败。
  const focusInput = () => {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }

  // 重置列表高亮索引，保证搜索条件变化后从第一项开始选中。
  const search = () => {
    highlightedIndex.value = 0
    emptyStateIndex.value = 0
  }

  // 将命中区间拆成前缀、命中、后缀三段，便于局部高亮渲染。
  const getHighlightParts = (text: string, range?: SearchHighlightRange) => {
    if (!range || range.start < 0 || range.end <= range.start || range.start >= text.length) {
      return [{ text, highlight: false }]
    }

    const start = Math.max(0, range.start)
    const end = Math.min(text.length, range.end)

    return [
      start > 0 ? { text: text.slice(0, start), highlight: false } : null,
      { text: text.slice(start, end), highlight: true },
      end < text.length ? { text: text.slice(end), highlight: false } : null
    ].filter((part): part is { text: string; highlight: boolean } => Boolean(part?.text))
  }

  // 释放键盘导航状态，避免鼠标悬停和键盘选择互相干扰。
  const finishKeyboardNavigation = () => {
    setTimeout(() => {
      isKeyboardNavigating.value = false
    }, 100)
  }

  // 向上移动选中项，并同步滚动到可视区域。
  const highlightPrevious = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      if (!searchResult.value.length) {
        finishKeyboardNavigation()
        return
      }
      highlightedIndex.value =
        (highlightedIndex.value - 1 + searchResult.value.length) % searchResult.value.length
      scrollToHighlightedItem('.result .box', highlightedIndex.value)
    } else {
      if (!emptyStateItems.value.length) {
        finishKeyboardNavigation()
        return
      }
      emptyStateIndex.value =
        (emptyStateIndex.value - 1 + emptyStateItems.value.length) % emptyStateItems.value.length
      scrollToHighlightedItem('.history-result .box, .frequent-result .box', emptyStateIndex.value)
    }
    finishKeyboardNavigation()
  }

  // 向下移动选中项，并同步滚动到可视区域。
  const highlightNext = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      if (!searchResult.value.length) {
        finishKeyboardNavigation()
        return
      }
      highlightedIndex.value = (highlightedIndex.value + 1) % searchResult.value.length
      scrollToHighlightedItem('.result .box', highlightedIndex.value)
    } else {
      if (!emptyStateItems.value.length) {
        finishKeyboardNavigation()
        return
      }
      emptyStateIndex.value = (emptyStateIndex.value + 1) % emptyStateItems.value.length
      scrollToHighlightedItem('.history-result .box, .frequent-result .box', emptyStateIndex.value)
    }
    finishKeyboardNavigation()
  }

  // 将当前高亮项滚动到可视区域内，避免键盘操作时看不到焦点。
  const scrollToHighlightedItem = (selector: string, index: number) => {
    nextTick(() => {
      if (!searchResultScrollbar.value) return

      const scrollWrapper = searchResultScrollbar.value.wrapRef
      if (!scrollWrapper) return

      const highlightedElements = scrollWrapper.querySelectorAll(selector)
      if (!highlightedElements[index]) return

      const highlightedElement = highlightedElements[index] as HTMLElement
      const itemHeight = highlightedElement.offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = highlightedElement.offsetTop
      const itemBottom = itemTop + itemHeight

      if (itemTop < scrollTop) {
        searchResultScrollbar.value.setScrollTop(itemTop)
      } else if (itemBottom > scrollTop + containerHeight) {
        searchResultScrollbar.value.setScrollTop(itemBottom - containerHeight)
      }
    })
  }

  // 执行当前高亮项的跳转动作，支持搜索结果和空态列表。
  const selectHighlighted = () => {
    if (searchVal.value && searchResult.value.length) {
      searchGoPage(searchResult.value[highlightedIndex.value])
    } else if (!searchVal.value && emptyStateItems.value.length) {
      searchGoPage(emptyStateItems.value[emptyStateIndex.value])
    }
  }

  const isHighlighted = (index: number) => {
    return highlightedIndex.value === index
  }

  // 失焦时重置高亮，避免重新打开弹窗时保留旧选择。
  const searchBlur = () => {
    highlightedIndex.value = 0
    emptyStateIndex.value = 0
  }

  // 重置空态列表的高亮索引，防止删除或清空后越界。
  const resetHighlightedIndex = () => {
    highlightedIndex.value = 0
    emptyStateIndex.value = 0
  }

  // 将结果列表滚动条回到顶部，配合弹窗重新打开的体验。
  const resetSearchScrollTop = () => {
    nextTick(() => {
      searchResultScrollbar.value?.setScrollTop(0)
    })
  }

  // 跳转到目标页面，并把命中来源写入历史和统计。
  const searchGoPage = (item: SearchMenuItem | AppRouteRecord) => {
    const targetRoute = 'route' in item ? item.route : item
    const usageKey = 'usageKey' in item ? item.usageKey : getRouteSearchKey(targetRoute)

    showSearchDialog.value = false
    addHistory(targetRoute)
    userStore.recordSearchUsage(usageKey)
    searchVal.value = ''
    window.setTimeout(() => {
      if ('kind' in item && item.kind === 'action') {
        mittBus.emit('closePageDialogs')
        window.setTimeout(() => {
          void router.push(item.navigatePath)
        }, ACTION_NAVIGATION_DELAY)
      } else {
        handleMenuJump(targetRoute)
      }
    }, SEARCH_DIALOG_CLOSE_DELAY)
  }

  // 将内存中的历史记录同步回 store，保持持久化状态一致。
  const updateHistory = () => {
    if (Array.isArray(historyResult.value)) {
      userStore.setSearchHistory(historyResult.value)
    }
  }

  // 将当前路由加入历史，并限制历史长度，避免列表过长。
  const addHistory = (item: AppRouteRecord) => {
    const itemKey = item.path || String(item.meta.link || '')
    const hasItemIndex = historyResult.value.findIndex(
      (historyItem: AppRouteRecord) =>
        (historyItem.path || String(historyItem.meta.link || '')) === itemKey
    )

    if (hasItemIndex !== -1) {
      historyResult.value.splice(hasItemIndex, 1)
    } else if (historyResult.value.length >= historyMaxLength) {
      historyResult.value.pop()
    }

    const cleanedItem = { ...item, meta: { ...item.meta } }
    delete cleanedItem.children
    delete cleanedItem.meta.authList
    historyResult.value.unshift(cleanedItem)
    updateHistory()
  }

  // 删除一条最近历史并修正当前空态高亮位置。
  const deleteHistory = (index: number) => {
    historyResult.value.splice(index, 1)
    updateHistory()
    clampEmptyStateIndex()
  }

  // 清空最近历史并同步修正高亮状态。
  const clearHistory = () => {
    userStore.setSearchHistory([])
    clampEmptyStateIndex()
  }

  // 删除一条高频使用记录，便于用户手动清理。
  const deleteFrequentItem = (key: string) => {
    userStore.removeSearchUsage(key)
    clampEmptyStateIndex()
  }

  // 清空全部高频记录，恢复默认推荐列表。
  const clearFrequentItems = () => {
    userStore.clearSearchUsage()
    clampEmptyStateIndex()
  }

  // 防止删除/清空后空态索引超出可用范围。
  const clampEmptyStateIndex = () => {
    nextTick(() => {
      emptyStateIndex.value = Math.max(
        0,
        Math.min(emptyStateIndex.value, emptyStateItems.value.length - 1)
      )
    })
  }

  // 打开搜索弹窗时同步重置状态、滚动位置和输入焦点。
  const openSearchDialog = () => {
    resetHighlightedIndex()
    showSearchDialog.value = true
    resetSearchScrollTop()
    focusInput()
  }

  // 关闭弹窗时顺手清理输入内容和高亮状态。
  const closeSearchDialog = () => {
    searchVal.value = ''
    resetHighlightedIndex()
  }

  // 只有鼠标真实移动时才更新 hover 高亮，避免初始打开就误选中条目。
  const highlightOnHover = (index: number) => {
    if (!isKeyboardNavigating.value && searchVal.value) {
      highlightedIndex.value = index
    }
  }

  // 空态列表同样只在鼠标移动时更新高亮。
  const highlightEmptyState = (index: number) => {
    if (!isKeyboardNavigating.value && !searchVal.value) {
      emptyStateIndex.value = index
    }
  }
</script>
<style lang="scss" scoped>
  .layout-search {
    :deep(.search-modal) {
      background-color: rgb(0 0 0 / 20%);
    }

    :deep(.el-dialog__body) {
      padding: 5px 0 0 !important;
    }

    :deep(.el-dialog__header) {
      padding: 0;
    }

    .el-input {
      :deep(.el-input__wrapper) {
        column-gap: 8px;
        background: var(--art-surface-bg-muted) !important;
        border: 1px solid var(--art-input-border-color) !important;
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
        box-shadow: none !important;
      }

      :deep(.el-input__inner) {
        color: var(--art-gray-800) !important;
      }

      :deep(.el-input__prefix-inner > :last-child),
      :deep(.el-input__suffix-inner > :first-child),
      :deep(.el-input__icon) {
        margin: 0;
      }
    }

    .search-result-scrollbar {
      :deep(.el-scrollbar__bar) {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover {
        :deep(.el-scrollbar__bar) {
          opacity: 1;
        }
      }
    }

    .search-section-clear {
      width: 20px;
      height: 20px;
      color: var(--art-gray-500);
      cursor: pointer;
      border-radius: 4px;
      transition:
        color 0.2s ease,
        background-color 0.2s ease;

      &:hover {
        color: var(--art-gray-800);
        background-color: var(--art-gray-200);
      }
    }

    .search-match-highlight {
      display: inline;
      padding: 0 2px;
      color: #1f2937 !important;
      background-color: #fef08a;
      border-radius: 2px;
      box-decoration-break: clone;
      box-shadow: inset 0 -0.28em rgb(250 204 21 / 28%);
    }
  }

  .dark .layout-search :deep(.search-modal) {
    background-color: rgb(23 23 26 / 60%);
    backdrop-filter: none;
  }

  .dark .layout-search :deep(.el-dialog) {
    background-color: #252526;
  }

  .dark .layout-search .el-input :deep(.el-input__wrapper) {
    border-color: var(--art-input-border-color) !important;
  }
</style>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .keyboard {
    @apply mr-2 
    box-border
    h-5 
    w-5.5
    rounded
    border 
    border-g-400 
    px-1 
    text-g-500
    shadow-[0_2px_0_var(--default-border-dashed)] 
    last-of-type:mr-1.5;
  }
</style>
