import React, { useEffect, useState } from 'react';
import { feeLabel } from '../lib/fee';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, ArrowRight, Star, MapPin } from 'lucide-react';
import { DOCTORS_DATA } from '../data/doctorsData';
import { AWARDS_DATA } from '../data/awardsData';
import { apiUrl } from '../lib/api';
import { PHOTOS } from '../data/photos';
import { Photo, DoctorPhoto } from '../components/ui';
import { HOSPITAL } from '../config/hospital';

interface HomeReview {
  id?: string;
  patientName: string;
  patientLocation?: string;
  rating: number;
  reviewText: string;
  treatmentType?: string;
}

// Shown only until approved reviews load from the hospital's records
const FALLBACK_REVIEWS: HomeReview[] = [
  {
    patientName: 'Gajanan Deshmukh',
    patientLocation: 'Jalna City',
    rating: 5,
    reviewText:
      'Dr. Nishant Goyal did my mother\'s knee replacement. She was walking without pain within four weeks. The ICU staff were very good and the cashless claim went through without trouble.',
    treatmentType: 'Knee replacement',
  },
  {
    patientName: 'Sunita Rathod',
    patientLocation: 'Ambad Taluka',
    rating: 5,
    reviewText:
      'Our baby was born early and spent two weeks in the NICU under Dr. Shivdas Mirkad. The nurses explained everything to us. The treatment was covered under MJPJAY.',
    treatmentType: 'NICU care',
  },
  {
    patientName: 'Pravin Kulkarni',
    patientLocation: 'Partur, Jalna',
    rating: 5,
    reviewText:
      'My father was brought in with severe breathing trouble at night. Dr. Baliram Bagal and the ICU team looked after him on the ventilator until he recovered. We are very grateful.',
    treatmentType: 'ICU care',
  },
];

