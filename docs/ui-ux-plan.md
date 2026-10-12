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

## Needs a decision (logic, not just UI)
These still behave like a demo. I left the behaviour alone because it touches booking and login.

1. **Staff login fallback was removed.** Before, if the server didn't answer, *any* email containing "admin" with a 4+ character password got into the admin screens. Now the login shows an error instead. Confirm the backend `/auth/admin/login` is reachable in production.
2. **The booking OTP still accepts any 6 digits** when the server doesn't confirm (`handleVerifyOtp` in `BookAppointmentPage.tsx`). Once SMS is live, remove the fallback so only the real code works.
3. **Payment uses a fake signature** (`demo_verified_signature`) in `handleCompletePayment`. Wire up the real Razorpay Checkout before taking money.
4. **Token key mismatch:** the admin pages read `localStorage.getItem('token')`, but login saves `sanjeevani_admin_token`. Authenticated admin API calls probably go out without a token.

## Suggested next steps (in priority order)
1. **Booking flow, 5 steps → 3:** (1) doctor and time, (2) patient name and phone with the OTP on the same screen, (3) confirm (and pay, if needed). Show the doctor, date and fee in a sticky summary on every step.
2. **Real photos everywhere:** replace the Unsplash stock images (departments, equipment) with photos of the actual wards, OT, ICU and staff. This is the biggest single "not AI" signal.
3. **One department page template:** what we treat, who treats it (with photos), OPD days, a sample cost range or "covered under MJPJAY", and a book button.
4. **Doctor profile:** large photo, plain-language "Sees patients for…", weekly OPD timetable grid, languages spoken, and a book button pinned on mobile.
5. **Marathi first for Jalna:** consider Marathi as the default language, and check every page in Marathi. Several sections still have English-only text.
6. **Admin "Today" screen:** a queue list ordered by token, with big status buttons (Waiting → With doctor → Done), so reception can work it on a tablet.
7. **Accessibility:** labels on every form field, visible focus (added globally), colour contrast ≥ 4.5:1 and alt text on doctor photos.
8. **Performance:** lazy-load the map, compress hero images to WebP under 200 KB, and code-split the admin routes (the bundle is over 500 KB).
9. **Trust content:** NABH or other accreditation (if any), MJPJAY empanelment number, the registered name of the hospital, and a short "About us" with the founders' story.
