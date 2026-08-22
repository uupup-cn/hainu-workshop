<template>
  <ElPopover
    v-model:visible="popoverVisible"
    placement="bottom"
    :width="width"
    trigger="click"
    :disabled="disabled"
    :show-after="0"
    :hide-after="0"
    transition="art-column-search-popover"
  >
    <template #reference>
      <button
        type="button"
        class="art-column-search-trigger"
        :class="{
          'is-active': isActive,
          'is-disabled': disabled
        }"
        :aria-label="`${label}筛选`"
        :disabled="disabled"
        @click.stop
      >
        <span class="art-column-search-trigger__label">{{ label }}</span>
        <span class="art-column-search-trigger__icon">
          <ArtSvgIcon :icon="triggerIcon" class="shrink-0 leading-none" />
        </span>
      </button>
    </template>

    <div class="art-column-search-panel flex flex-col gap-3">
      <ElInput
        v-if="type === 'input'"
        ref="inputRef"
        v-model="draftTextValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :size="controlSize"
        :disabled="disabled"
        clearable
        @clear="handleClear"
        @keyup.enter="handleSubmit()"
        @keyup.esc="closePopover"
      >
        <template #prefix>
          <ArtSvgIcon icon="ri:search-line" />
        </template>
      </ElInput>

      <ElSelect
        v-else
        ref="selectRef"
        v-model="draftValue"
        :placeholder="placeholder"
        :size="controlSize"
        :disabled="disabled"
        clearable
        filterable
        :teleported="false"
        @clear="handleClear"
        @change="handleSelectChange"
        @keyup.esc="closePopover"
      >
        <ElOption
          v-for="option in options"
          :key="String(option.value)"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>

      <div v-if="showHistory && history.length" class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-g-500">最近搜索</span>
          <ElButton text size="small" @click="clearHistory">清空</ElButton>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="item in history"
            :key="item"
            type="button"
            class="max-w-full cursor-pointer truncate rounded-custom-xs border border-[var(--default-border)] bg-[var(--art-surface-bg-muted)] px-2 py-1 text-xs leading-4 text-g-700 tad-200 hover:border-[var(--theme-color)] hover:text-primary"
            :title="item"
            @click="handleHistorySearch(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div
        v-if="showFooterActions"
        class="flex items-center gap-2 border-t border-[var(--default-border)] pt-3"
        :class="showSearchAction ? 'justify-between' : 'justify-end'"
      >
        <ElButton size="small" :disabled="disabled" @click="handleReset">
          <ArtSvgIcon icon="ri:refresh-line" class="mr-1" />
          重置
        </ElButton>

        <ElButton
          v-if="showSearchAction"
          type="primary"
          size="small"
          :loading="loading"
          :disabled="disabled"
          @click="handleSubmit()"
        >
          <ArtSvgIcon icon="ri:search-line" class="mr-1" />
          搜索
        </ElButton>
      </div>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue'
  import type { ComponentSize, InputInstance, SelectInstance } from 'element-plus'
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'
  import { useColumnSearchHistory } from '@/hooks/core/useColumnSearchHistory'
  import type { ColumnSearchOption, ColumnSearchSubmitPayload, ColumnSearchValue } from './types'

  defineOptions({ name: 'ArtColumnSearch' })

  interface Props {
    /** 当前生效的搜索关键词 */
    modelValue?: ColumnSearchValue | ''
    /** 筛选控件类型 */
    type?: 'input' | 'select'
    /** 表头字段名称 */
    label: string
    /** 输入框占位提示 */
    placeholder?: string
    /** 下拉筛选选项 */
    options?: ColumnSearchOption[]
    /** 输入/下拉控件尺寸 */
    controlSize?: ComponentSize
    /** 搜索历史本地存储标识 */
    historyKey?: string
    /** 输入最大长度 */
    maxlength?: string | number
    /** 最多保留的历史记录条数 */
    maxHistory?: number
    /** Popover 宽度 */
    width?: number
    /** 搜索按钮加载态 */
    loading?: boolean
    /** 是否禁用搜索入口 */
    disabled?: boolean
    /** 搜索后是否自动关闭 Popover */
    closeOnSearch?: boolean
    /** 重置后是否自动关闭 Popover */
    closeOnReset?: boolean
    /** 下拉选择后是否立即触发搜索 */
    searchOnSelect?: boolean
  }

  interface Emits {
    /** 更新当前搜索关键词 */
    (e: 'update:modelValue', value: ColumnSearchValue | ''): void
    /** 点击搜索或回车提交 */
    (e: 'search', payload: ColumnSearchSubmitPayload): void
    /** 点击重置或清空当前筛选 */
    (e: 'reset', payload: ColumnSearchSubmitPayload): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'input',
    placeholder: '请输入关键词',
    options: () => [],
    controlSize: 'small',
    historyKey: '',
    maxlength: undefined,
    maxHistory: 5,
    width: 230,
    loading: false,
    disabled: false,
    closeOnSearch: true,
    closeOnReset: true,
    searchOnSelect: undefined
  })
  const emit = defineEmits<Emits>()

  const popoverVisible = ref(false)
  const inputRef = ref<InputInstance>()
  const selectRef = ref<SelectInstance>()

  // draftValue 只代表弹层内的临时输入，只有搜索/重置时才同步到外部。
  const draftValue = ref(props.modelValue)
  const draftTextValue = computed({
    get: () => String(draftValue.value ?? ''),
    set: (value: string) => {
      draftValue.value = value
    }
  })
  const isActive = computed(() => String(props.modelValue ?? '').trim() !== '')
  const triggerIcon = computed(() =>
    props.type === 'select' ? 'ri:filter-line' : 'ri:search-line'
  )
  const showHistory = computed(() => props.type === 'input' && !!props.historyKey)
  const shouldSearchOnSelect = computed(() => props.searchOnSelect ?? props.type === 'select')
  const showSearchAction = computed(() => props.type === 'input' || !shouldSearchOnSelect.value)
  const showFooterActions = computed(() => props.type === 'select' || showSearchAction.value)
  const { history, addHistory, clearHistory } = useColumnSearchHistory(() => props.historyKey, {
    max: props.maxHistory
  })

  /** Popover 打开后自动聚焦输入框，减少客户二次点击。 */
  const focusInput = async () => {
    await nextTick()
    requestAnimationFrame(() => {
      if (props.type === 'select') {
        selectRef.value?.focus()
        return
      }

      inputRef.value?.focus()
    })
  }

  const syncDraftFromProps = () => {
    draftValue.value = props.modelValue
  }

  const closePopover = () => {
    popoverVisible.value = false
  }

  /** 统一处理搜索/重置事件，保证外部 model、历史记录和事件参数一致。 */
  const emitSearchValue = (value: ColumnSearchValue | '', eventName: 'search' | 'reset') => {
    const keyword = typeof value === 'string' ? value.trim() : value
    const nextValue = keyword === undefined || keyword === null ? '' : keyword
    const payload: ColumnSearchSubmitPayload = {
      value: nextValue
    }

    emit('update:modelValue', nextValue)

    if (props.type === 'input' && typeof nextValue === 'string' && nextValue) {
      addHistory(nextValue)
    }

    if (eventName === 'search') {
      emit('search', payload)
    } else {
      emit('reset', payload)
    }
  }

  const handleSubmit = (value = draftValue.value) => {
    draftValue.value = value
    emitSearchValue(value, 'search')

    if (props.closeOnSearch) {
      closePopover()
    }
  }

  const handleReset = () => {
    draftValue.value = ''
    emitSearchValue('', 'reset')

    if (props.closeOnReset) {
      closePopover()
    }
  }

  const handleClear = () => {
    draftValue.value = ''
    if (isActive.value) {
      handleReset()
    }
  }

  const handleSelectChange = (value: ColumnSearchValue | '' | undefined) => {
    draftValue.value = value ?? ''
    if (value === '' || value === undefined) return

    if (shouldSearchOnSelect.value) {
      handleSubmit(value)
    }
  }

  const handleHistorySearch = (value: ColumnSearchValue) => {
    handleSubmit(value)
  }

  // 外部筛选条件变化时，同步未打开状态下的草稿值，避免弹层下次打开显示旧值。
  watch(
    () => props.modelValue,
    (value) => {
      if (!popoverVisible.value) {
        draftValue.value = value
      }
    }
  )

  watch(popoverVisible, async (visible) => {
    if (!visible) return

    syncDraftFromProps()
    await focusInput()
  })
