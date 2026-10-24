/**
 * Patient records (bills, medicines, lab results, follow-up, profile) and the patient portal.
 * Port of backend/src/patient-records/*.
 *
 * Stored as one JSON row per patient in hospital_settings,
 * key "patient_record:<10-digit mobile>", hospital_id = HOSPITAL_TENANT_ID.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first, run, uuid, nowIso } from '../lib/db';
import { badRequest, body, forbidden, notFound, ok, unauthorized } from '../lib/http';
import { FRONT_DESK, STAFF, requirePatient, requireRoles, signToken } from '../lib/auth';
import { normalisePhone } from '../lib/phone';

export interface BillItem {
  name: string;
  qty: number;
  amount: number; // line total, rupees
}

export interface PatientBill {
  id: string;
  billNo: string;
  date: string; // YYYY-MM-DD
  title: string;
  items: BillItem[];
  total: number;
  paid: number;
  note: string;
  createdAt: string;
}

export interface PatientMedicine {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  instructions: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  quantity: number;
  doctorName: string;
  note: string;
  createdAt: string;
}

export interface LabResult {
  id: string;
  date: string;
  test: string;
  value: string;
  unit: string;
  range: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | '';
  note: string;
  createdAt: string;
}

export interface FollowUp {
  date: string;
  doctorId: string;
  doctorName: string;
  note: string;
}

export interface PatientProfile {
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  emergencyName: string;
  emergencyPhone: string;
}

export interface PatientRecord {
  phone: string;
  name: string;
  bills: PatientBill[];
  medicines: PatientMedicine[];
  labResults?: LabResult[];
  followUp?: FollowUp | null;
  profile?: PatientProfile;
  updatedAt: string;
}

const KEY_PREFIX = 'patient_record:';
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v));

// ─── Storage ────────────────────────────────────────────────────────────────

function parse(value: string | null | undefined): PatientRecord | null {
  if (!value) return null;
  try {
    const rec = JSON.parse(value) as PatientRecord;
    if (!rec?.phone) return null;
    rec.bills = Array.isArray(rec.bills) ? rec.bills : [];
    rec.medicines = Array.isArray(rec.medicines) ? rec.medicines : [];
    return rec;
  } catch {
    return null;
  }
}

async function load(env: Env, phone: string): Promise<PatientRecord | null> {
  const row = await first<{ value: string }>(
    env,
    `SELECT value FROM hospital_settings WHERE hospital_id = ? AND key = ?`,
    hospital(env).id,
    KEY_PREFIX + phone,
  );
  return parse(row?.value);
}

/** Writes the record; D1 errors surface as a 500 so staff never see a false "saved". */
async function persist(env: Env, rec: PatientRecord): Promise<boolean> {
  rec.updatedAt = nowIso();
  await run(
    env,
    `INSERT INTO hospital_settings (id, hospital_id, key, value) VALUES (?, ?, ?, ?)
     ON CONFLICT (hospital_id, key) DO UPDATE SET value = excluded.value, updated_at = ?`,
    uuid(),
    hospital(env).id,
    KEY_PREFIX + rec.phone,
    JSON.stringify(rec),
    rec.updatedAt,
  );
  return true;
}

async function getOrCreate(env: Env, phone: string, name?: unknown): Promise<PatientRecord> {
  const rec = (await load(env, phone)) || { phone, name: '', bills: [], medicines: [], updatedAt: nowIso() };
  if (typeof name === 'string' && name.trim()) rec.name = str(name, 100);
  return rec;
}

async function getRecord(env: Env, phoneRaw: unknown): Promise<PatientRecord> {
  const phone = normalisePhone(phoneRaw);
  return (await load(env, phone)) || { phone, name: '', bills: [], medicines: [], updatedAt: '' };
}

