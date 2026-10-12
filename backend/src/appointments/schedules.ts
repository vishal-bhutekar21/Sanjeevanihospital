/**
 * Weekly OPD timings per doctor.
 * Admins edit these from the "OPD timings" screen; they are stored in the
 * existing doctor_schedules table (one row per day per session).
 */

export interface OpdSession {
  start: string; // "HH:mm", 24-hour
  end: string; // "HH:mm"
}

export interface WeeklySchedule {
  slotMinutes: number;
  // index 0 = Sunday ... 6 = Saturday; empty array = no OPD that day
  days: OpdSession[][];
}

export interface RosterDoctor {
  id: string;
  name: string;
  department: string;
  fee: number;
}

// Same ids, names and fees as the website (frontend/src/data/doctorsData.ts)
export const ROSTER: RosterDoctor[] = [
  { id: 'doc-bagal', name: 'Dr. Baliram Bagal', department: 'ICU & Critical Care', fee: 400 },
  { id: 'doc-mirkad', name: 'Dr. Shivdas Mirkad', department: 'Pediatrics & Neonatology (NICU)', fee: 500 },
  { id: 'doc-rajguru', name: 'Dr. Kailash Rajguru', department: 'Pediatrics & Internal Medicine', fee: 400 },
  { id: 'doc-goyal', name: 'Dr. Nishant Goyal', department: 'Orthopedics & Joint Replacement', fee: 500 },
  { id: 'doc-katole', name: 'Dr. Millind Katole', department: 'Pathology & Diagnostic Laboratory', fee: 300 },
  { id: 'doc-anshul', name: 'Dr. Anshul Pahawa Goyal', department: 'Obstetrics & Gynecology', fee: 500 },
  { id: 'doc-tushar', name: 'Dr. Tushar Agrawal', department: 'Urology & Kidney Stone Care', fee: 600 },
  { id: 'doc-avinash', name: 'Dr. Avinash Paul', department: 'Anesthesiology', fee: 400 },
  { id: 'doc-shashikala', name: 'Dr. Shashikala Kale', department: 'General & Minimally Invasive Surgery', fee: 500 },
  { id: 'doc-atul', name: 'Dr. Atul Kale', department: 'Neurosurgery & Spine Surgery', fee: 700 },
  { id: 'doc-kalyansing', name: 'Dr. Kalyansing Gothwal Rajput', department: 'Surgical Oncology', fee: 700 },
  { id: 'doc-pole', name: 'Dr. Shivaji Pole', department: 'Interventional Radiology', fee: 600 },
  { id: 'doc-annachhatre', name: 'Dr. Suhrad Annachhatre', department: 'Cardiothoracic & Vascular Surgery', fee: 800 },
  { id: 'doc-vanjari', name: 'Dr. Pranav Vanjari', department: 'Neurovascular Interventional Radiology', fee: 700 },
];

const monToSat = (...sessions: OpdSession[]): OpdSession[][] => [
  [], // Sunday
  sessions,
  sessions,
  sessions,
  sessions,
  sessions,
  sessions,
];

const none = (): OpdSession[][] => [[], [], [], [], [], [], []];

/**
 * Starting timings, taken from the hours published on the website.
 * On-call and visiting doctors start with no online OPD (patients are asked
 * to call) until an admin adds their days.
 */
export const DEFAULT_SCHEDULES: Record<string, WeeklySchedule> = {
  'doc-bagal': { slotMinutes: 15, days: none() },
  'doc-mirkad': { slotMinutes: 15, days: monToSat({ start: '10:00', end: '14:00' }, { start: '17:00', end: '20:00' }) },
  'doc-rajguru': { slotMinutes: 15, days: monToSat({ start: '09:00', end: '13:00' }, { start: '17:00', end: '20:00' }) },
  'doc-goyal': { slotMinutes: 15, days: monToSat({ start: '11:00', end: '15:00' }, { start: '18:00', end: '20:00' }) },
  'doc-katole': { slotMinutes: 15, days: monToSat({ start: '09:00', end: '17:00' }) },
  'doc-anshul': { slotMinutes: 15, days: monToSat({ start: '10:30', end: '14:30' }, { start: '17:30', end: '19:30' }) },
  'doc-tushar': { slotMinutes: 15, days: monToSat({ start: '11:00', end: '15:00' }) },
  'doc-avinash': { slotMinutes: 15, days: none() },
  'doc-shashikala': { slotMinutes: 15, days: monToSat({ start: '11:00', end: '15:00' }) },
  'doc-atul': { slotMinutes: 15, days: monToSat({ start: '12:00', end: '16:00' }) },
  'doc-kalyansing': { slotMinutes: 20, days: none() },
  'doc-pole': { slotMinutes: 20, days: none() },
  'doc-annachhatre': { slotMinutes: 20, days: none() },
  'doc-vanjari': { slotMinutes: 20, days: none() },
};

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
export const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** Returns an error message, or null if the schedule is valid. */
export function validateSchedule(s: any): string | null {
  if (!s || typeof s !== 'object') return 'Schedule is missing.';
  if (![10, 15, 20, 30, 45, 60].includes(Number(s.slotMinutes))) {
    return 'Appointment length must be 10, 15, 20, 30, 45 or 60 minutes.';
  }
  if (!Array.isArray(s.days) || s.days.length !== 7) return 'Schedule must have 7 days.';
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (let d = 0; d < 7; d++) {
    const sessions = s.days[d];
    if (!Array.isArray(sessions) || sessions.length > 3) return `${names[d]}: up to 3 sessions per day.`;
    const sorted = [...sessions].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    for (let i = 0; i < sorted.length; i++) {
      const { start, end } = sorted[i] || {};
      if (!HHMM.test(start) || !HHMM.test(end)) return `${names[d]}: times must look like 09:30.`;
      if (toMinutes(end) - toMinutes(start) < Number(s.slotMinutes)) {
        return `${names[d]}: each session must be at least one appointment long.`;
      }
      if (i > 0 && toMinutes(start) < toMinutes(sorted[i - 1].end)) return `${names[d]}: sessions overlap.`;
    }
  }
  return null;
}

/** Normalised copy: sessions sorted, numbers coerced. */
export function cleanSchedule(s: WeeklySchedule): WeeklySchedule {
  return {
    slotMinutes: Number(s.slotMinutes),
    days: s.days.map((sessions) =>
      [...sessions]
        .map(({ start, end }) => ({ start, end }))
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start)),
    ),
  };
}
