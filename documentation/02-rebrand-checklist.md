# Rebrand checklist: launching for a new hospital

Follow these steps in order. Collect the information first with [templates/new-hospital-intake.md](templates/new-hospital-intake.md).

Field-by-field details for every file are in [03-data-reference.md](03-data-reference.md).

> **Join key:** a doctor's `id` (for example `doc-goyal`) links the website doctor list, the doctor's photo file, the API booking roster (`worker/src/data/roster.ts`) and saved OPD timings. If the three do not match, the doctor has no photo or cannot be booked.

---

## 1. Hospital details (frontend): `frontend/src/config/hospital.ts`

**What to change:** every value in the `HOSPITAL` object: name (EN + MR), short name, `brand`, `kind`, tagline, city, state, pincode, `locality`, all `address` lines, all `phones`, `emails`, `opdHours`, `mapsUrl`, `mapEmbedUrl`, `foundedYear`, `empanelments`, `logo`, `website`.

**Example:**
```ts
name: 'Shanti Hospital',
nameMr: 'शांती हॉस्पिटल',
shortName: 'Shanti Hospital',
brand: 'Shanti',
phones: {
  emergency: { display: '+91 98220 11111', tel: '+919822011111', short: '98220 11111', shortMr: '९८२२० ११११११' },
  ...
  whatsapp: '919822011111',
},
```

Notes:
- `shortMr` must use Marathi digits (०१२३४५६७८९).
- `mapEmbedUrl`: Google Maps → search the hospital → Share → Embed a map → copy only the `src="…"` value.
- If the hospital has one email, set `emails.main` and `emails.footer` to the same value. If they differ, the admin Settings page shows a warning.
- Same for hours: if `opdHours.contactMorning` and `opdHours.morning.en` disagree, admin Settings shows a warning.

**Check:** `cd frontend && npx tsc --noEmit`. Open `/`, `/contact` and `/admin/settings` and read every number and line.

## 2. Hospital details (API): `worker/wrangler.toml` → `[vars]`

**What to change:** the `HOSPITAL_*` lines.

| Setting | Example |
| --- | --- |
| `HOSPITAL_TENANT_ID` | `hosp-shanti-pune` |
| `HOSPITAL_NAME` | `Shanti Hospital` |
| `HOSPITAL_SHORT_NAME` | `Shanti Hospital` |
| `HOSPITAL_SLUG` | `shanti-pune` |
| `HOSPITAL_ADDRESS` | `12, MG Road` |
| `HOSPITAL_CITY` / `HOSPITAL_STATE` / `HOSPITAL_PINCODE` | `Pune` / `Maharashtra` / `411001` |
| `HOSPITAL_HELPLINE` | `+91-98220-11111` |
| `HOSPITAL_EMAIL` | `info@shantihospital.in` |

Also set `ALLOWED_ORIGINS` (optional) and keep `BOOKING_OPEN_ALL_DOCTORS = "true"` only while testing.

If two hospitals will share one Cloudflare account, also give each its own Worker and database name. The names `sanjeevani-api` and `sanjeevani-db` appear in `worker/wrangler.toml`, `worker/package.json`, `worker/scripts/ensure-d1.sh` and both `.github/workflows/worker-*.yml` files; change them all together. One Cloudflare account per hospital is simpler and needs no renaming.

**Check:** `curl https://<api>/api/health` and `curl https://<api>/api/hospitals/profile` show the new name.

## 3. Doctors: `frontend/src/data/doctorsData.ts`

**What to change:** replace the `DOCTORS_DATA` list. One entry per doctor.

**Example:**
```ts
{
  id: 'doc-patil',
  name: 'Dr. Asha Patil', nameMr: 'डॉ. आशा पाटील',
  role: 'Consultant Paediatrician', roleMr: 'बालरोगतज्ज्ञ',
  degree: 'MBBS, MD (Paediatrics)',
  dept: 'Paediatrics', deptMr: 'बालरोग',
  specialty: 'Newborn care, childhood asthma', specialtyMr: 'नवजात शिशु काळजी, दमा',
  category: 'INHOUSE',
  fee: 400,
  image: '/images/doctors/doc-patil.webp',
  timings: 'Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
  timingsMr: 'सोम – शनि: सकाळी १० – दुपारी २ | संध्या. ५ – ८',
},
```

Rules: `id` is lowercase, starts with `doc-`, never changes once live (it is in URLs). `fee: 0` shows "Ask at reception". Keep `timings` in the exact format above so offline booking can read it.

