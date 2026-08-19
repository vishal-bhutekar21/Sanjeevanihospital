# 🏥 SANJEEVANI MULTISPECIALITY HOSPITAL
### Enterprise Digital Healthcare Platform, Appointment Engine & Hospital ERP
**Location:** Rishi Park, Plot No. 17, Ambad Road / Ambad Choufuli, Jalna, Maharashtra, India.

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
7. **Production & Cloud Ready**: Full Docker multi-stage containerization, Nginx SPA reverse-proxy configuration, Vercel SPA routing rules, and Supabase / Render deployment blueprints.

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
* **Containerization & Hosting**: Docker, Docker Compose, Nginx Alpine, Vercel, Render / Railway.

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
   RAZORPAY_KEY_ID="rzp_test_TRlp6qdfVyCHyQ"
   RAZORPAY_KEY_SECRET="Mg9ra16kSOpZfdlr2DqYTCks"
   RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

   # frontend/.env
   VITE_RAZORPAY_KEY_ID="rzp_test_TRlp6qdfVyCHyQ"
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

### Hosting Frontend on Vercel (Recommended)
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository and set the **Root Directory** to `frontend`.
4. Configure Build Settings:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add Environment Variables:
   * `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
   * `VITE_RAZORPAY_KEY_ID`: `rzp_test_TRlp6qdfVyCHyQ`
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

## 🔑 Pre-Configured Test Credentials

| Portal | URL / Path | Credentials |
|---|---|---|
| **Public Website** | `/` | Open Access |
| **Online OPD Booking** | `/book` | Any 10-digit mobile (OTP: `123456`) |
| **Admin Portal** | `/admin/login` | `admin@sanjeevanihosp.in` / `Admin@123` |
| **Super Admin** | `/admin/login` | `superadmin@sanjeevanihosp.in` / `SuperAdmin@123` |

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
Engineered under Senior Product Architect standards.
