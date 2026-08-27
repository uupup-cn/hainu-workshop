import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as ns from '../services/notification.service';
import * as fs from '../services/feedback.service';
import * as ss from '../services/system.service';
export async function getNotifications(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await ns.getNotifications(ctx.state.user.userId, ctx.state.user.identity||'all', Number(page)||1, Number(size)||20)); }
export async function getNotificationDetail(ctx: Context) { ctx.body = success(await ns.getNotificationDetail(Number(ctx.params.id))); }
export async function markAsRead(ctx: Context) { ctx.body = success(await ns.markAsRead(ctx.state.user.userId, Number(ctx.params.id))); }
export async function getUnreadCount(ctx: Context) { ctx.body = success(await ns.getUnreadCount(ctx.state.user.userId, ctx.state.user.identity||'all')); }
export async function submitFeedback(ctx: Context) { const { content, contact, type, title, expectedBehavior } = ctx.request.body as any; if (!content) throw new ApiError(40001, '缺少反馈内容'); ctx.body = success(await fs.submitFeedback(ctx.state.user.userId, { content, contact, type, title, expectedBehavior })); }
export async function getMyFeedback(ctx: Context) { const { page, size } = ctx.query as any; ctx.body = success(await fs.getMyFeedback(ctx.state.user.userId, Number(page)||1, Number(size)||20)); }
export async function getSettings(ctx: Context) { ctx.body = success(await ss.getSettings()); }
