import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Phone } from 'lucide-react';
import { PageIntro, SectionTitle, DoctorPhoto } from '../components/ui';
import { DEPARTMENTS, findDoctor } from './DepartmentsPage';
import type { DoctorItem } from '../data/doctorsData';

const wrap = 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8';

export const DepartmentDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const dept = DEPARTMENTS.find((d) => d.slug === slug);

  const backLink = (
    <div className="bg-white">
      <div className={`${wrap} pt-4`}>
      <Link
        to="/departments"
        className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-stone-600 hover:text-[#0F766E]"
      >
        <ArrowLeft className="w-4 h-4" />
        {isMr ? 'सर्व विभाग' : 'All departments'}
      </Link>
      </div>
    </div>
  );

  if (!dept) {
    return (
      <div className="pb-16">
        <PageIntro
          title={isMr ? 'हा विभाग सापडला नाही' : 'We could not find this department'}
          intro={
            isMr
              ? 'लिंक जुनी किंवा चुकीची असू शकते. खालील यादीतून विभाग निवडा किंवा आम्हाला फोन करा.'
              : 'The link may be old or mistyped. Pick a department from the list below, or call us and we will help.'
          }
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/departments" className="btn-primary">
              {isMr ? 'सर्व विभाग पहा' : 'See all departments'}
            </Link>
            <a href="tel:+917507342222" className="btn-secondary">
              <Phone className="w-4 h-4" />
              +91 75073 42222
            </a>
          </div>
        </PageIntro>
        <section className={`${wrap} py-12 sm:py-16`}>
          <ul className="divide-y divide-[#E7E3DA] border-y border-[#E7E3DA] max-w-2xl">
            {DEPARTMENTS.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/departments/${d.slug}`}
                  className="flex items-center min-h-[52px] py-3 text-lg text-[#1C2321] hover:text-[#0F766E]"
                >
                  {isMr ? d.nameMr : d.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const doctors = dept.doctorIds.map(findDoctor).filter((d): d is DoctorItem => Boolean(d));
  const lead = doctors[0];
  const name = isMr ? dept.nameMr : dept.nameEn;
  const treats = isMr ? dept.treatsMr : dept.treatsEn;
  const bookHref = lead ? `/book?doctorId=${lead.id}` : '/book';

  return (
    <div className="pb-16">
      {backLink}
      <PageIntro title={name} intro={isMr ? dept.descMr : dept.descEn} image={dept.photo} imageAlt={name}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={bookHref} className="btn-primary">
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
          </Link>
          <a href="tel:+917507342222" className="btn-secondary">
            <Phone className="w-4 h-4" />
            +91 75073 42222
          </a>
        </div>
      </PageIntro>

      <section className={`${wrap} py-12 sm:py-16`}>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <SectionTitle title={isMr ? 'आम्ही काय उपचार करतो' : 'What we treat'} />
            <ul className="list-disc pl-5 space-y-2 text-[17px] text-stone-700 marker:text-stone-400">
              {treats.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-stone-500">
              {isMr
                ? 'तुमचा आजार यादीत नसेल तर फोन करून विचारा.'
                : 'If your problem is not listed, call us and ask.'}
            </p>
          </div>

          <div className="lg:col-span-5">
            <SectionTitle title={isMr ? 'ओपीडी वेळ' : 'OPD timings'} />
            <p className="text-[17px] text-stone-700">{isMr ? dept.hoursMr : dept.hoursEn}</p>
            <p className="mt-3 text-sm text-stone-600">
              {isMr
                ? 'रविवार व सुट्टीच्या दिवशी आपत्कालीन विभाग २४ तास सुरू असतो.'
                : 'On Sundays and holidays the emergency ward is open as usual, 24 hours.'}
            </p>
            <div className="mt-6 p-5 rounded-lg bg-[#FDF1F0] border border-[#F3D3CF]">
              <p className="font-semibold text-[#8E1C1C]">{isMr ? 'आपत्कालीन स्थिती?' : 'Is it an emergency?'}</p>
              <p className="mt-1 text-sm text-[#6B2A2A]">
                {isMr ? 'थेट कॅज्युअल्टीमध्ये या किंवा फोन करा.' : 'Come straight to casualty, or call us now.'}
              </p>
              <a href="tel:+917507342222" className="btn-emergency mt-4 w-full sm:w-auto">
                <Phone className="w-4 h-4" />
                +91 75073 42222
              </a>
            </div>
          </div>
        </div>
      </section>

      {doctors.length > 0 && (
        <section className="bg-white border-y border-[#E7E3DA]">
          <div className={`${wrap} py-12 sm:py-16`}>
            <SectionTitle title={isMr ? 'या विभागातील डॉक्टर' : 'Doctors in this department'} />
            <ul className="grid md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 divide-[#E7E3DA]">
              {doctors.map((doc) => (
                <li key={doc.id} className="py-5 md:border-b border-[#E7E3DA] flex gap-4">
                  <DoctorPhoto src={doc.image} name={doc.name} className="w-20 h-24 rounded-md shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/doctors/${doc.id}`} className="font-heading text-lg text-[#1C2321] hover:text-[#0F766E]">
                      {isMr ? doc.nameMr : doc.name}
                    </Link>
                    <p className="text-sm text-stone-600">{isMr ? doc.roleMr : doc.role}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{doc.degree}</p>
                    <p className="mt-2 text-sm text-stone-700">{isMr ? doc.timingsMr || doc.timings : doc.timings}</p>
                    <Link
                      to={`/book?doctorId=${doc.id}`}
                      className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0F766E] hover:underline underline-offset-4"
                    >
                      {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'} →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={`${wrap} pt-12 sm:pt-16`}>
        <p className="card-notice-amber text-sm max-w-3xl">
          {isMr
            ? 'पात्र रुग्णांसाठी या विभागातील अनेक उपचार MJPJAY योजनेत व कॅशलेस विम्यात समाविष्ट आहेत. '
            : 'Many treatments in this department are covered under MJPJAY and cashless insurance for eligible patients. '}
          <Link to="/mjpjay" className="font-semibold underline underline-offset-2">
            {isMr ? 'योजनेची माहिती' : 'How MJPJAY works'}
          </Link>
        </p>
      </section>
    </div>
  );
};
