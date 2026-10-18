/**
 * Offline fallback for booking: when the booking server can't be reached,
 * work out appointment times from a doctor's published OPD hours text, e.g.
 *   "Mon – Sat: 11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM"
 * Patients can then pick a time and send it to reception as a request.
 */

import { HOSPITAL } from '../config/hospital';

export interface OfflineSlot {
  id: string;
  startTime: string; // "09:30 AM"
  endTime: string;
  status: 'AVAILABLE';
}

const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

const toMinutes = (t: string): number | null => {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
};

const toLabel = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const p = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`;
};

/** Weekdays (0 = Sunday) and sessions in minutes, or null if the text has no clear hours. */
export function parseOpdHours(text: string): { weekdays: number[]; sessions: [number, number][] } | null {
  const m = text.match(/^\s*([A-Za-z]{3})\w*\s*[–-]\s*([A-Za-z]{3})\w*\s*:\s*(.+)$/);
  if (!m) return null;
  const from = DAY_INDEX[m[1].toLowerCase()];
  const to = DAY_INDEX[m[2].toLowerCase()];
  if (from === undefined || to === undefined) return null;

  const weekdays: number[] = [];
  for (let d = from; ; d = (d + 1) % 7) {
    weekdays.push(d);
    if (d === to) break;
  }

  const sessions: [number, number][] = [];
  for (const part of m[3].split('|')) {
    const [a, b] = part.split(/[–-]/);
    const start = a ? toMinutes(a) : null;
    const end = b ? toMinutes(b.replace(/\(.*$/, '')) : null;
    if (start !== null && end !== null && end > start) sessions.push([start, end]);
  }
  return sessions.length ? { weekdays, sessions } : null;
}

/**
 * Hours used for booking: every day between HOSPITAL.booking.openFrom and openTo
 * while the testing switch is on, otherwise the doctor's published hours.
 */
export function bookingHours(text: string): { weekdays: number[]; sessions: [number, number][] } | null {
  const b = HOSPITAL.booking;
  if (b.openAllDoctors) {
    const hm = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
    return { weekdays: [0, 1, 2, 3, 4, 5, 6], sessions: [[hm(b.openFrom), hm(b.openTo)]] };
  }
  return parseOpdHours(text);
}

/** Appointment times for one date, skipping times already past today (plus 30 minutes). */
export function offlineSlots(text: string, dateKey: string, slotMinutes = 15): OfflineSlot[] | null {
  const hours = bookingHours(text);
  if (!hours) return null;
  const [y, mo, d] = dateKey.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  if (!hours.weekdays.includes(date.getDay())) return [];

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : -1;

  const out: OfflineSlot[] = [];
  for (const [start, end] of hours.sessions) {
    for (let t = start; t + slotMinutes <= end; t += slotMinutes) {
      if (t < earliest) continue;
      out.push({ id: `req_${dateKey}_${t}`, startTime: toLabel(t), endTime: toLabel(t + slotMinutes), status: 'AVAILABLE' });
    }
  }
  return out;
}

/** WhatsApp number for offline booking requests. Change it in config/hospital.ts. */
export const HOSPITAL_WHATSAPP = HOSPITAL.phones.whatsapp;
