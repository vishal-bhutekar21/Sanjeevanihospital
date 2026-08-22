import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Column 1: Hospital Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shrink-0 shadow-sm">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight block font-heading">
                  SANJEEVANI
                </span>
                <span className="text-[11px] uppercase tracking-wider text-teal-400 font-medium block">
                  Hospital • Jalna
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना — २४ तास आपत्कालीन सेवा, २१ खाटांचा ICU, मॉड्युलर शस्त्रक्रिया गृह आणि अनुभवी तज्ज्ञ डॉक्टरांची सेवा.'
                : 'Sanjeevani Multispeciality Hospital is Jalna’s trusted tertiary healthcare center with 24x7 emergency resuscitation, advanced surgical suites, and a 21-bed ICU.'}
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-teal-300 bg-teal-950/60 border border-teal-800/50 px-3 py-1.5 rounded-md font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-teal-400" />
              <span>{isMr ? '२०१६ पासून अविरत रुग्णसेवा' : 'Serving Patients Since 2016'}</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isMr ? 'महत्त्वाचे दुवे' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/doctors" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? 'तज्ज्ञ डॉक्टर यादी' : 'Specialist Doctors'}</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? 'वैद्यकीय विभाग' : 'Clinical Departments'}</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? '२१ खाटांचा ICU व शस्त्रक्रिया गृह' : '21-Bed ICU & Diagnostics'}</span>
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? 'महात्मा फुले जन आरोग्य योजना' : 'MJPJAY Scheme'}</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? 'कॅशलेस मेडिक्लेम व टीपीए' : 'Cashless Mediclaim'}</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-teal-400 font-medium hover:underline flex items-center gap-1.5 pt-1">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isMr ? 'ऑनलाइन अपॉइंटमेंट बुक करा' : 'Book OPD Appointment'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Casualty */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isMr ? 'संपर्क व आपत्कालीन' : 'Emergency & Contact'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <a href="tel:+917507342222" className="text-white font-semibold hover:underline block">
                    +91-75073-42222
                  </a>
                  <span className="text-xs text-red-400">24x7 Casualty & Emergency</span>
                </div>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>02482-223322 (Reception)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>admin@sanjeevanihosp.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: OPD Hours */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Hours'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                  <span className="text-slate-400 text-xs">09:00 AM – 03:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                  <span className="text-slate-400 text-xs">05:00 PM – 08:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">{isMr ? 'आपत्कालीन व अतिदक्षता (ICU):' : 'Emergency & ICU:'}</span>
                  <span className="text-red-400 font-semibold text-xs">24 Hours / 7 Days</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-teal-400">MJPJAY Empanelled</span>
            <Link to="/admin/login" className="hover:text-white transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
