-- Reception tools: walk-in / phone bookings, cancel with a reason, change of time.
--
-- The old NestJS server kept these fields inside the JSON `data` column of a
-- separate appointment_records table. In D1 appointments already live in the
-- `appointments` table, so the extra fields are plain columns here.
--
-- Per-doctor fee overrides set from the admin panel are stored in
-- hospital_settings under the key "doctor_fee:<doctorId>" (same as before),
-- so no new table is needed for them.

ALTER TABLE appointments ADD COLUMN source TEXT;            -- ONLINE | WALK_IN | PHONE (NULL on rows booked before this change)
ALTER TABLE appointments ADD COLUMN booked_by TEXT;         -- staff name (or id) who booked at reception
ALTER TABLE appointments ADD COLUMN booked_by_id TEXT;      -- staff account id who booked at reception
ALTER TABLE appointments ADD COLUMN patient_id TEXT;        -- patients.id, when booked for a registered patient
ALTER TABLE appointments ADD COLUMN patient_reg_no TEXT;    -- registration number, e.g. "SMH-P-000123"
ALTER TABLE appointments ADD COLUMN cancel_reason TEXT;
ALTER TABLE appointments ADD COLUMN rescheduled_from TEXT;  -- "YYYY-MM-DD hh:mm AM" of the previous time

CREATE INDEX IF NOT EXISTS idx_appt_patient ON appointments (patient_id);
