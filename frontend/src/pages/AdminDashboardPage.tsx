import React from 'react';
import { Users, Calendar, Activity, Clock, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const stats = [
    { title: "Today's Appointments", value: '14', change: '+2 from yesterday', icon: Calendar },
    { title: 'Active Doctors on Duty', value: '8', change: 'All 8 OPDs Active', icon: Users },
    { title: 'Pending Slot Approvals', value: '3', change: 'Instant auto-confirm', icon: Clock },
    { title: 'ICU Bed Occupancy', value: '75%', change: '6 of 8 beds occupied', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Executive Operations Overview
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time patient flow and doctor shift monitoring for Sanjeevani Multispeciality Hospital.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
                <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-subtle p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent OPD Bookings</h3>
            <p className="text-xs text-slate-500">Live booking stream from patient portal</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            System Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Appointment ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-bold text-hospital-teal">SMH-2026-000101</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">Ramesh Patil</td>
                <td className="py-3.5 px-4">Dr. Nishant Goyal</td>
                <td className="py-3.5 px-4">Orthopedics</td>
                <td className="py-3.5 px-4">Today, 11:30 AM</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    CONFIRMED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-bold text-hospital-teal">SMH-2026-000102</td>
                <td className="py-3.5 px-4 font-medium text-slate-900">Sunita Deshmukh</td>
                <td className="py-3.5 px-4">Dr. Shivdas Mirkad</td>
                <td className="py-3.5 px-4">Pediatrics</td>
                <td className="py-3.5 px-4">Today, 12:00 PM</td>
                <td className="py-3.5 px-4">
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
  );
};
