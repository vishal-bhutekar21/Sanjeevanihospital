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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* ─── 1. FLOATING 24x7 EMERGENCY CASUALTY HOTLINE ───────────────────────── */}
      <a
        href="tel:+917507342222"
        className="pointer-events-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-2xl shadow-rose-900/40 hover:scale-105 transition-all duration-200 border-2 border-rose-400 group"
        title="24x7 Emergency Casualty / २४ तास तातडीची रुग्णसेवा"
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <span className="text-[11px] font-bold text-rose-100 uppercase tracking-wider block">
            {isMr ? '२४x७ आपत्कालीन / ICU' : '24x7 Casualty & ICU'}
          </span>
          <span className="font-black text-sm tracking-wide text-amber-200">
            +91-75073-42222
          </span>
        </div>
      </a>

      {/* ─── 2. FLOATING BOOK APPOINTMENT BUTTON ──────────────────────────────── */}
      {!isBookingPage && (
        <Link
          to="/book"
          className="pointer-events-auto inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#007791] text-white shadow-2xl shadow-royal/50 hover:shadow-cyan-600/40 hover:scale-105 transition-all duration-200 border-2 border-cyan-400/50 group"
          title="Book Doctor Appointment / डॉक्टर अपॉइंटमेंट बुक करा"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-md shrink-0 group-hover:rotate-6 transition-transform">
            <Calendar className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-left">
            <span className="font-black text-sm sm:text-base block leading-tight font-heading">
              {isMr ? 'अपॉइंटमेंट बुक करा' : 'Book Appointment'}
            </span>
            <span className="text-[11px] font-extrabold text-cyan-300 block">
              {isMr ? 'तज्ज्ञ डॉक्टर व ओपीडी वेळ' : 'Online OPD Token & Slot'}
            </span>
          </div>
        </Link>
      )}

      {/* ─── 3. FLOATING LANGUAGE SWITCHER BUTTON ──────────────────────────────── */}
      <button
        onClick={toggleLanguage}
        className="pointer-events-auto flex items-center gap-3 px-5 sm:px-6 py-3.5 rounded-3xl bg-white text-[#002B5B] border-3 border-[#002B5B] shadow-2xl hover:shadow-cyan-600/30 hover:scale-105 transition-all duration-200 group cursor-pointer"
        title="Change Language / भाषा बदला"
      >
        <div className="w-9 h-9 rounded-2xl bg-[#002B5B] text-white flex items-center justify-center text-lg shadow-md border border-cyan-400/40 shrink-0">
          <span>{isMr ? '🇮🇳' : '🇬🇧'}</span>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-tight font-heading">
            <span>{isMr ? 'मराठी भाषा' : 'English Language'}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-[#007791]">
            <span>{isMr ? '🇬🇧 Switch to English' : '🇮🇳 मराठीत वाचा'}</span>
          </div>
        </div>
      </button>

    </div>
  );
};
