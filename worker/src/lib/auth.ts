import type { MiddlewareHandler } from 'hono';
import { sign, verify } from 'hono/jwt';
import type { AppEnv, AuthUser, Env } from '../env';
import { forbidden, unauthorized } from './http';
import { isProduction } from './config';

/**
 * HS256 JWTs, compatible with tokens from the old NestJS server when
 * JWT_SECRET is the same: payload { sub, email?, role, hospitalId?, type?, phone?, phoneVerified? }.
 */
export async function signToken(env: Env, payload: Record<string, unknown>, expiresInSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign({ ...payload, iat: now, exp: now + expiresInSeconds }, secret(env), 'HS256');
}

const secret = (env: Env) => {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 16) throw new Error('JWT_SECRET is not set (needs 16+ characters).');
  return env.JWT_SECRET;
};

async function readUser(c: Parameters<MiddlewareHandler<AppEnv>>[0]): Promise<AuthUser | null> {
  const h = c.req.header('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  let p: Record<string, any>;
  try {
    p = (await verify(m[1], secret(c.env), 'HS256')) as Record<string, any>;
  } catch {
    return null;
  }
  if (!p?.sub) return null;
  return {
    userId: String(p.sub),
    email: p.email,
    role: p.role,
    hospitalId: p.hospitalId,
    type: p.type,
    phone: p.phone,
    // OTP-verified tokens don't carry the flag; only the no-SMS fallback sets it to false
    phoneVerified: p.phoneVerified !== false,
  };
}

/** Any valid token. */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const user = await readUser(c);
  if (!user) throw unauthorized('Please sign in again.');
  c.set('user', user);
  await next();
};

/** Staff with one of these roles (patient tokens never match). */
export const requireRoles =
  (...roles: string[]): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    const user = await readUser(c);
    if (!user) throw unauthorized('Please sign in again.');
    if (!user.role || !roles.includes(user.role)) {
      throw forbidden(`Access denied: Required role [${roles.join(', ')}], current user role: [${user.role}]`);
    }
    // A deactivated or deleted staff account stops working at once, not when its token expires
    if (!user.type || user.type === 'ADMIN_SESSION') {
      const row = await c.env.DB.prepare(`SELECT is_active FROM hospital_admins WHERE id = ?`).bind(user.userId).first<{ is_active: number }>();
      const allowed = row ? row.is_active === 1 : !isProduction(c.env); // built-in accounts exist only in development
      if (!allowed) throw unauthorized('This account has been switched off. Please contact the hospital administrator.');
    }
    c.set('user', user);
    await next();
  };

/** Patient token: just verified by SMS (BOOKING_SESSION) or signed in to Patient login (PATIENT_PORTAL). */
export const requirePatient =
  (...types: ('BOOKING_SESSION' | 'PATIENT_PORTAL')[]): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    const user = await readUser(c);
    if (!user || !user.type || !types.includes(user.type as any)) {
      throw unauthorized('Invalid or expired patient session. Please verify your phone number with OTP first.');
    }
    c.set('user', user);
    await next();
  };

export const STAFF = ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST', 'DOCTOR'];
export const ADMINS = ['SUPER_ADMIN', 'HOSPITAL_ADMIN'];
export const FRONT_DESK = ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'];
