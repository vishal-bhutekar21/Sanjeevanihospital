import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { PageIntro, Photo } from '../components/ui';
import { PHOTOS } from '../data/photos';
import { DOCTORS_DATA, type DoctorItem } from '../data/doctorsData';

export interface Department {
  slug: string;
  nameEn: string;
  nameMr: string;
  descEn: string;
  descMr: string;
  photo: string;
  /** First id is the lead doctor. Ids come from DOCTORS_DATA. */
  doctorIds: string[];
  hoursEn: string;
  hoursMr: string;
  treatsEn: string[];
  treatsMr: string[];
}

// Shared with DepartmentDetailPage. Slugs must not change (they are live URLs).
export const DEPARTMENTS: Department[] = [
  {
    slug: 'orthopedics',
    nameEn: 'Orthopaedics and joint replacement',
    nameMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण',
    descEn: 'Fractures, knee and hip replacement, and back and spine problems. Surgery is done in our own operation theatre with X-ray guidance.',
    descMr: 'फ्रॅक्चर, गुडघे व खुबा प्रत्यारोपण आणि पाठीच्या व मणक्याच्या तक्रारी. शस्त्रक्रिया हॉस्पिटलच्याच ऑपरेशन थिएटरमध्ये होते.',
    photo: PHOTOS.operationTheatre,
    doctorIds: ['doc-goyal'],
    hoursEn: 'Mon – Sat, 11 am – 3 pm and 6 – 8 pm',
    hoursMr: 'सोम – शनि, सकाळी ११ – दुपारी ३ व संध्या. ६ – ८',
    treatsEn: [
      'Knee and hip replacement',
      'Fractures and injuries from accidents',
      'Ligament injuries (arthroscopy)',
      'Slip disc, sciatica and back pain',
      'Bone problems in children',
      'Arthritis and weak bones (osteoporosis)',
    ],
    treatsMr: [
      'गुडघे व खुबा प्रत्यारोपण',
      'अपघातातील फ्रॅक्चर व दुखापती',
      'लिगामेंट दुखापत (आर्थ्रोस्कोपी)',
      'स्लिप डिस्क, सायटिका व पाठदुखी',
      'लहान मुलांच्या हाडांचे आजार',
      'संधिवात व हाडे ठिसूळ होणे',
    ],
  },
  {
    slug: 'pediatrics',
    nameEn: 'Paediatrics and newborn care (NICU)',
    nameMr: 'बालरोग आणि नवजात शिशु अतिदक्षता',
    descEn: 'Care for newborns, babies and children, including a neonatal ICU for premature and low-weight babies. Vaccinations are given on all OPD days.',
    descMr: 'नवजात बाळे व लहान मुलांचे उपचार. कमी दिवसांच्या व कमी वजनाच्या बाळांसाठी NICU. लसीकरण सर्व ओपीडी दिवशी.',
    photo: PHOTOS.nicu,
    doctorIds: ['doc-mirkad', 'doc-rajguru'],
    hoursEn: 'Mon – Sat, 10 am – 2 pm and 5 – 8 pm. NICU open 24 hours.',
    hoursMr: 'सोम – शनि, सकाळी १० – दुपारी २ व संध्या. ५ – ८. NICU २४ तास.',
    treatsEn: [
      'Premature and low birth weight babies (NICU)',
      'Newborn jaundice (phototherapy)',
      'Fever, infections and diarrhoea in children',
      'Asthma, cough and allergies',
      'Vaccinations',
      'Growth and nutrition check-ups',
    ],
    treatsMr: [
      'कमी दिवसांची व कमी वजनाची बाळे (NICU)',
      'नवजात बाळांची कावीळ (फोटोथेरपी)',
      'मुलांमधील ताप, संसर्ग व जुलाब',
      'दमा, खोकला व ॲलर्जी',
      'लसीकरण',
      'वाढ व पोषण तपासणी',
    ],
  },
  {
    slug: 'icu-critical-care',
    nameEn: 'ICU and critical care',
    nameMr: 'अतिदक्षता विभाग (ICU)',
    descEn: 'A 21-bed ICU with ventilators and bedside dialysis. An intensivist is on duty day and night.',
    descMr: 'व्हेंटिलेटर व डायलिसिसची सोय असलेला २१ खाटांचा ICU. अतिदक्षतातज्ज्ञ डॉक्टर दिवस-रात्र उपस्थित.',
    photo: PHOTOS.cardiacUnit,
    doctorIds: ['doc-bagal', 'doc-avinash'],
    hoursEn: 'Open 24 hours, every day',
    hoursMr: 'दररोज २४ तास सुरू',
    treatsEn: [
      'Patients who need a ventilator',
      'Severe infections and sepsis',
      'Heart attack and stroke (first care)',
      'Poisoning and snake bite',
      'Care after major surgery',
      'Kidney failure needing dialysis',
    ],
    treatsMr: [
      'व्हेंटिलेटरची गरज असलेले रुग्ण',
      'गंभीर संसर्ग व सेप्सिस',
      'हृदयविकाराचा झटका व पक्षाघात (प्राथमिक उपचार)',
      'विषबाधा व सर्पदंश',
      'मोठ्या शस्त्रक्रियेनंतरची काळजी',
      'डायलिसिसची गरज असलेले किडनीचे आजार',
    ],
  },
  {
    slug: 'obstetrics-gynecology',
    nameEn: 'Obstetrics and gynaecology',
    nameMr: 'प्रसूती आणि स्त्रीरोग',
    descEn: 'Pregnancy check-ups, normal and caesarean delivery, and treatment for women’s health problems, including keyhole surgery.',
    descMr: 'गर्भावस्था तपासणी, नॉर्मल व सिझेरियन प्रसूती आणि स्त्रियांच्या आजारांवर उपचार, दुर्बिणीद्वारे शस्त्रक्रियेसह.',
    photo: PHOTOS.otTeam,
    doctorIds: ['doc-anshul'],
    hoursEn: 'Mon – Sat, 10:30 am – 2:30 pm and 5:30 – 7:30 pm. Deliveries at any hour.',
    hoursMr: 'सोम – शनि, सकाळी १०:३० – दुपारी २:३० व संध्या. ५:३० – ७:३०. प्रसूती कधीही.',
    treatsEn: [
      'Pregnancy check-ups and scans',
      'Normal and caesarean delivery',
      'High-risk pregnancy',
      'Irregular periods and PCOD',
      'Fibroids, cysts and uterus removal',
      'Help for couples trying to conceive',
    ],
    treatsMr: [
      'गर्भावस्था तपासणी व सोनोग्राफी',
      'नॉर्मल व सिझेरियन प्रसूती',
      'जोखमीची गर्भावस्था',
      'अनियमित मासिक पाळी व PCOD',
      'फायब्रॉइड, गाठी व गर्भाशय काढणे',
      'वंध्यत्व तपासणी व उपचार',
    ],
  },
  {
    slug: 'general-surgery',
    nameEn: 'General and laparoscopic surgery',
    nameMr: 'जनरल आणि लेप्रोस्कोपिक शस्त्रक्रिया',
    descEn: 'Keyhole and open surgery for gallstones, hernia, appendix, piles and fistula. Most patients go home within a few days.',
    descMr: 'पित्ताशयातील खडे, हर्निया, अपेंडिक्स, मूळव्याध व फिस्टुला यांच्या दुर्बिणीद्वारे व नेहमीच्या शस्त्रक्रिया.',
    photo: PHOTOS.surgery,
    doctorIds: ['doc-shashikala', 'doc-kalyansing'],
    hoursEn: 'Mon – Sat, 11 am – 3 pm',
    hoursMr: 'सोम – शनि, सकाळी ११ – दुपारी ३',
    treatsEn: [
      'Gallbladder stones',
      'Hernia',
      'Appendix',
      'Piles, fissure and fistula (including laser)',
      'Lumps, abscesses and wounds',
      'Cancer surgery (visiting surgeon)',
    ],
    treatsMr: [
      'पित्ताशयातील खडे',
      'हर्निया',
      'अपेंडिक्स',
      'मूळव्याध, फिशर व फिस्टुला (लेझरसह)',
      'गाठी, गळू व जखमा',
      'कर्करोग शस्त्रक्रिया (व्हिजिटिंग सर्जन)',
    ],
  },
  {
    slug: 'internal-medicine',
    nameEn: 'Internal medicine',
    nameMr: 'इंटरनल मेडिसिन (फिजिशियन)',
    descEn: 'Diagnosis and ongoing care for diabetes, blood pressure, fevers and infections. The casualty ward takes medical emergencies at any hour.',
    descMr: 'मधुमेह, रक्तदाब, ताप व संसर्गजन्य आजारांचे निदान व उपचार. आपत्कालीन रुग्णांसाठी कॅज्युअल्टी २४ तास.',
    photo: PHOTOS.casualty,
    doctorIds: ['doc-rajguru'],
    hoursEn: 'Mon – Sat, 9 am – 1 pm and 5 – 8 pm',
    hoursMr: 'सोम – शनि, सकाळी ९ – दुपारी १ व संध्या. ५ – ८',
    treatsEn: [
      'Diabetes and thyroid',
      'High blood pressure',
      'Dengue, malaria, typhoid and other fevers',
      'Chest problems and breathlessness',
      'Health check-ups',
    ],
    treatsMr: [
      'मधुमेह व थायरॉईड',
      'उच्च रक्तदाब',
      'डेंग्यू, मलेरिया, टायफॉइड व इतर ताप',
      'छातीचे आजार व दम लागणे',
      'आरोग्य तपासणी',
    ],
  },
];

