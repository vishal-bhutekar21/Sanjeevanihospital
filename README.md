# 🏥 SANJEEVANI MULTISPECIALITY HOSPITAL
### Enterprise Digital Healthcare Platform, Appointment Engine & Hospital ERP
**Location:** Rishi Park, Plot No. 17, Ambad Road / Ambad Choufuli, Jalna, Maharashtra, India.

---

## Documentation

Current docs live in [`documentation/`](documentation/README.md):

- [Product overview](documentation/01-product-overview.md): features, tech stack, folder map
- [Rebrand checklist](documentation/02-rebrand-checklist.md): launch this site for a new hospital
- [Data reference](documentation/03-data-reference.md): every config and data field
- [Architecture](documentation/04-architecture.md): booking flow, auth, where data is stored
- [Deployment and config](documentation/05-deployment-and-config.md): env vars, Netlify, Render, MSG91, Razorpay, common problems
- [Design system](documentation/06-design-system.md) · [Roadmap](documentation/07-roadmap.md) · [AI agent guide](documentation/AI_AGENT_GUIDE.md)

Hospital details (name, phones, address, hours) are set in `frontend/src/config/hospital.ts` and `backend/src/config/hospital.config.ts`.

---

## 🌟 Executive Overview & Architectural Highlights

The **Sanjeevani Multispeciality Hospital Platform** is a multi-tier, production-grade digital healthcare operating system engineered to replace legacy static hospital landing pages with a high-throughput, secure, bilingual (English & Marathi), and HIPAA/NABH-aligned healthcare platform.

### Key Architectural Capabilities Delivered:
1. **Multi-Tenant Isolation & Security**: Hospital-level RBAC isolation guards, AES-256 encrypted fields, Helmet security headers, rate limiting (Throttler), and cryptographic HMAC signature validation.
2. **Deterministic Doctor Shift & Slot Engine**: Real-time generation of discrete 15-minute consultation slots respecting doctor break intervals, leave overrides, and daily max patient caps.
3. **Atomic Concurrency Protection**: High-throughput distributed mutex hold engine providing 10-minute temporary locks on appointment slots to mathematically eliminate double-booking race conditions.
4. **End-to-End Razorpay & MSG91 Integration**: Instant digital consultations with Razorpay order creation, cryptographic SHA-256 verification, and SMS token dispatches.
5. **Government Healthcare Schemes**: Integrated workflows for **MJPJAY** (Mahatma Jyotirao Phule Jan Arogya Yojana), **Ayushman Bharat** (PM-JAY), and **Cashless TPA Mediclaim** pre-authorizations.
6. **Community Events & Review Moderation**: Moderation engine for patient reviews and public listings for free health camps, pediatric vaccination drives, and BMD screenings.
7. **Production & Cloud Ready**: Full Docker multi-stage containerization, Nginx SPA reverse-proxy configuration, Netlify & Vercel SPA routing rules, and Supabase / Render deployment blueprints.

---

## 🏗️ System Architecture & Tech Stack

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                 PATIENTS & ADMINISTRATORS               │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │          FRONTEND SPA (Vite + React 18 + Tailwind)      │
                     │  - Bilingual i18n (English / Marathi)                   │
                     │  - 5-Step Atomic Appointment Booking Flow               │
                     │  - Admin ERP Console (Doctors, Shifts, Slots, Claims)   │
                     │  - MJPJAY, Ayushman & Insurance Portals                 │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ HTTPS / REST API
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │           BACKEND API (NestJS 10 + TypeScript)          │
                     │  - JWT Authentication & RBAC Guard Pipeline             │
                     │  - Shift & Slot Engine (Atomic 10-Min Mutex Hold)       │
                     │  - Payment Verification (Razorpay HMAC-SHA256)          │
                     │  - Audit Logging & Moderation Engine                    │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
  ┌───────────────────────────────────────┐               ┌───────────────────────────────────────┐
  │         DATABASE & STORAGE            │               │           EXTERNAL GATEWAYS           │
  │  - Supabase / PostgreSQL Database     │               │  - Razorpay (Payments)                │
  │  - Prisma ORM 5.x Schema Engine       │               │  - MSG91 (SMS / OTP Gateway)          │
  │  - In-Memory Fallback Sandbox Engine  │               │  - Firebase (FCM Push Notifications)  │
  └───────────────────────────────────────┘               └───────────────────────────────────────┘
