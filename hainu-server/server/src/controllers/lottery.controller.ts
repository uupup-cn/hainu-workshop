import { Context } from 'koa';
import { success } from '../utils/response';
import * as svc from '../services/lottery.service';
export async function getActivities(ctx: Context) { ctx.body = success(await svc.getActivities()); }
export async function getActivity(ctx: Context) { ctx.body = success(await svc.getActivity(Number(ctx.params.id))); }
export async function draw(ctx: Context) { ctx.body = success(await svc.draw(ctx.state.user.userId, ctx.state.user.identity, Number(ctx.params.id))); }
export async function getMyRecords(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await svc.getMyRecords(ctx.state.user.userId, Number(page)||1, Number(size)||20)); }
