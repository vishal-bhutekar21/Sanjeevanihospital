import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Stethoscope, Users, Award, Calendar, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DOCTORS_DATA, DoctorItem } from '../data/doctorsData';

export const DoctorsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DIRECTOR' | 'INHOUSE' | 'VISITING'>('ALL');

  const filteredDoctors = DOCTORS_DATA.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'ALL' || doc.category === selectedCategory;

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.nameMr.toLowerCase().includes(q) ||
      doc.dept.toLowerCase().includes(q) ||
      doc.deptMr.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.specialtyMr.toLowerCase().includes(q) ||
      doc.degree.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const countAll = DOCTORS_DATA.length;
  const countDirectors = DOCTORS_DATA.filter((d) => d.category === 'DIRECTOR').length;
  const countInhouse = DOCTORS_DATA.filter((d) => d.category === 'INHOUSE').length;
  const countVisiting = DOCTORS_DATA.filter((d) => d.category === 'VISITING').length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── PAGE HEADER (CLEAN HEALTHCARE STYLING) ─────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-gradient-to-br from-teal-50/80 via-white to-amber-50/40 border border-teal-200 shadow-xs space-y-4">
        <div className="badge-teal text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isMr ? 'अधिकृत वैद्यकीय संचालक व तज्ज्ञ डॉक्टर' : 'Official Medical Faculty & Super-Specialists'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-heading">
          {isMr ? 'तज्ज्ञ डॉक्टर, संचालक व व्हिजिटिंग सुपर-स्पेशालिस्ट' : 'Expert Doctors, Directors & Visiting Consultants'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना येथील संचालक, इन-हाऊस कन्सल्टंट्स आणि नामांकित व्हिजिटिंग सुपर-स्पेशालिस्ट डॉक्टरांची संपूर्ण माहिती व ओपीडी वेळापत्रक.'
            : 'Explore full profiles, clinical specialties, and OPD schedules of founding directors, full-time consultants, and visiting super-specialist surgeons at Sanjeevani Hospital Jalna.'}
        </p>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={isMr ? 'डॉक्टरांचे नाव, विभाग किंवा पदवी शोधा...' : 'Search doctor name, department or specialty...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>
      </div>

      {/* ─── 4 CATEGORY FILTER TABS ─────────────────────────────────────────── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 p-1.5 rounded-xl">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 ${
            selectedCategory === 'ALL'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{isMr ? `सर्व डॉक्टर्स (${countAll})` : `All Doctors (${countAll})`}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('DIRECTOR')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 ${
            selectedCategory === 'DIRECTOR'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>{isMr ? `संचालक मंडळ (${countDirectors})` : `Directors (${countDirectors})`}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('INHOUSE')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 ${
            selectedCategory === 'INHOUSE'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
          <span>{isMr ? `इन-हाऊस कन्सल्टंट (${countInhouse})` : `In-House Faculty (${countInhouse})`}</span>
        </button>

        <button
          onClick={() => setSelectedCategory('VISITING')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 ${
            selectedCategory === 'VISITING'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{isMr ? `व्हिजिटिंग कन्सल्टंट (${countVisiting})` : `Visiting Specialists (${countVisiting})`}</span>
        </button>
      </div>

      {/* ─── DOCTOR CARDS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="card-clean p-5 flex flex-col justify-between space-y-5 group hover:shadow-card-hover transition"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {doc.category === 'DIRECTOR' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        {isMr ? 'संचालक' : 'Director'}
                      </span>
                    )}
                    {doc.category === 'VISITING' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                        {isMr ? 'व्हिजिटिंग' : 'Visiting Specialist'}
                      </span>
                    )}
                    {doc.category === 'INHOUSE' && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                        {isMr ? 'इन-हाऊस' : 'In-House Faculty'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate font-heading group-hover:text-[#0F766E] transition">
                    {isMr ? doc.nameMr : doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F766E] line-clamp-1">
                    {isMr ? doc.roleMr : doc.role}
                  </p>
                  <p className="text-[11px] font-medium text-slate-600">
                    {doc.degree}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {isMr ? doc.deptMr : doc.dept}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">{isMr ? 'विशेष प्राविण्य: ' : 'Specialty: '}</span>
                  <span>{isMr ? doc.specialtyMr : doc.specialty}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">{isMr ? 'वेळ / दिवस: ' : 'Schedule: '}</span>
                  <span className="text-slate-800 font-medium">{isMr ? doc.timingsMr : doc.timings}</span>
                </div>
                <div className="pt-1.5 flex justify-between items-center border-t border-slate-200">
                  <span className="text-slate-500">{isMr ? 'ओपीडी सल्ला शुल्क:' : 'OPD Consultation:'}</span>
                  <span className="font-bold text-[#0F766E] text-sm">₹{doc.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Link
                to={`/doctors/${doc.id}`}
                className="btn-secondary text-xs flex-1 min-h-[38px] py-1.5 text-center flex items-center justify-center"
              >
                {isMr ? 'सविस्तर माहिती' : 'View Profile'}
              </Link>
              <Link
                to={`/book?doctorId=${doc.id}`}
                className="btn-primary text-xs flex-1 min-h-[38px] py-1.5 text-center flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isMr ? 'अपॉइंटमेंट घ्या' : 'Book Token'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
