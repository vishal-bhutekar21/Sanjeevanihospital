import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Phone } from 'lucide-react';

export const FloatingLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isMr = i18n.language === 'mr';

  const isBookingPage = location.pathname === '/book';

  return (
    <>
      {/* ─── DESKTOP DISCREET FLOATING EMERGENCY BUTTON ──────────────────────── */}
      <aside
        aria-label="Emergency Contact"
        className="hidden sm:block fixed bottom-6 right-6 z-30"
      >
        <a
          href="tel:+917507342222"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all transform hover:scale-105 text-xs font-bold group"
          title={isMr ? '२४x७ आपत्कालीन कॉल: +91-75073-42222' : '24x7 Emergency: +91-75073-42222'}
        >
          <Phone className="w-4 h-4 text-white animate-pulse" />
          <span className="hidden xl:inline">{isMr ? '२४x७ आपत्कालीन:' : '24x7 Casualty:'} +91-75073-42222</span>
        </a>
      </aside>

      {/* ─── MOBILE DOCKED BOTTOM BAR ────────────────────────────────────────── */}
      <aside
        aria-label="Mobile Quick Actions"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 shadow-lg flex items-center justify-between gap-2.5"
      >
        <a
          href="tel:+917507342222"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-xs"
        >
          <Phone className="w-4 h-4 text-white shrink-0" />
          <span>{isMr ? '२४x७ आपत्कालीन' : '24x7 Casualty'}</span>
        </a>

        {!isBookingPage ? (
          <Link
            to="/book"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0F766E] text-white text-xs font-semibold shadow-xs"
          >
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span>{isMr ? 'अपॉइंटमेंट' : 'Book OPD'}</span>
          </Link>
        ) : (
          <a
            href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 text-white text-xs font-semibold"
          >
            <span>{isMr ? 'हॉस्पिटल पत्ता' : 'Location'}</span>
          </a>
        )}
      </aside>
    </>
  );
};
