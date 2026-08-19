# Architecture Specification: Multi-Tier Platform Overview

**System:** Sanjeevani Multispeciality Hospital Platform  
**Version:** 1.0.0  
**Stack:** React 18/19 (Vite) + NestJS + Prisma ORM + PostgreSQL (Supabase) + Razorpay + MSG91

---

## 1. High-Level Architecture Blueprint

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          PATIENT CLIENT (SPA)                         │
│   - React + Vite + TypeScript                                          │
│   - Tailwind CSS + Lucide Icons + Framer Motion                        │
│   - Bilingual Localization Engine (English / Marathi)                  │
│   - Ephemeral OTP Verified Booking Flow                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (REST API)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        HOSPITAL ADMIN DASHBOARD                        │
│   - React + TanStack Query + shadcn/ui                                 │
│   - Supabase Auth JWT Authentication + Hospital Isolation              │
│   - Real-Time Shift & Slot Generation Rule Engine                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Bearer Token / HTTPS
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          NESTJS BACKEND API                            │
│  ├── Common Layer (Guards, Interceptors, Global Validation Pipes)      │
│  ├── Auth Module (MSG91 OTP + Supabase JWT Auth)                       │
│  ├── Hospital & Departments Module                                     │
│  ├── Doctors & Schedule Generator Module                               │
│  ├── Concurrency-Safe Slot Reservation & Hold Engine                   │
│  ├── Razorpay Order & Cryptographic Signature Verifier                 │
│  ├── Digital Receipt & PDF Engine                                      │
│  └── Audit Logging Service                                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Prisma ORM (Connection Pool)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE POSTGRESQL DATABASE                     │
│  ├── Multi-Tenant Schema (Linked by hospital_id)                       │
│  ├── Strict Foreign Keys & Compound Unique Constraints                 │
│  ├── Row-Level Locks (FOR UPDATE) & SERIALIZABLE Transactions          │
│  └── Soft Delete Support (is_active / deleted_at)                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cross-Cutting Concerns

1. **Multi-Tenancy Readiness**: Every domain entity (`Department`, `Doctor`, `DoctorSchedule`, `Appointment`, `Payment`) carries a foreign key `hospital_id`. The database and business logic are fully partitioned to support multi-hospital expansion without schema redesign.
2. **Security & Secrets Isolation**: Zero database or third-party secret exposure to the frontend client. Frontend only receives public keys (`VITE_RAZORPAY_KEY_ID`, `VITE_API_BASE_URL`).
3. **Data Protection & Rate Limiting**: NestJS Throttler module protects OTP endpoints against SMS abuse and brute-force verification.
4. **Audit Trail**: Every administrative write operation (schedule changes, appointment status changes, fee modifications) is logged to `audit_logs` table with timestamp, admin ID, and JSON payload diff.
