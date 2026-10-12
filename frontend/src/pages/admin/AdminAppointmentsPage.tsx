import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
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
  fee: number;
}

export const AdminAppointmentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.appointmentCode.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      </div>

      {loadError && (
        <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <button type="button" onClick={loadAppointments} className="font-semibold underline">
            Try again
          </button>
        </div>
      )}

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
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
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
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Token</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Doctor & Specialty</th>
                <th className="py-3 px-4 font-semibold">Slot Time</th>
                <th className="py-3 px-4 font-semibold">Fee</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-stone-500">Loading appointments…</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-stone-500">
                    {appointments.length === 0
                      ? 'No online bookings yet. New bookings appear here automatically.'
                      : 'No appointments match this search.'}
                  </td>
                </tr>
              )}
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                  {/* Token */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      #{apt.appointmentCode}
                    </span>
                  </td>

                  {/* Patient */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{apt.patientName}</span>
                    <span className="text-[11px] text-stone-400 block">
                      {apt.patientAge} Yrs, {apt.patientGender} • {apt.patientPhone}
                    </span>
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
                    <span className="font-bold text-stone-900">₹{apt.fee}</span>
                    {apt.paymentStatus === 'PAID' ? (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-1.5">Paid</span>
                    ) : (
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded ml-1.5">Collect at counter</span>
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

      {/* ─── 4. TOKEN SLIP DETAIL MODAL ─────────────────────────────────────── */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-lg border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base text-stone-900 font-heading">
                Hospital OPD Token Slip
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-dashed border-teal-300 space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="text-[10px] uppercase font-bold text-[#0F766E]">
                  Token Number
                </span>
                <span className="font-mono font-bold text-base text-stone-900">
                  {selectedAppointment.appointmentCode}
                </span>
              </div>

              <div className="space-y-1">
                <p><span className="text-stone-500">Patient:</span> <span className="font-bold text-stone-900">{selectedAppointment.patientName}</span> ({selectedAppointment.patientAge} Yrs, {selectedAppointment.patientGender})</p>
                <p><span className="text-stone-500">Phone:</span> <span className="font-bold text-stone-900">{selectedAppointment.patientPhone}</span></p>
                <p><span className="text-stone-500">Doctor:</span> <span className="font-bold text-stone-900">{selectedAppointment.doctorName}</span></p>
                <p><span className="text-stone-500">Department:</span> <span className="font-semibold text-[#0F766E]">{selectedAppointment.department}</span></p>
                <p><span className="text-stone-500">Slot:</span> <span className="font-bold text-stone-900">{selectedAppointment.appointmentDate} at {selectedAppointment.startTime}</span></p>
                <p><span className="text-stone-500">Consultation Fee:</span> <span className="font-bold text-stone-900">₹{selectedAppointment.fee} ({selectedAppointment.paymentStatus === 'PAID' ? 'paid online' : 'to pay at counter'})</span></p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary text-xs flex-1 py-2 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Token</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="btn-primary text-xs flex-1 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
