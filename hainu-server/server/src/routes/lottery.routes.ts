import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/lottery.controller';
const router = new Router({ prefix: '/api/v1/lottery' });
router.get('/activities', authMiddleware, ctrl.getActivities);
router.get('/activities/:id', authMiddleware, ctrl.getActivity);
router.post('/activities/:id/draw', authMiddleware, ctrl.draw);
router.get('/my-records', authMiddleware, ctrl.getMyRecords);
export default router;
