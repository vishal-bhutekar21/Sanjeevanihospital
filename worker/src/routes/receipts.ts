/**
 * Receipts (reception): GST per item, discount, numbering per financial year,
 * later payments, cancel with reason, money report.
 * Port of backend/src/receipts/* (commit 507c42a). Mounted at /receipts.
 *
 * Table `receipts` (migrations/0002_patients_receipts.sql): money in paise,
 * items and payments as JSON TEXT, hospital_id = HOSPITAL_TENANT_ID.
 * The API speaks rupees, exactly like the old server.
 */
import { Hono, type Context } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first, nowIso, run, uuid } from '../lib/db';
import { badRequest, forbidden, notFound, ok } from '../lib/http';
import { FRONT_DESK, requireRoles } from '../lib/auth';
import { logAction } from '../lib/audit';
import { codePrefix, financialYear, gstin, nextNumber } from '../lib/counters';
import { calculateReceipt, toPaise, toRupees, type MathItemOut } from '../lib/receipt-math';
import { type Actor, actorOf, getPatient, objectBody } from './registry';

export const RECEIPT_KINDS = ['CONSULTATION', 'REGISTRATION', 'PROCEDURE', 'LAB', 'PHARMACY', 'ADVANCE', 'OTHER'] as const;
export const PAYMENT_MODES = ['CASH', 'UPI', 'CARD', 'ONLINE', 'CHEQUE', 'INSURANCE', 'SCHEME'] as const;
export const GST_RATES = [0, 5, 12, 18, 28] as const;

interface PaymentEntry {
  amountPaise: number;
  mode: string;
  ref: string | null;
  at: string;
  by: string | null;
}

interface ReceiptRow {
  id: string;
  receiptNo: string;
  status: 'ISSUED' | 'CANCELLED';
  kind: string;
  patientId: string | null;
  patientRegNo: string | null;
  patientName: string;
  patientPhone: string;
  patientAddress: string | null;
  appointmentCode: string | null;
  doctorName: string | null;
  items: MathItemOut[];
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
  paidPaise: number;
  paymentMode: string;
  paymentRef: string | null;
  payments: PaymentEntry[];
  note: string | null;
  issuedBy: string | null;
  issuedByName: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
}

