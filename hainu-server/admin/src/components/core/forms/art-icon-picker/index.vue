<template>
  <div class="flex w-full items-center">
    <div
      class="flex h-[var(--el-component-custom-height)] min-w-0 flex-1 items-stretch overflow-hidden rounded-custom-sm border border-[var(--el-border-color-light)] bg-transparent transition-colors duration-200 hover:border-[var(--el-border-color)] focus-within:border-[var(--el-border-color)]"
    >
      <div
        class="flex h-full w-10 shrink-0 items-center justify-center border-r border-[var(--el-border-color-light)] bg-box text-g-700"
        :class="{ 'art-icon-picker-preview--colored': hasColorOptions }"
        :style="currentColorStyle"
      >
        <ArtSvgIcon v-if="committedIcon" :icon="committedIcon" class="text-lg" />
        <ArtSvgIcon v-else icon="ri:apps-line" class="text-lg text-g-500" />
      </div>

      <ElInput
        v-model="inputValue"
        :placeholder="placeholder"
        clearable
        class="art-icon-picker-input min-w-0 flex-1 self-stretch"
        @clear="handleClear"
      />

      <button
        type="button"
        class="c-p flex h-full shrink-0 items-center border-l border-[var(--el-border-color-light)] bg-box px-3 text-[13px] text-g-700 tad-200 hover:bg-[var(--art-gray-200)] dark:hover:bg-[var(--art-gray-300)]"
        @click="panelVisible = true"
      >
        选择图标
      </button>
    </div>
  </div>

  <ElDialog
    v-model="panelVisible"
    title="选择图标"
    width="min(760px, calc(100vw - 48px))"
    class="art-icon-picker-dialog"
    append-to-body
    destroy-on-close
    align-center
  >
    <div class="art-icon-picker-dialog__content">
      <section class="art-surface-sm p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ElInput
            v-model="searchKeyword"
            placeholder="搜索图标名称，如 user、menu、setting"
            clearable
            class="w-full lg:max-w-[420px]"
          >
            <template #prefix>
              <ArtSvgIcon icon="ri:search-line" class="text-base text-g-500" />
            </template>
          </ElInput>

          <div class="flex shrink-0 items-center gap-2 text-xs text-g-500">
            <span class="rounded-full bg-[var(--default-bg-color)] px-3 py-1"> Remix Icon </span>
            <span class="rounded-full bg-[var(--default-bg-color)] px-3 py-1">
              共 {{ filteredIcons.length }} 个
            </span>
          </div>
        </div>

        <div v-if="hasColorOptions" class="mt-4 border-t border-[var(--default-border)] pt-4">
          <div class="mb-2 text-xs font-medium text-g-700">图标颜色</div>
          <div class="art-icon-picker-color-list flex flex-wrap gap-2">
            <button
              v-for="item in colorOptions"
              :key="item.value"
              type="button"
              class="art-icon-picker-color-option"
              :class="{ 'is-active': currentColor === item.value }"
              :style="getColorOptionStyle(item.value)"
              :title="item.label"
              @click="selectColor(item.value)"
            >
              <ArtSvgIcon :icon="currentIconForPanel || 'ri:user-line'" />
            </button>
          </div>
        </div>
      </section>

      <section class="art-icon-picker-list-section art-surface-sm p-4">
        <ElScrollbar
          ref="iconListScrollbarRef"
          max-height="248px"
          class="art-icon-picker-list-scroll"
          wrap-class="pr-1"
          @scroll="handleIconListScroll"
        >
          <div
            v-if="visibleIcons.length"
            class="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
          >
            <button
              v-for="item in visibleIcons"
              :key="item.icon"
              type="button"
              class="art-icon-picker-icon-item group flex h-14 items-center justify-center rounded-custom-sm border tad-200"
              :class="getIconItemClass(item.icon)"
              :title="item.icon"
              @click="selectIcon(item.icon)"
            >
              <ArtSvgIcon :icon="item.icon" class="text-xl" />
            </button>
          </div>

          <div
            v-else
            class="flex min-h-[248px] flex-col items-center justify-center gap-3 text-center text-g-500"
          >
            <ArtSvgIcon icon="ri:search-eye-line" class="text-4xl" />
            <div class="text-sm">没有找到匹配的图标</div>
            <div class="text-xs">可以尝试搜索更短的关键词，或直接在输入框中填写完整图标名。</div>
          </div>
        </ElScrollbar>

        <div
          class="-mx-4 mt-4 border-t border-[var(--default-border)] px-4 pt-4 text-left text-xs text-g-500"
        >
          已显示 {{ visibleIcons.length }} / {{ filteredIcons.length }} 个图标，滚动到底部继续加载。
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex items-center justify-end">
        <ElButton type="primary" @click="confirmSelection">
          {{ hasColorOptions ? '完成' : '关闭' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { ScrollbarInstance } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { remixIconNames } from './remix-icon-names'

  defineOptions({ name: 'ArtIconPicker' })

  type IconColorOption = {
    label: string
    value: string
  }

  type IconSearchItem = {
    name: string
    icon: string
    searchText: string
  }

  type CssVariableStyle = Record<string, string>

  interface Props {
    placeholder?: string
    defaultIcon?: string
    colorOptions?: IconColorOption[]
  }

  const iconBatchSize = 280
  const loadMoreThreshold = 320
  const selectedIconClass =
    'border-[var(--theme-color)] bg-[color:color-mix(in_oklab,var(--theme-color)_10%,white)] text-theme shadow-[0_10px_24px_rgba(93,135,255,0.10)]'
  const defaultIconClass =
    'border-[var(--default-border)] bg-[var(--default-bg-color)] text-g-700 hover:border-[var(--theme-color)] hover:text-theme'

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '如：ri:user-line',
    defaultIcon: '',
    colorOptions: () => []
  })

  const modelValue = defineModel<string>({ default: '' })
  const colorValue = defineModel<string>('color', { default: '' })

  const panelVisible = ref(false)
  const searchKeyword = ref('')
  const draftIcon = ref('')
  const draftColor = ref('')
  const visibleIconCount = ref(iconBatchSize)
  const iconListScrollbarRef = ref<ScrollbarInstance>()

  const allIcons: IconSearchItem[] = remixIconNames.map((name) => ({
    name,
    icon: `ri:${name}`,
    searchText: `${name} ${name.replace(/-/g, ' ')}`
  }))

  const committedIcon = computed(() => String(modelValue.value || '').trim())
  const defaultIcon = computed(() => String(props.defaultIcon || '').trim())
  const committedColor = computed(() => String(colorValue.value || '').trim())
  const currentIconForPanel = computed(() =>
    panelVisible.value ? draftIcon.value : committedIcon.value
  )
  const currentColor = computed(() =>
    panelVisible.value ? draftColor.value : committedColor.value
  )
  const colorOptions = computed(() => props.colorOptions)
  const hasColorOptions = computed(() => colorOptions.value.length > 0)
  const currentColorStyle = computed(() =>
    committedColor.value
      ? {
          '--art-icon-picker-color': committedColor.value
        }
      : undefined
  )

  const inputValue = computed({
    get: () => committedIcon.value,
    set: (value: string) => {
      modelValue.value = String(value || '').trim()
    }
  })

  const normalizedKeyword = computed(() => searchKeyword.value.trim().toLowerCase())

  const filteredIcons = computed(() => {
    if (!normalizedKeyword.value) return allIcons

    return allIcons.filter((item) =>
      item.searchText.toLowerCase().includes(normalizedKeyword.value)
    )
  })
  const visibleIcons = computed(() => filteredIcons.value.slice(0, visibleIconCount.value))

  /**
   * 清空当前图标；弹窗打开时只清空草稿，弹窗关闭时直接清空已提交值。
   */
  const handleClear = () => {
    if (panelVisible.value) {
      draftIcon.value = defaultIcon.value
      return
    }
    modelValue.value = defaultIcon.value
  }

  /**
   * 选择图标；无颜色配置时选择即提交，有颜色配置时先保存在草稿中等待确认。
   */
  const selectIcon = (icon: string) => {
    draftIcon.value = icon
    if (!hasColorOptions.value) confirmSelection()
  }

  /**
   * 选择图标颜色，并暂存在弹窗草稿中。
   */
  const selectColor = (color: string) => {
    draftColor.value = color
  }

  /**
   * 生成颜色按钮需要的 CSS 变量，供预览图标和背景色复用。
   */
  const getColorOptionStyle = (color: string): CssVariableStyle => ({
    '--art-icon-picker-color': color
  })

  /**
   * 根据当前草稿图标返回图标网格项的选中或默认样式。
   */
  const getIconItemClass = (icon: string) =>
    icon === currentIconForPanel.value ? selectedIconClass : defaultIconClass

  /**
   * 追加一批可见图标，避免一次性渲染完整 Remix 图标列表。
   */
  const loadMoreIcons = () => {
    visibleIconCount.value = Math.min(
      visibleIconCount.value + iconBatchSize,
      filteredIcons.value.length
    )
  }

  /**
   * 监听图标列表滚动，接近底部时自动加载下一批图标。
   */
  const handleIconListScroll = ({ scrollTop }: { scrollTop: number }) => {
    const listWrap = iconListScrollbarRef.value?.wrapRef
    if (!listWrap) return
    const distanceToBottom = listWrap.scrollHeight - scrollTop - listWrap.clientHeight
    if (
      distanceToBottom < loadMoreThreshold &&
      visibleIconCount.value < filteredIcons.value.length
    ) {
      loadMoreIcons()
    }
  }

  /**
   * 提交弹窗中的图标和颜色草稿，并关闭选择面板。
   */
  const confirmSelection = () => {
    modelValue.value = draftIcon.value
    if (hasColorOptions.value) colorValue.value = draftColor.value
    panelVisible.value = false
  }

  /**
   * 打开弹窗时重置搜索、分页和草稿值，保证每次编辑都从已提交状态开始。
   */
  watch(panelVisible, (visible) => {
    if (visible) {
      searchKeyword.value = ''
      visibleIconCount.value = iconBatchSize
      draftIcon.value = committedIcon.value
      draftColor.value = committedColor.value || colorOptions.value[0]?.value || ''
    }
  })

  /**
   * 搜索关键词变化后回到首批结果，并把滚动条复位到顶部。
   */
  watch(normalizedKeyword, () => {
    visibleIconCount.value = iconBatchSize
    iconListScrollbarRef.value?.setScrollTop(0)
  })
