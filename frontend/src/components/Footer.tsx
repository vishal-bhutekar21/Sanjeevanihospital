import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <footer className="bg-[#002B5B] text-white pt-20 pb-12 border-t-4 border-[#007791]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Hospital Profile */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003B73] to-[#007791] flex items-center justify-center text-white shadow-lg p-3.5 border-2 border-cyan-400/40">
                <HeartPulse className="w-8 h-8 text-cyan-300" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight block font-heading">
                  SANJEEVANI
                </span>
                <span className="text-xs uppercase tracking-widest text-cyan-300 font-extrabold block">
                  Hospital • Jalna
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना — २४ तास आपत्कालीन सेवा, २१ खाटांचा संगणकीकृत अतिदक्षता विभाग (ICU), अत्याधुनिक मॉड्युलर शस्त्रक्रिया गृह आणि अनुभवी तज्ज्ञ डॉक्टरांची अखंड सेवा.'
                : "Sanjeevani Multispeciality Hospital is Jalna's premier tertiary healthcare institution providing 24x7 emergency resuscitation, advanced surgical interventions, 21-bed computerized ICU, and specialized patient management."}
            </p>

            <div className="flex items-center space-x-2 text-xs sm:text-sm text-emerald-200 bg-[#00875A]/90 border border-emerald-400/60 px-4 py-2.5 rounded-xl w-fit font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-300" />
              <span>{isMr ? '२०१६ पासून अविरत रुग्णसेवा' : 'Serving Jalna Since 2016'}</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider mb-5 border-b-2 border-[#005B96] pb-2.5">
              {isMr ? 'महत्त्वाचे दुवे' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-3.5 text-sm sm:text-base font-medium">
              <li>
                <Link to="/doctors" className="text-slate-100 hover:text-cyan-300 transition flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isMr ? 'तज्ज्ञ डॉक्टर यादी' : 'Specialist Doctors Directory'}</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-slate-100 hover:text-cyan-300 transition flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isMr ? 'वैद्यकीय विभाग' : 'Clinical Departments & Specialties'}</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="text-slate-100 hover:text-cyan-300 transition flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isMr ? '२१ खाटांचा ICU व शस्त्रक्रिया गृह' : '21-Bed ICU, OTs & Diagnostics'}</span>
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="text-slate-100 hover:text-cyan-300 transition flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isMr ? 'महात्मा फुले जन आरोग्य योजना' : 'MJPJAY Government Scheme'}</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-slate-100 hover:text-cyan-300 transition flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isMr ? 'कॅशलेस मेडिक्लेम व टीपीए' : 'Cashless Mediclaim & TPA'}</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-amber-300 font-black hover:underline flex items-center gap-2 pt-2 text-base sm:text-lg">
                  <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'ऑनलाइन अपॉइंटमेंट बुक करा' : 'Book OPD Appointment'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Casualty */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider mb-5 border-b-2 border-[#005B96] pb-2.5">
              {isMr ? 'संपर्क व आपत्कालीन' : 'Casualty & Contact'}
            </h3>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <span className="text-slate-100 leading-relaxed font-medium">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203
                </span>
              </li>
              <li className="flex items-center space-x-3.5">
                <Phone className="w-5 h-5 text-rose-300 shrink-0" />
                <div>
                  <a href="tel:+917507342222" className="text-amber-300 font-black text-base sm:text-lg hover:underline block">
                    +91-75073-42222
                  </a>
                  <span className="text-xs sm:text-sm text-rose-200 font-bold">24x7 Casualty & Trauma Line</span>
                </div>
              </li>
              <li className="flex items-center space-x-3.5">
                <Phone className="w-5 h-5 text-cyan-300 shrink-0" />
                <span className="text-slate-100 font-bold">02482-223322 (Reception)</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <Mail className="w-5 h-5 text-cyan-300 shrink-0" />
                <span className="text-slate-100 font-medium">admin@sanjeevanihosp.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: OPD Hours */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider mb-5 border-b-2 border-[#005B96] pb-2.5">
              {isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Hours'}
            </h3>
            <ul className="space-y-4 text-sm sm:text-base text-slate-100">
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                  <span className="text-slate-200 font-medium">09:00 AM – 03:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                  <span className="text-slate-200 font-medium">05:00 PM – 08:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-rose-200 font-bold block">{isMr ? 'आपत्कालीन व अतिदक्षता (ICU):' : 'Emergency & Trauma (ICU):'}</span>
                  <span className="text-rose-300 font-black">24 Hours / 7 Days a Week</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Portal Link */}
        <div className="pt-8 border-t-2 border-[#003B73] text-xs sm:text-sm text-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-emerald-300 font-bold">MJPJAY Govt. Empanelled</span>
            <Link to="/admin/login" className="text-cyan-300 hover:text-white transition font-bold">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
