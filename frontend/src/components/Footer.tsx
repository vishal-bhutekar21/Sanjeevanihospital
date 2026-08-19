import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, Award, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Hospital Profile */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-hospital-teal flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-7 h-7 text-cyan-300" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  SANJEEVANI
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                  Hospital • Jalna
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना — २४ तास आपत्कालीन सेवा, २१ खाटांचा संगणकीकृत अतिदक्षता विभाग (ICU), अत्याधुनिक मॉड्युलर शस्त्रक्रिया गृह आणि अनुभवी तज्ज्ञ डॉक्टरांची अखंड सेवा.'
                : "Sanjeevani Multispeciality Hospital is Jalna's premier tertiary healthcare institution providing 24x7 emergency resuscitation, advanced surgical interventions, 21-bed computerized ICU, and specialized patient management."}
            </p>

            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-2 rounded-xl w-fit font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isMr ? '२०१६ पासून अविरत रुग्णसेवा' : 'Serving Jalna Since 2016'}</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 border-b border-slate-800 pb-2">
              {isMr ? 'महत्त्वाचे दुवे' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isMr ? 'तज्ज्ञ डॉक्टर यादी' : 'Specialist Doctors Directory'}</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isMr ? 'वैद्यकीय विभाग' : 'Clinical Departments & Specialties'}</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isMr ? '२१ खाटांचा ICU व शस्त्रक्रिया गृह' : '21-Bed ICU, OTs & Diagnostics'}</span>
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isMr ? 'महात्मा फुले जन आरोग्य योजना' : 'MJPJAY Government Scheme'}</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isMr ? 'कॅशलेस मेडिक्लेम व टीपीए' : 'Cashless Mediclaim & TPA'}</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5 pt-1">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isMr ? 'ऑनलाइन अपॉइंटमेंट बुक करा' : 'Book OPD Appointment'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Casualty */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 border-b border-slate-800 pb-2">
              {isMr ? 'संपर्क व आपत्कालीन' : 'Casualty & Contact'}
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-hospital-cyan shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <a href="tel:+917507342222" className="text-white font-bold hover:text-cyan-400 transition block">
                    +91-75073-42222
                  </a>
                  <span className="text-[11px] text-rose-300 font-semibold">24x7 Casualty & Trauma Hotline</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-hospital-cyan shrink-0" />
                <span className="text-slate-300 font-medium">02482-223322 (Reception)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-hospital-cyan shrink-0" />
                <span className="text-slate-300">admin@sanjeevanihosp.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: OPD Hours */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 border-b border-slate-800 pb-2">
              {isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Hours'}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                  <span className="text-slate-400">09:00 AM – 03:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                  <span className="text-slate-400">05:00 PM – 08:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-rose-300 font-semibold block">{isMr ? 'आपत्कालीन व अतिदक्षता (ICU):' : 'Emergency & Trauma (ICU):'}</span>
                  <span className="text-rose-400 font-bold">24 Hours / 7 Days a Week</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Portal Link */}
        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span>NABH-Aligned Standards</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-white transition font-semibold">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
