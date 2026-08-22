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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#D5EFE3] via-[#C8E8EB] to-[#BFE0F7] border-b-2 border-[#002B5B]/15 shadow-md backdrop-blur-md">
      {/* ─── MAIN BRAND & SPACIOUS NAVIGATION BAR ─── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 sm:h-22 lg:h-24">
          
          {/* Hospital Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#002B5B] via-[#003B73] to-[#00875A] flex items-center justify-center text-white shadow-md p-2.5 sm:p-3 border-2 border-emerald-400/60 shrink-0">
              <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-lg sm:text-2xl font-black text-[#002B5B] tracking-tight block leading-tight font-heading truncate">
                SANJEEVANI
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#003B73] font-black block truncate">
                Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[14px] xl:text-[15px] font-bold text-slate-800">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#002B5B] text-white font-black shadow-sm'
                      : 'text-slate-800 hover:text-[#002B5B] hover:bg-white/60 font-bold'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Desktop Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="ml-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#002B5B] font-extrabold text-xs border border-[#002B5B]/30 flex items-center gap-1.5 shadow-sm transition-all"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#007791]" />
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Language Switch + Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-white text-[#002B5B] font-black text-xs border border-[#002B5B]/30 flex items-center gap-1 shadow-sm"
              title="Change Language / भाषा बदला"
            >
              <span>{isMr ? '🇮🇳 मराठी' : '🇬🇧 EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#002B5B] bg-white/70 hover:bg-white border-2 border-[#002B5B]/30 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-[#D5EFE3] via-[#C8E8EB] to-[#BFE0F7] border-b-2 border-[#002B5B]/20 px-4 py-5 space-y-4 shadow-2xl animate-fade-in">
          
          {/* Quick Action Pills in Mobile Menu */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#002B5B] text-white text-xs font-black shadow-md border border-cyan-400/40"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-black shadow-md border border-rose-400/40"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Casualty'}</span>
            </a>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-900 border-t border-[#002B5B]/15 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-xl whitespace-nowrap transition-colors flex items-center justify-between ${
                  location.pathname === link.path
                    ? 'bg-[#002B5B] text-white font-black shadow-sm'
                    : 'hover:bg-white/60'
                }`}
              >
                <span>{link.label}</span>
                {location.pathname === link.path && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
