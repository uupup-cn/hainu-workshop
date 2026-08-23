import { AppRouteRecord } from '@/types/router'
export const wiseRoutes: AppRouteRecord = {
  path: '/wise', name: 'Wise', component: '/index/index',
  meta: { title: '智慧海大', icon: 'ri:building-line' },
  children: [
    { path: 'intro', name: 'WiseIntro', component: '/wise/intro/index', meta: { title: '海大介绍', icon: 'ri:information-line', keepAlive: true } },
    { path: 'phonebook/category', name: 'WisePhonebookCategory', component: '/wise/phonebook-category/index', meta: { title: '分类管理', icon: 'ri:folder-line', keepAlive: true } },
    { path: 'phonebook/entry', name: 'WisePhonebookEntry', component: '/wise/phonebook-entry/index', meta: { title: '条目管理', icon: 'ri:contacts-line', keepAlive: true } },
    { path: 'calendar', name: 'WiseCalendar', component: '/wise/calendar/index', meta: { title: '校历', icon: 'ri:calendar-line', keepAlive: true } },
    { path: 'map', name: 'WiseMap', component: '/wise/map/index', meta: { title: '校园地图', icon: 'ri:map-2-line', keepAlive: true } },
    { path: 'bus-schedule', name: 'WiseBusSchedule', component: '/wise/bus-schedule/index', meta: { title: '班车时刻', icon: 'ri:bus-2-line', keepAlive: true } },
    { path: 'bus-station', name: 'WiseBusStation', component: '/wise/bus-station/index', meta: { title: '车站管理', icon: 'ri:bus-line', keepAlive: true } },
    { path: 'bus-guide', name: 'WiseBusGuide', component: '/wise/bus-guide/index', meta: { title: '乘车指南', icon: 'ri:route-line', keepAlive: true } },
    { path: 'campus-database/campus', name: 'CampusDB', component: '/wise/campus-database/campus/index', meta: { title: '校区管理', icon: 'ri:community-line', keepAlive: true } },
    { path: 'campus-database/department', name: 'CampusDept', component: '/wise/campus-database/department/index', meta: { title: '学院管理', icon: 'ri:school-line', keepAlive: true } },
    { path: 'campus-database/major', name: 'CampusMajor', component: '/wise/campus-database/major/index', meta: { title: '专业管理', icon: 'ri:book-line', keepAlive: true } },
    { path: 'campus-database/college', name: 'CampusCollege', component: '/wise/campus-database/college/index', meta: { title: '书院管理', icon: 'ri:home-line', keepAlive: true } },
    { path: 'campus-database/building', name: 'CampusBuilding', component: '/wise/campus-database/building/index', meta: { title: '楼栋管理', icon: 'ri:building-2-line', keepAlive: true } }
  ]
}
