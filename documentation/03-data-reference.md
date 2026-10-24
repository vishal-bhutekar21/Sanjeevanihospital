# Data reference

Field-by-field reference for every file you edit to set up a hospital. "Required" means the site breaks or shows something wrong without it.

General rules:
- Every text a patient sees has an English field and a Marathi field (`…Mr`). Fill both.
- Use real information only. If something is not known (a fee, a photo), leave it empty or `0` and the site shows a sensible fallback.
- Doctor `id` is the join key across `doctorsData.ts`, `public/images/doctors/<id>.webp`, `DepartmentsPage.tsx` `doctorIds`, the API `ROSTER` / `DEFAULT_SCHEDULES` (`worker/src/data/roster.ts`) and saved timings in D1 `doctor_schedules`.

---

## 1. `frontend/src/config/hospital.ts` → `HOSPITAL`

| Field | Type | Req. | Example | Used in |
| --- | --- | --- | --- | --- |
| `name` / `nameMr` | string | yes | `Sanjeevani Multispeciality Hospital` / `संजीवनी मल्टिस्पेशालिटी हॉस्पिटल` | Footer, contact page, slip letterhead, calendar location |
| `shortName` / `shortNameMr` | string | yes | `Sanjeevani Hospital` | Header, admin login, page intros, Razorpay checkout, WhatsApp message |
| `brand` / `brandMr` | string | yes | `Sanjeevani` | Admin sidebar, PDF file name (`Sanjeevani-OPD-<code>.pdf`), "OPD paper" lines |
| `kind` | `{en, mr}` | yes | `Multispeciality` | Header subtitle "Multispeciality · Jalna" |
| `tagline` | string | no | `Healing body, mind & spirit` | Footer under the name |
| `city` / `cityMr` | string | yes | `Jalna` / `जालना` | Header, footer copyright, many sentences |
| `state`, `pincode` | string | yes | `Maharashtra`, `431203` | Reference; also inside the address strings |
| `locality` | `{en, mr}` | yes | `Ambad Choufuli, Jalna` | Header strip, contact intro, calendar location |
| `address.line1` / `line2` | string | yes | `Plot No. 17, Rishi Park, Ambad Choufuli` / `Jalna, Maharashtra 431203` | Contact page address block |
| `address.en` / `mr` | string | yes | full one-line address | Footer, admin settings |
| `address.short` / `shortMr` | string | yes | `Plot 17, Rishi Park, Ambad Choufuli, Jalna` | Home photo caption, booking confirmation "Where" |
| `address.letterhead` | string | yes | full address | PDF token slip under the name |
| `address.homeLines` | `[string, string]` | yes | two lines | Home page "Find us" card |
| `phones.emergency` | `{display, tel, short, shortMr}` | yes | `+91 75073 42222`, `+917507342222`, `75073 42222`, `७५०७३ ४२२२२` | Header, footer, phone bar, emergency buttons, slip |
| `phones.reception` | same | yes | same shape | "Call reception" links, booking page, doctor/department pages, camps |
| `phones.whatsapp` | string, digits only | yes | `917507342222` | Offline booking request (`https://wa.me/<digits>`) |
| `phones.ambulance`, `mjpjay`, `tpa`, `admin` | `{display, tel}` | yes | `+91 88305 18080`, `+918830518080` | Contact page phone list, admin settings |
| `emails.main` | string | yes | `sanjeevanihospjalna@gmail.com` | Contact page |
| `emails.footer` | string | yes | usually the same as `main` | Footer |
| `opdHours.en` / `mr` | string | yes | `OPD: 9 am – 1 pm, 5 – 8 pm` | Header strip |
| `opdHours.short` / `shortMr` | string | yes | `OPD 9 am–1 pm, 5–8 pm` | Slip footer |
| `opdHours.days` / `morning` / `evening` | `{en, mr}` | yes | `Mon – Sat`, `9 am – 1 pm`, `5 pm – 8 pm` | Footer (three lines) |
| `opdHours.contactMorning` / `contactEvening` | string | yes | `9:00 am – 3:00 pm` | Contact page hours table |
| `opdHours.emergency` | `{en, mr}` | yes | `24 hours, every day` | Contact page hours table |
| `mapsUrl` | URL | yes | `https://maps.google.com/?q=…` | "Get directions" links, phone bar on `/book` |
| `mapEmbedUrl` | URL | yes | `https://www.google.com/maps/embed?pb=…` | Map on home and contact pages |
| `foundedYear` | number | no | `2016` | Reference (hero badge text is in `locales`) |
| `empanelments` | `{code, en, mr}[]` | no | `{ code: 'MJPJAY', … }` | Footer bottom line uses the first `code` |
| `logo` | path | yes | `/logo.png` | Header, footer, admin, slip |
| `website` | domain | yes | `sanjeevanihosp.in` | Admin sidebar placeholder email |
| `apiBaseUrl` | URL ending in `/api` | yes (live) | `https://sanjeevani-api.<your-subdomain>.workers.dev/api` | API address used by the live site when `VITE_API_URL` is not set. On localhost the site uses `http://localhost:8787/api`. |
| `booking.openAllDoctors` | boolean | yes | `true` while testing | Testing switch: every doctor bookable every day between `booking.openFrom` and `booking.openTo`. Set `false` before going live, together with `BOOKING_OPEN_ALL_DOCTORS` in `worker/wrangler.toml`. |
| `booking.openFrom` / `openTo` | `"HH:mm"` | yes | `08:00` / `22:00` | Hours used while the testing switch is on. |

