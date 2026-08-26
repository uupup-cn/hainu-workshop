import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { errorHandler } from './middlewares/error.middleware';
import { rateLimitGeneral } from './middlewares/rate-limit.middleware';
import { operationLogMiddleware } from './middlewares/log.middleware';
import { config } from './config';

const app = new Koa();
app.use(errorHandler);
// CORS：支持逗号分隔多源（生产域名+IP:端口），回退 * 用于开发
const origins = config.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin: (ctx) => {
    const reqOrigin = ctx.headers.origin || '';
    if (origins.includes('*') || origins.includes(reqOrigin)) return reqOrigin;
    return origins[0] || '';
  },
  credentials: true,
}));
app.use(bodyParser({ jsonLimit: '8mb' })); // 8MB 支持 base64 图片上传
app.use(rateLimitGeneral);
app.use(operationLogMiddleware); // 操作日志：记录 admin POST/PUT/DELETE 操作

// 路由
// 模板集成路由必须先挂载：其字面量路径（如 /notifications/admin）需优先于用户端参数路由（/notifications/:id）
import integrationRoutes from './routes/admin/integration.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contentRoutes from './routes/content.routes';
import freshmanRoutes from './routes/freshman.routes';
import campusDataRoutes from './routes/campus-data.routes';
import roommateRoutes from './routes/roommate.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import newsRoutes from './routes/news.routes';
import alumniRoutes from './routes/alumni.routes';
import lotteryRoutes from './routes/lottery.routes';
import courseRoutes from './routes/course.routes';
import toolRoutes from './routes/tool.routes';
import notificationRoutes from './routes/notification.routes';
import communityRoutes from './routes/community.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin/index.routes';
import adminContentRoutes from './routes/admin/content.routes';
import adminCommunityRoutes from './routes/admin/community.routes';
import adminCourseRoutes from './routes/admin/course.routes';
import adminToolRoutes from './routes/admin/tool.routes';
import adminSystemRoutes from './routes/admin/system.routes';
import adminMonitorRoutes from './routes/admin/monitor.routes';

app.use(integrationRoutes.routes()).use(integrationRoutes.allowedMethods());
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(contentRoutes.routes()).use(contentRoutes.allowedMethods());
app.use(freshmanRoutes.routes()).use(freshmanRoutes.allowedMethods());
app.use(campusDataRoutes.routes()).use(campusDataRoutes.allowedMethods());
app.use(roommateRoutes.routes()).use(roommateRoutes.allowedMethods());
app.use(marketplaceRoutes.routes()).use(marketplaceRoutes.allowedMethods());
app.use(newsRoutes.routes()).use(newsRoutes.allowedMethods());
app.use(alumniRoutes.routes()).use(alumniRoutes.allowedMethods());
app.use(lotteryRoutes.routes()).use(lotteryRoutes.allowedMethods());
app.use(courseRoutes.routes()).use(courseRoutes.allowedMethods());
app.use(toolRoutes.routes()).use(toolRoutes.allowedMethods());
app.use(notificationRoutes.routes()).use(notificationRoutes.allowedMethods());
app.use(communityRoutes.routes()).use(communityRoutes.allowedMethods());
app.use(uploadRoutes.routes()).use(uploadRoutes.allowedMethods());
app.use(adminRoutes.routes()).use(adminRoutes.allowedMethods());
app.use(adminContentRoutes.routes()).use(adminContentRoutes.allowedMethods());
app.use(adminCommunityRoutes.routes()).use(adminCommunityRoutes.allowedMethods());
app.use(adminCourseRoutes.routes()).use(adminCourseRoutes.allowedMethods());
app.use(adminToolRoutes.routes()).use(adminToolRoutes.allowedMethods());
app.use(adminSystemRoutes.routes()).use(adminSystemRoutes.allowedMethods());
app.use(adminMonitorRoutes.routes()).use(adminMonitorRoutes.allowedMethods());

app.listen(config.port, () => {
  console.log('[海大工坊] 服务器已启动，端口: ' + config.port);
});

export default app;
