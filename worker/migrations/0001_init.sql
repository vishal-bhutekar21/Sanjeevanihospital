-- Sanjeevani hospital API on Cloudflare D1 (SQLite).
--
-- Tables that existed in Supabase keep the same table names, column names
-- and ids, so `scripts/export-supabase.mjs` can copy the data across as-is.
-- Extra columns hold what the old NestJS server kept only in memory.
--
-- Conventions: ids are TEXT (uuid or website id such as "doc-bagal"),
-- booleans are INTEGER 0/1, timestamps are ISO-8601 TEXT (UTC),
-- calendar dates are TEXT "YYYY-MM-DD".

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS hospitals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Jalna',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  pincode TEXT NOT NULL DEFAULT '431203',
  phone TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  email TEXT NOT NULL,
  established_year INTEGER NOT NULL DEFAULT 2016,
  latitude REAL,
  longitude REAL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS hospital_admins (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  supabase_user_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT,            -- bcrypt ($2a/$2b, from Supabase) or pbkdf2$... (new)
  role TEXT NOT NULL DEFAULT 'HOSPITAL_ADMIN' CHECK (role IN ('SUPER_ADMIN','HOSPITAL_ADMIN','DOCTOR','RECEPTIONIST')),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  slug TEXT NOT NULL,
  description_en TEXT,
  description_mr TEXT,
  icon TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  experience_years INTEGER,
  consultation_fee INTEGER NOT NULL DEFAULT 500,
  photo_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  -- Website doctor id (frontend/src/data/doctorsData.ts), matched by name on import
  website_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Weekly OPD timings. doctor_id is the WEBSITE doctor id (e.g. "doc-bagal").
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,      -- "10:00"
  end_time TEXT NOT NULL,        -- "14:00"
  slot_duration_mins INTEGER NOT NULL DEFAULT 15,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (doctor_id, day_of_week, start_time)
);

CREATE TABLE IF NOT EXISTS schedule_breaks (
  id TEXT PRIMARY KEY,
  doctor_schedule_id TEXT NOT NULL REFERENCES doctor_schedules(id) ON DELETE CASCADE,
  break_start TEXT NOT NULL,
  break_end TEXT NOT NULL
);

-- OTP codes for patient mobile verification (was server memory)
CREATE TABLE IF NOT EXISTS otp_sessions (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,           -- 10 digits
  otp_hash TEXT NOT NULL,        -- SHA-256 of code + id; the code itself is never stored
  attempts INTEGER NOT NULL DEFAULT 0,
  verified_at TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_sessions (phone, created_at);

-- Fixed-window counters: OTP per phone, no-SMS bookings per IP, logins per IP
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL      -- epoch ms
);

CREATE TABLE IF NOT EXISTS booking_sessions (
  id TEXT PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT,                 -- unused (kept for imported rows)
  otp_verified_at TEXT,
  patient_name TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  patient_address TEXT,
  doctor_id TEXT,                -- website doctor id
  status TEXT NOT NULL DEFAULT 'OTP_VERIFIED',
  phone_verified INTEGER NOT NULL DEFAULT 1,
  held_slot_id TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- One row per (doctor, date, time) once someone holds or books it.
-- The UNIQUE constraint + conditional UPDATE make holds race-free.
CREATE TABLE IF NOT EXISTS appointment_slots (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL,       -- website doctor id
  slot_date TEXT NOT NULL,       -- YYYY-MM-DD
  start_time TEXT NOT NULL,      -- "09:30 AM" (same labels the website shows)
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','HELD','CONFIRMED')),
  held_until TEXT,
  booking_session_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (doctor_id, slot_date, start_time)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  booking_session_id TEXT NOT NULL UNIQUE,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,       -- paise
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','VERIFIED','FAILED','REFUNDED')),
  verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  appointment_code TEXT NOT NULL UNIQUE,   -- "SMH-2026-123456"
  hospital_id TEXT NOT NULL,
  department_id TEXT,
  doctor_id TEXT NOT NULL,                 -- website doctor id
  slot_id TEXT UNIQUE,
  session_id TEXT UNIQUE,
  payment_id TEXT UNIQUE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,             -- 10 digits
  patient_age INTEGER NOT NULL,
  patient_gender TEXT,
  patient_address TEXT,
  appointment_date TEXT NOT NULL,          -- YYYY-MM-DD
  start_time TEXT NOT NULL,                -- "09:30 AM"
  end_time TEXT,
  doctor_name TEXT,
  department_name TEXT,
  fee INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PAID','PENDING')),
  razorpay_payment_id TEXT,
  phone_verified INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING_PAYMENT','CONFIRMED','IN_CONSULTATION','COMPLETED','CANCELLED','NO_SHOW')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_appt_date ON appointments (hospital_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appt_doctor ON appointments (doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appt_phone ON appointments (patient_phone);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata TEXT,                 -- JSON
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs (hospital_id, created_at);

CREATE TABLE IF NOT EXISTS hospital_events (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,      -- YYYY-MM-DD (or ISO from import)
  category TEXT NOT NULL DEFAULT 'HEALTH_CAMP',
  image_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  title_mr TEXT,
  description_mr TEXT,
  event_time TEXT,
  venue TEXT,
  organizer TEXT,
  featured_doctor TEXT,
  registration_required INTEGER NOT NULL DEFAULT 0,
  registration_phone TEXT,
  is_free INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING','ONGOING','COMPLETED','CANCELLED')),
  attendees_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS patient_reviews (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  department TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'DIRECT',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  patient_location TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  treatment_type TEXT,
  moderation_note TEXT,
  is_verified_patient INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON patient_reviews (hospital_id, status, created_at);

-- MJPJAY / PM-JAY / insurance claims (was server memory)
CREATE TABLE IF NOT EXISTS scheme_claims (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  scheme_type TEXT NOT NULL,     -- MJPJAY | PMJAY | INSURANCE
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  aadhaar_last4 TEXT NOT NULL,
  ration_card_number TEXT,
  ayushman_card_number TEXT,
  insurer_name TEXT,
  tpa_name TEXT,
  diagnosis_description TEXT NOT NULL,
  estimated_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'REGISTERED',
  arogya_mitra_id TEXT,
  pre_authorization_id TEXT,
  remarks TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Key/value settings; also patient records as JSON under "patient_record:<mobile>"
CREATE TABLE IF NOT EXISTS hospital_settings (
  id TEXT PRIMARY KEY,
  hospital_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (hospital_id, key)
);
