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
      code: 'SNH-8492',
      patient: 'Suresh Patil',
      age: '42, M',
      phone: '+91 98765 43210',
      doctor: 'Dr. Nishant Goyal',
      dept: 'Orthopedics',
      time: '11:00 AM',
      fee: '₹500',
      status: 'CONFIRMED',
    },
    {
      id: 'apt-102',
      code: 'SNH-4129',
      patient: 'Pooja Deshmukh',
      age: '28, F',
      phone: '+91 98223 11445',
      doctor: 'Dr. Anshul Goyal',
      dept: 'Gynecology',
      time: '11:30 AM',
      fee: '₹500',
      status: 'IN_CONSULTATION',
    },
    {
      id: 'apt-103',
      code: 'SNH-9031',
      patient: 'Aryan Kale',
      age: '6, M',
      phone: '+91 94231 88990',
      doctor: 'Dr. Shivdas Mirkad',
      dept: 'Pediatrics',
      time: '12:00 PM',
      fee: '₹500',
      status: 'CONFIRMED',
    },
    {
      id: 'apt-104',
      code: 'SNH-7712',
      patient: 'Rameshwar Shinde',
      age: '54, M',
      phone: '+91 97665 23411',
      doctor: 'Dr. Kailash Rajguru',
      dept: 'Medicine',
      time: '12:30 PM',
      fee: '₹400',
      status: 'COMPLETED',
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* ─── 1. EXECUTIVE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl text-stone-900 font-heading">
            Hospital Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal">
            Today's OPD queue, doctors on duty, ICU beds and collections.
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

      {/* ─── 2. ULTRA-MINIMAL 4-METRIC STAT CARDS ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Bookings */}
        <div className="card-clean p-5 bg-white border border-stone-200/90 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Today's Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 font-heading">{stats.todayAppointments}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +4 new
            </span>
          </div>
        </div>

        {/* Card 2: Active Faculty */}
        <div className="card-clean p-5 bg-white border border-stone-200/90 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Doctors on Duty
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 font-heading">{stats.activeDoctors}</span>
            <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
              8 / 14 Active
            </span>
          </div>
        </div>

        {/* Card 3: ICU Occupancy */}
        <div className="card-clean p-5 bg-white border border-stone-200/90 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              21-Bed ICU Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 font-heading">{stats.icuOccupancy}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              16 / 21 Beds
            </span>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="card-clean p-5 bg-white border border-stone-200/90 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              OPD Collection
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-700 font-heading">{stats.totalRevenue}</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. TWO-COLUMN BALANCED WORKSPACE ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Live OPD Patient Queue */}
        <div className="lg:col-span-8 card-clean bg-white border border-stone-200 rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base text-stone-900 font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F766E]" />
              <span>Live Outpatient Queue</span>
            </h2>
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
                <tr className="border-b border-stone-200/80 text-stone-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 font-semibold">Token</th>
                  <th className="pb-2.5 font-semibold">Patient</th>
                  <th className="pb-2.5 font-semibold">Specialist Doctor</th>
                  <th className="pb-2.5 font-semibold">Time</th>
                  <th className="pb-2.5 font-semibold">Fee</th>
                  <th className="pb-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 pr-3 font-mono font-bold text-stone-800">
                      #{apt.code}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="font-bold text-stone-900 block">{apt.patient}</span>
                      <span className="text-[11px] text-stone-400 block">{apt.age} • {apt.phone}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="font-semibold text-stone-900 block">{apt.doctor}</span>
                      <span className="text-[11px] text-[#0F766E] block">{apt.dept}</span>
                    </td>
                    <td className="py-3 pr-3 font-medium text-stone-700">
                      {apt.time}
                    </td>
                    <td className="py-3 pr-3 font-bold text-stone-900">
                      {apt.fee}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : apt.status === 'IN_CONSULTATION'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
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

        {/* Right 4 Cols: Active Doctor Shifts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-clean bg-white border border-stone-200 rounded-lg p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="text-sm text-stone-900 font-heading flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#0F766E]" />
                <span>On-Duty Specialists</span>
              </h3>
              <span className="text-[11px] text-[#0F766E] font-bold">
                OPD Active
              </span>
            </div>

            <div className="space-y-2">
              {DOCTORS_DATA.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 bg-stone-50/70 border border-stone-200/80 rounded-lg flex items-center gap-2.5 hover:bg-stone-100/70 transition"
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{doc.name}</h4>
                    <p className="text-[10px] text-[#0F766E] font-medium truncate">{doc.dept}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
                </div>
              ))}
            </div>

            <Link
              to="/admin/doctors"
              className="btn-secondary text-xs w-full py-1.5 flex items-center justify-center gap-1"
            >
              <span>View All 14 Doctors</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
