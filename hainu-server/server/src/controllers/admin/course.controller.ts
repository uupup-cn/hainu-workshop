// 课表管理控制器：课程库 / 课程颜色 / 学期 / 学期周制 / 节次 / 分享码
import { Context } from 'koa';
import { success } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import * as svc from '../../services/admin/course.service';

// 课程库
export async function listCourses(ctx: Context) { const { page, size } = parsePagination(ctx.query); const keyword = ctx.query.keyword as string | undefined; ctx.body = success(await svc.listCourses(page, size, keyword)); }
// 课程颜色
export async function listCourseColors(ctx: Context) { ctx.body = success(await svc.courseColors.list()); }
export async function createCourseColor(ctx: Context) { ctx.body = success(await svc.courseColors.create(ctx.request.body)); }
export async function updateCourseColor(ctx: Context) { ctx.body = success(await svc.courseColors.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteCourseColor(ctx: Context) { ctx.body = success(await svc.courseColors.delete(Number(ctx.params.id))); }
// 学期
export async function listSemesters(ctx: Context) { ctx.body = success(await svc.semesters.list()); }
export async function createSemester(ctx: Context) { ctx.body = success(await svc.semesters.create(ctx.request.body)); }
export async function updateSemester(ctx: Context) { ctx.body = success(await svc.semesters.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteSemester(ctx: Context) { ctx.body = success(await svc.semesters.delete(Number(ctx.params.id))); }
// 学期周制
export async function listTermWeeks(ctx: Context) { const semesterId = ctx.query.semesterId ? Number(ctx.query.semesterId) : undefined; ctx.body = success(await svc.termWeeks.list(semesterId)); }
export async function createTermWeek(ctx: Context) { ctx.body = success(await svc.termWeeks.create(ctx.request.body)); }
export async function updateTermWeek(ctx: Context) { ctx.body = success(await svc.termWeeks.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteTermWeek(ctx: Context) { ctx.body = success(await svc.termWeeks.delete(Number(ctx.params.id))); }
// 节次
export async function listSections(ctx: Context) { ctx.body = success(await svc.sections.list()); }
export async function createSection(ctx: Context) { ctx.body = success(await svc.sections.create(ctx.request.body)); }
export async function updateSection(ctx: Context) { ctx.body = success(await svc.sections.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteSection(ctx: Context) { ctx.body = success(await svc.sections.delete(Number(ctx.params.id))); }
// 分享码
export async function listShareCodes(ctx: Context) { const { page, size } = parsePagination(ctx.query); ctx.body = success(await svc.listShareCodes(page, size)); }
export async function updateShareCodeStatus(ctx: Context) { const { status } = ctx.request.body as any; ctx.body = success(await svc.updateShareCodeStatus(Number(ctx.params.id), status)); }
