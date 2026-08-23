// 内容管理 + 找室友管理 路由（入学指南/生活攻略/FAQ/海大介绍/电话簿/校历/地图/出行/找室友）
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/content.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 入学指南
router.get('/guide/entries', adminAuthMiddleware, ctrl.listGuideEntries);
router.get('/guide/entries/:id', adminAuthMiddleware, ctrl.getGuideEntry);
router.post('/guide/entries', adminAuthMiddleware, ctrl.createGuideEntry);
router.put('/guide/entries/:id', adminAuthMiddleware, ctrl.updateGuideEntry);
router.delete('/guide/entries/:id', adminAuthMiddleware, ctrl.deleteGuideEntry);
// 生活攻略
router.get('/life/topics', adminAuthMiddleware, ctrl.listLifeTopics);
router.get('/life/topics/:id', adminAuthMiddleware, ctrl.getLifeTopic);
router.post('/life/topics', adminAuthMiddleware, ctrl.createLifeTopic);
router.put('/life/topics/:id', adminAuthMiddleware, ctrl.updateLifeTopic);
router.delete('/life/topics/:id', adminAuthMiddleware, ctrl.deleteLifeTopic);
// 新生FAQ 分类
router.get('/faq/categories', adminAuthMiddleware, ctrl.listFaqCategories);
router.get('/faq/categories/:id', adminAuthMiddleware, ctrl.getFaqCategory);
router.post('/faq/categories', adminAuthMiddleware, ctrl.createFaqCategory);
router.put('/faq/categories/:id', adminAuthMiddleware, ctrl.updateFaqCategory);
router.delete('/faq/categories/:id', adminAuthMiddleware, ctrl.deleteFaqCategory);
// 新生FAQ 问题
router.get('/faq/questions', adminAuthMiddleware, ctrl.listFaqQuestions);
router.get('/faq/questions/:id', adminAuthMiddleware, ctrl.getFaqQuestion);
router.post('/faq/questions', adminAuthMiddleware, ctrl.createFaqQuestion);
router.put('/faq/questions/:id', adminAuthMiddleware, ctrl.updateFaqQuestion);
router.delete('/faq/questions/:id', adminAuthMiddleware, ctrl.deleteFaqQuestion);
// 海大介绍
router.get('/intro/entries', adminAuthMiddleware, ctrl.listIntroEntries);
router.get('/intro/entries/:id', adminAuthMiddleware, ctrl.getIntroEntry);
router.post('/intro/entries', adminAuthMiddleware, ctrl.createIntroEntry);
router.put('/intro/entries/:id', adminAuthMiddleware, ctrl.updateIntroEntry);
router.delete('/intro/entries/:id', adminAuthMiddleware, ctrl.deleteIntroEntry);
// 电话簿分类
router.get('/phonebook/categories', adminAuthMiddleware, ctrl.listPhonebookCategories);
router.get('/phonebook/categories/:id', adminAuthMiddleware, ctrl.getPhonebookCategory);
router.post('/phonebook/categories', adminAuthMiddleware, ctrl.createPhonebookCategory);
router.put('/phonebook/categories/:id', adminAuthMiddleware, ctrl.updatePhonebookCategory);
router.delete('/phonebook/categories/:id', adminAuthMiddleware, ctrl.deletePhonebookCategory);
// 电话簿条目
router.get('/phonebook/entries', adminAuthMiddleware, ctrl.listPhonebookEntries);
router.get('/phonebook/entries/:id', adminAuthMiddleware, ctrl.getPhonebookEntry);
router.post('/phonebook/entries', adminAuthMiddleware, ctrl.createPhonebookEntry);
router.put('/phonebook/entries/:id', adminAuthMiddleware, ctrl.updatePhonebookEntry);
router.delete('/phonebook/entries/:id', adminAuthMiddleware, ctrl.deletePhonebookEntry);
// 校历（单例设置：列表 + 按 id 编辑）
router.get('/calendar', adminAuthMiddleware, ctrl.listCalendar);
router.put('/calendar/:id', adminAuthMiddleware, ctrl.updateCalendar);
// 校园地图（设置 + 地图标记）
router.get('/maps', adminAuthMiddleware, ctrl.listMaps);
router.put('/maps/:id', adminAuthMiddleware, ctrl.updateMap);
router.get('/maps/:id/markers', adminAuthMiddleware, ctrl.listMapMarkers);
router.post('/maps/:id/markers', adminAuthMiddleware, ctrl.createMapMarker);
router.put('/maps/:id/markers/:markerId', adminAuthMiddleware, ctrl.updateMapMarker);
router.delete('/maps/:id/markers/:markerId', adminAuthMiddleware, ctrl.deleteMapMarker);
// 校园出行（班车时刻）
router.get('/bus/schedules', adminAuthMiddleware, ctrl.listBusSchedules);
router.get('/bus/schedules/:id', adminAuthMiddleware, ctrl.getBusSchedule);
router.post('/bus/schedules', adminAuthMiddleware, ctrl.createBusSchedule);
router.put('/bus/schedules/:id', adminAuthMiddleware, ctrl.updateBusSchedule);
router.delete('/bus/schedules/:id', adminAuthMiddleware, ctrl.deleteBusSchedule);
// 校园出行（车站）
// 乘车指南（单例）
router.get('/bus/guide', adminAuthMiddleware, ctrl.getBusGuide);
router.put('/bus/guide', adminAuthMiddleware, ctrl.updateBusGuide);
router.get('/bus/stations', adminAuthMiddleware, ctrl.listBusStations);
router.get('/bus/stations/:id', adminAuthMiddleware, ctrl.getBusStation);
router.post('/bus/stations', adminAuthMiddleware, ctrl.createBusStation);
router.put('/bus/stations/:id', adminAuthMiddleware, ctrl.updateBusStation);
router.delete('/bus/stations/:id', adminAuthMiddleware, ctrl.deleteBusStation);
// 找室友管理
router.get('/roommate/settings', adminAuthMiddleware, ctrl.getRoommateSettings);
router.put('/roommate/settings', adminAuthMiddleware, ctrl.updateRoommateSettings);
router.get('/roommate/posts', adminAuthMiddleware, ctrl.listRoommatePosts);
router.get('/roommate/posts/:id', adminAuthMiddleware, ctrl.getRoommatePost);
router.delete('/roommate/posts/:id', adminAuthMiddleware, ctrl.deleteRoommatePost);
export default router;
