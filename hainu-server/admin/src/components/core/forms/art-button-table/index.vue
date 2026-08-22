<template>
  <ElTooltip
    :content="tooltipContent"
    :disabled="!tooltipContent"
    :placement="tooltipPlacement"
    effect="dark"
  >
    <div
      :class="[
        'art-button-table inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm cursor-pointer rounded-md align-middle transition-all duration-200 select-none',
        presetClass,
        disabledClass,
        buttonClass
      ]"
      :aria-disabled="disabled"
      @click.stop="handleClick"
    >
      <ArtSvgIcon :icon="iconContent" />
    </div>
  </ElTooltip>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({ name: 'ArtButtonTable' })

  interface Props {
    /** 按钮类型 */
    type?: 'add' | 'edit' | 'delete' | 'more' | 'view' | 'download' | 'link'
    /** 自定义图标 */
    icon?: string
    /** 自定义样式类 */
    class?: string
    /** 兼容旧字段 */
    iconClass?: string
    /** 禁用状态 */
    disabled?: boolean
    /** 提示文案，传 true 使用默认文案 */
    tooltip?: string | boolean
    /** 提示位置 */
    tooltipPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  }

  const props = withDefaults(defineProps<Props>(), {
    tooltip: false,
    tooltipPlacement: 'top'
  })

  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()

  const defaultButtons = {
    add: {
      icon: 'ri:add-fill',
      label: '新增',
      class: 'bg-primary/12 text-primary hover:bg-primary/90 hover:text-white'
    },
    edit: {
      icon: 'ri:pencil-line',
      label: '编辑',
      class: 'bg-secondary/12 text-secondary hover:bg-secondary/90 hover:text-white'
    },
    delete: {
      icon: 'ri:delete-bin-5-line',
      label: '删除',
      class: 'bg-danger/12 text-danger hover:bg-danger/90 hover:text-white'
    },
    view: {
      icon: 'ri:eye-line',
      label: '查看',
      class: 'bg-info/12 text-info hover:bg-info/90 hover:text-white'
    },
    download: {
      icon: 'ri:download-2-line',
      label: '下载',
      class: 'bg-primary/12 text-primary hover:bg-primary/90 hover:text-white'
    },
    link: {
      icon: 'ri:link',
      label: '链接',
      class: 'bg-success/12 text-success hover:bg-success/90 hover:text-white'
    },
    more: {
      icon: 'ri:more-2-fill',
      label: '更多',
      class:
        'bg-[var(--default-box-color)] text-[var(--art-gray-600)] hover:bg-[var(--art-gray-200)] hover:text-[var(--art-gray-700)]'
    }
  } as const

  const iconContent = computed(() => {
    return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
  })

  const presetClass = computed(() => {
    return props.type ? defaultButtons[props.type]?.class : ''
  })

  const buttonClass = computed(() => {
    return props.class || props.iconClass || ''
  })

  const disabledClass = computed(() => {
    return props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  })

  const tooltipContent = computed(() => {
    if (props.tooltip === false) return ''
    if (typeof props.tooltip === 'string') return props.tooltip
    return props.type ? defaultButtons[props.type]?.label || '' : ''
  })

  const handleClick = (event: MouseEvent) => {
    if (props.disabled) return
    emit('click', event)
  }
</script>

<style scoped>
  .art-button-table {
    -webkit-tap-highlight-color: transparent;
  }
</style>