interface ListFilter {
  from?: string; // YYYY-MM-DD (hospital time)
  to?: string;
  q?: string;
  status?: string;
  mode?: string;
  due?: boolean;
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const IST_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 3600 * 1000;
/** Start of a hospital-time (IST) day as a UTC Date */
const istDayStart = (key: string) => new Date(new Date(`${key}T00:00:00Z`).getTime() - IST_MS);
const istDayKey = (d: Date) => new Date(d.getTime() + IST_MS).toISOString().slice(0, 10);
const rangeStart = (key: string) => istDayStart(key).toISOString();
const rangeEnd = (key: string) => new Date(istDayStart(key).getTime() + DAY_MS).toISOString();

const parseJson = <T>(v: unknown, fallback: T): T => {
  if (typeof v !== 'string') return (v as T) ?? fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};

// ─── mapping ────────────────────────────────────────────────────────────────

const toRow = (r: Record<string, any>): ReceiptRow => ({
  id: r.id,
  receiptNo: r.receipt_no,
  status: r.status,
  kind: r.kind,
  patientId: r.patient_id ?? null,
  patientRegNo: r.patient_reg_no ?? null,
  patientName: r.patient_name,
  patientPhone: r.patient_phone,
  patientAddress: r.patient_address ?? null,
  appointmentCode: r.appointment_code ?? null,
  doctorName: r.doctor_name ?? null,
  items: parseJson<MathItemOut[]>(r.items, []),
  subtotalPaise: Number(r.subtotal_paise),
  discountPaise: Number(r.discount_paise),
  taxPaise: Number(r.tax_paise),
  totalPaise: Number(r.total_paise),
  paidPaise: Number(r.paid_paise),
  paymentMode: r.payment_mode,
  paymentRef: r.payment_ref ?? null,
  payments: parseJson<PaymentEntry[]>(r.payments, []),
  note: r.note ?? null,
  issuedBy: r.issued_by ?? null,
  issuedByName: r.issued_by_name ?? null,
  cancelledAt: r.cancelled_at ?? null,
  cancelReason: r.cancel_reason ?? null,
  cancelledBy: r.cancelled_by ?? null,
  createdAt: r.created_at,
});

/** What the screens and PDF use: rupees, plus the balance still to collect */
const toApi = (env: Env, r: ReceiptRow) => {
  const balance = r.status === 'CANCELLED' ? 0 : Math.max(0, r.totalPaise - r.paidPaise);
  return {
    id: r.id,
    receiptNo: r.receiptNo,
    status: r.status,
    kind: r.kind,
    patientId: r.patientId,
    patientRegNo: r.patientRegNo,
    patientName: r.patientName,
    patientPhone: r.patientPhone,
    patientAddress: r.patientAddress,
    appointmentCode: r.appointmentCode,
    doctorName: r.doctorName,
    items: r.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      rate: toRupees(i.ratePaise),
      gstPercent: i.gstPercent,
      amount: toRupees(i.amountPaise),
      discount: toRupees(i.discountPaise),
      tax: toRupees(i.taxPaise),
    })),
    subtotal: toRupees(r.subtotalPaise),
    discount: toRupees(r.discountPaise),
    tax: toRupees(r.taxPaise),
    total: toRupees(r.totalPaise),
    paid: toRupees(r.paidPaise),
    balance: toRupees(balance),
    paymentMode: r.paymentMode,
    paymentRef: r.paymentRef,
    payments: r.payments.map((p) => ({ amount: toRupees(p.amountPaise), mode: p.mode, ref: p.ref, at: p.at, by: p.by })),
    note: r.note,
    issuedByName: r.issuedByName,
    cancelledAt: r.cancelledAt,
    cancelReason: r.cancelReason,
    createdAt: r.createdAt,
    hospital: { gstin: gstin(env) },
  };
};

// ─── validation (same rules as CreateReceiptDto / CollectPaymentDto) ────────

const present = (v: unknown): boolean => v !== undefined && v !== null;
const decimals = (n: number) => {
  const s = String(n);
  if (s.includes('e')) return Number.isInteger(n) ? 0 : 99;
  return s.split('.')[1]?.length ?? 0;
};
const isMoney = (v: unknown, places = 2): v is number => typeof v === 'number' && Number.isFinite(v) && decimals(v) <= places;

function optText(dto: Record<string, any>, key: string, max: number, label: string) {
  if (present(dto[key]) && (typeof dto[key] !== 'string' || dto[key].length > max)) {
    throw badRequest(`${label} must be text of at most ${max} characters.`);
  }
}

