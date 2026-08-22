import { prisma } from './prisma';

export async function generateUid(userId: number): Promise<string> {
  for (let i = 0; i < 100; i++) {
    const uid = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const exists = await prisma.uidLog.findUnique({ where: { uid } });
    if (!exists) {
      await prisma.uidLog.create({ data: { uid, userId } });
      return uid;
    }
  }
  throw new Error('UID 生成失败');
}
