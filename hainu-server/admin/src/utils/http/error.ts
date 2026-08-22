/**
 * HTTP 错误处理模块
 *
 * 提供统一的 HTTP 请求错误处理机制
 *
 * ## 主要功能
 *
 * - 自定义 HttpError 错误类，封装错误信息、状态码、时间戳等
 * - 错误拦截和转换，将 Axios 错误转换为标准的 HttpError
 * - 错误消息国际化处理，根据状态码返回对应的多语言错误提示
 * - 错误日志记录，便于问题追踪和调试
 * - 错误和成功消息的统一展示
 * - 类型守卫函数，用于判断错误类型
 *
 * ## 使用场景
 *
 * - HTTP 请求拦截器中统一处理错误
 * - 业务代码中捕获和处理特定错误
 * - 错误日志收集和上报
 *
 * @module utils/http/error
 * @author Ci-Yuu-Plus Team
 */
import { AxiosError } from 'axios'
import { ApiStatus } from './status'
import { $t } from '@/locales'

let isGlobalErrorMessageSuppressed = false
let allowedErrorMessage = ''
let lastVisibleErrorSignature = ''
let lastVisibleErrorAt = 0

const GLOBAL_ERROR_DEDUP_WINDOW = 1500
const DEV_PROXY_BACKEND_UNAVAILABLE_STATUS = ApiStatus.badGateway
const ERROR_MESSAGE_DURATION = 6000

// 错误响应接口
export interface ErrorResponse {
  /** 错误状态码 */
  code: number
  /** 错误消息 */
  msg: string
  /** 错误附加数据 */
  data?: unknown
}

// 错误日志数据接口
export interface ErrorLogData {
  /** 错误状态码 */
  code: number
  /** 错误消息 */
  message: string
  /** 错误附加数据 */
  data?: unknown
  /** 错误发生时间戳 */
  timestamp: string
  /** 请求 URL */
  url?: string
  /** 请求方法 */
  method?: string
  /** 错误堆栈信息 */
  stack?: string
}

// 自定义 HttpError 类
export class HttpError extends Error {
  public readonly code: number
  public readonly data?: unknown
  public readonly timestamp: string
  public readonly url?: string
  public readonly method?: string

  constructor(
    message: string,
    code: number,
    options?: {
      data?: unknown
      url?: string
      method?: string
    }
  ) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.data = options?.data
    this.timestamp = new Date().toISOString()
    this.url = options?.url
    this.method = options?.method
  }

  public toLogData(): ErrorLogData {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      url: this.url,
      method: this.method,
      stack: this.stack
    }
  }
}

/**
 * 获取错误消息
 * @param status 错误状态码
 * @returns 错误消息
 */
const getErrorMessage = (status: number): string => {
  const errorMap: Record<number, string> = {
    [ApiStatus.unauthorized]: 'httpMsg.unauthorized',
    [ApiStatus.forbidden]: 'httpMsg.forbidden',
    [ApiStatus.notFound]: 'httpMsg.notFound',
    [ApiStatus.methodNotAllowed]: 'httpMsg.methodNotAllowed',
    [ApiStatus.requestTimeout]: 'httpMsg.requestTimeout',
    [ApiStatus.internalServerError]: 'httpMsg.internalServerError',
    [ApiStatus.badGateway]: 'httpMsg.badGateway',
    [ApiStatus.serviceUnavailable]: 'httpMsg.serviceUnavailable',
    [ApiStatus.gatewayTimeout]: 'httpMsg.gatewayTimeout'
  }

  return $t(errorMap[status] || 'httpMsg.internalServerError')
}

function isDevProxyBackendUnavailableError(error: AxiosError<ErrorResponse>) {
  const statusCode = error.response?.status
  const requestUrl = error.config?.url || ''
  const hasBackendMessage = Boolean(error.response?.data?.msg?.trim())

  return (
    import.meta.env.DEV &&
    statusCode === DEV_PROXY_BACKEND_UNAVAILABLE_STATUS &&
    !hasBackendMessage &&
    requestUrl.startsWith('/api')
  )
}

/**
 * 处理错误
 * @param error 错误对象
 * @returns 错误对象
 */
