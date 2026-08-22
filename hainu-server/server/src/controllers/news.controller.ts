import { Context } from 'koa';
import { success } from '../utils/response';
import * as svc from '../services/news.service';
export async function getNews(ctx: Context) { const identity = ctx.state.user?.identity || 'all_student'; const { target, page, size } = ctx.query as any; ctx.body = success(await svc.getNews(target || identity, Number(page)||1, Number(size)||20)); }
export async function getNewsDetail(ctx: Context) { ctx.body = success(await svc.getNewsDetail(Number(ctx.params.id))); }
