import request from '@/utils/http'
export function fetchGuideEntries() { return request.get<any>({ url: '/api/v1/guide/entries' }) }
export function fetchAdminGuideEntries(params?: any) { return request.get<any>({ url: '/api/v1/admin/guide/entries', params }) }
export function fetchCreateGuide(data: any) { return request.post({ url: '/api/v1/admin/guide/entries', data, showSuccessMessage: true }) }
export function fetchUpdateGuide(id: number, data: any) { return request.put({ url: '/api/v1/admin/guide/entries/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteGuide(id: number) { return request.del({ url: '/api/v1/admin/guide/entries/' + id, showSuccessMessage: true }) }
export function fetchLifeCampuses() { return request.get<any>({ url: '/api/v1/life/campuses' }) }
export function fetchLifeTopics(params?: any) { return request.get<any>({ url: '/api/v1/life/topics', params }) }
export function fetchCreateLifeTopic(data: any) { return request.post({ url: '/api/v1/admin/life/topics', data, showSuccessMessage: true }) }
export function fetchUpdateLifeTopic(id: number, data: any) { return request.put({ url: '/api/v1/admin/life/topics/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteLifeTopic(id: number) { return request.del({ url: '/api/v1/admin/life/topics/' + id, showSuccessMessage: true }) }
export function fetchFaqCategories() { return request.get<any>({ url: '/api/v1/faq/categories' }) }
export function fetchFaqQuestions(params?: any) { return request.get<any>({ url: '/api/v1/faq/questions', params }) }
export function fetchCreateFaqCategory(data: any) { return request.post({ url: '/api/v1/admin/faq/categories', data, showSuccessMessage: true }) }
export function fetchDeleteFaqCategory(id: number) { return request.del({ url: '/api/v1/admin/faq/categories/' + id, showSuccessMessage: true }) }
export function fetchCreateFaqQuestion(data: any) { return request.post({ url: '/api/v1/admin/faq/questions', data, showSuccessMessage: true }) }
export function fetchUpdateFaqQuestion(id: number, data: any) { return request.put({ url: '/api/v1/admin/faq/questions/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteFaqQuestion(id: number) { return request.del({ url: '/api/v1/admin/faq/questions/' + id, showSuccessMessage: true }) }
export function fetchRoommateSettings() { return request.get<any>({ url: '/api/v1/admin/roommate/settings' }) }
export function fetchUpdateRoommateSettings(data: any) { return request.put({ url: '/api/v1/admin/roommate/settings', data, showSuccessMessage: true }) }
export function fetchRoommatePosts(params?: any) { return request.get<any>({ url: '/api/v1/admin/roommate/posts', params }) }
export function fetchDeleteRoommatePost(id: number) { return request.del({ url: '/api/v1/admin/roommate/posts/' + id, showSuccessMessage: true }) }
export function fetchAdminLifeTopics(params?: any) { return request.get<any>({ url: '/api/v1/admin/life/topics', params }) }
export function fetchAdminFaqCategories(params?: any) { return request.get<any>({ url: '/api/v1/admin/faq/categories', params }) }
export function fetchUpdateFaqCategory(id: number, data: any) { return request.put({ url: '/api/v1/admin/faq/categories/' + id, data, showSuccessMessage: true }) }
export function fetchAdminFaqQuestions(params?: any) { return request.get<any>({ url: '/api/v1/admin/faq/questions', params }) }