async function listRecords(env: Env) {
  const rows = await all<{ value: string }>(
    env,
    `SELECT value FROM hospital_settings WHERE hospital_id = ? AND key LIKE 'patient_record:%'`,
    hospital(env).id,
  );
  return rows
    .map((r) => parse(r.value))
    .filter((r): r is PatientRecord => !!r)
    .map((r) => ({
      followUpDate: r.followUp?.date || '',
      phone: r.phone,
      name: r.name,
      bills: r.bills.length,
      amountDue: r.bills.reduce((s, b) => s + Math.max(0, b.total - b.paid), 0),
      medicines: r.medicines.length,
      updatedAt: r.updatedAt || '',
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function removeItem(env: Env, phoneRaw: string, kind: 'bills' | 'medicines' | 'labResults', id: string) {
  const rec = await getRecord(env, phoneRaw);
  const list = ((rec as any)[kind] || []) as { id: string }[];
  const next = list.filter((x) => x.id !== id);
  if (next.length === list.length) throw notFound('Not found.');
  (rec as any)[kind] = next;
  return { record: rec, savedInDatabase: await persist(env, rec) };
}

async function updateProfile(env: Env, phoneRaw: string, b: any): Promise<PatientRecord> {
  const phone = normalisePhone(phoneRaw);
  const rec = await getOrCreate(env, phone, b?.name);
  const emergencyPhone = str(b?.emergencyPhone, 15).replace(/\D/g, '').slice(-10);
  if (emergencyPhone && !/^[6-9]\d{9}$/.test(emergencyPhone)) {
    throw badRequest('Emergency contact number must be a 10-digit mobile number.');
  }
  const age = str(b?.age, 3).replace(/\D/g, '');
  rec.profile = {
    age,
    gender: ['Male', 'Female', 'Other'].includes(b?.gender) ? b.gender : '',
    bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(b?.bloodGroup) ? b.bloodGroup : '',
    allergies: str(b?.allergies, 300),
    conditions: str(b?.conditions, 300),
    emergencyName: str(b?.emergencyName, 100),
    emergencyPhone,
  };
  await persist(env, rec);
  return rec;
}

// ─── Staff: /patient-records ────────────────────────────────────────────────

export const patientRecordRoutes = new Hono<AppEnv>();
const r = patientRecordRoutes;

r.get('/', requireRoles(...STAFF), async (c) => ok(c, await listRecords(c.env)));

r.get('/:phone', requireRoles(...STAFF), async (c) => ok(c, await getRecord(c.env, c.req.param('phone'))));

r.post('/:phone/bills', requireRoles(...FRONT_DESK), async (c) => {
  const phone = normalisePhone(c.req.param('phone'));
  const b = await body(c);
  const items: BillItem[] = (Array.isArray(b?.items) ? b.items : [])
    .map((i: any) => ({ name: str(i?.name, 120), qty: Math.max(1, Math.round(num(i?.qty) || 1)), amount: num(i?.amount) }))
    .filter((i: BillItem) => i.name);
  if (items.length === 0) throw badRequest('Add at least one line to the bill.');
  if (items.length > 50) throw badRequest('A bill can have up to 50 lines.');
  if (items.some((i) => !Number.isFinite(i.amount) || i.amount < 0 || i.amount > 10_000_000)) {
    throw badRequest('Each line needs an amount in rupees.');
  }
  const date = str(b?.date, 10);
  if (!ISO.test(date)) throw badRequest('Bill date is missing.');
  const total = Math.round(items.reduce((s, i) => s + i.amount, 0) * 100) / 100;
  const paid = Math.min(total, Math.max(0, num(b?.paid) || 0));

  const rec = await getOrCreate(c.env, phone, b?.patientName);
  rec.bills.unshift({
    id: uuid(),
    billNo: `B-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    date,
    title: str(b?.title, 80) || 'Hospital bill',
    items,
    total,
    paid,
    note: str(b?.note, 500),
    createdAt: nowIso(),
  });
  return ok(c, { record: rec, savedInDatabase: await persist(c.env, rec) }, 201);
});

r.patch('/:phone/bills/:id', requireRoles(...FRONT_DESK), async (c) => {
  const rec = await getRecord(c.env, c.req.param('phone'));
  const bill = rec.bills.find((x) => x.id === c.req.param('id'));
  if (!bill) throw notFound('Bill not found.');
  const paid = num((await body(c))?.paid);
  if (!Number.isFinite(paid) || paid < 0) throw badRequest('Enter the amount paid.');
  bill.paid = Math.min(bill.total, paid);
  return ok(c, { record: rec, savedInDatabase: await persist(c.env, rec) });
});

r.delete('/:phone/bills/:id', requireRoles(...FRONT_DESK), async (c) =>
  ok(c, await removeItem(c.env, c.req.param('phone'), 'bills', c.req.param('id'))),
);

r.post('/:phone/medicines', requireRoles(...STAFF), async (c) => {
  const phone = normalisePhone(c.req.param('phone'));
  const b = await body(c);
  const name = str(b?.name, 120);
  if (!name) throw badRequest('Medicine name is missing.');
  const startDate = str(b?.startDate, 10);
  const endDate = str(b?.endDate, 10);
  const expiryDate = str(b?.expiryDate, 10);
  if (!ISO.test(startDate)) throw badRequest('Start date is missing.');
  if (endDate && (!ISO.test(endDate) || endDate < startDate)) throw badRequest('Course end date must be after the start date.');
  if (expiryDate && !ISO.test(expiryDate)) throw badRequest('Expiry date is not valid.');

  const rec = await getOrCreate(c.env, phone, b?.patientName);
  rec.medicines.unshift({
    id: uuid(),
    name,
    strength: str(b?.strength, 40),
    dosage: str(b?.dosage, 40),
    instructions: str(b?.instructions, 120),
    startDate,
    endDate,
    expiryDate,
    quantity: Math.max(0, Math.round(num(b?.quantity) || 0)),
    doctorName: str(b?.doctorName, 100),
    note: str(b?.note, 500),
    createdAt: nowIso(),
  });
  return ok(c, { record: rec, savedInDatabase: await persist(c.env, rec) }, 201);
});

r.delete('/:phone/medicines/:id', requireRoles(...STAFF), async (c) =>
  ok(c, await removeItem(c.env, c.req.param('phone'), 'medicines', c.req.param('id'))),
);

r.post('/:phone/lab-results', requireRoles(...STAFF), async (c) => {
  const phone = normalisePhone(c.req.param('phone'));
  const b = await body(c);
  const test = str(b?.test, 120);
  const value = str(b?.value, 40);
  const date = str(b?.date, 10);
  if (!test || !value) throw badRequest('Test name and result are needed.');
  if (!ISO.test(date)) throw badRequest('Test date is missing.');
  const flag = ['NORMAL', 'HIGH', 'LOW'].includes(b?.flag) ? b.flag : '';
  const rec = await getOrCreate(c.env, phone, b?.patientName);
  rec.labResults = rec.labResults || [];
  rec.labResults.unshift({
    id: uuid(),
    date,
    test,
    value,
    unit: str(b?.unit, 30),
    range: str(b?.range, 60),
    flag,
    note: str(b?.note, 300),
    createdAt: nowIso(),
  });
  return ok(c, { record: rec, savedInDatabase: await persist(c.env, rec) }, 201);
});

r.delete('/:phone/lab-results/:id', requireRoles(...STAFF), async (c) =>
  ok(c, await removeItem(c.env, c.req.param('phone'), 'labResults', c.req.param('id'))),
);

/** Set (or clear with an empty date) the next visit the doctor asked for. */
r.put('/:phone/follow-up', requireRoles(...STAFF), async (c) => {
  const phone = normalisePhone(c.req.param('phone'));
  const b = await body(c);
  const date = str(b?.date, 10);
  if (date && !ISO.test(date)) throw badRequest('Follow-up date is not valid.');
  const rec = await getOrCreate(c.env, phone, b?.patientName);
  rec.followUp = date
    ? { date, doctorId: str(b?.doctorId, 60), doctorName: str(b?.doctorName, 100), note: str(b?.note, 300) }
    : null;
  return ok(c, { record: rec, savedInDatabase: await persist(c.env, rec) });
});

// ─── Patients: /patient-portal ──────────────────────────────────────────────

export const patientPortalRoutes = new Hono<AppEnv>();
const p = patientPortalRoutes;

const PORTAL_DAYS = 30;

/** Swap the short-lived token from /auth/verify-otp for a 30-day portal sign-in. */
p.post('/session', requirePatient('BOOKING_SESSION'), async (c) => {
  const user = c.get('user');
  // The no-SMS booking fallback issues unverified tokens; never open records with those
  if (user.phoneVerified === false) {
    throw forbidden('Patient login needs an SMS code, which is not switched on yet. Please ask reception for your bills.');
  }
  const phone = normalisePhone(user.phone);
  const token = await signToken(
    c.env,
    { sub: `patient:${phone}`, phone, type: 'PATIENT_PORTAL', role: 'PATIENT' },
    PORTAL_DAYS * 24 * 3600,
  );
  return ok(c, { token, phone }, 201);
});

const portalPhone = (phone: string | undefined) => {
  if (!phone) throw unauthorized('Please sign in again.');
  return normalisePhone(phone);
};

p.put('/profile', requirePatient('PATIENT_PORTAL'), async (c) =>
  ok(c, await updateProfile(c.env, portalPhone(c.get('user').phone), await body(c))),
);

p.get('/me', requirePatient('PATIENT_PORTAL'), async (c) => {
  const phone = portalPhone(c.get('user').phone);
  const record = await getRecord(c.env, phone);
  const rows = await all(
    c.env,
    `SELECT appointment_code, doctor_name, department_name, appointment_date, start_time, status, payment_status, fee, patient_name
     FROM appointments WHERE patient_phone = ?
     ORDER BY appointment_date DESC, created_at DESC`,
    phone,
  );
  const appointments = rows.map((a) => ({
    appointmentCode: a.appointment_code,
    doctorName: a.doctor_name,
    department: a.department_name,
    appointmentDate: a.appointment_date,
    startTime: a.start_time,
    status: a.status,
    paymentStatus: a.payment_status,
    fee: a.fee,
  }));
  // New patients who only booked online: greet them by the name they booked with
  const name = record.name || (rows[0]?.patient_name as string | undefined) || '';
  return ok(c, { ...record, name, appointments });
});
