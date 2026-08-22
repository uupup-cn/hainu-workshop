import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/freshman.service';

export async function getGuideEntries(ctx: Context) { ctx.body = success(await svc.getGuideEntries()); }
export async function getGuideEntry(ctx: Context) { ctx.body = success(await svc.getGuideEntry(ctx.params.key)); }
export async function getLifeCampuses(ctx: Context) { ctx.body = success(await svc.getLifeCampuses()); }
export async function getLifeTopics(ctx: Context) { ctx.body = success(await svc.getLifeTopics(ctx.query.campus as string || '')); }
export async function getLifeTopic(ctx: Context) { ctx.body = success(await svc.getLifeTopic(ctx.params.key)); }
export async function getFaqCategories(ctx: Context) { ctx.body = success(await svc.getFaqCategories()); }
export async function getFaqQuestions(ctx: Context) { const { categoryId, keyword } = ctx.query as any; ctx.body = success(await svc.getFaqQuestions(categoryId, keyword)); }
export async function getFaqQuestion(ctx: Context) { ctx.body = success(await svc.getFaqQuestion(Number(ctx.params.id))); }
