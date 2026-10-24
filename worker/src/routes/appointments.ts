/**
 * Online OPD booking. Port of backend/src/appointments (controller, service, dto/).
 * Sessions, slot holds, appointments and OPD timings are stored in D1.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital, openAllDoctors } from '../lib/config';
import { badRequest, conflict, notFound, ok, body } from '../lib/http';
import { all, first, run, stmt, uuid, nowIso } from '../lib/db';
import { FRONT_DESK, STAFF, requirePatient, requireRoles } from '../lib/auth';
import { logAction } from '../lib/audit';
import {
  ROSTER,
  DEFAULT_SCHEDULES,
  OPEN_ALL_SCHEDULE,
  cleanSchedule,
  validateSchedule,
  toMinutes,
  type WeeklySchedule,
} from '../data/roster';

export const appointmentRoutes = new Hono<AppEnv>();

const SESSION_TTL_MS = 30 * 60 * 1000;
const HOLD_MS = 10 * 60 * 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isStr = (v: unknown): v is string => typeof v === 'string';
const need = (v: unknown, field: string): string => {
  if (!isStr(v)) throw badRequest(`${field} must be a string`);
  if (v.trim() === '') throw badRequest(`${field} should not be empty`);
  return v;
};

const findDoctor = (id: string) => ROSTER.find((d) => d.id === id);

// ─── OPD timings ─────────────────────────────────────────────────────────────

type ScheduleRow = { doctor_id: string; day_of_week: number; start_time: string; end_time: string; slot_duration_mins: number; is_active: number };

/**
 * Rows → schedule. A doctor with no rows uses DEFAULT_SCHEDULES. A doctor saved with
 * no OPD at all keeps one inactive marker row so the "no OPD" choice sticks.
 */
function fromRows(doctorId: string, rows: ScheduleRow[]): WeeklySchedule | undefined {
  if (rows.length === 0) {
    const d = DEFAULT_SCHEDULES[doctorId];
    return d ? cleanSchedule(d) : undefined;
  }
  const days: { start: string; end: string }[][] = [[], [], [], [], [], [], []];
  rows.filter((r) => r.is_active === 1).forEach((r) => days[r.day_of_week]?.push({ start: r.start_time, end: r.end_time }));
  return cleanSchedule({ slotMinutes: rows[0].slot_duration_mins, days });
}

async function loadSchedule(env: Env, doctorId: string): Promise<WeeklySchedule | undefined> {
  const rows = await all<ScheduleRow>(
    env,
    `SELECT doctor_id, day_of_week, start_time, end_time, slot_duration_mins, is_active FROM doctor_schedules
     WHERE doctor_id = ? ORDER BY day_of_week, start_time`,
    doctorId,
  );
  return fromRows(doctorId, rows);
}

async function loadAllSchedules(env: Env): Promise<Map<string, WeeklySchedule | undefined>> {
  const rows = await all<ScheduleRow>(
    env,
    `SELECT doctor_id, day_of_week, start_time, end_time, slot_duration_mins, is_active FROM doctor_schedules
     ORDER BY doctor_id, day_of_week, start_time`,
  );
  const map = new Map<string, WeeklySchedule | undefined>();
  for (const d of ROSTER) map.set(d.id, fromRows(d.id, rows.filter((r) => r.doctor_id === d.id)));
  return map;
}

/** Timings patients book against: the saved ones, or every day while the testing switch is on. */
async function bookingSchedule(env: Env, doctorId: string) {
  return openAllDoctors(env) ? OPEN_ALL_SCHEDULE : loadSchedule(env, doctorId);
}

const EMPTY_SCHEDULE = (): WeeklySchedule => ({ slotMinutes: 15, days: [[], [], [], [], [], [], []] });

// ─── Slot generation ─────────────────────────────────────────────────────────

const formatMins = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
};

interface GeneratedSlot {
  minutes: number;
  startTime: string;
  endTime: string;
}

/**
 * Times offered on this date by the schedule (hospital time, IST; nothing earlier
 * than now + 30 min today, nothing on past dates). dayOff when no OPD that weekday.
 */
