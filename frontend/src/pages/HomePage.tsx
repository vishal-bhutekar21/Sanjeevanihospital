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
    <div className="space-y-16 sm:space-y-24">
      {/* ─── 1. HERO SECTION ("The Breathable Interface") ───────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#F8F9FF] via-[#EFF4FF] to-[#EBF7F0]/40 pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#D3E4FE] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF7F0] text-[#006C47] text-xs sm:text-sm font-semibold border border-[#8AF5BE] tracking-wide">
                <Sparkles className="w-4 h-4 text-[#00875A] shrink-0" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-bold text-[#001736] tracking-tight leading-[1.16] font-heading">
                {t('hero.title')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#43474F] leading-relaxed font-normal max-w-2xl">
                {t('hero.subtitle')}
              </p>

              {/* Primary Action CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3 pb-1">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#00875A] hover:bg-[#006C47] text-white font-semibold shadow-[0_4px_16px_rgba(0,135,90,0.25)] hover:shadow-[0_6px_20px_rgba(0,108,71,0.35)] transition-all text-base"
                >
                  <Calendar className="w-5 h-5 text-white shrink-0" />
                  <span>{t('hero.bookCta')}</span>
                </Link>

                <a
                  href="tel:+917507342222"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold transition text-base shadow-[0_4px_16px_rgba(220,38,38,0.25)]"
                >
                  <Phone className="w-5 h-5 text-white shrink-0" />
                  <span>{t('hero.callEmergency')}</span>
                </a>
              </div>

            </div>

            {/* Right Visual Column (Hospital Photography) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-vitality-card border border-[#D3E4FE] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"
                  alt="Sanjeevani Multispeciality Hospital Building Facade Jalna"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001736]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8AF5BE]">
                    Sanjeevani Multispeciality Hospital
                  </p>
                  <p className="text-xs text-slate-200">
                    Plot 17, Rishi Park, Ambad Choufuli, Jalna, Maharashtra
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── 4 STANDALONE METRIC CARDS ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-12">
            
            {/* Card 1: 21-Bed ICU */}
            <div className="vitality-card p-5.5 rounded-xl flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#002B5B] text-[#8AF5BE] flex items-center justify-center shrink-0 shadow-sm">
                <Bed className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-[#001736] font-heading leading-tight">
                  {t('hero.statIcu')}
                </div>
                <div className="text-xs text-[#43474F] font-medium leading-snug">
                  {t('hero.statIcuSub')}
                </div>
              </div>
            </div>

            {/* Card 2: 19+ Specialties */}
            <div className="vitality-card p-5.5 rounded-xl flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#00875A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-[#001736] font-heading leading-tight">
                  {t('hero.statDepts')}
                </div>
                <div className="text-xs text-[#43474F] font-medium leading-snug">
                  {t('hero.statDeptsSub')}
                </div>
              </div>
            </div>

            {/* Card 3: 10,000+ Surgeries */}
            <div className="vitality-card p-5.5 rounded-xl flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#006C47] text-[#8AF5BE] flex items-center justify-center shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-[#001736] font-heading leading-tight">
                  {t('hero.statSurgeries')}
                </div>
                <div className="text-xs text-[#43474F] font-medium leading-snug">
                  {t('hero.statSurgeriesSub')}
                </div>
              </div>
            </div>

            {/* Card 4: 24x7 Casualty */}
            <div className="vitality-card p-5.5 rounded-xl flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-[#DC2626] font-heading leading-tight">
                  {t('hero.statService')}
                </div>
                <div className="text-xs text-[#43474F] font-medium leading-snug">
                  {t('hero.statServiceSub')}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 2. QUICK ACTION TILES ────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tile 1: Book OPD */}
          <Link
            to="/book"
            className="vitality-card p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#002B5B] text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-[#8AF5BE]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#001736] font-heading">{t('quickActions.book')}</h3>
              <p className="text-xs text-[#43474F] leading-relaxed">{t('quickActions.bookDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#00875A] flex items-center gap-1">
              <span>{isMr ? 'वेळ निवडा' : 'Select Time Slot'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 2: 24x7 Emergency */}
          <a
            href="tel:+917507342222"
            className="vitality-card p-6 flex flex-col justify-between space-y-4 border-rose-200 group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shadow-sm">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#DC2626] font-heading">{t('quickActions.emergency')}</h3>
              <p className="text-xs text-[#43474F] leading-relaxed">{t('quickActions.emergencyDesc')}</p>
            </div>
            <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1">
              <span>+91-75073-42222</span>
              <Phone className="w-3.5 h-3.5" />
            </span>
          </a>

          {/* Tile 3: MJPJAY Scheme */}
          <Link
            to="/mjpjay"
            className="vitality-card p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#006C47] text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#8AF5BE]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#001736] font-heading">{t('quickActions.mjpjay')}</h3>
              <p className="text-xs text-[#43474F] leading-relaxed">{t('quickActions.mjpjayDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#00875A] flex items-center gap-1">
              <span>{isMr ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Tile 4: Cashless Insurance */}
          <Link
            to="/insurance"
            className="vitality-card p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#007791] text-white flex items-center justify-center shadow-sm">
              <CreditCard className="w-6 h-6 text-cyan-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#001736] font-heading">{t('quickActions.insurance')}</h3>
              <p className="text-xs text-[#43474F] leading-relaxed">{t('quickActions.insuranceDesc')}</p>
            </div>
            <span className="text-xs font-semibold text-[#007791] flex items-center gap-1">
              <span>{isMr ? 'विमा यादी पहा' : 'View Insurance Panels'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </section>

      {/* ─── 3. CLINICAL SPECIALTIES GRID ────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#001736] tracking-tight font-heading">
            {t('sections.specialtiesHeading')}
          </h2>
          <p className="text-sm sm:text-base text-[#43474F]">
            {t('sections.specialtiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {clinicalSpecialties.map((dept) => (
            <div
              key={dept.id}
              className="vitality-card overflow-hidden flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001736]/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold bg-[#001736] text-[#8AF5BE] px-3 py-1 rounded-full border border-white/20">
                    {dept.doctor}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#001736] group-hover:text-[#00875A] transition-colors font-heading">
                    {isMr ? dept.titleMr : dept.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#43474F] leading-relaxed">
                    {isMr ? dept.descMr : dept.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFF4FF] flex items-center justify-between">
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="text-xs font-semibold text-[#002B5B] hover:text-[#00875A] transition flex items-center gap-1"
                  >
                    <span>{isMr ? 'तपशील पहा' : 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/book"
                    className="px-4 py-2 rounded-lg bg-[#00875A] text-white hover:bg-[#006C47] font-semibold text-xs transition shadow-sm"
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#002B5B] hover:bg-[#001736] text-white font-semibold text-sm transition shadow-md"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── 4. MEDICAL TECHNOLOGY & EQUIPMENT SHOWCASE ─────────────────────────── */}
      <section className="bg-gradient-to-br from-[#001736] via-[#002B5B] to-[#0B1C30] text-white py-16 sm:py-24 rounded-2xl shadow-xl border border-[#D3E4FE]/20 mx-4 sm:mx-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-heading">
              {t('sections.technologyHeading')}
            </h2>
            <p className="text-sm sm:text-base text-[#DCE9FF]">
              {t('sections.technologySub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitalEquipment.map((eq, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 overflow-hidden shadow-lg flex flex-col group hover:border-[#8AF5BE] transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={eq.image}
                    alt={eq.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#001736] text-[#8AF5BE] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#8AF5BE]/40">
                    {eq.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="text-base font-bold text-white leading-snug font-heading">{eq.title}</h3>
                  <p className="text-xs text-[#DCE9FF] leading-relaxed">{eq.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SENIOR MEDICAL FACULTY ─────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#001736] tracking-tight font-heading">
            {t('sections.doctorsHeading')}
          </h2>
          <p className="text-sm sm:text-base text-[#43474F]">
            {t('sections.doctorsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {seniorDoctors.map((doc) => (
            <div
              key={doc.id}
              className="vitality-card p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#D3E4FE] shadow-sm">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#001736] truncate font-heading">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#00875A]">
                    {isMr ? doc.roleMr : doc.role}
                  </p>
                  <p className="text-xs text-[#43474F]">
                    {doc.degree}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {isMr ? doc.deptMr : doc.dept}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs bg-[#EFF4FF] p-3.5 rounded-lg border border-[#D3E4FE]">
                <div className="flex justify-between items-center">
                  <span className="text-[#43474F] font-medium">{t('common.opdFee')}:</span>
                  <span className="font-bold text-[#001736] text-sm">₹{doc.fee}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#43474F]">{t('common.timings')}:</span>
                  <span className="font-medium text-[#0B1C30]">{doc.timings}</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#F8F9FF] hover:bg-[#EFF4FF] text-[#001736] text-xs font-semibold text-center transition border border-[#D3E4FE]"
                >
                  {t('common.viewProfile')}
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}`}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#00875A] hover:bg-[#006C47] text-white text-xs font-semibold text-center transition shadow-sm"
                >
                  <span>{t('common.bookSlot')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. MJPJAY SCHEME SPOTLIGHT ─────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#001736] via-[#002B5B] to-[#006C47] rounded-2xl p-7 sm:p-12 text-white shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00875A] text-white font-semibold text-xs shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#8AF5BE]" />
                <span>१००% मोफत व कॅशलेस उपचार</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white font-heading">
                <span>{isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}</span>
                <br />
                <span className="text-[#8AF5BE]">
                  {isMr ? 'जन आरोग्य योजना (MJPJAY)' : 'Jan Arogya Yojana (MJPJAY)'}
                </span>
              </h2>
              
              <p className="text-sm sm:text-base text-[#DCE9FF] leading-relaxed">
                {isMr
                  ? 'पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटलमध्ये मोफत शस्त्रक्रिया आणि प्रगत उपचार. आमच्या समर्पित आरोग्य मित्र डेस्कवरून त्वरित मदत मिळवा.'
                  : 'Providing completely cashless advanced surgical care and tertiary healthcare to eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital Jalna.'}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/mjpjay"
                  className="px-6 py-3 rounded-lg bg-[#00875A] hover:bg-[#006C47] text-white text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                  <span>{isMr ? 'योजना प्रक्रिया व कागदपत्रे' : 'MJPJAY Process & Documents'}</span>
                </Link>
                <Link
                  to="/insurance"
                  className="px-6 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition border border-white/30"
                >
                  <span>{isMr ? 'कॅशलेस विमा कंपन्या' : 'Panel Insurance Companies'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Document Checklist Card */}
            <div className="lg:col-span-5 bg-white rounded-xl p-6 text-[#0B1C30] shadow-lg border border-[#8AF5BE] space-y-4">
              <div>
                <p className="font-bold text-[#001736] text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00875A]" />
                  <span>{isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required'}</span>
                </p>
                <p className="text-xs text-[#43474F] mt-0.5">
                  {isMr ? 'प्रवेशाच्या वेळी सोबत आणावयाची कागदपत्रे:' : 'Please carry original documents during admission:'}
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#0B1C30]">
                <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F9FF] border border-[#D3E4FE]">
                  <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'पिवळे किंवा केशरी रेशन कार्ड (Original)' : 'Yellow or Orange Ration Card (Original)'}</span>
                </li>
                <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F9FF] border border-[#D3E4FE]">
                  <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'रुग्ण व कुटुंबप्रमुखांचे आधार कार्ड' : 'Patient & Family Head Aadhaar Card'}</span>
                </li>
                <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F9FF] border border-[#D3E4FE]">
                  <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0" />
                  <span>{isMr ? 'डॉक्टरांचे प्रिस्क्रिप्शन व तपासणी रिपोर्ट' : "Doctor's Prescription & Lab Reports"}</span>
                </li>
              </ul>

              {/* Arogya Mitra Helpline */}
              <div className="p-3.5 rounded-lg bg-[#001736] text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8AF5BE] font-semibold">
                    {isMr ? 'आरोग्य मित्र कक्ष' : 'Arogya Mitra Desk'}
                  </div>
                  <a
                    href="tel:+917507342222"
                    className="text-sm font-bold text-white hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8AF5BE]" />
                    <span>+91-75073-42222</span>
                  </a>
                </div>
                <span className="text-[10px] font-semibold bg-[#00875A] text-white px-2 py-1 rounded">
                  24x7
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. PATIENT TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#001736] tracking-tight font-heading">
            {t('sections.reviewsHeading')}
          </h2>
          <p className="text-sm sm:text-base text-[#43474F]">
            {t('sections.reviewsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="vitality-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold bg-[#EBF7F0] text-[#006C47] px-2.5 py-0.5 rounded-full border border-[#8AF5BE]">
                    {rev.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#43474F] italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFF4FF] flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#001736]">{rev.name}</p>
                  <p className="text-[11px] text-slate-500">{rev.location}</p>
                </div>
                <span className="text-[11px] font-medium text-[#00875A]">{rev.treatment}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#002B5B] hover:text-[#00875A] transition"
          >
            <span>{isMr ? 'सर्व रुग्ण अभिप्राय व शिबिरे पहा' : 'View All Patient Reviews & Health Camps'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── 8. HOSPITAL LOCATION & REACH ──────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="vitality-card p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF4FF] text-[#002B5B] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#00875A]" />
              <span>{isMr ? 'हॉस्पिटल पत्ता व मार्ग' : 'Location & Directions'}</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-bold text-[#001736] font-heading">
              {isMr ? 'संजीवनी हॉस्पिटल, जालना' : 'Sanjeevani Multispeciality Hospital'}
            </h3>

            <p className="text-xs sm:text-sm text-[#43474F] leading-relaxed">
              Plot No. 17, Rishi Park, Ambad Road / Ambad Choufuli, Jalna, Maharashtra – 431203.<br />
              <span className="text-xs text-slate-500 font-medium">Landmark: Ambad Choufuli Junction • 3.5 km from Jalna Railway Station.</span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://maps.google.com/?q=Sanjeevani+Multispeciality+Hospital+Jalna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#002B5B] hover:bg-[#001736] text-white text-xs font-semibold transition shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-[#8AF5BE]" />
                <span>{isMr ? 'गुगल मॅपवर दिशा' : 'Google Maps Directions'}</span>
              </a>

              <a
                href="tel:+917507342222"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91-75073-42222</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-[#D3E4FE] shadow-sm h-64 sm:h-72">
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
