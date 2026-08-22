// 模板路径集成路由：管理后台（Art Design Pro / Ci-Yuu 模板）原生页面调用的模板约定路径
// 前缀为空、路径完整写死；静态段路由必须注册在参数路由之前（manage/sort/force-logout/profile/me/overview/meta/export/clear）
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/integration.controller';

const router = new Router({ prefix: '' });

// ===== 引导链路（登录后必须；captcha/logout 为公开接口）=====
router.get('/api/v1/auth/captcha', ctrl.getCaptcha);
router.post('/api/v1/auth/logout', ctrl.logout);
router.get('/api/v1/user/info', adminAuthMiddleware, ctrl.getUserInfo);
router.get('/api/v3/system/menus', adminAuthMiddleware, ctrl.getMenus);

// ===== 功能管理（菜单管理页，注意更新为 PATCH）=====
router.get('/api/v3/system/menus/manage', adminAuthMiddleware, ctrl.getMenusManage);
router.post('/api/v3/system/menus', adminAuthMiddleware, ctrl.createMenu);
router.patch('/api/v3/system/menus/sort', adminAuthMiddleware, ctrl.updateMenuSort);
router.patch('/api/v3/system/menus/:id', adminAuthMiddleware, ctrl.updateMenu);
router.delete('/api/v3/system/menus/:id', adminAuthMiddleware, ctrl.deleteMenu);
router.post('/api/v3/system/menus/auths', adminAuthMiddleware, ctrl.createMenuAuth);
router.patch('/api/v3/system/menus/:parentId/auths/:authMark', adminAuthMiddleware, ctrl.updateMenuAuth);
router.delete('/api/v3/system/menus/:parentId/auths/:authMark', adminAuthMiddleware, ctrl.deleteMenuAuth);

// ===== 后台用户管理 =====
router.get('/api/v1/user/profile/me', adminAuthMiddleware, ctrl.getProfile);
router.patch('/api/v1/user/profile/me', adminAuthMiddleware, ctrl.updateProfile);
router.get('/api/v1/user', adminAuthMiddleware, ctrl.getUserList);
router.post('/api/v1/user', adminAuthMiddleware, ctrl.addUser);
router.put('/api/v1/user/:id', adminAuthMiddleware, ctrl.editUser);
router.patch('/api/v1/user/:id', adminAuthMiddleware, ctrl.editUser);
router.delete('/api/v1/user/:id', adminAuthMiddleware, ctrl.deleteUser);

// ===== 角色管理 =====
router.get('/api/v1/roles', adminAuthMiddleware, ctrl.getRoles);
router.post('/api/v1/roles', adminAuthMiddleware, ctrl.addRole);
router.put('/api/v1/roles/:id', adminAuthMiddleware, ctrl.editRole);
router.patch('/api/v1/roles/:id', adminAuthMiddleware, ctrl.editRole);
router.delete('/api/v1/roles/:id', adminAuthMiddleware, ctrl.deleteRole);
router.get('/api/v1/roles/:id/permissions', adminAuthMiddleware, ctrl.getRolePermissions);
router.put('/api/v1/roles/:id/permissions', adminAuthMiddleware, ctrl.setRolePermissions);
router.patch('/api/v1/roles/:id/permissions', adminAuthMiddleware, ctrl.setRolePermissions);
router.get('/api/v1/api-permissions/catalog', adminAuthMiddleware, ctrl.getApiPermissionCatalog);
router.get('/api/v1/roles/data-permissions/meta', adminAuthMiddleware, ctrl.getDataPermissionMeta);

// ===== 字典管理 =====
router.get('/api/v1/dicts/types', adminAuthMiddleware, ctrl.getDictTypes);
router.post('/api/v1/dicts/types', adminAuthMiddleware, ctrl.addDictType);
router.put('/api/v1/dicts/types/:id', adminAuthMiddleware, ctrl.editDictType);
router.patch('/api/v1/dicts/types/:id', adminAuthMiddleware, ctrl.editDictType);
router.delete('/api/v1/dicts/types/:id', adminAuthMiddleware, ctrl.deleteDictType);
router.get('/api/v1/dicts/data', adminAuthMiddleware, ctrl.getDictData);
router.post('/api/v1/dicts/data', adminAuthMiddleware, ctrl.addDictData);
router.put('/api/v1/dicts/data/:id', adminAuthMiddleware, ctrl.editDictData);
router.patch('/api/v1/dicts/data/:id', adminAuthMiddleware, ctrl.editDictData);
router.delete('/api/v1/dicts/data/:id', adminAuthMiddleware, ctrl.deleteDictData);

