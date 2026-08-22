import { Context } from 'koa';
import { success } from '../utils/response';
import * as svc from '../services/roommate.service';
export async function getStatus(ctx: Context) { ctx.body = success(await svc.getStatus()); }
export async function getPosts(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await svc.getPosts(Number(page)||1, Number(size)||20)); }
export async function getPost(ctx: Context) { ctx.body = success(await svc.getPost(Number(ctx.params.id))); }
export async function createPost(ctx: Context) { ctx.body = success(await svc.createPost(ctx.state.user.userId, ctx.request.body)); }
export async function getMyPost(ctx: Context) { ctx.body = success(await svc.getMyPost(ctx.state.user.userId)); }
export async function updatePost(ctx: Context) { ctx.body = success(await svc.updatePost(ctx.state.user.userId, ctx.request.body)); }
export async function matchPosts(ctx: Context) { ctx.body = success(await svc.matchPosts(ctx.state.user.userId, ctx.request.body)); }
