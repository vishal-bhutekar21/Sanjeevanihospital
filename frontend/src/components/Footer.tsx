import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Hospital Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-hospital-teal flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6 text-cyan-300" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SANJEEVANI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sanjeevani Multispeciality Hospital is Jalna's premier healthcare institution providing 24x7 emergency resuscitation, advanced surgical interventions, intensive care, and specialized patient management.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Established & Serving Since 2016</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition">
                  Specialist Doctors Directory
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition">
                  Clinical Departments & Specialties
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-cyan-400 transition">
                  24x7 ICU, OTs & Diagnostics
                </Link>
              </li>
              <li>
                <Link to="/mjpjay" className="hover:text-cyan-400 transition">
                  MJPJAY & Government Health Schemes
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-cyan-400 transition">
                  Cashless Mediclaim & TPA Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-emerald-400 font-semibold hover:underline">
                  Online Doctor Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Casualty */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Direct Contact & Casualty
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-hospital-cyan shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra 431203
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-hospital-cyan shrink-0" />
                <div>
                  <a href="tel:+917507342222" className="text-white font-medium hover:text-cyan-400">
                    +91-75073-42222
                  </a>
                  <span className="block text-xs text-slate-400">Reception & 24x7 Casualty</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-hospital-cyan shrink-0" />
                <span className="text-slate-300">02482-223322</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-hospital-cyan shrink-0" />
                <span className="text-slate-300">admin@sanjeevanihosp.in</span>
              </li>
            </ul>
          </div>

          {/* Timings & Governance */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Visiting & OPD Timings
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Morning OPD:</span>
                  <span>09:00 AM – 03:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Evening OPD:</span>
                  <span>05:00 PM – 08:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Emergency & Trauma:</span>
                  <span className="text-rose-300 font-semibold">24 Hours / 7 Days a Week</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Sanjeevani Multispeciality Hospital, Jalna. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Healthcare Platform v1.0.0</span>
            <Link to="/admin" className="text-slate-500 hover:text-slate-300">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
