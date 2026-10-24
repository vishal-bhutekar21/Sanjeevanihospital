/**
 * Read-only catalogue: doctors, departments and the hospital profile.
 * Port of backend/src/{doctors,departments,hospitals}.
 *
 * Doctors come from ROSTER (same ids, names, departments and fees as the website),
 * with extra details from the D1 `doctors` row whose website_id matches (when imported),
 * and weekly timings from doctor_schedules (falling back to DEFAULT_SCHEDULES).
 * Departments are the website's six departments (same slugs as
 * frontend/src/pages/DepartmentsPage.tsx DEPARTMENTS).
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first } from '../lib/db';
import { badRequest, notFound, ok } from '../lib/http';
import { DEFAULT_SCHEDULES, ROSTER, cleanSchedule, type RosterDoctor, type WeeklySchedule } from '../data/roster';

// ─── Doctors ────────────────────────────────────────────────────────────────

const EMPTY_WEEK = (): WeeklySchedule => ({ slotMinutes: 15, days: [[], [], [], [], [], [], []] });

/** Saved weekly timings per website doctor id; DEFAULT_SCHEDULES where nothing is saved. */
async function schedules(env: Env, doctorId?: string): Promise<Map<string, WeeklySchedule>> {
  const rows = doctorId
    ? await all(
        env,
        `SELECT doctor_id, day_of_week, start_time, end_time, slot_duration_mins FROM doctor_schedules
         WHERE is_active = 1 AND doctor_id = ? ORDER BY day_of_week, start_time`,
        doctorId,
      )
    : await all(
        env,
        `SELECT doctor_id, day_of_week, start_time, end_time, slot_duration_mins FROM doctor_schedules
         WHERE is_active = 1 ORDER BY doctor_id, day_of_week, start_time`,
      );
  const saved = new Map<string, WeeklySchedule>();
  for (const r of rows) {
    const s: WeeklySchedule = saved.get(r.doctor_id) || { slotMinutes: r.slot_duration_mins, days: [[], [], [], [], [], [], []] };
    s.days[r.day_of_week]?.push({ start: r.start_time, end: r.end_time });
    saved.set(r.doctor_id, s);
  }
  const out = new Map<string, WeeklySchedule>();
  for (const d of ROSTER) {
    const s = saved.get(d.id) || DEFAULT_SCHEDULES[d.id];
    out.set(d.id, s ? cleanSchedule(s) : EMPTY_WEEK());
  }
  return out;
}

/** "17:00" → "05:00 PM" */
const label = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Same style as before, e.g. "10:00 AM – 02:00 PM & 05:00 PM – 08:00 PM"; '' when no OPD is set. */
function timingsText(s: WeeklySchedule): string {
  const sets = new Set(
    s.days.filter((d) => d.length > 0).map((d) => d.map((x) => `${label(x.start)} – ${label(x.end)}`).join(' & ')),
  );
  return [...sets].join('; ');
}

async function doctorDetails(env: Env, websiteId?: string) {
  const rows = websiteId
    ? await all(
        env,
        `SELECT website_id, department_id, designation, specialty, qualifications, experience_years, is_active
         FROM doctors WHERE website_id = ?`,
        websiteId,
      )
    : await all(
        env,
        `SELECT website_id, department_id, designation, specialty, qualifications, experience_years, is_active
         FROM doctors WHERE website_id IS NOT NULL`,
      );
  return new Map(rows.map((r) => [r.website_id as string, r]));
}

function toDoctor(d: RosterDoctor, row: Record<string, any> | undefined, s: WeeklySchedule) {
  return {
    id: d.id,
    name: d.name,
    designation: row?.designation ?? null,
    qualifications: row?.qualifications ?? null,
    departmentId: row?.department_id ?? null,
    departmentName: d.department,
    specialty: row?.specialty ?? null,
    experienceYears: row?.experience_years ?? null,
    consultationFee: d.fee, // 0 = not published; patients pay at the counter
    isActive: row ? row.is_active === 1 : true,
    availableDays: s.days.map((sessions, day) => (sessions.length ? day : -1)).filter((day) => day >= 0),
    timings: timingsText(s),
  };
}

