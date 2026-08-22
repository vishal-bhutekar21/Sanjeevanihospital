import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── PAGE HEADER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 border border-teal-200 shadow-xs space-y-4">
        <div className="badge-teal text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isMr ? 'वैद्यकीय संचालक व तज्ज्ञ डॉक्टर' : 'Verified Medical Faculty'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
          {isMr ? 'तज्ज्ञ डॉक्टर व वैद्यकीय सल्लागार' : 'Specialist Doctors & Medical Faculty'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे अनुभवी अस्थिरोग सर्जन, बालरोगतज्ज्ञ, स्त्रीरोगतज्ज्ञ, भूलतज्ज्ञ आणि फिजिशियन उपलब्ध आहेत.'
            : 'Consult experienced surgeons, physicians, pediatricians, and intensivists available for OPD and 24x7 emergency critical care.'}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md pt-2 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-5 text-slate-400" />
          <input
            type="text"
            placeholder={isMr ? 'डॉक्टरांचे नाव किंवा विभाग शोधा...' : 'Search doctor or specialty...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0F766E]"
          />
        </div>
      </div>

      {/* ─── DOCTOR CARDS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="card-clean p-5 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 truncate font-heading">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F766E]">
                    {isMr ? doc.roleMr : doc.role}
                  </p>
                  <p className="text-xs text-slate-500">
                    {doc.degree}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {isMr ? doc.deptMr : doc.dept}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Specialty: </span>
                  <span>{isMr ? doc.specialtyMr : doc.specialty}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Schedule: </span>
                  <span className="text-slate-800">{doc.timings}</span>
                </div>
                <div className="pt-1 flex justify-between items-center border-t border-slate-200">
                  <span className="text-slate-500">OPD Consultation Fee:</span>
                  <span className="font-bold text-[#0F766E] text-sm">₹{doc.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Link
                to={`/doctors/${doc.id}`}
                className="btn-secondary text-xs flex-1 min-h-[38px] py-1.5"
              >
                {isMr ? 'प्रोफाइल पहा' : 'View Profile'}
              </Link>
              <Link
                to={`/book?doctorId=${doc.id}`}
                className="btn-primary text-xs flex-1 min-h-[38px] py-1.5"
              >
                <span>{isMr ? 'अपॉइंटमेंट घ्या' : 'Book Appointment'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
