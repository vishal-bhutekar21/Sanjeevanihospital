# Product overview

## Features

### Public website

- **Home page:** what the hospital offers, an emergency call button, the main departments, doctors, MJPJAY information, photos and a map.
- **Departments** (`/departments`, `/departments/:slug`): each department with what it treats, its doctors and its hours.
- **Doctors** (`/doctors`, `/doctors/:doctorId`): every doctor with degree, department, fee and OPD hours. Each profile has a **weekly OPD timetable** (`OpdWeek` component) loaded from the server. If the server cannot be reached, the profile shows the published hours text and a "call reception" line.
- **Facilities** (`/facilities`): ICU, operation theatre, lab, pharmacy and so on, with real photos.
- **MJPJAY** (`/mjpjay`) and **Insurance** (`/insurance`): who is eligible, documents needed, steps, a desk phone number. The MJPJAY page has a request form that registers a claim with the server.
- **Camps and reviews** (`/events`): upcoming health camps and patient reviews. Patients can submit a review; it appears after an admin approves it.
- **Contact** (`/contact`): all phone numbers, email, opening hours, address, directions and an enquiry form.
- **Bilingual:** every page works in English and Marathi. The language switch is in the header and is remembered in the browser.
- **Phone bar:** on phones, a bar at the bottom of the screen offers "Call emergency" and "Book appointment".

### Online booking (`/book`), 4 steps

1. **Doctor:** pick a doctor (or arrive with `?doctor=<id>` from a profile).
2. **Time:** pick a day from the next few days shown as **day columns**, or open the **calendar** (`DateCalendar`) for later dates. Free times are loaded from the server. A time is held for 10 minutes once chosen.
3. **Details:** patient name, age, gender, town, mobile number, reason. The patient confirms the mobile number with a **6-digit OTP** sent by SMS (MSG91).
4. **Confirm:** pay online with **Razorpay**, or choose **pay at the counter**. The patient gets a token number, a printable page, a Google Calendar link and an **A5 PDF token slip** (`TokenSlip`).

**Offline request mode:** if the booking server cannot be reached, the page still works. It works out times from the doctor's published hours text, collects the same details without OTP, and sends the request to the hospital's WhatsApp number (or the patient can call). Reception then confirms by phone. Nothing is saved on the server in this mode.

**Fees:** a doctor fee of `0` means the hospital has not published it. The site shows "Ask at reception" and online payment is not offered for that doctor.

### Admin panel (`/admin`, staff login)

| Section | What staff can do |
| --- | --- |
| Dashboard | Today's queue, consultation fees taken today, and appointments by doctor. |
| Appointments | List with a **date filter**; change status (pending, confirmed, completed, cancelled, no-show). |
| OPD timings | Set each doctor's weekly sessions and slot length. Saved to the `doctor_schedules` table in the database; the booking page uses them straight away. |
| Doctors | List of doctors as the booking system knows them. |
| Departments | List of departments. |
| Payments | Online payments with status. |
| Scheme claims | MJPJAY / insurance requests from the website, with status changes. |
| Reviews & camps | Approve or reject reviews; add camps and change their status. |
| Settings | Read-only list of the hospital details the site shows (from `config/hospital.ts`), and the signed-in account. |

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 6, i18next (EN/MR), lucide-react icons, html2canvas + jsPDF (token slip) |
| Backend | NestJS 10, TypeScript, Prisma 5, Passport JWT, bcryptjs, Helmet, Throttler, class-validator |
| Database | PostgreSQL (Supabase in production) |
| Payments | Razorpay (orders + signature check) |
| SMS / OTP | MSG91 |
| Hosting | Frontend on Netlify, backend on Render (Docker files also included) |

## Folder map

```
.
├── AGENTS.md / CLAUDE.md          Short rules for AI agents (point to documentation/AI_AGENT_GUIDE.md)
├── README.md                      Original project README
├── netlify.toml                   Netlify build settings (base = frontend)
├── docker-compose.yml             Local Postgres + backend + frontend in Docker
├── documentation/                 This documentation
├── docs/                          Older research notes and plans
├── frontend/
│   ├── index.html                 Page title, description, keywords, fonts (edit for a new hospital)
│   ├── public/
│   │   ├── logo.png               Hospital logo (also the browser tab icon)
│   │   └── images/
│   │       ├── doctors/<id>.webp  Doctor photos, named by doctor id
│   │       └── hospital/*.webp    Hospital photos (building, ICU, OT…)
│   └── src/
│       ├── config/hospital.ts     ONE place for hospital name, phones, emails, address, hours, map
│       ├── App.tsx                Routes
│       ├── main.tsx               App start
│       ├── index.css              Tailwind layers, buttons, cards (design tokens)
│       ├── components/
│       │   ├── Header.tsx / Footer.tsx
│       │   ├── FloatingLanguageSwitcher.tsx  Bottom call/book bar on phones
│       │   ├── ui.tsx             PageIntro, SectionTitle, Photo, DoctorPhoto
│       │   ├── DateCalendar.tsx   Month calendar for booking
│       │   ├── OpdWeek.tsx        Weekly OPD table on doctor profiles
│       │   └── TokenSlip.tsx      A5 token slip + PDF download
│       ├── data/
│       │   ├── doctorsData.ts     All doctors (id, names, fee, timings, about…)
│       │   ├── awardsData.ts      Awards and milestones
│       │   ├── photos.ts          Hospital photo paths and gallery captions
│       │   └── developer.ts       Website developer credit (footer, admin sidebar)
│       ├── lib/
│       │   ├── api.ts             API base URL (VITE_API_URL) and fetch helpers
│       │   ├── opdHours.ts        Parses timings text for offline booking; WhatsApp number
│       │   ├── fee.ts             Fee label ("Ask at reception" for 0)
│       │   └── i18n.ts            i18next setup
│       ├── locales/en.json, mr.json  Shared UI text (nav, hero text…)
│       ├── layouts/               PublicLayout, AdminLayout
│       ├── context/AdminAuthContext.tsx  Admin login state
│       └── pages/                 One file per page; pages/admin/* for the admin panel
│                                  (DepartmentsPage.tsx also exports the DEPARTMENTS list)
└── backend/
    ├── .env.example               All environment variables
    ├── render.yaml                Render blueprint
    ├── prisma/schema.prisma       Database schema (do not change without agreement)
    ├── prisma/seed.ts             Seeds hospital, admin, doctors, settings
    └── src/
        ├── config/hospital.config.ts  Hospital id, name, address, helpline (env overridable)
        ├── main.ts                Server start, /api prefix, CORS, Helmet
        ├── app.module.ts          Modules, env loading, rate limiting
        ├── appointments/          Availability, slot holds, booking, OPD timings
        │   └── schedules.ts       ROSTER (doctors the server knows) + DEFAULT_SCHEDULES
        ├── auth/                  OTP (MSG91), patient session token, admin login (JWT)
        ├── payments/              Razorpay order + verify
        ├── schemes/               MJPJAY / insurance info and claims
        ├── reviews-events/        Reviews and health camps
        ├── doctors/, departments/, hospitals/, audit/
        └── common/                Guards (JWT, roles, patient session), filters, interceptors
```
