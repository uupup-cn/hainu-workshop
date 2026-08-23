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
          <ElButton type="primary" plain @click="openDialog()">新增主题</ElButton>
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
        <ElTableColumn prop="campus" label="校区" width="100" />
        <ElTableColumn prop="topicTitle" label="主题标题" min-width="200" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="状态" width="80">
          <template #default="{ row }">
            <ElTag :type="row.isActive ? 'success' : 'info'" size="small">
              {{ row.isActive ? '启用' : '停用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="更新时间" width="150">
          <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
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
      :title="dialogMode === 'add' ? '新增生活攻略' : '编辑生活攻略'"
      width="800px"
      destroy-on-close
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="校区" prop="campus">
              <ElSelect v-model="form.campus" placeholder="请选择校区" style="width: 100%">
                <ElOption
                  v-for="item in campusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="主题标识" prop="topicKey">
              <ElInput v-model.trim="form.topicKey" maxlength="50" placeholder="请输入主题标识" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElFormItem label="主题标题" prop="topicTitle">
          <ElInput v-model.trim="form.topicTitle" maxlength="100" placeholder="请输入主题标题" />
        </ElFormItem>
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="排序" prop="sortOrder">
              <ElInputNumber v-model="form.sortOrder" :min="0" />
            </ElFormItem>
          </ElCol>
          <ElCol :xs="24" :sm="12">
            <ElFormItem label="启用" prop="isActive">
              <ElSwitch v-model="form.isActive" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElFormItem label="正文内容" prop="content">
          <ArtWangEditor
            v-model="form.content"
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

  defineOptions({ name: 'FreshmanLife' })

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  interface LifeTopic {
    id?: number
    campus: string
    topicKey: string
    topicTitle: string
    content: string
    sortOrder: number
    isActive: boolean
    updatedAt?: string
  }

  const campusOptions = [
    { label: '海甸校区', value: '海甸校区' },
    { label: '儋州校区', value: '儋州校区' },
    { label: '城西校区', value: '城西校区' },
    { label: '观澜湖校区', value: '观澜湖校区' }
  ]

  const loading = ref(false)
  const submitting = ref(false)
  const showSearchBar = ref(true)
  const tableData = ref<LifeTopic[]>([])

  const page = ref(1)
  const size = ref(20)
  const total = ref(0)

  const searchForm = ref({ campus: '', keyword: '' })

  const searchItems = computed(() => [
    {
      label: '校区',
      key: 'campus',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择校区',
        options: campusOptions
      }
    },
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入主题标题关键词' }
    }
  ])

  const columns = ref<ColumnOption[]>([
    { prop: 'campus', label: '校区', width: 100 },
    { prop: 'topicTitle', label: '主题标题', minWidth: 200 },
    { prop: 'sortOrder', label: '排序', width: 80 },
    { prop: 'isActive', label: '状态', width: 80 },
    { prop: 'updatedAt', label: '更新时间', width: 150 },
    { prop: 'operation', label: '操作', width: 180, fixed: 'right' }
  ])
  const columnChecks = ref<ColumnOption[]>([...columns.value])

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  const createForm = (): LifeTopic => ({
    campus: searchForm.value.campus || '海甸校区',
    topicKey: '',
    topicTitle: '',
    content: '',
    sortOrder: 0,
    isActive: true
  })

  const form = reactive<LifeTopic>(createForm())

  const rules = reactive<FormRules>({
    campus: [{ required: true, message: '请选择校区', trigger: 'change' }],
    topicKey: [{ required: true, message: '请输入主题标识', trigger: 'blur' }],
    topicTitle: [{ required: true, message: '请输入主题标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入正文内容', trigger: 'blur' }]
  })

  const pagedData = computed(() => {
    const start = (page.value - 1) * size.value
    return tableData.value.slice(start, start + size.value)
  })

  function formatDate(value?: string) {
    return value ? value.slice(0, 16).replace('T', ' ') : '-'
  }

  function buildParams() {
    const params: Record<string, any> = {}
    if (searchForm.value.campus) params.campus = searchForm.value.campus
    if (searchForm.value.keyword) params.keyword = searchForm.value.keyword
    return params
  }

  async function loadData() {
    loading.value = true
    try {
      const list = (await api.fetchAdminLifeTopics(buildParams())) as LifeTopic[]
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
    searchForm.value = { campus: '', keyword: '' }
    page.value = 1
    loadData()
  }

  function openDialog(row?: LifeTopic) {
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
        await api.fetchUpdateLifeTopic(editId.value, { ...form })
      } else {
        await api.fetchCreateLifeTopic({ ...form })
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  }

  async function handleDelete(row: LifeTopic) {
    if (!row.id) return
    await ElMessageBox.confirm(`确认删除主题“${row.topicTitle}”？`, '提示', { type: 'warning' })
    await api.fetchDeleteLifeTopic(row.id)
    ElMessage.success('删除成功')
    loadData()
  }

  onMounted(loadData)
</script>
