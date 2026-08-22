// JWT 工具测试（无数据库依赖）：签发 / 校验 / 篡改
import { describe, it, expect } from 'vitest';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';

describe('JWT 工具', () => {
  it('签发访问 token 并正确校验，载荷字段保留', () => {
    const token = signAccessToken({ userId: 1, identity: 'undergraduate' });
    expect(typeof token).toBe('string');
    const payload = verifyToken(token);
    expect(payload.userId).toBe(1);
    expect(payload.identity).toBe('undergraduate');
    // 过期时间在当前时刻之后（.env.test 配置 7d）
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    expect(payload.exp - payload.iat).toBe(7 * 24 * 3600);
  });

  it('签发刷新 token 并正确校验', () => {
    const token = signRefreshToken({ userId: 2 });
    const payload = verifyToken(token);
    expect(payload.userId).toBe(2);
    expect(payload.exp - payload.iat).toBe(30 * 24 * 3600);
  });

  it('管理员 token 使用 24h 过期时间并携带管理员标识', () => {
    const token = signAccessToken({ userId: 1, isAdmin: true }, true);
    const payload = verifyToken(token);
    expect(payload.isAdmin).toBe(true);
    expect(payload.exp - payload.iat).toBe(24 * 3600);
  });

  it('篡改载荷的 token 校验抛错', () => {
    const token = signAccessToken({ userId: 1, identity: 'undergraduate' });
    const parts = token.split('.');
    const forgedPayload = Buffer.from(JSON.stringify({ userId: 999, identity: 'admin' })).toString('base64url');
    const forged = `${parts[0]}.${forgedPayload}.${parts[2]}`;
    expect(() => verifyToken(forged)).toThrow();
  });

  it('乱码 token 校验抛错', () => {
    expect(() => verifyToken('not.a.jwt')).toThrow();
    expect(() => verifyToken('')).toThrow();
  });
});
