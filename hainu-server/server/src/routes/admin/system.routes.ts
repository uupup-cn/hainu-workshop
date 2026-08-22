// 系统管理路由：角色权限 / 菜单 / 字典 / 通知 / 系统设置 / 文件中心
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/system.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 角色
router.get('/roles', adminAuthMiddleware, ctrl.listRoles);
router.post('/roles', adminAuthMiddleware, ctrl.createRole);
router.put('/roles/:id', adminAuthMiddleware, ctrl.updateRole);
router.delete('/roles/:id', adminAuthMiddleware, ctrl.deleteRole);
// 权限
router.get('/permissions', adminAuthMiddleware, ctrl.listPermissions);
router.post('/permissions', adminAuthMiddleware, ctrl.createPermission);
router.put('/permissions/:id', adminAuthMiddleware, ctrl.updatePermission);
router.delete('/permissions/:id', adminAuthMiddleware, ctrl.deletePermission);
// 角色权限分配
router.get('/roles/:id/permissions', adminAuthMiddleware, ctrl.getRolePermissions);
router.put('/roles/:id/permissions', adminAuthMiddleware, ctrl.setRolePermissions);
// 角色用户
router.get('/roles/:id/users', adminAuthMiddleware, ctrl.getRoleUsers);
router.post('/roles/:id/users', adminAuthMiddleware, ctrl.addRoleUser);
router.delete('/roles/:id/users/:userId', adminAuthMiddleware, ctrl.removeRoleUser);
// 菜单（sort 需注册在 :id 之前）
router.get('/menus', adminAuthMiddleware, ctrl.getMenuTree);
router.post('/menus', adminAuthMiddleware, ctrl.createMenu);
router.put('/menus/sort', adminAuthMiddleware, ctrl.updateMenuSort);
router.put('/menus/:id', adminAuthMiddleware, ctrl.updateMenu);
router.delete('/menus/:id', adminAuthMiddleware, ctrl.deleteMenu);
// 字典类型
router.get('/dict-types', adminAuthMiddleware, ctrl.listDictTypes);
router.post('/dict-types', adminAuthMiddleware, ctrl.createDictType);
router.put('/dict-types/:id', adminAuthMiddleware, ctrl.updateDictType);
router.delete('/dict-types/:id', adminAuthMiddleware, ctrl.deleteDictType);
// 字典项（by-type 需注册在 :id 之前）
router.get('/dicts', adminAuthMiddleware, ctrl.listDicts);
router.post('/dicts', adminAuthMiddleware, ctrl.createDict);
router.get('/dicts/by-type/:type', adminAuthMiddleware, ctrl.getDictsByType);
router.put('/dicts/:id', adminAuthMiddleware, ctrl.updateDict);
router.delete('/dicts/:id', adminAuthMiddleware, ctrl.deleteDict);
// 通知类型
router.get('/notification-types', adminAuthMiddleware, ctrl.listNotificationTypes);
router.post('/notification-types', adminAuthMiddleware, ctrl.createNotificationType);
router.put('/notification-types/:id', adminAuthMiddleware, ctrl.updateNotificationType);
router.delete('/notification-types/:id', adminAuthMiddleware, ctrl.deleteNotificationType);
// 通知（push 需注册在 :id 之前）
router.get('/notifications', adminAuthMiddleware, ctrl.listNotifications);
router.post('/notifications', adminAuthMiddleware, ctrl.createNotification);
router.post('/notifications/push', adminAuthMiddleware, ctrl.pushNotification);
router.put('/notifications/:id', adminAuthMiddleware, ctrl.updateNotification);
router.delete('/notifications/:id', adminAuthMiddleware, ctrl.deleteNotification);
// 系统设置
router.get('/system/settings', adminAuthMiddleware, ctrl.getSystemSettings);
router.put('/system/settings', adminAuthMiddleware, ctrl.updateSystemSettings);
router.get('/settings/all', adminAuthMiddleware, ctrl.getAllSettings);
router.get('/settings/group/:group', adminAuthMiddleware, ctrl.getSettingsGroup);
router.put('/settings/group/:group', adminAuthMiddleware, ctrl.updateSettingsGroup);
// 文件中心（upload/stats 需注册在 :id 之前）
router.get('/files', adminAuthMiddleware, ctrl.listFiles);
router.post('/files/upload', adminAuthMiddleware, ctrl.uploadFile);
router.get('/files/stats', adminAuthMiddleware, ctrl.getFileStats);
router.get('/files/:id/download', adminAuthMiddleware, ctrl.downloadFile);
router.delete('/files/:id', adminAuthMiddleware, ctrl.deleteFile);
export default router;
