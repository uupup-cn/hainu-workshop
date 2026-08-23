import request from '@/utils/http'
export function fetchCourses(params?: any) { return request.get<any>({ url: '/api/v1/admin/courses', params }) }
export function fetchDeleteCourse(id: number) { return request.del({ url: '/api/v1/admin/courses/' + id, showSuccessMessage: true }) }
export function fetchCourseColors() { return request.get<any>({ url: '/api/v1/admin/course-colors' }) }
export function fetchCreateCourseColor(data: any) { return request.post({ url: '/api/v1/admin/course-colors', data, showSuccessMessage: true }) }
export function fetchUpdateCourseColor(id: number, data: any) { return request.put({ url: '/api/v1/admin/course-colors/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteCourseColor(id: number) { return request.del({ url: '/api/v1/admin/course-colors/' + id, showSuccessMessage: true }) }
export function fetchSemesters() { return request.get<any>({ url: '/api/v1/admin/semesters' }) }
export function fetchCreateSemester(data: any) { return request.post({ url: '/api/v1/admin/semesters', data, showSuccessMessage: true }) }
export function fetchUpdateSemester(id: number, data: any) { return request.put({ url: '/api/v1/admin/semesters/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteSemester(id: number) { return request.del({ url: '/api/v1/admin/semesters/' + id, showSuccessMessage: true }) }
export function fetchSections() { return request.get<any>({ url: '/api/v1/admin/sections' }) }
export function fetchCreateSection(data: any) { return request.post({ url: '/api/v1/admin/sections', data, showSuccessMessage: true }) }
export function fetchUpdateSection(id: number, data: any) { return request.put({ url: '/api/v1/admin/sections/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteSection(id: number) { return request.del({ url: '/api/v1/admin/sections/' + id, showSuccessMessage: true }) }
export function fetchShareCodes(params?: any) { return request.get<any>({ url: '/api/v1/admin/share-codes', params }) }
export function fetchToggleShareCode(id: number, data: any) { return request.put({ url: '/api/v1/admin/share-codes/' + id + '/status', data, showSuccessMessage: true }) }
export function fetchTermWeeks(semesterId?: number) { return request.get<any>({ url: '/api/v1/admin/term-weeks', params: semesterId ? { semesterId } : {} }) }
export function fetchCreateTermWeek(data: any) { return request.post({ url: '/api/v1/admin/term-weeks', data, showSuccessMessage: true }) }
export function fetchUpdateTermWeek(id: number, data: any) { return request.put({ url: '/api/v1/admin/term-weeks/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteTermWeek(id: number) { return request.del({ url: '/api/v1/admin/term-weeks/' + id, showSuccessMessage: true }) }
