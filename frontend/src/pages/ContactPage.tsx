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
} from 'lucide-react';

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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* ─── HEADER BANNER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 border border-teal-200 shadow-xs space-y-3">
        <div className="badge-teal text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{isMr ? 'हॉस्पिटल संपर्क व पत्ता' : 'Hospital Location & Direct Contact'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना'
            : 'Sanjeevani Multispeciality Hospital, Jalna'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-normal max-w-3xl leading-relaxed">
          {isMr
            ? 'अंबड चौफुली, जालना येथे २४ तास आपत्कालीन सेवा, २१ खाटांचा अतिदक्षता विभाग (ICU) आणि तज्ज्ञ डॉक्टरांचा सल्ला उपलब्ध आहे.'
            : 'Located conveniently at Ambad Choufuli, Jalna. Accessible 24 hours a day for emergency casualty, 21-bed ICU, and specialist outpatient consultations.'}
        </p>
      </div>

      {/* ─── 2-COLUMN CONTACT & HOURS GRID ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 24x7 Emergency & Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 24x7 Emergency Card */}
          <div className="card-clean p-6 bg-red-600 text-white space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading">
                  {isMr ? '२४x७ आपत्कालीन व ट्रॉमा' : '24x7 Emergency Casualty'}
                </h3>
                <p className="text-xs text-red-100">
                  {isMr ? 'तातडीचे उपचार व अतिदक्षता ICU' : 'Immediate Resuscitation & ICU'}
                </p>
              </div>
            </div>
            <a
              href="tel:+917507342222"
              className="w-full py-2.5 px-4 rounded-lg bg-white text-red-600 font-bold text-base text-center flex items-center justify-center gap-2 hover:bg-red-50 transition"
            >
              <Phone className="w-4 h-4" />
              <span>+91-75073-42222</span>
            </a>
          </div>

          {/* Hospital Address & Landmark */}
          <div className="card-clean p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0F766E]" />
              <span>{isMr ? 'हॉस्पिटलचा अधिकृत पत्ता' : 'Official Hospital Address'}</span>
            </h3>
            
            <div className="text-xs sm:text-sm text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Sanjeevani Multispeciality Hospital</p>
              <p>Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli,</p>
              <p>Jalna, Maharashtra – 431203, India.</p>
              <p className="text-xs text-slate-400 pt-1">
                Landmark: Near Ambad Choufuli Junction (3.5 km from Jalna Railway Station).
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs w-full mt-2"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'गुगल मॅप्सवर दिशा पहा' : 'Open in Google Maps'}</span>
            </a>
          </div>

          {/* Official Department Helpline Numbers (From Live Website) */}
          <div className="card-clean p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0F766E]" />
              <span>{isMr ? 'विभागनिहाय थेट संपर्क क्रमांक' : 'Direct Department Hotlines'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a href="tel:+918830518080" className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center justify-between hover:bg-red-100 transition">
                <span className="font-semibold">{isMr ? '🚑 अ‍ॅम्ब्युलन्स' : '🚑 Ambulance'}</span>
                <span className="font-bold">+91-88305-18080</span>
              </a>
              <a href="tel:+917507342222" className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between hover:bg-teal-100 transition">
                <span className="font-semibold">{isMr ? '🏥 रिसेप्शन' : '🏥 Reception'}</span>
                <span className="font-bold">+91-75073-42222</span>
              </a>
              <a href="tel:+918208965820" className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between hover:bg-amber-100 transition">
                <span className="font-semibold">{isMr ? '🛡️ MJPJAY कक्ष' : '🛡️ MJPJAY Help'}</span>
                <span className="font-bold">+91-82089-65820</span>
              </a>
              <a href="tel:+919146022490" className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between hover:bg-blue-100 transition">
                <span className="font-semibold">{isMr ? '💳 विमा टीपीए' : '💳 Insurance/TPA'}</span>
                <span className="font-bold">+91-91460-22490</span>
              </a>
              <a href="tel:+919687609046" className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between hover:bg-slate-100 transition sm:col-span-2">
                <span className="font-semibold">{isMr ? '🏢 अ‍ॅडमिनिस्ट्रेशन' : '🏢 Hospital Admin'}</span>
                <span className="font-bold">+91-96876-09046</span>
              </a>
            </div>
          </div>

          {/* Reception & OPD Timings */}
          <div className="card-clean p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F766E]" />
              <span>{isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Schedule'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-md bg-slate-50">
                <span className="text-slate-600">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                <span className="font-semibold text-slate-900">09:00 AM – 03:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-md bg-slate-50">
                <span className="text-slate-600">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                <span className="font-semibold text-slate-900">05:00 PM – 08:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-md bg-red-50 text-red-700 font-medium">
                <span>{isMr ? 'आपत्कालीन अतिदक्षता:' : 'Emergency ICU:'}</span>
                <span>२४ तास अखंड</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Inquiry Form & Interactive Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Inquiry Form */}
          <div className="card-clean p-6 sm:p-8 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'थेट चौकशी व संदेश पाठवा' : 'Direct Inquiry & Feedback'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isMr
                  ? 'आपला संदेश पाठवा, आमची टीम त्वरित आपल्याशी संपर्क करेल.'
                  : 'Submit your query below and our front desk team will contact you.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-lg bg-teal-50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  {isMr ? 'संदेश यशस्वीरीत्या पाठवला!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs text-slate-600">
                  {isMr
                    ? 'संजीवनी हॉस्पिटलशी संपर्क केल्याबद्दल धन्यवाद. आमचा प्रतिनिधी लवकरच संपर्क साधेल.'
                    : 'Thank you for reaching out to Sanjeevani Hospital. We will contact you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Department / Inquiry Type</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  >
                    <option value="general">General OPD Consultation</option>
                    <option value="ortho">Orthopedics & Joint Replacement</option>
                    <option value="pediatrics">Pediatrics & Neonatology (NICU)</option>
                    <option value="icu">21-Bed ICU & Critical Care</option>
                    <option value="mjpjay">MJPJAY Govt. Scheme Eligibility</option>
                    <option value="insurance">Cashless Insurance / TPA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Your Message / Query *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our clinical faculty assist you today?"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isMr ? 'संदेश पाठवा' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Interactive Google Map */}
          <div className="card-clean overflow-hidden h-64 sm:h-72">
            <iframe
              title="Sanjeevani Hospital Jalna Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.482025734346!2d75.87321277598858!3d19.83965932757277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bda574d6cfa92ff%3A0x6b30c144577884ff!2sAmbad%20Choufuli%2C%20Jalna%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};
