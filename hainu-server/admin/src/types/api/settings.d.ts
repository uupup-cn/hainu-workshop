declare namespace Api {
  /** 站点与系统配置类型 */
  namespace Settings {
    interface SiteSettingOperator {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface SiteSettingInfo {
      /** ID */
      id: number
      /** 键名 */
      key: string
      /** 站点名称 */
      siteName: string
      /** 站点描述 */
      siteDescription?: string | null
      /** 登录欢迎标题 */
      loginWelcomeTitle?: string | null
      /** 登录欢迎描述 */
      loginWelcomeDescription?: string | null
      /** SEO 标题 */
      seoTitle?: string | null
      /** SEO 描述 */
      seoDescription?: string | null
      /** SEO 关键词 */
      seoKeywords?: string | null
      /** 支持邮箱 */
      supportEmail?: string | null
      /** 支持电话 */
      supportPhone?: string | null
      /** 联系地址 */
      contactAddress?: string | null
      /** 版权文案 */
      copyrightText?: string | null
      /** ICP备案号 */
      icpNo?: string | null
      /** 公安备案号 */
      publicSecurityNo?: string | null
      /** 是否维护模式 */
      maintenanceMode: boolean
      /** 维护提示信息 */
      maintenanceMessage?: string | null
      /** 是否启用站点水印 */
      watermarkEnabled: boolean
      /** 水印内容模式 */
      watermarkMode: 'USERNAME' | 'USERNAME_TIME' | 'SITE_NAME' | 'CUSTOM_TEXT'
      /** 水印文本 */
      watermarkText?: string | null
      /** 是否允许注册 */
      allowRegister: boolean
      /** 是否开启反馈 */
      feedbackEnabled: boolean
      /** 是否开启验证码 */
      captchaEnabled: boolean
      /** 验证码类型 */
      captchaType: 'IMAGE' | 'SLIDER'
      /** 最大重试次数 */
      loginMaxRetryCount?: number | null
      /** 锁定时间，单位分钟 */
      loginLockMinutes: number
      /** 默认语言 */
      defaultLanguage: 'zh' | 'en'
      /** 未支付订单超时关单时长（分钟） */
      orderPaymentTimeoutMinutes: number
      /** 更新人信息 */
      updatedByUser?: SiteSettingOperator | null
      /** 更新时间 */
      updatedAt: string
    }

    interface SiteSettingPayload {
      /** 站点名称 */
      siteName: string
      /** 站点描述 */
      siteDescription?: string
      /** 登录欢迎标题 */
      loginWelcomeTitle?: string
      /** 登录欢迎描述 */
      loginWelcomeDescription?: string
      /** SEO 标题 */
      seoTitle?: string
      /** SEO 描述 */
      seoDescription?: string
      /** SEO 关键词 */
      seoKeywords?: string
      /** 支持邮箱 */
      supportEmail?: string
      /** 支持电话 */
      supportPhone?: string
      /** 联系地址 */
      contactAddress?: string
      /** 版权文案 */
      copyrightText?: string
      /** ICP备案号 */
      icpNo?: string
      /** 公安备案号 */
      publicSecurityNo?: string
      /** 是否维护模式 */
      maintenanceMode: boolean
      /** 维护提示信息 */
      maintenanceMessage?: string
      /** 是否启用站点水印 */
      watermarkEnabled?: boolean
      /** 水印内容模式 */
      watermarkMode?: 'USERNAME' | 'USERNAME_TIME' | 'SITE_NAME' | 'CUSTOM_TEXT'
      /** 水印文本 */
      watermarkText?: string
      /** 是否允许注册 */
      allowRegister: boolean
      /** 是否开启反馈 */
      feedbackEnabled: boolean
      /** 是否开启验证码 */
      captchaEnabled: boolean
      /** 验证码类型 */
      captchaType: 'IMAGE' | 'SLIDER'
      /** 最大重试次数 */
      loginMaxRetryCount?: number | null
      /** 锁定时间，单位分钟 */
      loginLockMinutes: number
      /** 默认语言 */
      defaultLanguage?: 'zh' | 'en'
      /** 未支付订单超时关单时长（分钟） */
      orderPaymentTimeoutMinutes?: number
    }

    type SystemParamValueType = 'STRING' | 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON'

    interface SystemParamOperator {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface SystemParamGroupItem {
      /** 编码 */
      code: string
      /** 名称 */
      name: string
      /** 数量 */
      count: number
    }

    interface SystemParamItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 键名 */
      key: string
      /** 分组编码 */
      groupCode: string
      /** 分组名称 */
      groupName: string
      /** 值类型 */
      valueType: SystemParamValueType
      /** 值 */
      value: string
      /** 解析后的值 */
      parsedValue?: unknown
      /** 默认值 */
      defaultValue?: string | null
      /** 可选项 */
      options?: Record<string, unknown> | null
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 是否内置 */
      builtIn: boolean
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 创建人信息 */
      createdByUser?: SystemParamOperator | null
      /** 更新人信息 */
      updatedByUser?: SystemParamOperator | null
    }

    interface SystemParamSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 分组编码 */
      groupCode?: string
      /** 值类型 */
      valueType?: SystemParamValueType
      /** 是否启用 */
      enabled?: boolean
      /** 是否内置 */
      builtIn?: boolean
    }

    interface SystemParamPayload {
      /** 名称 */
      name: string
      /** 键名 */
      key: string
      /** 分组编码 */
      groupCode: string
      /** 分组名称 */
      groupName: string
      /** 值类型 */
      valueType: SystemParamValueType
      /** 值 */
      value: string
      /** 默认值 */
      defaultValue?: string
      /** 可选项 */
      options?: Record<string, unknown>
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
      /** 是否内置 */
      builtIn?: boolean
      /** 备注 */
      remark?: string
    }

    interface SystemParamListResponse extends Api.Common.PaginatedResponse<SystemParamItem> {
      /** 分组列表 */
      groups: SystemParamGroupItem[]
      /** 汇总信息 */
      summary: {
        /** 总条数 */
        total: number
        /** 是否启用数量 */
        enabledCount: number
        /** 内置数量 */
        builtInCount: number
        /** 分组数量 */
        groupCount: number
      }
      /** 缓存条目数 */
      cacheSize: number
      /** 更新时间 */
      updatedAt: string
    }
  }
}
