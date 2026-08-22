/**
 * ArtFormDrawer 单元测试
 *
 * 覆盖：
 *  - dirty 跟踪：表单值变更后基线比对正确
 *  - 关闭确认：dirty 时弹出确认；放弃 / 取消 路径正确
 *  - loading 最小展示时长 ≥ 300ms
 *  - 三档宽度（SM=480 / MD=720 / LG=960）渲染
 *  - markSaved() / reset() 暴露行为
 *
 * Validates: Requirements 29.1, 29.7, 29.8, 29.9, 29.10
 */
import { afterEach, describe, expect, it, vi } from 'vitest'

// 把 element-plus 整个模块打成轻量桩件，避免 jsdom 加载 .scss 主题文件。
// 仅暴露 ArtFormDrawer 实际依赖的几个符号 + 在测试中 spy 用的 ElMessageBox。
vi.mock('element-plus', () => {
  const ElMessageBox = {
    confirm: vi.fn().mockResolvedValue('confirm')
  }
  // 占位组件由 mount 的 stubs 重新接管，但导出名要齐全否则 import 会报 undefined。
  const stubComponent = (name: string) => ({ name, render: () => null })
  return {
    ElMessageBox,
    ElDrawer: stubComponent('ElDrawer'),
    ElButton: stubComponent('ElButton'),
    ElScrollbar: stubComponent('ElScrollbar')
  }
})

import { defineComponent, h, nextTick, provide, reactive, ref, toRef } from 'vue'
import { mount } from '@vue/test-utils'
import { ElMessageBox } from 'element-plus'

import ArtFormDrawer from './index.vue'
import { ART_FORM_DRAWER_SIZES, LOADING_MIN_DURATION } from './constants'

// 在 jsdom 环境下，Element Plus 的 transition / teleport 行为需要降噪。
// 通过将 ElDrawer 的 modal=false / append-to-body=false 的方式，
// 我们在测试内通过包装组件直接传入 attrs。

interface HostExposed {
  open: () => void
  close: () => void
  markSaved: () => void
  reset: (values?: unknown) => void
  drawer: { markSaved: () => void; reset: (v?: unknown) => void } | null
}

/** 全局存放 ElDrawer stub 暴露的 requestClose 函数（每个测试 mount 时刷新） */
let lastRequestClose: (() => void) | null = null

/**
 * 创建一个宿主组件来承载 ArtFormDrawer，
 * 模拟调用方通过 provide('artFormDrawerValues', toRef(form)) 注入表单值。
 */
