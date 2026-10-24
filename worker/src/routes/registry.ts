/**
 * Registered patients (reception): registration numbers, family members on one mobile, search, edit.
 * Port of backend/src/patients/* (commit 507c42a). Mounted at /patients.
 *
 * Table `patients` (migrations/0002_patients_receipts.sql), hospital_id = HOSPITAL_TENANT_ID.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first, nowIso, run, uuid } from '../lib/db';
import { badRequest, body, conflict, notFound, ok } from '../lib/http';
import { FRONT_DESK, STAFF, requireRoles } from '../lib/auth';
import { logAction } from '../lib/audit';
import { codePrefix, nextNumber } from '../lib/counters';

export interface PatientRow {
  id: string;
  regNo: string;
  name: string;
  phone: string;
  age: number | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  idNumber: string | null;
  scheme: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Actor {
  id?: string;
  name?: string;
  role?: string;
}

/** Who is acting, from the token (staff tokens carry email, not a display name). */
export const actorOf = (user: { userId?: string; email?: string; role?: string } | undefined): Actor => ({
  id: user?.userId,
  name: user?.email || user?.userId,
  role: user?.role,
});

const PHONE = /^[6-9]\d{9}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const GENDERS = ['Male', 'Female', 'Other'];

const clean = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim().replace(/\s+/g, ' ').slice(0, max);
  return t || null;
};

/** Age in whole years today (hospital time) for a YYYY-MM-DD birth date */
export const ageFromDob = (dob: string, now = new Date()): number => {
  const today = new Date(now.getTime() + 330 * 60 * 1000);
  const [y, m, d] = dob.split('-').map(Number);
  let age = today.getUTCFullYear() - y;
  if (today.getUTCMonth() + 1 < m || (today.getUTCMonth() + 1 === m && today.getUTCDate() < d)) age -= 1;
  return Math.max(0, age);
};

