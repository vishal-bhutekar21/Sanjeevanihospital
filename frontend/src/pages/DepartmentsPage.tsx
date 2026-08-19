import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ChevronRight,
  Activity,
  Calendar,
  ArrowRight,
  Award,
  Users,
  CheckCircle2,
  HeartPulse,
  TrendingUp,
  Clock,
  Sparkles,
  Bed,
  Baby,
  Scissors,
  Stethoscope,
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
      desc: 'Advanced arthroplasty, total knee & hip replacement, complex fracture trauma care, and arthroscopy with digital C-Arm fluoroscopy.',
      descMr: 'सांधेदुखी, गुडघे व खुबा प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया व मणक्याचे आधुनिक उपचार.',
      faculty: 'Dr. Nishant Goyal',
      degree: 'MBBS, DNB, D. Ortho',
      patientsCount: '4,500+',
      patientsLabel: isMr ? 'यशस्वी हाडांच्या शस्त्रक्रिया' : 'Orthopedic Surgeries',
      successRate: '99.4%',
      impressions: '18,000+ OPD Consultations',
      impressionsMr: '१८,०००+ ओपीडी तपासण्या',
      timings: '11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
      features: [
        isMr ? 'डिजिटल C-Arm फ्लोरोस्कोपी' : 'Digital C-Arm Fluoroscopy',
        isMr ? 'टोटल नी व हिप रिप्लेसमेंट' : 'Total Knee & Hip Replacement',
        isMr ? '२४x७ आपत्कालीन फ्रॅक्चर व ट्रॉमा' : '24x7 Acute Trauma & Fracture Care',
      ],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      icon: Activity,
    },
    {
      slug: 'pediatrics',
      nameEn: 'Pediatrics & Neonatology (NICU)',
      nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
      desc: '24x7 Neonatal ICU (NICU), pediatric critical care, vaccinations, phototherapy warmers, and child growth assessments.',
      descMr: 'लहान मुलांचे आजार, नवजात बाळांसाठी NICU, लसीकरण व बालरोग अतिदक्षता सेवा.',
      faculty: 'Dr. Shivdas Mirkad',
      degree: 'MBBS, MD, DCH',
      patientsCount: '15,000+',
      patientsLabel: isMr ? 'बालरुग्णांवर यशस्वी उपचार' : 'Children Treated',
      successRate: '99.8%',
      impressions: '32,000+ Pediatric Checkups',
      impressionsMr: '३२,०००+ बालरोग तपासण्या',
      timings: '10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
      features: [
        isMr ? 'आधुनिक नवजात शिशु NICU वॉर्मर्स' : 'Microprocessor NICU Warmers',
        isMr ? 'कावीळ फोटोथेरपी व व्हेंटिलेटर' : 'Phototherapy & Pediatric Ventilators',
        isMr ? 'संपूर्ण बाल लसीकरण वेळापत्रक' : 'Complete Childhood Immunization',
      ],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      icon: Baby,
    },
    {
      slug: 'icu-critical-care',
      nameEn: '21-Bed ICU & Critical Care',
      nameMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      desc: 'Multi-organ intensive care, 24x7 intensivist monitoring, high-end mechanical ventilation, and renal dialysis support.',
      descMr: 'व्हेंटिलेटर, डायलिसिस सपोर्ट, संगणकीकृत मॉनिटरिंग व २४ तास भूलतज्ज्ञ डॉक्टर.',
      faculty: 'Dr. Baliram Bagal',
      degree: 'MBBS, DA, FICM, CCCS',
      patientsCount: '3,800+',
      patientsLabel: isMr ? 'अतिदक्षता जीवनरक्षक उपचार' : 'Critical Lives Saved',
      successRate: '98.7%',
      impressions: '24x7 Intensivist On-Call',
      impressionsMr: '२४ तास भूलतज्ज्ञ डॉक्टर उपस्थित',
      timings: '24x7 Emergency Admissions & Resuscitation',
      features: [
        isMr ? '२१ सुसज्ज व्हेंटिलेटर खाटा' : '21 Ventilator-Equipped ICU Beds',
        isMr ? '७-चॅनेल संगणकीकृत मॉनिटरिंग' : '7-Channel Hemodynamic Monitors',
        isMr ? 'रक्त व डायलिसिस जीवनरक्षक सपोर्ट' : 'ABG & Renal Dialysis Support',
      ],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      icon: HeartPulse,
    },
    {
      slug: 'obstetrics-gynecology',
      nameEn: 'Obstetrics & Gynecology (Maternity)',
      nameMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      desc: 'Safe motherhood, high-risk pregnancy management, painless normal delivery, cesarean section, and gynecological laparoscopy.',
      descMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व निवारण व दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      faculty: 'Dr. Anshul Goyal',
      degree: 'MBBS, DNB, DGO',
      patientsCount: '5,200+',
      patientsLabel: isMr ? 'सुरक्षित प्रसूती व शस्त्रक्रिया' : 'Safe Deliveries & Surgeries',
      successRate: '99.6%',
      impressions: '22,000+ Women Health Consults',
      impressionsMr: '२२,०००+ स्त्रीआरोग्य तपासण्या',
      timings: '10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
      features: [
        isMr ? 'वेदनामुक्त प्रसूती व सिझेरियन' : 'Painless Normal & High-Risk Delivery',
        isMr ? 'दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया' : 'Laparoscopic Hysterectomy & Cysts',
        isMr ? '3D/4D सोनोग्राफी व गर्भतपासणी' : '3D/4D Fetal Well-being Scan',
      ],
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      icon: Award,
    },
    {
      slug: 'general-surgery',
      nameEn: 'General & Laparoscopic Surgery',
      nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
      desc: 'Karl Storz HD Laparoscopic cholecystectomy, hernia repair, appendectomy, and laser anorectal surgeries.',
      descMr: 'दुर्बिणीद्वारे पित्ताशय खडे, हर्निया, अपेंडिक्स व लेझरद्वारे मूळव्याध शस्त्रक्रिया.',
      faculty: 'Dr. Millind Katole',
      degree: 'MBBS, MS General Surgery',
      patientsCount: '4,100+',
      patientsLabel: isMr ? 'दुर्बिणीद्वारे यशस्वी शस्त्रक्रिया' : 'Laparoscopic Surgeries',
      successRate: '99.5%',
      impressions: '14,000+ Surgical Patients',
      impressionsMr: '१४,०००+ शस्त्रक्रिया रुग्ण',
      timings: '11:00 AM – 03:00 PM',
      features: [
        isMr ? 'कार्ल स्टॉर्झ HD लेप्रोस्कोपी टॉवर' : 'Karl Storz HD Laparoscopy Tower',
        isMr ? 'सूक्ष्म चीरा व जलद रिकव्हरी' : 'Minimal Incision & Fast Healing',
        isMr ? 'पित्ताशय, हर्निया व अपेंडिक्स' : 'Gallbladder, Hernia & Appendicitis',
      ],
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* ─── 1. HERO BANNER WITH OVERALL HOSPITAL CLINICAL METRICS ──────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#00875A] rounded-3xl p-8 sm:p-12 text-white space-y-8 shadow-2xl border-3 border-emerald-400">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-md border border-emerald-300">
            <Building2 className="w-4 h-4 text-white" />
            <span>{isMr ? 'सर्वसमावेशक वैद्यकीय व शस्त्रक्रिया विभाग' : 'Multispeciality Clinical Infrastructure'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
            {isMr ? 'प्रमुख वैद्यकीय विभाग आणि' : 'Clinical Departments &'}<br />
            <span className="text-emerald-300 font-black">
              {isMr ? 'विशेषोपचार शाखा' : 'Specialist Centers'}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
            {isMr
              ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथे अनुभवी सर्जन आणि तज्ज्ञ डॉक्टरांच्या मार्गदर्शनाखाली आधुनिक तंत्रज्ञानासह सर्व प्रमुख आजारांचे अचूक निदान व यशस्वी उपचार केले जातात.'
              : 'Comprehensive clinical specialties equipped with modular surgical suites, 21-bed ICU, digital imaging, and experienced specialist doctors in Jalna.'}
          </p>
        </div>

        {/* 4 Standout Live Clinical Performance Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-white/20">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase">
              <Users className="w-4 h-4" />
              <span>{isMr ? 'एकूण रुग्ण' : 'Patient Count'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-heading">50,000+</div>
            <div className="text-[11px] text-slate-200 font-bold">{isMr ? 'समाधानी रुग्ण व उपचार' : 'Happy Patients Treated'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase">
              <Award className="w-4 h-4" />
              <span>{isMr ? 'यशस्वी शस्त्रक्रिया' : 'Surgeries Done'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-heading">10,000+</div>
            <div className="text-[11px] text-slate-200 font-bold">{isMr ? 'अस्थिरोग व लेप्रोस्कोपी' : 'Orthopedic & Laparoscopy'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>{isMr ? 'यशस्वी उपचार दर' : 'Success Rate'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-heading">99.4%</div>
            <div className="text-[11px] text-slate-200 font-bold">{isMr ? 'क्लिनिकल अचूकता दर' : 'Clinical Recovery Rate'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase">
              <Bed className="w-4 h-4" />
              <span>{isMr ? 'अतिदक्षता खाटा' : 'Critical ICU Beds'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-heading">21 Beds</div>
            <div className="text-[11px] text-slate-200 font-bold">{isMr ? '२४ तास व्हेंटिलेटर व डायलिसिस' : 'Ventilator & Dialysis Care'}</div>
          </div>
        </div>
      </div>

      {/* ─── 2. DEPARTMENTS SHOWCASE WITH DETAILED METRICS & IMPRESSIONS ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.slug}
              className="bg-gradient-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E3F1EB] rounded-3xl border-2 border-[#86EFAC] shadow-lg hover:shadow-2xl transition-all duration-150 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header with Real Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-[#001529]/30 to-transparent"></div>
                  
                  {/* Doctor Faculty Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-black bg-[#002B5B] text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-400/60 shadow">
                      {dept.faculty} ({dept.degree})
                    </span>
                  </div>

                  {/* Top Success Rate Pill */}
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow border border-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{dept.successRate} {isMr ? 'यशस्वी दर' : 'Success'}</span>
                  </div>
                </div>

                {/* Card Content & Metrics */}
                <div className="p-6 space-y-4">
                  
                  {/* Department Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002B5B] text-emerald-300 flex items-center justify-center shrink-0 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-[#002B5B] font-heading leading-snug">
                        {isMr ? dept.nameMr : dept.nameEn}
                      </h3>
                      <p className="text-[11px] font-bold text-[#007791] mt-0.5">
                        {isMr ? dept.impressionsMr : dept.impressions}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                    {isMr ? dept.descMr : dept.desc}
                  </p>

                  {/* 2 Saturated Metric Badges: Patient Count & Success Rate */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm">
                    <div className="text-left">
                      <div className="text-lg font-black text-[#002B5B] font-heading leading-tight">{dept.patientsCount}</div>
                      <div className="text-[10px] text-slate-700 font-bold leading-tight">{dept.patientsLabel}</div>
                    </div>
                    <div className="text-left border-l-2 border-emerald-100 pl-2.5">
                      <div className="text-lg font-black text-emerald-700 font-heading leading-tight">{dept.successRate}</div>
                      <div className="text-[10px] text-slate-700 font-bold leading-tight">{isMr ? 'यशस्वी परिणाम' : 'Success Rate'}</div>
                    </div>
                  </div>

                  {/* Key Clinical Features */}
                  <div className="space-y-1.5 pt-1">
                    {dept.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timings */}
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 pt-2 border-t border-emerald-200">
                    <Clock className="w-3.5 h-3.5 text-[#007791] shrink-0" />
                    <span className="truncate">{dept.timings}</span>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <Link
                  to={`/departments/${dept.slug}`}
                  className="text-xs font-black text-[#002B5B] hover:text-emerald-800 transition flex items-center gap-1"
                >
                  <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/book"
                  className="px-4 py-2.5 rounded-xl bg-[#002B5B] text-white hover:bg-slate-900 font-black text-xs transition shadow-md whitespace-nowrap"
                >
                  {isMr ? 'अपॉइंटमेंट बुक करा' : 'Book Consultation'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
