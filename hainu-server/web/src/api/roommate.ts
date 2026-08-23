/**
 * 找室友 API（需登录）
 */
import api from './http'

export const roommateApi = {
  status: () => api.get('/roommate/status') as Promise<any>,
  campuses: () => api.get('/roommate/campuses') as Promise<any>,
  colleges: (campusId: number) => api.get('/roommate/colleges', { params: { campus_id: campusId } }) as Promise<any>,
  departments: (campusId?: number) => api.get('/roommate/departments', { params: campusId ? { campus_id: campusId } : {} }) as Promise<any>,
  majors: (departmentId: number) => api.get('/roommate/majors', { params: { department_id: departmentId } }) as Promise<any>,
  buildings: (collegeId: number) => api.get('/roommate/buildings', { params: { college_id: collegeId } }) as Promise<any>,
  posts: (page = 1, size = 20) => api.get('/roommate/posts', { params: { page, size } }) as Promise<any>,
  myPost: () => api.get('/roommate/posts/my') as Promise<any>,
  publish: (data: any) => api.post('/roommate/posts', data) as Promise<any>,
  update: (id: number, data: any) => api.put('/roommate/posts/' + id, data) as Promise<any>,
  match: (data: any) => api.post('/roommate/posts/match', data) as Promise<any>,
}
