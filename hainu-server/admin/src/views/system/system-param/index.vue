<template>
  <div class="flex flex-col gap-4" :class="isFocusMode ? 'art-full-height' : 'pb-5'">
    <ArtPageHero
      v-if="!isFocusMode"
      tone="box"
      align="start"
      title="参数设置"
      description="统一管理系统运行参数、登录体验、安全策略与审计策略。支持分组维护、内置保护、缓存刷新与按键名读取，便于后续业务模块复用。"
    >
      <template #right>
        <div
          class="rounded-full border border-[var(--default-border)] bg-[var(--default-bg-color)] px-3 py-1 text-xs text-g-700"
        >
          缓存项：{{ summary.cacheSize }}
        </div>
        <div
          class="rounded-full border border-[var(--default-border)] bg-[var(--default-bg-color)] px-3 py-1 text-xs text-g-700"
        >
          分组数：{{ summary.groupCount }}
        </div>
        <div
          class="rounded-full border border-[var(--default-border)] bg-[var(--default-bg-color)] px-3 py-1 text-xs text-g-700"
        >
          最近刷新：{{ summary.cacheUpdatedAt || '-' }}
        </div>
      </template>
    </ArtPageHero>

    <section v-if="!isFocusMode" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in summaryCards" :key="card.label" class="art-surface-sm px-5 py-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-sm text-g-600">{{ card.label }}</div>
            <div class="mt-3 text-3xl font-semibold text-g-900">{{ card.value }}</div>
            <div class="mt-2 text-xs text-g-500">{{ card.tip }}</div>
          </div>
          <div
            class="flex size-11 items-center justify-center rounded-[var(--custom-radius)] text-lg"
            :class="card.iconClass"
          >
            <ArtSvgIcon :icon="card.icon" />
          </div>
        </div>
      </div>
    </section>

    <ArtSearchBar
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="flex-1 art-table-card full-card mt-0! overflow-hidden">
      <div class="border-b border-[var(--default-border)] p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <ElButton v-auth="'add'" type="primary" @click="openDialog('add')" v-ripple>
              新增参数
            </ElButton>
            <ElButton
              v-auth="'delete'"
              :disabled="selectedRows.length === 0"
              @click="handleBatchDelete"
              v-ripple
            >
              批量删除
            </ElButton>
            <ElButton v-auth="'refresh'" plain @click="handleRefreshCache" v-ripple>
              刷新缓存
            </ElButton>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <ElTag type="info" effect="light">当前页 {{ records.length }} 条</ElTag>
            <ElTag v-if="selectedRows.length" type="primary" effect="light">
              已选 {{ selectedRows.length }} 项
            </ElTag>
          </div>
        </div>
      </div>

      <div class="flex min-h-0 flex-1 flex-col p-4" :class="{ 'pb-0': !isFocusMode }">
        <ArtTableHeader
          v-model:columns="columnChecks"
          :loading="loading"
          :data="records"
          :selected-data="selectedRows"
          full-class="full-card"
          @refresh="loadList"
        >
          <template #left>
            <div class="mb-4 flex flex-wrap gap-2" v-if="groupTags.length">
              <ElTag
                class="cursor-pointer"
                :effect="!searchForm.groupCode ? 'dark' : 'plain'"
                @click="applyGroupFilter('')"
              >
                全部分组
              </ElTag>
              <ElTag
                v-for="group in groupTags"
                :key="group.code"
                class="cursor-pointer"
                :effect="searchForm.groupCode === group.code ? 'dark' : 'plain'"
                @click="applyGroupFilter(group.code)"
              >
                {{ group.name }} ({{ group.count }})
              </ElTag>
            </div>
          </template>
          <template #right>
            <ArtFocusModeButton :active="isFocusMode" @click="toggleFocusMode" />
          </template>
        </ArtTableHeader>

        <ArtTable
          :loading="loading"
          :data="records"
          :columns="columns"
          :pagination="pagination"
          @selection-change="handleSelectionChange"
          @pagination:size-change="handleSizeChange"
          @pagination:current-change="handleCurrentChange"
        />
      </div>
    </div>
    <SystemParamDialog
      ref="dialogRef"
      v-model:visible="dialogVisible"
      v-model:form="form"
      :mode="dialogMode"
      :rules="rules"
      :preview-value="previewValue"
      :value-input-placeholder="valueInputPlaceholder"
      :submit-loading="submitLoading"
      @closed="resetDialog"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import ArtFocusModeButton from '@/components/core/tables/art-focus-mode-button/index.vue'
  import { useAuth } from '@/hooks/core/useAuth'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import {
    fetchCreateSystemParam,
    fetchDeleteSystemParams,
    fetchRefreshSystemParamCache,
    fetchSystemParamDetail,
    fetchSystemParams,
    fetchUpdateSystemParam
  } from '@/api/system-params'
  import { formatDateTime } from '@/utils'
  import SystemParamDialog from './modules/system-param-dialog.vue'
  import {
    buildSystemParamPayload,
    createSystemParamForm,
    createSystemParamRules,
    createSystemParamSearchForm,
    valueTypeOptions
  } from './shared'
  import { createSystemParamColumns } from './modules/useSystemParamColumns'

  defineOptions({ name: 'SystemParam' })

  type DialogMode = 'add' | 'edit'

  const { hasAuth } = useAuth()
  const { isFocusMode, toggleFocusMode } = usePageFocusMode('system.systemParam')

  const loading = ref(false)
  const submitLoading = ref(false)
  const dialogVisible = ref(false)
  const dialogMode = ref<DialogMode>('add')
  const currentId = ref<number>()
  const dialogRef = ref<InstanceType<typeof SystemParamDialog> | null>(null)

  const searchForm = reactive<Api.Settings.SystemParamSearchParams>(createSystemParamSearchForm())

  const records = ref<Api.Settings.SystemParamItem[]>([])
  const groupTags = ref<Api.Settings.SystemParamGroupItem[]>([])
  const selectedRows = ref<Api.Settings.SystemParamItem[]>([])

  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })

  const summary = reactive({
    total: 0,
    enabledCount: 0,
    builtInCount: 0,
    groupCount: 0,
    cacheSize: 0,
    cacheUpdatedAt: ''
  })

  const form = reactive(createSystemParamForm())

  /**
   * 构建搜索栏配置，分组选项跟随接口返回的分组标签动态刷新。
   */
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入参数名称、键名或备注' }
    },
    {
      label: '分组',
      key: 'groupCode',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择分组',
        options: groupTags.value.map((item) => ({ label: item.name, value: item.code }))
      }
    },
    {
      label: '参数类型',
      key: 'valueType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择参数类型',
        options: valueTypeOptions
      }
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
      label: '参数属性',
      key: 'builtIn',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择参数属性',
        options: [
          { label: '内置参数', value: true },
          { label: '自定义参数', value: false }
        ]
      }
    }
  ])

  /**
   * 汇总顶部统计卡片所需的展示数据。
   */
  const summaryCards = computed(() => [
    {
      label: '参数总量',
      value: summary.total,
      tip: '包括内置参数与业务扩展参数',
      icon: 'ri:database-2-line',
      iconClass: 'bg-[color:var(--el-color-primary-light-9)] text-theme'
    },
    {
      label: '启用参数',
      value: summary.enabledCount,
      tip: '当前会参与读取和缓存的有效参数',
      icon: 'ri:checkbox-circle-line',
      iconClass: 'bg-[color:var(--el-color-success-light-9)] text-[color:var(--el-color-success)]'
    },
    {
      label: '内置参数',
      value: summary.builtInCount,
      tip: '平台基础参数，建议谨慎修改',
      icon: 'ri:shield-keyhole-line',
      iconClass: 'bg-[color:var(--el-color-warning-light-9)] text-[color:var(--el-color-warning)]'
    },
    {
      label: '参数分组',
      value: summary.groupCount,
      tip: '可按业务域划分不同配置命名空间',
      icon: 'ri:folder-settings-line',
      iconClass: 'bg-[var(--default-bg-color)] text-g-700'
    }
  ])

  /**
   * 生成参数值预览文本，JSON 类型会先做轻量格式校验。
   */
  const previewValue = computed(() => {
    if (!form.value) return '-'
    if (form.valueType === 'JSON') {
      try {
        return JSON.stringify(JSON.parse(form.value))
      } catch {
        return 'JSON 格式待修正'
      }
    }
    return form.value.length > 48 ? `${form.value.slice(0, 48)}...` : form.value
  })

  /**
   * 根据参数值类型提示用户输入正确格式。
   */
  const valueInputPlaceholder = computed(() => {
    if (form.valueType === 'JSON') {
      return '请输入合法 JSON，例如：{"enabled": true}'
    }
    if (form.valueType === 'TEXT') {
      return '请输入多行文本内容'
    }
    if (form.valueType === 'NUMBER') {
      return '请输入数字，例如：8'
    }
    return '请输入参数值'
  })

  // 表单校验规则统一从 shared 工具生成，便于弹窗组件复用。
  const rules = createSystemParamRules(() => form)

  const { columns, columnChecks } = useTableColumns<Api.Settings.SystemParamItem>(() =>
    createSystemParamColumns({
      hasAuth,
      openDialog,
      handleDelete
    })
  )

  // 组装查询参数
  function buildRequestParams() {
    return {
      current: pagination.current,
      size: pagination.size,
      keyword: searchForm.keyword || undefined,
      groupCode: searchForm.groupCode || undefined,
      valueType: searchForm.valueType || undefined,
      enabled: searchForm.enabled,
      builtIn: searchForm.builtIn
    }
  }

  /**
   * 加载参数列表，并同步分页、分组标签和汇总信息。
   */
  async function loadList() {
    loading.value = true
    try {
      const res = await fetchSystemParams(buildRequestParams())
      records.value = res.records
      groupTags.value = res.groups || []
      pagination.total = res.total
      summary.total = res.summary?.total ?? res.total
      summary.enabledCount = res.summary?.enabledCount ?? 0
      summary.builtInCount = res.summary?.builtInCount ?? 0
      summary.groupCount = res.summary?.groupCount ?? res.groups?.length ?? 0
      summary.cacheSize = res.cacheSize || 0
      summary.cacheUpdatedAt = formatDateTime(res.updatedAt)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 提交筛选条件并刷新列表
  function handleSearch() {
    pagination.current = 1
    loadList()
  }

  // 重置筛选条件并重新查询
  function handleReset() {
    Object.assign(searchForm, createSystemParamSearchForm())
    pagination.current = 1
    loadList()
  }

  // 按分组快速筛选参数
  function applyGroupFilter(groupCode: string) {
    searchForm.groupCode = groupCode
    pagination.current = 1
    loadList()
  }

  // 同步表格选中项
  function handleSelectionChange(rows: Api.Settings.SystemParamItem[]) {
    selectedRows.value = rows
  }

  // 切换分页大小
  function handleSizeChange(size: number) {
    pagination.size = size
    pagination.current = 1
    loadList()
  }

  // 切换当前页
  function handleCurrentChange(current: number) {
    pagination.current = current
    loadList()
  }

  // 重置弹窗表单
  function resetDialog() {
    currentId.value = undefined
    Object.assign(form, createSystemParamForm())
    dialogRef.value?.clearValidate()
  }

  /**
   * 打开新增或编辑弹窗，编辑时会先拉取参数详情回填表单。
   * @param mode 弹窗模式。
   * @param row 当前编辑行。
   */
  async function openDialog(mode: DialogMode, row?: Api.Settings.SystemParamItem) {
    dialogMode.value = mode
    dialogVisible.value = true
    resetDialog()

    if (mode === 'edit' && row) {
      currentId.value = row.id
      const detail = await fetchSystemParamDetail(row.id)
      Object.assign(form, {
        name: detail.name,
        key: detail.key,
        groupCode: detail.groupCode,
        groupName: detail.groupName,
        valueType: detail.valueType,
        value: detail.value,
        defaultValue: detail.defaultValue || '',
        optionsText: detail.options ? JSON.stringify(detail.options, null, 2) : '',
        sort: detail.sort,
        enabled: detail.enabled,
        builtIn: detail.builtIn,
        remark: detail.remark || ''
      })
    }
  }

  // 组装参数提交载荷
  function buildPayload(): Api.Settings.SystemParamPayload {
    return buildSystemParamPayload(form)
  }

  /**
   * 校验并提交参数表单，根据弹窗模式自动调用新增或更新接口。
   */
  async function handleSubmit() {
    const validateResult = dialogRef.value?.validate()
    if (!validateResult) return

    const valid = await validateResult.catch(() => false)
    if (!valid) return

    submitLoading.value = true
    try {
      const payload = buildPayload()
      if (dialogMode.value === 'add') {
        await fetchCreateSystemParam(payload)
      } else if (currentId.value) {
        await fetchUpdateSystemParam(currentId.value, payload)
      }
      dialogVisible.value = false
      await loadList()
    } catch (error) {
      console.error(error)
    } finally {
      submitLoading.value = false
    }
  }

  /**
   * 删除单个非内置参数。
   * @param row 待删除的参数行。
   */
  async function handleDelete(row: Api.Settings.SystemParamItem) {
    if (row.builtIn) {
      ElMessage.warning('内置参数不允许删除')
      return
    }

    await ElMessageBox.confirm(`确认删除参数“${row.name}”吗？`, '删除参数', {
      type: 'warning'
    })
    await fetchDeleteSystemParams([row.id])
    await loadList()
  }

  /**
   * 批量删除当前选中的参数。
   */
  async function handleBatchDelete() {
    if (!selectedRows.value.length) return

    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedRows.value.length} 项参数吗？内置参数不会被删除。`,
      '批量删除参数',
      { type: 'warning' }
    )
    await fetchDeleteSystemParams(selectedRows.value.map((item) => item.id))
    selectedRows.value = []
    await loadList()
  }

  /**
   * 刷新系统参数缓存并重新加载页面数据。
   */
  async function handleRefreshCache() {
    await fetchRefreshSystemParamCache()
    await loadList()
    ElMessage.success('刷新缓存成功')
  }

  onMounted(() => {
    loadList()
  })
</script>
