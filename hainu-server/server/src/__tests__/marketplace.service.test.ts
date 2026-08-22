// 二手集市服务测试（需数据库：自动时间 / 所有权校验 / 重新上架）
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../utils/prisma';
import * as svc from '../services/marketplace.service';

const ts = Date.now();
// 随机盐：避免 vitest 并行 worker 同毫秒启动时 openid/uid 跨文件撞唯一键
const salt = Math.random().toString(16).slice(2, 6);
let seq = 0;
const userIds: number[] = [];
const itemIds: number[] = [];
let categoryId = 0;
const DAY = 86400000;
/** 创建测试用户 */
async function createUser() {
  const u = await prisma.user.create({ data: {
    openid: `test_${salt}_${ts}_${String(seq++).padStart(3, '0')}`,
    uid: `t${salt}${String(ts).slice(-8)}${String(seq++).padStart(3, '0')}`,
    nickname: '测试用户', avatar: '', passwordHash: '', identity: 'undergraduate'
  } });
  userIds.push(u.id);
  return u;
}
async function createItem(userId: number, title: string) {
  const item = await svc.createItem(userId, 'undergraduate', {
    title, description: '测试描述', price: 9.9, images: [] as any, contact: '13800000000', categoryId
  });
  itemIds.push(item.id);
  return item;
}

beforeAll(async () => {
  const cat = await prisma.marketplaceCategory.create({
    data: { categoryName: `测试分类_${ts}`, sortOrder: 0, isActive: true }
  });
  categoryId = cat.id;
});

describe('二手集市服务', () => {
  it('createItem 自动设置 autoOffAt(+3天)/expireAt(+5天) 并置为 active', async () => {
    const user = await createUser();
    const before = Date.now();
    const item = await createItem(user.id, '自动时间测试商品');
    const after = Date.now();
    expect(item.status).toBe('active');
    expect(item.publishedAt.getTime()).toBeGreaterThanOrEqual(before);
    // autoOffAt ≈ 创建时刻 + 3 天（允许 1 分钟误差）
    expect(item.autoOffAt!.getTime()).toBeGreaterThan(before + 3 * DAY - 60000);
    expect(item.autoOffAt!.getTime()).toBeLessThan(after + 3 * DAY + 60000);
    // expireAt ≈ 创建时刻 + 5 天
    expect(item.expireAt!.getTime()).toBeGreaterThan(before + 5 * DAY - 60000);
    expect(item.expireAt!.getTime()).toBeLessThan(after + 5 * DAY + 60000);
  });

  it('offItem 非本人操作抛 40004，本人下架成功', async () => {
    const owner = await createUser();
    const other = await createUser();
    const item = await createItem(owner.id, '下架测试商品');
    await expect(svc.offItem(item.id, other.id)).rejects.toMatchObject({ code: 40004 });
    const off = await svc.offItem(item.id, owner.id);
    expect(off.status).toBe('auto_off');
  });

  it('relistItem 非本人操作抛 40004', async () => {
    const owner = await createUser();
    const other = await createUser();
    const item = await createItem(owner.id, '重新上架校验商品');
    await expect(svc.relistItem(item.id, other.id)).rejects.toMatchObject({ code: 40004 });
  });

  it('relistItem 重置 publishedAt/autoOffAt/expireAt 且状态回到 active', async () => {
    const owner = await createUser();
    const item = await createItem(owner.id, '重新上架测试商品');
    await svc.offItem(item.id, owner.id);
    const before = Date.now();
    const relisted = await svc.relistItem(item.id, owner.id);
    const after = Date.now();
    expect(relisted.status).toBe('active');
    expect(relisted.publishedAt.getTime()).toBeGreaterThanOrEqual(before);
    // autoOffAt/expireAt 以重新上架时刻为基准重置
    expect(relisted.autoOffAt!.getTime()).toBeGreaterThan(before + 3 * DAY - 60000);
    expect(relisted.autoOffAt!.getTime()).toBeLessThan(after + 3 * DAY + 60000);
    expect(relisted.expireAt!.getTime()).toBeGreaterThan(before + 5 * DAY - 60000);
    expect(relisted.expireAt!.getTime()).toBeLessThan(after + 5 * DAY + 60000);
  });
});

afterAll(async () => {
  // 清理本文件创建的数据
  await prisma.marketplaceItem.deleteMany({ where: { id: { in: itemIds } } });
  await prisma.marketplaceCategory.deleteMany({ where: { id: categoryId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});
