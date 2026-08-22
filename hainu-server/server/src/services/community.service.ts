import { prisma } from '../utils/prisma';

// 社区模块启停（用户端只读）
export async function listModules() {
  return prisma.communityModule.findMany({ select: { moduleKey: true, moduleName: true, isEnabled: true }, orderBy: { id: 'asc' } });
}
