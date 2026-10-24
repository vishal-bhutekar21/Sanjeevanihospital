/**
 * Patient OTP + staff login. Port of backend/src/auth (auth.controller.ts, auth.service.ts, dto/).
 * OTP codes live in otp_sessions (hashed), counters in rate_limits.
 */
import { Hono, type Context } from 'hono';
import { decode } from 'hono/jwt';
import type { AppEnv, Env } from '../env';
import { AdminRole } from '../env';
import { hospital, isProduction, flag } from '../lib/config';
import { HttpError, badRequest, conflict, forbidden, notFound, ok, body, clientIp, tooMany, unauthorized } from '../lib/http';
import { all, first, run, uuid, nowIso } from '../lib/db';
import { requireAuth, requireRoles, signToken } from '../lib/auth';
import { hashPassword, verifyPassword, sha256, safeEqual } from '../lib/password';
import { hit } from '../lib/ratelimit';
import { logAction } from '../lib/audit';

export const authRoutes = new Hono<AppEnv>();

const OTP_TTL_MS = 10 * 60 * 1000;
const BOOKING_TOKEN_SECONDS = 30 * 60;
const ADMIN_TOKEN_SECONDS = 7 * 24 * 3600; // old JwtModule signOptions.expiresIn '7d'

const serviceUnavailable = (m: string) => new HttpError(503, m, 'Service Unavailable');

const isStr = (v: unknown): v is string => typeof v === 'string';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** MSG91 is "configured" only when a real auth key and OTP template are set. */
function msg91(env: Env) {
  const authKey = env.MSG91_AUTH_KEY || '';
  const templateId = env.MSG91_TEMPLATE_ID || '';
  return { configured: !!authKey && !authKey.startsWith('your_') && !!templateId, authKey, templateId };
}

async function sendOtpSms(env: Env, phone: string, otp: string) {
  const { authKey, templateId } = msg91(env);
  const url =
    `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}` +
    `&mobile=91${phone}&otp=${otp}`;
  let res: Response | null = null;
  let resBody: any = {};
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { authkey: authKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    resBody = await res.json().catch(() => ({}));
  } catch (err) {
    resBody = { fetchError: (err as Error).message };
  }
  if (!res || !res.ok || resBody?.type === 'error') {
    console.error(`MSG91 OTP send failed for +91-${phone}: ${JSON.stringify(resBody)}`);
    throw serviceUnavailable('We could not send the SMS right now. Please try again in a minute or call reception.');
  }
}

/** Uniform random 6-digit code. */
function randomOtp(): string {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / 1_000_000) * 1_000_000;
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return String(buf[0] % 1_000_000).padStart(6, '0');
}

// ─── 1. Send OTP ─────────────────────────────────────────────────────────────