function validateCreate(dto: Record<string, any>) {
  if (!RECEIPT_KINDS.includes(dto.kind)) throw badRequest(`kind must be one of: ${RECEIPT_KINDS.join(', ')}`);
  if (present(dto.patientId) && typeof dto.patientId !== 'string') throw badRequest('patientId must be text.');
  optText(dto, 'patientName', 120, 'Patient name');
  if (present(dto.patientPhone) && (typeof dto.patientPhone !== 'string' || !/^\d{10}$/.test(dto.patientPhone))) {
    throw badRequest('Mobile number must be 10 digits');
  }
  optText(dto, 'patientAddress', 300, 'Address');
  optText(dto, 'appointmentCode', 40, 'Appointment code');
  optText(dto, 'doctorName', 120, 'Doctor name');
  if (!Array.isArray(dto.items) || dto.items.length < 1 || dto.items.length > 50) {
    throw badRequest('A receipt needs 1 to 50 items.');
  }
  dto.items.forEach((it: any, i: number) => {
    const n = i + 1;
    if (!it || typeof it !== 'object') throw badRequest(`Item ${n} is not valid.`);
    if (typeof it.name !== 'string' || it.name.length < 1 || it.name.length > 120) throw badRequest(`Item ${n}: name must be 1 to 120 characters.`);
    if (!isMoney(it.qty, 0) || it.qty < 1 || it.qty > 1000) throw badRequest(`Item ${n}: quantity must be a whole number from 1 to 1000.`);
    if (!isMoney(it.rate) || it.rate < 0 || it.rate > 10000000) throw badRequest(`Item ${n}: rate must be an amount in rupees (up to 2 decimals).`);
    if (present(it.gstPercent) && !(GST_RATES as readonly number[]).includes(it.gstPercent)) {
      throw badRequest(`Item ${n}: GST must be one of ${GST_RATES.join(', ')} percent.`);
    }
  });
  if (present(dto.discount) && (!isMoney(dto.discount) || dto.discount < 0)) throw badRequest('Discount must be an amount in rupees (up to 2 decimals).');
  if (!isMoney(dto.paid) || dto.paid < 0) throw badRequest('paid must be an amount in rupees (up to 2 decimals).');
  if (!PAYMENT_MODES.includes(dto.paymentMode)) throw badRequest(`paymentMode must be one of: ${PAYMENT_MODES.join(', ')}`);
  optText(dto, 'paymentRef', 80, 'Payment reference');
  optText(dto, 'note', 500, 'Note');
}

function validateCollect(dto: Record<string, any>) {
  if (!isMoney(dto.amount) || dto.amount < 0.01) throw badRequest('amount must be at least 0.01 rupees (up to 2 decimals).');
  if (!PAYMENT_MODES.includes(dto.mode)) throw badRequest(`mode must be one of: ${PAYMENT_MODES.join(', ')}`);
  optText(dto, 'ref', 80, 'Payment reference');
}

// ─── data access ────────────────────────────────────────────────────────────

async function getRow(env: Env, id: string): Promise<ReceiptRow> {
  const r = await first(env, `SELECT * FROM receipts WHERE id = ? AND hospital_id = ?`, id, hospital(env).id);
  if (!r) throw notFound('Receipt not found.');
  return toRow(r);
}

/** Visit booked through the website / reception is marked paid once its receipt is fully paid */
async function markAppointmentPaid(env: Env, row: ReceiptRow) {
  if (!row.appointmentCode || row.paidPaise < row.totalPaise) return;
  await run(
    env,
    `UPDATE appointments SET payment_status = 'PAID', updated_at = ?
      WHERE upper(appointment_code) = upper(?) AND hospital_id = ? AND payment_status <> 'PAID'`,
    nowIso(),
    row.appointmentCode,
    hospital(env).id,
  ).catch(() => undefined);
}

function whereFor(env: Env, f: ListFilter): { sql: string; args: (string | number)[] } {
  const parts = ['hospital_id = ?'];
  const args: (string | number)[] = [hospital(env).id];
  if (f.from) {
    parts.push('created_at >= ?');
    args.push(rangeStart(f.from));
  }
  if (f.to) {
    parts.push('created_at < ?');
    args.push(rangeEnd(f.to));
  }
  if (f.status === 'ISSUED' || f.status === 'CANCELLED') {
    parts.push('status = ?');
    args.push(f.status);
  }
  if (f.mode) {
    parts.push('payment_mode = ?');
    args.push(f.mode);
  }
  const t = f.q?.trim();
  if (t) {
    parts.push(
      `(instr(lower(receipt_no), lower(?)) > 0 OR instr(lower(patient_name), lower(?)) > 0 OR instr(patient_phone, ?) > 0
        OR instr(lower(coalesce(patient_reg_no, '')), lower(?)) > 0 OR instr(lower(coalesce(appointment_code, '')), lower(?)) > 0)`,
    );
    args.push(t, t, t.replace(/\D/g, '') || '__none__', t, t);
  }
  if (f.due) parts.push(`status = 'ISSUED' AND total_paise > paid_paise`);
  return { sql: parts.join(' AND '), args };
}

