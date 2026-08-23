/**
 * 密码哈希工具 — 使用 PBKDF2-SHA256（Node 内置 crypto，无需额外依赖）
 * 哈希格式：pbkdf2$<iterations>$<saltB64>$<hashB64>
 * 兼容：旧版无盐 SHA-256（64 位 hex），verify 时自动识别并升级
 */
import * as crypto from 'crypto';

const ITERATIONS = 100000;
const KEY_LEN = 32;
const SALT_LEN = 16;

/** 新密码哈希（PBKDF2） */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LEN);
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, 'sha256');
  return `pbkdf2$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

/** 旧版无盐 SHA-256（仅用于兼容校验） */
function legacySha256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/** 校验密码：支持新版 PBKDF2 与旧版 SHA-256（旧版校验通过后应调用 hashPassword 升级） */
export function verifyPassword(password: string, stored: string): { valid: boolean; needsUpgrade: boolean } {
  if (stored.startsWith('pbkdf2$')) {
    const [, iterStr, saltB64, hashB64] = stored.split('$');
    const hash = crypto.pbkdf2Sync(password, Buffer.from(saltB64, 'base64'), parseInt(iterStr, 10), KEY_LEN, 'sha256');
    return { valid: hash.toString('base64') === hashB64, needsUpgrade: false };
  }
  // 旧版无盐 SHA-256（64 位 hex）
  return { valid: legacySha256(password) === stored, needsUpgrade: true };
}

/** 升级旧哈希（仅当 needsUpgrade=true 时调用） */
export function maybeUpgrade(password: string, stored: string): string | null {
  return verifyPassword(password, stored).needsUpgrade ? hashPassword(password) : null;
}
