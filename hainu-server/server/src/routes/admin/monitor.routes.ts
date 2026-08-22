// 系统监控路由：在线用户 / 缓存 / 服务器信息 / 系统日志 / 登录日志 / 操作日志 / 用户反馈
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/monitor.controller';
const router = new Router({ prefix: '/api/v1/admin' });
router.get('/online-users', adminAuthMiddleware, ctrl.getOnlineUsers);
router.get('/cache', adminAuthMiddleware, ctrl.getCacheInfo);
router.delete('/cache', adminAuthMiddleware, ctrl.clearCache);
router.get('/server-info', adminAuthMiddleware, ctrl.getServerInfo);
router.get('/system-logs', adminAuthMiddleware, ctrl.getSystemLogs);
router.get('/login-logs', adminAuthMiddleware, ctrl.getLoginLogs);
router.get('/operation-logs', adminAuthMiddleware, ctrl.getOperationLogs);
router.get('/feedback', adminAuthMiddleware, ctrl.getFeedbacks);
router.put('/feedback/:id', adminAuthMiddleware, ctrl.handleFeedback);
export default router;
