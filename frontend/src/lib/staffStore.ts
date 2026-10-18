// Staff, salary payments and reminders, kept in this browser only (localStorage).
// Temporary until the hospital server has staff tables; every storage access is
// wrapped in try/catch so a blocked or full storage never breaks the admin panel.

export const STAFF_ROLES = [
  'Doctor',
  'Nurse',
  'Receptionist',
  'Lab technician',
  'Pharmacist',
  'Ward boy/Attendant',
  'Housekeeping',
  'Accounts',
  'Security',
  'Driver',
  'Other',
] as const;
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Visiting', 'Contract'] as const;
export const STAFF_STATUSES = ['Active', 'On leave', 'Left'] as const;
export const PAYMENT_TYPES = ['Salary', 'Advance', 'Bonus', 'Deduction'] as const;
export const PAYMENT_MODES = ['Cash', 'UPI', 'Bank transfer', 'Cheque'] as const;
export const REPEAT_OPTIONS = ['None', 'Monthly'] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type StaffStatus = (typeof STAFF_STATUSES)[number];
export type PaymentType = (typeof PAYMENT_TYPES)[number];
export type PaymentMode = (typeof PAYMENT_MODES)[number];
export type Repeat = (typeof REPEAT_OPTIONS)[number];

export interface Employee {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
  mobile: string;
  joiningDate: string; // YYYY-MM-DD or ''
  salary: number; // monthly, rupees
  employmentType: EmploymentType;
  status: StaffStatus;
  notes: string;
}

export interface StaffPayment {
  id: string;
  employeeId: string;
  employeeName: string; // kept so the record still reads correctly if the employee is removed
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM the payment is for
  amount: number;
  type: PaymentType;
  mode: PaymentMode;
  reference: string;
  note: string;
}

export interface StaffReminder {
  id: string;
  title: string;
  employeeId: string; // '' when not linked
  employeeName: string;
  dueDate: string; // YYYY-MM-DD
  repeat: Repeat;
  note: string;
  done: boolean;
  doneOn: string; // YYYY-MM-DD or ''
}

export interface StaffData {
  employees: Employee[];
  payments: StaffPayment[];
  reminders: StaffReminder[];
}

export const STAFF_STORAGE_KEY = 'hospital-admin-staff-v1';

export const emptyStaffData = (): StaffData => ({ employees: [], payments: [], reminders: [] });

export function loadStaffData(): StaffData {
  try {
    const raw = window.localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) return emptyStaffData();
    const parsed = JSON.parse(raw);
    return {
      employees: Array.isArray(parsed?.employees) ? parsed.employees : [],
      payments: Array.isArray(parsed?.payments) ? parsed.payments : [],
      reminders: Array.isArray(parsed?.reminders) ? parsed.reminders : [],
    };
  } catch {
    return emptyStaffData();
  }
}

/** Returns false when the browser refused to save (private mode, storage full, blocked). */
export function saveStaffData(data: StaffData): boolean {
  try {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export const newId = () => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

// ---------- Dates (browser local time) ----------

const pad = (n: number) => String(n).padStart(2, '0');
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayIso = () => toIsoDate(new Date());
export const thisMonth = () => todayIso().slice(0, 7);

export const addDays = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return toIsoDate(new Date(y, m - 1, d + days));
};

/** Same day next month; clamps 31st to the last day of a shorter month. */
export const addOneMonth = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const lastDay = new Date(y, m + 1, 0).getDate();
  return toIsoDate(new Date(y, m, Math.min(d, lastDay)));
};

export const monthLabel = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

export const dateLabel = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// ---------- Dues ----------

export interface DueRow {
  employee: Employee;
  salary: number;
  deductions: number;
  owed: number; // salary minus deductions
  paid: number; // salary + bonus + advance paid for the month
  balance: number; // owed - paid (never below zero)
  overpaid: number;
}

/**
 * Dues for a month: every employee who is Active or On leave and had joined by the end
 * of that month. Salary, Bonus and Advance count as paid; Deduction reduces what is owed.
 */
export function computeDues(data: StaffData, month: string): DueRow[] {
  const monthEnd = `${month}-31`;
  return data.employees
    .filter((e) => e.status !== 'Left' && (!e.joiningDate || e.joiningDate <= monthEnd))
    .map((employee) => {
      const own = data.payments.filter((p) => p.employeeId === employee.id && p.month === month);
      const deductions = own.filter((p) => p.type === 'Deduction').reduce((s, p) => s + p.amount, 0);
      const paid = own.filter((p) => p.type !== 'Deduction').reduce((s, p) => s + p.amount, 0);
      const owed = Math.max(0, employee.salary - deductions);
      return {
        employee,
        salary: employee.salary,
        deductions,
        owed,
        paid,
        balance: Math.max(0, owed - paid),
        overpaid: Math.max(0, paid - owed),
      };
    });
}

/** Reminders not done and due on or before seven days from today (overdue included). */
export function remindersDueSoon(data: StaffData, today = todayIso()): StaffReminder[] {
  const limit = addDays(today, 7);
  return data.reminders
    .filter((r) => !r.done && r.dueDate <= limit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// ---------- CSV ----------

const csvCell = (v: string | number) => {
  let s = String(v ?? '');
  // Stop spreadsheet apps from treating a text cell as a formula
  if (typeof v === 'string' && /^[=+\-@]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]): boolean {
  try {
    const text = [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