// ─── routes ─────────────────────────────────────────────────────────────────

// Money and patient details: reception and administrators only
export const receiptRoutes = new Hono<AppEnv>();
receiptRoutes.use('*', requireRoles(...FRONT_DESK));

receiptRoutes.post('/', async (c) => {
  const dto = await objectBody(c);
  validateCreate(dto);
  const actor: Actor = actorOf(c.get('user'));

  let patientName = typeof dto.patientName === 'string' ? dto.patientName.trim() : '';
  let patientPhone: string = dto.patientPhone || '';
  let patientAddress: string | null = typeof dto.patientAddress === 'string' ? dto.patientAddress.trim() || null : null;
  let patientRegNo: string | null = null;
  let patientId: string | null = null;
  if (dto.patientId) {
    const p = await getPatient(c.env, dto.patientId);
    patientId = p.id;
    patientRegNo = p.regNo;
    patientName = p.name;
    patientPhone = p.phone;
    patientAddress = p.address;
  }
  if (patientName.length < 2 || !/^\d{10}$/.test(patientPhone)) {
    throw badRequest('Choose a registered patient, or enter the patient name and 10-digit mobile number.');
  }

  const calc = calculateReceipt(dto.items, dto.discount ?? 0);
  if (toPaise(dto.discount ?? 0) > calc.subtotalPaise) throw badRequest('The discount cannot be more than the bill amount.');
  if (calc.totalPaise <= 0 && dto.kind !== 'OTHER') throw badRequest('The receipt total must be more than zero.');
  const paidPaise = toPaise(dto.paid);
  if (paidPaise > calc.totalPaise) throw badRequest('The amount received cannot be more than the receipt total.');

  const fy = financialYear();
  const seq = await nextNumber(c.env, `receipt:${fy}`);
  const receiptNo = `${codePrefix(c.env)}-R-${fy}-${String(seq).padStart(6, '0')}`;
  const at = nowIso();
  const paymentRef = typeof dto.paymentRef === 'string' ? dto.paymentRef.trim() || null : null;
  const payments: PaymentEntry[] =
    paidPaise > 0 ? [{ amountPaise: paidPaise, mode: dto.paymentMode, ref: paymentRef, at, by: actor.name || null }] : [];
  const id = uuid();

  await run(
    c.env,
    `INSERT INTO receipts (id, hospital_id, receipt_no, status, kind, patient_id, patient_reg_no, patient_name, patient_phone,
       patient_address, appointment_code, doctor_name, items, subtotal_paise, discount_paise, tax_paise, total_paise, paid_paise,
       payment_mode, payment_ref, payments, note, issued_by, issued_by_name, created_at)
     VALUES (?, ?, ?, 'ISSUED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    hospital(c.env).id,
    receiptNo,
    dto.kind,
    patientId,
    patientRegNo,
    patientName,
    patientPhone,
    patientAddress,
    typeof dto.appointmentCode === 'string' ? dto.appointmentCode.trim() || null : null,
    typeof dto.doctorName === 'string' ? dto.doctorName.trim() || null : null,
    JSON.stringify(calc.items),
    calc.subtotalPaise,
    calc.discountPaise,
    calc.taxPaise,
    calc.totalPaise,
    paidPaise,
    dto.paymentMode,
    paymentRef,
    JSON.stringify(payments),
    typeof dto.note === 'string' ? dto.note.trim() || null : null,
    actor.id || null,
    actor.name || null,
    at,
  );
  const row = await getRow(c.env, id);
  await markAppointmentPaid(c.env, row);
  await logAction(c.env, {
    userId: actor.id,
    action: 'RECEIPT_ISSUED',
    entity: 'RECEIPT',
    entityId: row.id,
    metadata: { receiptNo, total: toRupees(row.totalPaise), paid: toRupees(row.paidPaise), by: actor.name },
  });
  return ok(c, toApi(c.env, row), 201);
});

receiptRoutes.get('/', async (c) => {
  const from = c.req.query('from');
  const to = c.req.query('to');
  if ((from && !DAY.test(from)) || (to && !DAY.test(to))) throw badRequest('Dates must be YYYY-MM-DD.');
  const n = Number(c.req.query('limit'));
  const limit = Math.min(Math.max(Number.isFinite(n) && n ? Math.floor(n) : 100, 1), 1000);
  const w = whereFor(c.env, {
    from,
    to,
    q: c.req.query('q'),
    status: c.req.query('status'),
    mode: c.req.query('mode'),
    due: c.req.query('due') === 'true',
  });
  const rows = await all(c.env, `SELECT * FROM receipts WHERE ${w.sql} ORDER BY created_at DESC LIMIT ?`, ...w.args, limit);
  return ok(c, rows.map((r) => toApi(c.env, toRow(r))));
});

// Before '/:id' so "summary" is not read as an id.
// Totals for a date range (hospital time). Cancelled receipts are counted separately and never in the money.
receiptRoutes.get('/summary', async (c) => {
  const from = c.req.query('from') || '';
  const to = c.req.query('to') || '';
  if (!DAY.test(from) || !DAY.test(to)) throw badRequest('from and to must be YYYY-MM-DD.');
  const hid = hospital(c.env).id;
  const start = rangeStart(from);
  const end = rangeEnd(to);

  const [inRange, collectedRows, open] = await Promise.all([
    first<Record<string, number | null>>(
      c.env,
      `SELECT
         SUM(CASE WHEN status = 'ISSUED' THEN 1 ELSE 0 END) AS issued,
         SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled,
         SUM(CASE WHEN status = 'ISSUED' THEN total_paise ELSE 0 END) AS billed,
         SUM(CASE WHEN status = 'ISSUED' THEN tax_paise ELSE 0 END) AS tax,
         SUM(CASE WHEN status = 'ISSUED' THEN discount_paise ELSE 0 END) AS discount
       FROM receipts WHERE hospital_id = ? AND created_at >= ? AND created_at < ?`,
      hid,
      start,
      end,
    ),
    // Collections are counted on the day the money came in, so a later payment shows on its own day
    all<{ mode: string; paise: number }>(
      c.env,
      `SELECT json_extract(p.value, '$.mode') AS mode, SUM(json_extract(p.value, '$.amountPaise')) AS paise
         FROM receipts r, json_each(r.payments) p
        WHERE r.hospital_id = ? AND r.status = 'ISSUED'
          AND json_extract(p.value, '$.at') >= ? AND json_extract(p.value, '$.at') < ?
        GROUP BY json_extract(p.value, '$.mode')`,
      hid,
      start,
      end,
    ),
    // Balance still to collect across all issued receipts, not only those in range
    first<{ outstanding: number | null }>(
      c.env,
      `SELECT SUM(MAX(0, total_paise - paid_paise)) AS outstanding FROM receipts WHERE hospital_id = ? AND status = 'ISSUED'`,
      hid,
    ),
  ]);

  const byMode: Record<string, number> = {};
  let collected = 0;
  for (const r of collectedRows) {
    const paise = Number(r.paise) || 0;
    byMode[r.mode] = toRupees(paise);
    collected += paise;
  }
  return ok(c, {
    from,
    to,
    receiptsIssued: Number(inRange?.issued) || 0,
    receiptsCancelled: Number(inRange?.cancelled) || 0,
    billed: toRupees(Number(inRange?.billed) || 0),
    tax: toRupees(Number(inRange?.tax) || 0),
    discount: toRupees(Number(inRange?.discount) || 0),
    collected: toRupees(collected),
    byMode,
    outstanding: toRupees(Number(open?.outstanding) || 0),
  });
});

receiptRoutes.get('/:id', async (c) => ok(c, toApi(c.env, await getRow(c.env, c.req.param('id')))));

/** Receipts are never edited or deleted; a mistake is cancelled with a reason and re-issued. */
const cancel = async (c: Context<AppEnv, '/:id/cancel'>) => {
  const id = c.req.param('id');
  const dto = await objectBody(c);
  const text = (typeof dto.reason === 'string' ? dto.reason : '').trim();
  if (text.length < 3) throw badRequest('Please give a reason for cancelling.');
  const actor = actorOf(c.get('user'));
  const current = await getRow(c.env, id);
  if (current.status === 'CANCELLED') return ok(c, toApi(c.env, current));
  // Reception can undo a mistake from today; older receipts need an administrator
  const isAdmin = actor.role === 'SUPER_ADMIN' || actor.role === 'HOSPITAL_ADMIN';
  if (!isAdmin && istDayKey(new Date(current.createdAt)) !== istDayKey(new Date())) {
    throw forbidden('Only an administrator can cancel a receipt from an earlier day.');
  }
  await run(
    c.env,
    `UPDATE receipts SET status = 'CANCELLED', cancelled_at = ?, cancel_reason = ?, cancelled_by = ?
      WHERE id = ? AND hospital_id = ? AND status = 'ISSUED'`,
    nowIso(),
    text.slice(0, 300),
    actor.name || actor.id || null,
    id,
    hospital(c.env).id,
  );
  const row = await getRow(c.env, id);
  await logAction(c.env, {
    userId: actor.id,
    action: 'RECEIPT_CANCELLED',
    entity: 'RECEIPT',
    entityId: id,
    metadata: { receiptNo: row.receiptNo, reason: row.cancelReason, by: actor.name },
  });
  return ok(c, toApi(c.env, row));
};
receiptRoutes.patch('/:id/cancel', cancel);
// Same action as POST, for callers that use POST for actions
receiptRoutes.post('/:id/cancel', cancel);

/** Take a later payment against the balance of a receipt */
receiptRoutes.post('/:id/collect', async (c) => {
  const id = c.req.param('id');
  const dto = await objectBody(c);
  validateCollect(dto);
  const actor = actorOf(c.get('user'));
  const amountPaise = toPaise(dto.amount);
  const entry: PaymentEntry = {
    amountPaise,
    mode: dto.mode,
    ref: typeof dto.ref === 'string' ? dto.ref.trim() || null : null,
    at: nowIso(),
    by: actor.name || null,
  };
  // The balance check and the update are one statement, so two simultaneous payments can't together overpay the receipt.
  const updated = await first(
    c.env,
    `UPDATE receipts SET paid_paise = paid_paise + ?, payments = json_insert(payments, '$[#]', json(?))
      WHERE id = ? AND hospital_id = ? AND status = 'ISSUED' AND total_paise - paid_paise >= ?
      RETURNING *`,
    amountPaise,
    JSON.stringify(entry),
    id,
    hospital(c.env).id,
    amountPaise,
  );
  if (!updated) {
    const cur = await getRow(c.env, id);
    if (cur.status === 'CANCELLED') throw badRequest('This receipt is cancelled.');
    throw badRequest(`Only Rs. ${toRupees(cur.totalPaise - cur.paidPaise)} is still due on this receipt.`);
  }
  const row = toRow(updated);
  await markAppointmentPaid(c.env, row);
  await logAction(c.env, {
    userId: actor.id,
    action: 'RECEIPT_PAYMENT_COLLECTED',
    entity: 'RECEIPT',
    entityId: id,
    metadata: { receiptNo: row.receiptNo, amount: dto.amount, mode: dto.mode, by: actor.name },
  });
  return ok(c, toApi(c.env, row));
});
