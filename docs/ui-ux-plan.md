# UI / UX plan

Goal: the site should feel like it was made for Sanjeevani Hospital, not generated from a template. Patients are mostly local families in Jalna, often on a phone and often in a hurry. Staff use the admin screens every day.

Database models, API routes, field names and IDs are **not** changed by any item below. Everything here is presentation and wording.

## Done in this round

### Look and feel
- **Typography:** serif headings (Source Serif 4) and Inter for body text. Marathi uses Mukta automatically (`<html lang>` now follows the language toggle).
- **Colour:** warm off-white page (`#FAF8F4`), dark ink (`#1C2321`), the existing teal brand colour, and one red used only for emergency. Slate greys are replaced with warmer stone greys.
- **Removed template patterns:** sparkle icons, gradient banner cards, pill badges on every heading, an icon tile on every card, hover-zoom images, pulsing icons, glass blur.
- **Buttons:** 44 px minimum height (comfortable tap target), plain hover colour change, no glow.
- **Undefined classes fixed:** `hospital-teal`, `hospital-cyan`, `hospital-soft`, `shadow-xs` and `shadow-2xs` were used but never defined, so admin menu highlights didn't show. They're now defined.

### Public site
- **Header:** a slim dark strip with the emergency number, OPD hours and the language switch; a main bar with the logo, 7 links (active link underlined) and one "Book appointment" button. On phones there's a call icon, and the menu closes after you tap a link.
- **Home page:**
  - Hero: one sentence, two actions and the real building photo.
  - Plain facts row.
  - "How can we help?" as a simple list, with a separate emergency box.
  - Departments, doctors (with fee and timings), MJPJAY documents as a numbered list, equipment, awards, reviews and a map.
  - Reviews now load approved reviews from the database. The three written reviews are only a fallback, and the "Verified Patient" badge on them is removed.
- **Footer:** address, links, OPD hours, phone and email. "Admin Portal" is renamed "Staff login".
- **Mobile bottom bar:** "Call emergency" and "Book appointment", with safe-area padding. The floating desktop button is gone because the header already shows the number.
- **Copy:** marketing words removed ("world-class", "seamless", "cutting-edge", "holistic", "state-of-the-art", "Portal Sync"…). Sentences are short and written the way the reception desk would say them.

### Developer text removed from screens
| Screen | Before | After |
|---|---|---|
| Booking, step 1 | "Sandbox Demo Mode: Demo code is 123456", OTP field pre-filled | Plain SMS instructions, empty OTP field with `one-time-code` autofill |
| Staff login | Pre-filled email and password, "Sandbox Demo Access", "⚡ Quick 1-Click Login" | Plain email and password form |
| Admin top bar | "Hospital Administration & Slot Engine", "PostgreSQL Connected" | Current page name and today's date |
| Admin sidebar | `SUPER_ADMIN`, "Admin Console", "Doctor Faculty", "Shifts & Slot Rules" | "Super Admin", "Hospital office", "Doctors", "OPD timings" |
| Payments | "Razorpay Test Mode Active" | removed |
| Schedules | "The backend automatically generates bookable slots… Concurrency locks…" | "Patients can book any free time within these hours." |

## Booking, payment and login fixes (round 2)

### Booking flow (patient onboarding), rebuilt
The new flow has 4 steps: **Doctor → Date & time → Details & phone check → Confirm**, plus a "You're booked" page.
- A summary card shows the doctor, time and fee on every step.
- Patients can browse doctors and times *before* verifying their phone.
- The date strip shows the next 14 days, and times are grouped into morning, afternoon and evening. Booked times are greyed out.
- The OTP is entered on the details screen. Resend unlocks after 30 seconds, the number can be changed, and the phone autofills the code.
- The chosen time is held for 10 minutes, with a visible countdown.
- Payment: **pay now** (Razorpay: UPI, card, net banking) or **pay at the OPD counter**.
- The "You're booked" page has the token number, a "before you come" checklist, print, and "Add to calendar".
- Every failure shows a real message: no fake slots, no fake receipts. A doctor who isn't set up for online booking shows "call reception".

### Fixed
| Issue | Before | Now |
|---|---|---|
| OTP | The server always used `123456` and accepted it for any number; the page accepted any 6 digits | Random code sent by SMS (MSG91). Only that code works. `123456` is used only in local development and printed in the server log |
| Booking without OTP | `session/init` was public | Requires the token issued after OTP; the phone number is taken from the verified token |
| Payment | Fake order IDs; the server accepted `demo_verified_signature`; the browser sent the amount | Real Razorpay order; amount = doctor's fee from the server; only a genuine HMAC signature passes |
| Booking confirm | Page called a non-existent endpoint and showed a made-up receipt | Calls `confirm-slot`; the slot must be held by this patient and paid (or "pay at counter" chosen) |
| Staff token | Admin pages read `token`, login saved `sanjeevani_admin_token` | One `getAdminToken()` helper; expired login returns to sign-in |
| Admin appointments & payments | Hard-coded sample patients | Live list from the server, refreshes every 30 s; status changes are saved |
| Patient data exposure | `GET /appointments` and `GET /payments` were public | Staff login required |
| Built-in admin accounts | `admin@…` / `Admin@123` worked on the live server | Only in local development; production uses database accounts only |
| Committed keys | Razorpay test key and secret in `render.yaml`, `docker-compose.yml`, `.env.example` and the docs | Removed; set them in the hosting dashboard |

### To switch it on (hospital / developer)
1. **MSG91**: set `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` (a DLT-approved OTP template) on the backend. Until then, the live site asks patients to call reception instead of booking online.
2. **Razorpay**: set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (live keys when ready). Without them, only "pay at the hospital" is offered.
3. **Rotate the old Razorpay test secret.** It was public in the repo.
4. **Change the database admin password.** `prisma/seed.ts` creates `admin@sanjeevanihosp.in` with `Admin@123`, which was also printed on the old login page.
5. **Make sure `JWT_SECRET` is set** on the server. The code falls back to a fixed value if it's missing.

### Still to do (not changed this round)
- **Appointments, booking sessions and payments are kept in server memory**, not in PostgreSQL, so a server restart loses them. Move them to Prisma tables next. This needs new tables, which is why I didn't do it without asking.
- **Online booking covers 6 doctors** (the list in `appointments.service.ts`). Other doctors show "call reception" until they're added there or moved to the database.
- **Send the token number by SMS** after booking (needs a second MSG91 template).
- **Razorpay webhook** for payments that succeed after the patient closes the page.

## Suggested next steps (in priority order)
1. **Real photos everywhere:** replace the Unsplash stock images (departments, equipment) with photos of the actual wards, OT, ICU and staff. This is the biggest single "not AI" signal.
2. **One department page template:** what we treat, who treats it (with photos), OPD days, a sample cost range or "covered under MJPJAY", and a book button.
3. **Doctor profile:** large photo, plain-language "Sees patients for…", weekly OPD timetable grid, languages spoken, and a book button pinned on mobile.
4. **Marathi first for Jalna:** consider Marathi as the default language, and check every page in Marathi. Several sections still have English-only text.
5. **Admin "Today" screen:** a queue list ordered by token, with big status buttons (Waiting → With doctor → Done), so reception can work it on a tablet.
6. **Accessibility:** labels on every form field, visible focus (added globally), colour contrast ≥ 4.5:1 and alt text on doctor photos.
7. **Performance:** lazy-load the map, compress hero images to WebP under 200 KB, and code-split the admin routes (the bundle is over 500 KB).
8. **Trust content:** NABH or other accreditation (if any), MJPJAY empanelment number, the registered name of the hospital, and a short "About us" with the founders' story.
