import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  HeartPulse,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMr = i18n.language === 'mr';

  const toggleLanguage = () => {
    const nextLang = isMr ? 'en' : 'mr';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* ─── 1. TOP UTILITY BAR (CLEAN SLATE & AMBER ACCENTS) ────────────────── */}
      <div className="hidden xl:block bg-[#0B132B] text-slate-200 text-[11px] font-medium py-1.5 px-4 lg:px-6 border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <a
              href="tel:+917507342222"
              className="flex items-center gap-1.5 text-red-400 hover:text-white transition font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{isMr ? '२४x७ आपत्कालीन: +91-75073-42222' : '24x7 Casualty: +91-75073-42222'}</span>
            </a>

            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? 'अंबड चौफुली, जालना' : 'Ambad Choufuli, Jalna'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? 'ओपीडी: ०९:०० AM – ०८:०० PM' : 'OPD: 09:00 AM – 08:00 PM'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? 'महात्मा फुले व कॅशलेस विमा कक्ष' : 'MJPJAY & Cashless Insurance Desk'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN NAVIGATION BAR ─────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Hospital Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group mr-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#115E59] transition shrink-0">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight font-heading group-hover:text-[#0F766E] transition">
                SANJEEVANI
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium block truncate">
                Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 text-xs xl:text-[13px] font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0F766E] font-bold bg-teal-50 shadow-2xs'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-1 px-2.5 py-1.5 rounded-md text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors border border-slate-200 shrink-0 bg-white"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>

            {/* Direct Book CTA */}
            <Link
              to="/book"
              className="ml-1.5 btn-primary text-xs py-1.5 px-3 whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 min-h-[36px]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-[#0F766E]" />
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── 3. MOBILE DRAWER MENU ──────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-xs py-2.5 w-full flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="btn-emergency text-xs py-2.5 w-full flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Casualty'}</span>
            </a>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-teal-50 text-[#0F766E] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
