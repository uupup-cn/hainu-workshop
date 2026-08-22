<template>
  <div class="art-full-height">
    <ArtSearchBar
      v-show="showSearchBar"
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElButton v-if="hasAuth('add')" @click="openAddDialog" type="primary" plain v-ripple
            >新增岗位</ElButton
          >
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
      :title="dialogMode === 'add' ? '新增岗位' : '编辑岗位'"
      width="480px"
      align-center
      @close="resetDialog"
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="岗位名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入岗位名称" />
        </ElFormItem>
        <ElFormItem label="岗位编码" prop="code">
          <ElInput v-model="form.code" placeholder="请输入岗位编码" />
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber
            v-model="form.sort"
            :min="1"
            class="!w-full"
            :controls-position="'right'"
          />
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
  import { useTable } from '@/hooks/core/useTable'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useQuickActionDialog } from '@/hooks/core/useQuickActionDialog'
  import { fetchCreatePost, fetchDeletePost, fetchPosts, fetchUpdatePost } from '@/api/posts'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'Post' })

  const { hasAuth } = useAuth()

  const showSearchBar = ref(false)
  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editingId = ref<number>()
  const formRef = ref<FormInstance>()

  const searchForm = ref({
    name: '',
    code: '',
    enabled: undefined as boolean | undefined,
    daterange: undefined as string[] | undefined
  })

  /**
   * 构建岗位管理搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '岗位名称',
      key: 'name',
      type: 'input',
      props: { clearable: true, placeholder: '请输入岗位名称' }
    },
    {
      label: '岗位编码',
      key: 'code',
      type: 'input',
      props: { clearable: true, placeholder: '请输入岗位编码' }
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
    },
    {
      label: '创建时间',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  ])

  const form = reactive<Api.Access.PostPayload>({
    name: '',
    code: '',
    sort: 1,
    enabled: true,
    remark: ''
  })

  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }]
  })

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchPosts,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'index', width: 60, label: '序号' },
        { prop: 'name', label: '岗位名称', minWidth: 140 },
        { prop: 'code', label: '岗位编码', minWidth: 140 },
        { prop: 'sort', label: '排序', width: 90, align: 'center' },
        {
          prop: 'enabled',
          label: '状态',
          width: 90,
          formatter: (row) =>
            h(ElTag, { type: row.enabled ? 'success' : 'info' }, () =>
              row.enabled ? '启用' : '禁用'
            )
        },
        {
          prop: 'remark',
          label: '备注',
          minWidth: 160,
          formatter: (row) => row.remark || '-'
        },
        {
          prop: 'updatedAt',
          label: '更新时间',
          minWidth: 160,
          formatter: (row) => formatDateTime(row.updatedAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              hasAuth('edit')
                ? h(ArtButtonTable, { type: 'edit', onClick: () => openEditDialog(row) })
                : null,
              hasAuth('delete')
                ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) })
                : null
            ])
        }
      ]
    }
  })

  // 提交筛选条件并刷新列表
  const handleSearch = async () => {
    const [startTime, endTime] = Array.isArray(searchForm.value.daterange)
      ? searchForm.value.daterange
      : [undefined, undefined]

    await replaceSearchParams({
      name: searchForm.value.name || undefined,
      code: searchForm.value.code || undefined,
      enabled: searchForm.value.enabled,
      startTime,
      endTime
    })
  }

  // 重置筛选条件并重新查询
  const handleReset = () => {
    Object.assign(searchForm.value, {
      name: '',
      code: '',
      enabled: undefined,
      daterange: undefined
    })
    resetSearchParams()
  }

  // 打开新增岗位弹窗
  const openAddDialog = () => {
    resetDialog()
    dialogMode.value = 'add'
    dialogVisible.value = true
  }

  // 打开编辑岗位弹窗
  const openEditDialog = (row: Api.Access.PostItem) => {
    resetDialog()
    dialogMode.value = 'edit'
    editingId.value = row.id
    Object.assign(form, {
      name: row.name,
      code: row.code,
      sort: row.sort,
      enabled: row.enabled,
      remark: row.remark || ''
    })
    dialogVisible.value = true
  }

  // 校验并提交岗位表单
  const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate()

    const payload: Api.Access.PostPayload = {
      name: form.name.trim(),
      code: form.code.trim(),
      sort: form.sort,
      enabled: form.enabled,
      remark: form.remark?.trim() || ''
    }

    if (dialogMode.value === 'add') {
      await fetchCreatePost(payload)
    } else if (editingId.value) {
      await fetchUpdatePost(editingId.value, payload)
    }

    dialogVisible.value = false
    refreshData()
  }

  // 删除岗位前二次确认
  const handleDelete = async (row: Api.Access.PostItem) => {
    try {
      await ElMessageBox.confirm(`确定删除岗位“${row.name}”吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeletePost(row.id)
      refreshData()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  // 重置岗位弹窗
  const resetDialog = () => {
    editingId.value = undefined
    Object.assign(form, {
      name: '',
      code: '',
      sort: 1,
      enabled: true,
      remark: ''
    })
    formRef.value?.clearValidate()
  }

  // 关闭页面内弹窗，供快捷操作切换时统一清理
  const closePageDialogs = () => {
    dialogVisible.value = false
    editingId.value = undefined
  }

  useQuickActionDialog({
    actionKey: 'createPost',
    onTrigger: openAddDialog,
    onCloseDialogs: closePageDialogs
  })
</script>
