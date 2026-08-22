// 找室友匹配测试（需数据库）：同楼同寝 / 同专业 / 无匹配
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../utils/prisma';
import * as svc from '../services/roommate.service';

const ts = Date.now();
// 随机盐：避免 vitest 并行 worker 同毫秒启动时 openid/uid 跨文件撞唯一键
const salt = Math.random().toString(16).slice(2, 6);
let seq = 0;
const userIds: number[] = [];
let userAId = 0; // 发起匹配的查询用户（不发布信息）
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
/** 创建室友发布信息 */
async function createPost(userId: number, data: any) {
  return prisma.roommatePost.create({
    data: { userId, name: '测试同学', contact: '13800000000', isActive: true, ...data }
  });
}

beforeAll(async () => {
  const a = await createUser();
  userAId = a.id;
  // B：与查询同楼同寝，但专业不同（隔离同寝与同专业两个匹配维度）
  const b = await createUser();
  await createPost(b.id, {
    campusId: 1, collegeId: 1, buildingId: 1, roomNumber: '501', departmentId: 99, majorId: 99
  });
});

describe('找室友匹配', () => {
  it('同楼同寝 → hasRoommate 为 true', async () => {
    const r = await svc.matchPosts(userAId, {
      campusId: 1, collegeId: 1, buildingId: 1, roomNumber: '501', departmentId: 1, majorId: 1
    });
    expect(r.hasRoommate).toBe(true);
    expect(r.hasMajorMatch).toBe(false);
    expect(r.roommateMatches).toHaveLength(1);
    expect(r.roommateMatches[0].roomNumber).toBe('501');
  });

  it('同专业 → hasMajorMatch 为 true（楼寝不同不触发室友匹配）', async () => {
    // C：与查询同专业，但不同楼不同寝
    const c = await createUser();
    await createPost(c.id, {
      campusId: 1, collegeId: 1, buildingId: 2, roomNumber: '601', departmentId: 1, majorId: 1
    });
    const r = await svc.matchPosts(userAId, {
      campusId: 1, collegeId: 1, buildingId: 9, roomNumber: 'ZZZ', departmentId: 1, majorId: 1
    });
    expect(r.hasRoommate).toBe(false);
    expect(r.hasMajorMatch).toBe(true);
    expect(r.majorMatches).toHaveLength(1);
  });

  it('无匹配 → hasRoommate 与 hasMajorMatch 均为 false', async () => {
    const r = await svc.matchPosts(userAId, {
      campusId: 9, collegeId: 9, buildingId: 9, roomNumber: '999', departmentId: 9, majorId: 9
    });
    expect(r.hasRoommate).toBe(false);
    expect(r.hasMajorMatch).toBe(false);
    expect(r.roommateMatches).toHaveLength(0);
    expect(r.majorMatches).toHaveLength(0);
  });
});

afterAll(async () => {
  // 清理本文件创建的数据（先删发布信息再删用户）
  await prisma.roommatePost.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});
