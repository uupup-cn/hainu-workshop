import dotenv from 'dotenv';

dotenv.config();

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET!,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '7d',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d',
  jwtAdminAccessExpires: process.env.JWT_ADMIN_ACCESS_EXPIRES || '24h',
  jwtAdminRefreshExpires: process.env.JWT_ADMIN_REFRESH_EXPIRES || '7d',
  wxAppid: process.env.WX_APPID!,
  wxAppSecret: process.env.WX_APP_SECRET!,
  fileUploadDir: process.env.FILE_UPLOAD_DIR || './uploads',
  fileBaseUrl: process.env.FILE_BASE_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  port: parseInt(process.env.PORT || '3000', 10),
  rateLimitGeneral: parseInt(process.env.RATE_LIMIT_GENERAL || '60', 10),
  rateLimitLogin: parseInt(process.env.RATE_LIMIT_LOGIN || '10', 10),
  rateLimitLottery: parseInt(process.env.RATE_LIMIT_LOTTERY || '5', 10),
};
