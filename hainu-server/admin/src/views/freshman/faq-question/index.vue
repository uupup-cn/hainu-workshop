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
          <ElButton type="primary" plain @click="openDialog()">新增问题</ElButton>
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
        <ElTableColumn prop="question" label="问题" min-width="300" />
        <ElTableColumn label="分类" width="120">
          <template #default="{ row }">{{ categoryLabel(row.categoryId) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="80">
          <template #default="{ row }">
            <ElTag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '启用' : '停用' }}
            </ElTag>
          </template>
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
      :title="dialogMode === 'add' ? '新增问题' : '编辑问题'"
      width="800px"
      destroy-on-close
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="分类" prop="categoryId">
              <ElSelect
                v-model="form.categoryId"
                placeholder="请选择分类"
                style="width: 100%"
                filterable
              >
                <ElOption
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="排序" prop="sortOrder">
              <ElInputNumber v-model="form.sortOrder" :min="0" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElFormItem label="问题" prop="question">
          <ElInput v-model.trim="form.question" maxlength="200" placeholder="请输入问题" />
        </ElFormItem>
        <ElFormItem label="启用" prop="isActive">
          <ElSwitch v-model="form.isActive" />
        </ElFormItem>
        <ElFormItem label="答案" prop="answer">
          <ArtWangEditor
            v-model="form.answer"
            height="400px"
            :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']"
          />
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

  defineOptions({ name: 'FreshmanFaqQuestion' })

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  interface FaqCategory {
    id: number
    categoryName: string
    sortOrder: number
  }

  interface FaqQuestion {
    id?: number
    categoryId: number | undefined
    question: string
    answer: string
    sortOrder: number
    isActive: boolean
  }

  const loading = ref(false)
  const submitting = ref(false)
  const showSearchBar = ref(true)
  const categories = ref<FaqCategory[]>([])
  const tableData = ref<FaqQuestion[]>([])

  const page = ref(1)
  const size = ref(20)
  const total = ref(0)

  const searchForm = ref({ categoryId: '' as number | '', keyword: '' })

  const searchItems = computed(() => [
    {
      label: '分类',
      key: 'categoryId',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择分类',
        options: categories.value.map((item) => ({
          label: item.categoryName,
          value: item.id
        }))
      }
    },
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入问题关键词' }
    }
  ])

  const columns = ref<ColumnOption[]>([
    { prop: 'question', label: '问题', minWidth: 300 },
    { prop: 'categoryId', label: '分类', width: 120 },
    { prop: 'sortOrder', label: '排序', width: 80 },
    { prop: 'isActive', label: '状态', width: 80 },
    { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
  ])
  const columnChecks = ref<ColumnOption[]>([...columns.value])

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  const createForm = (): FaqQuestion => ({
    categoryId: searchForm.value.categoryId || undefined,
    question: '',
    answer: '',
    sortOrder: 0,
    isActive: true
  })
  const form = reactive<FaqQuestion>(createForm())

  const rules = reactive<FormRules>({
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
    answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
  })

  const pagedData = computed(() => {
    const start = (page.value - 1) * size.value
    return tableData.value.slice(start, start + size.value)
  })

  function categoryLabel(id?: number) {
    if (!id) return '-'
    return categories.value.find((item) => item.id === id)?.categoryName || '-'
  }

  function buildParams() {
    const params: Record<string, any> = {}
    if (searchForm.value.categoryId) params.categoryId = searchForm.value.categoryId
    if (searchForm.value.keyword) params.keyword = searchForm.value.keyword
    return params
  }

  async function loadCategories() {
    categories.value = ((await api.fetchAdminFaqCategories()) as FaqCategory[]) || []
  }

  async function loadData() {
    loading.value = true
    try {
      const list = (await api.fetchAdminFaqQuestions(buildParams())) as FaqQuestion[]
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

  function handleSearch() {
    page.value = 1
    loadData()
  }

  function handleReset() {
    searchForm.value = { categoryId: '', keyword: '' }
    page.value = 1
    loadData()
  }

  function openDialog(row?: FaqQuestion) {
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
        await api.fetchUpdateFaqQuestion(editId.value, { ...form })
      } else {
        await api.fetchCreateFaqQuestion({ ...form })
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  }

  async function handleDelete(row: FaqQuestion) {
    if (!row.id) return
    await ElMessageBox.confirm(`确认删除问题“${row.question}”？`, '提示', { type: 'warning' })
    await api.fetchDeleteFaqQuestion(row.id)
    ElMessage.success('删除成功')
    loadData()
  }

  onMounted(async () => {
    await loadCategories()
    await loadData()
  })
</script>