export function handleError(error: AxiosError<ErrorResponse>): never {
  // 处理取消的请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('Request cancelled:', error.message)
    throw new HttpError($t('httpMsg.requestCancelled'), ApiStatus.error)
  }

  const statusCode = error.response?.status
  const errorMessage = error.response?.data?.msg || error.message
  const requestConfig = error.config

  // Axios 超时不会携带 response，单独提示为“请求超时”，避免误判成断网。
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    throw new HttpError($t('httpMsg.requestTimeout'), ApiStatus.requestTimeout, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase()
    })
  }

  // 处理网络错误
  if (!error.response) {
    throw new HttpError($t('httpMsg.networkError'), ApiStatus.error, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase()
    })
  }

  if (isDevProxyBackendUnavailableError(error)) {
    throw new HttpError($t('httpMsg.backendUnavailable'), ApiStatus.badGateway, {
      data: error.response.data,
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase()
    })
  }

  // 处理 HTTP 状态码错误
  const message = error.response?.data?.msg?.trim()
    ? error.response.data.msg.trim()
    : statusCode
      ? getErrorMessage(statusCode)
      : errorMessage || $t('httpMsg.requestFailed')
  throw new HttpError(message, statusCode || ApiStatus.error, {
    data: error.response.data,
    url: requestConfig?.url,
    method: requestConfig?.method?.toUpperCase()
  })
}

/**
 * 显示错误消息
 * @param error 错误对象
 * @param showMessage 是否显示错误消息
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
  if (showMessage) {
    const signature = getErrorMessageSignature(error)
    const now = Date.now()
    if (
      signature &&
      signature === lastVisibleErrorSignature &&
      now - lastVisibleErrorAt < GLOBAL_ERROR_DEDUP_WINDOW
    ) {
      console.error('[HTTP Error]', error.toLogData())
      return
    }

    lastVisibleErrorSignature = signature
    lastVisibleErrorAt = now
    ElMessage.error({
      message: error.message,
      duration: ERROR_MESSAGE_DURATION
    })
  }
  // 记录错误日志
  console.error('[HTTP Error]', error.toLogData())
}

/**
 * 显示成功消息
 * @param message 成功消息
 * @param showMessage 是否显示消息
 */
export function showSuccess(message: string, showMessage: boolean = true): void {
  if (showMessage) {
    ElMessage.success(message)
  }
}

/**
 * 判断是否为 HttpError 类型
 * @param error 错误对象
 * @returns 是否为 HttpError 类型
 */
export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError
}

function resolveMessageText(options: unknown) {
  if (typeof options === 'string') return options.trim()
  if (options && typeof options === 'object' && 'message' in options) {
    return String((options as { message?: string }).message || '').trim()
  }
  return ''
}

const rawElMessageError = ElMessage.error.bind(ElMessage)

ElMessage.error = ((options: Parameters<typeof ElMessage.error>[0], appContext?: any) => {
  const text = resolveMessageText(options)
  if (isGlobalErrorMessageSuppressed && text && text !== allowedErrorMessage) {
    return undefined as any
  }

  return rawElMessageError(options as any, appContext)
}) as typeof ElMessage.error

export function suppressGlobalErrorMessages(nextAllowedMessage: string = '') {
  isGlobalErrorMessageSuppressed = true
  allowedErrorMessage = nextAllowedMessage.trim()
}

export function resetGlobalErrorMessageSuppression() {
  isGlobalErrorMessageSuppressed = false
  allowedErrorMessage = ''
}

function getErrorMessageSignature(error: HttpError) {
  if (isBackendOutageError(error)) {
    return 'backend-outage'
  }

  return `${error.code}:${error.message.trim()}`
}

function isBackendOutageError(error: HttpError) {
  const backendErrorCodes = new Set([
    ApiStatus.requestTimeout,
    ApiStatus.internalServerError,
    ApiStatus.badGateway,
    ApiStatus.serviceUnavailable,
    ApiStatus.gatewayTimeout
  ])

  if (backendErrorCodes.has(error.code)) {
    return true
  }

  const backendErrorMessages = new Set([
    $t('httpMsg.networkError'),
    $t('httpMsg.requestTimeout'),
    $t('httpMsg.internalServerError'),
    $t('httpMsg.badGateway'),
    $t('httpMsg.serviceUnavailable'),
    $t('httpMsg.gatewayTimeout')
  ])

  return backendErrorMessages.has(error.message.trim())
}
