import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Phone,
  ShieldCheck,
  Award,
  Stethoscope,
  Activity,
  HeartPulse,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Star,
  Baby,
  Scissors,
  CreditCard,
  Sparkles,
  ArrowRight,
  Bed,
  Layers,
  UserCheck,
  Navigation,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  // 6 Major Clinical Departments with Real Images
  const clinicalSpecialties = [
    {
      id: 'orthopedics',
      title: 'Orthopedics & Joint Replacement',
      titleMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      doctor: 'Dr. Nishant Goyal',
      degree: 'MBBS, DNB, D. Ortho',
      desc: 'Complex trauma care, total knee & hip replacement, arthroscopy, and spine stabilization with digital C-Arm fluoroscopy.',
      descMr: 'सांधेदुखी, गुडघे व खुबा प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया व मणक्याचे आधुनिक उपचार.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      icon: Activity,
      slug: 'orthopedics',
    },
    {
      id: 'pediatrics',
      title: 'Pediatrics & Neonatal Care (NICU)',
      titleMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
      doctor: 'Dr. Shivdas Mirkad',
      degree: 'MBBS, MD, DCH',
      desc: 'Comprehensive child healthcare, 24x7 neonatal intensive care with phototherapy warmers, and pediatric asthma management.',
      descMr: 'लहान मुलांचे आजार, नवजात बाळांसाठी NICU, लसीकरण व बालरोग अतिदक्षता सेवा.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      icon: Baby,
      slug: 'pediatrics',
    },
    {
      id: 'icu',
      title: '21-Bed ICU & Critical Care',
      titleMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
      doctor: 'Dr. Baliram Bagal',
      degree: 'MBBS, DA, FICM, CCCS',
      desc: 'Computerized hemodynamic monitoring, mechanical ventilation, renal dialysis support, and 24x7 dedicated intensivist care.',
      descMr: 'व्हेंटिलेटर, डायलिसिस सपोर्ट, संगणकीकृत मॉनिटरिंग व २४ तास भूलतज्ज्ञ डॉक्टर.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      icon: HeartPulse,
      slug: 'icu-critical-care',
    },
    {
      id: 'obgyn',
      title: 'Obstetrics & Gynecology (Maternity)',
      titleMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      doctor: 'Dr. Anshul Goyal',
      degree: 'MBBS, DNB, DGO',
      desc: 'Safe motherhood, high-risk pregnancy management, painless normal delivery, cesarean section, and gynecological laparoscopy.',
      descMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व निवारण व दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया.',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      icon: Award,
      slug: 'obstetrics-gynecology',
    },
    {
      id: 'surgery',
      title: 'General & Laparoscopic Surgery',
      titleMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
      doctor: 'Dr. Millind Katole',
      degree: 'MBBS, MS General Surgery',
      desc: 'Karl Storz HD Laparoscopic cholecystectomy, hernia repair, appendectomy, and laser anorectal surgeries.',
      descMr: 'दुर्बिणीद्वारे पित्ताशय खडे, हर्निया, अपेंडिक्स व लेझरद्वारे मूळव्याध शस्त्रक्रिया.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
      icon: Scissors,
      slug: 'general-surgery',
    },
    {
      id: 'medicine',
      title: 'Internal Medicine & Cardiology Consult',
      titleMr: 'इंटरनल मेडिसिन व फिजिशियन',
      doctor: 'Dr. Kailash Rajguru',
      degree: 'MBBS, MD Medicine',
      desc: 'Hypertension, diabetes management, infectious diseases, cardiac evaluation with 3D color Doppler, and preventive wellness.',
      descMr: 'मधुमेह, उच्च रक्तदाब, हृदयविकार निदान व संसर्गजन्य आजारांचे तज्ज्ञ उपचार.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      icon: Stethoscope,
      slug: 'internal-medicine',
    },
  ];

  // Senior Faculty Doctors with Real Photos
  const seniorDoctors = [
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      nameMr: 'डॉ. निशांत गोयल',
      role: 'Director & Senior Orthopedic Surgeon',
      roleMr: 'संचालक व वरिष्ठ अस्थिरोग तज्ज्ञ',
      degree: 'MBBS, DNB, D. Ortho',
      dept: 'Orthopedics & Joint Replacement',
      deptMr: 'अस्थिरोग व सांधे प्रत्यारोपण',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      timings: '11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      nameMr: 'डॉ. शिवदास मिरकड',
      role: 'Director & Pediatrician / Neonatologist',
      roleMr: 'संचालक व बालरोगतज्ज्ञ',
      degree: 'MBBS, MD, DCH',
      dept: 'Pediatrics & Neonatology',
      deptMr: 'बालरोग व नवजात शिशु काळजी',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      timings: '10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
    },
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      nameMr: 'डॉ. बळीराम बागल',
      role: 'Director & Chief Intensivist / Anesthesiologist',
      roleMr: 'संचालक व मुख्य अतिदक्षतातज्ज्ञ / भूलतज्ज्ञ',
      degree: 'MBBS, DA, FICM, CCCS',
      dept: 'Critical Care & Anesthesia',
      deptMr: 'अतिदक्षता विभाग व भूलशास्त्र',
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
      dept: 'Obstetrics & Gynecology',
      deptMr: 'प्रसूती व स्त्रीरोग विभाग',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1594824813588-444747683936?auto=format&fit=crop&w=600&q=80',
      timings: '10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      nameMr: 'डॉ. कैलाश राजगुरु',
      role: 'Consultant Physician & Intensivist',
      roleMr: 'वरिष्ठ फिजिशियन व अतिदक्षतातज्ज्ञ',
      degree: 'MBBS, MD (Medicine)',
      dept: 'Internal Medicine & ICU',
      deptMr: 'इंटरनल मेडिसिन व अतिदक्षता',
      fee: 400,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      timings: '09:00 AM – 01:00 PM | 05:00 PM – 08:00 PM',
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      nameMr: 'डॉ. मिलींद काटोले',
      role: 'Consultant General & Laparoscopic Surgeon',
      roleMr: 'वरिष्ठ जनरल व लेप्रोस्कोपिक सर्जन',
      degree: 'MBBS, MS (General Surgery)',
      dept: 'General & Minimally Invasive Surgery',
      deptMr: 'जनरल व दुर्बिणीद्वारे शस्त्रक्रिया',
      fee: 500,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      timings: '11:00 AM – 03:00 PM',
    },
  ];

  // Advanced Medical Equipment at Sanjeevani Jalna
  const hospitalEquipment = [
    {
      title: isMr ? 'हाय-फ्रिक्वेन्सी डिजिटल सी-आर्म (C-Arm)' : 'High-Frequency Digital C-Arm',
      category: isMr ? 'शस्त्रक्रिया इमेजिंग' : 'Surgical Imaging',
      desc: isMr ? 'हाडे, फ्रॅक्चर व मणक्याच्या शस्त्रक्रियेदरम्यान अचूक एक्स-रे तपासणीसाठी अत्याधुनिक फ्लोरोस्कोपी.' : 'Real-time intraoperative fluoroscopy for precision trauma, spine & joint replacement surgeries.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? 'कार्ल स्टॉर्झ (Karl Storz) HD लेप्रोस्कोपी टॉवर' : 'Karl Storz HD Laparoscopy Tower',
      category: isMr ? 'दुर्बिणीद्वारे शस्त्रक्रिया' : 'Minimally Invasive Surgery',
      desc: isMr ? 'हाय-डेफिनिशन कॅमेऱ्याद्वारे सूक्ष्म, रक्तस्त्रावरहित व जलद बऱ्या होणाऱ्या दुर्बिणीच्या शस्त्रक्रिया.' : 'High-definition endoscopic visualization for scarless, minimally invasive abdominal & gynecological surgeries.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? '२१ खाटांचा संगणकीकृत अतिदक्षता विभाग (ICU)' : '21-Bed Computerized ICU & Ventilators',
      category: isMr ? 'अतिदक्षता जीवनरक्षक' : 'Critical Life Support',
      desc: isMr ? 'आधुनिक मेकॅनिकल व्हेंटिलेटर्स, ७-चॅनेल मल्टीपॅरा मॉनिटर्स व २४ तास जीवनरक्षक यंत्रणा.' : 'Equipped with Dräger & Hamilton mechanical ventilators, 4 private ICU suites, and renal dialysis support.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? '३२-चॅनेल 3D/4D कलर डॉपलर सोनोग्राफी' : '32-Channel 3D/4D Color Doppler Sonography',
      category: isMr ? 'अचूक रेडिओलॉजी निदान' : 'Radiology Diagnostics',
      desc: isMr ? 'गर्भावस्थेतील बाळाची सखोल तपासणी, पोटाचे अवयव व रक्तवाहिन्यांचे उच्च-दर्जाचे रंगीत चित्रण.' : 'High-resolution fetal anomaly screening, abdominal ultrasounds, and peripheral vascular Doppler assessments.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ─── 1. HERO SECTION (30% Soothing Greenish-Sky Gradient) ───────────────── */}
      <section className="relative bg-gradient-to-br from-[#EBF7F0] via-[#E2F1F8] to-[#D5EBF8] pt-14 sm:pt-20 pb-24 sm:pb-32 border-b-3 border-emerald-600/20 overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Bold Highlighted Trust Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#002B5B] text-white text-xs sm:text-sm font-black shadow-xl border-2 border-emerald-400 tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-white font-black">{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#002B5B] tracking-tight leading-[1.12] font-heading">
                {t('hero.title')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-bold max-w-2xl">
                {t('hero.subtitle')}
              </p>

              {/* Primary Action CTAs */}
              <div className="flex flex-col sm:flex-row gap-5 pt-4 pb-2">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4.5 rounded-2xl bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#00875A] hover:from-[#003B73] hover:to-[#002B5B] text-white font-black shadow-2xl shadow-royal/40 hover:scale-105 transition-all text-base sm:text-lg border-2 border-emerald-400 tracking-wide"
                >
                  <Calendar className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span className="text-white font-black">{t('hero.bookCta')}</span>
                </Link>

                <a
                  href="tel:+917507342222"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black transition text-base sm:text-lg shadow-2xl border-2 border-rose-400 hover:scale-105"
                >
                  <Phone className="w-5 h-5 text-white shrink-0" />
                  <span className="text-white font-black">{t('hero.callEmergency')}</span>
                </a>
              </div>

            </div>

            {/* Right Visual Column (Hospital Photography) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F0FDF4] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"
                  alt="Sanjeevani Multispeciality Hospital Building Facade Jalna"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
                    Sanjeevani Multispeciality Hospital
                  </p>
                  <p className="text-xs text-slate-200 font-medium">
                    Plot 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── 4 STANDALONE 30% SATURATED METRIC CARDS ───────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
            
            {/* Card 1: 21-Bed ICU */}
            <div className="bg-gradient-to-br from-[#F4FBF7] to-[#EBF7F0] rounded-3xl p-6 border-2 border-[#86EFAC] shadow-lg flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#002B5B] text-emerald-300 flex items-center justify-center shrink-0 shadow-md">
                <Bed className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xl sm:text-2xl font-black text-[#002B5B] font-heading leading-tight">
                  {t('hero.statIcu')}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">
                  {t('hero.statIcuSub')}
                </div>
              </div>
            </div>

            {/* Card 2: 19+ Specialties */}
            <div className="bg-gradient-to-br from-[#F4FBF7] to-[#E6FFFA] rounded-3xl p-6 border-2 border-[#99F6E4] shadow-lg flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#007791] text-emerald-300 flex items-center justify-center shrink-0 shadow-md">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xl sm:text-2xl font-black text-[#002B5B] font-heading leading-tight">
                  {t('hero.statDepts')}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">
                  {t('hero.statDeptsSub')}
                </div>
              </div>
            </div>

            {/* Card 3: 10,000+ Surgeries */}
            <div className="bg-gradient-to-br from-[#F4FBF7] to-[#ECFDF5] rounded-3xl p-6 border-2 border-[#A7F3D0] shadow-lg flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#047857] text-emerald-200 flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xl sm:text-2xl font-black text-[#002B5B] font-heading leading-tight">
                  {t('hero.statSurgeries')}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">
                  {t('hero.statSurgeriesSub')}
                </div>
              </div>
            </div>

            {/* Card 4: 24x7 Casualty */}
            <div className="bg-gradient-to-br from-[#F4FBF7] to-[#FEF2F2] rounded-3xl p-6 border-2 border-[#FECACA] shadow-lg flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xl sm:text-2xl font-black text-[#DC2626] font-heading leading-tight">
                  {t('hero.statService')}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">
                  {t('hero.statServiceSub')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 2. QUICK ACTION TILES (SOOTHING 30% MINT SURFACES) ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          
          {/* Tile 1: Book OPD */}
          <Link
            to="/book"
            className="bg-gradient-to-br from-[#F4FBF7] to-[#EFF6FF] rounded-3xl p-7 border-2 border-[#93C5FD] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#002B5B] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <Calendar className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#002B5B] font-heading">{t('quickActions.book')}</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">{t('quickActions.bookDesc')}</p>
            </div>
            <span className="text-xs font-black text-[#002B5B] flex items-center gap-1.5">
              <span>{isMr ? 'वेळ निवडा' : 'Select Time Slot'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 2: 24x7 Emergency */}
          <a
            href="tel:+917507342222"
            className="bg-gradient-to-br from-[#F4FBF7] to-[#FEF2F2] rounded-3xl p-7 border-2 border-[#FECACA] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-rose-800 font-heading">{t('quickActions.emergency')}</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">{t('quickActions.emergencyDesc')}</p>
            </div>
            <span className="text-xs font-black text-rose-700 flex items-center gap-1.5">
              <span>+91-75073-42222</span>
              <Phone className="w-4 h-4" />
            </span>
          </a>

          {/* Tile 3: MJPJAY Scheme */}
          <Link
            to="/mjpjay"
            className="bg-gradient-to-br from-[#F4FBF7] to-[#ECFDF5] rounded-3xl p-7 border-2 border-[#86EFAC] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#047857] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-emerald-900 font-heading">{t('quickActions.mjpjay')}</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">{t('quickActions.mjpjayDesc')}</p>
            </div>
            <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              <span>{isMr ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 4: Cashless Insurance */}
          <Link
            to="/insurance"
            className="bg-gradient-to-br from-[#F4FBF7] to-[#F0FDFA] rounded-3xl p-7 border-2 border-[#99F6E4] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#007791] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <CreditCard className="w-7 h-7 text-cyan-200" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#004D61] font-heading">{t('quickActions.insurance')}</h3>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">{t('quickActions.insuranceDesc')}</p>
            </div>
            <span className="text-xs font-black text-[#007791] flex items-center gap-1.5">
              <span>{isMr ? 'विमा यादी पहा' : 'View Insurance Panels'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </section>

      {/* ─── 3. CLINICAL SPECIALTIES GRID ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-[#002B5B] tracking-tight font-heading">
            {t('sections.specialtiesHeading')}
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-bold">
            {t('sections.specialtiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {clinicalSpecialties.map((dept) => (
            <div
              key={dept.id}
              className="bg-gradient-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E3F1EB] rounded-3xl border-2 border-[#86EFAC] shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-200 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-[#001529]/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-black bg-[#002B5B] text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-400/60">
                    {dept.doctor}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <h3 className="text-2xl font-black text-[#002B5B] group-hover:text-emerald-800 transition-colors font-heading">
                    {isMr ? dept.titleMr : dept.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                    {isMr ? dept.descMr : dept.desc}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-emerald-200/80 flex items-center justify-between">
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="text-xs sm:text-sm font-black text-[#002B5B] hover:text-emerald-800 transition flex items-center gap-1"
                  >
                    <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/book"
                    className="px-5 py-2.5 rounded-xl bg-[#002B5B] text-white hover:bg-slate-900 font-black text-xs sm:text-sm transition shadow-md"
                  >
                    {t('common.bookSlot')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-[#002B5B] text-white font-black text-base hover:bg-slate-900 transition shadow-xl"
          >
            <span className="text-white font-black">{t('common.viewAll')}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>

      {/* ─── 4. MEDICAL TECHNOLOGY & REAL EQUIPMENT SHOWCASE ─────────────────────── */}
      <section className="bg-gradient-to-br from-[#002B5B] via-[#003B73] to-[#00875A] text-white py-24 sm:py-32 rounded-3xl shadow-2xl border-3 border-emerald-400/40 mx-4 sm:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
              {t('sections.technologyHeading')}
            </h2>
            <p className="text-base sm:text-lg text-slate-200 font-semibold">
              {t('sections.technologySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {hospitalEquipment.map((eq, idx) => (
              <div
                key={idx}
                className="bg-[#001529] rounded-3xl border-2 border-slate-700 overflow-hidden shadow-2xl flex flex-col group hover:border-emerald-400 transition-all"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={eq.image}
                    alt={eq.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#002B5B] text-emerald-300 text-xs font-black px-3 py-1 rounded-lg border border-emerald-400/50">
                    {eq.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-white leading-snug font-heading">{eq.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-semibold">{eq.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SENIOR MEDICAL FACULTY & DOCTOR DIRECTORY ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-[#002B5B] tracking-tight font-heading">
            {t('sections.doctorsHeading')}
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-bold">
            {t('sections.doctorsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seniorDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-gradient-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E3F1EB] rounded-3xl border-2 border-[#86EFAC] shadow-lg hover:shadow-2xl p-7 flex flex-col justify-between space-y-6 group transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-400 shadow-md">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
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

              <div className="space-y-2 text-xs sm:text-sm bg-[#F0FDF4] p-4 rounded-2xl border-2 border-[#86EFAC]">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-bold">{t('common.opdFee')}:</span>
                  <span className="font-black text-[#002B5B] text-base">₹{doc.fee}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-semibold">{t('common.timings')}:</span>
                  <span className="font-extrabold text-slate-900">{doc.timings}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="flex-1 py-3 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-black text-center transition border border-slate-300"
                >
                  {t('common.viewProfile')}
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}`}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#002B5B] to-[#00875A] text-white text-xs sm:text-sm font-black text-center hover:opacity-95 transition shadow-md"
                >
                  <span className="text-white font-black">{t('common.bookSlot')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. MJPJAY & CASHLESS SCHEMES SPOTLIGHT ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#00875A] rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-8 border-3 border-emerald-400">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Scheme Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-md border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-white font-black">१००% मोफत व कॅशलेस उपचार</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white font-heading">
                <span className="text-white drop-shadow-md">
                  {isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}
                </span>
                <br />
                <span className="text-emerald-300 drop-shadow-md font-black">
                  {isMr ? 'जन आरोग्य योजना (MJPJAY)' : 'Jan Arogya Yojana (MJPJAY)'}
                </span>
              </h2>
              
              <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
                {isMr
                  ? 'पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटलमध्ये मोफत शस्त्रक्रिया आणि प्रगत उपचार. आमच्या समर्पित आरोग्य मित्र डेस्कवरून त्वरित मदत मिळवा.'
                  : 'Providing completely cashless advanced surgical care and tertiary healthcare to eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital Jalna.'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/mjpjay"
                  className="px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm sm:text-base font-black transition shadow-lg border-2 border-emerald-300"
                >
                  <span className="text-white font-black">{isMr ? 'योजना प्रक्रिया व कागदपत्रे' : 'MJPJAY Process & Documents'}</span>
                </Link>
                <Link
                  to="/insurance"
                  className="px-7 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base font-black transition border-2 border-white/40"
                >
                  <span className="text-white font-black">{isMr ? 'कॅशलेस विमा कंपन्या' : 'Panel Insurance Companies'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: High-Contrast Document & Arogya Mitra Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#F4FBF7] to-[#EBF7F0] rounded-3xl p-7 sm:p-8 text-slate-900 shadow-2xl border-3 border-emerald-400 space-y-5">
              <div>
                <p className="font-black text-[#002B5B] text-lg uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required'}</span>
                </p>
                <p className="text-xs text-slate-700 font-bold mt-0.5">
                  {isMr ? 'प्रवेशाच्या वेळी सोबत आणावयाची कागदपत्रे:' : 'Please carry original documents during admission:'}
                </p>
              </div>

              <ul className="space-y-3 text-sm font-bold text-slate-800">
                <li className="flex items-center gap-3 p-2.5 rounded-xl bg-white border-2 border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{isMr ? 'पिवळे किंवा केशरी रेशन कार्ड (Original)' : 'Yellow or Orange Ration Card (Original)'}</span>
                </li>
                <li className="flex items-center gap-3 p-2.5 rounded-xl bg-white border-2 border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{isMr ? 'रुग्ण व कुटुंबप्रमुखांचे आधार कार्ड' : 'Patient & Family Head Aadhaar Card'}</span>
                </li>
                <li className="flex items-center gap-3 p-2.5 rounded-xl bg-white border-2 border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{isMr ? 'डॉक्टरांचे प्रिस्क्रिप्शन व तपासणी रिपोर्ट' : "Doctor's Prescription & Lab Reports"}</span>
                </li>
              </ul>

              {/* Dedicated High-Contrast Arogya Mitra Helpline Box */}
              <div className="p-4 rounded-2xl bg-[#002B5B] text-white border-2 border-emerald-400 shadow-md">
                <div className="text-xs font-bold text-emerald-300">
                  {isMr ? 'आरोग्य मित्र थेट सहाय्यता कक्ष:' : 'Arogya Mitra Direct Desk:'}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <a
                    href="tel:+917507342222"
                    className="text-base sm:text-lg font-black text-amber-300 hover:text-white transition flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>+91-75073-42222</span>
                  </a>
                  <span className="text-[11px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-lg">
                    24x7 Help
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. PATIENT TESTIMONIALS (REAL FEEDBACK & GOLD STARS) ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-[#002B5B] tracking-tight font-heading">
            {t('sections.reviewsHeading')}
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-bold">
            {t('sections.reviewsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Dr. Nishant Goyal operated on my mother’s complex knee fracture with immense precision. The post-operative ICU care and nursing staff was very attentive. MJPJAY cashless approval was completely hassle-free.',
              quoteMr: 'डॉ. निशांत गोयल यांनी माझ्या आईच्या गुडघ्याची शस्त्रक्रिया अतिशय यशस्वीरीत्या केली. अतिदक्षता विभागातील नर्सिंग स्टाफ खूप काळजीपूर्वक होता आणि महात्मा फुले योजनेतून सर्व उपचार मोफत झाले.',
              name: 'Sunil Jadhav',
              loc: 'Jalna City',
              locMr: 'जालना शहर',
              treatment: 'Total Knee Replacement',
              treatmentMr: 'गुडघे प्रत्यारोपण',
            },
            {
              quote: 'Dr. Shivdas Mirkad is wonderful with children. He explained our child’s respiratory condition patiently and clearly. The pediatric ward and warmers are modern and clean. Best pediatric care in Jalna.',
              quoteMr: 'डॉ. शिवदास मिरकड लहान मुलांसाठी अतिशय उत्तम डॉक्टर आहेत. त्यांनी माझ्या मुलीच्या दम्याचे निदान खूप समजावून सांगितले. बालरोग व नवजात शिशु विभाग खूप स्वच्छ व आधुनिक आहे.',
              name: 'Pooja Kulkarni',
              loc: 'Ambad Taluka',
              locMr: 'अंबड तालुका',
              treatment: 'Pediatric Care & Asthma',
              treatmentMr: 'बालरोग उपचार',
            },
            {
              quote: 'Prompt emergency response at 2 AM when my father had acute breathing distress. The 24x7 ICU facility and Dr. Bagal’s intensivist team saved his life. Transparent billing and supportive management.',
              quoteMr: 'मध्यरात्री २ वाजता वडिलांना श्वास घेण्यास त्रास होत असताना तातडीने ICU मध्ये दाखल केले. डॉ. बागल यांच्या अतिदक्षता टीमने वडिलांचे प्राण वाचवले. जालना परिसरातील सर्वात विश्वासार्ह हॉस्पिटल.',
              name: 'Anand Shinde',
              loc: 'Partur Taluka',
              locMr: 'परतूर तालुका',
              treatment: 'Emergency ICU Resuscitation',
              treatmentMr: 'अतिदक्षता जीवनरक्षक उपचार',
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E3F1EB] rounded-3xl border-2 border-[#86EFAC] p-8 shadow-lg hover:shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed italic font-medium">
                  "{isMr ? rev.quoteMr : rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t-2 border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#002B5B] text-white flex items-center justify-center font-bold text-sm border border-emerald-400">
                    <UserCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[#002B5B]">{rev.name}</p>
                    <p className="text-xs text-slate-600 font-bold">{isMr ? rev.locMr : rev.loc}</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-white text-[#002B5B] border border-emerald-300 shadow-sm">
                  {isMr ? rev.treatmentMr : rev.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. LOCATION & CASUALTY DIRECT CONTACT WITH LIVE INTERACTIVE GOOGLE MAP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-[#F4FBF7] via-[#EBF7F0] to-[#E3F1EB] rounded-3xl border-2 border-[#86EFAC] p-8 sm:p-14 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-[#002B5B] tracking-tight font-heading">
              {t('sections.locationHeading')}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
              {t('sections.locationSub')}
            </p>

            <div className="space-y-4 text-sm text-slate-800 font-medium">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-6 h-6 text-[#002B5B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-[#002B5B] text-base block">Sanjeevani Multispeciality Hospital</span>
                  <span className="text-slate-700">Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <span className="font-black text-rose-700">24x7 Emergency Casualty: </span>
                  <a href="tel:+917507342222" className="font-black text-slate-900 hover:underline">
                    +91-75073-42222 | 02482-223322
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Clock className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-black text-[#002B5B]">OPD Timings: </span>
                  <span>Mon–Sat: 09:00 AM – 03:00 PM & 05:00 PM – 08:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#00875A] text-white font-black text-base shadow-xl hover:scale-105 transition border-2 border-emerald-400"
              >
                <Calendar className="w-5 h-5 text-emerald-300" />
                <span className="text-white font-black">{t('hero.bookCta')}</span>
              </Link>

              <a
                href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-[#002B5B] text-[#002B5B] text-sm font-black hover:bg-slate-50 transition shadow-md"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>{isMr ? 'गुगल मॅप्सवर दिशा पहा' : 'Open in Google Maps'}</span>
              </a>
            </div>
          </div>

          {/* Interactive Live Google Map Frame */}
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#002B5B] font-heading">
                  {isMr ? 'अंबड चौफुली लँडमार्क व नकाशा' : 'Ambad Choufuli Landmark & Map'}
                </h3>
                <p className="text-xs text-slate-600 font-bold">
                  {isMr
                    ? 'रेल्वे स्टेशन (३.५ किमी) व मुख्य बस स्थानक (२.८ किमी)'
                    : 'Railway Station (3.5 km) & Central Bus Stand (2.8 km)'}
                </p>
              </div>
              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-300">
                Live Location
              </span>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-slate-200 relative shadow-inner">
              <iframe
                title="Sanjeevani Multispeciality Hospital Jalna Location Map"
                src="https://maps.google.com/maps?q=Sanjeevani+Multispeciality+Hospital+Jalna+Rishi+Park&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
