import Router from 'koa-router';
import * as ctrl from '../controllers/community.controller';

// 社区模块启停（用户端只读）
const router = new Router({ prefix: '/api/v1/community' });
router.get('/modules', ctrl.getModules);
export default router;
