import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEVELOPER } from '../data/developer';
import { MapPin, Phone, Mail, Clock, Siren, Navigation, CalendarCheck, ChevronRight, UserRound } from 'lucide-react';
import { HOSPITAL } from '../config/hospital';
import { getPatientToken } from '../lib/patientPortal';

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  useLocation(); // re-render on page change so the login state is current
  const signedIn = !!getPatientToken();

  const links = [
    { to: '/departments', en: 'Departments', mr: 'विभाग' },
    { to: '/doctors', en: 'Doctors', mr: 'डॉक्टर' },
    { to: '/facilities', en: 'Facilities', mr: 'सुविधा' },
    { to: '/mjpjay', en: 'MJPJAY scheme', mr: 'महात्मा फुले योजना' },
    { to: '/insurance', en: 'Insurance', mr: 'विमा' },
    { to: '/events', en: 'Health camps & reviews', mr: 'शिबिरे व अभिप्राय' },
    { to: '/contact', en: 'Contact', mr: 'संपर्क' },
  ];

  return (
    <footer className="bg-[#1C2321] text-stone-300 text-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <img src={HOSPITAL.logo} alt="" className="w-11 h-11 object-contain bg-white rounded-md p-1" />
            <div className="leading-tight">
              <p className="font-heading text-lg text-white">
                {isMr ? HOSPITAL.nameMr : HOSPITAL.name}
              </p>
              <p className="text-xs text-stone-400">{HOSPITAL.tagline}</p>
            </div>
          </div>
          <p className="flex gap-3 text-stone-300 leading-relaxed max-w-sm">
            <MapPin className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>
              {isMr ? HOSPITAL.address.mr : HOSPITAL.address.en}
            </span>
          </p>
          <a
            href={HOSPITAL.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] text-white hover:underline underline-offset-4"
          >
            <Navigation className="w-4 h-4 text-stone-500" aria-hidden />
            {isMr ? 'गुगल मॅपवर दिशा' : 'Get directions'}
          </a>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'हॉस्पिटल' : 'Hospital'}
          </h2>
          <ul className="space-y-0.5 sm:space-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 hover:text-white">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400" aria-hidden />
                  {isMr ? l.mr : l.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'ओपीडी वेळ' : 'OPD hours'}
          </h2>
          <p className="flex gap-3 leading-relaxed">
            <Clock className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>
              {isMr ? HOSPITAL.opdHours.days.mr : HOSPITAL.opdHours.days.en}
              <br />
              {isMr ? HOSPITAL.opdHours.morning.mr : HOSPITAL.opdHours.morning.en}
              <br />
              {isMr ? HOSPITAL.opdHours.evening.mr : HOSPITAL.opdHours.evening.en}
            </span>
          </p>
          <p className="mt-3 flex gap-3 text-stone-300">
            <Siren className="w-4 h-4 mt-0.5 shrink-0 text-red-400" aria-hidden />
            <span>{isMr ? 'आपत्कालीन विभाग २४ तास सुरू' : 'Emergency open 24 hours'}</span>
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'संपर्क' : 'Contact'}
          </h2>
          <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="flex gap-3 group">
            <Phone className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>
              <span className="block text-stone-400">{isMr ? 'आपत्कालीन व रिसेप्शन' : 'Emergency & reception'}</span>
              <span className="block text-white text-lg font-semibold group-hover:underline">{HOSPITAL.phones.emergency.display}</span>
            </span>
          </a>
          <a href={`mailto:${HOSPITAL.emails.footer}`} className="mt-1 flex gap-3 py-2.5 hover:text-white break-all">
            <Mail className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>{HOSPITAL.emails.footer}</span>
          </a>
          <Link to="/book" className="btn-primary mt-5 w-full sm:w-auto">
            <CalendarCheck className="w-4 h-4" aria-hidden />
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
          </Link>
        </div>
      </div>

      {/* Patient login */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <span className="w-11 h-11 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0" aria-hidden>
              <UserRound className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg">
                {signedIn ? (isMr ? 'आपली आरोग्य माहिती' : 'Your health records') : isMr ? 'पेशंट लॉगिन' : 'Patient login'}
              </p>
              <p className="mt-0.5 text-stone-400 text-[15px]">
                {isMr
                  ? 'आपल्या अपॉइंटमेंट, बिले, औषधे (मुदत संपण्याची आठवण) व रिपोर्ट एका ठिकाणी. मोबाईल नंबर व एसएमएस कोडने लॉगिन करा.'
                  : 'Your appointments, bills, medicines with expiry reminders, and reports in one place. Sign in with your mobile number and an SMS code.'}
              </p>
            </div>
            <Link to="/patient" className="btn-primary shrink-0 w-full sm:w-auto">
              <UserRound className="w-4 h-4" aria-hidden />
              {signedIn ? (isMr ? 'माझी माहिती उघडा' : 'Open my records') : isMr ? 'लॉगिन करा' : 'Log in'}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-stone-500">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {HOSPITAL.name}, {HOSPITAL.city}</p>
            <p>
              {isMr ? 'वेबसाइट विकसक: ' : 'Website by '}
              <a href={DEVELOPER.url} target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white underline underline-offset-2">
                {DEVELOPER.name}
              </a>
              {' · '}
              <a href={`mailto:${DEVELOPER.email}`} className="hover:text-stone-300">
                {DEVELOPER.email}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 sm:self-end">
            <span>{isMr ? `${HOSPITAL.empanelments[0].code} संलग्न रुग्णालय` : `${HOSPITAL.empanelments[0].code} empanelled hospital`}</span>
            <Link to="/privacy" className="inline-flex items-center min-h-[44px] sm:min-h-0 hover:text-stone-300">
              {isMr ? 'गोपनीयता धोरण' : 'Privacy policy'}
            </Link>
            <Link to="/terms" className="inline-flex items-center min-h-[44px] sm:min-h-0 hover:text-stone-300">
              {isMr ? 'अटी व शर्ती' : 'Terms of use'}
            </Link>
            <Link to="/admin/login" className="inline-flex items-center min-h-[44px] sm:min-h-0 hover:text-stone-300">
              {isMr ? 'कर्मचारी लॉगिन' : 'Staff login'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
