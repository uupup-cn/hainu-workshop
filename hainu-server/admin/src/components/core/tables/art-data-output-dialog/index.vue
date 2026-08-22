<template>
  <ElDialog
    v-model="visible"
    width="min(520px, calc(100vw - 32px))"
    centered
    append-to-body
    destroy-on-close
    align-center
    class="art-data-output-dialog flex h-[min(720px,calc(100vh_-_48px))] flex-col overflow-hidden"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="flex size-10.5 items-center justify-center rounded-lg bg-[var(--el-color-primary-light-9)] text-primary"
        >
          <ArtSvgIcon :icon="mode === 'print' ? 'ri:printer-line' : 'ri:file-excel-2-line'" />
        </div>
        <div>
          <h3 class="m-0 text-lg leading-[1.35] font-semibold text-g-900">{{ dialogTitle }}</h3>
          <p class="mb-0 text-[13px] text-g-500">
            {{ mode === 'print' ? '设置打印版式和字段范围' : '配置字段、格式和数据范围' }}
          </p>
        </div>
      </div>
    </template>

    <ElScrollbar height="100%" class="h-full min-w-0 overflow-x-hidden">
      <div class="pt-2 pr-4 pb-[22px] pl-0">
        <section class="min-w-0 overflow-x-hidden">
          <ElForm label-position="top" class="output-form">
            <ElFormItem :label="mode === 'print' ? '打印标题' : '文件名称'">
              <ElInput v-model="localFilename" maxlength="80" show-word-limit />
            </ElFormItem>

            <div class="grid grid-cols-1 gap-3 min-[561px]:grid-cols-2">
              <ElFormItem v-if="mode === 'export'" label="导出格式">
                <ElSelect v-model="format" class="w-full">
                  <ElOption label="Excel 工作簿（XLSX）" value="xlsx" />
                  <ElOption label="CSV 文本" value="csv" />
                  <ElOption label="JSON 数据" value="json" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem label="选择数据">
                <ElSelect v-model="scope" class="w-full">
                  <ElOption label="当前页数据" value="current" />
                  <ElOption label="选择的数据" value="selected" :disabled="!hasSelectableRows" />
                </ElSelect>
              </ElFormItem>

              <ElFormItem v-if="mode === 'print'" label="方向">
                <ElSelect v-model="printOrientation" class="w-full">
                  <ElOption label="纵向" value="portrait" />
                  <ElOption label="横向" value="landscape" />
                </ElSelect>
              </ElFormItem>
            </div>

            <div v-if="mode === 'export'" class="grid grid-cols-1 gap-3 min-[561px]:grid-cols-2">
              <ElFormItem label="工作表名称">
                <ElInput v-model="sheetName" maxlength="31" />
              </ElFormItem>
              <ElFormItem label="空值显示">
                <ElInput v-model="emptyText" placeholder="留空则导出空白" maxlength="12" />
              </ElFormItem>
            </div>

            <div v-if="mode === 'print'" class="grid grid-cols-1 gap-3 min-[561px]:grid-cols-2">
              <ElFormItem label="密度">
                <ElSelect v-model="printDensity" class="w-full">
                  <ElOption label="紧凑" value="compact" />
                  <ElOption label="标准" value="standard" />
                  <ElOption label="舒展" value="comfortable" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="字号">
                <ElInputNumber
                  v-model="printFontSize"
                  :min="10"
                  :max="16"
                  controls-position="right"
                  class="print-font-size-input w-full"
                />
              </ElFormItem>
            </div>
          </ElForm>

          <div
            class="advanced-options mb-3 grid grid-cols-1 gap-x-3.5 gap-y-2 rounded-lg border border-[var(--el-border-color-lighter)] bg-[var(--el-fill-color-lighter)] px-3 py-2.5 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3"
          >
            <template v-if="mode === 'export'">
              <ElCheckbox v-model="exportIncludeIndex">增加序号列</ElCheckbox>
              <ElCheckbox v-model="exportTrimText">去除文本首尾空格</ElCheckbox>
              <ElCheckbox v-model="exportAutoFilter" :disabled="format !== 'xlsx'"
                >启用表头筛选</ElCheckbox
              >
              <ElCheckbox v-model="includeMetaSheet" :disabled="format !== 'xlsx'"
                >附加导出说明</ElCheckbox
              >
              <ElCheckbox v-model="csvBom" :disabled="format !== 'csv'"
                >CSV 兼容 Excel 编码</ElCheckbox
              >
              <ElCheckbox v-model="prettyJson" :disabled="format !== 'json'"
                >JSON 格式化缩进</ElCheckbox
              >
            </template>
            <template v-else>
              <ElCheckbox v-model="printIncludeIndex">增加序号列</ElCheckbox>
              <ElCheckbox v-model="printShowMeta">打印统计信息</ElCheckbox>
              <ElCheckbox v-model="printZebra">打印斑马纹</ElCheckbox>
            </template>
          </div>

          <div
            class="mb-2 flex flex-col items-start justify-between rounded-lg border border-[var(--el-border-color-lighter)] bg-[var(--el-fill-color-lighter)] px-3 py-2.5 min-[561px]:flex-row min-[561px]:items-center"
          >
            <ElCheckbox v-model="allChecked" :indeterminate="isIndeterminate">
              全选字段
            </ElCheckbox>
            <div class="flex gap-2">
              <ElButton link type="primary" @click="checkVisibleColumns">仅显示列</ElButton>
              <ElButton link type="primary" @click="resetColumns">恢复默认</ElButton>
            </div>
          </div>

          <div
            class="overflow-x-hidden rounded-lg border border-[var(--el-border-color-lighter)] p-1"
          >
            <VueDraggable v-model="outputColumns" handle=".field-drag">
              <div
                v-for="column in outputColumns"
                :key="column.key"
                class="grid min-h-[42px] grid-cols-[28px_minmax(0,1fr)_120px] items-center gap-2 rounded-md px-2 py-[5px] transition-[background,opacity] duration-200 hover:bg-[var(--el-fill-color-lighter)]"
                :class="{ 'opacity-[0.54]': !column.checked }"
              >
                <button
                  class="field-drag flex h-[26px] w-[26px] cursor-grab items-center justify-center rounded-md border border-[var(--el-border-color-light)] bg-[var(--el-fill-color)] p-0 text-g-800 transition-[color,border-color,background] duration-200 hover:border-[var(--el-border-color)] hover:bg-[var(--el-fill-color-darker)] hover:text-g-900 active:cursor-grabbing active:bg-[var(--el-fill-color-dark)] active:text-g-900"
                  type="button"
                  aria-label="拖拽排序"
                >
                  <ArtSvgIcon icon="ri:draggable" />
                </button>
                <ElCheckbox v-model="column.checked" class="field-check min-w-0">
                  {{ column.label }}
                </ElCheckbox>
                <ElInputNumber
                  v-model="column.width"
                  :min="60"
                  :max="360"
                  :step="10"
                  controls-position="right"
                  size="small"
                  class="field-width-input !w-[120px] min-w-0"
                />
              </div>
            </VueDraggable>
          </div>
        </section>
      </div>
    </ElScrollbar>

    <template #footer>
      <div
        class="flex flex-col items-start justify-between gap-4 min-[561px]:flex-row min-[561px]:items-center"
      >
        <div class="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-g-500">
          <ArtSvgIcon icon="ri:information-line" />
          <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ actionHint }}</span>
        </div>
        <div class="flex flex-none gap-3">
          <ElButton @click="visible = false">取消</ElButton>
          <ElButton
            type="primary"
            :loading="processing"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            {{ mode === 'print' ? '确认打印' : '确认导出' }}
          </ElButton>
        </div>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { VueDraggable } from 'vue-draggable-plus'
  import type { ColumnOption } from '@/types/component'
  import {
    exportTableData,
    extractRowsFromCurrentTable,
    extractRowsFromSelectedTable,
    normalizeOutputColumns,
    printTableData,
    type DataOutputColumn,
    type DataOutputFormat,
    type DataOutputMode,
    type DataOutputProvider,
    type DataOutputScope,
    type DataPrintOptions
  } from '../art-table-header/data-output'

  defineOptions({ name: 'ArtDataOutputDialog' })

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      mode: DataOutputMode
      columns: ColumnOption[]
      data?: Record<string, any>[]
      selectedData?: Record<string, any>[]
      dataProvider?: DataOutputProvider
      title?: string
      filename?: string
      fallbackContainer?: HTMLElement | null
    }>(),
    {
      data: () => [],
      selectedData: () => [],
      title: '表格数据',
      filename: '导出数据',
      fallbackContainer: null
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'success', payload: { mode: DataOutputMode; count: number }): void
  }>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const outputColumns = ref<DataOutputColumn[]>([])
  const localFilename = ref('')
  const format = ref<DataOutputFormat>('xlsx')
  const scope = ref<DataOutputScope>('current')
  const processing = ref(false)
  const sheetName = ref('数据')
  const emptyText = ref('')
  const exportIncludeIndex = ref(false)
  const exportAutoFilter = ref(true)
  const csvBom = ref(true)
  const prettyJson = ref(true)
  const includeMetaSheet = ref(true)
  const exportTrimText = ref(true)
  const printOrientation = ref<DataPrintOptions['orientation']>('portrait')
  const printDensity = ref<DataPrintOptions['density']>('standard')
  const printFontSize = ref(12)
  const printIncludeIndex = ref(false)
  const printShowMeta = ref(true)
  const printZebra = ref(true)

  const dialogTitle = computed(() => (props.mode === 'print' ? '打印数据' : '导出数据'))
  const selectedColumns = computed(() => outputColumns.value.filter((column) => column.checked))
  const checkedCount = computed(() => selectedColumns.value.length)
  const canSubmit = computed(() => checkedCount.value > 0 && !processing.value)
  const hasSelectionColumn = computed(() =>
    props.columns.some((column) => column.type === 'selection')
  )
  const hasSelectableRows = computed(
    () => hasSelectionColumn.value || props.selectedData.length > 0
  )
  const actionHint = computed(() =>
    props.mode === 'print'
      ? '将按当前字段顺序生成浏览器打印任务'
      : '导出文件会保留字段顺序、列宽和基础筛选表头'
  )

  const allChecked = computed({
    get: () => outputColumns.value.length > 0 && checkedCount.value === outputColumns.value.length,
    set: (value: boolean) => {
      outputColumns.value.forEach((column) => {
        column.checked = value
      })
    }
  })

  const isIndeterminate = computed(
    () => checkedCount.value > 0 && checkedCount.value < outputColumns.value.length
  )

  /**
   * 根据传入文件名前缀生成带时间戳的默认文件名，避免连续导出时文件名冲突。
   */
  const createDefaultFilename = () => {
    const timestamp = new Date()
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      .replace(/[^\d]/g, '')

    return `${props.filename}_${timestamp}`
  }

  /**
   * 读取当前页数据；未显式传入 data 时，从当前表格 DOM 中兜底提取可见行。
   */
  const loadCurrentRows = () => {
    if (props.data?.length) return [...props.data]
    return extractRowsFromCurrentTable(props.fallbackContainer, outputColumns.value)
  }

  /**
   * 根据当前表格列配置重置可输出字段列表。
   */
  const resetColumns = () => {
    outputColumns.value = normalizeOutputColumns(props.columns)
  }

  /**
   * 仅勾选当前表格中可见且未被列设置关闭的字段。
   */
  const checkVisibleColumns = () => {
    outputColumns.value.forEach((column) => {
      column.checked = column.source.visible !== false && column.source.checked !== false
    })
  }

  /**
   * 根据选择的数据范围解析待处理数据，选择数据优先使用页面传入的勾选行。
   */
  const resolveRows = async () => {
    if (scope.value === 'selected') {
      if (props.selectedData.length) return [...props.selectedData]
      return extractRowsFromSelectedTable(props.fallbackContainer, outputColumns.value, props.data)
    }

    if (props.dataProvider && !props.data?.length) {
      return await props.dataProvider('current')
    }

    return loadCurrentRows()
  }

  /**
   * 校验字段选择并执行打印或导出任务。
   */
  const handleSubmit = async () => {
    if (!canSubmit.value) return

    processing.value = true

    try {
      const rows = await resolveRows()
      if (!rows.length) {
        ElMessage.warning(scope.value === 'selected' ? '请先选择要处理的数据' : '暂无可处理的数据')
        return
      }

      const payload = {
        columns: selectedColumns.value,
        rows,
        title: localFilename.value,
        filename: localFilename.value,
        format: format.value,
        exportOptions: {
          sheetName: sheetName.value,
          includeIndex: exportIncludeIndex.value,
          autoFilter: exportAutoFilter.value,
          emptyText: emptyText.value,
          prettyJson: prettyJson.value,
          csvBom: csvBom.value,
          includeMetaSheet: includeMetaSheet.value,
          trimText: exportTrimText.value
        },
        printOptions: {
          orientation: printOrientation.value,
          density: printDensity.value,
          fontSize: printFontSize.value,
          includeIndex: printIncludeIndex.value,
          showMeta: printShowMeta.value,
          zebra: printZebra.value,
          emptyText: emptyText.value
        }
      }

      if (props.mode === 'print') {
        printTableData(payload)
        ElMessage.success(`已生成打印任务，共 ${rows.length} 条`)
      } else {
        exportTableData(payload)
        ElMessage.success(`导出成功，共 ${rows.length} 条`)
      }

      emit('success', { mode: props.mode, count: rows.length })
      visible.value = false
    } catch (error) {
      ElMessage.error((error as Error).message || '处理失败')
    } finally {
      processing.value = false
    }
  }

  watch(
    () => visible.value,
    (value) => {
      if (!value) return
      localFilename.value = props.mode === 'print' ? props.title : createDefaultFilename()
      format.value = 'xlsx'
      scope.value = 'current'
      sheetName.value = props.title || '数据'
      emptyText.value = ''
      exportIncludeIndex.value = false
      exportAutoFilter.value = true
      csvBom.value = true
      prettyJson.value = true
      includeMetaSheet.value = true
      exportTrimText.value = true
      printOrientation.value = 'portrait'
      printDensity.value = 'standard'
      printFontSize.value = 12
      printIncludeIndex.value = false
      printShowMeta.value = true
      printZebra.value = true
      resetColumns()
    }
  )
</script>

<style scoped>
  :global(.art-data-output-dialog .el-dialog__header) {
    flex: 0 0 auto;
    padding: 20px 0;
    margin-right: 0;
  }

  :global(.art-data-output-dialog .el-dialog__body) {
    padding: 0 !important;
    overflow: hidden;
  }

  :global(.art-data-output-dialog .el-dialog__footer) {
    flex: 0 0 auto;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .output-form :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  .output-form :deep(.el-form-item__content) {
    width: 100%;
  }

  .print-font-size-input {
    width: 100%;
  }

  .print-font-size-input :deep(.el-input) {
    width: 100%;
  }

  .advanced-options :deep(.el-checkbox) {
    min-width: 0;
    margin-right: 0;
  }

  .advanced-options :deep(.el-checkbox__label) {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .field-check :deep(.el-checkbox__label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
</style>
