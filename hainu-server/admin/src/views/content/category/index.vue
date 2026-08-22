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
          <ElButton v-if="hasAuth('add')" type="primary" @click="openAddDialog">新增分类</ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增内容分类' : '编辑内容分类'"
      width="520px"
      align-center
      @close="resetDialog"
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="88px">
        <ElFormItem label="分类名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入分类名称" />
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber v-model="form.sort" class="!w-full" :min="1" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSwitch v-model="form.enabled" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessageBox, ElTag } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useTable } from '@/hooks/core/useTable'
  import { useQuickActionDialog } from '@/hooks/core/useQuickActionDialog'
  import type { ColumnOption } from '@/types/component'
  import {
    fetchContentCategories,
    fetchCreateContentCategory,
    fetchDeleteContentCategory,
    fetchUpdateContentCategory
  } from '@/api/content-category'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'ContentCategory' })

  type DialogMode = 'add' | 'edit'

  const { hasAuth } = useAuth()
  const dialogVisible = ref(false)
  const dialogMode = ref<DialogMode>('add')
  const editingId = ref<number>()
  const formRef = ref<FormInstance>()

  /**
   * 创建搜索表单默认值，统一初始化与重置逻辑。
   */
  const createDefaultSearchForm = () => ({
    keyword: '',
    enabled: undefined as boolean | undefined
  })

  const searchForm = reactive(createDefaultSearchForm())

  /**
   * 生成搜索栏配置，暴露名称与启用状态两个常用筛选项。
   */
  const searchItems = computed(() => [
    {
      label: '关键字',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '搜索分类名称' }
    },
    {
      label: '状态',
      key: 'enabled',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false }
        ]
      }
    }
  ])

  /**
   * 创建弹窗表单默认值，避免新增和编辑模式之间残留旧状态。
   */
  const createDefaultForm = (): Api.Content.CategoryPayload => ({
    name: '',
    enabled: true,
    sort: 1,
    remark: ''
  })

  const form = reactive<Api.Content.CategoryPayload>(createDefaultForm())

  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  })

  /**
   * 格式化分类状态标签，统一表格中的启用/禁用视觉表现。
   */
  const renderEnabledTag = (row: Api.Content.CategoryItem) =>
    h(ElTag, { type: row.enabled ? 'success' : 'info' }, () => (row.enabled ? '启用' : '禁用'))

  /**
   * 渲染分类操作按钮，按权限输出编辑和删除动作。
   */
  const renderOperationActions = (row: Api.Content.CategoryItem) =>
    h('div', [
      hasAuth('edit')
        ? h(ArtButtonTable, { type: 'edit', onClick: () => openEditDialog(row) })
        : null,
      hasAuth('delete')
        ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
        : null
    ])

  /**
   * 构建分类表格列配置，统一列表字段和操作区定义。
   */
  const createColumns = (): ColumnOption<Api.Content.CategoryItem>[] => [
    { type: 'index', width: 60, label: '序号' },
    { prop: 'name', label: '分类名称', minWidth: 180 },
    {
      prop: '_count',
      label: '内容数',
      width: 100,
      formatter: (row: Api.Content.CategoryItem) => row._count?.contentItems ?? 0
    },
    { prop: 'sort', label: '排序', width: 80, align: 'center' },
    {
      prop: 'enabled',
      label: '状态',
      width: 90,
      formatter: renderEnabledTag
    },
    {
      prop: 'updatedAt',
      label: '更新时间',
      minWidth: 160,
      formatter: (row: Api.Content.CategoryItem) => formatDateTime(row.updatedAt)
    },
    {
      prop: 'operation',
      label: '操作',
      width: 120,
      fixed: 'right',
      formatter: renderOperationActions
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
    refreshCreate,
    refreshUpdate,
    refreshRemove,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchContentCategories,
      apiParams: { current: 1, size: 10 },
      columnsFactory: createColumns
    }
  })

  /**
   * 根据搜索表单构建请求参数，便于后续扩展更多筛选项。
   */
  const buildSearchParams = (): Api.Content.CategorySearchParams => ({
    keyword: searchForm.keyword || undefined,
    enabled: searchForm.enabled
  })

  /**
   * 提交搜索条件并刷新列表。
   */
  const handleSearch = async () => {
    await replaceSearchParams(buildSearchParams())
  }

  /**
   * 重置搜索表单和表格搜索参数。
   */
  const handleReset = async () => {
    Object.assign(searchForm, createDefaultSearchForm())
    await resetSearchParams()
  }

  /**
   * 重置弹窗表单和校验状态。
   */
  const resetDialog = () => {
    editingId.value = undefined
    Object.assign(form, createDefaultForm())
    nextTick(() => formRef.value?.clearValidate())
  }

  /**
   * 打开新增分类弹窗。
   */
  const openAddDialog = () => {
    dialogMode.value = 'add'
    resetDialog()
    dialogVisible.value = true
  }

  /**
   * 打开编辑分类弹窗并回填表单数据。
   */
  const openEditDialog = (row: Api.Content.CategoryItem) => {
    dialogMode.value = 'edit'
    resetDialog()
    editingId.value = row.id
    Object.assign(form, {
      name: row.name,
      enabled: row.enabled,
      sort: row.sort,
      remark: row.remark || ''
    })
    dialogVisible.value = true
  }

  /**
   * 删除分类前进行二次确认，并使用删除刷新策略修正分页状态。
   */
  const handleDelete = async (row: Api.Content.CategoryItem) => {
    await ElMessageBox.confirm(`确认删除分类“${row.name}”吗？`, '删除确认', { type: 'warning' })
    await fetchDeleteContentCategory(row.id)
    await refreshRemove()
  }

  /**
   * 校验表单并提交新增或编辑请求。
   */
  const handleSubmit = async () => {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    if (dialogMode.value === 'add') {
      await fetchCreateContentCategory(form)
      await refreshCreate()
    } else if (editingId.value) {
      await fetchUpdateContentCategory(editingId.value, form)
      await refreshUpdate()
    }

    dialogVisible.value = false
  }

  /**
   * 关闭页面级弹窗，供快捷动作系统统一回收界面状态。
   */
  const closePageDialogs = () => {
    dialogVisible.value = false
    editingId.value = undefined
  }

  useQuickActionDialog({
    actionKey: 'createContentCategory',
    onTrigger: openAddDialog,
    onCloseDialogs: closePageDialogs
  })
</script>
