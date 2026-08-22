<template>
  <div
    class="flex flex-col bg-[var(--default-bg-color)]"
    :class="isFocusMode ? 'art-full-height' : 'min-h-full pb-5'"
  >
    <ArtPageHero
      v-if="!isFocusMode"
      tone="primary"
      size="lg"
      align="center"
      title="内容中心"
      description="面向商业化项目的通用内容管理模块，覆盖内容策划、编辑、发布、下线与经营监控，支持多频道、多状态、多可见性与 SEO 扩展。"
      content-class="max-w-3xl 2xl:flex-1"
      right-class="grid w-full gap-3 sm:grid-cols-2 2xl:w-[640px] 2xl:grid-cols-4"
    >
      <div class="mt-4 flex flex-wrap gap-3">
        <ElButton v-if="hasAuth('add')" type="primary" @click="handleCreate"> 新建内容 </ElButton>
        <ElButton plain @click="handleResetFilters">重置筛选</ElButton>
      </div>

      <template #right>
        <div
          v-for="card in heroCards"
          :key="card.label"
          class="rounded-[var(--custom-radius)] border border-[var(--default-border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--default-box-color)_96%,var(--art-primary)_4%),var(--default-box-color))] px-4 py-3"
        >
          <div class="text-xs uppercase tracking-[0.18em] text-g-500">{{ card.label }}</div>
          <div class="mt-2 text-[26px] font-semibold leading-none text-g-900">{{ card.value }}</div>
          <div class="mt-2 text-xs leading-5 text-g-600">{{ card.description }}</div>
        </div>
      </template>
    </ArtPageHero>

    <section v-if="!isFocusMode" class="mt-5 grid gap-4 lg:grid-cols-4">
      <div v-for="card in overviewCards" :key="card.label" class="art-card-sm p-5">
        <div class="flex items-center justify-between">
          <span class="text-sm text-g-600">{{ card.label }}</span>
          <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="card.badgeClass">
            {{ card.badge }}
          </span>
        </div>
        <div class="mt-4 text-3xl font-semibold text-g-900">{{ card.value }}</div>
        <div class="mt-2 text-xs text-g-500">{{ card.helper }}</div>
      </div>
    </section>

    <ContentSearch
      v-model:filters="filters"
      v-model:date-range="dateRange"
      :class="{ 'mt-5': !isFocusMode }"
      :quick-status-tabs="QUICK_STATUS_TABS"
      :content-type-options="CONTENT_TYPE_OPTIONS"
      :category-options="categoryOptions"
      :channel-options="CONTENT_CHANNEL_OPTIONS"
      :status-options="CONTENT_STATUS_OPTIONS"
      :visibility-options="CONTENT_VISIBILITY_OPTIONS"
      @search="handleSearch"
      @reset="handleResetFilters"
      @apply-status="applyStatusTab"
    />

    <ElCard class="art-table-card card-p0">
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        :data="tableData"
        @refresh="refreshTableAndOverview"
      >
        <template #left>
          <ElButton v-if="hasAuth('add')" type="primary" plain @click="handleCreate">
            新建内容
          </ElButton>
        </template>
        <template #beforeRight>
          <div class="mr-2 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
              草稿 {{ overview.draft }}
            </span>
            <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              已发布 {{ overview.published }}
            </span>
            <span class="rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
              已下线 {{ overview.offline }}
            </span>
          </div>
        </template>
        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <ArtFocusModeButton :active="isFocusMode" @click="toggleFocusMode" />
          </div>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :pagination-options="paginationOptions"
        row-key="id"
        empty-text="暂无符合条件的内容数据"
        empty-height="300px"
        show-pagination-when-empty
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #contentInfo="{ row }">
          <div class="flex items-center gap-4 py-2">
            <ArtTableImage
              :src="row.coverUrl"
              size="xl"
              shape="landscape"
              fallback-text="未上传封面"
            />
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="truncate text-sm font-semibold text-g-900 md:text-base">
                  {{ row.title }}
                </span>
                <span
                  v-if="row.isTop"
                  class="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning"
                >
                  置顶
                </span>
                <span
                  v-if="row.isRecommended"
                  class="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"
                >
                  推荐
                </span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2 text-xs text-g-500">
                <span>{{ getContentTypeLabel(row.contentType) }}</span>
                <span v-if="row.category?.name">{{ row.category.name }}</span>
                <span>{{ row.channel }}</span>
                <span>作者 {{ row.author }}</span>
                <span>别名 {{ row.slug }}</span>
              </div>
              <p class="mt-2 line-clamp-2 text-sm leading-6 text-g-600">
                {{ row.summary || createContentSummary(row.content) }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in row.tags.slice(0, 4)"
                  :key="tag"
                  class="rounded-full bg-g-100 px-2.5 py-1 text-xs text-g-600"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <template #statusInfo="{ row }">
          <ElTag :type="getStatusTagType(row.status)" effect="light" round>
            {{ getStatusLabel(row.status) }}
          </ElTag>
          <div class="mt-2 text-xs text-g-500">{{ getVisibilityLabel(row.visibility) }}</div>
        </template>

        <template #metricsInfo="{ row }">
          <div class="grid grid-cols-2 gap-2 text-left text-xs text-g-600">
            <div class="rounded-[var(--custom-radius)] bg-g-100 px-3 py-2"
              >浏览 {{ formatContentNumber(row.viewCount) }}</div
            >
            <div class="rounded-[var(--custom-radius)] bg-g-100 px-3 py-2"
              >点赞 {{ formatContentNumber(row.likeCount) }}</div
            >
            <div class="rounded-[var(--custom-radius)] bg-g-100 px-3 py-2"
              >评论 {{ formatContentNumber(row.commentCount) }}</div
            >
            <div class="rounded-[var(--custom-radius)] bg-g-100 px-3 py-2"
              >收藏 {{ formatContentNumber(row.favoriteCount) }}</div
            >
          </div>
        </template>

        <template #timeInfo="{ row }">
          <div class="text-sm text-g-700">更新 {{ formatDateTime(row.updatedAt) }}</div>
          <div class="mt-2 text-xs text-g-500">
            发布 {{ row.publishedAt ? formatDateTime(row.publishedAt) : '未发布' }}
          </div>
        </template>

        <template #operation="{ row }">
          <div class="flex flex-wrap justify-center gap-2">
            <ElButton v-if="hasAuth('preview')" link type="info" @click="handlePreview(row.id)">
              预览
            </ElButton>
            <ElButton v-if="hasAuth('edit')" link type="primary" @click="handleEdit(row.id)">
              编辑
            </ElButton>
            <ElButton
              v-if="hasAuth('publish') && row.status !== 'PUBLISHED'"
              link
              type="success"
              @click="handlePublish(row)"
            >
              发布
            </ElButton>
            <ElButton
              v-if="hasAuth('offline') && row.status === 'PUBLISHED'"
              link
              type="warning"
              @click="handleOffline(row)"
            >
              下线
            </ElButton>
            <ElButton v-if="hasAuth('delete')" link type="danger" @click="handleDelete(row)">
              删除
            </ElButton>
          </div>
        </template>
      </ArtTable>
    </ElCard>

    <ContentEditorDrawer
      ref="editorDrawerRef"
      :content-type-options="CONTENT_TYPE_OPTIONS"
      :category-options="categoryOptions"
      :channel-options="CONTENT_CHANNEL_OPTIONS"
      :status-options="CONTENT_STATUS_OPTIONS"
      :visibility-options="CONTENT_VISIBILITY_OPTIONS"
      :tag-options="tagOptions"
      @saved="refreshTableAndOverview"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessageBox } from 'element-plus'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import ArtTableImage from '@/components/core/tables/art-table-image/index.vue'
  import ArtTableHeader from '@/components/core/tables/art-table-header/index.vue'
  import { fetchEnabledContentCategories } from '@/api/content-category'
  import { fetchEnabledContentTags } from '@/api/content-tag'
  import { useAuth } from '@/hooks/core/useAuth'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { useTable } from '@/hooks/core/useTable'
  import type { ColumnOption } from '@/types/component'
  import {
    fetchContentOverview,
    fetchContents,
    fetchDeleteContent,
    fetchOfflineContent,
    fetchPublishContent
  } from '@/api/content'
  import { formatDateTime } from '@/utils'
  import {
    CONTENT_CHANNEL_OPTIONS,
    CONTENT_STATUS_LABEL_MAP,
    CONTENT_STATUS_OPTIONS,
    CONTENT_STATUS_TAG_TYPE_MAP,
    CONTENT_TYPE_LABEL_MAP,
    CONTENT_TYPE_OPTIONS,
    CONTENT_VISIBILITY_LABEL_MAP,
    CONTENT_VISIBILITY_OPTIONS,
    QUICK_STATUS_TABS,
    createContentSummary,
    createDefaultContentFilters,
    createDefaultContentOverview,
    formatContentNumber,
    type ContentFilters,
    type ContentStatus,
    type StatusTabValue
  } from '../shared'
  import ContentSearch from './modules/content-search.vue'
  import ContentEditorDrawer from './modules/content-editor-drawer.vue'

  defineOptions({ name: 'ContentList' })

  type ContentItem = Api.Content.Item
  type ContentEditorDrawerInstance = InstanceType<typeof ContentEditorDrawer>

  const { hasAuth } = useAuth()
  const { isFocusMode, toggleFocusMode } = usePageFocusMode('content.list')
  const router = useRouter()
  const categoryOptions = ref<Api.Content.CategoryItem[]>([])
  const tagOptions = ref<Api.Content.TagItem[]>([])

  const editorDrawerRef = ref<ContentEditorDrawerInstance>()
  const dateRange = ref<string[]>([])
  const overview = reactive<Api.Content.Overview>(createDefaultContentOverview())
  const filters = ref<ContentFilters>(createDefaultContentFilters())

  const paginationOptions = {
    pageSizes: [10, 20, 30, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
    hideOnSinglePage: false
  }

  /**
   * 构建内容表格列定义，统一列表结构和操作区交互。
   */
  const createTableColumns = (): ColumnOption<ContentItem>[] => [
    { type: 'index', width: 60, label: '序号' },
    { prop: 'contentInfo', label: '内容信息', minWidth: 320, useSlot: true },
    { prop: 'statusInfo', label: '状态', width: 140, align: 'center', useSlot: true },
    { prop: 'metricsInfo', label: '经营数据', minWidth: 220, align: 'center', useSlot: true },
    { prop: 'timeInfo', label: '时间', minWidth: 180, useSlot: true },
    {
      prop: 'operation',
      label: '操作',
      fixed: 'right',
      width: 250,
      align: 'center',
      useSlot: true
    }
  ]

  const {
    columns,
    columnChecks,
    data: tableData,
    loading,
    pagination,
    replaceSearchParams,
    getData,
    refreshData,
    handleSizeChange: handleTableSizeChange,
    handleCurrentChange: handleTableCurrentChange
  } = useTable({
    core: {
      apiFn: fetchContents,
      apiParams: { current: 1, size: 10 },
      columnsFactory: createTableColumns
    }
  })

  /**
   * 构建页面头部核心经营指标卡片。
   */
  const buildHeroCards = () => [
    {
      label: '在线内容',
      value: formatContentNumber(overview.published),
      description: '当前已对外可见且处于经营中的内容资产'
    },
    {
      label: '推荐内容',
      value: formatContentNumber(overview.recommended),
      description: '被标记为推荐的高价值内容，可用于首页和专题位'
    },
    {
      label: '总浏览',
      value: formatContentNumber(overview.totalViews),
      description: '累计沉淀的内容触达规模，适合作为内容经营核心指标'
    },
    {
      label: '互动总量',
      value: formatContentNumber(
        overview.totalLikes + overview.totalComments + overview.totalFavorites
      ),
      description: '由点赞、评论、收藏构成，反映内容与用户的有效互动'
    }
  ]

  /**
   * 构建列表上方的经营概览卡片，突出库存与转化状态。
   */
  const buildOverviewCards = () => [
    {
      label: '内容总量',
      value: formatContentNumber(overview.total),
      badge: 'Inventory',
      badgeClass: 'bg-primary/10 text-primary',
      helper: '覆盖全部频道与全部状态'
    },
    {
      label: '草稿与审核',
      value: formatContentNumber(overview.draft + overview.reviewing),
      badge: 'Pipeline',
      badgeClass: 'bg-warning/10 text-warning',
      helper: '待编辑与待发布内容池'
    },
    {
      label: '置顶内容',
      value: formatContentNumber(overview.topCount),
      badge: 'Priority',
      badgeClass: 'bg-danger/10 text-danger',
      helper: '用于首页焦点位与重要运营位'
    },
    {
      label: '内容互动',
      value: formatContentNumber(overview.totalComments + overview.totalFavorites),
      badge: 'Engagement',
      badgeClass: 'bg-success/10 text-success',
      helper: '评论与收藏总和，衡量内容粘性'
    }
  ]

  const heroCards = computed(buildHeroCards)
  const overviewCards = computed(buildOverviewCards)

  /**
   * 根据当前筛选条件组装接口查询参数，并过滤空值字段。
   */
  const buildSearchParams = (): Partial<Api.Content.SearchParams> => {
    const [startTime, endTime] = dateRange.value || []
    const filterValues = filters.value

    const params = {
      keyword: filterValues.keyword || undefined,
      contentType: filterValues.contentType || undefined,
      categoryId: filterValues.categoryId,
      channel: filterValues.channel || undefined,
      status: filterValues.status || undefined,
      visibility: filterValues.visibility || undefined,
      author: filterValues.author || undefined,
      feature: filterValues.feature || undefined,
      startTime,
      endTime
    }

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ) as Partial<Api.Content.SearchParams>
  }

  /**
   * 拉取内容经营概览数据，用于页面头部和列表卡片展示。
   */
  const loadOverview = async () => {
    const data = await fetchContentOverview()
    Object.assign(overview, data)
  }

  /**
   * 同步刷新列表和概览，保持页面各区域数据一致。
   */
  const refreshTableAndOverview = async () => {
    await Promise.all([refreshData(), loadOverview()])
  }

  /**
   * 首次进入页面或主动检索时，重新加载列表和概览。
   */
  const loadTableAndOverview = async () => {
    await Promise.all([getData(), loadOverview()])
  }

  /**
   * 拉取分类、标签等元数据，用于筛选器和编辑抽屉的下拉选项。
   */
  const loadMetaOptions = async () => {
    const [categories, tags] = await Promise.all([
      fetchEnabledContentCategories(),
      fetchEnabledContentTags()
    ])
    categoryOptions.value = categories
    tagOptions.value = tags
  }

  /**
   * 提交筛选条件并刷新列表与经营概览。
   */
  const handleSearch = async () => {
    await replaceSearchParams(buildSearchParams())
    await loadOverview()
  }

  /**
   * 重置筛选条件并重新查询，恢复到默认视图。
   */
  const handleResetFilters = async () => {
    Object.assign(filters.value, createDefaultContentFilters())
    dateRange.value = []
    await replaceSearchParams(buildSearchParams())
    await loadOverview()
  }

  /**
   * 修改分页大小后，刷新列表并同步更新概览数据。
   */
  const handleSizeChange = async (size: number) => {
    await handleTableSizeChange(size)
    await loadOverview()
  }

  /**
   * 切换页码后刷新概览，保证顶部数字与当前数据状态同步。
   */
  const handleCurrentChange = async (current: number) => {
    await handleTableCurrentChange(current)
    await loadOverview()
  }

  /**
   * 点击快捷状态标签时直接切换状态筛选并触发查询。
   */
  const applyStatusTab = (value: StatusTabValue) => {
    filters.value.status = value
    void handleSearch()
  }

  /**
   * 获取内容类型文案，供列表卡片和回收站等页面复用。
   */
  const getContentTypeLabel = (value: Api.Content.ContentType) => CONTENT_TYPE_LABEL_MAP[value]

  /**
   * 获取内容状态文案。
   */
  const getStatusLabel = (value: ContentStatus) => CONTENT_STATUS_LABEL_MAP[value]

  /**
   * 获取内容状态标签类型，统一颜色表现。
   */
  const getStatusTagType = (value: ContentStatus) => CONTENT_STATUS_TAG_TYPE_MAP[value]

  /**
   * 获取可见范围文案。
   */
  const getVisibilityLabel = (value: Api.Content.ContentVisibility) =>
    CONTENT_VISIBILITY_LABEL_MAP[value]

  /**
   * 打开新建内容抽屉。
   */
  const handleCreate = () => {
    editorDrawerRef.value?.openCreate()
  }

  /**
   * 打开编辑内容抽屉，并按内容 ID 加载详情。
   */
  const handleEdit = async (id: number) => {
    await editorDrawerRef.value?.openEdit(id)
  }

  /**
   * 跳转到内容详情页进行预览。
   */
  const handlePreview = (id: number) => {
    router.push({ name: 'ContentDetail', params: { id } })
  }

  /**
   * 统一执行列表行操作，处理确认弹窗、接口调用和页面刷新。
   */
  const executeRowAction = async (
    row: ContentItem,
    title: string,
    message: string,
    request: (id: number) => Promise<unknown>
  ) => {
    await ElMessageBox.confirm(message, title, { type: 'warning' })
    await request(row.id)
    await refreshTableAndOverview()
  }

  /**
   * 发布内容并刷新列表与概览。
   */
  const handlePublish = async (row: ContentItem) => {
    await executeRowAction(
      row,
      '发布确认',
      `确认发布《${row.title}》吗？发布后将进入线上状态。`,
      fetchPublishContent
    )
  }

  /**
   * 下线内容并刷新列表与概览。
   */
  const handleOffline = async (row: ContentItem) => {
    await executeRowAction(row, '下线确认', `确认下线《${row.title}》吗？`, fetchOfflineContent)
  }

  /**
   * 删除内容并刷新列表与概览。
   */
  const handleDelete = async (row: ContentItem) => {
    await executeRowAction(
      row,
      '删除确认',
      `确认删除《${row.title}》吗？删除后将进入软删除状态。`,
      fetchDeleteContent
    )
  }

  /**
   * 初始化页面所需的元数据和首屏列表数据。
   */
  const initializePage = async () => {
    await Promise.all([loadMetaOptions(), loadTableAndOverview()])
  }

  onMounted(() => {
    void initializePage()
  })
</script>
