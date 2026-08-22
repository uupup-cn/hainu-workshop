<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="min(920px, calc(100vw - 32px))"
    align-center
    append-to-body
    class="art-asset-picker"
    destroy-on-close
    @open="handleOpen"
  >
    <ElScrollbar class="asset-picker__dialog-scroll">
      <div
        class="asset-picker__layout grid h-[560px] max-h-[calc(100vh-180px)] grid-cols-12 overflow-hidden rounded-custom-sm border border-[var(--default-border)]"
      >
        <aside
          class="asset-picker__sidebar col-span-12 flex min-h-0 flex-col border-b border-[var(--default-border)] bg-[var(--default-bg-color)] md:col-span-4 md:border-b-0 md:border-r xl:col-span-3"
        >
          <div
            class="flex h-12 shrink-0 items-center justify-between gap-3 border-b-d px-3 md:h-[60px] md:px-4"
          >
            <div class="text-sm font-semibold text-g-900">素材目录</div>
            <ElButton size="small" text @click="loadFolders">刷新</ElButton>
          </div>
          <div class="flex min-h-0 flex-1 flex-col p-2 md:p-3">
            <button
              type="button"
              class="flex h-9 w-full items-center justify-between rounded-custom-sm px-3 text-left text-sm transition-colors"
              :class="
                !query.folderId
                  ? 'bg-[var(--art-hover-color)] text-g-900'
                  : 'text-g-700 hover:bg-[var(--art-hover-color)]'
              "
              @click="selectFolder(undefined)"
            >
              <span class="flex items-center gap-2">
                <ArtSvgIcon icon="ri:folder-2-line" />
                全部
              </span>
              <span class="text-xs text-g-500">{{ state.summary.total }}</span>
            </button>
            <ElScrollbar class="asset-picker__folder-scroll mt-2 min-h-0 flex-1">
              <ElTree
                :data="folderTree"
                node-key="id"
                :props="{ label: 'name', children: 'children' }"
                :current-node-key="query.folderId"
                highlight-current
                empty-text="暂无目录"
                @node-click="handleFolderNodeClick"
              >
                <template #default="{ data }">
                  <div class="flex min-w-0 flex-1 items-center justify-between gap-2 py-1.5">
                    <span class="flex min-w-0 items-center gap-2">
                      <ArtSvgIcon icon="ri:folder-line" class="shrink-0 text-g-600" />
                      <span class="truncate text-sm">{{ data.name }}</span>
                    </span>
                    <span class="shrink-0 pr-2 text-xs text-g-500">{{ data.fileCount }}</span>
                  </div>
                </template>
              </ElTree>
            </ElScrollbar>
            <ElButton class="mt-3 w-full" @click="openCreateFolderDialog">新建目录</ElButton>
          </div>
        </aside>

        <section
          class="asset-picker__content col-span-12 flex min-h-0 flex-col md:col-span-8 xl:col-span-9"
        >
          <div class="border-b-d flex shrink-0 items-center px-3 py-3 md:h-[60px] md:px-4 md:py-0">
            <div
              class="grid w-full grid-cols-1 gap-3"
              :class="fixedKind ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[1fr_150px_auto]'"
            >
              <ElInput
                v-model="query.keyword"
                clearable
                placeholder="搜索素材名称"
                @keyup.enter="handleSearch"
              />
              <ElSelect v-if="!fixedKind" v-model="query.kind" clearable placeholder="类型">
                <ElOption label="图片" value="IMAGE" />
                <ElOption label="视频" value="VIDEO" />
                <ElOption label="文档" value="DOCUMENT" />
                <ElOption label="压缩包" value="ARCHIVE" />
              </ElSelect>
              <div class="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <ArtFileUpload
                  class="w-full sm:w-auto"
                  :folder-id="query.folderId"
                  :visibility="uploadVisibility"
                  :accept="uploadAccept"
                  :image-only="uploadImageOnly"
                  :video-only="uploadVideoOnly"
                  :success-message="uploadSuccessMessage"
                  @success="handleUploadSuccess"
                >
                  <template #default="{ uploading }">
                    <ElButton class="w-full sm:w-auto" type="primary" :loading="uploading">
                      上传素材
                    </ElButton>
                  </template>
                </ArtFileUpload>
                <ElButton class="w-full sm:w-auto" @click="handleSearch">查询</ElButton>
              </div>
            </div>
          </div>

          <ElScrollbar class="asset-picker__content-scroll flex-1">
            <div
              v-loading="state.loading"
              class="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-5"
            >
              <button
                v-for="item in state.records"
                :key="item.id"
                type="button"
                class="group min-w-0 cursor-pointer rounded-custom-sm border p-2 text-left transition-colors"
                :class="
                  isSelected(item.id)
                    ? 'border-[var(--theme-color)] bg-[var(--art-active-color)]'
                    : 'border-[var(--default-border)] hover:bg-[var(--art-hover-color)]'
                "
                @click="toggleSelect(item)"
              >
                <div
                  class="aspect-square overflow-hidden rounded-custom-sm bg-[var(--default-bg-color)]"
                >
                  <ElImage
                    v-if="item.kind === 'IMAGE' && previewUrlMap[item.id]"
                    :src="previewUrlMap[item.id]"
                    fit="cover"
                    class="h-full w-full object-cover"
                  >
                    <template #error>
                      <div class="flex h-full items-center justify-center text-g-500">
                        <ArtSvgIcon icon="ri:image-line" class="text-2xl" />
                      </div>
                    </template>
                  </ElImage>
                  <div
                    v-else-if="item.kind === 'VIDEO' && previewUrlMap[item.id]"
                    class="relative h-full w-full"
                  >
                    <video
                      :src="previewUrlMap[item.id]"
                      muted
                      preload="metadata"
                      class="h-full w-full object-cover"
                    />
                    <div class="asset-picker__video-play">
                      <ArtSvgIcon icon="ri:play-fill" />
                    </div>
                  </div>
                  <div v-else class="flex h-full items-center justify-center text-g-600">
                    <ArtSvgIcon :icon="resolveFileKindIcon(item.kind)" class="text-3xl" />
                  </div>
                </div>
                <div class="mt-2 truncate text-sm font-medium text-g-900">
                  {{ item.displayName }}
                </div>
              </button>

              <div
                v-if="!state.loading && !state.records.length"
                class="col-span-full flex min-h-[260px] items-center justify-center rounded-custom-sm border border-dashed border-[var(--default-border)] text-sm text-g-500"
              >
                暂无素材
              </div>
            </div>
          </ElScrollbar>

          <div
            class="border-t-d flex flex-col items-stretch gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between md:px-4"
          >
            <div class="text-sm text-g-600">
              已选 {{ selectedRecords.length }}{{ selectionMaxLabel }} 项
            </div>
            <ElPagination
              small
              background
              layout="prev, pager, next"
              :total="state.total"
              :current-page="query.current"
              :page-size="query.size"
              @current-change="handleCurrentChange"
            />
          </div>
        </section>
      </div>

      <div class="asset-picker__mobile-actions flex flex-col-reverse gap-3 px-0 py-4 md:hidden">
        <ElButton class="w-full" @click="visible = false">取消</ElButton>
        <ElButton
          class="w-full"
          type="primary"
          :disabled="!selectedRecords.length"
          @click="confirmSelect"
        >
          确认
        </ElButton>
      </div>
    </ElScrollbar>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" :disabled="!selectedRecords.length" @click="confirmSelect">
        确认
      </ElButton>
    </template>
  </ElDialog>

  <ArtFileFolderDialog
    v-model="folderDialogVisible"
    :folder-tree="folderTree"
    :initial-parent-id="query.folderId"
    :initial-visibility="props.uploadVisibility"
    :submitting="folderSubmitting"
    @confirm="createFolder"
  />
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import {
    fetchCreateFileFolder,
    fetchFileDownloadUrl,
    fetchFileFolderTree,
    fetchFileList
  } from '@/api/files'
  import ArtFileFolderDialog from '@/components/core/forms/art-file-folder-dialog/index.vue'
  import ArtFileUpload from '@/components/core/forms/art-file-upload/index.vue'
  import { normalizeFileAccessUrl } from '@/utils/file-url'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      title?: string
      multiple?: boolean
      imageOnly?: boolean
      fixedKind?: Api.Files.Kind
      uploadAccept?: string
      uploadVisibility?: Api.Files.Visibility
      /** 多选模式下最多可选数量，未设置或 <=0 表示不限制 */
      max?: number
    }>(),
    {
      title: '素材管理',
      multiple: false,
      imageOnly: true,
      fixedKind: undefined,
      uploadAccept: undefined,
      uploadVisibility: 'PUBLIC',
      max: undefined
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm', files: Api.Files.FileAssetItem[]): void
  }>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  /** 多选模式下展示「/N」上限标签 */
  const selectionMaxLabel = computed(() =>
    props.multiple && typeof props.max === 'number' && props.max > 0 ? ` / ${props.max}` : ''
  )

  const folderTree = ref<Api.Files.FileFolderNode[]>([])
  const selectedRecords = ref<Api.Files.FileAssetItem[]>([])
  const folderDialogVisible = ref(false)
  const folderSubmitting = ref(false)
  const previewUrlMap = reactive<Record<number, string>>({})
  const query = reactive<Api.Files.FileSearchParams>({
    current: 1,
    size: 15,
    keyword: '',
    folderId: undefined,
    kind: props.fixedKind || (props.imageOnly ? 'IMAGE' : '')
  })
  const state = reactive({
    loading: false,
    records: [] as Api.Files.FileAssetItem[],
    total: 0,
    summary: {
      total: 0,
      privateCount: 0,
      publicCount: 0
    }
  })

  const uploadAccept = computed(() => {
    if (props.uploadAccept) return props.uploadAccept
    if (props.fixedKind === 'VIDEO') return 'video/*'
    if (props.fixedKind === 'IMAGE' || props.imageOnly) return 'image/*'
    return undefined
  })
  const uploadImageOnly = computed(() => props.fixedKind === 'IMAGE' || props.imageOnly)
  const uploadVideoOnly = computed(() => props.fixedKind === 'VIDEO')
  const uploadSuccessMessage = computed(() => {
    if (props.fixedKind === 'VIDEO') return '视频上传成功'
    if (props.fixedKind === 'IMAGE' || props.imageOnly) return '图片上传成功'
    return '素材上传成功'
  })

  async function handleOpen() {
    selectedRecords.value = []
    query.kind = props.fixedKind || (props.imageOnly ? 'IMAGE' : query.kind)
    await Promise.all([loadFolders(), loadFiles()])
  }

  async function loadFolders() {
    folderTree.value = await fetchFileFolderTree()
  }

  async function loadFiles(options?: { resetPage?: boolean }) {
    if (options?.resetPage) {
      query.current = 1
    }
    state.loading = true
    try {
      const response = await fetchFileList({
        current: query.current,
        size: query.size,
        keyword: query.keyword?.trim() || undefined,
        folderId: query.folderId,
        kind: props.fixedKind || query.kind || undefined,
        status: 'ACTIVE'
      })
      state.records = response.records
      state.total = response.total
      state.summary = response.summary
      void preloadPreviewUrls(response.records)
    } finally {
      state.loading = false
    }
  }

  async function preloadPreviewUrls(records: Api.Files.FileAssetItem[]) {
    await Promise.all(
      records
        .filter((item) => ['IMAGE', 'VIDEO'].includes(item.kind) && !previewUrlMap[item.id])
        .map(async (item) => {
          try {
            const downloadUrl = await fetchFileDownloadUrl(item.id)
            previewUrlMap[item.id] = normalizeFileAccessUrl(downloadUrl.url)
          } catch {
            previewUrlMap[item.id] = ''
          }
        })
    )
  }

  function handleSearch() {
    void loadFiles({ resetPage: true })
  }

  function selectFolder(folderId?: number) {
    query.folderId = folderId
    query.current = 1
    void loadFiles()
  }

  function handleFolderNodeClick(data: Api.Files.FileFolderNode) {
    selectFolder(data.id)
  }

  function openCreateFolderDialog() {
    folderDialogVisible.value = true
  }

  async function createFolder(payload: {
    name: string
    parentId?: number
    visibility: Api.Files.Visibility
  }) {
    folderSubmitting.value = true
    try {
      await fetchCreateFileFolder({
        name: payload.name,
        parentId: payload.parentId,
        visibility: payload.visibility
      })
      folderDialogVisible.value = false
      await loadFolders()
    } finally {
      folderSubmitting.value = false
    }
  }

  function handleUploadSuccess(payload?: { file?: Api.Files.FileAssetItem }) {
    if (payload?.file?.id) {
      delete previewUrlMap[payload.file.id]
    }
    void Promise.all([loadFiles({ resetPage: true }), loadFolders()])
  }

  function isSelected(id: number) {
    return selectedRecords.value.some((item) => item.id === id)
  }

  function toggleSelect(item: Api.Files.FileAssetItem) {
    if (!props.multiple) {
      selectedRecords.value = [item]
      return
    }

    if (isSelected(item.id)) {
      selectedRecords.value = selectedRecords.value.filter((record) => record.id !== item.id)
      return
    }

    if (
      typeof props.max === 'number' &&
      props.max > 0 &&
      selectedRecords.value.length >= props.max
    ) {
      ElMessage.warning(`最多可选择 ${props.max} 项`)
      return
    }

    selectedRecords.value.push(item)
  }

  function handleCurrentChange(current: number) {
    query.current = current
    void loadFiles()
  }

  function confirmSelect() {
    if (!selectedRecords.value.length) {
      ElMessage.warning('请选择素材')
      return
    }
    emit('confirm', selectedRecords.value)
    visible.value = false
  }

  function resolveFileKindIcon(kind: Api.Files.Kind) {
    const map: Record<Api.Files.Kind, string> = {
      IMAGE: 'ri:image-2-line',
      VIDEO: 'ri:movie-line',
      AUDIO: 'ri:disc-line',
      DOCUMENT: 'ri:file-text-line',
      ARCHIVE: 'ri:file-zip-line',
      OTHER: 'ri:file-cloud-line'
    }
    return map[kind]
  }
