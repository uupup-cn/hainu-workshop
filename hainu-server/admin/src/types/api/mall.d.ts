declare namespace Api {
  /** 商城类型 */
  namespace Mall {
    type ProductStatus = 'DRAFT' | 'PENDING' | 'ON_SALE' | 'OFF_SHELF'
    type OrderStatus =
      | 'PENDING_PAYMENT'
      | 'PAID'
      | 'PENDING_SHIPMENT'
      | 'SHIPPED'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'CLOSED'
    type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUND_PENDING' | 'REFUNDED'
    type FulfillmentStatus = 'UNFULFILLED' | 'PARTIAL_SHIPPED' | 'SHIPPED'
    type OrderOperateType =
      | 'CREATE'
      | 'PAY'
      | 'SHIP'
      | 'COMPLETE'
      | 'CLOSE'
      | 'NOTE'
      | 'AUTO_CLOSE'
      | 'CANCEL'
      | 'ADJUST_PRICE'
      | 'ADJUST_ADDRESS'

    interface BrandItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 英文名 */
      nameEn?: string | null
      /** Logo 地址 */
      logoUrl?: string | null
      /** 官网 */
      website?: string | null
      /** 国家代码 */
      country?: string | null
      /** 描述 */
      description?: string | null
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type BrandList = Api.Common.PaginatedResponse<BrandItem>

    interface BrandSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface BrandPayload {
      /** 名称 */
      name: string
      /** 英文名 */
      nameEn?: string
      /** Logo 地址 */
      logoUrl?: string
      /** 官网 */
      website?: string
      /** 国家代码 */
      country?: string
      /** 描述 */
      description?: string
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
    }

    interface ProductServiceItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 图标 */
      icon: string
      /** 描述 */
      description?: string | null
      /** 排序 */
      sort: number
      /** 是否默认勾选 */
      isDefault: boolean
      /** 是否启用 */
      enabled: boolean
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type ProductServiceList = Api.Common.PaginatedResponse<ProductServiceItem>

    interface ProductServiceSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ProductServicePayload {
      /** 名称 */
      name: string
      /** 图标 */
      icon: string
      /** 描述 */
      description?: string
      /** 排序 */
      sort?: number
      /** 是否默认勾选 */
      isDefault?: boolean
      /** 是否启用 */
      enabled?: boolean
    }

    interface AttributeTemplateAttributeItem {
      /** 属性名称 */
      name: string
      /** 属性值 */
      value: string
      /** 排序值 */
      sort?: number
    }

    interface AttributeTemplateSpecItem {
      /** 规格名称 */
      name: string
      /** 规格可选值列表 */
      values: string[]
      /** 排序值 */
      sort?: number
    }

    interface AttributeTemplateExtraServiceItem {
      /** 附加服务名称 */
      name: string
      /** 附加服务说明 */
      value?: string
      /** 排序值 */
      sort?: number
    }

    interface AttributeTemplateItem {
      /** ID */
      id: number
      /** 模板名称 */
      name: string
      /** 备注 */
      remark?: string | null
      /** 属性列表 */
      attributes: AttributeTemplateAttributeItem[]
      /** 销售规格列表 */
      specs: AttributeTemplateSpecItem[]
      /** 附加服务列表 */
      extraServices: AttributeTemplateExtraServiceItem[]
      /** 是否启用 */
      enabled: boolean
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type AttributeTemplateList = Api.Common.PaginatedResponse<AttributeTemplateItem>

    interface AttributeTemplateSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface AttributeTemplatePayload {
      /** 模板名称 */
      name: string
      /** 备注 */
      remark?: string
      /** 属性列表 */
      attributes?: AttributeTemplateAttributeItem[]
      /** 销售规格列表 */
      specs?: AttributeTemplateSpecItem[]
      /** 附加服务列表 */
      extraServices?: AttributeTemplateExtraServiceItem[]
      /** 是否启用 */
      enabled?: boolean
    }

    interface ExpressCompanyItem {
      /** ID */
      id: number
      /** 编码 */
      code: string
      /** 名称 */
      name: string
      /** 官网 */
      website?: string | null
      /** 物流跟踪 URL 模板 */
      trackingUrlTemplate?: string | null
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type ExpressCompanyList = Api.Common.PaginatedResponse<ExpressCompanyItem>

    interface ExpressCompanySearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ExpressCompanyPayload {
      /** 编码 */
      code: string
      /** 名称 */
      name: string
      /** 官网 */
      website?: string
      /** 物流跟踪 URL 模板 */
      trackingUrlTemplate?: string
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
    }

    interface ProductCategoryItem {
      /** ID */
      id: number
      /** 父级 ID */
      parentId?: number | null
      /** 祖级路径 */
      ancestorPath: string
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled: boolean
      /** 排序 */
      sort: number
      /** 封面地址 */
      coverUrl?: string | null
      /** SEO 标题 */
      seoTitle?: string | null
      /** SEO 描述 */
      seoDescription?: string | null
      /** 备注 */
      remark?: string | null
      /** 默认品牌 ID */
      defaultBrandId?: number | null
      /** 默认属性模板 ID */
      defaultAttributeTemplateId?: number | null
      /** 默认运费模板 ID */
      defaultShippingTemplateId?: number | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 子级列表 */
      children?: ProductCategoryItem[]
    }

    interface ProductSkuItem {
      /** ID */
      id?: number
      /** 商品 ID */
      productId?: number
      /** SKU 编码 */
      skuCode: string
      /** 条形码 */
      barcode?: string | null
      /** 图片地址 */
      imageUrl?: string | null
      /** 规格描述 */
      specText: string
      /** 规格值映射 */
      specValues: Record<string, string>
      /** 销售价 */
      salePrice: number
      /** 市场价 */
      marketPrice: number
      /** 成本价 */
      costPrice: number
      /** 库存 */
      stock: number
      /** 锁定库存 */
      lockedStock: number
      /** 重量 */
      weight: number
      /** 体积 */
      volume: number
      /** 是否启用 */
      isEnabled: boolean
      /** 排序 */
      sort: number
      /** 创建时间 */
      createdAt?: string
      /** 更新时间 */
      updatedAt?: string
    }

    interface ProductCategoryRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
    }

    interface ProductItem {
      /** ID */
      id: number
      /** 分类 ID */
      categoryId?: number | null
      /** 商品编号 */
      productNo: string
      /** 名称 */
      name: string
      /** 副标题 */
      subtitle?: string | null
      /** 状态 */
      status: ProductStatus
      /** 商品类型（NORMAL / VIRTUAL 等，M3 后追加；老数据默认 NORMAL） */
      productType?:
        | 'NORMAL'
        | 'VIRTUAL'
        | 'GROUP_BUY'
        | 'BARGAIN'
        | 'SECKILL'
        | 'GROUPON'
        | 'COMBO'
        | 'GIFT_CARD'
      /** 销售模式（M3 后追加） */
      salesMode?: 'IN_STOCK' | 'PRESALE'
      /** 封面地址 */
      coverUrl?: string | null
      /** 相册图片列表 */
      galleryUrls: string[]
      /** 详情 */
      detail: string
      /** 卖点列表 */
      sellingPoints: string[]
      /** 标签列表 */
      tags: string[]
      /** SEO 关键词 */
      seoKeywords: string[]
      /** SEO 标题 */
      seoTitle?: string | null
      /** SEO 描述 */
      seoDescription?: string | null
      /** 排序 */
      sort: number
      /** 总库存 */
      totalStock: number
      /** 锁定库存 */
      lockedStock: number
      /** 总销量 */
      totalSales: number
      /** 最低售价 */
      priceMin: number
      /** 最高售价 */
      priceMax: number
      /** 最低市场价 */
      marketPriceMin: number
      /** 最高市场价 */
      marketPriceMax: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 分类 */
      category?: ProductCategoryRef | null
      /** SKU 列表 */
      skus: ProductSkuItem[]

      // ============ 后端 detail 接口同时回传的扩展字段（M3+） ============
      // 这些字段在新增 / 编辑 5 步抽屉中由用户填写，详情页用于完整展示。
      /** 品牌 ID（M3+，引用 Brand） */
      brandId?: number | null
      /** 预售开始时间（仅 salesMode=PRESALE） */
      presaleStartAt?: string | null
      /** 预售结束时间（仅 salesMode=PRESALE） */
      presaleEndAt?: string | null
      /** 预计发货时间（仅 salesMode=PRESALE） */
      presaleDeliveryAt?: string | null
      /** 单笔订单限购数量（null 表示不限） */
      limitPerOrder?: number | null
      /** 单人累计限购数量（null 表示不限） */
      limitPerUser?: number | null
      /** 定时上架时间 */
      scheduledOnSaleAt?: string | null
      /** 定时下架时间 */
      scheduledOffShelfAt?: string | null
      /** 商品属性 [{ name, value, sort? }] */
      productAttributes?: Array<{ name: string; value: string; sort?: number }>
      /** 销售规格 [{ name, values: string[], sort? }] */
      productSpecs?: Array<{ name: string; values: string[]; sort?: number }>
      /** 附加服务 [{ name, value?, sort? }] */
      productExtraServices?: Array<{ name: string; value?: string | null; sort?: number }>
      /** 推荐位 RECOMMEND / NEW / HOT */
      recommendFlags?: string[]
      /** 计费模式 FLAT / TEMPLATE */
      shippingMode?: string | null
      /** 固定运费（分） */
      freightFlat?: number | null
      /** 运费模板 ID */
      shippingTemplateId?: number | null
      /** 交付方式 SINGLE / MULTIPLE */
      deliveryMethod?: string | null
      /** 配送方式 EXPRESS / PICKUP / LOCAL_DELIVERY */
      shippingMethods?: string[]
      /** 自提时段 [{ day, start, end }] */
      pickupSlots?: Array<{ day: string; start: string; end: string }>
      /** 同城配送配置 */
      localDeliveryConfig?: Record<string, any> | null
      /** 是否在前台显示销量 */
      showSales?: boolean
      /** 关联商品 ID 列表 */
      relatedProductIds?: number[]
      /** 关联文章 ID 列表 */
      relatedArticleIds?: number[]
      /** 商品服务 ID 列表 */
      productServiceIds?: number[]
      /** 商品重量（克） */
      weight?: number | null
      /** 商品条形码 */
      barcode?: string | null
      /** 商品视频地址 */
      videoUrl?: string | null
    }

    type ProductList = Api.Common.PaginatedResponse<ProductItem>

    interface ProductSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 分类 ID */
      categoryId?: number
      /** 状态 */
      status?: ProductStatus
      /** 库存状态 */
      stockStatus?: 'LOW' | 'EMPTY' | 'NORMAL'
      /** 最低价格 */
      minPrice?: number
      /** 最高价格 */
      maxPrice?: number
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
      /** Tab 筛选（M3 后追加） */
      tab?: 'all' | 'on_sale' | 'off_shelf' | 'pending' | 'draft' | 'recycle'
      /** 品牌 ID（M3 后追加） */
      brandId?: number
      /** 商品类型（M3 后追加） */
      productType?: string
      /** 仓库 ID（M3 后追加） */
      warehouseId?: number
    }

    interface ProductOverview {
      /** 总条数 */
      total: number
      /** 草稿数量 */
      draft: number
      /** 待处理数量 */
      pending: number
      /** 在售数量 */
      onSale: number
      /** 已下架数量 */
      offShelf: number
      /** 低库存数量 */
      lowStock: number
      /** 总库存 */
      totalStock: number
      /** 锁定库存 */
      lockedStock: number
      /** 总销量 */
      totalSales: number
    }

    interface ProductPayload {
      /** 分类 ID */
      categoryId?: number | null
      /** 商品编号 */
      productNo?: string
      /** 名称 */
      name: string
      /** 副标题 */
      subtitle?: string
      /** 状态 */
      status?: ProductStatus
      /** 封面地址 */
      coverUrl?: string
      /** 相册图片列表 */
      galleryUrls?: string[]
      /** 详情 */
      detail: string
      /** 卖点列表 */
      sellingPoints?: string[]
      /** 标签列表 */
      tags?: string[]
      /** SEO 关键词 */
      seoKeywords?: string[]
      /** SEO 标题 */
      seoTitle?: string
      /** SEO 描述 */
      seoDescription?: string
      /** 排序 */
      sort?: number
      /** SKU 列表 */
      skus: ProductSkuItem[]

      // M3 新增字段
      /** 商品类型 */
      productType?: string
      /** 销售模式 */
      salesMode?: string
      /** 预售时间 */
      presaleStartAt?: string | null
      presaleEndAt?: string | null
      presaleDeliveryAt?: string | null
      /** 限购 */
      limitPerOrder?: number | null
      limitPerUser?: number | null
      /** 定时上下架 */
      scheduledOnSaleAt?: string | null
      scheduledOffShelfAt?: string | null
      /** 品牌 */
      brandId?: number | null
      /** 商品属性 / 销售规格 / 附加服务 */
      productAttributes?: any[]
      productSpecs?: any[]
      productExtraServices?: any[]
      /** 推荐位 */
      recommendFlags?: string[]
      /** 配送 */
      shippingMode?: string
      freightFlat?: number | null
      shippingTemplateId?: number | null
      deliveryMethod?: string
      shippingMethods?: string[]
      pickupSlots?: any[]
      localDeliveryConfig?: any
      /** 销量显示 */
      showSales?: boolean
      /** 关联商品 / 文章 / 服务说明 */
      relatedProductIds?: number[]
      relatedArticleIds?: number[]
      productServiceIds?: number[]
      /** 物理属性 */
      weight?: number | null
      barcode?: string
      videoUrl?: string
    }

    interface ProductCategorySearchParams {
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ProductCategoryPayload {
      /** 父级 ID */
      parentId?: number | null
      /** 名称 */
      name: string
      /** 是否启用 */
      enabled?: boolean
      /** 排序 */
      sort?: number
      /** 封面地址 */
      coverUrl?: string
      /** SEO 标题 */
      seoTitle?: string
      /** SEO 描述 */
      seoDescription?: string
      /** 备注 */
      remark?: string
      /** 默认品牌 ID */
      defaultBrandId?: number | null
      /** 默认属性模板 ID */
      defaultAttributeTemplateId?: number | null
      /** 默认运费模板 ID */
      defaultShippingTemplateId?: number | null
    }

    interface OrderLineItem {
      /** ID */
      id: number
      /** 订单 ID */
      orderId: number
      /** 商品 ID */
      productId?: number | null
      /** 商品 SKU ID */
      productSkuId?: number | null
      /** 商品名称 */
      productName: string
      /** 商品副标题 */
      productSubtitle?: string | null
      /** 封面地址 */
      coverUrl?: string | null
      /** SKU 编码 */
      skuCode?: string | null
      /** 规格描述 */
      specText?: string | null
      /** 销售价 */
      salePrice: number
      /** 数量 */
      quantity: number
      /** 已发货数量（M5 任务 35 新增；缺省 0） */
      shippedQuantity?: number
      /** 总金额 */
      totalAmount: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    interface OrderOperateLogItem {
      /** ID */
      id: number
      /** 订单 ID */
      orderId: number
      /** 操作人 ID */
      operatorId?: number | null
      /** 操作人名称 */
      operatorName?: string | null
      /** 操作 */
      action: OrderOperateType
      /** 备注 */
      note?: string | null
      /** 创建时间 */
      createdAt: string
    }

    interface OrderItem {
      /** ID */
      id: number
      /** 订单编号 */
      orderNo: string
      /** 用户 ID */
      userId?: number | null
      /** 用户名 */
      username?: string | null
      /** 用户手机号 */
      userPhone?: string | null
      /** 收件人姓名 */
      recipientName: string
      /** 收件人手机号 */
      recipientPhone: string
      /** 收件省份 */
      recipientProvince?: string | null
      /** 收件城市 */
      recipientCity?: string | null
      /** 收件区县 */
      recipientDistrict?: string | null
      /** 收件详细地址 */
      recipientAddress: string
      /** 支付方式 */
      paymentMethod?: string | null
      /**
       * 外部支付流水号（来自渠道方 / 老链路手工填写）。
       *
       * 老链路由 `OrdersService.pay` 把 OrderPayPayload.transactionNo
       * 写入；新链路由 webhook 推进 PaymentTransaction 时回写为
       * `providerTransactionNo`（Requirement 14.3）。前端在「支付流水面板」按 Requirement 17.3
       * 兼容历史虚拟流水时回退展示该字段。
       */
      transactionNo?: string | null
      /** 订单状态 */
      orderStatus: OrderStatus
      /** 支付状态 */
      paymentStatus: PaymentStatus
      /** 履约状态 */
      fulfillmentStatus: FulfillmentStatus
      /** 售后状态 */
      aftersaleStatus?: string | null
      /** 商品金额 */
      productAmount: number
      /** 优惠金额 */
      discountAmount: number
      /** 运费金额 */
      freightAmount: number
      /** 实付金额 */
      payAmount: number
      /** 备注 */
      note?: string | null
      /** 下单时间 */
      placedAt: string
      /** 支付时间 */
      paidAt?: string | null
      /** 发货时间 */
      shippedAt?: string | null
      /** 完成时间 */
      completedAt?: string | null
      /** 关闭时间 */
      closedAt?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 数据项列表 */
      items: OrderLineItem[]
      /** 操作日志列表 */
      operateLogs: OrderOperateLogItem[]
    }

    type OrderList = Api.Common.PaginatedResponse<OrderItem>

    interface OrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 订单状态 */
      orderStatus?: OrderStatus
      /** 支付状态 */
      paymentStatus?: PaymentStatus
      /** 履约状态 */
      fulfillmentStatus?: FulfillmentStatus
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface OrderOverview {
      /** 总条数 */
      total: number
      /** 待支付数量 */
      pendingPayment: number
      /** 待发货数量 */
      pendingShipment: number
      /** 已发货数量 */
      shipped: number
      /** 已完成数量 */
      completed: number
      /** 已关闭数量 */
      closed: number
      /** 商品总金额 */
      totalProductAmount: number
      /** 运费总金额 */
      totalFreightAmount: number
      /** 实付总金额 */
      totalPayAmount: number
      /** 优惠总金额 */
      totalDiscountAmount: number
    }

    // === 仓库类型 ===
    type WarehouseType = 'CENTRAL' | 'STORE' | 'VIRTUAL'

    interface WarehouseItem {
      /** ID */
      id: number
      /** 编码 */
      code: string
      /** 名称 */
      name: string
      /** 仓库类型 */
      type: WarehouseType
      /** 所属部门 ID */
      departmentId?: number | null
      /** 联系人 */
      contactName?: string | null
      /** 联系电话 */
      contactPhone?: string | null
      /** 省编码 */
      provinceCode?: string | null
      /** 市编码 */
      cityCode?: string | null
      /** 区编码 */
      districtCode?: string | null
      /** 详细地址 */
      address?: string | null
      /** 是否启用 */
      enabled: boolean
      /** 是否默认仓 */
      isDefault: boolean
      /** 排序 */
      sort: number
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 所属部门 */
      department?: { id: number; name: string } | null
    }

    type WarehouseList = Api.Common.PaginatedResponse<WarehouseItem>

    interface WarehouseSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词（编码/名称） */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
      /** 仓库类型 */
      type?: WarehouseType
    }

    interface WarehousePayload {
      /** 编码（新增时留空由后端自动生成） */
      code?: string
      /** 名称 */
      name: string
      /** 仓库类型 */
      type: WarehouseType
      /** 所属部门 ID */
      departmentId?: number | null
      /** 联系人 */
      contactName?: string
      /** 联系电话 */
      contactPhone?: string
      /** 省编码 */
      provinceCode?: string
      /** 市编码 */
      cityCode?: string
      /** 区编码 */
      districtCode?: string
      /** 详细地址 */
      address?: string
      /** 是否启用 */
      enabled?: boolean
      /** 是否默认仓 */
      isDefault?: boolean
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    // === 运费模板类型 ===
    type ChargeType = 'BY_PIECE' | 'BY_WEIGHT' | 'BY_VOLUME'

    /** 运费规则（默认规则 / 分区规则共用） */
    interface ShippingRule {
      /** 首件/首重/首体积 */
      firstUnit: number
      /** 首费（分） */
      firstFee: number
      /** 续件/续重/续体积 */
      additionalUnit: number
      /** 续费（分） */
      additionalFee: number
    }

    /** 分区规则 */
    interface ShippingRegionRule extends ShippingRule {
      /** 地区编码列表 */
      regions: string[]
    }

    interface ShippingTemplateItem {
      /** ID */
      id: number
      /** 模板名称 */
      name: string
      /** 计费方式 */
      chargeType: ChargeType
      /** 包邮地区编码 */
      freeShippingRegions: string[]
      /** 包邮门槛（分） */
      freeShippingThreshold?: number | null
      /** 默认规则 */
      defaultRule: ShippingRule
      /** 分区规则 */
      regionRules: ShippingRegionRule[]
      /** 是否启用 */
      enabled: boolean
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type ShippingTemplateList = Api.Common.PaginatedResponse<ShippingTemplateItem>

    interface ShippingTemplateSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface ShippingTemplatePayload {
      /** 模板名称 */
      name: string
      /** 计费方式 */
      chargeType: ChargeType
      /** 包邮地区编码 */
      freeShippingRegions?: string[]
      /** 包邮门槛（分） */
      freeShippingThreshold?: number | null
      /** 默认规则 */
      defaultRule: ShippingRule
      /** 分区规则 */
      regionRules?: ShippingRegionRule[]
      /** 是否启用 */
      enabled?: boolean
      /** 备注 */
      remark?: string
    }

    interface OrderPayPayload {
      /** 支付方式 */
      paymentMethod?: string
      /** 外部支付流水号（可选，1~64 字符） */
      transactionNo?: string
      /** 支付时间 */
      paidAt?: string
      /** 备注 */
      note?: string
    }

    /**
     * 创建订单请求 - 单条明细。
     */
    interface CreateOrderItemPayload {
      /** 商品 ID */
      productId: number
      /** SKU ID */
      productSkuId: number
      /** 购买数量（正整数） */
      quantity: number
    }

    /**
     * 创建订单请求体（与后端 CreateOrderDto 对齐）。
     *
     * 用于：
     * - 商城前台用户下单（保留兼容）
     * - 后台「代客下单」（mall:order:create 权限码）
     */
    interface CreateOrderPayload {
      /** 关联会员用户 ID（可选；后台代客下单时可空） */
      userId?: number | null
      /** 会员用户名快照 */
      username?: string
      /** 会员手机号快照 */
      userPhone?: string
      /** 收货人姓名（虚拟商品订单可为空字符串） */
      recipientName: string
      /** 收货人手机（虚拟商品订单可为空字符串） */
      recipientPhone: string
      /** 收货省 */
      recipientProvince?: string
      /** 收货市 */
      recipientCity?: string
      /** 收货区 */
      recipientDistrict?: string
      /** 详细地址（虚拟商品订单可为空字符串） */
      recipientAddress: string
      /** 整单优惠金额（分） */
      discountAmount?: number
      /** 运费金额（分） */
      freightAmount?: number
      /** 订单备注 */
      note?: string
      /** 订单明细列表（1~200） */
      items: CreateOrderItemPayload[]
    }

    /**
     * 代客下单：客户候选项中的常用收货地址。
     */
    interface CustomerAddressSuggestion {
      /** 地址去重 key（前端不做唯一性约束，仅用于列表 :key 渲染） */
      key: string
      /** 收货人姓名 */
      recipientName: string
      /** 收货人手机 */
      recipientPhone: string
      /** 收货省 */
      recipientProvince?: string | null
      /** 收货市 */
      recipientCity?: string | null
      /** 收货区 */
      recipientDistrict?: string | null
      /** 详细地址 */
      recipientAddress: string
      /** 该地址最近一次下单时间 */
      lastPlacedAt: string
    }

    /**
     * 代客下单：客户候选项。
     */
    interface CustomerSuggestion {
      /** 客户去重 key */
      key: string
      /** 关联会员 ID（可空） */
      userId?: number | null
      /** 会员用户名快照 */
      username?: string | null
      /** 会员手机号快照 */
      userPhone?: string | null
      /** 客户历史订单数 */
      orderCount: number
      /** 该客户最近一次下单时间 */
      lastPlacedAt: string
      /** 该客户的常用收货地址（≤6） */
      addresses: CustomerAddressSuggestion[]
    }

    interface OrderCustomerSuggestionsParams {
      /** 关键字（用户名 / 手机号 / 收货人 / 收货人手机） */
      keyword?: string
      /** 返回的最大客户数（默认 10，最大 50） */
      limit?: number
    }

    interface OrderShipPayload {
      /** 发货时间 */
      shippedAt?: string
      /** 备注 */
      note?: string
    }

    interface OrderNotePayload {
      /** 备注 */
      note?: string
    }

    // === 库存查询类型 ===
    type InventoryChangeType =
      | 'INBOUND'
      | 'OUTBOUND'
      | 'TRANSFER_OUT'
      | 'TRANSFER_IN'
      | 'STOCKTAKE_ADJUST'
      | 'ORDER_LOCK'
      | 'ORDER_UNLOCK'
      | 'ORDER_CONSUME'
      | 'MANUAL_ADJUST'

    type StockBucket = 'AVAILABLE' | 'LOCKED' | 'IN_TRANSIT'

    interface InventoryQueryItem {
      /** ID */
      id: number
      /** 仓库 ID */
      warehouseId: number
      /** 仓库编码 */
      warehouseCode?: string
      /** 仓库名称 */
      warehouseName: string
      /** SKU ID */
      skuId: number
      /** SKU 编码 */
      skuCode: string
      /** 规格描述 */
      specText?: string | null
      /** SKU 图片 */
      imageUrl?: string | null
      /** 商品 ID */
      productId?: number
      /** 商品名称 */
      productName: string
      /** 商品封面 */
      productCoverUrl?: string | null
      /** 可用库存 */
      available: number
      /** 锁定库存 */
      locked: number
      /** 在途库存 */
      inTransit: number
      /** 低库存阈值 */
      lowStockThreshold?: number | null
      /** 最近更新时间 */
      updatedAt: string
    }

    type InventoryQueryList = Api.Common.PaginatedResponse<InventoryQueryItem>

    interface InventoryQuerySearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number | string
      /** 每页条数 */
      size?: number | string
      /** 仓库 ID */
      warehouseId?: number | string
      /** 关键字（SKU 编码 / 商品名称） */
      keyword?: string
    }

    interface InventoryLogItem {
      /** ID */
      id: number
      /** 仓库 ID */
      warehouseId: number
      /** 仓库名称 */
      warehouseName: string
      /** SKU ID */
      skuId: number
      /** SKU 编码 */
      skuCode: string
      /** 商品名称 */
      productName: string
      /** 变动类型 */
      changeType: InventoryChangeType
      /** 库存桶 */
      bucket: StockBucket
      /** 变动数量（带符号） */
      quantity: number
      /** 变动前数量 */
      beforeQuantity: number
      /** 变动后数量 */
      afterQuantity: number
      /** 关联单据 ID */
      refOrderId?: number | null
      /** 关联单据编号 */
      refOrderNo?: string | null
      /** 关联模块 */
      refModule: string
      /** 操作人 ID */
      operatorId?: number | null
      /** 操作人名称 */
      operatorName?: string | null
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
    }

    type InventoryLogList = Api.Common.PaginatedResponse<InventoryLogItem>

    interface InventoryLogSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number | string
      /** 每页条数 */
      size?: number | string
      /** 仓库 ID */
      warehouseId?: number | string
      /** SKU ID */
      skuId?: number | string
      /** 关键字（SKU 编码 / 商品名称） */
      keyword?: string
      /** 变动类型 */
      changeType?: InventoryChangeType | string
      /** 关联单据编号 */
      refOrderNo?: string
      /** 开始日期 */
      startDate?: string
      /** 结束日期 */
      endDate?: string
    }

    // ============== 商品批量动作（Requirement 30） ==============

    /**
     * 批量分配仓库的初始库存策略。
     * - PRESERVE: 保留当前 SKU 在该仓库的现有库存（仅创建未存在的 SkuStock 行）。
     * - OVERRIDE: 以 quantity 作为该仓库每个 SKU 的初始可用库存。
     * - APPEND: 在 SKU 在该仓库的原有库存基础上追加 quantity。
     */
    type AssignWarehouseStrategy = 'PRESERVE' | 'OVERRIDE' | 'APPEND'

    /** 批量动作的按行结果状态。 */
    type BatchActionRowStatus = 'success' | 'fail' | 'skip'

    /** 批量动作的按行结果详情。 */
    interface BatchActionRowResult {
      /** 商品 ID。 */
      productId: number
      /** 处理结果状态。 */
      status: BatchActionRowStatus
      /** 失败 / 跳过原因（人类可读）。 */
      message?: string
      /** 失败 / 跳过的错误码（供前端国际化）。 */
      errorCode?: string
    }

    /** 批量动作的整体响应。 */
    interface BatchActionResult {
      /** 提交的总条数。 */
      total: number
      /** 处理成功的行数。 */
      success: number
      /** 处理失败的行数。 */
      fail: number
      /** 跳过的行数（业务上不可执行，例如目标已在该状态）。 */
      skip: number
      /** 按行明细。 */
      details: BatchActionRowResult[]
    }

    /** 批量分配仓库提交载荷。 */
    interface BatchAssignWarehousePayload {
      /** 商品 ID 列表（1~200）。 */
      productIds: number[]
      /** 目标仓库 ID。 */
      warehouseId: number
      /** 库存策略。 */
      strategy: AssignWarehouseStrategy
      /** 初始数量；OVERRIDE / APPEND 必填，PRESERVE 忽略。 */
      quantity?: number
      /** 备注，写入 InventoryLog.remark。 */
      remark?: string
    }

    /** 批量导出响应。 */
    interface BatchExportResult {
      /** 处理总条数。 */
      total: number
      /** 实际写入 CSV 的行数（不含表头）。 */
      exported: number
      /** 跳过 / 失败的行数。 */
      skipped: number
      /** CSV 文件名（不含扩展名）。 */
      filename: string
      /** CSV 内容（UTF-8 含 BOM，可由前端直接触发下载）。 */
      csv: string
    }

    // ============== 商品评价（Requirement 9 / 任务 25） ==============

    /**
     * 评价来源枚举。
     * - `MANUAL`: 后台手工录入；
     * - `FRONTEND`: 前台真实下单评价（本期不实现写入路径，仅在数据模型与查询条件上预留）。
     */
    type ReviewSource = 'MANUAL' | 'FRONTEND'

    /** 评价聚合中携带的商品基础信息（findAll / findOne 接口 include 的子集）。 */
    interface ProductReviewProductRef {
      /** 商品 ID。 */
      id: number
      /** 商品名称。 */
      name: string
      /** 商品编号。 */
      productNo: string
      /** 商品封面 URL。 */
      coverUrl?: string | null
    }

    /** 商品评价列表 / 详情记录。 */
    interface ProductReviewItem {
      /** 评价主键 ID。 */
      id: number
      /** 关联商品 ID。 */
      productId: number
      /** 关联订单 ID（前台真实评价时填充）。 */
      orderId?: number | null
      /** 关联订单项 ID（前台真实评价时填充）。 */
      orderItemId?: number | null
      /** 关联会员 ID（后台手工录入时允许为空）。 */
      userId?: number | null
      /** 会员名称（冗余字段，后台手工录入或选择会员后回填）。 */
      userName: string
      /** 会员头像 URL。 */
      userAvatarUrl?: string | null
      /** 评价星级（1~5）。 */
      rating: number
      /** 评价标签列表。 */
      tags: string[]
      /** 评价内容（富文本 / 纯文本，最多 5000 字符）。 */
      content: string
      /** 晒单图 URL 列表（最多 9 张）。 */
      imageUrls: string[]
      /** 是否置顶。 */
      isTop: boolean
      /** 是否推荐。 */
      isRecommended: boolean
      /** 是否对前台展示。 */
      isVisible: boolean
      /** 评价来源。 */
      source: ReviewSource
      /** 评价时间（ISO 8601）。 */
      reviewAt: string
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 关联商品基础信息。 */
      product?: ProductReviewProductRef | null
    }

    /** 评价列表分页响应。 */
    type ProductReviewList = Api.Common.PaginatedResponse<ProductReviewItem>

    /**
     * 评价列表查询参数。
     *
     * 后端将 boolean / number 类字段统一接受字符串形式，因此此处保留 `string | number | boolean`
     * 联合类型，方便前端直接拼接 query string 而不需要手动转换。
     */
    interface ProductReviewSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 关键字（评价内容 / 用户名 / 商品名称，大小写不敏感）。 */
      keyword?: string
      /** 商品 ID。 */
      productId?: number | string
      /** 会员 ID。 */
      userId?: number | string
      /** 评价星级（1~5）。 */
      rating?: number | string
      /** 是否仅展示带晒单图的评价。 */
      hasImages?: boolean | string
      /** 是否置顶。 */
      isTop?: boolean | string
      /** 是否推荐。 */
      isRecommended?: boolean | string
      /** 是否显示。 */
      isVisible?: boolean | string
      /** 评价来源。 */
      source?: ReviewSource
      /** 评价开始日期（ISO 8601）。 */
      startDate?: string
      /** 评价结束日期（ISO 8601）。 */
      endDate?: string
    }

    /**
     * 创建 / 更新评价的提交载荷。
     *
     * 创建时 `productId` / `userName` / `rating` / `content` / `reviewAt` 必填；
     * 更新时全部字段均可选（后端使用 `PartialType` 派生）。前端调用 update 时通过 `Partial`
     * 包裹本类型即可。
     */
    interface ProductReviewPayload {
      /** 商品 ID。 */
      productId: number
      /** 关联订单 ID（可空）。 */
      orderId?: number | null
      /** 关联订单项 ID（可空）。 */
      orderItemId?: number | null
      /** 关联会员 ID（可空）。 */
      userId?: number | null
      /** 会员名称（1~100 字符）。 */
      userName: string
      /** 会员头像 URL。 */
      userAvatarUrl?: string
      /** 评价星级（1~5）。 */
      rating: number
      /** 评价标签列表（每项 1~30 字符，最多 20 项）。 */
      tags?: string[]
      /** 评价内容（1~5000 字符）。 */
      content: string
      /** 晒单图 URL 列表（最多 9 张）。 */
      imageUrls?: string[]
      /** 是否置顶。 */
      isTop?: boolean
      /** 是否推荐。 */
      isRecommended?: boolean
      /** 是否显示。 */
      isVisible?: boolean
      /** 评价来源。 */
      source?: ReviewSource
      /** 评价日期（ISO 8601）。 */
      reviewAt: string
    }

    /** 商品评价聚合结果（仅统计 isVisible=true 的评价）。 */
    interface ProductReviewAggregate {
      /** 商品 ID。 */
      productId: number
      /** 评价数量。 */
      count: number
      /** 平均星级（保留 1 位小数；count=0 时为 0）。 */
      avgRating: number
      /** 5 星评价数量。 */
      star5: number
      /** 4 星评价数量。 */
      star4: number
      /** 3 星评价数量。 */
      star3: number
      /** 2 星评价数量。 */
      star2: number
      /** 1 星评价数量。 */
      star1: number
    }

    /**
     * 批量切换响应。
     *
     * - `total`: 提交的总条数；
     * - `updated`: 实际发生变更的条数（受影响行数）；
     * - `skipped`: 不存在或目标状态相同而未被写入的条数。
     */
    interface BatchToggleResult {
      total: number
      updated: number
      skipped: number
    }

    /** 批量切换显示状态请求载荷。 */
    interface BatchToggleVisiblePayload {
      /** 待操作的评价 ID 数组（1~200，且唯一）。 */
      ids: number[]
      /** 期望显示状态。 */
      isVisible: boolean
    }

    /** 批量切换置顶状态请求载荷。 */
    interface BatchToggleTopPayload {
      /** 待操作的评价 ID 数组（1~200，且唯一）。 */
      ids: number[]
      /** 期望置顶状态。 */
      isTop: boolean
    }

    /** 批量切换推荐状态请求载荷。 */
    interface BatchToggleRecommendPayload {
      /** 待操作的评价 ID 数组（1~200，且唯一）。 */
      ids: number[]
      /** 期望推荐状态。 */
      isRecommended: boolean
    }

    /**
     * 商品售后说明（Aftersale Notice）单例配置响应。
     *
     * 数据持久化在 `site_settings` 单例行（key=default）的 4 个字段中：
     * `aftersaleEnabled` / `aftersaleContent` / `aftersaleUpdatedAt` /
     * `aftersaleUpdatedByName`。
     */
    interface AftersaleNotice {
      /** 售后服务总开关。 */
      aftersaleEnabled: boolean
      /** 售后说明富文本内容；为空时返回 null。 */
      aftersaleContent: string | null
      /** 最近一次更新时间（ISO 8601 字符串）；从未保存过时为 null。 */
      aftersaleUpdatedAt: string | null
      /** 最近一次保存的操作人显示名（冗余）；为空时为 null。 */
      aftersaleUpdatedByName: string | null
    }

    /**
     * 商品售后说明更新请求载荷。
     *
     * - `aftersaleEnabled`: 必填布尔，控制前台是否展示售后说明；
     * - `aftersaleContent`: 可选字符串，长度 ≤ 50000 字符，留空 / null 视为清空。
     */
    interface AftersaleNoticePayload {
      aftersaleEnabled: boolean
      aftersaleContent?: string | null
    }

    // ============== 入库单（Requirement 17 / 任务 29） ==============

    /**
     * 入库单类型枚举。
     * - `PURCHASE`: 采购入库；
     * - `RETURN`: 退货入库（搭配 relatedOrderNo 引用原订单）；
     * - `OTHER`: 其他入库（如系统级批量分配仓库时自动生成的入库单）。
     */
    type InboundType = 'PURCHASE' | 'RETURN' | 'OTHER'

    /**
     * 入库单状态枚举。
     *
     * 状态机：DRAFT → CONFIRMED（终态） / DRAFT → VOID（终态）；
     * CONFIRMED 入库单不允许作废，需通过出库单冲销。
     */
    type InboundStatus = 'DRAFT' | 'CONFIRMED' | 'VOID'

    /**
     * 入库单明细（列表 / 详情共用）。
     *
     * 后端在 detail include 中附带 sku / product 子集，前端展示时直接消费 `skuCode`、
     * `specText`、`productName` 等冗余字段；写入时仅 `skuId` / `quantity` 必填。
     */
    interface InboundOrderItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 SKU ID。 */
      skuId: number
      /** SKU 编码（响应携带）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应携带）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 关联商品 ID（响应携带，由后端基于 SKU 回填）。 */
      productId?: number
      /** 商品名称（响应携带）。 */
      productName?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 入库数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 单位成本（分），可空。 */
      unitCost?: number | null
      /** 批次号（≤50 字符），可空。 */
      batchNo?: string | null
      /** 明细备注（≤255 字符），可空。 */
      note?: string | null
    }

    /** 入库单列表行。 */
    interface InboundOrderListItem {
      /** 入库单主键 ID。 */
      id: number
      /** 入库单号（系统生成 IN+yyyymmdd+4 位序号）。 */
      inboundNo: string
      /** 入库类型。 */
      type: InboundType
      /** 仓库 ID。 */
      warehouseId: number
      /** 仓库编码（冗余）。 */
      warehouseCode?: string | null
      /** 仓库名称（冗余）。 */
      warehouseName?: string | null
      /** 单据状态。 */
      status: InboundStatus
      /** 供应商名称，可空。 */
      supplierName?: string | null
      /** 关联订单号（用于退货入库引用原订单），可空。 */
      relatedOrderNo?: string | null
      /** 操作人 ID，可空。 */
      operatorId?: number | null
      /** 操作人名称（冗余），可空。 */
      operatorName?: string | null
      /** 确认时间（ISO 8601），未确认时为 null。 */
      confirmedAt?: string | null
      /** 单据备注，可空。 */
      note?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 入库单明细列表。 */
      items: InboundOrderItem[]
    }

    /** 入库单详情（含明细），与列表行结构一致。 */
    type InboundOrderDetail = InboundOrderListItem

    /** 入库单列表分页响应。 */
    type InboundOrderList = Api.Common.PaginatedResponse<InboundOrderListItem>

    /**
     * 入库单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface InboundOrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 入库单号（模糊匹配）。 */
      inboundNo?: string
      /** 入库类型。 */
      type?: InboundType
      /** 仓库 ID。 */
      warehouseId?: number | string
      /** 单据状态。 */
      status?: InboundStatus
      /** 操作人 ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 入库单明细提交项。 */
    interface InboundOrderItemPayload {
      /** SKU ID（必填）。 */
      skuId: number
      /** 入库数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 单位成本（分），可空。 */
      unitCost?: number
      /** 批次号（≤50 字符），可空。 */
      batchNo?: string
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /**
     * 创建入库单提交载荷。
     *
     * 创建后状态固定为 DRAFT，inboundNo 由系统生成。
     */
    interface InboundOrderPayload {
      /** 入库类型（必填）。 */
      type: InboundType
      /** 仓库 ID（必填）。 */
      warehouseId: number
      /** 供应商名称（≤100 字符），可空。 */
      supplierName?: string
      /** 关联订单号（≤40 字符），可空。 */
      relatedOrderNo?: string
      /** 单据备注（≤500 字符），可空。 */
      note?: string
      /** 入库单明细列表（1 ~ 200 条）。 */
      items: InboundOrderItemPayload[]
    }

    // ============== 出库单（Requirement 18 / 任务 30） ==============

    /**
     * 出库单类型枚举。
     * - `ORDER_SHIP`: 订单发货出库（由订单履约流程自动创建）；
     * - `MIS_PICK`: 误拣出库；
     * - `OVERDUE`: 逾期出库；
     * - `OTHER`: 其他出库。
     */
    type OutboundType = 'ORDER_SHIP' | 'MIS_PICK' | 'OVERDUE' | 'OTHER'

    /**
     * 出库单状态枚举。
     *
     * 状态机：DRAFT → CONFIRMED（终态） / DRAFT → VOID（终态）；
     * 已确认的出库单不允许作废，需通过入库单冲销。
     */
    type OutboundStatus = 'DRAFT' | 'CONFIRMED' | 'VOID'

    /**
     * 出库单明细（列表 / 详情共用）。
     *
     * 后端在 detail include 中附带 sku / product 子集，前端展示时直接消费 `skuCode`、
     * `specText`、`productName` 等冗余字段；写入时仅 `skuId` / `quantity` 必填。
     * 与入库单不同，出库单明细不包含 `batchNo` / `unitCost` 字段。
     */
    interface OutboundOrderItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 SKU ID。 */
      skuId: number
      /** SKU 编码（响应携带）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应携带）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 关联商品 ID（响应携带，由后端基于 SKU 回填）。 */
      productId?: number
      /** 商品名称（响应携带）。 */
      productName?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 出库数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string | null
    }

    /** 出库单列表行。 */
    interface OutboundOrderListItem {
      /** 出库单主键 ID。 */
      id: number
      /** 出库单号（系统生成 OUT+yyyymmdd+4 位序号）。 */
      outboundNo: string
      /** 出库类型。 */
      type: OutboundType
      /** 仓库 ID。 */
      warehouseId: number
      /** 仓库编码（冗余）。 */
      warehouseCode?: string | null
      /** 仓库名称（冗余）。 */
      warehouseName?: string | null
      /** 单据状态。 */
      status: OutboundStatus
      /** 关联订单号（用于订单发货出库引用原订单），可空。 */
      relatedOrderNo?: string | null
      /** 操作人 ID，可空。 */
      operatorId?: number | null
      /** 操作人名称（冗余），可空。 */
      operatorName?: string | null
      /** 确认时间（ISO 8601），未确认时为 null。 */
      confirmedAt?: string | null
      /** 单据备注，可空。 */
      note?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 出库单明细列表。 */
      items: OutboundOrderItem[]
    }

    /** 出库单详情（含明细），与列表行结构一致。 */
    type OutboundOrderDetail = OutboundOrderListItem

    /** 出库单列表分页响应。 */
    type OutboundOrderList = Api.Common.PaginatedResponse<OutboundOrderListItem>

    /**
     * 出库单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface OutboundOrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 出库单号（模糊匹配）。 */
      outboundNo?: string
      /** 出库类型。 */
      type?: OutboundType
      /** 仓库 ID。 */
      warehouseId?: number | string
      /** 单据状态。 */
      status?: OutboundStatus
      /** 操作人 ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 出库单明细提交项。 */
    interface OutboundOrderItemPayload {
      /** SKU ID（必填）。 */
      skuId: number
      /** 出库数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /**
     * 创建出库单提交载荷。
     *
     * 创建后状态固定为 DRAFT，outboundNo 由系统生成。
     */
    interface OutboundOrderPayload {
      /** 出库类型（必填）。 */
      type: OutboundType
      /** 仓库 ID（必填）。 */
      warehouseId: number
      /** 关联订单号（≤40 字符），可空。 */
      relatedOrderNo?: string
      /** 单据备注（≤500 字符），可空。 */
      note?: string
      /** 出库单明细列表（1 ~ 200 条）。 */
      items: OutboundOrderItemPayload[]
    }

    // ============== 调拨单（Requirement 19 / 任务 31） ==============

    /**
     * 调拨单状态枚举。
     *
     * 状态机：
     * - PENDING_REVIEW → PENDING_OUT / REJECTED / VOID；
     * - PENDING_OUT → PENDING_IN / VOID（作废时回滚 from 仓 IN_TRANSIT → AVAILABLE）；
     * - PENDING_IN → COMPLETED / VOID（作废时回滚 from 仓 IN_TRANSIT → AVAILABLE）；
     * - COMPLETED / REJECTED / VOID 为终态。
     */
    type TransferStatus =
      | 'PENDING_REVIEW'
      | 'PENDING_OUT'
      | 'PENDING_IN'
      | 'COMPLETED'
      | 'REJECTED'
      | 'VOID'

    /**
     * 调拨单审核动作枚举（用于审核接口入参）。
     * - `APPROVE`: 审核通过，PENDING_REVIEW → PENDING_OUT，触发 from 仓 AVAILABLE → IN_TRANSIT；
     * - `REJECT`: 审核驳回，PENDING_REVIEW → REJECTED，不变更库存。
     */
    type TransferReviewAction = 'APPROVE' | 'REJECT'

    /**
     * 调拨单明细（列表 / 详情共用）。
     *
     * 后端 detail include 中附带 sku / product 子集，前端展示时直接消费 `skuCode`、
     * `specText`、`productName` 等冗余字段；写入时仅 `skuId` / `quantity` 必填。
     */
    interface TransferOrderItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 SKU ID。 */
      skuId: number
      /** SKU 编码（响应携带）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应携带）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 关联商品 ID（响应携带，由后端基于 SKU 回填）。 */
      productId?: number
      /** 商品名称（响应携带）。 */
      productName?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 调拨数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string | null
    }

    /** 调拨单列表行。 */
    interface TransferOrderListItem {
      /** 调拨单主键 ID。 */
      id: number
      /** 调拨单号（系统生成 TR+yyyymmdd+4 位序号）。 */
      transferNo: string
      /** 调出仓库 ID。 */
      fromWarehouseId: number
      /** 调出仓库编码（冗余）。 */
      fromWarehouseCode?: string | null
      /** 调出仓库名称（冗余）。 */
      fromWarehouseName?: string | null
      /** 调入仓库 ID。 */
      toWarehouseId: number
      /** 调入仓库编码（冗余）。 */
      toWarehouseCode?: string | null
      /** 调入仓库名称（冗余）。 */
      toWarehouseName?: string | null
      /** 单据状态。 */
      status: TransferStatus
      /** 调拨原因，可空。 */
      reason?: string | null
      /** 单据备注，可空。 */
      note?: string | null
      /** 申请人 ID（创建人，后端字段名 applicantId），可空。 */
      applicantId?: number | null
      /** 申请人名称（冗余），可空。 */
      applicantName?: string | null
      /** 审核人 ID，可空。 */
      reviewerId?: number | null
      /** 审核人名称（冗余），可空。 */
      reviewerName?: string | null
      /** 审核时间（ISO 8601），可空。 */
      reviewedAt?: string | null
      /** 审核备注（驳回时建议必填），可空。 */
      reviewRemark?: string | null
      /** 调出操作人 ID，可空。 */
      shipperId?: number | null
      /** 调出操作人名称（冗余），可空。 */
      shipperName?: string | null
      /** 调出时间（ISO 8601），可空。 */
      shippedAt?: string | null
      /** 收货操作人 ID，可空。 */
      receiverId?: number | null
      /** 收货操作人名称（冗余），可空。 */
      receiverName?: string | null
      /** 收货时间（ISO 8601），可空。 */
      receivedAt?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 调拨单明细列表。 */
      items: TransferOrderItem[]
    }

    /** 调拨单详情（含明细），与列表行结构一致。 */
    type TransferOrderDetail = TransferOrderListItem

    /** 调拨单列表分页响应。 */
    type TransferOrderList = Api.Common.PaginatedResponse<TransferOrderListItem>

    /**
     * 调拨单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface TransferOrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 调拨单号（模糊匹配）。 */
      transferNo?: string
      /** 调出仓库 ID。 */
      fromWarehouseId?: number | string
      /** 调入仓库 ID。 */
      toWarehouseId?: number | string
      /** 单据状态。 */
      status?: TransferStatus
      /** 操作人（申请人）ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 调拨单明细提交项。 */
    interface TransferOrderItemPayload {
      /** SKU ID（必填）。 */
      skuId: number
      /** 调拨数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /**
     * 创建调拨单提交载荷。
     *
     * 创建后状态固定为 PENDING_REVIEW，transferNo 由系统生成。
     * `fromWarehouseId` 与 `toWarehouseId` 不可相同。
     */
    interface TransferOrderPayload {
      /** 调出仓库 ID（必填）。 */
      fromWarehouseId: number
      /** 调入仓库 ID（必填）。 */
      toWarehouseId: number
      /** 调拨原因（≤255 字符），可空。 */
      reason?: string
      /** 单据备注（≤500 字符），可空。 */
      note?: string
      /** 调拨单明细列表（1 ~ 200 条）。 */
      items: TransferOrderItemPayload[]
    }

    /** 审核调拨单提交载荷。 */
    interface TransferOrderReviewPayload {
      /** 审核动作（APPROVE 通过 / REJECT 驳回）。 */
      action: TransferReviewAction
      /** 审核备注（驳回时建议填写，≤255 字符）。 */
      reviewRemark?: string
    }

    /** 作废调拨单提交载荷。 */
    interface TransferOrderVoidPayload {
      /** 作废原因（必填，≤255 字符）。 */
      reason: string
    }

    // ============== 盘点单（Requirement 20 / 任务 32） ==============

    /**
     * 盘点单状态枚举。
     *
     * 状态机：
     * - PENDING → COUNTING（启动盘点，写入账面快照，不变更库存）
     * / VOID（直接作废，不变更库存）；
     * - COUNTING → COMPLETED（完成盘点，按差异调整 AVAILABLE）
     * / VOID（作废，不变更库存）；
     * - COMPLETED / VOID 为终态（COMPLETED 不允许作废）。
     */
    type StocktakeStatus = 'PENDING' | 'COUNTING' | 'COMPLETED' | 'VOID'

    /**
     * 盘点单明细（列表 / 详情共用）。
     *
     * 后端 detail include 中附带 sku / product 子集，前端展示时直接消费 `skuCode`、
     * `specText`、`productName` 等冗余字段；写入时仅 `skuId` / `note` 必填。
     * `accountQuantity` 在启动盘点时由后端基于 SkuStock.available 快照写入；
     * `actualQuantity` / `diffQuantity` 在 COUNTING 状态下通过 updateItem 录入或后端计算。
     */
    interface StocktakeOrderItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 SKU ID。 */
      skuId: number
      /** SKU 编码（响应携带）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应携带）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 关联商品 ID（响应携带，由后端基于 SKU 回填）。 */
      productId?: number
      /** 商品名称（响应携带）。 */
      productName?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 系统账面数量（启动盘点时基于 SkuStock.available 快照写入）。 */
      accountQuantity: number
      /** 实盘数量（COUNTING 状态下逐 SKU 录入；完成前可空）。 */
      actualQuantity?: number | null
      /** 差异数量（actualQuantity - accountQuantity，由后端在 updateItem / complete 时计算）。 */
      diffQuantity?: number | null
      /** 明细备注（≤255 字符），可空。 */
      note?: string | null
    }

    /** 盘点单列表行。 */
    interface StocktakeOrderListItem {
      /** 盘点单主键 ID。 */
      id: number
      /** 盘点单号（系统生成 ST+yyyymmdd+4 位序号）。 */
      stocktakeNo: string
      /** 仓库 ID。 */
      warehouseId: number
      /** 仓库编码（冗余）。 */
      warehouseCode?: string | null
      /** 仓库名称（冗余）。 */
      warehouseName?: string | null
      /** 单据状态。 */
      status: StocktakeStatus
      /** 盘点原因，可空。 */
      reason?: string | null
      /** 单据备注，可空。 */
      note?: string | null
      /** 申请人 ID（创建人，后端字段名 applicantId），可空。 */
      applicantId?: number | null
      /** 申请人名称（冗余），可空。 */
      applicantName?: string | null
      /** 启动盘点时间（ISO 8601），PENDING → COUNTING 时回填，可空。 */
      startedAt?: string | null
      /** 完成盘点时间（ISO 8601），COUNTING → COMPLETED 时回填，可空。 */
      completedAt?: string | null
      /** 作废时间（ISO 8601），状态置为 VOID 时回填，可空。 */
      voidedAt?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 盘点单明细列表。 */
      items: StocktakeOrderItem[]
    }

    /** 盘点单详情（含明细），与列表行结构一致。 */
    type StocktakeOrderDetail = StocktakeOrderListItem

    /** 盘点单列表分页响应。 */
    type StocktakeOrderList = Api.Common.PaginatedResponse<StocktakeOrderListItem>

    /**
     * 盘点单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface StocktakeOrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 盘点单号（模糊匹配）。 */
      stocktakeNo?: string
      /** 仓库 ID。 */
      warehouseId?: number | string
      /** 单据状态。 */
      status?: StocktakeStatus
      /** 操作人（申请人）ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 盘点单明细提交项（仅在创建 / 编辑整单时使用）。 */
    interface StocktakeOrderItemPayload {
      /** SKU ID（必填）。 */
      skuId: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /**
     * 创建盘点单提交载荷。
     *
     * 创建后状态固定为 PENDING，stocktakeNo 由系统生成；accountQuantity 在
     * "启动盘点"环节基于 SkuStock.available 快照写入，因此创建时无需传入数量。
     * 明细数量限制 1 ~ 500 条。
     */
    interface StocktakeOrderPayload {
      /** 仓库 ID（必填）。 */
      warehouseId: number
      /** 盘点原因（≤255 字符），可空。 */
      reason?: string
      /** 单据备注（≤500 字符），可空。 */
      note?: string
      /** 盘点单明细列表（1 ~ 500 条）。 */
      items: StocktakeOrderItemPayload[]
    }

    /**
     * 单条盘点明细录入 / 修改载荷（COUNTING 状态使用）。
     *
     * 仅在 status=COUNTING 时允许提交；后端会同步更新 diffQuantity = actualQuantity - accountQuantity。
     */
    interface StocktakeItemUpdatePayload {
      /** 实盘数量（非负整数）。 */
      actualQuantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /** 作废盘点单提交载荷。 */
    interface StocktakeOrderVoidPayload {
      /** 作废原因（必填，≤255 字符）。 */
      reason: string
    }

    // ============== 订单发货单（Requirement 22 / 任务 38） ==============

    /**
     * 发货单状态枚举。
     *
     * 状态机：
     * - `SHIPPED`：发货单创建后默认状态，已扣减 LOCKED 库存并写出库流水；
     * - `SIGNED`：客户确认收货，回填 `signedAt`；
     * - `EXCEPTION`：物流异常 / 寄件失败等需要人工介入的状态。
     *
     * 后端在 `SHIPPED ↔ EXCEPTION ↔ SIGNED` 之间允许通过 `update` 接口推进；
     * 创建 / 删除发货单不在此处建模，订单维度的 `orderStatus` / `fulfillmentStatus`
     * 由 Service 自动派生。
     */
    type ShipmentStatus = 'SHIPPED' | 'SIGNED' | 'EXCEPTION'

    /**
     * 发货单明细（列表 / 详情共用）。
     *
     * 后端 detail include 中附带 sku / product / orderItem 子集，前端展示时直接消费
     * `productName`、`skuCode`、`specText`、`imageUrl` 等冗余字段，并基于
     * `orderItemQuantity` / `orderItemShippedQuantity` 做"剩余可发货数量"的展示与校验。
     * 写入时仅 `orderItemId` / `quantity` 必填。
     */
    interface OrderShipmentItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 OrderItem ID（必填）。 */
      orderItemId: number
      /** 关联 SKU ID（响应携带；OrderItem 关联的 SKU 软删除后可能为空）。 */
      skuId?: number | null
      /** 关联商品 ID（响应携带）。 */
      productId?: number | null
      /** 商品名称（响应快照）。 */
      productName: string
      /** SKU 编码（响应快照）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应快照）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 本次发货数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** OrderItem 订单总数量（响应携带，用于前端展示剩余可发货数量）。 */
      orderItemQuantity?: number | null
      /** OrderItem 累计已发货数量（响应携带，含本次发货前的快照）。 */
      orderItemShippedQuantity?: number | null
      /** 明细备注（≤255 字符），可空。 */
      note?: string | null
    }

    /** 发货单列表行（与详情结构一致）。 */
    interface OrderShipmentListItem {
      /** 发货单主键 ID。 */
      id: number
      /** 发货单号（系统生成 SH+yyyymmdd+4 位序号）。 */
      shipmentNo: string
      /** 关联订单 ID。 */
      orderId: number
      /** 关联订单号（冗余）。 */
      orderNo?: string | null
      /** 关联订单状态（冗余）。 */
      orderStatus?: OrderStatus | null
      /** 关联订单支付状态（冗余）。 */
      paymentStatus?: PaymentStatus | null
      /** 关联订单履约状态（冗余）。 */
      fulfillmentStatus?: FulfillmentStatus | null
      /** 收件人姓名（冗余 Order.recipientName）。 */
      recipientName?: string | null
      /** 收件人电话（冗余 Order.recipientPhone）。 */
      recipientPhone?: string | null
      /** 收件人地址（冗余 Order.recipientAddress）。 */
      recipientAddress?: string | null
      /** 发货仓库 ID，缺省时取默认仓。 */
      warehouseId?: number | null
      /** 发货仓库编码（冗余）。 */
      warehouseCode?: string | null
      /** 发货仓库名称（冗余）。 */
      warehouseName?: string | null
      /** 物流公司 ID。 */
      expressCompanyId?: number | null
      /** 物流公司编码（冗余）。 */
      expressCompanyCode?: string | null
      /** 物流公司名称（冗余快照）。 */
      expressCompanyName?: string | null
      /** 运单号。 */
      trackingNo?: string | null
      /** 发货单状态。 */
      status: ShipmentStatus
      /** 发货时间（ISO 8601）。 */
      shippedAt: string
      /** 签收时间（ISO 8601），SIGNED 时回填，可空。 */
      signedAt?: string | null
      /** 操作人 ID（创建 / 编辑发货单的后台用户）。 */
      operatorId?: number | null
      /** 操作人名称（冗余快照）。 */
      operatorName?: string | null
      /** 单据备注（≤500 字符），可空。 */
      note?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 发货单明细列表。 */
      items: OrderShipmentItem[]
    }

    /** 发货单详情（含明细），与列表行结构一致。 */
    type OrderShipmentDetail = OrderShipmentListItem

    /** 发货单列表分页响应。 */
    type OrderShipmentList = Api.Common.PaginatedResponse<OrderShipmentListItem>

    /**
     * 发货单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface OrderShipmentSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 关联订单 ID（精确匹配）。 */
      orderId?: number | string
      /** 发货单状态。 */
      status?: ShipmentStatus
      /** 物流公司 ID。 */
      expressCompanyId?: number | string
      /** 运单号（模糊匹配）。 */
      trackingNo?: string
      /** 操作人 ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 发货单明细提交项。 */
    interface OrderShipmentItemPayload {
      /** 关联 OrderItem ID（必填）。 */
      orderItemId: number
      /** 本次发货数量（正整数，1 ~ 999999）。 */
      quantity: number
      /** 明细备注（≤255 字符），可空。 */
      note?: string
    }

    /**
     * 创建发货单提交载荷。
     *
     * 创建后状态固定为 SHIPPED，shipmentNo 由系统生成；warehouseId 缺省取默认仓。
     * 业务约束：
     * - 仅 paymentStatus=PAID 的订单允许发货（VIRTUAL 全虚拟订单付款时已自动履约，无需调用）；
     * - 每条明细 `quantity + orderItem.shippedQuantity ≤ orderItem.quantity`，
     * 超出时后端返回错误码 `MALL_ORDER_SHIPMENT_QUANTITY_EXCEED`。
     * - 明细数量限制 1 ~ 200 条。
     */
    interface OrderShipmentPayload {
      /** 关联订单 ID（必填）。 */
      orderId: number
      /** 发货仓库 ID（缺省取默认仓）。 */
      warehouseId?: number
      /** 物流公司 ID。 */
      expressCompanyId?: number
      /** 运单号（≤80 字符）。 */
      trackingNo?: string
      /** 单据备注（≤500 字符）。 */
      note?: string
      /** 发货时间（ISO 8601；缺省取当前时间）。 */
      shippedAt?: string
      /** 发货单明细列表（1 ~ 200 条）。 */
      items: OrderShipmentItemPayload[]
    }

    /**
     * 更新发货单提交载荷。
     *
     * 仅 `status` 在 `SHIPPED` / `EXCEPTION` 时允许编辑；
     * 可调整运单号、物流公司、备注，以及在 `SHIPPED ↔ EXCEPTION ↔ SIGNED` 之间推进状态，
     * 状态置为 `SIGNED` 时后端自动回填 `signedAt`。
     */
    interface OrderShipmentUpdatePayload {
      /** 物流公司 ID。 */
      expressCompanyId?: number
      /** 运单号（≤80 字符）。 */
      trackingNo?: string
      /** 发货单状态。 */
      status?: ShipmentStatus
      /** 单据备注（≤500 字符）。 */
      note?: string
    }

    // ============== 订单改价 / 改地址 / 取消（Requirement 25, 26, 27 / 任务 39） ==============

    /**
     * 订单改价提交载荷。
     *
     * 前置条件：paymentStatus = UNPAID 且 orderStatus = PENDING_PAYMENT。
     * 后端在事务内更新 freightAmount / discountAmount / payAmount，并写入
     * OrderOperateLog（action = ADJUST_PRICE，note 含 reasonText 与变动前后金额）。
     * payAmount = productAmount + freightAmount - discountAmount ≥ 0。
     */
    interface OrderAdjustPricePayload {
      /** 运费金额（分，非负整数）。 */
      freightAmount: number
      /** 整单优惠金额（分，非负整数）。 */
      discountAmount: number
      /** 改价原因（必填，1~200 字符）。 */
      reasonText: string
    }

    /**
     * 订单改地址提交载荷。
     *
     * 前置条件：fulfillmentStatus = UNFULFILLED 且 orderStatus 不在 (CLOSED, CANCELLED, COMPLETED)。
     * VIRTUAL 订单不允许改地址。
     */
    interface OrderAdjustAddressPayload {
      /** 收货人姓名（必填）。 */
      recipientName: string
      /** 收货人手机号（11 位）。 */
      recipientPhone: string
      /** 省份。 */
      province: string
      /** 城市。 */
      city: string
      /** 区县。 */
      district: string
      /** 详细地址。 */
      address: string
      /** 改址原因（1~200 字符）。 */
      reasonText: string
    }

    /**
     * 订单取消提交载荷。
     *
     * 前置条件：orderStatus 在 (PENDING_PAYMENT, PAID, PENDING_SHIPMENT) 且 fulfillmentStatus = UNFULFILLED。
     */
    interface OrderCancelPayload {
      /** 取消原因（必填，1~200 字符）。 */
      reasonText: string
    }

    // ============== 售后单（Requirement 28 / 任务 45） ==============

    /**
     * 售后类型枚举。
     *
     * - `REFUND_ONLY`：仅退款（无需退货）。
     * - `REFUND_RETURN`：退货退款（标记退款时同步将默认仓 AVAILABLE 库存回退）。
     * - `EXCHANGE`：换货（不涉及退款金额，refundAmount 为 null）。
     */
    type AftersaleType = 'REFUND_ONLY' | 'REFUND_RETURN' | 'EXCHANGE'

    /**
     * 售后单状态枚举。
     *
     * 状态机：
     * - `PENDING_REVIEW` → `APPROVED` / `REJECTED` / `CANCELLED`
     * - `APPROVED` → `REFUNDED` / `CANCELLED`
     */
    type AftersaleStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'CANCELLED'

    /**
     * 订单维度的售后聚合状态（冗余在 Order.aftersaleStatus 上）。
     *
     * 由后端 `AftersalesService.refreshOrderAftersaleStatus` 推导：
     * - 不存在任何非取消 / 非驳回的售后单 → null（前端表现为 `NONE`）。
     * - 存在 PENDING_REVIEW / APPROVED 的售后单 → `PROCESSING`。
     * - 全部进入终态且存在 REFUNDED：累计 refunded 数量 ≥ 订单项数量 → `ALL_REFUNDED`，否则 `PARTIAL_REFUNDED`。
     * - `FAILED` 为保留枚举值，本期不主动设置。
     */
    type OrderAftersaleStatus =
      | 'NONE'
      | 'PROCESSING'
      | 'PARTIAL_REFUNDED'
      | 'ALL_REFUNDED'
      | 'FAILED'

    /**
     * 售后操作日志（AftersaleOperateLog）。
     *
     * 仅追加，按 createdAt asc 返回，用于详情页时间线展示。
     */
    interface AftersaleOperateLog {
      /** 日志主键 ID。 */
      id: number
      /** 变更前状态；创建动作此处为 null。 */
      fromStatus?: AftersaleStatus | null
      /** 变更后状态。 */
      toStatus: AftersaleStatus
      /** 备注（含驳回原因 / 退款金额等）。 */
      note?: string | null
      /** 操作人 ID。 */
      operatorId?: number | null
      /** 操作人显示名（冗余快照）。 */
      operatorName?: string | null
      /** 写入时间（ISO 8601）。 */
      createdAt: string
    }

    /**
     * 售后单明细（列表 / 详情共用）。
     *
     * 后端 detail include 中附带 sku / product / orderItem 子集，前端展示时直接消费
     * `productName`、`skuCode`、`specText`、`imageUrl` 等冗余字段；
     * 写入时仅 `orderItemId` / `quantity` 必填。
     */
    interface AftersaleOrderItem {
      /** 明细主键 ID（仅响应携带；提交时不传）。 */
      id?: number
      /** 关联 OrderItem ID（必填）。 */
      orderItemId: number
      /** 关联 SKU ID（响应携带；OrderItem 关联的 SKU 软删除后可能为空）。 */
      skuId?: number | null
      /** SKU 编码（响应快照）。 */
      skuCode?: string | null
      /** SKU 规格描述（响应快照）。 */
      specText?: string | null
      /** SKU 图片 URL（响应携带）。 */
      imageUrl?: string | null
      /** 关联商品 ID（响应携带）。 */
      productId?: number | null
      /** 商品名称（响应快照）。 */
      productName?: string | null
      /** 商品编码（响应携带）。 */
      productNo?: string | null
      /** 商品封面 URL（响应携带）。 */
      productCoverUrl?: string | null
      /** 单价（分，响应携带 OrderItem.salePrice 快照）。 */
      salePrice?: number | null
      /** 售后数量（正整数）。 */
      quantity: number
      /** 关联 OrderItem 的订单数量（响应携带，用于校验剩余可申请数量）。 */
      orderItemQuantity?: number | null
      /** 关联 OrderItem 累计已发货数量（响应携带）。 */
      orderItemShippedQuantity?: number | null
    }

    /**
     * 售后单列表行（与详情结构一致）。
     *
     * 列表与详情共用同一形态，仅在详情接口中保证 `items` / `operateLogs` 完整。
     */
    interface AftersaleOrderListItem {
      /** 售后单主键 ID。 */
      id: number
      /** 售后单号（系统生成 AS+yyyymmdd+6 位序号）。 */
      aftersaleNo: string
      /** 关联订单 ID。 */
      orderId: number
      /** 关联订单号（冗余）。 */
      orderNo?: string | null
      /** 关联订单状态（冗余）。 */
      orderStatus?: OrderStatus | null
      /** 关联订单支付状态（冗余）。 */
      paymentStatus?: PaymentStatus | null
      /** 关联订单履约状态（冗余）。 */
      fulfillmentStatus?: FulfillmentStatus | null
      /** 关联订单的售后聚合状态（冗余 Order.aftersaleStatus，由后端推导）。 */
      orderAftersaleStatus?: OrderAftersaleStatus | null
      /** 关联订单累计退款金额（分）。 */
      orderTotalRefundAmount?: number | null
      /** 关联订单实付金额（分）。 */
      orderPayAmount?: number | null
      /** 关联订单的会员名（冗余 Order.username）。 */
      username?: string | null
      /** 收件人姓名（冗余 Order.recipientName）。 */
      recipientName?: string | null
      /** 收件人电话（冗余 Order.recipientPhone）。 */
      recipientPhone?: string | null
      /** 售后类型。 */
      type: AftersaleType
      /** 售后状态。 */
      status: AftersaleStatus
      /** 原因码（字典 code），可空。 */
      reasonCode?: string | null
      /** 原因说明 / 驳回原因（≤500 字符），可空。 */
      reasonText?: string | null
      /** 退款金额（分）；EXCHANGE 类型为 null。 */
      refundAmount?: number | null
      /** 客户备注（≤500 字符），可空。 */
      buyerNote?: string | null
      /** 凭证图片列表（最多 9 张），可为空数组。 */
      imageUrls: string[]
      /** 操作人 ID。 */
      operatorId?: number | null
      /** 操作人显示名（冗余）。 */
      operatorName?: string | null
      /** 审核时间（同意 / 驳回）；尚未审核时为 null。 */
      reviewedAt?: string | null
      /** 退款时间；未标记退款时为 null。 */
      refundedAt?: string | null
      /** 取消时间；未取消时为 null。 */
      cancelledAt?: string | null
      /** 创建时间（ISO 8601）。 */
      createdAt: string
      /** 更新时间（ISO 8601）。 */
      updatedAt: string
      /** 售后明细列表。 */
      items: AftersaleOrderItem[]
      /** 操作日志列表（按 createdAt asc 排序）。 */
      operateLogs: AftersaleOperateLog[]
      /**
       * 该售后单关联的原 PAYMENT 流水的通道编码（可空）。
       *
       * 用于前端判断是否展示「线上退款」按钮：channelCode=MANUAL 时隐藏线上退款，
       * 仅保留「标记已退款」（Requirement 7.3）。
       * 后端在列表 / 详情接口中按 orderId 查找 status=SUCCEEDED 的 PAYMENT 流水并取其 channelCode。
       */
      paymentChannelCode?: PaymentChannelCode | null
      /**
       * 该售后单关联的 type=REFUND 退款流水列表（可空）。
       *
       * 用于在售后单列表中展示「线上退款流水」列的状态，以及提供「重试」按钮
       * （仅 status=FAILED 时可见）。后端按 metadata.aftersaleId 关联查询。
       */
      refundTransactions?: Array<{
        /** 退款流水主键 ID。 */
        id: number
        /** 系统单号。 */
        transactionNo: string
        /** 通道编码。 */
        channelCode: PaymentChannelCode
        /** 退款金额（分）。 */
        amount: number
        /** 流水状态。 */
        status: PaymentTransactionStatus
        /** 失败码（仅 FAILED 时填充）。 */
        failureCode?: string | null
        /** 失败描述（仅 FAILED 时填充）。 */
        failureMessage?: string | null
        /** 创建时间。 */
        createdAt: string
      }> | null
    }

    /** 售后单详情（含明细 / 操作日志），与列表行结构一致。 */
    type AftersaleOrderDetail = AftersaleOrderListItem

    /** 售后单列表分页响应。 */
    type AftersaleOrderList = Api.Common.PaginatedResponse<AftersaleOrderListItem>

    /**
     * 售后单列表查询参数。
     *
     * 后端将分页 / ID 类参数统一接受字符串形式，因此此处保留 `string | number` 联合，
     * 方便前端直接拼接 query string 不需要手动转换。
     */
    interface AftersaleOrderSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number | string
      /** 每页条数。 */
      size?: number | string
      /** 售后单号关键字（模糊匹配，大小写不敏感）。 */
      aftersaleNo?: string
      /** 关联订单号关键字（模糊匹配，大小写不敏感）。 */
      orderNo?: string
      /** 关联订单 ID（精确匹配）。 */
      orderId?: number | string
      /** 售后类型。 */
      type?: AftersaleType
      /** 售后状态。 */
      status?: AftersaleStatus
      /** 操作人 ID。 */
      operatorId?: number | string
      /** 创建开始时间（ISO 8601）。 */
      startTime?: string
      /** 创建结束时间（ISO 8601）。 */
      endTime?: string
    }

    /** 售后单明细提交项（创建时使用）。 */
    interface AftersaleOrderItemPayload {
      /** 关联 OrderItem ID（必填）。 */
      orderItemId: number
      /** 售后数量（正整数）。 */
      quantity: number
    }

    /**
     * 创建售后单提交载荷。
     *
     * 业务约束：
     * - 关联订单必须 `paymentStatus=PAID`；
     * - 每条明细 `quantity + 该 OrderItem 上未取消售后单累计已占用数量 ≤ orderItem.quantity`，
     * 超出时后端返回错误码 `MALL_AFTERSALE_QUANTITY_EXCEEDED`；
     * - 明细数量限制 1 ~ 100 条且 `orderItemId` 不可重复；
     * - `REFUND_ONLY` / `REFUND_RETURN` 类型必须填写 `refundAmount`，且不超过已选明细累计金额；
     * `EXCHANGE` 类型 `refundAmount` 应留空（即使提交后端也会忽略）。
     */
    interface AftersaleOrderPayload {
      /** 关联订单 ID（必填）。 */
      orderId: number
      /** 售后类型（必填）。 */
      type: AftersaleType
      /** 退款金额（分）。`REFUND_ONLY` / `REFUND_RETURN` 必填。 */
      refundAmount?: number
      /** 原因码（字典 code，≤50 字符），可空。 */
      reasonCode?: string
      /** 原因说明（≤500 字符），可空。 */
      reasonText?: string
      /** 客户备注（≤500 字符），可空。 */
      buyerNote?: string
      /** 凭证图片 URL 列表（最多 9 张，每个 URL ≤500 字符）。 */
      imageUrls?: string[]
      /** 售后明细列表（1 ~ 100 条，orderItemId 不可重复）。 */
      items: AftersaleOrderItemPayload[]
    }

    /** 驳回售后单提交载荷。 */
    interface AftersaleRejectPayload {
      /** 驳回原因（必填，1~500 字符）。 */
      reasonText: string
    }

    /** 取消售后单提交载荷（PENDING_REVIEW 状态下使用）。 */
    interface AftersaleCancelPayload {
      /** 取消原因（≤500 字符），可空。 */
      reasonText?: string
    }

    // ===========================================================================
    // 商城支付通道（ / Task 8）
    // ===========================================================================
    //
    // 后端模块：`src/modules/mall/payment/channels`，对应 controller 端点：
    // GET /mall/payment/channels 分页列表（脱敏）
    // GET /mall/payment/channels/:id 详情（脱敏）
    // POST /mall/payment/channels 新增
    // PATCH /mall/payment/channels/:id 编辑（credentials 字段差分语义）
    // DELETE /mall/payment/channels/:id 删除（被未关闭流水引用时拒绝）
    // PATCH /mall/payment/channels/:id/enable 启用 / 禁用
    // POST /mall/payment/channels/:id/test 连通性测试（不写流水）
    //
    // 设计要点：
    // - **敏感字段掩码，非敏感字段回显**：`credentials` 中的密钥类字段返回
    // `{ configured, preview }`，AppId / 商户号等非敏感字段返回字符串。
    // - **Credential 4 种语义**：编辑请求 `credentials` 字段 value 类型为 `string | null`：
    // | 提交 | 含义 |
    // | ------------------- | --------------------------------- |
    // | key 不存在 / undefined | 保留原值 |
    // | `''`（空字符串） | 保留原值（Requirement 3.4） |
    // | `null` | 视为清空 |
    // | 非空 string | 写入新值 |
    // - **测试连通性不写流水**：service 端使用 1 分（最小金额）伪订单调 `Provider.createPayment`，
    // 返回 `{ success, errorCode?, errorMessage?, latencyMs }`（Requirement 2.11）。

    /**
     * 通道编码枚举。
     *
     * 与后端 Prisma `PaymentChannelCode` enum 一一对应；前端选择器、Schema 驱动表单、
     * 流水筛选 / Webhook 路由等场景共用。
     */
    type PaymentChannelCode =
      | 'MANUAL'
      | 'WECHAT_NATIVE'
      | 'WECHAT_JSAPI'
      | 'WECHAT_H5'
      | 'ALIPAY_PAGE'
      | 'ALIPAY_WAP'
      | 'STRIPE_PAYMENT_INTENT'
      | 'STRIPE_CHECKOUT'

    /**
     * 通道凭据字段的脱敏视图条目。
     *
     * `configured = true` 表示该字段在密文 JSON 中存在且非空；`preview` 是脱敏后的前后缀预览。
     * 前端配置页据此显示可识别的掩码值，并通过弹窗录入新值。
     */
    interface PaymentChannelMaskedCredentialField {
      configured: boolean
      preview: string
    }

    type PaymentChannelCredentialViewField = string | PaymentChannelMaskedCredentialField

    /**
     * 通道实例的脱敏视图（GET / POST / PATCH 类响应共用）。
     *
     * - `credentials`：敏感字段脱敏；非敏感字段回显为字符串。
     * - `metadata`：非敏感运行期配置（`notifyUrlBase / currency / iconUrl` 等）。
     * - `updatedById / updatedByName`：来自 OperationLog 的最近修改人（可空）。
     */
    interface PaymentChannelItem {
      /** 通道实例主键 ID。 */
      id: number
      /** 通道编码（一旦创建不可修改）。 */
      code: PaymentChannelCode
      /** 通道实例显示名（同 code 下唯一）。 */
      name: string
      /** 是否启用。 */
      enabled: boolean
      /** 是否同 code 下默认实例（同 code 下全局至多 1 条 true）。 */
      isDefault: boolean
      /** 沙箱模式开关。 */
      sandboxMode: boolean
      /** 凭据字段集合；敏感字段为掩码对象，非敏感字段为字符串。 */
      credentials: Record<string, PaymentChannelCredentialViewField>
      /** 非敏感运行期配置 JSON（按 channelCode 字段集变化）。 */
      metadata: Record<string, unknown>
      /** 备注（可空）。 */
      remark: string | null
      /** 排序值（越小越靠前）。 */
      sort: number
      /** 创建时间（ISO 字符串）。 */
      createdAt: string
      /** 更新时间（ISO 字符串）。 */
      updatedAt: string
      /** 最近修改人 ID。 */
      updatedById: number | null
      /** 最近修改人显示名。 */
      updatedByName: string | null
    }

    /** 通道列表分页响应。 */
    type PaymentChannelList = Api.Common.PaginatedResponse<PaymentChannelItem>

    /** 通道列表查询参数。 */
    interface PaymentChannelSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码。 */
      current?: number
      /** 每页条数。 */
      size?: number
      /** 通道编码精确筛选。 */
      code?: PaymentChannelCode
      /**
       * 启用状态筛选；后端约定仅接受字符串 `'true'` / `'false'`，缺省 / 其它值视为不筛选。
       */
      enabled?: 'true' | 'false'
      /** 关键字（name / remark 模糊匹配，大小写不敏感）。 */
      keyword?: string
    }

    /**
     * 通道凭据字段差分语义类型。
     *
     * - `string`：包含空字符串与非空字符串两种情形；非空字符串视为「写入新值」，
     * 空字符串视为「保留原值」（Requirement 3.4）。
     * - `null`：视为「清空」。
     * - 缺省 / `undefined`（即对象上没有该 key）：视为「保留原值」。
     *
     * 前端配置页只把「用户主动修改」的敏感字段塞进提交体；未触动的字段不下发，
     * 由后端识别为「保留原值」语义。
     */
    type PaymentChannelCredentialFieldInput = string | null

    /** 创建通道实例请求载荷。 */
    interface PaymentChannelCreatePayload {
      /** 通道编码（一旦创建不可修改）。 */
      code: PaymentChannelCode
      /** 通道实例显示名（1~80 字符，同 code 下唯一）。 */
      name: string
      /** 是否启用，默认 true。 */
      enabled?: boolean
      /** 是否默认实例，默认 false（同 code 下全局至多 1 条 true）。 */
      isDefault?: boolean
      /** 沙箱模式开关，默认 false。 */
      sandboxMode?: boolean
      /**
       * 凭据字段集合（明文）。
       *
       * 字段集随 channelCode 变化（详见后端 `channel-field-schemas`）；本类型只约束
       * 「value 是 string 或 null」的最低限度，进一步的字段类型校验在后端 service 完成。
       */
      credentials?: Record<string, PaymentChannelCredentialFieldInput>
      /** 非敏感运行期配置（如 `notifyUrlBase / currency / iconUrl`）。 */
      metadata?: Record<string, unknown>
      /** 备注，最大 255 字符。 */
      remark?: string | null
      /** 排序值，正整数，默认 100。 */
      sort?: number
    }

    /**
     * 更新通道实例请求载荷。
     *
     * 与创建载荷的差异：
     * - **`code` 不可修改**：本类型不声明 `code`；提交携带也会被后端忽略。
     * - **`name` 改为可选**：编辑场景下未触动则保留原值。
     * - **`credentials` 字段差分**：详见 `PaymentChannelCredentialFieldInput`。
     * - **`metadata` 整体覆盖**：提供时整体替换原 metadata；不提供时保留原值（与
     * credentials 的字段差分语义不同）。
     * - **`remark`**：`string` 写入新值（后端会 trim 空白后视为 null）；`null` 清空；
     * 缺省保留原值。
     */
    interface PaymentChannelUpdatePayload {
      name?: string
      enabled?: boolean
      isDefault?: boolean
      sandboxMode?: boolean
      credentials?: Record<string, PaymentChannelCredentialFieldInput>
      metadata?: Record<string, unknown>
      remark?: string | null
      sort?: number
    }

    /** 切换通道启用状态请求载荷（与 update 解耦的单字段端点）。 */
    interface PaymentChannelToggleEnabledPayload {
      enabled: boolean
    }

    /**
     * 通道连通性测试响应（Requirement 2.11）。
     *
     * `success` 为 true 表示 Provider.createPayment 返回 `PENDING / SUCCEEDED /
     * NEED_MANUAL_CONFIRM`（视为渠道方可达）；其它情形 `success=false` 并附 `errorCode`
     * + `errorMessage` 用于前端展示。`latencyMs` 是 `Provider.createPayment` 调用耗时。
     */
    interface PaymentChannelTestResult {
      success: boolean
      errorCode?: string
      errorMessage?: string
      latencyMs: number
    }

    /** 删除通道实例响应（与 brand / warehouse 等模块的 `{ message }` 风格一致）。 */
    interface PaymentChannelDeleteResult {
      message: string
    }

    // ----------------------------------------------------------------------
    // 支付流水（PaymentTransaction）—— // ----------------------------------------------------------------------

    /**
     * 支付流水类型枚举（与后端 Prisma `PaymentTransactionType` 一一对应）。
     *
     * - `PAYMENT`：用户向商户付款的流水。
     * - `REFUND`：商户向用户退款的流水（`parentTransactionId` 指向原 PAYMENT）。
     */
    type PaymentTransactionType = 'PAYMENT' | 'REFUND'

    /**
     * 支付流水状态机枚举（与后端 Prisma `PaymentTransactionStatus` 一一对应）。
     *
     * - `PENDING`：发起后等待渠道方处理 / 等待回调。
     * - `SUCCEEDED`：渠道方确认成功（终态）。
     * - `FAILED`：渠道方报告失败（终态）。
     * - `EXPIRED`：超过 60 分钟仍未到达终态被调度器置为过期（终态）。
     * - `CANCELLED`：人工关闭未支付流水（终态）。
     * - `REFUNDED`：原 PAYMENT 流水累计退款 ≥ 原金额时附带的展示态。
     * - `PARTIAL_REFUNDED`：原 PAYMENT 流水累计退款 < 原金额时附带的展示态。
     */
    type PaymentTransactionStatus =
      | 'PENDING'
      | 'SUCCEEDED'
      | 'FAILED'
      | 'EXPIRED'
      | 'CANCELLED'
      | 'REFUNDED'
      | 'PARTIAL_REFUNDED'

    /**
     * 支付流水视图（list / byOrder / 嵌入 detail.parent 共用）。
     *
     * 与后端 `PaymentTransactionView` 字段一一对应；时间字段以 ISO 字符串形态序列化。
     *
     * `metadata` 字段约定结构（service 层强约束 key 集合，详见 design.md §
     * PaymentTransactionMetadata）：
     *
     * | key | 出现场景 | 含义 |
     * | --- | --- | --- |
     * | `paymentUrl` | PAYMENT (微信 H5 / 支付宝 PC/WAP / Stripe Checkout) | 跳转支付 URL |
     * | `qrCode` | PAYMENT (微信 Native) | 扫码字符串 |
     * | `clientSecret` | PAYMENT (Stripe Payment Intent) | 前端调起密钥 |
     * | `payConfig` | PAYMENT (微信 JSAPI) | JSAPI 调起参数 |
     * | `expiresAt` | PAYMENT | ISO 8601 过期时间 |
     * | `aftersaleId` / `aftersaleNo` | REFUND | 触发退款的售后单 |
     * | `reason` | REFUND | 退款原因 |
     * | `sandboxFlag` | 通用 | 是否沙箱模式（前端打 Tag 用） |
     * | `displayName` | 通用 | 通道展示名（如「微信支付 - Native」） |
     * | `hint` | PAYMENT (Manual) | 提示文案 |
     */
    interface PaymentTransactionItem {
      /** 流水主键 ID。 */
      id: number
      /** 系统单号（PT 前缀代表 PAYMENT，RT 前缀代表 REFUND；唯一）。 */
      transactionNo: string
      /** 关联订单主键 ID。 */
      orderId: number
      /** 关联订单单号（冗余存储便于按订单号筛选）。 */
      orderNo: string
      /** 通道实例 ID（关联 `PaymentChannelConfig.id`）。 */
      channelConfigId: number
      /** 通道编码（冗余存储，便于按渠道维度筛选）。 */
      channelCode: PaymentChannelCode
      /** 流水类型：PAYMENT / REFUND。 */
      type: PaymentTransactionType
      /** 金额（单位：分；微信 / 支付宝原生即「分」；Stripe 取最小货币单位）。 */
      amount: number
      /** 货币编码（ISO-4217 三字母大写，默认 CNY）。 */
      currency: string
      /** 流水状态。 */
      status: PaymentTransactionStatus
      /** 渠道侧请求 ID（如 prepay_id / payment_intent_id；可空）。 */
      providerRequestId: string | null
      /** 渠道侧最终交易号（如微信 transaction_id / 支付宝 trade_no；可空）。 */
      providerTransactionNo: string | null
      /** 买家附加信息（含 openid / cardLast4 等；可空）。 */
      buyerInfo: Record<string, unknown> | null
      /** 失败码（仅终态 FAILED 填充；可空）。 */
      failureCode: string | null
      /** 失败描述（仅终态 FAILED 填充；可空）。 */
      failureMessage: string | null
      /** 业务元数据（key 集合详见 interface 注释）。 */
      metadata: Record<string, unknown>
      /** 仅 type=REFUND 时填充：父 PAYMENT 流水 ID。 */
      parentTransactionId: number | null
      /** 仅 type=PAYMENT 时累计：已成功退款金额（单位：分）。 */
      refundedAmount: number
      /** 创建时间（ISO 字符串）。 */
      createdAt: string
      /** 更新时间（ISO 字符串）。 */
      updatedAt: string
      /** 渠道方报告的成功时间（ISO 字符串；可空）。 */
      succeededAt: string | null
      /** 流水关闭时间（CANCELLED / EXPIRED 时填充；ISO 字符串；可空）。 */
      closedAt: string | null
    }

    /**
     * 支付流水详情视图：在 `PaymentTransactionItem` 之外补充关联子结构。
     *
     * - `channelConfig`：通道实例非敏感字段子集，credentials 一律不下发（Requirement 3.3）。
     * - `parent`：仅 type=REFUND 时填充原 PAYMENT 流水视图。
     * - `webhookEvents`：与本流水关联的 webhook 事件清单（按 receivedAt desc 排序）。
     */
    interface PaymentTransactionDetail extends PaymentTransactionItem {
      channelConfig: {
        id: number
        code: PaymentChannelCode
        name: string
        sandboxMode: boolean
      }
      parent: PaymentTransactionItem | null
      webhookEvents: Array<{
        id: number
        channelCode: PaymentChannelCode
        eventType: WebhookEventType
        providerEventId: string | null
        signatureValid: boolean
        processStatus: WebhookProcessStatus
        receivedAt: string
      }>
    }

    /** 支付流水列表分页响应。 */
    type PaymentTransactionList = Api.Common.PaginatedResponse<PaymentTransactionItem>

    /**
     * 支付流水列表查询参数（Requirement 4.3）。
     *
     * `signatureValid / processStatus` 是 webhook 事件专属，不出现在本 DTO；流水列表
     * 仅按 type / status 等流水自身字段筛选。
     */
    interface PaymentTransactionSearchParams extends Partial<Api.Common.CommonSearchParams> {
      current?: number
      size?: number
      /** 订单号关键字（PaymentTransaction.orderNo 冗余字段精确匹配）。 */
      orderNo?: string
      /** 流水号精确匹配（PaymentTransaction.transactionNo 是 unique 字段）。 */
      transactionNo?: string
      /** 通道编码精确筛选。 */
      channelCode?: PaymentChannelCode
      /** 流水类型筛选：PAYMENT / REFUND。 */
      type?: PaymentTransactionType
      /** 流水状态精确筛选；多值由前端发起多次请求实现。 */
      status?: PaymentTransactionStatus
      /** 起始时间（ISO 字符串），按 createdAt 筛选。 */
      startTime?: string
      /** 结束时间（ISO 字符串），按 createdAt 筛选。 */
      endTime?: string
    }

    // ----------------------------------------------------------------------
    // 发起 / 查询 / 关闭 支付（PaymentService 编排端点）—— Task 14 / 20
    // ----------------------------------------------------------------------

    /**
     * 发起支付时携带的买家附加信息（Requirement 5.2 / 11.1）。
     *
     * 字段必填条件随通道编码变化（实际必填校验由 Provider 在 createPayment 内根据
     * channelCode 触发，不在前端 / DTO 层强约束）：
     *
     * - WECHAT_JSAPI：`openid` 必填
     * - WECHAT_H5：`clientIp` 必填
     * - 其它通道：可选
     */
    interface CreatePaymentBuyerInfo {
      /** 微信公众号 openid（仅 JSAPI 必填）。 */
      openid?: string
      /** 客户端 IP（仅 H5 必填）。 */
      clientIp?: string
      /** 邮箱（Stripe Checkout 透传给收据邮件，可选）。 */
      email?: string
    }

    /**
     * 发起支付请求载荷（Requirement 5.2 / 5.3 / 5.7）。
     *
     * - `channelConfigId`：用户从下拉中选择的通道实例 ID（仅展示 enabled=true 的实例，
     * 按 isDefault desc 排序）。
     * - `buyerInfo`：买家附加信息，按通道编码分支必填。
     * - `note`：操作人备注，仅用于审计 / OperationLog；不传给渠道方。
     *
     * 不在 payload 上的：
     * - 不携带 orderId（路径参数 `:orderId` 由 controller 解析）
     * - 不携带金额（金额一律以 `Order.payAmount` 为准）
     * - 不携带 channelCode（由通道实例 ID 反查得到）
     */
    interface CreatePaymentPayload {
      channelConfigId: number
      buyerInfo?: CreatePaymentBuyerInfo
      note?: string
    }

    /**
     * 发起支付响应（Requirement 5.3 / 11.4）。
     *
     * - `transaction`：落库后的支付流水视图（含 metadata 内的 paymentUrl / qrCode /
     * clientSecret / payConfig）；前端据此展示二维码 / 跳转链接。
     * - `paymentInitFailed`：true 表示 Provider 同步报错或返回 FAILED；前端应展示
     * `errorCode / errorMessage` 提示而不是直接跳转支付。订单状态在该场景下不变，
     * 用户可重新选择通道再发起。
     */
    interface CreatePaymentResponse {
      transaction: PaymentTransactionItem
      paymentInitFailed: boolean
      errorCode?: string
      errorMessage?: string
    }

    // ----------------------------------------------------------------------
    // 退款视图（RefundView）—— Task 34 / 36
    // ----------------------------------------------------------------------

    /**
     * RefundService 方法的返回视图。
     *
     * 包含退款流水视图 + 同步结果标识，前端据此展示退款状态：
     * - `refundSucceeded=true`：退款同步成功，售后单已推进到 REFUNDED。
     * - `refundFailed=true`：退款同步失败，售后单保持 APPROVED 允许重试。
     * - 两者都为 false：退款异步进行中（如微信），等 webhook 推进。
     */
    interface RefundView {
      /** 退款流水视图 */
      transaction: PaymentTransactionItem
      /** 退款是否同步成功（SUCCEEDED） */
      refundSucceeded: boolean
      /** 退款是否同步失败（FAILED） */
      refundFailed: boolean
      /** 失败时的错误码 */
      errorCode?: string
      /** 失败时的错误描述 */
      errorMessage?: string
    }

    // ----------------------------------------------------------------------
    // Webhook 事件（WebhookEvent）—— Task 17 / 20
    // ----------------------------------------------------------------------

    /**
     * Webhook 事件类型枚举（与后端 Prisma `WebhookEventType` 一一对应）。
     *
     * 由 Provider.parseWebhook 解析渠道方原始事件后映射得到，不直接对应渠道方原始
     * event_type。
     */
    type WebhookEventType =
      | 'PAYMENT_SUCCESS'
      | 'PAYMENT_FAILED'
      | 'REFUND_SUCCESS'
      | 'REFUND_FAILED'
      | 'OTHER'

    /**
     * Webhook 处理状态机枚举（与后端 Prisma `WebhookProcessStatus` 一一对应）。
     *
     * - `PENDING`：刚 ingest 入库，尚未完成解析 / 路由（实际只是瞬态，正常流水线下迅速推进）。
     * - `SUCCEEDED`：路由成功（含 PAYMENT_SUCCESS / PAYMENT_FAILED / REFUND_* 推进流水）。
     * - `FAILED`：签名校验失败 / 解析失败 / 路由抛错；可重试。
     * - `IGNORED`：幂等去重命中已 SUCCEEDED 历史 / eventType=OTHER；不进入流水推进。
     */
    type WebhookProcessStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'IGNORED'

    /**
     * Webhook 事件列表视图行（Requirement 6.10）。
     *
     * 列表场景**不下发 rawBody / headers**（避免传输大字节）；详情视图 `WebhookEventDetail`
     * 才展开。
     */
    interface WebhookEventItem {
      /** 事件主键 ID。 */
      id: number
      /** 通道编码。 */
      channelCode: PaymentChannelCode
      /** 命中的通道实例 ID（多实例并存场景下；可空）。 */
      channelConfigId: number | null
      /** 接收时间（ISO 字符串）。 */
      receivedAt: string
      /** 签名校验结果。 */
      signatureValid: boolean
      /** 解析后事件类型。 */
      eventType: WebhookEventType
      /** 渠道方事件 ID（用于 (channelCode, providerEventId) 幂等去重；可空）。 */
      providerEventId: string | null
      /** 渠道方最终交易号（用于反查关联流水；可空）。 */
      providerTransactionNo: string | null
      /** 渠道方请求 ID（部分渠道用 providerRequestId 反查；可空）。 */
      providerRequestId: string | null
      /** 路由成功时关联的 PaymentTransaction.id（可空）。 */
      relatedTransactionId: number | null
      /** 处理状态。 */
      processStatus: WebhookProcessStatus
      /** 处理备注（含失败原因 / 重复事件提示等；可空）。 */
      processNote: string | null
      /** 处理完成时间（ISO 字符串；可空）。 */
      processedAt: string | null
      /** 上次重试时间（ISO 字符串；可空）。 */
      retriedAt: string | null
      /** 上次重试操作人 ID（可空）。 */
      retriedById: number | null
      /** 上次重试操作人显示名（可空）。 */
      retriedByName: string | null
      /** 创建时间（ISO 字符串）。 */
      createdAt: string
    }

    /**
     * Webhook 事件详情视图（Requirement 6.10）。
     *
     * 在 `WebhookEventItem` 之外补充：
     *
     * - `headers`：脱敏后的 HTTP 请求头（敏感字段已被 `[REDACTED]` 替换）。
     * - `rawBody`：渠道方推送的原始字节（utf8 字符串形态）。
     * - `parsedRaw`：rawBody 的 JSON 反序列化结果；解析失败时为 null。注意：parsedRaw
     * **不等于** Provider.parseWebhook 的解析结果，而是 rawBody 的原始 JSON 反序列化；
     * 渠道方加密字段（如微信 v3 的 `resource.ciphertext`）需要 apiV3Key 才能解密，
     * 不在本视图中展示。
     * - `channel`：通道实例非敏感字段子集（id / code / name / sandboxMode），credentials
     * 一律不下发；通道已删除时为 null（`onDelete: SetNull`）。
     * - `relatedTransaction`：关联流水视图子集（id / transactionNo / orderId / orderNo
     * / type / status），便于前端展示「这条事件推进了哪笔流水」。流水未关联或已删除
     * 时为 null。
     */
    interface WebhookEventDetail extends WebhookEventItem {
      headers: Record<string, unknown>
      rawBody: string
      parsedRaw: Record<string, unknown> | null
      channel: {
        id: number
        code: PaymentChannelCode
        name: string
        sandboxMode: boolean
      } | null
      relatedTransaction: {
        id: number
        transactionNo: string
        orderId: number
        orderNo: string
        type: string
        status: string
      } | null
    }

    /** Webhook 事件列表分页响应。 */
    type WebhookEventList = Api.Common.PaginatedResponse<WebhookEventItem>

    /**
     * Webhook 事件列表查询参数（Requirement 6.10 / 18.2）。
     *
     * 默认时间窗：未传 `startTime / endTime` 时后端注入「最近 7 天」作为兜底范围；
     * 命中 `(channelCode, receivedAt)` 索引保证毫秒级响应。前端如需更长时间范围必须
     * 显式传入。
     */
    interface WebhookEventSearchParams extends Partial<Api.Common.CommonSearchParams> {
      current?: number
      size?: number
      /** 通道编码精确筛选。 */
      channelCode?: PaymentChannelCode
      /** 事件类型精确筛选。 */
      eventType?: WebhookEventType
      /** 处理状态精确筛选。 */
      processStatus?: WebhookProcessStatus
      /**
       * 签名校验结果筛选；查询字符串上传 `'true' / 'false'` 字符串，后端 Transform 解析。
       */
      signatureValid?: 'true' | 'false'
      /** 起始时间（ISO 字符串），按 receivedAt 筛选。 */
      startTime?: string
      /** 结束时间（ISO 字符串），按 receivedAt 筛选。 */
      endTime?: string
    }

    /**
     * Webhook 重放结果（Requirement 6.10 / 6.11）。
     *
     * 与后端 `WebhookReplayResult` 字段一一对应：
     *
     * - `status`：重放路由分支结果。
     * - `webhookEventId`：被重放的事件 ID（与请求路径上的 `:id` 相同）。
     * - `processStatus`：重放后事件最终处理状态。
     * - `relatedTransactionId`：路由成功时关联的流水 ID；其它情形为 null。
     */
    interface WebhookEventRetryResult {
      status: 'ok' | 'duplicate' | 'parse-error' | 'process-error' | 'ignored' | 'channel-gone'
      webhookEventId: number
      processStatus: WebhookProcessStatus
      relatedTransactionId: number | null
    }

    /**
     * Webhook 重试响应视图。
     *
     * - `result`：底层 `WebhookService.replay` 的结果。
     * - `event`：重试后最新的事件 ListView，前端据此立即刷新列表行而无需再发 detail 请求。
     */
    interface WebhookEventRetryResponse {
      result: WebhookEventRetryResult
      event: WebhookEventItem
    }
  }
}
