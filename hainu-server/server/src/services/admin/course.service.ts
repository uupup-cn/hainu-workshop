// 课表管理服务：课程库 / 课程颜色 / 学期 / 学期周制 / 节次 / 分享码（管理端）
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { paginatedResult } from '../../utils/pagination';

// 课程库列表（分页 + 课程名关键字筛选，含拥有者 uid 关联）
export async function listCourses(page = 1, size = 20, keyword?: string) { const where = keyword ? { courseName: { contains: keyword } } : {}; const [list, total] = await Promise.all([prisma.course.findMany({ where, include: { user: { select: { uid: true, nickname: true } } }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.course.count({ where })]); return paginatedResult(list, total, page, size); }

// 删除课程库课程（Course 无子关联可直接删；ShareCode 为 JSON 快照不受影响）
export async function deleteCourse(id: number) { const c = await prisma.course.findUnique({ where: { id } }); if (!c) throw new ApiError(40003, '课程不存在'); await prisma.course.delete({ where: { id } }); return true; }

// 课程颜色 CRUD
export const courseColors = { list: () => prisma.courseColor.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.courseColor.create({ data: d }), update: (id: number, d: any) => prisma.courseColor.update({ where: { id }, data: d }), delete: (id: number) => prisma.courseColor.delete({ where: { id } }) };

// 学期 CRUD（删除时联动清理学期周制）
export const semesters = { list: () => prisma.semester.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.semester.create({ data: d }), update: (id: number, d: any) => prisma.semester.update({ where: { id }, data: d }), delete: async (id: number) => { await prisma.$transaction([prisma.termWeek.deleteMany({ where: { semesterId: id } }), prisma.semester.delete({ where: { id } })]); return true; } };

// 学期周制 CRUD（列表可按 semesterId 筛选）
export const termWeeks = { list: (semesterId?: number) => prisma.termWeek.findMany({ where: semesterId ? { semesterId } : {}, orderBy: [{ semesterId: 'asc' }, { weekNumber: 'asc' }] }), create: (d: any) => prisma.termWeek.create({ data: d }), update: (id: number, d: any) => prisma.termWeek.update({ where: { id }, data: d }), delete: (id: number) => prisma.termWeek.delete({ where: { id } }) };

// 节次 CRUD
export const sections = { list: () => prisma.section.findMany({ orderBy: [{ sortOrder: 'asc' }, { sectionNumber: 'asc' }] }), create: (d: any) => prisma.section.create({ data: d }), update: (id: number, d: any) => prisma.section.update({ where: { id }, data: d }), delete: (id: number) => prisma.section.delete({ where: { id } }) };

// 分享码列表（分页，含拥有者 uid 关联）
export async function listShareCodes(page = 1, size = 20) { const [list, total] = await Promise.all([prisma.shareCode.findMany({ include: { user: { select: { uid: true, nickname: true } } }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.shareCode.count()]); return paginatedResult(list, total, page, size); }

// 分享码启停（active/disabled）
export async function updateShareCodeStatus(id: number, status: string) { if (!['active', 'disabled'].includes(status)) throw new ApiError(40001, '状态值无效'); const sc = await prisma.shareCode.findUnique({ where: { id } }); if (!sc) throw new ApiError(40003, '分享码不存在'); return prisma.shareCode.update({ where: { id }, data: { status } }); }
