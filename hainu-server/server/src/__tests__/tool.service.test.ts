// 工具箱服务测试（需数据库）：覆盖 PRD §3.6.6 积分用例 1-10 + 计算失败回滚 + 分享 + 影视解析
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../utils/prisma';
import * as svc from '../services/tool.service';
import { config } from '../config';

const ts = Date.now();
// 随机盐：避免 vitest 并行 worker 同毫秒启动时 openid/uid 跨文件撞唯一键
const salt = Math.random().toString(16).slice(2, 6);
let seq = 0;
const userIds: number[] = [];
let categoryId = 0;
let userAId = 0; let userBId = 0; // A：已开通积分；B：未开通积分
let lineId = 0;
const mbtiScores = { E: 10, I: 5, S: 3, N: 7, T: 8, F: 2, J: 6, P: 4 };
const sinsScores = { pride: 80, envy: 10, wrath: 20, sloth: 30, greed: 40, gluttony: 50, lust: 60 };

/** 创建测试用户 */
async function createUser(pointsEnabled: boolean, points: number) {
  const u = await prisma.user.create({ data: {
    openid: `test_${salt}_${ts}_${String(seq++).padStart(3, '0')}`,
    uid: `t${salt}${String(ts).slice(-8)}${String(seq++).padStart(3, '0')}`,
    nickname: '测试用户', avatar: '', passwordHash: '', identity: 'undergraduate', pointsEnabled, points
  } });
  userIds.push(u.id);
  return u;
}
/** 创建测试工具（先清掉可能存在的同 key 工具及其关联数据，保证测试库可重复执行） */
async function createTool(toolKey: string, toolName: string, pointsEnabled: boolean,
  pointsCost: number, pointsMode: string) {
  await prisma.toolUsageLog.deleteMany({ where: { tool: { toolKey } } });
  await prisma.toolUnlock.deleteMany({ where: { tool: { toolKey } } });
  await prisma.tool.deleteMany({ where: { toolKey } });
  return prisma.tool.create({ data: { categoryId, toolName, toolKey, pointsEnabled, pointsCost, pointsMode } });
}
/** 直接读取用户当前积分 */
async function pointsOf(userId: number) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  return u!.points;
}
/** 读取用户最近一条工具使用记录 */
async function lastLog(userId: number) {
  return prisma.toolUsageLog.findFirst({ where: { userId }, include: { tool: true }, orderBy: { id: 'desc' } });
}

beforeAll(async () => {
  const cat = await prisma.toolCategory.create({ data: { categoryName: `测试分类_${ts}` } });
  categoryId = cat.id;
  await createTool('dice', '骰子', true, 5, 'per_use');            // 用例 1/2/7：每次扣分
  await createTool('wheel', '转盘', true, 10, 'one_time');         // 用例 3/4/9：一次性解锁
  await createTool('sbti', '人格测试', true, 100, 'one_time');     // 用例 5：未解锁积分不足
  await createTool('id-photo', '证件照', false, 0, 'per_use');     // 用例 6：积分开关关闭
  await createTool('dark-triad', '黑暗三角', false, 0, 'per_use'); // 用例 8：免费工具
  await createTool('seven-sins', '七宗罪', true, 4, 'per_use');    // 用例 10：每次→一次性
  await createTool('calculator', '计算器', true, 5, 'per_use');    // 回滚：每次扣分
  await createTool('schulte', '舒尔特方格', true, 10, 'one_time'); // 回滚：一次性解锁
  await createTool('video-parse', '影视解析', false, 0, 'per_use');
  const line = await prisma.videoParseLine.create({
    data: { lineName: '测试线路', apiUrl: 'https://api.example.com/parse?url=' }
  });
  lineId = line.id;
  const a = await createUser(true, 100);
  userAId = a.id;
  const b = await createUser(false, 0);
  userBId = b.id;
});

