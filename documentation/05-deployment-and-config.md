# Deployment and configuration

Frontend → **Netlify** (static site). Backend → **Render** (Node web service). Database → **PostgreSQL** (Supabase or any Postgres).

## Environment variables

### Backend (`backend/.env`, or Render → Environment)

| Variable | Required | Example / default | Notes |
| --- | --- | --- | --- |
| `NODE_ENV` | yes (prod) | `production` | Anything other than `production` turns on development behaviour (OTP `123456`, in-memory admin accounts). |
| `PORT` | no | `3000` | Render sets it for you. |
| `DATABASE_URL` | yes | `postgresql://…:6543/postgres?pgbouncer=true` | Pooled connection. Without a database the server still starts; OPD timings fall back to defaults and admin login only works in development. |
| `DIRECT_URL` | for migrations | `postgresql://…:5432/postgres` | Used by `prisma db push` / migrations. |
| `JWT_SECRET` | **yes** | long random string | Signs patient and staff tokens. The code has a built-in fallback: never rely on it. New value per hospital. |
| `JWT_EXPIRES_IN` | no | `7d` | Staff login lifetime. |
| `MSG91_AUTH_KEY` | recommended (prod) | from MSG91 | Without it (in production) patients still book, but the mobile number is not checked: the booking is marked "mobile not verified" in Admin → Appointments and reception calls to confirm. Limited to 5 such bookings per visitor per day. |
| `MSG91_TEMPLATE_ID` | recommended (prod) | from MSG91 | DLT-approved OTP template. |
| `REQUIRE_OTP` | no | `false` | `true` = refuse online booking until SMS codes work (patients are asked to call). |
| `RAZORPAY_KEY_ID` | no | `rzp_live_…` | Empty = online payment off; patients pay at the counter. |
| `RAZORPAY_KEY_SECRET` | no | from Razorpay | Needed with the key id; used to verify signatures. |
| `HOSPITAL_TENANT_ID` | no | `hosp-sanjeevani-jalna` | See `src/config/hospital.config.ts`. |
| `HOSPITAL_NAME`, `HOSPITAL_SHORT_NAME`, `HOSPITAL_SLUG` | no | Sanjeevani values | |
| `HOSPITAL_ADDRESS`, `HOSPITAL_CITY`, `HOSPITAL_STATE`, `HOSPITAL_PINCODE` | no | Sanjeevani values | |
| `HOSPITAL_HELPLINE`, `HOSPITAL_LANDLINE`, `HOSPITAL_EMAIL` | no | Sanjeevani values | Shown in API messages and the confirmation response. |
| `HOSPITAL_TAGLINE`, `HOSPITAL_FOUNDED_YEAR` | no | | `/api/hospitals/profile` only. |
| `FIREBASE_*` | no | | Not used yet. |

### Frontend (`frontend/.env`, or Netlify → Site configuration → Environment variables)

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `VITE_API_URL` | **yes** (prod) | `https://sanjeevani-backend.onrender.com/api` | Must end with `/api`. Read at **build** time: after changing it, redeploy the site. If it is not set, the live site uses `apiBaseUrl` from `frontend/src/config/hospital.ts`; on localhost it uses `http://localhost:3000/api`. |
| `VITE_RAZORPAY_KEY_ID` | no | | Not needed; the backend sends the key id with each order. |
| `VITE_GOOGLE_MAPS_KEY`, `VITE_FIREBASE_*` | no | | Not used by the current pages. |

Hospital details are **not** environment variables on the frontend; they are in `frontend/src/config/hospital.ts`.

## Local development

```bash
# Backend
cd backend
npm install
npx prisma generate
npm run build
NODE_ENV=development PORT=3000 JWT_SECRET=dev-secret \
  DATABASE_URL="postgresql://x:y@127.0.0.1:1/z" node dist/main.js
# (the fake DATABASE_URL lets it start without a database; OTP is 123456, see the log)

# Frontend (another terminal)
cd frontend
npm install
npx vite --port 5173
```

Open http://localhost:5173. Admin: http://localhost:5173/admin/login with `admin@sanjeevanihosp.in` / `Admin@123` (development only).

## Deploy the backend on Render

