import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { PageIntro, SectionTitle, Photo } from '../components/ui';
import { PHOTOS, GALLERY } from '../data/photos';

interface Facility {
  photo: string;
  titleEn: string;
  titleMr: string;
  textEn: string;
  textMr: string;
}

interface FacilityGroup {
  id: string;
  titleEn: string;
  titleMr: string;
  items: Facility[];
}

const GROUPS: FacilityGroup[] = [
  {
    id: 'emergency',
    titleEn: 'Emergency and ICU',
    titleMr: 'आपत्कालीन विभाग व ICU',
    items: [
      {
        photo: PHOTOS.casualty,
        titleEn: 'Casualty ward',
        titleMr: 'कॅज्युअल्टी (आपत्कालीन विभाग)',
        textEn: 'Open 24 hours for accidents, chest pain, breathing trouble and other emergencies. A doctor is on duty at all times.',
        textMr: 'अपघात, छातीत दुखणे, श्वास घेण्यास त्रास व इतर आपत्कालीन रुग्णांसाठी २४ तास सुरू. डॉक्टर नेहमी उपस्थित.',
      },
      {
        photo: PHOTOS.cardiacUnit,
        titleEn: '21-bed ICU',
        titleMr: '२१ खाटांचा ICU',
        textEn: 'Every bed has a monitor and piped oxygen. Ventilators and bedside dialysis are available, and an intensivist is on duty day and night.',
        textMr: 'प्रत्येक खाटेला मॉनिटर व ऑक्सिजन. व्हेंटिलेटर व डायलिसिसची सोय, अतिदक्षतातज्ज्ञ दिवस-रात्र उपस्थित.',
      },
      {
        photo: PHOTOS.cathLabTeam,
        titleEn: 'Heart care',
        titleMr: 'हृदयरोग उपचार',
        textEn: 'Our cardiac team looks after heart attack patients in the cardiac care unit. Planned heart surgery is done with a visiting heart surgeon.',
        textMr: 'हृदयविकाराच्या रुग्णांची काळजी हृदयरोग अतिदक्षता विभागात. नियोजित हृदय शस्त्रक्रिया व्हिजिटिंग सर्जनमार्फत.',
      },
    ],
  },
  {
    id: 'ot',
    titleEn: 'Operation theatres',
    titleMr: 'शस्त्रक्रिया गृह',
    items: [
      {
        photo: PHOTOS.operationTheatre,
        titleEn: 'Modular operation theatres',
        titleMr: 'मॉड्युलर शस्त्रक्रिया गृह',
        textEn: 'Used for joint replacement, fracture, general and keyhole surgery. Filtered air keeps the room clean during operations.',
        textMr: 'सांधे प्रत्यारोपण, फ्रॅक्चर, जनरल व दुर्बिणीद्वारे शस्त्रक्रियांसाठी. फिल्टर केलेल्या हवेमुळे खोली निर्जंतुक राहते.',
      },
      {
        photo: PHOTOS.otTeam,
        titleEn: 'Surgical team',
        titleMr: 'शस्त्रक्रिया पथक',
        textEn: 'Surgeons work with our own anaesthetists and OT nurses. After the operation, patients who need close watch move to the ICU.',
        textMr: 'सर्जनसोबत हॉस्पिटलचे भूलतज्ज्ञ व OT परिचारिका. शस्त्रक्रियेनंतर गरज असल्यास रुग्णाला ICU मध्ये ठेवले जाते.',
      },
    ],
  },
  {
    id: 'mother-child',
    titleEn: 'Mother and child',
    titleMr: 'माता व बालक',
    items: [
      {
        photo: PHOTOS.nicu,
        titleEn: 'Neonatal ICU (NICU)',
        titleMr: 'नवजात शिशु अतिदक्षता (NICU)',
        textEn: 'For premature and low-weight babies and newborns who need extra care. Warmers and phototherapy for jaundice are on hand.',
        textMr: 'कमी दिवसांच्या, कमी वजनाच्या व विशेष काळजी लागणाऱ्या बाळांसाठी. वॉर्मर व काविळीसाठी फोटोथेरपी उपलब्ध.',
      },
      {
        photo: PHOTOS.picu,
        titleEn: 'Paediatric ICU (PICU)',
        titleMr: 'बालरोग अतिदक्षता (PICU)',
        textEn: 'Intensive care for children with serious infections, breathing trouble or after surgery, looked after by our paediatricians.',
        textMr: 'गंभीर संसर्ग, श्वसनाचा त्रास किंवा शस्त्रक्रियेनंतर मुलांसाठी अतिदक्षता, बालरोगतज्ज्ञांच्या देखरेखीखाली.',
      },
    ],
  },
  {
    id: 'diagnostics',
    titleEn: 'Diagnostics',
    titleMr: 'तपासण्या',
    items: [
      {
        photo: PHOTOS.pathologyLab,
        titleEn: 'Pathology lab',
        titleMr: 'पॅथॉलॉजी लॅब',
        textEn: 'Blood, urine and other routine tests are done here in the hospital, so you do not need to go to an outside lab.',
        textMr: 'रक्त, लघवी व इतर नेहमीच्या तपासण्या हॉस्पिटलमध्येच होतात, बाहेरच्या लॅबमध्ये जाण्याची गरज नाही.',
      },
    ],
  },
  {
    id: 'pharmacy',
    titleEn: 'Pharmacy and billing',
    titleMr: 'औषधालय व बिलिंग',
    items: [
      {
        photo: PHOTOS.pharmacy,
        titleEn: 'Sanjeevani Pharma',
        titleMr: 'संजीवनी फार्मा',
        textEn: 'The in-house pharmacy is open 24 hours, so prescribed and emergency medicines are available at any time.',
        textMr: 'हॉस्पिटलमधील औषधालय २४ तास सुरू, त्यामुळे लिहून दिलेली व तातडीची औषधे कधीही मिळतात.',
      },
      {
        photo: PHOTOS.billing,
        titleEn: 'Billing and insurance desk',
        titleMr: 'बिलिंग व विमा कक्ष',
        textEn: 'Pay bills here and get help with cashless insurance claims. The Arogya Mitra desk handles MJPJAY paperwork.',
        textMr: 'येथे बिल भरा व कॅशलेस विम्याच्या दाव्यासाठी मदत घ्या. MJPJAY कागदपत्रांसाठी आरोग्य मित्र कक्ष.',
      },
    ],
  },
];

