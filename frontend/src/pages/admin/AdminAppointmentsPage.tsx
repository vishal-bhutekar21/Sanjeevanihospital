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
} from 'lucide-react';

interface AppointmentItem {
  id: string;
  appointmentCode: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientAddress: string;
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

  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'apt-001',
      appointmentCode: 'SMH-2026-000101',
      patientName: 'Ramesh Patil',
      patientPhone: '+919876543210',
      patientAge: 38,
      patientAddress: 'Jalna Rural, Maharashtra',
      doctorName: 'Dr. Nishant Goyal',
      department: 'Orthopedics & Joint Replacement',
      appointmentDate: '2026-08-25',
      startTime: '11:30 AM',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: 500,
    },
    {
      id: 'apt-002',
      appointmentCode: 'SMH-2026-000102',
      patientName: 'Sunita Deshmukh',
      patientPhone: '+919876543211',
      patientAge: 29,
      patientAddress: 'Ambad Road, Jalna',
      doctorName: 'Dr. Shivdas Mirkad',
      department: 'Pediatrics & Neonatology',
      appointmentDate: '2026-08-25',
      startTime: '12:00 PM',
      status: 'IN_CONSULTATION',
      paymentStatus: 'PAID',
      fee: 500,
    },
    {
      id: 'apt-003',
      appointmentCode: 'SMH-2026-000103',
      patientName: 'Ganesh Shinde',
      patientPhone: '+919876543212',
      patientAge: 52,
      patientAddress: 'Partur Taluka, Jalna',
      doctorName: 'Dr. Baliram Bagal',
      department: 'Critical Care & Anesthesiology',
      appointmentDate: '2026-08-25',
      startTime: '10:00 AM',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      fee: 400,
    },
  ]);

  const updateStatus = (id: string, newStatus: any) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.appointmentCode.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-800';
      case 'IN_CONSULTATION':
        return 'bg-amber-100 text-amber-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800';
      case 'NO_SHOW':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Appointments & OPD Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time patient queues, update consultation states, and view transaction records.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by appointment ID, patient name or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_CONSULTATION">In Consultation</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Token / ID</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Reporting Slot</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Queue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-hospital-teal">
                    {apt.appointmentCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{apt.patientName}</p>
                      <p className="text-[11px] text-slate-500">
                        {apt.patientAge} Yrs • {apt.patientPhone}
                      </p>
                      <p className="text-[10px] text-slate-400">{apt.patientAddress}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{apt.doctorName}</p>
                    <p className="text-[11px] text-hospital-cyan">{apt.department}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{apt.appointmentDate}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{apt.startTime}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ₹{apt.fee} {apt.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 focus:outline-none ${getStatusBadge(
                        apt.status,
                      )}`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_CONSULTATION">IN CONSULTATION</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="NO_SHOW">NO SHOW</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-hospital-teal transition"
                      title="Print Token Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
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