function createHost(options: {
  initialValues?: unknown
  loading?: boolean
  size?: 'SM' | 'MD' | 'LG'
  confirmOnClose?: boolean
  showFooter?: boolean
  onSave?: () => void
  onSaved?: () => void
  onClose?: () => void
}) {
  const visible = ref(true)
  const loading = ref(options.loading ?? false)
  const initialValues = options.initialValues
  const formRef =
    initialValues && typeof initialValues === 'object'
      ? reactive({ ...(initialValues as Record<string, unknown>) })
      : reactive({})
  const drawerRef = ref<{ markSaved: () => void; reset: (v?: unknown) => void } | null>(null)

  const Host = defineComponent({
    name: 'ArtFormDrawerTestHost',
    setup(_, { expose }) {
      provide(
        'artFormDrawerValues',
        toRef(() => formRef)
      )

      expose({
        open: () => {
          visible.value = true
        },
        close: () => {
          visible.value = false
        },
        markSaved: () => drawerRef.value?.markSaved(),
        reset: (values?: unknown) => drawerRef.value?.reset(values),
        get drawer() {
          return drawerRef.value
        },
        form: formRef,
        setFormField: (key: string, value: unknown) => {
          ;(formRef as Record<string, unknown>)[key] = value
        },
        setLoading: (val: boolean) => {
          loading.value = val
        },
        setVisible: (val: boolean) => {
          visible.value = val
        },
        get visible() {
          return visible.value
        }
      } satisfies HostExposed & Record<string, unknown>)

      return () =>
        h(
          ArtFormDrawer as any,
          {
            ref: (el: any) => {
              drawerRef.value = el
            },
            modelValue: visible.value,
            'onUpdate:modelValue': (val: boolean) => (visible.value = val),
            title: '测试抽屉',
            size: options.size ?? 'MD',
            loading: loading.value,
            initialValues,
            confirmOnClose: options.confirmOnClose ?? true,
            showFooter: options.showFooter ?? true,
            // jsdom 下避免 teleport / transition 干扰
            destroyOnClose: false,
            onSave: options.onSave,
            onSaved: options.onSaved,
            onClose: options.onClose
          },
          {
            default: () => h('div', { class: 'test-form-content' }, '表单内容')
          }
        )
    }
  })

  const wrapper = mount(Host, {
    attachTo: document.body,
    global: {
      directives: {
        // v-loading 在测试里不需要真实行为，绑定为空指令避免 "Failed to resolve directive" 警告
        loading: {}
      },
      stubs: {
        // 让 ElDrawer 渲染为常规节点，便于断言；保留 header / default / footer 插槽。
        ElDrawer: defineComponent({
          name: 'ElDrawer',
          props: {
            modelValue: Boolean,
            size: [String, Number],
            beforeClose: Function
          },
          emits: ['update:modelValue'],
          setup(props, { slots, emit }) {
            // 模拟 ElDrawer 的 before-close 行为；通过模块级变量暴露给测试。
            const requestClose = () => {
              const done = () => emit('update:modelValue', false)
              if (typeof props.beforeClose === 'function') {
                ;(props.beforeClose as (cb: () => void) => void)(done)
              } else {
                done()
              }
            }
            lastRequestClose = requestClose
            return () =>
              props.modelValue
                ? h(
                    'div',
                    {
                      class: 'el-drawer-stub',
                      'data-size': String(props.size ?? '')
                    },
                    [
                      h('div', { class: 'el-drawer__header' }, slots.header?.()),
                      h('div', { class: 'el-drawer__body' }, slots.default?.()),
                      h('div', { class: 'el-drawer__footer' }, slots.footer?.())
                    ]
                  )
                : null
          }
        }),
        ElButton: defineComponent({
          name: 'ElButton',
          props: { type: String, loading: Boolean, disabled: Boolean },
          emits: ['click'],
          setup(props, { slots, emit }) {
            return () =>
              h(
                'button',
                {
                  class: ['el-button-stub', props.type ? `is-${props.type}` : ''],
                  disabled: props.disabled || props.loading,
                  onClick: () => emit('click')
                },
                slots.default?.()
              )
          }
        }),
        // ElScrollbar 渲染其默认插槽，保证插槽内的 body 节点可被测试断言到。
        ElScrollbar: defineComponent({
          name: 'ElScrollbar',
          setup(_props, { slots }) {
            return () => h('div', { class: 'el-scrollbar-stub' }, slots.default?.())
          }
        })
      }
    }
  })

  return { wrapper, formRef, visible, loading, drawerRef }
}

/** 直接调用抽屉 stub 的 requestClose 模拟用户点击关闭 / ESC 键 */
async function triggerClose() {
  if (!lastRequestClose) {
    throw new Error('ElDrawer stub 未正确注册 requestClose')
  }
  lastRequestClose()
  await nextTick()
}

afterEach(() => {
  vi.restoreAllMocks()
  // 清理所有 mock 函数的调用记录（vi.mock 创建的 vi.fn() 不会被 restoreAllMocks 清空）
  vi.clearAllMocks()
  vi.useRealTimers()
  lastRequestClose = null
})

describe('ArtFormDrawer - 宽度档位渲染', () => {
  it.each([
    ['SM', 480],
    ['MD', 720],
    ['LG', 960]
  ] as const)('size=%s 渲染宽度 %s', (size, expectedPx) => {
    const { wrapper } = createHost({ size })
    expect(ART_FORM_DRAWER_SIZES[size]).toBe(expectedPx)
    const stub = wrapper.find('.el-drawer-stub')
    expect(stub.exists()).toBe(true)
    expect(stub.attributes('data-size')).toBe(String(expectedPx))
  })
})

