import { prisma } from '../utils/prisma';
import * as crypto from 'crypto';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { codeToOpenid } from '../utils/wechat';
import { generateUid } from '../utils/uid';
import { ApiError } from '../utils/api-error';

function hashPassword(p: string): string { return crypto.createHash('sha256').update(p).digest('hex'); }
function genPassword(): string { return crypto.randomBytes(4).toString('hex'); }

export async function registerByWechat(code: string, identity: string, nickname?: string, avatar?: string) {
  const openid = await codeToOpenid(code);
  let user = await prisma.user.findUnique({ where: { openid } });
  if (user) {
    return { uid: user.uid, accessToken: signAccessToken({ userId: user.id, identity: user.identity }), refreshToken: signRefreshToken({ userId: user.id }), identity: user.identity, isNewUser: false };
  }
  const defaultPassword = genPassword();
  user = await prisma.user.create({ data: { openid, uid: 'TEMP', nickname: nickname || '海大用户', avatar: avatar || '', passwordHash: hashPassword(defaultPassword), identity } });
  const uid = await generateUid(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { uid } });
  return { uid, defaultPassword, accessToken: signAccessToken({ userId: user.id, identity }), refreshToken: signRefreshToken({ userId: user.id }), identity, isNewUser: true };
}

export async function loginByUid(uid: string, password: string) {
  const user = await prisma.user.findUnique({ where: { uid } });
  if (!user) throw new ApiError(40003, '用户不存在');
  if (user.passwordHash !== hashPassword(password)) throw new ApiError(40001, '密码错误');
  return { uid: user.uid, accessToken: signAccessToken({ userId: user.id, identity: user.identity }), refreshToken: signRefreshToken({ userId: user.id }), identity: user.identity };
}

export async function refreshToken(refreshTokenStr: string) {
  const jwt = require('jsonwebtoken'); const { config } = require('../config');
  try {
    const payload = jwt.verify(refreshTokenStr, config.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new ApiError(40003, '用户不存在');
    return { accessToken: signAccessToken({ userId: user.id, identity: user.identity }) };
  } catch { throw new ApiError(40002, 'Refresh Token 无效或已过期'); }
}

// Admin login
export async function adminLogin(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) throw new ApiError(40003, '用户不存在');
  if (user.status !== 'active') throw new ApiError(40004, '账号已禁用');
  if (user.passwordHash !== hashPassword(password)) throw new ApiError(40001, '密码错误');
  return { accessToken: signAccessToken({ userId: user.id, isAdmin: true }, true), refreshToken: signRefreshToken({ userId: user.id }, true), userInfo: { id: user.id, username: user.username, nickname: user.nickname } };
}
