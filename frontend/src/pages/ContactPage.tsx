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
  Sparkles,
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

  const departmentContacts = [
    {
      title: isMr ? '२४ तास अ‍ॅम्ब्युलन्स' : '24x7 Ambulance',
      phone: '+91-88305-18080',
      desc: isMr ? 'तातडीच्या रुग्णांसाठी तात्काळ वाहन' : 'Emergency Trauma & Patient Transport',
      icon: HeartPulse,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
    },
    {
      title: isMr ? 'हॉस्पिटल रिसेप्शन / ओपीडी' : 'Hospital Reception & OPD',
      phone: '+91-75073-42222',
      desc: isMr ? 'डॉक्टर भेट व सामान्य नोंदणी' : 'OPD Appointments & General Help',
      icon: Phone,
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
    },
    {
      title: isMr ? 'MJPJAY शासकीय योजना कक्ष' : 'MJPJAY Govt. Scheme Desk',
      phone: '+91-82089-65820',
      desc: isMr ? 'मोफत उपचार व आरोग्य मित्र मदत' : 'Arogya Mitra & Free Scheme Assistance',
      icon: ShieldCheck,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
    },
    {
      title: isMr ? 'कॅशलेस इन्शुरन्स व टीपीए' : 'Cashless Insurance & TPA',
      phone: '+91-91460-22490',
      desc: isMr ? 'मेडिक्लेम व प्री-ऑथरायझेशन' : 'Mediclaim Pre-Auth & Claims Desk',
      icon: Building2,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
    },
    {
      title: isMr ? 'हॉस्पिटल प्रशासन व बिलिंग' : 'Hospital Administration',
      phone: '+91-96876-09046',
      desc: isMr ? 'प्रशासकीय कार्य व कार्यालयीन वेळ' : 'Administrative Inquiries & Support',
      icon: Mail,
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* ─── 1. PAGE HEADER (CLEAN HEALTHCARE HERO) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-amber-50/40 border border-teal-200 shadow-xs space-y-4">
        <div className="badge-teal text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{isMr ? 'हॉस्पिटल पत्ता व अधिकृत संपर्क' : 'Official Hospital Location & Direct Hotlines'}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना'
                : 'Sanjeevani Multispeciality Hospital, Jalna'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {isMr
                ? 'अंबड चौफुली, जालना येथे २४ तास आपत्कालीन सेवा, २१ खाटांचा सुसज्ज अतिदक्षता विभाग (ICU) आणि तज्ज्ञ डॉक्टरांचा सल्ला उपलब्ध आहे.'
                : 'Located at Ambad Choufuli, Jalna. Round-the-clock emergency care, 21-bed ICU, digital diagnostics, and verified specialist outpatient OPD.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href="tel:+917507342222"
              className="btn-primary text-xs py-2.5 px-4 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isMr ? 'थेट कॉल: +91-75073-42222' : 'Direct Call: +91-75073-42222'}</span>
            </a>
            <a
              href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2.5 px-4"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'दिशा (Maps)' : 'Directions'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 2. TOP 4 KEY HIGHLIGHT CARDS ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 24x7 Emergency */}
        <div className="card-clean p-5 bg-gradient-to-br from-red-500 to-rose-600 text-white flex flex-col justify-between space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
              {isMr ? '२४x७ आपत्कालीन' : '24x7 Emergency'}
            </span>
            <HeartPulse className="w-5 h-5 text-white/90" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading">{isMr ? 'तातडीचे अतिदक्षता उपचार' : 'Casualty & ICU Resuscitation'}</h3>
            <p className="text-xs text-red-100 mt-0.5">{isMr ? '२४ तास भूलतज्ज्ञ व सर्जन उपलब्ध' : 'Round-the-clock intensivists & surgeons'}</p>
          </div>
          <a
            href="tel:+917507342222"
            className="w-full py-2 px-3 rounded-lg bg-white text-red-600 font-bold text-xs text-center flex items-center justify-center gap-1.5 hover:bg-red-50 transition mt-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91-75073-42222</span>
          </a>
        </div>

        {/* Card 2: OPD & Timings */}
        <div className="card-clean p-5 flex flex-col justify-between space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="badge-teal text-[10px]">
              {isMr ? 'ओपीडी वेळापत्रक' : 'OPD Timings'}
            </span>
            <Clock className="w-5 h-5 text-[#0F766E]" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isMr ? 'सकाळची वेळ:' : 'Morning:'}</span>
              <span className="font-semibold text-slate-900">09:00 AM – 03:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isMr ? 'संध्याकाळ:' : 'Evening:'}</span>
              <span className="font-semibold text-slate-900">05:00 PM – 08:00 PM</span>
            </div>
            <div className="flex justify-between items-center text-teal-700 font-medium pt-1 border-t border-slate-100">
              <span>{isMr ? 'आयसीयू व कॅज्युअल्टी:' : 'ICU / Emergency:'}</span>
              <span className="font-bold">24x7 Open</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 block">{isMr ? 'सोमवार ते शनिवार नियमित' : 'Mon – Sat regular sessions'}</span>
        </div>

        {/* Card 3: Address & Location */}
        <div className="card-clean p-5 flex flex-col justify-between space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {isMr ? 'पत्ता व खूण' : 'Address & Landmark'}
            </span>
            <MapPin className="w-5 h-5 text-[#0F766E]" />
          </div>
          <div className="text-xs text-slate-600 space-y-0.5">
            <p className="font-bold text-slate-900">Plot 17, Rishi Park, Ambad Choufuli</p>
            <p>Jalna, Maharashtra – 431203</p>
            <p className="text-[11px] text-slate-400 pt-0.5">
              {isMr ? 'अंबड चौफुली सर्कलजवळ (रेल्वे स्टेशनपासून ३.५ किमी)' : 'Near Ambad Choufuli (3.5 km from Railway Station)'}
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <span>{isMr ? 'नकाशावर दिशा पहा' : 'View on Google Maps'}</span>
            <Navigation className="w-3 h-3" />
          </a>
        </div>

        {/* Card 4: Email & Frontdesk */}
        <div className="card-clean p-5 flex flex-col justify-between space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {isMr ? 'ईमेल व मदत कक्ष' : 'Email & Support'}
            </span>
            <Mail className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="text-slate-500">{isMr ? 'अधिकृत ईमेल आयडी:' : 'Official Email Desk:'}</p>
            <a href="mailto:sanjeevanihospjalna@gmail.com" className="font-semibold text-slate-900 hover:text-[#0F766E] block truncate">
              sanjeevanihospjalna@gmail.com
            </a>
            <p className="text-[11px] text-slate-400">
              {isMr ? 'चौकशीचे उत्तर २४ तासांच्या आत दिले जाईल' : 'Inquiries answered within 24 hours'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMr ? 'सक्रिय मदत कक्ष' : 'Active Helpdesk'}</span>
          </span>
        </div>
      </div>

      {/* ─── 3. DEPARTMENT HOTLINES DIRECTORY ───────────────────────────────── */}
      <div className="card-clean p-6 sm:p-8 space-y-4 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0F766E]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'संजीवनी हॉस्पिटल थेट विभाग संपर्क क्रमांक' : 'Department Direct Contact Hotlines'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {isMr
              ? 'खालील थेट क्रमांकांवर कॉल करून संबंधित विभागाशी तात्काळ संपर्क साधा:'
              : 'Reach the specific hospital department directly for immediate assistance:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {departmentContacts.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <a
                key={idx}
                href={`tel:${dept.phone.replace(/[^0-9+]/g, '')}`}
                className={`p-4 rounded-xl ${dept.bg} ${dept.border} border flex items-center justify-between hover:shadow-xs transition group`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <span className={`text-xs font-bold ${dept.text} block truncate group-hover:underline`}>
                    {dept.title}
                  </span>
                  <p className="text-[11px] text-slate-500 truncate">{dept.desc}</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">{dept.phone}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shrink-0 border border-slate-200/50">
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ─── 4. INQUIRY FORM & INTERACTIVE MAP ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Direct Inquiry Form */}
        <div className="lg:col-span-6 card-clean p-6 sm:p-8 space-y-5 bg-white">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Send className="w-4 h-4 text-[#0F766E]" />
              <span>{isMr ? 'थेट चौकशी व संदेश पाठवा' : 'Direct Inquiry & Feedback Desk'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isMr
                ? 'आपला संदेश पाठवा, आमची टीम त्वरित आपल्याशी संपर्क करेल.'
                : 'Fill out this quick form and our reception coordinator will contact you promptly.'}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#0F766E] mx-auto" />
              <h4 className="text-base font-bold text-slate-900 font-heading">
                {isMr ? 'संदेश यशस्वीरीत्या नोंदवला गेला आहे!' : 'Inquiry Submitted Successfully!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {isMr
                  ? 'संजीवनी हॉस्पिटलशी संपर्क साधल्याबद्दल धन्यवाद. आमचा प्रतिनिधी लवकरच आपल्या फोनवर संपर्क करेल.'
                  : 'Thank you for reaching out to Sanjeevani Multispeciality Hospital, Jalna. Our team will contact you shortly.'}
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="btn-secondary text-xs py-1.5 px-4 mt-2"
              >
                {isMr ? 'दुसरा संदेश पाठवा' : 'Send Another Inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'पूर्ण नाव *' : 'Full Name *'}
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isMr ? 'उदा. राहुल पाटील' : 'e.g. Rahul Patil'}
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'मोबाईल नंबर *' : 'Mobile Number (+91) *'}
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'विभाग / चौकशीचा विषय' : 'Select Department / Query Category'}
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
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
                  placeholder={isMr ? 'आम्ही आपल्याला कशी मदत करू शकतो?' : 'Please describe your query or preferred consultation date...'}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-6 w-full sm:w-auto shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isMr ? 'चौकशी संदेश पाठवा' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Google Maps & Accessibility */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-clean overflow-hidden h-72 sm:h-80 relative bg-slate-100 border border-slate-200">
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

          {/* Transit & Accessibility Guide */}
          <div className="card-clean p-4 sm:p-5 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'वाहतूक व पोहचण्याचे अंतर' : 'Transport & Accessibility Landmarks'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center gap-2">
                <Train className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[10px]">{isMr ? 'रेल्वे स्टेशन' : 'Jalna Railway Stn'}</span>
                  <span className="font-bold text-slate-900">~ 3.5 km</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[10px]">{isMr ? 'मध्यवर्ती बस स्थानक' : 'Central Bus Stand'}</span>
                  <span className="font-bold text-slate-900">~ 2.8 km</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[10px]">{isMr ? 'अंबड बायपास' : 'Ambad Bypass'}</span>
                  <span className="font-bold text-slate-900">~ 500 meters</span>
                </div>
              </div>

              <div className="p-2.5 bg-teal-50 rounded-lg flex items-center gap-2 border border-teal-100">
                <Car className="w-4 h-4 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-teal-700 block text-[10px]">{isMr ? 'मोफत पार्किंग' : 'Free Parking'}</span>
                  <span className="font-bold text-teal-900">{isMr ? 'उपलब्ध' : 'On Premise'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
