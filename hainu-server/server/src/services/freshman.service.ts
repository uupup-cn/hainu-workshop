import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/api-error';
import { parsePagination, paginatedResult } from '../utils/pagination';

export async function getGuideEntries() { return prisma.guideEntry.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getGuideEntry(key: string) { const e = await prisma.guideEntry.findUnique({ where: { entryKey: key } }); if (!e || !e.isActive) throw new ApiError(40003, '条目不存在'); return e; }
export async function getLifeCampuses() { return prisma.campus.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getLifeTopics(campus: string) { return prisma.lifeTopic.findMany({ where: { campus, isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getLifeTopic(key: string) { const t = await prisma.lifeTopic.findFirst({ where: { topicKey: key, isActive: true } }); if (!t) throw new ApiError(40003, '主题不存在'); return t; }
export async function getFaqCategories() { return prisma.faqCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { questions: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } }); }
export async function getFaqQuestions(categoryId?: number, keyword?: string) { const where: any = { isActive: true }; if (categoryId) where.categoryId = Number(categoryId); if (keyword) where.question = { contains: keyword }; return prisma.faqQuestion.findMany({ where, orderBy: { sortOrder: 'asc' } }); }
export async function getFaqQuestion(id: number) { const f = await prisma.faqQuestion.findUnique({ where: { id } }); if (!f || !f.isActive) throw new ApiError(40003, '问题不存在'); return f; }
