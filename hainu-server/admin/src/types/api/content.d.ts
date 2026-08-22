declare namespace Api {
  /** 内容与字典类型 */
  namespace Content {
    type ContentType = 'ARTICLE' | 'NEWS' | 'NOTICE' | 'CASE_STUDY' | 'HELP_CENTER'
    type ContentStatus = 'DRAFT' | 'REVIEWING' | 'PUBLISHED' | 'OFFLINE'
    type ContentVisibility = 'PUBLIC' | 'INTERNAL' | 'PRIVATE'

    interface ContentOverview {
      /** 总条数 */
      total: number
      /** 草稿数量 */
      draft: number
      /** 审核中数量 */
      reviewing: number
      /** 已发布数量 */
      published: number
      /** 已下线数量 */
      offline: number
      /** 置顶数量 */
      topCount: number
      /** 推荐数量 */
      recommended: number
      /** 总浏览量 */
      totalViews: number
      /** 总点赞量 */
      totalLikes: number
      /** 总评论量 */
      totalComments: number
      /** 总收藏量 */
      totalFavorites: number
    }

    interface ContentCategoryItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled: boolean
      /** 排序 */
      sort: number
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 数量 */
      _count?: {
        /** 内容数据项列表 */
        contentItems: number
      }
    }

    type ContentCategoryList = Api.Common.PaginatedResponse<ContentCategoryItem>

    interface ContentCategorySearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ContentCategoryPayload {
      /** 名称 */
      name: string
      /** 是否启用 */
      enabled?: boolean
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    interface ContentTagItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled: boolean
      /** 排序 */
      sort: number
      /** 备注 */
      remark?: string | null
      /** 使用次数 */
      useCount?: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type ContentTagList = Api.Common.PaginatedResponse<ContentTagItem>

    interface ContentTagSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ContentTagPayload {
      /** 名称 */
      name: string
      /** 是否启用 */
      enabled?: boolean
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    interface ContentItem {
      /** ID */
      id: number
      /** 标题 */
      title: string
      /** 别名标识 */
      slug: string
      /** 内容类型 */
      contentType: ContentType
      /** 分类 ID */
      categoryId?: number | null
      /** 频道 */
      channel: string
      /** 状态 */
      status: ContentStatus
      /** 可见性 */
      visibility: ContentVisibility
      /** 作者 */
      author: string
      /** 封面地址 */
      coverUrl?: string | null
      /** 汇总信息 */
      summary?: string | null
      /** 内容 */
      content: string
      /** 来源 */
      source?: string | null
      /** 标签列表 */
      tags: string[]
      /** SEO 关键词 */
      seoKeywords: string[]
      /** SEO 标题 */
      seoTitle?: string | null
      /** SEO 描述 */
      seoDescription?: string | null
      /** 是否置顶 */
      isTop: boolean
      /** 是否推荐 */
      isRecommended: boolean
      /** 是否允许评论 */
      allowComment: boolean
      /** 排序 */
      sort: number
      /** 发布时间 */
      publishedAt?: string | null
      /** 下线时间 */
      offlineAt?: string | null
      /** 浏览量 */
      viewCount: number
      /** 点赞量 */
      likeCount: number
      /** 评论量 */
      commentCount: number
      /** 收藏量 */
      favoriteCount: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 删除时间 */
      deletedAt?: string | null
      /** 分类 */
      category?: Pick<ContentCategoryItem, 'id' | 'name' | 'code'> | null
    }

    type ContentList = Api.Common.PaginatedResponse<ContentItem>

    interface ContentSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 内容类型 */
      contentType?: ContentType
      /** 分类 ID */
      categoryId?: number
      /** 状态 */
      status?: ContentStatus
      /** 可见性 */
      visibility?: ContentVisibility
      /** 频道 */
      channel?: string
      /** 作者 */
      author?: string
      /** 特性筛选 */
      feature?: 'top' | 'recommended' | 'comment'
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface ContentPayload {
      /** 标题 */
      title: string
      /** 别名标识 */
      slug?: string
      /** 内容类型 */
      contentType: ContentType
      /** 分类 ID */
      categoryId?: number
      /** 频道 */
      channel: string
      /** 状态 */
      status: ContentStatus
      /** 可见性 */
      visibility: ContentVisibility
      /** 作者 */
      author: string
      /** 封面地址 */
      coverUrl?: string
      /** 汇总信息 */
      summary?: string
      /** 内容 */
      content: string
      /** 来源 */
      source?: string
      /** 标签列表 */
      tags?: string[]
      /** SEO 关键词 */
      seoKeywords?: string[]
      /** SEO 标题 */
      seoTitle?: string
      /** SEO 描述 */
      seoDescription?: string
      /** 是否置顶 */
      isTop?: boolean
      /** 是否推荐 */
      isRecommended?: boolean
      /** 是否允许评论 */
      allowComment?: boolean
      /** 排序 */
      sort?: number
      /** 发布时间 */
      publishedAt?: string
      /** 下线时间 */
      offlineAt?: string
      /** 浏览量 */
      viewCount?: number
      /** 点赞量 */
      likeCount?: number
      /** 评论量 */
      commentCount?: number
      /** 收藏量 */
      favoriteCount?: number
    }

    interface DictTypeItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled: boolean
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 数量 */
      _count?: {
        /** 数据项列表 */
        items: number
      }
    }

    type DictTypeList = Api.Common.PaginatedResponse<DictTypeItem>

    interface DictTypeSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键字，支持名称或编码 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface DictTypePayload {
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled?: boolean
      /** 备注 */
      remark?: string
    }

    interface DictDataTypeRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
    }

    interface DictDataItem {
      /** ID */
      id: number
      /** 类型 ID */
      typeId: number
      /** 显示名称 */
      label: string
      /** 值 */
      value: string
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 标签类型 */
      tagType?: string | null
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 类型 */
      type?: DictDataTypeRef
    }

    type DictDataList = Api.Common.PaginatedResponse<DictDataItem>

    interface DictDataSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 类型 ID */
      typeId?: number
      /** 显示名称 */
      label?: string
      /** 值 */
      value?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface DictDataPayload {
      /** 类型 ID */
      typeId: number
      /** 显示名称 */
      label: string
      /** 值 */
      value: string
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
      /** 标签类型 */
      tagType?: string
      /** 备注 */
      remark?: string
    }
    type Overview = ContentOverview
    type CategoryItem = ContentCategoryItem
    type CategoryList = ContentCategoryList
    type CategorySearchParams = ContentCategorySearchParams
    type CategoryPayload = ContentCategoryPayload
    type TagItem = ContentTagItem
    type TagList = ContentTagList
    type TagSearchParams = ContentTagSearchParams
    type TagPayload = ContentTagPayload
    type Item = ContentItem
    type List = ContentList
    type SearchParams = ContentSearchParams
    type Payload = ContentPayload
  }
}
