# Reception: patients, visits and receipts

The front desk can register patients, book walk-in and phone visits, and make receipts, from the admin panel. Administrators also manage reception logins.

## Who can do what

| | Receptionist | Administrator / Owner | Doctor |
|---|---|---|---|
| Today, Appointments (view, status) | yes | yes | yes |
| Book a visit, change time, cancel | yes | yes | no |
| Register and edit patients | yes | yes | view only |
| Make receipts, take remaining payment | yes | yes | no |
| Cancel a receipt | same day only | any day | no |
| Change a doctor's fee, OPD timings | yes | yes | no |
| Team logins, Staff & salary, Settings, Departments, Scheme claims, Reviews | no | yes | no |

The server enforces this (`RolesGuard`); the panel also hides screens a person can't use.

## Screens (admin panel)

| Screen | Path | Code |
|---|---|---|
| Team logins | `/admin/logins` | `AdminStaffLoginsPage.tsx` |
| Patients (register, search, edit) | `/admin/registration` | `AdminRegistrationPage.tsx` |
| Book a visit | `/admin/appointments/new` | `AdminNewAppointmentPage.tsx` |
| Receipts (list, money report) | `/admin/receipts` | `AdminReceiptsPage.tsx` |
| Make a receipt | `/admin/receipts/new` | `AdminReceiptFormPage.tsx` |
| One receipt (print, PDF, collect, cancel) | `/admin/receipts/:id` | `AdminReceiptDetailPage.tsx` |

Shared pieces: `components/adminUi.tsx` (page header, number cards, bars), `PatientPicker.tsx`, `SlotPicker.tsx`, `ReceiptLangToggle.tsx`, `lib/reception.ts`, `lib/receiptPdf.ts`.

## Receipts

- Numbers: `SMH-R-<financial year>-<6 digits>`, for example `SMH-R-2627-000045`. Counted per financial year (April to March), generated in the database so two people never get the same number. The prefix comes from `HOSPITAL_CODE_PREFIX`.
- Money is stored in paise (whole numbers). The API takes and returns rupees.
- GST is per item (0, 5, 12, 18 or 28 percent, default 0). A receipt discount is shared across items in proportion to their value, and GST is worked out on what remains. The printed receipt splits GST equally into CGST and SGST. Set `HOSPITAL_GSTIN` to print the hospital's GSTIN.
- A receipt is never edited or deleted. A mistake is cancelled with a reason and a new receipt is made. Cancelled receipts are kept and are not counted as money received.
- A balance can be collected later (`Take remaining payment`). Every payment is logged on the receipt. A fully paid receipt linked to a token marks the visit as paid.
- Language: English by default. The English / मराठी switch at the top of the receipt screens changes the on-screen receipt and the PDF. The choice is remembered in the browser.
- PDF: A4. Other layouts (for example an 80 mm thermal printer) can be added as another builder next to `buildReceiptPdf` in `lib/receiptPdf.ts`.
- "Download for Excel" on the Receipts screen exports the receipts being shown.

## Patients

Each patient gets a registration number `SMH-P-<6 digits>`. One mobile number can have several patients (family members); the same name on the same number is refused as a duplicate. The old per-mobile "Bills & medicines" files are unchanged and are opened from the patient's row.

## Visits booked by reception

`POST /appointments/staff-book` uses the same slot engine as online booking (no OTP). Only times the engine offers can be booked, and a time that is taken or held by an online patient is refused. Cancelling a visit frees its time. Visits are stored in the D1 `appointments` table like online bookings, so nothing is lost when the Worker restarts.

## Database tables

On Cloudflare D1: `patients`, `receipts` and `doc_counters` come from `worker/migrations/0002_patients_receipts.sql`; extra appointment columns for staff bookings come from `worker/migrations/0003_staff_booking.sql`. The deploy workflow applies them (`npx wrangler d1 migrations apply sanjeevani-db --remote`).

Reception logins are saved in the existing `hospital_admins` table.

## New endpoints

| Method | Path | Roles |
|---|---|---|
| GET | `/auth/admin/users` | admins |
| PATCH | `/auth/admin/users/:id/active` | admins |
| POST | `/auth/admin/users/:id/reset-password` | admins |
| GET / POST / PATCH | `/patients`, `/patients/:id`, `/patients/by-phone/:phone` | reception, admins (doctors can read) |
| GET | `/appointments/staff/doctors` | reception, admins |
| PUT | `/appointments/staff/doctors/:id/fee` | reception, admins |
| POST | `/appointments/staff-book` | reception, admins |
| PATCH | `/appointments/:id/cancel`, `/appointments/:id/reschedule` | reception, admins |
| POST / GET | `/receipts`, `/receipts/:id`, `/receipts/summary` | reception, admins |
| PATCH / POST | `/receipts/:id/cancel`, `/receipts/:id/collect` | reception, admins |

## Known limits

- Stopping a login blocks the next sign-in; someone already signed in stays signed in until their session ends (up to 7 days).
- A doctor's fee changed here applies to bookings and receipts. The fee shown on the public website still comes from `frontend/src/data/doctorsData.ts` until that file is changed.
- Receipts are in rupees only and assume the hospital and patient are in the same state (CGST + SGST).

## Printouts

| Printout | Size | Where | What it has |
|---|---|---|---|
| Token slip | A5 | Online booking, Book a visit, Appointments → Details | Token and QR, date, time, report-by time, doctor, visit type, patient with UHID, fee and payment, instructions, who booked and when |
| OPD case sheet | A4 | Book a visit, Appointments → Details | Token and QR, patient and visit details, vitals boxes, complaints, history and examination, diagnosis, Rx table, investigations, advice, follow-up date, doctor signature box |
| Receipt | A4 | Receipts → receipt | GST lines, CGST/SGST, discount, amount in words, payments, English / Marathi |

All three print the hospital GSTIN in the letterhead (receipts use the API value `HOSPITAL_GSTIN`; slips and case sheets use `gstin` in `frontend/src/config/hospital.ts`).
