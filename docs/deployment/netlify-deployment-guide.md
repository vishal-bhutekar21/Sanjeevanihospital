# 🌐 Sanjeevani Multispeciality Hospital — Netlify Deployment Guide
### Complete Production Deployment & Hosting Manual for the Frontend SPA

---

## 📌 1. Architecture Overview

The **Sanjeevani Multispeciality Hospital** platform uses a decoupled client-server architecture:

```
                                  ┌─────────────────────────────────────────┐
                                  │           GLOBAL PATIENTS & USERS       │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                        ┌─────────────────────────────────────────────────────────────┐
                        │          NETLIFY HIGH-PERFORMANCE EDGE CDN                  │
                        │  - Fast global static asset distribution (HTML/JS/CSS)      │
                        │  - Automated SSL/TLS (HTTPS) by Let's Encrypt               │
                        │  - Atomic client-side SPA routing (`_redirects`)            │
                        │  - Brotli / Gzip compression & asset caching                │
                        └──────────────────────────────┬──────────────────────────────┘
                                                       │
                                                       │ HTTPS REST Requests (with CORS)
                                                       ▼
                        ┌─────────────────────────────────────────────────────────────┐
                        │           API: CLOUDFLARE WORKER (worker/)                  │
                        │  - REST endpoints under `/api/...` (Hono, TypeScript)       │
                        │  - Razorpay and MSG91                                       │
                        │  - Cloudflare D1 (SQLite) database                          │
                        └─────────────────────────────────────────────────────────────┘
```

* **Frontend SPA**: React 18 + Vite 5 + TailwindCSS + TypeScript. Hosted on **Netlify Edge CDN**.
* **API**: Cloudflare Worker in `worker/`, deployed by GitHub Actions. Setup: [documentation/09-cloudflare.md](../../documentation/09-cloudflare.md).
* **Database**: Cloudflare D1 (SQLite).

---

## ⚙️ 2. Build & Hosting Specifications

| Configuration Item | Value | Explanation |
|---|---|---|
| **Base Directory** | `frontend` | The subdirectory containing the React/Vite source code. |
| **Build Command** | `npm run build` | Runs TypeScript compilation (`tsc`) and Vite production bundler. |
| **Publish Directory** | `dist` (or `frontend/dist`) | Directory where Vite outputs compiled static bundles. |
| **Node.js Version** | `20.x` or `18.x` LTS | Configured in `netlify.toml` via `NODE_VERSION = "20"`. |
| **Package Manager** | `npm` | Uses `package-lock.json` for deterministic dependency tree. |

---

## 🔑 3. Environment Variables Reference

Vite embeds environment variables prefixed with `VITE_` directly into the static bundle during **build time**. 

> [!NOTE]
> You do not have to set any variable: the site uses `apiBaseUrl` from `frontend/src/config/hospital.ts` when `VITE_API_URL` is not set.

> [!IMPORTANT]
> Because Vite embeds variables during build time, if you add or change an environment variable in Netlify, you **MUST trigger a new deploy** (Deploy ➔ Trigger deploy ➔ Clear cache and deploy site) for the new values to take effect.

| Environment Variable | Required? | Example Production Value | Description |
|---|:---:|---|---|
| `VITE_API_URL` | Optional | `https://sanjeevani-api.<your-subdomain>.workers.dev/api` | API address (the Cloudflare Worker). Must include the `/api` prefix. Overrides `apiBaseUrl` in `frontend/src/config/hospital.ts`. |

The Razorpay key id is sent by the API with each payment order, so the website needs no Razorpay variable. `VITE_GOOGLE_MAPS_KEY` and `VITE_FIREBASE_*` in `frontend/.env.example` are not used by the current pages.

---

## 🚀 4. Deployment Methods

You can deploy the frontend to Netlify using any of the three methods below.

---

### Method A: Deploy via Netlify Dashboard (Git Continuous Deployment — Recommended)

This method sets up automatic deployments on every `git push` to your GitHub / GitLab repository.

#### Step 1: Connect Your Git Repository
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site"** ➔ **"Import an existing project"**.
3. Select your Git provider (e.g., **GitHub**) and authorize Netlify.
4. Search for and select the **`sanjeevani-platform`** repository.

