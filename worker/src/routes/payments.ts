/**
 * Razorpay online payment. Port of backend/src/payments (controller, service, dto/).
 * Orders and verified payments are stored in the payments table.
 */
import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { hospital } from '../lib/config';
import { HttpError, badRequest, notFound, ok, body } from '../lib/http';
import { all, first, run, uuid, nowIso } from '../lib/db';
import { FRONT_DESK, requireRoles } from '../lib/auth';
import { safeEqual } from '../lib/password';
import { logAction } from '../lib/audit';
import { ROSTER } from '../data/roster';
import { doctorFee } from './appointments';

export const paymentRoutes = new Hono<AppEnv>();

const isStr = (v: unknown): v is string => typeof v === 'string';
const need = (v: unknown, field: string): string => {
  if (!isStr(v)) throw badRequest(`${field} must be a string`);
  if (v.trim() === '') throw badRequest(`${field} should not be empty`);
  return v;
};

const keys = (env: Env) => ({ keyId: env.RAZORPAY_KEY_ID || '', keySecret: env.RAZORPAY_KEY_SECRET || '' });
const onlinePaymentsEnabled = (env: Env) => {
  const k = keys(env);
  return !!k.keyId && !!k.keySecret;
};

/** The fee always comes from the server, never the browser. */
async function sessionForPayment(env: Env, bookingSessionId: string) {
  const s = await first<{ doctor_id: string; held_slot_id: string | null; expires_at: string }>(
    env,
    `SELECT doctor_id, held_slot_id, expires_at FROM booking_sessions WHERE id = ?`,
    bookingSessionId,
  );
  if (!s || Date.now() > Date.parse(s.expires_at)) {
    throw notFound('Your booking session has expired. Please start again.');
  }
  if (!s.held_slot_id) throw badRequest('Please choose an appointment time first.');
  const doctor = ROSTER.find((d) => d.id === s.doctor_id);
  // Current fee, including any change made in the admin panel
  return { fee: await doctorFee(env, s.doctor_id), doctorName: doctor?.name ?? '' };
}

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── 1. Create a Razorpay order for the held booking ─────────────────────────

paymentRoutes.post('/create-order', async (c) => {
  const env = c.env;
  const dto = await body<Record<string, unknown>>(c);
  const bookingSessionId = need(dto.bookingSessionId, 'bookingSessionId');
  const { fee, doctorName } = await sessionForPayment(env, bookingSessionId);

  // No online payment when keys are missing or the doctor's fee isn't set yet
  if (!onlinePaymentsEnabled(env) || !fee || fee <= 0) {
    return ok(c, { paymentsEnabled: false, amountInRupees: fee });
  }

  const paid = await first(env, `SELECT id FROM payments WHERE booking_session_id = ? AND status = 'VERIFIED'`, bookingSessionId);
  if (paid) throw badRequest('Payment for this booking is already complete.');

  const { keyId, keySecret } = keys(env);
  let order: any = {};
  let okRes = false;
  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: fee * 100, // paise
        currency: 'INR',
        receipt: bookingSessionId.slice(0, 40),
        notes: { bookingSessionId, doctor: doctorName },
      }),
    });
    okRes = res.ok;
    order = await res.json().catch(() => ({}));
  } catch (err) {
    order = { fetchError: (err as Error).message };
  }
  if (!okRes || !order?.id) {
    console.error(`Razorpay order creation failed: ${JSON.stringify(order)}`);
    throw new HttpError(503, 'Online payment is not available right now. You can choose to pay at the hospital.', 'Service Unavailable');
  }

  // One payment row per booking session; a new order replaces an unpaid one
  const now = nowIso();
  await run(
    env,
    `INSERT INTO payments (id, booking_session_id, razorpay_order_id, amount, currency, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'INR', 'PENDING', ?, ?)
     ON CONFLICT(booking_session_id) DO UPDATE SET
       razorpay_order_id = excluded.razorpay_order_id, amount = excluded.amount, status = 'PENDING',
       razorpay_payment_id = NULL, razorpay_signature = NULL, updated_at = excluded.updated_at
     WHERE payments.status != 'VERIFIED'`,
    uuid(), bookingSessionId, order.id, fee * 100, now, now,
  );
  console.log(`Created Razorpay order ${order.id} for session ${bookingSessionId} (₹${fee})`);

  return ok(c, {
    paymentsEnabled: true,
    orderId: order.id,
    amount: order.amount,
    amountInRupees: fee,
    currency: 'INR',
    keyId,
    hospitalName: hospital(env).name,
    themeColor: '#0F766E',
  });
});

