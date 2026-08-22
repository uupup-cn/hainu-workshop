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
          <ElButton v-if="hasAuth('add')" type="primary" @click="openAddDialog">新增标签</ElButton>
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
      :title="dialogMode === 'add' ? '新增内容标签' : '编辑内容标签'"
      width="560px"
      align-center
      @close="resetDialog"
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="88px">
        <ElFormItem label="标签名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入标签名称" />
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
    fetchContentTags,
    fetchCreateContentTag,
    fetchDeleteContentTag,
    fetchUpdateContentTag
  } from '@/api/content-tag'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'ContentTag' })

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
   * 生成标签搜索栏配置，支持名称和启用状态双维度筛选。
   */
  const searchItems = computed(() => [
    {
      label: '关键字',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '搜索标签名称' }
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
   * 创建弹窗表单默认值，避免新增和编辑模式之间残留旧数据。
   */
  const createDefaultForm = (): Api.Content.TagPayload => ({
    name: '',
    enabled: true,
    sort: 1,
    remark: ''
  })

  const form = reactive<Api.Content.TagPayload>(createDefaultForm())

  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
  })

  /**
   * 格式化标签状态列中的启用/禁用标签。
   */
  const renderEnabledTag = (row: Api.Content.TagItem) =>
    h(ElTag, { type: row.enabled ? 'success' : 'info' }, () => (row.enabled ? '启用' : '禁用'))

  /**
   * 渲染标签操作区按钮，按权限输出编辑和删除动作。
   */
  const renderOperationActions = (row: Api.Content.TagItem) =>
    h('div', [
      hasAuth('edit')
        ? h(ArtButtonTable, { type: 'edit', onClick: () => openEditDialog(row) })
        : null,
      hasAuth('delete')
        ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
        : null
    ])

  /**
   * 构建标签表格列配置，统一字段展示和操作定义。
   */
  const createColumns = (): ColumnOption<Api.Content.TagItem>[] => [
    { type: 'index', width: 60, label: '序号' },
    { prop: 'name', label: '标签名称', minWidth: 180 },
    { prop: 'useCount', label: '使用次数', width: 90, align: 'center' },
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
      formatter: (row: Api.Content.TagItem) => formatDateTime(row.updatedAt)
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
      apiFn: fetchContentTags,
      apiParams: { current: 1, size: 10 },
      columnsFactory: createColumns
    }
  })

  /**
   * 根据搜索表单构建请求参数，便于后续统一扩展。
   */
  const buildSearchParams = (): Api.Content.TagSearchParams => ({
    keyword: searchForm.keyword || undefined,
    enabled: searchForm.enabled
  })

  /**
   * 提交筛选条件并刷新列表。
   */
  const handleSearch = async () => {
    await replaceSearchParams(buildSearchParams())
  }

  /**
   * 重置搜索条件并重新查询。
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
   * 打开新增标签弹窗。
   */
  const openAddDialog = () => {
    dialogMode.value = 'add'
    resetDialog()
    dialogVisible.value = true
  }

  /**
   * 打开编辑标签弹窗并回填数据。
   */
  const openEditDialog = (row: Api.Content.TagItem) => {
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
   * 删除标签前进行二次确认，并使用删除刷新策略修正分页状态。
   */
  const handleDelete = async (row: Api.Content.TagItem) => {
    await ElMessageBox.confirm(`确认删除标签“${row.name}”吗？`, '删除确认', { type: 'warning' })
    await fetchDeleteContentTag(row.id)
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
      await fetchCreateContentTag(form)
      await refreshCreate()
    } else if (editingId.value) {
      await fetchUpdateContentTag(editingId.value, form)
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
    actionKey: 'createContentTag',
    onTrigger: openAddDialog,
    onCloseDialogs: closePageDialogs
  })
</script>
