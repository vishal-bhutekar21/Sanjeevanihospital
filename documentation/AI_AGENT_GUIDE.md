# Guide for AI coding agents

Read this before changing code in this repository.

## What this project is

A bilingual (English + Marathi) hospital website with online OPD booking and a staff admin panel. It runs live for Sanjeevani Multispeciality Hospital, Jalna, and is also a **template**: the same code is set up for other hospitals by changing config and data files (see [02-rebrand-checklist.md](02-rebrand-checklist.md)). Real patients use it, so correctness and plain language matter more than features.

- Frontend: React 18 + TypeScript + Vite + Tailwind, in `frontend/`.
- Backend: NestJS + Prisma (PostgreSQL), in `backend/`.

## Golden rules

1. **Never change API field names, endpoints or the database schema (`backend/prisma/schema.prisma`) without asking.** The frontend, the live database and the booking flow depend on them.
2. **Keep English and Marathi together.** Every visible string needs both. If you cannot write good Marathi, add your best version and say so in your summary.
3. **Use the hospital config; never hard-code hospital details.** Name, phones, emails, address, hours, map, logo come from `frontend/src/config/hospital.ts` (frontend) and `backend/src/config/hospital.config.ts` (backend).
4. **Doctor ids are the join key** across `frontend/src/data/doctorsData.ts`, `frontend/public/images/doctors/<id>.webp`, `DEPARTMENTS[].doctorIds` and backend `ROSTER` / `DEFAULT_SCHEDULES` in `backend/src/appointments/schedules.ts`. Change all of them together, never rename an id that is live.
5. **No fake data and no fake buttons.** No invented stats, reviews, awards, doctors or fees. No "Save" that does not save. No chips/badges/pills, no gradients, no uppercase micro-labels (see [06-design-system.md](06-design-system.md)).
6. **Verify before you finish:** `npx tsc --noEmit` and `npx vite build` in `frontend/`, `npx tsc --noEmit -p tsconfig.json` in `backend/`, and look at the changed pages in a browser at **390 px** and desktop width, in both languages.

Also: do not commit secrets; do not kill servers you did not start; do not git commit or push unless asked.

## Where things live

| Thing | Location |
| --- | --- |
| Hospital name, phones, emails, address, hours, map, logo | `frontend/src/config/hospital.ts` |
| Backend hospital id / name / address / helpline | `backend/src/config/hospital.config.ts` (env `HOSPITAL_*`) |
| Doctors (website) | `frontend/src/data/doctorsData.ts` |
| Doctors (booking server), default OPD timings | `backend/src/appointments/schedules.ts` |
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
| API base URL | `frontend/src/lib/api.ts` (`VITE_API_URL`) |
| Booking API | `backend/src/appointments/` |
| OTP, admin login | `backend/src/auth/` |
| Razorpay | `backend/src/payments/` |
| Page title / meta | `frontend/index.html` |
| Env variables | `backend/.env.example`, `frontend/.env.example` |

## Recipes

### Add a doctor

1. `frontend/src/data/doctorsData.ts`: add an entry with a new `id` like `doc-surname`, both languages, `fee` (0 if unknown), `timings` in the format `Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM`.
2. Photo: `frontend/public/images/doctors/doc-surname.webp` (optional; initials otherwise). Set `image: '/images/doctors/doc-surname.webp'`.
3. `backend/src/appointments/schedules.ts`: add to `ROSTER` with the **same id, name and fee**, and add a `DEFAULT_SCHEDULES` entry (`monToSat(...)` or `none()`).
4. If the doctor belongs to a department, add the id to that department's `doctorIds`.
5. For timings to be saved from admin, the database needs a `doctors` row with the same name (add to `backend/prisma/seed.ts`).
6. Check `/doctors`, `/doctors/doc-surname`, `/book?doctorId=doc-surname`.

### Change a doctor's default OPD hours

Edit `DEFAULT_SCHEDULES` in `backend/src/appointments/schedules.ts` (24-hour `"HH:mm"`, index 0 = Sunday) **and** the `timings` / `timingsMr` text in `doctorsData.ts` so the offline fallback and profile text match. Note: if an admin has already saved timings for that doctor, the database values win; change them in admin → OPD timings instead.

