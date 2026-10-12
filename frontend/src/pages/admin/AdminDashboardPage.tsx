import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';

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

      {/* Today's figures */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E7E3DA] rounded-lg divide-x divide-y lg:divide-y-0 divide-[#E7E3DA]">
        {figures.map((f) => (
          <div key={f.label} className="p-5 flex flex-col-reverse">
            <dt className="text-sm text-stone-500 mt-1">{f.label}</dt>
            <dd className="font-heading text-3xl text-[#1C2321]">{loading ? '–' : f.value}</dd>
          </div>
        ))}
      </dl>

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
                      {a.doctorName} · <span className="font-mono">{a.appointmentCode}</span>
                    </p>
                  </div>
                  <span className="hidden sm:inline text-sm text-stone-500 shrink-0">
                    {a.paymentStatus === 'PAID' ? `₹${a.fee} paid` : `₹${a.fee} due`}
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
