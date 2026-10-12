import React, { useState } from 'react';
import { feeLabel } from '../lib/fee';
import { Link } from 'react-router-dom';
import { Search, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DOCTORS_DATA, DoctorItem } from '../data/doctorsData';
import { PageIntro, SectionTitle, DoctorPhoto } from '../components/ui';

const GROUPS: { key: DoctorItem['category']; en: string; mr: string; subEn: string; subMr: string }[] = [
  {
    key: 'DIRECTOR',
    en: 'Directors',
    mr: 'संचालक',
    subEn: 'The doctors who run the hospital. They see patients in the OPD as well.',
    subMr: 'हॉस्पिटलचे संचालक डॉक्टर. हे ओपीडीमध्येही रुग्ण तपासतात.',
  },
  {
    key: 'INHOUSE',
    en: 'Consultants',
    mr: 'कन्सल्टंट डॉक्टर',
    subEn: 'Doctors who work at the hospital every week.',
    subMr: 'दर आठवड्याला हॉस्पिटलमध्ये असणारे डॉक्टर.',
  },
  {
    key: 'VISITING',
    en: 'Visiting specialists',
    mr: 'व्हिजिटिंग डॉक्टर',
    subEn: 'They come on fixed days. Please call before you come to confirm the date.',
    subMr: 'हे ठराविक दिवशी येतात. येण्यापूर्वी फोन करून तारीख निश्चित करा.',
  },
];

const DoctorRow: React.FC<{ doc: DoctorItem; isMr: boolean }> = ({ doc, isMr }) => (
  <li className="py-6 border-t border-[#E7E3DA]">
    <div className="flex gap-4">
      <DoctorPhoto src={doc.image} name={doc.name} className="w-20 h-24 rounded-md shrink-0" textClass="text-2xl" />
      <div className="min-w-0 flex-1">
        <h3 className="text-lg leading-snug">
          <Link to={`/doctors/${doc.id}`} className="text-[#1C2321] hover:text-[#0F766E]">
            {isMr ? doc.nameMr : doc.name}
          </Link>
        </h3>
        <p className="text-[15px] text-stone-700">{isMr ? doc.roleMr : doc.role}</p>
        <p className="text-sm text-stone-500">{doc.degree}</p>
        <p className="mt-2 text-sm text-stone-600">{isMr ? doc.deptMr : doc.dept}</p>
        <p className="text-sm text-stone-600">{isMr ? doc.timingsMr || doc.timings : doc.timings}</p>
        <p className="text-sm text-stone-600">
          {isMr ? 'तपासणी फी' : 'Consultation fee'} {feeLabel(doc.fee, isMr)}
        </p>
      </div>
    </div>
    <div className="mt-4 flex gap-3 sm:pl-24">
      <Link to={`/doctors/${doc.id}`} className="btn-secondary px-6">
        {isMr ? 'माहिती' : 'Profile'}
      </Link>
      <Link to={`/book?doctorId=${doc.id}`} className="btn-primary flex-1 sm:flex-none whitespace-nowrap">
        {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
      </Link>
    </div>
  </li>
);

export const DoctorsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [search, setSearch] = useState('');

  const q = search.toLowerCase().trim();
  const filtered = DOCTORS_DATA.filter(
    (doc) =>
      !q ||
      [doc.name, doc.nameMr, doc.dept, doc.deptMr, doc.specialty, doc.specialtyMr, doc.degree, doc.role]
        .join(' ')
        .toLowerCase()
        .includes(q),
  );

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'आमचे डॉक्टर' : 'Our doctors'}
        intro={
          isMr
            ? 'संजीवनी हॉस्पिटल, जालना येथील सर्व डॉक्टर, त्यांचे ओपीडी दिवस, वेळ आणि फी. अपॉइंटमेंटसाठी डॉक्टर निवडा किंवा रिसेप्शनला फोन करा.'
            : 'All doctors at Sanjeevani Hospital, Jalna, with their OPD days, times and fees. Pick a doctor to book, or call reception.'
        }
      >
        <label htmlFor="doctor-search" className="block text-sm text-stone-600 mb-2">
          {isMr ? 'नाव किंवा विभागाने शोधा' : 'Search by name or department'}
        </label>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            id="doctor-search"
            type="search"
            placeholder={isMr ? 'उदा. गुडघे, बालरोग, डॉ. गोयल' : 'e.g. knee, child, Dr. Goyal'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 bg-white text-[#1C2321] placeholder-stone-400 border border-[#D8D3C8] rounded-lg text-[15px] focus:outline-none focus:border-[#0F766E]"
          />
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {isMr ? 'रिसेप्शन: ' : 'Reception: '}
          <a href="tel:+917507342222" className="font-semibold text-[#1C2321] hover:underline underline-offset-4">
            +91 75073 42222
          </a>
        </p>
      </PageIntro>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 && (
          <div className="py-12 sm:py-16 max-w-xl">
            <p className="text-[15px] text-stone-700">
              {isMr ? `"${search}" साठी कोणताही डॉक्टर सापडला नाही.` : `No doctor found for "${search}".`}
            </p>
            <p className="mt-2 text-[15px] text-stone-600">
              {isMr
                ? 'दुसरा शब्द वापरून पहा, किंवा रिसेप्शनला फोन करा, ते योग्य डॉक्टर सांगतील.'
                : 'Try another word, or call reception and they will tell you which doctor to see.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSearch('')} className="btn-secondary">
                {isMr ? 'सर्व डॉक्टर दाखवा' : 'Show all doctors'}
              </button>
              <a href="tel:+917507342222" className="btn-secondary">
                <Phone className="w-4 h-4" />
                +91 75073 42222
              </a>
            </div>
          </div>
        )}

        {GROUPS.map((group) => {
          const docs = filtered.filter((d) => d.category === group.key);
          if (docs.length === 0) return null;
          return (
            <section key={group.key} className="py-12 sm:py-16 border-b border-[#E7E3DA] last:border-b-0">
              <SectionTitle title={isMr ? group.mr : group.en} sub={isMr ? group.subMr : group.subEn} />
              <ul className="grid lg:grid-cols-2 gap-x-12">
                {docs.map((doc) => (
                  <DoctorRow key={doc.id} doc={doc} isMr={isMr} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};
