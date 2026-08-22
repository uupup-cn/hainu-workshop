/**
 * API 封装 — 统一 axios 实例 + 按模块分组的接口函数
 * 开发环境经 vite 代理到本地后端，生产环境同域部署
 */
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1', timeout: 15000 })

// 请求拦截：附加登录态
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

// 响应拦截：统一解包 {code,message,data}；未登录跳转登录页
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.data?.code === 40010) {
      localStorage.removeItem('token')
      if (location.pathname !== '/login') location.href = '/login'
    }
    return Promise.reject(err.response?.data || { code: 50000, message: '网络异常，请稍后重试' })
  },
)

export default api

/** 认证 */
export const authApi = {
  login: (uid: string, password: string) => api.post('/auth/login', { uid, password }) as Promise<any>,
}

/** 用户 */
export const userApi = {
  profile: () => api.get('/user/profile') as Promise<any>,
  notifications: (page = 1, size = 20) => api.get('/notifications', { params: { page, size } }) as Promise<any>,
}

/** 智慧海大（只读内容） */
export const wiseApi = {
  introEntries: () => api.get('/intro/entries') as Promise<any>,
  introEntry: (key: string) => api.get('/intro/entries/' + key) as Promise<any>,
  phonebookCategories: () => api.get('/phonebook/categories') as Promise<any>,
  phonebookEntries: (categoryId: number, keyword?: string) =>
    api.get('/phonebook/entries', { params: { category_id: categoryId, keyword } }) as Promise<any>,
  calendar: () => api.get('/calendar') as Promise<any>,
  maps: () => api.get('/maps') as Promise<any>,
  busSchedules: () => api.get('/bus/schedules') as Promise<any>,
  busStations: () => api.get('/bus/stations') as Promise<any>,
  busGuide: () => api.get('/bus/guide') as Promise<any>,
}

/** 社区 */
export const communityApi = {
  marketplaceCategories: () => api.get('/marketplace/categories') as Promise<any>,
  marketplaceItems: (params: { category?: number; keyword?: string; page?: number; size?: number }) =>
    api.get('/marketplace/items', { params }) as Promise<any>,
  newsList: (params: { page?: number; size?: number; target?: string }) => api.get('/news', { params }) as Promise<any>,
  newsDetail: (id: number) => api.get('/news/' + id) as Promise<any>,
  alumniSections: () => api.get('/alumni/sections') as Promise<any>,
  alumniPosts: (params: { type: string; section_id?: number; page?: number; size?: number }) =>
    api.get('/alumni/posts', { params }) as Promise<any>,
  alumniComments: (postId: number) => api.get(`/alumni/posts/${postId}/comments`) as Promise<any>,
}

/** 课表 */
export const courseApi = {
  list: () => api.get('/courses') as Promise<any>,
}
