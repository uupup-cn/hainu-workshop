import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/api-error';
import { parsePagination, paginatedResult } from '../utils/pagination';

// 海大介绍
export async function getIntroEntries() { return prisma.introEntry.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getIntroEntry(key: string) { const e = await prisma.introEntry.findUnique({ where: { entryKey: key } }); if (!e || !e.isActive) throw new ApiError(40003, '条目不存在'); return e; }
// 电话簿
export async function getPhonebookCategories() { return prisma.phonebookCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { entries: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } }); }
export async function getPhonebookEntries(categoryId?: number, keyword?: string) { const where: any = { isActive: true }; if (categoryId) where.categoryId = Number(categoryId); if (keyword) where.departmentName = { contains: keyword }; return prisma.phonebookEntry.findMany({ where, orderBy: { sortOrder: 'asc' } }); }
// 校历
export async function getCalendar() { const s = await prisma.calendarSetting.findMany(); return s[0] || null; }
// 校园地图
export async function getMaps() { return prisma.mapSetting.findMany(); }
export async function getMap(campus: string) { const m = await prisma.mapSetting.findFirst({ where: { campus }, include: { markers: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } }); if (!m) throw new ApiError(40003, '地图不存在'); return m; }
// 校园出行
export async function getBusSchedules() { return prisma.busSchedule.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getBusStations() { return prisma.busStation.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getBusGuide() { const g = await prisma.busGuide.findFirst(); return g || { content: '' }; }
