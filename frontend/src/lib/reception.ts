/**
 * Shared types and small helpers for the reception screens:
 * patient registration, reception booking and receipts.
 */

export type ReceiptKind = 'CONSULTATION' | 'REGISTRATION' | 'PROCEDURE' | 'LAB' | 'PHARMACY' | 'ADVANCE' | 'OTHER';
export type PaymentMode = 'CASH' | 'UPI' | 'CARD' | 'ONLINE' | 'CHEQUE' | 'INSURANCE' | 'SCHEME';

export const RECEIPT_KINDS: { value: ReceiptKind; label: string }[] = [
  { value: 'CONSULTATION', label: 'Consultation' },
  { value: 'REGISTRATION', label: 'Registration' },
  { value: 'PROCEDURE', label: 'Procedure' },
  { value: 'LAB', label: 'Lab test' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'ADVANCE', label: 'Advance' },
  { value: 'OTHER', label: 'Other' },
];

export const PAYMENT_MODES: { value: PaymentMode; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'INSURANCE', label: 'Insurance / TPA' },
  { value: 'SCHEME', label: 'Government scheme' },
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const modeLabel = (m: string) => PAYMENT_MODES.find((x) => x.value === m)?.label || m;
export const kindLabel = (k: string) => RECEIPT_KINDS.find((x) => x.value === k)?.label || k;

export interface RegisteredPatient {
  id: string;
  regNo: string;
  name: string;
  phone: string;
  age: number | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  idNumber: string | null;
  scheme: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ReceiptLine {
  name: string;
  qty: number;
  rate: number;
  gstPercent: number;
  amount: number;
  discount: number;
  tax: number;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  status: 'ISSUED' | 'CANCELLED';
  kind: ReceiptKind;
  patientId: string | null;
  patientRegNo: string | null;
  patientName: string;
  patientPhone: string;
  patientAddress: string | null;
  appointmentCode: string | null;
  doctorName: string | null;
  items: ReceiptLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  paymentMode: PaymentMode;
  paymentRef: string | null;
  payments: { amount: number; mode: string; ref: string | null; at: string; by: string | null }[];
  note: string | null;
  issuedByName: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  hospital: { gstin: string | null };
}

export interface ReceiptSummary {
  from: string;
  to: string;
  receiptsIssued: number;
  receiptsCancelled: number;
  billed: number;
  tax: number;
  discount: number;
  collected: number;
  byMode: Record<string, number>;
  outstanding: number;
}

export const inr = (n: number) =>
  `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

/** Today in hospital time (IST), YYYY-MM-DD */
export const todayIst = () => new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);

export const addDays = (key: string, days: number) => {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const dateTimeText = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export const dayText = (key: string) =>
  key ? new Date(`${key}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/** Roles that can use the reception tools */
export const isAdminRole = (role?: string) => role === 'SUPER_ADMIN' || role === 'HOSPITAL_ADMIN';
export const isReceptionRole = (role?: string) => isAdminRole(role) || role === 'RECEPTIONIST';

/** Receipt language, chosen at the top of the receipt screens and remembered in this browser */
export type ReceiptLang = 'en' | 'mr';
const LANG_KEY = 'hospital-receipt-lang';
export const getReceiptLang = (): ReceiptLang => {
  try {
    return localStorage.getItem(LANG_KEY) === 'mr' ? 'mr' : 'en';
  } catch {
    return 'en';
  }
};
export const setReceiptLang = (l: ReceiptLang) => {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
};

export const inputClass =
  'w-full px-3 py-2.5 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';
export const labelClass = 'block text-sm font-medium mb-1';