Rules:
- `tel` = `+` country code + number, no spaces. `display` is what people read.
- `shortMr` uses Marathi digits.
- Admin Settings shows a warning when `emails.main ≠ emails.footer`, or when the contact-page morning hours differ from the header/footer morning hours.

## 2. `worker/wrangler.toml` → `[vars]`

Read by the API through `hospital(env)` in `worker/src/lib/config.ts`. Change the file and commit to `main`; the deploy workflow applies it.

| Field | Setting | Sanjeevani value |
| --- | --- | --- |
| `id` | `HOSPITAL_TENANT_ID` | `hosp-sanjeevani-jalna` |
| `name` | `HOSPITAL_NAME` | `Sanjeevani Multispeciality Hospital` |
| `shortName` | `HOSPITAL_SHORT_NAME` | `Sanjeevani Hospital` |
| `slug` | `HOSPITAL_SLUG` | `sanjeevani-jalna` |
| `addressLine` | `HOSPITAL_ADDRESS` | `Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli` |
| `city` / `state` / `pincode` | `HOSPITAL_CITY` / `HOSPITAL_STATE` / `HOSPITAL_PINCODE` | `Jalna` / `Maharashtra` / `431203` |
| `fullAddress` | (computed) | `<addressLine>, <city> – <pincode>` |
| `helpline` | `HOSPITAL_HELPLINE` | `+91-75073-42222` |
| `email` | `HOSPITAL_EMAIL` | `admin@sanjeevanihosp.in` |

Used by: `/api/health`, booking confirmation (`hospitalAddress`, `emergencyHelpline`), admin login reply (`hospitalName`), payment order (`hospitalName`), the "call reception" messages, and the `hospital_id` on records the API saves.

