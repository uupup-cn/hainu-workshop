import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/api-error';

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(40010, '需要登录后访问');
  }
  // 仅捕获 token 解析异常；next() 的下游业务错误必须原样抛出，避免被误判为 Token 失效
  try {
    ctx.state.user = verifyToken(authHeader.substring(7));
  } catch {
    throw new ApiError(40002, 'Token 无效或已过期');
  }
  await next();
}

export async function optionalAuthMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try { ctx.state.user = verifyToken(authHeader.substring(7)); } catch {}
  }
  await next();
}

export async function adminAuthMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(40002, '需要管理员登录');
  }
  // 仅捕获 token 解析异常；下游业务错误原样抛出
  let payload: any;
  try {
    payload = verifyToken(authHeader.substring(7));
  } catch {
    throw new ApiError(40002, 'Token 无效或已过期');
  }
  if (!payload.isAdmin) throw new ApiError(40004, '无管理员权限');
  ctx.state.admin = payload;
  await next();
}
