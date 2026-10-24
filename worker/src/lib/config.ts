import type { Env } from '../env';

/** Hospital details from wrangler.toml [vars]. Same meaning as backend/src/config/hospital.config.ts. */
export function hospital(env: Env) {
  return {
    id: env.HOSPITAL_TENANT_ID,
    name: env.HOSPITAL_NAME,
    shortName: env.HOSPITAL_SHORT_NAME,
    slug: env.HOSPITAL_SLUG,
    addressLine: env.HOSPITAL_ADDRESS,
    city: env.HOSPITAL_CITY,
    state: env.HOSPITAL_STATE,
    pincode: env.HOSPITAL_PINCODE,
    fullAddress: `${env.HOSPITAL_ADDRESS}, ${env.HOSPITAL_CITY} – ${env.HOSPITAL_PINCODE}`,
    helpline: env.HOSPITAL_HELPLINE,
    email: env.HOSPITAL_EMAIL,
  };
}

export const isProduction = (env: Env) => (env.ENVIRONMENT || 'production') === 'production';
export const flag = (v: string | undefined, fallback = false) =>
  v === undefined || v === '' ? fallback : v.trim().toLowerCase() === 'true';
export const openAllDoctors = (env: Env) => flag(env.BOOKING_OPEN_ALL_DOCTORS, true);
