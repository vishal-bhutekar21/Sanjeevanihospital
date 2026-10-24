/**
 * GET /admin/audit-logs — newest first. Port of backend/src/audit (ADMINS only).
 * Query: ?hospitalId= (optional; a HOSPITAL_ADMIN may only ask for their own hospital), ?limit= (default 50, max 500).
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { hospital } from '../lib/config';
import { all } from '../lib/db';
import { forbidden, ok } from '../lib/http';
import { ADMINS, requireRoles } from '../lib/auth';

export const auditRoutes = new Hono<AppEnv>();

auditRoutes.get('/', requireRoles(...ADMINS), async (c) => {
  const user = c.get('user');
  const hospitalId = c.req.query('hospitalId') || c.req.header('x-hospital-id') || hospital(c.env).id;
  // Same rule as the old HospitalIsolationGuard
  if (user.role !== 'SUPER_ADMIN' && user.hospitalId && hospitalId !== user.hospitalId) {
    throw forbidden('Cross-Tenant Isolation Violation: Admin is not authorized to access or mutate records for this hospital.');
  }
  const n = Number(c.req.query('limit'));
  const limit = Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 500) : 50;
  const rows = await all(
    c.env,
    `SELECT * FROM audit_logs WHERE hospital_id = ? ORDER BY created_at DESC LIMIT ?`,
    hospitalId,
    limit,
  );
  return ok(
    c,
    rows.map((r) => {
      let metadata: unknown = undefined;
      if (r.metadata) {
        try {
          metadata = JSON.parse(r.metadata);
        } catch {
          metadata = r.metadata;
        }
      }
      return {
        id: r.id,
        hospitalId: r.hospital_id,
        userId: r.user_id ?? undefined,
        action: r.action,
        entity: r.entity,
        entityId: r.entity_id,
        metadata,
        createdAt: r.created_at,
      };
    }),
  );
});
