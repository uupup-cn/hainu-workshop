import request from '@/utils/http'
export function fetchTools(params?: any) { return request.get<any>({ url: '/api/v1/admin/tools', params }) }
export function fetchCreateTool(data: any) { return request.post({ url: '/api/v1/admin/tools', data, showSuccessMessage: true }) }
export function fetchUpdateTool(id: number, data: any) { return request.put({ url: '/api/v1/admin/tools/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteTool(id: number) { return request.del({ url: '/api/v1/admin/tools/' + id, showSuccessMessage: true }) }
export function fetchToolCategories() { return request.get<any>({ url: '/api/v1/admin/tool-categories' }) }
export function fetchCreateToolCategory(data: any) { return request.post({ url: '/api/v1/admin/tool-categories', data, showSuccessMessage: true }) }
export function fetchUpdateToolCategory(id: number, data: any) { return request.put({ url: '/api/v1/admin/tool-categories/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteToolCategory(id: number) { return request.del({ url: '/api/v1/admin/tool-categories/' + id, showSuccessMessage: true }) }
export function fetchToolUsageLogs(params?: any) { return request.get<any>({ url: '/api/v1/admin/tools/usage-log', params }) }
export function fetchVideoParseLines() { return request.get<any>({ url: '/api/v1/admin/video-parse-lines' }) }
export function fetchCreateVideoParseLine(data: any) { return request.post({ url: '/api/v1/admin/video-parse-lines', data, showSuccessMessage: true }) }
export function fetchUpdateVideoParseLine(id: number, data: any) { return request.put({ url: '/api/v1/admin/video-parse-lines/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteVideoParseLine(id: number) { return request.del({ url: '/api/v1/admin/video-parse-lines/' + id, showSuccessMessage: true }) }
