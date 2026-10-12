import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';

// Bottom action bar on phones: call or book, always within thumb reach.
export const FloatingLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isMr = i18n.language === 'mr';

  const isBookingPage = location.pathname === '/book';

  return (
    <aside
      aria-label={isMr ? 'त्वरित संपर्क' : 'Quick actions'}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E7E3DA] px-3 py-2 flex gap-2"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href="tel:+917507342222"
        className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-[#C62828] text-white text-sm font-semibold"
      >
        <Phone className="w-4 h-4" />
        <span>{isMr ? 'आपत्कालीन कॉल' : 'Call emergency'}</span>
      </a>

      {isBookingPage ? (
        <a
          href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center min-h-[44px] rounded-md border border-[#D8D3C8] text-sm font-semibold text-[#1C2321]"
        >
          {isMr ? 'दिशा पहा' : 'Directions'}
        </a>
      ) : (
        <Link
          to="/book"
          className="flex-1 flex items-center justify-center min-h-[44px] rounded-md bg-[#0F766E] text-white text-sm font-semibold"
        >
          {isMr ? 'अपॉइंटमेंट' : 'Book appointment'}
        </Link>
      )}
    </aside>
  );
};
