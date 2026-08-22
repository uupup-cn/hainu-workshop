// 模板路径集成服务：管理后台（Art Design Pro / Ci-Yuu 模板）原生页面所需的引导链路与系统管理/监控接口
// 响应结构照抄 admin/mock-server.mjs 对应端点的 data 形状（分页为 {records, total, current, size}）
import * as crypto from 'crypto';
import * as os from 'os';
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { config } from '../../config';
import { saveImage } from './upload.service';
import { getAllSettings, deleteFile as deleteFileRecord } from './system.service';

// ===== 通用 =====

// 模板分页参数：current/size（兼容 page）
export function parseCurrent(query: any) { return { current: Math.max(1, Number(query.current || query.page) || 1), size: Math.max(1, Number(query.size) || 20) }; }

// 模板分页包裹（照抄 mock paginate 返回：{records, total, current, size}）
export function templatePage(records: any[], total: number, current: number, size: number) { return { records, total, current, size }; }

const sha256 = (p: string) => crypto.createHash('sha256').update(p).digest('hex');

// ===== 模板接口权限码全集 =====
// 前端 http 层 assertApiPermission 对带 permissionCode 的请求做 includes 严格匹配，
// 空数组与 ['*'] 均会被拦截，故超管需返回完整清单（清单取自 mock ALL_PERMISSIONS，与前端 constants/api-permissions.ts 对齐）
const TEMPLATE_PERMISSIONS: string[] = [
  'account:feedback:create', 'account:info:view', 'account:notification:detail', 'account:notification:inbox:list',
  'account:notification:read', 'account:notification:read-all', 'account:notification:stats', 'account:password:change',
  'account:profile:update', 'account:profile:view', 'account:session:list', 'account:session:logout',
  'account:session:revoke', 'account:session:revoke-others', 'account:workflow-instance:cancel', 'account:workflow-instance:start',
  'account:workflow-task:add-sign', 'account:workflow-task:approve', 'account:workflow-task:comment', 'account:workflow-task:detail',
  'account:workflow-task:overview', 'account:workflow-task:pending:list', 'account:workflow-task:processed:list', 'account:workflow-task:reject',
  'account:workflow-task:transfer', 'system:ai-generator:apply', 'system:ai-generator:check', 'system:ai-generator:diagnose',
  'system:ai-generator:history', 'system:ai-generator:parse', 'system:ai-generator:plan', 'system:ai-generator:preview',
  'system:ai-generator:rollback', 'system:ai-generator:smoke-test', 'system:ai-generator:validate', 'system:api-permission:catalog',
  'system:content-category:create', 'system:content-category:delete', 'system:content-category:list', 'system:content-category:update',
  'system:content-recycle:list', 'system:content-recycle:purge', 'system:content-recycle:restore', 'system:content-tag:create',
  'system:content-tag:delete', 'system:content-tag:list', 'system:content-tag:update', 'system:content:create',
  'system:content:delete', 'system:content:detail', 'system:content:list', 'system:content:offline',
  'system:content:overview', 'system:content:publish', 'system:content:update', 'system:department:create',
  'system:department:delete', 'system:department:detail', 'system:department:list', 'system:department:update',
  'system:dict:data:create', 'system:dict:data:delete', 'system:dict:data:detail', 'system:dict:data:list',
  'system:dict:data:update', 'system:dict:type:create', 'system:dict:type:delete', 'system:dict:type:detail',
  'system:dict:type:list', 'system:dict:type:update', 'system:feedback:detail', 'system:feedback:list',
  'system:feedback:overview', 'system:feedback:status:update', 'system:file-folder:create', 'system:file-folder:delete',
  'system:file-folder:tree', 'system:file-folder:update', 'system:file:batch-delete', 'system:file:batch-move',
  'system:file:complete', 'system:file:delete', 'system:file:detail', 'system:file:download-url',
  'system:file:list', 'system:file:public-link', 'system:file:upload-proxy', 'system:file:upload-ticket:create',
  'system:log:login:clear', 'system:log:login:delete', 'system:log:login:detail', 'system:log:login:export',
  'system:log:login:list', 'system:log:operation:clear', 'system:log:operation:delete', 'system:log:operation:detail',
  'system:log:operation:export', 'system:log:operation:list', 'system:menu:auth:create', 'system:menu:auth:delete',
  'system:menu:auth:update', 'system:menu:create', 'system:menu:delete', 'system:menu:list',
  'system:menu:manage:list', 'system:menu:sort', 'system:menu:update', 'system:monitor:cache:refresh',
  'system:monitor:cache:view', 'system:monitor:online-user:detail', 'system:monitor:online-user:force-logout', 'system:monitor:online-user:list',
  'system:monitor:overview', 'system:monitor:system-resource:view', 'system:monitor:visitor-analytics:view', 'system:notification:admin:detail',
  'system:notification:admin:list', 'system:notification:create', 'system:notification:delete', 'system:notification:publish',
  'system:notification:revoke', 'system:notification:update', 'system:param:create', 'system:param:delete',
  'system:param:detail', 'system:param:list', 'system:param:refresh-cache', 'system:param:resolve',
  'system:param:update', 'system:post:create', 'system:post:delete', 'system:post:detail',
  'system:post:list', 'system:post:update', 'system:role:create', 'system:role:data-permission:detail',
  'system:role:data-permission:meta', 'system:role:data-permission:update', 'system:role:delete', 'system:role:list',
  'system:role:permission:detail', 'system:role:permission:update', 'system:role:update', 'system:scheduled-task:create',
  'system:scheduled-task:cron:preview', 'system:scheduled-task:delete', 'system:scheduled-task:detail', 'system:scheduled-task:handler:list',
  'system:scheduled-task:list', 'system:scheduled-task:log:clear', 'system:scheduled-task:log:delete', 'system:scheduled-task:log:detail',
  'system:scheduled-task:log:list', 'system:scheduled-task:run', 'system:scheduled-task:status', 'system:scheduled-task:update',
  'system:security-audit:event:detail', 'system:security-audit:event:list', 'system:security-audit:event:status:update', 'system:security-audit:overview',
  'system:site-setting:admin:view', 'system:site-setting:update', 'system:user:create', 'system:user:delete',
  'system:user:detail', 'system:user:list', 'system:user:update', 'toolbox:category:list',
  'toolbox:category:create', 'toolbox:category:update', 'toolbox:category:delete', 'toolbox:tool:list',
  'toolbox:tool:create', 'toolbox:tool:update', 'toolbox:tool:delete', 'toolbox:tool:enable',
  'toolbox:log:list',
];

// 普通管理员：apiPermissions 取其角色已授权的权限 key（permissions 表 permKey）
async function rolePermissionKeys(adminUserId: number) {
  const rus = await prisma.roleUser.findMany({ where: { adminUserId }, select: { roleId: true } });
  if (rus.length === 0) return [];
  const rps = await prisma.rolePermission.findMany({ where: { roleId: { in: rus.map(r => r.roleId) } }, include: { permission: true } });
  return rps.map(rp => rp.permission.permKey);
}

// ===== 引导链路：验证码 / 用户信息 =====

