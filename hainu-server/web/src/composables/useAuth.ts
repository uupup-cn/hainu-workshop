/**
 * 鉴权组合式 — 集中 token / 用户信息 / 登录 / 身份跳转
 * 不修改 useUserStore（保持其职责不变），仅组合 store + API
 */
import { useUserStore } from '@/store/user'
import { authApi, userApi } from '@/api'

export function useAuth() {
  const userStore = useUserStore()

  /** 已登录但用户信息缺失时补全（用于按身份跳转判断） */
  async function ensureProfile() {
    if (userStore.userInfo?.uid) return
    try {
      const res = await userApi.profile()
      userStore.setUserInfo(res.data)
    } catch {
      /* token 失效等由 http 拦截器处理，此处忽略 */
    }
  }

  /** 登录：取 token → 补全用户信息 → 关弹窗 */
  async function login(uid: string, password: string) {
    const res = await authApi.login(uid, password)
    userStore.setToken(res.data.accessToken)
    await ensureProfile()
    userStore.closeLoginDialog()
  }

  /** 按身份返回对应专区路径 */
  function identityZone(): string {
    return userStore.userInfo?.identity === 'freshman' ? '/freshman' : '/student'
  }

  /** 退出登录 */
  function logout() {
    userStore.logout()
  }

  return { ensureProfile, login, identityZone, logout }
}