### Change hospital-wide OPD hours

`opdHours` in `frontend/src/config/hospital.ts` (header, footer, contact page, slip). Keep `morning` and `contactMorning` consistent or admin Settings shows a warning.

### Add a department

Add an object to `DEPARTMENTS` in `frontend/src/pages/DepartmentsPage.tsx` with a new `slug`, both languages, a `PHOTOS` key, `doctorIds` from `doctorsData.ts`. It appears on `/departments` and at `/departments/<slug>`. Consider the contact form subject list in `ContactPage.tsx`.

### Change phone numbers, email, address

Only `frontend/src/config/hospital.ts`. Backend messages: set `HOSPITAL_HELPLINE` etc. (or the defaults in `backend/src/config/hospital.config.ts`). Then grep to confirm no old number remains:
```bash
grep -rn "75073\|७५०७३" frontend/src backend/src
```

### Add a public page

1. Create `frontend/src/pages/NewPage.tsx`; start with `<PageIntro title=… intro=… />`, use `SectionTitle`, the `WRAP` width class, `isMr` for text.
2. Add a `<Route>` under the public layout in `frontend/src/App.tsx`.
3. Add a link in `Header.tsx` `navLinks` (via `locales` `nav.*`) and/or `Footer.tsx` `links`, both languages.
4. Use `HOSPITAL.*` for any hospital detail.

### Add an admin section

1. Create `frontend/src/pages/admin/AdminThingPage.tsx`; fetch with `apiFetch` / `getAuthHeaders` from `lib/api.ts`.
2. Add a route under `/admin` in `App.tsx` and a nav item in `AdminLayout.tsx`.
3. Backend: new endpoints go in a module with `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(...)`. Do not add database tables without asking.
4. Admin pages are English only today; keep them in plain English.

## Verification commands

```bash
# Types and build (must pass)
cd /home/user/Sanjeevanihospital/frontend && npx tsc --noEmit && npx vite build
cd /home/user/Sanjeevanihospital/backend && npx tsc --noEmit -p tsconfig.json

# Are servers already running? (do not kill ones you did not start)
lsof -ti:3000   # backend
lsof -ti:5173   # frontend

# Start backend in development (no database needed; OTP is 123456)
cd /home/user/Sanjeevanihospital/backend && npm run build && \
  NODE_ENV=development PORT=3000 JWT_SECRET=test DATABASE_URL="postgresql://x:y@127.0.0.1:1/z" node dist/main.js

# Start frontend
cd /home/user/Sanjeevanihospital/frontend && npx vite --port 5173

# Quick API checks
curl -s localhost:3000/api/health
curl -s "localhost:3000/api/appointments/availability?doctorId=doc-goyal&date=$(date -d tomorrow +%F)"
```

Then open http://localhost:5173 at 390 px and 1280 px wide, switch to मराठी, and click through the pages you changed. For booking changes, book one appointment end to end (OTP `123456` in development) and download the PDF slip.

## Known gaps

- Appointments, booking sessions, payments, claims, reviews and camps are in **server memory**; a restart loses them. Only OPD timings (`doctor_schedules`) and admin accounts are in the database.
- Database doctors are matched to `ROSTER` by **name**, not id.
- Rate limiting is configured but no global `ThrottlerGuard` is registered. CORS allows any origin. `JWT_SECRET` has a code fallback.
- Contact page enquiry form does not send anywhere (shows a thank-you only).
- The current site has two emails (contact vs footer) and two morning OPD end times (3 pm on contact, 1 pm elsewhere); the hospital has not confirmed which is right. Both are kept in `config/hospital.ts`.
- Some page copy still names Sanjeevani by design (camp venues, facility "Sanjeevani Pharma", doctor bios, awards, backend sample reviews/camps). See [02-rebrand-checklist.md](02-rebrand-checklist.md) step 10.
- `frontend/src/pages/AdminDashboardPage.tsx` (not in `pages/admin/`) is an old unused page; the live dashboard is `pages/admin/AdminDashboardPage.tsx`.
- Admin pages are English only.