#### Step 2: Configure Build Settings
Netlify will automatically detect the `netlify.toml` file in your repository. Verify that the build settings match:
* **Base directory**: `frontend`
* **Build command**: `npm run build`
* **Publish directory**: `frontend/dist` (or `dist`)
* **Branch to deploy**: `main` (or `master`)

#### Step 3: Add Production Environment Variables
1. Under **Environment variables**, click **"Add a variable"** (or **"Import from .env"**).
2. Add the production keys:
   * *(Optional)* `VITE_API_URL`: the Worker address, e.g. `https://sanjeevani-api.<your-subdomain>.workers.dev/api`. Skip it if `apiBaseUrl` in `frontend/src/config/hospital.ts` is already set.

#### Step 4: Deploy the Site
1. Click **"Deploy sanjeevani-platform"**.
2. Netlify will provision the build environment, install dependencies, compile the TypeScript code, bundle assets with Vite, and deploy globally across Netlify's Edge CDN.
3. Your site will be live at `https://[your-site-name].netlify.app`.

---

### Method B: Deploy via Netlify CLI (Command Line)

Ideal for automated CI/CD pipelines, staging previews, or direct terminal deployments.

#### Step 1: Install Netlify CLI Globally
```bash
npm install -g netlify-cli
```

#### Step 2: Authenticate with Netlify
```bash
netlify login
```
*This opens a browser window to grant CLI access to your Netlify account.*

#### Step 3: Initialize Netlify in the Project
From the project root:
```bash
netlify init
```
Follow the interactive prompts:
* **Create & configure a new site**: Select *Create & configure a new site*.
* **Site name**: `sanjeevani-multispeciality-hospital` (or leave blank for random name).
* **Base directory**: `frontend`
* **Build command**: `npm run build`
* **Directory to deploy**: `dist`

#### Step 4: Set Environment Variables via CLI
```bash
netlify env:set VITE_API_URL "https://sanjeevani-api.<your-subdomain>.workers.dev/api"
```

