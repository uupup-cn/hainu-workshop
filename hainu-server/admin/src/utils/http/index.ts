/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理
 *
 * ## 主要功能
 *
 * - 请求/响应拦截器（自动添加 Token、统一错误处理）
 * - 401 未授权自动登出（带防抖机制）
 * - 请求失败自动重试（可配置）
 * - 统一的成功/错误消息提示
 * - 支持 GET/POST/PUT/DELETE 等常用方法
 *
 * @module utils/http
 * @author Ci-Yuu-Plus Team
 */

import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import {
  HttpError,
  handleError,
  resetGlobalErrorMessageSuppression,
  showError,
  showSuccess,
  suppressGlobalErrorMessages
} from './error'
import { $t } from '@/locales'
import { BaseResponse } from '@/types'
import { applyApiSecurityHeaders } from '@/utils/api-security'

/** 请求配置常量 */
const REQUEST_TIMEOUT = 15000
const LOGOUT_DELAY = 500
const MAX_RETRIES = 0
const RETRY_DELAY = 1000
const UNAUTHORIZED_DEBOUNCE_TIME = 3000
const RESTORE_ACCESS_TOKEN_MAX_ATTEMPTS = 3
const RESTORE_ACCESS_TOKEN_RETRY_DELAY = 700

/** 401防抖状态 */
let isUnauthorizedErrorShown = false
let unauthorizedTimer: NodeJS.Timeout | null = null
let refreshTokenPromise: Promise<string> | null = null

/** 扩展 AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
  showSuccessMessage?: boolean
  skipAuthRefresh?: boolean
  skipApiSecurity?: boolean
  // 用于“静默恢复登录态”场景，401 时不触发全局未授权提示与登出跳转。
  silentUnauthorized?: boolean
  // 业务请求可声明对应接口能力码，前端会在发请求前做一次体验层预校验。
  permissionCode?: string
  _retry?: boolean
}

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

/** Axios实例 */
const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: VITE_API_URL,
  withCredentials: VITE_WITH_CREDENTIALS === 'true',
  validateStatus: (status) => status >= 200 && status < 300,
  transformResponse: [
    (data, headers) => {
      const contentType = headers['content-type']
      if (contentType?.includes('application/json')) {
        try {
          return JSON.parse(data)
        } catch {
          return data
        }
      }
      return data
    }
  ]
})

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore()
    if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`)

    if (accessToken && !(request as ExtendedAxiosRequestConfig).skipApiSecurity) {
      await applyApiSecurityHeaders(request, accessToken)
    }

    if (request.data && !(request.data instanceof FormData) && !request.headers['Content-Type']) {
      request.headers.set('Content-Type', 'application/json')
      request.data = JSON.stringify(request.data)
    }

    return request
  },
  (error) => {
    showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error))
    return Promise.reject(error)
  }
)

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse<BaseResponse>) => {
    const { code, msg } = response.data
    const requestConfig = response.config as ExtendedAxiosRequestConfig
    if (code === ApiStatus.success) return response
    if (code === ApiStatus.unauthorized && requestConfig.silentUnauthorized) {
      throw createHttpError(msg || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)
    }
    if (code === ApiStatus.unauthorized) {
      try {
        return await retryWithFreshAccessToken(requestConfig)
      } catch (refreshError) {
        handleUnauthorizedError(resolveErrorMessage(refreshError) || msg)
        return Promise.reject(refreshError)
      }
    }
    throw createHttpError(msg || $t('httpMsg.requestFailed'), code)
  },
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined
    const responseMessage = resolveResponseErrorMessage(error)

    if (error.response?.status === ApiStatus.unauthorized && originalRequest) {
      try {
        return await retryWithFreshAccessToken(originalRequest)
      } catch (refreshError) {
        if (originalRequest.silentUnauthorized) {
          return Promise.reject(refreshError)
        }
        handleUnauthorizedError(resolveErrorMessage(refreshError) || responseMessage)
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === ApiStatus.unauthorized) {
      handleUnauthorizedError(responseMessage)
    }
    return Promise.reject(handleError(error))
  }
)

/** 统一创建HttpError */
function createHttpError(message: string, code: number) {
  return new HttpError(message, code)
}

function resolveResponseErrorMessage(error: any) {
  return error?.response?.data?.msg?.trim?.() || ''
}

function resolveErrorMessage(error: unknown) {
  if (error instanceof HttpError) {
    return error.message
  }

  if (axios.isAxiosError(error)) {
    return error.response?.data?.msg?.trim?.() || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return ''
}

function resolveUnauthorizedMessage(message?: string) {
  const trimmedMessage = message?.trim() || ''
  const sessionExpiredMessage = $t('httpMsg.sessionExpired') || ''
  const unauthorizedMessage = $t('httpMsg.unauthorized') || ''
  const userStore = useUserStore()

  const genericUnauthorizedMessages = new Set([
    unauthorizedMessage,
    '未授权访问，请重新登录',
    'Unauthorized access, please login again',
    'Refresh token 无效或已过期',
    'Access token 无效或已过期',
    'jwt expired'
  ])

  const hasLoginContext = Boolean(userStore.isLogin) || Boolean(userStore.accessToken)

  if (hasLoginContext && (!trimmedMessage || genericUnauthorizedMessages.has(trimmedMessage))) {
    return sessionExpiredMessage || unauthorizedMessage
  }

  return trimmedMessage || sessionExpiredMessage || unauthorizedMessage
}

async function retryWithFreshAccessToken(originalRequest: ExtendedAxiosRequestConfig) {
  if (originalRequest.skipAuthRefresh || originalRequest._retry) {
    throw createHttpError($t('httpMsg.unauthorized'), ApiStatus.unauthorized)
  }

  originalRequest._retry = true
  const nextAccessToken = await refreshAccessToken()

  if (!originalRequest.headers) {
    originalRequest.headers = {}
  }

  if (originalRequest.headers instanceof Headers) {
    originalRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`)
  } else {
    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
  }

  return axiosInstance.request(originalRequest)
}

