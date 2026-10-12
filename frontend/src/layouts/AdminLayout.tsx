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
  ExternalLink,
  LogOut,
  ShieldCheck,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { DEVELOPER } from '../data/developer';

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
    { path: '/admin', label: 'Today', icon: LayoutDashboard, group: 'core' },
    { path: '/admin/appointments', label: 'Appointments', icon: CalendarCheck, group: 'core' },
    { path: '/admin/doctors', label: 'Doctors', icon: Users, group: 'core' },
    { path: '/admin/departments', label: 'Departments', icon: Building2, group: 'core' },
    { path: '/admin/schedules', label: 'OPD timings', icon: Clock, group: 'core' },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard, group: 'core' },
    { path: '/admin/schemes', label: 'Scheme claims', icon: ShieldCheck, group: 'ext' },
    { path: '/admin/reviews-events', label: 'Reviews & camps', icon: Star, group: 'ext' },
    { path: '/admin/settings', label: 'Settings', icon: Settings, group: 'settings' },
  ];

  const currentPage =
    menuItems.find((m) =>
      m.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(m.path)
    )?.label || 'Today';

  const roleLabel = (role?: string) =>
    role
      ? role
          .toLowerCase()
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Hospital Admin';

  const renderNavLinks = () => (
    <>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="" className="w-9 h-9 object-contain bg-white rounded-md p-0.5 shrink-0" />
          <div className="leading-tight">
            <span className="font-heading text-base text-white block">Sanjeevani</span>
            <span className="text-xs text-stone-400">Hospital office</span>
          </div>
        </div>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        <p className="px-3.5 text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5">Daily work</p>
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
                isActive ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3.5 text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5 pt-4">Patients & schemes</p>
        {menuItems.filter(m => m.group === 'ext').map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4" />
        {menuItems.filter(m => m.group === 'settings').map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3 text-xs shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> Open website
          </span>
        </Link>

        <p className="px-3 text-[11px] leading-relaxed text-stone-500">
          Website support:{' '}
          <a href={DEVELOPER.url} target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white underline underline-offset-2">
            {DEVELOPER.name}
          </a>
          <br />
          <a href={`mailto:${DEVELOPER.email}`} className="hover:text-stone-300 break-all">
            {DEVELOPER.email}
          </a>
        </p>

        <div className="px-3 py-2 bg-white/5 rounded-md space-y-1">
          <p className="text-white font-bold text-xs">{admin?.name || 'Administrator'}</p>
          <p className="text-[11px] text-stone-400 truncate">{admin?.email || 'admin@sanjeevanihosp.in'}</p>
          <p className="text-[11px] text-stone-400">{roleLabel(admin?.role)}</p>
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
    <div className="min-h-screen flex bg-[#FAF8F4] text-stone-800 overflow-x-hidden">
      {/* Desktop Sidebar (lg screens) */}
      <aside className="hidden lg:flex w-64 bg-[#1C2321] text-stone-300 flex-col justify-between shrink-0 shadow-lg">
        {renderNavLinks()}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1C2321] text-stone-300 flex flex-col justify-between shadow-lg transition-transform duration-300 lg:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavLinks()}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E7E3DA] px-4 sm:px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Hamburger Button for Mobile/Tablet */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 border border-stone-200"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg text-[#1C2321] truncate">{currentPage}</h1>
              <p className="text-xs text-stone-500 hidden sm:block">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
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
