export type ContentType = Api.Content.ContentType
export type ContentStatus = Api.Content.ContentStatus
export type ContentVisibility = Api.Content.ContentVisibility
export type ContentFeature = '' | 'top' | 'recommended' | 'comment'
export type StatusTabValue = '' | ContentStatus

export interface ContentFilters {
  keyword: string
  contentType: '' | ContentType
  categoryId?: number
  channel: string
  status: '' | ContentStatus
  visibility: '' | ContentVisibility
  author: string
  feature: ContentFeature
}

export interface ContentPreviewMeta {
  contentType: string
  channel: string
  author: string
  publishedAt: string
}

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

export const CONTENT_TYPE_OPTIONS = [
  { label: '文章', value: 'ARTICLE' },
  { label: '新闻', value: 'NEWS' },
  { label: '公告', value: 'NOTICE' },
  { label: '案例', value: 'CASE_STUDY' },
  { label: '帮助中心', value: 'HELP_CENTER' }
] as const satisfies readonly SelectOption<ContentType>[]

export const CONTENT_STATUS_OPTIONS = [
  { label: '草稿', value: 'DRAFT' },
  { label: '审核中', value: 'REVIEWING' },
  { label: '已发布', value: 'PUBLISHED' },
  { label: '已下线', value: 'OFFLINE' }
] as const satisfies readonly SelectOption<ContentStatus>[]

export const CONTENT_VISIBILITY_OPTIONS = [
  { label: '公开', value: 'PUBLIC' },
  { label: '内部可见', value: 'INTERNAL' },
  { label: '私密', value: 'PRIVATE' }
] as const satisfies readonly SelectOption<ContentVisibility>[]

export const CONTENT_FEATURE_OPTIONS = [
  { label: '置顶内容', value: 'top' },
  { label: '推荐内容', value: 'recommended' },
  { label: '允许评论', value: 'comment' }
] as const satisfies readonly SelectOption<Exclude<ContentFeature, ''>>[]

export const CONTENT_CHANNEL_OPTIONS = [
  '官网内容',
  '活动专题',
  '产品增长',
  '品牌资讯',
  '帮助中心',
  '客户案例'
] as const

export const CONTENT_TYPE_LABEL_MAP: Record<ContentType, string> = {
  ARTICLE: '文章',
  NEWS: '新闻',
  NOTICE: '公告',
  CASE_STUDY: '案例',
  HELP_CENTER: '帮助中心'
}

export const CONTENT_STATUS_LABEL_MAP: Record<ContentStatus, string> = {
  DRAFT: '草稿',
  REVIEWING: '审核中',
  PUBLISHED: '已发布',
  OFFLINE: '已下线'
}

export const CONTENT_VISIBILITY_LABEL_MAP: Record<ContentVisibility, string> = {
  PUBLIC: '公开',
  INTERNAL: '内部可见',
  PRIVATE: '私密'
}

export const CONTENT_STATUS_TAG_TYPE_MAP: Record<
  ContentStatus,
  'info' | 'warning' | 'success' | 'danger'
> = {
  DRAFT: 'info',
  REVIEWING: 'warning',
  PUBLISHED: 'success',
  OFFLINE: 'danger'
}

export const QUICK_STATUS_TABS: Array<{ label: string; value: StatusTabValue }> = [
  { label: '全部内容', value: '' },
  { label: '草稿池', value: 'DRAFT' },
  { label: '待发布', value: 'REVIEWING' },
  { label: '线上内容', value: 'PUBLISHED' },
  { label: '下线内容', value: 'OFFLINE' }
]

/**
 * 创建内容列表页默认筛选项，确保重置行为和初始化行为一致。
 */
export const createDefaultContentFilters = (): ContentFilters => ({
  keyword: '',
  contentType: '',
  categoryId: undefined,
  channel: '',
  status: '',
  visibility: '',
  author: '',
  feature: ''
})

/**
 * 创建内容经营概览默认值，避免页面初次渲染时出现空对象判断分支。
 */
