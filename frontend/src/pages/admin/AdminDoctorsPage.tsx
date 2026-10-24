import React, { useEffect, useMemo, useState } from 'react';
import { hasFee } from '../../lib/fee';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { DOCTORS_DATA } from '../../data/doctorsData';
import { DoctorPhoto } from '../../components/ui';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { isReceptionRole } from '../../lib/reception';

interface Session {
  start: string;
  end: string;
}
interface WeeklySchedule {
  slotMinutes: number;
  days: Session[][]; // 0 = Sunday ... 6 = Saturday
}
interface DoctorSchedule {
  doctorId: string;
  name: string;
  department: string;
  savedInDatabase: boolean;
  schedule: WeeklySchedule;
}

// Monday first, Sunday last
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fmt = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, '0')} ${p}` : `${hh} ${p}`;
};

const isBookable = (s?: WeeklySchedule) => !!s && s.days.some((d) => d.length > 0);

const weeklySummary = (s: WeeklySchedule) => {
  const active = DAY_ORDER.filter((d) => (s.days[d] || []).length > 0);
  if (active.length === 0) return 'No OPD days set';
  const hours = (d: number) => s.days[d].map((x) => `${fmt(x.start)}–${fmt(x.end)}`).join(', ');
  const same = active.every((d) => JSON.stringify(s.days[d]) === JSON.stringify(s.days[active[0]]));
  if (!same) return `${active.length} days a week, hours vary by day`;
  const names = active.map((d) => DAY_SHORT[d]);
  const consecutive = active.length > 2 && active.join() === DAY_ORDER.slice(0, active.length).join();
  return `${consecutive ? `${names[0]}–${names[names.length - 1]}` : names.join(', ')}, ${hours(active[0])}`;
};

const inputClass =
  'w-full px-3 py-2 bg-white border border-[#D8D3C8] rounded-md text-sm focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

export const AdminDoctorsPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Record<string, DoctorSchedule>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const { admin } = useAdminAuth();
  const canEditFee = isReceptionRole(admin?.role);
  // Fees as the booking server has them (a fee changed here wins over the website list)
  const [fees, setFees] = useState<Record<string, number>>({});
  const [feeFor, setFeeFor] = useState<string | null>(null);
  const [feeText, setFeeText] = useState('');
  const [feeMsg, setFeeMsg] = useState('');

  useEffect(() => {
    if (!canEditFee) return;
    apiFetch<{ id: string; fee: number }[]>('/appointments/staff/doctors')
      .then((r) => setFees(Object.fromEntries((Array.isArray(r.data) ? r.data : []).map((d) => [d.id, d.fee]))))
      .catch(() => undefined);
  }, [canEditFee]);

  const saveFee = async (id: string, name: string) => {
    setFeeMsg('');
    try {
      const res = await apiFetch<{ fee: number }>(`/appointments/staff/doctors/${id}/fee`, { method: 'PUT', body: JSON.stringify({ fee: Number(feeText) || 0 }) });
      setFees((f) => ({ ...f, [id]: res.data.fee }));
      setFeeFor(null);
      setFeeMsg(`${name}’s fee is now ${res.data.fee > 0 ? `₹${res.data.fee}` : 'not set (asked at reception)'}.`);
    } catch (e: any) {
      setFeeMsg(e?.message || 'Could not save the fee.');
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<DoctorSchedule[]>('/appointments/schedules');
      const map: Record<string, DoctorSchedule> = {};
      (Array.isArray(res.data) ? res.data : []).forEach((d) => (map[d.doctorId] = d));
      setSchedules(map);
    } catch (e: any) {
      setError(e?.message || 'Could not load OPD timings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const departments = useMemo(() => Array.from(new Set(DOCTORS_DATA.map((d) => d.dept))).sort(), []);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DOCTORS_DATA.filter(
      (d) =>
        (!dept || d.dept === dept) &&
        (!q || [d.name, d.role, d.dept, d.degree, d.specialty].some((v) => v.toLowerCase().includes(q))),
    );
  }, [search, dept]);

  const timingLine = (id: string) => {
    if (loading) return { text: 'Loading timings…', on: null as boolean | null };
    if (error) return { text: 'Timings not loaded', on: null };
    const s = schedules[id];
    if (!s) return { text: 'No timings found', on: false };
    return { text: weeklySummary(s.schedule), on: isBookable(s.schedule) };
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Doctors</h1>
        <p className="mt-1 text-stone-600">
          The {DOCTORS_DATA.length} doctors listed on the website, with their current OPD timings for online booking.
        </p>
      </div>

      {feeMsg && <p role="status" className="p-3 rounded-md bg-[#F0F7F6] border border-[#CFE4E0] text-sm">{feeMsg}</p>}

      {error && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex justify-between gap-3">
          <span>Could not load OPD timings ({error}). The doctor list below is still correct.</span>
          <button type="button" className="font-semibold underline shrink-0" onClick={load}>
            Try again
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Search doctors</span>
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department or qualification"
            className={`${inputClass} pl-9`}
          />
        </label>
        <label className="sm:w-80">
          <span className="sr-only">Department</span>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className={inputClass}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="bg-white border border-[#E7E3DA] rounded-lg">
        <div className="px-5 py-4 border-b border-[#E7E3DA] flex items-center justify-between gap-3">
          <h2 className="text-lg">
            {shown.length === DOCTORS_DATA.length ? 'All doctors' : `${shown.length} of ${DOCTORS_DATA.length} doctors`}
          </h2>
          {(search || dept) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setDept('');
              }}
              className="text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <p className="px-5 py-10 text-center text-stone-500">No doctor matches your search.</p>
        ) : (
          <ul className="divide-y divide-[#E7E3DA]">
            {shown.map((d) => {
              const t = timingLine(d.id);
              return (
                <li key={d.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex gap-4 min-w-0 flex-1">
                    <DoctorPhoto src={d.image} name={d.name} className="w-14 h-14 rounded-md shrink-0" textClass="text-lg" />
                    <div className="min-w-0">
                      <p className="font-medium text-[#1C2321]">{d.name}</p>
                      <p className="text-sm text-stone-600">{d.role}</p>
                      <p className="text-sm text-stone-500">
                        {d.dept} · {d.degree} · {hasFee(fees[d.id] ?? d.fee) ? `₹${fees[d.id] ?? d.fee} fee` : 'fee not set'}
                      </p>
                      <p className="mt-1.5 text-sm text-stone-700">{t.text}</p>
                      {t.on !== null && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-600">
                          <span className={`w-2 h-2 rounded-full ${t.on ? 'bg-[#0F766E]' : 'bg-stone-300'}`} />
                          Online booking: {t.on ? 'on' : 'off'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-0 md:flex-col md:items-end md:gap-1.5 shrink-0 text-sm md:pl-4">
                    {canEditFee && (
                      feeFor === d.id ? (
                        <span className="flex items-center gap-2 w-full md:w-auto">
                          <label className="sr-only" htmlFor={`fee-${d.id}`}>Fee in rupees</label>
                          <input id={`fee-${d.id}`} inputMode="numeric" autoFocus value={feeText} onChange={(e) => setFeeText(e.target.value.replace(/\D/g, ''))} className={`${inputClass} w-28`} placeholder="₹" />
                          <button type="button" onClick={() => saveFee(d.id, d.name)} className="btn-primary px-3 py-2 text-sm">Save</button>
                          <button type="button" onClick={() => setFeeFor(null)} className="text-stone-600 hover:underline text-sm">Cancel</button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => { setFeeFor(d.id); setFeeText(String(fees[d.id] ?? d.fee ?? '')); setFeeMsg(''); }} className="inline-flex items-center min-h-[44px] md:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">
                          Change fee
                        </button>
                      )
                    )}
                    <Link to="/admin/schedules" className="inline-flex items-center min-h-[44px] md:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">
                      Edit timings
                    </Link>
                    <a
                      href={`/doctors/${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center min-h-[44px] md:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4"
                    >
                      View on website
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-sm text-stone-600 max-w-3xl">
        OPD timings can be changed here under Edit timings. A doctor’s profile details (name, qualifications,
        photo) are part of the website’s doctor list, so to change them, ask your developer. The consultation fee can be changed here with Change fee. Doctor photos go in{' '}
        <span className="font-mono text-[13px]">/public/images/doctors/&lt;id&gt;.webp</span>, for example{' '}
        <span className="font-mono text-[13px]">doc-bagal.webp</span>. Until a photo is added, the website shows the
        doctor’s initials.
      </p>
    </div>
  );
};
