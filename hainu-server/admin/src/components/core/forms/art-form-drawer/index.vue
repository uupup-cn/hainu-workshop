<!--
  ArtFormDrawer
  统一抽屉容器组件，封装：
    - 三档宽度（SM=480 / MD=720 / LG=960）
    - loading 遮罩 ≥300ms 的最小展示时长（防闪烁）
    - 关闭前 dirty 比对二次确认（提交失败保留输入）
    - markSaved() / reset(values?) 暴露方法
    - default / footer / extra 三个 slot
    - 与 ArtPageHero / ArtTable / ArtTableHeader 视觉风格保持一致

  调用方使用范式：
    通过 inject 'artFormDrawerValues' 让组件跟踪当前表单值用于 dirty 比较，
    在请求成功后调用 markSaved() 自动派发 saved 事件并关闭抽屉，
    请求失败时不调用 markSaved()，抽屉保持打开、输入完整保留。
-->
<template>
  <ElDrawer
    v-model="visible"
    :size="resolvedWidth"
    :before-close="handleBeforeClose"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    direction="rtl"
    class="art-form-drawer"
  >
    <template #header>
      <div class="art-form-drawer__header">
        <span class="art-form-drawer__title">{{ title }}</span>
        <div v-if="$slots.extra" class="art-form-drawer__extra">
          <slot name="extra" />
        </div>
      </div>
    </template>

    <ElScrollbar v-loading="showLoadingMask" class="art-form-drawer__scrollbar">
      <div class="art-form-drawer__body">
        <slot />
      </div>
    </ElScrollbar>

    <template v-if="showFooter" #footer>
      <div class="art-form-drawer__footer">
        <slot
          name="footer"
          :submit="emitSave"
          :cancel="handleCancel"
          :loading="loading"
          :disabled="disabled"
        >
          <ElButton :disabled="loading" @click="handleCancel">
            {{ cancelText ?? defaultCancelText }}
          </ElButton>
          <ElButton type="primary" :loading="loading" :disabled="disabled" @click="emitSave">
            {{ submitText ?? defaultSubmitText }}
          </ElButton>
        </slot>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { ElButton, ElDrawer, ElMessageBox, ElScrollbar } from 'element-plus'
  import type { Ref } from 'vue'
  import { ART_FORM_DRAWER_SIZES, LOADING_MIN_DURATION, type ArtFormDrawerSize } from './constants'

  defineOptions({ name: 'ArtFormDrawer' })

  interface Props {
    /** v-model 控制 visible */
    modelValue: boolean
    /** 抽屉标题 */
    title: string
    /** 宽度档位（SM=480 / MD=720 / LG=960），默认 MD */
    size?: ArtFormDrawerSize
    /** 提交中（受控），用于触发 loading 遮罩与按钮 loading */
    loading?: boolean
    /** 只读模式（详情查看），主操作按钮禁用 */
    disabled?: boolean
    /** 用于 dirty 跟踪与重置的基线值；不传则不参与 dirty 比较 */
    initialValues?: unknown
    /** 关闭前是否二次确认（仅当存在 dirty 时弹出），默认 true */
    confirmOnClose?: boolean
    /** 是否显示底部操作区，默认 true */
    showFooter?: boolean
    /** 关闭时是否销毁内部状态，默认 true */
    destroyOnClose?: boolean
    /** 自定义提交按钮文案 */
    submitText?: string
    /** 自定义取消按钮文案 */
    cancelText?: string
    /** 自定义关闭确认提示语 */
    confirmCloseMessage?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'close'): void
    (e: 'save'): void
    (e: 'saved'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'MD',
    loading: false,
    disabled: false,
    initialValues: undefined,
    confirmOnClose: true,
    showFooter: true,
    destroyOnClose: true,
    submitText: undefined,
    cancelText: undefined,
    confirmCloseMessage: undefined
  })

  const emit = defineEmits<Emits>()

  /** 默认按钮和确认文案：组件内固定中文，不接入多语言。 */
  const defaultSubmitText = '保存'
  const defaultCancelText = '取消'
  const defaultConfirmMessage = '当前修改尚未保存，确定要关闭吗？'
  const defaultConfirmTitle = '关闭确认'
  const defaultDiscardText = '放弃修改'
  const defaultKeepEditingText = '继续编辑'

  /** v-model 双向绑定 */
  const visible = useVModel(props, 'modelValue', emit)

  /** 宽度档位映射为像素值 */
  const resolvedWidth = computed(() => ART_FORM_DRAWER_SIZES[props.size])

  /** loading 遮罩可见态（独立于 props.loading，用于实现最小展示时长） */
  const showLoadingMask = ref(false)
  let pendingHideTimer: ReturnType<typeof setTimeout> | null = null
  let lastShowAt = 0

  watch(
    () => props.loading,
    (val) => {
      if (val) {
        // 立刻显示 loading；记录展示开始时间，便于在关闭时计算补足时长。
        if (pendingHideTimer) {
          clearTimeout(pendingHideTimer)
          pendingHideTimer = null
        }
        showLoadingMask.value = true
        lastShowAt = Date.now()
      } else if (showLoadingMask.value) {
        // 关闭时若已展示不足 LOADING_MIN_DURATION，则补足剩余时长后再隐藏。
        const elapsed = Date.now() - lastShowAt
        const remaining = Math.max(0, LOADING_MIN_DURATION - elapsed)
        if (pendingHideTimer) {
          clearTimeout(pendingHideTimer)
        }
        pendingHideTimer = setTimeout(() => {
          showLoadingMask.value = false
          pendingHideTimer = null
        }, remaining)
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (pendingHideTimer) {
      clearTimeout(pendingHideTimer)
      pendingHideTimer = null
    }
  })

  /** dirty 跟踪基线，调用方通过 props.initialValues 或 reset() 设定 */
  const baseline = ref<unknown>(cloneValue(props.initialValues))

  // 调用方约定通过 provide('artFormDrawerValues', toRef(form)) 注入当前表单值。
  const currentValues = inject<Ref<unknown> | null>('artFormDrawerValues', null)

  watch(
    () => props.initialValues,
    (val) => {
      // 调用方传入新基线时同步刷新（例如：编辑场景在打开抽屉时填充表单）。
      baseline.value = cloneValue(val)
    }
  )

  /** 当前是否处于 dirty 状态（基线与当前值发生变化） */
  const isDirty = computed(() => {
    if (baseline.value === undefined || baseline.value === null) return false
    if (!currentValues || currentValues.value === undefined || currentValues.value === null) {
      return false
    }
    return !deepEqual(baseline.value, currentValues.value)
  })

  /** 关闭前钩子：dirty 时弹出二次确认，提交失败保留输入 */
  async function handleBeforeClose(done: () => void): Promise<void> {
    // 提交进行中不允许通过点击遮罩 / ESC 关闭，避免请求中误关。
    if (props.loading) {
      return
    }

    if (!props.confirmOnClose || !isDirty.value) {
      done()
      emit('close')
      return
    }

    try {
      await ElMessageBox.confirm(
        props.confirmCloseMessage ?? defaultConfirmMessage,
        defaultConfirmTitle,
        {
          type: 'warning',
          confirmButtonText: defaultDiscardText,
          cancelButtonText: defaultKeepEditingText
        }
      )
      done()
      emit('close')
    } catch {
      // 用户选择继续编辑，保留输入。
    }
  }

  /** 触发保存事件，由调用方完成请求，再回调 markSaved() */
  function emitSave(): void {
    if (props.loading || props.disabled) return
    emit('save')
  }

  /** 取消按钮：等同点击关闭，会走 handleBeforeClose 流程 */
  function handleCancel(): void {
    visible.value = false
  }

  /**
   * 调用方在请求成功后调用：
   *   1. 将基线置为最新表单值（清 dirty）
   *   2. 派发 saved 事件
   *   3. 关闭抽屉
   */
  function markSaved(): void {
    if (currentValues && currentValues.value !== undefined) {
      baseline.value = cloneValue(currentValues.value)
    }
    emit('saved')
    visible.value = false
    emit('close')
  }

  /**
   * 重置基线值，用于编辑场景在初始化数据到位后将其作为 dirty 比对的基线。
   * 不传参时清空基线（即不再触发 dirty 比对）。
   */
  function reset(values?: unknown): void {
    baseline.value = values === undefined ? null : cloneValue(values)
  }

  defineExpose({ markSaved, reset })

  /**
   * 简易深拷贝：避免引入 lodash，数组 / 普通对象足够覆盖表单 v-model 场景；
   * 对 Date / Map / Set 等复杂结构按引用 fallback。
   */
  function cloneValue<T>(value: T): T {
    if (value === null || value === undefined) return value
    if (typeof value !== 'object') return value
    if (value instanceof Date) return new Date(value.getTime()) as unknown as T
    if (Array.isArray(value)) return value.map((item) => cloneValue(item)) as unknown as T
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = cloneValue((value as Record<string, unknown>)[key])
    }
    return result as T
  }

  /**
   * 简易深比较：覆盖原始类型 / 数组 / 普通对象 / Date；
   * 不引入 lodash 是为了控制 ArtFormDrawer 的零额外依赖。
   */
  function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true
    if (a === null || b === null || a === undefined || b === undefined) return false
    if (typeof a !== 'object' || typeof b !== 'object') return false
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()

    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false
      }
      return true
    }

    const aKeys = Object.keys(a as Record<string, unknown>)
    const bKeys = Object.keys(b as Record<string, unknown>)
    if (aKeys.length !== bKeys.length) return false
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false
      }
    }
    return true
  }
