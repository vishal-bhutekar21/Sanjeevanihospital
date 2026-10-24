/**
 * MJPJAY / Ayushman Bharat / insurance claims. Port of backend/src/schemes/*.
 * Claims live in D1 `scheme_claims` (the old in-memory sample claims are gone).
 * Only the last 4 digits of Aadhaar are ever stored.
 */
import { Hono, type Context } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first, run, uuid, nowIso } from '../lib/db';
import { badRequest, body, clientIp, notFound, ok, tooMany } from '../lib/http';
import { ADMINS, requireRoles } from '../lib/auth';
import { normalisePhone } from '../lib/phone';
import { hit } from '../lib/ratelimit';
import { logAction } from '../lib/audit';

export type SchemeType = 'MJPJAY' | 'AYUSHMAN_BHARAT' | 'EMPLOYEE_STATE_INSURANCE' | 'CASHLESS_TPA';
export type ClaimStatus = 'PENDING' | 'PRE_AUTHORIZED' | 'IN_TREATMENT' | 'SUBMITTED' | 'SETTLED' | 'REJECTED';

const SCHEME_TYPES: SchemeType[] = ['MJPJAY', 'AYUSHMAN_BHARAT', 'EMPLOYEE_STATE_INSURANCE', 'CASHLESS_TPA'];
const CLAIM_STATUSES: ClaimStatus[] = ['PENDING', 'PRE_AUTHORIZED', 'IN_TREATMENT', 'SUBMITTED', 'SETTLED', 'REJECTED'];
const DAY_MS = 24 * 3600_000;

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const opt = (v: unknown, max = 200) => str(v, max) || undefined;
const undef = <T>(v: T | null | undefined) => (v === null ? undefined : v);

