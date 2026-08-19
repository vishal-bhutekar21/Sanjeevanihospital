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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ─── HEADER BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] text-white p-8 sm:p-14 rounded-3xl shadow-2xl space-y-4 border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <MapPin className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'हॉस्पिटल संपर्क व पत्ता' : 'Hospital Location & Direct Contact'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-heading">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना'
            : 'Sanjeevani Multispeciality Hospital, Jalna'}
        </h1>
        <p className="text-base sm:text-lg text-slate-100 font-medium max-w-3xl leading-relaxed">
          {isMr
            ? 'अंबड चौफुली, जालना येथे २४ तास आपत्कालीन सेवा, अतिदक्षता विभाग (ICU) आणि तज्ज्ञ डॉक्टरांचा सल्ला उपलब्ध आहे.'
            : 'Located conveniently at Ambad Choufuli, Jalna. Accessible 24 hours a day for emergency casualty, 21-bed ICU, and specialist outpatient consultations.'}
        </p>
      </div>

      {/* ─── 3-COLUMN CONTACT & HOURS GRID ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 24x7 Emergency & Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Solid Red 24x7 Casualty Card */}
          <div className="bg-[#DC2626] text-white rounded-3xl p-7 shadow-2xl border-3 border-rose-400 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black font-heading leading-tight">
                  {isMr ? '२४x७ आपत्कालीन व ट्रॉमा' : '24x7 Emergency Casualty'}
                </h3>
                <p className="text-xs text-rose-100 font-semibold">
                  {isMr ? 'तातडीचे उपचार व अतिदक्षता ICU' : 'Immediate Resuscitation & ICU'}
                </p>
              </div>
            </div>
            <a
              href="tel:+917507342222"
              className="w-full py-3.5 px-4 rounded-2xl bg-white text-[#DC2626] font-black text-lg text-center flex items-center justify-center gap-2 shadow-lg hover:bg-rose-50 transition"
            >
              <Phone className="w-5 h-5 text-[#DC2626]" />
              <span>+91-75073-42222</span>
            </a>
          </div>

          {/* Hospital Address & Landmark */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-7 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-[#002B5B] font-heading border-b-2 border-amber-200 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#002B5B]" />
              <span>{isMr ? 'हॉस्पिटलचा अधिकृत पत्ता' : 'Official Hospital Address'}</span>
            </h3>
            
            <div className="text-sm text-slate-800 space-y-1 font-medium">
              <p className="font-black text-base text-[#002B5B]">Sanjeevani Multispeciality Hospital</p>
              <p>Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli,</p>
              <p>Jalna, Maharashtra – 431203, India.</p>
              <p className="text-xs text-slate-700 pt-2 font-bold">
                Landmark: Near Ambad Choufuli Junction (3.5 km from Jalna Railway Station).
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#002B5B] text-white text-sm font-black hover:bg-slate-900 transition shadow-xl w-full"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>{isMr ? 'गुगल मॅप्सवर दिशा पहा' : 'Open in Google Maps / Directions'}</span>
            </a>
          </div>

          {/* Reception & OPD Timings */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-7 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-[#002B5B] font-heading border-b-2 border-amber-200 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#007791]" />
              <span>{isMr ? 'ओपीडी व भेटण्याची वेळ' : 'OPD & Visiting Schedule'}</span>
            </h3>

            <div className="space-y-3 text-sm text-slate-800">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-amber-200 shadow-sm">
                <span className="font-bold">{isMr ? 'सकाळची ओपीडी:' : 'Morning OPD:'}</span>
                <span className="font-black text-[#002B5B]">09:00 AM – 03:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-amber-200 shadow-sm">
                <span className="font-bold">{isMr ? 'संध्याकाळची ओपीडी:' : 'Evening OPD:'}</span>
                <span className="font-black text-[#002B5B]">05:00 PM – 08:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-700">
                <span className="font-bold">{isMr ? 'आपत्कालीन अतिदक्षता:' : 'Emergency ICU:'}</span>
                <span className="font-black">२४ तास अखंड</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Direct Online Inquiry Form & Interactive Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Inquiry Form */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 sm:p-10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-black text-[#002B5B] font-heading">
                {isMr ? 'थेट चौकशी व संदेश पाठवा' : 'Direct Inquiry & Feedback Form'}
              </h3>
              <p className="text-sm text-slate-700 font-bold mt-1">
                {isMr
                  ? 'आपला संदेश पाठवा, आमची टीम त्वरित आपल्याशी संपर्क करेल.'
                  : 'Submit your query below and our front desk coordinator will respond promptly.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3 shadow-md">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-emerald-900 font-heading">
                  {isMr ? 'संदेश यशस्वीरीत्या पाठवला!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-sm text-emerald-800 font-bold">
                  {isMr
                    ? 'संजीवनी हॉस्पिटलशी संपर्क केल्याबद्दल धन्यवाद. आमचा प्रतिनिधी लवकरच संपर्क साधेल.'
                    : 'Thank you for reaching out to Sanjeevani Hospital. Our team will contact you shortly.'}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#002B5B] text-white font-bold text-sm hover:bg-slate-900 transition shadow-md"
                >
                  {isMr ? 'दुसरा संदेश पाठवा' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {isMr ? 'आपले संपूर्ण नाव' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isMr ? 'उदा. राहुल शिंदे' : 'e.g. Rahul Shinde'}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-white focus:border-[#002B5B] focus:outline-none text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {isMr ? 'मोबाईल नंबर' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-white focus:border-[#002B5B] focus:outline-none text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isMr ? 'संबंधित वैद्यकीय विभाग' : 'Department / Specialty'}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-[#002B5B] focus:outline-none text-sm font-semibold bg-white"
                  >
                    <option value="orthopedics">Orthopedics & Joint Replacement (अस्थिरोग)</option>
                    <option value="pediatrics">Pediatrics & Neonatology (बालरोग व NICU)</option>
                    <option value="icu">ICU & Critical Care (अतिदक्षता विभाग)</option>
                    <option value="obgyn">Obstetrics & Gynecology (प्रसूती व स्त्रीरोग)</option>
                    <option value="surgery">General & Laparoscopic Surgery (शस्त्रक्रिया)</option>
                    <option value="mjpjay">MJPJAY Scheme & Insurance (शासकीय योजना)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isMr ? 'आपला संदेश / चौकशी' : 'Your Message / Inquiry'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isMr ? 'कृपया आपल्या आजाराबद्दल किंवा चौकशीबद्दल थोडक्यात लिहा...' : 'Please write your query or medical requirement briefly...'}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-white focus:border-[#002B5B] focus:outline-none text-sm font-semibold resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#002B5B] to-[#007791] text-white font-black text-base shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2 border-2 border-amber-400"
                >
                  <Send className="w-5 h-5" />
                  <span>{isMr ? 'चौकशी संदेश सबमिट करा' : 'Submit Medical Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Interactive Google Map Frame */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-6 shadow-xl space-y-3">
            <h3 className="text-lg font-black text-[#002B5B] font-heading">
              {isMr ? 'गुगल मॅप्स थेट लोकेशन' : 'Interactive Location Map'}
            </h3>
            <div className="w-full h-72 rounded-2xl overflow-hidden border-2 border-amber-300 relative shadow-inner">
              <iframe
                title="Sanjeevani Multispeciality Hospital Jalna Map"
                src="https://maps.google.com/maps?q=Sanjeevani+Multispeciality+Hospital+Jalna+Rishi+Park&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