function offeredSlots(schedule: WeeklySchedule, targetDate: string): { dayOff: boolean; slots: GeneratedSlot[] } {
  const nowIst = new Date(Date.now() + 330 * 60 * 1000);
  const todayIst = nowIst.toISOString().split('T')[0];
  const weekday = new Date(`${targetDate}T00:00:00Z`).getUTCDay();
  const sessions = schedule.days[weekday] || [];
  if (targetDate < todayIst || sessions.length === 0) return { dayOff: sessions.length === 0, slots: [] };
  const minStartMins = targetDate === todayIst ? nowIst.getUTCHours() * 60 + nowIst.getUTCMinutes() + 30 : -1;
  const interval = schedule.slotMinutes;
  const slots: GeneratedSlot[] = [];
  for (const s of sessions) {
    const endMins = toMinutes(s.end);
    for (let cur = toMinutes(s.start); cur + interval <= endMins; cur += interval) {
      if (cur < minStartMins) continue;
      slots.push({ minutes: cur, startTime: formatMins(cur), endTime: formatMins(cur + interval) });
    }
  }
  return { dayOff: false, slots };
}

const slotId = (doctorId: string, date: string, minutes: number) => `slot_${doctorId}_${date}_${minutes}`;

// ─── Appointment rows → API objects ──────────────────────────────────────────

/** Same camelCase fields as the old ConfirmedAppointmentRecord. */
function toAppointment(r: Record<string, any>) {
  const doc = findDoctor(r.doctor_id);
  return {
    id: r.id,
    appointmentCode: r.appointment_code,
    bookingSessionId: r.session_id ?? undefined,
    slotId: r.slot_id ?? undefined,
    hospitalId: r.hospital_id,
    doctorId: r.doctor_id,
    doctorName: r.doctor_name ?? doc?.name ?? '',
    department: r.department_name ?? doc?.department ?? '',
    patientName: r.patient_name,
    patientPhone: r.patient_phone,
    patientAge: r.patient_age,
    patientGender: r.patient_gender ?? '',
    patientAddress: r.patient_address ?? '',
    appointmentDate: r.appointment_date,
    startTime: r.start_time,
    endTime: r.end_time ?? '',
    status: r.status,
    paymentStatus: r.payment_status,
    phoneVerified: r.phone_verified !== 0,
    fee: r.fee,
    paymentId: r.razorpay_payment_id ?? undefined,
    createdAt: r.created_at,
  };
}
type Appointment = ReturnType<typeof toAppointment>;

function confirmationResponse(env: Env, apt: Appointment) {
  const h = hospital(env);
  return {
    appointmentCode: apt.appointmentCode,
    appointment: apt,
    reportingInstructions:
      apt.paymentStatus === 'PAID'
        ? 'Please come to the OPD reception 15 minutes before your time and show this token number.'
        : `Please come to the OPD reception 15 minutes before your time, show this token number and pay the ₹${apt.fee} consultation fee at the counter.`,
    hospitalAddress: h.fullAddress,
    emergencyHelpline: h.helpline,
    message: 'Appointment confirmed',
  };
}

// ─── 1. Booking session (needs the patient token from OTP / Patient login) ───

appointmentRoutes.post('/session/init', requirePatient('BOOKING_SESSION', 'PATIENT_PORTAL'), async (c) => {
  const env = c.env;
  const user = c.get('user');
  const dto = await body<Record<string, unknown>>(c);
  const phoneIn = need(dto.phone, 'phone');
  const patientName = need(dto.patientName, 'patientName');
  if (typeof dto.patientAge !== 'number' || !Number.isFinite(dto.patientAge)) {
    throw badRequest('patientAge must be a number conforming to the specified constraints');
  }
  if (dto.patientAge < 0) throw badRequest('patientAge must not be less than 0');
  if (dto.patientAge > 120) throw badRequest('patientAge must not be greater than 120');
  const patientAge = dto.patientAge;
  const patientGender = need(dto.patientGender, 'patientGender');
  const patientAddress = need(dto.patientAddress, 'patientAddress');
  const doctorId = need(dto.doctorId, 'doctorId');
  if (dto.departmentId !== undefined && dto.departmentId !== null && !isStr(dto.departmentId)) {
    throw badRequest('departmentId must be a string');
  }

  const doctor = findDoctor(doctorId);
  if (!doctor) {
    throw badRequest('Online booking is not available for this doctor yet. Please call reception to book.');
  }

  // Always the number that passed OTP, not what the form sent (last 10 digits)
  const phone = (user.phone || phoneIn).replace(/\D/g, '').slice(-10);
  const phoneVerified = user.phoneVerified !== false;
  const sessionId = uuid();
  const createdAt = nowIso();
  const expiresAt = Date.now() + SESSION_TTL_MS;

  await run(
    env,
    `INSERT INTO booking_sessions
       (id, phone_number, otp_verified_at, patient_name, patient_age, patient_gender, patient_address, doctor_id, status, phone_verified, expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OTP_VERIFIED', ?, ?, ?, ?)`,
    sessionId, phone, phoneVerified ? createdAt : null, patientName, patientAge, patientGender, patientAddress, doctorId,
    phoneVerified, new Date(expiresAt).toISOString(), createdAt, createdAt,
  );
  console.log(`Initialized Booking Session ${sessionId}`);

  return ok(
    c,
    {
      sessionId,
      session: {
        id: sessionId,
        phone,
        phoneVerified,
        patientName,
        patientAge,
        patientGender,
        patientAddress,
        doctorId,
        departmentId: isStr(dto.departmentId) ? dto.departmentId : undefined,
        status: 'OTP_VERIFIED',
        expiresAt,
        createdAt,
      },
      doctor: { id: doctor.id, name: doctor.name, department: doctor.department, fee: doctor.fee },
      message: 'Booking session created. Proceed to slot reservation & payment.',
    },
    201,
  );
});

