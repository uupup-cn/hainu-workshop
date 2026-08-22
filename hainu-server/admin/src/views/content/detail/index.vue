<template>
  <div class="content-detail page-content">
    <div
      class="mx-auto mt-10 max-w-[960px] rounded-custom-sm border border-[var(--default-border)] bg-box px-6 py-8 md:px-8"
    >
      <div v-if="loading" class="py-16 text-center text-sm text-g-500">内容加载中...</div>
      <div v-else-if="error" class="py-16 text-center text-sm text-danger">{{ error }}</div>
      <template v-else>
        <div class="flex flex-wrap items-center gap-3 text-sm text-g-500">
          <span>{{ contentMeta.contentType }}</span>
          <span>{{ contentMeta.channel }}</span>
          <span>作者 {{ contentMeta.author }}</span>
          <span>
            {{ contentMeta.publishedAt ? `发布于 ${contentMeta.publishedAt}` : '草稿预览' }}
          </span>
        </div>
        <h1 class="mt-4 text-3xl font-semibold text-g-900">{{ contentTitle }}</h1>
        <p
          v-if="contentSummary"
          class="mt-4 rounded-[var(--custom-radius)] bg-[var(--default-bg-color)] px-4 py-3 text-sm leading-6 text-g-600"
        >
          {{ contentSummary }}
        </p>
        <div class="markdown-body mt-10" v-highlight v-html="contentHtml"></div>
      </template>
    </div>
    <ArtBackToTop />
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/core/md.scss'
  import '@/assets/styles/custom/one-dark-pro.scss'
  import { useCommon } from '@/hooks/core/useCommon'
  import { fetchContentDetail } from '@/api/content'
  import { buildContentPreviewMeta, createDefaultContentPreviewMeta } from '../shared'

  defineOptions({ name: 'ContentDetail' })

  const route = useRoute()
  const contentId = computed(() => Number(route.params.id))
  const contentTitle = ref('')
  const contentSummary = ref('')
  const contentHtml = shallowRef('')
  const contentMeta = reactive(createDefaultContentPreviewMeta())
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 重置页面展示状态，避免路由参数异常时残留上一条内容的数据。
   */
  const resetPreviewState = () => {
    contentTitle.value = ''
    contentSummary.value = ''
    contentHtml.value = ''
    Object.assign(contentMeta, createDefaultContentPreviewMeta())
  }

  /**
   * 将内容详情数据映射到页面展示状态，保持模板层只消费干净的数据。
   */
  const applyContentDetail = (data: Api.Content.Item) => {
    contentTitle.value = data.title
    contentSummary.value = data.summary || ''
    contentHtml.value = data.content || '<p>暂无内容</p>'
    Object.assign(contentMeta, buildContentPreviewMeta(data))
  }

  /**
   * 按路由中的内容 ID 拉取详情，并处理加载态和错误态。
   */
  const loadContentPreview = async () => {
    if (!contentId.value) {
      resetPreviewState()
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchContentDetail(contentId.value)
      applyContentDetail(data)
    } catch (err) {
      error.value = '内容加载失败'
      console.error('获取内容详情失败:', err)
    } finally {
      loading.value = false
    }
  }

  const { scrollToTop } = useCommon()

  /**
   * 初始化页面滚动位置，避免从列表跳转后保留旧滚动条位置。
   */
  const initializePage = () => {
    scrollToTop()
  }

  watch(
    contentId,
    () => {
      initializePage()
      void loadContentPreview()
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .content-detail {
    :deep(.markdown-body) {
      img {
        width: 100%;
        border: 1px solid var(--art-gray-200);
      }

      pre {
        position: relative;

        &:hover {
          .copy-button {
            opacity: 1;
          }
        }
      }

      .code-wrapper {
        overflow-x: auto;
      }

      .copy-button {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 20px;
        line-height: 40px;
        color: #999;
        text-align: center;
        cursor: pointer;
        background-color: #000;
        border: none;
        border-radius: 8px;
        opacity: 0;
        transition: all 0.2s;
      }
    }
  }
</style>
