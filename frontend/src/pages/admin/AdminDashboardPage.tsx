import React, { useEffect, useMemo, useState } from 'react';
import { hasFee } from '../../lib/fee';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { computeDues, loadStaffData, monthLabel, rupees, thisMonth } from '../../lib/staffStore';
import { CalendarCheck, CalendarPlus, CheckCircle2, Hourglass, Receipt, Stethoscope, UserPlus, Wallet } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { MODE_COLORS, SplitBar, Stat } from '../../components/adminUi';
import { PAYMENT_MODES, inr, isReceptionRole } from '../../lib/reception';
import type { ReceiptSummary } from '../../lib/reception';

interface Apt {
  id: string;
  appointmentCode: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  startTime: string;
  status: 'CONFIRMED' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  paymentStatus: 'PAID' | 'PENDING';
  fee: number;
}

const STATUS_LABEL: Record<Apt['status'], string> = {
  CONFIRMED: 'Waiting',
  IN_CONSULTATION: 'With doctor',
  COMPLETED: 'Done',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'Did not come',
};

const STATUS_DOT: Record<Apt['status'], string> = {
  CONFIRMED: 'bg-[#0F766E]',
  IN_CONSULTATION: 'bg-amber-500',
  COMPLETED: 'bg-stone-400',
  CANCELLED: 'bg-stone-300',
  NO_SHOW: 'bg-red-400',
};

// Today's date in the hospital's time zone
const todayIst = () => new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);

