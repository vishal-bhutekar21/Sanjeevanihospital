import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, AlertCircle, Calendar, Shield, Languages } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

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
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notification Bar / Emergency Helpline */}
      <div className="bg-hospital-teal text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>24x7 Emergency Casualty & ICU Triage Active:</span>
            <a href="tel:+917507342222" className="underline font-bold text-amber-300 hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91-75073-42222
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block text-slate-300">Plot 17, Rishi Park, Jalna</span>
            <Link to="/admin" className="text-slate-200 hover:text-white flex items-center gap-1">
              <Shield className="w-3 h-3" /> {t('nav.adminPortal')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{i18n.language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Hospital Logo & Brand Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hospital-teal to-hospital-cyan flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <span className="text-2xl font-bold tracking-tighter">S</span>
            </div>
            <div>
              <span className="text-xl font-bold text-hospital-teal tracking-tight block leading-tight">
                SANJEEVANI
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-medium block">
                Multispeciality Hospital • Jalna
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition py-1 border-b-2 ${
                    isActive
                      ? 'text-hospital-teal border-hospital-teal font-semibold'
                      : 'border-transparent text-slate-600 hover:text-hospital-teal'
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emergency-600 bg-emergency-50 border border-emergency-200 rounded-lg hover:bg-emergency-100 transition"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{t('quickActions.emergency')}</span>
            </a>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-hospital-teal hover:bg-hospital-teal/90 rounded-lg shadow-sm hover:shadow transition"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{t('nav.bookAppointment')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
