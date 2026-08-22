// 日志中间件：登录日志（LoginLog）与操作日志（OperationLog）记录
import { Context, Next } from 'koa';
import { prisma } from '../utils/prisma';

// 登录日志：包装后续中间件，响应完成后写 LoginLog（uid 取自请求体，缺失时记 'admin'）
// LoginLog 无 uid 字符串字段，userId 按 uid 解析为用户 id，解析不到则为 null
export async function loginLogMiddleware(ctx: Context, next: Next) {
  await next();
  try {
    const uid = String((ctx.request.body as any)?.uid || 'admin');
    const user = await prisma.user.findUnique({ where: { uid } });
    const userAgent = String(ctx.headers['user-agent'] || '').substring(0, 255);
    const ip = String(ctx.ip || '').substring(0, 50);
    const successFlag = (ctx.body as any)?.code === 0 ? 'success' : 'fail';
    await prisma.loginLog.create({ data: { userId: user?.id ?? null, ip, userAgent, status: successFlag } });
  } catch (err) {
    console.error('[LOGIN_LOG]', err);
  }
}

// 操作日志：仅对 /api/v1/admin 下的 POST/PUT/DELETE 请求，响应成功（code===0）后写 OperationLog
// operator/method/path 无独立字段，按 schema 存入 detail JSON；userId 取自 ctx.state.admin 载荷
export async function operationLogMiddleware(ctx: Context, next: Next) {
  await next();
  if (!['POST', 'PUT', 'DELETE'].includes(ctx.method)) return;
  if (!ctx.path.startsWith('/api/v1/admin')) return;
  const body = ctx.body as any;
  if (!body || body.code !== 0) return;
  try {
    const admin: any = ctx.state.admin;
    const operator = admin?.username || 'admin'; // JWT 载荷未含 username 时回退为 'admin'
    const module = (ctx.path.split('/').filter(Boolean)[3] || 'admin').substring(0, 50);
    const action = String((ctx.request.body as any)?.action || '').substring(0, 100);
    const ip = String(ctx.ip || '').substring(0, 50);
    const detail = { operator, method: ctx.method, path: ctx.path };
    await prisma.operationLog.create({ data: { userId: admin?.userId ?? null, module, action, detail: detail as any, ip } });
  } catch (err) {
    console.error('[OPERATION_LOG]', err);
  }
}
