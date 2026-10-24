# Guide for AI coding agents

Read this before changing code in this repository.

## What this project is

A bilingual (English + Marathi) hospital website with online OPD booking and a staff admin panel. It runs live for Sanjeevani Multispeciality Hospital, Jalna, and is also a **template**: the same code is set up for other hospitals by changing config and data files (see [02-rebrand-checklist.md](02-rebrand-checklist.md)). Real patients use it, so correctness and plain language matter more than features.

- Frontend: React 18 + TypeScript + Vite + Tailwind, in `frontend/`.
- API: Cloudflare Worker (TypeScript, Hono) with a Cloudflare D1 (SQLite) database, in `worker/`. All routes under `/api`. Deployed by GitHub Actions (`.github/workflows/worker-deploy.yml`); setup in [09-cloudflare.md](09-cloudflare.md).

## Golden rules

1. **Never change API field names, endpoints or the database schema without asking.** The frontend, the live database and the booking flow depend on them. The schema is the SQL in `worker/migrations/`. A schema change is a **new numbered migration file** (for example `0002_staff.sql`); never edit a migration that has already been applied. It still needs the owner's approval first.
2. **Keep English and Marathi together.** Every visible string needs both. If you cannot write good Marathi, add your best version and say so in your summary.
3. **Use the hospital config; never hard-code hospital details.** Name, phones, emails, address, hours, map, logo come from `frontend/src/config/hospital.ts` (frontend) and `worker/wrangler.toml` `[vars]` (API, read through `hospital(env)` in `worker/src/lib/config.ts`).
4. **Doctor ids are the join key** across `frontend/src/data/doctorsData.ts`, `frontend/public/images/doctors/<id>.webp`, `DEPARTMENTS[].doctorIds` and the API `ROSTER` / `DEFAULT_SCHEDULES` in `worker/src/data/roster.ts`. Saved OPD timings in the D1 table `doctor_schedules` are keyed by this id too. Change all of them together, never rename an id that is live.
5. **No fake data and no fake buttons.** No invented stats, reviews, awards, doctors or fees. No "Save" that does not save. No chips/badges/pills, no gradients, no uppercase micro-labels (see [06-design-system.md](06-design-system.md)).
6. **Verify before you finish:** `npx tsc --noEmit` and `npx vite build` in `frontend/`, `npx tsc --noEmit` in `worker/`, and look at the changed pages in a browser at **390 px** and desktop width, in both languages.

Also: do not commit secrets; do not kill servers you did not start; do not git commit or push unless asked.

## Where things live

