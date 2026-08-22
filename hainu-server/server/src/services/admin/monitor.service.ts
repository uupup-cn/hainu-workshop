// 系统监控服务：在线用户 / 缓存 / 服务器信息 / 系统日志 / 登录日志 / 操作日志 / 用户反馈
import * as os from 'os';
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { paginatedResult } from '../../utils/pagination';

// 在线用户：近 30 分钟 LoginLog 按用户去重（含最后活跃时间/身份，无记录返回空列表）
export async function getOnlineUsers() { const since = new Date(Date.now() - 30 * 60 * 1000); const logs = await prisma.loginLog.findMany({ where: { createdAt: { gte: since }, userId: { not: null } }, orderBy: { createdAt: 'desc' }, select: { userId: true, createdAt: true } }); const latest = new Map<number, Date>(); for (const l of logs) { const uidKey = l.userId as number; if (!latest.has(uidKey)) latest.set(uidKey, l.createdAt); } if (latest.size === 0) return []; const users = await prisma.user.findMany({ where: { id: { in: [...latest.keys()] } }, select: { id: true, uid: true, nickname: true, identity: true } }); return users.map(u => ({ uid: u.uid, nickname: u.nickname, identity: u.identity, lastActiveAt: latest.get(u.id) })); }

// 缓存信息（未接入 Redis，返回进程信息）
export function getCacheInfo() { return { uptime: process.uptime(), memory: process.memoryUsage(), redis: 'not_configured' }; }

// 清理缓存
export function clearCache() { return true; }

// 服务器信息（os 模块）
export function getServerInfo() { return { hostname: os.hostname(), platform: os.platform(), arch: os.arch(), cpuCount: os.cpus().length, freeMem: os.freemem(), totalMem: os.totalmem(), uptime: os.uptime(), loadAvg: os.loadavg(), nodeVersion: process.version }; }

// 系统日志（分页 + 关键字）
export async function getSystemLogs(page = 1, size = 20, keyword?: string) { const where = keyword ? { OR: [{ message: { contains: keyword } }, { module: { contains: keyword } }] } : {}; const [list, total] = await Promise.all([prisma.systemLog.findMany({ where, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.systemLog.count({ where })]); return paginatedResult(list, total, page, size); }

// 登录日志（分页 + uid 筛选，uid 解析为 userId）
export async function getLoginLogs(page = 1, size = 20, uid?: string) { let userId: number | undefined; if (uid) { const u = await prisma.user.findUnique({ where: { uid } }); if (!u) return paginatedResult([], 0, page, size); userId = u.id; } const where = userId ? { userId } : {}; const [list, total] = await Promise.all([prisma.loginLog.findMany({ where, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.loginLog.count({ where })]); return paginatedResult(list, total, page, size); }

// 操作日志（分页 + 关键字）
export async function getOperationLogs(page = 1, size = 20, keyword?: string) { const where = keyword ? { OR: [{ action: { contains: keyword } }, { module: { contains: keyword } }] } : {}; const [list, total] = await Promise.all([prisma.operationLog.findMany({ where, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.operationLog.count({ where })]); return paginatedResult(list, total, page, size); }

// 用户反馈（分页 + status 筛选 pending/handled，含反馈用户）
export async function getFeedbacks(page = 1, size = 20, status?: string) { const where = status ? { status } : {}; const [list, total] = await Promise.all([prisma.userFeedback.findMany({ where, include: { user: { select: { uid: true, nickname: true } } }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.userFeedback.count({ where })]); return paginatedResult(list, total, page, size); }

// 处理反馈：schema UserFeedback 无 reply 字段，按 schema 仅更新状态为 handled
export async function handleFeedback(id: number) { const f = await prisma.userFeedback.findUnique({ where: { id } }); if (!f) throw new ApiError(40003, '反馈不存在'); return prisma.userFeedback.update({ where: { id }, data: { status: 'handled' } }); }
