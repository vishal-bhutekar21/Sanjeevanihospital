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
  Navigation,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  // 6 Major Clinical Departments
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

  // Senior Faculty Doctors
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

  // Advanced Medical Equipment
  const hospitalEquipment = [
    {
      title: isMr ? 'डिजिटल सी-आर्म (C-Arm)' : 'Digital C-Arm Fluoroscopy',
      category: isMr ? 'शस्त्रक्रिया इमेजिंग' : 'Surgical Imaging',
      desc: isMr ? 'हाडे व मणक्याच्या अचूक शस्त्रक्रियेसाठी रिअल-टाइम एक्स-रे तंत्रज्ञान.' : 'Real-time intraoperative imaging for precision orthopedics, trauma, and spine surgery.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? 'HD लेप्रोस्कोपी टॉवर' : 'HD Laparoscopic Surgical Suite',
      category: isMr ? 'दुर्बिणीद्वारे शस्त्रक्रिया' : 'Minimally Invasive',
      desc: isMr ? 'सूक्ष्म व रक्तस्त्रावरहित दुर्बिणीद्वारे शस्त्रक्रियेची अत्याधुनिक सुविधा.' : 'High-definition endoscopic visualization for scarless, faster recovery surgeries.',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? '२१ खाटांचा संगणकीकृत ICU' : '21-Bed Computerized ICU & Ventilators',
      category: isMr ? 'अतिदक्षता जीवनरक्षक' : 'Critical Life Support',
      desc: isMr ? 'मेकॅनिकल व्हेंटिलेटर्स, मल्टीपॅरा मॉनिटर्स व २४ तास तज्ज्ञ अतिदक्षतातज्ज्ञ.' : 'Equipped with Dräger mechanical ventilators, multipara telemetry, and round-the-clock intensivists.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isMr ? '3D/4D कलर डॉपलर सोनोग्राफी' : '3D/4D Color Doppler Sonography',
      category: isMr ? 'अचूक रेडिओलॉजी निदान' : 'Radiology Diagnostics',
      desc: isMr ? 'गर्भावस्थेतील तपासणी व रक्तवाहिन्यांचे उच्च-दर्जाचे अचूक निदान.' : 'High-resolution fetal screening, abdominal scans, and vascular Doppler assessments.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="pt-6 sm:pt-12 pb-12 sm:pb-16 border-b border-slate-200/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Subtle Trust Badge */}
              <div className="badge-teal">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Page Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.18] font-heading">
                {t('hero.title')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/book"
                  className="btn-primary"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('hero.bookCta')}</span>
                </Link>

                <a
                  href="tel:+917507342222"
                  className="btn-secondary text-slate-800"
                >
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>{t('hero.callEmergency')}</span>
                </a>
              </div>

            </div>

            {/* Right Column: Hospital Media */}
            <div className="lg:col-span-5">
              <div className="card-clean overflow-hidden aspect-[16/11] relative">
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"
                  alt="Sanjeevani Multispeciality Hospital Jalna"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-teal-300">
                    Sanjeevani Multispeciality Hospital
                  </p>
                  <p className="text-xs text-slate-200">
                    Plot 17, Rishi Park, Ambad Choufuli, Jalna
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── 4 BORDERLESS METRIC CARDS ─────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10 sm:pt-14">
            
            <div className="card-clean p-5 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {t('hero.statIcu')}
                </div>
                <div className="text-xs text-slate-500 font-medium truncate">
                  {t('hero.statIcuSub')}
                </div>
              </div>
            </div>

            <div className="card-clean p-5 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {t('hero.statDepts')}
                </div>
                <div className="text-xs text-slate-500 font-medium truncate">
                  {t('hero.statDeptsSub')}
                </div>
              </div>
            </div>

            <div className="card-clean p-5 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {t('hero.statSurgeries')}
                </div>
                <div className="text-xs text-slate-500 font-medium truncate">
                  {t('hero.statSurgeriesSub')}
                </div>
              </div>
            </div>

            <div className="card-clean p-5 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-red-600 font-heading">
                  {t('hero.statService')}
                </div>
                <div className="text-xs text-slate-500 font-medium truncate">
                  {t('hero.statServiceSub')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 2. QUICK ACTION TILES ────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <Link
            to="/book"
            className="card-clean p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 font-heading">{t('quickActions.book')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('quickActions.bookDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#0F766E] flex items-center gap-1">
              <span>{isMr ? 'वेळ निवडा' : 'Select Time Slot'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <a
            href="tel:+917507342222"
            className="card-clean p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 font-heading">{t('quickActions.emergency')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('quickActions.emergencyDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
              <span>+91-75073-42222</span>
              <Phone className="w-3.5 h-3.5" />
            </span>
          </a>

          <Link
            to="/mjpjay"
            className="card-clean p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 font-heading">{t('quickActions.mjpjay')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('quickActions.mjpjayDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#0F766E] flex items-center gap-1">
              <span>{isMr ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/insurance"
            className="card-clean p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 font-heading">{t('quickActions.insurance')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('quickActions.insuranceDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#0F766E] flex items-center gap-1">
              <span>{isMr ? 'विमा यादी पहा' : 'View Insurance Panels'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </section>

      {/* ─── 3. CLINICAL SPECIALTIES GRID ────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('sections.specialtiesHeading')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('sections.specialtiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicalSpecialties.map((dept) => (
            <div
              key={dept.id}
              className="card-clean overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-medium bg-slate-900/80 backdrop-blur-sm text-teal-300 px-2.5 py-1 rounded-md">
                    {dept.doctor}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors font-heading">
                    {isMr ? dept.titleMr : dept.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isMr ? dept.descMr : dept.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
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
            className="btn-secondary text-xs"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ─── 4. MEDICAL TECHNOLOGY & EQUIPMENT SHOWCASE ─────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('sections.technologyHeading')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('sections.technologySub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hospitalEquipment.map((eq, idx) => (
            <div
              key={idx}
              className="card-clean overflow-hidden flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={eq.image}
                  alt={eq.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-teal-300 text-[11px] font-medium px-2 py-0.5 rounded">
                  {eq.category}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 leading-snug font-heading">{eq.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{eq.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. SENIOR MEDICAL FACULTY ─────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('sections.doctorsHeading')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('sections.doctorsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seniorDoctors.map((doc) => (
            <div
              key={doc.id}
              className="card-clean p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate font-heading">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs font-medium text-[#0F766E]">
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

              <div className="space-y-1 text-xs bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{t('common.opdFee')}:</span>
                  <span className="font-semibold text-slate-900">₹{doc.fee}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">{t('common.timings')}:</span>
                  <span className="font-medium text-slate-700">{doc.timings}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="btn-secondary text-xs flex-1 min-h-[38px] py-1.5"
                >
                  {t('common.viewProfile')}
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}`}
                  className="btn-primary text-xs flex-1 min-h-[38px] py-1.5"
                >
                  <span>{t('common.bookSlot')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. MJPJAY SCHEME SPOTLIGHT (CLEAN HEALTHCARE STYLING) ───────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 border border-teal-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>{isMr ? '१००% मोफत व कॅशलेस उपचार' : '100% Cashless Govt. Scheme'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-heading">
                <span>{isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}</span>
                <br />
                <span className="text-[#0F766E]">
                  {isMr ? 'जन आरोग्य योजना (MJPJAY)' : 'Jan Arogya Yojana (MJPJAY)'}
                </span>
              </h2>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {isMr
                  ? 'पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटलमध्ये मोफत शस्त्रक्रिया आणि प्रगत उपचार. आमच्या समर्पित आरोग्य मित्र डेस्कवरून त्वरित मदत मिळवा.'
                  : 'Cashless surgical care and tertiary hospitalization for eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital, Jalna.'}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/mjpjay"
                  className="btn-primary text-xs py-2 px-4 shadow-xs"
                >
                  <span>{isMr ? 'योजना प्रक्रिया व कागदपत्रे' : 'MJPJAY Process & Documents'}</span>
                </Link>
                <Link
                  to="/insurance"
                  className="btn-secondary text-xs py-2 px-4"
                >
                  <span>{isMr ? 'कॅशलेस विमा कंपन्या' : 'Insurance Panels'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Document Checklist Card */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-teal-200 shadow-xs space-y-3">
              <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                <span>{isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required'}</span>
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{isMr ? 'पिवळे किंवा केशरी रेशन कार्ड (Original)' : 'Yellow or Orange Ration Card (Original)'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{isMr ? 'रुग्ण व कुटुंबप्रमुखांचे आधार कार्ड' : 'Patient & Family Head Aadhaar Card'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{isMr ? 'डॉक्टरांचे प्रिस्क्रिप्शन व तपासणी रिपोर्ट' : "Doctor's Prescription & Reports"}</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">{isMr ? 'आरोग्य मित्र कक्ष:' : 'Arogya Mitra Helpline:'}</span>
                  <a href="tel:+917507342222" className="text-slate-900 font-bold hover:underline">
                    +91-75073-42222
                  </a>
                </div>
                <span className="badge-teal text-[11px]">24x7 Help</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. PATIENT TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('sections.reviewsHeading')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('sections.reviewsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              name: 'Gajanan Deshmukh',
              location: 'Jalna City',
              rating: 5,
              text: 'Dr. Nishant Goyal performed total knee replacement surgery on my mother. She is walking without pain within 4 weeks. Exceptional ICU staff and cashless mediclaim support.',
              treatment: 'Knee Arthroplasty',
              badge: 'Verified Patient',
            },
            {
              name: 'Sunita Rathod',
              location: 'Ambad Taluka',
              rating: 5,
              text: 'Dr. Shivdas Mirkad treated our premature baby in the NICU. The radiant warmers and pediatric nursing care are outstanding. Completely free under MJPJAY scheme.',
              treatment: 'Neonatal NICU Care',
              badge: 'MJPJAY Beneficiary',
            },
            {
              name: 'Pravin Kulkarni',
              location: 'Partur, Jalna',
              rating: 5,
              text: 'Admitted my father with acute respiratory distress in ICU. Dr. Baliram Bagal managed his mechanical ventilation with precision. Truly grateful for 24x7 intensivist care.',
              treatment: 'Critical Care (ICU)',
              badge: 'Verified Patient',
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="card-clean p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="badge-teal text-[10px] py-0.5">
                    {rev.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900">{rev.name}</p>
                  <p className="text-[11px] text-slate-400">{rev.location}</p>
                </div>
                <span className="text-[11px] font-medium text-[#0F766E]">{rev.treatment}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0F766E] transition"
          >
            <span>{isMr ? 'सर्व रुग्ण अभिप्राय व शिबिरे पहा' : 'View All Patient Reviews & Health Camps'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ─── 8. LOCATION & DIRECTIONS ─────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="card-clean p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="badge-slate">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isMr ? 'हॉस्पिटल पत्ता व मार्ग' : 'Location & Directions'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'संजीवनी हॉस्पिटल, जालना' : 'Sanjeevani Multispeciality Hospital'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203.<br />
              <span className="text-xs text-slate-400">Landmark: Ambad Choufuli Junction • 3.5 km from Jalna Railway Station.</span>
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{isMr ? 'गुगल मॅपवर दिशा' : 'Google Maps'}</span>
              </a>

              <a
                href="tel:+917507342222"
                className="btn-emergency text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91-75073-42222</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-lg overflow-hidden h-60 sm:h-64 bg-slate-100">
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
      </section>

    </div>
  );
};
