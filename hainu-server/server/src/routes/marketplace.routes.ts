import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/marketplace.controller';
const router = new Router({ prefix: '/api/v1/marketplace' });
router.get('/categories', ctrl.getCategories); // 分类列表公开，无需登录（api.md §5.1）
router.get('/items', authMiddleware, ctrl.getItems);
router.get('/items/:id', authMiddleware, ctrl.getItem);
router.post('/items', authMiddleware, ctrl.createItem);
router.put('/items/:id/off', authMiddleware, ctrl.offItem);
router.delete('/items/:id', authMiddleware, ctrl.deleteItem);
router.put('/items/:id/relist', authMiddleware, ctrl.relistItem);
router.get('/my-items', authMiddleware, ctrl.getMyItems);
router.post('/items/:id/report', authMiddleware, ctrl.reportItem);
export default router;
