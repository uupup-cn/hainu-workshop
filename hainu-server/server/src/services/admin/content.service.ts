// 内容管理 + 找室友管理 管理端服务（入学指南/生活攻略/FAQ/海大介绍/电话簿/校历/地图/出行/找室友）
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { paginatedResult } from '../../utils/pagination';
import { sanitizeHtml } from '../../utils/html-sanitize';

// 富文本字段过滤（content/answer）
function sanitizeContent(d: any, fields: string[] = ['content']): any {
  const r = { ...d };
  for (const f of fields) if (typeof r[f] === 'string') r[f] = sanitizeHtml(r[f]);
  return r;
}

// ========== 入学指南 ==========
export const guideEntries = {
  list: (keyword?: string) => prisma.guideEntry.findMany({ where: keyword ? { entryTitle: { contains: keyword } } : {}, orderBy: { sortOrder: 'asc' } }),
  get: async (id: number) => { const e = await prisma.guideEntry.findUnique({ where: { id } }); if (!e) throw new ApiError(40003, '条目不存在'); return e; },
  create: (d: any) => prisma.guideEntry.create({ data: sanitizeContent(d) }),
  update: (id: number, d: any) => prisma.guideEntry.update({ where: { id }, data: sanitizeContent(d) }),
  delete: (id: number) => prisma.guideEntry.delete({ where: { id } }),
};
// ========== 生活攻略 ==========
export const lifeTopics = {
  list: (campus?: string, keyword?: string) => { const where: any = {}; if (campus) where.campus = campus; if (keyword) where.topicTitle = { contains: keyword }; return prisma.lifeTopic.findMany({ where, orderBy: { sortOrder: 'asc' } }); },
  get: async (id: number) => { const t = await prisma.lifeTopic.findUnique({ where: { id } }); if (!t) throw new ApiError(40003, '主题不存在'); return t; },
  create: (d: any) => prisma.lifeTopic.create({ data: sanitizeContent(d) }),
  update: (id: number, d: any) => prisma.lifeTopic.update({ where: { id }, data: sanitizeContent(d) }),
  delete: (id: number) => prisma.lifeTopic.delete({ where: { id } }),
};
// ========== 新生 FAQ 分类 ==========
export const faqCategories = {
  list: (keyword?: string) => prisma.faqCategory.findMany({ where: keyword ? { categoryName: { contains: keyword } } : {}, orderBy: { sortOrder: 'asc' } }),
  get: async (id: number) => { const c = await prisma.faqCategory.findUnique({ where: { id } }); if (!c) throw new ApiError(40003, '分类不存在'); return c; },
  create: (d: any) => prisma.faqCategory.create({ data: d }),
  update: (id: number, d: any) => prisma.faqCategory.update({ where: { id }, data: d }),
  delete: async (id: number) => { const n = await prisma.faqQuestion.count({ where: { categoryId: id } }); if (n > 0) throw new ApiError(40001, '该分类下存在问题，无法删除'); return prisma.faqCategory.delete({ where: { id } }); },
};
// ========== 新生 FAQ 问题 ==========
export const faqQuestions = {
  list: (categoryId?: number, keyword?: string) => { const where: any = {}; if (categoryId) where.categoryId = Number(categoryId); if (keyword) where.question = { contains: keyword }; return prisma.faqQuestion.findMany({ where, orderBy: { sortOrder: 'asc' } }); },
  get: async (id: number) => { const q = await prisma.faqQuestion.findUnique({ where: { id } }); if (!q) throw new ApiError(40003, '问题不存在'); return q; },
  create: (d: any) => prisma.faqQuestion.create({ data: sanitizeContent(d, ["answer"]) }),
  update: (id: number, d: any) => prisma.faqQuestion.update({ where: { id }, data: sanitizeContent(d, ["answer"]) }),
  delete: (id: number) => prisma.faqQuestion.delete({ where: { id } }),
};
// ========== 海大介绍 ==========
export const introEntries = {
  list: (keyword?: string) => prisma.introEntry.findMany({ where: keyword ? { entryTitle: { contains: keyword } } : {}, orderBy: { sortOrder: 'asc' } }),
  get: async (id: number) => { const e = await prisma.introEntry.findUnique({ where: { id } }); if (!e) throw new ApiError(40003, '条目不存在'); return e; },
  create: (d: any) => prisma.introEntry.create({ data: sanitizeContent(d) }),
  update: (id: number, d: any) => prisma.introEntry.update({ where: { id }, data: sanitizeContent(d) }),
  delete: (id: number) => prisma.introEntry.delete({ where: { id } }),
};
// ========== 电话簿分类 ==========
export const phonebookCategories = {
  list: (campusId?: number, keyword?: string) => { const where: any = {}; if (campusId) where.campusId = Number(campusId); if (keyword) where.categoryName = { contains: keyword }; return prisma.phonebookCategory.findMany({ where, orderBy: { sortOrder: 'asc' } }); },
  get: async (id: number) => { const c = await prisma.phonebookCategory.findUnique({ where: { id } }); if (!c) throw new ApiError(40003, '分类不存在'); return c; },
  create: (d: any) => prisma.phonebookCategory.create({ data: d }),
  update: (id: number, d: any) => prisma.phonebookCategory.update({ where: { id }, data: d }),
  delete: async (id: number) => { const n = await prisma.phonebookEntry.count({ where: { categoryId: id } }); if (n > 0) throw new ApiError(40001, '该分类下存在电话条目，无法删除'); return prisma.phonebookCategory.delete({ where: { id } }); },
};
// ========== 电话簿条目 ==========
export const phonebookEntries = {
  list: (categoryId?: number, keyword?: string) => { const where: any = {}; if (categoryId) where.categoryId = Number(categoryId); if (keyword) where.departmentName = { contains: keyword }; return prisma.phonebookEntry.findMany({ where, orderBy: { sortOrder: 'asc' } }); },
  get: async (id: number) => { const e = await prisma.phonebookEntry.findUnique({ where: { id } }); if (!e) throw new ApiError(40003, '电话条目不存在'); return e; },
  create: (d: any) => prisma.phonebookEntry.create({ data: d }),
  update: (id: number, d: any) => prisma.phonebookEntry.update({ where: { id }, data: d }),
  delete: (id: number) => prisma.phonebookEntry.delete({ where: { id } }),
};
// ========== 校历（单例设置：列表 + 按 id 编辑） ==========
export const calendar = {
  list: () => prisma.calendarSetting.findMany(),
  update: async (id: number, d: any) => { const c = await prisma.calendarSetting.findUnique({ where: { id } }); if (!c) throw new ApiError(40003, '校历配置不存在'); return prisma.calendarSetting.update({ where: { id }, data: d }); },
};
// ========== 校园地图（设置 + 地图标记） ==========
export const maps = {
  list: () => prisma.mapSetting.findMany(),
  update: async (id: number, d: any) => { const m = await prisma.mapSetting.findUnique({ where: { id } }); if (!m) throw new ApiError(40003, '地图不存在'); return prisma.mapSetting.update({ where: { id }, data: d }); },
};
export const mapMarkers = {
  list: (mapId: number) => prisma.mapMarker.findMany({ where: { mapId }, orderBy: { sortOrder: 'asc' } }),
  create: (mapId: number, d: any) => prisma.mapMarker.create({ data: { ...d, mapId } }),
  update: (id: number, d: any) => prisma.mapMarker.update({ where: { id }, data: d }),
  delete: (id: number) => prisma.mapMarker.delete({ where: { id } }),
};
// ========== 校园出行（班车时刻 / 车站） ==========
export const busSchedules = {
  list: (keyword?: string) => prisma.busSchedule.findMany({ where: keyword ? { lineName: { contains: keyword } } : {}, orderBy: { sortOrder: 'asc' } }),
  get: async (id: number) => { const s = await prisma.busSchedule.findUnique({ where: { id } }); if (!s) throw new ApiError(40003, '班次不存在'); return s; },
  create: (d: any) => prisma.busSchedule.create({ data: d }),
  update: (id: number, d: any) => prisma.busSchedule.update({ where: { id }, data: d }),
  delete: (id: number) => prisma.busSchedule.delete({ where: { id } }),
};
export const busStations = {
  list: (keyword?: string) => prisma.busStation.findMany({ where: keyword ? { stationName: { contains: keyword } } : {}, orderBy: { sortOrder: 'asc' } }),
  get: async (id: number) => { const s = await prisma.busStation.findUnique({ where: { id } }); if (!s) throw new ApiError(40003, '车站不存在'); return s; },
  create: (d: any) => prisma.busStation.create({ data: d }),
  update: (id: number, d: any) => prisma.busStation.update({ where: { id }, data: d }),
  delete: (id: number) => prisma.busStation.delete({ where: { id } }),
};
// ========== 找室友管理 ==========
// 功能配置（单例：取第一条，更新时不存在则创建）
export async function getRoommateSetting() { return prisma.roommateSetting.findFirst(); }
export async function updateRoommateSetting(d: any) {
  const data: any = {};
  if (d.isEnabled !== undefined) data.isEnabled = !!d.isEnabled;
  if (d.startDate !== undefined) data.startDate = d.startDate ? new Date(d.startDate) : null;
  if (d.endDate !== undefined) data.endDate = d.endDate ? new Date(d.endDate) : null;
  if (d.maxModifyCount !== undefined) data.maxModifyCount = Number(d.maxModifyCount);
  const s = await prisma.roommateSetting.findFirst();
  if (s) return prisma.roommateSetting.update({ where: { id: s.id }, data });
  return prisma.roommateSetting.create({ data });
}
// schema 中 RoommatePost 未建校区/书院/学院/专业/楼栋外键关联，名称需手动映射
async function withOrgNames(list: any[]) {
  const [cs, cols, deps, majors, blds] = await Promise.all([prisma.campus.findMany(), prisma.college.findMany(), prisma.department.findMany(), prisma.major.findMany(), prisma.building.findMany()]);
  const cn: any = {}; cs.forEach((c: any) => { cn[c.id] = c.campusName; });
  const coln: any = {}; cols.forEach((c: any) => { coln[c.id] = c.collegeName; });
  const dn: any = {}; deps.forEach((d: any) => { dn[d.id] = d.departmentName; });
  const mn: any = {}; majors.forEach((m: any) => { mn[m.id] = m.majorName; });
  const bn: any = {}; blds.forEach((b: any) => { bn[b.id] = b.buildingName; });
  return list.map(p => ({ ...p, campusName: cn[p.campusId] || '', collegeName: coln[p.collegeId] || '', departmentName: dn[p.departmentId] || '', majorName: mn[p.majorId] || '', buildingName: bn[p.buildingId] || '' }));
}
export async function getRoommatePosts(page: number, size: number, campusId?: number) {
  const where: any = {}; if (campusId) where.campusId = Number(campusId);
  const [list, total] = await Promise.all([
    prisma.roommatePost.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' }, include: { user: { select: { uid: true, nickname: true } } } }),
    prisma.roommatePost.count({ where }),
  ]);
  return paginatedResult(await withOrgNames(list), total, page, size);
}
export async function getRoommatePost(id: number) {
  const p = await prisma.roommatePost.findUnique({ where: { id }, include: { user: { select: { uid: true, nickname: true } } } });
  if (!p) throw new ApiError(40003, '发布信息不存在');
  return (await withOrgNames([p]))[0];
}
export async function deleteRoommatePost(id: number) {
  const p = await prisma.roommatePost.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '发布信息不存在');
  await prisma.roommatePost.delete({ where: { id } });
  return true;
}
// 乘车指南（单例：有则更新，无则创建）
export const busGuide = {
  get: async () => (await prisma.busGuide.findFirst()) || { content: '' },
  update: async (content: string) => { const safe = sanitizeHtml(content); const g = await prisma.busGuide.findFirst(); if (g) return prisma.busGuide.update({ where: { id: g.id }, data: { content: safe } }); return prisma.busGuide.create({ data: { content: safe } }); },
};
