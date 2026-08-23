/**
 * 二手集市 API — 含发布/下架/重新上架/我的发布/举报
 */
import api from './http'

export const marketplaceApi = {
  categories: () => api.get('/marketplace/categories') as Promise<any>,
  items: (params: { category?: number; keyword?: string; page?: number; size?: number }) =>
    api.get('/marketplace/items', { params }) as Promise<any>,
  item: (id: number) => api.get('/marketplace/items/' + id) as Promise<any>,
  create: (data: any) => api.post('/marketplace/items', data) as Promise<any>,
  off: (id: number) => api.put(`/marketplace/items/${id}/off`) as Promise<any>,
  relist: (id: number) => api.put(`/marketplace/items/${id}/relist`) as Promise<any>,
  remove: (id: number) => api.delete('/marketplace/items/' + id) as Promise<any>,
  myItems: (page = 1, size = 20) => api.get('/marketplace/my-items', { params: { page, size } }) as Promise<any>,
  report: (id: number, reason: string, detail?: string) =>
    api.post(`/marketplace/items/${id}/report`, { reason, detail }) as Promise<any>,
}
