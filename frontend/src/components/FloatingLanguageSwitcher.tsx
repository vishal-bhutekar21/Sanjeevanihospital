import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Phone } from 'lucide-react';

export const FloatingLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isMr = i18n.language === 'mr';

  const toggleLanguage = () => {
    const nextLang = isMr ? 'en' : 'mr';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('sanjeevani_lang', nextLang);
  };

  const isBookingPage = location.pathname === '/book';

  return (
    <>
      {/* ─── DESKTOP MINIMAL FLOATING ACTION (sm & lg) ────────────────────────── */}
      <aside
        aria-label="Quick Actions"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-3"
      >
        {/* Emergency Casualty Pill */}
        <a
          href="tel:+917507342222"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white text-slate-900 shadow-md border border-slate-200/80 hover:bg-slate-50 transition-all text-xs font-semibold group"
          title="24x7 Emergency Casualty"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-slate-600">24x7 Emergency:</span>
          <span className="font-bold text-red-600">+91-75073-42222</span>
        </a>

        {/* Book Button (if not on book page) */}
        {!isBookingPage && (
          <Link
            to="/book"
            className="btn-primary text-xs py-2.5 px-4 rounded-full shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>{isMr ? 'अपॉइंटमेंट बुक करा' : 'Book OPD'}</span>
          </Link>
        )}
      </aside>

      {/* ─── MOBILE DOCKED BOTTOM BAR (Screens < 640px) ────────────────────────── */}
      <aside
        aria-label="Mobile Quick Actions"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 p-2.5 px-4 shadow-lg flex items-center justify-between gap-3"
      >
        <a
          href="tel:+917507342222"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold"
        >
          <Phone className="w-4 h-4 text-white shrink-0" />
          <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Emergency'}</span>
        </a>

        {!isBookingPage ? (
          <Link
            to="/book"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0F766E] text-white text-xs font-semibold"
          >
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
          </Link>
        ) : (
          <button
            onClick={toggleLanguage}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
          >
            <span>{isMr ? 'Switch to English' : 'मराठीत वाचा'}</span>
          </button>
        )}
      </aside>
    </>
  );
};
