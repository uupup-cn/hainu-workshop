/**
 * 新生模块 API — 入学指南 / 生活攻略 / FAQ
 */
import api from './http'

export const freshmanApi = {
  guideEntries: () => api.get('/guide/entries') as Promise<any>,
  guideEntry: (key: string) => api.get('/guide/entries/' + key) as Promise<any>,
  lifeCampuses: () => api.get('/life/campuses') as Promise<any>,
  lifeTopics: (campus: string) => api.get('/life/topics', { params: { campus } }) as Promise<any>,
  lifeTopic: (key: string) => api.get('/life/topics/' + key) as Promise<any>,
  faqCategories: () => api.get('/faq/categories') as Promise<any>,
  faqQuestions: (params?: { category_id?: number; keyword?: string }) =>
    api.get('/faq/questions', { params }) as Promise<any>,
}
