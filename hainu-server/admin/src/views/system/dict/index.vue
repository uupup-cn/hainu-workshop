<template>
  <div class="dict-page art-full-height overflow-visible">
    <div v-if="isMobileLayout" class="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1">
      <section class="dict-panel flex min-h-0 flex-col gap-4">
        <div class="art-card-xs flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <ElInput
            class="w-full sm:flex-1"
            v-model="typeSearchForm.keyword"
            :prefix-icon="Search"
            clearable
            placeholder="请输入字典名称或字典编码"
            @clear="handleTypeSearch"
            @keyup.enter="handleTypeSearch"
          />
          <ElButton type="primary" class="w-full sm:w-auto" @click="handleTypeSearch">
            查询
          </ElButton>
        </div>

        <ElCard
          class="art-table-card flex min-h-0 flex-col overflow-hidden [&_.el-card__header]:shrink-0 [&_.el-card__body]:flex [&_.el-card__body]:flex-col [&_.el-card__body]:min-h-0 [&_.el-card__body]:flex-1 [&_.el-card__body]:overflow-hidden"
          shadow="never"
        >
          <div>
            <ElButton
              v-if="hasAuth('add')"
              @click="openTypeDialog('add')"
              type="primary"
              plain
              v-ripple
            >
              新增字典
            </ElButton>
          </div>

          <ArtTable
            :loading="typeLoading"
            :data="typeRecords"
            :columns="typeColumns"
            :pagination="typePagination"
            :pagination-options="{ layout: 'prev, pager, next' }"
            emptyHeight="260px"
            @row-click="handleTypeRowClick"
            @pagination:size-change="handleTypeSizeChange"
            @pagination:current-change="handleTypeCurrentChange"
          />
        </ElCard>
      </section>

      <section class="dict-panel flex min-h-0 flex-col gap-4">
        <ArtSearchBar
          v-model="dataSearchForm"
          :items="dataSearchItems"
          :showExpand="false"
          @search="loadDataList"
          @reset="resetDataSearch"
        />

        <ElCard
          class="art-table-card flex min-h-0 flex-col overflow-hidden [&_.el-card__header]:shrink-0 [&_.el-card__body]:flex [&_.el-card__body]:flex-col [&_.el-card__body]:min-h-0 [&_.el-card__body]:flex-1 [&_.el-card__body]:overflow-hidden"
          shadow="never"
        >
          <template #header>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm font-medium">
                {{ currentType ? `字典数据 · ${currentType.name}` : '字典数据' }}
              </div>
              <ElTag
                v-if="currentType"
                :type="currentType.enabled ? 'success' : 'info'"
                class="w-fit"
              >
                {{ currentType.code }}
              </ElTag>
            </div>
          </template>

          <ArtTableHeader
            v-model:columns="dataColumnChecks"
            :loading="dataLoading"
            @refresh="loadDataList"
          >
            <template #left>
              <ElButton
                v-if="hasAuth('add')"
                :disabled="!currentType"
                @click="openDataDialog('add')"
                v-ripple
              >
                新增数据
              </ElButton>
            </template>
          </ArtTableHeader>

          <ArtTable
            :loading="dataLoading"
            :data="dataRecords"
            :columns="dataColumns"
            :pagination="dataPagination"
            emptyHeight="260px"
            @pagination:size-change="handleDataSizeChange"
            @pagination:current-change="handleDataCurrentChange"
          />
        </ElCard>
      </section>
    </div>

    <ElSplitter
      v-else
      class="dict-page-splitter h-full overflow-visible [&_.el-splitter-panel]:!overflow-visible"
    >
      <ElSplitterPanel size="32%" min="360" :collapsible="true">
        <section
          class="dict-panel dict-panel-primary flex h-full min-h-0 flex-col overflow-visible"
        >
          <div class="art-card-xs flex items-center gap-3 p-4">
            <ElInput
              class="flex-1"
              v-model="typeSearchForm.keyword"
              :prefix-icon="Search"
              clearable
              placeholder="请输入字典名称或字典编码"
              @clear="handleTypeSearch"
              @keyup.enter="handleTypeSearch"
            />
            <ElButton type="primary" @click="handleTypeSearch">查询</ElButton>
          </div>

          <ElCard
            class="art-table-card flex min-h-0 flex-1 flex-col overflow-hidden [&_.el-card__header]:shrink-0 [&_.el-card__body]:flex [&_.el-card__body]:flex-col [&_.el-card__body]:min-h-0 [&_.el-card__body]:flex-1 [&_.el-card__body]:overflow-hidden"
            shadow="never"
          >
            <div>
              <ElButton
                v-if="hasAuth('add')"
                @click="openTypeDialog('add')"
                type="primary"
                plain
                v-ripple
              >
                新增字典
              </ElButton>
            </div>

            <ArtTable
              :loading="typeLoading"
              :data="typeRecords"
              :columns="typeColumns"
              :pagination="typePagination"
              :pagination-options="{ layout: 'prev, pager, next' }"
              @row-click="handleTypeRowClick"
              @pagination:size-change="handleTypeSizeChange"
              @pagination:current-change="handleTypeCurrentChange"
            />
          </ElCard>
        </section>
      </ElSplitterPanel>

      <ElSplitterPanel min="420" :collapsible="true">
        <section
          class="dict-panel dict-panel-secondary flex h-full min-h-0 flex-col overflow-visible"
        >
          <ArtSearchBar
            v-model="dataSearchForm"
            :items="dataSearchItems"
            :showExpand="false"
            @search="loadDataList"
            @reset="resetDataSearch"
          />

          <ElCard
            class="art-table-card flex min-h-0 flex-1 flex-col overflow-hidden [&_.el-card__header]:shrink-0 [&_.el-card__body]:flex [&_.el-card__body]:flex-col [&_.el-card__body]:min-h-0 [&_.el-card__body]:flex-1 [&_.el-card__body]:overflow-hidden"
            shadow="never"
          >
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-medium">
                  {{ currentType ? `字典数据 · ${currentType.name}` : '字典数据' }}
                </div>
                <ElTag v-if="currentType" :type="currentType.enabled ? 'success' : 'info'">
                  {{ currentType.code }}
                </ElTag>
              </div>
            </template>

            <ArtTableHeader
              v-model:columns="dataColumnChecks"
              :loading="dataLoading"
              @refresh="loadDataList"
            >
              <template #left>
                <ElButton
                  v-if="hasAuth('add')"
                  :disabled="!currentType"
                  @click="openDataDialog('add')"
                  v-ripple
                >
                  新增数据
                </ElButton>
              </template>
            </ArtTableHeader>

            <ArtTable
              :loading="dataLoading"
              :data="dataRecords"
              :columns="dataColumns"
              :pagination="dataPagination"
              @pagination:size-change="handleDataSizeChange"
              @pagination:current-change="handleDataCurrentChange"
            />
          </ElCard>
        </section>
      </ElSplitterPanel>
    </ElSplitter>

    <ElDialog
      v-model="typeDialogVisible"
      :title="typeDialogMode === 'add' ? '新增字典类型' : '编辑字典类型'"
      width="min(460px, calc(100vw - 32px))"
      align-center
      @close="resetTypeDialog"
    >
      <ElForm ref="typeFormRef" :model="typeForm" :rules="typeRules" label-width="80px">
        <ElFormItem label="字典名称" prop="name">
          <ElInput v-model="typeForm.name" placeholder="请输入字典名称" />
        </ElFormItem>
        <ElFormItem label="字典编码" prop="code">
          <ElInput v-model="typeForm.code" placeholder="请输入字典编码" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSwitch v-model="typeForm.enabled" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="typeForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="typeDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submitTypeDialog">提交</ElButton>
      </template>
    </ElDialog>

    <ElDialog
      v-model="dataDialogVisible"
      :title="dataDialogMode === 'add' ? '新增字典数据' : '编辑字典数据'"
      width="min(560px, calc(100vw - 32px))"
      align-center
      @close="resetDataDialog"
    >
      <ElForm ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="88px">
        <ElFormItem label="所属字典">
          <ElInput :model-value="currentType?.name || '-'" disabled />
        </ElFormItem>
        <ElFormItem label="数据标签" prop="label">
          <ElInput v-model="dataForm.label" placeholder="请输入数据标签" />
        </ElFormItem>
        <ElFormItem label="数据键值" prop="value">
          <ElInput v-model="dataForm.value" placeholder="请输入数据键值" />
        </ElFormItem>
        <ElFormItem label="标签类型">
          <ElSelect v-model="dataForm.tagType" clearable placeholder="请选择标签类型">
            <ElOption label="默认" value="" />
            <ElOption label="成功" value="success" />
            <ElOption label="警告" value="warning" />
            <ElOption label="危险" value="danger" />
            <ElOption label="信息" value="info" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber
            v-model="dataForm.sort"
            :min="1"
            class="!w-full"
            :controls-position="'right'"
          />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSwitch v-model="dataForm.enabled" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="dataForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dataDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submitDataDialog">提交</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import {
    fetchCreateDictData,
    fetchCreateDictType,
    fetchDeleteDictData,
    fetchDeleteDictType,
    fetchDictData,
    fetchDictTypes,
    fetchUpdateDictData,
    fetchUpdateDictType
  } from '@/api/dicts'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'Dict' })

  const { hasAuth } = useAuth()
  const { width } = useWindowSize()
  /**
   * 判断当前是否需要启用移动端/窄屏布局。
   */
  const isMobileLayout = computed(() => width.value < 992)

  const typeLoading = ref(false)
  const dataLoading = ref(false)

  const typeSearchForm = reactive({
    keyword: ''
  })

  const dataSearchForm = reactive({
    label: '',
    value: '',
    enabled: undefined as boolean | undefined
  })

  /**
   * 构建字典数据筛选栏配置。
   */
  const dataSearchItems = computed(() => [
    {
      label: '数据标签',
      key: 'label',
      type: 'input',
      props: { clearable: true, placeholder: '请输入数据标签' }
    },
    {
      label: '数据键值',
      key: 'value',
      type: 'input',
      props: { clearable: true, placeholder: '请输入数据键值' }
    }
  ])

  const typeRecords = ref<Api.Content.DictTypeItem[]>([])
  const dataRecords = ref<Api.Content.DictDataItem[]>([])
  const currentType = ref<Api.Content.DictTypeItem>()

  const typePagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })

  const dataPagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })

  const { columns: typeColumns } = useTableColumns<Api.Content.DictTypeItem>(() => [
    { type: 'index', width: 60, label: '序号' },
    { prop: 'name', label: '字典名称' },
    { prop: 'code', label: '字典编码' },
    // {
    //   prop: '_count',
    //   label: '数据量',
    //   align: 'center',
    //   formatter: (row: Api.Content.DictTypeItem) => row._count?.items ?? 0
    // },
    {
      prop: 'enabled',
      label: '状态',
      width: 90,
      formatter: (row: Api.Content.DictTypeItem) =>
        h(ElTag, { type: row.enabled ? 'success' : 'info' }, () => (row.enabled ? '启用' : '禁用'))
    },
    {
      prop: 'operation',
      label: '操作',
      width: 120,
      fixed: 'right',
      formatter: (row: Api.Content.DictTypeItem) =>
        h('div', [
          hasAuth('edit')
            ? h(ArtButtonTable, { type: 'edit', onClick: () => openTypeDialog('edit', row) })
            : null,
          hasAuth('delete')
            ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDeleteType(row) })
            : null
        ])
    }
  ])

  const { columns: dataColumns, columnChecks: dataColumnChecks } =
    useTableColumns<Api.Content.DictDataItem>(() => [
      { type: 'index', width: 60, label: '序号' },
      { prop: 'label', label: '数据标签', minWidth: 140 },
      { prop: 'value', label: '数据键值', minWidth: 140 },
      {
        prop: 'tagType',
        label: '标签类型',
        width: 100,
        formatter: (row: Api.Content.DictDataItem) => row.tagType || '-'
      },
      { prop: 'sort', label: '排序', width: 80, align: 'center' },
      {
        prop: 'enabled',
        label: '状态',
        width: 90,
        formatter: (row: Api.Content.DictDataItem) =>
          h(ElTag, { type: row.enabled ? 'success' : 'info' }, () =>
            row.enabled ? '启用' : '禁用'
          )
      },
      {
        prop: 'updatedAt',
        label: '更新时间',
        minWidth: 160,
        formatter: (row: Api.Content.DictDataItem) => formatDateTime(row.updatedAt)
      },
      {
        prop: 'operation',
        label: '操作',
        width: 120,
        fixed: 'right',
        formatter: (row: Api.Content.DictDataItem) =>
          h('div', [
            hasAuth('edit')
              ? h(ArtButtonTable, { type: 'edit', onClick: () => openDataDialog('edit', row) })
              : null,
            hasAuth('delete')
              ? h(ArtButtonTable, { type: 'delete', onClick: () => handleDeleteData(row) })
              : null
          ])
      }
    ])

  const typeDialogVisible = ref(false)
  const typeDialogMode = ref<'add' | 'edit'>('add')
  const typeEditingId = ref<number>()
  const typeFormRef = ref<FormInstance>()
  const typeForm = reactive<Api.Content.DictTypePayload>({
    name: '',
    code: '',
    enabled: true,
    remark: ''
  })
  const typeRules = reactive<FormRules>({
    name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }]
  })

  const dataDialogVisible = ref(false)
  const dataDialogMode = ref<'add' | 'edit'>('add')
  const dataEditingId = ref<number>()
  const dataFormRef = ref<FormInstance>()
  const dataForm = reactive<Api.Content.DictDataPayload>({
    typeId: 0,
    label: '',
    value: '',
    sort: 1,
    enabled: true,
    tagType: '',
    remark: ''
  })
  const dataRules = reactive<FormRules>({
    label: [{ required: true, message: '请输入数据标签', trigger: 'blur' }],
    value: [{ required: true, message: '请输入数据键值', trigger: 'blur' }]
  })

  onMounted(async () => {
    await loadTypeList()
  })

  // 加载字典类型列表
  const loadTypeList = async () => {
    typeLoading.value = true
    try {
      const res = await fetchDictTypes({
        current: typePagination.current,
        size: typePagination.size,
        keyword: typeSearchForm.keyword || undefined
      })
      typeRecords.value = res.records
      typePagination.total = res.total

      if (!currentType.value && res.records.length) {
        currentType.value = res.records[0]
      } else if (currentType.value) {
        currentType.value =
          res.records.find((item) => item.id === currentType.value?.id) || res.records[0]
      }

      await loadDataList()
    } finally {
      typeLoading.value = false
    }
  }

  // 提交字典类型搜索条件
  const handleTypeSearch = () => {
    typePagination.current = 1
    loadTypeList()
  }

  // 加载字典数据列表
  const loadDataList = async () => {
    if (!currentType.value) {
      dataRecords.value = []
      dataPagination.total = 0
      return
    }

    dataLoading.value = true
    try {
      const res = await fetchDictData({
        current: dataPagination.current,
        size: dataPagination.size,
        typeId: currentType.value.id,
        label: dataSearchForm.label || undefined,
        value: dataSearchForm.value || undefined,
        enabled: dataSearchForm.enabled
      })
      dataRecords.value = res.records
      dataPagination.total = res.total
    } finally {
      dataLoading.value = false
    }
  }

  // 点击字典类型行时切换右侧数据
  const handleTypeRowClick = (row: Api.Content.DictTypeItem) => {
    currentType.value = row
    dataPagination.current = 1
    loadDataList()
  }

  // 切换类型分页大小
  const handleTypeSizeChange = (size: number) => {
    typePagination.size = size
    loadTypeList()
  }

  // 切换类型当前页
  const handleTypeCurrentChange = (current: number) => {
    typePagination.current = current
    loadTypeList()
  }

  // 切换数据分页大小
  const handleDataSizeChange = (size: number) => {
    dataPagination.size = size
    loadDataList()
  }

  // 切换数据当前页
  const handleDataCurrentChange = (current: number) => {
    dataPagination.current = current
    loadDataList()
  }

  // 重置字典数据筛选条件
  const resetDataSearch = () => {
    Object.assign(dataSearchForm, { label: '', value: '', enabled: undefined })
    dataPagination.current = 1
    loadDataList()
  }

  // 打开字典类型弹窗
  const openTypeDialog = (mode: 'add' | 'edit', row?: Api.Content.DictTypeItem) => {
    resetTypeDialog()
    typeDialogMode.value = mode
    if (mode === 'edit' && row) {
      typeEditingId.value = row.id
      Object.assign(typeForm, {
        name: row.name,
        code: row.code,
        enabled: row.enabled,
        remark: row.remark || ''
      })
    }
    typeDialogVisible.value = true
  }

  // 提交字典类型表单
  const submitTypeDialog = async () => {
    if (!typeFormRef.value) return
    await typeFormRef.value.validate()

    const payload: Api.Content.DictTypePayload = {
      name: typeForm.name.trim(),
      code: typeForm.code.trim(),
      enabled: typeForm.enabled,
      remark: typeForm.remark?.trim() || ''
    }

    if (typeDialogMode.value === 'add') {
      await fetchCreateDictType(payload)
    } else if (typeEditingId.value) {
      await fetchUpdateDictType(typeEditingId.value, payload)
    }

    typeDialogVisible.value = false
    await loadTypeList()
  }

  // 删除字典类型前二次确认
  const handleDeleteType = async (row: Api.Content.DictTypeItem) => {
    try {
      await ElMessageBox.confirm(`确定删除字典“${row.name}”吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteDictType(row.id)
      if (currentType.value?.id === row.id) {
        currentType.value = undefined
      }
      await loadTypeList()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  // 打开字典数据弹窗
  const openDataDialog = (mode: 'add' | 'edit', row?: Api.Content.DictDataItem) => {
    if (!currentType.value) {
      ElMessage.warning('请先选择字典类型')
      return
    }

    resetDataDialog()
    dataDialogMode.value = mode
    dataForm.typeId = currentType.value.id

    if (mode === 'edit' && row) {
      dataEditingId.value = row.id
      Object.assign(dataForm, {
        typeId: row.typeId,
        label: row.label,
        value: row.value,
        sort: row.sort,
        enabled: row.enabled,
        tagType: row.tagType || '',
        remark: row.remark || ''
      })
    }

    dataDialogVisible.value = true
  }

  // 提交字典数据表单
  const submitDataDialog = async () => {
    if (!currentType.value || !dataFormRef.value) return
    await dataFormRef.value.validate()

    const payload: Api.Content.DictDataPayload = {
      typeId: currentType.value.id,
      label: dataForm.label.trim(),
      value: dataForm.value.trim(),
      sort: dataForm.sort,
      enabled: dataForm.enabled,
      tagType: dataForm.tagType?.trim() || '',
      remark: dataForm.remark?.trim() || ''
    }

    if (dataDialogMode.value === 'add') {
      await fetchCreateDictData(payload)
    } else if (dataEditingId.value) {
      await fetchUpdateDictData(dataEditingId.value, payload)
    }

    dataDialogVisible.value = false
    await loadDataList()
    await loadTypeList()
  }

  // 删除字典数据前二次确认
  const handleDeleteData = async (row: Api.Content.DictDataItem) => {
    try {
      await ElMessageBox.confirm(`确定删除数据“${row.label}”吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await fetchDeleteDictData(row.id)
      await loadDataList()
      await loadTypeList()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  // 重置字典类型弹窗
  const resetTypeDialog = () => {
    typeEditingId.value = undefined
    Object.assign(typeForm, {
      name: '',
      code: '',
      enabled: true,
      remark: ''
    })
    typeFormRef.value?.clearValidate()
  }

  // 重置字典数据弹窗
  const resetDataDialog = () => {
    dataEditingId.value = undefined
    Object.assign(dataForm, {
      typeId: currentType.value?.id || 0,
      label: '',
      value: '',
      sort: 1,
      enabled: true,
      tagType: '',
      remark: ''
    })
    dataFormRef.value?.clearValidate()
  }
</script>

<style scoped lang="scss">
  .dict-page-splitter {
    --dict-panel-gap: 6px;
    --dict-primary-left-gap: 0;
    --dict-primary-right-gap: var(--dict-panel-gap);
    --dict-secondary-left-gap: var(--dict-panel-gap);
    --dict-secondary-right-gap: 0;
  }

  .dict-panel {
    box-sizing: border-box;
    min-width: 0;
  }

  .dict-panel-primary {
    padding-right: var(--dict-primary-right-gap);
    padding-left: var(--dict-primary-left-gap);
  }

  .dict-panel-secondary {
    padding-right: var(--dict-secondary-right-gap);
    padding-left: var(--dict-secondary-left-gap);
  }

  :global([dir='rtl'] .dict-page-splitter) {
    --dict-primary-left-gap: var(--dict-panel-gap);
    --dict-primary-right-gap: 0;
    --dict-secondary-left-gap: 0;
    --dict-secondary-right-gap: var(--dict-panel-gap);
  }

  :global([data-box-mode='shadow-mode']) {
    .dict-page,
    .dict-page-splitter,
    .dict-panel {
      overflow: visible !important;
    }

    .dict-page-splitter :deep(.el-splitter-panel) {
      overflow: visible !important;
    }
  }
</style>
