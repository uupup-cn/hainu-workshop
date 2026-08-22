// 系统监控控制器：在线用户 / 缓存 / 服务器信息 / 日志 / 用户反馈
import { Context } from 'koa';
import { success } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import * as svc from '../../services/admin/monitor.service';

export async function getOnlineUsers(ctx: Context) { ctx.body = success(await svc.getOnlineUsers()); }
export async function getCacheInfo(ctx: Context) { ctx.body = success(svc.getCacheInfo()); }
export async function clearCache(ctx: Context) { ctx.body = success(svc.clearCache()); }
export async function getServerInfo(ctx: Context) { ctx.body = success(svc.getServerInfo()); }
export async function getSystemLogs(ctx: Context) { const { page, size } = parsePagination(ctx.query); const keyword = ctx.query.keyword as string | undefined; ctx.body = success(await svc.getSystemLogs(page, size, keyword)); }
export async function getLoginLogs(ctx: Context) { const { page, size } = parsePagination(ctx.query); const uid = ctx.query.uid as string | undefined; ctx.body = success(await svc.getLoginLogs(page, size, uid)); }
export async function getOperationLogs(ctx: Context) { const { page, size } = parsePagination(ctx.query); const keyword = ctx.query.keyword as string | undefined; ctx.body = success(await svc.getOperationLogs(page, size, keyword)); }
export async function getFeedbacks(ctx: Context) { const { page, size } = parsePagination(ctx.query); const status = ctx.query.status as string | undefined; ctx.body = success(await svc.getFeedbacks(page, size, status)); }
// 处理反馈（body.reply 因 schema 无对应字段不落库，仅更新状态）
export async function handleFeedback(ctx: Context) { ctx.body = success(await svc.handleFeedback(Number(ctx.params.id))); }
