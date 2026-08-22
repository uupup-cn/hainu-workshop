// 图片上传控制器（用户端/管理端共用，含上传文件静态访问）
import { Context } from 'koa';
import { success } from '../../utils/response';
import { ApiError } from '../../utils/api-error';
import * as us from '../../services/admin/upload.service';

// POST /api/v1/upload/image
// 方式一：Content-Type 为 image/png|jpeg|gif|webp 的原始二进制 body，文件名通过 ?filename= 传入
// 方式二：JSON body { filename, base64 }
export async function uploadImage(ctx: Context) {
  const contentType = String(ctx.headers['content-type'] || '');
  if (/^image\/(png|jpe?g|gif|webp)/i.test(contentType)) {
    const buf = await us.readRawBody(ctx.req);
    ctx.body = success(await us.saveImage(buf, String(ctx.query.filename || '')));
    return;
  }
  const { filename, base64 } = (ctx.request.body || {}) as any;
  if (!base64 || typeof base64 !== 'string') throw new ApiError(40001, '不支持的上传方式');
  ctx.body = success(await us.saveImage(Buffer.from(base64, 'base64'), String(filename || '')));
}

// GET /uploads/年/月/文件名 —— 上传文件静态访问（按扩展名映射 Content-Type）
export async function serveUploads(ctx: Context) {
  const file = us.readUploadFile(String(ctx.params[0] || ''));
  if (!file) { ctx.status = 404; ctx.body = '文件不存在'; return; }
  ctx.set('Content-Type', file.mime);
  ctx.body = file.buf;
}
