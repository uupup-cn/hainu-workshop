import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/marketplace.service';
export async function getCategories(ctx: Context) { ctx.body = success(await svc.getCategories()); }
export async function getItems(ctx: Context) { const { category, keyword, page, size } = ctx.query as any; ctx.body = success(await svc.getItems(category, keyword, Number(page)||1, Number(size)||20)); }
export async function getItem(ctx: Context) { ctx.body = success(await svc.getItem(Number(ctx.params.id))); }
export async function createItem(ctx: Context) { ctx.body = success(await svc.createItem(ctx.state.user.userId, ctx.state.user.identity, ctx.request.body)); }
export async function offItem(ctx: Context) { ctx.body = success(await svc.offItem(Number(ctx.params.id), ctx.state.user.userId)); }
export async function deleteItem(ctx: Context) { ctx.body = success(await svc.deleteItem(Number(ctx.params.id), ctx.state.user.userId)); }
export async function relistItem(ctx: Context) { ctx.body = success(await svc.relistItem(Number(ctx.params.id), ctx.state.user.userId)); }
export async function getMyItems(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await svc.getMyItems(ctx.state.user.userId, Number(page)||1, Number(size)||20)); }
export async function reportItem(ctx: Context) { const { reason, detail } = ctx.request.body as any; if (!reason) throw new ApiError(40001, '缺少举报理由'); ctx.body = success(await svc.reportItem(Number(ctx.params.id), ctx.state.user.userId, reason, detail)); }
