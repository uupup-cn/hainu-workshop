/**
 * 课表 API — 课程增删改 + 分享码
 */
import api from './http'

export const courseApi2 = {
  list: () => api.get('/courses') as Promise<any>,
  create: (data: any) => api.post('/courses', data) as Promise<any>,
  update: (id: number, data: any) => api.put('/courses/' + id, data) as Promise<any>,
  remove: (id: number) => api.delete('/courses/' + id) as Promise<any>,
  share: () => api.post('/courses/share') as Promise<any>,
  replicate: (shareCode: string) => api.post('/courses/replicate', { share_code: shareCode }) as Promise<any>,
}
