import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'
import { encryptPasswordFields } from '@/utils/crypto'

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export async function fetchLogin(params: Api.Auth.LoginParams) {
  const { payload, keyId } = await encryptPasswordFields(params, ['password'])
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/v1/auth/admin/login',
    data: payload,
    headers: keyId ? { 'X-Crypto-Key-Id': keyId } : undefined,
    skipApiSecurity: true,
    showErrorMessage: false
  })
}

/**
 * 获取图片验证码
 */
export function fetchCaptcha() {
  return request.get<Api.Auth.CaptchaResponse>({
    url: '/api/v1/auth/captcha',
    skipApiSecurity: true,
    showErrorMessage: false
  })
}

/**
 * 用户注册
 * @param params 注册参数
 */
export async function fetchSignup(params: Api.Auth.LoginParams) {
  const { payload, keyId } = await encryptPasswordFields(params, ['password'])
  return request.post<void>({
    url: '/api/v1/auth/signup',
    data: payload,
    headers: keyId ? { 'X-Crypto-Key-Id': keyId } : undefined,
    skipApiSecurity: true,
    showErrorMessage: false
  })
}

/**
 * 退出登录
 */
export function fetchLogout() {
  return request.post<void>({
    url: '/api/v1/auth/logout',
    permissionCode: ApiPermissionCode.ACCOUNT.LOGOUT,
    showErrorMessage: false
  })
}

/**
 * 刷新访问令牌
 */
export function fetchRefreshToken(data?: Api.Auth.RefreshTokenParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/v1/auth/refresh',
    data,
    showErrorMessage: false,
    skipAuthRefresh: true,
    skipApiSecurity: true
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/api/v1/user/info',
    permissionCode: ApiPermissionCode.ACCOUNT.INFO
    // 自定义请求头
    // headers: {
    //   'X-Custom-Header': 'your-custom-value'
    // }
  })
}
