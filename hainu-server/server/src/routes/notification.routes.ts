import Router from 'koa-router';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/notification.controller';
const router = new Router();
router.get('/api/v1/notifications', authMiddleware, ctrl.getNotifications);
// 静态段路由必须先于参数路由 :id 注册，否则会被当作 id 吞掉
router.get('/api/v1/notifications/unread-count', authMiddleware, ctrl.getUnreadCount);
router.get('/api/v1/notifications/:id', authMiddleware, ctrl.getNotificationDetail);
router.put('/api/v1/notifications/:id/read', authMiddleware, ctrl.markAsRead);
router.post('/api/v1/user/feedback', authMiddleware, ctrl.submitFeedback);
router.get('/api/v1/user/feedback', authMiddleware, ctrl.getMyFeedback);
router.get('/api/v1/system/settings', optionalAuthMiddleware, ctrl.getSettings);
export default router;
