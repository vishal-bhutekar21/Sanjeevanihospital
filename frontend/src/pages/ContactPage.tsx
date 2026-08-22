import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  HeartPulse,
  Mail,
  ShieldCheck,
  Building2,
  Car,
  Train,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── 1. MINIMAL HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="badge-teal text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isMr ? 'हॉस्पिटल पत्ता व थेट संपर्क' : 'Hospital Location & Contacts'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            {isMr
              ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना'
              : 'Sanjeevani Multispeciality Hospital, Jalna'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {isMr
              ? 'अंबड चौफुली, जालना येथे २४ तास आपत्कालीन सेवा, २१ खाटांचा अतिदक्षता विभाग (ICU) आणि तज्ज्ञ डॉक्टरांचे ओपीडी उपलब्ध.'
              : 'Plot 17, Rishi Park, Ambad Choufuli, Jalna. Accessible 24/7 for emergency casualty, ICU, and specialist OPD.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+917507342222"
            className="btn-primary text-xs py-2 px-4 shadow-2xs flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91-75073-42222</span>
          </a>
          <Link
            to="/book"
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isMr ? 'अपॉइंटमेंट बुक करा' : 'Book OPD Slot'}</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. BALANCED 2-COLUMN MASTER GRID ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Hospital Details & Direct Hotlines (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: 24x7 Emergency Hotlines Banner */}
          <div className="card-clean p-5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-white animate-pulse" />
                <span className="font-bold text-sm tracking-wide">
                  {isMr ? '२४x७ आपत्कालीन व अतिदक्षता (ICU)' : '24x7 Emergency & Critical Care'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                24 Hours
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+917507342222"
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-center flex flex-col"
              >
                <span className="text-[10px] text-red-100 uppercase">{isMr ? 'मुख्य रिसेप्शन' : 'Hospital Desk'}</span>
                <span className="font-bold text-xs mt-0.5">+91-75073-42222</span>
              </a>
              <a
                href="tel:+918830518080"
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-center flex flex-col"
              >
                <span className="text-[10px] text-red-100 uppercase">{isMr ? 'अ‍ॅम्ब्युलन्स' : 'Ambulance'}</span>
                <span className="font-bold text-xs mt-0.5">+91-88305-18080</span>
              </a>
            </div>
          </div>

          {/* Card 2: Address, Hours & Direct Directory */}
          <div className="card-clean p-6 bg-white border border-slate-200 rounded-xl space-y-5">
            
            {/* Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isMr ? 'हॉस्पिटल पत्ता' : 'Hospital Address'}</span>
                </span>
                <a
                  href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm font-bold text-slate-900 font-heading">
                Plot No. 17, Rishi Park, Ambad Choufuli, Jalna – 431203
              </p>
              <p className="text-xs text-slate-500">
                {isMr
                  ? 'अंबड चौफुली सर्कलजवळ • जालना रेल्वे स्थानकापासून ३.५ किमी'
                  : 'Near Ambad Choufuli Junction • 3.5 km from Jalna Railway Station'}
              </p>

              {/* Transit Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded flex items-center gap-1">
                  <Train className="w-3 h-3 text-slate-500" />
                  <span>{isMr ? 'रेल्वे: ३.५ किमी' : 'Railway: 3.5 km'}</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{isMr ? 'बस स्टँड: २.८ किमी' : 'Bus Stand: 2.8 km'}</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded flex items-center gap-1 font-semibold">
                  <Car className="w-3 h-3 text-teal-600" />
                  <span>{isMr ? 'मोफत पार्किंग' : 'Free Parking'}</span>
                </span>
              </div>
            </div>

            {/* OPD & Visiting Schedule */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Schedule'}</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">{isMr ? 'सकाळची ओपीडी' : 'Morning OPD'}</span>
                  <span className="font-bold text-slate-900">09:00 AM – 03:00 PM</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">{isMr ? 'संध्याकाळची ओपीडी' : 'Evening OPD'}</span>
                  <span className="font-bold text-slate-900">05:00 PM – 08:00 PM</span>
                </div>
              </div>
            </div>

            {/* Direct Department Hotlines Table */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                {isMr ? 'थेट विभाग संपर्क' : 'Department Hotlines'}
              </span>
              <div className="space-y-1.5 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isMr ? 'MJPJAY शासकीय योजना' : 'MJPJAY Govt. Scheme'}</span>
                  </span>
                  <a href="tel:+918208965820" className="font-bold text-slate-900 hover:text-[#0F766E]">
                    +91-82089-65820
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isMr ? 'कॅशलेस विमा (TPA)' : 'Cashless Insurance / TPA'}</span>
                  </span>
                  <a href="tel:+919146022490" className="font-bold text-slate-900 hover:text-[#0F766E]">
                    +91-91460-22490
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{isMr ? 'हॉस्पिटल प्रशासन' : 'Administration & Desk'}</span>
                  </span>
                  <a href="tel:+919687609046" className="font-bold text-slate-900 hover:text-[#0F766E]">
                    +91-96876-09046
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isMr ? 'ईमेल संपर्क' : 'Official Email'}</span>
                  </span>
                  <a href="mailto:sanjeevanihospjalna@gmail.com" className="font-medium text-slate-900 hover:text-[#0F766E] truncate max-w-[160px]">
                    sanjeevanihospjalna@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Google Maps & Minimal Query Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Google Maps Card */}
          <div className="card-clean overflow-hidden h-64 sm:h-72 rounded-xl relative bg-slate-100 border border-slate-200 shadow-2xs">
            <iframe
              title="Sanjeevani Hospital Jalna Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.482025734346!2d75.87321277598858!3d19.83965932757277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bda574d6cfa92ff%3A0x6b30c144577884ff!2sAmbad%20Choufuli%2C%20Jalna%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Minimal Inquiry & Message Form */}
          <div className="card-clean p-6 sm:p-7 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0F766E]" />
                <span>{isMr ? 'थेट संदेश व चौकशी अर्ज' : 'Direct Inquiry & Feedback Form'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isMr
                  ? 'आपला संदेश पाठवा, आमचा स्वागत कक्ष प्रतिनिधी त्वरित संपर्क करेल.'
                  : 'Submit your query below and our front desk coordinator will respond promptly.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-5 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#0F766E] mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 font-heading">
                  {isMr ? 'संदेश यशस्वीरीत्या पाठवला!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {isMr
                    ? 'संजीवनी हॉस्पिटलशी संपर्क साधल्याबद्दल धन्यवाद. आमचा प्रतिनिधी लवकरच संपर्क करेल.'
                    : 'Thank you for reaching out to Sanjeevani Hospital. Our team will contact you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="btn-secondary text-xs py-1.5 px-3.5 mt-1"
                >
                  {isMr ? 'दुसरा संदेश पाठवा' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'पूर्ण नाव *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isMr ? 'उदा. राहुल पाटील' : 'e.g. Rahul Patil'}
                      className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'मोबाईल नंबर *' : 'Mobile Number (+91) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'विभाग / चौकशीचा विषय' : 'Select Department / Inquiry Type'}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                  >
                    <option value="general">{isMr ? 'सामान्य ओपीडी व डॉक्टर सल्ला' : 'General OPD & Doctor Consultation'}</option>
                    <option value="ortho">{isMr ? 'अस्थिरोग व सांधे प्रत्यारोपण' : 'Orthopedics & Joint Replacement'}</option>
                    <option value="pediatrics">{isMr ? 'बालरोग व नवजात शिशु (NICU)' : 'Pediatrics & Neonatology (NICU)'}</option>
                    <option value="icu">{isMr ? '२१ खाटांचा अतिदक्षता विभाग (ICU)' : '21-Bed ICU & Critical Care'}</option>
                    <option value="mjpjay">{isMr ? 'महात्मा फुले (MJPJAY) योजना' : 'MJPJAY Govt. Scheme Eligibility'}</option>
                    <option value="insurance">{isMr ? 'कॅशलेस मेडिक्लेम विमा (TPA)' : 'Cashless Mediclaim & Insurance'}</option>
                    <option value="other">{isMr ? 'इतर चौकशी' : 'Other General Inquiries'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'आपला संदेश / प्रश्न *' : 'Your Message / Health Query *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isMr ? 'आपला संदेश किंवा शंका येथे लिहा...' : 'Describe your query or preferred appointment timing...'}
                    className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-6 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isMr ? 'संदेश पाठवा' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
