import { ref, watch, type Ref } from 'vue'

export const AUTH_LOGIN_PATH = '/auth/login'

/**
 * 为认证页表单生成一个受语言切换驱动的渲染 key。
 * 语言变更后递增 key，可强制刷新表单校验提示和占位文案。
 */
export function useLocaleFormKey(locale: Readonly<Ref<unknown>>) {
  const formKey = ref(0)

  /**
   * 在语言切换时刷新表单 key，确保表单 UI 与当前语言保持一致。
   */
  function refreshFormKey() {
    formKey.value += 1
  }

  watch(locale, refreshFormKey)

  return {
    formKey,
    refreshFormKey
  }
}

/**
 * 从接口异常对象中提取适合直接展示的错误文案。
 * 优先读取后端返回消息，兜底使用调用方传入的默认提示。
 */
export function resolveRequestErrorMessage(error: unknown, fallbackMessage: string) {
  const requestError = error as {
    data?: { msg?: string }
    response?: { data?: { msg?: string } }
    message?: string
  }

  return (
    requestError?.data?.msg ||
    requestError?.response?.data?.msg ||
    requestError?.message ||
    fallbackMessage
  )
}

/**
 * 解析登录成功后的跳转地址。
 * 仅允许跳转到站内路径，并拦截再次跳回登录页的情况。
 */
export function resolveAuthRedirectTarget(redirect: unknown, blockedPath = AUTH_LOGIN_PATH) {
  const redirectTarget = Array.isArray(redirect) ? redirect[0] : redirect

  if (typeof redirectTarget !== 'string') {
    return '/'
  }

  const normalizedRedirect = redirectTarget.trim()
  if (!normalizedRedirect.startsWith('/')) {
    return '/'
  }

  if (normalizedRedirect === blockedPath || normalizedRedirect.startsWith(`${blockedPath}?`)) {
    return '/'
  }

  return normalizedRedirect || '/'
}