authRoutes.post('/send-otp', async (c) => {
  const env = c.env;
  const { phone } = await body<{ phone?: unknown }>(c);
  if (!isStr(phone) || !/^[6-9]\d{9}$/.test(phone)) {
    throw badRequest('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9');
  }

  // Max 3 OTP requests per 10 minutes per phone
  if (!(await hit(env, `otp:phone:${phone}`, 3, OTP_TTL_MS))) {
    throw badRequest('Too many OTP requests for this mobile number. Please wait 10 minutes before retrying.');
  }

  const sessionId = uuid();
  const sms = msg91(env);

  if (!sms.configured && isProduction(env)) {
    // No SMS gateway in production: book without a code, number marked "not verified".
    // REQUIRE_OTP=true turns this off.
    if (flag(env.REQUIRE_OTP)) {
      console.error('MSG91_AUTH_KEY / MSG91_TEMPLATE_ID are not set; cannot send booking OTPs.');
      throw serviceUnavailable(`Online booking is temporarily unavailable. Please call reception on ${hospital(env).helpline}.`);
    }
    if (!(await hit(env, `nosms:ip:${clientIp(c)}`, 5, 24 * 3600_000))) {
      throw badRequest(`Too many bookings from this connection today. Please call reception on ${hospital(env).helpline}.`);
    }
    console.warn(`SMS not configured: booking for +91-${phone} continues without OTP (mobile not verified).`);
    const token = await signToken(
      env,
      { sub: sessionId, phone, type: 'BOOKING_SESSION', role: 'PATIENT_EPHEMERAL', phoneVerified: false },
      BOOKING_TOKEN_SECONDS,
    );
    return ok(c, {
      sessionId,
      phone: `+91-${phone}`,
      otpRequired: false,
      token,
      message: 'SMS codes are not set up yet. Reception will call this number to confirm the booking.',
    });
  }

  // Real random code when SMS is set up; fixed code only for local development
  const code = sms.configured ? randomOtp() : '123456';
  if (sms.configured) {
    await sendOtpSms(env, phone, code);
  } else {
    console.warn(`[dev] SMS not configured. OTP for +91-${phone} is ${code}`);
  }

  await run(
    env,
    `INSERT INTO otp_sessions (id, phone, otp_hash, attempts, expires_at) VALUES (?, ?, ?, 0, ?)`,
    sessionId,
    phone,
    await sha256(code + sessionId),
    new Date(Date.now() + OTP_TTL_MS).toISOString(),
  );

  return ok(c, {
    sessionId,
    phone: `+91-${phone}`,
    otpRequired: true,
    expiresInSeconds: 600,
    message: 'OTP sent by SMS',
  });
});

// ─── 2. Verify OTP ───────────────────────────────────────────────────────────

authRoutes.post('/verify-otp', async (c) => {
  const env = c.env;
  const { sessionId, otp } = await body<{ sessionId?: unknown; otp?: unknown }>(c);
  if (!isStr(sessionId) || !UUID_V4.test(sessionId)) throw badRequest('Invalid session ID format');
  if (!isStr(otp) || otp.length !== 6) throw badRequest('OTP must be exactly 6 numeric digits');

  // Count the attempt atomically before checking the code
  const row = await first<{ id: string; phone: string; otp_hash: string; attempts: number; expires_at: string }>(
    env,
    `UPDATE otp_sessions SET attempts = attempts + 1 WHERE id = ? AND verified_at IS NULL RETURNING id, phone, otp_hash, attempts, expires_at`,
    sessionId,
  );
  if (!row) throw unauthorized('Session expired or not found. Please request a new OTP.');

  if (Date.now() > Date.parse(row.expires_at)) {
    await run(env, `DELETE FROM otp_sessions WHERE id = ?`, sessionId);
    throw unauthorized('OTP has expired. Please request a new OTP.');
  }
  if (row.attempts > 5) {
    await run(env, `DELETE FROM otp_sessions WHERE id = ?`, sessionId);
    throw badRequest('Too many invalid attempts. Session terminated for security.');
  }
  if (!safeEqual(await sha256(otp + row.id), row.otp_hash)) {
    throw unauthorized('Invalid OTP. Please check the code and retry.');
  }

  // Each code works once (also guards two simultaneous correct submissions)
  const used = await run(env, `UPDATE otp_sessions SET verified_at = ? WHERE id = ? AND verified_at IS NULL`, nowIso(), row.id);
  if (used !== 1) throw unauthorized('This code was already used. Please request a new OTP.');

  // Patient booking token, valid 30 minutes
  const token = await signToken(
    env,
    { sub: row.id, phone: row.phone, type: 'BOOKING_SESSION', role: 'PATIENT_EPHEMERAL' },
    BOOKING_TOKEN_SECONDS,
  );
  return ok(c, {
    token,
    sessionId: row.id,
    phone: `+91-${row.phone}`,
    status: 'OTP_VERIFIED',
    sessionExpiresIn: 1800,
    message: 'Mobile number verified successfully. You may now proceed with patient details.',
  });
});

// ─── 3. Staff login ──────────────────────────────────────────────────────────

