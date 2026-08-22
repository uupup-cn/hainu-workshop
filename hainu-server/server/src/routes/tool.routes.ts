import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/tool.controller';
const router = new Router({ prefix: '/api/v1/tools' });
router.get('/categories', ctrl.getCategories); // 分类列表公开，无需登录（api.md §6.1）
router.get('/', authMiddleware, ctrl.getTools);
router.post('/video-parse', authMiddleware, ctrl.videoParse); // 必须注册在 /:key 之前，避免被参数路由吞掉
router.get('/:key', authMiddleware, ctrl.getTool);
router.post('/:key/use', authMiddleware, ctrl.useTool);
router.post('/:key/share', authMiddleware, ctrl.shareTool);
router.get('/video-parse/lines', authMiddleware, ctrl.getVideoParseLines);
export default router;