</script>

<style scoped>
  .art-form-drawer :deep(.el-drawer__body) {
    min-height: 0;
    padding: 0;
    overflow: hidden;
  }

  .art-form-drawer :deep(.el-drawer__footer) {
    padding: 12px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .art-form-drawer__header {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .art-form-drawer__title {
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  .art-form-drawer__extra {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .art-form-drawer__scrollbar {
    height: 100%;
  }

  .art-form-drawer__scrollbar :deep(.el-scrollbar__view) {
    min-height: 100%;
  }

  .art-form-drawer__body {
    min-height: 120px;
    padding: 16px 20px;
  }

  .art-form-drawer__footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  /* 移动端适配：抽屉宽度按 100vw 自动收敛 */
  @media (width < 768px) {
    :global(.el-drawer.art-form-drawer) {
      width: 100% !important;
      max-width: 100% !important;
    }

    :global(.el-drawer.art-form-drawer .el-drawer__header) {
      padding: 16px 16px 12px;
      margin-bottom: 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :global(.el-drawer.art-form-drawer .el-drawer__close-btn) {
      width: 40px;
      height: 40px;
    }

    :global(.el-drawer.art-form-drawer .el-drawer__footer) {
      padding: 12px 16px max(12px, env(safe-area-inset-bottom));
    }

    :global(.el-drawer.art-form-drawer .el-button + .el-button) {
      margin-left: 0;
    }

    :global(.el-drawer.art-form-drawer .el-form-item) {
      display: block;
    }

    :global(.el-drawer.art-form-drawer .el-form-item__label) {
      display: block;
      width: 100% !important;
      height: auto;
      margin-bottom: 6px;
      line-height: 20px;
      text-align: left;
    }

    :global(.el-drawer.art-form-drawer .el-form-item__content) {
      min-width: 0;
      margin-left: 0 !important;
    }

    :global(.el-drawer.art-form-drawer .el-input),
    :global(.el-drawer.art-form-drawer .el-input-number),
    :global(.el-drawer.art-form-drawer .el-select),
    :global(.el-drawer.art-form-drawer .el-date-editor),
    :global(.el-drawer.art-form-drawer .el-cascader),
    :global(.el-drawer.art-form-drawer .el-textarea) {
      width: 100%;
    }

    :global(.el-drawer.art-form-drawer .el-descriptions__body) {
      overflow-x: auto;
    }

    .art-form-drawer__header {
      min-width: 0;
    }

    .art-form-drawer__title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .art-form-drawer__body {
      padding: 14px 16px;
    }

    .art-form-drawer__footer {
      flex-direction: column-reverse;
      align-items: stretch;
      width: 100%;
    }

    .art-form-drawer__footer :deep(.el-button) {
      width: 100%;
    }
  }
</style>
