// 工具管理服务：工具分类 / 工具（含积分配置）/ 使用记录 / 影视解析线路（管理端）
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { paginatedResult } from '../../utils/pagination';

const POINTS_MODES = ['per_use', 'one_time', 'free'];

// 校验积分模式枚举
function checkPointsMode(d: any) { if (d.pointsMode && !POINTS_MODES.includes(d.pointsMode)) throw new ApiError(40001, '积分模式无效'); }

// 工具分类 CRUD（删除前检查是否有工具挂载）
export const toolCategories = { list: () => prisma.toolCategory.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.toolCategory.create({ data: d }), update: (id: number, d: any) => prisma.toolCategory.update({ where: { id }, data: d }), delete: async (id: number) => { const c = await prisma.tool.count({ where: { categoryId: id } }); if (c > 0) throw new ApiError(40001, '分类下存在工具，无法删除'); return prisma.toolCategory.delete({ where: { id } }); } };

// 工具 CRUD（删除时联动清理使用记录与解锁记录）
export const tools = { list: () => prisma.tool.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], include: { category: true } }), create: async (d: any) => { checkPointsMode(d); return prisma.tool.create({ data: d }); }, update: async (id: number, d: any) => { checkPointsMode(d); return prisma.tool.update({ where: { id }, data: d }); }, delete: async (id: number) => { await prisma.$transaction([prisma.toolUsageLog.deleteMany({ where: { toolId: id } }), prisma.toolUnlock.deleteMany({ where: { toolId: id } }), prisma.tool.delete({ where: { id } })]); return true; } };

// 工具使用记录列表（分页 + toolKey 筛选，含用户 uid）
export async function listUsageLogs(page = 1, size = 20, toolKey?: string) { const where = toolKey ? { tool: { toolKey } } : {}; const [list, total] = await Promise.all([prisma.toolUsageLog.findMany({ where, include: { user: { select: { uid: true, nickname: true } }, tool: { select: { toolName: true, toolKey: true } } }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.toolUsageLog.count({ where })]); return paginatedResult(list, total, page, size); }

// 影视解析线路 CRUD
export const videoParseLines = { list: () => prisma.videoParseLine.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.videoParseLine.create({ data: d }), update: (id: number, d: any) => prisma.videoParseLine.update({ where: { id }, data: d }), delete: (id: number) => prisma.videoParseLine.delete({ where: { id } }) };
