<!-- WangEditor 富文本编辑器 插件地址：https://www.wangeditor.com/ -->
<template>
  <div class="editor-wrapper">
    <template v-if="isEditorReady">
      <component
        :is="toolbarComponent"
        class="editor-toolbar"
        :editor="editorRef"
        :mode="mode"
        :defaultConfig="toolbarConfig"
      />
      <component
        :is="editorComponent"
        :style="{ height: height, overflowY: 'hidden' }"
        v-model="modelValue"
        :mode="mode"
        :defaultConfig="editorConfig"
        @onCreated="onCreateEditor"
      />
    </template>
    <div
      v-else
      class="flex items-center justify-center rounded-[var(--custom-radius)] border border-[var(--default-border)] bg-[var(--default-bg-color)] text-sm text-g-500"
      :style="{ height }"
    >
      正在加载编辑器...
    </div>
  </div>

  <ArtAssetPicker
    v-model="assetPickerVisible"
    :title="assetPickerTitle"
    :multiple="assetPickerMultiple"
    :max="assetPickerMax"
    :fixed-kind="assetPickerKind"
    :upload-accept="assetPickerAccept"
    @confirm="handleAssetPickerConfirm"
  />
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, shallowRef, computed, ref, watch } from 'vue'
  import type { Component } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage } from 'element-plus'
  import EmojiText from '@/utils/ui/emojo'
  import type { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
  import request from '@/utils/http'
  import { fetchGeneratePublicLink } from '@/api/files'
  import { normalizeFileAccessUrl } from '@/utils/file-url'
  import ArtAssetPicker from '@/components/core/forms/art-asset-picker/index.vue'

  defineOptions({ name: 'ArtWangEditor' })

  type InsertFnType = (url: string, alt: string, href: string) => void
  type InsertVideoFnType = (url: string, poster?: string) => void
  type AssetPickerKind = 'IMAGE' | 'VIDEO'

  const { VITE_API_URL } = import.meta.env

  // Props 定义
  interface Props {
    /** 编辑器高度 */
    height?: string
    /** 自定义工具栏配置 */
    toolbarKeys?: string[]
    /** 插入新工具到指定位置 */
    insertKeys?: { index: number; keys: string[] }
    /** 排除的工具栏项 */
    excludeKeys?: string[]
    /** 编辑器模式 */
    mode?: 'default' | 'simple'
    /** 占位符文本 */
    placeholder?: string
    /** 上传配置 */
    uploadConfig?: {
      maxFileSize?: number
      maxNumberOfFiles?: number
      server?: string
      // 是否开启自定义上传
      isCustomUpload?: boolean
    }
    /** 是否使用资源管理器选择 / 上传富文本媒体 */
    useResourcePicker?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: '500px',
    mode: 'default',
    placeholder: '请输入内容...',
    excludeKeys: () => ['fontFamily'],
    isCustomUpload: false,
    useResourcePicker: true
  })

  const modelValue = defineModel<string>({ required: true })

  // 编辑器实例
  const editorRef = shallowRef<IDomEditor>()
  const toolbarComponent = shallowRef<Component | null>(null)
  const editorComponent = shallowRef<Component | null>(null)
  const userStore = useUserStore()
  const isEditorReady = computed(() => !!toolbarComponent.value && !!editorComponent.value)
  let isDisposed = false
  let pendingAssetPickerResolve: ((files: Api.Files.FileAssetItem[]) => void) | null = null

  // 常量配置
  const DEFAULT_UPLOAD_CONFIG = {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    maxNumberOfFiles: 10,
    fieldName: 'file',
    allowedFileTypes: ['image/*']
  } as const

  // 计算属性：上传服务器地址
  const uploadServer = computed(
    () => props.uploadConfig?.server || `${VITE_API_URL}/api/common/upload/wangeditor`
  )

  // 合并上传配置
  const mergedUploadConfig = computed(() => ({
    ...DEFAULT_UPLOAD_CONFIG,
    ...props.uploadConfig
  }))

  const assetPickerVisible = ref(false)
  const assetPickerKind = ref<AssetPickerKind>('IMAGE')
  const assetPickerTitle = computed(() =>
    assetPickerKind.value === 'VIDEO' ? '选择视频素材' : '选择图片素材'
  )
  const assetPickerAccept = computed(() =>
    assetPickerKind.value === 'VIDEO' ? 'video/*' : 'image/*'
  )
  const assetPickerMax = computed(() =>
    assetPickerKind.value === 'IMAGE' ? mergedUploadConfig.value.maxNumberOfFiles : 1
  )
  const assetPickerMultiple = computed(
    () => assetPickerKind.value === 'IMAGE' && assetPickerMax.value > 1
  )

  // 工具栏配置
  const toolbarConfig = computed((): Partial<IToolbarConfig> => {
    const config: Partial<IToolbarConfig> = {}

    // 完全自定义工具栏
    if (props.toolbarKeys && props.toolbarKeys.length > 0) {
      config.toolbarKeys = props.toolbarKeys
    }

    // 插入新工具
    if (props.insertKeys) {
      config.insertKeys = props.insertKeys
    }

    // 排除工具
    if (props.excludeKeys && props.excludeKeys.length > 0) {
      config.excludeKeys = props.excludeKeys
    }

    return config
  })

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder,
    MENU_CONF: {
      uploadImage: {
        fieldName: mergedUploadConfig.value.fieldName,
        maxFileSize: mergedUploadConfig.value.maxFileSize,
        maxNumberOfFiles: mergedUploadConfig.value.maxNumberOfFiles,
        allowedFileTypes: mergedUploadConfig.value.allowedFileTypes,
        server: uploadServer.value,
        headers: {
          Authorization: userStore.accessToken
        },
        onSuccess() {
          ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
        },
        onError(file: File, err: any, res: any) {
          console.error('图片上传失败:', err, res)
          ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
        }
      }
    }
  }

  if (props.useResourcePicker && editorConfig.MENU_CONF) {
    editorConfig.MENU_CONF.uploadImage.customBrowseAndUpload = async (insertFn: InsertFnType) => {
      await insertResourceImages(insertFn)
    }
    editorConfig.MENU_CONF.uploadVideo = {
      customBrowseAndUpload: async (insertFn: InsertVideoFnType) => {
        await insertResourceVideos(insertFn)
      }
    }
  }

  // 自定义上传
  if (
    !props.useResourcePicker &&
    props.uploadConfig?.isCustomUpload &&
    props.uploadConfig?.server &&
    editorConfig.MENU_CONF
  ) {
    editorConfig.MENU_CONF.uploadImage.customUpload = async (
      file: File,
      insertFn: InsertFnType
    ) => {
      try {
        const formData = new FormData()
        formData.append(mergedUploadConfig.value.fieldName, file)

        const response = await request.post<{ url: string; alt: string; href: string }>({
          url: props.uploadConfig?.server,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: userStore.accessToken
          }
        })

        const { url, alt, href } = response

        if (!url) {
          throw new Error('上传失败，请检查服务端配置')
        }

        insertFn(url, alt, href)
        ElMessage.success(`图片上传成功 ${EmojiText[200]}`)
      } catch (error) {
        console.error('图片上传失败:', error)
        ElMessage.error(`图片上传失败 ${EmojiText[500]}`)
      }
    }
  }

  async function insertResourceImages(insertFn: InsertFnType) {
    const files = await openAssetPicker('IMAGE')
    if (!files.length) return

    try {
      await Promise.all(
        files.map(async (file) => {
          const url = await generatePublicUrl(file)
          if (!url) return
          insertFn(url, file.displayName || file.originalName || '', url)
        })
      )
      ElMessage.success(`图片已插入 ${EmojiText[200]}`)
    } catch (error) {
      console.error('插入图片素材失败:', error)
      ElMessage.error(`图片插入失败 ${EmojiText[500]}`)
    }
  }

  async function insertResourceVideos(insertFn: InsertVideoFnType) {
    const files = await openAssetPicker('VIDEO')
    const file = files[0]
    if (!file) return

    try {
      const url = await generatePublicUrl(file)
      if (!url) return
      insertFn(url, '')
      ElMessage.success(`视频已插入 ${EmojiText[200]}`)
    } catch (error) {
      console.error('插入视频素材失败:', error)
      ElMessage.error(`视频插入失败 ${EmojiText[500]}`)
    }
  }

  function openAssetPicker(kind: AssetPickerKind) {
    if (pendingAssetPickerResolve) {
      pendingAssetPickerResolve([])
      pendingAssetPickerResolve = null
    }

    assetPickerKind.value = kind
    assetPickerVisible.value = true

    return new Promise<Api.Files.FileAssetItem[]>((resolve) => {
      pendingAssetPickerResolve = resolve
    })
  }

  function handleAssetPickerConfirm(files: Api.Files.FileAssetItem[]) {
    resolveAssetPicker(files)
  }

  function resolveAssetPicker(files: Api.Files.FileAssetItem[]) {
    const resolve = pendingAssetPickerResolve
    pendingAssetPickerResolve = null
    resolve?.(files)
  }

  async function generatePublicUrl(file: Api.Files.FileAssetItem) {
    const link = await fetchGeneratePublicLink(file.id)
    return normalizeFileAccessUrl(link.publicUrl)
  }

  watch(assetPickerVisible, (visible) => {
    if (!visible && pendingAssetPickerResolve) {
      resolveAssetPicker([])
    }
  })

  // 编辑器创建回调
  const onCreateEditor = (editor: IDomEditor) => {
    editorRef.value = editor

    // 监听全屏事件
    editor.on('fullScreen', () => {
      console.log('编辑器进入全屏模式')
    })

    // 确保在编辑器创建后应用自定义图标
    applyCustomIcons()
  }

  // 应用自定义图标（带重试机制）
  const applyCustomIcons = () => {
    let retryCount = 0
    const maxRetries = 10
    const retryDelay = 100

    const tryApplyIcons = () => {
      const editor = editorRef.value
      if (!editor) {
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(tryApplyIcons, retryDelay)
        }
        return
      }

      // 获取当前编辑器的工具栏容器
      const editorContainer = editor.getEditableContainer().closest('.editor-wrapper')
      if (!editorContainer) {
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(tryApplyIcons, retryDelay)
        }
        return
      }

      const toolbar = editorContainer.querySelector('.w-e-toolbar')
      const toolbarButtons = editorContainer.querySelectorAll('.w-e-bar-item button[data-menu-key]')

      if (toolbar && toolbarButtons.length > 0) {
        return
      }

      // 如果工具栏还没渲染完成，继续重试
      if (retryCount < maxRetries) {
        retryCount++
        setTimeout(tryApplyIcons, retryDelay)
      } else {
        console.warn('工具栏渲染超时，无法应用自定义图标 - 编辑器实例:', editor.id)
      }
    }

    // 使用 requestAnimationFrame 确保在下一帧执行
    requestAnimationFrame(tryApplyIcons)
  }

  // 暴露编辑器实例和方法
  defineExpose({
    /** 获取编辑器实例 */
    getEditor: () => editorRef.value,
    /** 设置编辑器内容 */
    setHtml: (html: string) => editorRef.value?.setHtml(html),
    /** 获取编辑器内容 */
    getHtml: () => editorRef.value?.getHtml(),
    /** 清空编辑器 */
    clear: () => editorRef.value?.clear(),
    /** 聚焦编辑器 */
    focus: () => editorRef.value?.focus()
  })

  // 生命周期
  onMounted(() => {
    void import('./runtime').then((module) => {
      if (isDisposed) {
        return
      }

      toolbarComponent.value = module.Toolbar
      editorComponent.value = module.Editor
    })
  })

  onBeforeUnmount(() => {
    isDisposed = true
    const editor = editorRef.value
    if (editor) {
      editor.destroy()
    }
  })
</script>

<style lang="scss">
  @use './style';
</style>
