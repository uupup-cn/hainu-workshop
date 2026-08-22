<template>
  <ElDrawer
    v-model="drawerVisible"
    :title="drawerTitle"
    :size="drawerSize"
    destroy-on-close
    @close="handleDrawerClose"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-width="isMobileLayout ? 'auto' : '92px'"
      :label-position="isMobileLayout ? 'top' : 'right'"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <ElFormItem label="内容标题" prop="title">
          <ElInput v-model.trim="form.title" maxlength="150" placeholder="请输入内容标题" />
        </ElFormItem>
        <ElFormItem label="内容别名">
          <ElInput v-model.trim="form.slug" maxlength="180" placeholder="为空时自动生成" />
        </ElFormItem>
        <ElFormItem label="内容类型" prop="contentType">
          <ElSelect v-model="form.contentType" class="w-full">
            <ElOption
              v-for="item in contentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="内容分类" prop="categoryId">
          <ElSelect v-model="form.categoryId" class="w-full" clearable placeholder="请选择内容分类">
            <ElOption
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="所属频道" prop="channel">
          <ElSelect
            v-model="form.channel"
            class="w-full"
            allow-create
            filterable
            default-first-option
          >
            <ElOption v-for="item in channelOptions" :key="item" :label="item" :value="item" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="作者" prop="author">
          <ElInput v-model.trim="form.author" maxlength="60" placeholder="请输入作者 / 负责人" />
        </ElFormItem>
        <ElFormItem label="可见范围" prop="visibility">
          <ElSelect v-model="form.visibility" class="w-full">
            <ElOption
              v-for="item in visibilityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="当前状态" prop="status">
          <ElSelect v-model="form.status" class="w-full">
            <ElOption
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="内容来源">
          <ElInput
            v-model.trim="form.source"
            maxlength="255"
            placeholder="如：原创 / 市场部 / 第三方授权"
          />
        </ElFormItem>
      </div>

      <ElFormItem label="封面图片" prop="coverUrl">
        <ArtImageAssetField
          v-model="form.coverUrl"
          picker-title="选择内容封面"
          placeholder="选择封面"
          unavailable-text="封面暂不可预览"
          size-class="h-[115px] w-[205px]"
        />
      </ElFormItem>

      <ElFormItem label="内容摘要" prop="summary">
        <ElInput
          v-model.trim="form.summary"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="用于列表卡片、搜索摘要和投放场景"
        />
      </ElFormItem>

      <div class="grid gap-4 md:grid-cols-2">
        <ElFormItem label="内容标签">
          <ElSelect
            v-model="form.tags"
            class="w-full"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择内容标签"
          >
            <ElOption
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="SEO 关键词">
          <ElSelect
            v-model="form.seoKeywords"
            class="w-full"
            multiple
            filterable
            allow-create
            default-first-option
            collapse-tags
            collapse-tags-tooltip
            placeholder="用于搜索引擎优化"
          >
            <ElOption
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </ElSelect>
        </ElFormItem>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <ElFormItem label="SEO 标题">
          <ElInput
            v-model.trim="form.seoTitle"
            maxlength="150"
            placeholder="可选，默认继承内容标题"
          />
        </ElFormItem>
        <ElFormItem label="SEO 描述">
          <ElInput
            v-model.trim="form.seoDescription"
            maxlength="255"
            placeholder="可选，建议突出商业价值与检索关键词"
          />
        </ElFormItem>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <ElFormItem label="内容排序">
          <ElInputNumber v-model="form.sort" class="!w-full" :min="1" :max="9999" />
        </ElFormItem>
        <ElFormItem label="发布时间">
          <ElDatePicker
            v-model="form.publishedAt"
            class="w-full"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            placeholder="可选"
          />
        </ElFormItem>
        <ElFormItem label="下线时间">
          <ElDatePicker
            v-model="form.offlineAt"
            class="w-full"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            placeholder="可选"
          />
        </ElFormItem>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <ElFormItem label="浏览量">
          <ElInputNumber v-model="form.viewCount" class="!w-full" :min="0" />
        </ElFormItem>
        <ElFormItem label="点赞量">
          <ElInputNumber v-model="form.likeCount" class="!w-full" :min="0" />
        </ElFormItem>
        <ElFormItem label="评论量">
          <ElInputNumber v-model="form.commentCount" class="!w-full" :min="0" />
        </ElFormItem>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <ElFormItem label="收藏量">
          <ElInputNumber v-model="form.favoriteCount" class="!w-full" :min="0" />
        </ElFormItem>
        <ElFormItem label="置顶推荐">
          <div class="flex items-center gap-4">
            <ElSwitch v-model="form.isTop" active-text="置顶" />
            <ElSwitch v-model="form.isRecommended" active-text="推荐" />
          </div>
        </ElFormItem>
        <ElFormItem label="评论设置">
          <ElSwitch v-model="form.allowComment" active-text="允许评论" />
        </ElFormItem>
      </div>

      <ElFormItem label="内容正文" prop="content">
        <ArtWangEditor v-model="form.content" height="320px" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div
        class="flex flex-col gap-3 border-t border-[var(--default-border)] pt-4 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-xs text-g-500">保存后可继续在列表中执行发布、下线和经营管理操作。</div>
        <div class="flex flex-col-reverse gap-3 sm:flex-row">
          <ElButton class="w-full sm:w-auto" @click="drawerVisible = false">取消</ElButton>
          <ElButton
            type="primary"
            class="w-full sm:w-auto"
            :loading="submitting"
            @click="handleSubmit"
          >
            保存内容
          </ElButton>
        </div>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  import type { FormInstance, FormRules } from 'element-plus'
  import ArtImageAssetField from '@/components/core/forms/art-image-asset-field/index.vue'
  import { fetchContentDetail, fetchCreateContent, fetchUpdateContent } from '@/api/content'
  import {
    cleanContentStringArray,
    createDefaultContentPayload,
    isContentRichTextEmpty,
    mapContentDetailToPayload,
    type SelectOption
  } from '../../shared'

  type ContentPayload = Api.Content.Payload
  type DrawerMode = 'create' | 'edit'

  defineProps<{
    contentTypeOptions: readonly SelectOption<Api.Content.ContentType>[]
    categoryOptions: Api.Content.CategoryItem[]
    channelOptions: readonly string[]
    statusOptions: readonly SelectOption<Api.Content.ContentStatus>[]
    visibilityOptions: readonly SelectOption<Api.Content.ContentVisibility>[]
    tagOptions: Api.Content.TagItem[]
  }>()

  const emit = defineEmits<{
    (e: 'saved'): void
  }>()

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  const { width } = useWindowSize()
  const isMobileLayout = computed(() => width.value < 768)
  const drawerTitle = computed(() => (drawerMode.value === 'create' ? '新建内容' : '编辑内容'))

  /**
   * 根据窗口宽度返回适合当前设备的抽屉宽度。
   */
  const drawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '880px'
  })

  const submitting = ref(false)
  const drawerVisible = ref(false)
  const drawerMode = ref<DrawerMode>('create')
  const editingId = ref<number>()
  const formRef = ref<FormInstance>()
  const form = reactive<ContentPayload>(createDefaultContentPayload())

  const rules = reactive<FormRules>({
    title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
    contentType: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
    categoryId: [{ required: true, message: '请选择内容分类', trigger: 'change' }],
    channel: [{ required: true, message: '请选择内容频道', trigger: 'change' }],
    author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
    visibility: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    coverUrl: [{ required: true, message: '请选择封面图片', trigger: 'change' }],
    summary: [{ required: true, message: '请输入内容摘要', trigger: 'blur' }],
    content: [
      {
        validator: (_rule, value, callback) => {
          if (isContentRichTextEmpty(value || '')) {
            callback(new Error('请输入内容正文'))
            return
          }
          callback()
        },
        trigger: 'change'
      }
    ]
  })

  /**
   * 重置抽屉表单、上传状态和校验提示。
   */
  const resetForm = () => {
    Object.assign(form, createDefaultContentPayload())
    editingId.value = undefined
    nextTick(() => formRef.value?.clearValidate())
  }

  /**
   * 打开新建抽屉，并恢复到默认表单。
   */
  const openCreate = () => {
    drawerMode.value = 'create'
    resetForm()
    drawerVisible.value = true
  }

  /**
   * 根据内容详情填充编辑表单，保持抽屉组件只处理表单状态。
   */
  const applyDetailToForm = (detail: Api.Content.Item) => {
    Object.assign(form, mapContentDetailToPayload(detail))
  }

  /**
   * 打开编辑抽屉，并按内容 ID 拉取详情后回填表单。
   */
  const openEdit = async (id: number) => {
    drawerMode.value = 'edit'
    resetForm()
    editingId.value = id
    const detail = await fetchContentDetail(id)
    applyDetailToForm(detail)
    drawerVisible.value = true
  }

  /**
   * 规范化表单数据，清理空白字符串和无效数组项后再提交接口。
   */
  const normalizePayload = (): ContentPayload => ({
    ...form,
    title: form.title.trim(),
    slug: form.slug?.trim() || undefined,
    channel: form.channel.trim(),
    author: form.author.trim(),
    coverUrl: form.coverUrl?.trim() || undefined,
    summary: form.summary?.trim() || undefined,
    content: form.content.trim(),
    source: form.source?.trim() || undefined,
    seoTitle: form.seoTitle?.trim() || undefined,
    seoDescription: form.seoDescription?.trim() || undefined,
    tags: cleanContentStringArray(form.tags),
    seoKeywords: cleanContentStringArray(form.seoKeywords),
    publishedAt: form.publishedAt || undefined,
    offlineAt: form.offlineAt || undefined
  })

  /**
   * 校验并提交内容表单，根据抽屉模式选择新增或更新接口。
   */
  const handleSubmit = async () => {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    submitting.value = true

    try {
      const payload = normalizePayload()
      if (drawerMode.value === 'create') {
        await fetchCreateContent(payload)
      } else if (editingId.value) {
        await fetchUpdateContent(editingId.value, payload)
      }

      drawerVisible.value = false
      emit('saved')
    } finally {
      submitting.value = false
    }
  }

  /**
   * 关闭抽屉时统一回收表单状态，避免二次打开时残留旧数据。
   */
  const handleDrawerClose = () => {
    resetForm()
  }

  defineExpose({
    openCreate,
    openEdit
  })
</script>