1. New → Web Service → connect the repository. Root directory: `backend`. (Or use the blueprint `backend/render.yaml`.)
2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `npm run start:prod`
4. Health check path: `/api/health`
5. Add the environment variables above (`NODE_ENV=production`, `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, MSG91, Razorpay, `HOSPITAL_*`).
6. First time only, from your machine with `DIRECT_URL` set: `npx prisma db push` then `npm run prisma:seed` (after editing `prisma/seed.ts`).
7. Check `https://<service>.onrender.com/api/health`.

Choose a paid instance for a live hospital: free instances sleep after inactivity (the first booking after a pause waits ~1 minute) and each restart loses in-memory appointments (see [04-architecture.md](04-architecture.md#where-data-lives)).

## Deploy the frontend on Netlify

1. Add new site → Import from Git → pick the repository.
2. The root `netlify.toml` sets base directory `frontend`, build command `npm run build`, publish directory `dist`, Node 20, and the single-page-app redirect.
3. Environment variable: `VITE_API_URL=https://<backend>/api`.
4. Deploy. Then Domain management → add the hospital's domain; Netlify issues HTTPS.

## MSG91 (OTP SMS)

1. Create an MSG91 account in the hospital's name and complete DLT registration (India) for the sender id and an OTP template, e.g. `Your OTP for booking at <Hospital> is ##OTP##.`
2. Copy the **Auth Key** and the **OTP template id** into `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`.
3. Test: book with your own number; the code should arrive within seconds. Failures are logged as `MSG91 OTP send failed…`.

## Razorpay (online payment)

1. Razorpay account in the hospital's name (KYC done).
2. Dashboard → Account & Settings → API Keys → generate live keys. Put them in `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
3. Test with test keys first (`rzp_test_…`), then switch to live.
4. If you do not set keys, online payment is hidden and every booking is "pay at the OPD counter".

## Health check

`GET /api/health` returns:

```json
{ "success": true, "data": { "status": "UP", "service": "<Hospital> Backend API", "mode": "production", … } }
```

## Common problems

| What you see | Likely cause | Fix |
| --- | --- | --- |
| Booking page: **"We couldn't load the times"** or it switches to "send request on WhatsApp" | Backend is down or asleep, or `VITE_API_URL` is wrong / missing `/api` | Open `<VITE_API_URL>/health` in a browser. If it fails, check Render. If it works, check the Netlify variable and redeploy the site. |
| Render page says **"Service Suspended"** | Free hours used up, billing problem, or the service was suspended by the owner | Render dashboard → service → resume / fix billing / upgrade. |
| First request takes ~1 minute | Render free instance waking up | Use a paid instance, or accept the delay. |
| "Online booking is temporarily unavailable. Please call reception…" when sending OTP | `NODE_ENV=production` but MSG91 not set | Set `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID`. |
| OTP never arrives | DLT template not approved, wrong template id, or no MSG91 balance | Check MSG91 logs and the server log. |
| No "Pay online" option | Razorpay keys missing, or the doctor's fee is `0` | Set keys; publish the fee. |
| Appointments disappeared from admin | Backend restarted (memory storage) | Expected today; see roadmap item "Move appointments to the database". |
| OPD timings saved but not kept after restart | No database connection, or the doctor's name in `ROSTER` does not match the database `doctors` row | Check `DATABASE_URL`; check names. The server log says "Using default OPD timings (database not reachable)". |
| Admin login fails in production | No admin in the database | Run the seed, or create an admin. |
| Pages 404 on refresh at `/doctors` etc. | SPA redirect missing | Netlify: keep `netlify.toml` / `public/_redirects`. |
| Doctor photo shows initials | File `public/images/doctors/<id>.webp` missing or misnamed | Add it with the exact id. |

## "Online booking is not available right now"

The booking page shows this when it cannot reach the booking server. Check, in order:

1. Open `https://<backend>/api/health`. "Service Suspended" or no answer means the Render service is off: Render dashboard → the service → **Resume Service** (check billing if it was suspended for payment).
2. The site must point at the server: `VITE_API_URL` on Netlify, or `apiBaseUrl` in `frontend/src/config/hospital.ts`. Redeploy the site after changing either.
3. While the server is off, the page still lets patients pick a time and send the request to reception on WhatsApp.