export async function refreshAccessToken() {
  return requestSharedRefreshAccessToken(false)
}

function requestSharedRefreshAccessToken(silentUnauthorized: boolean) {
  if (!refreshTokenPromise) {
    refreshTokenPromise = requestRefreshAccessToken(silentUnauthorized).finally(() => {
      refreshTokenPromise = null
    })
  }

  return refreshTokenPromise
}

export async function restoreAccessToken() {
  for (let attempt = 1; attempt <= RESTORE_ACCESS_TOKEN_MAX_ATTEMPTS; attempt += 1) {
    try {
      await requestSharedRefreshAccessToken(true)
      return true
    } catch (error) {
      if (
        error instanceof HttpError &&
        error.code !== ApiStatus.unauthorized &&
        attempt < RESTORE_ACCESS_TOKEN_MAX_ATTEMPTS
      ) {
        await delay(RESTORE_ACCESS_TOKEN_RETRY_DELAY)
        continue
      }

      return false
    }
  }

  return false
}

// 刷新 token 仍属于鉴权链路的一部分，因此由 HTTP 层统一维护其请求配置。
function buildRefreshAccessTokenRequestConfig(
  silentUnauthorized: boolean
): ExtendedAxiosRequestConfig {
  return {
    method: 'POST',
    url: '/api/v1/auth/refresh',
    skipAuthRefresh: true,
    skipApiSecurity: true,
    silentUnauthorized,
    showErrorMessage: false
  }
}

// 统一校验 refresh 接口返回值，并把新的 accessToken 写回用户状态。
function applyRefreshedAccessToken(response: AxiosResponse<BaseResponse<Api.Auth.LoginResponse>>) {
  const { code, msg, data } = response.data

  if (code !== ApiStatus.success || !data?.accessToken) {
    throw createHttpError(msg || $t('httpMsg.unauthorized'), code || ApiStatus.unauthorized)
  }

  const userStore = useUserStore()
  userStore.setTokens(data.accessToken)
  userStore.setLoginStatus(true)
  return data.accessToken
}

