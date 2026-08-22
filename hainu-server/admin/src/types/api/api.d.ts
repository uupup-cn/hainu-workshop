/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { username: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Ci-Yuu-Plus Team
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页查询参数 */
    interface PaginationQueryParams {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
    }

    /** 分页状态 */
    interface PaginationParams extends PaginationQueryParams {
      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = PaginationQueryParams

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = unknown> extends PaginationParams {
      /** 记录列表 */
      records: T[]
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      /** 用户名 */
      username: string
      /** 密码 */
      password: string
      /** 验证码 ID */
      captchaId?: string
      /** 验证码 */
      captchaCode?: string
    }

    /** 登录响应 */
    interface LoginResponse {
      /** 访问令牌 */
      accessToken: string
    }

    /** 图片验证码响应 */
    interface CaptchaResponse {
      /** 验证码 ID */
      captchaId: string
      /** SVG 图片内容 */
      image: string
      /** 有效期，单位秒 */
      expiresIn: number
    }

    interface RefreshTokenParams {
      /** 兼容旧客户端保留，当前版本优先使用 HttpOnly Cookie */
      refreshToken?: string
    }

    /** 用户信息 */
    interface UserInfo {
      /** 按钮权限标识列表 */
      buttons: string[]
      /** 角色列表 */
      roles: string[]
      /** 后端下发的接口能力码，用于请求前预校验和页面能力判断。 */
      apiPermissions: string[]
      /** ID */
      id: number
      /** 用户名 */
      username: string
      /** 昵称 */
      nickName?: string
      /** 真实姓名 */
      realName?: string
      /** 邮箱 */
      email: string
      /** 头像 */
      avatar?: string
    }
  }

  /** AI 助手类型 */
  namespace AiAssistant {
    /** AI 消息角色 */
    type AiMessageRole = 'user' | 'assistant'

    /** AI 对话消息结构 */
    interface AiAssistantMessage {
      /** 角色 */
      role: AiMessageRole
      /** 内容 */
      content: string
    }

    /** AI 流式响应中的元信息 */
    interface AiAssistantStreamMeta {
      /** 提供方 */
      provider: string
      /** 显示名称 */
      label: string
      /** 模型标识 */
      model: string
    }
  }
}
