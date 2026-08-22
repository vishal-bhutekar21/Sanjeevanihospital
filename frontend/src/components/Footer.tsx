import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <footer className="bg-[#001736] text-white pt-16 pb-12 border-t-4 border-[#00875A]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Column 1: Hospital Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002B5B] to-[#00875A] flex items-center justify-center text-white shadow-md p-3 border border-[#8AF5BE]/40">
                <HeartPulse className="w-7 h-7 text-[#8AF5BE]" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight block font-heading">
                  SANJEEVANI
                </span>
                <span className="text-xs uppercase tracking-wider text-[#8AF5BE] font-semibold block">
                  Hospital • Jalna
                </span>
              </div>
            </div>

            <p className="text-sm text-[#DCE9FF] leading-relaxed font-normal">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना — २४ तास आपत्कालीन सेवा, २१ खाटांचा संगणकीकृत अतिदक्षता विभाग (ICU), अत्याधुनिक मॉड्युलर शस्त्रक्रिया गृह आणि अनुभवी तज्ज्ञ डॉक्टरांची अखंड सेवा.'
                : "Sanjeevani Multispeciality Hospital is Jalna's premier tertiary healthcare institution providing 24x7 emergency resuscitation, advanced surgical interventions, 21-bed computerized ICU, and specialized patient management."}
            </p>

            <div className="flex items-center space-x-2 text-xs text-[#EBF7F0] bg-[#006C47]/80 border border-[#8AF5BE]/40 px-3.5 py-2 rounded-lg w-fit font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#8AF5BE]" />
              <span>{isMr ? '२०१६ पासून अविरत रुग्णसेवा' : 'Serving Jalna Since 2016'}</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#002B5B] pb-2">
              {isMr ? 'महत्त्वाचे दुवे' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2.5 text-sm font-normal">
              <li>
                <Link to="/doctors" className="text-[#DCE9FF] hover:text-white transition flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'तज्ज्ञ डॉक्टर यादी' : 'Specialist Doctors Directory'}</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="text-[#DCE9FF] hover:text-white transition flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'वैद्यकीय विभाग' : 'Clinical Departments & Specialties'}</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="text-[#DCE9FF] hover:text-white transition flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  <span>{isMr ? '२१ खाटांचा ICU व शस्त्रक्रिया गृह' : '21-Bed ICU, OTs & Diagnostics'}</span>
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="text-[#DCE9FF] hover:text-white transition flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'महात्मा फुले जन आरोग्य योजना' : 'MJPJAY Government Scheme'}</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-[#DCE9FF] hover:text-white transition flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'कॅशलेस मेडिक्लेम व टीपीए' : 'Cashless Mediclaim & TPA'}</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-[#8AF5BE] font-semibold hover:underline flex items-center gap-2 pt-1">
                  <ChevronRight className="w-4 h-4 text-[#8AF5BE] shrink-0" />
                  <span>{isMr ? 'ऑनलाइन अपॉइंटमेंट बुक करा' : 'Book OPD Appointment'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Casualty */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#002B5B] pb-2">
              {isMr ? 'संपर्क व आपत्कालीन' : 'Casualty & Contact'}
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#8AF5BE] shrink-0 mt-0.5" />
                <span className="text-[#DCE9FF] leading-relaxed">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#DC2626] shrink-0" />
                <div>
                  <a href="tel:+917507342222" className="text-white font-bold hover:underline block">
                    +91-75073-42222
                  </a>
                  <span className="text-xs text-[#FFDAD6] font-medium">24x7 Casualty & Trauma Line</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#8AF5BE] shrink-0" />
                <span className="text-[#DCE9FF]">02482-223322 (Reception)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#8AF5BE] shrink-0" />
                <span className="text-[#DCE9FF]">admin@sanjeevanihosp.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: OPD Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#002B5B] pb-2">
              {isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Hours'}
            </h3>
            <ul className="space-y-3 text-sm text-[#DCE9FF]">
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                  <span className="text-[#A9C7FF] text-xs">09:00 AM – 03:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                  <span className="text-[#A9C7FF] text-xs">05:00 PM – 08:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#FFDAD6] font-medium block">{isMr ? 'आपत्कालीन व अतिदक्षता (ICU):' : 'Emergency & Trauma (ICU):'}</span>
                  <span className="text-[#DC2626] font-bold text-xs">24 Hours / 7 Days a Week</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Portal Link */}
        <div className="pt-6 border-t border-[#002B5B] text-xs text-[#7594CA] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-[#8AF5BE] font-medium">MJPJAY Govt. Empanelled</span>
            <Link to="/admin/login" className="text-[#A9C7FF] hover:text-white transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
