# Architecture

## Overview

```
Browser (React SPA on Netlify)
   │  HTTPS, JSON, base URL = VITE_API_URL (…/api)
   ▼
NestJS API (Render)  ──►  PostgreSQL (Supabase) via Prisma
   │                         • doctor_schedules (OPD timings) and other tables
   ├──► MSG91 (OTP SMS)
   └──► Razorpay (orders, payment signature check)
```

All API routes are under `/api`. Every response is wrapped as `{ "success": true, "data": … }` by the transform interceptor; errors go through the HTTP exception filter.

## Booking, end to end

The booking page is `frontend/src/pages/BookAppointmentPage.tsx`. The server side is `backend/src/appointments`, `auth` and `payments`.

| # | Call | Auth | What happens |
| --- | --- | --- | --- |
| 1 | `GET /api/appointments/availability?doctorId=<id>&date=YYYY-MM-DD` | public | Builds the day's times from the doctor's weekly OPD timings (database `doctor_schedules`, or `DEFAULT_SCHEDULES`) and marks booked and held ones. Called when the patient picks a doctor and a day. |
| 2 | `POST /api/auth/send-otp` | public | Creates an OTP session for the mobile number and sends a 6-digit code with MSG91. Limited per phone number (in memory). In development without MSG91 the code is `123456` and is printed in the server log. In production without MSG91 the call fails with "please call reception". |
| 3 | `POST /api/auth/verify-otp` | public | Checks the code (max 5 tries). Returns a **patient JWT** (`type: BOOKING_SESSION`, phone inside, valid 30 minutes). |
| 4 | `POST /api/appointments/session/init` | patient JWT (`JwtAuthGuard` + `PatientSessionGuard`) | Creates a booking session for the verified phone, doctor and patient details. The phone comes from the token, not the request body. Returns `bookingSessionId` and the fee (from `ROSTER`). |
| 5 | `POST /api/appointments/reserve-slot` | session id | Holds the chosen time for **10 minutes**. A time held by another session is refused. Choosing another time releases the previous hold. |
| 6 | `POST /api/payments/create-order` | session id | Only for online payment. Creates a Razorpay order for the fee the server knows (never the browser's amount). If Razorpay keys are not set, online payment is off and the page offers pay-at-counter only. |
| 7 | `POST /api/payments/verify` | session id | Checks the Razorpay HMAC-SHA256 signature with the key secret and marks the session paid. |
| 8 | `POST /api/appointments/confirm-slot` | session id | Confirms the held slot. `payAtHospital: true` for pay-at-counter. Returns the token number (`appointmentCode`), the appointment, `hospitalAddress` and `emergencyHelpline` (from `hospital.config.ts`). |

After step 8 the page shows the token, a Google Calendar link, a print view and the **A5 PDF slip** (`components/TokenSlip.tsx`, captured with html2canvas and saved with jsPDF in the browser).

### Slot holds

- Held in server memory with `heldUntil = now + 10 min`.
- Expired holds become free again automatically.
- One session holds at most one slot.
- Confirming after the hold expired returns "Your hold on this time has expired. Please pick the time again."

### Offline fallback

If step 1 fails (server down, wrong `VITE_API_URL`, network), the page switches to **request mode**:

1. Times are worked out in the browser from the doctor's `timings` text in `doctorsData.ts` (`lib/opdHours.ts` → `parseOpdHours`, `offlineSlots`). If the text cannot be parsed, the patient is asked to call.
2. The patient fills in the details; no OTP, no payment.
3. The last step builds a message and opens `https://wa.me/<HOSPITAL.phones.whatsapp>?text=…`, or the patient calls reception.
4. Nothing is stored on the server. Reception confirms by phone.

The page always tells the patient that the appointment is only confirmed after the hospital calls.

## OPD timings

- Starting values: `DEFAULT_SCHEDULES` in `backend/src/appointments/schedules.ts`.
- Admin edits: `GET /api/appointments/schedules`, `GET /api/appointments/schedules/:doctorId` (public), `PUT /api/appointments/schedules/:doctorId` (staff). Saved in the `doctor_schedules` table (one row per day per session).
- The server matches `ROSTER` doctors to database `doctors` rows **by name** to find the database id. A doctor with no matching database row can be booked with default timings, but timings cannot be saved for them.
- If the database is unreachable, the defaults are used and the server keeps running.
- Doctor profiles show the week with the `OpdWeek` component (`GET /api/appointments/schedules/:doctorId`).

## Auth and roles

| Who | How | Token |
| --- | --- | --- |
| Patient | OTP on mobile number | JWT, `type: BOOKING_SESSION`, 30 minutes, only for `session/init` |
| Staff | `POST /api/auth/admin/login` (email + password, bcrypt) | JWT with `role` and `hospitalId`, `JWT_EXPIRES_IN` (default 7 days), stored in the browser (`sanjeevani_admin_token`) |

Roles (`AdminRole` in the Prisma schema): `SUPER_ADMIN`, `HOSPITAL_ADMIN`, `RECEPTIONIST`, `DOCTOR` and others. Admin routes use `JwtAuthGuard` + `RolesGuard` with `@Roles(...)`. Routes marked `@Public()` need no token. `HospitalIsolationGuard` exists for checking `hospitalId` on multi-hospital routes.

In development (no database), staff can log in with the in-memory accounts in `auth/auth.service.ts` (`admin@sanjeevanihosp.in` / `Admin@123`). In production these are not used.

## Where data lives

| Data | Where | Survives a restart? |
| --- | --- | --- |
| Hospital details, doctors, departments, awards, photos (website) | Frontend source files | yes (part of the build) |
| Booking roster (doctors, fees) | `backend/src/appointments/schedules.ts` | yes (source) |
| OPD timings saved by admins | Database, `doctor_schedules` | **yes** |
| Admin accounts | Database `hospital_admins` (+ in-memory dev accounts) | yes |
| **Appointments, booking sessions, slot holds, OTP sessions** | **Server memory** | **no** |
| **Payments list** | **Server memory** (Razorpay keeps its own record) | **no** |
| Scheme claims, reviews, camps, audit log | Server memory (seeded with sample data) | no |

**Important:** today a server restart or redeploy loses every appointment, payment record, claim and review submitted since the last start. Render free instances also sleep and restart. Moving these to the database is the first item in [07-roadmap.md](07-roadmap.md). Until then, reception should treat the admin Appointments list as a live view, not a permanent record, and Razorpay's dashboard is the source of truth for payments.

## Security notes

- **Fee from the server:** the payment amount comes from `ROSTER`, never from the browser.
- **Payment signature:** `payments/verify` checks Razorpay's HMAC-SHA256 signature before marking paid.
- **OTP:** random 6-digit code in production, 5 tries, per-phone limit. The fixed code `123456` only works when `NODE_ENV` is not `production`.
- **JWT_SECRET:** the code falls back to a built-in secret if `JWT_SECRET` is missing. Always set a long random value in production, different for each hospital.
- **Admin passwords:** the seed uses `Admin@123`. Change it before launch.
- **CORS:** `origin: '*'` in `main.ts`. Consider limiting it to the hospital's domain.
- **Rate limiting:** `ThrottlerModule` is configured (100 requests per minute) but no global `ThrottlerGuard` is registered, so it is not enforced on every route. OTP has its own per-phone limit.
- **Helmet** sets security headers on the API; Netlify adds frame, content-type and referrer headers for the site (`netlify.toml`).
- **Secrets:** never commit Razorpay, MSG91 or database credentials. Set them in Render / Netlify.
- **Patient data:** names and phone numbers are held in server memory and sent to the hospital's WhatsApp in offline mode. Do not log them in production.