**Check:** `/doctors` lists everyone; open each profile.

## 4. Doctor photos: `frontend/public/images/doctors/<id>.webp`

**What to change:** one photo per doctor, named exactly by the doctor id, for example `doc-patil.webp`. Square or portrait, at least 512 × 512 px, face near the top. A missing photo shows the doctor's initials, which is acceptable.

**Check:** `/doctors` shows photos, no broken images. Update `frontend/public/images/doctors/README.txt`.

## 5. Departments: `DEPARTMENTS` in `frontend/src/pages/DepartmentsPage.tsx`

**What to change:** the exported `DEPARTMENTS` list: `slug`, names, descriptions, `photo` (a key from `PHOTOS`), `doctorIds` (first one is the lead doctor; ids from `doctorsData.ts`), hours and "what we treat" lists in EN and MR.

**Check:** `/departments` and each `/departments/<slug>`; every doctor id resolves to a doctor.

Also update the subject list in the contact form (`pages/ContactPage.tsx`, `<select id="ct-dept">`) if the departments differ a lot.

## 6. Awards: `frontend/src/data/awardsData.ts`

**What to change:** replace `AWARDS_DATA` with the new hospital's real awards, or empty the list. Never invent awards.

**Check:** home page and any page that shows awards.

## 7. Hospital photos: `frontend/src/data/photos.ts` + `frontend/public/images/hospital/`

**What to change:** put the new photos in `public/images/hospital/` as `.webp`. Either reuse the same file names, or change the names in `PHOTOS`. Update the `GALLERY` captions (EN + MR). Keep the `PHOTOS` keys (they are used by pages); if the hospital has no photo for a key, point it to a similar photo.

**Check:** home, facilities and department pages; no broken images. Use real photos only.

## 8. Logo: `frontend/public/logo.png`

**What to change:** replace the file. Square PNG, transparent background, at least 256 × 256 px. It is the header logo, footer logo, slip logo and browser tab icon.

**Check:** header, footer, admin login, token slip PDF, browser tab.

## 9. Shared page text: `frontend/src/locales/en.json` and `mr.json`

**What to change:** the `hero` block (badge such as "Ambad Choufuli, Jalna · Since 2016", title, subtitle, stats like "21 beds"), `sections.*Sub` lines that name the hospital or district, `topbar` (currently unused but keep it accurate). `hero.callEmergency` already takes the phone from config (`{{phone}}`), do not type a number there.

**Check:** home page in both languages.

## 10. Page copy that names the hospital

Most sentences now take the name from config. These still contain hospital-specific copy and must be rewritten by hand:

| File | What |
| --- | --- |
| `pages/HomePage.tsx` | Department highlights, equipment, MJPJAY teaser, stats |
| `pages/FacilitiesPage.tsx` | Facility list (for example "Sanjeevani Pharma") |
| `pages/EventsPage.tsx` | Camp text that names the hospital (for example venue text) |
| `pages/MjpjayPage.tsx`, `pages/InsurancePage.tsx` | Covered treatments, insurers, steps |
| `pages/ContactPage.tsx` | Directions list (distances from station and bus stand) |
| `data/doctorsData.ts` | `about` text mentions the hospital |
| `data/awardsData.ts`, `data/photos.ts` | Award text, captions |
| `worker/src/routes/schemes.ts` | MJPJAY / insurance information the API returns (insurer and TPA lists, desk directions and timings) |

**Check:** `grep -rn "Sanjeevani\|संजीवनी\|Jalna\|जालना" frontend/src worker/src worker/wrangler.toml worker/scripts` should return only lines you have decided to keep.

## 11. API booking roster: `worker/src/data/roster.ts`

**What to change:**
- `ROSTER`: one entry per bookable doctor with the **same `id`, `name` and `fee`** as `doctorsData.ts`, plus a `department` label.
- `DEFAULT_SCHEDULES`: starting weekly timings per doctor id (`monToSat(...)` or `none()`). Times are 24-hour `"HH:mm"`. Admins can change them later in the admin panel; saved timings are stored in D1 by doctor id.

**Example:**
```ts
{ id: 'doc-patil', name: 'Dr. Asha Patil', department: 'Paediatrics', fee: 400 },
...
'doc-patil': { slotMinutes: 15, days: monToSat({ start: '10:00', end: '14:00' }, { start: '17:00', end: '20:00' }) },
```

**Check:** `curl "https://<api>/api/appointments/availability?doctorId=doc-patil&date=<YYYY-MM-DD>"` returns times on an OPD day.

