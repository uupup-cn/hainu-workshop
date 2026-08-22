import { Context, Next } from 'koa';
import { ApiError } from '../utils/api-error';
import { error } from '../utils/response';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error('[ERROR]', err.message || err, err.stack ? '\n' + err.stack.split('\n').slice(0, 6).join('\n') : '');
    if (err instanceof ApiError) {
      ctx.status = 200; ctx.body = error(err.code, err.message);
    } else {
      ctx.status = 200; ctx.body = error(50000, err.message || '服务器内部错误');
    }
  }
}
