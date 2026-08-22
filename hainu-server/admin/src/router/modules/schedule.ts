import { AppRouteRecord } from '@/types/router'
export const scheduleRoutes: AppRouteRecord = {
  path: '/schedule', name: 'ScheduleModule', component: '/index/index',
  meta: { title: '课表模块', icon: 'ri:calendar-todo-line' },
  children: [
    { path: 'course', name: 'ScheduleCourse', component: '/schedule/course/index', meta: { title: '课程库', icon: 'ri:book-2-line', keepAlive: true } },
    { path: 'color', name: 'ScheduleColor', component: '/schedule/color/index', meta: { title: '课程颜色', icon: 'ri:palette-line', keepAlive: true } },
    { path: 'semester', name: 'ScheduleSemester', component: '/schedule/semester/index', meta: { title: '学期管理', icon: 'ri:calendar-line', keepAlive: true } },
    { path: 'section', name: 'ScheduleSection', component: '/schedule/section/index', meta: { title: '节次管理', icon: 'ri:time-line', keepAlive: true } },
    { path: 'share-code', name: 'ScheduleShareCode', component: '/schedule/share-code/index', meta: { title: '分享码管理', icon: 'ri:share-line', keepAlive: true } }
  ]
}
