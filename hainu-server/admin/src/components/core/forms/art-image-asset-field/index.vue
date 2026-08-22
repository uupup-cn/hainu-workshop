<template>
  <div class="inline-flex max-w-full flex-col gap-2">
    <div
      v-if="modelValue"
      class="group relative cursor-pointer overflow-hidden rounded-custom border border-[var(--default-border)] bg-[var(--default-bg-color)]"
      :class="sizeClass"
      @click="pickerVisible = true"
    >
      <ElImage
        v-if="isPreviewableImage"
        :src="normalizedValue"
        :fit="fit"
        class="h-full w-full"
        preview-teleported
        :preview-src-list="[normalizedValue]"
      >
        <template #error>
          <div
            class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-g-500"
          >
            <ElIcon class="text-2xl"><Picture /></ElIcon>
            <span class="text-xs">{{ unavailableText }}</span>
          </div>
        </template>
      </ElImage>
      <div
        v-else
        class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-g-500"
      >
        <ElIcon class="text-2xl"><Picture /></ElIcon>
        <span class="text-xs">{{ unavailableText }}</span>
      </div>

      <div
        v-if="!disabled"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-g-900/45 opacity-0 tad-200 group-hover:opacity-100"
      >
        <ElButton
          size="small"
          type="primary"
          plain
          class="!ml-0"
          @click.stop="pickerVisible = true"
        >
          更换
        </ElButton>
        <ElButton size="small" plain class="!ml-0" @click.stop="updateValue('')">清空</ElButton>
      </div>
    </div>

    <button
      v-else
      type="button"
      class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-custom border border-dashed border-[var(--default-border-dashed)] bg-[var(--default-bg-color)] px-4 text-center text-g-500 tad-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      :class="sizeClass"
      :disabled="disabled"
      @click="pickerVisible = true"
    >
      <ElIcon class="text-2xl"><Plus /></ElIcon>
      <span class="text-sm font-medium text-g-700">{{ placeholder }}</span>
      <span v-if="tip" class="text-xs leading-5">{{ tip }}</span>
    </button>

    <ArtAssetPicker
      v-model="pickerVisible"
      :title="pickerTitle"
      fixed-kind="IMAGE"
      upload-accept="image/*"
      @confirm="handleAssetConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { useFormItem } from 'element-plus'
  import { Picture, Plus } from '@element-plus/icons-vue'
  import { fetchGeneratePublicLink } from '@/api/files'
  import ArtAssetPicker from '@/components/core/forms/art-asset-picker/index.vue'
  import { normalizeFileAccessUrl } from '@/utils/file-url'

  defineOptions({ name: 'ArtImageAssetField' })

  const props = withDefaults(
    defineProps<{
      modelValue?: string
      pickerTitle?: string
      placeholder?: string
      tip?: string
      unavailableText?: string
      fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
      sizeClass?: string
      disabled?: boolean
    }>(),
    {
      modelValue: '',
      pickerTitle: '选择图片素材',
      placeholder: '选择图片',
      tip: '',
      unavailableText: '无法预览',
      fit: 'cover',
      sizeClass: 'h-[100px] w-[100px]',
      disabled: false
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const pickerVisible = ref(false)
  const { formItem } = useFormItem()
  const normalizedValue = computed(() => normalizeFileAccessUrl(props.modelValue || ''))

  const isPreviewableImage = computed(() => {
    const value = normalizedValue.value
    if (!value) return false
    return (
      /^(https?:)?\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:image/')
    )
  })

  function updateValue(value: string) {
    emit('update:modelValue', value)
    nextTick(() => {
      void formItem?.validate('change').catch(() => undefined)
    })
  }

  async function handleAssetConfirm(files: Api.Files.FileAssetItem[]) {
    const file = files[0]
    if (!file) return

    try {
      const link = await fetchGeneratePublicLink(file.id)
      updateValue(normalizeFileAccessUrl(link.publicUrl))
    } catch {
      ElMessage.warning('图片链接生成失败，请稍后重试')
    }
  }
</script>
