import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Calendar,
  Shield,
  Languages,
  Menu,
  X,
  MapPin,
  HeartPulse,
  Award,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('sanjeevani_lang', nextLang);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/departments', label: t('nav.departments') },
    { path: '/doctors', label: t('nav.doctors') },
    { path: '/facilities', label: t('nav.facilities') },
    { path: '/mjpjay', label: t('nav.mjpjay') },
    { path: '/insurance', label: t('nav.insurance') },
    { path: '/events', label: t('nav.events') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* ─── TOP NOTIFICATION & EMERGENCY BAR (Zero Overlapping, Crisp High Contrast) ─── */}
      <div className="bg-slate-950 text-slate-200 py-2.5 px-4 sm:px-8 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Emergency 24x7 Hotline */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span className="font-bold text-rose-300 hidden sm:inline">
              24x7 Emergency:
            </span>
            <a
              href="tel:+917507342222"
              className="font-extrabold text-amber-300 hover:text-white transition flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded tracking-wide"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91-75073-42222</span>
            </a>
          </div>

          {/* Location & Accreditations (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-6 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-hospital-cyan shrink-0" />
              <span>Plot 17, Rishi Park, Ambad Choufuli, Jalna</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-0.5 rounded">
              <Award className="w-3 h-3" />
              <span>MJPJAY Govt. Empanelled</span>
            </div>
          </div>

          {/* Admin Link & Language Toggle */}
          <div className="flex items-center space-x-4 shrink-0">
            <Link
              to="/admin/login"
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition font-semibold text-[11px]"
            >
              <Shield className="w-3.5 h-3.5 text-hospital-cyan" />
              <span>{t('nav.adminPortal')}</span>
            </Link>

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-hospital-teal text-white font-bold transition border border-white/20 text-xs shadow-sm cursor-pointer"
              title="Switch Language / भाषा बदला"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>{i18n.language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ─── MAIN BRAND & NAVIGATION BAR ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Hospital Brand Logo (NO CHIPS, Pure Prestigious Corporate Typography) */}
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-hospital-navy via-hospital-teal to-teal-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 p-3">
              <HeartPulse className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block leading-tight font-heading group-hover:text-hospital-teal transition-colors">
                SANJEEVANI
              </span>
              <span className="text-xs sm:text-[13px] uppercase tracking-widest text-hospital-teal font-extrabold block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Spacious, Elegant, Large Typography) */}
          <nav className="hidden xl:flex items-center space-x-7 text-[15px] font-bold text-slate-700">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-all py-1.5 border-b-2 ${
                    isActive
                      ? 'text-hospital-teal border-hospital-teal font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-hospital-teal hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Big Identifiable Book Appointment Button */}
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="tel:02482223322"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-3 text-xs font-extrabold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-hospital-teal" />
              <span>02482-223322</span>
            </a>

            {/* BIG IDENTIFIABLE BOOK APPOINTMENT BUTTON */}
            <Link
              to="/book"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 text-sm sm:text-base font-black text-white bg-gradient-to-r from-hospital-navy via-hospital-teal to-teal-700 hover:from-teal-700 hover:to-hospital-navy rounded-xl shadow-lg shadow-teal-950/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border border-teal-500/30 tracking-wide"
            >
              <Calendar className="w-5 h-5 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap">{t('nav.bookAppointment')}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:text-hospital-teal hover:bg-slate-100 transition border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-5 shadow-2xl animate-fade-in">
          <nav className="flex flex-col space-y-3 text-base font-bold text-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-4 rounded-xl transition ${
                  location.pathname === link.path
                    ? 'bg-hospital-soft text-hospital-teal font-extrabold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-hospital-teal text-white font-extrabold text-base shadow text-center"
            >
              <Calendar className="w-5 h-5 text-emerald-300" />
              <span>{t('nav.bookAppointment')}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-xs text-center"
            >
              <Phone className="w-4 h-4" />
              <span>24x7 Casualty: +91-75073-42222</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
