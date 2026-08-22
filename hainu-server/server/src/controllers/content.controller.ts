import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/content.service';

export async function getIntroEntries(ctx: Context) { ctx.body = success(await svc.getIntroEntries()); }
export async function getIntroEntry(ctx: Context) { ctx.body = success(await svc.getIntroEntry(ctx.params.key)); }
export async function getPhonebookCategories(ctx: Context) { ctx.body = success(await svc.getPhonebookCategories()); }
export async function getPhonebookEntries(ctx: Context) { const { categoryId, keyword } = ctx.query as any; ctx.body = success(await svc.getPhonebookEntries(categoryId, keyword)); }
export async function getCalendar(ctx: Context) { ctx.body = success(await svc.getCalendar()); }
export async function getMaps(ctx: Context) { ctx.body = success(await svc.getMaps()); }
export async function getMap(ctx: Context) { ctx.body = success(await svc.getMap(ctx.params.campus)); }
export async function getBusSchedules(ctx: Context) { ctx.body = success(await svc.getBusSchedules()); }
export async function getBusStations(ctx: Context) { ctx.body = success(await svc.getBusStations()); }
export async function getBusGuide(ctx: Context) { ctx.body = success(await svc.getBusGuide()); }
