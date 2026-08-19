import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Activity, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DepartmentsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const departments = [
    {
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      desc: 'Advanced arthroplasty, total knee & hip replacement, fracture trauma care, and arthroscopy with digital C-Arm fluoroscopy.',
      descMr: 'सांधेदुखी, गुडघे व खुबा प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया व मणक्याचे आधुनिक उपचार.',
      faculty: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology (NICU)',
      nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
      desc: '24x7 Neonatal ICU (NICU), pediatric critical care, vaccinations, phototherapy warmers, and child growth assessments.',
      descMr: 'लहान मुलांचे आजार, नवजात बाळांसाठी NICU, लसीकरण व बालरोग अतिदक्षता सेवा.',
      faculty: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'icu-critical-care',
      nameEn: '21-Bed ICU & Critical Care',
      nameMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      desc: 'Multi-organ intensive care, 24x7 intensivist monitoring, mechanical ventilation, and resuscitation.',
      descMr: 'व्हेंटिलेटर, डायलिसिस सपोर्ट, संगणकीकृत मॉनिटरिंग व २४ तास भूलतज्ज्ञ डॉक्टर.',
      faculty: 'Dr. Baliram Bagal (MBBS, DA, FICM, CCCS)',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology (Maternity)',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      desc: 'Safe motherhood, high-risk pregnancy management, painless normal delivery, cesarean section, and gynecological laparoscopy.',
      descMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व निवारण व दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      faculty: 'Dr. Anshul Goyal (MBBS, DNB, DGO)',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
      desc: 'Karl Storz HD Laparoscopic cholecystectomy, hernia repair, appendectomy, and laser anorectal surgeries.',
      descMr: 'दुर्बिणीद्वारे पित्ताशय खडे, हर्निया, अपेंडिक्स व लेझरद्वारे मूळव्याध शस्त्रक्रिया.',
      faculty: 'Dr. Millind Katole (MBBS, MS General Surgery)',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine & Physician',
      nameMr: 'इंटरनल मेडिसिन व फिजिशियन',
      desc: 'Holistic diagnosis and management of chronic diabetes, hypertension, cardiovascular risks, and infectious diseases.',
      descMr: 'मधुमेह, उच्च रक्तदाब, हृदयविकार निदान व संसर्गजन्य आजारांचे तज्ज्ञ उपचार.',
      faculty: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
      {/* ─── HERO BANNER (Warm Amber to Royal Navy) ────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Building2 className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'सर्वसमावेशक वैद्यकीय व शस्त्रक्रिया विभाग' : 'Multispeciality Clinical Infrastructure'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
          {isMr ? 'प्रमुख वैद्यकीय विभाग आणि' : 'Clinical Departments &'}<br />
          <span className="text-[#FDE047] font-black">
            {isMr ? 'विशेषोपचार शाखा' : 'Specialist Centers'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे अनुभवी सर्जन आणि तज्ज्ञ डॉक्टरांच्या मार्गदर्शनाखाली आधुनिक तंत्रज्ञानासह सर्व प्रमुख आजारांचे निदान व उपचार केले जातात.'
            : 'Comprehensive specialized departments equipped with modern surgical, diagnostic, and intensive care infrastructure.'}
        </p>
      </div>

      {/* ─── DEPARTMENTS GRID (50% Saturated Warm Amber-Ivory Cards) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.slug}
            className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-[#001529]/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-[#002B5B] text-amber-300 text-xs font-black px-3 py-1 rounded-xl shadow border border-amber-400">
                  OPD & 24x7 IPD
                </div>
              </div>

              <div className="p-7 space-y-3">
                <h3 className="text-xl font-black text-[#002B5B] font-heading">
                  {isMr ? dept.nameMr : dept.nameEn}
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {isMr ? dept.descMr : dept.desc}
                </p>
                <div className="pt-3 border-t-2 border-amber-200 text-xs font-bold text-[#007791]">
                  <span>Faculty: </span>
                  <span className="text-[#002B5B]">{dept.faculty}</span>
                </div>
              </div>
            </div>

            <div className="p-7 pt-0 flex items-center justify-between">
              <Link
                to={`/departments/${dept.slug}`}
                className="text-xs font-black text-slate-800 hover:text-amber-800 transition flex items-center gap-1"
              >
                <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/book"
                className="px-4 py-2.5 rounded-xl bg-[#002B5B] text-white hover:bg-slate-900 font-black text-xs transition shadow-md"
              >
                {isMr ? 'अपॉइंटमेंट बुक करा' : 'Book Consultation'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