// ===== 站点设置（public 为公开接口）=====
router.get('/api/v1/site-settings/public', ctrl.getPublicSiteSettings);
router.get('/api/v1/site-settings/admin', adminAuthMiddleware, ctrl.getAdminSiteSettings);
router.put('/api/v1/site-settings/admin', adminAuthMiddleware, ctrl.updateAdminSiteSettings);
router.patch('/api/v1/site-settings/admin', adminAuthMiddleware, ctrl.updateAdminSiteSettings);

// ===== 文件中心 =====
router.get('/api/v1/files', adminAuthMiddleware, ctrl.getFileList);
router.post('/api/v1/files/upload-tickets', adminAuthMiddleware, ctrl.createUploadTicket);
router.post('/api/v1/files/upload-proxy', adminAuthMiddleware, ctrl.uploadProxy);
router.post('/api/v1/files/:id/complete', adminAuthMiddleware, ctrl.completeUpload);
router.post('/api/v1/files/:id/public-link', adminAuthMiddleware, ctrl.getPublicLink);
router.delete('/api/v1/files/:id', adminAuthMiddleware, ctrl.deleteFile);

// ===== 监控 =====
router.get('/api/v1/monitor/overview', adminAuthMiddleware, ctrl.getMonitorOverview);
router.post('/api/v1/monitor/online-users/force-logout', adminAuthMiddleware, ctrl.forceLogout);
router.delete('/api/v1/monitor/online-users/:sessionId', adminAuthMiddleware, ctrl.deleteOnlineSession);
router.get('/api/v1/monitor/online-users', adminAuthMiddleware, ctrl.getOnlineUsers);
router.get('/api/v1/monitor/cache', adminAuthMiddleware, ctrl.getCacheMonitor);
router.get('/api/v1/monitor/visitor-analytics', adminAuthMiddleware, ctrl.getVisitorAnalytics);

// ===== 日志 =====
router.get('/api/v1/logs/operation/export', adminAuthMiddleware, ctrl.exportOperationLogs);
router.delete('/api/v1/logs/operation/clear', adminAuthMiddleware, ctrl.clearOperationLogs);
router.get('/api/v1/logs/operation', adminAuthMiddleware, ctrl.getOperationLogs);
router.get('/api/v1/logs/login', adminAuthMiddleware, ctrl.getLoginLogs);

// ===== 用户反馈 =====
router.get('/api/v1/feedback/overview', adminAuthMiddleware, ctrl.getFeedbackOverview);
router.get('/api/v1/feedback', adminAuthMiddleware, ctrl.getFeedbackList);
router.post('/api/v1/feedback', adminAuthMiddleware, ctrl.createFeedback);
router.put('/api/v1/feedback/:id', adminAuthMiddleware, ctrl.handleFeedback);
router.patch('/api/v1/feedback/:id', adminAuthMiddleware, ctrl.handleFeedback);
router.put('/api/v1/feedback/:id/status', adminAuthMiddleware, ctrl.handleFeedbackStatus);
router.patch('/api/v1/feedback/:id/status', adminAuthMiddleware, ctrl.handleFeedbackStatus);

// ===== 通知管理 =====
router.get('/api/v1/notifications/admin/:id', adminAuthMiddleware, ctrl.getNotificationDetail);
router.post('/api/v1/notifications/admin/:id/publish', adminAuthMiddleware, ctrl.publishNotification);
router.post('/api/v1/notifications/admin/:id/revoke', adminAuthMiddleware, ctrl.revokeNotification);
router.put('/api/v1/notifications/admin/:id', adminAuthMiddleware, ctrl.updateNotification);
router.patch('/api/v1/notifications/admin/:id', adminAuthMiddleware, ctrl.updateNotification);
router.delete('/api/v1/notifications/admin/:id', adminAuthMiddleware, ctrl.deleteNotification);
router.get('/api/v1/notifications/admin', adminAuthMiddleware, ctrl.getNotificationList);
router.post('/api/v1/notifications/admin', adminAuthMiddleware, ctrl.createNotification);

export default router;
