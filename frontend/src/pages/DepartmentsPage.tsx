import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Baby,
  Scissors,
  Stethoscope,
  ChevronRight,
  Clock,
  CheckCircle2,
  Users,
  Award,
  TrendingUp,
  Bed,
  Building2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DepartmentsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const departments = [
    {
      slug: 'orthopedics',
      nameEn: 'Orthopedics & Joint Replacement',
      nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      desc: 'Advanced surgical care for complex fractures, total knee replacement, total hip arthroplasty, and spine stabilization.',
      descMr: 'सांधेदुखी, गुडघे व खुबा प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया व मणक्याचे आधुनिक उपचार.',
      faculty: 'Dr. Nishant Goyal',
      degree: 'MBBS, DNB, D. Ortho',
      patientsCount: '12,500+',
      patientsLabel: isMr ? 'रुग्ण उपचार' : 'Patients Treated',
      successRate: '99.4%',
      impressions: '1,200+ Arthroplasty Surgeries',
      impressionsMr: '१,२००+ सांधे प्रत्यारोपण शस्त्रक्रिया',
      timings: '11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
      features: [
        isMr ? 'डिजिटल सी-आर्म इमेजिंग' : 'Digital C-Arm Fluoroscopy',
        isMr ? 'गुडघे व खुबा प्रत्यारोपण' : 'Total Knee & Hip Arthroplasty',
        isMr ? 'फ्रॅक्चर व मणक्याच्या शस्त्रक्रिया' : 'Trauma & Spine Stabilization',
      ],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      icon: Activity,
    },
    {
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology (NICU)',
      nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
      desc: 'Compassionate pediatric medicine, 24x7 neonatal resuscitation, radiant warmers, phototherapy, and growth monitoring.',
      descMr: 'लहान मुलांचे आजार, नवजात बाळांसाठी NICU, लसीकरण व बालरोग अतिदक्षता सेवा.',
      faculty: 'Dr. Shivdas Mirkad',
      degree: 'MBBS, MD, DCH',
      patientsCount: '18,000+',
      patientsLabel: isMr ? 'लहान मुले व नवजात बालके' : 'Children Healed',
      successRate: '99.2%',
      impressions: '3,500+ NICU Admissions',
      impressionsMr: '३,५००+ NICU प्रवेश व यशस्वी डिस्चार्ज',
      timings: '10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
      features: [
        isMr ? '२४ तास NICU व वॉर्मर्स' : '24x7 Level-II Neonatal NICU',
        isMr ? 'बालरोग दमा व श्वसन उपचार' : 'Pediatric Asthma Care',
        isMr ? 'नियमित बाल लसीकरण' : 'Childhood Immunization',
      ],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      icon: Baby,
    },
    {
      slug: 'icu-critical-care',
      nameEn: '21-Bed ICU & Critical Care Unit',
      nameMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      desc: 'Round-the-clock intensivist monitoring, mechanical ventilation, telemetry, arterial blood gas analyzers, and dialysis.',
      descMr: 'व्हेंटिलेटर, डायलिसिस सपोर्ट, संगणकीकृत मॉनिटरिंग व २४ तास भूलतज्ज्ञ डॉक्टर.',
      faculty: 'Dr. Baliram Bagal',
      degree: 'MBBS, DA, FICM, CCCS',
      patientsCount: '8,200+',
      patientsLabel: isMr ? 'गंभीर रुग्ण उपचार' : 'Critical Lives Rescued',
      successRate: '98.8%',
      impressions: '21 Fully-Equipped Beds',
      impressionsMr: '२१ सुसज्ज अतिदक्षता खाटा',
      timings: '24 Hours / 7 Days Continuous Care',
      features: [
        isMr ? 'मेकॅनिकल व्हेंटिलेशन' : 'Advanced Mechanical Ventilation',
        isMr ? '२४x७ भूलतज्ज्ञ उपस्थिती' : '24x7 Critical Care Intensivist',
        isMr ? 'बेडसाइड डायलिसिस सपोर्ट' : 'Bedside Hemodialysis Support',
      ],
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-20-at-12.09.55-PM-1.webp',
      icon: HeartPulse,
    },
    {
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology (Maternity)',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      desc: 'Holistic women health, painless normal delivery, cesarean sections, fertility evaluation, and gynecological laparoscopy.',
      descMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व निवारण व दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      faculty: 'Dr. Anshul Goyal',
      degree: 'MBBS, DNB, DGO',
      patientsCount: '9,500+',
      patientsLabel: isMr ? 'प्रसूती व महिला रुग्ण' : 'Mothers & Women Cared',
      successRate: '99.6%',
      impressions: '4,000+ Safe Deliveries',
      impressionsMr: '४,०००+ सुरक्षित प्रसूती',
      timings: '10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
      features: [
        isMr ? 'सुरक्षित प्रसूती व सिझेरियन' : 'Painless Normal & C-Section Delivery',
        isMr ? 'दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया' : 'Gynecological Laparoscopy',
        isMr ? 'गर्भावस्थेतील सोनोग्राफी' : '3D/4D Fetal Ultrasound',
      ],
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      icon: Award,
    },
    {
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
      desc: 'Minimally invasive keyhole surgery for gallstones, hernia repairs, appendix, and advanced laser anorectal procedures.',
      descMr: 'दुर्बिणीद्वारे पित्ताशय खडे, हर्निया, अपेंडिक्स व लेझरद्वारे मूळव्याध शस्त्रक्रिया.',
      faculty: 'Dr. Millind Katole',
      degree: 'MBBS, MS General Surgery',
      patientsCount: '7,800+',
      patientsLabel: isMr ? 'यशस्वी शस्त्रक्रिया' : 'Surgeries Conducted',
      successRate: '99.5%',
      impressions: '2,800+ Laparoscopic Procedures',
      impressionsMr: '२,८००+ दुर्बिणीच्या शस्त्रक्रिया',
      timings: '11:00 AM – 03:00 PM',
      features: [
        isMr ? 'कार्ल स्टॉर्झ HD लेप्रोस्कोपी' : 'Karl Storz HD Laparoscopy',
        isMr ? 'हर्निया व अपेंडिक्स शस्त्रक्रिया' : 'Laparoscopic Hernia & Appendix',
        isMr ? 'मूळव्याध व फिस्टुला लेझर उपचार' : 'Laser Anorectal Surgeries',
      ],
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2023/03/WhatsApp-Image-2023-03-21-at-4.28.59-PM.webp',
      icon: Scissors,
    },
    {
      slug: 'internal-medicine',
      nameEn: 'Internal Medicine & Physician',
      nameMr: 'इंटरनल मेडिसिन व फिजिशियन',
      desc: 'Holistic diagnosis and management of chronic diabetes, hypertension, cardiovascular risks, and infectious diseases.',
      descMr: 'मधुमेह, उच्च रक्तदाब, हृदयविकार निदान व संसर्गजन्य आजारांचे तज्ज्ञ उपचार.',
      faculty: 'Dr. Kailash Rajguru',
      degree: 'MBBS, MD Medicine',
      patientsCount: '25,000+',
      patientsLabel: isMr ? 'रुग्णांचे यशस्वी निदान' : 'Patients Treated',
      successRate: '99.1%',
      impressions: '40,000+ OPD Patient Footfalls',
      impressionsMr: '४०,०००+ ओपीडी रुग्ण ओघ',
      timings: '09:00 AM – 01:00 PM | 05:00 PM – 08:00 PM',
      features: [
        isMr ? 'मधुमेह व उच्च रक्तदाब तज्ज्ञ' : 'Diabetes & Hypertension Management',
        isMr ? 'हृदयविकार व छातीचे आजार' : 'Cardiovascular & Chest Diseases',
        isMr ? '२४ तास आपत्कालीन फिजिशियन' : '24x7 Physician Emergency Triage',
      ],
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      icon: Stethoscope,
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* ─── 1. HERO BANNER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 border border-teal-200 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="badge-teal text-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isMr ? 'सर्वसमावेशक वैद्यकीय विभाग' : 'Clinical Specialties & Infrastructure'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
            {isMr ? 'प्रमुख वैद्यकीय विभाग आणि विशेषोपचार शाखा' : 'Clinical Departments & Specialty Centers'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {isMr
              ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे अनुभवी सर्जन आणि तज्ज्ञ डॉक्टरांच्या मार्गदर्शनाखाली आधुनिक तंत्रज्ञानासह सर्व प्रमुख आजारांचे अचूक निदान व यशस्वी उपचार केले जातात.'
              : 'Comprehensive clinical specialties equipped with modular surgical suites, 21-bed ICU, digital imaging, and experienced specialist doctors in Jalna.'}
          </p>
        </div>

        {/* 4 Clinical Stats (Warm Yellow/Amber Styling) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>{isMr ? 'एकूण रुग्ण' : 'Patient Count'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">50,000+</div>
            <div className="text-xs text-amber-900/80">{isMr ? 'समाधानी रुग्ण' : 'Patients Treated'}</div>
          </div>

          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{isMr ? 'यशस्वी शस्त्रक्रिया' : 'Surgeries Done'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">10,000+</div>
            <div className="text-xs text-amber-900/80">{isMr ? 'ऑर्थो व लेप्रोस्कोपी' : 'Procedures Completed'}</div>
          </div>

          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              <span>{isMr ? 'यशस्वी उपचार दर' : 'Success Rate'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-teal-700 mt-1 font-heading">99.4%</div>
            <div className="text-xs text-amber-900/80">{isMr ? 'क्लिनिकल अचूकता' : 'Clinical Recovery'}</div>
          </div>

          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
              <Bed className="w-3.5 h-3.5 text-amber-700" />
              <span>{isMr ? 'अतिदक्षता खाटा' : 'Critical ICU Beds'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">21 Beds</div>
            <div className="text-xs text-amber-900/80">{isMr ? '२४ तास व्हेंटिलेटर' : 'Ventilator & Dialysis'}</div>
          </div>
        </div>
      </div>

      {/* ─── 2. DEPARTMENTS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.slug}
              className="card-clean overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                          {isMr ? dept.nameMr : dept.nameEn}
                        </h3>
                      </div>
                      <p className="text-xs font-semibold text-[#0F766E] mt-0.5">
                        {dept.faculty} <span className="text-slate-400 font-normal">({dept.degree})</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isMr ? dept.descMr : dept.desc}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {dept.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{dept.timings}</span>
                  </div>

                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                <Link
                  to={`/departments/${dept.slug}`}
                  className="text-xs font-semibold text-slate-700 hover:text-[#0F766E] transition flex items-center gap-1"
                >
                  <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/book"
                  className="btn-primary text-xs py-1.5 px-3 min-h-[36px]"
                >
                  {isMr ? 'अपॉइंटमेंट घ्या' : 'Book Consultation'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
