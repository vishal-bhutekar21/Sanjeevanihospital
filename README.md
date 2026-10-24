# Sanjeevani Multispeciality Hospital: website, online OPD booking and admin panel

**Location:** Rishi Park, Plot No. 17, Ambad Road / Ambad Choufuli, Jalna, Maharashtra, India.

A bilingual (English and Marathi) hospital website with online OPD booking, patient login and a staff admin panel. It is built so the same code can be set up for another hospital by changing config and data files.

---

## Documentation

Current docs live in [`documentation/`](documentation/README.md):

- [Product overview](documentation/01-product-overview.md): features, tech stack, folder map
- [Rebrand checklist](documentation/02-rebrand-checklist.md): launch this site for a new hospital
- [Data reference](documentation/03-data-reference.md): every config and data field
- [Architecture](documentation/04-architecture.md): booking flow, auth, where data is stored
- [Deployment and config](documentation/05-deployment-and-config.md): settings, secrets, Netlify, MSG91, Razorpay, common problems
- [Cloudflare setup](documentation/09-cloudflare.md): put the API online step by step, copy the old data, create the first admin
- [Design system](documentation/06-design-system.md) · [Roadmap](documentation/07-roadmap.md) · [AI agent guide](documentation/AI_AGENT_GUIDE.md)

Hospital details (name, phones, address, hours) are set in `frontend/src/config/hospital.ts` (website) and `worker/wrangler.toml` `[vars]` (API).

---

## What it does

- **Public website:** departments, doctors with weekly OPD timings, facilities, MJPJAY and insurance pages, health camps and patient reviews, contact page. Every page in English and Marathi.
- **Online booking:** pick a doctor, a day and a time; confirm the mobile number with an SMS code (MSG91); pay online (Razorpay) or at the counter; get a token number and an A5 PDF slip. A chosen time is held for 10 minutes so two patients cannot book it. If the API cannot be reached, the page still lets the patient send the request to reception on WhatsApp.
- **Patient login:** patients see bills, medicines (with reminders), lab results, follow-ups and their online bookings shared by the hospital.
- **Admin panel:** appointments, OPD timings per doctor, doctors, departments, payments, MJPJAY / insurance claims, reviews and camps, patient records, settings.

## Tech stack

```
Browser
   │
   ▼
Website: React 18 + Vite + Tailwind (frontend/), hosted on Netlify
   │  HTTPS, JSON, /api
   ▼
API: Cloudflare Worker, TypeScript + Hono (worker/), deployed by GitHub Actions
   │
   ├──► Cloudflare D1 (SQLite) database "sanjeevani-db"
   ├──► MSG91 (OTP SMS)
   └──► Razorpay (payments, HMAC signature check)
```

| Part | Technology |
| --- | --- |
| Website | React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 6, i18next, lucide-react, html2canvas + jsPDF |
| API | Cloudflare Workers, TypeScript, Hono; JWT (HS256); PBKDF2 passwords (Web Crypto) |
| Database | Cloudflare D1 (SQLite); schema in `worker/migrations/` |
| Scheduled jobs | Worker Cron Trigger, daily 03:30 UTC (09:00 IST): clears expired OTP codes, holds and sessions |
| Payments / SMS | Razorpay, MSG91 |
| Hosting | Website on Netlify; API on Cloudflare Workers |

## Project structure

```
.
├── frontend/                 Website (React). Hospital details: src/config/hospital.ts
├── worker/                   API (Cloudflare Worker + D1)
│   ├── wrangler.toml         Worker name, database binding, cron, public settings ([vars])
│   ├── migrations/           Database tables (numbered SQL files)
│   ├── scripts/              D1 setup, one-time copy from Supabase, first admin
│   └── src/                  index.ts, routes/*.ts, lib/*.ts, data/roster.ts (doctor ids, fees, default timings)
├── .github/workflows/        worker-deploy.yml (deploy API), worker-data.yml (copy data / create admin)
├── documentation/            Current documentation
├── docs/                     Older research notes and plans
└── netlify.toml              Netlify build settings for the website
```

---

## Run locally

Prerequisites: Node.js 20 and npm, Git.

```bash
git clone https://github.com/vishal-bhutekar21/sanjeevani-multispeciality-hospital.git
cd sanjeevani-multispeciality-hospital

# 1. API (local D1 database on your computer)
cd worker
cp .dev.vars.example .dev.vars
npm install
npm run db:migrate:local
npm run dev
# API runs on http://localhost:8787/api  (check: http://localhost:8787/api/health)

# 2. Website (another terminal)
cd frontend
npm install
npx vite --port 5173
# Website runs on http://localhost:5173 and calls http://localhost:8787/api automatically
```