</script>

<style scoped>
  :global(.art-asset-picker .el-dialog__footer) {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  :global(.art-asset-picker .el-dialog__footer .el-button + .el-button) {
    margin-left: 0;
  }

  :deep(.el-tree) {
    background: transparent;
  }

  :deep(.el-tree-node__content) {
    height: 32px;
    padding-right: 8px;
    border-radius: calc(var(--custom-radius) / 2 + 2px);
  }

  :deep(.el-tree-node__content:hover),
  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background-color: var(--art-hover-color);
  }

  .asset-picker__video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 18px;
    color: var(--default-box-color);
    pointer-events: none;
    background: color-mix(in srgb, var(--art-gray-900) 58%, transparent);
    border-radius: 9999px;
    transform: translate(-50%, -50%);
  }

  @media (width < 640px) {
    :global(.art-asset-picker) {
      --el-dialog-margin-top: 8px;
    }

    :global(.art-asset-picker .el-dialog__header) {
      padding: 16px 16px 10px;
    }

    :global(.art-asset-picker .el-dialog__body) {
      padding: 10px 16px 12px;
    }

    :global(.art-asset-picker .el-dialog__footer) {
      display: none;
      padding: 0 16px 16px;
    }
  }

  @media (width < 768px) {
    :global(.art-asset-picker .el-dialog__body) {
      padding-bottom: 12px;
    }

    :global(.art-asset-picker .el-dialog__footer) {
      display: none;
    }

    .asset-picker__dialog-scroll {
      height: calc(100dvh - 156px);
      max-height: calc(100dvh - 156px);
    }

    .asset-picker__mobile-actions :deep(.el-button + .el-button) {
      margin-left: 0;
    }

    .asset-picker__content :deep(.el-upload),
    .asset-picker__content :deep(.el-upload .el-button) {
      width: 100%;
    }

    .asset-picker__layout {
      height: auto;
      max-height: none;
      overflow: visible;
    }

    .asset-picker__sidebar,
    .asset-picker__content {
      min-height: 0;
    }

    .asset-picker__folder-scroll,
    .asset-picker__content-scroll {
      flex: initial;
      height: auto;
    }
  }
</style>
