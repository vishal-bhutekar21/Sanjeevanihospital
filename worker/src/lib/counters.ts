import type { Env } from '../env';
import { hospital } from './config';
import { first, nowIso, uuid } from './db';

/**
 * Next number for a counter key ("patient", "receipt:2627", ...).
 * One atomic upsert-and-increment statement, so two receptionists never get the same number.
 */
export async function nextNumber(env: Env, key: string): Promise<number> {
  const row = await first<{ value: number }>(
    env,
    `INSERT INTO doc_counters (id, hospital_id, key, value, updated_at) VALUES (?, ?, ?, 1, ?)
     ON CONFLICT (hospital_id, key) DO UPDATE SET value = value + 1, updated_at = excluded.updated_at
     RETURNING value`,
    uuid(),
    hospital(env).id,
    key,
    nowIso(),
  );
  if (!row) throw new Error(`Counter ${key} did not return a value`);
  return Number(row.value);
}

/** Optional settings the old backend read from HOSPITAL_CODE_PREFIX / HOSPITAL_GSTIN (same defaults). */
const extra = (env: Env, name: string) => (env as unknown as Record<string, string | undefined>)[name];

/** Prefix for patient and receipt numbers, e.g. "SMH". */
export const codePrefix = (env: Env) => extra(env, 'HOSPITAL_CODE_PREFIX')?.trim() || 'SMH';

/** Printed on receipts when set; null when the hospital has no GSTIN. */
export const gstin = (env: Env) => extra(env, 'HOSPITAL_GSTIN')?.trim() || null;

/** Indian financial year label for a date, e.g. 2026-10-22 -> "2627" (April to March, hospital time). */
export const financialYear = (d = new Date()): string => {
  const ist = new Date(d.getTime() + 330 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? y : y - 1;
  return `${String(start).slice(-2)}${String(start + 1).slice(-2)}`;
};
