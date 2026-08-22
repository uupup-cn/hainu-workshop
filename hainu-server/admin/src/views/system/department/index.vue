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
        @refresh="loadDepartments"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton v-if="hasAuth('add')" @click="openAddRootDialog" type="primary" plain v-ripple
              >新增部门</ElButton
            >
            <ElButton @click="toggleExpand" v-ripple>
              {{ isExpanded ? '收起' : '展开' }}
            </ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        :loading="loading"
        :data="tableData"
        :columns="columns"
        row-key="id"
        :stripe="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        mobile-mode="table"
      />
    </ElCard>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增部门' : '编辑部门'"
      width="min(720px, calc(100vw - 32px))"
      align-center
      @close="resetDialog"
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="92px">
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="上级部门">
              <ElTreeSelect
                v-model="form.parentId"
                :data="departmentOptions"
                node-key="id"
                check-strictly
                clearable
                filterable
                default-expand-all
                :props="{ label: 'name', children: 'children' }"
                placeholder="为空表示顶级部门"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="部门名称" prop="name">
              <ElInput v-model="form.name" placeholder="请输入部门名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="部门编码" prop="code">
              <ElInput v-model="form.code" placeholder="请输入部门编码" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="负责人">
              <ElInput v-model="form.leader" placeholder="请输入负责人" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="联系电话">
              <ElInput v-model="form.phone" placeholder="请输入联系电话" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="邮箱">
              <ElInput v-model="form.email" placeholder="请输入邮箱" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="排序">
              <ElInputNumber
                v-model="form.sort"
                :min="1"
                :controls-position="'right'"
                class="!w-full"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="状态">
              <ElSwitch v-model="form.enabled" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="备注">
              <ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </ElFormItem>
          </ElCol>
        </ElRow>
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
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useQuickActionDialog } from '@/hooks/core/useQuickActionDialog'
  import {
    fetchCreateDepartment,
    fetchDeleteDepartment,
    fetchDepartments,
    fetchUpdateDepartment
  } from '@/api/departments'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'Department' })

  const { hasAuth } = useAuth()

  const showSearchBar = ref(false)
  const loading = ref(false)
  const isExpanded = ref(false)
  const tableRef = ref()
  const formRef = ref<FormInstance>()

  const searchForm = reactive({
    keyword: '',
    enabled: ''
  })

  /**
   * 构建部门管理搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入部门名称、编码、负责人、电话或邮箱' }
    },
    {
      label: '状态',
      key: 'enabled',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 'true' },
          { label: '禁用', value: 'false' }
        ]
      }
    }
  ])

  const tableData = ref<Api.Access.DepartmentItem[]>([])
  /**
   * 将部门树作为上级部门选择器的数据源。
   */
  const departmentOptions = computed(() => tableData.value)

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editingId = ref<number>()

  const form = reactive<Api.Access.DepartmentPayload>({
    parentId: undefined,
    name: '',
    code: '',
    leader: '',
    phone: '',
    email: '',
    sort: 1,
    enabled: true,
    remark: ''
  })

  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }]
  })

  const { columns, columnChecks } = useTableColumns<Api.Access.DepartmentItem>(() => [
    {
      prop: 'name',
      label: '部门名称',
      minWidth: 160
    },
    {
      prop: 'code',
      label: '部门编码',
      minWidth: 120
    },
    {
      prop: 'leader',
      label: '负责人',
      minWidth: 110,
      formatter: (row) => row.leader || '-'
    },
    {
      prop: 'phone',
      label: '联系电话',
      minWidth: 120,
      formatter: (row) => row.phone || '-'
    },
    {
      prop: 'email',
      label: '邮箱',
      minWidth: 160,
      formatter: (row) => row.email || '-'
    },
    {
      prop: 'sort',
      label: '排序',
      width: 90,
      align: 'center'
    },
    {
      prop: 'enabled',
      label: '状态',
      width: 90,
      formatter: (row) =>
        h(ElTag, { type: row.enabled ? 'success' : 'info' }, () => (row.enabled ? '启用' : '禁用'))
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
      width: 160,
      fixed: 'right',
      formatter: (row) => {
        const buttons = []
        if (hasAuth('add')) {
          buttons.push(h(ArtButtonTable, { type: 'add', onClick: () => openAddChildDialog(row) }))
        }
        if (hasAuth('edit')) {
          buttons.push(h(ArtButtonTable, { type: 'edit', onClick: () => openEditDialog(row) }))
        }
        if (hasAuth('delete')) {
          buttons.push(h(ArtButtonTable, { type: 'delete', onClick: () => handleDelete(row) }))
        }
        return h('div', buttons)
      }
    }
  ])

  onMounted(() => {
    loadDepartments()
  })

  // 加载部门树数据
  const loadDepartments = async () => {
    loading.value = true
    try {
      tableData.value = await fetchDepartments({
        keyword: searchForm.keyword || undefined,
        enabled: searchForm.enabled || undefined
      })
    } finally {
      loading.value = false
    }
  }

  // 提交筛选条件并刷新列表
  const handleSearch = () => {
    loadDepartments()
  }

  // 重置筛选条件并重新加载
  const handleReset = () => {
    Object.assign(searchForm, {
      keyword: '',
      enabled: ''
    })
    loadDepartments()
  }

  // 打开新增根部门弹窗
  const openAddRootDialog = () => {
    resetDialog()
    dialogMode.value = 'add'
    dialogVisible.value = true
  }

  // 打开新增子部门弹窗
  const openAddChildDialog = (row: Api.Access.DepartmentItem) => {
    resetDialog()
    dialogMode.value = 'add'
    form.parentId = row.id
    dialogVisible.value = true
  }

  // 打开编辑部门弹窗
  const openEditDialog = (row: Api.Access.DepartmentItem) => {
    resetDialog()
    dialogMode.value = 'edit'
    editingId.value = row.id
    Object.assign(form, {
      parentId: row.parentId ?? undefined,
      name: row.name,
      code: row.code,
      leader: row.leader || '',
      phone: row.phone || '',
      email: row.email || '',
      sort: row.sort,
      enabled: row.enabled,
      remark: row.remark || ''
    })
    dialogVisible.value = true
  }

  // 校验并提交部门表单
  const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate()

    const payload: Api.Access.DepartmentPayload = {
      name: form.name.trim(),
      code: form.code.trim(),
      leader: form.leader?.trim() || '',
      phone: form.phone?.trim() || '',
      email: form.email?.trim() || '',
      sort: form.sort,
      enabled: form.enabled,
      remark: form.remark?.trim() || ''
    }

    if (dialogMode.value === 'add') {
      payload.parentId = form.parentId || undefined
      await fetchCreateDepartment(payload)
    } else if (editingId.value) {
      payload.parentId = form.parentId ?? null
      await fetchUpdateDepartment(editingId.value, payload)
    }

    dialogVisible.value = false
    await loadDepartments()
  }

  // 删除部门前二次确认
  const handleDelete = async (row: Api.Access.DepartmentItem) => {
    try {
      await ElMessageBox.confirm(`确定删除部门“${row.name}”吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteDepartment(row.id)
      await loadDepartments()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  // 展开或收起全部部门节点
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      const table = tableRef.value?.elTableRef
      if (!table) return

      /**
       * 递归切换当前层级及子部门的展开状态。
       */
      const walk = (rows: Api.Access.DepartmentItem[]) => {
        rows.forEach((row) => {
          if (row.children?.length) {
            table.toggleRowExpansion(row, isExpanded.value)
            walk(row.children)
          }
        })
      }

      walk(tableData.value)
    })
  }

  // 重置部门弹窗
  const resetDialog = () => {
    editingId.value = undefined
    Object.assign(form, {
      parentId: undefined,
      name: '',
      code: '',
      leader: '',
      phone: '',
      email: '',
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
    actionKey: 'createDepartment',
    onTrigger: openAddRootDialog,
    onCloseDialogs: closePageDialogs
  })
</script>