const minutesOf = (t: string) => {
  const [hm, p] = t.split(' ');
  let [h, m] = hm.split(':').map(Number);
  if (p === 'PM' && h !== 12) h += 12;
  if (p === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

export const AdminDashboardPage: React.FC = () => {
  const [apts, setApts] = useState<Apt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { admin } = useAdminAuth();
  const canManage = isReceptionRole(admin?.role);
  const [money, setMoney] = useState<ReceiptSummary | null>(null);

  // Money received today (front desk and administrators only)
  useEffect(() => {
    if (!canManage) return;
    const day = todayIst();
    const loadMoney = () =>
      apiFetch<ReceiptSummary>(`/receipts/summary?from=${day}&to=${day}`)
        .then((r) => setMoney(r.data))
        .catch(() => setMoney(null));
    loadMoney();
    const t = setInterval(loadMoney, 60000);
    return () => clearInterval(t);
  }, [canManage]);

  const load = () =>
    apiFetch<Apt[]>('/appointments')
      .then((r) => {
        setApts(Array.isArray(r.data) ? r.data : []);
        setError('');
      })
      .catch((e) => setError(e?.message || 'Could not load today’s appointments.'))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const today = todayIst();
  const todays = useMemo(
    () =>
      apts
        .filter((a) => a.appointmentDate === today)
        .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime)),
    [apts, today],
  );
  const upcoming = useMemo(
    () => apts.filter((a) => a.appointmentDate > today && a.status === 'CONFIRMED').length,
    [apts, today],
  );

  // Staff salary dues for this month, from the Staff page (saved in this browser only)
  const staffDue = useMemo(() => {
    const data = loadStaffData();
    if (data.employees.length === 0) return 0;
    return computeDues(data, thisMonth()).reduce((sum, r) => sum + r.balance, 0);
  }, []);

  const count = (s: Apt['status']) => todays.filter((a) => a.status === s).length;
  const collectedOnline = todays.filter((a) => a.paymentStatus === 'PAID').reduce((sum, a) => sum + a.fee, 0);
  const toCollect = todays
    .filter((a) => a.paymentStatus === 'PENDING' && a.status !== 'CANCELLED' && a.status !== 'NO_SHOW')
    .reduce((sum, a) => sum + a.fee, 0);

  const byDoctor = useMemo(() => {
    const m = new Map<string, { name: string; dept: string; total: number; waiting: number }>();
    todays.forEach((a) => {
      const e = m.get(a.doctorName) || { name: a.doctorName, dept: a.department, total: 0, waiting: 0 };
      e.total += 1;
      if (a.status === 'CONFIRMED') e.waiting += 1;
      m.set(a.doctorName, e);
    });
    return Array.from(m.values()).sort((a, b) => b.total - a.total);
  }, [todays]);

  const figures = [
    { label: 'Booked for today', value: todays.length },
    { label: 'Waiting', value: count('CONFIRMED') },
    { label: 'With doctor', value: count('IN_CONSULTATION') },
    { label: 'Done', value: count('COMPLETED') },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}</h1>
          <p className="mt-1 text-stone-600">
            {loading
              ? 'Loading today’s OPD…'
              : todays.length === 0
              ? 'No online bookings for today yet.'
              : `${todays.length} online booking${todays.length === 1 ? '' : 's'} today. ${count('CONFIRMED')} waiting.`}
          </p>
        </div>
        <Link to="/admin/appointments" className="btn-primary self-start">
          Open appointments
        </Link>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>{error}</span>
          <button type="button" className="font-semibold underline" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {canManage && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: '/admin/appointments/new', icon: CalendarPlus, title: 'Book a visit', text: 'For walk-in and phone patients' },
            { to: '/admin/registration?new=1', icon: UserPlus, title: 'Register a patient', text: 'Add someone new' },
            { to: '/admin/receipts/new', icon: Receipt, title: 'Make a receipt', text: 'Record money received' },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="bg-white border border-[#E7E3DA] rounded-lg p-4 flex items-center gap-3.5 hover:border-[#0F766E] transition min-h-[72px]">
              <span className="w-11 h-11 rounded-lg bg-[#E6F2F0] text-[#0F766E] flex items-center justify-center shrink-0" aria-hidden>
                <a.icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-medium text-[#1C2321]">{a.title}</span>
                <span className="block text-sm text-stone-500">{a.text}</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Today's figures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat icon={CalendarCheck} label="Booked for today" value={loading ? '–' : todays.length} />
        <Stat icon={Hourglass} label="Waiting" value={loading ? '–' : count('CONFIRMED')} tone="amber" />
        <Stat icon={Stethoscope} label="With doctor" value={loading ? '–' : count('IN_CONSULTATION')} tone="teal" />
        <Stat icon={CheckCircle2} label="Done" value={loading ? '–' : count('COMPLETED')} tone="stone" />
      </div>

      {!loading && todays.length > 0 && (
        <section className="bg-white border border-[#E7E3DA] rounded-lg p-4 sm:p-5">
          <h2 className="text-lg mb-3">How today is going</h2>
          <SplitBar
            parts={[
              { label: 'Waiting', value: count('CONFIRMED'), color: '#0F766E' },
              { label: 'With doctor', value: count('IN_CONSULTATION'), color: '#F59E0B' },
              { label: 'Done', value: count('COMPLETED'), color: '#A8A29E' },
              { label: 'Did not come', value: count('NO_SHOW'), color: '#F87171' },
              { label: 'Cancelled', value: count('CANCELLED'), color: '#D6D3D1' },
            ]}
          />
        </section>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Queue */}
        <section className="lg:col-span-8 bg-white border border-[#E7E3DA] rounded-lg">
          <div className="px-5 py-4 border-b border-[#E7E3DA] flex items-center justify-between">
            <h2 className="text-lg">Today’s queue</h2>
            <Link to="/admin/appointments" className="text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4">
              See all
            </Link>
          </div>
          {!loading && todays.length === 0 ? (
            <p className="px-5 py-10 text-center text-stone-500">
              Nothing booked online for today. New bookings appear here automatically.
            </p>
          ) : (
            <ul className="divide-y divide-[#E7E3DA]">
              {todays.slice(0, 8).map((a) => (
                <li key={a.id} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="w-[72px] shrink-0 text-sm font-semibold text-[#1C2321]">{a.startTime.replace(/^0/, '')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1C2321] truncate">
                      {a.patientName}
                      <span className="text-stone-500 font-normal">
                        {' '}
                        · {a.patientAge} {a.patientGender?.[0]}
                      </span>
                    </p>
                    <p className="text-sm text-stone-500 truncate">
                      {a.doctorName} · {a.appointmentCode}
                    </p>
                  </div>
                  <span className="hidden sm:inline text-sm text-stone-500 shrink-0">
                    {a.paymentStatus === 'PAID' ? `₹${a.fee} paid` : hasFee(a.fee) ? `₹${a.fee} due` : 'fee at counter'}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-stone-700 shrink-0 w-[100px]">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[a.status]}`} />
                    {STATUS_LABEL[a.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="lg:col-span-4 space-y-6">
          {/* Money received at the counter today */}
          {canManage && money && (
            <section className="bg-white border border-[#E7E3DA] rounded-lg p-5">
              <h2 className="text-lg flex items-center gap-2"><Wallet className="w-5 h-5 text-[#0F766E]" aria-hidden /> Money received today</h2>
              <p className="mt-2 text-3xl font-semibold text-[#1C2321]">{inr(money.collected)}</p>
              <p className="text-sm text-stone-500 mb-4">{money.receiptsIssued} receipt{money.receiptsIssued === 1 ? '' : 's'}{money.outstanding > 0 ? ` · ${inr(money.outstanding)} still to collect` : ''}</p>
              <SplitBar
                parts={PAYMENT_MODES.map((m) => ({ label: m.label, value: money.byMode[m.value] || 0, color: MODE_COLORS[m.value] }))}
                format={inr}
                emptyText="No money received yet today."
              />
              <Link to="/admin/receipts" className="mt-4 inline-block text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4">
                See receipts
              </Link>
            </section>
          )}

          {/* Money */}
          <section className="bg-white border border-[#E7E3DA] rounded-lg p-5">
            <h2 className="text-lg">Consultation fees today</h2>
            <dl className="mt-3 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-stone-600">Paid online</dt>
                <dd className="font-semibold">₹{collectedOnline.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-600">To collect at counter</dt>
                <dd className="font-semibold">₹{toCollect.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
            <Link to="/admin/payments" className="mt-4 inline-block text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4">
              Online payments
            </Link>
          </section>

          {/* Per doctor */}
          <section className="bg-white border border-[#E7E3DA] rounded-lg p-5">
            <h2 className="text-lg">By doctor</h2>
            {byDoctor.length === 0 ? (
              <p className="mt-2 text-sm text-stone-500">No bookings yet today.</p>
            ) : (
              <ul className="mt-3 divide-y divide-[#E7E3DA]">
                {byDoctor.map((d) => (
                  <li key={d.name} className="py-2.5 flex justify-between gap-3 text-[15px]">
                    <span className="min-w-0">
                      <span className="block truncate">{d.name}</span>
                      <span className="block text-xs text-stone-500 truncate">{d.dept}</span>
                    </span>
                    <span className="text-right text-sm text-stone-600 shrink-0">
                      {d.total} booked
                      <br />
                      {d.waiting} waiting
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {staffDue > 0 && (
            <p className="text-sm text-stone-600">
              <Link to="/admin/staff" className="text-[#0F766E] font-semibold hover:underline underline-offset-4">
                Staff dues for {monthLabel(thisMonth())}: {rupees(staffDue)}
              </Link>
            </p>
          )}

          {upcoming > 0 && (
            <p className="text-sm text-stone-600">
              {upcoming} more booking{upcoming === 1 ? '' : 's'} for the coming days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
