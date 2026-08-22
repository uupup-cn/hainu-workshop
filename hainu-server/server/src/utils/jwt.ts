import jwt from 'jsonwebtoken';
import { config } from '../config';

export function signAccessToken(payload: object, isAdmin = false): string {
  const expiresIn = isAdmin ? config.jwtAdminAccessExpires : config.jwtAccessExpires;
  return jwt.sign(payload, config.jwtSecret, { expiresIn } as jwt.SignOptions);
}
export function signRefreshToken(payload: object, isAdmin = false): string {
  const expiresIn = isAdmin ? config.jwtAdminRefreshExpires : config.jwtRefreshExpires;
  return jwt.sign(payload, config.jwtSecret, { expiresIn } as jwt.SignOptions);
}
export function verifyToken(token: string): any {
  return jwt.verify(token, config.jwtSecret);
}
