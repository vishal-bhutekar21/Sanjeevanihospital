/**
 * Patient portal: sign-in token, data loading and medicine alerts.
 * Patients sign in with their mobile number and an SMS code; the hospital
 * shares bills and medicines from Admin → Patient records.
 */

import { apiUrl } from './api';

export const PATIENT_TOKEN_KEY = 'sanjeevani_patient_token';

export interface BillItem {
  name: string;
  qty: number;
  amount: number;
}

export interface PatientBill {
  id: string;
  billNo: string;
  date: string;
  title: string;
  items: BillItem[];
  total: number;
  paid: number;
  note: string;
  createdAt: string;
}

export interface PatientMedicine {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  instructions: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  quantity: number;
  doctorName: string;
  note: string;
  createdAt: string;
}

export interface PortalAppointment {
  appointmentCode: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  paymentStatus: string;
  fee: number;
}

export interface PatientRecord {
  phone: string;
  name: string;
  bills: PatientBill[];
  medicines: PatientMedicine[];
  appointments?: PortalAppointment[];
  updatedAt: string;
}

export class PortalError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getPatientToken = (): string | null => {
  try {
    return localStorage.getItem(PATIENT_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setPatientToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(PATIENT_TOKEN_KEY, token);
    else localStorage.removeItem(PATIENT_TOKEN_KEY);
  } catch {
    /* private mode: stays signed in for this page only */
  }
};

export async function portalCall<T = any>(path: string, body?: unknown, token?: string | null): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new PortalError('Could not reach the hospital server. Check your internet and try again.', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    throw new PortalError(json?.error?.message || json?.message || 'Something went wrong. Please try again.', res.status);
  }
  return json.data as T;
}

// ─── Dates ────────────────────────────────────────────────────────────────

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Whole days from today to the date (negative = past). */
export const daysUntil = (key: string, today = todayKey()) =>
  Math.round((new Date(`${key}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000);

// ─── Medicine alerts ──────────────────────────────────────────────────────

export interface MedicineAlert {
  med: PatientMedicine;
  kind: 'expired' | 'expiring' | 'course-ending';
  days: number;
}

/** Packs expired or expiring within 30 days, and courses ending within 3 days. Most urgent first. */
export function medicineAlerts(meds: PatientMedicine[], today = todayKey()): MedicineAlert[] {
  const out: MedicineAlert[] = [];
  for (const med of meds) {
    if (med.expiryDate) {
      const d = daysUntil(med.expiryDate, today);
      if (d < 0) out.push({ med, kind: 'expired', days: d });
      else if (d <= 30) out.push({ med, kind: 'expiring', days: d });
    }
    if (med.endDate) {
      const d = daysUntil(med.endDate, today);
      if (d >= 0 && d <= 3) out.push({ med, kind: 'course-ending', days: d });
    }
  }
  const rank = { expired: 0, expiring: 1, 'course-ending': 2 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind] || a.days - b.days);
}

export const medicineActive = (m: PatientMedicine, today = todayKey()) => !m.endDate || m.endDate >= today;

// ─── Phone notifications (while the portal is open) ───────────────────────

const ALERTED_KEY = 'sanjeevani_patient_alerted_v1';

export const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window;

/** Show each medicine alert once a day as a system notification. */
export function notifyMedicineAlerts(alerts: MedicineAlert[], text: (a: MedicineAlert) => { title: string; body: string }) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const today = todayKey();
  let sent: Record<string, string> = {};
  try {
    sent = JSON.parse(localStorage.getItem(ALERTED_KEY) || '{}');
  } catch {
    sent = {};
  }
  for (const a of alerts) {
    const key = `${a.med.id}:${a.kind}`;
    if (sent[key] === today) continue;
    try {
      const { title, body } = text(a);
      new Notification(title, { body, tag: key, icon: '/logo.png' });
      sent[key] = today;
    } catch {
      return; // some phones only allow notifications from an installed app
    }
  }
  try {
    localStorage.setItem(ALERTED_KEY, JSON.stringify(sent));
  } catch {
    /* harmless: may notify again */
  }
}
