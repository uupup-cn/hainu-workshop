import { Context } from 'koa';
import { success } from '../utils/response';
import * as svc from '../services/tool.service';
export async function getCategories(ctx: Context) { ctx.body = success(await svc.getCategories()); }
export async function getTools(ctx: Context) { const { category_id } = ctx.query as any; ctx.body = success(await svc.getTools(category_id?Number(category_id):undefined)); }
export async function getTool(ctx: Context) { ctx.body = success(await svc.getTool(ctx.params.key)); }
export async function useTool(ctx: Context) { ctx.body = success(await svc.useTool(ctx.params.key, ctx.state.user.userId, ctx.state.user.identity, (ctx.request.body as any)?.params)); }
export async function shareTool(ctx: Context) { ctx.body = success(await svc.shareTool(ctx.params.key, ctx.state.user.userId, ctx.request.body)); }
export async function getVideoParseLines(ctx: Context) { ctx.body = success(await svc.getVideoParseLines()); }
export async function videoParse(ctx: Context) {
  const b = ctx.request.body as any;
  ctx.body = success(await svc.videoParse(ctx.state.user.userId, b.video_url, Number(b.line_id)));
}
