import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/alumni.service';
export async function getSections(ctx: Context) { ctx.body = success(await svc.getSections()); }
export async function getPosts(ctx: Context) { const { type, section_id, page, size } = ctx.query as any; ctx.body = success(await svc.getPosts(type||'post', section_id?Number(section_id):undefined, Number(page)||1, Number(size)||20)); }
export async function getPost(ctx: Context) { ctx.body = success(await svc.getPost(Number(ctx.params.id))); }
export async function createPost(ctx: Context) { ctx.body = success(await svc.createPost(ctx.state.user.userId, ctx.request.body)); }
export async function deletePost(ctx: Context) { ctx.body = success(await svc.deletePost(Number(ctx.params.id), ctx.state.user.userId)); }
export async function likePost(ctx: Context) { ctx.body = success(await svc.likePost(Number(ctx.params.id), ctx.state.user.userId)); }
export async function unlikePost(ctx: Context) { ctx.body = success(await svc.unlikePost(Number(ctx.params.id), ctx.state.user.userId)); }
export async function getComments(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await svc.getComments(Number(ctx.params.id), Number(page)||1, Number(size)||50)); }
export async function createComment(ctx: Context) { ctx.body = success(await svc.createComment(Number(ctx.params.id), ctx.state.user.userId, ctx.request.body)); }
export async function deleteComment(ctx: Context) { ctx.body = success(await svc.deleteComment(Number(ctx.params.id), ctx.state.user.userId)); }
export async function reportPost(ctx: Context) { const { reason, detail } = ctx.request.body as any; if (!reason) throw new ApiError(40001, '缺少举报理由'); ctx.body = success(await svc.reportPost(Number(ctx.params.id), ctx.state.user.userId, reason, detail)); }
export async function reportComment(ctx: Context) { const { reason, detail } = ctx.request.body as any; if (!reason) throw new ApiError(40001, '缺少举报理由'); ctx.body = success(await svc.reportComment(Number(ctx.params.id), ctx.state.user.userId, reason, detail)); }
