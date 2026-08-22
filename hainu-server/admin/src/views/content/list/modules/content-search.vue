<template>
  <ArtSearchBar
    v-model="formData"
    :items="formItems"
    :label-width="72"
    @search="handleSearch"
    @reset="emit('reset')"
  >
    <template #filterHeader>
      <div class="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-g-900">内容筛选</h3>
          <p class="mt-1 text-sm text-g-600">
            支持按内容类型、频道、状态、作者和时间范围进行组合检索。
          </p>
        </div>
        <div class="flex flex-wrap gap-2 lg:justify-end">
          <button
            v-for="item in quickStatusTabs"
            :key="item.value"
            type="button"
            class="c-p rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200"
            :class="
              filters.status === item.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-[var(--default-border)] bg-transparent text-g-600 hover:border-primary/40 hover:text-primary'
            "
            @click="emit('apply-status', item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </template>
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import {
    CONTENT_FEATURE_OPTIONS,
    type ContentFilters,
    type ContentStatus,
    type SelectOption,
    type StatusTabValue
  } from '../../shared'

  type ContentSearchModel = ContentFilters & {
    dateRange?: string[]
    filterHeader?: string
  }

  const props = defineProps<{
    quickStatusTabs: Array<{ label: string; value: StatusTabValue }>
    contentTypeOptions: readonly SelectOption<Api.Content.ContentType>[]
    categoryOptions: Api.Content.CategoryItem[]
    channelOptions: readonly string[]
    statusOptions: readonly SelectOption<ContentStatus>[]
    visibilityOptions: readonly SelectOption<Api.Content.ContentVisibility>[]
  }>()

  const filters = defineModel<ContentFilters>('filters', { required: true })
  const dateRange = defineModel<string[]>('dateRange', { required: true })

  const emit = defineEmits<{
    (e: 'search'): void
    (e: 'reset'): void
    (e: 'apply-status', value: StatusTabValue): void
  }>()

  const formData = reactive<ContentSearchModel>({
    ...filters.value,
    dateRange: dateRange.value
  })
  const syncingFromParent = ref(false)

  function syncParentFromForm() {
    const { dateRange: nextDateRange, ...nextFilters } = formData
    delete nextFilters.filterHeader
    filters.value = { ...nextFilters }
    dateRange.value = nextDateRange || []
  }

  watch(
    [filters, dateRange],
    ([nextFilters, nextDateRange]) => {
      syncingFromParent.value = true
      Object.assign(formData, nextFilters, { dateRange: nextDateRange || [] })
      delete formData.filterHeader
      nextTick(() => {
        syncingFromParent.value = false
      })
    },
    { deep: true }
  )

  watch(
    formData,
    () => {
      if (syncingFromParent.value) return
      syncParentFromForm()
    },
    { deep: true }
  )

  function handleSearch() {
    syncParentFromForm()
    emit('search')
  }

  const formItems = computed(() => [
    {
      label: '',
      key: 'filterHeader',
      type: 'input',
      span: 24
    },
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: {
        prefixIcon: Search,
        clearable: true,
        placeholder: '搜索标题 / 摘要 / 别名 / 标签'
      }
    },
    {
      label: '内容类型',
      key: 'contentType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '内容类型',
        options: props.contentTypeOptions
      }
    },
    {
      label: '内容分类',
      key: 'categoryId',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '内容分类',
        options: props.categoryOptions.map((item) => ({
          label: item.name,
          value: item.id
        }))
      }
    },
    {
      label: '所属频道',
      key: 'channel',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '所属频道',
        options: props.channelOptions.map((item) => ({
          label: item,
          value: item
        }))
      }
    },
    {
      label: '发布状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '发布状态',
        options: props.statusOptions
      }
    },
    {
      label: '可见范围',
      key: 'visibility',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '可见范围',
        options: props.visibilityOptions
      }
    },
    {
      label: '特色标签',
      key: 'feature',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '特色标签',
        options: CONTENT_FEATURE_OPTIONS
      }
    },
    {
      label: '作者',
      key: 'author',
      type: 'input',
      props: {
        clearable: true,
        placeholder: '作者 / 负责人'
      }
    },
    {
      label: '时间范围',
      key: 'dateRange',
      type: 'daterange',
      props: {
        class: 'w-full',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])
</script>