describe('工具箱积分用例（PRD §3.6.6 第 1-10 条）', () => {
  it('1. per_use 每次使用扣分并写入积分流水', async () => {
    const r = await svc.useTool('dice', userAId, 'undergraduate', { count: 2 });
    expect(r.pointsConsumed).toBe(5);
    expect(r.result.rolls).toHaveLength(2);
    expect(await pointsOf(userAId)).toBe(95);
    const pl = await prisma.pointsLog.findFirst({ where: { userId: userAId, points: -5 }, orderBy: { id: 'desc' } });
    expect(pl!.reason).toContain('工具使用');
  });

  it('2. 积分不足时拦截并抛 40013', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 3 } });
    await expect(svc.useTool('dice', userAId, 'undergraduate', { count: 1 })).rejects.toMatchObject({ code: 40013 });
    expect(await pointsOf(userAId)).toBe(3);
  });

  it('3. one_time 首次使用扣分解锁', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    const r = await svc.useTool('wheel', userAId, 'undergraduate', { options: ['a', 'b'] });
    expect(r.pointsConsumed).toBe(10);
    expect(r.unlocked).toBe(true);
    expect(await pointsOf(userAId)).toBe(90);
    const ul = await prisma.toolUnlock.findFirst({ where: { userId: userAId } , include: { tool: true } });
    expect(ul!.tool.toolKey).toBe('wheel');
    expect(ul!.pointsConsumed).toBe(10);
  });

  it('4. 已解锁后再次使用不扣分', async () => {
    const r = await svc.useTool('wheel', userAId, 'undergraduate', { options: ['a', 'b'] });
    expect(r.pointsConsumed).toBe(0);
    expect(r.unlocked).toBe(true);
    expect(await pointsOf(userAId)).toBe(90);
  });

  it('5. one_time 未解锁且积分不足时拦截（40013，不产生解锁记录）', async () => {
    const scores = mbtiScores;
    await expect(svc.useTool('sbti', userAId, 'undergraduate', { scores })).rejects.toMatchObject({ code: 40013 });
    expect(await pointsOf(userAId)).toBe(90);
    const ul = await prisma.toolUnlock.findFirst({ where: { userId: userAId, tool: { toolKey: 'sbti' } } });
    expect(ul).toBeNull();
  });

  it('6. 工具积分开关关闭时免费使用', async () => {
    const r = await svc.useTool('id-photo', userAId, 'undergraduate', { size: 'one' });
    expect(r.pointsConsumed).toBe(0);
    expect(r.result.widthPx).toBe(295);
    expect(await pointsOf(userAId)).toBe(90);
  });

  it('7. 积分数变更后按新值扣分', async () => {
    await prisma.tool.update({ where: { toolKey: 'dice' }, data: { pointsCost: 8 } });
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    const r = await svc.useTool('dice', userAId, 'undergraduate', { count: 1 });
    expect(r.pointsConsumed).toBe(8);
    expect(await pointsOf(userAId)).toBe(92);
  });

  it('8. 免费工具不受用户积分开关影响（未认证用户可用）', async () => {
    const scores = { machiavellianism: 20, psychopathy: 50, narcissism: 80 };
    const r = await svc.useTool('dark-triad', userBId, 'undergraduate', { scores });
    expect(r.pointsConsumed).toBe(0);
    expect(r.result.overall.score).toBe(50);
  });

  it('9. 一次性切换为每次后，已解锁用户也按次扣分', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    // wheel 已在用例 3 解锁；切换为 per_use 后重新扣分
    await prisma.tool.update({ where: { toolKey: 'wheel' }, data: { pointsMode: 'per_use', pointsCost: 10 } });
    const r = await svc.useTool('wheel', userAId, 'undergraduate', { options: ['a', 'b'] });
    expect(r.pointsConsumed).toBe(10);
    expect(await pointsOf(userAId)).toBe(90);
  });

  it('10. 每次切换为一次性后重新触发解锁扣分', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    const first = await svc.useTool('seven-sins', userAId, 'undergraduate', { scores: sinsScores }); // per_use 扣 4
    expect(first.pointsConsumed).toBe(4);
    expect(await pointsOf(userAId)).toBe(96);
    await prisma.tool.update({ where: { toolKey: 'seven-sins' }, data: { pointsMode: 'one_time' } });
    const second = await svc.useTool('seven-sins', userAId, 'undergraduate', { scores: sinsScores }); // 触发解锁再扣 4
    expect(second.pointsConsumed).toBe(4);
    expect(second.unlocked).toBe(true);
    expect(await pointsOf(userAId)).toBe(92);
    const ul2 = await prisma.toolUnlock.findMany({ where: { userId: userAId }, include: { tool: true } });
    expect(ul2.some((x) => x.tool.toolKey === 'seven-sins')).toBe(true);
  });
});

