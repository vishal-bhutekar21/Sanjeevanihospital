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
  Clock,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* ─── TOP EMERGENCY & INFORMATION BAR ─────────────────────────────────────── */}
      <div className="bg-slate-950 text-slate-200 py-2 px-4 sm:px-8 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* 24x7 Emergency Casualty Status */}
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span className="font-semibold text-rose-300">
              {t('topbar.casualty')}:
            </span>
            <a
              href="tel:+917507342222"
              className="font-extrabold text-amber-300 hover:text-white transition flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91-75073-42222</span>
            </a>
          </div>

          {/* Location, Schemes & Language Switcher */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] text-slate-300">
            <div className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-hospital-cyan shrink-0" />
              <span>{t('topbar.address')}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              <Award className="w-3 h-3" />
              <span>{t('topbar.mjpjayBadge')}</span>
            </div>

            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-white transition flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3 h-3 text-hospital-cyan" />
              <span>{t('nav.adminPortal')}</span>
            </Link>

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-hospital-cyan text-white font-bold transition border border-white/20 shadow-sm"
              title="Switch Language / भाषा बदला"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>{i18n.language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MAIN NAVIGATION BAR ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Hospital Logo & Brand Mark */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-hospital-teal via-teal-700 to-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-hospital-teal tracking-tight block leading-tight font-heading">
                  SANJEEVANI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-hospital-soft text-hospital-teal px-1.5 py-0.5 rounded border border-hospital-teal/20">
                  Hospital
                </span>
              </div>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-500 font-semibold block mt-0.5">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-semibold text-slate-700">
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

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <a
              href="tel:+917507342222"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>02482-223322</span>
            </a>

            {/* BIG IDENTIFIABLE BOOK APPOINTMENT BUTTON */}
            <Link
              to="/book"
              className="inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-hospital-teal via-teal-700 to-hospital-teal rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 border border-teal-500/30"
            >
              <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap">{t('nav.bookAppointment')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-hospital-teal hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── MOBILE DRAWER MENU ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg transition ${
                  location.pathname === link.path
                    ? 'bg-hospital-soft text-hospital-teal font-bold'
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-hospital-teal text-white font-bold text-sm shadow text-center"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{t('nav.bookAppointment')}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>24x7 Casualty: +91-75073-42222</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