```

### Component Stack
* **Frontend**: React 18, Vite 5, TailwindCSS 3, Lucide Icons, TanStack React Query, React Router DOM 6, i18next.
* **Backend**: NestJS 10, TypeScript, Prisma ORM 5, Passport JWT, BcryptJS, Helmet, Throttler, Class-Validator.
* **Database**: PostgreSQL 16 / Supabase PostgreSQL with PgBouncer connection pooling.
* **Payment Gateway**: Razorpay REST API & Webhook HMAC Verification.
* **SMS Gateway**: MSG91 SMS & OTP Service (Sandbox & Live).
* **Containerization & Hosting**: Docker, Docker Compose, Nginx Alpine, Netlify, Vercel, Render / Railway.

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
* **Node.js**: v18.x or v20.x LTS
* **npm**: v9.x or v10.x
* **Git** installed

### 1. Clone the Repository
```bash
git clone https://github.com/vishal-bhutekar21/sanjeevani-multispeciality-hospital.git
cd sanjeevani-multispeciality-hospital
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run build
npm run start:prod
# API runs on http://localhost:3000/api
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Web app runs on http://localhost:5173/
```

---

## 🐳 Docker Containerization Deployment

Deploy the entire stack (Postgres Database + Backend API + Frontend Nginx Server) with a single command:

```bash
docker-compose up -d --build
```

* **Frontend Web App**: `http://localhost:80`
* **Backend REST API**: `http://localhost:3000/api`
* **Health Check**: `http://localhost:3000/api/health`
* **PostgreSQL Database**: `localhost:5432`

---

## 🔗 Step-by-Step Integrations Guide

