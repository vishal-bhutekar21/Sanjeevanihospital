import type { Env } from './env';

/** Daily tidy-up. Booked appointments are never touched. */
export async function cleanup(env: Env) {
  const now = new Date().toISOString();
  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM otp_sessions WHERE expires_at < ?`).bind(dayAgo),
    env.DB.prepare(`DELETE FROM rate_limits WHERE reset_at < ?`).bind(Date.now()),
    env.DB.prepare(
      `UPDATE appointment_slots SET status = 'AVAILABLE', held_until = NULL, booking_session_id = NULL, updated_at = ?
       WHERE status = 'HELD' AND held_until < ?`,
    ).bind(now, now),
    env.DB.prepare(`DELETE FROM appointment_slots WHERE status = 'AVAILABLE'`),
    env.DB.prepare(`DELETE FROM booking_sessions WHERE expires_at < ? AND id NOT IN (SELECT session_id FROM appointments WHERE session_id IS NOT NULL) AND id NOT IN (SELECT booking_session_id FROM payments)`).bind(dayAgo),
  ]);
}