// silentUnauthorized=true 仅用于首次访问时的静默登录恢复，避免首屏出现 401 提示。
async function requestRefreshAccessToken(silentUnauthorized: boolean) {
  const response = await axiosInstance.request<BaseResponse<Api.Auth.LoginResponse>>(
    buildRefreshAccessTokenRequestConfig(silentUnauthorized)
  )

  return applyRefreshedAccessToken(response)
}

/** 处理401错误（带防抖） */
function handleUnauthorizedError(message?: string): never {
  const normalizedMessage = resolveUnauthorizedMessage(message)
  const error = createHttpError(normalizedMessage, ApiStatus.unauthorized)

  if (!isUnauthorizedErrorShown) {
    isUnauthorizedErrorShown = true
    suppressGlobalErrorMessages(normalizedMessage)
    ElMessage.closeAll()
    logOut()

    unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME)

    showError(error, true)
    throw error
  }

  throw error
}

/** 重置401防抖状态 */
function resetUnauthorizedError() {
  isUnauthorizedErrorShown = false
  resetGlobalErrorMessageSuppression()
  if (unauthorizedTimer) clearTimeout(unauthorizedTimer)
  unauthorizedTimer = null
}

/** 退出登录函数 */
function logOut() {
  setTimeout(() => {
    useUserStore().logOut()
  }, LOGOUT_DELAY)
}

/** 是否需要重试 */
function shouldRetry(statusCode: number) {
  return [
    ApiStatus.requestTimeout,
    ApiStatus.internalServerError,
    ApiStatus.badGateway,
    ApiStatus.serviceUnavailable,
    ApiStatus.gatewayTimeout
  ].includes(statusCode)
}

/** 请求重试逻辑 */
async function retryRequest<T>(
  config: ExtendedAxiosRequestConfig,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await request<T>(config)
  } catch (error) {
    if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
      await delay(RETRY_DELAY)
      return retryRequest<T>(config, retries - 1)
    }
    throw error
  }
}

/** 延迟函数 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 请求函数 */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  try {
    // 这里只做前端提示优化，真正的权限边界仍以后端守卫校验为准。
    assertApiPermission(config)

    // POST | PUT 参数自动填充
    if (
      ['POST', 'PUT'].includes(config.method?.toUpperCase() || '') &&
      config.params &&
      !config.data
    ) {
      config.data = config.params
      config.params = undefined
    }

    const res = await axiosInstance.request<BaseResponse<T>>(config)

    // 显示成功消息
    if (config.showSuccessMessage && res.data.msg) {
      showSuccess(res.data.msg)
    }

    return res.data.data as T
  } catch (error) {
    if (error instanceof HttpError && error.code !== ApiStatus.unauthorized) {
      const showMsg = config.showErrorMessage !== false
      showError(error, showMsg)
    }
    return Promise.reject(error)
  }
}

function assertApiPermission(config: ExtendedAxiosRequestConfig) {
  const permissionCode = config.permissionCode?.trim()
  if (!permissionCode) return

  const userStore = useUserStore()
  const apiPermissions = userStore.info?.apiPermissions

  if (!userStore.isLogin || !userStore.info?.id || !Array.isArray(apiPermissions)) {
    return
  }

  if (apiPermissions.includes(permissionCode)) {
    return
  }

  // 提前阻止一个必然会 403 的请求，减少无意义的网络往返和错误弹窗。
  throw createHttpError('当前账号无权访问该接口，请联系管理员授权', ApiStatus.forbidden)
}

/** API方法集合 */
const api = {
  get<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'GET' })
  },
  post<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'POST' })
  },
  put<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'PUT' })
  },
  patch<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'PATCH' })
  },
  del<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'DELETE' })
  },
  request<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>(config)
  }
}

export default api
