import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/api-error';
import { parsePagination, paginatedResult } from '../utils/pagination';

export async function getCampuses() { return prisma.campus.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getColleges(campusId?: number) { return prisma.college.findMany({ where: { isActive: true, ...(campusId ? { campusId } : {}) }, orderBy: { sortOrder: 'asc' } }); }
export async function getDepartments(campusId?: number) { return prisma.department.findMany({ where: { isActive: true, ...(campusId ? { campusId } : {}) }, orderBy: { sortOrder: 'asc' } }); }
export async function getMajors(departmentId?: number) { return prisma.major.findMany({ where: { isActive: true, ...(departmentId ? { departmentId } : {}) }, orderBy: { sortOrder: 'asc' } }); }
export async function getBuildings(collegeId?: number) { return prisma.building.findMany({ where: { isActive: true, ...(collegeId ? { collegeId } : {}) }, orderBy: { sortOrder: 'asc' } }); }
