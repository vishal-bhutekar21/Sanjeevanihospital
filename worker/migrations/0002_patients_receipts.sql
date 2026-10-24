-- Reception tools: registered patients, receipts and running numbers.
-- Port of the Prisma models Patient, Receipt and DocCounter (backend/prisma/schema.prisma,
-- commit 507c42a); table and column names follow their @map names.
--
-- Money is INTEGER paise, JSON is TEXT, timestamps are ISO-8601 TEXT (UTC).
-- hospital_id is HOSPITAL_TENANT_ID (same as appointments / audit_logs).

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  reg_no TEXT NOT NULL UNIQUE,             -- "SMH-P-000123"
  name TEXT NOT NULL,
  phone TEXT NOT NULL,                     -- 10 digits; family members can share one
  age INTEGER,
  date_of_birth TEXT,                      -- YYYY-MM-DD
  gender TEXT,
  address TEXT,
  id_number TEXT,                          -- Aadhaar / ABHA, optional
  scheme TEXT,                             -- MJPJAY, Ayushman Bharat, TPA ...
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients (hospital_id, phone);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients (hospital_id, name);
CREATE INDEX IF NOT EXISTS idx_patients_created ON patients (hospital_id, created_at);

CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  receipt_no TEXT NOT NULL UNIQUE,         -- "SMH-R-2627-000045"
  status TEXT NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED','CANCELLED')),
  kind TEXT NOT NULL DEFAULT 'CONSULTATION',
  patient_id TEXT,
  patient_reg_no TEXT,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_address TEXT,
  appointment_code TEXT,
  doctor_name TEXT,
  items TEXT NOT NULL,                     -- JSON [{ name, qty, ratePaise, gstPercent, amountPaise, discountPaise, taxPaise }]
  subtotal_paise INTEGER NOT NULL,
  discount_paise INTEGER NOT NULL DEFAULT 0,
  tax_paise INTEGER NOT NULL DEFAULT 0,
  total_paise INTEGER NOT NULL,
  paid_paise INTEGER NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'CASH', -- mode of the first payment
  payment_ref TEXT,
  payments TEXT NOT NULL DEFAULT '[]',     -- JSON [{ amountPaise, mode, ref, at, by }]
  note TEXT,
  issued_by TEXT,
  issued_by_name TEXT,
  cancelled_at TEXT,
  cancel_reason TEXT,
  cancelled_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_receipts_time ON receipts (hospital_id, created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_phone ON receipts (patient_phone);
CREATE INDEX IF NOT EXISTS idx_receipts_appt ON receipts (appointment_code);

-- Running numbers: key "patient" or "receipt:<financial year>", e.g. "receipt:2627"
CREATE TABLE IF NOT EXISTS doc_counters (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (hospital_id, key)
);
