import type { Env } from '../env';

export const uuid = () => crypto.randomUUID();
export const nowIso = () => new Date().toISOString();

type Arg = string | number | null | undefined | boolean;
const norm = (args: Arg[]) => args.map((a) => (a === undefined ? null : typeof a === 'boolean' ? (a ? 1 : 0) : a));

export async function first<T = Record<string, any>>(env: Env, sql: string, ...args: Arg[]): Promise<T | null> {
  return (await env.DB.prepare(sql).bind(...norm(args)).first<T>()) ?? null;
}

export async function all<T = Record<string, any>>(env: Env, sql: string, ...args: Arg[]): Promise<T[]> {
  const r = await env.DB.prepare(sql).bind(...norm(args)).all<T>();
  return r.results ?? [];
}

/** Returns the number of rows changed. */
export async function run(env: Env, sql: string, ...args: Arg[]): Promise<number> {
  const r = await env.DB.prepare(sql).bind(...norm(args)).run();
  return r.meta?.changes ?? 0;
}

export const stmt = (env: Env, sql: string, ...args: Arg[]) => env.DB.prepare(sql).bind(...norm(args));

/** snake_case row → camelCase object; 0/1 columns named is_* / *_verified* / registration_required stay numbers unless listed. */
export function camel<T = any>(row: Record<string, any> | null, bools: string[] = []): T {
  if (!row) return row as T;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
    out[key] = bools.includes(k) ? v === 1 || v === true : v;
  }
  return out as T;
}