</script>

<style lang="scss" scoped>
  .art-column-search-trigger {
    display: flex;
    width: calc(100% + 24px);
    min-height: 48px;
    padding: 0;
    margin: -12px;
    color: var(--art-gray-700);
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
    outline: none;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .art-column-search-trigger__label {
    flex: 1;
    min-width: 0;
    padding: 0 12px;
    overflow: hidden;
    line-height: 48px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .art-column-search-trigger__icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    min-height: 48px;
    color: var(--art-gray-600);
    background: transparent;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    .art-column-search-trigger:hover & {
      color: var(--theme-color);
    }

    .art-column-search-trigger.is-active & {
      color: var(--theme-color);
    }

    .art-column-search-trigger.is-disabled & {
      color: var(--art-gray-500);
      background: transparent;
    }
  }

  .art-column-search-panel {
    --el-component-size-small: 30px;

    :deep(.el-input--small .el-input__wrapper),
    :deep(.el-select--small .el-select__wrapper) {
      height: var(--el-component-size-small) !important;
      min-height: var(--el-component-size-small) !important;
    }

    :deep(.el-input--small .el-input__inner),
    :deep(.el-select--small .el-select__placeholder),
    :deep(.el-select--small .el-select__selected-item) {
      line-height: var(--el-component-size-small);
    }
  }

  :global(.art-column-search-popover-enter-active) {
    transition:
      opacity 0.09s ease-out,
      transform 0.09s ease-out;
  }

  :global(.art-column-search-popover-leave-active) {
    transition:
      opacity 0.06s ease-in,
      transform 0.06s ease-in;
  }

  :global(.art-column-search-popover-enter-from),
  :global(.art-column-search-popover-leave-to) {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
</style>
