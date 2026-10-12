import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Stethoscope, Calendar, ArrowLeft, ShieldCheck, CheckCircle2, Phone, Clock, Award, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DOCTORS_DATA } from '../data/doctorsData';

export const DoctorDetailPage: React.FC = () => {
  const { doctorId } = useParams();
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const doc = DOCTORS_DATA.find((d) => d.id === doctorId) || DOCTORS_DATA[0];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Back Link */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0F766E] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isMr ? 'सर्व डॉक्टर्स सूचीकडे परत जा' : 'Back to Doctors Directory'}</span>
      </Link>

      {/* Main Profile Header */}
      <div className="card-clean p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white">
        {/* Left Column: Photo & Badges */}
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden shadow-xs border-2 border-stone-200 bg-stone-100">
            <img
              src={doc.image}
              alt={doc.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex justify-center mb-1">
              {doc.category === 'DIRECTOR' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {isMr ? 'हॉस्पिटल संचालक' : 'Founding Director'}
                </span>
              )}
              {doc.category === 'VISITING' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  {isMr ? 'व्हिजिटिंग सुपर-स्पेशालिस्ट' : 'Visiting Super-Specialist'}
                </span>
              )}
              {doc.category === 'INHOUSE' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                  {isMr ? 'इन-हाऊस कन्सल्टंट' : 'In-House Faculty'}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl text-stone-900 font-heading">
              {isMr ? doc.nameMr : doc.name}
            </h1>
            <p className="text-xs font-bold text-[#0F766E] mt-0.5">{doc.degree}</p>
            <p className="text-xs text-stone-600 mt-0.5">{isMr ? doc.roleMr : doc.role}</p>
          </div>
          <div className="badge-teal text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isMr ? 'अधिकृत वैद्यकीय तज्ज्ञ' : 'Verified Medical Specialist'}</span>
          </div>
        </div>

        {/* Right Column: Key Metrics & Biography */}
        <div className="lg:col-span-8 space-y-5 lg:border-l lg:border-stone-100 lg:pl-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
              <span className="text-stone-500 block font-medium">{isMr ? 'विभाग' : 'Department'}</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">
                {isMr ? doc.deptMr : doc.dept}
              </span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
              <span className="text-stone-500 block font-medium">{isMr ? 'वैद्यकीय अनुभव' : 'Experience'}</span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {doc.experienceYears ? `${doc.experienceYears}+ Years` : 'Senior Consultant'}
              </span>
            </div>
            <div className="p-3.5 bg-teal-50/70 rounded-lg border border-teal-100 col-span-2 sm:col-span-1">
              <span className="text-teal-800 block font-medium">{isMr ? 'ओपीडी सल्ला शुल्क' : 'Consultation Fee'}</span>
              <span className="font-bold text-[#0F766E] text-base mt-0.5 block">₹{doc.fee}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm text-stone-900 font-heading">
              {isMr ? 'वैद्यकीय पार्श्वभूमी व विशेष कौशल्य' : 'Clinical Focus & Background'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isMr ? doc.aboutMr || doc.about : doc.about}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-stone-100">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0F766E]" />
                <span>{isMr ? 'ओपीडी व भेटण्याची वेळ' : 'Weekly Consultation Timings'}</span>
              </span>
              <p className="text-xs font-bold text-stone-800">
                {isMr ? doc.timingsMr : doc.timings}
              </p>
            </div>

            <Link
              to={`/book?doctorId=${doc.id}`}
              className="btn-primary text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>{isMr ? 'अपॉइंटमेंट टोकन बुक करा' : 'Book Appointment Slot'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Procedures & Clinical Services */}
      {doc.procedures && doc.procedures.length > 0 && (
        <div className="card-clean p-6 sm:p-8 space-y-4 bg-white">
          <h3 className="text-base text-stone-900 font-heading flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#0F766E]" />
            <span>{isMr ? 'विशेष उपचार व शस्त्रक्रिया प्रक्रिया' : 'Specialized Procedures & Interventions'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doc.procedures.map((proc: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center space-x-2.5 p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs font-medium text-stone-700"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span>{proc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
