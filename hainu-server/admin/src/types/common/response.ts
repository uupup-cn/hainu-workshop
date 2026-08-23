/**
 * API 响应类型定义模块
 *
 * 提供统一的 API 响应结构类型定义
 *
 * ## 主要功能
 *
 * - 基础响应结构定义
 * - 泛型支持（适配不同数据类型）
 * - 统一的响应格式约束
 *
 * ## 使用场景
 *
 * - API 请求响应类型约束
 * - 接口数据类型定义
 * - 响应数据解析
 *
 * @module types/common/response
 * @author Ci-Yuu-Plus Team
 */

/** 基础 API 响应结构 */
export interface BaseResponse<T = unknown> {
  /** 状态码 */
  code: number
  /** 消息（后端返回 message 字段，msg 兼容） */
  msg?: string
  message?: string
  /** 数据 */
  data: T
}

/** 后端异常响应结构（用于 HttpError.data） */
export interface HttpExceptionResponse<T = unknown> {
  /** HTTP 状态码 */
  code: number
  /** 错误消息 */
  message: string
  /** 业务错误响应 */
  data: BaseResponse<T>
  /** 时间戳 */
  timestamp: string
  /** 请求 URL */
  url: string
  /** 请求方法 */
  method: string
  /** 错误堆栈 */
  stack?: string
}
