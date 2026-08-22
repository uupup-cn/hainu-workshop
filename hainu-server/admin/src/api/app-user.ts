import request from '@/utils/http'
// 小程序用户管理
export function fetchUserList(params?: any) { return request.get<any>({ url: '/api/v1/admin/users', params }) }
export function fetchUpdateUser(id: number, data: any) { return request.put({ url: '/api/v1/admin/users/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteUser(id: number) { return request.del({ url: '/api/v1/admin/users/' + id, showSuccessMessage: true }) }
// 认证审核
export function fetchAuthApplications(params?: any) { return request.get<any>({ url: '/api/v1/admin/auth-applications', params }) }
export function fetchReviewAuth(id: number, data: { status: string; reviewRemark?: string }) { return request.put({ url: '/api/v1/admin/auth-applications/' + id + '/review', data, showSuccessMessage: true }) }
