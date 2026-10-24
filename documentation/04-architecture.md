# Architecture

## Overview

```
Browser (React SPA on Netlify)
   │  HTTPS, JSON, base URL = VITE_API_URL or apiBaseUrl (…/api)
   ▼
Cloudflare Worker "sanjeevani-api" (worker/, Hono)  ──►  Cloudflare D1 "sanjeevani-db" (SQLite)
   │                                                     • appointments, slot holds, OTP codes, payments,
   │                                                       OPD timings, reviews, camps, claims, admins…
   ├──► MSG91 (OTP SMS)
   ├──► Razorpay (orders, payment signature check)
   └──  Cron trigger, daily 03:30 UTC (09:00 IST): tidy expired OTP codes, holds and sessions
```

All API routes are under `/api` (`worker/src/index.ts`). Every reply has the same shape as the old server:

- success: `{ "success": true, "data": …, "message": … }`
- error: `{ "success": false, "error": { "code", "message", "path", "timestamp" } }`

Routes live in `worker/src/routes/*.ts`; shared code in `worker/src/lib/`. The database tables are defined in `worker/migrations/`. Setup and deploys: [09-cloudflare.md](09-cloudflare.md).

## Booking, end to end

The booking page is `frontend/src/pages/BookAppointmentPage.tsx`. The API side is `worker/src/routes/appointments.ts`, `auth.ts` and `payments.ts`.

