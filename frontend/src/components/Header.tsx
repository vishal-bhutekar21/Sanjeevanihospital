import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, UserRound } from 'lucide-react';
import { HOSPITAL } from '../config/hospital';
import { usePatientSignedIn } from '../lib/patientPortal';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMr = i18n.language === 'mr';
  const patientSignedIn = usePatientSignedIn();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    const nextLang = isMr ? 'en' : 'mr';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('sanjeevani_lang', nextLang);
  };

  const navLinks = [
    { path: '/departments', label: t('nav.departments') },
    { path: '/doctors', label: t('nav.doctors') },
    { path: '/facilities', label: t('nav.facilities') },
    { path: '/mjpjay', label: t('nav.mjpjay') },
    { path: '/insurance', label: t('nav.insurance') },
    { path: '/events', label: t('nav.events') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E7E3DA]">
      {/* Top strip: the two things people look for first */}
      <div className="hidden md:block bg-[#1C2321] text-[13px] text-stone-300">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="flex items-center gap-2 text-white hover:text-red-200">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden />
              <span>
                {isMr ? 'आपत्कालीन (२४ तास):' : 'Emergency, 24 hours:'}{' '}
                <span className="font-semibold">{HOSPITAL.phones.emergency.short}</span>
              </span>
            </a>
            <span className="hidden lg:inline">
              {isMr ? HOSPITAL.opdHours.mr : HOSPITAL.opdHours.en}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden lg:inline">
              {isMr ? HOSPITAL.locality.mr : HOSPITAL.locality.en}
            </span>
            <button
              onClick={toggleLanguage}
              className="text-white hover:underline underline-offset-4"
              lang={isMr ? 'en' : 'mr'}
            >
              {isMr ? 'English' : 'मराठी'}
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={HOSPITAL.logo} alt="" className="w-10 h-10 object-contain" />
            <span className="leading-tight">
              <span className="block font-heading text-lg font-semibold text-[#1C2321]">
                {isMr ? HOSPITAL.shortNameMr : HOSPITAL.shortName}
              </span>
              <span className="block text-xs text-stone-500">
                {isMr ? `${HOSPITAL.kind.mr} · ${HOSPITAL.cityMr}` : `${HOSPITAL.kind.en} · ${HOSPITAL.city}`}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[14px]" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`px-2.5 py-2 whitespace-nowrap border-b-2 transition-colors ${
                  isActive(link.path)
                    ? 'border-[#0F766E] text-[#0F766E] font-medium'
                    : 'border-transparent text-stone-700 hover:text-[#1C2321]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/patient"
              aria-current={location.pathname.startsWith('/patient') ? 'page' : undefined}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-md text-sm font-medium text-stone-700 hover:text-[#0F766E] hover:bg-stone-100"
            >
              <UserRound className="w-4 h-4" aria-hidden />
              {patientSignedIn ? (isMr ? 'माझी माहिती' : 'My records') : isMr ? 'पेशंट लॉगिन' : 'Patient login'}
            </Link>
            <Link to="/book" className="hidden sm:inline-flex btn-primary min-h-[40px] py-2 px-4 text-sm">
              {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
            </Link>

            <a
              href={`tel:${HOSPITAL.phones.emergency.tel}`}
              className="md:hidden p-2.5 rounded-md text-red-700 hover:bg-red-50"
              aria-label={isMr ? 'आपत्कालीन कॉल करा' : 'Call emergency'}
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-md text-stone-700 hover:bg-stone-100"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        // Scrolls on its own: the header is sticky, so a tall menu on a short screen could not be scrolled otherwise
        <div className="lg:hidden border-t border-[#E7E3DA] bg-white max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-6.25rem)] overflow-y-auto overscroll-contain">
          <nav className="px-4 py-2" aria-label="Mobile">
            {[{ path: '/', label: t('nav.home') }, ...navLinks].map((link) => {
              const active = link.path === '/' ? location.pathname === '/' : isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 border-b border-stone-100 text-[15px] ${
                    active ? 'text-[#0F766E] font-semibold' : 'text-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/patient"
              className={`flex items-center gap-2 py-3 border-b border-stone-100 text-[15px] ${location.pathname.startsWith('/patient') ? 'text-[#0F766E] font-semibold' : 'text-stone-800'}`}
            >
              <UserRound className="w-4 h-4" aria-hidden />
              {patientSignedIn ? (isMr ? 'माझी माहिती (पेशंट लॉगिन)' : 'My records (Patient login)') : isMr ? 'पेशंट लॉगिन: बिले व औषधे' : 'Patient login: bills and medicines'}
            </Link>
          </nav>
          <div className="px-4 py-4 flex items-center justify-between gap-3">
            <button onClick={toggleLanguage} className="btn-secondary flex-1" lang={isMr ? 'en' : 'mr'}>
              {isMr ? 'English' : 'मराठी'}
            </button>
            <Link to="/book" className="btn-primary flex-1">
              {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
