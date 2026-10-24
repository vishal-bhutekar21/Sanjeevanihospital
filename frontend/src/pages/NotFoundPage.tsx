import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { HOSPITAL } from '../config/hospital';

const WRAP = 'max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8';

/** Shown for any address the site does not know. */
export const NotFoundPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const L = (en: string, mr: string) => (isMr ? mr : en);
  const { pathname } = useLocation();

  const nextSteps = [
    {
      to: '/book',
      title: L('Book an appointment', 'अपॉइंटमेंट बुक करा'),
      desc: L('Choose a doctor, a day and a time.', 'डॉक्टर, दिवस आणि वेळ निवडा.'),
    },
    {
      to: '/doctors',
      title: L('Find a doctor', 'डॉक्टर शोधा'),
      desc: L('See our doctors and their OPD timings.', 'आमचे डॉक्टर आणि त्यांच्या ओपीडी वेळा पाहा.'),
    },
    {
      to: '/contact',
      title: L('Contact us', 'संपर्क करा'),
      desc: L('Address, phone numbers and opening hours.', 'पत्ता, फोन नंबर आणि वेळा.'),
    },
  ];

  return (
    <div className="bg-[#FAF8F4]">
      <section className={`${WRAP} py-12 sm:py-20`}>
        <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.1]">
          {L('We couldn’t find that page', 'हे पान सापडले नाही')}
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          {L(
            'The link may be old, or the address may have a typing mistake. Nothing is wrong with your booking or records.',
            'लिंक जुनी असू शकते किंवा पत्त्यात टायपिंगची चूक असू शकते. तुमच्या बुकिंग किंवा नोंदींमध्ये काहीही बिघडलेले नाही.'
          )}
        </p>
        <p className="mt-4 text-stone-600 break-all">
          {L('Address you opened:', 'तुम्ही उघडलेला पत्ता:')}{' '}
          <code className="font-mono text-[15px] text-[#1C2321] bg-white border border-[#E7E3DA] rounded px-1.5 py-0.5">
            {pathname}
          </code>
        </p>

        <div className="mt-8">
          <Link to="/" className="btn-primary">
            {L('Go to the home page', 'मुख्य पानावर जा')}
          </Link>
        </div>

        <h2 className="mt-12 text-[1.5rem] sm:text-[1.875rem] leading-tight">
          {L('What would you like to do?', 'तुम्हाला काय करायचे आहे?')}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {nextSteps.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="card-clean block h-full p-5 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              >
                <span className="block font-medium text-[#0F766E]">{s.title}</span>
                <span className="block mt-1 text-sm text-stone-600 leading-relaxed">{s.desc}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-[#E7E3DA] pt-8">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] leading-tight">
            {L('Need help urgently?', 'तातडीची मदत हवी आहे?')}
          </h2>
          <p className="mt-2 text-stone-600 leading-relaxed">
            {L(
              `Do not wait for the website. Call our emergency line, open ${HOSPITAL.opdHours.emergency.en.toLowerCase()}.`,
              `वेबसाइटची वाट पाहू नका. आमच्या आपत्कालीन नंबरवर फोन करा (${HOSPITAL.opdHours.emergency.mr}).`
            )}
          </p>
          <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="btn-emergency mt-4 inline-flex items-center gap-2">
            <Phone className="w-4 h-4" aria-hidden="true" />
            {L('Call emergency', 'आपत्कालीन फोन')} {isMr ? HOSPITAL.phones.emergency.shortMr : HOSPITAL.phones.emergency.short}
          </a>
        </div>
      </section>
    </div>
  );
};
