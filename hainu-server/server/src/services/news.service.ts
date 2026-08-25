import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/api-error';
import { paginatedResult } from '../utils/pagination';
export async function getNews(target: string, page = 1, size = 20) {
  // OR 条件：全部学生(all_student) + 当前身份(target) + 在校生(enrolled，本科生和研究生可见)
  const orTargets = [{ target: 'all_student' }, { target }];
  if (target === 'undergrad' || target === 'grad') orTargets.push({ target: 'enrolled' });
  const where = { isActive: true, status: 'published', OR: orTargets };
  const [list, total] = await Promise.all([prisma.news.findMany({ where, skip: (page-1)*size, take: size, orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }] }), prisma.news.count({ where })]);
  return paginatedResult(list, total, page, size);
}
export async function getNewsDetail(id: number) { const n = await prisma.news.findUnique({ where: { id } }); if (!n || !n.isActive) throw new ApiError(40003, '快讯不存在'); return n; }
