<!--
  ArtTableImage
  用于表格列中的图片缩略图展示，适合封面图、Logo、图标、晒单图等小尺寸图片场景。
  组件统一收敛图片尺寸、边框、空状态、加载失败状态和预览行为，避免各业务表格重复编写
  ElImage 与占位文案，减少空状态文字换行、字号不一致、列宽被撑开等问题。
-->
<template>
  <div class="flex items-center justify-center">
    <div
      class="flex shrink-0 items-center justify-center overflow-hidden rounded-custom-sm border bg-[var(--default-bg-color)] text-center"
      :class="[sizeClass, src || !emptyDashed ? solidBorderClass : emptyBorderClass]"
    >
      <ElImage
        v-if="src"
        :src="src"
        :fit="fit"
        class="h-full w-full"
        :preview-src-list="resolvedPreviewList"
        :preview-teleported="previewTeleported"
        :initial-index="initialIndex"
      >
        <template #error>
          <div :class="placeholderClass">
            {{ errorText }}
          </div>
        </template>
      </ElImage>

      <slot v-else>
        <div :class="placeholderClass">
          {{ fallbackText }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtTableImage' })

  /** 表格缩略图尺寸档位，对齐后台表格常用行高与图片列宽。 */
  type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 表格缩略图形态，封面类资源通常使用横图，Logo / 图标 / 晒单图保持方形。 */
  type ImageShape = 'square' | 'landscape'

  interface ArtTableImageProps {
    /** 图片地址；为空时渲染默认空状态或默认插槽。 */
    src?: string | null
    /** 图片填充方式，透传给 Element Plus 的 ElImage。 */
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
    /** 缩略图尺寸档位。 */
    size?: ImageSize
    /** 缩略图形态。 */
    shape?: ImageShape
    /** 无图片时展示的占位文案。 */
    fallbackText?: string
    /** 图片加载失败时展示的文案。 */
    errorText?: string
    /** 是否启用图片预览。 */
    preview?: boolean
    /** 预览图片列表；不传时默认使用当前 src。 */
    previewSrcList?: string[]
    /** 是否将预览层挂载到 body，避免被表格滚动容器裁切。 */
    previewTeleported?: boolean
    /** 打开预览时的初始图片索引。 */
    initialIndex?: number
    /** 空状态边框是否使用虚线；插槽渲染真实图标时可关闭。 */
    emptyDashed?: boolean
  }

  const props = withDefaults(defineProps<ArtTableImageProps>(), {
    src: '',
    fit: 'cover',
    size: 'md',
    shape: 'square',
    fallbackText: '暂无图片',
    errorText: '无法预览',
    preview: true,
    previewSrcList: undefined,
    previewTeleported: true,
    initialIndex: 0,
    emptyDashed: true
  })

  /** 尺寸档位到 Tailwind 尺寸类的映射。 */
  const sizeClassMap: Record<ImageShape, Record<ImageSize, string>> = {
    square: {
      xs: 'h-9 w-9',
      sm: 'h-10 w-10',
      md: 'h-12 w-12',
      lg: 'h-14 w-14',
      xl: 'size-[60px]'
    },
    landscape: {
      xs: 'h-9 w-16',
      sm: 'h-10 w-[72px]',
      md: 'h-12 w-20',
      lg: 'h-14 w-24',
      xl: 'h-[72px] w-28'
    }
  }

  /** 当前缩略图容器尺寸类。 */
  const sizeClass = computed(() => sizeClassMap[props.shape][props.size])

  /** 有图片或自定义插槽内容时使用稳定实线边框。 */
  const solidBorderClass = 'border-[var(--default-border)]'

  /** 空图片占位使用虚线，帮助区分真实内容和缺省状态。 */
  const emptyBorderClass = 'border-dashed border-[var(--default-border)]'

  /** 占位/错误文案统一压小并禁止换行，避免表格列被撑开。 */
  const placeholderClass =
    'flex h-full w-full items-center justify-center overflow-hidden whitespace-nowrap px-1 text-center text-[10px] font-medium leading-3 text-g-400'

  /** 解析 ElImage 预览列表，关闭预览时返回空数组。 */
  const resolvedPreviewList = computed(() => {
    if (!props.preview || !props.src) return []
    return props.previewSrcList?.length ? props.previewSrcList : [props.src]
  })
</script>
