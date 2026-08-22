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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D3E4FE] shadow-[0_2px_12px_rgba(0,43,91,0.05)]">
      {/* ─── MAIN BRAND & NAVIGATION BAR ─── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-22">
          
          {/* Hospital Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#001736] to-[#002B5B] flex items-center justify-center text-white shadow-md p-2.5 border border-[#00875A]/40 shrink-0">
              <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-[#8AF5BE]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-xl sm:text-2xl font-bold text-[#001736] tracking-tight block leading-tight font-heading truncate">
                SANJEEVANI
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#00875A] font-bold block truncate">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-[14px] font-medium text-[#43474F]">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#002B5B] text-white font-semibold shadow-sm'
                      : 'text-[#43474F] hover:text-[#001736] hover:bg-[#EFF4FF]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Desktop Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="ml-2 px-3 py-1.5 rounded-lg bg-[#F8F9FF] hover:bg-[#EFF4FF] text-[#002B5B] font-bold text-xs border border-[#D3E4FE] flex items-center gap-1.5 transition-all"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00875A]" />
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>

            {/* Desktop Header Direct Book Button */}
            <Link
              to="/book"
              className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00875A] hover:bg-[#006C47] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-[#EFF4FF] text-[#002B5B] font-bold text-xs border border-[#D3E4FE] flex items-center gap-1"
              title="Change Language / भाषा बदला"
            >
              <span>{isMr ? '🇮🇳 मराठी' : '🇬🇧 EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#001736] bg-[#F8F9FF] hover:bg-[#EFF4FF] border border-[#D3E4FE] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F9FF] border-b border-[#D3E4FE] px-4 py-5 space-y-4 shadow-xl animate-fade-in">
          
          {/* Quick Action Pills in Mobile Menu */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#00875A] text-white text-xs font-bold shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Casualty'}</span>
            </a>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-medium text-[#0B1C30] border-t border-[#D3E4FE] pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-lg whitespace-nowrap transition-colors flex items-center justify-between ${
                  location.pathname === link.path
                    ? 'bg-[#002B5B] text-white font-semibold shadow-sm'
                    : 'hover:bg-[#EFF4FF]'
                }`}
              >
                <span>{link.label}</span>
                {location.pathname === link.path && (
                  <span className="w-2 h-2 rounded-full bg-[#8AF5BE]"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
