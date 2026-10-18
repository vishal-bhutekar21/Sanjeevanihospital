/**
 * HOSPITAL CONFIG (backend) — the hospital this server runs for.
 *
 * Every value can be overridden with an environment variable, so the same
 * code can run for a different hospital without editing source files.
 * The defaults are the current Sanjeevani values.
 *
 * Values are read through getters (not plain constants) so that variables
 * from the .env file — loaded by ConfigModule.forRoot() in app.module.ts —
 * are picked up even though this file is imported before that runs.
 *
 * The frontend has its own copy of the public details in
 * frontend/src/config/hospital.ts. Keep the two in step.
 * See documentation/02-rebrand-checklist.md.
 */

const env = (key: string, fallback: string): string => {
  const v = process.env[key];
  return v !== undefined && v.trim() !== '' ? v.trim() : fallback;
};

export const HOSPITAL = {
  /** Tenant id stamped on every record (appointments, claims, reviews...). Env: HOSPITAL_TENANT_ID */
  get id() {
    return env('HOSPITAL_TENANT_ID', 'hosp-sanjeevani-jalna');
  },
  /** Env: HOSPITAL_NAME */
  get name() {
    return env('HOSPITAL_NAME', 'Sanjeevani Multispeciality Hospital');
  },
  /** Used in public text, e.g. "treatment at Sanjeevani Hospital". Env: HOSPITAL_SHORT_NAME */
  get shortName() {
    return env('HOSPITAL_SHORT_NAME', 'Sanjeevani Hospital');
  },
  /** Env: HOSPITAL_SLUG */
  get slug() {
    return env('HOSPITAL_SLUG', 'sanjeevani-jalna');
  },
  /** Env: HOSPITAL_TAGLINE */
  get tagline() {
    return env('HOSPITAL_TAGLINE', 'Comprehensive healthcare, closer to you.');
  },
  /** Env: HOSPITAL_FOUNDED_YEAR */
  get establishedYear() {
    return Number(env('HOSPITAL_FOUNDED_YEAR', '2016'));
  },
  /** Street part of the address. Env: HOSPITAL_ADDRESS */
  get addressLine() {
    return env('HOSPITAL_ADDRESS', 'Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli');
  },
  /** Env: HOSPITAL_CITY */
  get city() {
    return env('HOSPITAL_CITY', 'Jalna');
  },
  /** Env: HOSPITAL_STATE */
  get state() {
    return env('HOSPITAL_STATE', 'Maharashtra');
  },
  /** Env: HOSPITAL_PINCODE */
  get pincode() {
    return env('HOSPITAL_PINCODE', '431203');
  },
  /** One-line address used in booking confirmations. */
  get fullAddress() {
    return `${this.addressLine}, ${this.city} – ${this.pincode}`;
  },
  /** Reception / emergency number given to patients in API messages. Env: HOSPITAL_HELPLINE */
  get helpline() {
    return env('HOSPITAL_HELPLINE', '+91-75073-42222');
  },
  /** Optional landline. Env: HOSPITAL_LANDLINE */
  get landline() {
    return env('HOSPITAL_LANDLINE', '02482-223322');
  },
  /** Env: HOSPITAL_EMAIL */
  get email() {
    return env('HOSPITAL_EMAIL', 'admin@sanjeevanihosp.in');
  },
  /**
   * Testing switch: every doctor can be booked online every day, 08:00–22:00,
   * whatever their saved OPD timings say. On by default while the hospital
   * tests online booking. Set BOOKING_OPEN_ALL_DOCTORS=false before going live
   * so patients see each doctor's real timings from the OPD timings screen.
   */
  get openAllDoctors() {
    return env('BOOKING_OPEN_ALL_DOCTORS', 'true').toLowerCase() !== 'false';
  },
};

/** Shorthand for HOSPITAL.id. A function so the env value is read at call time. */
export const hospitalId = (): string => HOSPITAL.id;