| Thing | Location |
| --- | --- |
| Hospital name, phones, emails, address, hours, map, logo | `frontend/src/config/hospital.ts` |
| API hospital id / name / address / helpline, allowed origins, testing switch | `worker/wrangler.toml` `[vars]` (`HOSPITAL_*`, `ALLOWED_ORIGINS`, `BOOKING_OPEN_ALL_DOCTORS`, `REQUIRE_OTP`) |
| Doctors (website) | `frontend/src/data/doctorsData.ts` |
| Doctors (API roster, fees), default OPD timings | `worker/src/data/roster.ts` |
| Departments | `DEPARTMENTS` export in `frontend/src/pages/DepartmentsPage.tsx` |
| Photos | `frontend/src/data/photos.ts`, `frontend/public/images/{hospital,doctors}/` |
| Awards | `frontend/src/data/awardsData.ts` |
| Shared UI text | `frontend/src/locales/en.json`, `mr.json` |
| Routes | `frontend/src/App.tsx` |
| Public pages | `frontend/src/pages/*.tsx` |
| Admin pages | `frontend/src/pages/admin/*.tsx`, nav in `frontend/src/layouts/AdminLayout.tsx` |
| Shared UI components | `frontend/src/components/ui.tsx` (PageIntro, SectionTitle, Photo, DoctorPhoto) |
| Buttons, cards | `frontend/src/index.css` (`btn-primary`, `btn-secondary`, `btn-emergency`, `card-clean`, `card-notice-amber`) |
| Booking page | `frontend/src/pages/BookAppointmentPage.tsx` |
| Offline booking parser, WhatsApp number | `frontend/src/lib/opdHours.ts` |
| API base URL | `apiBaseUrl` in `frontend/src/config/hospital.ts`, or `VITE_API_URL`; picked in `frontend/src/lib/api.ts` (localhost uses `http://localhost:8787/api`) |
| API entry, CORS, route mounting, daily cron | `worker/src/index.ts`, `worker/src/scheduled.ts` |
| API routes | `worker/src/routes/*.ts` (`appointments`, `auth`, `payments`, `patients`, `reviews`, `schemes`, `catalog`, `audit`) |
| Auth middleware (`requireAuth`, `requireRoles`, `requirePatient`) | `worker/src/lib/auth.ts` |
| Passwords (PBKDF2, old bcrypt), OTP hashing | `worker/src/lib/password.ts` |
| D1 helpers, rate limits, errors / reply shape | `worker/src/lib/db.ts`, `ratelimit.ts`, `http.ts` |
| Database schema | `worker/migrations/*.sql` |
| Worker bindings and secrets list | `worker/src/env.ts`, `worker/.dev.vars.example` |
| Deploy and data workflows | `.github/workflows/worker-deploy.yml`, `.github/workflows/worker-data.yml` |
| Page title / meta | `frontend/index.html` |
| Env variables | `worker/wrangler.toml` `[vars]` + GitHub secrets (API), `frontend/.env.example` |

## Recipes

### Add a doctor

1. `frontend/src/data/doctorsData.ts`: add an entry with a new `id` like `doc-surname`, both languages, `fee` (0 if unknown), `timings` in the format `Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM`.
2. Photo: `frontend/public/images/doctors/doc-surname.webp` (optional; initials otherwise). Set `image: '/images/doctors/doc-surname.webp'`.
3. `worker/src/data/roster.ts`: add to `ROSTER` with the **same id, name and fee**, and add a `DEFAULT_SCHEDULES` entry (`monToSat(...)` or `none()`).
4. If the doctor belongs to a department, add the id to that department's `doctorIds`.
5. Check `/doctors`, `/doctors/doc-surname`, `/book?doctorId=doc-surname`.

### Change a doctor's default OPD hours

Edit `DEFAULT_SCHEDULES` in `worker/src/data/roster.ts` (24-hour `"HH:mm"`, index 0 = Sunday) **and** the `timings` / `timingsMr` text in `doctorsData.ts` so the offline fallback and profile text match. Note: if an admin has already saved timings for that doctor, the D1 `doctor_schedules` rows win; change them in admin → OPD timings instead.

### Change hospital-wide OPD hours

`opdHours` in `frontend/src/config/hospital.ts` (header, footer, contact page, slip). Keep `morning` and `contactMorning` consistent or admin Settings shows a warning.

### Add a department

Add an object to `DEPARTMENTS` in `frontend/src/pages/DepartmentsPage.tsx` with a new `slug`, both languages, a `PHOTOS` key, `doctorIds` from `doctorsData.ts`. It appears on `/departments` and at `/departments/<slug>`. Consider the contact form subject list in `ContactPage.tsx`.

### Change phone numbers, email, address

Only `frontend/src/config/hospital.ts`. API messages: `HOSPITAL_HELPLINE` etc. in `worker/wrangler.toml` `[vars]`. Then grep to confirm no old number remains:
```bash
grep -rn "75073\|७५०७३" frontend/src worker/src worker/wrangler.toml
```

### Add a public page

