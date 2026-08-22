// 系统管理服务：角色权限 / 菜单 / 字典 / 通知 / 系统设置 / 文件中心（管理端）
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { paginatedResult } from '../../utils/pagination';
import { config } from '../../config';

const NOTIFICATION_TARGETS = ['all', 'freshman', 'undergrad', 'grad'];

// ========== 角色与权限 ==========

// 角色 CRUD（删除前检查是否被 RoleUser 关联或 AdminUser.roleId 引用）
export const roles = { list: () => prisma.role.findMany({ orderBy: { id: 'asc' } }), create: (d: any) => prisma.role.create({ data: d }), update: (id: number, d: any) => prisma.role.update({ where: { id }, data: d }), delete: async (id: number) => { const [ru, au] = await Promise.all([prisma.roleUser.count({ where: { roleId: id } }), prisma.adminUser.count({ where: { roleId: id } })]); if (ru > 0 || au > 0) throw new ApiError(40001, '角色已关联用户，无法删除'); await prisma.$transaction([prisma.rolePermission.deleteMany({ where: { roleId: id } }), prisma.role.delete({ where: { id } })]); return true; } };

// 权限 CRUD（删除前检查是否已分配给角色）
export const permissions = { list: () => prisma.permission.findMany({ orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }] }), create: (d: any) => prisma.permission.create({ data: d }), update: (id: number, d: any) => prisma.permission.update({ where: { id }, data: d }), delete: async (id: number) => { const c = await prisma.rolePermission.count({ where: { permissionId: id } }); if (c > 0) throw new ApiError(40001, '权限已分配给角色，无法删除'); return prisma.permission.delete({ where: { id } }); } };

// 获取角色已分配权限
export async function getRolePermissions(id: number) { const rps = await prisma.rolePermission.findMany({ where: { roleId: id }, include: { permission: true } }); return rps.map(rp => rp.permission); }

// 全量覆盖角色权限（事务：先清空再批量写入）
export async function setRolePermissions(id: number, permissionIds: number[]) { const role = await prisma.role.findUnique({ where: { id } }); if (!role) throw new ApiError(40003, '角色不存在'); await prisma.$transaction([prisma.rolePermission.deleteMany({ where: { roleId: id } }), prisma.rolePermission.createMany({ data: permissionIds.map(pid => ({ roleId: id, permissionId: pid })) })]); return getRolePermissions(id); }

// 角色下用户列表（RoleUser 关联 AdminUser，不含密码）
export async function getRoleUsers(id: number) { const rus = await prisma.roleUser.findMany({ where: { roleId: id } }); const ids = rus.map(ru => ru.adminUserId); if (ids.length === 0) return []; return prisma.adminUser.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, nickname: true, status: true, createdAt: true } }); }

// 添加用户到角色（已存在则跳过）
export async function addRoleUser(id: number, userId: number) { const exists = await prisma.roleUser.findFirst({ where: { roleId: id, adminUserId: userId } }); if (!exists) await prisma.roleUser.create({ data: { roleId: id, adminUserId: userId } }); return true; }

// 从角色移除用户
export async function removeRoleUser(id: number, userId: number) { await prisma.roleUser.deleteMany({ where: { roleId: id, adminUserId: userId } }); return true; }

// ========== 菜单 ==========

// 菜单树（按 parentId 组装，sortOrder 排序）
export async function getMenuTree() { const menus = await prisma.menu.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }); const build = (parentId: number): any[] => menus.filter(m => m.parentId === parentId).map(m => ({ ...m, children: build(m.id) })); return build(0); }
export async function createMenu(d: any) { return prisma.menu.create({ data: d }); }
export async function updateMenu(id: number, d: any) { return prisma.menu.update({ where: { id }, data: d }); }
export async function deleteMenu(id: number) { return prisma.menu.delete({ where: { id } }); }

// 批量更新菜单排序（body: [{id, sortOrder}]）
export async function updateMenuSort(items: any[]) { await prisma.$transaction(items.map(it => prisma.menu.update({ where: { id: Number(it.id) }, data: { sortOrder: Number(it.sortOrder) } }))); return true; }

// ========== 字典 ==========

// 字典类型 CRUD（删除前检查是否存在字典项）
export const dictTypes = { list: () => prisma.dictType.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.dictType.create({ data: d }), update: (id: number, d: any) => prisma.dictType.update({ where: { id }, data: d }), delete: async (id: number) => { const t = await prisma.dictType.findUnique({ where: { id } }); if (!t) throw new ApiError(40003, '字典类型不存在'); const c = await prisma.dict.count({ where: { dictType: t.typeKey } }); if (c > 0) throw new ApiError(40001, '字典类型下存在字典项，无法删除'); return prisma.dictType.delete({ where: { id } }); } };

