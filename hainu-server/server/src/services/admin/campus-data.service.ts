import { prisma } from '../../utils/prisma';
import { sanitizeHtml } from '../../utils/html-sanitize';

// 富文本 description 字段过滤
function sanitizeDesc(d: any): any {
  const r = { ...d };
  if (typeof r.description === 'string') r.description = sanitizeHtml(r.description);
  return r;
}

export const campuses = { list: () => prisma.campus.findMany({ orderBy: { sortOrder: 'asc' } }), create: (d: any) => prisma.campus.create({ data: sanitizeDesc(d) }), update: (id: number, d: any) => prisma.campus.update({ where: { id }, data: sanitizeDesc(d) }), delete: (id: number) => prisma.campus.delete({ where: { id } }) };
export const colleges = { list: (cid?: number) => prisma.college.findMany({ where: cid ? { campusId: cid } : {}, orderBy: { sortOrder: 'asc' }, include: { buildings: { orderBy: { sortOrder: 'asc' } } } }), create: (d: any) => prisma.college.create({ data: sanitizeDesc(d) }), update: (id: number, d: any) => prisma.college.update({ where: { id }, data: sanitizeDesc(d) }), delete: (id: number) => prisma.college.delete({ where: { id } }) };
export const departments = { list: (cid?: number) => prisma.department.findMany({ where: cid ? { campusId: cid } : {}, orderBy: { sortOrder: 'asc' }, include: { campus: true } }), create: (d: any) => prisma.department.create({ data: sanitizeDesc(d) }), update: (id: number, d: any) => prisma.department.update({ where: { id }, data: sanitizeDesc(d) }), delete: (id: number) => prisma.department.delete({ where: { id } }) };
export const majors = { list: (did?: number) => prisma.major.findMany({ where: did ? { departmentId: did } : {}, orderBy: { sortOrder: 'asc' }, include: { department: true } }), create: (d: any) => prisma.major.create({ data: sanitizeDesc(d) }), update: (id: number, d: any) => prisma.major.update({ where: { id }, data: sanitizeDesc(d) }), delete: (id: number) => prisma.major.delete({ where: { id } }) };
export const buildings = { list: (cid?: number) => prisma.building.findMany({ where: cid ? { collegeId: cid } : {}, orderBy: { sortOrder: 'asc' }, include: { college: true } }), create: (d: any) => prisma.building.create({ data: sanitizeDesc(d) }), update: (id: number, d: any) => prisma.building.update({ where: { id }, data: sanitizeDesc(d) }), delete: (id: number) => prisma.building.delete({ where: { id } }) };

// 书院+楼栋树形数据（按校区过滤）
export async function getCollegeTree(campusId?: number) {
  return prisma.college.findMany({ where: campusId ? { campusId } : {}, orderBy: { sortOrder: 'asc' }, include: { buildings: { orderBy: { sortOrder: 'asc' } } } });
}
