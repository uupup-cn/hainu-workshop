// 模板路径集成控制器：引导链路 / 功能管理 / 后台用户 / 角色 / 字典 / 站点设置 / 文件中心 / 监控 / 日志 / 反馈 / 通知
import { Context } from 'koa';
import { success } from '../../utils/response';
import { ApiError } from '../../utils/api-error';
import * as svc from '../../services/admin/integration.service';
import { readRawBody } from '../../services/admin/upload.service';

// ===== 引导链路 =====
export async function getCaptcha(ctx: Context) { ctx.body = success(svc.getCaptcha()); }
export async function logout(ctx: Context) { ctx.body = success(null, '退出成功'); }
export async function getUserInfo(ctx: Context) { ctx.body = success(await svc.getUserInfo((ctx.state.admin as any).userId)); }
// 注册页占位（项目不开放后台注册，仅回执成功）
export async function signup(ctx: Context) { ctx.body = success(null, '注册成功'); }

// ===== 功能管理（菜单）=====
export async function getMenus(ctx: Context) { ctx.body = success(await svc.getMenuTree(false)); }
export async function getMenusManage(ctx: Context) { ctx.body = success(await svc.getMenuTree(true)); }
export async function createMenu(ctx: Context) { ctx.body = success(await svc.createMenu(ctx.request.body), '菜单新增成功'); }
export async function updateMenu(ctx: Context) { ctx.body = success(await svc.updateMenu(Number(ctx.params.id), ctx.request.body), '菜单更新成功'); }
export async function updateMenuSort(ctx: Context) { ctx.body = success(await svc.updateMenuSort((ctx.request.body as any) || []), '排序已保存'); }
export async function deleteMenu(ctx: Context) { ctx.body = success(await svc.deleteMenuCascade(Number(ctx.params.id)), '菜单删除成功'); }
export async function createMenuAuth(ctx: Context) { ctx.body = success(await svc.createMenuAuth(ctx.request.body), '权限新增成功'); }
export async function updateMenuAuth(ctx: Context) { ctx.body = success(await svc.updateMenuAuth(Number(ctx.params.parentId), String(ctx.params.authMark), ctx.request.body), '权限更新成功'); }
export async function deleteMenuAuth(ctx: Context) { ctx.body = success(await svc.deleteMenuAuth(Number(ctx.params.parentId), String(ctx.params.authMark)), '权限删除成功'); }