Other settings in the same block: `ENVIRONMENT`, `ALLOWED_ORIGINS`, `BOOKING_OPEN_ALL_DOCTORS`, `REQUIRE_OTP` (see [05-deployment-and-config.md](05-deployment-and-config.md#api-settings)).

## 3. `frontend/src/data/doctorsData.ts` → `DOCTORS_DATA: DoctorItem[]`

| Field | Type | Req. | Example | Notes |
| --- | --- | --- | --- | --- |
| `id` | string | yes | `doc-goyal` | Lowercase, `doc-` prefix. Must match the photo file name and the API `ROSTER`. Used in URLs (`/doctors/doc-goyal`, `/book?doctorId=doc-goyal`); never change once live. |
| `name` / `nameMr` | string | yes | `Dr. Nishant Goyal` | Must match `ROSTER.name` and the database doctor name (see section 7). |
| `role` / `roleMr` | string | yes | `Consultant Orthopaedic Surgeon` | |
| `degree` | string | yes | `MBBS, DNB, D. Ortho` | |
| `dept` / `deptMr` | string | yes | `Orthopedics & Joint Replacement` | Free text shown on cards. |
| `specialty` / `specialtyMr` | string | yes | `Knee replacement, trauma` | |
| `category` | `'DIRECTOR' \| 'INHOUSE' \| 'VISITING'` | yes | `INHOUSE` | Groups on `/doctors`. |
| `fee` | number (₹) | yes | `500` | `0` = not published: shown as "Ask at reception", no online payment. Must match `ROSTER.fee`. |
| `image` | path | yes | `/images/doctors/doc-goyal.webp` | Missing file → initials. |
| `timings` | string | yes | `Mon – Sat: 11:00 AM – 03:00 PM \| 06:00 PM – 08:00 PM` | See format rule below. |
| `timingsMr` | string | yes | `सोम – शनि: सकाळी ११ – दुपारी ३ \| संध्या. ६ – ८` | Display only. |
| `experienceYears` | number | no | `15` | Shown on the profile. |
| `about` / `aboutMr` | string | no | paragraph | Profile text. |
| `procedures` | string[] | no | `['Knee replacement']` | Profile list (English). |

**Timings format** (parsed by `lib/opdHours.ts` for offline booking):

```
<Day3> – <Day3>: <hh:mm AM> – <hh:mm PM> [| <hh:mm PM> – <hh:mm PM>]
Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM
```

- Day range: three-letter English day names (`Mon`, `Tue` … `Sun`), hyphen or en dash.
- Sessions separated by `|`. Times are 12-hour with `AM`/`PM`.
- Anything else (for example `24x7 On-Call & Emergency ICU Coverage`, `By appointment`) is fine to show, but offline booking then tells the patient to call instead of offering times.

## 4. `DEPARTMENTS` in `frontend/src/pages/DepartmentsPage.tsx`

| Field | Type | Req. | Example | Notes |
| --- | --- | --- | --- | --- |
| `slug` | string | yes | `orthopedics` | URL `/departments/<slug>`. Do not change once live. |
| `nameEn` / `nameMr` | string | yes | `Orthopaedics and joint replacement` | |
| `descEn` / `descMr` | string | yes | one or two sentences | |
| `photo` | string | yes | `PHOTOS.operationTheatre` | A value from `data/photos.ts`. |
| `doctorIds` | string[] | yes | `['doc-goyal']` | First id is the lead doctor. Each must exist in `DOCTORS_DATA`. |
| `hoursEn` / `hoursMr` | string | yes | `Mon – Sat, 11 am – 3 pm and 6 – 8 pm` | Display only. |
| `treatsEn` / `treatsMr` | string[] | yes | `['Knee and hip replacement']` | Same length and order in both languages. |

## 5. `frontend/src/data/awardsData.ts` → `AWARDS_DATA: AwardItem[]`

| Field | Type | Req. | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Unique, e.g. `award-1`. |
| `title` / `titleMr`, `subtitle` / `subtitleMr` | string | yes | |
| `image` | path | no | `''` = no image. |
| `year` | string | no | `'2023'` |
| `category` | `'AWARD' \| 'ACHIEVEMENT'` | yes | |
| `description` / `descriptionMr` | string | yes | Only real awards. An empty list is fine. |

## 6. `frontend/src/data/photos.ts`

- `PHOTOS`: fixed keys (`building`, `banner`, `reception`, `staffTeam`, `casualty`, `cardiacUnit`, `cathLabTeam`, `cardiacSurgery`, `operationTheatre`, `otTeam`, `surgery`, `nicu`, `picu`, `pathologyLab`, `pharmacy`, `billing`) → `/images/hospital/<file>.webp`. Pages refer to these keys; keep them, change the file names.
- `GALLERY`: `{ key, en, mr }` captions for the gallery, `key` must be a `PHOTOS` key.
- Files: `.webp`, about 1600 px wide, real photos of the hospital.

**Doctor photos:** `frontend/public/images/doctors/<doctor id>.webp`, square or portrait, ≥ 512 × 512 px.

**Logo:** `frontend/public/logo.png`, square PNG, transparent background.

## 7. `worker/src/data/roster.ts`

### `ROSTER: RosterDoctor[]`: doctors the API knows

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Same as `DOCTORS_DATA.id`. |
| `name` | string | Same as `DOCTORS_DATA.name`. Also used once, by the copy from Supabase, to match old database doctors to website ids (case and "Dr." are ignored; one name may start with the other). |
| `department` | string | Shown in admin and on the slip. |
| `fee` | number | Same as `DOCTORS_DATA.fee`. The API uses this fee for payment, never the browser's. `0` = pay at counter, no online payment. |

### `DEFAULT_SCHEDULES: Record<doctorId, WeeklySchedule>`

| Field | Type | Rules |
| --- | --- | --- |
| `slotMinutes` | number | One of 10, 15, 20, 30, 45, 60. |
| `days` | `OpdSession[][]` | Exactly 7 arrays, index 0 = Sunday … 6 = Saturday. Empty array = no OPD that day. Up to 3 sessions per day. |
| `OpdSession.start` / `end` | `"HH:mm"` 24-hour | Each session at least one slot long; sessions must not overlap. |

Helpers: `monToSat(session, session…)` (no Sunday) and `none()` (no online OPD: patients are asked to call).

These are only the starting values. Once an admin saves timings in **OPD timings**, they are stored in the D1 table `doctor_schedules` under the doctor's `id` and override the defaults.

## 8. `frontend/src/locales/en.json` and `mr.json`

Shared UI text, nested by area: `nav`, `topbar`, `hero`, `quickActions`, `sections`, `equipment`, `common`. Keys must exist in both files.

- `hero.badge`, `hero.title`, `hero.subtitle`, `hero.stat*`: hospital-specific; rewrite for each hospital.
- `hero.callEmergency`: `"Emergency: {{phone}}"`, the number comes from config. Keep `{{phone}}`.
- `topbar.*`: not used by the current pages; keep accurate or remove both languages together.

## 9. `frontend/index.html`

`<title>`, `<meta name="description">`, `<meta name="keywords">`, `<meta name="author">`, favicon (`/logo.png`). Plain HTML, edit by hand.

## 10. Database: `worker/migrations/`

The D1 tables are defined in numbered SQL files (`0001_init.sql`, …). They are the same for every hospital; do not change them per hospital. A new hospital's database starts empty: the first admin (and the `hospitals` row) is created with the data workflow, using `worker/scripts/initial-admin.mjs` ([09-cloudflare.md](09-cloudflare.md#part-3-create-the-first-admin)). There is no seed file and no default admin password.

## 11. Data that is not edited per hospital

- `data/developer.ts`: template author credit (see checklist step 15).
- Local storage keys `sanjeevani_lang`, `sanjeevani_admin_token`, `sanjeevani_admin_user`: internal names, invisible to users. Changing them signs everyone out; no need to rename.
