import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/api-error';
import { config } from '../config';
import { computeToolResult } from '../utils/tool-compute';
export async function getCategories() { return prisma.toolCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function getTools(categoryId?: number) { return prisma.tool.findMany({ where: { isActive: true, ...(categoryId ? { categoryId } : {}) }, orderBy: { sortOrder: 'asc' } }); }
export async function getTool(key: string) { const t = await prisma.tool.findUnique({ where: { toolKey: key } }); if (!t || !t.isActive) throw new ApiError(40003, '工具不存在'); return t; }
export async function useTool(toolKey: string, userId: number, identity: string, params: any) {
  const tool = await getTool(toolKey);
  let pc = 0; let unlocked = false;
  let pointsLogId = 0; let unlockedNow = false; // 当次积分流水 id / 本次是否新触发解锁，用于计算失败回滚
  if (tool.pointsEnabled) {
    const u = await prisma.user.findUnique({ where: { id: userId } });
    if (!u || !u.pointsEnabled) throw new ApiError(40004, '需认证后使用');
    if (tool.pointsMode === 'per_use') {
      if (u.points < tool.pointsCost) throw new ApiError(40013, '积分不足');
      await prisma.user.update({ where: { id: userId }, data: { points: { decrement: tool.pointsCost } } });
      const pl = await prisma.pointsLog.create({
        data: { userId, points: -tool.pointsCost, reason: '工具使用:' + tool.toolName }
      });
      pc = tool.pointsCost; pointsLogId = pl.id;
    } else if (tool.pointsMode === 'one_time') {
      const ul = await prisma.toolUnlock.findUnique({ where: { toolId_userId: { toolId: tool.id, userId } } });
      if (ul) { unlocked = true; } else {
        if (u.points < tool.pointsCost) throw new ApiError(40013, '积分不足');
        const [, , pl] = await prisma.$transaction([
          prisma.user.update({ where: { id: userId }, data: { points: { decrement: tool.pointsCost } } }),
          prisma.toolUnlock.create({ data: { toolId: tool.id, userId, pointsConsumed: tool.pointsCost } }),
          prisma.pointsLog.create({ data: { userId, points: -tool.pointsCost, reason: '工具解锁:' + tool.toolName } })
        ]);
        pc = tool.pointsCost; unlocked = true; unlockedNow = true; pointsLogId = pl.id;
      }
    }
  }
  let result: any;
  try { result = computeToolResult(toolKey, params); } catch (err) {
    // 计算失败回滚本次扣分：per_use 加回并删当次流水；one_time 新触发的解锁一并撤销（未发生解锁则无扣分）
    if (pc > 0) {
      await prisma.$transaction([
        prisma.user.update({ where: { id: userId }, data: { points: { increment: pc } } }),
        ...(pointsLogId ? [prisma.pointsLog.delete({ where: { id: pointsLogId } })] : []),
        ...(unlockedNow ? [prisma.toolUnlock.delete({ where: { toolId_userId: { toolId: tool.id, userId } } })] : [])
      ]);
    }
    throw err; // 原始错误直接上抛，由 errorHandler 转为 50000 + 中文消息
  }
  await prisma.toolUsageLog.create({
    data: { toolId: tool.id, userId, pointsConsumed: pc, resultData: params || {} }
  });
  return { result, pointsConsumed: pc, unlocked };
}
export async function shareTool(toolKey: string, userId: number, data: any) {
  const tool = await getTool(toolKey);
  await prisma.toolUsageLog.updateMany({
    where: { toolId: tool.id, userId }, data: { isShared: true, shareType: data.shareType }
  });
  // 结果数据编码进 data 参数，前端页面渲染分享卡与海报（poster=1 为海报模式）
  const resultData: any = (data && (data.resultData || data)) || {};
  if (toolKey === 'schulte' && resultData.grid === undefined && data && data.grid !== undefined) {
    resultData.grid = data.grid; // 海报区分难度
  }
  const dataCode = Buffer.from(JSON.stringify(resultData)).toString('base64url');
  const shareUrl = config.fileBaseUrl + '/share/' + toolKey + '?data=' + dataCode;
  const posterUrl = shareUrl + '&poster=1';
  return { shareUrl, posterUrl };
}
export async function getVideoParseLines() { return prisma.videoParseLine.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
export async function videoParse(userId: number, videoUrl: string, lineId: number) {
  if (!videoUrl || typeof videoUrl !== 'string') throw new ApiError(40001, '视频链接不能为空');
  if (!Number.isInteger(lineId)) throw new ApiError(40001, '解析线路参数不合法');
  const line = await prisma.videoParseLine.findFirst({ where: { id: lineId, isActive: true } });
  if (!line) throw new ApiError(40003, '解析线路不存在或已停用');
  const tool = await prisma.tool.findUnique({ where: { toolKey: 'video-parse' } });
  if (tool) {
    await prisma.toolUsageLog.create({
      data: { toolId: tool.id, userId, pointsConsumed: 0, resultData: { videoUrl, lineId } }
    });
  }
  return { parseUrl: line.apiUrl + encodeURIComponent(videoUrl), lineName: line.lineName };
}