describe('计算失败回滚', () => {
  it('per_use 计算失败：退还扣分并删除当次积分流水', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    await expect(svc.useTool('calculator', userAId, 'undergraduate', { expression: '1/0' })).rejects.toThrow('除数不能为零');
    expect(await pointsOf(userAId)).toBe(100);
    const cnt = await prisma.pointsLog.count({ where: { userId: userAId, reason: { contains: '计算器' } } });
    expect(cnt).toBe(0);
  });

  it('one_time 计算失败：撤销本次解锁并退还扣分', async () => {
    await prisma.user.update({ where: { id: userAId }, data: { points: 100 } });
    await expect(svc.useTool('schulte', userAId, 'undergraduate', { grid: 99, timeMs: 1000 })).rejects.toThrow('网格规格');
    expect(await pointsOf(userAId)).toBe(100);
    const unlocks = await prisma.toolUnlock.findMany({ where: { userId: userAId }, include: { tool: true } });
    expect(unlocks.some((x) => x.tool.toolKey === 'schulte')).toBe(false);
    const cnt = await prisma.pointsLog.count({ where: { userId: userAId, reason: { contains: '舒尔特' } } });
    expect(cnt).toBe(0);
  });

  it('免费工具计算失败：错误直接上抛', async () => {
    await expect(svc.useTool('id-photo', userAId, 'undergraduate', { size: 'three' })).rejects.toThrow('不支持的证件照尺寸');
  });
});

describe('分享与影视解析', () => {
  it('shareTool 生成携带 base64url 数据的分享链接与海报链接', async () => {
    // 先产生一次使用记录，分享标记才有落点
    await svc.useTool('schulte', userAId, 'undergraduate', { grid: 5, timeMs: 12000 });
    const resultData = { grid: 5, timeMs: 12000, rating: '优秀' };
    const r = await svc.shareTool('schulte', userAId, { shareType: 'poster', resultData });
    expect(r.shareUrl.startsWith(config.fileBaseUrl + '/share/schulte?data=')).toBe(true);
    expect(r.posterUrl).toBe(r.shareUrl + '&poster=1');
    const code = r.shareUrl.split('data=')[1];
    const data = JSON.parse(Buffer.from(code, 'base64url').toString());
    expect(data.grid).toBe(5); // 海报区分难度字段
    expect(data.rating).toBe('优秀');
    // 使用记录被标记为已分享
    const log = await lastLog(userAId);
    expect(log!.isShared).toBe(true);
  });

  it('shareTool 平铺字段兜底：body 顶层 grid 也能写入数据码', async () => {
    const r = await svc.shareTool('schulte', userAId, { shareType: 'link', grid: 7 });
    const data = JSON.parse(Buffer.from(r.shareUrl.split('data=')[1], 'base64url').toString());
    expect(data.grid).toBe(7);
  });

  it('videoParse 拼接解析线路并写入使用记录', async () => {
    const url = 'https://v.qq.com/x/abc?pid=1';
    const r = await svc.videoParse(userAId, url, lineId);
    expect(r.lineName).toBe('测试线路');
    expect(r.parseUrl).toBe('https://api.example.com/parse?url=' + encodeURIComponent(url));
    const log = await lastLog(userAId);
    expect(log!.tool.toolKey).toBe('video-parse');
    expect((log!.resultData as any).videoUrl).toBe(url);
    expect((log!.resultData as any).lineId).toBe(lineId);
  });

  it('videoParse 线路不存在抛 40003', async () => {
    await expect(svc.videoParse(userAId, 'https://v.qq.com/x/abc', 99999999)).rejects.toMatchObject({ code: 40003 });
  });
});

afterAll(async () => {
  // 事务性清理：先删日志/解锁/流水，再删工具、分类、用户
  await prisma.toolUsageLog.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.toolUnlock.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.pointsLog.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.videoParseLine.deleteMany({ where: { id: lineId } });
  await prisma.tool.deleteMany({ where: { categoryId } });
  await prisma.toolCategory.deleteMany({ where: { id: categoryId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});