export const findDoctor = (id: string): DoctorItem | undefined => DOCTORS_DATA.find((d) => d.id === id);

export const DepartmentsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'वैद्यकीय विभाग' : 'Departments'}
        intro={
          isMr
            ? 'प्रत्येक विभागाचे प्रमुख डॉक्टर, ओपीडी वेळ आणि उपचारांची माहिती. अपॉइंटमेंटसाठी विभाग निवडा किंवा थेट फोन करा.'
            : 'Who leads each department, when the OPD runs, and what we treat. Choose a department to book, or call us.'
        }
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/book" className="btn-primary">
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
          </Link>
          <a href="tel:+917507342222" className="btn-secondary">
            <Phone className="w-4 h-4" />
            +91 75073 42222
          </a>
        </div>
      </PageIntro>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {DEPARTMENTS.map((dept) => {
            const lead = findDoctor(dept.doctorIds[0]);
            const name = isMr ? dept.nameMr : dept.nameEn;
            return (
              <li key={dept.slug} className="flex flex-col">
                <Link to={`/departments/${dept.slug}`} className="group block">
                  <Photo src={dept.photo} alt="" className="w-full aspect-[3/2] rounded-lg" />
                  <h2 className="mt-4 text-xl leading-snug group-hover:text-[#0F766E]">{name}</h2>
                </Link>
                {lead && (
                  <p className="mt-1 text-sm text-stone-500">
                    {isMr ? lead.nameMr : lead.name}, {lead.degree}
                  </p>
                )}
                <p className="mt-2 text-[15px] text-stone-600 leading-relaxed flex-1">
                  {isMr ? dept.descMr : dept.descEn}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6">
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#1C2321] hover:text-[#0F766E] underline underline-offset-4 decoration-[#D8D3C8]"
                  >
                    {isMr ? 'अधिक माहिती' : 'More about this department'}
                  </Link>
                  <Link
                    to={lead ? `/book?doctorId=${lead.id}` : '/book'}
                    className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#0F766E] hover:underline underline-offset-4"
                  >
                    {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'} →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-14 pt-6 border-t border-[#E7E3DA] text-stone-600 max-w-2xl">
          {isMr
            ? 'युरोलॉजी, न्यूरोसर्जरी, हृदय शस्त्रक्रिया व इंटरव्हेन्शनल रेडिओलॉजीचे तज्ज्ञ ठराविक दिवशी येतात. '
            : 'Specialists in urology, neurosurgery, heart surgery and interventional radiology also see patients here on set days. '}
          <Link to="/doctors" className="font-semibold text-[#0F766E] hover:underline underline-offset-4">
            {isMr ? 'सर्व डॉक्टर पहा' : 'See all doctors'}
          </Link>
        </p>
      </section>
    </div>
  );
};
