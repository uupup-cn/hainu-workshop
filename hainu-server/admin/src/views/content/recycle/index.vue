<template>
  <div class="art-full-height">
    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="art-table-card" shadow="never" style="margin-top: 12px">
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <div>
            <div class="text-base font-semibold text-g-900">内容回收站</div>
            <div class="mt-1 text-sm text-g-600">支持恢复误删内容，或执行彻底删除。</div>
          </div>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        :pagination-options="paginationOptions"
        empty-text="回收站暂无内容"
        :show-pagination-when-empty="true"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #category="{ row }">
          {{ row.category?.name || '-' }}
        </template>

        <template #operation="{ row }">
          <ElButton v-if="hasAuth('restore')" link type="primary" @click="handleRestore(row)">
            恢复
          </ElButton>
          <ElButton v-if="hasAuth('purge')" link type="danger" @click="handlePurge(row)">
            彻底删除
          </ElButton>
        </template>
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ElMessageBox } from 'element-plus'
  import { fetchDeletedContents, fetchPurgeContent, fetchRestoreContent } from '@/api/content'
  import { formatDateTime } from '@/utils'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useTable } from '@/hooks/core/useTable'
  import type { ColumnOption } from '@/types/component'
  import { CONTENT_TYPE_LABEL_MAP, CONTENT_TYPE_OPTIONS, type ContentType } from '../shared'

  defineOptions({ name: 'ContentRecycle' })

  const { hasAuth } = useAuth()
  const searchForm = reactive({
    keyword: '',
    contentType: '' as '' | ContentType
  })

  /**
   * 生成回收站搜索项，支持关键字和内容类型联合筛选。
   */
  const searchItems = computed(() => [
    {
      label: '关键字',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '搜索标题 / 作者 / 标签' }
    },
    {
      label: '内容类型',
      key: 'contentType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择内容类型',
        options: CONTENT_TYPE_OPTIONS
      }
    }
  ])

  const paginationOptions = {
    pageSizes: [10, 20, 30, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
    hideOnSinglePage: false
  }

  /**
   * 格式化内容类型文案，避免回收站直接显示枚举值。
   */
  const formatContentType = (value: ContentType) => CONTENT_TYPE_LABEL_MAP[value]

  /**
   * 构建回收站表格列配置，统一字段展示与操作区定义。
   */
  const createColumns = (): ColumnOption<Api.Content.Item>[] => [
    { type: 'index', width: 60, label: '序号' },
    { prop: 'title', label: '内容标题', minWidth: 160, visible: true },
    {
      prop: 'contentType',
      label: '类型',
      minWidth: 120,
      formatter: (row: Api.Content.Item) => formatContentType(row.contentType),
      visible: true
    },
    {
      prop: 'category',
      label: '分类',
      width: 120,
      useSlot: true,
      slotName: 'category',
      visible: true
    },
    { prop: 'author', label: '作者', visible: true },
    {
      prop: 'deletedAt',
      label: '删除时间',
      minWidth: 160,
      formatter: (row: Api.Content.Item) => formatDateTime(row.deletedAt),
      visible: true
    },
    {
      prop: 'operation',
      label: '操作',
      width: 170,
      fixed: 'right',
      align: 'center',
      useSlot: true,
      slotName: 'operation',
      visible: true,
      disabled: true
    }
  ]

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    refreshRemove,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchDeletedContents,
      apiParams: { current: 1, size: 10 },
      columnsFactory: createColumns
    }
  })

  /**
   * 根据搜索表单构建请求参数。
   */
  const buildSearchParams = (): Api.Content.SearchParams => ({
    keyword: searchForm.keyword || undefined,
    contentType: searchForm.contentType || undefined
  })

  /**
   * 提交筛选条件并从第一页开始查询。
   */
  const handleSearch = async () => {
    await replaceSearchParams(buildSearchParams())
  }

  /**
   * 重置筛选条件并重新加载列表。
   */
  const handleReset = async () => {
    Object.assign(searchForm, { keyword: '', contentType: '' })
    await resetSearchParams()
  }

  /**
   * 恢复内容前进行二次确认，并采用删除刷新策略修正分页状态。
   */
  const handleRestore = async (row: Api.Content.Item) => {
    await ElMessageBox.confirm(`确认恢复《${row.title}》吗？`, '恢复内容', { type: 'warning' })
    await fetchRestoreContent(row.id)
    await refreshRemove()
  }

  /**
   * 永久删除内容前进行二次确认，并采用删除刷新策略修正分页状态。
   */
  const handlePurge = async (row: Api.Content.Item) => {
    await ElMessageBox.confirm(`确认彻底删除《${row.title}》吗？该操作不可恢复。`, '彻底删除', {
      type: 'warning'
    })
    await fetchPurgeContent(row.id)
    await refreshRemove()
  }
</script>
