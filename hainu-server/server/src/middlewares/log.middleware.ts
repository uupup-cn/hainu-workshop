// 日志中间件：登录日志（LoginLog）与操作日志（OperationLog）记录
import { Context, Next } from 'koa';
import { prisma } from '../utils/prisma';

// 登录日志：响应完成后写 LoginLog
// 兼容用户登录（uid）和管理员登录（username）
export async function loginLogMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } finally {
    try {
      const body = ctx.request.body as any;
      const userAgent = String(ctx.headers['user-agent'] || '').substring(0, 255);
      const ip = String(ctx.ip || '').substring(0, 50);
      const successFlag = (ctx.body as any)?.code === 0 ? 'success' : 'fail';
      let userId: number | null = null;
      if (body?.uid) {
        const user = await prisma.user.findUnique({ where: { uid: String(body.uid) } });
        userId = user?.id ?? null;
      }
      if (body?.username && !userId) {
        const admin = await prisma.adminUser.findUnique({ where: { username: String(body.username) } });
        userId = admin?.id ?? null;
      }
      await prisma.loginLog.create({ data: { userId, ip, userAgent, status: successFlag } });
    } catch (err) {
      console.error('[LOGIN_LOG]', err);
    }
  }
}

// 操作日志：仅对 /api/v1/admin 下的 POST/PUT/DELETE 请求，响应成功（code===0）后写 OperationLog
// operator/method/path 存入 detail JSON；userId 取自 ctx.state.admin 载荷
export async function operationLogMiddleware(ctx: Context, next: Next) {
  await next();
  if (!['POST', 'PUT', 'DELETE'].includes(ctx.method)) return;
  if (!ctx.path.startsWith('/api/v1/admin')) return;
  const body = ctx.body as any;
  if (!body || body.code !== 0) return;
  try {
    const admin: any = ctx.state.admin;
    const module = (ctx.path.split('/').filter(Boolean)[3] || 'admin').substring(0, 50);
    const action = String((ctx.request.body as any)?.action || '').substring(0, 100);
    const ip = String(ctx.ip || '').substring(0, 50);
    const detail = { operator: admin?.username || 'admin', method: ctx.method, path: ctx.path };
    await prisma.operationLog.create({ data: { userId: admin?.userId ?? null, module, action, detail: detail as any, ip } });
  } catch (err) {
    console.error('[OPERATION_LOG]', err);
  }
}