Checks before committing:

```bash
cd frontend && npx tsc --noEmit && npx vite build
cd worker && npx tsc --noEmit
```

---

## Deploy

- **API (Cloudflare):** follow [documentation/09-cloudflare.md](documentation/09-cloudflare.md). In short: add the GitHub secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `JWT_SECRET` (optional: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`). Every push to `main` that changes `worker/` runs **Worker: deploy API to Cloudflare**, which creates the D1 database if needed, applies migrations, deploys and prints the workers.dev address. The manual workflow **Worker: copy data / create admin** copies the old Supabase data (one time) and creates the first admin.
- **Website (Netlify):** import the repository in Netlify; `netlify.toml` sets base `frontend`, build `npm run build`, publish `dist`. Point the site at the API with `apiBaseUrl` in `frontend/src/config/hospital.ts` (for example `https://sanjeevani-api.<your-subdomain>.workers.dev/api`), or `VITE_API_URL` on Netlify. See [docs/deployment/netlify-deployment-guide.md](docs/deployment/netlify-deployment-guide.md).

---

## Test accounts

Use these to try the site. **They are for testing only.**

### Test admin (staff login: `/admin/login`)

| Role | Email | Password | Where it works |
|---|---|---|---|
| Hospital admin | `admin@sanjeevanihosp.in` | `Admin@123` | Local development only (`ENVIRONMENT=development`, built-in account) |
| Super admin | `superadmin@sanjeevanihosp.in` | `SuperAdmin@123` | Local development only (built-in account) |

On Cloudflare (production) the built-in accounts are switched off. Staff sign in with accounts copied from Supabase (same passwords as before) or with an admin created by the data workflow from the `ADMIN_EMAIL` / `ADMIN_PASSWORD` GitHub secrets.

### Test patient (online booking: `/book`)

| What | Value |
|---|---|
| Mobile number | Any valid 10-digit Indian mobile starting with 6–9, e.g. `9876543210` |
| OTP code | `123456`, **only in local development** without MSG91 |
| On the live site | A real 6-digit code is sent by SMS (needs the `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` secrets). Without MSG91, the booking goes through without a code and is marked "mobile not verified"; reception calls to confirm. `REQUIRE_OTP = "true"` in `worker/wrangler.toml` turns that off |
| Limit | 3 codes per number every 10 minutes. Use another number if you hit it while testing |
| Doctors and times | **Testing switch is on:** every doctor can be booked every day, 8 am – 10 pm. Turn it off before going live: `BOOKING_OPEN_ALL_DOCTORS = "false"` in `worker/wrangler.toml` and `booking.openAllDoctors: false` in `frontend/src/config/hospital.ts`. Patients then see each doctor's timings from Admin → OPD timings |
| Slip | After booking, **Download slip (PDF)** gives a PDF with token number and QR code |

### Test patient login (`/patient`, link in the footer)

1. Staff: Admin → **Patient records** → type the patient's mobile → **Open** → **Add bill** / **Add medicine**.
2. Patient: footer → **Patient login** → same mobile → code `123456` (development) or the SMS code (live).
3. The patient sees bills (with PDF download), medicines with reminders 30 days before pack expiry and in the last 3 days of a course, and their online bookings.

Patient login needs real SMS codes on the live site (MSG91). Without them it stays closed, so nobody can open another person's records.

### Test payment (only when Razorpay **test** keys are set)

| Method | Value |
|---|---|
| Card | `4111 1111 1111 1111`, any future expiry date, any CVV |
| UPI | `success@razorpay` |

Without Razorpay keys, or for a doctor whose fee isn't set, booking offers **Pay at the hospital** only.

### If the API cannot be reached
The booking page still works. Times come from each doctor's published OPD hours, and the last step sends the request to reception on WhatsApp (+91 75073 42222) or by phone. Reception confirms by calling the patient.

---

## License and authorship
Developed for **Sanjeevani Multispeciality Hospital, Jalna, Maharashtra**.

**Developer:** Vishal Bhutekar · [vishalbhutekar.me](https://vishalbhutekar.me) · [vishalbhutekar33772@gmail.com](mailto:vishalbhutekar33772@gmail.com)
