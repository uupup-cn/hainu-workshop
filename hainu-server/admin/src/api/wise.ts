import request from '@/utils/http'
export function fetchIntroEntries() { return request.get<any>({ url: '/api/v1/intro/entries' }) }
export function fetchAdminIntroEntries(params?: any) { return request.get<any>({ url: '/api/v1/admin/intro/entries', params }) }
export function fetchCreateIntro(data: any) { return request.post({ url: '/api/v1/admin/intro/entries', data, showSuccessMessage: true }) }
export function fetchUpdateIntro(id: number, data: any) { return request.put({ url: '/api/v1/admin/intro/entries/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteIntro(id: number) { return request.del({ url: '/api/v1/admin/intro/entries/' + id, showSuccessMessage: true }) }
export function fetchPhonebookCategories() { return request.get<any>({ url: '/api/v1/phonebook/categories' }) }
export function fetchAdminPhonebookCategories(params?: any) { return request.get<any>({ url: '/api/v1/admin/phonebook/categories', params }) }
export function fetchCreatePhonebookCategory(data: any) { return request.post({ url: '/api/v1/admin/phonebook/categories', data, showSuccessMessage: true }) }
export function fetchUpdatePhonebookCategory(id: number, data: any) { return request.put({ url: '/api/v1/admin/phonebook/categories/' + id, data, showSuccessMessage: true }) }
export function fetchDeletePhonebookCategory(id: number) { return request.del({ url: '/api/v1/admin/phonebook/categories/' + id, showSuccessMessage: true }) }
export function fetchAdminPhonebookEntries(params?: any) { return request.get<any>({ url: '/api/v1/admin/phonebook/entries', params }) }
export function fetchCreatePhoneEntry(data: any) { return request.post({ url: '/api/v1/admin/phonebook/entries', data, showSuccessMessage: true }) }
export function fetchUpdatePhoneEntry(id: number, data: any) { return request.put({ url: '/api/v1/admin/phonebook/entries/' + id, data, showSuccessMessage: true }) }
export function fetchDeletePhoneEntry(id: number) { return request.del({ url: '/api/v1/admin/phonebook/entries/' + id, showSuccessMessage: true }) }
export function fetchCalendar() { return request.get<any>({ url: '/api/v1/calendar' }) }
export function fetchUpdateCalendar(id: number, data: any) { return request.put({ url: '/api/v1/admin/calendar/' + id, data, showSuccessMessage: true }) }
export function fetchMaps() { return request.get<any>({ url: '/api/v1/maps' }) }
export function fetchUpdateMap(id: number, data: any) { return request.put({ url: '/api/v1/admin/maps/' + id, data, showSuccessMessage: true }) }
export function fetchMapMarkers(mapId: number) { return request.get<any>({ url: '/api/v1/admin/maps/' + mapId + '/markers' }) }
export function fetchCreateMapMarker(mapId: number, data: any) { return request.post({ url: '/api/v1/admin/maps/' + mapId + '/markers', data, showSuccessMessage: true }) }
export function fetchUpdateMapMarker(mapId: number, markerId: number, data: any) { return request.put({ url: '/api/v1/admin/maps/' + mapId + '/markers/' + markerId, data, showSuccessMessage: true }) }
export function fetchDeleteMapMarker(mapId: number, markerId: number) { return request.del({ url: '/api/v1/admin/maps/' + mapId + '/markers/' + markerId, showSuccessMessage: true }) }
export function fetchBusSchedules() { return request.get<any>({ url: '/api/v1/bus/schedules' }) }
export function fetchAdminBusSchedules() { return request.get<any>({ url: '/api/v1/admin/bus/schedules' }) }
export function fetchCreateBusSchedule(data: any) { return request.post({ url: '/api/v1/admin/bus/schedules', data, showSuccessMessage: true }) }
export function fetchUpdateBusSchedule(id: number, data: any) { return request.put({ url: '/api/v1/admin/bus/schedules/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteBusSchedule(id: number) { return request.del({ url: '/api/v1/admin/bus/schedules/' + id, showSuccessMessage: true }) }
export function fetchBusStations() { return request.get<any>({ url: '/api/v1/bus/stations' }) }
export function fetchAdminBusStations() { return request.get<any>({ url: '/api/v1/admin/bus/stations' }) }
export function fetchCreateBusStation(data: any) { return request.post({ url: '/api/v1/admin/bus/stations', data, showSuccessMessage: true }) }
export function fetchUpdateBusStation(id: number, data: any) { return request.put({ url: '/api/v1/admin/bus/stations/' + id, data, showSuccessMessage: true }) }
export function fetchDeleteBusStation(id: number) { return request.del({ url: '/api/v1/admin/bus/stations/' + id, showSuccessMessage: true }) }
export function fetchBusGuide() { return request.get<any>({ url: '/api/v1/bus/guide' }) }
export function fetchAdminBusGuide() { return request.get<any>({ url: '/api/v1/admin/bus/guide' }) }
export function fetchUpdateBusGuide(data: any) { return request.put({ url: '/api/v1/admin/bus/guide', data, showSuccessMessage: true }) }
