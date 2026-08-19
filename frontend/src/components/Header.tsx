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
    <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-md">
      {/* ─── TOP EMERGENCY & INFO BAR (Scrollable, High-Contrast, Zero Overlapping) ─── */}
      <div className="bg-[#001529] text-white py-2.5 px-4 sm:px-8 text-xs font-semibold border-b border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6 min-w-max">
          
          {/* Emergency 24x7 Casualty Hotline */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
            <span className="font-extrabold text-rose-300">
              24x7 Casualty & ICU Active:
            </span>
            <a
              href="tel:+917507342222"
              className="font-black text-amber-300 hover:text-white transition flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-lg tracking-wider border border-amber-300/30"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91-75073-42222</span>
            </a>
          </div>

          {/* Jalna Location & MJPJAY Government Empanelled Tag */}
          <div className="flex items-center space-x-6 text-xs text-slate-200 shrink-0">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Plot 17, Rishi Park, Ambad Choufuli, Jalna</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-lg">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>MJPJAY & Ayushman Empanelled</span>
            </div>
          </div>

          {/* Admin Portal & Language Switcher */}
          <div className="flex items-center space-x-4 shrink-0">
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition font-bold text-xs bg-white/10 px-2.5 py-1 rounded-lg"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t('nav.adminPortal')}</span>
            </Link>

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-black transition border border-cyan-400/50 text-xs shadow-md cursor-pointer"
              title="Switch Language / भाषा बदला"
            >
              <Languages className="w-3.5 h-3.5 text-white" />
              <span>{i18n.language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ─── MAIN BRAND & NAVIGATION BAR ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28">
          
          {/* Hospital Brand Logo (NO CHIPS, Grand Classic Hospital Typography) */}
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#002B5B] via-[#003B73] to-[#007791] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200 p-3.5 border-2 border-cyan-400/30">
              <HeartPulse className="w-9 h-9 text-cyan-300" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#002B5B] tracking-tight block leading-tight font-heading group-hover:text-cyan-700 transition-colors">
                SANJEEVANI
              </span>
              <span className="text-xs sm:text-[13px] uppercase tracking-widest text-[#003B73] font-black block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Large, Bold, High-Contrast Typography) */}
          <nav className="hidden xl:flex items-center space-x-7 text-[16px] font-bold text-slate-800">
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
                      ? 'text-[#002B5B] border-[#002B5B] font-black'
                      : 'border-transparent text-slate-700 hover:text-[#002B5B] hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: 2X LARGER EYE-CATCHING BOOK APPOINTMENT BUTTON */}
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="tel:02482223322"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-3.5 text-xs font-black text-slate-800 bg-slate-100 border-2 border-slate-300 rounded-2xl hover:bg-slate-200 transition"
            >
              <Phone className="w-4 h-4 text-[#002B5B]" />
              <span>02482-223322</span>
            </a>

            {/* 2X LARGER, IDENTIFIABLE BOOK APPOINTMENT BUTTON */}
            <Link
              to="/book"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 text-base sm:text-lg font-black text-white bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#007791] hover:from-[#003B73] hover:to-[#002B5B] rounded-2xl shadow-xl shadow-royal/30 hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-cyan-400/40 tracking-wide"
            >
              <Calendar className="w-5 h-5 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap">{t('nav.bookAppointment')}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-3 rounded-2xl text-slate-800 hover:text-[#002B5B] hover:bg-slate-100 transition border-2 border-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-slate-200 px-6 py-6 space-y-5 shadow-2xl animate-fade-in">
          <nav className="flex flex-col space-y-3 text-lg font-bold text-slate-900">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-xl transition ${
                  location.pathname === link.path
                    ? 'bg-hospital-soft text-[#002B5B] font-black'
                    : 'hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t-2 border-slate-100 flex flex-col space-y-3">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl bg-gradient-to-r from-[#002B5B] to-[#007791] text-white font-black text-lg shadow-lg text-center"
            >
              <Calendar className="w-5 h-5 text-emerald-300" />
              <span>{t('nav.bookAppointment')}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 text-rose-700 border-2 border-rose-200 font-extrabold text-sm text-center"
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
