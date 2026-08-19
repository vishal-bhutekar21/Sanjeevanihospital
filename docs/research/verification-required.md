# Verification Inventory: Items Requiring Client / Hospital Sign-Off

**Document Purpose:** Clear itemization of unverified data points, conflicting public records, and business parameters that must be confirmed by Sanjeevani Hospital administration prior to production release.

---

## 1. Inventory Matrix

| # | Data Category | Item to Verify | Public / Initial Research Baseline | Action Required by Hospital |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Legal / Reg** | Exact Hospital Registration & NABH/ISO Status | Registered in Jalna District Healthcare Directory (2016) | Confirm exact registration certificate number and whether entry-level NABH accreditation is active. |
| 2 | **Capacity** | Total Inpatient Bed & ICU Bed Count | Estimated 30–50 Bed facility with dedicated ICU | Confirm official sanctioned bed strength (General, Semi-private, Deluxe, ICU). |
| 3 | **Tariffs** | Doctor Consultation Fees | Default set to ₹300 - ₹500 for demo | Provide official OPD fee schedule for each specialist & superspecialist. |
| 4 | **Doctors** | Visiting Consultant Availability | Dr. Kalyansing Rajput, Dr. Shivaji Pole, Dr. Suhrad Annachhatre, Dr. Pranav Vanjari | Confirm active visiting days (e.g., specific Saturdays or on-call basis). |
| 5 | **Insurers** | Empanelled TPA & Cashless Insurers | Star Health, ICICI Lombard, HDFC ERGO, Care Health, etc. | Provide exact approved list of cashless insurance companies and TPAs. |
| 6 | **Govt Schemes** | Exact MJPJAY Specialties Approved | General Surgery, Orthopedics, Pediatrics, Gyn | Confirm list of procedures authorized under MJPJAY at this Jalna center. |
| 7 | **SMS / OTP** | MSG91 DLT Entity & Template ID | Mock OTP provider in local dev mode | Hospital to provide registered TRAI DLT approved MSG91 sender ID & Template ID. |
| 8 | **Payment** | Razorpay Live Account Credentials | Test Mode (`rzp_test_...`) for staging/demo | Hospital management to link business bank account for Live Razorpay key activation. |

---

## 2. Default Staging/Demo Handling Rules

- All unverified clinical claims are omitted from marketing copy.
- Consultation fees are dynamically loaded from database records (so admin can update in 1 click).
- Development/Demo seed data is explicitly tagged (`[DEMO/SAMPLE DATA]`) in development environments.
