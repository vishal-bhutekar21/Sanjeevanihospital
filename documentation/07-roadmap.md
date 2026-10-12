# Roadmap

Planned work, roughly in the order it should be done. Effort: **S** = a few days, **M** = 1–3 weeks, **L** = more than 3 weeks (one developer).

| # | Item | Effort | Depends on |
| --- | --- | --- | --- |
| 1 | Move appointments, sessions and payments to the database | M | — |
| 2 | WhatsApp / SMS notifications | M | 1 |
| 3 | Payments reconciliation | S–M | 1 |
| 4 | Smart invoices | M | 1, 3 |
| 5 | Patient accounts and visit history | M–L | 1 |
| 6 | Doctor app and queue display | M | 1 |
| 7 | Analytics for the hospital | S–M | 1 |
| 8 | Multi-hospital (multi-tenant) SaaS | L | 1, and ideally 2–4 |

---

## 1. Move appointments, sessions and payments to the database (M)

**Why:** today appointments, booking sessions, slot holds, payments, claims and reviews live in server memory and are lost on every restart (see [04-architecture.md](04-architecture.md#where-data-lives)). Nothing else on this list is safe to build until this is fixed.

**What:**
- Use the Prisma tables that already exist: `Appointment`, `AppointmentSlot`, `BookingSession`, `Payment`, `PatientReview`, `HospitalEvent`, `AuditLog`. Scheme claims have no table yet; adding one is a schema change and needs agreement first.
- Slot holds: a row with an expiry time and a unique constraint on doctor + date + time, so two people cannot hold the same time even with several server instances.
- OTP sessions can stay short-lived (memory or a small table); patient JWT stays as is.
- Keep API field names the same so the frontend does not change.

**Depends on:** nothing.

## 2. WhatsApp / SMS notifications (M)

**What:**
- **Booking confirmation** right after `confirm-slot`: token number, doctor, date, time, address, map link, "call to change".
- **Reminders 24 hours and 2 hours before** the appointment.
- **Follow-up / next-visit reminders** when the doctor sets a next-visit date (needs a field for it in admin).
- Cancellation and reschedule messages when staff change status.
- Opt-out handling; messages in English or Marathi based on the language used at booking.

**How:** MSG91 (SMS, already used for OTP; needs DLT templates for each message) and/or WhatsApp Business API through a provider (Gupshup, Interakt, MSG91 WhatsApp; needs approved templates). A scheduled job (cron) picks up due reminders from the database.

**Depends on:** 1 (reminders need stored appointments), hospital's MSG91 / WhatsApp Business accounts and template approval.

## 3. Payments reconciliation (S–M)

**What:** Razorpay webhook (`payment.captured`, `refund.processed`) to mark payments even if the browser closed; daily report matching Razorpay settlements to appointments; refunds from admin when an appointment is cancelled.

**Depends on:** 1, webhook secret in env.

## 4. Smart invoices (M)

**What:**
- **GST-ready PDF invoices** with hospital GSTIN, invoice number series, HSN/SAC codes (most healthcare services are exempt; the invoice must still show it correctly).
- **Itemised bills**: consultation, procedures, lab tests, pharmacy, room charges.
- **Insurance / MJPJAY split**: amount covered by the scheme or insurer vs amount payable by the patient.
- Send the invoice by WhatsApp/SMS link and show it in admin.

**Depends on:** 1, 3; hospital's GST details (add to `config/hospital.ts` and backend config).

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
- `hospitalId` on every row (already present on most records) enforced by `HospitalIsolationGuard`.
- Per-hospital Razorpay and MSG91 credentials, stored encrypted.
- Super-admin panel to create hospitals; billing for the SaaS subscription.

**Depends on:** 1; ideally 2–4 so each hospital gets the full product.

---

## Smaller items

| Item | Effort |
| --- | --- |
| Register a global `ThrottlerGuard` (rate limiting is configured but not enforced) | S |
| Limit CORS to the hospital's domain | S |
| Fail start-up in production when `JWT_SECRET` is missing | S |
| Contact form: send enquiries to the server/email (today it only shows a thank-you on screen) | S |
| Admin: edit hospital details and doctors from the panel (today read-only / in source) | M (part of 8) |
