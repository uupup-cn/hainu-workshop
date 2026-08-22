import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/user.service';
export async function getProfile(ctx: Context) { ctx.body = success(await svc.getProfile(ctx.state.user.userId)); }
export async function updateProfile(ctx: Context) { ctx.body = success(await svc.updateProfile(ctx.state.user.userId, ctx.request.body as any)); }
export async function changePassword(ctx: Context) { const { oldPassword, newPassword } = ctx.request.body as any; if (!oldPassword || !newPassword) throw new ApiError(40001, '缺少原密码或新密码'); ctx.body = success(await svc.changePassword(ctx.state.user.userId, oldPassword, newPassword)); }
export async function getPublicProfile(ctx: Context) { ctx.body = success(await svc.getPublicProfile(ctx.params.uid)); }
export async function getPrivacy(ctx: Context) { ctx.body = success(await svc.getPrivacy(ctx.state.user.userId)); }
export async function updatePrivacy(ctx: Context) { const { privacyEnabled, privacyFields } = ctx.request.body as any; ctx.body = success(await svc.updatePrivacy(ctx.state.user.userId, privacyEnabled, privacyFields)); }
export async function submitAuthApply(ctx: Context) { const { realName, studentNo, major, proofImage } = ctx.request.body as any; if (!realName || !studentNo || !major || !proofImage) throw new ApiError(40001, '缺少认证信息'); ctx.body = success(await svc.submitAuthApply(ctx.state.user.userId, { realName, studentNo, major, proofImage })); }
export async function getAuthStatus(ctx: Context) { ctx.body = success(await svc.getAuthStatus(ctx.state.user.userId)); }
export async function getPoints(ctx: Context) { ctx.body = success(await svc.getPoints(ctx.state.user.userId)); }
