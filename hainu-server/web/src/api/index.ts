/**
 * API 统一出口 — axios 实例与各模块 API
 */
import api from './http'

export default api

export { freshmanApi } from './freshman'
export { roommateApi } from './roommate'
export { marketplaceApi } from './marketplace'
export { alumniApi } from './alumni'
export { courseApi2 } from './course'
export { toolsApi } from './tools'
export { profileApi } from './profile'

/** 认证 */
export const authApi = {
  login: (uid: string, password: string) => api.post('/auth/login', { uid, password }) as Promise<any>,
}

/** 用户（基础） */
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
  mapDetail: (campus: string) => api.get('/maps/' + encodeURIComponent(campus)) as Promise<any>,
  busSchedules: () => api.get('/bus/schedules') as Promise<any>,
  busStations: () => api.get('/bus/stations') as Promise<any>,
  busGuide: () => api.get('/bus/guide') as Promise<any>,
}

/** 社区（浏览） */
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

/** 课表（读） */
export const courseApi = {
  list: () => api.get('/courses') as Promise<any>,
}

/** 系统设置 */
export const systemApi = {
  settings: () => api.get('/system/settings') as Promise<any>,
}
