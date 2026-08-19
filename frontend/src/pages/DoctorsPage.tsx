import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Search, ShieldCheck, Clock, Award, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DoctorsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [search, setSearch] = useState('');

  const verifiedDoctors = [
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      nameMr: 'डॉ. निशांत गोयल',
      role: 'Director & Senior Orthopedic Surgeon',
      roleMr: 'संचालक व वरिष्ठ अस्थिरोग तज्ज्ञ',
      degree: 'MBBS, DNB, D. Ortho',
      dept: 'Orthopedics & Joint Replacement',
      deptMr: 'अस्थिरोग व सांधे प्रत्यारोपण',
      specialty: 'Knee & Hip Replacement, Trauma Fractures, Arthroscopy',
      specialtyMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया, मणक्याचे उपचार',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      timings: 'Mon – Sat: 11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      nameMr: 'डॉ. शिवदास मिरकड',
      role: 'Director & Consultant Pediatrician',
      roleMr: 'संचालक व बालरोगतज्ज्ञ',
      degree: 'MBBS, MD, DCH',
      dept: 'Pediatrics & Neonatology (NICU)',
      deptMr: 'बालरोग व नवजात शिशु अतिदक्षता',
      specialty: 'Neonatal Critical Care, Asthma, Child Growth & Vaccines',
      specialtyMr: 'नवजात शिशु अतिदक्षता, दमा, बाल आरोग्य व लसीकरण',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      timings: 'Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
    },
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      nameMr: 'डॉ. बळीराम बागल',
      role: 'Director & Chief Intensivist / Anesthesiologist',
      roleMr: 'संचालक व मुख्य अतिदक्षतातज्ज्ञ / भूलतज्ज्ञ',
      degree: 'MBBS, DA, FICM, CCCS',
      dept: '21-Bed ICU & Critical Care',
      deptMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      specialty: 'Mechanical Ventilation, Dialysis Support & Emergency Triage',
      specialtyMr: 'व्हेंटिलेटर, डायलिसिस सपोर्ट व आपत्कालीन अतिदक्षता',
      fee: 400,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
      timings: '24x7 On-Call & Emergency ICU Triage',
    },
    {
      id: 'doc-anshul',
      name: 'Dr. Anshul Goyal',
      nameMr: 'डॉ. अंशुल गोयल',
      role: 'Consultant Obstetrician & Gynecologist',
      roleMr: 'वरिष्ठ प्रसूती व स्त्रीरोगतज्ज्ञ',
      degree: 'MBBS, DNB, DGO',
      dept: 'Obstetrics & Gynecology (Maternity)',
      deptMr: 'प्रसूती व स्त्रीरोग विभाग',
      specialty: 'Safe Motherhood, High-Risk Pregnancy & Laparoscopy',
      specialtyMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व व दुर्बिणीद्वारे शस्त्रक्रिया',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1594824813588-444747683936?auto=format&fit=crop&w=600&q=80',
      timings: 'Mon – Sat: 10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      nameMr: 'डॉ. कैलाश राजगुरु',
      role: 'Consultant Physician & Intensivist',
      roleMr: 'वरिष्ठ फिजिशियन व अतिदक्षतातज्ज्ञ',
      degree: 'MBBS, MD (Medicine)',
      dept: 'Internal Medicine & Physician',
      deptMr: 'सामान्य औषधोपचार विभाग',
      specialty: 'Diabetes, Hypertension, Heart Evaluation & Infections',
      specialtyMr: 'मधुमेह, उच्च रक्तदाब, हृदयविकार व संसर्गजन्य आजार',
      fee: 400,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      timings: 'Mon – Sat: 09:00 AM – 01:00 PM | 05:00 PM – 08:00 PM',
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      nameMr: 'डॉ. मिलींद काटोले',
      role: 'Consultant General & Laparoscopic Surgeon',
      roleMr: 'वरिष्ठ जनरल व लेप्रोस्कोपिक सर्जन',
      degree: 'MBBS, MS (General Surgery)',
      dept: 'General & Laparoscopic Surgery',
      deptMr: 'जनरल व दुर्बिणीद्वारे शस्त्रक्रिया',
      specialty: 'HD Laparoscopy, Gallstones, Hernia & Laser Piles',
      specialtyMr: 'दुर्बिणीद्वारे पित्ताशय, हर्निया, अपेंडिक्स व लेझर शस्त्रक्रिया',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      timings: 'Mon – Sat: 11:00 AM – 03:00 PM',
    },
  ];

  const filtered = verifiedDoctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.dept.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ─── HERO BANNER (50-60% Saturated Medical Header) ─────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'संजीवनी हॉस्पिटल वैद्यकीय संचालक व तज्ज्ञ डॉक्टर' : 'Verified Hospital Medical Faculty & Consultants'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
          {isMr ? 'तज्ज्ञ डॉक्टर व' : 'Specialist Doctors &'}<br />
          <span className="text-[#FDE047] font-black">
            {isMr ? 'वैद्यकीय सल्लागार सूची' : 'Medical Faculty Directory'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे अनुभवी अस्थिरोग सर्जन, बालरोगतज्ज्ञ, स्त्रीरोगतज्ज्ञ, भूलतज्ज्ञ आणि फिजिशियन ओपीडी व २४ तास सेवेसाठी उपलब्ध आहेत.'
            : 'Consult highly experienced surgeons, physicians, pediatricians, and intensivists with advanced surgical and critical care capabilities.'}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg pt-2">
          <Search className="w-5 h-5 absolute left-4.5 top-5.5 text-slate-400" />
          <input
            type="text"
            placeholder={isMr ? 'डॉक्टरांचे नाव किंवा विशेष विभाग शोधा...' : 'Search by doctor name or specialty...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 font-bold border-2 border-cyan-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xl"
          />
        </div>
      </div>

      {/* ─── DOCTOR CARDS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border-3 border-[#93C5FD]/80 p-7 shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-6 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200 shadow-md">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-xl font-black text-[#002B5B] truncate font-heading">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#007791]">
                    {isMr ? doc.roleMr : doc.role}
                  </p>
                  <p className="text-xs font-bold text-slate-600">
                    {doc.degree}
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {isMr ? doc.deptMr : doc.dept}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#EBF5FF] rounded-2xl space-y-2 text-xs sm:text-sm border-2 border-[#93C5FD]">
                <div>
                  <span className="font-black text-slate-700">Specialty: </span>
                  <span className="font-semibold text-slate-900">{isMr ? doc.specialtyMr : doc.specialty}</span>
                </div>
                <div>
                  <span className="font-black text-slate-700">Schedule: </span>
                  <span className="font-extrabold text-[#002B5B]">{doc.timings}</span>
                </div>
                <div className="pt-1 flex justify-between items-center border-t border-blue-200">
                  <span className="font-bold text-slate-600">OPD Consultation Fee:</span>
                  <span className="font-black text-emerald-700 text-base">₹{doc.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to={`/doctors/${doc.id}`}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-black text-center transition border border-slate-300"
              >
                {isMr ? 'प्रोफाइल पहा' : 'View Profile'}
              </Link>
              <Link
                to={`/book?doctorId=${doc.id}`}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#002B5B] to-[#007791] text-white text-xs sm:text-sm font-black text-center hover:opacity-95 transition shadow-md"
              >
                <span className="text-white font-black">{isMr ? 'अपॉइंटमेंट घ्या' : 'Book Appointment'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
