/** Bindings and settings (wrangler.toml [vars] + secrets). */
export interface Env {
  DB: D1Database;
  ENVIRONMENT: string; // "production" | "development"
  ALLOWED_ORIGINS: string;
  BOOKING_OPEN_ALL_DOCTORS: string;
  REQUIRE_OTP: string;
  HOSPITAL_TENANT_ID: string;
  HOSPITAL_NAME: string;
  HOSPITAL_SHORT_NAME: string;
  HOSPITAL_SLUG: string;
  HOSPITAL_ADDRESS: string;
  HOSPITAL_CITY: string;
  HOSPITAL_STATE: string;
  HOSPITAL_PINCODE: string;
  HOSPITAL_HELPLINE: string;
  HOSPITAL_EMAIL: string;
  // Secrets
  JWT_SECRET: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  MSG91_AUTH_KEY?: string;
  MSG91_TEMPLATE_ID?: string;
}

/** Who is calling, from the Bearer token. */
export interface AuthUser {
  userId: string;
  email?: string;
  role: string; // AdminRole, or PATIENT_EPHEMERAL / PATIENT
  hospitalId?: string;
  type?: string; // BOOKING_SESSION | PATIENT_PORTAL | undefined (staff)
  phone?: string;
  phoneVerified: boolean;
}

export type AppEnv = { Bindings: Env; Variables: { user: AuthUser } };

export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];
