# Roadmap

Planned work, roughly in the order it should be done. Effort: **S** = a few days, **M** = 1–3 weeks, **L** = more than 3 weeks (one developer).

| # | Item | Effort | Depends on |
| --- | --- | --- | --- |
| 1 | ~~Move appointments, sessions and payments to the database~~ **Done** (Cloudflare D1) | — | — |
| 2 | WhatsApp / SMS notifications | M | 1 |
| 3 | Payments reconciliation | S–M | 1 |
| 4 | Smart invoices | M | 1, 3 |
| 5 | Patient accounts and visit history | M–L | 1 |
| 6 | Doctor app and queue display | M | 1 |
| 7 | Analytics for the hospital | S–M | 1 |
| 8 | Multi-hospital (multi-tenant) SaaS | L | 1, and ideally 2–4 |

---

## 1. Move appointments, sessions and payments to the database (done)

Done with the move to Cloudflare Workers + D1 ([09-cloudflare.md](09-cloudflare.md)). Appointments, booking sessions, slot holds, OTP codes, payments, reviews, camps and scheme claims are stored in D1 and survive redeploys (see [04-architecture.md](04-architecture.md#where-data-lives)). API field names did not change.

## 2. WhatsApp / SMS notifications (M)

**What:**
- **Booking confirmation** right after `confirm-slot`: token number, doctor, date, time, address, map link, "call to change".
- **Reminders 24 hours and 2 hours before** the appointment.
- **Follow-up / next-visit reminders** when the doctor sets a next-visit date (needs a field for it in admin).
- Cancellation and reschedule messages when staff change status.
- Opt-out handling; messages in English or Marathi based on the language used at booking.

**How:** MSG91 (SMS, already used for OTP; needs DLT templates for each message) and/or WhatsApp Business API through a provider (Gupshup, Interakt, MSG91 WhatsApp; needs approved templates). The Worker's daily cron (`worker/src/scheduled.ts`, 03:30 UTC) can pick up due reminders from D1; reminders 2 hours before need an extra, more frequent cron in `wrangler.toml`.

**Depends on:** 1 (reminders need stored appointments), hospital's MSG91 / WhatsApp Business accounts and template approval.

## 3. Payments reconciliation (S–M)

**What:** Razorpay webhook (`payment.captured`, `refund.processed`) to mark payments even if the browser closed; daily report matching Razorpay settlements to appointments; refunds from admin when an appointment is cancelled.

**Depends on:** 1, a webhook secret (GitHub secret → Worker secret).

## 4. Smart invoices (M)

**What:**
- **GST-ready PDF invoices** with hospital GSTIN, invoice number series, HSN/SAC codes (most healthcare services are exempt; the invoice must still show it correctly).
- **Itemised bills**: consultation, procedures, lab tests, pharmacy, room charges.
- **Insurance / MJPJAY split**: amount covered by the scheme or insurer vs amount payable by the patient.
- Send the invoice by WhatsApp/SMS link and show it in admin.

**Depends on:** 1, 3; hospital's GST details (add to `config/hospital.ts` and `worker/wrangler.toml` `[vars]`).

## 5. Patient accounts and visit history (M–L)

**What:** patient logs in with mobile OTP, sees upcoming and past appointments, slips, invoices, can cancel or reschedule within rules. Family members under one number.

**Depends on:** 1; a privacy notice and consent text approved by the hospital.

## 6. Doctor app and queue display (M)

**What:** a simple doctor view (today's list, mark seen, set next-visit date) and a **queue display** for the waiting-area TV (current token per doctor, large text, EN/MR).

**Depends on:** 1; doctor logins (role `DOCTOR` already exists).

## 7. Analytics (S–M)

**What:** bookings per day/doctor/department, no-show rate, online vs counter payments, where patients come from (town field), busiest hours. Admin dashboard charts with real data only.

**Depends on:** 1.

## 8. Multi-hospital (multi-tenant) SaaS (L)

**What:**
- One deployment serving many hospitals, chosen by domain.
- **Per-hospital config** stored in the database instead of `config/hospital.ts`: name, phones, address, hours, logo, colours, doctors, departments, photos (upload to storage).
- `hospital_id` on every row (already present on most D1 tables) checked in every Worker route against the staff token's `hospitalId`.
- Per-hospital Razorpay and MSG91 credentials, stored encrypted.
- Super-admin panel to create hospitals; billing for the SaaS subscription.

**Depends on:** 1; ideally 2–4 so each hospital gets the full product.

---

## Smaller items

| Item | Effort |
| --- | --- |
| Set `ALLOWED_ORIGINS` in `worker/wrangler.toml` to the hospital's domains (today `*`) | S |
| Separate tables for patient records (today JSON rows in `hospital_settings`; schema change, needs approval) | S–M |
| Contact form: send enquiries to the server/email (today it only shows a thank-you on screen) | S |
| Admin: edit hospital details and doctors from the panel (today read-only / in source) | M (part of 8) |
