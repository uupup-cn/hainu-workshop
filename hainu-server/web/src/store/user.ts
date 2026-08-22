import { defineStore } from 'pinia'

/** 用户登录态（token + 基本信息 + 登录弹窗开关） */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as any,
    loginDialogVisible: false,
  }),
  getters: {
    isLoggedIn: (s: any) => !!s.token,
  },
  actions: {
    setToken(t: string) { this.token = t; localStorage.setItem('token', t) },
    setUserInfo(u: any) { this.userInfo = u },
    openLoginDialog() { this.loginDialogVisible = true },
    closeLoginDialog() { this.loginDialogVisible = false },
    logout() { this.token = ''; this.userInfo = null; localStorage.removeItem('token') },
  },
})
