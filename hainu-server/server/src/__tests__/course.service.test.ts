// 课程服务测试（需数据库：冲突检测 / 分享码上限 / 复刻校验）
import { describe, it, expect, afterAll } from 'vitest';
import { prisma } from '../utils/prisma';
import * as svc from '../services/course.service';

const ts = Date.now();
// 随机盐：避免 vitest 并行 worker 同毫秒启动时 openid/uid 跨文件撞唯一键
const salt = Math.random().toString(16).slice(2, 6);
let seq = 0;
const userIds: number[] = [];
/** 创建测试用户（openid/uid 带 test_+时间戳前缀保证隔离） */
async function createUser(identity = 'undergraduate') {
  const u = await prisma.user.create({ data: {
    openid: `test_${salt}_${ts}_${String(seq++).padStart(3, '0')}`,
    uid: `t${salt}${String(ts).slice(-8)}${String(seq++).padStart(3, '0')}`,
    nickname: '测试用户', avatar: '', passwordHash: '', identity
  } });
  userIds.push(u.id);
  return u;
}

describe('课程服务', () => {
  it('冲突检测：同时段第二门课返回 conflict 与冲突信息', async () => {
    const user = await createUser();
    await svc.createCourse(user.id, 'undergraduate', {
      courseName: '课程A', teacher: '张三', dayOfWeek: 1, startSection: 1, endSection: 2
    });
    const r: any = await svc.createCourse(user.id, 'undergraduate', {
      courseName: '课程B', teacher: '李四', dayOfWeek: 1, startSection: 2, endSection: 3
    });
    expect(r.conflict).toBe(true);
    expect(r.conflicts.length).toBeGreaterThan(0);
    expect(r.conflicts[0].courseName).toBe('课程A');
  });

  it('force_overwrite=true 时旧课被删除、新课创建成功', async () => {
    const user = await createUser();
    await svc.createCourse(user.id, 'undergraduate', {
      courseName: '旧课', dayOfWeek: 2, startSection: 1, endSection: 2
    });
    const r: any = await svc.createCourse(user.id, 'undergraduate', {
      courseName: '新课', dayOfWeek: 2, startSection: 2, endSection: 3, forceOverwrite: true
    });
    expect(r.conflict).toBe(false);
    expect(r.course.courseName).toBe('新课');
    const list = await svc.getCourses(user.id);
    expect(list).toHaveLength(1);
    expect(list[0].courseName).toBe('新课');
  });

  it('分享码上限 3 个：第 4 个创建抛 40011', async () => {
    const user = await createUser();
    for (let i = 0; i < 3; i++) await svc.createShareCode(user.id, 'undergraduate');
    await expect(svc.createShareCode(user.id, 'undergraduate')).rejects.toMatchObject({ code: 40011 });
  });

  it('复刻身份不匹配抛 40007', async () => {
    const owner = await createUser('undergraduate');
    const other = await createUser('graduate');
    const sc = await svc.createShareCode(owner.id, 'undergraduate');
    await expect(svc.replicateCourse(sc.shareCode, other.id, 'graduate')).rejects.toMatchObject({ code: 40007 });
  });

  it('无效分享码抛 40006', async () => {
    const user = await createUser();
    await expect(svc.replicateCourse('NOEXIST', user.id, 'undergraduate')).rejects.toMatchObject({ code: 40006 });
  });
});

afterAll(async () => {
  // 清理本文件创建的数据（先删子表再删用户，避免外键约束）
  for (const id of userIds) {
    await prisma.course.deleteMany({ where: { userId: id } });
    await prisma.shareCode.deleteMany({ where: { ownerUserId: id } });
  }
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});