// 图片验证码（照 mock 1185 行：随机 captchaId + 简单 SVG + 300 秒有效期）
export function getCaptcha() {
  const code = Math.random().toString(36).slice(2, 6);
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="#fff"/><text x="30" y="28" font-size="22">${code}</text></svg>`;
  return { captchaId: crypto.randomUUID(), image, expiresIn: 300 };
}

// 当前管理员信息（照 mock 1202 行形状；roles 为 roleKey 数组，无角色时 id=1 给 super-admin）
export async function getUserInfo(userId: number) {
  const admin = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!admin) throw new ApiError(40003, '管理员不存在');
  const rus = await prisma.roleUser.findMany({ where: { adminUserId: userId }, include: { role: true } });
  let roles = rus.map(ru => ru.role.roleKey);
  if (roles.length === 0 && admin.id === 1) roles = ['super-admin'];
  const apiPermissions = roles.includes('super-admin') ? TEMPLATE_PERMISSIONS : await rolePermissionKeys(userId);
  return { id: admin.id, username: admin.username, nickName: admin.nickname || admin.username, realName: admin.nickname || admin.username, email: '', avatar: '', roles, buttons: [], apiPermissions };
}

// ===== 菜单（引导树 + 功能管理）=====

// 组装 Ci-Yuu 菜单树：menuType=button 的行转为父节点 meta.authList；buttonsAsChildren=true 时（功能管理视图）按钮额外展开为 children
export async function getMenuTree(buttonsAsChildren = false) {
  const menus = await prisma.menu.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  const btnByParent = new Map<number, any[]>();
  for (const b of menus.filter(m => m.menuType === 'button')) { const arr = btnByParent.get(b.parentId) || []; arr.push(b); btnByParent.set(b.parentId, arr); }
  const build = (parentId: number): any[] => menus.filter(m => m.parentId === parentId && m.menuType !== 'button').map(m => {
    const btns = btnByParent.get(m.id) || [];
    const children = build(m.id);
    if (buttonsAsChildren) children.push(...btns.map(b => ({ id: b.id, parentId: b.parentId, name: b.menuKey, path: '', component: '', meta: { title: b.menuName, icon: b.icon || '', sort: b.sortOrder, isEnable: b.isVisible, isAuthButton: true, authMark: b.menuKey } })));
    return { id: m.id, parentId: m.parentId === 0 ? null : m.parentId, name: m.menuKey, path: m.path || '', component: m.component || '', meta: { title: m.menuName, icon: m.icon || '', sort: m.sortOrder, isFirstLevel: m.parentId === 0, keepAlive: false, isHide: !m.isVisible, isEnable: m.isVisible, authList: btns.map(b => ({ authMark: b.menuKey, title: b.menuName })) }, children };
  });
  return build(0);
}

// 菜单 body（照 mock 1560 行）→ Menu 表字段映射（menuName←title/label、menuKey←name、sortOrder←sort、isVisible←isEnable/isVisible/!isHide）
function mapMenuBody(d: any) {
  const data: any = {};
  if (d.title !== undefined || d.label !== undefined) data.menuName = String(d.title ?? d.label);
  if (d.name !== undefined) data.menuKey = String(d.name);
  if (d.menuType !== undefined) data.menuType = String(d.menuType);
  if (d.icon !== undefined) data.icon = d.icon ? String(d.icon) : null;
  if (d.path !== undefined) data.path = d.path ? String(d.path) : null;
  if (d.component !== undefined) data.component = d.component ? String(d.component) : null;
  if (d.sort !== undefined || d.sortOrder !== undefined) data.sortOrder = Number(d.sort ?? d.sortOrder) || 0;
  if (d.isEnable !== undefined) data.isVisible = Boolean(d.isEnable);
  else if (d.isVisible !== undefined) data.isVisible = Boolean(d.isVisible);
  else if (d.isHide !== undefined) data.isVisible = !d.isHide;
  if (d.parentId !== undefined) data.parentId = Number(d.parentId) || 0;
  return data;
}

// 创建菜单（menuKey 唯一，冲突 40001）
export async function createMenu(d: any) {
  const data = mapMenuBody(d);
  if (!data.menuKey || !data.menuName) throw new ApiError(40001, '菜单 name 与 title 必填');
  if (await prisma.menu.findUnique({ where: { menuKey: data.menuKey } })) throw new ApiError(40001, '菜单标识已存在');
  return prisma.menu.create({ data: { menuKey: data.menuKey, menuName: data.menuName, parentId: data.parentId ?? 0, menuType: data.menuType || 'menu', icon: data.icon ?? null, path: data.path ?? null, component: data.component ?? null, sortOrder: data.sortOrder ?? 0, isVisible: data.isVisible ?? true } });
}

// 更新菜单（部分更新，同上映射；menuKey 变更时校验唯一）
export async function updateMenu(id: number, d: any) {
  const row = await prisma.menu.findUnique({ where: { id } });
  if (!row) throw new ApiError(40003, '菜单不存在');
  const data = mapMenuBody(d);
  if (data.menuKey && data.menuKey !== row.menuKey && await prisma.menu.findUnique({ where: { menuKey: data.menuKey } })) throw new ApiError(40001, '菜单标识已存在');
  return prisma.menu.update({ where: { id }, data });
}

// 批量更新排序（body: [{id, sort}]）
export async function updateMenuSort(items: any[]) {
  await prisma.$transaction(items.map(it => prisma.menu.update({ where: { id: Number(it.id) }, data: { sortOrder: Number(it.sort ?? it.sortOrder) || 0 } })));
  return true;
}

// 删除菜单（级联删除全部子孙后删除自身）
export async function deleteMenuCascade(id: number) {
  const menus = await prisma.menu.findMany({ select: { id: true, parentId: true } });
  const descendants = (pid: number): number[] => menus.filter(m => m.parentId === pid).flatMap(m => [m.id, ...descendants(m.id)]);
  const ids = [id, ...descendants(id)];
  await prisma.menu.deleteMany({ where: { id: { in: ids } } });
  return ids.length;
}

// 按钮权限 CRUD（功能管理页 auths 系列路径，menuType 固定 button）
export async function createMenuAuth(d: any) {
  const menuKey = String(d.authMark || d.name || d.menuKey || '');
  if (!menuKey) throw new ApiError(40001, '权限标识必填');
  if (await prisma.menu.findUnique({ where: { menuKey } })) throw new ApiError(40001, '权限标识已存在');
  return prisma.menu.create({ data: { menuName: String(d.title || d.label || d.authName || menuKey), menuKey, menuType: 'button', parentId: Number(d.parentId) || 0, icon: d.icon ? String(d.icon) : null, sortOrder: Number(d.sort ?? d.authSort) || 0, isVisible: true } });
}
export async function updateMenuAuth(parentId: number, authMark: string, d: any) {
  const row = await prisma.menu.findFirst({ where: { parentId, menuKey: authMark, menuType: 'button' } });
  if (!row) throw new ApiError(40003, '权限不存在');
  const data: any = {};
  if (d.title !== undefined || d.label !== undefined || d.authName !== undefined) data.menuName = String(d.title ?? d.label ?? d.authName);
  if (d.icon !== undefined) data.icon = d.icon ? String(d.icon) : null;
  if (d.sort !== undefined || d.authSort !== undefined) data.sortOrder = Number(d.sort ?? d.authSort) || 0;
  if (d.isEnable !== undefined) data.isVisible = Boolean(d.isEnable);
  return prisma.menu.update({ where: { id: row.id }, data });
}
export async function deleteMenuAuth(parentId: number, authMark: string) {
  const row = await prisma.menu.findFirst({ where: { parentId, menuKey: authMark, menuType: 'button' } });
  if (!row) throw new ApiError(40003, '权限不存在');
  await prisma.menu.delete({ where: { id: row.id } });
  return true;
}

// ===== 后台用户管理 =====

// 管理员角色列表（RoleUser → Role）
async function rolesOfUser(adminUserId: number) {
  const rus = await prisma.roleUser.findMany({ where: { adminUserId }, include: { role: true } });
  return rus.map(ru => ({ id: ru.role.id, name: ru.role.roleName }));
}

// AdminUser → 模板用户形状（照 mock：profile 嵌套 + roles 数组）
function mapAdminUser(u: any, roles: any[]) {
  const nick = u.nickname || u.username;
  return { id: u.id, username: u.username, departmentId: null, postId: null, profile: { gender: 1, phone: null, realName: nick, nickName: nick, email: null, avatar: null, address: null, bio: null }, roles, departmentInfo: null, postInfo: null, status: u.status, createdAt: u.createdAt, updatedAt: u.updatedAt };
}

// 管理员分页列表（username 关键词）
export async function listAdminUsers(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.username) where.username = { contains: String(query.username) };
  if (query.realName || query.nickName) where.nickname = { contains: String(query.realName || query.nickName) };
  const [rows, total] = await Promise.all([prisma.adminUser.findMany({ where, skip: (current - 1) * size, take: size, orderBy: { id: 'asc' } }), prisma.adminUser.count({ where })]);
  const rus = await prisma.roleUser.findMany({ where: { adminUserId: { in: rows.map(r => r.id) } }, include: { role: true } });
  const byUser = new Map<number, any[]>();
  for (const ru of rus) { const arr = byUser.get(ru.adminUserId) || []; arr.push({ id: ru.role.id, name: ru.role.roleName }); byUser.set(ru.adminUserId, arr); }
  return templatePage(rows.map(r => mapAdminUser(r, byUser.get(r.id) || [])), total, current, size);
}

// 创建管理员（password sha256 哈希存储，与 auth.service 的 hashPassword 一致；username 唯一冲突 40001）
export async function createAdminUser(d: any) {
  const username = String(d.username || '');
  const password = String(d.password || '');
  if (!username || !password) throw new ApiError(40001, '用户名与密码必填');
  if (await prisma.adminUser.findUnique({ where: { username } })) throw new ApiError(40001, '用户名已存在');
  const nickName = String(d.nickName || d.profile?.nickName || username);
  const user = await prisma.adminUser.create({ data: { username, passwordHash: sha256(password), nickname: nickName, status: 'active' } });
  const roleIds: number[] = ((d.roleIds || d.roles || []) as any[]).map(Number).filter(Boolean);
  if (roleIds.length) await prisma.roleUser.createMany({ data: roleIds.map(roleId => ({ adminUserId: user.id, roleId })) });
  return mapAdminUser(user, await rolesOfUser(user.id));
}

// 更新管理员（nickName/status/roles，传了 password 才改密）
export async function updateAdminUser(id: number, d: any) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) throw new ApiError(40003, '用户不存在');
  const data: any = {};
  if (d.nickName !== undefined || d.profile?.nickName !== undefined) data.nickname = String(d.nickName ?? d.profile.nickName);
  if (d.status !== undefined) data.status = String(d.status);
  if (d.password) data.passwordHash = sha256(String(d.password));
  const updated = Object.keys(data).length ? await prisma.adminUser.update({ where: { id }, data }) : user;
  if (d.roleIds || d.roles) {
    const roleIds: number[] = ((d.roleIds || d.roles) as any[]).map(Number).filter(Boolean);
    await prisma.$transaction([prisma.roleUser.deleteMany({ where: { adminUserId: id } }), ...(roleIds.length ? [prisma.roleUser.createMany({ data: roleIds.map(roleId => ({ adminUserId: id, roleId })) })] : [])]);
  }
  return mapAdminUser(updated, await rolesOfUser(id));
}

// 删除管理员（连带 RoleUser；id=1 不允许删除）
export async function deleteAdminUser(id: number) {
  if (id === 1) throw new ApiError(40001, '超级管理员不允许删除');
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) throw new ApiError(40003, '用户不存在');
  await prisma.$transaction([prisma.roleUser.deleteMany({ where: { adminUserId: id } }), prisma.adminUser.delete({ where: { id } })]);
  return true;
}

// 当前管理员资料（照 mock 1211 行形状）
export async function getMyProfile(userId: number) {
  const admin = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!admin) throw new ApiError(40003, '管理员不存在');
  const nick = admin.nickname || admin.username;
  return { id: admin.id, username: admin.username, createdAt: admin.createdAt, updatedAt: admin.updatedAt, departmentInfo: null, postInfo: null, roles: await rolesOfUser(admin.id), profile: { gender: 1, phone: null, realName: nick, nickName: nick, email: null, avatar: null, address: null, bio: null } };
}

// 更新自己资料（AdminUser 无 email 字段——schema 限制，仅更新昵称，email 忽略）
export async function updateMyProfile(userId: number, d: any) {
  const nickName = d.nickName ?? d.profile?.nickName;
  if (nickName !== undefined) await prisma.adminUser.update({ where: { id: userId }, data: { nickname: String(nickName) } });
  const profile = await getMyProfile(userId);
  return profile.profile;
}

// ===== 角色管理 =====

// 角色分页列表（含权限数 / 用户数）
export async function listRoles(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.name) where.roleName = { contains: String(query.name) };
  if (query.code) where.roleKey = { contains: String(query.code) };
  const [rows, total] = await Promise.all([prisma.role.findMany({ where, skip: (current - 1) * size, take: size, orderBy: { id: 'asc' }, include: { _count: { select: { permissions: true, users: true } } } }), prisma.role.count({ where })]);
  return templatePage(rows.map(r => ({ id: r.id, name: r.roleName, code: r.roleKey, description: r.description || '', enabled: true, createdAt: r.createdAt, updatedAt: r.updatedAt, permissionCount: r._count.permissions, userCount: r._count.users })), total, current, size);
}

function roleBody(d: any) { const data: any = {}; if (d.name !== undefined || d.roleName !== undefined) data.roleName = String(d.name ?? d.roleName); if (d.code !== undefined || d.roleKey !== undefined) data.roleKey = String(d.code ?? d.roleKey); if (d.description !== undefined) data.description = d.description ? String(d.description) : null; return data; }

export async function createRole(d: any) {
  const data = roleBody(d);
  if (!data.roleName || !data.roleKey) throw new ApiError(40001, '角色名称与编码必填');
  if (await prisma.role.findFirst({ where: { roleKey: data.roleKey } })) throw new ApiError(40001, '角色编码已存在');
  return prisma.role.create({ data });
}
export async function updateRole(id: number, d: any) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new ApiError(40003, '角色不存在');
  const data = roleBody(d);
  if (data.roleKey && data.roleKey !== role.roleKey && await prisma.role.findFirst({ where: { roleKey: data.roleKey } })) throw new ApiError(40001, '角色编码已存在');
  return prisma.role.update({ where: { id }, data });
}

// 删除角色（被 RoleUser 关联或 AdminUser.roleId 引用时拒绝）
export async function deleteRole(id: number) {
  const [ru, au] = await Promise.all([prisma.roleUser.count({ where: { roleId: id } }), prisma.adminUser.count({ where: { roleId: id } })]);
  if (ru > 0 || au > 0) throw new ApiError(40001, '角色已关联用户，无法删除');
  await prisma.$transaction([prisma.rolePermission.deleteMany({ where: { roleId: id } }), prisma.role.delete({ where: { id } })]);
  return true;
}

// 角色权限 key 集合（前端 buildMenuTreeData 规则：菜单 key 为 menuKey，按钮 key 为 `${父menuKey}_${按钮menuKey}`）
async function menuTreeKeySet() {
  const menus = await prisma.menu.findMany({ select: { id: true, parentId: true, menuKey: true, menuType: true } });
  const keyById = new Map(menus.map(m => [m.id, m.menuKey]));
  const keys = new Set<string>();
  for (const m of menus) {
    keys.add(m.menuKey);
    if (m.menuType === 'button' && keyById.has(m.parentId)) keys.add(`${keyById.get(m.parentId)}_${m.menuKey}`);
  }
  return keys;
}

// 按钮权限 key 集合（接口权限目录叶子 code）
async function buttonKeySet() { const btns = await prisma.menu.findMany({ where: { menuType: 'button' }, select: { menuKey: true } }); return new Set(btns.map(b => b.menuKey)); }

// 角色已授权权限（照 mock 1427 行：{roleId, permissionKeys, apiPermissionCodes}，另附 permissionIds）
export async function getRolePermissions(id: number) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new ApiError(40003, '角色不存在');
  const rps = await prisma.rolePermission.findMany({ where: { roleId: id }, include: { permission: true } });
  const menuKeys = await menuTreeKeySet();
  const btnKeys = await buttonKeySet();
  const permissionKeys: string[] = [];
  const apiPermissionCodes: string[] = [];
  for (const rp of rps) {
    const k = rp.permission.permKey;
    if (btnKeys.has(k)) apiPermissionCodes.push(k);
    else if (menuKeys.has(k)) permissionKeys.push(k);
  }
  return { roleId: id, permissionIds: rps.map(rp => rp.permissionId), permissionKeys, apiPermissionCodes };
}

// 全量覆盖角色权限（body: {permissionKeys, apiPermissionCodes} 或 {permissionIds}；字符串 key 解析/补建 Permission 行后事务覆盖）
export async function setRolePermissions(id: number, body: any) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new ApiError(40003, '角色不存在');
  const keys: string[] = [...new Set([...(body.permissionKeys || []), ...(body.apiPermissionCodes || [])].map(String))];
  const permIds: number[] = ((body.permissionIds || []) as any[]).map(Number).filter(Boolean);
  for (const k of keys) {
    let p = await prisma.permission.findFirst({ where: { permKey: k } });
    if (!p) p = await prisma.permission.create({ data: { permName: k, permKey: k } });
    permIds.push(p.id);
  }
  const uniqueIds = [...new Set(permIds)];
  await prisma.$transaction([prisma.rolePermission.deleteMany({ where: { roleId: id } }), ...(uniqueIds.length ? [prisma.rolePermission.createMany({ data: uniqueIds.map(permissionId => ({ roleId: id, permissionId })) })] : [])]);
  return getRolePermissions(id);
}

// 接口权限目录树（照 mock permissionCatalog 形状：模块=根菜单，分类=二级菜单，权限=按钮节点；按钮不足时并入 permissions 表）
export async function getApiPermissionCatalog() {
  const menus = await prisma.menu.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  const mapPerm = (b: any, module: string, category: string, path: string) => ({ id: b.id, code: b.menuKey, name: b.menuName, module, category, method: 'GET', path: path || '', enabled: b.isVisible, sort: b.sortOrder, createdAt: b.createdAt, updatedAt: b.updatedAt });
  const catalog: any[] = [];
  for (const root of menus.filter(m => m.parentId === 0 && m.menuType !== 'button')) {
    const categories: any[] = [];
    for (const child of menus.filter(m => m.parentId === root.id && m.menuType !== 'button')) {
      const btns = menus.filter(m => m.parentId === child.id && m.menuType === 'button');
      if (btns.length) categories.push({ category: child.menuName, permissions: btns.map(b => mapPerm(b, root.menuName, child.menuName, child.path || '')) });
    }
    const rootBtns = menus.filter(m => m.parentId === root.id && m.menuType === 'button');
    if (rootBtns.length) categories.push({ category: '通用', permissions: rootBtns.map(b => mapPerm(b, root.menuName, '通用', root.path || '')) });
    if (categories.length) catalog.push({ module: root.menuName, categories });
  }
  const menuBtnKeys = menus.filter(m => m.menuType === 'button').map(m => m.menuKey);
  const extra = await prisma.permission.findMany({ where: menuBtnKeys.length ? { permKey: { notIn: menuBtnKeys } } : {}, orderBy: { id: 'asc' } });
  if (extra.length) catalog.push({ module: '扩展权限', categories: [{ category: '其他', permissions: extra.map(p => ({ id: p.id, code: p.permKey, name: p.permName, module: '扩展权限', category: '其他', method: 'GET', path: '', enabled: true, sort: p.sortOrder, createdAt: p.createdAt, updatedAt: p.createdAt })) }] });
  return catalog;
}

// 数据权限元信息（照 mock 1430 行形状，返回简单元数据）
export function getDataPermissionMeta() {
  return {
    resources: [],
    scopeOptions: [{ value: 'ALL', label: '全部数据' }, { value: 'ORG_AND_CHILD', label: '本机构及下属' }, { value: 'ORG', label: '本机构' }, { value: 'SELF', label: '仅本人' }, { value: 'CUSTOM', label: '自定义' }, { value: 'NONE', label: '不可访问' }],
    dimensionOptions: [{ value: 'DEPT', label: '部门' }, { value: 'REGION', label: '区域' }, { value: 'STORE', label: '门店' }, { value: 'USER', label: '用户' }],
    actionOptions: [{ value: 'view', label: '查看' }, { value: 'create', label: '新增' }, { value: 'update', label: '修改' }, { value: 'delete', label: '删除' }, { value: 'export', label: '导出' }, { value: 'approve', label: '审批' }, { value: 'assign', label: '分配' }],
    departments: [],
  };
}

// ===== 字典管理 =====

// DictType → 模板形状（typeName/typeKey 映射为 name/code，含字典项计数）
function mapDictType(t: any, itemCount = 0) { return { id: t.id, name: t.typeName, code: t.typeKey, description: t.description || '', remark: t.description || '', sort: t.sortOrder, enabled: t.isActive, createdAt: t.createdAt, updatedAt: t.updatedAt, _count: { items: itemCount } }; }

export async function listDictTypes(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.keyword) where.OR = [{ typeName: { contains: String(query.keyword) } }, { typeKey: { contains: String(query.keyword) } }];
  if (query.name) where.typeName = { contains: String(query.name) };
  if (query.code) where.typeKey = { contains: String(query.code) };
  const [rows, total, counts] = await Promise.all([prisma.dictType.findMany({ where, skip: (current - 1) * size, take: size, orderBy: { sortOrder: 'asc' } }), prisma.dictType.count({ where }), prisma.dict.groupBy({ by: ['dictType'], _count: { _all: true } })]);
  const countMap = new Map(counts.map(c => [c.dictType, c._count._all]));
  return templatePage(rows.map(t => mapDictType(t, countMap.get(t.typeKey) || 0)), total, current, size);
}

function dictTypeBody(d: any) { const data: any = {}; if (d.name !== undefined || d.typeName !== undefined) data.typeName = String(d.name ?? d.typeName); if (d.code !== undefined || d.typeKey !== undefined) data.typeKey = String(d.code ?? d.typeKey); if (d.description !== undefined || d.remark !== undefined) data.description = d.description ?? d.remark ?? null; if (d.sort !== undefined) data.sortOrder = Number(d.sort) || 0; if (d.enabled !== undefined) data.isActive = Boolean(d.enabled); return data; }

export async function createDictType(d: any) {
  const data = dictTypeBody(d);
  if (!data.typeName || !data.typeKey) throw new ApiError(40001, '字典名称与标识必填');
  if (await prisma.dictType.findUnique({ where: { typeKey: data.typeKey } })) throw new ApiError(40001, '字典标识已存在');
  return mapDictType(await prisma.dictType.create({ data: { typeName: data.typeName, typeKey: data.typeKey, description: data.description ?? null, sortOrder: data.sortOrder ?? 0, isActive: data.isActive ?? true } }));
}
export async function updateDictType(id: number, d: any) {
  const row = await prisma.dictType.findUnique({ where: { id } });
  if (!row) throw new ApiError(40003, '字典类型不存在');
  const data = dictTypeBody(d);
  if (data.typeKey && data.typeKey !== row.typeKey) {
    if (await prisma.dictType.findUnique({ where: { typeKey: data.typeKey } })) throw new ApiError(40001, '字典标识已存在');
    if (await prisma.dict.count({ where: { dictType: row.typeKey } }) > 0) throw new ApiError(40001, '字典类型下存在字典项，不允许修改标识');
  }
  const updated = await prisma.dictType.update({ where: { id }, data });
  return mapDictType(updated, await prisma.dict.count({ where: { dictType: updated.typeKey } }));
}
export async function deleteDictType(id: number) {
  const t = await prisma.dictType.findUnique({ where: { id } });
  if (!t) throw new ApiError(40003, '字典类型不存在');
  if (await prisma.dict.count({ where: { dictType: t.typeKey } }) > 0) throw new ApiError(40001, '字典类型下存在字典项，无法删除');
  await prisma.dictType.delete({ where: { id } });
  return true;
}

// Dict → 模板形状（{id, typeId, label, value, sort, enabled, type: {id, name, code}}）
function mapDictItem(x: any, typeRow: any) { return { id: x.id, typeId: typeRow?.id ?? null, label: x.dictLabel, value: x.dictValue, sort: x.sortOrder, enabled: x.isActive, tagType: 'info', remark: '', createdAt: x.createdAt, updatedAt: x.updatedAt, type: typeRow ? { id: typeRow.id, name: typeRow.typeName, code: typeRow.typeKey } : null }; }

export async function listDictData(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.type) where.dictType = String(query.type);
  if (query.typeId) { const t = await prisma.dictType.findUnique({ where: { id: Number(query.typeId) } }); where.dictType = t?.typeKey ?? '__none__'; }
  if (query.label) where.dictLabel = { contains: String(query.label) };
  const [rows, total] = await Promise.all([prisma.dict.findMany({ where, skip: (current - 1) * size, take: size, orderBy: [{ dictType: 'asc' }, { sortOrder: 'asc' }] }), prisma.dict.count({ where })]);
  const typeKeys = [...new Set(rows.map(r => r.dictType))];
  const types = typeKeys.length ? await prisma.dictType.findMany({ where: { typeKey: { in: typeKeys } } }) : [];
  const typeByKey = new Map(types.map(t => [t.typeKey, t]));
  return templatePage(rows.map(x => mapDictItem(x, typeByKey.get(x.dictType))), total, current, size);
}

// 字典项 body：接受 typeId（解析 typeKey）或 type 直传
async function resolveDictTypeKey(d: any): Promise<string | null> {
  if (d.type !== undefined) return d.type ? String(d.type) : null;
  if (d.typeId !== undefined) { const t = await prisma.dictType.findUnique({ where: { id: Number(d.typeId) } }); return t?.typeKey ?? null; }
  return null;
}

export async function createDictData(d: any) {
  const typeKey = await resolveDictTypeKey(d);
  if (!typeKey) throw new ApiError(40001, '字典类型无效');
  const created = await prisma.dict.create({ data: { dictType: typeKey, dictLabel: String(d.label ?? ''), dictValue: String(d.value ?? ''), sortOrder: Number(d.sort) || 0, isActive: d.enabled === undefined ? true : Boolean(d.enabled) } });
  return mapDictItem(created, await prisma.dictType.findUnique({ where: { typeKey } }));
}
export async function updateDictData(id: number, d: any) {
  const row = await prisma.dict.findUnique({ where: { id } });
  if (!row) throw new ApiError(40003, '字典数据不存在');
  const data: any = {};
  const typeKey = await resolveDictTypeKey(d);
  if (typeKey) data.dictType = typeKey;
  if (d.label !== undefined) data.dictLabel = String(d.label);
  if (d.value !== undefined) data.dictValue = String(d.value);
  if (d.sort !== undefined) data.sortOrder = Number(d.sort) || 0;
  if (d.enabled !== undefined) data.isActive = Boolean(d.enabled);
  const updated = await prisma.dict.update({ where: { id }, data });
  return mapDictItem(updated, await prisma.dictType.findUnique({ where: { typeKey: updated.dictType } }));
}
export async function deleteDictData(id: number) {
  const row = await prisma.dict.findUnique({ where: { id } });
  if (!row) throw new ApiError(40003, '字典数据不存在');
  await prisma.dict.delete({ where: { id } });
  return true;
}

// ===== 站点设置 =====

async function settingsMap() { const rows = await prisma.systemSetting.findMany(); const m: Record<string, string> = {}; for (const s of rows) m[s.settingKey] = s.settingValue || ''; return m; }
async function upsertSetting(key: string, value: any) { await prisma.systemSetting.upsert({ where: { settingKey: key }, create: { settingKey: key, settingValue: String(value) }, update: { settingValue: String(value) } }); }

// 模板扁平字段 → system_settings 键 映射（未覆盖字段返回默认值，不落库）
const SITE_FIELD_TO_KEY: Record<string, string> = {
  siteName: 'site_name', siteDescription: 'about_us', seoTitle: 'site_name', seoDescription: 'about_us', watermarkText: 'site_name',
  captchaEnabled: 'login_captcha', loginLockMinutes: 'lock_duration_minutes', loginMaxRetryCount: 'login_lock_threshold',
  appName: 'app_name', appVersion: 'app_version', themeColor: 'theme_color', supportPhone: 'customer_service_phone',
};

// 后台站点设置（照 mock 扁平形状 + 附加 groups 分组对象，分组映射复用 system.service 的 getAllSettings）
export async function getAdminSiteSettings() {
  const s = await settingsMap();
  const str = (k: string, d: string) => s[k] ?? d;
  const bool = (k: string, d: boolean) => (s[k] === undefined ? d : s[k] === 'true');
  const num = (k: string, d: number) => (s[k] === undefined || s[k] === '' ? d : Number(s[k]) || d);
  return {
    id: 1, key: 'default',
    siteName: str('site_name', '海大工坊'), siteDescription: str('about_us', ''),
    loginWelcomeTitle: '欢迎使用海大工坊', loginWelcomeDescription: '海南大学校园工具小程序管理后台',
    seoTitle: str('site_name', '海大工坊'), seoDescription: str('about_us', ''), seoKeywords: '',
    supportEmail: '', supportPhone: str('customer_service_phone', ''), contactAddress: '',
    copyrightText: 'Copyright © 海大工坊', icpNo: '', publicSecurityNo: '',
    maintenanceMode: false, maintenanceMessage: '',
    watermarkEnabled: false, watermarkMode: 'USERNAME', watermarkText: str('site_name', '海大工坊'),
    allowRegister: false, feedbackEnabled: true,
    captchaEnabled: bool('login_captcha', false), captchaType: 'IMAGE',
    loginMaxRetryCount: num('login_lock_threshold', 5), loginLockMinutes: num('lock_duration_minutes', 30),
    defaultLanguage: 'zh', orderPaymentTimeoutMinutes: 30,
    appName: str('app_name', '海大工坊'), appVersion: str('app_version', 'v1.0.0'), themeColor: str('theme_color', '#1D6FEB'),
    updatedAt: new Date().toISOString(),
    groups: await getAllSettings(),
  };
}

// 公开站点配置子集（前端键：site_name/app_name/theme_color 等）
export async function getPublicSiteSettings() {
  const s = await settingsMap();
  return {
    id: 1, key: 'default',
    siteName: s.site_name ?? '海大工坊', siteDescription: s.about_us ?? '',
    seoTitle: s.site_name ?? '海大工坊', seoDescription: s.about_us ?? '',
    copyrightText: 'Copyright © 海大工坊',
    maintenanceMode: false, allowRegister: false, feedbackEnabled: true,
    captchaEnabled: (s.login_captcha ?? 'false') === 'true', captchaType: 'IMAGE',
    defaultLanguage: 'zh',
    appName: s.app_name ?? '海大工坊', appVersion: s.app_version ?? 'v1.0.0', themeColor: s.theme_color ?? '#1D6FEB',
    updatedAt: new Date().toISOString(),
  };
}

// 更新站点设置：接受模板扁平字段（按映射落库）与分组对象（{basic:{...}} 键直写），逐键 upsert
export async function updateAdminSiteSettings(body: any) {
  const groups = body.groups || {};
  for (const g of ['basic', 'frontend', 'file', 'holiday']) for (const [k, v] of Object.entries(groups[g] || {})) await upsertSetting(k, v);
  for (const [field, v] of Object.entries(body)) {
    if (field === 'groups') continue;
    const key = SITE_FIELD_TO_KEY[field];
    if (key) await upsertSetting(key, typeof v === 'boolean' ? String(v) : v);
  }
  return getAdminSiteSettings();
}

// ===== 文件中心 =====

const EXT_MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };

// File 行 → 模板文件形状（含 url、creator）
async function mapFileRows(rows: any[]) {
  const adminIds = [...new Set(rows.map(r => r.uploaderId).filter((x): x is number => x !== null))];
  const admins = adminIds.length ? await prisma.adminUser.findMany({ where: { id: { in: adminIds } }, select: { id: true, username: true } }) : [];
  const adminById = new Map(admins.map(a => [a.id, a]));
  return rows.map(f => {
    const ext = (f.originalName.split('.').pop() || '').toLowerCase();
    const creatorAdmin = f.uploaderId !== null ? adminById.get(f.uploaderId) : undefined;
    const creator = creatorAdmin && f.uploaderId !== null ? { id: f.uploaderId, username: creatorAdmin.username } : null;
    return { id: f.id, fileNo: 'FILE-' + String(f.id).padStart(5, '0'), provider: 'LOCAL', bucket: 'local', objectKey: f.filePath, originalName: f.originalName, displayName: f.originalName, extension: ext, mimeType: f.mimeType, kind: f.mimeType.startsWith('image/') ? 'IMAGE' : 'OTHER', size: Number(f.fileSize), etag: null, width: null, height: null, duration: null, pageCount: null, visibility: 'PRIVATE', status: 'ACTIVE', tags: [], remark: null, metadata: null, publicToken: null, publicUrlExpiresAt: null, folder: null, creator, url: config.fileBaseUrl + f.filePath, createdAt: f.createdAt, updatedAt: f.createdAt };
  });
}

export async function listFiles(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.keyword) where.originalName = { contains: String(query.keyword) };
  const [rows, total] = await Promise.all([prisma.file.findMany({ where, skip: (current - 1) * size, take: size, orderBy: { createdAt: 'desc' } }), prisma.file.count({ where })]);
  return templatePage(await mapFileRows(rows), total, current, size);
}

// 发放上传凭证（简化实现：本地代理上传，限图片 5MB）
export function createUploadTicket() {
  return { ticketId: crypto.randomUUID(), sessionId: 'sess-upload-' + crypto.randomUUID().slice(0, 8), provider: 'LOCAL', bucket: 'local', objectKey: '', uploadUrl: '/api/v1/files/upload-proxy', method: 'POST', headers: {}, formData: {}, maxSize: 5 * 1024 * 1024, allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'], expiresAt: new Date(Date.now() + 3600000).toISOString() };
}

// 代理上传落库（磁盘保存复用 upload.service 的 saveImage），返回 {id, url, name, size}
export async function saveUploadFile(buf: Buffer, filename: string, uploaderId?: number) {
  if (!filename) throw new ApiError(40001, '缺少文件名');
  const { url } = saveImage(buf, filename);
  const filePath = url.startsWith(config.fileBaseUrl) ? url.slice(config.fileBaseUrl.length) : url;
  const f = await prisma.file.create({ data: { originalName: filename.substring(0, 255), storedName: filePath.split('/').pop() || '', filePath, fileSize: BigInt(buf.length), mimeType: EXT_MIME[(filename.split('.').pop() || '').toLowerCase()] || 'application/octet-stream', ...(uploaderId ? { uploaderId } : {}) } });
  return { id: f.id, url, name: f.originalName, size: buf.length };
}

export async function completeUpload(id: number) {
  const f = await prisma.file.findUnique({ where: { id } });
  if (!f) throw new ApiError(40003, '文件不存在');
  return { id: f.id, url: config.fileBaseUrl + f.filePath, name: f.originalName, size: Number(f.fileSize) };
}

export async function getPublicLink(id: number) {
  const f = await prisma.file.findUnique({ where: { id } });
  if (!f) throw new ApiError(40003, '文件不存在');
  return { token: 'pub-' + crypto.randomUUID().slice(0, 8), visibility: 'PUBLIC', publicUrl: config.fileBaseUrl + f.filePath, url: config.fileBaseUrl + f.filePath };
}

// 删除文件（删记录 + 删磁盘文件，复用 system.service 的 deleteFile）
export async function removeFile(id: number) { await deleteFileRecord(id); return true; }

// ===== 监控 =====

function parseBrowser(ua: string) { if (/edg\//i.test(ua)) return 'Edge'; if (/chrome/i.test(ua)) return 'Chrome'; if (/safari/i.test(ua)) return 'Safari'; if (/firefox/i.test(ua)) return 'Firefox'; return 'Unknown'; }
function parseOs(ua: string) { if (/windows/i.test(ua)) return 'Windows'; if (/mac os/i.test(ua)) return 'macOS'; if (/android/i.test(ua)) return 'Android'; if (/iphone|ipad/i.test(ua)) return 'iOS'; if (/linux/i.test(ua)) return 'Linux'; return 'Unknown'; }

// 在线用户：近 30 分钟 LoginLog 按用户去重（照 mock onlineUsers 项形状）
export async function getOnlineUsersList() {
  const since = new Date(Date.now() - 30 * 60 * 1000);
  const logs = await prisma.loginLog.findMany({ where: { createdAt: { gte: since }, userId: { not: null } }, orderBy: { createdAt: 'desc' }, select: { id: true, userId: true, ip: true, userAgent: true, createdAt: true } });
  const latest = new Map<number, any>();
  for (const l of logs) if (!latest.has(l.userId as number)) latest.set(l.userId as number, l);
  if (latest.size === 0) return [];
  const users = await prisma.user.findMany({ where: { id: { in: [...latest.keys()] } }, select: { id: true, uid: true, nickname: true, avatar: true } });
  return users.map(u => {
    const l = latest.get(u.id)!;
    return { sessionId: 'sess-' + l.id, userId: u.id, username: u.uid, realName: u.nickname, phone: null, email: null, avatar: u.avatar, department: null, post: null, roles: [], ip: l.ip || '', userAgent: l.userAgent || '', browser: parseBrowser(l.userAgent || ''), os: parseOs(l.userAgent || ''), deviceType: /mobile/i.test(l.userAgent || '') ? 'mobile' : 'pc', loginAt: l.createdAt, lastActiveAt: l.createdAt, lastRefreshAt: l.createdAt, revokedAt: null, revokeReason: null, status: 'ACTIVE', inactiveMinutes: 0, isCurrentSession: false, sessionAgeMinutes: Math.max(0, Math.floor((Date.now() - new Date(l.createdAt).getTime()) / 60000)) };
  });
}

// 在线用户分页（含 summary，照 mock）
export async function getOnlineUsersPage(query: any) {
  const { current, size } = parseCurrent(query);
  let list = await getOnlineUsersList();
  if (query.keyword) { const kw = String(query.keyword); list = list.filter(u => u.username.includes(kw) || u.realName.includes(kw)); }
  const result = templatePage(list.slice((current - 1) * size, current * size), list.length, current, size);
  return { ...result, summary: { total: list.length, activeCount: list.filter(u => u.status === 'ACTIVE').length, idleCount: list.filter(u => u.status === 'IDLE').length, uniqueUserCount: list.length, browserStats: [], generatedAt: new Date().toISOString() } };
}

// 强制下线（无 Redis 会话环境：记录 SystemLog 后直接返回已下线）
export async function forceLogoutSessions(ids: string[]) {
  await prisma.systemLog.create({ data: { level: 'warn', module: 'monitor', message: '强制下线会话：' + (ids.length ? ids.join(',') : '-') } });
  return { count: ids.length, message: '已下线', shouldLogout: false };
}

// 缓存监控（未接入 Redis：返回进程内存摘要 + uptime）
export function getCacheMonitor() {
  const m = process.memoryUsage();
  return { enabled: false, engine: 'memory', status: 'NOT_CONFIGURED', message: '未接入 Redis，展示进程内存信息', redis: 'not_configured', connection: null, metrics: { hitRate: 0, keyCount: 0, memoryUsed: Math.round(m.heapUsed / 1024) + ' KB', connectedClients: 0, opsPerSec: 0 }, manageableNamespaces: [], plannedPanels: [], actions: { canRefresh: false, canClear: false }, uptime: Math.floor(process.uptime()), memory: { rss: m.rss, heapTotal: m.heapTotal, heapUsed: m.heapUsed, external: m.external, usagePercent: m.heapTotal ? Math.round((m.heapUsed / m.heapTotal) * 100) : 0 }, updatedAt: new Date().toISOString() };
}

// 近 N 天每日登录量趋势（LoginLog 聚合）
async function loginTrendDays(days: number) {
  const start = new Date(Date.now() - (days - 1) * 86400000); start.setHours(0, 0, 0, 0);
  const logs = await prisma.loginLog.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true, status: true } });
  const buckets = Array.from({ length: days }, (_, i) => ({ date: new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10), successCount: 0, failCount: 0 }));
  for (const l of logs) {
    const idx = Math.floor((new Date(l.createdAt).setHours(0, 0, 0, 0) - start.getTime()) / 86400000);
    if (idx >= 0 && idx < days) { if (l.status === 'success') buckets[idx].successCount++; else buckets[idx].failCount++; }
  }
  return buckets;
}

// 服务器资源（os 模块实时数据，照 mock buildSystemResource 结构）
function buildSystemResource() {
  const total = os.totalmem(); const free = os.freemem(); const used = total - free; const mem = process.memoryUsage();
  return { hostname: os.hostname(), platform: process.platform, release: os.release(), arch: process.arch, nodeVersion: process.version, sampledAt: new Date().toISOString(), uptimeSeconds: Math.floor(process.uptime()), health: { score: 90, level: 'GOOD', warnings: [] }, cpu: { model: os.cpus()[0]?.model || '', cores: os.cpus().length, usagePercent: 0, loadAverage: os.loadavg() }, memory: { totalBytes: total, usedBytes: used, freeBytes: free, usagePercent: Math.round((used / total) * 100) }, storage: null, network: null, process: { pid: process.pid, uptimeSeconds: Math.floor(process.uptime()), rssBytes: mem.rss, heapUsedBytes: mem.heapUsed, heapTotalBytes: mem.heapTotal } };
}

// 监控概览（聚合：用户/今日登录/商品/帖子/待处理反馈与举报，照 mock overview 结构）
export async function getMonitorOverview() {
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const [totalUsers, todayLogins, todayLoginFail, totalMarketItems, totalPosts, pendingFeedbacks, pendingReports, settingsCount, todayOperations, online, trend, recentLoginRows] = await Promise.all([
    prisma.user.count(),
    prisma.loginLog.count({ where: { createdAt: { gte: startOfDay }, status: 'success' } }),
    prisma.loginLog.count({ where: { createdAt: { gte: startOfDay }, status: { not: 'success' } } }),
    prisma.marketplaceItem.count(),
    prisma.alumniPost.count(),
    prisma.userFeedback.count({ where: { status: 'pending' } }),
    prisma.report.count({ where: { status: 'pending' } }),
    prisma.systemSetting.count(),
    prisma.operationLog.count({ where: { createdAt: { gte: startOfDay } } }),
    getOnlineUsersList(),
    loginTrendDays(7),
    prisma.loginLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);
  const recentUserIds = [...new Set(recentLoginRows.map(l => l.userId).filter((x): x is number => x !== null))];
  const recentUsers = recentUserIds.length ? await prisma.user.findMany({ where: { id: { in: recentUserIds } }, select: { id: true, uid: true } }) : [];
  const uidById = new Map(recentUsers.map(u => [u.id, u.uid]));
  return {
    summary: { totalUsers, activeSessionCount: online.length, idleSessionCount: 0, uniqueOnlineUserCount: online.length, totalSessionCount: online.length, todayLoginSuccessCount: todayLogins, todayLoginFailCount: todayLoginFail, todayRefreshCount: 0, todayOperationCount: todayOperations, enabledTaskCount: 0, systemParamCount: settingsCount, securityLevel: 'LOW', totalMarketplaceItems: totalMarketItems, totalPosts, pendingFeedbackCount: pendingFeedbacks, pendingReportCount: pendingReports, generatedAt: new Date().toISOString() },
    loginTrend: trend,
    recentSessions: online.slice(0, 5),
    recentLogins: recentLoginRows.map(l => ({ id: l.id, logNo: 'LG-' + String(l.id).padStart(6, '0'), event: l.status === 'success' ? '登录成功' : '登录失败', userId: l.userId, username: l.userId !== null ? uidById.get(l.userId) || '' : '', ip: l.ip || '', location: '', deviceType: /mobile/i.test(l.userAgent || '') ? 'MOBILE' : 'PC', os: parseOs(l.userAgent || ''), browser: parseBrowser(l.userAgent || ''), userAgent: l.userAgent || '', status: l.status === 'success' ? 'SUCCESS' : 'FAIL', description: '', createdAt: l.createdAt })),
    systemResource: buildSystemResource(),
    cache: getCacheMonitor(),
  };
}

// 访客分析（LoginLog 聚合近 7 天登录趋势，缺的维度给零值，照 mock visitor-analytics 结构）
export async function getVisitorAnalytics(query: any) {
  const { current, size } = parseCurrent(query);
  const trend = await loginTrendDays(7);
  const visits = trend.map(t => t.successCount + t.failCount);
  const labels = trend.map(t => t.date.slice(5));
  return {
    snapshotAt: new Date().toISOString(),
    summary: { visitorCount: 0, businessVisitorCount: 0, demoVisitorCount: 0, lifetimeVisitorCount: 0, lifetimeDemoVisitorCount: 0, uniqueAccounts: 0, totalSessions: visits.reduce((s, v) => s + v, 0), totalPageViews: 0, highRiskCount: 0, highConfidenceCount: 0, averageConfidence: 0, accountReuseRate: 0 },
    trends: { '7d': { labels, visits, visitors: visits, trusted: visits.map(() => 0) }, '14d': { labels: [...labels, ...labels], visits: [...visits, ...visits], visitors: [...visits, ...visits], trusted: [] } },
    identityRules: [], confidenceBuckets: [], deviceDistribution: [], browserBreakdown: [], hourlyActivity: { labels: [], values: [] }, sharedAccountRanking: [], anomalyAlerts: [],
    records: { records: [], total: 0, current, size },
  };
}

// ===== 日志 =====

// 操作日志分页（detail JSON 内 operator/method/path 摊平，照 mock operationLogs 项形状）
export async function getOperationLogs(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.module) where.module = { contains: String(query.module) };
  const all = await prisma.operationLog.findMany({ where, orderBy: { createdAt: 'desc' } });
  let filtered = all;
  if (query.username) { const kw = String(query.username); filtered = all.filter(l => String((l.detail as any)?.operator || '').includes(kw)); }
  const records = filtered.slice((current - 1) * size, current * size).map(l => ({ id: l.id, logNo: 'OP-' + String(l.id).padStart(6, '0'), module: l.module || 'admin', operationType: l.action || '操作', description: l.action || '操作', method: (l.detail as any)?.method || '', path: (l.detail as any)?.path || '', userId: l.userId, username: (l.detail as any)?.operator || 'admin', ip: l.ip || '', status: 'SUCCESS', durationMs: 0, requestParams: null, responsePayload: null, responseCode: 200, errorMessage: null, createdAt: l.createdAt }));
  return templatePage(records, filtered.length, current, size);
}

// 清空操作日志（保留最近 7 天）
export async function clearOperationLogs() {
  const cutoff = new Date(Date.now() - 7 * 86400000);
  const r = await prisma.operationLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return r.count;
}

// 登录日志分页（uid 通过 User 关联取，无关联给 null，照 mock loginLogs 项形状）
export async function getLoginLogs(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.status) where.status = String(query.status);
  if (query.username) {
    const us = await prisma.user.findMany({ where: { uid: { contains: String(query.username) } }, select: { id: true } });
    where.userId = { in: us.map(u => u.id) };
  }
  const [rows, total] = await Promise.all([prisma.loginLog.findMany({ where, skip: (current - 1) * size, take: size, orderBy: { createdAt: 'desc' } }), prisma.loginLog.count({ where })]);
  const userIds = [...new Set(rows.map(r => r.userId).filter((x): x is number => x !== null))];
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, uid: true } }) : [];
  const uidById = new Map(users.map(u => [u.id, u.uid]));
  const records = rows.map(l => ({ id: l.id, logNo: 'LG-' + String(l.id).padStart(6, '0'), event: l.status === 'success' ? '登录成功' : '登录失败', userId: l.userId, username: l.userId !== null ? uidById.get(l.userId) || null : null, uid: l.userId !== null ? uidById.get(l.userId) || null : null, ip: l.ip || '', location: '', deviceType: /mobile/i.test(l.userAgent || '') ? 'MOBILE' : 'PC', os: parseOs(l.userAgent || ''), browser: parseBrowser(l.userAgent || ''), userAgent: l.userAgent || '', status: l.status === 'success' ? 'SUCCESS' : 'FAIL', description: '', createdAt: l.createdAt }));
  return templatePage(records, total, current, size);
}

// ===== 用户反馈 =====

// UserFeedback 状态 ↔ 模板状态映射（DB 仅 pending/handled）
const FEEDBACK_TO_TEMPLATE: Record<string, string> = { pending: 'NEW', handled: 'RESOLVED' };
const FEEDBACK_FROM_TEMPLATE: Record<string, string> = { NEW: 'pending', TRIAGING: 'pending', PLANNED: 'pending', IN_PROGRESS: 'pending', RESOLVED: 'handled', CLOSED: 'handled' };

function mapFeedback(f: any, uid: string | null) {
  return { id: f.id, feedbackNo: 'FB-' + String(f.id).padStart(4, '0'), type: 'OTHER', status: FEEDBACK_TO_TEMPLATE[f.status] || 'NEW', priority: 'LOW', title: (f.content || '').slice(0, 20), content: f.content, expectedBehavior: null, contactName: uid || '', contact: f.contact || '', pageTitle: '', pagePath: '', pageUrl: '', browser: '', os: '', deviceType: '', userAgent: '', ip: '', extra: null, handledRemark: null, handledAt: null, createdAt: f.createdAt, updatedAt: f.updatedAt, submitter: { id: f.userId, username: uid || '' }, handler: f.status === 'handled' ? { id: 1, username: 'admin' } : null, reply: null };
}

export async function getFeedbackList(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.status) where.status = FEEDBACK_FROM_TEMPLATE[String(query.status).toUpperCase()] || String(query.status);
  const [rows, total] = await Promise.all([prisma.userFeedback.findMany({ where, include: { user: { select: { uid: true } } }, skip: (current - 1) * size, take: size, orderBy: { createdAt: 'desc' } }), prisma.userFeedback.count({ where })]);
  let records = rows.map(f => mapFeedback(f, f.user?.uid || null));
  if (query.keyword) { const kw = String(query.keyword); records = records.filter(f => f.title.includes(kw) || f.content.includes(kw)); }
  return templatePage(records, total, current, size);
}

// 反馈概览（照 mock overview 形状：summary + statusBuckets + typeBuckets + latestRecords）
export async function getFeedbackOverview() {
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const [total, pending, handled, todayCount, latest] = await Promise.all([
    prisma.userFeedback.count(),
    prisma.userFeedback.count({ where: { status: 'pending' } }),
    prisma.userFeedback.count({ where: { status: 'handled' } }),
    prisma.userFeedback.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.userFeedback.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: { select: { uid: true } } } }),
  ]);
  const statuses = ['NEW', 'TRIAGING', 'PLANNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const countOf = (t: string) => (FEEDBACK_FROM_TEMPLATE[t] === 'pending' ? pending : FEEDBACK_FROM_TEMPLATE[t] === 'handled' ? handled : 0);
  return {
    summary: { totalCount: total, activeCount: pending, todayCount, resolvedCount: handled, generatedAt: new Date().toISOString() },
    statusBuckets: statuses.map(status => ({ status, count: countOf(status) })),
    typeBuckets: ['BUG', 'FEATURE', 'UX', 'PERFORMANCE', 'OTHER'].map(type => ({ type, count: type === 'OTHER' ? total : 0 })),
    latestRecords: latest.map(f => mapFeedback(f, f.user?.uid || null)),
  };
}

// 管理端代提交（UserFeedback.userId 外键指向小程序 users 表，管理端无对应userId，仅回显不落库）
export function createFeedbackAdmin(d: any) {
  return { id: 0, feedbackNo: 'FB-TEMP', type: d.type || 'OTHER', status: 'NEW', priority: d.priority || 'LOW', title: (d.title || d.content || '').slice(0, 20), content: d.content || '', contact: d.contact || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), submitter: { id: 0, username: 'admin' }, handler: null, reply: null };
}

// 处理反馈（DB 无 reply 字段——schema 限制，reply 忽略仅更新状态）
export async function handleFeedback(id: number, body: any) {
  const f = await prisma.userFeedback.findUnique({ where: { id } });
  if (!f) throw new ApiError(40003, '反馈不存在');
  const status = body.status ? FEEDBACK_FROM_TEMPLATE[String(body.status).toUpperCase()] || 'handled' : 'handled';
  return mapFeedback(await prisma.userFeedback.update({ where: { id }, data: { status } }), null);
}

// ===== 通知管理 =====

// 通知类型名 → 模板类型码（DB NotificationType.typeName 为中文）
const NOTIF_TYPE_CODE: Record<string, string> = { '系统通知': 'SYSTEM', '审核结果': 'ALERT', '活动提醒': 'UPDATE' };
const NOTIF_TARGETS = ['all', 'freshman', 'undergrad', 'grad'];

function mapNotification(n: any, readCount = 0) {
  return {
    id: n.id, title: n.title, summary: (n.content || '').replace(/<[^>]+>/g, '').slice(0, 50), content: n.content,
    type: NOTIF_TYPE_CODE[n.type?.typeName] || 'SYSTEM', status: n.isActive ? 'PUBLISHED' : 'DRAFT',
    targetType: n.target === 'all' ? 'ALL' : 'USER', targetRoleIds: [], targetDepartmentIds: [], targetUserIds: [],
    publishedAt: n.isActive ? n.publishTime : null, revokedAt: null, expiresAt: null, createdAt: n.createdAt, updatedAt: n.updatedAt,
    createdBy: null, updatedBy: null, recipientCount: 0, readCount, targetRoles: [], targetDepartments: [], targetUsers: [],
    typeInfo: { id: n.typeId, name: n.type?.typeName || '' }, target: n.target, isPublished: n.isActive, publishTime: n.publishTime,
  };
}

export async function getNotificationAdminList(query: any) {
  const { current, size } = parseCurrent(query);
  const where: any = {};
  if (query.target) where.target = String(query.target);
  if (query.status) where.isActive = String(query.status).toUpperCase() === 'PUBLISHED';
  const rows = await prisma.notification.findMany({ where, include: { type: true }, orderBy: { publishTime: 'desc' } });
  let filtered = rows;
  if (query.keyword) { const kw = String(query.keyword); filtered = rows.filter(n => n.title.includes(kw)); }
  const readCounts = await prisma.notificationRead.groupBy({ by: ['notificationId'], where: { notificationId: { in: filtered.map(n => n.id) } }, _count: { _all: true } });
  const readMap = new Map(readCounts.map(r => [r.notificationId, r._count._all]));
  return templatePage(filtered.slice((current - 1) * size, current * size).map(n => mapNotification(n, readMap.get(n.id) || 0)), filtered.length, current, size);
}

export async function getNotificationDetail(id: number) {
  const n = await prisma.notification.findUnique({ where: { id }, include: { type: true } });
  if (!n) throw new ApiError(40003, '通知不存在');
  return mapNotification(n, await prisma.notificationRead.count({ where: { notificationId: id } }));
}

function checkNotificationBody(d: any) { if (!d.typeId || !d.title || !d.content || !d.target) throw new ApiError(40001, '缺少必要参数'); if (!NOTIF_TARGETS.includes(d.target)) throw new ApiError(40001, '推送对象无效'); }

// 创建通知（默认草稿 isActive=false，发布走 /publish）
export async function createNotificationAdmin(d: any) {
  checkNotificationBody(d);
  const n = await prisma.notification.create({ data: { typeId: Number(d.typeId), title: String(d.title), content: String(d.content), target: d.target, isActive: false } });
  return mapNotification({ ...n, type: await prisma.notificationType.findUnique({ where: { id: n.typeId } }) });
}

export async function updateNotificationAdmin(id: number, d: any) {
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n) throw new ApiError(40003, '通知不存在');
  if (d.target && !NOTIF_TARGETS.includes(d.target)) throw new ApiError(40001, '推送对象无效');
  const data: any = {};
  for (const k of ['typeId', 'title', 'content', 'target']) if (d[k] !== undefined) data[k] = k === 'typeId' ? Number(d.typeId) : String(d[k]);
  const updated = await prisma.notification.update({ where: { id }, data });
  return mapNotification({ ...updated, type: await prisma.notificationType.findUnique({ where: { id: updated.typeId } }) });
}

// 发布通知（isActive=true + publishTime=now）
export async function publishNotification(id: number) {
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n) throw new ApiError(40003, '通知不存在');
  const updated = await prisma.notification.update({ where: { id }, data: { isActive: true, publishTime: new Date() } });
  return mapNotification({ ...updated, type: await prisma.notificationType.findUnique({ where: { id: updated.typeId } }) });
}

// 撤回通知（isActive=false）
export async function revokeNotification(id: number) {
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n) throw new ApiError(40003, '通知不存在');
  const updated = await prisma.notification.update({ where: { id }, data: { isActive: false } });
  return mapNotification({ ...updated, type: await prisma.notificationType.findUnique({ where: { id: updated.typeId } }) });
}

// 删除通知（连带清理已读记录）
export async function deleteNotificationAdmin(id: number) {
  await prisma.$transaction([prisma.notificationRead.deleteMany({ where: { notificationId: id } }), prisma.notification.delete({ where: { id } })]);
  return true;
}
