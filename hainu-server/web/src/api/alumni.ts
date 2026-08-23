/**
 * 校友圈 API — 帖子/表白墙 + 点赞/评论/发布/举报
 */
import api from './http'

export const alumniApi = {
  sections: () => api.get('/alumni/sections') as Promise<any>,
  posts: (params: { type: string; section_id?: number; page?: number; size?: number }) =>
    api.get('/alumni/posts', { params }) as Promise<any>,
  post: (id: number) => api.get('/alumni/posts/' + id) as Promise<any>,
  create: (data: any) => api.post('/alumni/posts', data) as Promise<any>,
  remove: (id: number) => api.delete('/alumni/posts/' + id) as Promise<any>,
  like: (id: number) => api.post(`/alumni/posts/${id}/like`) as Promise<any>,
  unlike: (id: number) => api.delete(`/alumni/posts/${id}/like`) as Promise<any>,
  comments: (postId: number, page = 1, size = 50) =>
    api.get(`/alumni/posts/${postId}/comments`, { params: { page, size } }) as Promise<any>,
  comment: (postId: number, data: any) => api.post(`/alumni/posts/${postId}/comments`, data) as Promise<any>,
  removeComment: (id: number) => api.delete('/alumni/comments/' + id) as Promise<any>,
  reportPost: (id: number, reason: string, detail?: string) =>
    api.post(`/alumni/posts/${id}/report`, { reason, detail }) as Promise<any>,
}
