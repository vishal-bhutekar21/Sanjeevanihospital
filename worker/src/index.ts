/**
 * Hospital API on Cloudflare Workers + D1.
 * Same URLs and response shapes as the old NestJS server (backend/), under /api:
 *   success: { success: true, data, message }
 *   error:   { success: false, error: { code, message, path, timestamp } }
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import type { AppEnv, Env } from './env';
import { HttpError, errorBody, ok } from './lib/http';
import { hospital } from './lib/config';
import { authRoutes } from './routes/auth';
import { appointmentRoutes } from './routes/appointments';
import { paymentRoutes } from './routes/payments';
import { patientRecordRoutes, patientPortalRoutes } from './routes/patients';
import { reviewsEventsRoutes } from './routes/reviews';
import { schemeRoutes } from './routes/schemes';
import { doctorRoutes, departmentRoutes, hospitalRoutes } from './routes/catalog';
import { auditRoutes } from './routes/audit';
import { registryRoutes } from './routes/registry';
import { receiptRoutes } from './routes/receipts';
import { cleanup } from './scheduled';

const app = new Hono<AppEnv>().basePath('/api');

app.use('*', secureHeaders());
app.use('*', async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  return cors({
    origin: allowed.includes('*') ? '*' : allowed,
    allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })(c, next);
});

app.get('/health', (c) =>
  ok(c, { status: 'UP', service: `${hospital(c.env).shortName} API`, runtime: 'cloudflare-workers', timestamp: new Date().toISOString() }),
);

app.route('/auth', authRoutes);
app.route('/appointments', appointmentRoutes);
app.route('/payments', paymentRoutes);
app.route('/patient-records', patientRecordRoutes);
app.route('/patient-portal', patientPortalRoutes);
app.route('/reviews-events', reviewsEventsRoutes);
app.route('/schemes', schemeRoutes);
app.route('/doctors', doctorRoutes);
app.route('/departments', departmentRoutes);
app.route('/hospitals', hospitalRoutes);
app.route('/admin/audit-logs', auditRoutes);
app.route('/patients', registryRoutes);
app.route('/receipts', receiptRoutes);

app.notFound((c) => c.json(errorBody(404, `Cannot ${c.req.method} ${new URL(c.req.url).pathname}`, new URL(c.req.url).pathname, 'Not Found'), 404));

app.onError((err, c) => {
  const path = new URL(c.req.url).pathname;
  if (err instanceof HttpError) {
    if (err.status >= 500) console.error(`HTTP ${err.status} ${c.req.method} ${path}: ${err.message}`);
    return c.json(errorBody(err.status, err.message, path, err.code), err.status as any);
  }
  console.error(`HTTP 500 ${c.req.method} ${path}:`, err);
  return c.json(errorBody(500, 'Something went wrong. Please try again.', path), 500);
});

export default {
  fetch: app.fetch,
  // Cron trigger (wrangler.toml): tidy expired OTP codes, holds and sessions
  scheduled: async (_controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    ctx.waitUntil(cleanup(env));
  },
} satisfies ExportedHandler<Env>;

export { app };
