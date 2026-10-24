#!/usr/bin/env node
/**
 * SQL that creates the hospital row and one HOSPITAL_ADMIN account in D1.
 * The password comes from the environment, never from the repository.
 *
 *   ADMIN_EMAIL=you@hospital.in ADMIN_PASSWORD='long-secret' node scripts/initial-admin.mjs
 *   npx wrangler d1 execute sanjeevani-db --remote --file=seed/initial-admin.sql
 *
 * Existing rows are left alone (INSERT OR IGNORE), so it is safe to re-run.
 * The password hash uses the same PBKDF2 format as src/lib/password.ts.
 */
import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'Hospital Administrator';
const tenant = process.env.HOSPITAL_TENANT_ID || 'hosp-sanjeevani-jalna';

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 10) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 10 characters).');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, 100_000, 32, 'sha256');
const passwordHash = `pbkdf2$100000$${salt.toString('base64')}$${hash.toString('base64')}`;
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const env = (k, d) => process.env[k] || d;

const sql = [
  `INSERT OR IGNORE INTO hospitals (id, name, slug, address, city, state, pincode, phone, emergency_phone, email) VALUES (${[
    tenant,
    env('HOSPITAL_NAME', 'Sanjeevani Multispeciality Hospital'),
    env('HOSPITAL_SLUG', 'sanjeevani-jalna'),
    env('HOSPITAL_ADDRESS', 'Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli'),
    env('HOSPITAL_CITY', 'Jalna'),
    env('HOSPITAL_STATE', 'Maharashtra'),
    env('HOSPITAL_PINCODE', '431203'),
    env('HOSPITAL_HELPLINE', '+91-75073-42222'),
    env('HOSPITAL_HELPLINE', '+91-75073-42222'),
    env('HOSPITAL_EMAIL', 'admin@sanjeevanihosp.in'),
  ]
    .map(q)
    .join(', ')});`,
  // Use the existing hospital row when data was imported from Supabase
  `INSERT OR IGNORE INTO hospital_admins (id, hospital_id, name, email, password_hash, role) VALUES (${q(randomUUID())}, (SELECT id FROM hospitals ORDER BY (id = ${q(tenant)}) DESC, created_at LIMIT 1), ${q(name)}, ${q(email)}, ${q(passwordHash)}, 'HOSPITAL_ADMIN');`,
];

const out = join(here, '..', 'seed', 'initial-admin.sql');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, sql.join('\n') + '\n');
console.log(`Wrote ${out} for ${email}`);
