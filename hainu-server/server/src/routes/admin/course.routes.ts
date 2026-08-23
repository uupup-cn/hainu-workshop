// 课表管理路由：课程库 / 课程颜色 / 学期 / 学期周制 / 节次 / 分享码
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/course.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 课程库
router.get('/courses', adminAuthMiddleware, ctrl.listCourses);
router.delete('/courses/:id', adminAuthMiddleware, ctrl.deleteCourse);
// 课程颜色
router.get('/course-colors', adminAuthMiddleware, ctrl.listCourseColors);
router.post('/course-colors', adminAuthMiddleware, ctrl.createCourseColor);
router.put('/course-colors/:id', adminAuthMiddleware, ctrl.updateCourseColor);
router.delete('/course-colors/:id', adminAuthMiddleware, ctrl.deleteCourseColor);
// 学期
router.get('/semesters', adminAuthMiddleware, ctrl.listSemesters);
router.post('/semesters', adminAuthMiddleware, ctrl.createSemester);
router.put('/semesters/:id', adminAuthMiddleware, ctrl.updateSemester);
router.delete('/semesters/:id', adminAuthMiddleware, ctrl.deleteSemester);
// 学期周制
router.get('/term-weeks', adminAuthMiddleware, ctrl.listTermWeeks);
router.post('/term-weeks', adminAuthMiddleware, ctrl.createTermWeek);
router.put('/term-weeks/:id', adminAuthMiddleware, ctrl.updateTermWeek);
router.delete('/term-weeks/:id', adminAuthMiddleware, ctrl.deleteTermWeek);
// 节次
router.get('/sections', adminAuthMiddleware, ctrl.listSections);
router.post('/sections', adminAuthMiddleware, ctrl.createSection);
router.put('/sections/:id', adminAuthMiddleware, ctrl.updateSection);
router.delete('/sections/:id', adminAuthMiddleware, ctrl.deleteSection);
// 分享码
router.get('/share-codes', adminAuthMiddleware, ctrl.listShareCodes);
router.put('/share-codes/:id/status', adminAuthMiddleware, ctrl.updateShareCodeStatus);
export default router;
