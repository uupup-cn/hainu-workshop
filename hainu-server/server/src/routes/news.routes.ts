import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/news.controller';
const router = new Router({ prefix: '/api/v1/news' });
router.get('/', authMiddleware, ctrl.getNews);
router.get('/:id', authMiddleware, ctrl.getNewsDetail);
export default router;
