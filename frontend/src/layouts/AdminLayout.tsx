import React, { useEffect, useState } from 'react';
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
  IdCard,
  ClipboardList,
  CalendarPlus,
  UserPlus,
  Receipt,
  KeyRound,
  type LucideIcon,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { DEVELOPER } from '../data/developer';
import { HOSPITAL } from '../config/hospital';
import { notifyDueReminders } from '../lib/staffNotify';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Staff reminder alerts while the admin panel is open (checked every 15 minutes)
  useEffect(() => {
    notifyDueReminders();
    const t = setInterval(notifyDueReminders, 15 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isAdmin = admin?.role === 'SUPER_ADMIN' || admin?.role === 'HOSPITAL_ADMIN';
  const isDoctor = admin?.role === 'DOCTOR';

  interface MenuItem {
    path: string;
    label: string;
    icon: LucideIcon;
    group: 'front' | 'hospital' | 'admin';
    adminOnly?: boolean;
    reception?: boolean; // reception tools (hidden from doctors)
  }

  const allItems: MenuItem[] = [
    { path: '/admin', label: 'Today', icon: LayoutDashboard, group: 'front' },
    { path: '/admin/appointments/new', label: 'Book a visit', icon: CalendarPlus, group: 'front', reception: true },
    { path: '/admin/appointments', label: 'Appointments', icon: CalendarCheck, group: 'front' },
    { path: '/admin/registration', label: 'Patients', icon: UserPlus, group: 'front', reception: true },
    { path: '/admin/receipts', label: 'Receipts', icon: Receipt, group: 'front', reception: true },
    { path: '/admin/patients', label: 'Bills & medicines', icon: ClipboardList, group: 'front' },
    { path: '/admin/doctors', label: 'Doctors', icon: Users, group: 'hospital' },
    { path: '/admin/schedules', label: 'OPD timings', icon: Clock, group: 'hospital' },
    { path: '/admin/payments', label: 'Online payments', icon: CreditCard, group: 'hospital', reception: true },
    { path: '/admin/departments', label: 'Departments', icon: Building2, group: 'hospital', adminOnly: true },
    { path: '/admin/staff', label: 'Staff & salary', icon: IdCard, group: 'admin', adminOnly: true },
    { path: '/admin/logins', label: 'Team logins', icon: KeyRound, group: 'admin', adminOnly: true },
    { path: '/admin/schemes', label: 'Scheme claims', icon: ShieldCheck, group: 'admin', adminOnly: true },
    { path: '/admin/reviews-events', label: 'Reviews & camps', icon: Star, group: 'admin', adminOnly: true },
    { path: '/admin/settings', label: 'Settings', icon: Settings, group: 'admin', adminOnly: true },
  ];
  const menuItems = allItems.filter((m) => (isAdmin ? true : !m.adminOnly && !(isDoctor && m.reception)));
  const groups: { key: MenuItem['group']; title: string }[] = [
    { key: 'front', title: 'Front desk' },
    { key: 'hospital', title: 'Hospital' },
    { key: 'admin', title: 'Management' },
  ];

  // The most specific match wins, so "Book a visit" is not read as "Appointments"
  const activePath = [...menuItems]
    .sort((x, y) => y.path.length - x.path.length)
    .find((m) => (m.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(m.path)))?.path;

  const currentPage = menuItems.find((m) => m.path === activePath)?.label || (location.pathname.startsWith('/admin/receipts') ? 'Receipts' : 'Today');

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
          <img src={HOSPITAL.logo} alt="" className="w-9 h-9 object-contain bg-white rounded-md p-0.5 shrink-0" />
          <div className="leading-tight">
            <span className="font-heading text-base text-white block">{HOSPITAL.brand}</span>
            <span className="text-xs text-stone-400">Hospital office</span>
          </div>
        </div>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 flex-1 shrink-0" aria-label="Main">
        {groups.map((g) => {
          const items = menuItems.filter((m) => m.group === g.key);
          if (items.length === 0) return null;
          return (
            <div key={g.key} className="pb-3">
              <p className="px-3.5 text-xs text-stone-500 font-semibold mb-1.5">{g.title}</p>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === activePath;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3 text-xs shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 min-h-[44px] rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
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
          <p className="text-[11px] text-stone-400 truncate">{admin?.email || `admin@${HOSPITAL.website}`}</p>
          <p className="text-[11px] text-stone-400">{roleLabel(admin?.role)}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 min-h-[44px] rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/40 transition font-bold"
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
      <aside className="hidden lg:flex w-64 bg-[#1C2321] text-stone-300 flex-col justify-between shrink-0 shadow-lg overflow-y-auto">
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1C2321] text-stone-300 flex flex-col justify-between overflow-y-auto overscroll-contain shadow-lg transition-transform duration-300 lg:hidden ${
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
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 border border-stone-200"
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