// ===== 后台用户管理 =====
export async function getUserList(ctx: Context) { ctx.body = success(await svc.listAdminUsers(ctx.query)); }
export async function addUser(ctx: Context) { ctx.body = success(await svc.createAdminUser(ctx.request.body), '新增成功'); }
export async function editUser(ctx: Context) { ctx.body = success(await svc.updateAdminUser(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteUser(ctx: Context) { ctx.body = success(await svc.deleteAdminUser(Number(ctx.params.id)), '删除成功'); }
export async function getProfile(ctx: Context) { ctx.body = success(await svc.getMyProfile((ctx.state.admin as any).userId)); }
export async function updateProfile(ctx: Context) { ctx.body = success(await svc.updateMyProfile((ctx.state.admin as any).userId, ctx.request.body), '个人资料已更新'); }
export async function changePassword(ctx: Context) { ctx.body = success(await svc.changeMyPassword((ctx.state.admin as any).userId, ctx.request.body), '密码修改成功'); }

// ===== 当前管理员在线会话（无会话存储：空列表 / 回执成功）=====
export async function getMySessions(ctx: Context) { ctx.body = success(await svc.getMySessions(ctx.query)); }
export async function revokeMySession(ctx: Context) { ctx.body = success(await svc.revokeMySession(String(ctx.params.sessionId)), '已注销会话'); }
export async function revokeOtherSessions(ctx: Context) { ctx.body = success(await svc.revokeOtherSessions()); }

// ===== 角色管理 =====
export async function getRoles(ctx: Context) { ctx.body = success(await svc.listRoles(ctx.query)); }
export async function addRole(ctx: Context) { ctx.body = success(await svc.createRole(ctx.request.body), '新增成功'); }
export async function editRole(ctx: Context) { ctx.body = success(await svc.updateRole(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteRole(ctx: Context) { ctx.body = success(await svc.deleteRole(Number(ctx.params.id)), '删除成功'); }
export async function getRolePermissions(ctx: Context) { ctx.body = success(await svc.getRolePermissions(Number(ctx.params.id))); }
export async function setRolePermissions(ctx: Context) { ctx.body = success(await svc.setRolePermissions(Number(ctx.params.id), ctx.request.body), '权限已更新'); }
export async function getRoleDataPermissions(ctx: Context) { ctx.body = success(await svc.getRoleDataPermissions(Number(ctx.params.id))); }
export async function setRoleDataPermissions(ctx: Context) { ctx.body = success(await svc.setRoleDataPermissions(Number(ctx.params.id), ctx.request.body), '数据权限已更新'); }
export async function getApiPermissionCatalog(ctx: Context) { ctx.body = success(await svc.getApiPermissionCatalog()); }
export async function getDataPermissionMeta(ctx: Context) { ctx.body = success(svc.getDataPermissionMeta()); }

// ===== 字典管理 =====
export async function getDictTypes(ctx: Context) { ctx.body = success(await svc.listDictTypes(ctx.query)); }
export async function addDictType(ctx: Context) { ctx.body = success(await svc.createDictType(ctx.request.body), '新增成功'); }
export async function editDictType(ctx: Context) { ctx.body = success(await svc.updateDictType(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteDictType(ctx: Context) { ctx.body = success(await svc.deleteDictType(Number(ctx.params.id)), '删除成功'); }
export async function getDictData(ctx: Context) { ctx.body = success(await svc.listDictData(ctx.query)); }
export async function addDictData(ctx: Context) { ctx.body = success(await svc.createDictData(ctx.request.body), '新增成功'); }
export async function editDictData(ctx: Context) { ctx.body = success(await svc.updateDictData(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteDictData(ctx: Context) { ctx.body = success(await svc.deleteDictData(Number(ctx.params.id)), '删除成功'); }

// ===== 站点设置 =====
export async function getPublicSiteSettings(ctx: Context) { ctx.body = success(await svc.getPublicSiteSettings()); }
export async function getAdminSiteSettings(ctx: Context) { ctx.body = success(await svc.getAdminSiteSettings()); }
export async function updateAdminSiteSettings(ctx: Context) { ctx.body = success(await svc.updateAdminSiteSettings(ctx.request.body), '站点配置已保存'); }

// ===== 文件中心 =====
export async function getFileList(ctx: Context) { ctx.body = success(await svc.listFiles(ctx.query)); }
export async function createUploadTicket(ctx: Context) { ctx.body = success(svc.createUploadTicket()); }
// 代理上传：二进制 body + ?filename=，或 JSON { filename, base64 }
export async function uploadProxy(ctx: Context) {
  const contentType = String(ctx.headers['content-type'] || '');
  let buf: Buffer; let filename = String(ctx.query.filename || '');
  if (/^(image\/(png|jpe?g|gif|webp)|application\/octet-stream)/i.test(contentType)) {
    buf = await readRawBody(ctx.req);
  } else {
    const { filename: fn, base64 } = (ctx.request.body || {}) as any;
    if (!base64 || typeof base64 !== 'string') throw new ApiError(40001, '不支持的上传方式');
    buf = Buffer.from(base64, 'base64');
    filename = filename || String(fn || '');
  }
  ctx.body = success(await svc.saveUploadFile(buf, filename, (ctx.state.admin as any)?.userId), '上传成功');
}
export async function completeUpload(ctx: Context) { ctx.body = success(await svc.completeUpload(Number(ctx.params.id)), '上传完成'); }
export async function getPublicLink(ctx: Context) { ctx.body = success(await svc.getPublicLink(Number(ctx.params.id))); }
export async function deleteFile(ctx: Context) { ctx.body = success(await svc.removeFile(Number(ctx.params.id)), '删除成功'); }
export async function getFileDetail(ctx: Context) { ctx.body = success(await svc.getFileDetail(Number(ctx.params.id))); }
export async function getFileDownloadUrl(ctx: Context) { ctx.body = success(await svc.getFileDownloadUrl(Number(ctx.params.id))); }
export async function batchMoveFiles(ctx: Context) { ctx.body = success(svc.batchMoveFiles(ctx.request.body), '批量移动成功'); }
export async function batchDeleteFiles(ctx: Context) { ctx.body = success(await svc.batchDeleteFiles(ctx.request.body), '批量删除成功'); }

// ===== 文件夹（占位实现）=====
export async function getFileFolderTree(ctx: Context) { ctx.body = success(svc.getFileFolderTree()); }
export async function createFileFolder(ctx: Context) { ctx.body = success(svc.createFileFolder(ctx.request.body), '新增成功'); }
export async function updateFileFolder(ctx: Context) { ctx.body = success(svc.updateFileFolder(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteFileFolder(ctx: Context) { ctx.body = success(svc.deleteFileFolder(), '删除成功'); }

// ===== 监控 =====
export async function getMonitorOverview(ctx: Context) { ctx.body = success(await svc.getMonitorOverview()); }
export async function getOnlineUsers(ctx: Context) { ctx.body = success(await svc.getOnlineUsersPage(ctx.query)); }
export async function deleteOnlineSession(ctx: Context) { ctx.body = success(await svc.forceLogoutSessions([String(ctx.params.sessionId)]), '已下线'); }
export async function forceLogout(ctx: Context) { ctx.body = success(await svc.forceLogoutSessions(((ctx.request.body as any)?.sessionIds || []).map(String)), '已下线'); }
export async function getCacheMonitor(ctx: Context) { ctx.body = success(svc.getCacheMonitor()); }
export async function getVisitorAnalytics(ctx: Context) { ctx.body = success(await svc.getVisitorAnalytics(ctx.query)); }
export async function getSystemResource(ctx: Context) { ctx.body = success(svc.getSystemResource()); }
export async function getOnlineUserDetail(ctx: Context) { ctx.body = success(await svc.getOnlineUserDetail(String(ctx.params.sessionId))); }
export async function refreshCacheMonitor(ctx: Context) { ctx.body = success(await svc.refreshCacheMonitor(), '缓存已刷新'); }
export async function clearCacheNamespace(ctx: Context) { ctx.body = success(await svc.clearCacheNamespace((ctx.request.body as any)?.namespace ?? (ctx.query.namespace as string)), '缓存已清理'); }

// ===== 日志 =====
export async function getOperationLogs(ctx: Context) { ctx.body = success(await svc.getOperationLogs(ctx.query)); }
// CSV 导出（UTF-8 BOM + attachment）
const csvEscape = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
const parseIds = (q: any) => String(q.ids || q.id || '').split(',').map(Number).filter(Boolean);
export async function exportOperationLogs(ctx: Context) {
  const result = await svc.getOperationLogs({ ...ctx.query, current: 1, size: 100000 });
  const header = ['ID', '日志编号', '模块', '操作类型', '描述', '方式', '路径', '操作人', 'IP', '状态', '耗时(ms)', '时间'];
  const lines = [header.map(csvEscape).join(',')];
  for (const r of result.records) lines.push([r.id, r.logNo, r.module, r.operationType, r.description, r.method, r.path, r.username, r.ip, r.status, r.durationMs, new Date(r.createdAt).toISOString()].map(csvEscape).join(','));
  ctx.set('Content-Type', 'text/csv; charset=utf-8');
  ctx.set('Content-Disposition', 'attachment; filename=operation-logs.csv');
  ctx.body = Buffer.from('\ufeff' + lines.join('\n'), 'utf8');
}
export async function clearOperationLogs(ctx: Context) { ctx.body = success({ count: await svc.clearOperationLogs() }, '清空成功'); }
export async function getOperationLogDetail(ctx: Context) { ctx.body = success(await svc.getOperationLogDetail(Number(ctx.params.id))); }
export async function deleteOperationLogs(ctx: Context) { ctx.body = success({ count: await svc.deleteOperationLogsByIds(parseIds(ctx.query)) }, '删除成功'); }
export async function getLoginLogs(ctx: Context) { ctx.body = success(await svc.getLoginLogs(ctx.query)); }
export async function getLoginLogDetail(ctx: Context) { ctx.body = success(await svc.getLoginLogDetail(Number(ctx.params.id))); }
export async function exportLoginLogs(ctx: Context) {
  const result = await svc.getLoginLogs({ ...ctx.query, current: 1, size: 100000 });
  const header = ['ID', '日志编号', '事件', '用户ID', '用户名', 'IP', '地点', '设备类型', '操作系统', '浏览器', '状态', '时间'];
  const lines = [header.map(csvEscape).join(',')];
  for (const r of result.records) lines.push([r.id, r.logNo, r.event, r.userId, r.username, r.ip, r.location, r.deviceType, r.os, r.browser, r.status, new Date(r.createdAt).toISOString()].map(csvEscape).join(','));
  ctx.set('Content-Type', 'text/csv; charset=utf-8');
  ctx.set('Content-Disposition', 'attachment; filename=login-logs.csv');
  ctx.body = Buffer.from('\ufeff' + lines.join('\n'), 'utf8');
}
export async function deleteLoginLogs(ctx: Context) { ctx.body = success({ count: await svc.deleteLoginLogsByIds(parseIds(ctx.query)) }, '删除成功'); }
export async function clearLoginLogs(ctx: Context) { ctx.body = success({ count: await svc.clearLoginLogs() }, '清空成功'); }

// ===== 用户反馈 =====
export async function getFeedbackList(ctx: Context) { ctx.body = success(await svc.getFeedbackList(ctx.query)); }
export async function getFeedbackDetail(ctx: Context) { ctx.body = success(await svc.getFeedbackDetail(Number(ctx.params.id))); }
export async function getFeedbackOverview(ctx: Context) { ctx.body = success(await svc.getFeedbackOverview()); }
export async function createFeedback(ctx: Context) { ctx.body = success(svc.createFeedbackAdmin(ctx.request.body), '反馈已提交'); }
export async function handleFeedback(ctx: Context) { ctx.body = success(await svc.handleFeedback(Number(ctx.params.id), ctx.request.body), '状态已更新'); }
export async function handleFeedbackStatus(ctx: Context) { ctx.body = success(await svc.handleFeedback(Number(ctx.params.id), ctx.request.body), '状态已更新'); }

// ===== 通知管理 =====
export async function getNotificationList(ctx: Context) { ctx.body = success(await svc.getNotificationAdminList(ctx.query)); }
export async function getNotificationDetail(ctx: Context) { ctx.body = success(await svc.getNotificationDetail(Number(ctx.params.id))); }
export async function createNotification(ctx: Context) { ctx.body = success(await svc.createNotificationAdmin(ctx.request.body), '新增成功'); }
export async function updateNotification(ctx: Context) { ctx.body = success(await svc.updateNotificationAdmin(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function publishNotification(ctx: Context) { ctx.body = success(await svc.publishNotification(Number(ctx.params.id)), '已发布'); }
export async function revokeNotification(ctx: Context) { ctx.body = success(await svc.revokeNotification(Number(ctx.params.id)), '已撤回'); }
export async function deleteNotification(ctx: Context) { ctx.body = success(await svc.deleteNotificationAdmin(Number(ctx.params.id)), '删除成功'); }

// ===== 通知收件箱（管理员侧）=====
export async function getNotificationInbox(ctx: Context) { ctx.body = success(await svc.getNotificationInbox(ctx.query)); }
export async function getNotificationInboxDetail(ctx: Context) { ctx.body = success(await svc.getNotificationInboxDetail(Number(ctx.params.id))); }
export async function markNotificationRead(ctx: Context) { ctx.body = success(svc.markInboxRead(), '已标记已读'); }
export async function markAllNotificationsRead(ctx: Context) { ctx.body = success(svc.markInboxAllRead(), '已全部标记已读'); }
export async function getNotificationStats(ctx: Context) { ctx.body = success(svc.getNotificationStats()); }
export async function getNotificationStreamToken(ctx: Context) { ctx.body = success(svc.getNotificationStreamToken()); }

// ===== 部门/岗位（模板占位：无数据概念，写操作仅回执）=====
export async function listDepartments(ctx: Context) { ctx.body = success(svc.listDepartments()); }
export async function createDepartment(ctx: Context) { ctx.body = success(null, '新增成功'); }
export async function updateDepartment(ctx: Context) { ctx.body = success(null, '更新成功'); }
export async function deleteDepartment(ctx: Context) { ctx.body = success(null, '删除成功'); }
export async function listPosts(ctx: Context) { ctx.body = success(svc.listPosts(ctx.query)); }
export async function createPost(ctx: Context) { ctx.body = success(null, '新增成功'); }
export async function updatePost(ctx: Context) { ctx.body = success(null, '更新成功'); }
export async function deletePost(ctx: Context) { ctx.body = success(null, '删除成功'); }

// ===== 分析仪表 =====
export async function getDashboardStats(ctx: Context) { ctx.body = success(await svc.getDashboardStats()); }
