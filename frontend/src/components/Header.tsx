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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#D5EFE3] via-[#C8E8EB] to-[#BFE0F7] border-b-2 border-[#002B5B]/15 shadow-md backdrop-blur-md">
      {/* ─── MAIN BRAND & SPACIOUS NAVIGATION BAR (Saturated, No Jitter/Animation) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          
          {/* Hospital Brand Logo (Solid, Crisp, No Scaling Animation) */}
          <Link to="/" className="flex items-center space-x-3.5 shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#002B5B] via-[#003B73] to-[#00875A] flex items-center justify-center text-white shadow-md p-3 border-2 border-emerald-400/60">
              <HeartPulse className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#002B5B] tracking-tight block leading-tight font-heading">
                SANJEEVANI
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#003B73] font-black block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Crisp, Solid, Clean) */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-3 text-[14px] xl:text-[15px] font-bold text-slate-800">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#002B5B] text-white font-black shadow-sm'
                      : 'text-slate-800 hover:text-[#002B5B] hover:bg-white/60 font-bold'
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
            className="lg:hidden p-2 rounded-xl text-[#002B5B] hover:bg-white/60 border-2 border-[#002B5B]/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* ─── MOBILE DRAWER NAVIGATION MENU ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-[#D5EFE3] to-[#BFE0F7] border-b-2 border-[#002B5B]/20 px-5 py-4 space-y-2 shadow-xl">
          <nav className="flex flex-col space-y-1.5 text-sm font-bold text-slate-900">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-xl whitespace-nowrap transition-colors ${
                  location.pathname === link.path
                    ? 'bg-[#002B5B] text-white font-black'
                    : 'hover:bg-white/60'
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
