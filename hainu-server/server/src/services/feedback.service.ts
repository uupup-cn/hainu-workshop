import { prisma } from '../utils/prisma';
import { paginatedResult } from '../utils/pagination';
export async function submitFeedback(userId: number, content: string, contact?: string) { return prisma.userFeedback.create({ data: { userId, content, contact } }); }
export async function getMyFeedback(userId: number, page = 1, size = 20) { const [list, total] = await Promise.all([prisma.userFeedback.findMany({ where: { userId }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.userFeedback.count({ where: { userId } })]); return paginatedResult(list, total, page, size); }
