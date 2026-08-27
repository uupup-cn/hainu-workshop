/**
 * 个人中心 API — 资料/密码/隐私/认证/积分/通知
 */
import api from './http'

export const profileApi = {
  info: () => api.get('/user/profile') as Promise<any>,
  update: (data: any) => api.put('/user/profile', data) as Promise<any>,
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put('/user/password', data) as Promise<any>,
  privacy: () => api.get('/user/privacy') as Promise<any>,
  updatePrivacy: (data: any) => api.put('/user/privacy', data) as Promise<any>,
  authApply: (data: any) => api.post('/user/auth-apply', data) as Promise<any>,
  authStatus: () => api.get('/user/auth-status') as Promise<any>,
  points: () => api.get('/user/points') as Promise<any>,
  notifications: (page = 1, size = 20) => api.get('/notifications', { params: { page, size } }) as Promise<any>,
  readNotification: (id: number) => api.put(`/notifications/${id}/read`) as Promise<any>,
  unreadCount: () => api.get('/notifications/unread-count') as Promise<any>,
  feedback: (data: { content: string; contact?: string; type?: string; title?: string; expectedBehavior?: string }) => api.post('/user/feedback', data) as Promise<any>,
  feedbackList: (page = 1, size = 20) => api.get('/user/feedback', { params: { page, size } }) as Promise<any>,
  uploadImage: (filename: string, base64: string) =>
    api.post('/upload/image', { filename, base64 }) as Promise<any>,
}