| # | Call | Auth | What happens |
| --- | --- | --- | --- |
| 1 | `GET /api/appointments/availability?doctorId=<id>&date=YYYY-MM-DD` | public | Builds the day's times from the doctor's weekly OPD timings (D1 `doctor_schedules`, or `DEFAULT_SCHEDULES` in `worker/src/data/roster.ts`) and marks booked and held ones. While the testing switch `BOOKING_OPEN_ALL_DOCTORS` is on, every doctor is open 08:00–22:00 every day. |
| 2 | `POST /api/auth/send-otp` | public | Creates an OTP session for the mobile number and sends a 6-digit code with MSG91. The code is stored only as a hash (`otp_sessions`). Max 3 codes per number per 10 minutes (`rate_limits`). In development without MSG91 the code is `123456`. In production without MSG91, see [Booking without SMS](#booking-without-sms). |
| 3 | `POST /api/auth/verify-otp` | public | Checks the code (max 5 tries). Returns a **patient JWT** (`type: BOOKING_SESSION`, phone inside, valid 30 minutes). |
| 4 | `POST /api/appointments/session/init` | patient JWT (`requirePatient`) | Creates a booking session for the verified phone, doctor and patient details. The phone comes from the token, not the request body. Returns `bookingSessionId` and the fee (from `ROSTER`). |
| 5 | `POST /api/appointments/reserve-slot` | session id | Holds the chosen time for **10 minutes**. A time held by another session is refused. Choosing another time releases the previous hold. |
| 6 | `POST /api/payments/create-order` | session id | Only for online payment. Creates a Razorpay order for the fee the API knows (never the browser's amount). If Razorpay keys are not set, online payment is off and the page offers pay-at-counter only. |
| 7 | `POST /api/payments/verify` | session id | Checks the Razorpay HMAC-SHA256 signature with the key secret and marks the session paid. |
| 8 | `POST /api/appointments/confirm-slot` | session id | Confirms the held slot. `payAtHospital: true` for pay-at-counter. Returns the token number (`appointmentCode`), the appointment, `hospitalAddress` and `emergencyHelpline` (from `wrangler.toml` `[vars]`). |

After step 8 the page shows the token, a Google Calendar link, a print view and the **A5 PDF slip** (`components/TokenSlip.tsx`, captured with html2canvas and saved with jsPDF in the browser).

### Booking without SMS

When MSG91 is not set up on the live API:

- `REQUIRE_OTP = "false"` (default): `send-otp` returns a token straight away with `otpRequired: false`. The booking is saved as "mobile not verified" and reception calls to confirm. Limited to 5 such bookings per visitor (IP) per day.
- `REQUIRE_OTP = "true"`: `send-otp` refuses with "Online booking is temporarily unavailable. Please call reception…".

Patient login (`/patient`) refuses unverified tokens, so it needs MSG91 on the live site.

### Slot holds

- One row per doctor + date + time in the D1 table `appointment_slots`, created when someone holds or books it. A `UNIQUE (doctor_id, slot_date, start_time)` constraint and a conditional update make holds safe when two patients pick the same time at once.
- `held_until = now + 10 min`. An expired hold counts as free; the daily cron also resets old holds.
- One session holds at most one slot.
- Confirming after the hold expired returns "Your hold on this time has expired. Please pick the time again."

### Offline fallback

If step 1 fails (API down, wrong `VITE_API_URL` / `apiBaseUrl`, network), the page switches to **request mode**:

1. Times are worked out in the browser from the doctor's `timings` text in `doctorsData.ts` (`lib/opdHours.ts` → `parseOpdHours`, `offlineSlots`). If the text cannot be parsed, the patient is asked to call.
2. The patient fills in the details; no OTP, no payment.
3. The last step builds a message and opens `https://wa.me/<HOSPITAL.phones.whatsapp>?text=…`, or the patient calls reception.
4. Nothing is stored on the server. Reception confirms by phone.

The page always tells the patient that the appointment is only confirmed after the hospital calls.

## OPD timings

- Starting values: `DEFAULT_SCHEDULES` in `worker/src/data/roster.ts`.
- Admin edits: `GET /api/appointments/schedules`, `GET /api/appointments/schedules/:doctorId` (public), `PUT /api/appointments/schedules/:doctorId` (staff). Saved in the D1 table `doctor_schedules` (one row per day per session), keyed by the **website doctor id** (for example `doc-bagal`). No database `doctors` row is needed.
- Doctor profiles show the week with the `OpdWeek` component (`GET /api/appointments/schedules/:doctorId`).

## Auth and roles

| Who | How | Token |
| --- | --- | --- |
| Patient (booking) | OTP on mobile number | JWT, `type: BOOKING_SESSION`, 30 minutes, only for `session/init` |
| Patient (Patient login) | OTP, then `POST /api/patient-portal/session` | JWT, `type: PATIENT_PORTAL`, 30 days |
| Staff | `POST /api/auth/admin/login` (email + password) | JWT with `role` and `hospitalId`, 7 days, stored in the browser (`sanjeevani_admin_token`) |

Tokens are HS256 JWTs signed with `JWT_SECRET` (`worker/src/lib/auth.ts`). Changing the secret signs everyone out.

Roles: `SUPER_ADMIN`, `HOSPITAL_ADMIN`, `RECEPTIONIST`, `DOCTOR`. Staff routes use `requireRoles(...)` with the lists `ADMINS`, `FRONT_DESK` and `STAFF`; patient routes use `requirePatient('BOOKING_SESSION' | 'PATIENT_PORTAL')`.

Passwords (`worker/src/lib/password.ts`): new and changed passwords are PBKDF2-SHA256 (Web Crypto). Accounts copied from Supabase keep their bcrypt hash, which still works and is replaced with PBKDF2 at the next successful login. Sign-in is limited to 10 attempts per IP per 15 minutes.

In development (`ENVIRONMENT=development`), staff can also log in with the built-in accounts in `worker/src/routes/auth.ts` (`admin@sanjeevanihosp.in` / `Admin@123`, `superadmin@sanjeevanihosp.in` / `SuperAdmin@123`). On Cloudflare (production) these are never used.

## Where data lives

| Data | Where |
| --- | --- |
| Hospital details, doctors, departments, awards, photos (website) | Frontend source files (part of the build) |
| Booking roster (doctor ids, names, fees), default timings | `worker/src/data/roster.ts` (source) |
| Hospital details used by the API | `worker/wrangler.toml` `[vars]` |
| OPD timings saved by admins | D1 `doctor_schedules`, `schedule_breaks` |
| Admin accounts | D1 `hospital_admins` (+ built-in accounts in development only) |
| Appointments, booking sessions, slot holds | D1 `appointments`, `booking_sessions`, `appointment_slots` |
| OTP codes (hashed), rate-limit counters | D1 `otp_sessions`, `rate_limits` |
| Payments | D1 `payments` (Razorpay keeps its own record too) |
| Reviews, camps, scheme claims, audit log | D1 `patient_reviews`, `hospital_events`, `scheme_claims`, `audit_logs` |
| Patient records (bills, medicines, lab results, follow-ups, profile) | D1 `hospital_settings`, one JSON row per patient (key `patient_record:<mobile>`) |
| Hospital row, departments, doctors (database copies) | D1 `hospitals`, `departments`, `doctors` |

Everything in D1 survives redeploys. There are no built-in sample reviews, camps or claims: the site shows only what was submitted or added by staff.

The daily cron (`worker/src/scheduled.ts`) deletes expired OTP codes and counters, frees expired holds, removes unused slot rows and deletes booking sessions older than a day that never became an appointment or payment. It never touches appointments.

## Security notes

- **Fee from the API:** the payment amount comes from `ROSTER`, never from the browser.
- **Payment signature:** `payments/verify` checks Razorpay's HMAC-SHA256 signature before marking paid.
- **OTP:** random 6-digit code when MSG91 is set, stored hashed, 5 tries, 3 codes per number per 10 minutes. The fixed code `123456` only works in development.
- **JWT_SECRET:** required; the API refuses to sign or check tokens without a value of 16+ characters (use 32+). The deploy workflow copies it from the GitHub secret; if that secret is missing it only shows a notice and the Worker keeps its current value (none on a first deploy). Use a different value for each hospital.
- **Admin passwords:** no default password exists on Cloudflare. The first admin is created from GitHub secrets ([09-cloudflare.md](09-cloudflare.md#part-3-create-the-first-admin)).
- **CORS:** `ALLOWED_ORIGINS` in `wrangler.toml`; `*` by default. The API uses bearer tokens, not cookies.
- **Rate limits:** OTP per phone, sign-in per IP, no-SMS bookings per IP, stored in D1 (`worker/src/lib/ratelimit.ts`).
- **Headers:** Hono `secureHeaders` on the API; Netlify adds frame, content-type and referrer headers for the site (`netlify.toml`).
- **Secrets:** never commit Razorpay, MSG91 or JWT secrets. They live in GitHub secrets and are copied onto the Worker by the deploy workflow. `worker/.dev.vars` (local) is not committed.
- **Patient data:** names and phone numbers are stored in D1 and sent to the hospital's WhatsApp in offline mode. Do not log them.
