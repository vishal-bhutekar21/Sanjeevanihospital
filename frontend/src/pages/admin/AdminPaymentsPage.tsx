import React, { useEffect, useState } from 'react';
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
import { CreditCard, Search, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    apiFetch<PaymentRow[]>('/payments')
      .then((res) => setPayments(Array.isArray(res.data) ? res.data.filter((p) => p.status === 'VERIFIED') : []))
      .catch((err) => setLoadError(err?.message || 'Could not load payments.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-stone-900">Payments</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Online consultation fees received through the booking page.
          </p>
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-card-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Transaction / Order ID</th>
                <th className="py-3 px-4">Booking reference</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid on</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(loading || loadError || payments.length === 0) && (
                <tr>
                  <td colSpan={5} className={`py-10 text-center text-sm ${loadError ? 'text-red-700' : 'text-stone-500'}`}>
                    {loading ? 'Loading payments…' : loadError || 'No online payments yet.'}
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-stone-900">{p.paymentId}</p>
                    <p className="text-[10px] text-stone-400">{p.orderId}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">{p.bookingSessionId.slice(0, 8)}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">₹{p.amount}</td>
                  <td className="py-3.5 px-4 text-stone-500">{new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Received</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