1. Create `frontend/src/pages/NewPage.tsx`; start with `<PageIntro title=… intro=… />`, use `SectionTitle`, the `WRAP` width class, `isMr` for text.
2. Add a `<Route>` under the public layout in `frontend/src/App.tsx`.
3. Add a link in `Header.tsx` `navLinks` (via `locales` `nav.*`) and/or `Footer.tsx` `links`, both languages.
4. Use `HOSPITAL.*` for any hospital detail.

### Add an admin section

1. Create `frontend/src/pages/admin/AdminThingPage.tsx`; fetch with `apiFetch` / `getAuthHeaders` from `lib/api.ts`.
2. Add a route under `/admin` in `App.tsx` and a nav item in `AdminLayout.tsx`.
3. API: new endpoints go in a file in `worker/src/routes/`, mounted in `worker/src/index.ts`, protected with `requireRoles(...)` from `worker/src/lib/auth.ts` (`ADMINS`, `FRONT_DESK`, `STAFF` lists). Keep the `{ success, data, message }` reply shape (`ok()` in `lib/http.ts`). Do not add database tables without asking (a new table = a new migration file).
4. Admin pages are English only today; keep them in plain English.

## Verification commands

```bash
# Types and build (must pass)
cd /home/user/Sanjeevanihospital/frontend && npx tsc --noEmit && npx vite build
cd /home/user/Sanjeevanihospital/worker && npx tsc --noEmit

# Are servers already running? (do not kill ones you did not start)
lsof -ti:8787   # API (wrangler dev)
lsof -ti:5173   # frontend

# Start the API locally (local D1 database; OTP is 123456; dev admin accounts)
cd /home/user/Sanjeevanihospital/worker && cp -n .dev.vars.example .dev.vars && \
  npm install && npm run db:migrate:local && npm run dev

# Start frontend (on localhost it calls http://localhost:8787/api)
cd /home/user/Sanjeevanihospital/frontend && npx vite --port 5173

# Quick API checks
curl -s localhost:8787/api/health
curl -s "localhost:8787/api/appointments/availability?doctorId=doc-goyal&date=$(date -d tomorrow +%F)"
```

Then open http://localhost:5173 at 390 px and 1280 px wide, switch to मराठी, and click through the pages you changed. For booking changes, book one appointment end to end (OTP `123456` in development) and download the PDF slip. Staff login in development: `admin@sanjeevanihosp.in` / `Admin@123`.

Schema change (only after approval): add `worker/migrations/000N_name.sql`, run `npm run db:migrate:local`, and test. The deploy workflow applies new migrations to the live database on the next push to `main`.

## Known gaps

- Admin → Staff saves in the browser only (see [08-notifications-and-staff-plan.md](08-notifications-and-staff-plan.md)).
- Patient records (bills, medicines, lab results, follow-ups, profile) are one JSON row per patient in `hospital_settings` (key `patient_record:<mobile>`), not separate tables.
- There is no seed file for the D1 `doctors` and `departments` tables. Sanjeevani's rows come from the one-time copy from Supabase; booking itself uses `ROSTER` ids and does not need them.
- `ALLOWED_ORIGINS` is `*` by default (the API uses bearer tokens, no cookies). Set it to the hospital's domains if wanted.
- On the Workers Free plan (10 ms CPU per request), the first login of an account copied with a bcrypt hash can fail; see [09-cloudflare.md](09-cloudflare.md#troubleshooting).
- Contact page enquiry form does not send anywhere (shows a thank-you only).
- The current site has two emails (contact vs footer) and two morning OPD end times (3 pm on contact, 1 pm elsewhere); the hospital has not confirmed which is right. Both are kept in `config/hospital.ts`.
- Some page copy still names Sanjeevani by design (camp venues, facility "Sanjeevani Pharma", doctor bios, awards). See [02-rebrand-checklist.md](02-rebrand-checklist.md) step 10.
- `frontend/src/pages/AdminDashboardPage.tsx` (not in `pages/admin/`) is an old unused page; the live dashboard is `pages/admin/AdminDashboardPage.tsx`.
- Admin pages are English only.
