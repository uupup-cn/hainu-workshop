<template>
  <div class="flex flex-col gap-4" :class="isFocusMode ? 'art-full-height' : 'pb-5'">
    <ArtPageHero
      v-if="!isFocusMode"
      size="sm"
      align="center"
      title="文件中心"
      description="上传、整理目录并管理文件公开分发。"
      right-class="flex flex-wrap items-center gap-2"
    >
      <template #right>
        <ElRadioGroup v-model="uploadMode" size="default">
          <ElRadioButton label="direct" value="direct">直传云存储</ElRadioButton>
          <ElRadioButton label="proxy" value="proxy">后端中转</ElRadioButton>
        </ElRadioGroup>
        <ElButton v-if="hasAuth('createFolder')" plain @click="openCreateFolderDialog" v-ripple>
          新建目录
        </ElButton>
        <ArtFileUpload
          v-if="hasAuth('upload')"
          :mode="uploadMode"
          :folder-id="query.folderId"
          visibility="PRIVATE"
          multiple
          button-text="上传文件"
          success-message="文件上传成功"
          @success="handleUploadSuccess"
        />
      </template>

      <template #footer>
        <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div
            v-for="item in summaryCards"
            :key="item.label"
            class="rounded-[var(--custom-radius)] border border-[var(--default-border)] px-4 py-3"
          >
            <div class="text-xs uppercase tracking-[0.14em] text-g-500">{{ item.label }}</div>
            <div class="mt-2 leading-none text-g-900" :class="item.valueClass">{{
              item.value
            }}</div>
            <div class="mt-1 text-xs leading-5 text-g-600">{{ item.description }}</div>
          </div>
        </div>
      </template>
    </ArtPageHero>

    <section class="file-center-grid grid min-h-0 flex-1 grid-cols-12 items-stretch gap-4">
      <aside class="col-span-12 h-full xl:col-span-3">
        <div class="flex h-full flex-col overflow-hidden art-surface-sm">
          <div class="border-b-d px-5 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-base font-semibold text-g-900">目录管理</div>
                <div class="mt-1 text-sm text-g-600"
                  >目录只负责业务归类，不直接映射对象存储路径。</div
                >
              </div>
              <ElButton text size="small" @click="loadFolders">刷新</ElButton>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="art-surface-muted px-3 py-3">
                <div class="text-xs uppercase tracking-[0.16em] text-g-500">目录数</div>
                <div class="mt-2 text-xl font-semibold text-g-900">{{ folderSummary.total }}</div>
              </div>
              <div class="art-surface-muted px-3 py-3">
                <div class="text-xs uppercase tracking-[0.16em] text-g-500">当前目录</div>
                <div class="mt-2 truncate text-sm font-semibold text-g-900">{{
                  currentFolderName
                }}</div>
              </div>
            </div>
          </div>

          <div class="flex min-h-0 flex-1 flex-col p-3">
            <button
              class="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left transition-colors"
              :class="
                !query.folderId
                  ? 'bg-[color:color-mix(in_oklch,var(--color-primary)_12%,var(--color-box))] text-g-900'
                  : 'text-g-700 hover:bg-[var(--art-hover-color)]'
              "
              @click="selectFolder(undefined)"
            >
              <span class="flex items-center gap-2">
                <ArtSvgIcon icon="ri:folder-2-line" class="text-base" />
                <span class="text-sm font-semibold">全部文件</span>
              </span>
              <span class="text-xs text-g-500">{{ fileState.summary.total }}</span>
            </button>

            <ElScrollbar class="mt-3 min-h-0 flex-1">
              <ElTree
                :data="folderTree"
                node-key="id"
                :props="{ label: 'name', children: 'children' }"
                highlight-current
                :current-node-key="query.folderId"
                empty-text="还没有目录"
                @node-click="handleFolderNodeClick"
              >
                <template #default="{ data }">
                  <div class="group flex min-w-0 flex-1 items-center justify-between gap-2 py-1.5">
                    <div class="flex min-w-0 items-center gap-2">
                      <ArtSvgIcon icon="ri:folder-line" class="text-g-600" />
                      <span class="truncate text-sm text-g-800">{{ data.name }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <span class="text-xs text-g-500">{{ data.fileCount }}</span>
                      <ElDropdown trigger="click" @command="handleFolderCommand(data, $event)">
                        <button
                          class="flex size-7 cursor-pointer items-center justify-center rounded-full text-g-500 transition-colors hover:text-g-900"
                          @click.stop
                        >
                          <ArtSvgIcon icon="ri:more-2-fill" />
                        </button>
                        <template #dropdown>
                          <ElDropdownMenu>
                            <ElDropdownItem v-if="hasAuth('createFolder')" command="create">
                              新建子目录
                            </ElDropdownItem>
                            <ElDropdownItem v-if="hasAuth('createFolder')" command="edit">
                              编辑目录
                            </ElDropdownItem>
                            <ElDropdownItem v-if="hasAuth('createFolder')" command="delete" divided>
                              删除目录
                            </ElDropdownItem>
                          </ElDropdownMenu>
                        </template>
                      </ElDropdown>
                    </div>
                  </div>
                </template>
              </ElTree>
            </ElScrollbar>
          </div>
        </div>
      </aside>

      <div class="col-span-12 h-full min-w-0 xl:col-span-9">
        <div class="art-table-card mt-0! flex h-full flex-col overflow-hidden">
          <div class="border-b-d px-5 py-5">
            <div
              class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.2fr)_repeat(4,minmax(0,0.72fr))_auto]"
            >
              <ElInput
                v-model="query.keyword"
                placeholder="搜索文件名、显示名、对象 Key"
                clearable
                class="min-w-0 md:col-span-2 xl:col-span-1"
              />
              <ElSelect v-model="query.kind" clearable placeholder="文件类型" class="min-w-0">
                <ElOption label="图片" value="IMAGE" />
                <ElOption label="视频" value="VIDEO" />
                <ElOption label="文档" value="DOCUMENT" />
                <ElOption label="压缩包" value="ARCHIVE" />
              </ElSelect>
              <ElSelect v-model="query.visibility" clearable placeholder="可见性" class="min-w-0">
                <ElOption label="私有" value="PRIVATE" />
                <ElOption label="公开" value="PUBLIC" />
              </ElSelect>
              <ElSelect v-model="query.provider" clearable placeholder="云厂商" class="min-w-0">
                <ElOption label="阿里云 OSS" value="ALIYUN_OSS" />
                <ElOption label="腾讯云 COS" value="TENCENT_COS" />
                <ElOption label="七牛云" value="QINIU" />
                <ElOption label="本地存储" value="LOCAL" />
              </ElSelect>
              <ElSelect v-model="query.status" clearable placeholder="状态" class="min-w-0">
                <ElOption label="上传中" value="UPLOADING" />
                <ElOption label="可用" value="ACTIVE" />
                <ElOption label="失败" value="FAILED" />
              </ElSelect>
              <div class="flex items-center gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
                <ElButton @click="resetFilters">重置</ElButton>
                <ElButton type="primary" @click="loadFiles" v-ripple>查询</ElButton>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <ElTag effect="light" type="info">当前目录：{{ currentFolderName }}</ElTag>
                <ElTag effect="light" type="info">当前页 {{ fileState.records.length }} 条</ElTag>
                <ElTag v-if="selectedIds.length" effect="light" type="primary">
                  已选 {{ selectedIds.length }} 项
                </ElTag>
                <ElTag effect="light" type="warning">
                  上传模式：{{ uploadMode === 'direct' ? '前端直传' : '后端中转' }}
                </ElTag>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <ElButton
                  v-if="selectedIds.length && hasAuth('move')"
                  plain
                  @click="openBatchMoveDialog"
                  v-ripple
                >
                  批量移动
                </ElButton>
                <ElButton
                  v-if="selectedIds.length && hasAuth('delete')"
                  type="danger"
                  plain
                  @click="handleBatchDelete"
                  v-ripple
                >
                  批量删除
                </ElButton>
              </div>
            </div>
          </div>

          <div class="px-5 pt-4">
            <div
              v-if="!fileState.loading && !fileState.records.length"
              class="rounded-custom-sm border border-dashed border-[var(--default-border)] bg-[var(--default-bg-color)] px-4 py-3 text-sm text-g-600"
            >
              当前筛选下没有文件，使用顶部“上传文件”或调整筛选条件继续查看。
            </div>
          </div>

          <div class="file-table-wrap flex min-h-0 flex-1 flex-col px-5 pb-4 pt-4">
            <div class="min-h-0 flex-1">
              <ElTable
                :data="fileState.records"
                v-loading="fileState.loading"
                class="art-table-flush-bottom w-full"
                @selection-change="handleSelectionChange"
                @row-click="openPreview"
              >
                <ElTableColumn type="selection" width="52" />
                <ElTableColumn label="文件" min-width="280">
                  <template #default="{ row }">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[var(--default-border)] bg-[var(--default-bg-color)]"
                        @click.stop
                      >
                        <ElImage
                          v-if="row.kind === 'IMAGE' && imagePreviewUrlMap[row.id]"
                          :src="imagePreviewUrlMap[row.id]"
                          :preview-src-list="[imagePreviewUrlMap[row.id]]"
                          fit="cover"
                          preview-teleported
                          hide-on-click-modal
                          class="h-full w-full"
                        >
                          <template #placeholder>
                            <div class="flex h-full w-full items-center justify-center text-g-400">
                              <ArtSvgIcon icon="ri:image-line" class="text-lg" />
                            </div>
                          </template>
                          <template #error>
                            <div class="flex h-full w-full items-center justify-center text-g-500">
                              <ArtSvgIcon :icon="resolveFileKindIcon(row.kind)" class="text-xl" />
                            </div>
                          </template>
                        </ElImage>
                        <div
                          v-else
                          class="flex h-full w-full items-center justify-center text-g-700"
                        >
                          <ArtSvgIcon :icon="resolveFileKindIcon(row.kind)" class="text-xl" />
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="truncate text-sm font-medium text-g-900">{{
                          row.displayName
                        }}</div>
                        <div class="truncate text-xs text-g-500">{{ row.originalName }}</div>
                      </div>
                    </div>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="kind" label="类型" width="110" />
                <ElTableColumn label="大小" width="120">
                  <template #default="{ row }">{{ formatFileBytes(row.size) }}</template>
                </ElTableColumn>
                <ElTableColumn label="目录" min-width="120">
                  <template #default="{ row }">{{ row.folder?.name || '根目录' }}</template>
                </ElTableColumn>
                <ElTableColumn label="可见性" width="110">
                  <template #default="{ row }">
                    <ElTag size="small" :type="row.visibility === 'PUBLIC' ? 'success' : 'info'">
                      {{ row.visibility === 'PUBLIC' ? '公开' : '私有' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn label="上传时间" width="180">
                  <template #default="{ row }">{{ formatFileDateTime(row.createdAt) }}</template>
                </ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="200" align="center">
                  <template #default="{ row }">
                    <div class="flex items-center gap-0.5 whitespace-nowrap">
                      <ArtButtonTable type="view" tooltip="预览" @click="openPreview(row)" />
                      <ArtButtonTable
                        type="download"
                        tooltip="下载"
                        :disabled="!hasAuth('download')"
                        @click="handleDownload(row)"
                      />
                      <ArtButtonTable
                        type="link"
                        tooltip="公开链接"
                        :disabled="!hasAuth('publicLink')"
                        @click="handlePublicLink(row)"
                      />
                      <ArtButtonTable
                        type="delete"
                        tooltip="删除"
                        :disabled="!hasAuth('delete')"
                        @click="handleDelete(row)"
                      />
                    </div>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>

          <div class="border-t-d flex justify-center px-5 py-3">
            <ElPagination
              background
              layout="total, prev, pager, next, sizes"
              :total="fileState.total"
              :current-page="query.current"
              :page-size="query.size"
              :page-sizes="[12, 20, 40, 80]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </section>

    <ElDrawer
      v-model="previewVisible"
      :size="previewDrawerSize"
      :with-header="false"
      destroy-on-close
      @closed="handlePreviewDrawerClosed"
    >
      <div v-if="previewFile" class="flex h-full flex-col">
        <div class="px-5 py-5">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="truncate text-xl font-semibold text-g-900">{{
                previewFile.displayName
              }}</div>
              <div class="mt-2 text-sm text-g-600">{{ previewFile.originalName }}</div>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <ElTag :type="previewFile.visibility === 'PUBLIC' ? 'success' : 'info'">
                {{ previewFile.visibility === 'PUBLIC' ? '公开' : '私有' }}
              </ElTag>
              <button
                type="button"
                class="flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-g-500 transition-colors hover:bg-[var(--art-hover-color)] hover:text-g-900"
                aria-label="关闭抽屉"
                @click="closePreviewDrawer"
              >
                <ArtSvgIcon icon="ri:close-line" />
              </button>
            </div>
          </div>
        </div>

        <ElScrollbar class="flex-1">
          <div class="px-5 py-5">
            <div class="flex min-h-[220px] items-center justify-center art-surface-muted p-6">
              <img
                v-if="previewUrl && previewFile.kind === 'IMAGE'"
                :src="previewUrl"
                :alt="previewFile.displayName"
                class="max-h-[340px] art-surface-sm object-contain"
              />
              <div v-else class="text-center">
                <ArtSvgIcon
                  :icon="resolveFileKindIcon(previewFile.kind)"
                  class="text-5xl text-g-700"
                />
                <div class="mt-4 text-sm text-g-600">点击下载获取原始文件内容</div>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
              <div class="art-surface-muted p-4">
                <div class="text-xs uppercase tracking-[0.18em] text-g-500">Storage</div>
                <div class="mt-2 text-sm font-medium text-g-900">{{
                  providerLabelMap[previewFile.provider]
                }}</div>
              </div>
              <div class="art-surface-muted p-4">
                <div class="text-xs uppercase tracking-[0.18em] text-g-500">Size</div>
                <div class="mt-2 text-sm font-medium text-g-900">{{
                  formatFileBytes(previewFile.size)
                }}</div>
              </div>
              <div class="art-surface-muted p-4">
                <div class="text-xs uppercase tracking-[0.18em] text-g-500">Kind</div>
                <div class="mt-2 text-sm font-medium text-g-900">{{ previewFile.kind }}</div>
              </div>
              <div class="art-surface-muted p-4">
                <div class="text-xs uppercase tracking-[0.18em] text-g-500">Folder</div>
                <div class="mt-2 text-sm font-medium text-g-900">{{
                  previewFile.folder?.name || '根目录'
                }}</div>
              </div>
            </div>

            <div class="mt-5 art-surface-muted p-4">
              <div class="text-sm font-semibold text-g-900">元数据</div>
              <div class="mt-3 space-y-2 text-sm text-g-600">
                <div>MIME：{{ previewFile.mimeType }}</div>
                <div>对象 Key：{{ previewFile.objectKey }}</div>
                <div>上传时间：{{ formatFileDateTime(previewFile.createdAt) }}</div>
                <div>更新时间：{{ formatFileDateTime(previewFile.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </ElScrollbar>

        <div class="px-5 py-4">
          <div class="flex flex-wrap items-center justify-end gap-2">
            <ElButton
              type="primary"
              @click="handleDownload(previewFile)"
              :disabled="!hasAuth('download')"
            >
              下载
            </ElButton>
            <ElButton
              plain
              @click="handlePublicLink(previewFile)"
              :disabled="!hasAuth('publicLink')"
            >
              公开链接
            </ElButton>
            <ElButton
              plain
              type="danger"
              @click="handleDelete(previewFile)"
              :disabled="!hasAuth('delete')"
            >
              删除
            </ElButton>
          </div>
        </div>
      </div>
    </ElDrawer>

    <ArtFileFolderDialog
      v-model="folderDialogVisible"
      :mode="folderDialogMode"
      :folder-tree="folderTree"
      :initial-name="folderForm.name"
      :initial-parent-id="folderForm.parentId"
      :initial-visibility="folderForm.visibility"
      @confirm="submitFolderDialog"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import ArtFileFolderDialog from '@/components/core/forms/art-file-folder-dialog/index.vue'
  import ArtFileUpload from '@/components/core/forms/art-file-upload/index.vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { normalizeFileAccessUrl } from '@/utils/file-url'
  import {
    fetchBatchDeleteFiles,
    fetchBatchMoveFiles,
    fetchCreateFileFolder,
    fetchDeleteFileFolder,
    fetchDeleteFile,
    fetchFileDetail,
    fetchFileDownloadUrl,
    fetchFileFolderTree,
    fetchFileList,
    fetchGeneratePublicLink,
    fetchUpdateFileFolder
  } from '@/api/files'
  import { useAuth } from '@/hooks/core/useAuth'
  import { usePageFocusMode } from '@/hooks/core/usePageFocusMode'
  import {
    flattenFolderOptions,
    formatFileBytes,
    formatFileDateTime,
    resolveFileKindIcon
  } from './file-center.utils'

  type UploadMode = 'direct' | 'proxy'

  const { hasAuth } = useAuth()
  const { isFocusMode } = usePageFocusMode('system.fileCenter')

  const { width } = useWindowSize()
  const previewDrawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '480px'
  })

  const previewVisible = ref(false)
  const previewFile = ref<Api.Files.FileAssetItem | null>(null)
  const previewUrl = ref('')
  const folderTree = ref<Api.Files.FileFolderNode[]>([])
  const imagePreviewUrlMap = reactive<Record<number, string>>({})
  const selectedIds = ref<number[]>([])
  const uploadMode = ref<UploadMode>('proxy')
  const folderDialogVisible = ref(false)
  const folderDialogMode = ref<'create' | 'edit' | 'move'>('create')
  const editingFolderId = ref<number>()
  const fileState = reactive({
    loading: false,
    records: [] as Api.Files.FileAssetItem[],
    total: 0,
    summary: {
      total: 0,
      privateCount: 0,
      publicCount: 0
    }
  })
  const query = reactive<Api.Files.FileSearchParams>({
    current: 1,
    size: 12,
    keyword: '',
    folderId: undefined,
    kind: '',
    visibility: '',
    provider: '',
    status: ''
  })
  const folderForm = reactive({
    name: '',
    parentId: undefined as number | undefined,
    visibility: 'PRIVATE' as Api.Files.Visibility
  })

  const providerLabelMap: Record<Api.Files.StorageProviderType, string> = {
    ALIYUN_OSS: '阿里云 OSS',
    TENCENT_COS: '腾讯云 COS',
    QINIU: '七牛云',
    LOCAL: '本地存储'
  }

  /**
   * 将文件夹树展开为可供选择器和名称解析复用的扁平列表。
   */
  const flatFolderOptions = computed(() => {
    return flattenFolderOptions(folderTree.value)
  })

  /**
   * 获取当前选中文件夹的展示名称。
   */
  const currentFolderName = computed(() => {
    if (!query.folderId) return '全部文件'
    const folder = flatFolderOptions.value.find((item) => item.id === query.folderId)
    return folder?.label.trim() || '当前目录'
  })

  /**
   * 统计当前文件夹树中的目录数量。
   */
  const folderSummary = computed(() => {
    /**
     * 递归统计目录节点数量。
     */
    const countNodes = (items: Api.Files.FileFolderNode[]): number => {
      return items.reduce((sum, item) => sum + 1 + countNodes(item.children || []), 0)
    }

    return {
      total: countNodes(folderTree.value)
    }
  })

  /**
   * 构建文件概览卡片数据。
   */
  const summaryCards = computed(() => [
    {
      label: '总文件数',
      value: fileState.summary.total,
      valueClass: 'text-[26px] font-semibold',
      description: '当前筛选条件下的可访问资源数量'
    },
    {
      label: '私有文件',
      value: fileState.summary.privateCount,
      valueClass: 'text-[26px] font-semibold',
      description: '默认安全边界内可追踪的内部资源'
    },
    {
      label: '公开文件',
      value: fileState.summary.publicCount,
      valueClass: 'text-[26px] font-semibold',
      description: '已生成公开链接的对外分发资源'
    },
    {
      label: '当前模式',
      value: uploadMode.value === 'direct' ? '直传' : '中转',
      valueClass: 'text-[22px] font-semibold',
      description: uploadMode.value === 'direct' ? '浏览器直达云存储' : '文件先进入业务服务'
    }
  ])

  /**
   * 根据当前查询条件加载文件列表和统计摘要。
   */
  async function loadFiles() {
    fileState.loading = true
    try {
      const params: Api.Files.FileSearchParams = {
        current: query.current,
        size: query.size,
        folderId: query.folderId,
        keyword: query.keyword?.trim() || undefined,
        kind: query.kind || undefined,
        visibility: query.visibility || undefined,
        provider: query.provider || undefined,
        status: query.status || undefined
      }
      const response = await fetchFileList({
        ...params
      })
      fileState.records = response.records
      fileState.total = response.total
      fileState.summary = response.summary
      void preloadImagePreviewUrls(response.records)
    } finally {
      fileState.loading = false
    }
  }

  /**
   * 加载文件夹树。
   */
  async function loadFolders() {
    folderTree.value = await fetchFileFolderTree()
  }

  /**
   * 选择文件夹并刷新文件列表。
   * @param folderId 文件夹 ID，空值表示全部文件。
   */
  function selectFolder(folderId?: number) {
    query.folderId = folderId
    query.current = 1
    loadFiles()
  }

  /**
   * 处理文件夹树节点点击事件。
   */
  function handleFolderNodeClick(data: Api.Files.FileFolderNode) {
    selectFolder(data.id)
  }

  /**
   * 重置文件筛选条件并回到第一页。
   */
  function resetFilters() {
    query.current = 1
    query.size = 12
    query.keyword = ''
    query.kind = ''
    query.visibility = ''
    query.provider = ''
    query.status = ''
    loadFiles()
  }

  /**
   * 同步表格选中的文件 ID。
   */
  function handleSelectionChange(rows: Api.Files.FileAssetItem[]) {
    selectedIds.value = rows.map((item) => item.id)
  }

  /**
   * 预加载图片文件的临时预览地址。
   */
  async function preloadImagePreviewUrls(records: Api.Files.FileAssetItem[]) {
    const imageRecords = records.filter(
      (item) => item.kind === 'IMAGE' && !imagePreviewUrlMap[item.id]
    )

    await Promise.all(
      imageRecords.map(async (item) => {
        try {
          const download = await fetchFileDownloadUrl(item.id)
          imagePreviewUrlMap[item.id] = normalizeFileAccessUrl(download.url)
        } catch {
          imagePreviewUrlMap[item.id] = ''
        }
      })
    )
  }

  /**
   * 上传完成后刷新文件列表和目录统计。
   */
  async function handleUploadSuccess() {
    await Promise.all([loadFiles(), loadFolders()])
  }

  /**
   * 打开文件预览抽屉并加载文件详情。
   */
  async function openPreview(item: Api.Files.FileAssetItem) {
    previewVisible.value = true
    previewUrl.value = ''
    previewFile.value = await fetchFileDetail(item.id)
    if (previewFile.value.kind === 'IMAGE') {
      try {
        if (!imagePreviewUrlMap[item.id]) {
          const download = await fetchFileDownloadUrl(item.id)
          imagePreviewUrlMap[item.id] = normalizeFileAccessUrl(download.url)
        }
        previewUrl.value = imagePreviewUrlMap[item.id]
      } catch {
        previewUrl.value = ''
      }
    }
  }

  /**
   * 关闭预览抽屉并清理当前预览状态。
   */
  function closePreviewDrawer() {
    previewVisible.value = false
  }

  /**
   * 抽屉关闭完成后清理预览内容，避免残留旧数据。
   */
  function handlePreviewDrawerClosed() {
    previewFile.value = null
    previewUrl.value = ''
  }

  /**
   * 获取文件下载地址并在新窗口打开。
   */
  async function handleDownload(item: Api.Files.FileAssetItem) {
    const response = await fetchFileDownloadUrl(item.id)
    window.open(response.url, '_blank', 'noopener,noreferrer')
  }

  /**
   * 生成公开访问链接并复制到剪贴板。
   */
  async function handlePublicLink(item: Api.Files.FileAssetItem) {
    const response = await fetchGeneratePublicLink(item.id)
    await navigator.clipboard.writeText(response.publicUrl)
    ElMessage.success('公开链接已复制')
    await loadFiles()
    if (previewFile.value?.id === item.id) {
      previewFile.value = await fetchFileDetail(item.id)
    }
  }

  /**
   * 删除单个文件并刷新列表和目录统计。
   */
  async function handleDelete(item: Api.Files.FileAssetItem) {
    await ElMessageBox.confirm(`确认删除文件“${item.displayName}”吗？`, '删除文件', {
      type: 'warning'
    })
    await fetchDeleteFile(item.id)
    previewVisible.value = previewFile.value?.id === item.id ? false : previewVisible.value
    selectedIds.value = selectedIds.value.filter((id) => id !== item.id)
    await Promise.all([loadFiles(), loadFolders()])
  }

  /**
   * 打开新建当前目录下文件夹的弹窗。
   */
  function openCreateFolderDialog() {
    folderDialogMode.value = 'create'
    editingFolderId.value = undefined
    folderForm.name = ''
    folderForm.parentId = query.folderId
    folderForm.visibility = 'PRIVATE'
    folderDialogVisible.value = true
  }

  /**
   * 打开新建子文件夹弹窗。
   */
  function openCreateChildFolderDialog(folder: Api.Files.FileFolderNode) {
    folderDialogMode.value = 'create'
    editingFolderId.value = undefined
    folderForm.name = ''
    folderForm.parentId = folder.id
    folderForm.visibility = folder.visibility
    folderDialogVisible.value = true
  }

  /**
   * 打开编辑文件夹弹窗并回填目录信息。
   */
  function openEditFolderDialog(folder: Api.Files.FileFolderNode) {
    folderDialogMode.value = 'edit'
    editingFolderId.value = folder.id
    folderForm.name = folder.name
    folderForm.parentId = folder.parentId ?? undefined
    folderForm.visibility = folder.visibility
    folderDialogVisible.value = true
  }

  /**
   * 打开批量移动文件弹窗。
   */
  function openBatchMoveDialog() {
    folderDialogMode.value = 'move'
    editingFolderId.value = undefined
    folderForm.parentId = query.folderId
    folderDialogVisible.value = true
  }

  /**
   * 根据文件夹操作菜单命令分发对应动作。
   */
  function handleFolderCommand(
    folder: Api.Files.FileFolderNode,
    command: 'create' | 'edit' | 'delete'
  ) {
    if (command === 'create') {
      openCreateChildFolderDialog(folder)
      return
    }

    if (command === 'edit') {
      openEditFolderDialog(folder)
      return
    }

    void handleDeleteFolder(folder)
  }

  /**
   * 删除文件夹并在必要时回到全部文件视图。
   */
  async function handleDeleteFolder(folder: Api.Files.FileFolderNode) {
    await ElMessageBox.confirm(`确认删除目录“${folder.name}”吗？`, '删除目录', {
      type: 'warning'
    })
    await fetchDeleteFileFolder(folder.id)
    if (query.folderId === folder.id) {
      selectFolder(undefined)
    }
    await loadFolders()
  }

  /**
   * 提交文件夹弹窗，按当前模式执行新建、编辑或批量移动。
   */
  async function submitFolderDialog(payload: {
    name: string
    parentId?: number
    visibility: Api.Files.Visibility
  }) {
    if (folderDialogMode.value === 'create') {
      await fetchCreateFileFolder({
        name: payload.name,
        parentId: payload.parentId,
        visibility: payload.visibility
      })
      folderDialogVisible.value = false
      await loadFolders()
      return
    }

    if (folderDialogMode.value === 'edit') {
      if (!editingFolderId.value) {
        ElMessage.warning('目录信息不存在')
        return
      }
      await fetchUpdateFileFolder(editingFolderId.value, {
        name: payload.name,
        visibility: payload.visibility
      })
      folderDialogVisible.value = false
      await loadFolders()
      return
    }

    if (!selectedIds.value.length) {
      ElMessage.warning('请先选择文件')
      return
    }
    if (!payload.parentId) {
      ElMessage.warning('请选择目标目录')
      return
    }
    await fetchBatchMoveFiles({
      ids: selectedIds.value,
      folderId: payload.parentId
    })
    folderDialogVisible.value = false
    selectedIds.value = []
    await loadFiles()
  }

  /**
   * 批量删除已选文件。
   */
  async function handleBatchDelete() {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 个文件吗？`,
      '批量删除',
      {
        type: 'warning'
      }
    )
    await fetchBatchDeleteFiles({ ids: selectedIds.value })
    selectedIds.value = []
    await Promise.all([loadFiles(), loadFolders()])
  }

  /**
   * 切换文件列表当前页。
   */
  function handleCurrentChange(current: number) {
    query.current = current
    loadFiles()
  }

  /**
   * 切换文件列表分页大小。
   */
  function handleSizeChange(size: number) {
    query.size = size
    query.current = 1
    loadFiles()
  }

  onMounted(async () => {
    await Promise.all([loadFolders(), loadFiles()])
  })
</script>

<style scoped lang="scss">
  .file-table-wrap :deep(.el-table) {
    height: 420px;
    max-height: calc(100vh - 360px);
  }

  .art-full-height {
    .file-center-grid {
      grid-template-rows: 1fr;
    }

    .file-table-wrap {
      :deep(.el-table) {
        height: 100% !important;
        max-height: none !important;
      }

      > div {
        height: 0;
      }
    }
  }
</style>
