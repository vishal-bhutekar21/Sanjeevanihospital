// Local testing only: signs HS256 JWTs with the dev secret from .dev.vars.
// Usage: node scripts/dev-token.mjs admin|portal|booking|booking-unverified|receptionist|doctor [phone]
import { readFileSync } from 'node:fs';
import { sign } from 'hono/jwt';

const vars = readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8');
const secret = vars.match(/^JWT_SECRET="?([^"\n]+)"?/m)?.[1];
if (!secret) throw new Error('JWT_SECRET missing from .dev.vars');

const kind = process.argv[2] || 'admin';
const phone = process.argv[3] || '9876543210';
const now = Math.floor(Date.now() / 1000);
const staff = (role) => ({ sub: `dev-${role.toLowerCase()}`, email: 'dev@example.invalid', role, hospitalId: 'hosp-sanjeevani-jalna' });
const payloads = {
  admin: staff('HOSPITAL_ADMIN'),
  receptionist: staff('RECEPTIONIST'),
  doctor: staff('DOCTOR'),
  portal: { sub: `patient:${phone}`, phone, type: 'PATIENT_PORTAL', role: 'PATIENT' },
  booking: { sub: `session:${phone}`, phone, type: 'BOOKING_SESSION', role: 'PATIENT_EPHEMERAL' },
  'booking-unverified': { sub: `session:${phone}`, phone, type: 'BOOKING_SESSION', role: 'PATIENT_EPHEMERAL', phoneVerified: false },
};
if (!payloads[kind]) throw new Error(`Unknown kind ${kind}`);
console.log(await sign({ ...payloads[kind], iat: now, exp: now + 3600 }, secret, 'HS256'));
