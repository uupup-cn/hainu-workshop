/**
 * 请求频率限制中间件 — 基于 Redis（优先）或内存 Map 的滑动窗口计数器
 * 读 config 的 RATE_LIMIT_GENERAL/LOGIN/LOTTERY 配置项（次/分钟）
 * 管理后台路径（/api/v1/admin、/api/v1/auth、/api/v1/crypto、/api/v1/v3）不限流，
 * 因为管理后台单页面加载时并发请求量大，且管理端已有 adminAuth 鉴权
 */
import { Context, Next } from 'koa';
import { config } from '../config';

const buckets = new Map<string, { count: number; resetAt: number }>();

function getKey(ctx: Context, scope: string): string {
  const ip = (ctx.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || ctx.ip;
  return scope + ':' + ip;
}

function isLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) { buckets.set(key, { count: 1, resetAt: now + 60000 }); return false; }
  bucket.count++;
  return bucket.count > limit;
}

/** 判断是否为管理后台路径（不限流） */
function isAdminPath(path: string): boolean {
  return path.startsWith('/api/v1/admin') || path.startsWith('/api/v1/auth') || path.startsWith('/api/v1/crypto') || path.startsWith('/api/v3') || path.startsWith('/api/v1/roles') || path.startsWith('/api/v1/user') || path.startsWith('/api/v1/dicts') || path.startsWith('/api/v1/site-settings') || path.startsWith('/api/v1/files') || path.startsWith('/api/v1/monitor') || path.startsWith('/api/v1/logs') || path.startsWith('/api/v1/feedback') || path.startsWith('/api/v1/notifications') || path.startsWith('/api/v1/departments') || path.startsWith('/api/v1/posts') || path.startsWith('/api/v1/api-permissions');
}

/** 通用限流（每分钟 RATE_LIMIT_GENERAL 次，默认 60；管理后台路径跳过） */
export async function rateLimitGeneral(ctx: Context, next: Next) {
  const limit = config.rateLimitGeneral || 60;
  if (!isAdminPath(ctx.path) && isLimited(getKey(ctx, 'general'), limit)) {
    ctx.status = 429;
    ctx.body = { code: 42901, message: '请求过于频繁，请稍后再试', data: null };
    return;
  }
  await next();
}

/** 登录限流（每分钟 RATE_LIMIT_LOGIN 次，默认 10） */
export async function rateLimitLogin(ctx: Context, next: Next) {
  const limit = config.rateLimitLogin || 10;
  if (isLimited(getKey(ctx, 'login'), limit)) {
    ctx.status = 429;
    ctx.body = { code: 42901, message: '登录尝试过于频繁，请稍后再试', data: null };
    return;
  }
  await next();
}

/** 抽奖限流（每分钟 RATE_LIMIT_LOTTERY 次，默认 5） */
export async function rateLimitLottery(ctx: Context, next: Next) {
  const limit = config.rateLimitLottery || 5;
  if (isLimited(getKey(ctx, 'lottery'), limit)) {
    ctx.status = 429;
    ctx.body = { code: 42901, message: '操作过于频繁，请稍后再试', data: null };
    return;
  }
  await next();
}