// 字典项 CRUD
export const dicts = { list: () => prisma.dict.findMany({ orderBy: [{ dictType: 'asc' }, { sortOrder: 'asc' }] }), create: (d: any) => prisma.dict.create({ data: d }), update: (id: number, d: any) => prisma.dict.update({ where: { id }, data: d }), delete: (id: number) => prisma.dict.delete({ where: { id } }) };

// 按类型 typeKey 查询字典项
export function getDictsByType(type: string) { return prisma.dict.findMany({ where: { dictType: type }, orderBy: { sortOrder: 'asc' } }); }

// ========== 通知 ==========

// 通知类型 CRUD（删除前检查是否存在通知）
export const notificationTypes = { list: () => prisma.notificationType.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.notificationType.create({ data: d }), update: (id: number, d: any) => prisma.notificationType.update({ where: { id }, data: d }), delete: async (id: number) => { const c = await prisma.notification.count({ where: { typeId: id } }); if (c > 0) throw new ApiError(40001, '通知类型下存在通知，无法删除'); return prisma.notificationType.delete({ where: { id } }); } };

// 通知管理列表（分页 + typeId/target 筛选，含类型名）
export async function listNotifications(page = 1, size = 20, typeId?: number, target?: string) { const where: any = {}; if (typeId) where.typeId = typeId; if (target) where.target = target; const [list, total] = await Promise.all([prisma.notification.findMany({ where, include: { type: { select: { typeName: true } } }, skip: (page-1)*size, take: size, orderBy: { publishTime: 'desc' } }), prisma.notification.count({ where })]); return paginatedResult(list, total, page, size); }

// 校验通知必要参数
function checkNotification(d: any) { if (!d.typeId || !d.title || !d.content || !d.target) throw new ApiError(40001, '缺少必要参数'); if (!NOTIFICATION_TARGETS.includes(d.target)) throw new ApiError(40001, '推送对象无效'); }

// 创建通知（模型无 link 字段，按 schema 不存储）
export async function createNotification(d: any) { checkNotification(d); return prisma.notification.create({ data: { typeId: Number(d.typeId), title: String(d.title), content: String(d.content), target: d.target, ...(d.isActive !== undefined ? { isActive: Boolean(d.isActive) } : {}) } }); }

// 更新通知（白名单字段，忽略 link 等模型外字段）
export async function updateNotification(id: number, d: any) { if (d.target && !NOTIFICATION_TARGETS.includes(d.target)) throw new ApiError(40001, '推送对象无效'); const data: any = {}; for (const k of ['typeId', 'title', 'content', 'target', 'isActive', 'publishTime']) if (d[k] !== undefined) data[k] = d[k]; return prisma.notification.update({ where: { id }, data }); }

// 删除通知（联动清理已读记录）
export async function deleteNotification(id: number) { await prisma.$transaction([prisma.notificationRead.deleteMany({ where: { notificationId: id } }), prisma.notification.delete({ where: { id } })]); return true; }

// 推送通知：按 target 匹配用户群体（all=全部，其余按 identity 匹配），写入通知记录并返回触达用户数
export async function pushNotification(d: any) { checkNotification(d); const count = await prisma.user.count({ where: d.target === 'all' ? {} : { identity: d.target } }); await prisma.notification.createMany({ data: [{ typeId: Number(d.typeId), title: String(d.title), content: String(d.content), target: d.target }] }); return { count }; }

// ========== 系统设置 ==========

// 配置键 → 分组映射（PRD §5.6）
const SETTING_GROUPS: Record<string, string[]> = {
  basic: ['site_name', 'login_captcha', 'password_min_length', 'login_lock_threshold', 'lock_duration_minutes', 'jwt_expires_hours', 'page_size_default'],
  frontend: ['app_name', 'app_version', 'theme_color', 'launch_bg_image', 'nav_bg_image', 'about_us', 'customer_service_wechat', 'customer_service_qq', 'customer_service_phone', 'payment_miniprogram_path', 'payment_description'],
  file: ['allowed_upload_types', 'max_file_size_mb', 'max_upload_count', 'file_retention_days', 'storage_path'],
  holiday: ['campus_mode', 'holiday_type', 'semester_start', 'roommate_max_modify_count', 'roommate_start_time', 'roommate_end_time', 'poster_template'],
};

// 读取全部设置为 {key: value}
async function getSettingsMap(): Promise<Record<string, string>> { const settings = await prisma.systemSetting.findMany(); const r: Record<string, string> = {}; for (const s of settings) r[s.settingKey] = s.settingValue || ''; return r; }

