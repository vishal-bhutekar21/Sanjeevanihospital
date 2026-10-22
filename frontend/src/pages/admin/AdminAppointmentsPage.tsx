import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { feeLabel } from '../../lib/fee';
import { apiFetch } from '../../lib/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DateCalendar, toDateKey } from '../../components/DateCalendar';
import { SlotPicker } from '../../components/SlotPicker';
import { Notice } from '../../components/adminUi';
import { addDays, isReceptionRole, todayIst } from '../../lib/reception';
import { downloadAppointmentPdf } from '../../lib/appointmentPdf';
import {
  CalendarPlus,
  CalendarClock,
  Download,
  Receipt,
  XCircle,
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Printer,
  ChevronDown,
  Sparkles,
  ArrowUpDown,
  Eye,
  X,
  Stethoscope,
} from 'lucide-react';

interface AppointmentItem {
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
  phoneVerified?: boolean;
  fee: number;
  doctorId?: string;
  endTime?: string;
  source?: 'ONLINE' | 'WALK_IN' | 'PHONE';
  patientId?: string;
  cancelReason?: string;
}

const SOURCE_LABEL: Record<string, string> = { WALK_IN: 'Walk-in', PHONE: 'Booked by phone' };

// "09:30 AM" -> "0570" so times sort correctly as text
const toMins = (t: string) => {
  const [hm, p] = (t || '').split(' ');
  let [h, m] = (hm || '0:0').split(':').map(Number);
  if (p === 'PM' && h !== 12) h += 12;
  if (p === 'AM' && h === 12) h = 0;
  return String(h * 60 + m).padStart(4, '0');
};

