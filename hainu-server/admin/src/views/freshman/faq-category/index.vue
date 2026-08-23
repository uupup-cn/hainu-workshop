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
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="loadData"
      >
        <template #left>
          <ElButton type="primary" plain @click="openDialog()">新增分类</ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="pagedData"
        :columns="columns"
        :pagination="{ current: page, size, total }"
        @pagination:current-change="handlePage"
        @pagination:size-change="handleSize"
      >
        <ElTableColumn prop="categoryName" label="分类名称" min-width="200" />
        <ElTableColumn prop="sortOrder" label="排序" width="120" />
        <ElTableColumn label="创建时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" @click="openDialog(row)">编辑</ElButton>
            <ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton>
          </template>
        </ElTableColumn>
      </ArtTable>
    </ElCard>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增分类' : '编辑分类'"
      width="500px"
      destroy-on-close
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="分类名称" prop="categoryName">
          <ElInput v-model.trim="form.categoryName" maxlength="50" placeholder="请输入分类名称" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sortOrder">
          <ElInputNumber v-model="form.sortOrder" :min="0" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSave">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import type { ColumnOption } from '@/types/component'
  import * as api from '@/api/freshman'

  defineOptions({ name: 'FreshmanFaqCategory' })

  interface FaqCategory {
    id?: number
    categoryName: string
    sortOrder: number
    createdAt?: string
  }

  const loading = ref(false)
  const submitting = ref(false)
  const showSearchBar = ref(true)
  const tableData = ref<FaqCategory[]>([])

  const page = ref(1)
  const size = ref(20)
  const total = ref(0)

  const keyword = ref('')
  const searchForm = ref({ keyword: '' })

  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入分类名称关键词' }
    }
  ])

  const columns = ref<ColumnOption[]>([
    { prop: 'categoryName', label: '分类名称', minWidth: 200 },
    { prop: 'sortOrder', label: '排序', width: 120 },
    { prop: 'createdAt', label: '创建时间', width: 180 },
    { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
  ])
  const columnChecks = ref<ColumnOption[]>([...columns.value])

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  const createForm = (): FaqCategory => ({ categoryName: '', sortOrder: 0 })
  const form = reactive<FaqCategory>(createForm())

  const rules = reactive<FormRules>({
    categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  })

  const pagedData = computed(() => {
    const start = (page.value - 1) * size.value
    return tableData.value.slice(start, start + size.value)
  })

  function formatDate(value?: string) {
    return value ? value.slice(0, 16).replace('T', ' ') : '-'
  }

  async function loadData() {
    loading.value = true
    try {
      const list = (await api.fetchAdminFaqCategories(
        keyword.value ? { keyword: keyword.value } : undefined
      )) as FaqCategory[]
      tableData.value = list || []
      total.value = tableData.value.length
    } finally {
      loading.value = false
    }
  }

  function handlePage(val: number) {
    page.value = val
  }

  function handleSize(val: number) {
    size.value = val
    page.value = 1
  }

  function handleSearch(params: Record<string, any>) {
    keyword.value = params.keyword || ''
    page.value = 1
    loadData()
  }

  function handleReset() {
    searchForm.value = { keyword: '' }
    keyword.value = ''
    page.value = 1
    loadData()
  }

  function openDialog(row?: FaqCategory) {
    dialogMode.value = row ? 'edit' : 'add'
    editId.value = row?.id || null
    Object.assign(form, row ? { ...row } : createForm())
    dialogVisible.value = true
  }

  async function handleSave() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return
    submitting.value = true
    try {
      if (editId.value) {
        await api.fetchUpdateFaqCategory(editId.value, { ...form })
      } else {
        await api.fetchCreateFaqCategory({ ...form })
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  }

  async function handleDelete(row: FaqCategory) {
    if (!row.id) return
    await ElMessageBox.confirm(`确认删除分类“${row.categoryName}”？`, '提示', { type: 'warning' })
    await api.fetchDeleteFaqCategory(row.id)
    ElMessage.success('删除成功')
    loadData()
  }

  onMounted(loadData)
</script>
