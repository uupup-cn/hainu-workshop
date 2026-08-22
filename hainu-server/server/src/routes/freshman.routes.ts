import Router from 'koa-router';
import { authMiddleware, optionalAuthMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/freshman.controller';

const router = new Router({ prefix: '/api/v1' });

router.get('/guide/entries', optionalAuthMiddleware, ctrl.getGuideEntries);
router.get('/guide/entries/:key', optionalAuthMiddleware, ctrl.getGuideEntry);
router.get('/life/campuses', optionalAuthMiddleware, ctrl.getLifeCampuses);
router.get('/life/topics', optionalAuthMiddleware, ctrl.getLifeTopics);
router.get('/life/topics/:key', optionalAuthMiddleware, ctrl.getLifeTopic);
router.get('/faq/categories', optionalAuthMiddleware, ctrl.getFaqCategories);
router.get('/faq/questions', optionalAuthMiddleware, ctrl.getFaqQuestions);
router.get('/faq/questions/:id', optionalAuthMiddleware, ctrl.getFaqQuestion);

export default router;
