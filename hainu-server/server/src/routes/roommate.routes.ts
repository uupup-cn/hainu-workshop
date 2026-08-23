import Router from 'koa-router';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/roommate.controller';
const router = new Router({ prefix: '/api/v1/roommate' });
router.get('/status', authMiddleware, ctrl.getStatus);
router.get('/posts', authMiddleware, ctrl.getPosts);
// 静态段路由必须先于参数路由 :id 注册，否则 my/match 会被当作 id 吞掉
router.get('/posts/my', authMiddleware, ctrl.getMyPost);
router.post('/posts/match', authMiddleware, ctrl.matchPosts);
router.get('/posts/:id', authMiddleware, ctrl.getPost);
router.post('/posts', authMiddleware, ctrl.createPost);
router.put('/posts/:id', authMiddleware, ctrl.updatePost);
export default router;
