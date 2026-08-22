<template>
  <ElDrawer
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    :size="drawerSize"
    class="menu-drawer"
    @closed="handleClosed"
    destroy-on-close
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="width > 640 ? 12 : 24"
      :gutter="isMobileLayout ? 14 : 20"
      :label-position="isMobileLayout ? 'top' : 'right'"
      :label-width="isMobileLayout ? 'auto' : '100px'"
      :show-reset="false"
      :show-submit="false"
    >
      <template #menuType>
        <div class="flex w-full flex-col items-start gap-2">
          <ElRadioGroup
            v-model="form.menuType"
            :disabled="disableMenuType"
            :size="actionButtonSize"
            class="menu-type-group"
          >
            <ElRadioButton
              v-for="item in menuTypeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.value"
              :disabled="item.disabled"
            >
              {{ item.label }}
            </ElRadioButton>
          </ElRadioGroup>
          <p
            v-if="typeChangeHint"
            class="w-full text-xs leading-5 text-[var(--el-text-color-secondary)]"
          >
            {{ typeChangeHint }}
          </p>
        </div>
      </template>

      <template #icon>
        <ArtIconPicker v-model="form.icon" placeholder="如：ri:user-line" />
      </template>
    </ArtForm>

    <section v-if="toggleItems.length" class="px-5 pb-3 sm:px-7">
      <ElDivider content-position="center"> 其他设置 </ElDivider>
      <div class="grid grid-cols-1 gap-x-7 gap-y-3.5 sm:grid-cols-2">
        <div v-for="item in toggleItems" :key="String(item.key)" class="flex min-h-8 items-center">
          <span class="mr-3 min-w-24 text-sm text-[var(--el-text-color-regular)]">
            {{ item.label }}
          </span>
          <ElSwitch v-model="form[item.key]" />
        </div>
      </div>
    </section>

    <template #footer>
      <span class="drawer-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import { ElIcon, ElTooltip } from 'element-plus'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'
  import ArtIconPicker from '@/components/core/forms/art-icon-picker/index.vue'
  import { useWindowSize } from '@vueuse/core'
  import {
    IFRAME_ROUTE_PREFIX,
    IFRAME_ROUTE_REGEXP,
    buildMenuEditFormData,
    createDefaultMenuFormData,
    hasMenuChildren,
    menuTypeLabelMap,
    resolveMenuKind,
    syncMenuFormByType,
    type MenuEditState,
    type MenuFormData,
    type MenuKind,
    type MenuOption
  } from '../menu.shared'

  const { width } = useWindowSize()

  /**
   * 创建带 tooltip 的表单标签
   * @param label 标签文本
   * @param tooltip 提示文本
   * @returns 渲染函数
   */
  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(
          ElTooltip,
          {
            content: tooltip,
            placement: 'top'
          },
          () => h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ])
  }

  /**
   * 根据屏幕宽度返回纯文本标签或带提示的标签渲染函数。
   */
  const createResponsiveLabel = (label: string, tooltip: string) => {
    return isMobileLayout.value ? label : createLabelTooltip(label, tooltip)
  }

  const sortTooltipText = '按升序排列，数字越小越靠前'

  interface Props {
    visible: boolean
    editData?: MenuEditState | null
    menuOptions?: MenuOption[]
    type?: MenuKind
    lockType?: boolean
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: MenuFormData, done: (success: boolean) => void): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'directory',
    lockType: false
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()

  /**
   * 判断当前弹窗是否处于编辑模式。
   */
  const isEditMode = computed(() => {
    const data = props.editData
    if (!data) return false

    if (typeof data.id === 'number' && data.id > 0) {
      return true
    }

    return Boolean(data.authMark && data.title)
  })

  const form = reactive<MenuFormData>(createDefaultMenuFormData())

  /**
   * 判断当前是否为按钮权限类型。
   */
  const isButtonType = computed(() => form.menuType === 'button')

  /**
   * 判断当前是否为目录类型。
   */
  const isDirectoryType = computed(() => form.menuType === 'directory')

  /**
   * 判断当前是否为页面菜单类型。
   */
  const isMenuPageType = computed(() => form.menuType === 'menu')

  /**
   * 判断当前是否为内嵌页面类型。
   */
  const isIframeType = computed(() => form.menuType === 'iframe')

  /**
   * 判断当前是否为外链类型。
   */
  const isLinkType = computed(() => form.menuType === 'link')

  /**
   * 判断当前是否使用移动端表单布局。
   */
  const isMobileLayout = computed(() => width.value < 768)

  /**
   * 根据布局尺寸调整类型按钮尺寸。
   */
  const actionButtonSize = computed(() => (isMobileLayout.value ? 'small' : 'default'))

  /**
   * 根据视口宽度计算抽屉宽度。
   */
  const drawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1280) return '760px'
    return '820px'
  })
  const isRouteLikeType = computed(
    () => isDirectoryType.value || isMenuPageType.value || isIframeType.value
  )
  const allMenuTypes: MenuKind[] = ['directory', 'menu', 'button', 'iframe', 'link']
  type ToggleFieldKey =
    | 'isEnable'
    | 'keepAlive'
    | 'isHide'
    | 'showBadge'
    | 'fixedTab'
    | 'isHideTab'
    | 'isFullPage'
    | 'openInNewTab'

  /**
   * 根据菜单类型生成可切换的附加配置项。
   */
  const toggleItems = computed<Array<{ key: ToggleFieldKey; label: string }>>(() => {
    if (isButtonType.value) {
      return [{ key: 'isEnable', label: '是否启用' }]
    }

    if (isMenuPageType.value) {
      return [
        { key: 'isEnable', label: '是否启用' },
        { key: 'keepAlive', label: '页面缓存' },
        { key: 'isHide', label: '隐藏菜单' },
        { key: 'showBadge', label: '显示徽章' },
        { key: 'fixedTab', label: '固定标签' },
        { key: 'isHideTab', label: '标签隐藏' },
        { key: 'isFullPage', label: '全屏页面' },
        { key: 'openInNewTab', label: '新标签打开' }
      ]
    }

    if (isDirectoryType.value) {
      return [
        { key: 'isEnable', label: '是否启用' },
        { key: 'isHide', label: '隐藏菜单' },
        { key: 'showBadge', label: '显示徽章' },
        { key: 'openInNewTab', label: '新标签打开' }
      ]
    }

    if (isIframeType.value) {
      return [
        { key: 'isEnable', label: '是否启用' },
        { key: 'isHide', label: '隐藏菜单' },
        { key: 'showBadge', label: '显示徽章' },
        { key: 'isHideTab', label: '标签隐藏' }
      ]
    }

    if (isLinkType.value) {
      return [
        { key: 'isEnable', label: '是否启用' },
        { key: 'isHide', label: '隐藏菜单' },
        { key: 'showBadge', label: '显示徽章' }
      ]
    }

    return []
  })

  /**
   * 生成菜单类型选项，并在编辑场景限制不安全的类型切换。
   */
  const menuTypeOptions = computed(() => {
    const currentType = resolveMenuKind(props.editData, props.type)
    const hasChildren = hasMenuChildren(props.editData)

    return allMenuTypes.map((type) => {
      let disabled = false

      if (props.lockType) {
        disabled = type !== currentType
      } else if (isEditMode.value) {
        if (currentType === 'button') {
          disabled = type !== 'button'
        } else if (type === 'button') {
          disabled = true
        } else if (hasChildren && type !== 'directory') {
          disabled = true
        }
      }

      return {
        value: type,
        label: menuTypeLabelMap[type],
        disabled
      }
    })
  })

  /**
   * 根据当前编辑状态生成类型切换提示文案。
   */
  const typeChangeHint = computed(() => {
    if (!isEditMode.value) {
      return '新建时可直接选择类型。按钮权限仍需挂在具体菜单下。'
    }

    const currentType = resolveMenuKind(props.editData, props.type)
    if (currentType === 'button') {
      return '按钮权限属于独立权限记录，当前仅支持编辑按钮本身，不支持直接转成菜单或目录。'
    }

    if (hasMenuChildren(props.editData)) {
      return '当前节点下已存在子菜单。为避免破坏层级结构，编辑时仅允许保持目录类型。'
    }

    return '无子菜单的目录、菜单、内嵌、外链之间支持直接切换；切换后会按目标类型自动清理不再适用的字段。'
  })

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
    ],
    path: [
      {
        validator: (_rule, value, callback) => {
          if (isButtonType.value || isLinkType.value) {
            callback()
            return
          }

          const path = String(value || '').trim()
          const link = String(form.link || '').trim()

          if (isIframeType.value) {
            if (!path) {
              callback(new Error(`内嵌路由地址必须为 ${IFRAME_ROUTE_PREFIX}xxx`))
              return
            }

            if (!IFRAME_ROUTE_REGEXP.test(path)) {
              callback(new Error(`开启内嵌时，路由地址必须严格匹配 ${IFRAME_ROUTE_PREFIX}xxx`))
              return
            }

            callback()
            return
          }

          if (!path && !link) {
            callback(new Error('请输入路由地址'))
            return
          }

          callback()
        },
        trigger: ['blur', 'change']
      }
    ],
    link: [
      {
        validator: (_rule, value, callback) => {
          if (!isIframeType.value && !isLinkType.value) {
            callback()
            return
          }

          const link = String(value || '').trim()
          if (!link) {
            callback(new Error('请输入外部链接'))
            return
          }

          callback()
        },
        trigger: ['blur', 'change']
      }
    ],
    component: [
      {
        validator: (_rule, value, callback) => {
          if (!isMenuPageType.value) {
            callback()
            return
          }

          const component = String(value || '').trim()
          if (!component) {
            callback(new Error('菜单类型必须填写组件路径'))
            return
          }

          callback()
        },
        trigger: ['blur', 'change']
      }
    ],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  })

  /**
   * 表单项配置
   */
  const formItems = computed<FormItem[]>(() => {
    const baseItems: FormItem[] = [{ label: '类型', key: 'menuType', span: 24 }]

    if (!isButtonType.value) {
      const commonItems: FormItem[] = [
        {
          label: '上级菜单',
          key: 'parentId',
          type: 'select',
          props: {
            clearable: true,
            placeholder: '不选择则创建为顶级菜单',
            options: props.menuOptions || []
          }
        },
        {
          label: isDirectoryType.value ? '目录名称' : '菜单名称',
          key: 'name',
          required: true,
          type: 'input',
          props: { placeholder: isDirectoryType.value ? '目录名称' : '菜单名称' }
        },
        ...(isLinkType.value
          ? [
              {
                label: '外部链接',
                key: 'link',
                required: true,
                type: 'input',
                props: {
                  placeholder: '如：https://www.example.com'
                }
              }
            ]
          : []),
        ...(isRouteLikeType.value
          ? [
              {
                label: createResponsiveLabel(
                  '路由地址',
                  isIframeType.value
                    ? `一级菜单：以 / 开头的绝对路径（如 /dashboard）\n二级及以下：相对路径（如 console、user）\n内嵌菜单必须以 ${IFRAME_ROUTE_PREFIX} 开头`
                    : '一级菜单：以 / 开头的绝对路径（如 /dashboard）\n二级及以下：相对路径（如 console、user）'
                ),
                key: 'path',
                required: true,
                type: 'input',
                props: {
                  placeholder: isIframeType.value
                    ? `如：${IFRAME_ROUTE_PREFIX}docs`
                    : isDirectoryType.value
                      ? '如：/system'
                      : '如：/system/user 或 user'
                }
              }
            ]
          : []),
        ...(isIframeType.value
          ? [
              {
                label: '外部链接',
                key: 'link',
                required: true,
                type: 'input',
                props: {
                  placeholder: '如：https://docs.example.com'
                }
              }
            ]
          : []),
        ...(isMenuPageType.value
          ? [
              {
                label: createResponsiveLabel(
                  '组件路径',
                  '一级父级菜单：填写 /index/index\n具体页面：填写组件路径（如 /system/user）\n目录菜单：留空'
                ),
                key: 'component',
                required: true,
                type: 'input',
                props: { placeholder: '如：/system/user' }
              }
            ]
          : []),
        {
          label: '权限标识',
          key: 'label',
          type: 'input',
          props: {
            placeholder: isDirectoryType.value ? '如：System' : '如：User'
          }
        },
        { label: '图标', key: 'icon', type: 'input', props: { placeholder: '如：ri:user-line' } },
        {
          label: createResponsiveLabel('菜单排序', sortTooltipText),
          key: 'sort',
          type: 'number',
          props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
        }
      ]

      const modeItems: FormItem[] = [
        ...(!isDirectoryType.value
          ? [
              {
                label: '文本徽章',
                key: 'showTextBadge',
                type: 'input',
                props: { placeholder: '如：New、Hot' }
              }
            ]
          : []),
        ...(isMenuPageType.value
          ? [
              {
                label: createResponsiveLabel(
                  '激活路径',
                  '用于详情页等隐藏菜单，指定高亮显示的父级菜单路径'
                ),
                key: 'activePath',
                type: 'input',
                props: { placeholder: '如：/system/user' }
              }
            ]
          : [])
      ]

      return [...baseItems, ...commonItems, ...modeItems]
    } else {
      return [
        ...baseItems,
        {
          label: '权限名称',
          key: 'authName',
          required: true,
          type: 'input',
          props: { placeholder: '如：新增、编辑、删除' }
        },
        {
          label: '权限标识',
          key: 'authLabel',
          required: true,
          type: 'input',
          props: { placeholder: '如：add、edit、delete' }
        },
        {
          label: createResponsiveLabel('权限排序', sortTooltipText),
          key: 'authSort',
          type: 'number',
          props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
        }
      ]
    }
  })

  /**
   * 根据新增/编辑模式和菜单类型生成抽屉标题。
   */
  const dialogTitle = computed(() => {
    const type = menuTypeLabelMap[form.menuType]
    return isEditMode.value ? `编辑${type}` : `新建${type}`
  })

  /**
   * 是否禁用菜单类型切换
   */
  const disableMenuType = computed(() => {
    return props.lockType
  })

  /**
   * 重置表单数据
   */
  const resetForm = (): void => {
    formRef.value?.reset?.()
    Object.assign(form, createDefaultMenuFormData())
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      if (isDirectoryType.value) {
        form.showTextBadge = ''
      }
      emit('submit', { ...form }, (success) => {
        if (success) {
          handleCancel()
        }
      })
    } catch {
      console.error('表单校验失败，请检查输入')
    }
  }

  /**
   * 取消操作
   */
  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  /**
   * 对话框关闭后的回调
   */
  const handleClosed = (): void => {
    resetForm()
  }

  /**
   * 在弹窗打开时同步表单状态，兼容新增、编辑和新增子级场景。
   */
  const syncVisibleFormState = () => {
    if (isEditMode.value) {
      Object.assign(form, buildMenuEditFormData(props.editData, props.type))
      return
    }

    const nextForm = createDefaultMenuFormData()
    nextForm.menuType = props.type
    syncMenuFormByType(nextForm)

    if (typeof props.editData?.parentId === 'number') {
      nextForm.parentId = props.editData.parentId
    }

    Object.assign(form, nextForm)
  }

  /**
   * 监听对话框显示状态
   */
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        syncVisibleFormState()
      }
    }
  )

  /**
   * 监听菜单类型变化
   */
  watch(
    () => props.type,
    (newType) => {
      if (props.visible && !isEditMode.value) {
        form.menuType = newType
        syncMenuFormByType(form)
      }
    }
  )

  watch(
    () => form.menuType,
    (newType, previousType) => {
      if (newType === previousType) {
        return
      }

      syncMenuFormByType(form)

      if (isDirectoryType.value) {
        form.showTextBadge = ''
      }

      if (props.visible && !isButtonType.value) {
        nextTick(() => {
          formRef.value?.validateField?.('path')
          formRef.value?.validateField?.('link')
        })
      }
    }
  )
</script>

<style scoped>
  .menu-type-group {
    flex-wrap: wrap;
    row-gap: 8px;
  }
</style>
