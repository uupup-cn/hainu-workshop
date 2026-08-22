<template>
  <div class="space-y-4 pb-2">
    <ArtPageHero
      size="sm"
      align="center"
      title="资源选择器"
      description="复用系统文件中心的目录、搜索、上传和分页能力，适合商品图、详情图、视频素材、附件等业务资源选择场景。"
      right-class="grid gap-2 sm:grid-cols-3 xl:w-[300px]"
    >
      <template #right>
        <div
          v-for="item in overview"
          :key="item.label"
          class="grid min-h-[58px] gap-1 rounded-[var(--custom-radius)] border border-[var(--default-border)] bg-g-100/80 px-3 py-2.5"
        >
          <div class="text-base font-semibold leading-none text-g-900">{{ item.value }}</div>
          <div class="text-xs text-g-500">{{ item.label }}</div>
        </div>
      </template>
    </ArtPageHero>

    <section class="grid gap-4 xl:grid-cols-2">
      <div class="art-surface-sm p-4">
        <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-base font-semibold text-g-900">商品主图</h3>
            <p class="mt-1 text-sm text-g-600">
              单选图片资源，确认后生成可访问链接，常用于商品封面、分类图标和品牌 Logo。
            </p>
          </div>
          <ElButton type="primary" plain @click="imagePickerVisible = true">
            <ArtSvgIcon icon="ri:image-add-line" class="mr-1 text-base" />
            选择图片
          </ElButton>
        </div>

        <div
          class="grid min-h-[156px] place-items-start justify-items-start rounded-custom-sm border border-dashed border-[var(--default-border)] bg-g-100/70 p-3"
        >
          <div
            v-if="singleImageUrl"
            class="size-[132px] overflow-hidden rounded-custom-sm border border-[var(--default-border)] bg-[var(--default-box-color)]"
          >
            <ElImage
              :src="singleImageUrl"
              fit="cover"
              class="h-full w-full"
              preview-teleported
              :preview-src-list="[singleImageUrl]"
            />
          </div>
        </div>
      </div>

      <div class="art-surface-sm p-4">
        <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-base font-semibold text-g-900">视频资源</h3>
            <p class="mt-1 text-sm text-g-600">
              固定视频类型，适合商品介绍、活动素材和内容模块的视频引用。
            </p>
          </div>
          <ElButton type="primary" plain @click="videoPickerVisible = true">
            <ArtSvgIcon icon="ri:movie-line" class="mr-1 text-base" />
            选择视频
          </ElButton>
        </div>

        <div class="rounded-custom-sm border border-[var(--default-border)] bg-g-100/70 p-3">
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-custom-sm bg-g-200">
              <ArtSvgIcon icon="ri:movie-line" class="text-xl text-g-700" />
            </div>
            <div class="min-w-0">
              <div class="truncate text-sm font-medium text-g-900">
                {{ videoFile?.displayName || '暂无视频' }}
              </div>
              <div class="mt-1 text-xs text-g-500">
                {{ videoFile ? formatFileMeta(videoFile) : '从资源选择器中选择或上传视频' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="art-surface-sm p-4">
      <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="text-base font-semibold text-g-900">图集多选</h3>
          <p class="mt-1 text-sm text-g-600">
            多选图片并限制数量，适合商品轮播图、详情素材和评价凭证。
          </p>
        </div>
        <ElButton type="primary" plain @click="galleryPickerVisible = true">
          <ArtSvgIcon icon="ri:gallery-line" class="mr-1 text-base" />
          选择图集
        </ElButton>
      </div>

      <div class="flex flex-wrap gap-3">
        <div
          v-for="(url, index) in galleryUrls"
          :key="url"
          class="group relative size-[132px] overflow-hidden rounded-custom-sm border border-[var(--default-border)] bg-g-100"
        >
          <ElImage
            :src="url"
            fit="cover"
            class="h-full w-full"
            preview-teleported
            :preview-src-list="galleryUrls"
            :initial-index="index"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-g-900/70 px-2 py-1 text-xs text-g-100">
            图片 {{ index + 1 }}
          </div>
        </div>
        <button
          type="button"
          class="grid size-[132px] place-items-center rounded-custom-sm border border-dashed border-[var(--default-border)] bg-g-100/70 text-sm text-g-500 transition-colors hover:border-[var(--theme-color)] hover:text-primary"
          @click="galleryPickerVisible = true"
        >
          <span class="flex flex-col items-center gap-1 text-center">
            <ArtSvgIcon icon="ri:add-line" class="text-2xl" />
            <span>添加图片</span>
          </span>
        </button>
      </div>
    </section>

    <section class="art-surface-sm p-4">
      <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="text-base font-semibold text-g-900">通用资源</h3>
          <p class="mt-1 text-sm text-g-600">
            不限制资源类型，可选择图片、视频、文档、压缩包等文件，适合配置附件和运营素材。
          </p>
        </div>
        <ElButton type="primary" plain @click="resourcePickerVisible = true">
          <ArtSvgIcon icon="ri:file-search-line" class="mr-1 text-base" />
          选择资源
        </ElButton>
      </div>

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="file in resourceFiles"
          :key="file.id"
          class="rounded-custom-sm border border-[var(--default-border)] bg-g-100/70 p-3"
        >
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-custom-sm bg-g-200">
              <ArtSvgIcon :icon="resolveFileKindIcon(file.kind)" class="text-xl text-g-700" />
            </div>
            <div class="min-w-0">
              <div class="truncate text-sm font-medium text-g-900">{{ file.displayName }}</div>
              <div class="mt-1 text-xs text-g-500">{{ formatFileMeta(file) }}</div>
            </div>
          </div>
        </article>
        <div
          v-if="!resourceFiles.length"
          class="rounded-custom-sm border border-dashed border-[var(--default-border)] bg-g-100/70 p-3 text-sm text-g-500"
        >
          暂未选择通用资源
        </div>
      </div>
    </section>

    <ArtAssetPicker
      v-model="imagePickerVisible"
      title="选择商品主图"
      fixed-kind="IMAGE"
      upload-accept="image/*"
      @confirm="handleSingleImageConfirm"
    />

    <ArtAssetPicker
      v-model="galleryPickerVisible"
      title="选择商品图集"
      multiple
      :max="8"
      fixed-kind="IMAGE"
      upload-accept="image/*"
      @confirm="handleGalleryConfirm"
    />

    <ArtAssetPicker
      v-model="videoPickerVisible"
      title="选择视频资源"
      fixed-kind="VIDEO"
      upload-accept="video/*"
      @confirm="handleVideoConfirm"
    />

    <ArtAssetPicker
      v-model="resourcePickerVisible"
      title="选择通用资源"
      multiple
      :max="6"
      :image-only="false"
      upload-accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
      @confirm="handleResourceConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { fetchGeneratePublicLink } from '@/api/files'
  import ArtAssetPicker from '@/components/core/forms/art-asset-picker/index.vue'
  import { normalizeFileAccessUrl } from '@/utils/file-url'

  defineOptions({ name: 'ResourceSelect' })

  const imagePickerVisible = ref(false)
  const galleryPickerVisible = ref(false)
  const videoPickerVisible = ref(false)
  const resourcePickerVisible = ref(false)
  const singleImageUrl = ref('')
  const galleryUrls = ref<string[]>([])
  const videoFile = ref<Api.Files.FileAssetItem | null>(null)
  const resourceFiles = ref<Api.Files.FileAssetItem[]>([])

  const overview = computed(() => [
    { label: '选择模式', value: '4' },
    { label: '图集上限', value: `${galleryUrls.value.length}/8` },
    { label: '通用资源', value: `${resourceFiles.value.length}/6` }
  ])

  async function handleSingleImageConfirm(files: Api.Files.FileAssetItem[]) {
    const file = files[0]
    if (!file) return
    singleImageUrl.value = await generatePublicUrl(file)
    ElMessage.success('商品主图已更新')
  }

  async function handleGalleryConfirm(files: Api.Files.FileAssetItem[]) {
    const urls = await Promise.all(files.map(generatePublicUrl))
    galleryUrls.value = uniqueValues([...galleryUrls.value, ...urls]).slice(0, 8)
    ElMessage.success(`已选择 ${galleryUrls.value.length} 张图片`)
  }

  function handleVideoConfirm(files: Api.Files.FileAssetItem[]) {
    videoFile.value = files[0] ?? null
    if (videoFile.value) {
      ElMessage.success('视频资源已选择')
    }
  }

  function handleResourceConfirm(files: Api.Files.FileAssetItem[]) {
    const existed = new Set(resourceFiles.value.map((item) => item.id))
    const next = [...resourceFiles.value]
    for (const file of files) {
      if (!existed.has(file.id) && next.length < 6) {
        next.push(file)
        existed.add(file.id)
      }
    }
    resourceFiles.value = next
    ElMessage.success(`已选择 ${resourceFiles.value.length} 个资源`)
  }

  async function generatePublicUrl(file: Api.Files.FileAssetItem) {
    const response = await fetchGeneratePublicLink(file.id)
    return normalizeFileAccessUrl(response.publicUrl)
  }

  function uniqueValues(values: string[]) {
    return Array.from(new Set(values.filter(Boolean)))
  }

  function formatFileMeta(file: Api.Files.FileAssetItem) {
    return `${kindLabelMap[file.kind]} · ${formatFileSize(file.size)}`
  }

  function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
    return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
  }

  const kindLabelMap: Record<Api.Files.Kind, string> = {
    IMAGE: '图片',
    VIDEO: '视频',
    AUDIO: '音频',
    DOCUMENT: '文档',
    ARCHIVE: '压缩包',
    OTHER: '其他'
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
