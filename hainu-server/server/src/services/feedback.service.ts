import { prisma } from '../utils/prisma';
import { paginatedResult } from '../utils/pagination';
const FEEDBACK_TYPES = ['BUG', 'FEATURE', 'UX', 'PERFORMANCE', 'OTHER'];
export async function submitFeedback(userId: number, data: { content: string; contact?: string; type?: string; title?: string; expectedBehavior?: string }) {
  const type = FEEDBACK_TYPES.includes(data.type || '') ? data.type! : 'OTHER';
  return prisma.userFeedback.create({ data: { userId, content: data.content, contact: data.contact || null, type, title: (data.title || data.content || '').slice(0, 100), expectedBehavior: data.expectedBehavior || null } });
}
export async function getMyFeedback(userId: number, page = 1, size = 20) { const [list, total] = await Promise.all([prisma.userFeedback.findMany({ where: { userId }, skip: (page-1)*size, take: size, orderBy: { createdAt: 'desc' } }), prisma.userFeedback.count({ where: { userId } })]); return paginatedResult(list, total, page, size); }