export const FacilitiesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'हॉस्पिटल सुविधा' : 'Facilities'}
        intro={
          isMr
            ? 'आपत्कालीन विभाग, ICU, शस्त्रक्रिया गृह, NICU, लॅब आणि औषधालय एकाच इमारतीत. खालील फोटो आमच्या हॉस्पिटलचेच आहेत.'
            : 'Emergency, ICU, operation theatres, NICU, lab and pharmacy, all in one building. The photos on this page are of our own hospital.'
        }
        image={PHOTOS.building}
        imageAlt={isMr ? 'संजीवनी हॉस्पिटल इमारत, जालना' : 'Sanjeevani Hospital building, Jalna'}
      >
        <a href="tel:+917507342222" className="btn-secondary">
          <Phone className="w-4 h-4 text-[#C62828]" />
          {isMr ? 'आपत्कालीन: ' : 'Emergency: '}+91 75073 42222
        </a>
      </PageIntro>

      {GROUPS.map((group, gi) => (
        <section
          key={group.id}
          id={group.id}
          className={gi % 2 === 1 ? 'bg-white border-y border-[#E7E3DA]' : ''}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <SectionTitle title={isMr ? group.titleMr : group.titleEn} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {group.items.map((item) => (
                <div key={item.titleEn}>
                  <Photo src={item.photo} alt={isMr ? item.titleMr : item.titleEn} className="w-full aspect-[4/3] rounded-lg" />
                  <h3 className="mt-4 text-xl">{isMr ? item.titleMr : item.titleEn}</h3>
                  <p className="mt-2 text-[15px] text-stone-600 leading-relaxed">{isMr ? item.textMr : item.textEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionTitle
          title={isMr ? 'फोटो' : 'Photos'}
          sub={isMr ? 'हॉस्पिटलमधील काही ठिकाणे.' : 'A look around the hospital.'}
        />
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
          {GALLERY.map((g) => (
            <li key={g.key}>
              <figure>
                <Photo src={PHOTOS[g.key]} alt={isMr ? g.mr : g.en} className="w-full aspect-square rounded-md" />
                <figcaption className="mt-2 text-sm text-stone-600 leading-snug">{isMr ? g.mr : g.en}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-12 pt-6 border-t border-[#E7E3DA] flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <p className="text-stone-600 max-w-xl">
            {isMr
              ? 'भेट देण्यापूर्वी काही विचारायचे असल्यास फोन करा, किंवा ओपीडीसाठी वेळ ठरवा.'
              : 'Questions before you visit? Call us, or book an OPD appointment.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/book" className="btn-primary">
              {isMr ? 'अपॉइंटमेंट घ्या' : 'Book appointment'}
            </Link>
            <Link to="/departments" className="btn-secondary">
              {isMr ? 'विभाग पहा' : 'See departments'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
