import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEVELOPER } from '../data/developer';
import { MapPin, Phone, Mail, Clock, Siren, Navigation, CalendarCheck, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

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
            <img src="/logo.png" alt="" className="w-11 h-11 object-contain bg-white rounded-md p-1" />
            <div className="leading-tight">
              <p className="font-heading text-lg text-white">
                {isMr ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल' : 'Sanjeevani Multispeciality Hospital'}
              </p>
              <p className="text-xs text-stone-400">Healing body, mind & spirit</p>
            </div>
          </div>
          <p className="flex gap-3 text-stone-300 leading-relaxed max-w-sm">
            <MapPin className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>
              {isMr
                ? 'प्लॉट नं. १७, ऋषी पार्क, अंबड चौफुली, जालना, महाराष्ट्र ४३१२०३'
                : 'Plot No. 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra 431203'}
            </span>
          </p>
          <a
            href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:underline underline-offset-4"
          >
            <Navigation className="w-4 h-4 text-stone-500" aria-hidden />
            {isMr ? 'गुगल मॅपवर दिशा' : 'Get directions'}
          </a>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'हॉस्पिटल' : 'Hospital'}
          </h2>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-1.5 hover:text-white">
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
              {isMr ? 'सोम–शनि' : 'Mon – Sat'}
              <br />
              {isMr ? 'सकाळी ९ ते १' : '9 am – 1 pm'}
              <br />
              {isMr ? 'संध्याकाळी ५ ते ८' : '5 pm – 8 pm'}
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
          <a href="tel:+917507342222" className="flex gap-3 group">
            <Phone className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>
              <span className="block text-stone-400">{isMr ? 'आपत्कालीन व रिसेप्शन' : 'Emergency & reception'}</span>
              <span className="block text-white text-lg font-semibold group-hover:underline">+91 75073 42222</span>
            </span>
          </a>
          <a href="mailto:sanjeevanijalna@gmail.com" className="mt-3 flex gap-3 hover:text-white break-all">
            <Mail className="w-4 h-4 mt-1 shrink-0 text-stone-500" aria-hidden />
            <span>sanjeevanijalna@gmail.com</span>
          </a>
          <Link to="/book" className="btn-primary mt-5 w-full sm:w-auto">
            <CalendarCheck className="w-4 h-4" aria-hidden />
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-stone-500">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna</p>
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
          <div className="flex gap-4 sm:self-end">
            <span>{isMr ? 'MJPJAY संलग्न रुग्णालय' : 'MJPJAY empanelled hospital'}</span>
            <Link to="/admin/login" className="hover:text-stone-300">
              {isMr ? 'कर्मचारी लॉगिन' : 'Staff login'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
