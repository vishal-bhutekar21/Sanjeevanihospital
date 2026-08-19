import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Phone,
  AlertCircle,
  ShieldCheck,
  Award,
  Stethoscope,
  Activity,
  HeartPulse,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const clinicalSpecialties = [
    {
      title: 'Orthopedics & Joint Replacement',
      titleMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      doctors: 'Dr. Nishant Goyal (MBBS, DNB, D.Ortho)',
      desc: 'Complex trauma care, total knee & hip replacement, arthroscopy, and spine stabilization.',
      icon: Activity,
      slug: 'orthopedics',
    },
    {
      title: 'Pediatrics & Neonatology',
      titleMr: 'बालरोग आणि नवजात शिशु काळजी',
      doctors: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      desc: 'Comprehensive child healthcare, neonatal intensive care, pediatric emergency, and vaccination.',
      icon: Stethoscope,
      slug: 'pediatrics',
    },
    {
      title: 'Critical Care & Anesthesiology',
      titleMr: 'अतिदक्षता आणि भूलशास्त्र',
      doctors: 'Dr. Baliram Bagal (MBBS, DA, FICM, CCCS)',
      desc: '24x7 Multi-bed ICU, mechanical ventilation, invasive monitoring, and sepsis management.',
      icon: HeartPulse,
      slug: 'icu-critical-care',
    },
    {
      title: 'Obstetrics & Gynecology',
      titleMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      doctors: 'Dr. Anshul (Pahawa) Goyal (MBBS, DNB, DGO)',
      desc: 'High-risk maternity care, painless normal deliveries, cesarean care, and laparoscopy.',
      icon: Award,
      slug: 'obstetrics-gynecology',
    },
  ];

  const seniorDoctors = [
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      role: 'Director & Orthopedic Surgeon',
      degree: 'MBBS, DNB, D. Ortho',
      dept: 'Orthopedics & Joint Replacement',
      fee: 500,
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      role: 'Director & Pediatrician',
      degree: 'MBBS, MD, DCH',
      dept: 'Pediatrics & Neonatology',
      fee: 500,
    },
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      role: 'Director & Intensivist',
      degree: 'MBBS, DA, FICM, CCCS',
      dept: 'Critical Care & Anesthesia',
      fee: 400,
    },
  ];

  const patientReviews = [
    {
      quote:
        'Dr. Nishant Goyal treated my mother’s complex knee fracture with immense care. The post-op nursing in the ICU was very attentive and the MJPJAY scheme support made it affordable for our family.',
      patient: 'Sunil Jadhav',
      location: 'Jalna Resident',
      rating: 5,
    },
    {
      quote:
        'Dr. Shivdas Mirkad is wonderful with children. He explained my daughter’s asthma condition patiently. Truly grateful to have such high quality pediatric care in Jalna.',
      patient: 'Pooja Kulkarni',
      location: 'Ambad Taluka',
      rating: 5,
    },
    {
      quote:
        'Prompt emergency response when my father suffered breathing distress. The 24x7 ICU facility and intensivist care saved his life. Clear billing and supportive staff.',
      patient: 'Anand Shinde',
      location: 'Partur Taluka',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-hospital-soft/80 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hospital-teal/10 border border-hospital-teal/20 text-hospital-teal text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-hospital-cyan" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-hospital-teal text-white font-semibold shadow-md hover:bg-hospital-teal/90 hover:shadow-lg transition text-sm"
                >
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>{t('hero.bookCta')}</span>
                </Link>

                <Link
                  to="/departments"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition text-sm shadow-sm"
                >
                  <span>{t('hero.exploreCare')}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-hospital-teal">19+</div>
                  <div className="text-xs text-slate-500 font-medium">Specialties & Super-Specialties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-hospital-teal">24x7</div>
                  <div className="text-xs text-slate-500 font-medium">Emergency & ICU Resuscitation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-hospital-teal">MJPJAY</div>
                  <div className="text-xs text-slate-500 font-medium">Govt Scheme & Cashless Desk</div>
                </div>
              </div>
            </div>

            {/* Right Card / Clinical Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-subtle border border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-800">Hospital Verification Notice</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Jalna Center
                  </span>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-hospital-cyan shrink-0 mt-1" />
                    <span>Plot 17, Rishi Park, Ambad Choufuli, Jalna – 431203</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-hospital-cyan shrink-0 mt-1" />
                    <span>Morning: 09:00 AM – 03:00 PM | Evening: 05:00 PM – 08:00 PM</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-hospital-cyan shrink-0 mt-1" />
                    <span className="font-semibold text-slate-900">+91-75073-42222 / 02482-223322</span>
                  </div>
                </div>

                {/* Quick Booking Preview */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Direct Slot Booking
                  </div>
                  <p className="text-xs text-slate-600">
                    Book consultations directly with verified specialists. Instant OTP validation & confirmed time-slots.
                  </p>
                  <Link
                    to="/book"
                    className="block w-full py-2.5 px-4 rounded-xl bg-hospital-cyan text-white text-xs font-bold hover:bg-hospital-cyan/90 transition shadow-sm"
                  >
                    Select Doctor & Check Availability
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Action Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/book"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-hospital-teal transition text-center group"
          >
            <Calendar className="w-6 h-6 text-hospital-teal mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-800 block">
              {t('quickActions.book')}
            </span>
          </Link>

          <a
            href="tel:+917507342222"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-hospital-teal transition text-center group"
          >
            <Phone className="w-6 h-6 text-hospital-cyan mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-800 block">
              {t('quickActions.call')}
            </span>
          </a>

          <a
            href="tel:+917507342222"
            className="p-4 bg-emergency-50 rounded-2xl border border-emergency-200 shadow-sm hover:shadow-md transition text-center group"
          >
            <AlertCircle className="w-6 h-6 text-emergency-600 mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-emergency-700 block">
              {t('quickActions.emergency')}
            </span>
          </a>

          <a
            href="tel:+917507342222"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-hospital-teal transition text-center group"
          >
            <HeartPulse className="w-6 h-6 text-hospital-teal mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-800 block">
              {t('quickActions.ambulance')}
            </span>
          </a>

          <Link
            to="/doctors"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-hospital-teal transition text-center group"
          >
            <Stethoscope className="w-6 h-6 text-hospital-cyan mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-800 block">
              {t('quickActions.findDoctor')}
            </span>
          </Link>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Sanjeevani+Multispeciality+Hospital+Jalna+Rishi+Park"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-hospital-teal transition text-center group"
          >
            <MapPin className="w-6 h-6 text-hospital-teal mx-auto mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-800 block">
              {t('quickActions.directions')}
            </span>
          </a>
        </div>
      </section>

      {/* 3. Emergency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-hospital-teal to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emergency-600 flex items-center justify-center shrink-0 shadow">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">24-Hour Emergency Triage & ICU</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('emergency.stripText')}
              </p>
            </div>
          </div>

          <a
            href="tel:+917507342222"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition shadow"
          >
            <Phone className="w-4 h-4" />
            <span>+91-75073-42222</span>
          </a>
        </div>
      </section>

      {/* 4. Core Clinical Specialties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-hospital-cyan block mb-1">
              Clinical Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('sections.featuredDepartments')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('sections.featuredDepartmentsSub')}
            </p>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-1 text-sm font-semibold text-hospital-teal hover:underline mt-4 sm:mt-0"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicalSpecialties.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.slug}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-subtle hover:shadow-card-hover transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-hospital-soft flex items-center justify-center text-hospital-teal">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {spec.title}
                    </h3>
                    <p className="text-xs text-hospital-cyan font-semibold mt-1">
                      {spec.doctors}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{spec.desc}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/departments/${spec.slug}`}
                    className="text-xs font-semibold text-hospital-teal hover:underline"
                  >
                    Details
                  </Link>
                  <Link
                    to="/book"
                    className="px-3 py-1.5 rounded-lg bg-hospital-teal/10 hover:bg-hospital-teal text-hospital-teal hover:text-white text-xs font-bold transition"
                  >
                    {t('common.bookSlot')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Specialist Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-hospital-cyan block mb-1">
              Medical Faculty
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('sections.specialistDoctors')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('sections.specialistDoctorsSub')}
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-sm font-semibold text-hospital-teal hover:underline mt-4 sm:mt-0"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seniorDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-subtle space-y-4 flex flex-col justify-between hover:shadow-card-hover transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-hospital-soft flex items-center justify-center text-hospital-teal">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    ₹{doc.fee} OPD
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs font-bold text-hospital-teal">{doc.degree}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.role}</p>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                  {doc.dept}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-hospital-teal"
                >
                  {t('common.viewProfile')}
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}`}
                  className="px-4 py-2 bg-hospital-teal text-white text-xs font-bold rounded-xl shadow-sm hover:bg-hospital-teal/90 transition"
                >
                  {t('common.bookSlot')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Patient Experiences & Google Reviews */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-hospital-cyan">
              Patient Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('sections.testimonials')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('sections.testimonialsSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patientReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-subtle flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rev.patient}</p>
                    <p className="text-[10px] text-slate-400">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded">
                    Google Review
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