export const createDefaultContentOverview = (): Api.Content.Overview => ({
  total: 0,
  draft: 0,
  reviewing: 0,
  published: 0,
  offline: 0,
  topCount: 0,
  recommended: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0,
  totalFavorites: 0
})

/**
 * 创建内容编辑表单默认值，统一新建和重置场景的初始状态。
 */
export const createDefaultContentPayload = (): Api.Content.Payload => ({
  title: '',
  slug: '',
  contentType: 'ARTICLE',
  categoryId: undefined,
  channel: '官网内容',
  status: 'DRAFT',
  visibility: 'PUBLIC',
  author: '内容运营',
  coverUrl: '',
  summary: '',
  content: '',
  source: '原创',
  tags: [],
  seoKeywords: [],
  seoTitle: '',
  seoDescription: '',
  isTop: false,
  isRecommended: false,
  allowComment: true,
  sort: 100,
  publishedAt: '',
  offlineAt: '',
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  favoriteCount: 0
})

/**
 * 将详情接口数据映射为编辑表单结构，避免抽屉组件中重复写字段回填逻辑。
 */
export const mapContentDetailToPayload = (detail: Api.Content.Item): Api.Content.Payload => ({
  title: detail.title,
  slug: detail.slug,
  contentType: detail.contentType,
  categoryId: detail.categoryId || undefined,
  channel: detail.channel,
  status: detail.status,
  visibility: detail.visibility,
  author: detail.author,
  coverUrl: detail.coverUrl || '',
  summary: detail.summary || '',
  content: detail.content,
  source: detail.source || '',
  tags: detail.tags || [],
  seoKeywords: detail.seoKeywords || [],
  seoTitle: detail.seoTitle || '',
  seoDescription: detail.seoDescription || '',
  isTop: detail.isTop,
  isRecommended: detail.isRecommended,
  allowComment: detail.allowComment,
  sort: detail.sort,
  publishedAt: detail.publishedAt || '',
  offlineAt: detail.offlineAt || '',
  viewCount: detail.viewCount,
  likeCount: detail.likeCount,
  commentCount: detail.commentCount,
  favoriteCount: detail.favoriteCount
})

/**
 * 创建内容预览页元信息默认值，保证骨架屏和错误态之前也能稳定渲染。
 */
export const createDefaultContentPreviewMeta = (): ContentPreviewMeta => ({
  contentType: '-',
  channel: '-',
  author: '-',
  publishedAt: ''
})

/**
 * 将内容详情映射为预览页头部元信息，统一内容类型文案转换。
 */
export const buildContentPreviewMeta = (detail: Api.Content.Item): ContentPreviewMeta => ({
  contentType: CONTENT_TYPE_LABEL_MAP[detail.contentType],
  channel: detail.channel,
  author: detail.author,
  publishedAt: detail.publishedAt || ''
})

/**
 * 统一格式化经营数据数值，避免页面间出现不同的千分位展示风格。
 */
export const formatContentNumber = (value: number): string =>
  new Intl.NumberFormat('zh-CN').format(value || 0)

/**
 * 从富文本内容中提取纯文本，兼容编辑器的空占位标签。
 */
export const stripContentHtml = (content = ''): string =>
  content
    .replace(/&nbsp;/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * 判断富文本内容是否为空。媒体内容也属于有效正文。
 */
export const isContentRichTextEmpty = (content = ''): boolean => {
  if (/<(img|video|audio|iframe|embed|object)\b/i.test(content)) {
    return false
  }

  return !stripContentHtml(content)
}

/**
 * 从富文本内容中提取简短摘要，作为缺省摘要或卡片补充文案。
 */
export const createContentSummary = (content = ''): string =>
  stripContentHtml(content).slice(0, 80) || '暂无摘要'

/**
 * 清洗字符串数组，去除空值并限制数量，防止标签字段提交异常数据。
 */
export const cleanContentStringArray = (items: string[] = []): string[] =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
