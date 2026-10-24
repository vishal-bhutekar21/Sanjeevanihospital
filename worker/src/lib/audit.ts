import type { Env } from '../env';
import { hospital } from './config';
import { run, uuid } from './db';

export async function logAction(
  env: Env,
  a: { action: string; entity: string; entityId: string; userId?: string; metadata?: unknown },
) {
  try {
    await run(
      env,
      `INSERT INTO audit_logs (id, hospital_id, user_id, action, entity, entity_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      uuid(),
      hospital(env).id,
      a.userId ?? null,
      a.action,
      a.entity,
      a.entityId,
      a.metadata === undefined ? null : JSON.stringify(a.metadata),
    );
  } catch (err) {
    console.error('audit log failed', (err as Error).message);
  }
}