export const doctorRoutes = new Hono<AppEnv>();

doctorRoutes.get('/', async (c) => {
  const departmentId = c.req.query('departmentId');
  const q = c.req.query('search')?.trim().toLowerCase();
  const [sch, details] = await Promise.all([schedules(c.env), doctorDetails(c.env)]);
  let list = ROSTER.map((d) => toDoctor(d, details.get(d.id), sch.get(d.id)!));
  if (departmentId) list = list.filter((d) => d.departmentId === departmentId);
  if (q) {
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.specialty || '').toLowerCase().includes(q) ||
        d.departmentName.toLowerCase().includes(q),
    );
  }
  return ok(c, list);
});

const rosterDoctor = (id: string) => {
  const d = ROSTER.find((x) => x.id === id);
  if (!d) throw notFound(`Doctor with ID '${id}' not found`);
  return d;
};

doctorRoutes.get('/:id', async (c) => {
  const d = rosterDoctor(c.req.param('id'));
  const [sch, details] = await Promise.all([schedules(c.env, d.id), doctorDetails(c.env, d.id)]);
  return ok(c, toDoctor(d, details.get(d.id), sch.get(d.id)!));
});

/**
 * The doctor's OPD sessions on a date and their weekly timings.
 * Bookable time slots come from GET /appointments/availability.
 */
doctorRoutes.get('/:id/availability', async (c) => {
  const d = rosterDoctor(c.req.param('id'));
  const date = c.req.query('date') || new Date().toISOString().split('T')[0];
  const day = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(day.getTime())) throw badRequest('Date must look like 2026-08-30.');
  const s = (await schedules(c.env, d.id)).get(d.id)!;
  return ok(c, {
    doctorId: d.id,
    doctorName: d.name,
    date,
    consultationFee: d.fee,
    slotMinutes: s.slotMinutes,
    sessions: s.days[day.getUTCDay()],
    weeklySchedule: s,
  });
});

// ─── Departments ────────────────────────────────────────────────────────────