// ─── 2. Verify the Razorpay signature ────────────────────────────────────────

paymentRoutes.post('/verify', async (c) => {
  const env = c.env;
  const dto = await body<Record<string, unknown>>(c);
  const bookingSessionId = need(dto.bookingSessionId, 'bookingSessionId');
  const razorpayOrderId = need(dto.razorpayOrderId, 'razorpayOrderId');
  const razorpayPaymentId = need(dto.razorpayPaymentId, 'razorpayPaymentId');
  const razorpaySignature = need(dto.razorpaySignature, 'razorpaySignature');

  const record = await first<{ id: string; amount: number; status: string }>(
    env,
    `SELECT id, amount, status FROM payments WHERE razorpay_order_id = ? AND booking_session_id = ?`,
    razorpayOrderId,
    bookingSessionId,
  );
  if (!record || !onlinePaymentsEnabled(env)) throw badRequest('Payment order not found for this booking.');

  const expected = await hmacSha256Hex(keys(env).keySecret, `${razorpayOrderId}|${razorpayPaymentId}`);
  if (!safeEqual(expected, razorpaySignature)) {
    await run(env, `UPDATE payments SET status = 'FAILED', updated_at = ? WHERE id = ? AND status != 'VERIFIED'`, nowIso(), record.id);
    console.warn(`Signature verification failed for order ${razorpayOrderId}`);
    throw badRequest('We could not verify this payment. If money was deducted, please call reception.');
  }

  const verifiedAt = nowIso();
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, status = 'VERIFIED', verified_at = ?, updated_at = ? WHERE id = ?`,
    ).bind(razorpayPaymentId, razorpaySignature, verifiedAt, verifiedAt, record.id),
    env.DB.prepare(`UPDATE booking_sessions SET status = 'PAYMENT_COMPLETED', updated_at = ? WHERE id = ? AND status != 'CONFIRMED'`).bind(
      verifiedAt,
      bookingSessionId,
    ),
  ]);

  await logAction(env, {
    action: 'PAYMENT_VERIFIED',
    entity: 'PAYMENT',
    entityId: razorpayPaymentId,
    metadata: { orderId: razorpayOrderId, bookingSessionId, amount: record.amount / 100 },
  });

  return ok(c, {
    status: 'VERIFIED',
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    bookingSessionId,
    verifiedAt,
    message: 'Payment received',
  });
});

// ─── 3. Payments list (front desk) ───────────────────────────────────────────

paymentRoutes.get('/', requireRoles(...FRONT_DESK), async (c) => {
  const rows = await all(c.env, `SELECT * FROM payments ORDER BY created_at DESC`);
  const hospitalId = hospital(c.env).id;
  return ok(
    c,
    rows.map((r) => ({
      id: r.id,
      hospitalId,
      bookingSessionId: r.booking_session_id,
      orderId: r.razorpay_order_id,
      paymentId: r.razorpay_payment_id ?? undefined,
      signature: r.razorpay_signature ?? undefined,
      amount: r.amount / 100, // rupees, as before
      currency: r.currency,
      // Old API called an unpaid order CREATED
      status: r.status === 'PENDING' ? 'CREATED' : r.status,
      createdAt: r.created_at,
    })),
  );
});
