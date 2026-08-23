import request from '@/utils/http'
export function fetchCampuses() { return request.get<any>({ url: '/api/v1/admin/campuses' }) }
export function fetchCreateCampus(data: any) { return request.post({ url: '/api/v1/admin/campuses', data, showSuccessMessage: true }) }
export function fetchUpdateCampus(id: number, data: any) { return request.put({ url: '/api/v1/admin/campuses/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteCampus(id: number) { return request.del({ url: '/api/v1/admin/campuses/' + id, showSuccessMessage: true }) }
export function fetchColleges(campusId?: number) { return request.get<any>({ url: '/api/v1/admin/colleges', params: { campusId } }) }
export function fetchCreateCollege(data: any) { return request.post({ url: '/api/v1/admin/colleges', data, showSuccessMessage: true }) }
export function fetchUpdateCollege(id: number, data: any) { return request.put({ url: '/api/v1/admin/colleges/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteCollege(id: number) { return request.del({ url: '/api/v1/admin/colleges/' + id, showSuccessMessage: true }) }
export function fetchDepartments(campusId?: number) { return request.get<any>({ url: '/api/v1/admin/departments', params: { campusId } }) }
export function fetchCreateDepartment(data: any) { return request.post({ url: '/api/v1/admin/departments', data, showSuccessMessage: true }) }
export function fetchUpdateDepartment(id: number, data: any) { return request.put({ url: '/api/v1/admin/departments/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteDepartment(id: number) { return request.del({ url: '/api/v1/admin/departments/' + id, showSuccessMessage: true }) }
export function fetchMajors(departmentId?: number) { return request.get<any>({ url: '/api/v1/admin/majors', params: { departmentId } }) }
export function fetchCreateMajor(data: any) { return request.post({ url: '/api/v1/admin/majors', data, showSuccessMessage: true }) }
export function fetchUpdateMajor(id: number, data: any) { return request.put({ url: '/api/v1/admin/majors/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteMajor(id: number) { return request.del({ url: '/api/v1/admin/majors/' + id, showSuccessMessage: true }) }
export function fetchBuildings(collegeId?: number) { return request.get<any>({ url: '/api/v1/admin/buildings', params: { collegeId } }) }
export function fetchCreateBuilding(data: any) { return request.post({ url: '/api/v1/admin/buildings', data, showSuccessMessage: true }) }
export function fetchUpdateBuilding(id: number, data: any) { return request.put({ url: '/api/v1/admin/buildings/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteBuilding(id: number) { return request.del({ url: '/api/v1/admin/buildings/' + id, showSuccessMessage: true }) }
export function fetchCollegeTree(campusId?: number) { return request.get<any>({ url: '/api/v1/admin/college-tree', params: { campusId } }) }
