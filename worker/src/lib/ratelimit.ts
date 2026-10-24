import type { Env } from '../env';

/**
 * Fixed-window counter in D1. Returns true when this hit is allowed.
 * One atomic upsert, so concurrent requests can't both slip under the limit.
 */
export async function hit(env: Env, key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, count, reset_at) VALUES (?1, 1, ?2)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN rate_limits.reset_at <= ?3 THEN 1 ELSE rate_limits.count + 1 END,
       reset_at = CASE WHEN rate_limits.reset_at <= ?3 THEN ?2 ELSE rate_limits.reset_at END
     RETURNING count`,
  )
    .bind(key, now + windowMs, now)
    .first<{ count: number }>();
  return (row?.count ?? 1) <= limit;
}
