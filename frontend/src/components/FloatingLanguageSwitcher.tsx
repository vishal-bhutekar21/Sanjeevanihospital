import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Phone, Globe, ChevronRight } from 'lucide-react';

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
      {/* ─── DESKTOP FLOATING DOCK (md & lg screens) ─────────────────────────── */}
      <aside
        aria-label="Quick Actions Dock"
        className="hidden sm:flex fixed bottom-5 right-5 z-40 flex-col items-end gap-2.5 pointer-events-none"
      >
        {/* 1. 24x7 EMERGENCY CASUALTY PILL */}
        <a
          href="tel:+917507342222"
          className="pointer-events-auto flex items-center justify-between w-64 sm:w-72 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-xl shadow-rose-950/30 border border-rose-400/50 hover:brightness-110 transition-all duration-150 group"
          title="24x7 Emergency Casualty / २४ तास आपत्कालीन सेवा"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="text-left min-w-0 leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100 block truncate">
                {isMr ? '२४x७ आपत्कालीन / ICU' : '24x7 Casualty & ICU'}
              </span>
              <span className="text-sm font-black text-amber-200 tracking-wide block font-mono">
                +91-75073-42222
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" title="Line Active"></span>
        </a>

        {/* 2. BOOK APPOINTMENT PILL */}
        {!isBookingPage && (
          <Link
            to="/book"
            className="pointer-events-auto flex items-center justify-between w-64 sm:w-72 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#004D7A] text-white shadow-xl shadow-[#002B5B]/30 border border-cyan-400/40 hover:brightness-110 transition-all duration-150 group"
            title="Book Doctor Appointment / डॉक्टर अपॉइंटमेंट बुक करा"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 border border-white/20">
                <Calendar className="w-4.5 h-4.5 text-emerald-300" />
              </div>
              <div className="text-left min-w-0 leading-tight">
                <span className="text-sm font-black text-white block tracking-tight truncate font-heading">
                  {isMr ? 'अपॉइंटमेंट बुक करा' : 'Book Appointment'}
                </span>
                <span className="text-[11px] font-bold text-cyan-200 block truncate">
                  {isMr ? 'ओपीडी वेळ व टोकन' : 'Online OPD Token & Slot'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-300 shrink-0 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* 3. LANGUAGE TOGGLE PILL */}
        <button
          onClick={toggleLanguage}
          className="pointer-events-auto flex items-center justify-between w-64 sm:w-72 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-[#002B5B] shadow-xl shadow-slate-900/15 border-2 border-[#002B5B]/30 hover:border-[#002B5B] hover:bg-white transition-all duration-150 cursor-pointer group"
          title="Change Language / भाषा बदला"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#002B5B] text-white flex items-center justify-center text-base shadow-sm shrink-0 border border-slate-300">
              <span>{isMr ? '🇮🇳' : '🇬🇧'}</span>
            </div>
            <div className="text-left min-w-0 leading-tight">
              <span className="text-sm font-black text-[#002B5B] block tracking-tight font-heading">
                {isMr ? 'मराठी भाषा' : 'English Language'}
              </span>
              <span className="text-[11px] font-bold text-[#007791] block">
                {isMr ? '🇬🇧 Switch to English' : '🇮🇳 मराठीत वाचा'}
              </span>
            </div>
          </div>
          <div className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-[#002B5B] border border-slate-200 shrink-0">
            {isMr ? 'EN' : 'मराठी'}
          </div>
        </button>
      </aside>

      {/* ─── MOBILE DOCKED BOTTOM BAR (Screens < 640px) ────────────────────────── */}
      <aside
        aria-label="Mobile Quick Actions"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#002B5B]/95 via-[#003B73]/95 to-[#002B5B]/95 backdrop-blur-lg border-t-2 border-cyan-400/40 p-2.5 px-3 shadow-2xl flex items-center justify-between gap-2"
      >
        {/* Emergency Call */}
        <a
          href="tel:+917507342222"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#DC2626] text-white text-xs font-black shadow-md active:scale-95 transition"
        >
          <Phone className="w-4 h-4 text-white shrink-0" />
          <span className="truncate">{isMr ? '२४x७ आपत्कालीन' : '24x7 Emergency'}</span>
        </a>

        {/* Book Appointment */}
        {!isBookingPage ? (
          <Link
            to="/book"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md border border-emerald-400/50 active:scale-95 transition"
          >
            <Calendar className="w-4 h-4 text-emerald-200 shrink-0" />
            <span className="truncate">{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
          </Link>
        ) : (
          <a
            href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-cyan-700 text-white text-xs font-black shadow-md active:scale-95 transition"
          >
            <span>{isMr ? 'गुगल मॅप दिशा' : 'Map & Route'}</span>
          </a>
        )}

        {/* Language Toggle Icon Button */}
        <button
          onClick={toggleLanguage}
          className="p-2.5 rounded-xl bg-white text-[#002B5B] font-black text-xs border border-cyan-400/50 shrink-0 shadow-md active:scale-95 transition"
          title="Toggle Language"
        >
          <span>{isMr ? 'EN' : 'मराठी'}</span>
        </button>
      </aside>
    </>
  );
};
