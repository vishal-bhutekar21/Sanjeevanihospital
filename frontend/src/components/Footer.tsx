import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
          <p className="text-stone-400 leading-relaxed max-w-sm">
            {isMr
              ? 'प्लॉट नं. १७, ऋषी पार्क, अंबड चौफुली, जालना, महाराष्ट्र ४३१२०३'
              : 'Plot No. 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra 431203'}
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'हॉस्पिटल' : 'Hospital'}
          </h2>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
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
          <p className="leading-relaxed">
            {isMr ? 'सकाळी ९ ते १' : '9 am – 1 pm'}
            <br />
            {isMr ? 'संध्याकाळी ५ ते ८' : '5 pm – 8 pm'}
          </p>
          <p className="mt-3 text-stone-400">
            {isMr ? 'आपत्कालीन विभाग २४ तास सुरू' : 'Emergency open 24 hours'}
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {isMr ? 'संपर्क' : 'Contact'}
          </h2>
          <p>
            <span className="text-stone-400">{isMr ? 'आपत्कालीन व रिसेप्शन' : 'Emergency & reception'}</span>
            <br />
            <a href="tel:+917507342222" className="text-white text-lg font-semibold hover:underline">
              +91 75073 42222
            </a>
          </p>
          <p className="mt-3">
            <a href="mailto:sanjeevanijalna@gmail.com" className="hover:text-white break-all">
              sanjeevanijalna@gmail.com
            </a>
          </p>
          <Link to="/book" className="btn-primary mt-5 w-full sm:w-auto">
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna</p>
          <div className="flex gap-4">
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
