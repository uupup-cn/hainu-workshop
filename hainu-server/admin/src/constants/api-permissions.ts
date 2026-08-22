// 统一维护前端引用的接口权限码，避免在各个 API 封装里散落裸字符串。
export const ApiPermissionCode = {
  ACCOUNT: {
    LOGOUT: 'account:session:logout',
    SESSION_LIST: 'account:session:list',
    SESSION_REVOKE_OTHERS: 'account:session:revoke-others',
    SESSION_REVOKE: 'account:session:revoke',
    INFO: 'account:info:view',
    PROFILE_VIEW: 'account:profile:view',
    PROFILE_UPDATE: 'account:profile:update',
    PASSWORD_CHANGE: 'account:password:change'
  },
  USER: {
    LIST: 'system:user:list',
    DETAIL: 'system:user:detail',
    CREATE: 'system:user:create',
    UPDATE: 'system:user:update',
    DELETE: 'system:user:delete'
  },
  ROLE: {
    LIST: 'system:role:list',
    CREATE: 'system:role:create',
    UPDATE: 'system:role:update',
    DELETE: 'system:role:delete',
    PERMISSION_DETAIL: 'system:role:permission:detail',
    PERMISSION_UPDATE: 'system:role:permission:update',
    DATA_META: 'system:role:data-permission:meta',
    DATA_DETAIL: 'system:role:data-permission:detail',
    DATA_UPDATE: 'system:role:data-permission:update'
  },
  MENU: {
    LIST: 'system:menu:list',
    MANAGE_LIST: 'system:menu:manage:list',
    CREATE: 'system:menu:create',
    UPDATE: 'system:menu:update',
    SORT: 'system:menu:sort',
    DELETE: 'system:menu:delete',
    AUTH_CREATE: 'system:menu:auth:create',
    AUTH_UPDATE: 'system:menu:auth:update',
    AUTH_DELETE: 'system:menu:auth:delete'
  },
  API_PERMISSION: {
    CATALOG: 'system:api-permission:catalog'
  },
  DEPARTMENT: {
    LIST: 'system:department:list',
    DETAIL: 'system:department:detail',
    CREATE: 'system:department:create',
    UPDATE: 'system:department:update',
    DELETE: 'system:department:delete'
  },
  POST: {
    LIST: 'system:post:list',
    DETAIL: 'system:post:detail',
    CREATE: 'system:post:create',
    UPDATE: 'system:post:update',
    DELETE: 'system:post:delete'
  },
  CONTENT: {
    OVERVIEW: 'system:content:overview',
    LIST: 'system:content:list',
    DETAIL: 'system:content:detail',
    CREATE: 'system:content:create',
    UPDATE: 'system:content:update',
    PUBLISH: 'system:content:publish',
    OFFLINE: 'system:content:offline',
    DELETE: 'system:content:delete',
    CATEGORY_LIST: 'system:content-category:list',
    CATEGORY_CREATE: 'system:content-category:create',
    CATEGORY_UPDATE: 'system:content-category:update',
    CATEGORY_DELETE: 'system:content-category:delete',
    TAG_LIST: 'system:content-tag:list',
    TAG_CREATE: 'system:content-tag:create',
    TAG_UPDATE: 'system:content-tag:update',
    TAG_DELETE: 'system:content-tag:delete',
    RECYCLE_LIST: 'system:content-recycle:list',
    RECYCLE_RESTORE: 'system:content-recycle:restore',
    RECYCLE_PURGE: 'system:content-recycle:purge'
  },
  MALL: {
    PRODUCT_OVERVIEW: 'mall:product:overview',
    PRODUCT_LIST: 'mall:product:list',
    PRODUCT_DETAIL: 'mall:product:detail',
    PRODUCT_CREATE: 'mall:product:create',
    PRODUCT_UPDATE: 'mall:product:update',
    PRODUCT_DELETE: 'mall:product:delete',
    PRODUCT_RECYCLE: 'mall:product:recycle',
    PRODUCT_RESTORE: 'mall:product:restore',
    PRODUCT_PERMANENT_DELETE: 'mall:product:permanent-delete',
    PRODUCT_ON_SALE: 'mall:product:on-sale',
    PRODUCT_OFF_SHELF: 'mall:product:off-shelf',
    PRODUCT_COPY: 'mall:product:copy',
    PRODUCT_BATCH_ON_SALE: 'mall:product:batch-on-sale',
    PRODUCT_BATCH_OFF_SHELF: 'mall:product:batch-off-shelf',
    PRODUCT_BATCH_RECYCLE: 'mall:product:batch-recycle',
    PRODUCT_BATCH_ASSIGN_WAREHOUSE: 'mall:product:batch-assign-warehouse',
    PRODUCT_BATCH_EXPORT: 'mall:product:batch-export',
    CATEGORY_LIST: 'mall:category:list',
    CATEGORY_CREATE: 'mall:category:create',
    CATEGORY_UPDATE: 'mall:category:update',
    CATEGORY_DELETE: 'mall:category:delete',
    BRAND_LIST: 'mall:brand:list',
    BRAND_CREATE: 'mall:brand:create',
    BRAND_UPDATE: 'mall:brand:update',
    BRAND_DELETE: 'mall:brand:delete',
    BRAND_ENABLE: 'mall:brand:enable',
    PRODUCT_SERVICE_LIST: 'mall:product-service:list',
    PRODUCT_SERVICE_CREATE: 'mall:product-service:create',
    PRODUCT_SERVICE_UPDATE: 'mall:product-service:update',
    PRODUCT_SERVICE_DELETE: 'mall:product-service:delete',
    PRODUCT_SERVICE_ENABLE: 'mall:product-service:enable',
    ATTRIBUTE_TEMPLATE_LIST: 'mall:attribute-template:list',
    ATTRIBUTE_TEMPLATE_CREATE: 'mall:attribute-template:create',
    ATTRIBUTE_TEMPLATE_UPDATE: 'mall:attribute-template:update',
    ATTRIBUTE_TEMPLATE_DELETE: 'mall:attribute-template:delete',
    ATTRIBUTE_TEMPLATE_ENABLE: 'mall:attribute-template:enable',
    EXPRESS_COMPANY_LIST: 'mall:express-company:list',
    EXPRESS_COMPANY_CREATE: 'mall:express-company:create',
    EXPRESS_COMPANY_UPDATE: 'mall:express-company:update',
    EXPRESS_COMPANY_DELETE: 'mall:express-company:delete',
    EXPRESS_COMPANY_ENABLE: 'mall:express-company:enable',
    SHIPPING_TEMPLATE_LIST: 'mall:shipping-template:list',
    SHIPPING_TEMPLATE_CREATE: 'mall:shipping-template:create',
    SHIPPING_TEMPLATE_UPDATE: 'mall:shipping-template:update',
    SHIPPING_TEMPLATE_DELETE: 'mall:shipping-template:delete',
    SHIPPING_TEMPLATE_ENABLE: 'mall:shipping-template:enable',
    WAREHOUSE_LIST: 'mall:warehouse:list',
    WAREHOUSE_CREATE: 'mall:warehouse:create',
    WAREHOUSE_UPDATE: 'mall:warehouse:update',
    WAREHOUSE_DELETE: 'mall:warehouse:delete',
    WAREHOUSE_ENABLE: 'mall:warehouse:enable',
    INBOUND_LIST: 'mall:inbound:list',
    INBOUND_DETAIL: 'mall:inbound:detail',
    INBOUND_CREATE: 'mall:inbound:create',
    INBOUND_UPDATE: 'mall:inbound:update',
    INBOUND_CONFIRM: 'mall:inbound:confirm',
    INBOUND_VOID: 'mall:inbound:void',
    OUTBOUND_LIST: 'mall:outbound:list',
    OUTBOUND_DETAIL: 'mall:outbound:detail',
    OUTBOUND_CREATE: 'mall:outbound:create',
    OUTBOUND_UPDATE: 'mall:outbound:update',
    OUTBOUND_CONFIRM: 'mall:outbound:confirm',
    OUTBOUND_VOID: 'mall:outbound:void',
    TRANSFER_LIST: 'mall:transfer:list',
    TRANSFER_DETAIL: 'mall:transfer:detail',
    TRANSFER_CREATE: 'mall:transfer:create',
    TRANSFER_UPDATE: 'mall:transfer:update',
    TRANSFER_REVIEW: 'mall:transfer:review',
    TRANSFER_SHIP: 'mall:transfer:ship',
    TRANSFER_RECEIVE: 'mall:transfer:receive',
    TRANSFER_VOID: 'mall:transfer:void',
    STOCKTAKE_LIST: 'mall:stocktake:list',
    STOCKTAKE_DETAIL: 'mall:stocktake:detail',
    STOCKTAKE_CREATE: 'mall:stocktake:create',
    STOCKTAKE_UPDATE: 'mall:stocktake:update',
    STOCKTAKE_START: 'mall:stocktake:start',
    STOCKTAKE_UPDATE_ITEM: 'mall:stocktake:update-item',
    STOCKTAKE_COMPLETE: 'mall:stocktake:complete',
    STOCKTAKE_VOID: 'mall:stocktake:void',
    INVENTORY_QUERY_LIST: 'mall:inventory-query:list',
    INVENTORY_QUERY_DETAIL: 'mall:inventory-query:detail',
    INVENTORY_LOG_LIST: 'mall:inventory-log:list',
    REVIEW_LIST: 'mall:review:list',
    REVIEW_DETAIL: 'mall:review:detail',
    REVIEW_AGGREGATE: 'mall:review:aggregate',
    REVIEW_CREATE: 'mall:review:create',
    REVIEW_UPDATE: 'mall:review:update',
    REVIEW_DELETE: 'mall:review:delete',
    REVIEW_BATCH_TOGGLE_VISIBLE: 'mall:review:batch-toggle-visible',
    REVIEW_BATCH_TOGGLE_TOP: 'mall:review:batch-toggle-top',
    REVIEW_BATCH_TOGGLE_RECOMMEND: 'mall:review:batch-toggle-recommend',
    AFTERSALE_NOTICE_GET: 'mall:aftersale-notice:get',
    AFTERSALE_NOTICE_UPDATE: 'mall:aftersale-notice:update',
    AFTERSALE_LIST: 'mall:aftersale:list',
    AFTERSALE_DETAIL: 'mall:aftersale:detail',
    AFTERSALE_CREATE: 'mall:aftersale:create',
    AFTERSALE_APPROVE: 'mall:aftersale:approve',
    AFTERSALE_REJECT: 'mall:aftersale:reject',
    AFTERSALE_REFUND: 'mall:aftersale:refund',
    AFTERSALE_CANCEL: 'mall:aftersale:cancel',
    ORDER_OVERVIEW: 'mall:order:overview',
    ORDER_LIST: 'mall:order:list',
    ORDER_DETAIL: 'mall:order:detail',
    ORDER_CREATE: 'mall:order:create',
    /** 代客下单：基于历史订单聚合的客户与收货地址候选项。 */
    ORDER_CUSTOMER_SUGGESTIONS: 'mall:order:customer-suggestions',
    ORDER_PAY: 'mall:order:pay',
    /**
     * @deprecated 任务 38 后请改用 {@link ORDER_SHIPMENT_CREATE} / {@link ORDER_SHIPMENT_UPDATE}。
     * 老接口 `PATCH /mall/orders/:id/ship` 仅在历史角色配置兼容场景下保留可用。
     */
    ORDER_SHIP: 'mall:order:ship',
    ORDER_CLOSE: 'mall:order:close',
    ORDER_NOTE: 'mall:order:note',
    ORDER_SHIPMENT_LIST: 'mall:order:shipment-list',
    ORDER_SHIPMENT_CREATE: 'mall:order:shipment-create',
    ORDER_SHIPMENT_UPDATE: 'mall:order:shipment-update',
    ORDER_ADJUST_PRICE: 'mall:order:adjust-price',
    ORDER_ADJUST_ADDRESS: 'mall:order:adjust-address',
    ORDER_CANCEL: 'mall:order:cancel',
    /**
     * 商城支付权限码子命名空间。
     *
     * 与后端 `API_PERMISSION_CODES.MALL.PAYMENT_*` 一一对应，对应 controller 端的
     * `@ApiPermission` 装饰器。M1 阶段先补齐通道配置 7 项；M2 阶段（Task 20）追加流水
     * 查询 3 项 + 发起支付 3 项 + Webhook 事件 3 项，合计 16 项；M4 阶段会再补线上退款
     * 2 项（`REFUND_ONLINE / QUERY_REFUND`）。
     *
     * 命名规则：保留后端权限码字符串中 `:` 之后的两段（如 `mall:payment-channel:list` →
     * `CHANNEL_LIST`、`mall:payment-transaction:list` → `TRANSACTION_LIST`、
     * `mall:payment:create-payment` → `CREATE_PAYMENT`）；与 MALL 命名空间下其它扁平
     * 条目（`BRAND_LIST` 等）的命名风格保持一致，仅嵌套层级新增子命名空间。spec
     * design.md §Frontend API 显式约定 `ApiPermissionCode.MALL.PAYMENT.*` 的访问路径，
     * 调用处通过 `permissionCode` 参数显式声明。
     */
    PAYMENT: {
      CHANNEL_LIST: 'mall:payment-channel:list',
      CHANNEL_DETAIL: 'mall:payment-channel:detail',
      CHANNEL_CREATE: 'mall:payment-channel:create',
      CHANNEL_UPDATE: 'mall:payment-channel:update',
      CHANNEL_DELETE: 'mall:payment-channel:delete',
      CHANNEL_ENABLE: 'mall:payment-channel:enable',
      CHANNEL_TEST: 'mall:payment-channel:test',
      /** 支付流水分页查询（Requirement 4.5）。 */
      TRANSACTION_LIST: 'mall:payment-transaction:list',
      /** 支付流水详情（Requirement 4.5）。 */
      TRANSACTION_DETAIL: 'mall:payment-transaction:detail',
      /** 按订单 ID 查询该订单全部流水（订单详情页支付流水面板使用，Requirement 4.5）。 */
      TRANSACTION_ORDER_LIST: 'mall:payment-transaction:order-list',
      /** 为订单发起支付（Requirement 5.7）。 */
      CREATE_PAYMENT: 'mall:payment:create-payment',
      /** 查询支付流水的渠道侧最新状态并同步本地（Requirement 5.7）。 */
      QUERY_PAYMENT: 'mall:payment:query-payment',
      /** 关闭未支付的 PENDING PAYMENT 流水（Requirement 5.7 / 13.1）。 */
      CLOSE_PENDING_PAYMENT: 'mall:payment:close-pending-payment',
      /** 为售后单发起线上退款（Requirement 7.2 / 7.7）。 */
      REFUND_ONLINE: 'mall:payment:refund-online',
      /** 查询退款流水详情与渠道侧最新状态（Requirement 7.7）。 */
      QUERY_REFUND: 'mall:payment:query-refund',
      /** Webhook 事件分页查询（Requirement 6.11）。 */
      WEBHOOK_LIST: 'mall:payment-webhook:list',
      /** Webhook 事件详情（Requirement 6.11）。 */
      WEBHOOK_DETAIL: 'mall:payment-webhook:detail',
      /** 重试失败的 Webhook 事件（Requirement 6.10 / 6.11）。 */
      WEBHOOK_RETRY: 'mall:payment-webhook:retry'
    }
  },
  DICT: {
    TYPE_LIST: 'system:dict:type:list',
    TYPE_DETAIL: 'system:dict:type:detail',
    TYPE_CREATE: 'system:dict:type:create',
    TYPE_UPDATE: 'system:dict:type:update',
    TYPE_DELETE: 'system:dict:type:delete',
    DATA_LIST: 'system:dict:data:list',
    DATA_DETAIL: 'system:dict:data:detail',
    DATA_CREATE: 'system:dict:data:create',
    DATA_UPDATE: 'system:dict:data:update',
    DATA_DELETE: 'system:dict:data:delete'
  },
  SITE_SETTING: {
    ADMIN_VIEW: 'system:site-setting:admin:view',
    UPDATE: 'system:site-setting:update'
  },
  SYSTEM_PARAM: {
    LIST: 'system:param:list',
    RESOLVE: 'system:param:resolve',
    DETAIL: 'system:param:detail',
    CREATE: 'system:param:create',
    UPDATE: 'system:param:update',
    DELETE: 'system:param:delete',
    REFRESH_CACHE: 'system:param:refresh-cache'
  },
  FILE: {
    LIST: 'system:file:list',
    DETAIL: 'system:file:detail',
    CREATE_UPLOAD_TICKET: 'system:file:upload-ticket:create',
    PROXY_UPLOAD: 'system:file:upload-proxy',
    COMPLETE: 'system:file:complete',
    DOWNLOAD_URL: 'system:file:download-url',
    PUBLIC_LINK: 'system:file:public-link',
    DELETE: 'system:file:delete',
    BATCH_MOVE: 'system:file:batch-move',
    BATCH_DELETE: 'system:file:batch-delete'
  },
  FILE_FOLDER: {
    TREE: 'system:file-folder:tree',
    CREATE: 'system:file-folder:create',
    UPDATE: 'system:file-folder:update',
    DELETE: 'system:file-folder:delete'
  },
  LOG: {
    OPERATION_LIST: 'system:log:operation:list',
    OPERATION_DETAIL: 'system:log:operation:detail',
    OPERATION_EXPORT: 'system:log:operation:export',
    OPERATION_DELETE: 'system:log:operation:delete',
    OPERATION_CLEAR: 'system:log:operation:clear',
    LOGIN_LIST: 'system:log:login:list',
    LOGIN_DETAIL: 'system:log:login:detail',
    LOGIN_EXPORT: 'system:log:login:export',
    LOGIN_DELETE: 'system:log:login:delete',
    LOGIN_CLEAR: 'system:log:login:clear'
  },
  MONITOR: {
    OVERVIEW: 'system:monitor:overview',
    VISITOR_ANALYTICS_VIEW: 'system:monitor:visitor-analytics:view',
    ONLINE_USER_LIST: 'system:monitor:online-user:list',
    ONLINE_USER_DETAIL: 'system:monitor:online-user:detail',
    ONLINE_USER_FORCE_LOGOUT: 'system:monitor:online-user:force-logout',
    SYSTEM_RESOURCE_VIEW: 'system:monitor:system-resource:view',
    CACHE_VIEW: 'system:monitor:cache:view',
    CACHE_REFRESH: 'system:monitor:cache:refresh'
  },
  AUDIT: {
    OVERVIEW: 'system:security-audit:overview',
    EVENT_LIST: 'system:security-audit:event:list',
    EVENT_DETAIL: 'system:security-audit:event:detail',
    EVENT_STATUS_UPDATE: 'system:security-audit:event:status:update'
  },
  FEEDBACK: {
    CREATE: 'account:feedback:create',
    OVERVIEW: 'system:feedback:overview',
    LIST: 'system:feedback:list',
    DETAIL: 'system:feedback:detail',
    STATUS_UPDATE: 'system:feedback:status:update'
  },
  AI_GENERATOR: {
    PARSE: 'system:ai-generator:parse',
    VALIDATE: 'system:ai-generator:validate',
    PREVIEW: 'system:ai-generator:preview',
    DIAGNOSE: 'system:ai-generator:diagnose',
    CHECK: 'system:ai-generator:check',
    SMOKE_TEST: 'system:ai-generator:smoke-test',
    PLAN: 'system:ai-generator:plan',
    APPLY: 'system:ai-generator:apply',
    HISTORY: 'system:ai-generator:history',
    ROLLBACK: 'system:ai-generator:rollback'
  },
  NOTIFICATION: {
    ADMIN_LIST: 'system:notification:admin:list',
    ADMIN_DETAIL: 'system:notification:admin:detail',
    CREATE: 'system:notification:create',
    UPDATE: 'system:notification:update',
    PUBLISH: 'system:notification:publish',
    REVOKE: 'system:notification:revoke',
    DELETE: 'system:notification:delete',
    INBOX_LIST: 'account:notification:inbox:list',
    INBOX_STATS: 'account:notification:stats',
    INBOX_DETAIL: 'account:notification:detail',
    INBOX_READ: 'account:notification:read',
    INBOX_READ_ALL: 'account:notification:read-all'
  },
  SCHEDULED_TASK: {
    HANDLERS: 'system:scheduled-task:handler:list',
    CRON_PREVIEW: 'system:scheduled-task:cron:preview',
    LIST: 'system:scheduled-task:list',
    DETAIL: 'system:scheduled-task:detail',
    CREATE: 'system:scheduled-task:create',
    UPDATE: 'system:scheduled-task:update',
    STATUS: 'system:scheduled-task:status',
    RUN: 'system:scheduled-task:run',
    DELETE: 'system:scheduled-task:delete',
    LOG_LIST: 'system:scheduled-task:log:list',
    LOG_DETAIL: 'system:scheduled-task:log:detail',
    LOG_DELETE: 'system:scheduled-task:log:delete',
    LOG_CLEAR: 'system:scheduled-task:log:clear'
  },
  WORKFLOW: {
    META: 'system:workflow:meta',
    CATEGORY_LIST: 'system:workflow-category:list',
    CATEGORY_CREATE: 'system:workflow-category:create',
    CATEGORY_UPDATE: 'system:workflow-category:update',
    CATEGORY_DELETE: 'system:workflow-category:delete',
    DEFINITION_OVERVIEW: 'system:workflow-definition:overview',
    DEFINITION_OPTION_LIST: 'system:workflow-definition:option:list',
    DEFINITION_LIST: 'system:workflow-definition:list',
    DEFINITION_DETAIL: 'system:workflow-definition:detail',
    DEFINITION_CREATE: 'system:workflow-definition:create',
    DEFINITION_UPDATE: 'system:workflow-definition:update',
    DEFINITION_VALIDATE: 'system:workflow-definition:validate',
    DEFINITION_PREVIEW: 'system:workflow-definition:preview',
    DEFINITION_VERSION_LIST: 'system:workflow-definition-version:list',
    DEFINITION_VERSION_DETAIL: 'system:workflow-definition-version:detail',
    DEFINITION_VERSION_ROLLBACK: 'system:workflow-definition-version:rollback',
    DEFINITION_STATUS: 'system:workflow-definition:status',
    DEFINITION_COPY: 'system:workflow-definition:copy',
    DEFINITION_DELETE: 'system:workflow-definition:delete',
    INSTANCE_OVERVIEW: 'system:workflow-instance:overview',
    INSTANCE_LIST: 'system:workflow-instance:list',
    INSTANCE_DETAIL: 'system:workflow-instance:detail',
    INSTANCE_START: 'account:workflow-instance:start',
    INSTANCE_CANCEL: 'account:workflow-instance:cancel',
    TASK_OVERVIEW: 'account:workflow-task:overview',
    TASK_PENDING_LIST: 'account:workflow-task:pending:list',
    TASK_PROCESSED_LIST: 'account:workflow-task:processed:list',
    TASK_DETAIL: 'account:workflow-task:detail',
    TASK_APPROVE: 'account:workflow-task:approve',
    TASK_REJECT: 'account:workflow-task:reject',
    TASK_COMMENT: 'account:workflow-task:comment',
    TASK_TRANSFER: 'account:workflow-task:transfer',
    TASK_ADD_SIGN: 'account:workflow-task:add-sign'
  },
  TOOLBOX: {
    CATEGORY_LIST: 'toolbox:category:list',
    CATEGORY_CREATE: 'toolbox:category:create',
    CATEGORY_UPDATE: 'toolbox:category:update',
    CATEGORY_DELETE: 'toolbox:category:delete',
    TOOL_LIST: 'toolbox:tool:list',
    TOOL_CREATE: 'toolbox:tool:create',
    TOOL_UPDATE: 'toolbox:tool:update',
    TOOL_DELETE: 'toolbox:tool:delete',
    TOOL_ENABLE: 'toolbox:tool:enable',
    LOG_LIST: 'toolbox:log:list'
  }
} as const