// ─── 2. Availability (public) ────────────────────────────────────────────────

appointmentRoutes.get('/availability', async (c) => {
  const env = c.env;
  const doctorId = c.req.query('doctorId');
  if (!doctorId) throw badRequest('doctorId is required');
  const targetDate = c.req.query('date') || new Date().toISOString().split('T')[0];
  if (!DATE_RE.test(targetDate)) throw badRequest('Date must be formatted as YYYY-MM-DD');

  const notBookable = { doctorId, date: targetDate, bookable: false, totalSlots: 0, availableSlots: 0, slots: [] };
  const doctor = findDoctor(doctorId);
  if (!doctor) return ok(c, notBookable);
  const schedule = await bookingSchedule(env, doctor.id);
  if (!schedule || !schedule.days.some((d) => d.length > 0)) return ok(c, notBookable);

  const { dayOff, slots: offered } = offeredSlots(schedule, targetDate);
  if (offered.length === 0) {
    return ok(c, { doctorId, date: targetDate, bookable: true, dayOff, totalSlots: 0, availableSlots: 0, slots: [] });
  }

  const rows = await all<{ id: string; start_time: string; status: string; held_until: string | null }>(
    env,
    `SELECT id, start_time, status, held_until FROM appointment_slots WHERE doctor_id = ? AND slot_date = ?`,
    doctor.id,
    targetDate,
  );
  const byTime = new Map(rows.map((r) => [r.start_time, r]));
  const now = nowIso();

  const slots = offered.map((g) => {
    const r = byTime.get(g.startTime);
    // An expired hold counts as free again
    const status = !r || (r.status === 'HELD' && (!r.held_until || r.held_until < now)) ? 'AVAILABLE' : r.status;
    return {
      id: r?.id ?? slotId(doctor.id, targetDate, g.minutes),
      doctorId: doctor.id,
      slotDate: targetDate,
      startTime: g.startTime,
      endTime: g.endTime,
      status,
      ...(status === 'HELD' && r?.held_until ? { heldUntil: Date.parse(r.held_until) } : {}),
    };
  });

  return ok(c, {
    bookable: true,
    doctorId: doctor.id,
    doctorName: doctor.name,
    department: doctor.department,
    date: targetDate,
    fee: doctor.fee,
    totalSlots: slots.length,
    availableSlots: slots.filter((s) => s.status === 'AVAILABLE').length,
    slots,
  });
});

// ─── 3. Hold a time for 10 minutes (race-free) ───────────────────────────────

type SessionRow = {
  id: string;
  phone_number: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string | null;
  patient_address: string | null;
  doctor_id: string;
  status: string;
  phone_verified: number;
  held_slot_id: string | null;
  expires_at: string;
};

const getSession = (env: Env, id: string) => first<SessionRow>(env, `SELECT * FROM booking_sessions WHERE id = ?`, id);

