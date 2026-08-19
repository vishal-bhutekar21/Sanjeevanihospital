# API Specification: Sanjeevani Platform REST Endpoints

**Base URL**: `/api/v1`  
**Content-Type**: `application/json`

---

## 1. Authentication & Ephemeral Patient Sessions
- `POST /api/v1/auth/send-otp`
  - **Body**: `{ "phone": "+919876543210" }`
  - **Response**: `{ "success": true, "data": { "sessionId": "uuid", "expiresIn": 300 } }`
- `POST /api/v1/auth/verify-otp`
  - **Body**: `{ "sessionId": "uuid", "otp": "123456" }`
  - **Response**: `{ "success": true, "data": { "token": "ephemeral_jwt", "session": { "id": "uuid", "phone": "+919876543210" } } }`
- `POST /api/v1/auth/admin/login`
  - **Body**: `{ "email": "admin@sanjeevanihosp.in", "password": "..." }`
  - **Response**: `{ "success": true, "data": { "token": "admin_jwt", "admin": { "name": "...", "role": "HOSPITAL_ADMIN", "hospitalId": "uuid" } } }`

---

## 2. Public Catalog & Medical Directory
- `GET /api/v1/hospitals/profile`
  - Returns verified hospital details, contacts, facilities, and emergency status.
- `GET /api/v1/departments`
  - Returns list of active clinical departments with bilingual names.
- `GET /api/v1/departments/:slug`
  - Returns department detail, faculty doctors, and clinical services.
- `GET /api/v1/doctors`
  - Query params: `?departmentId=...&search=...`
  - Returns active doctor cards, designations, and fees.
- `GET /api/v1/doctors/:id`
  - Detailed doctor profile with weekly schedule and next available slot date.
- `GET /api/v1/doctors/:id/availability?date=YYYY-MM-DD`
  - Returns real-time slot array with availability status (`AVAILABLE`, `HELD`, `BOOKED`).

---

## 3. Booking & Payment Engine
- `POST /api/v1/booking/session/init`
  - **Headers**: `Authorization: Bearer <ephemeral_patient_jwt>`
  - **Body**: `{ "doctorId": "uuid", "patientName": "...", "patientAge": 35, "patientAddress": "..." }`
  - **Response**: `{ "success": true, "data": { "bookingSessionId": "uuid", "fee": 500 } }`
- `POST /api/v1/payments/create-order`
  - **Body**: `{ "bookingSessionId": "uuid" }`
  - **Response**: `{ "success": true, "data": { "orderId": "order_xxx", "amount": 50000, "currency": "INR", "keyId": "rzp_test_..." } }`
- `POST /api/v1/payments/verify`
  - **Body**: `{ "bookingSessionId": "uuid", "razorpayOrderId": "order_xxx", "razorpayPaymentId": "pay_xxx", "razorpaySignature": "sha256_hash" }`
  - **Response**: `{ "success": true, "data": { "paymentStatus": "VERIFIED" } }`
- `POST /api/v1/appointments/confirm-slot`
  - **Body**: `{ "bookingSessionId": "uuid", "slotId": "uuid" }`
  - **Response**: `{ "success": true, "data": { "appointment": { "appointmentCode": "SMH-2026-000101", "status": "CONFIRMED", "doctor": "...", "date": "2026-08-25", "time": "10:30 AM" } } }`
- `GET /api/v1/appointments/:appointmentCode/receipt`
  - Returns structured printable confirmation & receipt payload.

---

## 4. Hospital Admin Management Endpoints
- `GET /api/v1/admin/overview`
- `GET /api/v1/admin/appointments` (Filters: `date`, `doctorId`, `departmentId`, `status`)
- `PATCH /api/v1/admin/appointments/:id/status`
- `GET /api/v1/admin/doctors` | `POST /api/v1/admin/doctors` | `PUT /api/v1/admin/doctors/:id`
- `GET /api/v1/admin/schedules/:doctorId` | `POST /api/v1/admin/schedules/:doctorId`
- `GET /api/v1/admin/audit-logs`