interface AdminRecord {
  id: string;
  hospitalId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

/** Local development only (never in production), same as the old in-memory accounts. */
const BUILT_IN_ADMINS = (env: Env) => [
  {
    id: 'admin-sanjeevani-01',
    hospitalId: hospital(env).id,
    name: 'Dr. Bagal / Hospital Administrator',
    email: 'admin@sanjeevanihosp.in',
    password: 'Admin@123',
    role: AdminRole.HOSPITAL_ADMIN,
    isActive: true,
  },
  {
    id: 'super-admin-01',
    hospitalId: hospital(env).id,
    name: 'Platform Super Admin',
    email: 'superadmin@sanjeevanihosp.in',
    password: 'SuperAdmin@123',
    role: AdminRole.SUPER_ADMIN,
    isActive: true,
  },
];

authRoutes.post('/admin/login', async (c) => {
  const env = c.env;
  const { email, password } = await body<{ email?: unknown; password?: unknown }>(c);
  if (!isStr(email) || !EMAIL.test(email)) throw badRequest('Please provide a valid official email address');
  if (!isStr(password) || password.length < 6) throw badRequest('Password must contain at least 6 characters');

  if (!(await hit(env, `login:ip:${clientIp(c)}`, 10, 15 * 60_000))) {
    throw tooMany('Too many sign-in attempts. Please wait 15 minutes and try again.');
  }

  let admin: AdminRecord | undefined;
  let passwordValid = false;

  const row = await first<{
    id: string;
    hospital_id: string;
    name: string;
    email: string;
    password_hash: string | null;
    role: string;
  }>(
    env,
    `SELECT id, hospital_id, name, email, password_hash, role FROM hospital_admins
     WHERE email = ? COLLATE NOCASE AND is_active = 1`,
    email.toLowerCase(),
  );

  if (row) {
    admin = { id: row.id, hospitalId: row.hospital_id, name: row.name, email: row.email, role: row.role, isActive: true };
    const check = await verifyPassword(row.password_hash, password);
    passwordValid = check.ok;
    if (check.ok && check.needsUpgrade) {
      // bcrypt hash from Supabase: switch to PBKDF2 now that we know the password
      try {
        await run(env, `UPDATE hospital_admins SET password_hash = ?, updated_at = ? WHERE id = ?`, await hashPassword(password), nowIso(), row.id);
      } catch (err) {
        console.error('password re-hash failed', (err as Error).message);
      }
    }
  } else if (!isProduction(env)) {
    const builtIn = BUILT_IN_ADMINS(env).find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (builtIn) {
      admin = builtIn;
      passwordValid = safeEqual(password, builtIn.password);
    }
  }

  if (!admin || !admin.isActive) {
    throw unauthorized('Invalid email address or deactivated admin account.');
  }
  if (!passwordValid) {
    throw unauthorized('Invalid password. Please check your credentials.');
  }

  const token = await signToken(
    env,
    { sub: admin.id, email: admin.email, name: admin.name, role: admin.role, hospitalId: admin.hospitalId, type: 'ADMIN_SESSION' },
    ADMIN_TOKEN_SECONDS,
  );

  await logAction(env, {
    userId: admin.id,
    action: 'ADMIN_LOGIN_SUCCESS',
    entity: 'HOSPITAL_ADMIN',
    entityId: admin.id,
    metadata: { email: admin.email, role: admin.role },
  });

  return ok(c, {
    token,
    admin: {
      id: admin.id,
      hospitalId: admin.hospitalId,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      hospitalName: hospital(env).name,
    },
    message: 'Admin authenticated successfully',
  });
});

// ─── 4. Register staff (admins only) ─────────────────────────────────────────

authRoutes.post('/admin/register', requireRoles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN), async (c) => {
  const env = c.env;
  const dto = await body<{ name?: unknown; email?: unknown; password?: unknown; role?: unknown; hospitalId?: unknown }>(c);
  if (!isStr(dto.name) || dto.name.length < 3) throw badRequest('name must be longer than or equal to 3 characters');
  if (!isStr(dto.email) || !EMAIL.test(dto.email)) throw badRequest('email must be an email');
  if (!isStr(dto.password) || dto.password.length < 8) {
    throw badRequest('Password must be at least 8 characters with strong complexity');
  }
  const roles = Object.values(AdminRole) as string[];
  if (dto.role !== undefined && dto.role !== null && (!isStr(dto.role) || !roles.includes(dto.role))) {
    throw badRequest(`role must be one of the following values: ${roles.join(', ')}`);
  }
  if (!isStr(dto.hospitalId)) throw badRequest('hospitalId must be a string');

  const creatorRole = c.get('user').role;
  const role = (dto.role as string) || AdminRole.HOSPITAL_ADMIN;
  if (role === AdminRole.SUPER_ADMIN && creatorRole !== AdminRole.SUPER_ADMIN) {
    throw forbidden('Only a super admin can create another super admin.');
  }
  checkPasswordStrength(dto.password);
  const email = dto.email.toLowerCase();
  const name = dto.name.trim();

  const taken =
    (!isProduction(env) && BUILT_IN_ADMINS(env).some((a) => a.email === email)) ||
    (await first(env, `SELECT id FROM hospital_admins WHERE email = ? COLLATE NOCASE`, email));
  if (taken) throw conflict('An account with this email already exists.');

  // Accounts always belong to this hospital (like the old server's hospital row),
  // whatever hospitalId the browser sent. Create the hospitals row from config if missing.
  const hospitalId = await ensureHospitalRow(env);

  const id = uuid();
  try {
    await run(
      env,
      `INSERT INTO hospital_admins (id, hospital_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      id, hospitalId, name, email, await hashPassword(dto.password), role,
    );
  } catch (err) {
    if (/UNIQUE/i.test((err as Error).message)) throw conflict('An account with this email already exists.');
    throw err;
  }

  await logAction(env, {
    userId: c.get('user').userId,
    action: 'ADMIN_CREATED',
    entity: 'HOSPITAL_ADMIN',
    entityId: id,
    metadata: { name, email, role },
  });

  return ok(c, { id, hospitalId, name, email, role, message: 'New administrator registered successfully' }, 201);
});

// ─── 4b. Team logins: list, stop / allow access, reset password (admins only) ─

function checkPasswordStrength(password: string) {
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw badRequest('Password must be at least 8 characters and include a letter and a number.');
  }
}

async function ensureHospitalRow(env: Env): Promise<string> {
  const h = hospital(env);
  if (!(await first(env, `SELECT id FROM hospitals WHERE id = ?`, h.id))) {
    await run(
      env,
      `INSERT OR IGNORE INTO hospitals (id, name, slug, address, city, state, pincode, phone, emergency_phone, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      h.id, h.name, h.slug, h.addressLine, h.city, h.state, h.pincode, h.helpline, h.helpline, h.email,
    );
  }
  return h.id;
}

/** Who is making the change, from the token (name is in staff tokens). */
function actorOf(c: Context<AppEnv>) {
  const user = c.get('user');
  let name: unknown;
  try {
    const token = (c.req.header('authorization') || '').replace(/^Bearer\s+/i, '');
    name = decode(token).payload.name; // already verified by requireRoles
  } catch {
    /* no name in the token */
  }
  return { id: user.userId, role: user.role, name: (isStr(name) && name) || user.email || undefined };
}

const MANAGERS = [AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN];

authRoutes.get('/admin/users', requireRoles(...MANAGERS), async (c) => {
  const env = c.env;
  const rows = await all<{ id: string; name: string; email: string; role: string; is_active: number; created_at: string }>(
    env,
    `SELECT id, name, email, role, is_active, created_at FROM hospital_admins WHERE hospital_id = ? ORDER BY created_at ASC`,
    hospital(env).id,
  );
  const out: { id: string; name: string; email: string; role: string; isActive: boolean; createdAt?: string }[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    isActive: r.is_active === 1,
    createdAt: r.created_at,
  }));
  if (!isProduction(env)) {
    BUILT_IN_ADMINS(env)
      .filter((a) => !out.some((o) => o.email === a.email))
      .forEach((a) => out.push({ id: a.id, name: a.name, email: a.email, role: a.role, isActive: a.isActive }));
  }
  return ok(c, out);
});

