/**
 * Patient reviews and hospital events (health camps). Port of backend/src/reviews-events/*.
 * Data comes only from D1 (patient_reviews, hospital_events); the old in-memory
 * sample reviews and camps are gone.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { all, first, run, uuid, nowIso } from '../lib/db';
import { badRequest, body, clientIp, notFound, ok, tooMany } from '../lib/http';
import { ADMINS, requireRoles } from '../lib/auth';
import { hit } from '../lib/ratelimit';
import { logAction } from '../lib/audit';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

const REVIEW_STATUSES: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
const EVENT_STATUSES: EventStatus[] = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
const SOURCES = ['DIRECT', 'GOOGLE', 'PRACTO', 'JUSTDIAL'];
const CATEGORIES = ['HEALTH_CAMP', 'AWARENESS_SEMINAR', 'FREE_CHECKUP', 'VACCINATION_DRIVE', 'DIAGNOSTIC_CAMP', 'CME'];
const DAY_MS = 24 * 3600_000;

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const opt = (v: unknown, max = 200) => str(v, max) || undefined;
const undef = <T>(v: T | null | undefined) => (v === null ? undefined : v);

/** D1 row → PatientReviewRecord (camelCase; column `comment` is `reviewText`). */
function toReview(r: Record<string, any>) {
  return {
    id: r.id,
    hospitalId: r.hospital_id,
    patientName: r.patient_name,
    patientLocation: undef(r.patient_location),
    rating: r.rating,
    reviewText: r.comment,
    doctorId: undef(r.doctor_id),
    doctorName: undef(r.doctor_name),
    department: undef(r.department),
    treatmentType: undef(r.treatment_type),
    status: r.status as ReviewStatus,
    moderationNote: undef(r.moderation_note),
    isVerifiedPatient: r.is_verified_patient === 1,
    helpfulCount: r.helpful_count ?? 0,
    source: r.source,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** D1 row → HospitalEventRecord. */
function toEvent(r: Record<string, any>) {
  return {
    id: r.id,
    hospitalId: r.hospital_id,
    title: r.title,
    titleMr: r.title_mr ?? '',
    description: r.description,
    descriptionMr: r.description_mr ?? '',
    eventDate: r.event_date,
    eventTime: r.event_time ?? '',
    venue: r.venue ?? '',
    category: r.category,
    organizer: r.organizer ?? '',
    featuredDoctor: undef(r.featured_doctor),
    registrationRequired: r.registration_required === 1,
    registrationPhone: undef(r.registration_phone),
    isFree: r.is_free === 1,
    status: r.status as EventStatus,
    attendeesCount: r.attendees_count ?? 0,
    imageUrl: undef(r.image_url),
    createdAt: r.created_at,
  };
}

const getReview = async (env: Env, id: string) =>
  first(env, `SELECT * FROM patient_reviews WHERE id = ? AND hospital_id = ?`, id, hospital(env).id);
const getEvent = async (env: Env, id: string) =>
  first(env, `SELECT * FROM hospital_events WHERE id = ? AND hospital_id = ?`, id, hospital(env).id);

export const reviewsEventsRoutes = new Hono<AppEnv>();
const r = reviewsEventsRoutes;

// ─── Public: patient reviews ────────────────────────────────────────────────

r.get('/reviews', async (c) => {
  const rows = await all(
    c.env,
    `SELECT * FROM patient_reviews WHERE hospital_id = ? AND status = 'APPROVED' ORDER BY created_at DESC LIMIT 200`,
    hospital(c.env).id,
  );
  return ok(c, rows.map(toReview));
});

r.get('/reviews/stats', async (c) => {
  const s = await first(
    c.env,
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'APPROVED') AS approved,
       SUM(status = 'PENDING') AS pending,
       SUM(status = 'REJECTED') AS rejected,
       AVG(CASE WHEN status = 'APPROVED' THEN rating END) AS avg_rating,
       SUM(status = 'APPROVED' AND rating = 5) AS five,
       SUM(status = 'APPROVED' AND rating = 4) AS four,
       SUM(status = 'APPROVED' AND rating <= 3) AS three_or_below
     FROM patient_reviews WHERE hospital_id = ?`,
    hospital(c.env).id,
  );
  return ok(c, {
    totalReviews: s?.total ?? 0,
    approvedReviews: s?.approved ?? 0,
    pendingModeration: s?.pending ?? 0,
    rejectedReviews: s?.rejected ?? 0,
    averageRating: s?.avg_rating ? Math.round(s.avg_rating * 10) / 10 : 0,
    fiveStarCount: s?.five ?? 0,
    fourStarCount: s?.four ?? 0,
    threeStarOrBelow: s?.three_or_below ?? 0,
  });
});

r.post('/reviews/submit', async (c) => {
  if (!(await hit(c.env, `review:${clientIp(c)}`, 5, DAY_MS))) {
    throw tooMany('Too many reviews from this connection today. Please try again tomorrow.');
  }
  const b = await body(c);
  const patientName = str(b?.patientName, 100);
  const rating = Number(b?.rating);
  const reviewText = str(b?.reviewText, 2000);
  if (!patientName) throw badRequest('Please enter your name.');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw badRequest('Rating must be between 1 and 5.');
  if (reviewText.length < 20) throw badRequest('Review must be at least 20 characters to help other patients.');

  const id = uuid();
  const now = nowIso();
  await run(
    c.env,
    `INSERT INTO patient_reviews (id, hospital_id, patient_name, patient_location, rating, comment, doctor_id, doctor_name,
       department, treatment_type, status, is_verified_patient, helpful_count, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 0, 0, ?, ?, ?)`,
    id,
    hospital(c.env).id,
    patientName,
    opt(b?.patientLocation, 100),
    rating,
    reviewText,
    opt(b?.doctorId, 60),
    opt(b?.doctorName, 100),
    opt(b?.department, 100),
    opt(b?.treatmentType, 120),
    SOURCES.includes(b?.source) ? b.source : 'DIRECT',
    now,
    now,
  );
  return ok(
    c,
    {
      id,
      message:
        'Thank you for your feedback. Your review has been submitted for moderation and will be published after verification.',
    },
    201,
  );
});

r.patch('/reviews/:id/helpful', async (c) => {
  if (!(await hit(c.env, `helpful:${clientIp(c)}`, 30, DAY_MS))) {
    throw tooMany('Too many votes from this connection today. Please try again tomorrow.');
  }
  const row = await first<{ helpful_count: number }>(
    c.env,
    `UPDATE patient_reviews SET helpful_count = helpful_count + 1
     WHERE id = ? AND hospital_id = ? AND status = 'APPROVED' RETURNING helpful_count`,
    c.req.param('id'),
    hospital(c.env).id,
  );
  if (!row) throw notFound('Review not found or not published.');
  return ok(c, { helpfulCount: row.helpful_count });
});

// ─── Public: hospital events ────────────────────────────────────────────────

r.get('/events', async (c) => {
  const rows = await all(
    c.env,
    `SELECT * FROM hospital_events WHERE hospital_id = ? AND is_active = 1 AND status IN ('UPCOMING','ONGOING')
     ORDER BY event_date ASC`,
    hospital(c.env).id,
  );
  return ok(c, rows.map(toEvent));
});

r.get('/events/all', async (c) => {
  const status = c.req.query('status');
  const rows = status
    ? await all(
        c.env,
        `SELECT * FROM hospital_events WHERE hospital_id = ? AND status = ? ORDER BY event_date ASC`,
        hospital(c.env).id,
        status,
      )
    : await all(c.env, `SELECT * FROM hospital_events WHERE hospital_id = ? ORDER BY event_date ASC`, hospital(c.env).id);
  return ok(c, rows.map(toEvent));
});

// ─── Admin: review moderation ───────────────────────────────────────────────

r.get('/admin/reviews', requireRoles(...ADMINS), async (c) => {
  // One hospital per database: ?hospitalId= is accepted for compatibility but cannot widen the scope
  const hospitalId = hospital(c.env).id;
  const status = c.req.query('status');
  const rows = status
    ? await all(
        c.env,
        `SELECT * FROM patient_reviews WHERE hospital_id = ? AND status = ? ORDER BY created_at DESC`,
        hospitalId,
        status,
      )
    : await all(c.env, `SELECT * FROM patient_reviews WHERE hospital_id = ? ORDER BY created_at DESC`, hospitalId);
  return ok(c, rows.map(toReview));
});

r.patch('/admin/reviews/:id/moderate', requireRoles(...ADMINS), async (c) => {
  const id = c.req.param('id');
  const b = await body(c);
  if (!REVIEW_STATUSES.includes(b?.status)) throw badRequest('Status must be PENDING, APPROVED or REJECTED.');
  const note = opt(b?.moderationNote, 500);
  const changed = await run(
    c.env,
    `UPDATE patient_reviews SET status = ?, moderation_note = ?, updated_at = ? WHERE id = ? AND hospital_id = ?`,
    b.status,
    note,
    nowIso(),
    id,
    hospital(c.env).id,
  );
  if (!changed) throw notFound(`Review ${id} not found`);
  const review = toReview((await getReview(c.env, id))!);
  await logAction(c.env, {
    action: `REVIEW_${b.status}`,
    entity: 'PATIENT_REVIEW',
    entityId: id,
    userId: c.get('user').userId,
    metadata: { patientName: review.patientName, rating: review.rating, note },
  });
  return ok(c, review);
});

// ─── Admin: events ──────────────────────────────────────────────────────────

r.post('/admin/events', requireRoles(...ADMINS), async (c) => {
  const b = await body(c);
  const h = hospital(c.env);
  const title = str(b?.title, 200);
  const eventDate = str(b?.eventDate, 10);
  if (!title) throw badRequest('Camp title is missing.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) throw badRequest('Camp date is missing.');
  const id = uuid();
  const now = nowIso();
  await run(
    c.env,
    `INSERT INTO hospital_events (id, hospital_id, title, title_mr, description, description_mr, event_date, event_time, venue,
       category, organizer, featured_doctor, registration_required, registration_phone, is_free, status, attendees_count,
       image_url, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING', 0, ?, 1, ?, ?)`,
    id,
    h.id,
    title,
    str(b?.titleMr, 200),
    str(b?.description, 2000),
    str(b?.descriptionMr, 2000),
    eventDate,
    str(b?.eventTime, 60),
    str(b?.venue, 200),
    CATEGORIES.includes(b?.category) ? b.category : 'HEALTH_CAMP',
    str(b?.organizer, 200) || h.shortName,
    opt(b?.featuredDoctor, 200),
    b?.registrationRequired === true,
    str(b?.registrationPhone, 30) || h.helpline,
    b?.isFree === undefined ? true : b.isFree === true,
    opt(b?.imageUrl, 500),
    now,
    now,
  );
  const event = toEvent((await getEvent(c.env, id))!);
  await logAction(c.env, {
    action: 'EVENT_CREATED',
    entity: 'HOSPITAL_EVENT',
    entityId: id,
    userId: c.get('user').userId,
    metadata: { title: event.title, eventDate: event.eventDate, category: event.category },
  });
  return ok(c, event, 201);
});

r.patch('/admin/events/:id/status', requireRoles(...ADMINS), async (c) => {
  const id = c.req.param('id');
  const b = await body(c);
  if (!EVENT_STATUSES.includes(b?.status)) throw badRequest('Status must be UPCOMING, ONGOING, COMPLETED or CANCELLED.');
  const changed = await run(
    c.env,
    `UPDATE hospital_events SET status = ?, updated_at = ? WHERE id = ? AND hospital_id = ?`,
    b.status,
    nowIso(),
    id,
    hospital(c.env).id,
  );
  if (!changed) throw notFound(`Event ${id} not found`);
  return ok(c, toEvent((await getEvent(c.env, id))!));
});
