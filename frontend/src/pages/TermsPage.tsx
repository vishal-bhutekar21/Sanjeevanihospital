import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '../components/ui';
import { HOSPITAL } from '../config/hospital';

const WRAP = 'max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8';
const MR_DIGITS = '०१२३४५६७८९';
const num = (n: number, mr: boolean) => (mr ? String(n).replace(/\d/g, (d) => MR_DIGITS[Number(d)]) : String(n));
const LINK = 'text-[#0F766E] underline underline-offset-2 hover:text-[#0B5D57]';

type Section = { id: string; title: string; body: React.ReactNode };

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-3 leading-relaxed text-stone-700">{children}</p>
);
const UL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-stone-400 leading-relaxed text-stone-700">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

/** Terms of use for the website, online booking and Patient login. */
export const TermsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const L = (en: string, mr: string) => (isMr ? mr : en);

  const name = isMr ? HOSPITAL.nameMr : HOSPITAL.name;
  const city = isMr ? HOSPITAL.cityMr : HOSPITAL.city;
  const tel = (p: { tel: string; display: string; short?: string; shortMr?: string }) => (
    <a href={`tel:${p.tel}`} className={`${LINK} whitespace-nowrap`}>
      {isMr && p.shortMr ? p.shortMr : p.display}
    </a>
  );
  const emergencyTel = tel(HOSPITAL.phones.emergency);
  const receptionTel = tel(HOSPITAL.phones.reception);

  const sections: Section[] = [
    {
      id: 'about',
      title: L('About this website', 'या वेबसाइटबद्दल'),
      body: (
        <P>
          {isMr
            ? `ही वेबसाइट ${name}, ${city} ची आहे. येथे हॉस्पिटल, डॉक्टर, विभाग आणि योजनांची माहिती आहे, तसेच ओपीडी अपॉइंटमेंट बुक करण्याची आणि रुग्ण लॉगिनमध्ये तुमच्या नोंदी पाहण्याची सोय आहे. वेबसाइट वापरून तुम्ही या अटी मान्य करता. तुमची माहिती आम्ही कशी वापरतो ते `
            : `This website belongs to ${name}, ${city}. It gives information about the hospital, its doctors, departments and schemes, and lets you book OPD appointments and see your records in Patient login. By using the website you agree to these terms. How we use your information is explained in our `}
          <Link to="/privacy" className={LINK}>
            {L('privacy policy', 'गोपनीयता धोरणात')}
          </Link>
          {L('.', ' दिले आहे.')}
        </P>
      ),
    },
    {
      id: 'emergencies',
      title: L('Not for emergencies', 'आपत्कालीन परिस्थितीसाठी नाही'),
      body: (
        <>
          <P>
            {L(
              'Do not use online booking or the website in an emergency. Call our emergency line ',
              'आपत्कालीन परिस्थितीत ऑनलाइन बुकिंग किंवा वेबसाइट वापरू नका. आमच्या आपत्कालीन नंबरवर फोन करा: '
            )}
            {emergencyTel}
            {L(
              ` (${HOSPITAL.opdHours.emergency.en.toLowerCase()}), or call 108 for a government ambulance.`,
              ` (${HOSPITAL.opdHours.emergency.mr}), किंवा सरकारी रुग्णवाहिकेसाठी १०८ वर फोन करा.`
            )}
          </P>
          <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="btn-emergency mt-4">
            {L('Call emergency', 'आपत्कालीन फोन')} {isMr ? HOSPITAL.phones.emergency.shortMr : HOSPITAL.phones.emergency.short}
          </a>
        </>
      ),
    },
    {
      id: 'appointments',
      title: L('Appointments and token times', 'अपॉइंटमेंट आणि टोकनची वेळ'),
      body: (
        <UL
          items={[
            L(
              'The token number and time you get are an estimate. You may have to wait longer if earlier patients need more time or an emergency comes in.',
              'तुम्हाला मिळालेला टोकन नंबर आणि वेळ अंदाजे आहे. आधीच्या रुग्णांना जास्त वेळ लागल्यास किंवा आपत्कालीन रुग्ण आल्यास तुम्हाला जास्त थांबावे लागू शकते.'
            ),
            L(
              'Doctors’ timings can change, for example because of surgery or leave. Reception may call you to move or change your appointment.',
              'डॉक्टरांच्या वेळा बदलू शकतात, उदा. शस्त्रक्रिया किंवा रजेमुळे. तुमची अपॉइंटमेंट बदलण्यासाठी रिसेप्शनमधून तुम्हाला फोन येऊ शकतो.'
            ),
            L(
              'Please arrive 15 minutes before your time and bring your slip (on paper or on your phone) and any old reports.',
              'कृपया तुमच्या वेळेच्या १५ मिनिटे आधी या आणि तुमची स्लिप (कागदावर किंवा फोनवर) व जुने रिपोर्ट सोबत आणा.'
            ),
          ]}
        />
      ),
    },
    {
      id: 'fees',
      title: L('Fees, payments and cancellations', 'शुल्क, पेमेंट आणि रद्द करणे'),
      body: (
        <UL
          items={[
            L(
              'Consultation fees are as shown on the website at the time of booking, or as told at the counter. Tests, medicines and procedures are charged separately.',
              'तपासणी शुल्क बुकिंगच्या वेळी वेबसाइटवर दाखवल्याप्रमाणे किंवा काउंटरवर सांगितल्याप्रमाणे असते. चाचण्या, औषधे आणि उपचारांचे शुल्क वेगळे असते.'
            ),
            L(
              'Online payments are processed by Razorpay. The hospital does not see or store your card, bank or UPI details.',
              'ऑनलाइन पेमेंट Razorpay द्वारे होते. हॉस्पिटलला तुमचे कार्ड, बँक किंवा UPI तपशील दिसत नाहीत आणि ते साठवले जात नाहीत.'
            ),
            <>
              {L('To change or cancel an appointment, call reception on ', 'अपॉइंटमेंट बदलण्यासाठी किंवा रद्द करण्यासाठी रिसेप्शनला फोन करा: ')}
              {receptionTel}
              {L('.', '.')}
            </>,
            L(
              'Refunds for cancelled visits that were paid online are handled by the hospital accounts desk as per hospital policy.',
              'ऑनलाइन पैसे भरलेल्या आणि रद्द झालेल्या भेटींचा परतावा हॉस्पिटलच्या धोरणानुसार हॉस्पिटलचा अकाउंट्स विभाग पाहतो.'
            ),
          ]}
        />
      ),
    },
    {
      id: 'accurate-information',
      title: L('Giving correct information', 'योग्य माहिती देणे'),
      body: (
        <P>
          {L(
            'Please give the patient’s correct name, age and mobile number. Wrong details can delay your visit, your bills or your scheme claim. Only book with a mobile number you or your family can answer.',
            'कृपया रुग्णाचे योग्य नाव, वय आणि मोबाइल नंबर द्या. चुकीच्या माहितीमुळे तुमची भेट, बिले किंवा योजनेचा दावा लांबू शकतो. तुम्ही किंवा तुमचे कुटुंब उत्तर देऊ शकेल अशाच मोबाइल नंबरने बुकिंग करा.'
          )}
        </P>
      ),
    },
    {
      id: 'patient-login',
      title: L('Patient login', 'रुग्ण लॉगिन'),
      body: (
        <UL
          items={[
            L(
              'Patient login is only for the patient, or a parent or guardian on the patient’s behalf.',
              'रुग्ण लॉगिन फक्त रुग्णासाठी, किंवा रुग्णाच्या वतीने पालक किंवा संरक्षकांसाठी आहे.'
            ),
            L(
              'Anyone with your phone can receive your sign-in code. Keep your phone locked, do not share the code, and sign out on a shared phone.',
              'तुमचा फोन ज्याच्याकडे असेल त्याला साइन-इन कोड मिळू शकतो. फोन लॉक ठेवा, कोड कोणालाही सांगू नका आणि इतरांसोबत वापरलेल्या फोनवर साइन आउट करा.'
            ),
            L(
              'If you think someone else has seen your records, tell reception.',
              'तुमच्या नोंदी दुसऱ्या कोणी पाहिल्या असे वाटल्यास रिसेप्शनला कळवा.'
            ),
          ]}
        />
      ),
    },
    {
      id: 'medical-information',
      title: L('Medical information on this site', 'या साइटवरील वैद्यकीय माहिती'),
      body: (
        <P>
          {L(
            'Health information on this website is general. It is not a diagnosis and does not replace a visit to a doctor. Always follow the advice your doctor gives you in person.',
            'या वेबसाइटवरील आरोग्य माहिती सर्वसाधारण आहे. ते निदान नाही आणि डॉक्टरांच्या भेटीला पर्याय नाही. डॉक्टरांनी प्रत्यक्ष दिलेला सल्लाच नेहमी पाळा.'
          )}
        </P>
      ),
    },
    {
      id: 'schemes',
      title: L('Government schemes', 'सरकारी योजना'),
      body: (
        <P>
          {L(
            'Whether a patient can be treated under MJPJAY or PM-JAY, and what is covered, is decided by the scheme’s rules and approval, not by this website. Sending a request online does not mean it is approved. The Arogya Mitra desk will guide you.',
            'रुग्णाला MJPJAY किंवा PM-JAY अंतर्गत उपचार मिळतील का आणि त्यात काय समाविष्ट आहे, हे योजनेच्या नियमांनुसार आणि मंजुरीनुसार ठरते, या वेबसाइटवरून नाही. ऑनलाइन विनंती पाठवली म्हणजे ती मंजूर झाली असे नाही. आरोग्य मित्र कक्ष तुम्हाला मार्गदर्शन करेल.'
          )}{' '}
          <Link to="/mjpjay" className={LINK}>
            {L('Read about the schemes', 'योजनांबद्दल वाचा')}
          </Link>
          {L('.', '.')}
        </P>
      ),
    },
    {
      id: 'acceptable-use',
      title: L('Using the website fairly', 'वेबसाइटचा योग्य वापर'),
      body: (
        <>
          <P>{L('Please do not:', 'कृपया हे करू नका:')}</P>
          <UL
            items={[
              L('book appointments in someone else’s name without their permission, or make fake bookings;', 'परवानगीशिवाय दुसऱ्याच्या नावाने अपॉइंटमेंट बुक करणे किंवा खोटे बुकिंग करणे;'),
              L('try to see other people’s records or get into the staff system;', 'इतरांच्या नोंदी पाहण्याचा किंवा कर्मचाऱ्यांच्या प्रणालीत घुसण्याचा प्रयत्न करणे;'),
              L('post false, abusive or misleading reviews;', 'खोटे, अपमानास्पद किंवा दिशाभूल करणारे अभिप्राय देणे;'),
              L('overload or disrupt the website or booking system.', 'वेबसाइट किंवा बुकिंग प्रणालीवर जास्त भार टाकणे किंवा ती बिघडवणे.'),
            ]}
          />
          <P>
            {L(
              'We may cancel bookings or remove reviews that break these rules.',
              'या नियमांचे उल्लंघन करणारे बुकिंग आम्ही रद्द करू शकतो किंवा अभिप्राय काढू शकतो.'
            )}
          </P>
        </>
      ),
    },
    {
      id: 'content',
      title: L('Content on this website', 'वेबसाइटवरील मजकूर'),
      body: (
        <P>
          {L(
            'The text, photos and logo on this website belong to the hospital or are used with permission. Please do not copy them for other purposes without asking us.',
            'या वेबसाइटवरील मजकूर, फोटो आणि लोगो हॉस्पिटलचे आहेत किंवा परवानगीने वापरले आहेत. आम्हाला विचारल्याशिवाय ते इतर कामासाठी वापरू नका.'
          )}
        </P>
      ),
    },
    {
      id: 'limits',
      title: L('Limits of the website', 'वेबसाइटच्या मर्यादा'),
      body: (
        <P>
          {L(
            'We work to keep the website correct and running, but it may sometimes be unavailable, or a timing or fee may be out of date. If something on the website differs from what reception tells you, what reception says applies. The hospital is not responsible for loss caused only by the website being unavailable or by a mistake on it, as far as the law allows. This does not affect your rights as a patient under Indian law.',
            'वेबसाइट बरोबर आणि चालू ठेवण्याचा आम्ही प्रयत्न करतो, पण कधी ती बंद असू शकते किंवा एखादी वेळ किंवा शुल्क जुने असू शकते. वेबसाइटवरील माहिती आणि रिसेप्शनने सांगितलेली माहिती वेगळी असल्यास रिसेप्शनने सांगितलेली माहिती लागू होईल. कायदा परवानगी देतो तेवढ्या मर्यादेत, केवळ वेबसाइट बंद असल्याने किंवा तिच्यातील चुकीमुळे झालेल्या नुकसानीस हॉस्पिटल जबाबदार नाही. भारतीय कायद्यानुसार रुग्ण म्हणून तुमच्या अधिकारांवर याचा परिणाम होत नाही.'
          )}
        </P>
      ),
    },
    {
      id: 'law',
      title: L('Governing law', 'लागू कायदा'),
      body: (
        <P>
          {isMr
            ? `या अटींना भारताचे कायदे लागू आहेत. कोणताही वाद ${HOSPITAL.cityMr} येथील न्यायालयांत चालेल.`
            : `These terms are governed by the laws of India. Any dispute will be handled by the courts at ${HOSPITAL.city}.`}
        </P>
      ),
    },
    {
      id: 'changes',
      title: L('Changes to these terms', 'या अटींमधील बदल'),
      body: (
        <P>
          {L(
            'We may update these terms. The date at the top of this page shows when they last changed.',
            'आम्ही या अटी बदलू शकतो. शेवटचा बदल केव्हा झाला ते या पानाच्या वरील तारखेवरून कळेल.'
          )}
        </P>
      ),
    },
    {
      id: 'contact',
      title: L('Contact', 'संपर्क'),
      body: (
        <UL
          items={[
            <>
              {L('Reception: ', 'रिसेप्शन: ')}
              {receptionTel}
            </>,
            <>
              {L('Email: ', 'ईमेल: ')}
              <a href={`mailto:${HOSPITAL.emails.main}`} className={`${LINK} break-all`}>
                {HOSPITAL.emails.main}
              </a>
            </>,
            <>
              {L('Address: ', 'पत्ता: ')}
              {isMr ? HOSPITAL.address.mr : HOSPITAL.address.en}
            </>,
          ]}
        />
      ),
    },
  ];

  return (
    <div className="bg-[#FAF8F4]">
      <PageIntro
        title={L('Terms of use', 'वापराच्या अटी')}
        intro={
          <>
            {L(
              'The rules for using our website, booking an appointment online and using Patient login.',
              'आमची वेबसाइट वापरणे, ऑनलाइन अपॉइंटमेंट बुक करणे आणि रुग्ण लॉगिन वापरण्याचे नियम.'
            )}
            <span className="block mt-3 text-base text-stone-500">
              {L('Last updated: 24 October 2026', 'शेवटचा बदल: २४ ऑक्टोबर २०२६')}
            </span>
          </>
        }
      />
      <div className={`${WRAP} py-10 sm:py-14`}>
        <nav aria-labelledby="toc-title" className="card-clean p-5 sm:p-6">
          <h2 id="toc-title" className="text-[1.125rem] leading-snug">
            {L('On this page', 'या पानावर')}
          </h2>
          <ol className={`mt-3 space-y-1 pl-5 marker:text-stone-500 ${isMr ? '[list-style-type:devanagari]' : 'list-decimal'}`}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={`${LINK} inline-block py-1.5`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-10 scroll-mt-20 lg:scroll-mt-24">
            <h2 id={`${s.id}-h`} className="text-[1.375rem] sm:text-[1.625rem] leading-tight">
              <span className="text-stone-400 mr-2">{num(i + 1, isMr)}.</span>
              {s.title}
            </h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
};
