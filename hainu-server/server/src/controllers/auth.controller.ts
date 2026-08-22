import { Context } from 'koa';
import { success } from '../utils/response';
import { ApiError } from '../utils/api-error';
import * as svc from '../services/auth.service';

export async function register(ctx: Context) {
  const { code, identity, nickname, avatar } = ctx.request.body as any;
  if (!code) throw new ApiError(40001, '缺少微信授权 code');
  if (!identity || !['freshman','undergrad','grad'].includes(identity)) throw new ApiError(40001, '身份参数无效');
  ctx.body = success(await svc.registerByWechat(code, identity, nickname, avatar));
}
export async function login(ctx: Context) {
  const { uid, password } = ctx.request.body as any;
  if (!uid || !password) throw new ApiError(40001, '缺少 UID 或密码');
  ctx.body = success(await svc.loginByUid(uid, password));
}
export async function refresh(ctx: Context) {
  const { refreshToken: rt } = ctx.request.body as any;
  if (!rt) throw new ApiError(40001, '缺少 refreshToken');
  ctx.body = success(await svc.refreshToken(rt));
}
export async function adminLogin(ctx: Context) {
  const { username, password } = ctx.request.body as any;
  if (!username || !password) throw new ApiError(40001, '缺少用户名或密码');
  ctx.body = success(await svc.adminLogin(username, password));
}
