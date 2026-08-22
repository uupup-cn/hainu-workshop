// 图片上传 + 上传文件静态服务路由
import Router from 'koa-router';
import { optionalAuthMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/admin/upload.controller';
const router = new Router({ prefix: '' });
// 图片上传（支持图片二进制 body + ?filename=，或 JSON { filename, base64 }）
router.post('/api/v1/upload/image', optionalAuthMiddleware, ctrl.uploadImage);
// 上传文件静态访问（GET /uploads/年/月/文件名）
router.get('/uploads/(.*)', ctrl.serveUploads);
export default router;