appointmentRoutes.post('/reserve-slot', async (c) => {
  const env = c.env;
  const dto = await body<Record<string, unknown>>(c);
  const bookingSessionId = need(dto.bookingSessionId, 'bookingSessionId');
  const doctorId = need(dto.doctorId, 'doctorId');
  if (!isStr(dto.slotDate) || !DATE_RE.test(dto.slotDate)) throw badRequest('Date must be formatted as YYYY-MM-DD');
  const slotDate = dto.slotDate;
  const startTime = need(dto.startTime, 'startTime');
  need(dto.endTime, 'endTime');

  const session = await getSession(env, bookingSessionId);
  if (!session || Date.now() > Date.parse(session.expires_at)) {
    throw notFound('Your booking session has expired. Please start again.');
  }
  if (session.doctor_id !== doctorId) throw badRequest('Doctor does not match this booking.');
  if (session.status === 'CONFIRMED') throw badRequest('This booking is already confirmed.');

  // The time must really be offered for that date (don't trust the browser)
  const schedule = await bookingSchedule(env, doctorId);
  const wanted = schedule ? offeredSlots(schedule, slotDate).slots.find((s) => s.startTime === startTime) : undefined;
  if (!wanted) throw badRequest('This time is not available for booking. Please choose another time.');

  const now = nowIso();
  const heldUntilMs = Date.now() + HOLD_MS;
  const heldUntil = new Date(heldUntilMs).toISOString();
  const id = slotId(doctorId, slotDate, wanted.minutes);

  const results = await env.DB.batch([
    // Release any other time this session was holding
    stmt(
      env,
      `UPDATE appointment_slots SET status = 'AVAILABLE', held_until = NULL, booking_session_id = NULL, updated_at = ?
       WHERE booking_session_id = ? AND status = 'HELD' AND NOT (doctor_id = ? AND slot_date = ? AND start_time = ?)`,
      now, bookingSessionId, doctorId, slotDate, wanted.startTime,
    ),
    stmt(
      env,
      `INSERT OR IGNORE INTO appointment_slots (id, doctor_id, slot_date, start_time, end_time, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'AVAILABLE', ?, ?)`,
      id, doctorId, slotDate, wanted.startTime, wanted.endTime, now, now,
    ),
    // Take the hold only if free, expired, or already ours
    stmt(
      env,
      `UPDATE appointment_slots SET status = 'HELD', held_until = ?, booking_session_id = ?, updated_at = ?
       WHERE doctor_id = ? AND slot_date = ? AND start_time = ?
         AND (status = 'AVAILABLE' OR (status = 'HELD' AND (held_until IS NULL OR held_until < ? OR booking_session_id = ?)))
       RETURNING id`,
      heldUntil, bookingSessionId, now, doctorId, slotDate, wanted.startTime, now, bookingSessionId,
    ),
  ]);

  const held = (results[2].results?.[0] as { id: string } | undefined)?.id;
  if (!held) {
    const cur = await first<{ status: string }>(
      env,
      `SELECT status FROM appointment_slots WHERE doctor_id = ? AND slot_date = ? AND start_time = ?`,
      doctorId, slotDate, wanted.startTime,
    );
    if (cur?.status === 'CONFIRMED') {
      throw conflict('This appointment slot is already confirmed and booked by another patient.');
    }
    throw conflict('This slot is currently held by another patient completing payment. Please choose an adjacent slot.');
  }

  await run(
    env,
    `UPDATE booking_sessions SET status = 'SLOT_HELD', held_slot_id = ?, updated_at = ? WHERE id = ?`,
    held, now, bookingSessionId,
  );
  console.log(`Slot ${held} HELD for session ${bookingSessionId} until ${heldUntil}`);

  return ok(c, {
    slotId: held,
    status: 'HELD',
    slotDate,
    startTime: wanted.startTime,
    endTime: wanted.endTime,
    heldUntil: heldUntilMs,
    holdExpiresInSeconds: 600,
    message: 'Slot held successfully for 10 minutes. Please complete payment to confirm.',
  });
});

// ─── 4. Confirm and issue the token number ───────────────────────────────────

const appointmentBySession = (env: Env, sessionId: string) =>
  first(env, `SELECT * FROM appointments WHERE session_id = ?`, sessionId);

function appointmentCode(year: string) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return `SMH-${year}-${100000 + (buf[0] % 900000)}`;
}