// Same slugs, names and descriptions as the website (frontend/src/pages/DepartmentsPage.tsx)
const DEPARTMENTS = [
  {
    id: 'dept-ortho',
    slug: 'orthopedics',
    nameEn: 'Orthopaedics and joint replacement',
    nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
    descriptionEn: 'Fractures, knee and hip replacement, and back and spine problems. Surgery is done in our own operation theatre with X-ray guidance.',
    descriptionMr: 'फ्रॅक्चर, गुडघे व खुबा प्रत्यारोपण आणि पाठीच्या व मणक्याच्या तक्रारी. शस्त्रक्रिया हॉस्पिटलच्याच ऑपरेशन थिएटरमध्ये होते.',
    doctorIds: ['doc-goyal'],
  },
  {
    id: 'dept-peds',
    slug: 'pediatrics',
    nameEn: 'Paediatrics and newborn care (NICU)',
    nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
    descriptionEn: 'Care for newborns, babies and children, including a neonatal ICU for premature and low-weight babies. Vaccinations are given on all OPD days.',
    descriptionMr: 'नवजात बाळे व लहान मुलांचे उपचार. कमी दिवसांच्या व कमी वजनाच्या बाळांसाठी NICU. लसीकरण सर्व ओपीडी दिवशी.',
    doctorIds: ['doc-mirkad', 'doc-rajguru'],
  },
  {
    id: 'dept-icu',
    slug: 'icu-critical-care',
    nameEn: 'ICU and critical care',
    nameMr: 'अतिदक्षता विभाग (ICU)',
    descriptionEn: 'A 21-bed ICU with ventilators and bedside dialysis. An intensivist is on duty day and night.',
    descriptionMr: 'व्हेंटिलेटर व डायलिसिसची सोय असलेला २१ खाटांचा ICU. अतिदक्षतातज्ज्ञ डॉक्टर दिवस-रात्र उपस्थित.',
    doctorIds: ['doc-bagal', 'doc-avinash'],
  },
  {
    id: 'dept-gyn',
    slug: 'obstetrics-gynecology',
    nameEn: 'Obstetrics and gynaecology',
    nameMr: 'प्रसूती आणि स्त्रीरोग',
    descriptionEn: 'Pregnancy check-ups, normal and caesarean delivery, and treatment for women’s health problems, including keyhole surgery.',
    descriptionMr: 'गर्भावस्था तपासणी, नॉर्मल व सिझेरियन प्रसूती आणि स्त्रियांच्या आजारांवर उपचार, दुर्बिणीद्वारे शस्त्रक्रियेसह.',
    doctorIds: ['doc-anshul'],
  },
  {
    id: 'dept-surg',
    slug: 'general-surgery',
    nameEn: 'General and laparoscopic surgery',
    nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
    descriptionEn: 'Keyhole and open surgery for gallstones, hernia, appendix, piles and fistula. Most patients go home within a few days.',
    descriptionMr: 'पित्ताशयातील खडे, हर्निया, अपेंडिक्स, मूळव्याध व फिस्टुला यांच्या दुर्बिणीद्वारे व नेहमीच्या शस्त्रक्रिया.',
    doctorIds: ['doc-shashikala', 'doc-kalyansing'],
  },
  {
    id: 'dept-med',
    slug: 'internal-medicine',
    nameEn: 'Internal medicine',
    nameMr: 'इंटरनल मेडिसिन (फिजिशियन)',
    descriptionEn: 'Diagnosis and ongoing care for diabetes, blood pressure, fevers and infections. The casualty ward takes medical emergencies at any hour.',
    descriptionMr: 'मधुमेह, रक्तदाब, ताप व संसर्गजन्य आजारांचे निदान व उपचार. आपत्कालीन रुग्णांसाठी कॅज्युअल्टी २४ तास.',
    doctorIds: ['doc-rajguru'],
  },
].map((d) => ({ ...d, isActive: true }));

export const departmentRoutes = new Hono<AppEnv>();

departmentRoutes.get('/', (c) => ok(c, DEPARTMENTS));

departmentRoutes.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) throw notFound(`Department '${slug}' not found`);
  return ok(c, dept);
});

// ─── Hospital profile ───────────────────────────────────────────────────────

export const hospitalRoutes = new Hono<AppEnv>();

hospitalRoutes.get('/profile', async (c) => {
  const h = hospital(c.env);
  const vars = c.env as unknown as Record<string, string | undefined>;
  // Imported hospitals row (Supabase) for tagline, founding year and map position, when present
  const row = await first(c.env, `SELECT * FROM hospitals WHERE id = ? OR slug = ? LIMIT 1`, h.id, h.slug);
  return ok(c, {
    id: h.id,
    name: h.name,
    slug: h.slug,
    tagline: vars.HOSPITAL_TAGLINE?.trim() || row?.tagline || null,
    establishedYear: Number(vars.HOSPITAL_FOUNDED_YEAR) || row?.established_year || null,
    address: {
      line: h.addressLine,
      city: h.city,
      state: h.state,
      pincode: h.pincode,
      country: 'India',
      coordinates: row?.latitude != null && row?.longitude != null ? { latitude: row.latitude, longitude: row.longitude } : null,
    },
    contacts: {
      reception: h.helpline,
      landline: vars.HOSPITAL_LANDLINE?.trim() || null,
      emergency: h.helpline,
      email: h.email,
    },
    // Same hours as frontend/src/config/hospital.ts opdHours.contactMorning / contactEvening
    timings: {
      opdMorning: '09:00 AM – 03:00 PM',
      opdEvening: '05:00 PM – 08:00 PM',
      emergency: '24 Hours / 7 Days a Week',
    },
  });
});