export const AdminAppointmentsPage: React.FC = () => {
  const { admin } = useAdminAuth();
  const canManage = isReceptionRole(admin?.role);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [modalAction, setModalAction] = useState<'none' | 'time' | 'cancel'>('none');
  const [newDate, setNewDate] = useState(todayIst());
  const [newTime, setNewTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  // Which day(s) to show: a YYYY-MM-DD date, 'UPCOMING' (today onwards) or 'ALL'
  const todayKey = toDateKey(new Date());
  const [dayFilter, setDayFilter] = useState<string>(todayKey);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);

  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadAppointments = async () => {
    setLoadError('');
    try {
      const res = await apiFetch<AppointmentItem[]>('/appointments');
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setLoadError(err?.message || 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // New online bookings appear without a manual refresh
    const timer = setInterval(loadAppointments, 30000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id: string, newStatus: AppointmentItem['status']) => {
    const previous = appointments;
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    try {
      const res = await apiFetch<AppointmentItem>(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setAppointments((list) => list.map((a) => (a.id === id ? { ...a, ...res.data } : a)));
    } catch (err: any) {
      setAppointments(previous);
      setLoadError(err?.message || 'Could not update the status. Please try again.');
    }
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalAction('none');
    setActionError('');
    setCancelReason('');
    setNewTime('');
  };

  // Change the time or cancel: both go through the server and come back with the updated visit
  const runAction = async (path: string, body: object, done: string) => {
    if (!selectedAppointment) return;
    setActionBusy(true);
    setActionError('');
    try {
      const res = await apiFetch<AppointmentItem>(`/appointments/${selectedAppointment.id}/${path}`, { method: 'PATCH', body: JSON.stringify(body) });
      setAppointments((list) => list.map((a) => (a.id === selectedAppointment.id ? { ...a, ...res.data } : a)));
      setMessage(done);
      closeModal();
    } catch (err: any) {
      setActionError(err?.message || 'That did not work. Please try again.');
    } finally {
      setActionBusy(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.appointmentCode.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesDay =
      dayFilter === 'ALL' || (dayFilter === 'UPCOMING' ? a.appointmentDate >= todayKey : a.appointmentDate === dayFilter);
    return matchesSearch && matchesStatus && matchesDay;
  }).sort((a, b) => (a.appointmentDate + toMins(a.startTime)).localeCompare(b.appointmentDate + toMins(b.startTime)));

  const tomorrowKey = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toDateKey(d);
  })();
  const countOn = (key: string) => appointments.filter((a) => a.appointmentDate === key && a.status !== 'CANCELLED').length;
  const bookedDates = new Set(appointments.map((a) => a.appointmentDate));
  const dayLabel =
    dayFilter === 'ALL'
      ? 'All dates'
      : dayFilter === 'UPCOMING'
      ? 'Today and later'
      : new Date(`${dayFilter}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ─── 1. PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl text-stone-900 font-heading">
            Appointments
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal">
            Today's OPD tokens. Update a patient's status or print their token slip.
          </p>
        </div>
        {canManage && (
          <Link to="/admin/appointments/new" className="btn-primary self-start">
            <CalendarPlus className="w-4 h-4" /> Book a visit
          </Link>
        )}
      </div>

      {message && <Notice kind="ok">{message}</Notice>}

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" onClick={loadAppointments} className="font-semibold underline">
            Try again
          </button>
        </div>
      )}

      {/* Day picker */}
      <div className="bg-white border border-[#E7E3DA] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: todayKey, label: `Today (${countOn(todayKey)})` },
            { key: tomorrowKey, label: `Tomorrow (${countOn(tomorrowKey)})` },
            { key: 'UPCOMING', label: 'Upcoming' },
            { key: 'ALL', label: 'All' },
          ].map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={dayFilter === o.key}
              onClick={() => {
                setDayFilter(o.key);
                setShowCalendar(false);
              }}
              className={`px-3.5 py-2 rounded-md border text-sm ${
                dayFilter === o.key ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold' : 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
              }`}
            >
              {o.label}
            </button>
          ))}
          <button
            type="button"
            aria-expanded={showCalendar}
            onClick={() => setShowCalendar((v) => !v)}
            className="px-3.5 py-2 rounded-md border border-[#D8D3C8] text-sm hover:border-[#0F766E]"
          >
            Pick a date…
          </button>
          <span className="ml-auto text-sm text-stone-600">
            Showing: <span className="font-semibold text-[#1C2321]">{dayLabel}</span> · {filtered.length}
          </span>
        </div>
        {showCalendar && (
          <div className="mt-4">
            <DateCalendar
              value={/^\d{4}-/.test(dayFilter) ? dayFilter : todayKey}
              minDate={(() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 3);
                return toDateKey(d);
              })()}
              maxDate={(() => {
                const d = new Date();
                d.setMonth(d.getMonth() + 3);
                return toDateKey(d);
              })()}
              note={null}
              onChange={(k) => {
                setDayFilter(k);
                setShowCalendar(false);
              }}
            />
            <p className="mt-2 text-xs text-stone-500">
              {bookedDates.size} date{bookedDates.size === 1 ? '' : 's'} have bookings.
            </p>
          </div>
        )}
      </div>

      {/* ─── 2. SEARCH & FILTER CONTROLS ────────────────────────────────────── */}
      <div className="card-clean p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search token, patient name, doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Status Segmented Pills */}
          <div className="inline-flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg text-xs w-full sm:w-auto">
            {['ALL', 'CONFIRMED', 'IN_CONSULTATION', 'COMPLETED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`min-h-[40px] sm:min-h-0 px-3 py-1 rounded-md text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {({ ALL: 'All', CONFIRMED: 'Waiting', IN_CONSULTATION: 'With doctor', COMPLETED: 'Done' } as Record<string, string>)[st]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. ULTRA-CLEAN APPOINTMENTS TABLE ───────────────────────────────── */}
      <div className="card-clean bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-[#E7E3DA] text-stone-500 text-sm">
                <th className="py-3 px-4 font-semibold">Token</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Doctor</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Fee</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-sm text-stone-500">
                    <p className="sticky left-0 w-[min(100%,calc(100vw-4rem))] px-4 text-center">Loading appointments…</p>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-sm text-stone-500">
                    {/* Stays in view when the table is wider than a phone screen */}
                    <p className="sticky left-0 w-[min(100%,calc(100vw-4rem))] px-4 text-center">
                    {appointments.length === 0
                      ? 'No online bookings yet. New bookings appear here automatically.'
                      : search || statusFilter !== 'ALL'
                      ? 'No appointments match this search.'
                      : `No appointments for ${dayLabel.toLowerCase().startsWith('all') ? 'these dates' : dayLabel}.`}
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                  {/* Token */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">
                    <span className="text-[13px]">{apt.appointmentCode}</span>
                    {apt.source && apt.source !== 'ONLINE' && (
                      <span className="block text-[11px] text-stone-500 font-sans font-normal">{SOURCE_LABEL[apt.source]}</span>
                    )}
                  </td>

                  {/* Patient */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{apt.patientName}</span>
                    <span className="text-[11px] text-stone-400 block">
                      {apt.patientAge} Yrs, {apt.patientGender} • {apt.patientPhone}
                    </span>
                    {apt.phoneVerified === false && (
                      <span className="text-[11px] text-amber-800 block">Mobile not verified · call to confirm</span>
                    )}
                  </td>

                  {/* Doctor & Dept */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{apt.doctorName}</span>
                    <span className="text-[11px] text-[#0F766E] block font-medium">{apt.department}</span>
                  </td>

                  {/* Slot */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-800 block">{apt.appointmentDate}</span>
                    <span className="text-[11px] text-stone-500">{apt.startTime}</span>
                  </td>

                  {/* Fee */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{feeLabel(apt.fee)}</span>
                    {apt.paymentStatus === 'PAID' ? (
                      <span className="block text-xs text-emerald-700 font-medium">Paid</span>
                    ) : (
                      <span className="block text-xs text-amber-800 font-medium">To pay at counter</span>
                    )}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-3 px-4 text-center">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-md text-xs font-bold border transition cursor-pointer ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-teal-50 text-[#0F766E] border-teal-200'
                          : apt.status === 'IN_CONSULTATION'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : apt.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      <option value="CONFIRMED">Waiting</option>
                      <option value="IN_CONSULTATION">With doctor</option>
                      <option value="COMPLETED">Done</option>
                      <option value="NO_SHOW">Did not come</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  {/* View Details / Token Modal */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-teal-50 hover:text-[#0F766E] text-stone-700 transition inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. VISIT DETAILS ───────────────────────────────────────────────── */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Visit details">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-lg border border-stone-200 my-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg text-stone-900 font-heading">Visit details</h3>
              <button type="button" onClick={closeModal} aria-label="Close" className="p-2.5 -m-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-dashed border-teal-300 space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="text-stone-500">Token number</span>
                <span className="font-mono font-bold text-base text-stone-900">{selectedAppointment.appointmentCode}</span>
              </div>
              <div className="space-y-1.5">
                <p><span className="text-stone-500">Patient:</span> <span className="font-semibold text-stone-900">{selectedAppointment.patientName}</span> ({selectedAppointment.patientAge} yrs, {selectedAppointment.patientGender || '—'})</p>
                <p><span className="text-stone-500">Mobile:</span> <span className="font-semibold text-stone-900">{selectedAppointment.patientPhone}</span></p>
                <p><span className="text-stone-500">Doctor:</span> <span className="font-semibold text-stone-900">{selectedAppointment.doctorName}</span> · <span className="text-[#0F766E]">{selectedAppointment.department}</span></p>
                <p><span className="text-stone-500">When:</span> <span className="font-semibold text-stone-900">{selectedAppointment.appointmentDate} at {selectedAppointment.startTime}</span></p>
                <p><span className="text-stone-500">Fee:</span> <span className="font-semibold text-stone-900">{feeLabel(selectedAppointment.fee)}</span> ({selectedAppointment.paymentStatus === 'PAID' ? 'paid' : 'to pay at the counter'})</p>
                {selectedAppointment.source && selectedAppointment.source !== 'ONLINE' && <p><span className="text-stone-500">Booked:</span> {SOURCE_LABEL[selectedAppointment.source]}</p>}
                {selectedAppointment.status === 'CANCELLED' && selectedAppointment.cancelReason && <p className="text-red-700">Cancelled: {selectedAppointment.cancelReason}</p>}
              </div>
            </div>

            {actionError && <Notice kind="error">{actionError}</Notice>}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary text-sm flex items-center gap-1.5"
                onClick={() =>
                  downloadAppointmentPdf({
                    kind: 'confirmed',
                    appointmentCode: selectedAppointment.appointmentCode,
                    patientName: selectedAppointment.patientName,
                    patientAge: selectedAppointment.patientAge,
                    patientGender: selectedAppointment.patientGender,
                    patientPhone: `+91 ${selectedAppointment.patientPhone}`,
                    phoneVerified: selectedAppointment.phoneVerified !== false,
                    doctorName: selectedAppointment.doctorName,
                    department: selectedAppointment.department,
                    date: selectedAppointment.appointmentDate,
                    startTime: selectedAppointment.startTime,
                    endTime: selectedAppointment.endTime,
                    fee: selectedAppointment.fee,
                    paid: selectedAppointment.paymentStatus === 'PAID',
                  })
                }
              >
                <Download className="w-4 h-4" /> Token slip
              </button>
              {canManage && (
                <Link
                  to={`/admin/receipts/new?appointmentCode=${selectedAppointment.appointmentCode}${selectedAppointment.patientId ? `&patientId=${selectedAppointment.patientId}` : ''}`}
                  className="btn-secondary text-sm flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" /> Make receipt
                </Link>
              )}
              {canManage && selectedAppointment.status !== 'CANCELLED' && selectedAppointment.status !== 'COMPLETED' && (
                <>
                  <button type="button" className="btn-secondary text-sm flex items-center gap-1.5" onClick={() => { setModalAction(modalAction === 'time' ? 'none' : 'time'); setNewDate(todayIst()); setNewTime(''); }}>
                    <CalendarClock className="w-4 h-4" /> Change time
                  </button>
                  <button type="button" className="btn-secondary text-sm flex items-center gap-1.5 text-red-700" onClick={() => setModalAction(modalAction === 'cancel' ? 'none' : 'cancel')}>
                    <XCircle className="w-4 h-4" /> Cancel visit
                  </button>
                </>
              )}
            </div>

            {modalAction === 'time' && selectedAppointment.doctorId && (
              <div className="space-y-3 border-t border-stone-100 pt-4">
                <p className="font-medium">Pick the new day and time</p>
                <DateCalendar value={newDate} minDate={todayIst()} maxDate={addDays(todayIst(), 60)} note={null} onChange={(k) => { setNewDate(k); setNewTime(''); }} />
                <SlotPicker doctorId={selectedAppointment.doctorId} date={newDate} value={newTime} onChange={setNewTime} />
                <button type="button" disabled={!newTime || actionBusy} className="btn-primary disabled:opacity-50" onClick={() => runAction('reschedule', { date: newDate, startTime: newTime }, 'The visit was moved to the new time.')}>
                  {actionBusy ? 'Saving…' : 'Move the visit'}
                </button>
              </div>
            )}

            {modalAction === 'cancel' && (
              <div className="space-y-3 border-t border-stone-100 pt-4">
                <label htmlFor="cancel-why" className="block font-medium">Why is it being cancelled?</label>
                <input id="cancel-why" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-[#D8D3C8] rounded-md focus:border-[#0F766E] focus:outline-none" placeholder="e.g. Patient called to cancel" />
                <p className="text-sm text-stone-500">The time becomes free for someone else.</p>
                <button type="button" disabled={cancelReason.trim().length < 3 || actionBusy} className="btn-primary bg-red-700 hover:bg-red-800 border-red-700 disabled:opacity-50" onClick={() => runAction('cancel', { reason: cancelReason }, 'The visit was cancelled.')}>
                  {actionBusy ? 'Cancelling…' : 'Cancel this visit'}
                </button>
              </div>
            )}

            <div className="pt-1">
              <button type="button" onClick={closeModal} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