## 12. Database and first admin (Cloudflare D1)

A new hospital starts with an empty D1 database; the deploy workflow creates it and its tables. There is no seed file and no default password.

**What to do:**
- Create the first admin with the data workflow (GitHub secrets `ADMIN_EMAIL`, `ADMIN_PASSWORD`; see [09-cloudflare.md](09-cloudflare.md#part-3-create-the-first-admin)).
- That workflow also creates the `hospitals` row if it is missing. It uses the defaults written in `worker/scripts/initial-admin.mjs` (Sanjeevani's name, tenant id, address, phone and email), because the workflow does not pass the `HOSPITAL_*` values. Change those defaults to the new hospital's values (and the same `HOSPITAL_TENANT_ID` as in `wrangler.toml`) before running it.
- Do **not** tick "Copy all data from Supabase" for a new hospital.
- Optionally change the development-only built-in accounts in `worker/src/routes/auth.ts` (`admin@sanjeevanihosp.in` / `Admin@123`). They never work on Cloudflare.

**Check:** log in at `/admin/login` with the new account. Save OPD timings for one doctor, reload the page, and check they are still there.

## 13. Page title and search text: `frontend/index.html`

**What to change:** `<title>`, `<meta name="description">`, `<meta name="keywords">`. Keep or change `<meta name="author">` (see step 15). Vite cannot read `config/hospital.ts` here, so edit by hand.

**Check:** browser tab title; view page source.

## 14. Secrets and hosting

Follow [09-cloudflare.md](09-cloudflare.md) with the new hospital's own accounts. Reference: [05-deployment-and-config.md](05-deployment-and-config.md).

- GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (the hospital's Cloudflare account), `JWT_SECRET` (new random value per hospital), `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
- Website: `apiBaseUrl` in `frontend/src/config/hospital.ts` (or `VITE_API_URL` on Netlify) = the new Worker address ending in `/api`.
- Use the hospital's own Razorpay and MSG91 accounts, so money and SMS costs go to them.
- Point the hospital's domain at Netlify. Optionally add `api.<domain>` to the Worker (09, Part 5).
- Before launch, switch off the testing switch in both places (09, Part 6).

**Check:** `https://<api>/api/health` returns `"status":"UP"`; a real booking on the live site with a real phone number.

## 15. Developer credit: `frontend/src/data/developer.ts`

This is the template author's credit shown in the footer and admin sidebar. Keep it if your licence with the author requires it; otherwise change it to your company. It is not hospital data, so it is not in `config/hospital.ts`.

---

## Launch checklist

- [ ] `config/hospital.ts` filled in; every phone tested by tapping it on a phone
- [ ] WhatsApp number receives a test message from the offline booking request
- [ ] Map link opens the right place; map embed shows the right place
- [ ] `worker/wrangler.toml` `HOSPITAL_*` values set; `/api/hospitals/profile` correct
- [ ] `doctorsData.ts` replaced; ids follow `doc-<name>`
- [ ] A photo for each doctor at `public/images/doctors/<id>.webp` (or initials accepted)
- [ ] `DEPARTMENTS` replaced; all `doctorIds` exist
- [ ] Awards are real or removed
- [ ] Hospital photos replaced; captions EN + MR
- [ ] `public/logo.png` replaced
- [ ] `locales/en.json` and `mr.json` hero and section text updated
- [ ] Page copy in step 10 reviewed; grep shows no old hospital name
- [ ] `worker/src/data/roster.ts` `ROSTER` and `DEFAULT_SCHEDULES` use the same ids, names and fees as `doctorsData.ts`
- [ ] `initial-admin.mjs` defaults updated; first admin created with the data workflow; `ADMIN_PASSWORD` secret deleted
- [ ] `index.html` title, description and keywords updated
- [ ] `JWT_SECRET` is a new random value
- [ ] MSG91 live: a real OTP arrives
- [ ] Razorpay live keys set; one real ₹1 test payment refunded (or "pay at counter" only)
- [ ] Worker deployed; `apiBaseUrl` (or `VITE_API_URL`) points at it; site rebuilt
- [ ] Testing switch off: `BOOKING_OPEN_ALL_DOCTORS = "false"` and `booking.openAllDoctors: false`; OPD timings set for every doctor
- [ ] Booked one appointment end to end; PDF slip shows new name, address, phone
- [ ] Every page checked in English and Marathi at 390 px wide and on desktop
- [ ] `npx tsc --noEmit` and `npx vite build` pass (frontend); `npx tsc --noEmit` passes in `worker/`
