import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Stethoscope,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Phone,
  Bed,
} from 'lucide-react';
import { DOCTORS_DATA } from '../../data/doctorsData';

export const AdminDashboardPage: React.FC = () => {
  const [stats] = useState({
    todayAppointments: 18,
    activeDoctors: 8,
    pendingSlots: 5,
    icuOccupancy: '76%',
    totalRevenue: '₹9,200',
  });

  const recentAppointments = [
    {
      id: 'apt-101',
      code: 'SNH-2026-8492',
      patient: 'Suresh Patil',
      age: '42 Yrs • Male',
      phone: '+91-98765-43210',
      doctor: 'Dr. Nishant Goyal',
      dept: 'Orthopedics & Joint Replacement',
      time: '11:00 AM',
      fee: '₹500',
      status: 'CONFIRMED',
    },
    {
      id: 'apt-102',
      code: 'SNH-2026-4129',
      patient: 'Pooja Deshmukh',
      age: '28 Yrs • Female',
      phone: '+91-98223-11445',
      doctor: 'Dr. Anshul Goyal',
      dept: 'Obstetrics & Gynecology',
      time: '11:30 AM',
      fee: '₹500',
      status: 'IN_CONSULTATION',
    },
    {
      id: 'apt-103',
      code: 'SNH-2026-9031',
      patient: 'Master Aryan Kale',
      age: '6 Yrs • Male',
      phone: '+91-94231-88990',
      doctor: 'Dr. Shivdas Mirkad',
      dept: 'Pediatrics & Neonatology (NICU)',
      time: '12:00 PM',
      fee: '₹500',
      status: 'CONFIRMED',
    },
    {
      id: 'apt-104',
      code: 'SNH-2026-7712',
      patient: 'Rameshwar Shinde',
      age: '54 Yrs • Male',
      phone: '+91-97665-23411',
      doctor: 'Dr. Kailash Rajguru',
      dept: 'Internal Medicine & Physician',
      time: '12:30 PM',
      fee: '₹400',
      status: 'COMPLETED',
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* ─── 1. EXECUTIVE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge-teal text-[11px] py-0.5 px-2.5">
              Live Operations Control
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Jalna Facility • {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Hospital Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Real-time outpatient queue, doctor shifts, 21-bed ICU occupancy & digital billing ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/appointments"
            className="btn-primary text-xs py-2 px-4 shadow-2xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Manage Queue</span>
          </Link>
          <Link
            to="/admin/doctors"
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Doctors (14)</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. MINIMAL 4-METRIC STAT CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Appointments */}
        <div className="card-clean p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Bookings
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">{stats.todayAppointments}</span>
            <span className="text-xs font-semibold text-emerald-600">+4 in last 2h</span>
          </div>
          <p className="text-[11px] text-slate-400">All registered OPD time slots for today</p>
        </div>

        {/* Card 2: Active Faculty */}
        <div className="card-clean p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Doctors on Duty
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">{stats.activeDoctors}</span>
            <span className="text-xs text-slate-500">/ 14 Total Faculty</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>All 6 OPD Chambers Operating</span>
          </p>
        </div>

        {/* Card 3: ICU Occupancy */}
        <div className="card-clean p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              21-Bed ICU Status
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">{stats.icuOccupancy}</span>
            <span className="text-xs font-semibold text-amber-700">16 / 21 Beds</span>
          </div>
          <p className="text-[11px] text-slate-400">5 critical ventilator beds available</p>
        </div>

        {/* Card 4: Revenue */}
        <div className="card-clean p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's OPD Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 font-heading">{stats.totalRevenue}</span>
            <span className="text-xs text-emerald-600 font-semibold">100% Cashless/UPI</span>
          </div>
          <p className="text-[11px] text-slate-400">Direct hospital ledger settlement</p>
        </div>
      </div>

      {/* ─── 3. TWO-COLUMN BALANCED WORKSPACE ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Live OPD Patient Queue */}
        <div className="lg:col-span-8 card-clean bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0F766E]" />
                <span>Live Outpatient Queue & Consultation Status</span>
              </h2>
              <p className="text-xs text-slate-500">
                Real-time patient check-ins and appointment tokens for today's session.
              </p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
            >
              <span>View Full Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Token / Patient</th>
                  <th className="pb-3 font-semibold">Specialist Doctor</th>
                  <th className="pb-3 font-semibold">Slot Time</th>
                  <th className="pb-3 font-semibold">Fee</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 pr-3">
                      <span className="font-mono font-bold text-slate-900 block">{apt.code}</span>
                      <span className="font-semibold text-slate-700 block">{apt.patient}</span>
                      <span className="text-[10px] text-slate-400 block">{apt.age}</span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="font-bold text-slate-900 block">{apt.doctor}</span>
                      <span className="text-[10px] text-[#0F766E] block font-medium truncate max-w-[180px]">{apt.dept}</span>
                    </td>
                    <td className="py-3.5 pr-3 font-semibold text-slate-700">
                      {apt.time}
                    </td>
                    <td className="py-3.5 pr-3 font-bold text-slate-900">
                      {apt.fee}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : apt.status === 'IN_CONSULTATION'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Active Doctor Shift & Quick Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Doctor Shift Roster */}
          <div className="card-clean bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#0F766E]" />
                <span>On-Duty Specialists</span>
              </h3>
              <span className="badge-teal text-[10px] py-0.5 px-2">
                Active Shifts
              </span>
            </div>

            <div className="space-y-3">
              {DOCTORS_DATA.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center gap-3 hover:bg-slate-100/70 transition"
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-[10px] text-[#0F766E] font-medium truncate">{doc.dept}</p>
                    <p className="text-[10px] text-slate-400 truncate">{doc.timings}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active in OPD" />
                </div>
              ))}
            </div>

            <Link
              to="/admin/doctors"
              className="btn-secondary text-xs w-full py-2 flex items-center justify-center gap-1"
            >
              <span>Manage All 14 Doctors</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick Help & Emergency Hotlines */}
          <div className="card-clean bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Hospital Command Desk
              </span>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Casualty & ICU Emergency triage lines are operating 24x7 with on-call intensivists.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Helpline: +91-75073-42222</span>
              <span>Ambulance: +91-88305-18080</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
