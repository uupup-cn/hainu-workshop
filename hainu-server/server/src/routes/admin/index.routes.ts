import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/index.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 用户管理
router.get('/users', adminAuthMiddleware, ctrl.getUserList);
router.get('/users/:id', adminAuthMiddleware, ctrl.getUserDetail);
router.put('/users/:id', adminAuthMiddleware, ctrl.updateUser);
router.delete('/users/:id', adminAuthMiddleware, ctrl.deleteUser);
// 认证审核
router.get('/auth-applications', adminAuthMiddleware, ctrl.getAuthApplications);
router.get('/auth-applications/:id', adminAuthMiddleware, ctrl.getAuthApplicationDetail);
router.put('/auth-applications/:id/review', adminAuthMiddleware, ctrl.reviewAuthApplication);
// 校区
router.get('/campuses', adminAuthMiddleware, ctrl.listCampuses);
router.post('/campuses', adminAuthMiddleware, ctrl.createCampus);
router.put('/campuses/:id', adminAuthMiddleware, ctrl.updateCampus);
router.delete('/campuses/:id', adminAuthMiddleware, ctrl.deleteCampus);
// 书院
router.get('/colleges', adminAuthMiddleware, ctrl.listColleges);
router.post('/colleges', adminAuthMiddleware, ctrl.createCollege);
router.put('/colleges/:id', adminAuthMiddleware, ctrl.updateCollege);
router.delete('/colleges/:id', adminAuthMiddleware, ctrl.deleteCollege);
// 学院
router.get('/departments', adminAuthMiddleware, ctrl.listDepartments);
router.post('/departments', adminAuthMiddleware, ctrl.createDepartment);
router.put('/departments/:id', adminAuthMiddleware, ctrl.updateDepartment);
router.delete('/departments/:id', adminAuthMiddleware, ctrl.deleteDepartment);
// 专业
router.get('/majors', adminAuthMiddleware, ctrl.listMajors);
router.post('/majors', adminAuthMiddleware, ctrl.createMajor);
router.put('/majors/:id', adminAuthMiddleware, ctrl.updateMajor);
router.delete('/majors/:id', adminAuthMiddleware, ctrl.deleteMajor);
// 楼栋
router.get('/buildings', adminAuthMiddleware, ctrl.listBuildings);
router.post('/buildings', adminAuthMiddleware, ctrl.createBuilding);
router.put('/buildings/:id', adminAuthMiddleware, ctrl.updateBuilding);
router.delete('/buildings/:id', adminAuthMiddleware, ctrl.deleteBuilding);
export default router;
