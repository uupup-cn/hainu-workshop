import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/campus-data.service';

// 兼容 snake_case 和 camelCase 参数名（api.md 文档用 snake_case，部分前端传 camelCase）
function numParam(ctx: Context, ...keys: string[]): number | undefined {
  for (const k of keys) { const v = (ctx.query as any)[k]; if (v !== undefined && v !== '') return Number(v); }
  return undefined;
}

export async function getCampuses(ctx: Context) { ctx.body = success(await svc.getCampuses()); }
export async function getColleges(ctx: Context) { ctx.body = success(await svc.getColleges(numParam(ctx, 'campusId', 'campus_id'))); }
// 学院不再按校区过滤（campusId 已改为可选，学院可跨校区存在），直接返回全部活跃学院
export async function getDepartments(ctx: Context) { ctx.body = success(await svc.getDepartments()); }
export async function getMajors(ctx: Context) { ctx.body = success(await svc.getMajors(numParam(ctx, 'departmentId', 'department_id'))); }
export async function getBuildings(ctx: Context) { ctx.body = success(await svc.getBuildings(numParam(ctx, 'collegeId', 'college_id'))); }