#### Step 5: Build and Deploy to Production
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```
*The command returns a live production URL immediately upon completion.*

---

### Method C: Netlify Drop (Manual Drag-and-Drop)

Quickest way to test a local build without connecting Git or installing the CLI.

1. Navigate to the `frontend` folder and build the application:
   ```bash
   cd frontend
   npm run build
   ```
2. Open [Netlify Drop](https://app.netlify.com/drop) in your browser.
3. Drag and drop the generated `frontend/dist` folder into the upload target area.
4. Netlify will deploy the site in seconds.
5. Drag-and-drop sites are not built by Netlify, so environment variables have no effect. Set `apiBaseUrl` in `frontend/src/config/hospital.ts` (or `VITE_API_URL` in `frontend/.env`) before running `npm run build`.

---

## 🔀 5. SPA Routing & 404 Prevention

Because this application is a **Single-Page Application (SPA)** using `react-router-dom`, deep URLs like `/book`, `/admin/login`, `/departments`, `/services`, `/schemes`, and `/reviews` must be handled by the client-side JavaScript router rather than requesting a non-existent static file on the server.

### Automatic Fallback Mechanism
The project includes two fallback safeguards:

1. **`netlify.toml` Configuration**:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **`frontend/public/_redirects`**:
   ```
   /*    /index.html   200
   ```
   *Vite automatically copies files in `public/` into the root of `dist/` upon build, ensuring fallback persistence across all deployment styles.*

> [!NOTE]
> The HTTP status code `200` performs a transparent rewrite (not a 301/302 redirect), preserving the exact browser URL bar path for seamless user navigation.

---

## 🌐 6. Custom Domain & SSL/TLS Configuration

To host the platform on a custom domain (such as `sanjeevanihospital.in` or `www.sanjeevanihospital.in`):

### Step 1: Add Custom Domain in Netlify
1. In your Netlify site dashboard, go to **Site configuration ➔ Domain management**.
2. Click **"Add a custom domain"**.
3. Enter your domain: `sanjeevanihospital.in`.
4. Click **"Verify"** and **"Add domain"**. Netlify will automatically include `www.sanjeevanihospital.in`.

### Step 2: Configure DNS Records at your Domain Registrar (GoDaddy, Namecheap, Hostinger, Cloudflare)
Add the following DNS records in your domain registrar's DNS management console:

| Record Type | Host / Name | Value / Points To | TTL |
|---|---|---|---|
| **A Record** | `@` (Apex domain) | `75.2.60.5` | Auto / 3600 |
| **CNAME Record** | `www` | `[your-site-name].netlify.app.` | Auto / 3600 |

*Alternatively, you can delegate nameservers directly to Netlify DNS (`dns1.p01.nsone.net`, etc.) for automatic DNS management.*

### Step 3: Automated HTTPS Certificate (Let's Encrypt)
* Netlify automatically provisions a free SSL/TLS certificate via **Let's Encrypt**.
* Once DNS records propagate (typically 5–30 minutes), the certificate status will turn green (**"Certificate active"**).
* All HTTP requests are automatically upgraded and redirected to HTTPS.

---

## 🛡️ 7. Security & Asset Performance Headers

The included `netlify.toml` file enforces industry-standard web security headers and asset caching policies:

* **Hashed Asset Caching**: `/assets/*` files generated by Vite contain unique content hashes and are cached for 1 year (`Cache-Control: public, max-age=31536000, immutable`).
* **Clickjacking Protection**: `X-Frame-Options: DENY`.
* **MIME Sniffing Protection**: `X-Content-Type-Options: nosniff`.
* **Referrer Security**: `Referrer-Policy: strict-origin-when-cross-origin`.
* **Permission Constraints**: `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`.

---

## 🔗 8. API CORS & Verification Checklist

When your website is running on `https://[your-site].netlify.app` or your custom domain:

1. **Verify the API**:
   Visit `https://sanjeevani-api.<your-subdomain>.workers.dev/api/health` (or your API address + `/health`). It should return:
   ```json
   { "success": true, "data": { "status": "UP", "service": "...", "runtime": "cloudflare-workers", "timestamp": "..." } }
   ```

2. **Verify CORS Settings**:
   `ALLOWED_ORIGINS` in `worker/wrangler.toml` is `*` by default, which allows calls from any website. If you set it to a list, it must include the Netlify address and your custom domain (with `https://`).

3. **Check Browser Console for Mixed Content**:
   Always use `https://` for the API address. Calling an `http://` API from an `https://` Netlify site is blocked by browsers (Mixed Content).

---

## 🛠️ 9. Troubleshooting & FAQ

### Issue 1: "Page Not Found / 404" when refreshing routes (e.g., `/book` or `/admin/login`)
* **Cause**: Netlify is searching for a physical `/book/index.html` file that doesn't exist in a client-side SPA.
* **Fix**: Ensure `netlify.toml` exists in the repository root or `frontend/` directory with `[[redirects]]` configured, or verify that `frontend/public/_redirects` is present.

### Issue 2: Environment variables are undefined or showing fallback values
* **Cause 1**: Variable name is missing the `VITE_` prefix (Vite ignores variables without `VITE_`).
* **Cause 2**: The project was not redeployed after adding the variable in Netlify.
* **Fix**: Ensure the variable name is exactly `VITE_API_URL`, then trigger a manual redeploy in Netlify via **Deploys ➔ Trigger deploy ➔ Clear cache and deploy site**.

### Issue 3: Build failed: `tsc command failed` or TypeScript errors
* **Fix**: Run `npm run build` locally in the `frontend` folder before pushing to Git to resolve any lint or type mismatch errors.

### Issue 4: No "Pay online" option, or the Razorpay window does not open
* **Fix**: The Razorpay keys belong to the API, not Netlify. Add the `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` GitHub secrets and run the deploy workflow (see [documentation/09-cloudflare.md](../../documentation/09-cloudflare.md)). A doctor with fee `0` never offers online payment.

---

## 📋 10. Summary Quick Command Reference

```bash
# 1. Clone repository
git clone https://github.com/vishal-bhutekar21/sanjeevani-multispeciality-hospital.git
cd sanjeevani-multispeciality-hospital

# 2. Local test build
cd frontend
npm install
npm run build

# 3. Direct deploy with Netlify CLI
netlify login
netlify deploy --prod --dir=dist
```
