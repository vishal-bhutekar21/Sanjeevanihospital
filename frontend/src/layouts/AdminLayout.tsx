import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Clock,
  CreditCard,
  Settings,
  HeartPulse,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Star,
  BadgeIndianRupee,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, group: 'core' },
    { path: '/admin/appointments', label: 'Appointments & Queue', icon: CalendarCheck, group: 'core' },
    { path: '/admin/doctors', label: 'Doctor Faculty', icon: Users, group: 'core' },
    { path: '/admin/departments', label: 'Clinical Departments', icon: Building2, group: 'core' },
    { path: '/admin/schedules', label: 'Shifts & Slot Rules', icon: Clock, group: 'core' },
    { path: '/admin/payments', label: 'Payments & Revenue', icon: CreditCard, group: 'core' },
    { path: '/admin/schemes', label: 'Govt. Scheme Claims', icon: ShieldCheck, group: 'ext' },
    { path: '/admin/reviews-events', label: 'Reviews & Events', icon: Star, group: 'ext' },
    { path: '/admin/settings', label: 'Hospital Settings', icon: Settings, group: 'settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Logo & Portal Badge */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-hospital-cyan flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block">
                SANJEEVANI
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5">Operations</p>
            {menuItems.filter(m => m.group === 'core').map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 pt-3">Community</p>
            {menuItems.filter(m => m.group === 'ext').map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 pt-3">System</p>
            {menuItems.filter(m => m.group === 'settings').map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
          </Link>

          <div className="px-3 py-2 bg-slate-800/80 rounded-xl space-y-1">
            <p className="text-white font-bold text-xs">{admin?.name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400">{admin?.email || 'admin@sanjeevanihosp.in'}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">{admin?.role || 'HOSPITAL_ADMIN'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/40 transition font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Hospital Administration & Slot Engine</h1>
            <p className="text-xs text-slate-500">Live operational data and booking controls for Sanjeevani Jalna</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              PostgreSQL Connected
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
