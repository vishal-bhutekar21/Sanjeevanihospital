import React, { useState } from 'react';
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
  patientAddress: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  startTime: string;
  status: 'CONFIRMED' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING';
  fee: number;
}

export const AdminAppointmentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);

  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'apt-001',
      appointmentCode: 'SNH-2026-8492',
      patientName: 'Suresh Patil',
      patientPhone: '+91-98765-43210',
      patientAge: 42,
      patientGender: 'Male',
      patientAddress: 'Jalna City, Maharashtra',
      doctorName: 'Dr. Nishant Goyal',
      department: 'Orthopedics & Joint Replacement',
      appointmentDate: '2026-08-25',
      startTime: '11:00 AM',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: 500,
    },
    {
      id: 'apt-002',
      appointmentCode: 'SNH-2026-4129',
      patientName: 'Pooja Deshmukh',
      patientPhone: '+91-98223-11445',
      patientAge: 28,
      patientGender: 'Female',
      patientAddress: 'Ambad Road, Jalna',
      doctorName: 'Dr. Anshul Goyal',
      department: 'Obstetrics & Gynecology (Maternity)',
      appointmentDate: '2026-08-25',
      startTime: '11:30 AM',
      status: 'IN_CONSULTATION',
      paymentStatus: 'PAID',
      fee: 500,
    },
    {
      id: 'apt-003',
      appointmentCode: 'SNH-2026-9031',
      patientName: 'Master Aryan Kale',
      patientPhone: '+91-94231-88990',
      patientAge: 6,
      patientGender: 'Male',
      patientAddress: 'Mantha Taluka, Jalna',
      doctorName: 'Dr. Shivdas Mirkad',
      department: 'Pediatrics & Neonatology (NICU)',
      appointmentDate: '2026-08-25',
      startTime: '12:00 PM',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: 500,
    },
    {
      id: 'apt-004',
      appointmentCode: 'SNH-2026-7712',
      patientName: 'Rameshwar Shinde',
      patientPhone: '+91-97665-23411',
      patientAge: 54,
      patientGender: 'Male',
      patientAddress: 'Partur, Jalna',
      doctorName: 'Dr. Kailash Rajguru',
      department: 'Internal Medicine & Physician',
      appointmentDate: '2026-08-25',
      startTime: '12:30 PM',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      fee: 400,
    },
    {
      id: 'apt-005',
      appointmentCode: 'SNH-2026-6281',
      patientName: 'Sunita Gaikwad',
      patientPhone: '+91-98901-77882',
      patientAge: 39,
      patientGender: 'Female',
      patientAddress: 'Old Jalna, Maharashtra',
      doctorName: 'Dr. Millind Katole',
      department: 'General & Laparoscopic Surgery',
      appointmentDate: '2026-08-25',
      startTime: '01:00 PM',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: 500,
    },
  ]);

  const updateStatus = (id: string, newStatus: AppointmentItem['status']) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
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
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* ─── 1. PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge-teal text-[11px] py-0.5 px-2.5">
              OPD Patient Management
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total {appointments.length} Appointments Registered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Live Appointments & OPD Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Track patient arrival, update consultation states, and issue printed hospital token slips.
          </p>
        </div>
      </div>

      {/* ─── 2. SEARCH & FILTER CONTROLS ────────────────────────────────────── */}
      <div className="card-clean p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by token code, patient name, doctor, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Status Segmented Pills */}
          <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl text-xs w-full sm:w-auto">
            {['ALL', 'CONFIRMED', 'IN_CONSULTATION', 'COMPLETED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Queue' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. SPACIOUS APPOINTMENTS TABLE ─────────────────────────────────── */}
      <div className="card-clean bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-4 px-5 font-semibold">Token / Code</th>
                <th className="py-4 px-5 font-semibold">Patient Demographics</th>
                <th className="py-4 px-5 font-semibold">Specialist Doctor & Dept</th>
                <th className="py-4 px-5 font-semibold">Date & Time Slot</th>
                <th className="py-4 px-5 font-semibold">Fee & Payment</th>
                <th className="py-4 px-5 font-semibold text-center">Status Action</th>
                <th className="py-4 px-5 font-semibold text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition group">
                  {/* Token */}
                  <td className="py-4 px-5 font-mono font-bold text-slate-900">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-800">
                      {apt.appointmentCode}
                    </span>
                  </td>

                  {/* Patient */}
                  <td className="py-4 px-5">
                    <span className="font-bold text-slate-900 text-sm block">{apt.patientName}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {apt.patientAge} Yrs • {apt.patientGender} • {apt.patientPhone}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                      {apt.patientAddress}
                    </span>
                  </td>

                  {/* Doctor & Dept */}
                  <td className="py-4 px-5">
                    <span className="font-bold text-slate-900 block">{apt.doctorName}</span>
                    <span className="text-[11px] text-[#0F766E] font-medium block">{apt.department}</span>
                  </td>

                  {/* Slot */}
                  <td className="py-4 px-5">
                    <span className="font-semibold text-slate-900 block">{apt.appointmentDate}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{apt.startTime}</span>
                    </span>
                  </td>

                  {/* Fee */}
                  <td className="py-4 px-5">
                    <span className="font-bold text-slate-900 block">₹{apt.fee}</span>
                    <span className="badge-teal text-[10px] py-0.5 px-2 font-bold">
                      PAID
                    </span>
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-4 px-5 text-center">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-teal-50 text-[#0F766E] border-teal-200'
                          : apt.status === 'IN_CONSULTATION'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : apt.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <option value="CONFIRMED">CONFIRMED (Queued)</option>
                      <option value="IN_CONSULTATION">IN CONSULTATION</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  {/* View Details / Token Modal */}
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(apt)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-[#0F766E] text-slate-600 transition shadow-2xs inline-flex items-center gap-1"
                      title="View Token Slip"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">Slip</span>
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Hospital OPD Token Slip
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-teal-300 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-[10px] uppercase font-bold text-[#0F766E]">
                  Token Number
                </span>
                <span className="font-mono font-bold text-base text-slate-900">
                  {selectedAppointment.appointmentCode}
                </span>
              </div>

              <div className="space-y-1">
                <p><span className="text-slate-500">Patient:</span> <span className="font-bold text-slate-900">{selectedAppointment.patientName}</span> ({selectedAppointment.patientAge} Yrs, {selectedAppointment.patientGender})</p>
                <p><span className="text-slate-500">Phone:</span> <span className="font-bold text-slate-900">{selectedAppointment.patientPhone}</span></p>
                <p><span className="text-slate-500">Doctor:</span> <span className="font-bold text-slate-900">{selectedAppointment.doctorName}</span></p>
                <p><span className="text-slate-500">Department:</span> <span className="font-semibold text-[#0F766E]">{selectedAppointment.department}</span></p>
                <p><span className="text-slate-500">Slot:</span> <span className="font-bold text-slate-900">{selectedAppointment.appointmentDate} at {selectedAppointment.startTime}</span></p>
                <p><span className="text-slate-500">Consultation Fee:</span> <span className="font-bold text-emerald-700">₹{selectedAppointment.fee} (PAID)</span></p>
              </div>

              <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                Sanjeevani Multispeciality Hospital, Plot 17, Rishi Park, Ambad Choufuli, Jalna
              </p>
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
