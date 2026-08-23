import request from '@/utils/http'
export function fetchMarketCategories() { return request.get<any>({ url: '/api/v1/marketplace/categories' }) }
export function fetchAdminMarketCategories() { return request.get<any>({ url: '/api/v1/admin/marketplace/categories' }) }
export function fetchCreateMarketCategory(data: any) { return request.post({ url: '/api/v1/admin/marketplace/categories', data, showSuccessMessage: true }) }
export function fetchUpdateMarketCategory(id: number, data: any) { return request.put({ url: '/api/v1/admin/marketplace/categories/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteMarketCategory(id: number) { return request.del({ url: '/api/v1/admin/marketplace/categories/' + id, showSuccessMessage: true }) }
export function fetchMarketItems(params?: any) { return request.get<any>({ url: '/api/v1/admin/marketplace/items', params }) }
export function fetchAdminMarketItems(params?: any) { return request.get<any>({ url: '/api/v1/admin/marketplace/items', params }) }
export function fetchMarketItem(id: number) { return request.get<any>({ url: '/api/v1/admin/marketplace/items/' + id }) }
export function fetchDeleteMarketItem(id: number) { return request.del({ url: '/api/v1/admin/marketplace/items/' + id, showSuccessMessage: true }) }
export function fetchReports(params?: any) { return request.get<any>({ url: '/api/v1/admin/reports', params }) }
export function fetchHandleReport(id: number, data: any) { return request.put({ url: '/api/v1/admin/reports/' + id, data, showSuccessMessage: true }) }
export function fetchNews(params?: any) { return request.get<any>({ url: '/api/v1/news', params }) }
export function fetchAdminNews(params?: any) { return request.get<any>({ url: '/api/v1/admin/news', params }) }
export function fetchCreateNews(data: any) { return request.post({ url: '/api/v1/admin/news', data, showSuccessMessage: true }) }
export function fetchUpdateNews(id: number, data: any) { return request.put({ url: '/api/v1/admin/news/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteNews(id: number) { return request.del({ url: '/api/v1/admin/news/' + id, showSuccessMessage: true }) }
export function fetchAlumniSections() { return request.get<any>({ url: '/api/v1/alumni/sections' }) }
export function fetchCreateAlumniSection(data: any) { return request.post({ url: '/api/v1/admin/alumni/sections', data, showSuccessMessage: true }) }
export function fetchUpdateAlumniSection(id: number, data: any) { return request.put({ url: '/api/v1/admin/alumni/sections/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteAlumniSection(id: number) { return request.del({ url: '/api/v1/admin/alumni/sections/' + id, showSuccessMessage: true }) }
export function fetchAlumniPosts(params?: any) { return request.get<any>({ url: '/api/v1/admin/alumni/posts', params }) }
export function fetchUpdateAlumniPostPin(id: number, data: any) { return request.put({ url: '/api/v1/admin/alumni/posts/' + id + '/pin', data, showSuccessMessage: true }) }
export function fetchDeleteAlumniPost(id: number) { return request.del({ url: '/api/v1/admin/alumni/posts/' + id, showSuccessMessage: true }) }
export function fetchLotteryActivities() { return request.get<any>({ url: '/api/v1/lottery/activities' }) }
export function fetchAdminLotteryActivities(params?: any) { return request.get<any>({ url: '/api/v1/admin/lottery/activities', params }) }
export function fetchLotteryActivity(id: number) { return request.get<any>({ url: '/api/v1/admin/lottery/activities/' + id }) }
export function fetchCreateLotteryActivity(data: any) { return request.post({ url: '/api/v1/admin/lottery/activities', data, showSuccessMessage: true }) }
export function fetchListLotteryActivity(id: number, data: any) { return request.put({ url: '/api/v1/admin/lottery/activities/' + id + '/list', data, showSuccessMessage: true }) }
export function fetchDeleteLotteryActivity(id: number) { return request.del({ url: '/api/v1/admin/lottery/activities/' + id, showSuccessMessage: true }) }
export function fetchCreateLotteryPrize(activityId: number, data: any) { return request.post({ url: '/api/v1/admin/lottery/activities/' + activityId + '/prizes', data, showSuccessMessage: true }) }
export function fetchUpdateLotteryPrize(id: number, data: any) { return request.put({ url: '/api/v1/admin/lottery/prizes/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteLotteryPrize(id: number) { return request.del({ url: '/api/v1/admin/lottery/prizes/' + id, showSuccessMessage: true }) }
export function fetchUpdateLotteryDescription(id: number, data: any) { return request.put({ url: '/api/v1/admin/lottery/activities/' + id + '/description', data, showSuccessMessage: true }) }
export function fetchLotteryWinners(id: number, params?: any) { return request.get<any>({ url: '/api/v1/admin/lottery/activities/' + id + '/winners', params }) }
