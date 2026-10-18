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

export const MjpjayPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [, setInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    rationCardNumber: '',
    aadhaarLast4: '',
    diagnosisDescription: '',
    estimatedAmount: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl('/schemes/mjpjay/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch((err) => console.error('Failed to load MJPJAY info:', err));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/schemes/mjpjay/register-claim'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patientAge: Number(formData.patientAge),
          estimatedAmount: formData.estimatedAmount ? Number(formData.estimatedAmount) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit');
      }
      setSubmitted(true);
      setFormData({
        patientName: '',
        patientPhone: '',
        patientAge: '',
        rationCardNumber: '',
        aadhaarLast4: '',
        diagnosisDescription: '',
        estimatedAmount: '',
      });
    } catch (err) {
      setError(
        isMr
          ? `अर्ज पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा किंवा ${HOSPITAL.phones.reception.display} वर फोन करा.`
          : `We could not send your request. Please try again, or call ${HOSPITAL.phones.reception.display}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const proceduresData = [
    {
      categoryEn: 'Orthopaedics and joint replacement',
      categoryMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
      doctor: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      procedures: [
        { en: 'Total knee replacement', mr: 'गुडघे प्रत्यारोपण (Total Knee Replacement)' },
        { en: 'Total hip replacement', mr: 'खुबा प्रत्यारोपण (Total Hip Replacement)' },
        { en: 'Fracture fixation (plating and nailing)', mr: 'गुंतागुंतीचे फ्रॅक्चर व हाडांचे ऑपरेशन' },
        { en: 'Spinal disc decompression and stabilisation', mr: 'मणक्याचे आजार, स्लिप डिस्क व स्टेबिलायझेशन' },
        { en: 'Arthroscopic ligament repair (ACL/PCL)', mr: 'दुर्बिणीद्वारे लिगामेंट शस्त्रक्रिया (ACL/PCL)' },
        { en: 'Children’s fractures and bone deformities', mr: 'लहान मुलांच्या हाडांचे फ्रॅक्चर व विकृती निवारण' },
      ],
    },
    {
      categoryEn: 'General and laparoscopic surgery',
      categoryMr: 'जनरल आणि लेप्रोस्कोपिक (दुर्बिणीच्या) शस्त्रक्रिया',
      doctor: 'Dr. Millind Katole (MBBS, MS)',
      procedures: [
        { en: 'Laparoscopic gallbladder removal (gallstones)', mr: 'दुर्बिणीद्वारे पित्ताशयातील खडे काढण्याची शस्त्रक्रिया' },
        { en: 'Laparoscopic hernia repair with mesh', mr: 'दुर्बिणीद्वारे हर्निया व जाळी बसविण्याची शस्त्रक्रिया' },
        { en: 'Laparoscopic appendix removal', mr: 'दुर्बिणीद्वारे अपेंडिक्स काढण्याची शस्त्रक्रिया' },
        { en: 'Laser surgery for piles, fissure and fistula', mr: 'लेझरद्वारे मूळव्याध, भगंदर व फिशर शस्त्रक्रिया' },
        { en: 'Emergency abdominal injury and bowel perforation surgery', mr: 'पोटातील गंभीर दुखापती व आपत्कालीन शस्त्रक्रिया' },
      ],
    },
    {
      categoryEn: 'Paediatrics and newborn ICU (NICU)',
      categoryMr: 'बालरोग आणि नवजात शिशु अतिदक्षता विभाग (NICU)',
      doctor: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      procedures: [
        { en: 'Level-II NICU care for premature and low birth weight babies', mr: 'अकाली जन्मलेली व कमी वजनाची बालके (NICU Care)' },
        { en: 'Newborn breathing problems and phototherapy for jaundice', mr: 'नवजात बालकांमधील कावीळ (फोटोथेरपी) व श्वसन विकार' },
        { en: 'Severe pneumonia, bronchiolitis and asthma in children', mr: 'गंभीर न्यूमोनिया, दमा व श्वासनलिका संसर्ग' },
        { en: 'Sepsis and serious infections in children', mr: 'गंभीर संसर्ग (Sepsis) व बालरोग अतिदक्षता' },
        { en: 'Birth defects and care after children’s surgery', mr: 'जन्मजात आजार व बालरोग शस्त्रक्रिया पश्चात देखभाल' },
      ],
    },
    {
      categoryEn: 'ICU and critical care (21 beds)',
      categoryMr: '२१ खाटांचा अतिदक्षता विभाग (ICU) व व्हेंटिलेटर',
      doctor: 'Dr. Baliram Bagal (MBBS, DA, FICM, CCCS)',
      procedures: [
        { en: 'Ventilator support and arterial line monitoring', mr: 'आधुनिक मेकॅनिकल व्हेंटिलेशन व आर्टेरियल मॉनिटरिंग' },
        { en: 'Septic shock, poisoning and multi-organ failure', mr: 'सेप्टिक शॉक, विषबाधा व मल्टी-ऑर्गन फेल्युअर उपचार' },
        { en: 'Bedside dialysis for kidney failure', mr: 'बेडसाइड डायलिसिस सपोर्ट व मूत्रपिंड निकामी रुग्ण' },
        { en: 'Severe head injury, stroke and coma', mr: 'डोक्याला गंभीर मार, मेंदूतील रक्तस्राव व स्ट्रोक केअर' },
      ],
    },
    {
      categoryEn: 'Obstetrics and gynaecology',
      categoryMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      doctor: 'Dr. Anshul Goyal (MBBS, DNB, DGO)',
      procedures: [
        { en: 'High-risk delivery and emergency caesarean section (LSCS)', mr: 'सुरक्षित सिझेरियन (LSCS) व गुंतागुंतीचे बाळंतपण' },
        { en: 'Ectopic pregnancy surgery', mr: 'अस्थानिक गर्भधारणा (Ectopic Pregnancy) शस्त्रक्रिया' },
        { en: 'Laparoscopic hysterectomy and myomectomy', mr: 'दुर्बिणीद्वारे गर्भाशय काढण्याची शस्त्रक्रिया (Hysterectomy)' },
        { en: 'Ovarian cyst removal and control of heavy bleeding', mr: 'अंडाशयातील गाठ (Ovarian Cyst) व रक्तस्राव नियंत्रण' },
      ],
    },
    {
      categoryEn: 'Internal medicine',
      categoryMr: 'इंटरनल मेडिसिन व फिजिशियन उपचार',
      doctor: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      procedures: [
        { en: 'Diabetes complications, ketoacidosis and foot ulcers', mr: 'मधुमेहाची गुंतागुंत, कीटोअ‍ॅसिडोसिस व डायबेटिक फूट' },
        { en: 'Very high blood pressure and heart emergencies', mr: 'अति-उच्च रक्तदाब व आपत्कालीन हृदयविकार प्राथमिक उपचार' },
        { en: 'Dengue, malaria and other serious fevers', mr: 'डेंग्यू, मलेरिया, विषमज्वर व संसर्गजन्य ताप उपचार' },
        { en: 'COPD and severe asthma', mr: 'दमा, फुफ्फुसाचे आजार व श्वास लागणे' },
      ],
    },
  ];

  const processSteps = [
    {
      titleEn: 'Come to the Arogya Mitra desk',
      titleMr: 'आरोग्य मित्र कक्षात या',
      time: isMr ? 'सुमारे १५ मिनिटे' : 'About 15 minutes',
      descEn: 'The desk is at the ground floor entrance and is open 24 hours. Bring your ration card and Aadhaar card.',
      descMr: 'तळमजल्यावरील प्रवेशद्वाराजवळील कक्ष २४ तास सुरू असतो. मूळ रेशन कार्ड व आधार कार्ड सोबत आणा.',
    },
    {
      titleEn: 'Eligibility is checked online',
      titleMr: 'शासकीय पोर्टलवर पात्रता तपासणी',
      time: isMr ? '१५ ते ३० मिनिटे' : '15–30 minutes',
      descEn: 'The Arogya Mitra checks your family’s eligibility on the State Health Assurance Society (SHAS) portal and registers the patient.',
      descMr: 'आरोग्य मित्र शासकीय (SHAS) MJPJAY पोर्टलवर रेशन कार्डची पडताळणी करून रुग्णाची ऑनलाइन नोंदणी करतात.',
    },
    {
      titleEn: 'Doctor examines and requests approval',
      titleMr: 'डॉक्टरांकडून तपासणी व पूर्व-मंजुरी प्रस्ताव',
      time: isMr ? '१ ते २ तास' : '1–2 hours',
      descEn: 'Our specialist examines the patient, orders tests (X-ray, sonography, blood tests) and sends the approval request.',
      descMr: 'तज्ज्ञ डॉक्टर तपासणी करून आवश्यक चाचण्या (एक्स-रे, सोनोग्राफी, रक्त तपासणी) करतात आणि पूर्व-मंजुरीसाठी प्रस्ताव पाठवतात.',
    },
    {
      titleEn: 'Treatment at no cost',
      titleMr: 'मोफत शस्त्रक्रिया व उपचार',
      time: isMr ? 'दाखल असेपर्यंत' : 'During the stay',
      descEn: 'After the government medical officer approves, surgery, ICU stay, medicines and nursing care are free.',
      descMr: 'शासकीय मंजुरीनंतर शस्त्रक्रिया, ICU मुक्काम, औषधे, तपासण्या व नर्सिंग सेवा मोफत केल्या जातात.',
    },
    {
      titleEn: 'Discharge with 10 days of medicines',
      titleMr: 'डिस्चार्ज व १० दिवसांची मोफत औषधे',
      time: isMr ? 'डिस्चार्जच्या वेळी' : 'At discharge',
      descEn: 'You get the discharge summary, 10 days of medicines and a free follow-up OPD visit.',
      descMr: 'डिस्चार्ज समरी, १० दिवसांची मोफत औषधे आणि पुढील ओपीडी तपासणी मोफत दिली जाते.',
    },
  ];

  const eligibilityCards = [
    { en: 'Yellow ration card (BPL)', mr: 'पिवळे रेशन कार्ड (दारिद्र्यरेषेखालील - BPL)' },
    { en: 'Orange ration card (annual income up to ₹1 lakh)', mr: 'केशरी रेशन कार्ड (वार्षिक उत्पन्न ₹१ लाखापर्यंत)' },
    { en: 'Antyodaya Anna Yojana (AAY) or Annapurna card', mr: 'अंत्योदय अन्न योजना (AAY) किंवा अन्नपूर्णा रेशन कार्ड' },
  ];

  const documents = [
    {
      en: 'One ration card from the list above, with the patient’s or head of family’s name',
      mr: 'वरीलपैकी एक रेशन कार्ड, ज्यावर रुग्णाचे किंवा कुटुंबप्रमुखाचे नाव असावे',
    },
    { en: 'Original Aadhaar card of the patient and the attendant', mr: 'रुग्ण आणि नातेवाईकाचे मूळ आधार कार्ड' },
    { en: `${HOSPITAL.brand} OPD prescription or doctor’s referral letter`, mr: `${HOSPITAL.brandMr} ओपीडी प्रिस्क्रिप्शन / डॉक्टरांचे निदान पत्र` },
    { en: '2 recent passport-size photos of the patient', mr: 'रुग्णाचे २ पासपोर्ट आकाराचे फोटो' },
  ];

  const optionalDocuments = [
    { en: 'Earlier test reports (X-ray, CT, sonography, blood tests), which speed up approval', mr: 'मागील तपासणी अहवाल (एक्स-रे, सीटी, सोनोग्राफी, रक्त) — मंजुरी जलद होते' },
    { en: 'Voter ID or driving licence, if the Aadhaar address needs checking', mr: 'मतदान ओळखपत्र किंवा ड्रायव्हिंग लायसन्स (पत्ता पडताळणीसाठी)' },
  ];

  const sectionLinks = [
    { href: '#covered', label: isMr ? 'समाविष्ट उपचार' : 'Covered treatments' },
    { href: '#how-it-works', label: isMr ? 'प्रक्रिया' : 'How it works' },
    { href: '#documents', label: isMr ? 'कागदपत्रे' : 'Documents' },
    { href: '#register', label: isMr ? 'नोंदणी' : 'Register' },
  ];

  const wrap = 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना' : 'Free treatment under MJPJAY'}
        intro={
          isMr
            ? `पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी ${HOSPITAL.shortNameMr}, ${HOSPITAL.cityMr} येथे शस्त्रक्रिया, ICU आणि तज्ज्ञ उपचार मोफत. कुटुंबाला वर्षाला ₹५ लाखांपर्यंत संरक्षण. आमचा आरोग्य मित्र कक्ष कागदपत्रे व मंजुरीसाठी मदत करतो.`
            : `Families with a yellow or orange ration card can get surgery, ICU care and specialist treatment free at ${HOSPITAL.shortName}, ${HOSPITAL.city}, under the Mahatma Jyotirao Phule Jan Arogya Yojana. Cover is up to ₹5,00,000 per family each year. Our Arogya Mitra desk helps with the paperwork and approval.`
        }
        image={PHOTOS.reception}
        imageAlt={isMr ? 'हॉस्पिटलचा स्वागत कक्ष' : 'Hospital reception desk'}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-primary">
            <Phone className="w-4 h-4" />
            {isMr ? `आरोग्य मित्र: ${HOSPITAL.phones.reception.display}` : `Arogya Mitra: ${HOSPITAL.phones.reception.display}`}
          </a>
          <a href="#register" className="btn-secondary">
            {isMr ? 'मदतीसाठी नोंदणी करा' : 'Register for help'}
          </a>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {isMr
            ? 'आरोग्य मित्र कक्ष, तळमजला, रूम १०२ · सोम–शनि सकाळी ९ ते संध्या. ६ · आपत्कालीन २४ तास'
            : 'Arogya Mitra desk, ground floor, room 102 · Mon–Sat 9 am – 6 pm · Emergencies 24 hours'}
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

      {/* Who can use it */}
      <section className={`${wrap} py-12 sm:py-16`}>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <SectionTitle title={isMr ? 'कोण पात्र आहे' : 'Who can use the scheme'} />
            <ul className="list-disc pl-5 space-y-2 text-[15px] text-stone-700">
              {eligibilityCards.map((c) => (
                <li key={c.en}>{isMr ? c.mr : c.en}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:pt-14">
            <p className="card-notice-amber text-sm leading-relaxed">
              {isMr
                ? 'पात्रता, उपचारांची व्याप्ती आणि मोफत उपचार हे शासनाचे नियम आणि आरोग्य मित्र कक्षाकडून मिळणाऱ्या पूर्व-मंजुरीनुसार ठरतात. यासाठी वैध रेशन कार्ड व आधार कार्ड आवश्यक आहे.'
                : 'Eligibility, what is covered and free treatment all depend on government scheme rules and approval through the Arogya Mitra desk. A valid ration card and Aadhaar card are needed.'}
            </p>
          </div>
        </div>
      </section>

      {/* Covered treatments */}
      <section id="covered" className="bg-white border-y border-[#E7E3DA] scroll-mt-16 md:scroll-mt-24 lg:scroll-mt-28">
        <div className={`${wrap} py-12 sm:py-16`}>
          <SectionTitle
            title={isMr ? `${HOSPITAL.shortNameMr}मध्ये समाविष्ट उपचार` : `Treatments covered at ${HOSPITAL.brand}`}
            sub={
              isMr
                ? 'तपासण्या आणि औषधे पॅकेजमध्ये समाविष्ट आहेत.'
                : 'Tests and medicines are included in the package.'
            }
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proceduresData.map((cat) => (
              <div key={cat.categoryEn} className="card-clean p-6">
                <h3 className="text-lg leading-snug">{isMr ? cat.categoryMr : cat.categoryEn}</h3>
                <p className="mt-1 text-sm text-stone-500">{cat.doctor}</p>
                <ul className="mt-4 list-disc pl-5 space-y-1.5 text-[15px] text-stone-700">
                  {cat.procedures.map((proc) => (
                    <li key={proc.en}>{isMr ? proc.mr : proc.en}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-stone-600 max-w-2xl">
            {isMr
              ? 'MJPJAY अंतर्गत ९९६ हून अधिक उपचार समाविष्ट आहेत. आपला उपचार यादीत नसेल तर आरोग्य मित्र कक्षाला विचारा: '
              : 'More than 996 treatments are covered under MJPJAY. If yours is not listed, ask the Arogya Mitra desk: '}
            <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] hover:underline whitespace-nowrap">
              {HOSPITAL.phones.reception.display}
            </a>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={`${wrap} py-12 sm:py-16 scroll-mt-16 md:scroll-mt-24 lg:scroll-mt-28`}>
        <SectionTitle
          title={isMr ? 'मोफत उपचार कसे मिळतात' : 'How it works'}
          sub={isMr ? 'हॉस्पिटलमध्ये आल्यापासून डिस्चार्जपर्यंत.' : 'From arriving at the hospital to going home.'}
        />
        <ol className="max-w-3xl divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
          {processSteps.map((step, i) => (
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
      </section>

      {/* Documents */}
      <section id="documents" className="bg-white border-y border-[#E7E3DA] scroll-mt-16 md:scroll-mt-24 lg:scroll-mt-28">
        <div className={`${wrap} py-12 sm:py-16`}>
          <SectionTitle
            title={isMr ? 'सोबत आणायची कागदपत्रे' : 'Documents to bring'}
            sub={
              isMr
                ? 'मूळ कागदपत्रे आणि प्रत्येकी २ झेरॉक्स प्रती सोबत ठेवा.'
                : 'Bring the originals and 2 photocopies of each.'
            }
          />
          <div className="grid lg:grid-cols-2 gap-10">
            <ol className="space-y-3 text-[15px] text-stone-700">
              {documents.map((doc, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-heading text-[#0F766E] w-5 shrink-0">{i + 1}.</span>
                  <span>{isMr ? doc.mr : doc.en}</span>
                </li>
              ))}
            </ol>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg">{isMr ? 'असल्यास सोबत आणा' : 'Also helpful'}</h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px] text-stone-700">
                  {optionalDocuments.map((doc, i) => (
                    <li key={i}>{isMr ? doc.mr : doc.en}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg">
                  {isMr ? 'रेशन कार्डवर रुग्णाचे नाव नसल्यास' : 'If the patient’s name is not on the ration card'}
                </h3>
                <p className="mt-2 text-[15px] text-stone-700 leading-relaxed">
                  {isMr
                    ? 'विवाह नोंदणी प्रमाणपत्र (विवाहित महिलांसाठी) किंवा तहसीलदार कार्यालयाचा दाखला आणा. आरोग्य मित्र कक्ष विशेष मंजुरीसाठी मदत करेल.'
                    : 'Bring a marriage certificate (for married women) or a residence certificate from the Tehsildar. The Arogya Mitra desk can then request special approval.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className={`${wrap} py-12 sm:py-16 scroll-mt-16 md:scroll-mt-24 lg:scroll-mt-28`}>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionTitle
              title={isMr ? 'आरोग्य मित्र कक्षाकडे नोंदणी' : 'Register with the Arogya Mitra desk'}
              sub={
                isMr
                  ? 'हा फॉर्म भरा. आमचे आरोग्य मित्र १५ मिनिटांत फोन करून पात्रता तपासतील.'
                  : 'Fill in this form and an Arogya Mitra will call you within 15 minutes to check eligibility.'
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
            {submitted ? (
              <div role="status" className="py-4">
                <h3 className="text-xl text-[#0F766E]">
                  {isMr ? 'आपला अर्ज मिळाला' : 'Your request has been sent'}
                </h3>
                <p className="mt-2 text-stone-600 max-w-md">
                  {isMr
                    ? 'आपला अर्ज आरोग्य मित्र कक्षाकडे पोहोचला आहे. आमचा प्रतिनिधी लवकरच फोन करेल.'
                    : 'The Arogya Mitra desk has your request. Someone will call you shortly.'}
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary mt-5">
                  {isMr ? 'दुसरा अर्ज भरा' : 'Register another patient'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="mj-name" className={labelClass}>
                      {isMr ? 'रुग्णाचे पूर्ण नाव *' : 'Patient’s full name *'}
                    </label>
                    <input
                      id="mj-name"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder={isMr ? 'उदा. ज्ञानेश्वर जाधव' : 'e.g. Dnyaneshwar Jadhav'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mj-phone" className={labelClass}>
                      {isMr ? 'मोबाईल नंबर (१० अंकी) *' : 'Mobile number (10 digits) *'}
                    </label>
                    <input
                      id="mj-phone"
                      required
                      type="tel"
                      maxLength={10}
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mj-age" className={labelClass}>
                      {isMr ? 'रुग्णाचे वय (वर्षे) *' : 'Patient’s age *'}
                    </label>
                    <input
                      id="mj-age"
                      required
                      type="number"
                      min={0}
                      max={120}
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      placeholder="45"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mj-aadhaar" className={labelClass}>
                      {isMr ? 'आधार कार्डचे शेवटचे ४ अंक *' : 'Last 4 digits of Aadhaar *'}
                    </label>
                    <input
                      id="mj-aadhaar"
                      required
                      maxLength={4}
                      inputMode="numeric"
                      value={formData.aadhaarLast4}
                      onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                      placeholder="4567"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mj-ration" className={labelClass}>
                      {isMr ? 'रेशन कार्ड नंबर (पिवळे / केशरी) *' : 'Ration card number (yellow or orange) *'}
                    </label>
                    <input
                      id="mj-ration"
                      required
                      value={formData.rationCardNumber}
                      onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
                      placeholder="MH/JLN/1234567"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mj-amount" className={labelClass}>
                      {isMr ? 'अंदाजित उपचार खर्च ₹ (पर्यायी)' : 'Estimated treatment cost ₹ (optional)'}
                    </label>
                    <input
                      id="mj-amount"
                      type="number"
                      value={formData.estimatedAmount}
                      onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                      placeholder="50000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mj-diagnosis" className={labelClass}>
                    {isMr ? 'आजार / आवश्यक शस्त्रक्रिया *' : 'Illness or recommended surgery *'}
                  </label>
                  <textarea
                    id="mj-diagnosis"
                    required
                    rows={3}
                    value={formData.diagnosisDescription}
                    onChange={(e) => setFormData({ ...formData, diagnosisDescription: e.target.value })}
                    placeholder={
                      isMr
                        ? 'उदा. गुडघे प्रत्यारोपण किंवा हर्निया शस्त्रक्रिया'
                        : 'e.g. knee replacement, hernia repair, NICU admission'
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-[#C62828] bg-[#FDF1F0] border border-[#F3D3CF] rounded-md px-3.5 py-3">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                  {loading
                    ? isMr
                      ? 'पाठवत आहे...'
                      : 'Sending...'
                    : isMr
                      ? 'नोंदणी पाठवा'
                      : 'Send registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
