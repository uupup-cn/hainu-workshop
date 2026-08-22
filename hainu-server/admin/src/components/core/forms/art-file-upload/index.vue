<template>
  <ElUpload
    :accept="accept"
    :disabled="disabled || uploading"
    :multiple="multiple"
    :show-file-list="showFileList"
    :before-upload="handleBeforeUpload"
    :http-request="handleUploadRequest"
  >
    <slot :uploading="uploading">
      <ElButton :type="buttonType" :loading="uploading" :disabled="disabled">
        {{ uploading ? uploadingText : buttonText }}
      </ElButton>
    </slot>
  </ElUpload>
</template>

<script setup lang="ts">
  import type { UploadProps, UploadRequestOptions } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import {
    fetchCompleteUpload,
    fetchCreateUploadTicket,
    fetchGeneratePublicLink,
    fetchProxyUploadFile
  } from '@/api/files'
  import { ApiPermissionCode } from '@/constants/api-permissions'
  import { useAuth } from '@/hooks/core/useAuth'
  import type { ArtFileUploadSuccessPayload } from './types'

  type UploadMode = 'proxy' | 'direct'
  type ValidateResult = boolean | string | Promise<boolean | string>

  const props = withDefaults(
    defineProps<{
      mode?: UploadMode
      accept?: string
      buttonText?: string
      uploadingText?: string
      successMessage?: string
      errorMessage?: string
      disabled?: boolean
      multiple?: boolean
      showFileList?: boolean
      imageOnly?: boolean
      videoOnly?: boolean
      maxSizeMb?: number
      folderId?: number
      visibility?: Api.Files.Visibility
      generatePublicLink?: boolean
      buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
      beforeUpload?: (file: File) => ValidateResult
    }>(),
    {
      mode: 'proxy',
      accept: '',
      buttonText: '上传文件',
      uploadingText: '上传中...',
      successMessage: '上传成功',
      errorMessage: '上传失败',
      disabled: false,
      multiple: false,
      showFileList: false,
      imageOnly: false,
      videoOnly: false,
      visibility: 'PRIVATE',
      generatePublicLink: false,
      buttonType: 'primary'
    }
  )

  const emit = defineEmits<{
    (e: 'success', payload: ArtFileUploadSuccessPayload): void
    (e: 'error', error: Error, rawFile: File): void
    (e: 'before-upload-start', rawFile: File): void
    (e: 'update:uploading', value: boolean): void
  }>()

  const { hasApiPermission } = useAuth()
  const uploadingCount = ref(0)
  const uploading = computed(() => uploadingCount.value > 0)

  function changeUploadingCount(delta: number) {
    const previous = uploading.value
    uploadingCount.value = Math.max(0, uploadingCount.value + delta)
    if (previous !== uploading.value) {
      emit('update:uploading', uploading.value)
    }
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    const errorMessage = await getValidateError(rawFile)
    if (errorMessage) {
      ElMessage.warning(errorMessage)
      return false
    }

    const customResult = await props.beforeUpload?.(rawFile)
    if (typeof customResult === 'string') {
      ElMessage.warning(customResult)
      return false
    }
    if (customResult === false) {
      return false
    }

    return true
  }

  async function handleUploadRequest(options: UploadRequestOptions) {
    const rawFile = options.file as File
    if (!ensurePermission()) {
      const error = new Error('当前账号没有文件上传权限')
      ElMessage.warning(error.message)
      options.onError?.(error as any)
      emit('error', error, rawFile)
      return
    }

    changeUploadingCount(1)
    emit('before-upload-start', rawFile)

    try {
      const uploaded = await uploadFile(rawFile)
      const publicLink = props.generatePublicLink
        ? await fetchGeneratePublicLink(uploaded.id)
        : undefined
      const payload: ArtFileUploadSuccessPayload = {
        file: uploaded,
        rawFile,
        publicUrl: publicLink?.publicUrl,
        publicLink
      }

      if (props.successMessage) {
        ElMessage.success(props.successMessage)
      }
      options.onSuccess?.(payload as any)
      emit('success', payload)
    } catch (error: any) {
      const normalizedError = error instanceof Error ? error : new Error(props.errorMessage)
      ElMessage.warning(normalizedError.message || props.errorMessage)
      options.onError?.(normalizedError as any)
      emit('error', normalizedError, rawFile)
    } finally {
      changeUploadingCount(-1)
    }
  }

  async function uploadFile(file: File) {
    if (props.mode === 'direct') {
      const ticket = await fetchCreateUploadTicket({
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        folderId: props.folderId,
        visibility: props.visibility
      })

      if (ticket.method === 'POST') {
        const formData = new FormData()
        Object.entries(ticket.formData).forEach(([key, value]) => formData.append(key, value))
        formData.append('file', file)
        const response = await fetch(ticket.uploadUrl, {
          method: ticket.method,
          body: formData
        })
        await assertStorageResponse(response)
      } else {
        const response = await fetch(ticket.uploadUrl, {
          method: ticket.method,
          headers: ticket.headers,
          body: file
        })
        await assertStorageResponse(response)
      }

      return fetchCompleteUpload(ticket.file.id, {
        sessionId: ticket.sessionId,
        size: file.size,
        mimeType: file.type || 'application/octet-stream'
      })
    }

    const formData = new FormData()
    formData.append('file', file)
    return fetchProxyUploadFile(formData, {
      folderId: props.folderId,
      visibility: props.visibility
    })
  }

  function ensurePermission() {
    if (props.mode === 'direct') {
      return (
        hasApiPermission(ApiPermissionCode.FILE.CREATE_UPLOAD_TICKET) &&
        hasApiPermission(ApiPermissionCode.FILE.COMPLETE)
      )
    }

    return hasApiPermission(ApiPermissionCode.FILE.PROXY_UPLOAD)
  }

  async function getValidateError(file: File) {
    if (props.imageOnly && !file.type.startsWith('image/')) {
      return '请上传图片格式文件'
    }
    if (props.videoOnly && !isVideoFile(file)) {
      return '请上传视频格式文件'
    }
    if (props.maxSizeMb && file.size / 1024 / 1024 > props.maxSizeMb) {
      return `文件大小不能超过 ${props.maxSizeMb}MB`
    }
    return ''
  }

  function isVideoFile(file: File) {
    if (file.type.startsWith('video/')) return true
    return /\.(mp4|mov|m4v|webm|ogg|ogv|avi|wmv|flv|mkv)$/i.test(file.name)
  }

  async function assertStorageResponse(response: Response) {
    if (response.ok) return

    const payload = await response.text().catch(() => '')
    if (response.status === 404) {
      throw new Error('云存储 Bucket 不存在，或 Bucket 名称 / 区域配置错误')
    }
    if (response.status === 403) {
      throw new Error('云存储拒绝访问，请检查 AccessKey、签名策略或跨域配置')
    }

    const codeMatch = payload.match(/<Code>(.*?)<\/Code>/)
    const messageMatch = payload.match(/<Message>(.*?)<\/Message>/)
    if (codeMatch?.[1] || messageMatch?.[1]) {
      throw new Error([codeMatch?.[1], messageMatch?.[1]].filter(Boolean).join(': '))
    }

    throw new Error(`上传失败，存储服务返回状态码 ${response.status}`)
  }
</script>
