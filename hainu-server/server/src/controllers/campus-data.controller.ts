import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/campus-data.service';

export async function getCampuses(ctx: Context) { ctx.body = success(await svc.getCampuses()); }
export async function getColleges(ctx: Context) { const id = ctx.query.campusId ? Number(ctx.query.campusId) : undefined; ctx.body = success(await svc.getColleges(id)); }
export async function getDepartments(ctx: Context) { const id = ctx.query.campusId ? Number(ctx.query.campusId) : undefined; ctx.body = success(await svc.getDepartments(id)); }
export async function getMajors(ctx: Context) { const id = ctx.query.departmentId ? Number(ctx.query.departmentId) : undefined; ctx.body = success(await svc.getMajors(id)); }
export async function getBuildings(ctx: Context) { const id = ctx.query.collegeId ? Number(ctx.query.collegeId) : undefined; ctx.body = success(await svc.getBuildings(id)); }