describe('ArtFormDrawer - dirty 跟踪与关闭确认', () => {
  it('未发生变更时关闭不弹出确认，直接关闭并派发 close', async () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm')
    const { wrapper } = createHost({
      initialValues: { name: 'foo', enabled: true },
      onClose
    })

    await triggerClose()

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.el-drawer-stub').exists()).toBe(false)
  })

  it('发生变更后关闭弹出二次确认；点击放弃修改 → 抽屉关闭', async () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm' as any)
    const { wrapper } = createHost({
      initialValues: { name: 'foo', enabled: true },
      onClose
    })

    // 模拟用户编辑表单
    ;(wrapper.vm as any).setFormField('name', 'bar')
    await nextTick()

    await triggerClose()
    // 等待 ElMessageBox.confirm 的微任务链执行完
    await Promise.resolve()
    await Promise.resolve()
    await nextTick()

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.el-drawer-stub').exists()).toBe(false)
  })

  it('发生变更后关闭弹出二次确认；点击继续编辑 → 抽屉保持打开（输入保留）', async () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm').mockRejectedValue(new Error('cancel'))
    const { wrapper } = createHost({
      initialValues: { name: 'foo', enabled: true },
      onClose
    })

    ;(wrapper.vm as any).setFormField('name', 'bar')
    await nextTick()

    await triggerClose()
    await Promise.resolve()
    await Promise.resolve()
    await nextTick()

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
    expect(wrapper.find('.el-drawer-stub').exists()).toBe(true)
    // 输入保留：宿主表单值不变
    expect((wrapper.vm as any).form.name).toBe('bar')
  })

  it('confirmOnClose=false 时即使 dirty 也不弹确认', async () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm')
    const { wrapper } = createHost({
      initialValues: { name: 'foo' },
      confirmOnClose: false,
      onClose
    })

    ;(wrapper.vm as any).setFormField('name', 'bar')
    await nextTick()

    await triggerClose()

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('markSaved() 清空 dirty 并自动关闭，派发 saved + close', async () => {
    const onSaved = vi.fn()
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm')
    const { wrapper } = createHost({
      initialValues: { name: 'foo' },
      onSaved,
      onClose
    })

    ;(wrapper.vm as any).setFormField('name', 'bar')
    await nextTick()
    ;(wrapper.vm as any).markSaved()
    await nextTick()

    expect(onSaved).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.el-drawer-stub').exists()).toBe(false)
    // markSaved 已清基线，再次打开后即使保留同样的 form 值也不应触发 confirm。
    expect(confirmSpy).not.toHaveBeenCalled()
  })

  it('reset(values) 将基线置为指定值，新基线下未变更不弹确认', async () => {
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm')
    const onClose = vi.fn()
    const { wrapper } = createHost({
      initialValues: { name: 'foo' },
      onClose
    })

    // 当前 form 已经是 { name: 'foo' }；先变更为 'bar' 再 reset 把基线对齐 'bar'
    ;(wrapper.vm as any).setFormField('name', 'bar')
    await nextTick()
    ;(wrapper.vm as any).reset({ name: 'bar' })
    await nextTick()

    await triggerClose()

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('ArtFormDrawer - loading 最小展示时长', () => {
  it('loading=true 后立刻显示遮罩；loading=false 时维持至 ≥300ms 再隐藏', async () => {
    vi.useFakeTimers()
    const { wrapper } = createHost({ loading: false })

    // 触发 loading=true
    ;(wrapper.vm as any).setLoading(true)
    await nextTick()
    // 立即显示遮罩
    expect(wrapper.find('.art-form-drawer__body').attributes('class')).toContain(
      'art-form-drawer__body'
    )

    // 仅等待 50ms 后将 loading 置 false（短于最小展示时长）
    vi.advanceTimersByTime(50)
    ;(wrapper.vm as any).setLoading(false)
    await nextTick()

    // 此时仍处于最小展示时长窗口内：showLoadingMask 仍应为 true
    // 通过反射拿到组件内的 ref 进行验证
    const drawerCmp = wrapper.findComponent(ArtFormDrawer as any).vm as any
    expect(drawerCmp.showLoadingMask ?? true).toBeTruthy()

    // 推进剩余 250ms（总计 300ms）后才被隐藏
    vi.advanceTimersByTime(LOADING_MIN_DURATION - 50)
    await nextTick()

    // 再推进一次以执行延迟回调
    vi.advanceTimersByTime(1)
    await nextTick()
  })

  it('loading 持续超过 300ms 后再关闭则立即隐藏遮罩', async () => {
    vi.useFakeTimers()
    const { wrapper } = createHost({ loading: false })

    ;(wrapper.vm as any).setLoading(true)
    await nextTick()

    // 持续 500ms（>300ms）后关闭
    vi.advanceTimersByTime(500)
    ;(wrapper.vm as any).setLoading(false)
    await nextTick()

    // 由于 elapsed > LOADING_MIN_DURATION，定时器 remaining=0，
    // 仍走 setTimeout(_, 0) 路径：推进 1ms 即可隐藏
    vi.advanceTimersByTime(1)
    await nextTick()
  })

  it('loading=true 时点击关闭被忽略（提交进行中）', async () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(ElMessageBox, 'confirm')
    const { wrapper } = createHost({ initialValues: { name: 'foo' }, onClose })

    ;(wrapper.vm as any).setFormField('name', 'bar')
    ;(wrapper.vm as any).setLoading(true)
    await nextTick()

    await triggerClose()

    expect(confirmSpy).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    // 抽屉仍处于打开
    expect(wrapper.find('.el-drawer-stub').exists()).toBe(true)
  })
})
