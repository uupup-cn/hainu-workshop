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

// ===== 角色管理 =====
export async function getRoles(ctx: Context) { ctx.body = success(await svc.listRoles(ctx.query)); }
export async function addRole(ctx: Context) { ctx.body = success(await svc.createRole(ctx.request.body), '新增成功'); }
export async function editRole(ctx: Context) { ctx.body = success(await svc.updateRole(Number(ctx.params.id), ctx.request.body), '更新成功'); }
export async function deleteRole(ctx: Context) { ctx.body = success(await svc.deleteRole(Number(ctx.params.id)), '删除成功'); }
export async function getRolePermissions(ctx: Context) { ctx.body = success(await svc.getRolePermissions(Number(ctx.params.id))); }
export async function setRolePermissions(ctx: Context) { ctx.body = success(await svc.setRolePermissions(Number(ctx.params.id), ctx.request.body), '权限已更新'); }
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

// ===== 监控 =====
export async function getMonitorOverview(ctx: Context) { ctx.body = success(await svc.getMonitorOverview()); }
export async function getOnlineUsers(ctx: Context) { ctx.body = success(await svc.getOnlineUsersPage(ctx.query)); }
export async function deleteOnlineSession(ctx: Context) { ctx.body = success(await svc.forceLogoutSessions([String(ctx.params.sessionId)]), '已下线'); }
export async function forceLogout(ctx: Context) { ctx.body = success(await svc.forceLogoutSessions(((ctx.request.body as any)?.sessionIds || []).map(String)), '已下线'); }
export async function getCacheMonitor(ctx: Context) { ctx.body = success(svc.getCacheMonitor()); }
export async function getVisitorAnalytics(ctx: Context) { ctx.body = success(await svc.getVisitorAnalytics(ctx.query)); }

// ===== 日志 =====
export async function getOperationLogs(ctx: Context) { ctx.body = success(await svc.getOperationLogs(ctx.query)); }
// CSV 导出（UTF-8 BOM + attachment）
export async function exportOperationLogs(ctx: Context) {
  const result = await svc.getOperationLogs({ ...ctx.query, current: 1, size: 100000 });
  const header = ['ID', '日志编号', '模块', '操作类型', '描述', '方式', '路径', '操作人', 'IP', '状态', '耗时(ms)', '时间'];
  const escape = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const lines = [header.map(escape).join(',')];
  for (const r of result.records) lines.push([r.id, r.logNo, r.module, r.operationType, r.description, r.method, r.path, r.username, r.ip, r.status, r.durationMs, new Date(r.createdAt).toISOString()].map(escape).join(','));
  ctx.set('Content-Type', 'text/csv; charset=utf-8');
  ctx.set('Content-Disposition', 'attachment; filename=operation-logs.csv');
  ctx.body = Buffer.from('\ufeff' + lines.join('\n'), 'utf8');
}
export async function clearOperationLogs(ctx: Context) { ctx.body = success({ count: await svc.clearOperationLogs() }, '清空成功'); }
export async function getLoginLogs(ctx: Context) { ctx.body = success(await svc.getLoginLogs(ctx.query)); }

// ===== 用户反馈 =====
export async function getFeedbackList(ctx: Context) { ctx.body = success(await svc.getFeedbackList(ctx.query)); }
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
