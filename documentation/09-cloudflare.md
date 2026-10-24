# Cloudflare setup: the hospital API on Workers + D1

## Live now (set up on 24 Oct 2026)

| What | Value |
|---|---|
| API | https://sanjeevani-api.vishalbhutekar33772.workers.dev/api (health check: `/api/health`) |
| Worker name | `sanjeevani-api` |
| D1 database | `sanjeevani-db` (id in `worker/wrangler.toml`) |
| Daily clean-up | 09:00 IST (cron `30 3 * * *`) |
| Website setting | `apiBaseUrl` in `frontend/src/config/hospital.ts` already points at the API |
| Secrets set on the Worker | `JWT_SECRET` (random). Add `MSG91_*` and `RAZORPAY_*` when the accounts are ready |
| Staff login | `admin@sanjeevanihosp.in`, with a strong password given privately to the owner (not in this repository) |
| Still to do | Copy the old data from Supabase (step 6 below), add the GitHub secrets so future merges deploy by themselves (step 4) |


This page is for the hospital owner or whoever looks after the website. It explains, step by step, how to put the booking API online on Cloudflare, copy the old data across, create the first admin, and connect the website. You do not need to install anything on your computer for the live setup: everything runs from GitHub and the Cloudflare website.

## What runs where

| Part | Where it runs | Folder |
| --- | --- | --- |
| Website (pages patients see, admin panel) | Netlify | `frontend/` |
| API (booking, OTP, admin login, payments, patient records) | Cloudflare Workers, Worker name `sanjeevani-api` | `worker/` |
| Database | Cloudflare D1 (SQLite), database name `sanjeevani-db` | `worker/migrations/` (table definitions) |
| Deploys | GitHub Actions | `.github/workflows/worker-deploy.yml`, `.github/workflows/worker-data.yml` |

The API answers under `/api`, with the same paths and replies as before (for example `/api/health`, `/api/appointments/availability`, `/api/auth/send-otp`, `/api/patient-portal/me`). The website does not need any change apart from the API address.

Once a day at 03:30 UTC (09:00 IST) the Worker tidies the database: it deletes expired OTP codes, frees time holds that ran out and removes old unfinished booking sessions. Booked appointments are never touched.

---

## Part 1: one-time setup

### Step 1. Create a Cloudflare account

