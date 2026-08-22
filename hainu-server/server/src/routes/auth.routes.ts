import Router from 'koa-router';
import * as ctrl from '../controllers/auth.controller';
const router = new Router({ prefix: '/api/v1/auth' });
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/admin/login', ctrl.adminLogin);
export default router;
