import React from 'react';
import { feeLabel } from '../lib/fee';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DOCTORS_DATA } from '../data/doctorsData';
import { DoctorPhoto, SectionTitle } from '../components/ui';
import { OpdWeek } from '../components/OpdWeek';
import { HOSPITAL } from '../config/hospital';

const BackLink: React.FC<{ isMr: boolean }> = ({ isMr }) => (
  <Link
    to="/doctors"
    className="inline-flex items-center gap-1.5 min-h-[44px] text-[15px] text-stone-600 hover:text-[#0F766E]"
  >
    <ArrowLeft className="w-4 h-4" />
    {isMr ? 'सर्व डॉक्टर' : 'All doctors'}
  </Link>
);

export const DoctorDetailPage: React.FC = () => {
  const { doctorId } = useParams();
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const doc = DOCTORS_DATA.find((d) => d.id === doctorId);

  if (!doc) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <BackLink isMr={isMr} />
        <h1 className="mt-4 text-[2rem] leading-tight">{isMr ? 'डॉक्टर सापडले नाहीत' : 'Doctor not found'}</h1>
        <p className="mt-3 text-[15px] text-stone-700 max-w-xl">
          {isMr
            ? 'ही लिंक जुनी असू शकते. सर्व डॉक्टरांची यादी पहा किंवा रिसेप्शनला फोन करा.'
            : 'This link may be old. Please see the list of all doctors, or call reception.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/doctors" className="btn-primary">
            {isMr ? 'डॉक्टरांची यादी' : 'See all doctors'}
          </Link>
          <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-secondary">
            <Phone className="w-4 h-4" />
            {HOSPITAL.phones.reception.display}
          </a>
        </div>
      </div>
    );
  }

  const name = isMr ? doc.nameMr : doc.name;
  const role = isMr ? doc.roleMr : doc.role;
  const dept = isMr ? doc.deptMr : doc.dept;
  const timings = isMr ? doc.timingsMr || doc.timings : doc.timings;

  // Plain-language summary built from the doctor's details.
  const about = isMr
    ? doc.aboutMr ||
      `${doc.nameMr} हे ${HOSPITAL.shortNameMr}, ${HOSPITAL.cityMr} येथे ${doc.roleMr} आहेत.`
    : `${doc.name} is ${doc.role} at ${HOSPITAL.shortName}, ${HOSPITAL.city}${
        doc.experienceYears ? `, with ${doc.experienceYears} years of experience` : ''
      }. Main areas of work: ${doc.specialty}.`;

  const details: { label: string; value: React.ReactNode }[] = [
    { label: isMr ? 'विभाग' : 'Department', value: dept },
    { label: isMr ? 'तपासणी फी' : 'Consultation fee', value: feeLabel(doc.fee, isMr) },
  ];
  if (doc.experienceYears) {
    details.push({
      label: isMr ? 'अनुभव' : 'Experience',
      value: isMr ? `${doc.experienceYears} वर्षे` : `${doc.experienceYears} years`,
    });
  }

  return (
    <div className="pb-16">
      <header className="bg-white border-b border-[#E7E3DA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pb-14">
          <BackLink isMr={isMr} />
          <div className="mt-4 flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
            <DoctorPhoto
              src={doc.image}
              name={doc.name}
              className="w-32 h-40 sm:w-52 sm:h-64 rounded-lg shrink-0"
              textClass="text-4xl sm:text-5xl"
            />
            <div className="min-w-0 max-w-2xl">
              <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.1]">{name}</h1>
              <p className="mt-3 text-lg text-stone-700">{role}</p>
              <p className="mt-1 text-[15px] text-stone-500">{doc.degree}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to={`/book?doctorId=${doc.id}`} className="btn-primary">
                  {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
                </Link>
                <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-secondary">
                  <Phone className="w-4 h-4" />
                  {HOSPITAL.phones.reception.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <SectionTitle title={isMr ? 'माहिती' : 'About'} />
            <p className="text-[15px] text-stone-700 leading-relaxed max-w-2xl">{about}</p>
          </section>

          {doc.procedures && doc.procedures.length > 0 && (
            <section>
              <SectionTitle title={isMr ? 'उपचार व शस्त्रक्रिया' : 'Treats / procedures'} />
              <ul className="list-disc pl-5 space-y-2 text-[15px] text-stone-700 marker:text-stone-400">
                {doc.procedures.map((proc) => (
                  <li key={proc}>{proc}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:col-span-5">
          <SectionTitle title={isMr ? 'ओपीडी वेळ' : 'OPD timings'} />
          <OpdWeek doctorId={doc.id} fallback={timings} isMr={isMr} />

          <dl className="mt-8 divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
            {details.map((row) => (
              <div key={row.label} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm text-stone-500">{row.label}</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2 text-[15px] text-[#1C2321]">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-stone-600">
            {isMr
              ? 'वेळेत बदल होऊ शकतो. येण्यापूर्वी रिसेप्शनला फोन करून खात्री करा.'
              : 'Timings can change. Please call reception before you come.'}
          </p>
        </aside>
      </div>
    </div>
  );
};
