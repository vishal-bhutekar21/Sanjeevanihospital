# Deployment and configuration

Website → **Netlify** (static site, `frontend/`). API → **Cloudflare Workers** (`worker/`). Database → **Cloudflare D1**. The API is deployed by GitHub Actions.

The full, step-by-step Cloudflare setup (account, API token, GitHub secrets, first deploy, copying the old data, first admin, custom domain) is in [09-cloudflare.md](09-cloudflare.md). This page is the reference for settings, the website deploy, MSG91 and Razorpay.

## API settings

### Public settings: `worker/wrangler.toml` → `[vars]`

Change them in the file and commit to `main`; the deploy workflow applies them. Changes made in the Cloudflare dashboard are overwritten by the next deploy.

| Setting | Example / default | Notes |
| --- | --- | --- |
| `ENVIRONMENT` | `production` | `development` (set in `.dev.vars` for local runs) turns on the built-in admin accounts and OTP `123456`. |
| `ALLOWED_ORIGINS` | `*` | Websites allowed to call the API: `*` or a comma-separated list of addresses. |
| `BOOKING_OPEN_ALL_DOCTORS` | `true` | Testing switch: every doctor bookable every day 08:00–22:00. Set `"false"` before going live (and `booking.openAllDoctors` in `frontend/src/config/hospital.ts`). |
| `REQUIRE_OTP` | `false` | `true` = refuse online booking until SMS codes work (patients are asked to call). `false` = without MSG91, patients book and the number is marked "not verified". |
| `HOSPITAL_TENANT_ID` | `hosp-sanjeevani-jalna` | Hospital id stored on records and in staff tokens. |
| `HOSPITAL_NAME`, `HOSPITAL_SHORT_NAME`, `HOSPITAL_SLUG` | Sanjeevani values | |
| `HOSPITAL_ADDRESS`, `HOSPITAL_CITY`, `HOSPITAL_STATE`, `HOSPITAL_PINCODE` | Sanjeevani values | Booking confirmation address. |
| `HOSPITAL_HELPLINE`, `HOSPITAL_EMAIL` | Sanjeevani values | Shown in API messages and the confirmation reply. |

### Secrets: GitHub repository secrets

Set in GitHub → **Settings** → **Secrets and variables** → **Actions**. The deploy workflow copies them onto the Worker.

| Secret | Required | Notes |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | **yes** | "Edit Cloudflare Workers" template plus Account → D1 → Edit. |
| `CLOUDFLARE_ACCOUNT_ID` | **yes** | Dashboard → Workers & Pages → right sidebar. |
| `JWT_SECRET` | **yes** | 32+ random characters (`openssl rand -hex 32`). Signs patient and staff tokens. New value per hospital. Changing it signs everyone out. |
| `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` | recommended | Without them on the live site, see `REQUIRE_OTP`. Patient login needs them. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | no | Empty = online payment off; patients pay at the counter. |
| `SUPABASE_DATABASE_URL` | one time | Only for the one-time data copy from Supabase. Delete afterwards. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | one time | Only for creating the first admin with the data workflow. |

After adding or changing a secret, run **Actions → Worker: deploy API to Cloudflare → Run workflow** so the Worker gets it.

### Website: `frontend/src/config/hospital.ts` and Netlify

| Setting | Where | Notes |
| --- | --- | --- |
| `apiBaseUrl` | `frontend/src/config/hospital.ts` | API address for the live site, e.g. `https://sanjeevani-api.<your-subdomain>.workers.dev/api`. Must end with `/api`. |
| `VITE_API_URL` | Netlify → Site configuration → Environment variables (or `frontend/.env`) | Optional. Wins over `apiBaseUrl`. Read at **build** time: redeploy the site after changing it. |
| `booking.openAllDoctors` | `frontend/src/config/hospital.ts` | Website side of the testing switch. Keep it equal to `BOOKING_OPEN_ALL_DOCTORS`. |
| `VITE_RAZORPAY_KEY_ID` | — | Not needed; the API sends the key id with each order. |
| `VITE_GOOGLE_MAPS_KEY`, `VITE_FIREBASE_*` | — | Not used by the current pages. |

On `localhost` the website always uses `http://localhost:8787/api` unless `VITE_API_URL` is set.

Hospital details are **not** environment variables on the frontend; they are in `frontend/src/config/hospital.ts`.

## Local development

```bash
# API (local D1 database on your computer)
cd worker
cp .dev.vars.example .dev.vars
npm install
npm run db:migrate:local
npm run dev          # http://localhost:8787/api

# Website (another terminal)
cd frontend
npm install
npx vite --port 5173
```