appointmentRoutes.post('/confirm-slot', async (c) => {
  const env = c.env;
  const dto = await body<Record<string, unknown>>(c);
  const bookingSessionId = need(dto.bookingSessionId, 'bookingSessionId');
  const slotIdIn = need(dto.slotId, 'slotId');
  if (dto.payAtHospital !== undefined && dto.payAtHospital !== null && typeof dto.payAtHospital !== 'boolean') {
    throw badRequest('payAtHospital must be a boolean value');
  }
  const payAtHospital = dto.payAtHospital === true;

  const session = await getSession(env, bookingSessionId);
  if (!session) throw notFound('Booking session expired or not found.');

  // Repeat calls (e.g. double-tap) return the same booking
  const already = await appointmentBySession(env, bookingSessionId);
  if (already) return ok(c, confirmationResponse(env, toAppointment(already)));

  const slot = await first<{ id: string; slot_date: string; start_time: string; end_time: string; status: string; booking_session_id: string | null }>(
    env,
    `SELECT id, slot_date, start_time, end_time, status, booking_session_id FROM appointment_slots WHERE id = ?`,
    slotIdIn,
  );
  if (!slot) throw notFound('Selected appointment slot not found.');
  if (slot.status !== 'HELD' || slot.booking_session_id !== bookingSessionId) {
    throw conflict('Your hold on this time has expired. Please pick the time again.');
  }

  const payment = await first<{ id: string; razorpay_payment_id: string | null }>(
    env,
    `SELECT id, razorpay_payment_id FROM payments WHERE booking_session_id = ? AND status = 'VERIFIED'`,
    bookingSessionId,
  );
  const isPaid = !!payment;
  if (!isPaid && !payAtHospital) throw badRequest('Payment has not been completed for this booking.');

  const doctor = findDoctor(session.doctor_id);
  if (!doctor) throw badRequest('Online booking is not available for this doctor yet. Please call reception to book.');

  const year = slot.slot_date.slice(0, 4);
  const aptId = uuid();

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = appointmentCode(year);
    const now = nowIso();
    try {
      const res = await env.DB.batch([
        stmt(
          env,
          `UPDATE appointment_slots SET status = 'CONFIRMED', held_until = NULL, updated_at = ?
           WHERE id = ? AND status = 'HELD' AND booking_session_id = ?`,
          now, slot.id, bookingSessionId,
        ),
        // Only inserted when this session now owns the confirmed slot
        stmt(
          env,
          `INSERT INTO appointments
             (id, appointment_code, hospital_id, department_id, doctor_id, slot_id, session_id, payment_id,
              patient_name, patient_phone, patient_age, patient_gender, patient_address,
              appointment_date, start_time, end_time, doctor_name, department_name, fee,
              payment_status, razorpay_payment_id, phone_verified, status, created_at, updated_at)
           SELECT ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?
           WHERE EXISTS (SELECT 1 FROM appointment_slots WHERE id = ? AND status = 'CONFIRMED' AND booking_session_id = ?)`,
          aptId, code, hospital(env).id, doctor.id, slot.id, bookingSessionId, payment?.id ?? null,
          session.patient_name, session.phone_number, session.patient_age, session.patient_gender, session.patient_address,
          slot.slot_date, slot.start_time, slot.end_time, doctor.name, doctor.department, doctor.fee,
          isPaid ? 'PAID' : 'PENDING', payment?.razorpay_payment_id ?? null, session.phone_verified !== 0, now, now,
          slot.id, bookingSessionId,
        ),
        stmt(env, `UPDATE booking_sessions SET status = 'CONFIRMED', updated_at = ? WHERE id = ?`, now, bookingSessionId),
      ]);
      if ((res[1].meta?.changes ?? 0) === 0) {
        throw conflict('Your hold on this time has expired. Please pick the time again.');
      }
      break;
    } catch (err) {
      const msg = (err as Error).message || '';
      if (!/UNIQUE/i.test(msg)) throw err;
      // A parallel confirm for this session won: return that booking
      const won = await appointmentBySession(env, bookingSessionId);
      if (won) return ok(c, confirmationResponse(env, toAppointment(won)));
      if (/appointment_code/i.test(msg) && attempt < 4) continue; // token number clash: try another
      throw err;
    }
  }

  const row = await first(env, `SELECT * FROM appointments WHERE id = ?`, aptId);
  const apt = toAppointment(row!);

  await logAction(env, {
    action: 'APPOINTMENT_CONFIRMED',
    entity: 'APPOINTMENT',
    entityId: apt.id,
    metadata: {
      appointmentCode: apt.appointmentCode,
      patientName: apt.patientName,
      doctor: doctor.name,
      slotDate: apt.appointmentDate,
      startTime: apt.startTime,
    },
  });

  return ok(c, confirmationResponse(env, apt));
});

// ─── 5. OPD timings: public read, front desk edit ────────────────────────────

