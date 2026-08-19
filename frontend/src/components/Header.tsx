import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  HeartPulse,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F0FDF4] via-[#F4F9F9] to-[#E0F2FE] border-b-2 border-emerald-600/20 shadow-md backdrop-blur-md">
      {/* ─── MAIN BRAND & SPACIOUS NAVIGATION BAR (30% Soothing Greenish Navbar) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28">
          
          {/* Hospital Brand Logo */}
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#002B5B] via-[#003B73] to-[#00875A] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-200 p-3.5 border-2 border-emerald-400/60">
              <HeartPulse className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-300" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#002B5B] tracking-tight block leading-tight font-heading group-hover:text-emerald-800 transition-colors">
                SANJEEVANI
              </span>
              <span className="text-xs sm:text-[13px] uppercase tracking-widest text-[#003B73] font-black block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Spacious, Soothing Pill Active State) */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 text-[15px] xl:text-[16px] font-bold text-slate-800">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#002B5B] text-white font-black shadow-md border-2 border-cyan-400'
                      : 'text-slate-800 hover:text-[#002B5B] hover:bg-emerald-100/70 font-bold'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl text-[#002B5B] hover:bg-emerald-100/70 transition border-2 border-emerald-400/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-[#F0FDF4] to-[#E0F2FE] border-b-2 border-emerald-600/20 px-6 py-6 space-y-4 shadow-2xl animate-fade-in">
          <nav className="flex flex-col space-y-2.5 text-base font-bold text-slate-900">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-2xl transition whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'bg-[#002B5B] text-white font-black'
                    : 'hover:bg-emerald-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
