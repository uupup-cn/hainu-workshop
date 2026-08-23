import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import { prisma } from '../utils/prisma';
import * as svc from '../services/course.service';
export async function getCourses(ctx: Context) {
  // 游客返回课表框架数据（节次/学期/周布局），不含课程内容（api.md §7.1）
  if (!ctx.state.user) {
    const [sections, semesters] = await Promise.all([prisma.section.findMany({ where: { isActive: true }, orderBy: { sectionNumber: 'asc' } }), prisma.semester.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, include: { termWeeks: { orderBy: { weekNumber: 'asc' } } } })]);
    ctx.body = success({ frameworkOnly: true, courses: [], sections, semesters });
    return;
  }
  ctx.body = success(await svc.getCourses(ctx.state.user.userId));
}
export async function createCourse(ctx: Context) { const r = await svc.createCourse(ctx.state.user.userId, ctx.state.user.identity, ctx.request.body); if (r.conflict) { ctx.body = { code: 40012, message: '课程时间冲突', data: r.conflicts }; } else { ctx.body = success(r.course); } }
export async function updateCourse(ctx: Context) { ctx.body = success(await svc.updateCourse(Number(ctx.params.id), ctx.state.user.userId, ctx.request.body)); }
export async function deleteCourse(ctx: Context) { ctx.body = success(await svc.deleteCourse(Number(ctx.params.id), ctx.state.user.userId)); }
export async function shareCourse(ctx: Context) { ctx.body = success(await svc.createShareCode(ctx.state.user.userId, ctx.state.user.identity)); }
export async function replicateCourse(ctx: Context) { const b = ctx.request.body as any; const code = b.share_code || b.shareCode; if (!code) throw new ApiError(40001, '缺少分享码'); ctx.body = success(await svc.replicateCourse(code, ctx.state.user.userId, ctx.state.user.identity)); }