const toRow = (r: Record<string, any>): PatientRow => ({
  id: r.id,
  regNo: r.reg_no,
  name: r.name,
  phone: r.phone,
  age: r.age ?? null,
  dateOfBirth: r.date_of_birth ?? null,
  gender: r.gender ?? null,
  address: r.address ?? null,
  idNumber: r.id_number ?? null,
  scheme: r.scheme ?? null,
  emergencyContactName: r.emergency_contact_name ?? null,
  emergencyContactPhone: r.emergency_contact_phone ?? null,
  notes: r.notes ?? null,
  createdBy: r.created_by ?? null,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

// ─── validation (same rules as CreatePatientDto / UpdatePatientDto) ─────────

const present = (v: unknown): boolean => v !== undefined && v !== null;

/** JSON object body; anything else counts as empty. */
export const objectBody = async (c: Parameters<typeof body>[0]): Promise<Record<string, any>> => {
  const b = await body(c);
  return b && typeof b === 'object' && !Array.isArray(b) ? b : {};
};

function validate(dto: Record<string, any>, creating: boolean) {
  if (creating || present(dto.name)) {
    if (typeof dto.name !== 'string' || dto.name.trim().length < 2 || dto.name.length > 120) {
      throw badRequest('Name must be 2 to 120 characters.');
    }
  }
  if (creating || present(dto.phone)) {
    if (typeof dto.phone !== 'string' || !PHONE.test(dto.phone)) throw badRequest('Mobile number must be 10 digits');
  }
  if (present(dto.age) && (!Number.isInteger(dto.age) || dto.age < 0 || dto.age > 120)) {
    throw badRequest('Age must be a whole number from 0 to 120.');
  }
  if (present(dto.dateOfBirth) && (typeof dto.dateOfBirth !== 'string' || !DAY.test(dto.dateOfBirth))) {
    throw badRequest('Date of birth must be YYYY-MM-DD');
  }
  if (present(dto.gender) && !GENDERS.includes(dto.gender)) throw badRequest('Gender must be Male, Female or Other.');
  const texts: [string, number, string][] = [
    ['address', 300, 'Address'],
    ['idNumber', 40, 'ID number'],
    ['scheme', 80, 'Scheme'],
    ['emergencyContactName', 120, 'Emergency contact name'],
    ['notes', 500, 'Notes'],
  ];
  for (const [key, max, label] of texts) {
    if (present(dto[key]) && (typeof dto[key] !== 'string' || dto[key].length > max)) {
      throw badRequest(`${label} must be text of at most ${max} characters.`);
    }
  }
  if (present(dto.emergencyContactPhone) && (typeof dto.emergencyContactPhone !== 'string' || !PHONE.test(dto.emergencyContactPhone))) {
    throw badRequest('Emergency contact number must be 10 digits');
  }
}

// ─── data access (also used by receipts) ────────────────────────────────────

export async function patientsByPhone(env: Env, phone: string): Promise<PatientRow[]> {
  const ten = String(phone || '').replace(/\D/g, '').slice(-10);
  const rows = await all(env, `SELECT * FROM patients WHERE hospital_id = ? AND phone = ? ORDER BY created_at ASC`, hospital(env).id, ten);
  return rows.map(toRow);
}

export async function getPatient(env: Env, id: string): Promise<PatientRow> {
  const r = await first(env, `SELECT * FROM patients WHERE id = ? AND hospital_id = ?`, id, hospital(env).id);
  if (!r) throw notFound('Patient not found.');
  return toRow(r);
}

const twinError = (twin: PatientRow) => conflict(`${twin.name} is already registered with this mobile number (${twin.regNo}).`);

// ─── routes ─────────────────────────────────────────────────────────────────

// Registered patients: staff only (names, mobile numbers, addresses)
export const registryRoutes = new Hono<AppEnv>();

registryRoutes.get('/', requireRoles(...STAFF), async (c) => {
  const term = (c.req.query('q') || '').trim();
  const limitRaw = c.req.query('limit');
  const n = limitRaw ? Number(limitRaw) : 50;
  const take = Math.min(Math.max(Number.isFinite(n) ? Math.floor(n) : 50, 1), 200);
  const hid = hospital(c.env).id;
  let rows: Record<string, any>[];
  if (term) {
    const digits = term.replace(/\D/g, '') || '__none__';
    rows = await all(
      c.env,
      `SELECT * FROM patients
        WHERE hospital_id = ?
          AND (instr(lower(name), lower(?)) > 0 OR instr(phone, ?) > 0 OR instr(lower(reg_no), lower(?)) > 0)
        ORDER BY created_at DESC LIMIT ?`,
      hid,
      term,
      digits,
      term,
      take,
    );
  } else {
    rows = await all(c.env, `SELECT * FROM patients WHERE hospital_id = ? ORDER BY created_at DESC LIMIT ?`, hid, take);
  }
  return ok(c, rows.map(toRow));
});

// Declared before '/:id' so "by-phone" is not read as an id
registryRoutes.get('/by-phone/:phone', requireRoles(...STAFF), async (c) => ok(c, await patientsByPhone(c.env, c.req.param('phone'))));

registryRoutes.get('/:id', requireRoles(...STAFF), async (c) => ok(c, await getPatient(c.env, c.req.param('id'))));

registryRoutes.post('/', requireRoles(...FRONT_DESK), async (c) => {
  const dto = await objectBody(c);
  validate(dto, true);
  const actor = actorOf(c.get('user'));
  const name = clean(dto.name, 120)!;
  // The same person is not registered twice; family members with other names can share a mobile number
  const twin = (await patientsByPhone(c.env, dto.phone)).find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (twin) throw twinError(twin);

  const age = dto.dateOfBirth ? ageFromDob(dto.dateOfBirth) : present(dto.age) ? dto.age : null;
  const regNo = `${codePrefix(c.env)}-P-${String(await nextNumber(c.env, 'patient')).padStart(6, '0')}`;
  const id = uuid();
  const now = nowIso();
  await run(
    c.env,
    `INSERT INTO patients (id, hospital_id, reg_no, name, phone, age, date_of_birth, gender, address, id_number, scheme,
       emergency_contact_name, emergency_contact_phone, notes, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    hospital(c.env).id,
    regNo,
    name,
    dto.phone,
    age,
    dto.dateOfBirth || null,
    dto.gender || null,
    clean(dto.address, 300),
    clean(dto.idNumber, 40),
    clean(dto.scheme, 80),
    clean(dto.emergencyContactName, 120),
    dto.emergencyContactPhone || null,
    clean(dto.notes, 500),
    actor.name || actor.id || null,
    now,
    now,
  );
  const row = await getPatient(c.env, id);
  await logAction(c.env, {
    userId: actor.id,
    action: 'PATIENT_REGISTERED',
    entity: 'PATIENT',
    entityId: row.id,
    metadata: { regNo: row.regNo, name: row.name, by: actor.name },
  });
  return ok(c, row, 201);
});

registryRoutes.patch('/:id', requireRoles(...FRONT_DESK), async (c) => {
  const id = c.req.param('id');
  const dto = await objectBody(c);
  validate(dto, false);
  const actor = actorOf(c.get('user'));
  const current = await getPatient(c.env, id);
  const name = present(dto.name) ? clean(dto.name, 120)! : current.name;
  const phone: string = present(dto.phone) ? dto.phone : current.phone;
  if (name !== current.name || phone !== current.phone) {
    const twin = (await patientsByPhone(c.env, phone)).find((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase());
    if (twin) throw twinError(twin);
  }

  // Field (API name) -> column and value; only what was sent changes
  const set: Record<string, string | number | null> = { name, phone };
  if (dto.dateOfBirth !== undefined) {
    set.dateOfBirth = dto.dateOfBirth || null;
    if (dto.dateOfBirth) set.age = ageFromDob(dto.dateOfBirth);
  }
  if (dto.age !== undefined && !dto.dateOfBirth) set.age = dto.age;
  if (dto.gender !== undefined) set.gender = dto.gender || null;
  if (dto.address !== undefined) set.address = clean(dto.address, 300);
  if (dto.idNumber !== undefined) set.idNumber = clean(dto.idNumber, 40);
  if (dto.scheme !== undefined) set.scheme = clean(dto.scheme, 80);
  if (dto.emergencyContactName !== undefined) set.emergencyContactName = clean(dto.emergencyContactName, 120);
  if (dto.emergencyContactPhone !== undefined) set.emergencyContactPhone = dto.emergencyContactPhone || null;
  if (dto.notes !== undefined) set.notes = clean(dto.notes, 500);

  const keys = Object.keys(set);
  const column = (k: string) => k.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`);
  await run(
    c.env,
    `UPDATE patients SET ${keys.map((k) => `${column(k)} = ?`).join(', ')}, updated_at = ? WHERE id = ? AND hospital_id = ?`,
    ...keys.map((k) => set[k]),
    nowIso(),
    id,
    hospital(c.env).id,
  );
  const row = await getPatient(c.env, id);
  await logAction(c.env, {
    userId: actor.id,
    action: 'PATIENT_UPDATED',
    entity: 'PATIENT',
    entityId: id,
    metadata: { regNo: row.regNo, fields: keys, by: actor.name },
  });
  return ok(c, row);
});
