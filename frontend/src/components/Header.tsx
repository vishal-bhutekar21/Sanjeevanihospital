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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-subtle">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Hospital Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-sm shrink-0">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight block leading-tight font-heading">
                SANJEEVANI
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-[#0F766E] font-semibold bg-teal-50/80'
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
              className="ml-2 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>

            {/* Direct Book CTA */}
            <Link
              to="/book"
              className="ml-3 btn-primary text-xs py-2 px-3.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book Appointment'}</span>
            </Link>
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 flex items-center gap-1"
            >
              <span>{isMr ? 'EN' : 'मराठी'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-xs py-2.5 w-full"
            >
              <Calendar className="w-4 h-4" />
              <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
            </Link>

            <a
              href="tel:+917507342222"
              className="btn-emergency text-xs py-2.5 w-full"
            >
              <Phone className="w-4 h-4" />
              <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Casualty'}</span>
            </a>
          </div>

          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700 border-t border-slate-100 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#0F766E] font-semibold bg-teal-50'
                    : 'hover:bg-slate-50'
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