### 1. Supabase PostgreSQL Integration
1. Log in to [Supabase](https://supabase.com) and create a new project (e.g. `sanjeevani-hospital`).
2. Go to **Project Settings ➔ Database ➔ Connection String**.
3. Select **URI ➔ Transaction Mode (Port 6543 with PgBouncer)** for application runtime, and **Session Mode (Port 5432)** for migrations.
4. Copy the connection string to `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```
5. Apply the Prisma schema and seed initial data:
   ```bash
   cd backend
   npx prisma db push
   npm run seed
   ```

### 2. Razorpay Payment Gateway Integration
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings ➔ API Keys** and generate **Key ID** & **Key Secret**.
3. Set your keys in `backend/.env` and `frontend/.env`:
   ```env
   # backend/.env
   RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXX"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

   # frontend/.env
   VITE_RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXX"
   ```
4. Set up the webhook URL in Razorpay Dashboard to `https://your-api-domain.com/api/payments/webhook` with `payment.captured` event.

### 3. MSG91 SMS & OTP Gateway Integration
1. Register on [MSG91](https://msg91.com) and configure a DLT-approved Sender ID (`SANJEV`).
2. Create an OTP template and copy the Auth Key and Template ID.
3. Configure `backend/.env`:
   ```env
   MSG91_AUTH_KEY="your_msg91_auth_key"
   MSG91_SENDER_ID="SANJEV"
   MSG91_TEMPLATE_ID="your_dlt_template_id"
   ```

### 4. Firebase (FCM Push Notifications & Storage) Integration
1. Create a project on [Firebase Console](https://console.firebase.google.com).
2. Go to **Project Settings ➔ Service Accounts ➔ Generate New Private Key**.
3. Place the credentials in `backend/.env`:
   ```env
   FIREBASE_PROJECT_ID="sanjeevani-hospital-jalna"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk@sanjeevani-hospital-jalna.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```
4. In the frontend, initialize Firebase Cloud Messaging (FCM) using the Web App config in `frontend/.env`.

---

## 🌐 Production Cloud Hosting Walkthrough

### Hosting Frontend on Netlify (Recommended)
1. Push your repository to GitHub / GitLab.
2. Log in to [Netlify](https://app.netlify.com/) and click **Add new site ➔ Import an existing project**.
3. Select your repository and configure the build settings (or let `netlify.toml` detect them):
   * **Base directory**: `frontend`
   * **Build command**: `npm run build`
   * **Publish directory**: `dist` (or `frontend/dist`)
4. Add Environment Variables in Netlify (**Site configuration ➔ Environment variables**):
   * `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
   * `VITE_RAZORPAY_KEY_ID`: `rzp_test_XXXXXXXXXXXXXX`
5. Click **Deploy**. Netlify uses `netlify.toml` and `_redirects` to handle client-side SPA routing and cache headers automatically.
6. 📖 **For full instructions, custom domains, CLI commands & troubleshooting, see the [Netlify Deployment Guide](docs/deployment/netlify-deployment-guide.md).**

### Hosting Frontend on Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and set the **Root Directory** to `frontend`.
4. Configure Build Settings:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add Environment Variables:
   * `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
   * `VITE_RAZORPAY_KEY_ID`: `rzp_test_XXXXXXXXXXXXXX`
6. Click **Deploy**. Vercel uses `frontend/vercel.json` to handle client-side SPA routing automatically.

### Hosting Backend on Render / Railway
1. Log in to [Render](https://render.com) and select **New ➔ Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `backend`.
3. Set Build & Start Commands:
   * **Environment**: Node
   * **Build Command**: `npm install && npx prisma generate && npm run build`
   * **Start Command**: `npm run start:prod`
4. Add Environment Variables from `backend/.env.example` (`DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
5. Click **Create Web Service**.

---

## 🔑 Test Accounts

Use these to try the site. **They are for testing only.** Change or remove them before real patients and staff use the site.

### Test admin (staff login: `/admin/login`)

| Role | Email | Password | Where it works |
|---|---|---|---|
| Hospital admin | `admin@sanjeevanihosp.in` | `Admin@123` | Local development (built-in account). Also on the live site **if the database was seeded** with `npm run prisma:seed`, which creates the same account |
| Super admin | `superadmin@sanjeevanihosp.in` | `SuperAdmin@123` | Local development only (built-in, not in the seed) |

> ⚠️ When `NODE_ENV=production`, built-in accounts are switched off and only database accounts can sign in. If you seeded the live database, **change the `Admin@123` password right away**: this README is public.

### Test patient (online booking: `/book`)

| What | Value |
|---|---|
| Mobile number | Any valid 10-digit Indian mobile starting with 6–9, e.g. `9876543210` |
| OTP code | `123456`, **only when the backend runs in development** (`NODE_ENV` not `production`). It's also printed in the backend log |
| On the live site | A real 6-digit code is sent by SMS (needs `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`) |
| Limit | 3 codes per number every 10 minutes. Use another number if you hit it while testing |
| Doctors and times | **Testing switch is on:** every doctor can be booked every day, 8 am – 10 pm. Turn it off before going live: `BOOKING_OPEN_ALL_DOCTORS=false` on the backend and `booking.openAllDoctors: false` in `frontend/src/config/hospital.ts`. Patients then see each doctor's timings from Admin → OPD timings |
| Slip | After booking, **Download slip (PDF)** gives a text PDF with token number and QR code |

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

### If the backend is down
The booking page still works. Times come from each doctor's published OPD hours, and the last step sends the request to reception on WhatsApp (+91 75073 42222) or by phone. Reception confirms by calling the patient.

---

## 🧪 Comprehensive Test Suite Verification

Run the automated end-to-end integration test suite covering authentication, slot reservation, concurrency locks, payment signatures, government schemes, and review moderation:

```bash
cd backend
# Concurrency & Booking Engine Verification
node test_booking_concurrency.js

# Government Schemes (MJPJAY/Insurance) & Moderation Verification
node test_phase8_9.js
```

---

## 📄 License & Authorship
Developed for **Sanjeevani Multispeciality Hospital, Jalna, Maharashtra**.

**Developer:** Vishal Bhutekar · [vishalbhutekar.me](https://vishalbhutekar.me) · [vishalbhutekar33772@gmail.com](mailto:vishalbhutekar33772@gmail.com)
