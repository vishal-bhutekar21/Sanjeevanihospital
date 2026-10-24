# Notifications, staff records and login: plan

Status: **planned**. Today the Staff section (`/admin/staff`) saves in the browser only, and reminder alerts are browser notifications. This page is the plan for moving both to the server.

## What works today (no server needed)

| Feature | Where | Limits |
|---|---|---|
| Employees, salary payments, dues, reminders | `frontend/src/pages/admin/AdminStaffPage.tsx`, `frontend/src/lib/staffStore.ts` (localStorage key `hospital-admin-staff-v1`) | One browser only. Use Export to keep a copy. |
| Reminder alerts (salary day, renewals) | `frontend/src/lib/staffNotify.ts`, checked by `AdminLayout` every 15 minutes | Only while the admin panel is open in a tab, after "Turn on alerts". |

## Patient portal (built)

- Patients sign in at `/patient` (footer link) with mobile + SMS code: `/auth/send-otp` → `/auth/verify-otp` → `POST /patient-portal/session`, which gives a 30-day token (`type: PATIENT_PORTAL`). Unverified no-SMS tokens are refused.
- `GET /patient-portal/me`: the patient's bills, medicines and online appointments.
- Staff: `GET/POST/PATCH/DELETE /patient-records/:phone/...` (Admin → Patient records). Code: `worker/src/routes/patients.ts`, `frontend/src/pages/PatientPortalPage.tsx`, `frontend/src/pages/admin/AdminPatientRecordsPage.tsx`, `frontend/src/lib/patientPortal.ts`.
- Storage: one JSON row per patient in the existing `hospital_settings` table (key `patient_record:<mobile>`), so no schema change was needed. Move to proper `patient_bills` / `patient_medicines` tables when the schema change is approved (a new file in `worker/migrations/`).
- Alerts: medicine expiry (30 days) and course ending (3 days) show on the portal and as phone notifications while it is open. Push when closed comes with Firebase (Step 2).

## Step 1: staff records on the server (Worker + D1)

New tables, added as a new numbered migration in `worker/migrations/`. This is a schema change, so get the owner's approval first (CLAUDE.md rule 1):

- `staff_members`: id, hospital_id, name, role, department, phone, joining_date, monthly_salary, employment_type, status, notes
- `staff_payments`: id, staff_id, paid_on, for_month (YYYY-MM), amount, type (SALARY/ADVANCE/BONUS/DEDUCTION), mode, reference, note, created_by
- `staff_reminders`: id, staff_id (nullable), title, due_date, repeat (NONE/MONTHLY), note, done_on
- `push_subscriptions`: id, admin_user_id, fcm_token, device_label, created_at

Endpoints go in a new file in `worker/src/routes/`, staff-only with `requireRoles(...)` from `worker/src/lib/auth.ts` (HOSPITAL_ADMIN / SUPER_ADMIN; accounts role for payments). Keep the field names used in `staffStore.ts` so the page only swaps localStorage for `apiFetch`. Add a one-time "Import from this browser" button that posts the localStorage data.

## Step 2: push notifications (Firebase Cloud Messaging)

1. The hospital creates a Firebase project, enables Cloud Messaging and creates a Web Push certificate (VAPID key).
2. API: add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` as GitHub secrets and to the deploy workflow's secret list. The `firebase-admin` package does not run on Workers, so the Worker calls the FCM HTTP v1 API directly, signing a service-account token with Web Crypto.
3. Frontend: add `firebase-messaging-sw.js` in `frontend/public`. "Turn on alerts" then gets an FCM token and saves it to `push_subscriptions`. Alerts reach phones and closed browsers.
4. A daily job (below) sends: salary due (on the salary day, and again if still unpaid three days later), reminders due today or overdue, and the day's appointment count to reception.

Patient messages (appointment confirmation, the day-before reminder, follow-up visits) go by WhatsApp or SMS (MSG91), not FCM. Patients don't install anything.

## Step 3: scheduled jobs (Worker cron)

The API already runs on Cloudflare Workers with a daily Cron Trigger: `crons = ["30 3 * * *"]` in `worker/wrangler.toml` (09:00 IST). Today it only tidies expired OTP codes, holds and sessions (`worker/src/scheduled.ts`).

- Add the daily jobs (salary due, reminders, the day's appointment count) to the same `scheduled` handler. It has the D1 database and the Worker secrets, so no extra service or shared secret is needed.
- Jobs that must run more often (for example a 2-hour appointment reminder) need another entry in `crons`.

## Login

Admin login is in the Worker (`POST /api/auth/admin/login`, `worker/src/routes/auth.ts`): JWT, PBKDF2 passwords in `hospital_admins` (old bcrypt hashes upgraded at next login), role checks with `requireRoles`, and a limit of 10 sign-in attempts per IP per 15 minutes.

Optional later:
- Turnstile (Cloudflare's CAPTCHA) on the staff login form.
- Firebase Authentication for staff (Google sign-in or phone OTP), with the Worker verifying the Firebase ID token in place of email and password.
- Two-step verification for HOSPITAL_ADMIN.

## Accounts the hospital needs to create

- Firebase project (free Spark plan is enough for push)
- Cloudflare account (already needed for the API; Workers Paid plan recommended, see [09-cloudflare.md](09-cloudflare.md#costs))
- MSG91 with an approved DLT template, for patient SMS
- WhatsApp Business API (through MSG91 or Gupshup), for patient WhatsApp messages
