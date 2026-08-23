/**
 * 工具箱 API
 */
import api from './http'

export const toolsApi = {
  categories: () => api.get('/tools/categories') as Promise<any>,
  list: (categoryId?: number) => api.get('/tools', { params: { category_id: categoryId } }) as Promise<any>,
  detail: (key: string) => api.get('/tools/' + key) as Promise<any>,
  use: (key: string, params: any) => api.post(`/tools/${key}/use`, { params }) as Promise<any>,
  share: (key: string, data: any) => api.post(`/tools/${key}/share`, data) as Promise<any>,
  videoLines: () => api.get('/tools/video-parse/lines') as Promise<any>,
  videoParse: (videoUrl: string, lineId: number) =>
    api.post('/tools/video-parse', { video_url: videoUrl, line_id: lineId }) as Promise<any>,
}