</script>

<style scoped>
  :global(.art-icon-picker-dialog .el-dialog__body) {
    padding: 16px 0 !important;
  }

  .art-icon-picker-dialog__content {
    display: grid;
    gap: 16px;
    min-height: 0;
  }

  .art-icon-picker-icon-item {
    cursor: pointer;
  }

  .art-icon-picker-list-section {
    height: fit-content;
    min-height: 0;
    overflow: hidden;
  }

  .art-icon-picker-list-scroll {
    height: 248px;
    max-height: 248px;
  }

  .art-icon-picker-list-scroll :deep(.el-scrollbar__wrap) {
    height: 248px !important;
    max-height: 248px !important;
  }

  .art-icon-picker-list-scroll :deep(.el-scrollbar__view) {
    min-height: 0 !important;
  }

  :deep(.art-icon-picker-input) {
    display: flex;
    align-items: center;
    height: 100%;
  }

  :deep(.art-icon-picker-input .el-input__wrapper) {
    height: 100%;
    padding: 0 12px;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  :deep(.art-icon-picker-input .el-input__wrapper .el-input__inner) {
    height: 100%;
  }

  :deep(.art-icon-picker-input .el-input__inner) {
    height: 100%;
    line-height: 1;
  }

  .art-icon-picker-preview--colored {
    color: var(--art-icon-picker-color);
    background: color-mix(in srgb, var(--art-icon-picker-color) 12%, var(--default-box-color));
  }

  .art-icon-picker-color-list {
    padding-right: 4px;
  }

  .art-icon-picker-color-option {
    display: grid;
    place-items: center;
    width: 38px;
    height: 34px;
    padding: 0;
    font-size: 17px;
    color: var(--art-icon-picker-color);
    cursor: pointer;
    background: color-mix(in srgb, var(--art-icon-picker-color) 12%, var(--default-box-color));
    border: 1px solid transparent;
    border-radius: calc(var(--custom-radius) - 5px);
    transition:
      background 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .art-icon-picker-color-option:hover,
  .art-icon-picker-color-option.is-active {
    border-color: color-mix(in srgb, var(--art-icon-picker-color) 34%, var(--default-border));
  }

  .art-icon-picker-color-option.is-active {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--art-icon-picker-color) 12%, transparent);
  }
</style>