async function scheduleList(env: Env) {
  const map = await loadAllSchedules(env);
  const openAll = openAllDoctors(env);
  return ROSTER.map((d) => ({
    doctorId: d.id,
    name: d.name,
    department: d.department,
    // Everything saved here lives in D1, so saved timings always persist
    savedInDatabase: true,
    schedule: map.get(d.id) || EMPTY_SCHEDULE(),
    openAllDoctors: openAll,
  }));
}

appointmentRoutes.get('/schedules', async (c) => ok(c, await scheduleList(c.env)));

appointmentRoutes.get('/schedules/:doctorId', async (c) => {
  const env = c.env;
  const doctorId = c.req.param('doctorId');
  const doctor = findDoctor(doctorId);
  if (!doctor) throw notFound('Doctor not found.');
  const saved = (await loadSchedule(env, doctorId)) || EMPTY_SCHEDULE();
  return ok(c, {
    doctorId: doctor.id,
    name: doctor.name,
    department: doctor.department,
    savedInDatabase: true,
    schedule: openAllDoctors(env) ? OPEN_ALL_SCHEDULE : saved,
    openAllDoctors: openAllDoctors(env),
  });
});

appointmentRoutes.put('/schedules/:doctorId', requireRoles(...FRONT_DESK), async (c) => {
  const env = c.env;
  const doctorId = c.req.param('doctorId');
  if (!findDoctor(doctorId)) throw notFound('Doctor not found.');
  const input = await body(c);
  const problem = validateSchedule(input);
  if (problem) throw badRequest(problem);
  const schedule = cleanSchedule(input);

  const now = nowIso();
  const inserts = schedule.days.flatMap((sessions, day) =>
    sessions.map((s) =>
      stmt(
        env,
        `INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, slot_duration_mins, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        uuid(), doctorId, day, s.start, s.end, schedule.slotMinutes, now, now,
      ),
    ),
  );
  if (inserts.length === 0) {
    // No OPD any day: keep an inactive marker so the defaults don't come back
    inserts.push(
      stmt(
        env,
        `INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, slot_duration_mins, is_active, created_at, updated_at)
         VALUES (?, ?, 0, '00:00', '00:00', ?, 0, ?, ?)`,
        uuid(), doctorId, schedule.slotMinutes, now, now,
      ),
    );
  }
  try {
    await env.DB.batch([stmt(env, `DELETE FROM doctor_schedules WHERE doctor_id = ?`, doctorId), ...inserts]);
  } catch (err) {
    console.error(`Could not save OPD timings for ${doctorId}: ${(err as Error).message}`);
    throw badRequest('Could not save to the database. Please try again.');
  }

  await logAction(env, {
    userId: c.get('user').userId,
    action: 'OPD_TIMINGS_UPDATED',
    entity: 'DOCTOR_SCHEDULE',
    entityId: doctorId,
    metadata: schedule,
  });

  return ok(c, { doctorId, savedInDatabase: true, schedule });
});

// ─── 6. Staff: list, status, look up by token ────────────────────────────────

appointmentRoutes.get('/', requireRoles(...STAFF), async (c) => {
  const rows = await all(c.env, `SELECT * FROM appointments WHERE hospital_id = ? ORDER BY created_at DESC`, hospital(c.env).id);
  return ok(c, rows.map(toAppointment));
});

const STATUSES = ['CONFIRMED', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

appointmentRoutes.patch('/:id/status', requireRoles(...STAFF), async (c) => {
  const env = c.env;
  const { status } = await body<{ status?: unknown }>(c);
  if (!isStr(status) || !STATUSES.includes(status)) {
    throw badRequest(`status must be one of ${STATUSES.join(', ')}`);
  }
  // Fee is collected at the counter before the consultation ends
  const row = await first(
    env,
    `UPDATE appointments SET status = ?1,
       payment_status = CASE WHEN ?1 = 'COMPLETED' AND payment_status = 'PENDING' THEN 'PAID' ELSE payment_status END,
       updated_at = ?2
     WHERE id = ?3 AND hospital_id = ?4 RETURNING *`,
    status, nowIso(), c.req.param('id'), hospital(env).id,
  );
  if (!row) throw notFound('Appointment not found.');
  return ok(c, toAppointment(row));
});

appointmentRoutes.get('/:code', requireRoles(...STAFF), async (c) => {
  const code = c.req.param('code');
  const row = await first(
    c.env,
    `SELECT * FROM appointments WHERE appointment_code = ? COLLATE NOCASE AND hospital_id = ?`,
    code, hospital(c.env).id,
  );
  if (!row) throw notFound(`No appointment found for token ${code}`);
  return ok(c, toAppointment(row));
});
