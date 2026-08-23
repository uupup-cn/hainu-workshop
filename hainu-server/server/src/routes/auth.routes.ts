import Router from 'koa-router';
import * as ctrl from '../controllers/auth.controller';
import { rateLimitLogin } from '../middlewares/rate-limit.middleware';
const router = new Router({ prefix: '/api/v1/auth' });
router.post('/register', ctrl.register);
router.post('/login', rateLimitLogin, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/admin/login', rateLimitLogin, ctrl.adminLogin);
export default router;