const SectionHeading: React.FC<{ eyebrow?: string; title: string; sub?: string; action?: React.ReactNode }> = ({
  eyebrow,
  title,
  sub,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
    <div className="max-w-2xl">
      {eyebrow && <span className="eyebrow mb-2">{eyebrow}</span>}
      <h2 className="text-[1.75rem] sm:text-[2.125rem] leading-tight">{title}</h2>
      {sub && <p className="mt-2 text-stone-600">{sub}</p>}
    </div>
    {action}
  </div>
);

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const seniorDoctors = DOCTORS_DATA.slice(0, 6);
  const [reviews, setReviews] = useState<HomeReview[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    fetch(apiUrl('/reviews-events/reviews'))
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.data) && d.data.length > 0) {
          setReviews(d.data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

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
      image: PHOTOS.operationTheatre,
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
      image: PHOTOS.nicu,
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
      image: PHOTOS.cardiacUnit,
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
      image: PHOTOS.picu,
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
      image: PHOTOS.surgery,
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
      image: PHOTOS.casualty,
      slug: 'internal-medicine',
    },
  ];

  // Advanced Medical Equipment
  const hospitalEquipment = [
    {
      title: isMr ? 'डिजिटल सी-आर्म (C-Arm)' : 'Digital C-Arm Fluoroscopy',
      category: isMr ? 'शस्त्रक्रिया इमेजिंग' : 'Surgical Imaging',
      desc: isMr ? 'हाडे व मणक्याच्या अचूक शस्त्रक्रियेसाठी रिअल-टाइम एक्स-रे तंत्रज्ञान.' : 'Real-time intraoperative imaging for precision orthopedics, trauma, and spine surgery.',
      image: PHOTOS.operationTheatre,
    },
    {
      title: isMr ? 'HD लेप्रोस्कोपी टॉवर' : 'HD Laparoscopic Surgical Suite',
      category: isMr ? 'दुर्बिणीद्वारे शस्त्रक्रिया' : 'Minimally Invasive',
      desc: isMr ? 'सूक्ष्म व रक्तस्त्रावरहित दुर्बिणीद्वारे शस्त्रक्रियेची अत्याधुनिक सुविधा.' : 'High-definition endoscopic visualization for scarless, faster recovery surgeries.',
      image: PHOTOS.otTeam,
    },
    {
      title: isMr ? '२१ खाटांचा संगणकीकृत ICU' : '21-Bed Computerized ICU & Ventilators',
      category: isMr ? 'अतिदक्षता जीवनरक्षक' : 'Critical Life Support',
      desc: isMr ? 'मेकॅनिकल व्हेंटिलेटर्स, मल्टीपॅरा मॉनिटर्स व २४ तास तज्ज्ञ अतिदक्षतातज्ज्ञ.' : 'Equipped with Dräger mechanical ventilators, multipara telemetry, and round-the-clock intensivists.',
      image: PHOTOS.cardiacUnit,
    },
    {
      title: isMr ? '3D/4D कलर डॉपलर सोनोग्राफी' : '3D/4D Color Doppler Sonography',
      category: isMr ? 'अचूक रेडिओलॉजी निदान' : 'Radiology Diagnostics',
      desc: isMr ? 'गर्भावस्थेतील तपासणी व रक्तवाहिन्यांचे उच्च-दर्जाचे अचूक निदान.' : 'High-resolution fetal screening, abdominal scans, and vascular Doppler assessments.',
      image: PHOTOS.pathologyLab,
    },
  ];

  const helpRows = [
    { to: '/book', title: t('quickActions.book'), desc: t('quickActions.bookDesc') },
    { to: '/mjpjay', title: t('quickActions.mjpjay'), desc: t('quickActions.mjpjayDesc') },
    { to: '/insurance', title: t('quickActions.insurance'), desc: t('quickActions.insuranceDesc') },
    { to: '/doctors', title: isMr ? 'डॉक्टर शोधा' : 'Find a doctor', desc: isMr ? 'विभाग किंवा नावाने शोधा.' : 'Search by name or department.' },
  ];

  const facts = [
    { value: t('hero.statIcu'), label: t('hero.statIcuSub') },
    { value: t('hero.statDepts'), label: t('hero.statDeptsSub') },
    { value: t('hero.statSurgeries'), label: t('hero.statSurgeriesSub') },
    { value: t('hero.statService'), label: t('hero.statServiceSub') },
  ];

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#E7E3DA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <span className="eyebrow mb-4">{t('hero.badge')}</span>
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.5rem] leading-[1.08]">{t('hero.title')}</h1>
            <p className="mt-5 text-lg text-stone-600 leading-relaxed max-w-xl">{t('hero.subtitle')}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/book" className="btn-primary">
                {t('hero.bookCta')}
              </Link>
              <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="btn-secondary">
                <Phone className="w-4 h-4 text-[#C62828]" />
                {t('hero.callEmergency', { phone: isMr ? HOSPITAL.phones.emergency.shortMr : HOSPITAL.phones.emergency.short })}
              </a>
            </div>

            <p className="mt-6 text-sm text-stone-500">
              {isMr
                ? 'ओपीडी: सकाळी ९–१, संध्या. ५–८ · MJPJAY व कॅशलेस विमा स्वीकारला जातो'
                : 'OPD 9 am – 1 pm and 5 – 8 pm · MJPJAY and cashless insurance accepted'}
            </p>
          </div>

          <figure className="lg:col-span-6">
            <img
              src={PHOTOS.building}
              alt={isMr ? `${HOSPITAL.shortNameMr} इमारत, ${HOSPITAL.cityMr}` : `${HOSPITAL.shortName} building, ${HOSPITAL.city}`}
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
            <figcaption className="mt-2 text-xs text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {isMr ? HOSPITAL.address.shortMr : HOSPITAL.address.short}
            </figcaption>
          </figure>
        </div>

        {/* Facts */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-[#E7E3DA] pt-5 flex flex-col-reverse">
                <dt className="text-sm text-stone-500 mt-1">{f.label}</dt>
                <dd className="font-heading text-3xl text-[#1C2321]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How can we help */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h2 className="text-[1.75rem] sm:text-[2.125rem] leading-tight">{t('quickActions.heading')}</h2>
            <div className="mt-6 p-5 rounded-lg bg-[#FDF1F0] border border-[#F3D3CF]">
              <p className="font-semibold text-[#8E1C1C]">{t('quickActions.emergency')}</p>
              <p className="mt-1 text-sm text-[#6B2A2A]">{t('quickActions.emergencyDesc')}</p>
              <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="btn-emergency mt-4 w-full sm:w-auto">
                <Phone className="w-4 h-4" />
                {HOSPITAL.phones.emergency.display}
              </a>
            </div>
          </div>
          <ul className="lg:col-span-8 divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
            {helpRows.map((row) => (
              <li key={row.to}>
                <Link to={row.to} className="group flex items-center justify-between gap-6 py-5 hover:bg-white -mx-3 px-3 rounded">
                  <div>
                    <p className="text-lg font-semibold text-[#1C2321] group-hover:text-[#0F766E]">{row.title}</p>
                    <p className="text-stone-600 text-[15px]">{row.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-[#0F766E] shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Departments */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <SectionHeading
          title={t('sections.specialtiesHeading')}
          sub={t('sections.specialtiesSub')}
          action={
            <Link to="/departments" className="text-[#0F766E] font-semibold inline-flex items-center gap-1.5 min-h-[44px] hover:underline underline-offset-4 shrink-0">
              {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {clinicalSpecialties.map((dept) => (
            <Link key={dept.id} to={`/departments/${dept.slug}`} className="group block">
              <img
                src={dept.image}
                alt=""
                loading="lazy"
                className="w-full aspect-[3/2] object-cover rounded-lg bg-stone-100"
              />
              <h3 className="mt-4 text-xl group-hover:text-[#0F766E]">{isMr ? dept.titleMr : dept.title}</h3>
              <p className="mt-1 text-sm text-stone-500">
                {dept.doctor} · {dept.degree}
              </p>
              <p className="mt-2 text-[15px] text-stone-600 leading-relaxed">{isMr ? dept.descMr : dept.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="mt-16 sm:mt-24 bg-white border-y border-[#E7E3DA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <SectionHeading
            title={t('sections.doctorsHeading')}
            sub={t('sections.doctorsSub')}
            action={
              <Link to="/doctors" className="text-[#0F766E] font-semibold inline-flex items-center gap-1.5 min-h-[44px] hover:underline underline-offset-4 shrink-0">
                {isMr ? 'सर्व डॉक्टर' : 'All doctors'} <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 divide-y md:divide-y-0 divide-[#E7E3DA]">
            {seniorDoctors.map((doc) => (
              <li key={doc.id} className="py-5 md:border-b border-[#E7E3DA] flex gap-4">
                <DoctorPhoto src={doc.image} name={isMr ? doc.nameMr : doc.name} className="w-20 h-24 rounded-md shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link to={`/doctors/${doc.id}`} className="font-heading text-lg text-[#1C2321] hover:text-[#0F766E]">
                    {isMr ? doc.nameMr : doc.name}
                  </Link>
                  <p className="text-sm text-stone-600">{isMr ? doc.roleMr : doc.role}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{doc.degree}</p>
                  <p className="mt-2 text-sm text-stone-700">
                    {feeLabel(doc.fee, isMr)} · {isMr ? doc.timingsMr || doc.timings : doc.timings}
                  </p>
                  <Link to={`/book?doctorId=${doc.id}`} className="mt-1 inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0F766E] hover:underline underline-offset-4">
                    {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'} →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* MJPJAY */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <h2 className="text-[1.75rem] sm:text-[2.125rem] leading-tight">
              {isMr ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना' : 'Free treatment under MJPJAY'}
            </h2>
            <p className="mt-4 text-stone-600 leading-relaxed">
              {isMr
                ? `पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी ${HOSPITAL.shortNameMr}मध्ये मोफत शस्त्रक्रिया आणि उपचार. आमच्या आरोग्य मित्र कक्षात कागदपत्रे आणि मंजुरीसाठी मदत मिळते.`
                : `Families with a yellow or orange ration card can get operations and hospital treatment free of cost at ${HOSPITAL.brand}. Our Arogya Mitra desk helps with the paperwork and approval.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/mjpjay" className="btn-primary">
                {isMr ? 'योजनेची माहिती' : 'How it works'}
              </Link>
              <Link to="/insurance" className="btn-secondary">
                {isMr ? 'कॅशलेस विमा' : 'Cashless insurance'}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 card-clean p-6 sm:p-8">
            <h3 className="text-lg">{isMr ? 'सोबत आणा' : 'What to bring'}</h3>
            <ol className="mt-4 space-y-3 text-[15px] text-stone-700">
              {[
                isMr ? 'पिवळे किंवा केशरी रेशन कार्ड (मूळ)' : 'Yellow or orange ration card (original)',
                isMr ? 'रुग्ण व कुटुंबप्रमुखांचे आधार कार्ड' : 'Aadhaar card of the patient and head of family',
                isMr ? 'डॉक्टरांचे प्रिस्क्रिप्शन व तपासणी रिपोर्ट' : "Doctor's prescription and any test reports",
              ].map((doc, i) => (
                <li key={doc} className="flex gap-3">
                  <span className="font-heading text-[#0F766E] w-5 shrink-0">{i + 1}.</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 pt-4 border-t border-[#E7E3DA] text-sm text-stone-600">
              {isMr ? 'आरोग्य मित्र कक्ष:' : 'Arogya Mitra desk:'}{' '}
              <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] hover:underline">
                {HOSPITAL.phones.reception.display}
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 card-notice-amber text-sm">
          {isMr
            ? 'पात्रता व मोफत उपचार हे शासनाचे नियम आणि आरोग्य मित्र मंजुरीनुसार ठरतात.'
            : 'Eligibility and coverage depend on government scheme rules and approval through the Arogya Mitra desk.'}
        </p>
      </section>

      {/* Equipment */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <SectionHeading title={t('sections.technologyHeading')} sub={t('sections.technologySub')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalEquipment.map((eq) => (
            <div key={eq.title}>
              <Photo src={eq.image} className="w-full aspect-[4/3] rounded-lg" />
              <h3 className="mt-3 text-lg">{eq.title}</h3>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">{eq.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <SectionHeading
          title={isMr ? 'पुरस्कार व सन्मान' : 'Awards and recognition'}
          action={
            <Link to="/events" className="text-[#0F766E] font-semibold inline-flex items-center gap-1.5 min-h-[44px] hover:underline underline-offset-4 shrink-0">
              {isMr ? 'सर्व पुरस्कार' : 'All awards'} <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 border-t border-[#E7E3DA]">
          {AWARDS_DATA.slice(0, 4).map((award) => (
            <li key={award.id} className="pt-5 pb-2">
              <p className="font-heading text-2xl text-[#0F766E]">{award.year}</p>
              <h3 className="mt-2 text-base leading-snug">{isMr ? award.titleMr : award.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{isMr ? award.subtitleMr : award.subtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Reviews */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <SectionHeading
          title={t('sections.reviewsHeading')}
          action={
            <Link to="/events" className="text-[#0F766E] font-semibold inline-flex items-center gap-1.5 min-h-[44px] hover:underline underline-offset-4 shrink-0">
              {isMr ? 'सर्व अभिप्राय' : 'Read more reviews'} <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <figure key={rev.id || idx} className="card-clean p-6 flex flex-col">
              <div className="flex gap-0.5 text-[#C98A00]" aria-label={`${rev.rating} / 5`}>
                {[...Array(Math.max(0, Math.min(5, rev.rating || 0)))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] text-stone-700 leading-relaxed flex-1">“{rev.reviewText}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-[#1C2321]">{rev.patientName}</span>
                {rev.patientLocation && <span className="text-stone-500">, {rev.patientLocation}</span>}
                {rev.treatmentType && <span className="block text-stone-500">{rev.treatmentType}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[1.75rem] sm:text-[2.125rem] leading-tight">{t('sections.locationHeading')}</h2>
            <address className="not-italic mt-4 text-stone-700 leading-relaxed">
              {HOSPITAL.name}
              <br />
              {HOSPITAL.address.homeLines[0]}
              <br />
              {HOSPITAL.address.homeLines[1]}
            </address>
            <p className="mt-3 text-sm text-stone-500">
              {isMr ? 'जालना रेल्वे स्टेशनपासून सुमारे ३.५ किमी.' : 'About 3.5 km from Jalna railway station.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={HOSPITAL.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {isMr ? 'गुगल मॅपवर दिशा' : 'Get directions'}
              </a>
              <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-secondary">
                <Phone className="w-4 h-4" />
                {HOSPITAL.phones.reception.display}
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-lg overflow-hidden h-72 bg-stone-100 border border-[#E7E3DA]">
            <iframe
              title={`${HOSPITAL.shortName} ${HOSPITAL.city} Location`}
              src={HOSPITAL.mapEmbedUrl}
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