// 取分组内全部键值（缺失键补空串）
function groupValues(all: Record<string, string>, group: string): Record<string, string> { const r: Record<string, string> = {}; for (const k of SETTING_GROUPS[group]) r[k] = all[k] ?? ''; return r; }

// 校验分组名
function checkGroup(group: string) { if (!SETTING_GROUPS[group]) throw new ApiError(40001, '无效的配置分组'); }

// 逐键 upsert
async function upsertSetting(key: string, value: any) { await prisma.systemSetting.upsert({ where: { settingKey: key }, create: { settingKey: key, settingValue: String(value) }, update: { settingValue: String(value) } }); }

// 系统设置：全部键值 / 部分更新
export async function getSystemSettings() { return getSettingsMap(); }
export async function updateSystemSettings(data: Record<string, any>) { for (const [k, v] of Object.entries(data)) await upsertSetting(k, v); return getSettingsMap(); }

// 分组设置：读取 / 更新（仅接受分组内键）/ 全部分组
export async function getSettingsGroup(group: string) { checkGroup(group); return groupValues(await getSettingsMap(), group); }
export async function updateSettingsGroup(group: string, data: Record<string, any>) { checkGroup(group); const keys = SETTING_GROUPS[group]; for (const [k, v] of Object.entries(data)) { if (keys.includes(k)) await upsertSetting(k, v); } return getSettingsGroup(group); }
export async function getAllSettings() { const all = await getSettingsMap(); const r: Record<string, Record<string, string>> = {}; for (const g of Object.keys(SETTING_GROUPS)) r[g] = groupValues(all, g); return r; }

// ========== 文件中心 ==========

const IMAGE_EXT_MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 单文件最大 5MB

// 文件列表（分页 + 原始文件名关键字筛选，fileSize 转 Number 以便 JSON 序列化）
export async function listFiles(page = 1, size = 20, keyword?: string) { const where = keyword ? { originalName: { contains: keyword } } : {}; const [list, total] = await Promise.all([prisma.file.findMany({ where, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.file.count({ where })]); return paginatedResult(list.map(f => ({ ...f, fileSize: Number(f.fileSize), url: config.fileBaseUrl + f.filePath })), total, page, size); }

// 上传文件：仅图片、≤5MB，按年月目录存储，随机文件名保留扩展名
export async function uploadFile(buffer: Buffer, originalName: string, uploaderId?: number) {
  const ext = (originalName.split('.').pop() || '').toLowerCase();
  const mime = IMAGE_EXT_MIME[ext];
  if (!mime) throw new ApiError(40001, '仅支持 png/jpg/jpeg/gif/webp 格式图片');
  if (buffer.length === 0) throw new ApiError(40001, '文件内容为空');
  if (buffer.length > MAX_FILE_SIZE) throw new ApiError(40001, '文件大小不能超过 5MB');
  const ym = new Date().toISOString().substring(0, 7);
  const storedName = crypto.randomBytes(16).toString('hex') + '.' + ext;
  fs.mkdirSync(path.join(config.fileUploadDir, ym), { recursive: true });
  await fs.promises.writeFile(path.join(config.fileUploadDir, ym, storedName), buffer);
  const filePath = '/uploads/' + ym + '/' + storedName;
  const f = await prisma.file.create({ data: { originalName: originalName.substring(0, 255), storedName, filePath, fileSize: BigInt(buffer.length), mimeType: mime, ...(uploaderId ? { uploaderId } : {}) } });
  return { ...f, fileSize: buffer.length, url: config.fileBaseUrl + filePath };
}

// 获取文件访问地址（用于下载重定向）
export async function getFileUrl(id: number) { const f = await prisma.file.findUnique({ where: { id } }); if (!f) throw new ApiError(40003, '文件不存在'); return config.fileBaseUrl + f.filePath; }

// 删除文件（删记录 + 删除磁盘文件，文件不存在时忽略错误）
export async function deleteFile(id: number) { const f = await prisma.file.findUnique({ where: { id } }); if (!f) throw new ApiError(40003, '文件不存在'); await prisma.file.delete({ where: { id } }); const rel = f.filePath.replace(/^\/uploads/, ''); await fs.promises.unlink(path.join(config.fileUploadDir, rel)).catch(() => undefined); return true; }

// 文件统计（总大小 / 总数量）
export async function getFileStats() { const agg = await prisma.file.aggregate({ _sum: { fileSize: true }, _count: { _all: true } }); return { totalSize: Number(agg._sum.fileSize || 0), totalCount: agg._count }; }
