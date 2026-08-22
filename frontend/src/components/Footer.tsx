import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <footer className="bg-[#0B132B] text-slate-300 pt-12 pb-8 border-t-2 border-amber-400">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          
          {/* Column 1: Hospital Profile */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Sanjeevani Multispeciality Hospital Logo"
                className="w-12 h-12 object-contain bg-white/10 rounded-xl p-1 shrink-0"
              />
              <div>
                <span className="text-lg font-bold text-white tracking-tight block font-heading">
                  SANJEEVANI
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Healing Body, Mind & Spirit • Jalna
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना — २४ तास आपत्कालीन सेवा, २१ खाटांचा संगणकीकृत ICU, मॉड्युलर शस्त्रक्रिया गृह आणि अनुभवी तज्ज्ञ डॉक्टरांची अखंड सेवा.'
                : 'Jalna’s premier multispeciality hospital providing 24x7 emergency trauma care, 21-bed ICU, modern modular operation theatres, and dedicated senior specialist doctors.'}
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{isMr ? '२०१६ पासून अविरत रुग्णसेवा' : 'Serving Patients Since 2016'}</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3.5">
              {isMr ? 'महत्त्वाचे विभाग' : 'Clinical Portals'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/doctors" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'तज्ज्ञ डॉक्टर यादी' : 'Specialist Doctors'}</span>
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'वैद्यकीय विभाग' : 'Specialty Departments'}</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? '२१ खाटांचा ICU व सुविधा' : '21-Bed ICU & Facilities'}</span>
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'महात्मा फुले जन आरोग्य योजना' : 'MJPJAY Scheme'}</span>
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'कॅशलेस मेडिक्लेम व टीपीए' : 'Cashless Insurance'}</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isMr ? 'आरोग्य शिबिरे व अभिप्राय' : 'Health Camps & Reviews'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Casualty */}
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3.5">
              {isMr ? 'संपर्क व आपत्कालीन' : 'Emergency & Contact'}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">{isMr ? '२४x७ आपत्कालीन / आयसीयू:' : '24x7 Casualty & ICU:'}</span>
                  <a href="tel:+917507342222" className="text-white font-bold hover:text-amber-300 transition">
                    +91-75073-42222
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">sanjeevanijalna@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: OPD Hours & Direct Booking */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isMr ? 'ओपीडी वेळ व अपॉइंटमेंट' : 'OPD Hours & Booking'}
            </h3>
            
            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{isMr ? 'दररोज नियमित ओपीडी:' : 'Regular OPD Timings:'}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isMr ? 'सकाळी: ०९:०० AM – ०१:०० PM' : 'Morning: 09:00 AM – 01:00 PM'}
                <br />
                {isMr ? 'सायंकाळी: ०५:०० PM – ०८:०० PM' : 'Evening: 05:00 PM – 08:00 PM'}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold border-t border-slate-800 pt-1">
                {isMr ? '• २४ तास आपत्कालीन सेवा अविरत चालू' : '• 24x7 Emergency Casualty Always Open'}
              </p>
            </div>

            <Link
              to="/book"
              className="btn-primary w-full py-2.5 text-xs justify-center shadow-xs"
            >
              <span>{isMr ? 'ऑनलाइन अपॉइंटमेंट बुक करा' : 'Book OPD Appointment'}</span>
            </Link>
          </div>

        </div>

        {/* Sub-Footer Divider */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © 2026 Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-amber-400/90 font-medium">
              {isMr ? 'महाराष्ट्र शासन MJPJAY संलग्न रुग्णालय' : 'MJPJAY Empanelled Hospital'}
            </span>
            <span>•</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-white transition">
              {isMr ? 'अ‍ॅडमिन पोर्टल' : 'Admin Portal'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
