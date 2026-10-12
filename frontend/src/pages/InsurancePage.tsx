import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';
import { PageIntro, SectionTitle } from '../components/ui';
import { PHOTOS } from '../data/photos';
import { HOSPITAL } from '../config/hospital';

const inputClass =
  'w-full px-3.5 py-3 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';
const labelClass = 'block text-sm font-medium text-stone-700 mb-1.5';

export const InsurancePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [info, setInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    patientName: '',
    phone: '',
    insuranceCompany: '',
    policyNumber: '',
    plannedTreatment: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/schemes/insurance/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => setInfo(null));
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setTimeout(() => {
      setSubmittingInquiry(false);
      setInquirySubmitted(true);
    }, 600);
  };

  const deskHours =
    info?.tpaDeskTimings ||
    (isMr ? 'सोम–शनि सकाळी ९ ते संध्या. ६ · आपत्कालीन २४ तास' : 'Mon–Sat 9 am – 6 pm · Emergencies 24 hours');

  const cashlessSteps = [
    {
      titleEn: 'Show your insurance card and ID',
      titleMr: 'इन्शुरन्स कार्ड आणि ओळखपत्र दाखवा',
      time: isMr ? 'सुमारे ३० मिनिटे' : 'About 30 minutes',
      descEn: 'Come to the Insurance / TPA desk in the main lobby with your health insurance card (or e-card) and the patient’s Aadhaar and PAN card.',
      descMr: 'मुख्य लॉबीतील इन्शुरन्स / टीपीए कक्षात आरोग्य विमा कार्ड (किंवा ई-कार्ड) आणि रुग्णाचे आधार व पॅन कार्ड घेऊन या.',
    },
    {
      titleEn: 'Doctor fills the pre-authorisation form',
      titleMr: 'डॉक्टर पूर्व-मंजुरी (Pre-Auth) फॉर्म भरतात',
      time: isMr ? '३० ते ६० मिनिटे' : '30–60 minutes',
      descEn: 'The treating doctor writes the diagnosis, the planned treatment or surgery, and the estimated cost.',
      descMr: 'उपचार करणारे डॉक्टर निदान, नियोजित उपचार किंवा शस्त्रक्रिया आणि अंदाजित खर्च लिहून स्वाक्षरी करतात.',
    },
    {
      titleEn: 'We send it to your insurer or TPA',
      titleMr: 'आम्ही अर्ज विमा कंपनी / टीपीएकडे पाठवतो',
      time: isMr ? '१ ते २ तास' : '1–2 hours',
      descEn: 'The insurance desk uploads the form, reports, prescription and ID proofs to your insurer’s or TPA’s portal.',
      descMr: 'इन्शुरन्स डेस्क फॉर्म, तपासणी अहवाल, प्रिस्क्रिप्शन आणि ओळखपत्रे विमा कंपनी / टीपीएच्या पोर्टलवर पाठवतो.',
    },
    {
      titleEn: 'Approval and admission',
      titleMr: 'मंजुरी आणि दाखल',
      time: isMr ? '२ ते ४ तास' : '2–4 hours',
      descEn: 'Once the insurer issues the initial approval letter, the patient is admitted and treated without an advance deposit.',
      descMr: 'विमा कंपनीकडून प्रारंभिक मंजुरी पत्र आल्यावर रुग्णाला आगाऊ रक्कम न भरता दाखल करून उपचार सुरू होतात.',
    },
    {
      titleEn: 'Final bill and discharge',
      titleMr: 'अंतिम बिल आणि डिस्चार्ज',
      time: isMr ? 'डिस्चार्जच्या वेळी' : 'At discharge',
      descEn: 'We send the final bill and discharge summary for final approval. You pay only non-medical items and any co-pay.',
      descMr: 'अंतिम बिल व डिस्चार्ज समरी अंतिम मंजुरीसाठी पाठवली जाते. रुग्ण फक्त नॉन-मेडिकल खर्च व को-पे भरतात.',
    },
  ];

  const requiredDocs = [
    { en: 'Health insurance card or e-card for the current year', mr: 'चालू वर्षाचे आरोग्य विमा कार्ड / ई-कार्ड' },
    { en: 'Policy schedule showing sum insured and family members covered', mr: 'विमा रक्कम व समाविष्ट सदस्य दर्शवणारे पॉलिसी शेड्यूल' },
    { en: 'Patient’s original photo ID (Aadhaar, Voter ID or passport)', mr: 'रुग्णाचे मूळ सरकारी ओळखपत्र (आधार / मतदान कार्ड / पासपोर्ट)' },
    { en: 'PAN and Aadhaar of the main policyholder (needed for claims over ₹50,000, as per IRDAI)', mr: 'मुख्य विमाधारकाचे पॅन व आधार कार्ड (₹५०,००० पेक्षा जास्त क्लेमसाठी, IRDAI नियम)' },
    { en: `${HOSPITAL.brand} OPD paper or doctor’s prescription advising admission`, mr: `${HOSPITAL.brandMr} ओपीडी कागद / दाखल होण्याचा सल्ला देणारे प्रिस्क्रिप्शन` },
    { en: 'Test reports (blood, X-ray, CT, sonography)', mr: 'तपासणी अहवाल (रक्त, एक्स-रे, सीटी, सोनोग्राफी)' },
  ];

  const ifApplicableDocs = [
    { en: 'Past medical records and discharge summaries, for pre-existing conditions', mr: 'जुन्या आजारांसाठी मागील वैद्यकीय नोंदी व डिस्चार्ज कार्ड' },
    { en: 'Employee ID card, for corporate group policies', mr: 'कॉर्पोरेट ग्रुप पॉलिसीसाठी कंपनीचे कर्मचारी ओळखपत्र' },
  ];

  const panelInsurersList = [
    { name: 'Star Health & Allied Insurance', nameMr: 'स्टार हेल्थ अँड अलाईड इन्शुरन्स' },
    { name: 'HDFC ERGO General Insurance', nameMr: 'एचडीएफसी एर्गो जनरल इन्शुरन्स' },
    { name: 'ICICI Lombard General Insurance', nameMr: 'आयसीआयसीआय लोम्बार्ड' },
    { name: 'Care Health Insurance (Religare)', nameMr: 'केअर हेल्थ इन्शुरन्स (रेलिगेअर)' },
    { name: 'Niva Bupa Health Insurance (Max Bupa)', nameMr: 'निवा बुपा हेल्थ इन्शुरन्स' },
    { name: 'Bajaj Allianz General Insurance', nameMr: 'बजाज अलियान्झ जनरल इन्शुरन्स' },
    { name: 'Tata AIG General Insurance', nameMr: 'टाटा एआयजी जनरल इन्शुरन्स' },
    { name: 'SBI General Insurance', nameMr: 'एसबीआय जनरल इन्शुरन्स' },
    { name: 'Aditya Birla Health Insurance', nameMr: 'आदित्य बिर्ला हेल्थ इन्शुरन्स' },
    { name: 'Reliance General Insurance', nameMr: 'रिलायन्स जनरल इन्शुरन्स' },
    { name: 'National Insurance Company Ltd.', nameMr: 'नॅशनल इन्शुरन्स कंपनी लि.' },
    { name: 'The New India Assurance Co. Ltd.', nameMr: 'द न्यू इंडिया अ‍ॅश्युरन्स कंपनी' },
    { name: 'The Oriental Insurance Co. Ltd.', nameMr: 'द ओरिएंटल इन्शुरन्स कंपनी' },
    { name: 'United India Insurance Co. Ltd.', nameMr: 'युनायटेड इंडिया इन्शुरन्स कंपनी' },
    { name: 'ManipalCigna Health Insurance', nameMr: 'मनिपाल सिगना हेल्थ इन्शुरन्स' },
    { name: 'Future Generali India Insurance', nameMr: 'फ्युचर जनरली इंडिया इन्शुरन्स' },
    { name: 'Go Digit General Insurance', nameMr: 'गो डिजिट जनरल इन्शुरन्स' },
    { name: 'Magma HDI General Insurance', nameMr: 'मॅग्मा एचडीआय जनरल इन्शुरन्स' },
  ];

  const tpaPartnersList = [
    { name: 'Medi Assist Insurance TPA Pvt. Ltd.', nameMr: 'मेडी असिस्ट इन्शुरन्स टीपीए' },
    { name: 'Vidal Health Insurance TPA Pvt. Ltd.', nameMr: 'विडाल हेल्थ टीपीए' },
    { name: 'Paramount Health Services & Insurance TPA', nameMr: 'पॅरामाउंट हेल्थ सर्व्हिसेस टीपीए' },
    { name: 'MDIndia Health Insurance TPA Pvt. Ltd.', nameMr: 'एमडी इंडिया हेल्थ टीपीए' },
    { name: 'Heritage Health Insurance TPA Pvt. Ltd.', nameMr: 'हेरिटेज हेल्थ टीपीए' },
    { name: 'Raksha Health Insurance TPA Pvt. Ltd.', nameMr: 'रक्षा हेल्थ इन्शुरन्स टीपीए' },
    { name: 'Family Health Plan Insurance TPA (FHPL)', nameMr: 'फॅमिली हेल्थ प्लॅन टीपीए (FHPL)' },
    { name: 'Health Insurance TPA of India (HITPA)', nameMr: 'हेल्थ इन्शुरन्स टीपीए ऑफ इंडिया' },
    { name: 'Park Mediclaim TPA Pvt. Ltd.', nameMr: 'पार्क मेडिक्लेम टीपीए' },
    { name: 'Genins India Insurance TPA Ltd.', nameMr: 'जेनइन्स इंडिया इन्शुरन्स टीपीए' },
    { name: 'Dedicated Healthcare Services (DHS TPA)', nameMr: 'डेडिकेटेड हेल्थकेअर सर्व्हिसेस टीपीए' },
  ];

  const matches = (item: { name: string; nameMr: string }) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.nameMr.includes(searchTerm);
  const filteredInsurers = panelInsurersList.filter(matches);
  const filteredTpas = tpaPartnersList.filter(matches);

  const sectionLinks = [
    { href: '#how-it-works', label: isMr ? 'प्रक्रिया' : 'How it works' },
    { href: '#documents', label: isMr ? 'कागदपत्रे' : 'Documents' },
    { href: '#insurers', label: isMr ? 'विमा कंपन्या व टीपीए' : 'Insurers and TPAs' },
    { href: '#check-policy', label: isMr ? 'पॉलिसी तपासा' : 'Check your policy' },
  ];

  const wrap = 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'कॅशलेस विमा' : 'Cashless insurance'}
        intro={
          isMr
            ? `${HOSPITAL.shortNameMr} बहुतेक शासकीय व खाजगी आरोग्य विमा कंपन्या आणि टीपीएसोबत कॅशलेस उपचार देते. मंजूर रकमेसाठी आगाऊ डिपॉझिट भरावे लागत नाही. आमचा इन्शुरन्स डेस्क कागदपत्रे व मंजुरीसाठी मदत करतो.`
            : `${HOSPITAL.shortName} works with most public and private health insurers and TPAs. For the approved amount you don’t pay a deposit upfront. Our insurance desk handles the forms and approval for you.`
        }
        image={PHOTOS.billing}
        imageAlt={isMr ? 'हॉस्पिटल बिलिंग काउंटर' : 'Hospital billing counter'}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-primary">
            <Phone className="w-4 h-4" />
            {isMr ? `इन्शुरन्स डेस्क: ${HOSPITAL.phones.reception.display}` : `Insurance desk: ${HOSPITAL.phones.reception.display}`}
          </a>
          <a href="#check-policy" className="btn-secondary">
            {isMr ? 'पॉलिसी तपासून घ्या' : 'Check your policy'}
          </a>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {isMr ? 'इन्शुरन्स / टीपीए कक्ष, मुख्य लॉबी · ' : 'Insurance / TPA desk, main lobby · '}
          {deskHours}
        </p>
      </PageIntro>

      {/* In-page links */}
      <nav aria-label={isMr ? 'या पानावर' : 'On this page'} className="border-b border-[#E7E3DA] bg-[#FAF8F4]">
        <div className={`${wrap} flex flex-wrap gap-x-6 gap-y-1 py-2 text-[15px]`}>
          {sectionLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex items-center min-h-[44px] text-[#0F766E] font-medium hover:underline underline-offset-4"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Planned vs emergency */}
      <section className={`${wrap} py-12 sm:py-16`}>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl">{isMr ? 'नियोजित दाखल' : 'Planned admission'}</h2>
            <p className="mt-2 text-stone-600 leading-relaxed">
              {isMr
                ? 'शस्त्रक्रियेच्या ४८ ते ७२ तास आधी इन्शुरन्स डेस्कवर कागदपत्रे द्या. दाखल होण्याच्या दिवशी प्रारंभिक मंजुरी तयार असते.'
                : 'Bring your documents to the insurance desk 48 to 72 hours before the surgery. The initial approval is usually ready on the day of admission.'}
            </p>
          </div>
          <div>
            <h2 className="text-xl">{isMr ? 'आपत्कालीन दाखल' : 'Emergency admission'}</h2>
            <p className="mt-2 text-stone-600 leading-relaxed">
              {isMr
                ? 'आपत्कालीन किंवा अपघात प्रसंगी रुग्णाला लगेच दाखल केले जाते. इन्शुरन्स डेस्क २४ तासांच्या आत विमा कंपनीला कळवतो.'
                : 'In an emergency the patient is admitted straight away. The insurance desk informs your insurer within 24 hours of admission.'}
            </p>
          </div>
        </div>

        <p className="mt-8 card-notice-amber text-sm leading-relaxed">
          {isMr
            ? 'कॅशलेस मंजुरी आणि रक्कम आपल्या पॉलिसीच्या अटी, को-पे आणि उप-मर्यादेनुसार विमा कंपनी / टीपीए ठरवते. नॉन-मेडिकल वस्तू (उदा. ग्लोव्ह्ज, नोंदणी शुल्क) आणि को-पे रक्कम डिस्चार्जच्या वेळी रुग्णाला भरावी लागते.'
            : 'Cashless approval and the amount covered are decided by your insurer or TPA, based on policy terms, co-pay and sub-limits. Non-medical items (such as gloves and registration fees) and any co-pay are paid by the patient at discharge.'}
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-[#E7E3DA] scroll-mt-4">
        <div className={`${wrap} py-12 sm:py-16`}>
          <SectionTitle
            title={isMr ? 'कॅशलेस उपचार कसे मिळतात' : 'How cashless treatment works'}
            sub={isMr ? 'दाखल होण्यापासून डिस्चार्जपर्यंत.' : 'From arrival to discharge.'}
          />
          <ol className="max-w-3xl divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
            {cashlessSteps.map((step, i) => (
              <li key={i} className="py-5 flex gap-4">
                <span className="font-heading text-xl text-[#0F766E] w-6 shrink-0">{i + 1}.</span>
                <div>
                  <h3 className="text-lg">{isMr ? step.titleMr : step.titleEn}</h3>
                  <p className="mt-1 text-stone-600 leading-relaxed">{isMr ? step.descMr : step.descEn}</p>
                  <p className="mt-1 text-sm text-stone-500">{step.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className={`${wrap} py-12 sm:py-16 scroll-mt-4`}>
        <SectionTitle
          title={isMr ? 'सोबत आणायची कागदपत्रे' : 'Documents to bring'}
          sub={
            isMr
              ? 'मूळ कागदपत्रे आणि प्रत्येकी २ झेरॉक्स प्रती इन्शुरन्स डेस्कवर द्या.'
              : 'Bring the originals and 2 photocopies of each to the insurance desk.'
          }
        />
        <div className="grid lg:grid-cols-2 gap-10">
          <ol className="space-y-3 text-[15px] text-stone-700">
            {requiredDocs.map((doc, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-heading text-[#0F766E] w-5 shrink-0">{i + 1}.</span>
                <span>{isMr ? doc.mr : doc.en}</span>
              </li>
            ))}
          </ol>
          <div>
            <h3 className="text-lg">{isMr ? 'लागू असल्यास' : 'If they apply to you'}</h3>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px] text-stone-700">
              {ifApplicableDocs.map((doc, i) => (
                <li key={i}>{isMr ? doc.mr : doc.en}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Insurers and TPAs */}
      <section id="insurers" className="bg-white border-y border-[#E7E3DA] scroll-mt-4">
        <div className={`${wrap} py-12 sm:py-16`}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <SectionTitle
              className="mb-0"
              title={isMr ? 'आम्ही स्वीकारत असलेल्या विमा कंपन्या व टीपीए' : 'Insurers and TPAs we work with'}
              sub={
                isMr
                  ? 'आपली कंपनी यादीत नसेल तर इन्शुरन्स डेस्कला फोन करून विचारा.'
                  : 'If yours is not listed, call the insurance desk to check.'
              }
            />
            <div className="w-full sm:w-72 shrink-0">
              <label htmlFor="insurer-search" className={labelClass}>
                {isMr ? 'नावाने शोधा' : 'Search by name'}
              </label>
              <input
                id="insurer-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isMr ? 'उदा. Star Health' : 'e.g. Star Health'}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg">
                {isMr ? `विमा कंपन्या (${panelInsurersList.length})` : `Insurance companies (${panelInsurersList.length})`}
              </h3>
              {filteredInsurers.length > 0 ? (
                <ul className="mt-3 list-disc pl-5 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[15px] text-stone-700">
                  {filteredInsurers.map((ins) => (
                    <li key={ins.name}>{isMr ? ins.nameMr : ins.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-stone-500">{isMr ? 'जुळणारे नाव नाही.' : 'No match.'}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg">
                {isMr ? `टीपीए (${tpaPartnersList.length})` : `Third party administrators, TPAs (${tpaPartnersList.length})`}
              </h3>
              {filteredTpas.length > 0 ? (
                <ul className="mt-3 list-disc pl-5 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[15px] text-stone-700">
                  {filteredTpas.map((tpa) => (
                    <li key={tpa.name}>{isMr ? tpa.nameMr : tpa.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-stone-500">{isMr ? 'जुळणारे नाव नाही.' : 'No match.'}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Check your policy form */}
      <section id="check-policy" className={`${wrap} py-12 sm:py-16 scroll-mt-4`}>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionTitle
              title={isMr ? 'दाखल होण्याआधी पॉलिसी तपासा' : 'Check your policy before admission'}
              sub={
                isMr
                  ? 'पॉलिसीची माहिती पाठवा. आमचा इन्शुरन्स डेस्क कॅशलेस पात्रता व मर्यादा तपासून आपल्याला फोन करेल.'
                  : 'Send us your policy details. Our insurance desk will check cashless eligibility and limits, and call you back.'
              }
            />
            <p className="text-sm text-stone-600">
              {isMr ? 'थेट बोलायचे आहे?' : 'Prefer to talk?'}{' '}
              <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] hover:underline">
                {HOSPITAL.phones.reception.display}
              </a>
            </p>
          </div>

          <div className="lg:col-span-8 card-clean p-5 sm:p-8">
            {inquirySubmitted ? (
              <div role="status" className="py-4">
                <h3 className="text-xl text-[#0F766E]">
                  {isMr ? 'आपली माहिती मिळाली' : 'We have your details'}
                </h3>
                <p className="mt-2 text-stone-600 max-w-md">
                  {isMr
                    ? 'आमचा इन्शुरन्स डेस्क आपल्या विमा कंपनीशी संपर्क साधून ३० मिनिटांत आपल्याला फोन करेल.'
                    : 'Our insurance desk will check with your insurer and call you within 30 minutes.'}
                </p>
                <button onClick={() => setInquirySubmitted(false)} className="btn-secondary mt-5">
                  {isMr ? 'दुसरी पॉलिसी तपासा' : 'Check another policy'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="ins-name" className={labelClass}>
                      {isMr ? 'रुग्णाचे पूर्ण नाव *' : 'Patient’s full name *'}
                    </label>
                    <input
                      id="ins-name"
                      required
                      value={inquiryForm.patientName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, patientName: e.target.value })}
                      placeholder={isMr ? 'उदा. सुहास कुलकर्णी' : 'e.g. Suhas Kulkarni'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-phone" className={labelClass}>
                      {isMr ? 'मोबाईल नंबर *' : 'Mobile number *'}
                    </label>
                    <input
                      id="ins-phone"
                      required
                      type="tel"
                      maxLength={10}
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-company" className={labelClass}>
                      {isMr ? 'विमा कंपनी / टीपीएचे नाव *' : 'Insurance company or TPA *'}
                    </label>
                    <input
                      id="ins-company"
                      required
                      value={inquiryForm.insuranceCompany}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, insuranceCompany: e.target.value })}
                      placeholder="e.g. Star Health / HDFC ERGO / Medi Assist"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ins-policy" className={labelClass}>
                      {isMr ? 'पॉलिसी किंवा कार्ड नंबर *' : 'Policy or member card number *'}
                    </label>
                    <input
                      id="ins-policy"
                      required
                      value={inquiryForm.policyNumber}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, policyNumber: e.target.value })}
                      placeholder="P/123456/01/2026/000123"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ins-treatment" className={labelClass}>
                    {isMr ? 'नियोजित उपचार / शस्त्रक्रिया *' : 'Planned treatment or surgery *'}
                  </label>
                  <textarea
                    id="ins-treatment"
                    required
                    rows={3}
                    value={inquiryForm.plannedTreatment}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, plannedTreatment: e.target.value })}
                    placeholder={
                      isMr
                        ? 'उदा. गुडघे प्रत्यारोपण, लेप्रोस्कोपी किंवा ICU उपचार'
                        : 'e.g. knee replacement, laparoscopy, ICU care'
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button type="submit" disabled={submittingInquiry} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                  {submittingInquiry
                    ? isMr
                      ? 'पाठवत आहे...'
                      : 'Sending...'
                    : isMr
                      ? 'पॉलिसी तपासणीसाठी पाठवा'
                      : 'Send for checking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
