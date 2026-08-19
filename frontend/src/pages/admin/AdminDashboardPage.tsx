import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    todayAppointments: 14,
    activeDoctors: 6,
    pendingSlots: 3,
    icuOccupancy: '75%',
    totalRevenue: '₹6,800',
  });

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Executive Operations Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time patient appointments, doctor shift monitoring & revenue ledger for Sanjeevani Jalna.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-hospital-teal text-white text-xs font-bold rounded-xl shadow-sm hover:bg-hospital-teal/90 transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Appointments</span>
          </Link>
          <Link
            to="/admin/doctors"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-hospital-cyan" />
            <span>Add Doctor</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Appointments</span>
            <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.todayAppointments}</div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>+4 bookings in last 2 hrs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Doctors on Duty</span>
            <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.activeDoctors}</div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All 6 OPDs Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ICU Bed Occupancy</span>
            <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.icuOccupancy}</div>
          <div className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>6 of 8 critical beds occupied</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">OPD Collection (Today)</span>
            <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalRevenue}</div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Razorpay Verified</span>
          </div>
        </div>
      </div>

      {/* Grid: Active Shift Doctors + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Doctors Roster */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Today's Specialist Roster</h3>
            <Link to="/admin/schedules" className="text-xs text-hospital-teal font-semibold hover:underline">
              Edit Shifts
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Nishant Goyal</p>
                <p className="text-[11px] text-hospital-cyan font-medium">Orthopedics & Joint Replacement</p>
                <p className="text-[10px] text-slate-500">Shift: 11:00 AM – 04:00 PM</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ON DUTY
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Shivdas Mirkad</p>
                <p className="text-[11px] text-hospital-cyan font-medium">Pediatrics & Neonatology</p>
                <p className="text-[10px] text-slate-500">Shift: 10:00 AM – 02:00 PM</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ON DUTY
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Baliram Bagal</p>
                <p className="text-[11px] text-hospital-cyan font-medium">Critical Care & Anesthesia</p>
                <p className="text-[10px] text-slate-500">Shift: 09:00 AM – 03:00 PM</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ON DUTY
              </span>
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Booking Feed</h3>
              <p className="text-xs text-slate-500">Real-time appointments confirmed by patients</p>
            </div>
            <Link to="/admin/appointments" className="text-xs text-hospital-teal font-semibold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">ID</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Fee</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-hospital-teal">SMH-2026-000101</td>
                  <td className="py-3 px-3 font-medium text-slate-900">Ramesh Patil</td>
                  <td className="py-3 px-3">Dr. Nishant Goyal</td>
                  <td className="py-3 px-3">11:30 AM</td>
                  <td className="py-3 px-3 font-semibold">₹500</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-hospital-teal">SMH-2026-000102</td>
                  <td className="py-3 px-3 font-medium text-slate-900">Sunita Deshmukh</td>
                  <td className="py-3 px-3">Dr. Shivdas Mirkad</td>
                  <td className="py-3 px-3">12:00 PM</td>
                  <td className="py-3 px-3 font-semibold">₹500</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