/** D1 row → SchemeClaimRecord. */
function toClaim(r: Record<string, any>) {
  return {
    id: r.id,
    hospitalId: r.hospital_id,
    schemeType: r.scheme_type as SchemeType,
    patientName: r.patient_name,
    patientPhone: r.patient_phone,
    patientAge: r.patient_age,
    aadhaarLast4: r.aadhaar_last4,
    rationCardNumber: undef(r.ration_card_number),
    ayushmanCardNumber: undef(r.ayushman_card_number),
    insurerName: undef(r.insurer_name),
    tpaName: undef(r.tpa_name),
    diagnosisDescription: r.diagnosis_description,
    estimatedAmount: r.estimated_amount ?? 0,
    status: r.status as ClaimStatus,
    arogyaMitraId: undef(r.arogya_mitra_id),
    preAuthorizationId: undef(r.pre_authorization_id),
    remarks: undef(r.remarks),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const getClaim = (env: Env, id: string) =>
  first(env, `SELECT * FROM scheme_claims WHERE id = ? AND hospital_id = ?`, id, hospital(env).id);

/** Shared by POST /claims/register and the website's POST /mjpjay/register-claim. */
async function registerClaim(c: Context<AppEnv>, defaultScheme?: SchemeType) {
  if (!(await hit(c.env, `claim:${clientIp(c)}`, 5, DAY_MS))) {
    throw tooMany('Too many requests from this connection today. Please call the hospital instead.');
  }
  const b = await body(c);
  const schemeType = (b?.schemeType ?? defaultScheme) as SchemeType;
  if (!SCHEME_TYPES.includes(schemeType)) throw badRequest('Choose a scheme: MJPJAY, AYUSHMAN_BHARAT, EMPLOYEE_STATE_INSURANCE or CASHLESS_TPA.');
  const patientName = str(b?.patientName, 100);
  if (!patientName) throw badRequest('Patient name is missing.');
  const patientPhone = normalisePhone(b?.patientPhone);
  const patientAge = Number(b?.patientAge);
  if (!Number.isInteger(patientAge) || patientAge < 0 || patientAge > 120) throw badRequest('Enter the patient’s age in years.');
  // Never keep a full Aadhaar number: only the last 4 digits
  const aadhaarDigits = String(b?.aadhaarLast4 ?? '').replace(/\D/g, '');
  if (aadhaarDigits.length < 4) throw badRequest('Enter the last 4 digits of the Aadhaar number.');
  const aadhaarLast4 = aadhaarDigits.slice(-4);
  const diagnosisDescription = str(b?.diagnosisDescription, 1000);
  if (!diagnosisDescription) throw badRequest('Please describe the illness or planned treatment.');
  const estimatedAmount =
    b?.estimatedAmount === undefined || b?.estimatedAmount === null || b?.estimatedAmount === '' ? 0 : Number(b.estimatedAmount);
  if (!Number.isFinite(estimatedAmount) || estimatedAmount < 0 || estimatedAmount > 100_000_000) {
    throw badRequest('Estimated amount must be in rupees.');
  }

  const id = uuid();
  const now = nowIso();
  await run(
    c.env,
    `INSERT INTO scheme_claims (id, hospital_id, scheme_type, patient_name, patient_phone, patient_age, aadhaar_last4,
       ration_card_number, ayushman_card_number, insurer_name, tpa_name, diagnosis_description, estimated_amount, status,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`,
    id,
    hospital(c.env).id,
    schemeType,
    patientName,
    patientPhone,
    patientAge,
    aadhaarLast4,
    opt(b?.rationCardNumber, 40),
    opt(b?.ayushmanCardNumber, 40),
    opt(b?.insurerName, 120),
    opt(b?.tpaName, 120),
    diagnosisDescription,
    Math.round(estimatedAmount),
    now,
    now,
  );
  await logAction(c.env, {
    action: 'SCHEME_CLAIM_REGISTERED',
    entity: 'SCHEME_CLAIM',
    entityId: id,
    metadata: { schemeType, patientName, amount: Math.round(estimatedAmount) },
  });
  return ok(c, toClaim((await getClaim(c.env, id))!), 201);
}

export const schemeRoutes = new Hono<AppEnv>();
const s = schemeRoutes;

// ─── Public information ─────────────────────────────────────────────────────

s.get('/mjpjay/info', (c) => {
  const h = hospital(c.env);
  return ok(c, {
    schemeInfo: {
      name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
      governingAuthority: 'Government of Maharashtra',
      coverageLimit: '₹1,50,000 per family per year (₹2,50,000 for critical illnesses)',
      eligibility: 'Yellow / Orange Ration Card holders and ANTYODAYA families in Maharashtra',
      disclaimer:
        'Eligibility, coverage, and treatment availability are governed by applicable scheme rules and subject to Arogya Mitra pre-authorization. This information is for guidance only.',
    },
    eligibleCategories: [
      { category: 'Cardiac & Cardiovascular Surgery', procedures: ['PTCA with Stenting', 'Open Heart Bypass (CABG)', 'Valve Replacement', 'Pacemaker Implantation'] },
      { category: 'Orthopedics & Trauma', procedures: ['Total Knee Replacement', 'Total Hip Replacement', 'Spinal Fusion', 'Complex Fracture Fixation'] },
      { category: 'General & Laparoscopic Surgery', procedures: ['Laparoscopic Cholecystectomy', 'Appendectomy', 'Hernia Repair', 'Colostomy'] },
      { category: 'Obstetrics & Gynecology', procedures: ['Caesarean Section', 'Hysterectomy', 'High-Risk Pregnancy Management', 'Ovarian Cystectomy'] },
      { category: 'Neonatal & Pediatric Care', procedures: ['NICU Neonatal Intensive Care', 'Pediatric Emergency Surgery', 'Congenital Defect Correction'] },
      { category: 'Critical Care & Intensive Care', procedures: ['ICU Ventilator Management (up to 14 days)', 'Sepsis & Multi-Organ Failure', 'Renal Dialysis'] },
    ],
    documentChecklist: [
      { item: 'Yellow or Orange Ration Card (mandatory)', required: true },
      { item: 'Aadhaar Card of Patient & Family Head', required: true },
      { item: "Referring Doctor's Prescription & Clinical Summary", required: true },
      { item: 'Hospital Pre-Authorization from Arogya Mitra', required: true },
      { item: 'MJPJAY Smart Card (if issued)', required: false },
      { item: 'Income Certificate below ₹1 Lakh per annum', required: false },
    ],
    process: [
      { step: 1, title: 'Visit Arogya Mitra Desk', description: `Report to the ${h.shortName} MJPJAY Arogya Mitra desk on the ground floor near main reception with all documents.` },
      { step: 2, title: 'Eligibility Verification', description: 'Arogya Mitra verifies ration card, Aadhaar, and scheme eligibility using the NIC government portal.' },
      { step: 3, title: 'Online Pre-Authorization', description: 'Treating doctor submits pre-authorization request with diagnosis and procedure codes via the MJPJAY government portal.' },
      { step: 4, title: 'Pre-Auth Approval', description: 'Government insurance company approves pre-authorization (typically within 2–4 hours for emergencies, 1 working day for planned procedures).' },
      { step: 5, title: 'Cashless Treatment', description: `Patient receives complete cashless treatment at ${h.shortName} at no cost up to the approved limit.` },
      { step: 6, title: 'Claim Settlement', description: 'Hospital submits claim to the insurer post-discharge. Settlement directly to hospital account within 30 days.' },
    ],
  });
});

s.get('/insurance/info', (c) => {
  const h = hospital(c.env);
  // Optional landline (wrangler var HOSPITAL_LANDLINE); not part of Env yet
  const landline = (c.env as unknown as Record<string, string | undefined>).HOSPITAL_LANDLINE?.trim();
  return ok(c, {
    panelInsurers: [
      'United India Insurance Company',
      'New India Assurance Company',
      'Oriental Insurance Company',
      'Star Health & Allied Insurance',
      'HDFC ERGO Health Insurance',
      'Niva Bupa Health Insurance',
      'Care Health Insurance',
      'ICICI Lombard General Insurance',
      'Bajaj Allianz General Insurance',
      'National Insurance Company',
    ],
    tpaPartners: [
      'Medi Assist India TPA Pvt. Ltd.',
      'MD India Healthcare Services TPA',
      'Good Health Insurance TPA Ltd.',
      'Paramount TPA Pvt. Ltd.',
      'Vidal Health TPA Private Limited',
      'Health India TPA Services Pvt. Ltd.',
      'Raksha TPA Pvt. Ltd.',
    ],
    cashlessProcess: [
      { step: 1, title: 'Inform TPA Desk at Admission', description: 'On arrival, visit the hospital Insurance / TPA Desk with your health insurance card and photo ID.' },
      { step: 2, title: 'Pre-Authorization Request', description: 'The hospital submits a pre-authorization request to your TPA/insurer with clinical summary, diagnosis, and estimated cost.' },
      { step: 3, title: 'TPA Approval (2–8 Hours)', description: 'The TPA/insurer reviews and approves the cashless request. Emergency approvals are typically fast-tracked within 2 hours.' },
      { step: 4, title: 'Cashless Treatment Begins', description: 'Once approved, you receive complete treatment without upfront payment up to the approved authorization limit.' },
      { step: 5, title: 'Discharge Formalities', description: 'Hospital raises the final claim with treatment summary and bills to the TPA. You only pay for non-covered items (if any).' },
      { step: 6, title: 'Direct Claim Settlement', description: `The insurer settles the approved claim amount directly to ${h.shortName} within the statutory claim period.` },
    ],
    documentsRequired: [
      'Health Insurance Policy Card / Health Insurance Policy Document',
      'Aadhaar Card or Passport (Photo ID)',
      "Doctor's Referral Letter / OPD Prescription",
      'Investigation Reports (Blood tests, X-Ray, Scan) if available',
      'Previous Hospitalization Records related to current illness (if any)',
      'TPA / Insurance Company Pre-Authorization Letter',
    ],
    tpaDeskTimings: 'Monday to Saturday: 09:00 AM to 06:00 PM. Emergency submissions: 24x7 on-call.',
    helpline: landline ? `${h.helpline} | ${landline}` : h.helpline,
    disclaimer: `Coverage eligibility, sum insured limits, co-payment clauses, and exclusions are governed solely by your health insurance policy terms. ${h.shortName} facilitates the cashless process but does not guarantee insurer approval.`,
  });
});

// ─── Public claim registration ──────────────────────────────────────────────

s.post('/claims/register', (c) => registerClaim(c));
// The MJPJAY page posts here without a schemeType
s.post('/mjpjay/register-claim', (c) => registerClaim(c, 'MJPJAY'));

// ─── Admin ──────────────────────────────────────────────────────────────────

s.get('/claims', requireRoles(...ADMINS), async (c) => {
  const schemeType = c.req.query('schemeType');
  const hid = hospital(c.env).id;
  const rows = schemeType
    ? await all(c.env, `SELECT * FROM scheme_claims WHERE hospital_id = ? AND scheme_type = ? ORDER BY created_at DESC`, hid, schemeType)
    : await all(c.env, `SELECT * FROM scheme_claims WHERE hospital_id = ? ORDER BY created_at DESC`, hid);
  return ok(c, rows.map(toClaim));
});

s.get('/stats', requireRoles(...ADMINS), async (c) => {
  const r = await first(
    c.env,
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'PENDING') AS pending,
       SUM(status = 'PRE_AUTHORIZED') AS pre_authorized,
       SUM(status = 'IN_TREATMENT') AS in_treatment,
       SUM(status = 'SETTLED') AS settled,
       SUM(status = 'REJECTED') AS rejected,
       SUM(scheme_type = 'MJPJAY') AS mjpjay,
       SUM(scheme_type = 'AYUSHMAN_BHARAT') AS ayushman,
       SUM(scheme_type = 'CASHLESS_TPA') AS tpa,
       SUM(estimated_amount) AS amount
     FROM scheme_claims WHERE hospital_id = ?`,
    hospital(c.env).id,
  );
  return ok(c, {
    total: r?.total ?? 0,
    pending: r?.pending ?? 0,
    preAuthorized: r?.pre_authorized ?? 0,
    inTreatment: r?.in_treatment ?? 0,
    settled: r?.settled ?? 0,
    rejected: r?.rejected ?? 0,
    mjpjayClaims: r?.mjpjay ?? 0,
    ayushmanClaims: r?.ayushman ?? 0,
    tpaClaims: r?.tpa ?? 0,
    totalEstimatedAmount: r?.amount ?? 0,
  });
});

s.patch('/claims/:id/status', requireRoles(...ADMINS), async (c) => {
  const id = c.req.param('id');
  const b = await body(c);
  if (!CLAIM_STATUSES.includes(b?.status)) throw badRequest(`Status must be one of: ${CLAIM_STATUSES.join(', ')}.`);
  const remarks = opt(b?.remarks, 1000);
  const preAuthorizationId = opt(b?.preAuthorizationId, 80);
  // Empty remarks / pre-auth id keep the saved values (same as before)
  const changed = await run(
    c.env,
    `UPDATE scheme_claims SET status = ?, remarks = COALESCE(?, remarks),
       pre_authorization_id = COALESCE(?, pre_authorization_id), updated_at = ?
     WHERE id = ? AND hospital_id = ?`,
    b.status,
    remarks,
    preAuthorizationId,
    nowIso(),
    id,
    hospital(c.env).id,
  );
  if (!changed) throw notFound(`Claim ${id} not found`);
  await logAction(c.env, {
    action: 'SCHEME_CLAIM_STATUS_UPDATED',
    entity: 'SCHEME_CLAIM',
    entityId: id,
    userId: c.get('user').userId,
    metadata: { newStatus: b.status, remarks },
  });
  return ok(c, toClaim((await getClaim(c.env, id))!));
});
