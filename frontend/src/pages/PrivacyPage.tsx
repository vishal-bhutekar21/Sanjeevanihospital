import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '../components/ui';
import { HOSPITAL } from '../config/hospital';

const WRAP = 'max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8';
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
const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-6 text-[1.125rem] leading-snug">{children}</h3>
);

/** Privacy policy: describes what this website and its booking system actually collect and why. */
export const PrivacyPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const L = (en: string, mr: string) => (isMr ? mr : en);

  const name = isMr ? HOSPITAL.nameMr : HOSPITAL.name;
  const receptionTel = (
    <a href={`tel:${HOSPITAL.phones.reception.tel}`} className={LINK}>
      {isMr ? HOSPITAL.phones.reception.shortMr : HOSPITAL.phones.reception.display}
    </a>
  );
  const email = (
    <a href={`mailto:${HOSPITAL.emails.main}`} className={`${LINK} break-all`}>
      {HOSPITAL.emails.main}
    </a>
  );
  const portalLink = (
    <Link to="/patient" className={LINK}>
      {L('Patient login', 'रुग्ण लॉगिन')}
    </Link>
  );

  const sections: Section[] = [
    {
      id: 'who-we-are',
      title: L('Who we are', 'आम्ही कोण आहोत'),
      body: (
        <P>
          {isMr
            ? `हे धोरण ${name}, ${HOSPITAL.cityMr} ची वेबसाइट, ऑनलाइन ओपीडी बुकिंग, रुग्ण लॉगिन आणि हॉस्पिटल कर्मचाऱ्यांची प्रणाली यांना लागू आहे. यात आम्ही कोणती माहिती घेतो, का घेतो, कुठे ठेवतो आणि तुम्ही काय करू शकता हे सोप्या शब्दांत सांगितले आहे.`
            : `This policy covers the website, online OPD booking, Patient login and staff system of ${name}, ${HOSPITAL.city}. It explains in plain words what information we collect, why, where it is kept and what you can do about it.`}
        </P>
      ),
    },
    {
      id: 'what-we-collect',
      title: L('What we collect', 'आम्ही कोणती माहिती घेतो'),
      body: (
        <>
          <P>
            {L(
              'We only ask for what we need to look after you. Here is everything the system collects, and when.',
              'तुमची काळजी घेण्यासाठी जेवढी गरज आहे तेवढीच माहिती आम्ही घेतो. प्रणाली कोणती माहिती आणि केव्हा घेते ते खाली दिले आहे.'
            )}
          </P>
          <H3>{L('When you book online', 'ऑनलाइन बुकिंग करताना')}</H3>
          <UL
            items={[
              L('Patient’s name, age and gender.', 'रुग्णाचे नाव, वय आणि लिंग.'),
              L('Town or village.', 'गाव किंवा शहर.'),
              L('Reason for the visit, only if you choose to write one.', 'भेटीचे कारण — तुम्ही लिहिले तरच.'),
              L('Mobile number, which we check with a one-time SMS code.', 'मोबाइल नंबर — एकदाच वापरायच्या SMS कोडने तपासला जातो.'),
              L('The doctor, date and time you chose, and the payment status if you pay online.', 'तुम्ही निवडलेले डॉक्टर, दिवस, वेळ आणि ऑनलाइन पैसे भरल्यास पेमेंटची स्थिती.'),
            ]}
          />
          <H3>{L('When you use Patient login', 'रुग्ण लॉगिन वापरताना')}</H3>
          <UL
            items={[
              L('Your mobile number, to send you a sign-in code.', 'साइन-इन कोड पाठवण्यासाठी तुमचा मोबाइल नंबर.'),
              L(
                'Profile details you choose to add: age, gender, blood group, allergies, long-term conditions and an emergency contact (name and phone).',
                'तुम्ही स्वतः भरलेली प्रोफाइल माहिती: वय, लिंग, रक्तगट, ॲलर्जी, दीर्घकालीन आजार आणि आपत्कालीन संपर्क (नाव व फोन).'
              ),
            ]}
          />
          <H3>{L('What hospital staff add to your record', 'हॉस्पिटल कर्मचारी तुमच्या नोंदीत काय जोडतात')}</H3>
          <UL
            items={[
              L('Bills and receipts.', 'बिले आणि पावत्या.'),
              L('Medicines prescribed and how to take them.', 'दिलेली औषधे आणि ती कशी घ्यायची.'),
              L('Lab test results.', 'लॅब तपासणीचे निकाल.'),
              L('Follow-up visit dates.', 'पुढच्या तपासणीच्या तारखा.'),
            ]}
          />
          <H3>{L('When you register at reception', 'रिसेप्शनवर नोंदणी करताना')}</H3>
          <UL
            items={[
              L(
                'Name, mobile number, age or date of birth, gender, and any scheme or insurance you use.',
                'नाव, मोबाइल नंबर, वय किंवा जन्मतारीख, लिंग आणि तुम्ही वापरत असलेली योजना किंवा विमा.'
              ),
              L(
                'Optional: address, Aadhaar or ABHA number, someone to call in an emergency, and notes such as allergies. You may say no to any of these.',
                'ऐच्छिक: पत्ता, आधार किंवा ABHA नंबर, आपत्कालीन संपर्क व्यक्ती आणि ॲलर्जीसारख्या नोंदी. यापैकी काहीही देण्यास तुम्ही नकार देऊ शकता.'
              ),
            ]}
          />
          <H3>{L('When you send a scheme claim request (MJPJAY / PM-JAY)', 'योजना दावा अर्ज पाठवताना (MJPJAY / PM-JAY)')}</H3>
          <UL
            items={[
              L(
                'Patient’s name, mobile number and age, ration card number, a short description of the illness or planned treatment, and an estimated amount if known.',
                'रुग्णाचे नाव, मोबाइल नंबर, वय, रेशन कार्ड नंबर, आजार किंवा नियोजित उपचारांचे थोडक्यात वर्णन आणि माहीत असल्यास अंदाजित रक्कम.'
              ),
              L(
                'Only the last 4 digits of the Aadhaar number. The website never stores the full Aadhaar number from this form.',
                'आधार नंबरचे फक्त शेवटचे ४ अंक. या फॉर्ममधून पूर्ण आधार नंबर वेबसाइट कधीही साठवत नाही.'
              ),
            ]}
          />
          <H3>{L('When you write a review', 'अभिप्राय लिहिताना')}</H3>
          <UL
            items={[
              L(
                'Your name, star rating and review text, and optionally your town and the doctor or department. Staff read each review before it is shown on the website.',
                'तुमचे नाव, स्टार रेटिंग आणि अभिप्राय, तसेच ऐच्छिक गाव आणि डॉक्टर किंवा विभाग. वेबसाइटवर दाखवण्यापूर्वी कर्मचारी प्रत्येक अभिप्राय वाचतात.'
              ),
            ]}
          />
          <H3>{L('Technical information', 'तांत्रिक माहिती')}</H3>
          <P>
            {L(
              'To stop misuse, the server counts requests from each internet connection (for example, how many SMS codes were asked for) for a short time. Staff actions in the admin panel are logged so that changes can be traced.',
              'गैरवापर टाळण्यासाठी सर्व्हर प्रत्येक इंटरनेट कनेक्शनवरून आलेल्या विनंत्या (उदा. किती SMS कोड मागितले) थोड्या काळासाठी मोजतो. ॲडमिन पॅनलमधील कर्मचाऱ्यांच्या कृतींची नोंद ठेवली जाते, जेणेकरून बदल कोणी केला ते कळते.'
            )}
          </P>
        </>
      ),
    },
    {
      id: 'why',
      title: L('Why we use it', 'माहिती का वापरतो'),
      body: (
        <>
          <UL
            items={[
              L('To book and manage your appointments and tokens.', 'तुमच्या अपॉइंटमेंट आणि टोकन बुक करणे व सांभाळणे.'),
              L('To contact you about your visit, for example if a doctor’s timing changes.', 'तुमच्या भेटीबद्दल तुमच्याशी संपर्क करणे, उदा. डॉक्टरांची वेळ बदलल्यास.'),
              L('To prepare bills and receipts.', 'बिले आणि पावत्या तयार करणे.'),
              L('To show your medicines and remind you of doses and follow-up dates.', 'तुमची औषधे दाखवणे आणि डोस व पुढच्या तपासणीची आठवण करून देणे.'),
              L('To process government scheme and insurance claims.', 'सरकारी योजना आणि विमा दावे पुढे नेणे.'),
              L('To improve our service, for example by reading reviews.', 'आमची सेवा सुधारणे, उदा. अभिप्राय वाचून.'),
            ]}
          />
          <P>
            {L(
              'We do not sell your information. We do not use it for advertising, and the website has no advertising trackers.',
              'आम्ही तुमची माहिती विकत नाही. ती जाहिरातींसाठी वापरत नाही आणि वेबसाइटवर जाहिरातींसाठी कोणतेही ट्रॅकर नाहीत.'
            )}
          </P>
        </>
      ),
    },
    {
      id: 'where',
      title: L('Where it is kept and who helps us', 'माहिती कुठे ठेवली जाते आणि कोण मदत करते'),
      body: (
        <>
          <UL
            items={[
              L(
                'Cloudflare: our booking server (Cloudflare Workers) and database (Cloudflare D1) run on Cloudflare. Your information is stored there by Cloudflare as our service provider.',
                'Cloudflare: आमचा बुकिंग सर्व्हर (Cloudflare Workers) आणि डेटाबेस (Cloudflare D1) Cloudflare वर चालतात. तुमची माहिती आमचा सेवा पुरवठादार म्हणून Cloudflare कडे साठवली जाते.'
              ),
              L(
                'Razorpay: online payments are handled by Razorpay. We never see your full card, bank or UPI details; we only receive whether the payment succeeded and its reference number.',
                'Razorpay: ऑनलाइन पेमेंट Razorpay द्वारे होते. तुमचे पूर्ण कार्ड, बँक किंवा UPI तपशील आम्हाला कधीच दिसत नाहीत; पेमेंट यशस्वी झाले की नाही आणि त्याचा संदर्भ क्रमांक एवढेच आम्हाला मिळते.'
              ),
              L(
                'MSG91: sign-in and booking codes are sent by SMS through MSG91, which receives your mobile number for this.',
                'MSG91: साइन-इन आणि बुकिंगचे कोड MSG91 मार्फत SMS ने पाठवले जातात; त्यासाठी त्यांना तुमचा मोबाइल नंबर मिळतो.'
              ),
              L(
                'WhatsApp: only if you choose to send us a booking request on WhatsApp. The website opens WhatsApp with a ready message; nothing is sent until you press send.',
                'WhatsApp: तुम्ही स्वतः WhatsApp वर बुकिंग विनंती पाठवायचे ठरवले तरच. वेबसाइट तयार संदेशासह WhatsApp उघडते; तुम्ही “पाठवा” दाबेपर्यंत काहीही जात नाही.'
              ),
            ]}
          />
          <H3>{L('Stored on your own phone or computer', 'तुमच्या स्वतःच्या फोन किंवा संगणकावर साठवलेले')}</H3>
          <UL
            items={[
              L('Your language choice (English or Marathi).', 'तुमची भाषा निवड (इंग्रजी किंवा मराठी).'),
              L('Your Patient login sign-in, so you stay signed in until you sign out.', 'रुग्ण लॉगिनचे साइन-इन, जेणेकरून साइन आउट करेपर्यंत तुम्ही लॉगिन राहता.'),
              L(
                'Medicine dose ticks and which reminders were already shown. These stay only on your phone and are not sent to the hospital.',
                'औषधांच्या डोसवरील खुणा आणि कोणती आठवण आधीच दाखवली ती माहिती. ही फक्त तुमच्या फोनवर राहते, हॉस्पिटलकडे पाठवली जात नाही.'
              ),
            ]}
          />
          <P>
            {L(
              'If you share your phone with others, sign out of Patient login after use.',
              'तुमचा फोन इतरही वापरत असतील तर वापरानंतर रुग्ण लॉगिनमधून साइन आउट करा.'
            )}
          </P>
        </>
      ),
    },
    {
      id: 'security',
      title: L('How we keep it safe', 'माहिती सुरक्षित कशी ठेवतो'),
      body: (
        <UL
          items={[
            L('Patients sign in with a one-time code sent by SMS to their own mobile number.', 'रुग्ण त्यांच्या स्वतःच्या मोबाइलवर SMS ने आलेल्या एकदाच वापरायच्या कोडने साइन इन करतात.'),
            L('Codes are stored only in a scrambled (hashed) form, expire quickly and allow only a few tries.', 'कोड फक्त बदललेल्या (हॅश) स्वरूपात साठवले जातात, लवकर संपतात आणि काहीच प्रयत्नांची मुभा असते.'),
            L('In Patient login you can see only the records linked to your own mobile number.', 'रुग्ण लॉगिनमध्ये तुम्हाला फक्त तुमच्या मोबाइल नंबरशी जोडलेल्या नोंदी दिसतात.'),
            L('Hospital staff sign in with their own accounts, and each person sees only what their role needs (for example, reception or billing).', 'हॉस्पिटल कर्मचारी स्वतःच्या खात्याने साइन इन करतात आणि प्रत्येकाला त्याच्या कामासाठी (उदा. रिसेप्शन, बिलिंग) आवश्यक तेवढेच दिसते.'),
            L('Information travels over a secure (HTTPS) connection.', 'माहिती सुरक्षित (HTTPS) कनेक्शनवरून जाते.'),
          ]}
        />
      ),
    },
    {
      id: 'retention',
      title: L('How long we keep it', 'माहिती किती काळ ठेवतो'),
      body: (
        <P>
          {L(
            'Medical and billing records are kept for as long as hospitals are required to keep them under the law that applies to us. If something in your record is wrong, you can ask us to correct it.',
            'वैद्यकीय आणि बिलिंगच्या नोंदी लागू असलेल्या कायद्यानुसार हॉस्पिटलने जितका काळ ठेवणे आवश्यक आहे तितका काळ ठेवल्या जातात. तुमच्या नोंदीत काही चूक असल्यास ती दुरुस्त करण्यास तुम्ही सांगू शकता.'
          )}
        </P>
      ),
    },
    {
      id: 'your-rights',
      title: L('Your choices and rights', 'तुमचे पर्याय आणि अधिकार'),
      body: (
        <>
          <UL
            items={[
              <>
                {L('See your records any time through ', 'तुमच्या नोंदी कधीही पाहा: ')}
                {portalLink}
                {L('.', '.')}
              </>,
              L('Update your profile details yourself in Patient login.', 'रुग्ण लॉगिनमध्ये तुमची प्रोफाइल माहिती स्वतः बदला.'),
              L(
                'Ask us to correct wrong information, or to delete information where the law allows it. Some medical and billing records must be kept by law.',
                'चुकीची माहिती दुरुस्त करण्यास, किंवा कायदा परवानगी देतो तिथे माहिती काढून टाकण्यास सांगा. काही वैद्यकीय आणि बिलिंगच्या नोंदी कायद्याने ठेवाव्या लागतात.'
              ),
            ]}
          />
          <P>
            {L(
              'We aim to follow India’s Digital Personal Data Protection Act, 2023: we use your information for the reasons given here, keep it safe, and respond when you ask about it.',
              'आम्ही भारताच्या डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ चे पालन करण्याचा प्रयत्न करतो: तुमची माहिती येथे दिलेल्या कारणांसाठीच वापरतो, सुरक्षित ठेवतो आणि तुम्ही विचारल्यास उत्तर देतो.'
            )}
          </P>
        </>
      ),
    },
    {
      id: 'children',
      title: L('Children', 'मुले'),
      body: (
        <P>
          {L(
            'For a patient under 18, a parent or guardian should book the appointment and use Patient login on the child’s behalf.',
            '१८ वर्षांखालील रुग्णासाठी पालक किंवा संरक्षकांनी अपॉइंटमेंट बुक करावी आणि मुलाच्या वतीने रुग्ण लॉगिन वापरावे.'
          )}
        </P>
      ),
    },
    {
      id: 'changes',
      title: L('Changes to this policy', 'या धोरणातील बदल'),
      body: (
        <P>
          {L(
            'If we change how we use information, we will update this page and the “Last updated” date at the top.',
            'माहिती वापरण्याच्या पद्धतीत बदल झाल्यास आम्ही हे पान आणि वरील “शेवटचा बदल” तारीख अद्ययावत करू.'
          )}
        </P>
      ),
    },
    {
      id: 'contact',
      title: L('Contact us about your information', 'तुमच्या माहितीबद्दल संपर्क'),
      body: (
        <>
          <P>
            {L(
              'To ask a question, get a correction or make a request about your information, contact the hospital:',
              'प्रश्न विचारण्यासाठी, दुरुस्ती करण्यासाठी किंवा तुमच्या माहितीबद्दल विनंतीसाठी हॉस्पिटलशी संपर्क करा:'
            )}
          </P>
          <UL
            items={[
              <>
                {L('Email: ', 'ईमेल: ')}
                {email}
              </>,
              <>
                {L('Reception: ', 'रिसेप्शन: ')}
                {receptionTel}
              </>,
              <>
                {L('Address: ', 'पत्ता: ')}
                {isMr ? HOSPITAL.address.mr : HOSPITAL.address.en}
              </>,
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <div className="bg-[#FAF8F4]">
      <PageIntro
        title={L('Privacy policy', 'गोपनीयता धोरण')}
        intro={
          <>
            {L(
              'How we collect, use and protect your information when you use our website, book an appointment or sign in as a patient.',
              'आमची वेबसाइट वापरताना, अपॉइंटमेंट बुक करताना किंवा रुग्ण म्हणून साइन इन करताना आम्ही तुमची माहिती कशी घेतो, वापरतो आणि सुरक्षित ठेवतो.'
            )}
            <span className="block mt-3 text-base text-stone-500">
              {L('Last updated: 24 October 2026', 'शेवटचा बदल: २४ ऑक्टोबर २०२६')}
            </span>
          </>
        }
      />
      <LongForm sections={sections} tocLabel={L('On this page', 'या पानावर')} />
    </div>
  );
};

/** "On this page" list followed by numbered sections. */
const LongForm: React.FC<{ sections: Section[]; tocLabel: string }> = ({ sections, tocLabel }) => (
  <div className={`${WRAP} py-10 sm:py-14`}>
    <nav aria-labelledby="toc-title" className="card-clean p-5 sm:p-6">
      <h2 id="toc-title" className="text-[1.125rem] leading-snug">
        {tocLabel}
      </h2>
      <ol className="mt-3 space-y-1 list-decimal pl-5 marker:text-stone-500">
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
          <span className="text-stone-400 mr-2">{i + 1}.</span>
          {s.title}
        </h2>
        {s.body}
      </section>
    ))}
  </div>
);
