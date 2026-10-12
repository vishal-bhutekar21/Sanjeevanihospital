import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';

interface PaymentRow {
  id: string;
  orderId: string;
  paymentId?: string;
  bookingSessionId: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'VERIFIED' | 'FAILED';
  createdAt: string;
}

// Date (YYYY-MM-DD) in the hospital's time zone
const istDay = (d: Date) => new Date(d.getTime() + 330 * 60 * 1000).toISOString().slice(0, 10);
const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = () => {
    setLoading(true);
    setLoadError('');
    apiFetch<PaymentRow[]>('/payments')
      .then((res) =>
        setPayments(
          (Array.isArray(res.data) ? res.data : [])
            .filter((p) => p.status === 'VERIFIED')
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        ),
      )
      .catch((err) => setLoadError(err?.message || 'Could not load payments.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const today = istDay(new Date());
  const month = today.slice(0, 7);
  const { todayTotal, todayCount, monthTotal, monthCount } = useMemo(() => {
    let todayTotal = 0, todayCount = 0, monthTotal = 0, monthCount = 0;
    payments.forEach((p) => {
      const d = istDay(new Date(p.createdAt));
      if (d === today) { todayTotal += p.amount; todayCount += 1; }
      if (d.slice(0, 7) === month) { monthTotal += p.amount; monthCount += 1; }
    });
    return { todayTotal, todayCount, monthTotal, monthCount };
  }, [payments, today, month]);

  const figures = [
    { label: `Received today${todayCount ? ` · ${todayCount} payment${todayCount === 1 ? '' : 's'}` : ''}`, value: rupees(todayTotal) },
    { label: `This month${monthCount ? ` · ${monthCount} payment${monthCount === 1 ? '' : 's'}` : ''}`, value: rupees(monthTotal) },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Online payments</h1>
        <p className="mt-1 text-stone-600">Consultation fees patients paid on the booking page. Only payments confirmed by Razorpay are listed.</p>
      </div>

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" className="font-semibold underline shrink-0" onClick={load}>
            Try again
          </button>
        </div>
      )}

      <dl className="grid grid-cols-2 bg-white border border-[#E7E3DA] rounded-lg divide-x divide-[#E7E3DA]">
        {figures.map((f) => (
          <div key={f.label} className="p-5 flex flex-col-reverse min-w-0">
            <dt className="text-sm text-stone-500 mt-1">{f.label}</dt>
            <dd className="font-heading text-2xl sm:text-3xl text-[#1C2321] truncate">{loading ? '–' : f.value}</dd>
          </div>
        ))}
      </dl>

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA] flex items-center justify-between gap-3">
          <h2 className="text-lg">Received payments</h2>
          <button type="button" onClick={load} disabled={loading} className="text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4 disabled:opacity-50">
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {/* Column headings, wide screens only */}
        <div className={`${payments.length ? "hidden md:grid" : "hidden"} grid-cols-12 gap-4 px-5 py-2.5 border-b border-[#E7E3DA] text-sm text-stone-500`}>
          <span className="col-span-3">Paid on</span>
          <span className="col-span-4">Payment ID</span>
          <span className="col-span-3">Booking reference</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>

        {loading && payments.length === 0 ? (
          <p className="px-5 py-10 text-center text-stone-500">Loading payments…</p>
        ) : !loadError && payments.length === 0 ? (
          <p className="px-5 py-10 text-center text-stone-500">
            No online payments yet. When a patient pays while booking, the payment appears here.
          </p>
        ) : (
          <ul className="divide-y divide-[#E7E3DA]">
            {payments.map((p) => (
              <li key={p.id} className="px-5 py-3.5 grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-1 items-center text-[15px]">
                <span className="md:col-span-3 text-[#1C2321]">
                  {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                <span className="md:col-span-2 md:order-last text-right font-semibold text-[#1C2321]">{rupees(p.amount)}</span>
                <span className="col-span-2 md:col-span-4 min-w-0 text-sm">
                  <span className="block font-mono text-[#1C2321] truncate">{p.paymentId || '—'}</span>
                  <span className="block text-xs text-stone-500 truncate">Order {p.orderId}</span>
                </span>
                <span className="col-span-2 md:col-span-3 text-sm text-stone-500">
                  <span className="md:hidden">Booking </span>
                  <span className="font-mono">{p.bookingSessionId.slice(0, 8)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
