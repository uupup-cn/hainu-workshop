// 系统管理控制器：角色权限 / 菜单 / 字典 / 通知 / 系统设置 / 文件中心
import { Context } from 'koa';
import { success } from '../../utils/response';
import { ApiError } from '../../utils/api-error';
import { parsePagination } from '../../utils/pagination';
import * as sys from '../../services/admin/system.service';

// 角色
export async function listRoles(ctx: Context) { ctx.body = success(await sys.roles.list()); }
export async function createRole(ctx: Context) { ctx.body = success(await sys.roles.create(ctx.request.body)); }
export async function updateRole(ctx: Context) { ctx.body = success(await sys.roles.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteRole(ctx: Context) { ctx.body = success(await sys.roles.delete(Number(ctx.params.id))); }
// 权限
export async function listPermissions(ctx: Context) { ctx.body = success(await sys.permissions.list()); }
export async function createPermission(ctx: Context) { ctx.body = success(await sys.permissions.create(ctx.request.body)); }
export async function updatePermission(ctx: Context) { ctx.body = success(await sys.permissions.update(Number(ctx.params.id), ctx.request.body)); }
export async function deletePermission(ctx: Context) { ctx.body = success(await sys.permissions.delete(Number(ctx.params.id))); }
// 角色权限分配
export async function getRolePermissions(ctx: Context) { ctx.body = success(await sys.getRolePermissions(Number(ctx.params.id))); }
export async function setRolePermissions(ctx: Context) { const { permissionIds } = ctx.request.body as any; if (!Array.isArray(permissionIds)) throw new ApiError(40001, 'permissionIds 必须为数组'); ctx.body = success(await sys.setRolePermissions(Number(ctx.params.id), permissionIds.map(Number))); }
// 角色用户
export async function getRoleUsers(ctx: Context) { ctx.body = success(await sys.getRoleUsers(Number(ctx.params.id))); }
export async function addRoleUser(ctx: Context) { const { userId } = ctx.request.body as any; if (!userId) throw new ApiError(40001, '缺少 userId'); ctx.body = success(await sys.addRoleUser(Number(ctx.params.id), Number(userId))); }
export async function removeRoleUser(ctx: Context) { ctx.body = success(await sys.removeRoleUser(Number(ctx.params.id), Number(ctx.params.userId))); }
// 菜单
export async function getMenuTree(ctx: Context) { ctx.body = success(await sys.getMenuTree()); }
export async function createMenu(ctx: Context) { ctx.body = success(await sys.createMenu(ctx.request.body)); }
export async function updateMenu(ctx: Context) { ctx.body = success(await sys.updateMenu(Number(ctx.params.id), ctx.request.body)); }
export async function deleteMenu(ctx: Context) { ctx.body = success(await sys.deleteMenu(Number(ctx.params.id))); }
export async function updateMenuSort(ctx: Context) { const items = ctx.request.body as any; if (!Array.isArray(items)) throw new ApiError(40001, '排序数据必须为数组'); ctx.body = success(await sys.updateMenuSort(items)); }
// 字典类型
export async function listDictTypes(ctx: Context) { ctx.body = success(await sys.dictTypes.list()); }
export async function createDictType(ctx: Context) { ctx.body = success(await sys.dictTypes.create(ctx.request.body)); }
export async function updateDictType(ctx: Context) { ctx.body = success(await sys.dictTypes.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteDictType(ctx: Context) { ctx.body = success(await sys.dictTypes.delete(Number(ctx.params.id))); }
// 字典项
export async function listDicts(ctx: Context) { ctx.body = success(await sys.dicts.list()); }
export async function createDict(ctx: Context) { ctx.body = success(await sys.dicts.create(ctx.request.body)); }
export async function updateDict(ctx: Context) { ctx.body = success(await sys.dicts.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteDict(ctx: Context) { ctx.body = success(await sys.dicts.delete(Number(ctx.params.id))); }
export async function getDictsByType(ctx: Context) { ctx.body = success(await sys.getDictsByType(String(ctx.params.type))); }
// 通知类型
export async function listNotificationTypes(ctx: Context) { ctx.body = success(await sys.notificationTypes.list()); }
export async function createNotificationType(ctx: Context) { ctx.body = success(await sys.notificationTypes.create(ctx.request.body)); }
export async function updateNotificationType(ctx: Context) { ctx.body = success(await sys.notificationTypes.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteNotificationType(ctx: Context) { ctx.body = success(await sys.notificationTypes.delete(Number(ctx.params.id))); }
// 通知
export async function listNotifications(ctx: Context) { const { page, size } = parsePagination(ctx.query); const typeId = ctx.query.typeId ? Number(ctx.query.typeId) : undefined; const target = ctx.query.target as string | undefined; ctx.body = success(await sys.listNotifications(page, size, typeId, target)); }
export async function createNotification(ctx: Context) { ctx.body = success(await sys.createNotification(ctx.request.body)); }
export async function updateNotification(ctx: Context) { ctx.body = success(await sys.updateNotification(Number(ctx.params.id), ctx.request.body)); }
export async function deleteNotification(ctx: Context) { ctx.body = success(await sys.deleteNotification(Number(ctx.params.id))); }
export async function pushNotification(ctx: Context) { ctx.body = success(await sys.pushNotification(ctx.request.body)); }
// 系统设置
export async function getSystemSettings(ctx: Context) { ctx.body = success(await sys.getSystemSettings()); }
export async function updateSystemSettings(ctx: Context) { ctx.body = success(await sys.updateSystemSettings(ctx.request.body as any)); }
export async function getSettingsGroup(ctx: Context) { ctx.body = success(await sys.getSettingsGroup(String(ctx.params.group))); }
export async function updateSettingsGroup(ctx: Context) { ctx.body = success(await sys.updateSettingsGroup(String(ctx.params.group), ctx.request.body as any)); }
export async function getAllSettings(ctx: Context) { ctx.body = success(await sys.getAllSettings()); }
// 文件中心
export async function listFiles(ctx: Context) { const { page, size } = parsePagination(ctx.query); const keyword = ctx.query.keyword as string | undefined; ctx.body = success(await sys.listFiles(page, size, keyword)); }
export async function uploadFile(ctx: Context) {
  // 支持两种上传方式：图片 Content-Type 原始二进制（query.filename）或 JSON {filename, base64}
  const isRaw = !!ctx.is('image/png', 'image/jpeg', 'image/gif', 'image/webp');
  let buffer: Buffer; let filename: string;
  if (isRaw) {
    filename = String(ctx.query.filename || 'upload.png');
    const chunks: Buffer[] = [];
    for await (const chunk of ctx.req) chunks.push(Buffer.from(chunk));
    buffer = Buffer.concat(chunks);
  } else {
    const body = ctx.request.body as any;
    if (!body || !body.filename || !body.base64) throw new ApiError(40001, '缺少 filename 或 base64');
    filename = String(body.filename);
    buffer = Buffer.from(String(body.base64).replace(/^data:image\/[a-z+]+;base64,/, ''), 'base64');
  }
  const admin: any = ctx.state.admin;
  ctx.body = success(await sys.uploadFile(buffer, filename, admin?.userId));
}
export async function downloadFile(ctx: Context) { ctx.redirect(await sys.getFileUrl(Number(ctx.params.id))); }
export async function deleteFile(ctx: Context) { ctx.body = success(await sys.deleteFile(Number(ctx.params.id))); }
export async function getFileStats(ctx: Context) { ctx.body = success(await sys.getFileStats()); }
