import Router from 'koa-router';
import { authMiddleware, optionalAuthMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/content.controller';

const router = new Router({ prefix: '/api/v1' });

router.get('/intro/entries', optionalAuthMiddleware, ctrl.getIntroEntries);
router.get('/intro/entries/:key', optionalAuthMiddleware, ctrl.getIntroEntry);
router.get('/phonebook/categories', optionalAuthMiddleware, ctrl.getPhonebookCategories);
router.get('/phonebook/entries', optionalAuthMiddleware, ctrl.getPhonebookEntries);
router.get('/calendar', optionalAuthMiddleware, ctrl.getCalendar);
router.get('/maps', optionalAuthMiddleware, ctrl.getMaps);
router.get('/maps/:campus', optionalAuthMiddleware, ctrl.getMap);
router.get('/bus/schedules', optionalAuthMiddleware, ctrl.getBusSchedules);
router.get('/bus/stations', optionalAuthMiddleware, ctrl.getBusStations);
router.get('/bus/guide', optionalAuthMiddleware, ctrl.getBusGuide);

export default router;
