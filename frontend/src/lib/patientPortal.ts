import { useEffect, useState } from 'react';
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

export interface LabResult {
  id: string;
  date: string;
  test: string;
  value: string;
  unit: string;
  range: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | '';
  note: string;
  createdAt: string;
}

export interface FollowUp {
  date: string;
  doctorId: string;
  doctorName: string;
  note: string;
}

export interface PatientProfile {
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  emergencyName: string;
  emergencyPhone: string;
}

export interface PatientRecord {
  phone: string;
  name: string;
  bills: PatientBill[];
  medicines: PatientMedicine[];
  labResults?: LabResult[];
  followUp?: FollowUp | null;
  profile?: PatientProfile;
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

const AUTH_EVENT = 'sanjeevani-patient-auth';

export const setPatientToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(PATIENT_TOKEN_KEY, token);
    else localStorage.removeItem(PATIENT_TOKEN_KEY);
  } catch {
    /* private mode: stays signed in for this page only */
  }
  // Header and footer update straight away (same page, no navigation)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_EVENT));
};

/** True while a patient is signed in; follows log in / log out on this page and in other tabs. */
export function usePatientSignedIn(): boolean {
  const [signedIn, setSignedIn] = useState(() => !!getPatientToken());
  useEffect(() => {
    const update = () => setSignedIn(!!getPatientToken());
    window.addEventListener(AUTH_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(AUTH_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return signedIn;
}

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

/** Show each notice (key, title, body) at most once a day as a system notification. */
export function notifyOncePerDay(notices: { key: string; title: string; body: string }[]) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const today = todayKey();
  let sent: Record<string, string> = {};
  try {
    sent = JSON.parse(localStorage.getItem(ALERTED_KEY) || '{}');
  } catch {
    sent = {};
  }
  for (const n of notices) {
    if (sent[n.key] === today) continue;
    try {
      new Notification(n.title, { body: n.body, tag: n.key, icon: '/logo.png' });
      sent[n.key] = today;
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

// ─── Today's doses (ticks saved on this device) ───────────────────────────

export type DoseTime = 'morning' | 'afternoon' | 'night';
export const DOSE_TIMES: DoseTime[] = ['morning', 'afternoon', 'night'];

/** "1-0-1" → { morning: "1", afternoon: "", night: "1" }; null when the dose isn't in that form. */
export function parseDosage(dosage: string): Record<DoseTime, string> | null {
  const m = dosage.match(/^\s*(\d+(?:\.\d+)?|½)\s*-\s*(\d+(?:\.\d+)?|½)\s*-\s*(\d+(?:\.\d+)?|½)\s*$/);
  if (!m) return null;
  const v = (x: string) => (x === '0' ? '' : x);
  return { morning: v(m[1]), afternoon: v(m[2]), night: v(m[3]) };
}

const DOSES_KEY = (day: string) => `sanjeevani_doses_${day}`;

export function loadDoseTicks(day = todayKey()): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(DOSES_KEY(day)) || '{}');
  } catch {
    return {};
  }
}

export function saveDoseTicks(ticks: Record<string, boolean>, day = todayKey()) {
  try {
    localStorage.setItem(DOSES_KEY(day), JSON.stringify(ticks));
  } catch {
    /* ticks only last for this visit */
  }
}
