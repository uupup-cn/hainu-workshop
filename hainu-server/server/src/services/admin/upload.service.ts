// 图片上传服务：本地磁盘存储（fileUploadDir/年/月/随机文件名.扩展名）+ 上传文件静态读取
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { IncomingMessage } from 'http';
import { config } from '../../config';
import { ApiError } from '../../utils/api-error';

const MAX_SIZE = 5 * 1024 * 1024; // 单文件最大 5MB
const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp']; // 仅允许图片
const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

// 读取原始请求体（图片二进制），超 5MB 时排空请求体后抛错，保证错误响应可正常返回
export function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let tooLarge = false;
    req.on('data', (c: Buffer) => {
      total += c.length;
      if (total > MAX_SIZE) { tooLarge = true; return; }
      chunks.push(c);
    });
    const tooLargeErr = new ApiError(40001, '文件大小不能超过 5MB');
    req.on('end', () => { if (tooLarge) reject(tooLargeErr); else resolve(Buffer.concat(chunks)); });
    req.on('error', (e: Error) => { reject(e); });
  });
}

// 校验扩展名与大小并保存图片，返回访问 URL
export function saveImage(buf: Buffer, filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) throw new ApiError(40001, '仅支持 png/jpg/jpeg/gif/webp 格式图片');
  if (!buf || buf.length === 0) throw new ApiError(40001, '文件内容为空');
  if (buf.length > MAX_SIZE) throw new ApiError(40001, '文件大小不能超过 5MB');
  const now = new Date();
  const ym = now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0');
  const dir = path.join(config.fileUploadDir, ym);
  fs.mkdirSync(dir, { recursive: true });
  const storedName = randomBytes(16).toString('hex') + ext;
  fs.writeFileSync(path.join(dir, storedName), buf);
  return { url: config.fileBaseUrl + '/uploads/' + ym + '/' + storedName };
}

// 读取上传目录下的文件（用于静态访问），含路径穿越防护
export function readUploadFile(rel: string): { buf: Buffer; mime: string } | null {
  if (!rel || rel.includes('..')) return null;
  const filePath = path.join(config.fileUploadDir, rel);
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }
  const mime = MIME_MAP[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  return { buf: fs.readFileSync(filePath), mime };
}
