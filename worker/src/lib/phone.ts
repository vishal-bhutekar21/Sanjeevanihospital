import { badRequest } from './http';

/** Accepts "+91 98765 43210", "919876543210" or "9876543210"; returns 10 digits. */
export function normalisePhone(raw: unknown): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  if (!/^[6-9]\d{9}$/.test(ten)) throw badRequest('Enter a valid 10-digit mobile number.');
  return ten;
}