Open http://localhost:5173. Admin: http://localhost:5173/admin/login with `admin@sanjeevanihosp.in` / `Admin@123` or `superadmin@sanjeevanihosp.in` / `SuperAdmin@123` (development only). OTP code: `123456`.

## Deploy the API (Cloudflare)

Automatic: every push to `main` that changes `worker/` runs `.github/workflows/worker-deploy.yml`: typecheck → find or create the D1 database → apply migrations → `wrangler deploy` → set Worker secrets → health check. The run summary shows the workers.dev address.

First time and data copy: follow [09-cloudflare.md](09-cloudflare.md).

## Deploy the website on Netlify

1. Add new site → Import from Git → pick the repository.
2. The root `netlify.toml` sets base directory `frontend`, build command `npm run build`, publish directory `dist`, Node 20, and the single-page-app redirect.
3. Point the site at the API: `apiBaseUrl` in `frontend/src/config/hospital.ts`, or `VITE_API_URL` on Netlify.
4. Deploy. Then Domain management → add the hospital's domain; Netlify issues HTTPS.

## MSG91 (OTP SMS)

1. Create an MSG91 account in the hospital's name and complete DLT registration (India) for the sender id and an OTP template, e.g. `Your OTP for booking at <Hospital> is ##OTP##.`
2. Put the **Auth Key** and the **OTP template id** in the GitHub secrets `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`, then run the deploy workflow.
3. Test: book with your own number; the code should arrive within seconds. Failures appear in the Worker logs (Cloudflare dashboard → Workers & Pages → sanjeevani-api → Logs).

## Razorpay (online payment)

1. Razorpay account in the hospital's name (KYC done).
2. Dashboard → Account & Settings → API Keys → generate keys. Put them in the GitHub secrets `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`, then run the deploy workflow.
3. Test with test keys first (`rzp_test_…`), then switch to live.
4. If you do not set keys, online payment is hidden and every booking is "pay at the OPD counter".

## Health check

`GET /api/health` returns:

```json
{ "success": true, "data": { "status": "UP", "service": "<Hospital short name> API", "runtime": "cloudflare-workers", "timestamp": "…" } }
```

## Common problems

More Cloudflare-specific problems (secrets, token permissions, CPU limit) are in [09-cloudflare.md](09-cloudflare.md#troubleshooting).

| What you see | Likely cause | Fix |
| --- | --- | --- |
| Booking page: **"We couldn't load the times"** or it switches to "send request on WhatsApp" | API address wrong / missing `/api`, or the API is not deployed | Open `<api address>/health` in a browser. If it fails, check the last deploy run in GitHub Actions. If it works, check `apiBaseUrl` / `VITE_API_URL` and redeploy the site. |
| "Online booking is temporarily unavailable. Please call reception…" when sending OTP | `REQUIRE_OTP = "true"` but MSG91 not set | Add the MSG91 secrets and redeploy, or set `REQUIRE_OTP = "false"`. |
| OTP never arrives | DLT template not approved, wrong template id, or no MSG91 balance | Check MSG91 logs and the Worker logs. |
| No "Pay online" option | Razorpay keys missing, or the doctor's fee is `0` | Set the secrets; publish the fee. |
| Every doctor is bookable 8 am – 10 pm every day | Testing switch still on | Part 6 of [09-cloudflare.md](09-cloudflare.md). |
| Admin login fails on the live site | No admin in D1 | Copy the data from Supabase or create the first admin ([09-cloudflare.md](09-cloudflare.md)). |
| Everyone signed out at once | `JWT_SECRET` changed | Expected; sign in again. |
| Pages 404 on refresh at `/doctors` etc. | SPA redirect missing | Netlify: keep `netlify.toml` / `public/_redirects`. |
| Doctor photo shows initials | File `public/images/doctors/<id>.webp` missing or misnamed | Add it with the exact id. |

## "Online booking is not available right now"

The booking page shows this when it cannot reach the API. Check, in order:

1. Open `<api address>/health` (for example `https://sanjeevani-api.<your-subdomain>.workers.dev/api/health`). No answer means the Worker is not deployed or the address is wrong: check GitHub → Actions → **Worker: deploy API to Cloudflare**.
2. The site must point at the API: `VITE_API_URL` on Netlify, or `apiBaseUrl` in `frontend/src/config/hospital.ts`. Redeploy the site after changing either.
3. While the API cannot be reached, the page still lets patients pick a time and send the request to reception on WhatsApp.
