import React, { useState } from 'react';
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
  Quote,
  Baby,
  Scissors,
  Eye,
  Microscope,
  Building2,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
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
      desc: 'Complex trauma care, total knee & hip replacement, arthroscopy, and spine stabilization with digital C-Arm support.',
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
      {/* ─── 1. HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-hospital-soft/90 via-slate-50 to-white pt-12 sm:pt-16 pb-20 sm:pb-28 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hospital-teal/10 border border-hospital-teal/20 text-hospital-teal text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-hospital-cyan" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-heading">
                {t('hero.title')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {t('hero.subtitle')}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-hospital-teal via-teal-700 to-hospital-teal text-white font-extrabold shadow-lg shadow-teal-900/20 hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base border border-teal-500/30"
                >
                  <Calendar className="w-5 h-5 text-emerald-300" />
                  <span>{t('hero.bookCta')}</span>
                </Link>

                <a
                  href="tel:+917507342222"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 transition text-sm sm:text-base shadow-sm"
                >
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>{t('hero.callEmergency')}</span>
                </a>
              </div>

              {/* 4 Pillars Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-hospital-teal">{t('hero.statIcu')}</div>
                  <div className="text-xs text-slate-500 font-medium">{t('hero.statIcuSub')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-hospital-teal">{t('hero.statDepts')}</div>
                  <div className="text-xs text-slate-500 font-medium">{t('hero.statDeptsSub')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-hospital-teal">{t('hero.statSurgeries')}</div>
                  <div className="text-xs text-slate-500 font-medium">{t('hero.statSurgeriesSub')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{t('hero.statService')}</div>
                  <div className="text-xs text-slate-500 font-medium">{t('hero.statServiceSub')}</div>
                </div>
              </div>
            </div>

            {/* Right Visual Column (Hospital Photography) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"
                  alt="Sanjeevani Multispeciality Hospital Building Facade Jalna"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Sanjeevani Multispeciality Hospital
                  </p>
                  <p className="text-xs text-slate-200">
                    Plot 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra
                  </p>
                </div>
              </div>

              {/* Floating Verified Accreditation Badges */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">MJPJAY Govt. Empanelled</p>
                  <p className="text-[11px] text-slate-500">Cashless Scheme Surgery</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-hospital-soft flex items-center justify-center text-hospital-teal">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">24x7 ICU & Casualty</p>
                  <p className="text-[11px] text-slate-500">On-Call Intensivists</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. QUICK ACTION TILES ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tile 1: Book OPD */}
          <Link
            to="/book"
            className="bg-white rounded-3xl p-7 border border-slate-200 shadow-card-subtle hover:shadow-card-hover hover:border-hospital-teal/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-hospital-soft text-hospital-teal flex items-center justify-center group-hover:bg-hospital-teal group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('quickActions.book')}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('quickActions.bookDesc')}</p>
            </div>
            <span className="text-xs font-bold text-hospital-teal flex items-center gap-1">
              <span>{isMr ? 'वेळ निवडा' : 'Select Time Slot'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 2: 24x7 Emergency */}
          <a
            href="tel:+917507342222"
            className="bg-white rounded-3xl p-7 border border-slate-200 shadow-card-subtle hover:shadow-card-hover hover:border-rose-300 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('quickActions.emergency')}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('quickActions.emergencyDesc')}</p>
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <span>+91-75073-42222</span>
              <Phone className="w-3.5 h-3.5" />
            </span>
          </a>

          {/* Tile 3: MJPJAY Scheme */}
          <Link
            to="/mjpjay"
            className="bg-white rounded-3xl p-7 border border-slate-200 shadow-card-subtle hover:shadow-card-hover hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('quickActions.mjpjay')}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('quickActions.mjpjayDesc')}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>{isMr ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 4: Cashless Insurance */}
          <Link
            to="/insurance"
            className="bg-white rounded-3xl p-7 border border-slate-200 shadow-card-subtle hover:shadow-card-hover hover:border-cyan-300 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-hospital-cyan flex items-center justify-center group-hover:bg-hospital-cyan group-hover:text-white transition-colors">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('quickActions.insurance')}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('quickActions.insuranceDesc')}</p>
            </div>
            <span className="text-xs font-bold text-hospital-cyan flex items-center gap-1">
              <span>{isMr ? 'विमा यादी पहा' : 'View Insurance Panels'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </section>

      {/* ─── 3. CLINICAL SPECIALTIES GRID ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-hospital-teal bg-hospital-soft px-3 py-1 rounded-full border border-hospital-teal/20">
            {isMr ? 'वैद्यकीय विभाग' : 'Clinical Specialties'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t('sections.specialtiesHeading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            {t('sections.specialtiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinicalSpecialties.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-card-subtle hover:shadow-card-hover overflow-hidden transition-all duration-200 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-bold bg-hospital-teal/90 backdrop-blur px-2.5 py-1 rounded-lg">
                      {dept.doctor}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-hospital-teal transition-colors">
                      {isMr ? dept.titleMr : dept.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isMr ? dept.descMr : dept.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/departments/${dept.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-hospital-teal transition flex items-center gap-1"
                    >
                      <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/book"
                      className="px-3.5 py-1.5 rounded-xl bg-hospital-soft text-hospital-teal hover:bg-hospital-teal hover:text-white font-bold text-xs transition shadow-sm"
                    >
                      {t('common.bookSlot')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── 4. MEDICAL TECHNOLOGY & REAL EQUIPMENT SHOWCASE ─────────────────────── */}
      <section className="bg-slate-900 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80">
              {isMr ? 'पायाभूत सुविधा व यंत्रसामग्री' : 'Hospital Technology & Equipment'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              {t('sections.technologyHeading')}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {t('sections.technologySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitalEquipment.map((eq, idx) => (
              <div
                key={idx}
                className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-xl flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={eq.image}
                    alt={eq.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-hospital-teal/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {eq.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{eq.title}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{eq.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SENIOR MEDICAL FACULTY & DOCTOR DIRECTORY ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-hospital-teal bg-hospital-soft px-3 py-1 rounded-full border border-hospital-teal/20">
            {isMr ? 'तज्ज्ञ डॉक्टर्स' : 'Experienced Medical Faculty'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t('sections.doctorsHeading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            {t('sections.doctorsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seniorDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-card-subtle hover:shadow-card-hover p-6 flex flex-col justify-between space-y-6 group transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-hospital-teal">
                    {isMr ? doc.roleMr : doc.role}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {doc.degree}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {isMr ? doc.deptMr : doc.dept}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('common.opdFee')}:</span>
                  <span className="font-bold text-slate-900">₹{doc.fee}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">{t('common.timings')}:</span>
                  <span className="font-medium text-slate-700">{doc.timings}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition"
                >
                  {t('common.viewProfile')}
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-hospital-teal text-white text-xs font-bold text-center hover:bg-hospital-teal/90 transition shadow-sm"
                >
                  {t('common.bookSlot')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. MJPJAY & CASHLESS SCHEMES SPOTLIGHT ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-hospital-teal via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government Scheme & Cashless Healthcare</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {isMr
                  ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)'
                  : 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {isMr
                  ? 'पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटलमध्ये मोफत शस्त्रक्रिया आणि प्रगत उपचार. आमच्या समर्पित आरोग्य मित्र डेस्कवरून त्वरित मदत मिळवा.'
                  : 'Providing completely cashless advanced surgical care and tertiary healthcare to eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital Jalna.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/mjpjay"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold transition shadow"
                >
                  {isMr ? 'योजना प्रक्रिया व कागदपत्रे' : 'MJPJAY Process & Documents'}
                </Link>
                <Link
                  to="/insurance"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition border border-white/20"
                >
                  {isMr ? 'कॅशलेस विमा कंपन्या' : 'Panel Insurance Companies'}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 space-y-3 text-xs">
              <p className="font-bold text-amber-300 uppercase tracking-wider">
                {isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required'}
              </p>
              <ul className="space-y-2 text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isMr ? 'पिवळे किंवा केशरी रेशन कार्ड' : 'Yellow or Orange Ration Card'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isMr ? 'रुग्ण व कुटुंबप्रमुखांचे आधार कार्ड' : 'Patient & Head Aadhaar Card'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isMr ? 'डॉक्टरांचे प्रिस्क्रिप्शन व तपासणी रिपोर्ट' : "Doctor Prescription & Reports"}</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                Arogya Mitra Helpline: <span className="font-bold text-white">+91-75073-42222</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. PATIENT TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-hospital-teal bg-hospital-soft px-3 py-1 rounded-full border border-hospital-teal/20">
            {isMr ? 'रुग्ण अभिप्राय' : 'Verified Reviews'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t('sections.reviewsHeading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
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
              treatment: 'Total Knee Replacement',
            },
            {
              quote: 'Dr. Shivdas Mirkad is wonderful with children. He explained our child’s respiratory condition patiently and clearly. The pediatric ward and warmers are modern and clean. Best pediatric care in Jalna.',
              quoteMr: 'डॉ. शिवदास मिरकड लहान मुलांसाठी अतिशय उत्तम डॉक्टर आहेत. त्यांनी माझ्या मुलीच्या दम्याचे निदान खूप समजावून सांगितले. बालरोग व नवजात शिशु विभाग खूप स्वच्छ व आधुनिक आहे.',
              name: 'Pooja Kulkarni',
              loc: 'Ambad Taluka',
              treatment: 'Pediatric Care & Asthma',
            },
            {
              quote: 'Prompt emergency response at 2 AM when my father had acute breathing distress. The 24x7 ICU facility and Dr. Bagal’s intensivist team saved his life. Transparent billing and supportive management.',
              quoteMr: 'मध्यरात्री २ वाजता वडिलांना श्वास घेण्यास त्रास होत असताना तातडीने ICU मध्ये दाखल केले. डॉ. बागल यांच्या अतिदक्षता टीमने वडिलांचे प्राण वाचवले. जालना परिसरातील सर्वात विश्वासार्ह हॉस्पिटल.',
              name: 'Anand Shinde',
              loc: 'Partur Taluka',
              treatment: 'Emergency ICU Resuscitation',
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card-subtle flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{isMr ? rev.quoteMr : rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{rev.name}</p>
                  <p className="text-xs text-slate-400">{rev.loc}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-hospital-teal">
                  {rev.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. LOCATION & CASUALTY DIRECT CONTACT ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card-subtle grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-hospital-teal bg-hospital-soft px-3 py-1 rounded-full border border-hospital-teal/20">
              {isMr ? 'संपर्क व मार्ग' : 'Visit & Contact'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              {t('sections.locationHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('sections.locationSub')}
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-hospital-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Sanjeevani Multispeciality Hospital</span>
                  <span>Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-rose-700">24x7 Emergency Casualty: </span>
                  <a href="tel:+917507342222" className="font-extrabold text-slate-900 hover:underline">
                    +91-75073-42222 | 02482-223322
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">OPD Timings: </span>
                  <span>Mon–Sat: 09:00 AM – 03:00 PM & 05:00 PM – 08:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-hospital-teal text-white font-extrabold text-sm shadow hover:bg-hospital-teal/90 transition"
              >
                <Calendar className="w-4 h-4 text-emerald-300" />
                <span>{t('hero.bookCta')}</span>
              </Link>
            </div>
          </div>

          {/* Location Map View / Directions Tile */}
          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-4 flex flex-col justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-hospital-soft text-hospital-teal flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ambad Choufuli Landmark</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Easily accessible from Jalna Railway Station (3.5 km) and Jalna Central Bus Stand (2.8 km).
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition shadow-sm mx-auto"
            >
              <span>{isMr ? 'गुगल मॅप्सवर दिशा पहा' : 'Open in Google Maps'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