/** The account to change; only a super admin may change a super admin. */
async function findAdminForChange(env: Env, id: string, actor: { id: string; role: string }) {
  const row = await first<{ id: string; name: string; email: string; role: string; hospital_id: string }>(
    env,
    `SELECT id, name, email, role, hospital_id FROM hospital_admins WHERE id = ? AND hospital_id = ?`,
    id,
    hospital(env).id,
  );
  let builtIn = false;
  let target = row ? { id: row.id, name: row.name, email: row.email, role: row.role } : undefined;
  if (!target && !isProduction(env)) {
    const m = BUILT_IN_ADMINS(env).find((a) => a.id === id);
    if (m) {
      target = { id: m.id, name: m.name, email: m.email, role: m.role };
      builtIn = true;
    }
  }
  if (!target) throw notFound('Staff account not found.');
  if (target.role === AdminRole.SUPER_ADMIN && actor.role !== AdminRole.SUPER_ADMIN) {
    throw forbidden('Only a super admin can change a super admin account.');
  }
  return { target, builtIn, isSelf: actor.id === id };
}

// Built-in accounts exist only in local development and live in code, so nothing can be saved for them
const BUILT_IN_FIXED = 'Built-in development accounts cannot be changed. Create a real login instead.';

authRoutes.patch('/admin/users/:id/active', requireRoles(...MANAGERS), async (c) => {
  const env = c.env;
  const id = c.req.param('id');
  const { isActive: isActiveIn } = await body<{ isActive?: unknown }>(c);
  const isActive = isActiveIn === true;
  const actor = actorOf(c);
  const { target, builtIn, isSelf } = await findAdminForChange(env, id, actor);
  if (isSelf && !isActive) throw badRequest('You cannot deactivate your own account.');
  if (builtIn) throw badRequest(BUILT_IN_FIXED);
  await run(env, `UPDATE hospital_admins SET is_active = ?, updated_at = ? WHERE id = ?`, isActive, nowIso(), id);
  await logAction(env, {
    userId: actor.id,
    action: isActive ? 'ADMIN_ACTIVATED' : 'ADMIN_DEACTIVATED',
    entity: 'HOSPITAL_ADMIN',
    entityId: id,
    metadata: { email: target.email, by: actor.name },
  });
  return ok(c, { id, isActive });
});

authRoutes.post('/admin/users/:id/reset-password', requireRoles(...MANAGERS), async (c) => {
  const env = c.env;
  const id = c.req.param('id');
  const { password } = await body<{ password?: unknown }>(c);
  const actor = actorOf(c);
  const { target, builtIn } = await findAdminForChange(env, id, actor);
  const newPassword = isStr(password) ? password : '';
  checkPasswordStrength(newPassword);
  if (builtIn) throw badRequest(BUILT_IN_FIXED);
  await run(env, `UPDATE hospital_admins SET password_hash = ?, updated_at = ? WHERE id = ?`, await hashPassword(newPassword), nowIso(), id);
  await logAction(env, {
    userId: actor.id,
    action: 'ADMIN_PASSWORD_RESET',
    entity: 'HOSPITAL_ADMIN',
    entityId: id,
    metadata: { email: target.email, by: actor.name },
  });
  return ok(c, { id, message: 'Password changed.' });
});

// ─── 5. Who am I ─────────────────────────────────────────────────────────────

authRoutes.get('/me', requireAuth, (c) => ok(c, { user: c.get('user'), authenticatedAt: new Date().toISOString() }));