1. Go to the Cloudflare website and sign up with the hospital's email address.
2. Verify the email address. The free plan is enough to start (see [Costs](#costs)).

### Step 2. Find your Cloudflare Account ID

1. In the Cloudflare dashboard, click **Workers & Pages** in the left menu.
2. On the right side of that page, find **Account ID** and click to copy it.
3. Keep it in a note for Step 5.

If Cloudflare asks you to choose a **workers.dev subdomain** the first time you open Workers & Pages, pick a short name (for example the hospital's name). Your API address will be `https://sanjeevani-api.<your-subdomain>.workers.dev`.

### Step 3. Create a Cloudflare API token

GitHub uses this token to deploy the API and create the database.

1. In the Cloudflare dashboard, click your profile icon (top right) → **My Profile** → **API Tokens**.
2. Click **Create Token**.
3. Next to **Edit Cloudflare Workers**, click **Use template**.
4. Under **Permissions**, click **+ Add more** and add: **Account** → **D1** → **Edit**.
5. Under **Account Resources**, choose your account. Under **Zone Resources**, choose **All zones** (or the hospital's domain if it is on Cloudflare).
6. Click **Continue to summary** → **Create Token**.
7. Copy the token now. Cloudflare shows it only once.

### Step 4. Make a JWT secret

The API uses this secret to sign login tokens for staff and patients. It must be at least 32 random characters and must never be shared.

- On a Mac or Linux computer, open Terminal and run `openssl rand -hex 32`. Copy the line it prints.
- Or ask your developer to make one for you.

Use a different secret for every hospital.

### Step 5. Add the secrets to GitHub

1. Open the repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** for each row below. The name must be typed exactly as shown.

| Secret name | Needed? | What to put in it |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | **yes** | The token from Step 3 |
| `CLOUDFLARE_ACCOUNT_ID` | **yes** | The Account ID from Step 2 |
| `JWT_SECRET` | **yes** | The secret from Step 4 |
| `RAZORPAY_KEY_ID` | optional | Razorpay key id. Without it, patients pay at the counter only |
| `RAZORPAY_KEY_SECRET` | optional | Razorpay key secret (goes with the key id) |
| `MSG91_AUTH_KEY` | optional | MSG91 auth key, for SMS codes |
| `MSG91_TEMPLATE_ID` | optional | MSG91 DLT-approved OTP template id |
| `SUPABASE_DATABASE_URL` | one time only | Only for copying the old data (Part 2). Delete it afterwards |
| `ADMIN_EMAIL` | one time only | Only for creating the first admin (Part 3) |
| `ADMIN_PASSWORD` | one time only | Only for creating the first admin (Part 3). At least 10 characters |

Without MSG91, online booking still works on the live site, but the patient's mobile number is not checked: the booking is marked "mobile not verified" and reception calls to confirm (at most 5 such bookings per visitor per day). Patient login (`/patient`) stays closed until MSG91 is set up. See `REQUIRE_OTP` in [Settings in wrangler.toml](#settings-in-wranglertoml) to turn online booking off until SMS works.

### Step 6. First deploy

The deploy runs by itself every time a change to `worker/` reaches the `main` branch. For the first time, start it by hand:

1. On GitHub, click **Actions**.
2. In the left list, click **Worker: deploy API to Cloudflare**.
3. Click **Run workflow** → keep branch `main` → **Run workflow**.
4. Wait for the run to finish (a few minutes). It goes through these steps:
   - checks the Cloudflare secrets are there (and notes if `JWT_SECRET` is not a GitHub secret);
   - checks the API code (typecheck);
   - finds the D1 database `sanjeevani-db`, or creates it on the first run;
   - applies the database tables (migrations);
   - deploys the Worker;
   - copies your GitHub secrets onto the Worker;
   - calls `/api/health` to check the API answers.
5. Open the finished run. The **Summary** shows "API deployed", the health check address and the exact value to put in the website settings, for example:

```
https://sanjeevani-api.<your-subdomain>.workers.dev/api
```

Open the health check address in a browser. You should see `"status":"UP"`.

The database is empty after the first deploy. Do Part 2 (if the hospital used the old server) and Part 3 next.

---

## Part 2: copy the data from Supabase (one time)

Only needed if the hospital already used the old server with a Supabase database. It copies the hospital row, admin accounts (with their passwords), departments, doctors, saved OPD timings, settings and patient records, reviews, camps, audit log and any appointments stored there.

1. In Supabase, open the project → **Connect** (top of the page) → copy the **Direct connection** string. It looks like `postgresql://postgres:[YOUR-PASSWORD]@db.<project>.supabase.co:5432/postgres`. Replace `[YOUR-PASSWORD]` with the database password.
2. On GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Name `SUPABASE_DATABASE_URL`, value: the string from step 1.
3. Click **Actions** → **Worker: copy data / create admin** → **Run workflow**.
4. Tick **Copy all data from Supabase into D1**. Leave the other box empty unless you also want Part 3 now. Click **Run workflow**.
5. When it finishes, open the run. The **Summary** lists how many rows were copied per table, and any doctors whose names did not match a doctor on the website (their OPD timings were not copied; set them again in Admin → OPD timings).
6. **Delete the `SUPABASE_DATABASE_URL` secret** from GitHub (Settings → Secrets and variables → Actions → the secret → Remove). It holds the old database password.

Notes:
- Run the copy **before** the hospital starts using the new API. Running it again later is possible, but rows that exist in both places are overwritten with the Supabase version.
- Short-lived booking data (unfinished booking sessions and time holds) is not copied.
- Admin accounts keep their old passwords. If the old database still has the test account `admin@sanjeevanihosp.in` with `Admin@123`, that account is copied too: change its password or have your developer remove it before going live.
- If the run fails with a network error (for example `ENETUNREACH` or a timeout), Supabase's direct connection may not be reachable from GitHub. In Supabase → **Connect**, copy the **Session pooler** string instead (also port 5432), put it in the same secret and run again.

---

## Part 3: create the first admin

Skip this if you copied the admin accounts from Supabase in Part 2: those accounts keep their passwords.

1. Add two GitHub secrets: `ADMIN_EMAIL` (the admin's email) and `ADMIN_PASSWORD` (at least 10 characters; use a password manager).
2. Click **Actions** → **Worker: copy data / create admin** → **Run workflow**.
3. Tick **Create the first admin account** → **Run workflow**.
4. When it finishes, sign in at `/admin/login` on the website with that email and password.
5. Delete the `ADMIN_PASSWORD` secret from GitHub afterwards.

If an account with that email already exists, the workflow leaves it unchanged (it does not reset the password). More staff accounts can be added from the admin panel by an admin.

---

## Part 4: point the website at the API

The website (on Netlify) needs the API address from Step 6. Use **one** of these:

- **Option A (recommended):** in `frontend/src/config/hospital.ts`, set `apiBaseUrl` to the address, for example `apiBaseUrl: 'https://sanjeevani-api.<your-subdomain>.workers.dev/api'`. Commit the change to `main`; Netlify rebuilds the site.
- **Option B:** in Netlify → the site → **Site configuration** → **Environment variables** → add `VITE_API_URL` with the same address. Then **Deploys** → **Trigger deploy** → **Clear cache and deploy site**. `VITE_API_URL` wins over `apiBaseUrl` when both are set.

The address must end with `/api`. Until the website points at the API, the booking page uses its offline mode (the patient sends the request to reception on WhatsApp).

**Check:** open the website → **Book appointment** → choose a doctor and a day. Times should load. Then sign in at `/admin/login`.

---

## Part 5 (optional): custom domain for the API

You can use an address such as `https://api.sanjeevanihosp.in` instead of the workers.dev one. This needs the hospital's domain to use Cloudflare for its DNS.

1. Cloudflare dashboard → **Workers & Pages** → click **sanjeevani-api**.
2. **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
3. Type `api.sanjeevanihosp.in` (or `api.<your-domain>`) → **Add domain**. Cloudflare creates the DNS record and the HTTPS certificate.
4. After a few minutes, open `https://api.sanjeevanihosp.in/api/health`.
5. Change `apiBaseUrl` (or `VITE_API_URL`) to `https://api.sanjeevanihosp.in/api` and redeploy the website.

If the domain's DNS is somewhere else (GoDaddy, Hostinger…), keep using the workers.dev address, or move the domain's DNS to Cloudflare first.

---

## Part 6: before going live, switch off the testing switch

While testing, every doctor can be booked every day from 8 am to 10 pm. Before real patients use the site, switch it off in **both** places:

1. `worker/wrangler.toml`: change `BOOKING_OPEN_ALL_DOCTORS = "true"` to `BOOKING_OPEN_ALL_DOCTORS = "false"`.
2. `frontend/src/config/hospital.ts`: change `openAllDoctors: true` to `openAllDoctors: false` (inside `booking`).
3. Commit both changes to `main` (you can edit files on GitHub with the pencil icon). The Worker redeploys by itself and Netlify rebuilds the site.

Patients then see each doctor's own timings from Admin → **OPD timings**. Set those timings first, or patients will find no free times.

Also before going live:
- Set up MSG91 (`MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`) so mobile numbers are checked and patient login works.
- Set Razorpay live keys if the hospital wants online payment.
- After adding or changing a GitHub secret, run **Worker: deploy API to Cloudflare** again by hand (Actions → Run workflow) so the Worker gets the new value.

---

## Settings in wrangler.toml

Public settings live in `worker/wrangler.toml` under `[vars]`. Change them there and commit to `main`; the next deploy applies them. Do not change them in the Cloudflare dashboard: the next deploy overwrites dashboard changes.

| Setting | Meaning |
| --- | --- |
| `ENVIRONMENT` | `production` on Cloudflare. Local development uses `development` (from `.dev.vars`). |
| `ALLOWED_ORIGINS` | Websites allowed to call the API: `*` (any) or a comma-separated list such as `https://<your-domain>,https://www.<your-domain>`. |
| `BOOKING_OPEN_ALL_DOCTORS` | Testing switch (Part 6). `"false"` before going live. |
| `REQUIRE_OTP` | `"true"` = patients must verify by SMS; without MSG91, online booking is refused and patients are asked to call. `"false"` = without MSG91, patients can book and reception confirms by phone. |
| `HOSPITAL_TENANT_ID`, `HOSPITAL_NAME`, `HOSPITAL_SHORT_NAME`, `HOSPITAL_SLUG` | Hospital id and names used in API replies. |
| `HOSPITAL_ADDRESS`, `HOSPITAL_CITY`, `HOSPITAL_STATE`, `HOSPITAL_PINCODE` | Address used in the booking confirmation. |
| `HOSPITAL_HELPLINE`, `HOSPITAL_EMAIL` | Shown in API messages ("call reception on …"). |

Secrets (`JWT_SECRET`, `RAZORPAY_*`, `MSG91_*`) are never written in this file. They come from GitHub secrets (Step 5).

---

## Local development (developers)

```bash
cd worker
cp .dev.vars.example .dev.vars
npm install
npm run db:migrate:local
npm run dev
```

The API runs at http://localhost:8787/api with a local database on your computer. The website on localhost (`cd frontend && npx vite --port 5173`) uses http://localhost:8787/api automatically.

In development (`ENVIRONMENT="development"` in `.dev.vars`):
- Staff login with the built-in accounts `admin@sanjeevanihosp.in` / `Admin@123` (hospital admin) and `superadmin@sanjeevanihosp.in` / `SuperAdmin@123` (super admin). These never work on Cloudflare.
- The OTP code is `123456` when MSG91 is not set.

If you set `ALLOWED_ORIGINS` to a list, add `ALLOWED_ORIGINS="*"` to `.dev.vars` so the local website can still call the local API.

The `database_id` in `wrangler.toml` is written by the GitHub workflows: on each run they look up (or create) `sanjeevani-db` in the Cloudflare account and put its id there. Local commands (`--local`) do not use it.

---

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| Deploy run fails at **Check repository secrets**: "Add these GitHub repository secrets first: …" | `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` is missing or misspelt | Add the named secrets (Step 5), exactly as spelt, then run the workflow again. |
| Run shows the notice "JWT_SECRET is not a GitHub secret" | `JWT_SECRET` is not in GitHub secrets. The Worker keeps whatever value it already has; on a first deploy it has none | Add `JWT_SECRET` (Step 4 and 5) and run the deploy again. Keep it in GitHub so every hospital deploy has it. |
| Fails at **Find or create the D1 database**, or "Authentication error" / code 10000 | The API token lacks a permission, or belongs to another account | Edit the token (My Profile → API Tokens): it needs the **Edit Cloudflare Workers** permissions **and** Account → D1 → Edit, for the right account. Check `CLOUDFLARE_ACCOUNT_ID`. |
| Deploy log says you need to register a **workers.dev subdomain** | The account has no workers.dev subdomain yet | Dashboard → Workers & Pages → choose a subdomain, then run the workflow again. |
| **Check the API answers** fails right after a first deploy | A new workers.dev address can take a minute to start answering | Open `/api/health` yourself after a minute. If it works, nothing to do. |
| Everyone is signed out; admin pages and patient login say "Please sign in again" (401) | `JWT_SECRET` was changed: all existing tokens stop working | Expected. Staff and patients sign in again. Only change the secret if it leaked. |
| `/api/health` works, but sign-in, OTP and booking fail with "Something went wrong" | `JWT_SECRET` is missing on the Worker or shorter than 16 characters | Set a 32+ character `JWT_SECRET` GitHub secret and run the deploy workflow again. |
| First login of a copied admin account fails with an error, other logins are fine | That account still has the old bcrypt password hash. Checking it can take more than the **10 ms CPU** the Workers Free plan allows | Recommended: switch to the Workers Paid plan ($5/month) for a live hospital. After one successful login the password is stored in the new, faster format. Or create a new admin with the data workflow (Part 3), which uses the new format from the start. |
| Website shows "We couldn't load the times" or switches to the WhatsApp request | The website is not pointing at the API, or the API is down | Open `<api address>/health`. If it answers, check `apiBaseUrl` / `VITE_API_URL` ends in `/api` and redeploy the website. |
| Browser console shows a CORS error | `ALLOWED_ORIGINS` does not include the website's address | Add the exact address (with `https://`, no trailing slash) to `ALLOWED_ORIGINS` in `wrangler.toml`, or set it to `*`. |
| "Online booking is temporarily unavailable. Please call reception…" when sending OTP | `REQUIRE_OTP = "true"` and MSG91 is not set | Add `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` secrets and redeploy, or set `REQUIRE_OTP = "false"`. |
| OTP never arrives | DLT template not approved, wrong template id, or no MSG91 balance | Check the MSG91 dashboard and the Worker logs. |
| No "Pay online" option | Razorpay keys missing, or the doctor's fee is `0` | Add the Razorpay secrets and redeploy; publish the fee. |
| Removed a GitHub secret but the Worker still uses it | The deploy only sets secrets that exist; it does not delete old ones | Dashboard → Workers & Pages → sanjeevani-api → **Settings** → **Variables and Secrets** → delete it there. |
| Admin login fails on the live site | No admin in D1 yet | Part 2 (copy) or Part 3 (create admin). The development accounts do not work on Cloudflare. |
| Copy from Supabase fails with a network error | Supabase direct connection not reachable from GitHub | Use the Session pooler string (Part 2, notes). |

**Logs:** Cloudflare dashboard → Workers & Pages → sanjeevani-api → **Logs** shows live requests and errors. Developers can also run `npx wrangler tail` in `worker/`.

**Look at the data:** Cloudflare dashboard → **Storage & Databases** → **D1** → `sanjeevani-db` → **Console** runs SQL, for example `SELECT appointment_code, patient_name, appointment_date FROM appointments ORDER BY created_at DESC LIMIT 20;`. Be careful with anything other than `SELECT`.

---

## Costs

Prices and limits change; check Cloudflare's pricing page before deciding. At the time of writing:

| Service | Free plan | Notes |
| --- | --- | --- |
| Cloudflare Workers | 100,000 requests per day, **10 ms CPU per request** | Enough traffic for one hospital. The CPU limit matters for the first login of copied bcrypt passwords (see Troubleshooting). |
| Cloudflare Workers Paid | $5 per month | Much higher CPU limit and request allowance. **Recommended for a live hospital.** |
| Cloudflare D1 | 5 GB storage, 5 million rows read and 100,000 rows written per day | Far more than one hospital uses. Included in the Paid plan with larger limits. |
| GitHub Actions | Free for public repositories; a monthly allowance of minutes for private ones | Each deploy takes a few minutes. |
| Netlify | Free plan is enough for the website | |
| MSG91, Razorpay | Paid per SMS / per payment | In the hospital's own accounts. |

There is no server to keep awake: the API does not sleep and has no "first request takes a minute" delay.

---

## What changed from the old server

| Before | Now |
| --- | --- |
| A Node.js API server on a separate host, with a hosted PostgreSQL database | Cloudflare Worker (TypeScript, Hono) and Cloudflare D1 (SQLite) |
| Code in a separate server folder (now removed) | Code in `worker/`: routes in `worker/src/routes/`, tables in `worker/migrations/` |
| Settings as environment variables on the old host | Public settings in `worker/wrangler.toml` `[vars]`; secrets from GitHub secrets |
| Deployed from the old host's dashboard | Deployed by GitHub Actions on every change to `worker/` on `main` |
| Appointments, slot holds, OTP codes, payments, reviews, camps and scheme claims kept in server memory and lost on every restart | All stored in D1; nothing is lost on a redeploy |
| Sample reviews, camps and claims built into the server | Removed. Only real data is shown |
| Saved OPD timings linked to database doctors by name | Saved in `doctor_schedules` by the website doctor id (for example `doc-bagal`) |
| Patient records (bills, medicines, lab results, follow-ups, profile) | Same storage idea: one JSON row per patient in `hospital_settings` (key `patient_record:<mobile>`) |
| bcrypt passwords | Copied bcrypt passwords still work and are upgraded on next login; new and changed passwords use PBKDF2 |
| The old free hosting plan slept after inactivity (first request waited about a minute) | No sleeping |
| Rate limit on OTP per phone (in memory) | Limits on OTP per phone, sign-in attempts and no-SMS bookings, stored in D1 |
| Built-in admin accounts in development | Same accounts, only when `ENVIRONMENT=development` |

API paths and reply shapes did not change, so the website works with either.
