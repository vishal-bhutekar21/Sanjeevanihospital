import React, { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  const renderNavLinks = () => (
    <>
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-hospital-cyan flex items-center justify-center text-white shrink-0">
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

        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Operations</p>
        {menuItems.filter(m => m.group === 'core').map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-hospital-teal text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 pt-3">Community</p>
        {menuItems.filter(m => m.group === 'ext').map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-hospital-teal text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3.5 text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 pt-3">System</p>
        {menuItems.filter(m => m.group === 'settings').map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-hospital-teal text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3 text-xs shrink-0">
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
          <p className="text-[11px] text-slate-400 truncate">{admin?.email || 'admin@sanjeevanihosp.in'}</p>
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
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 overflow-x-hidden">
      {/* Desktop Sidebar (lg screens) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 shadow-lg">
        {renderNavLinks()}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavLinks()}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Hamburger Button for Mobile/Tablet */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Hospital Administration & Slot Engine
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Live operational data and booking controls for Sanjeevani Jalna
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">PostgreSQL Connected</span>
              <span className="sm:hidden">Online</span>
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
