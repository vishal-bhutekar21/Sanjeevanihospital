import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageIntro, SectionTitle } from '../components/ui';
import { HOSPITAL } from '../config/hospital';

const WRAP = 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8';
const INPUT =
  'w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-[#D8D3C8] rounded-lg text-[15px] text-[#1C2321] placeholder:text-stone-400 focus:border-[#0F766E] focus:outline-none';
const LABEL = 'block text-sm font-semibold text-stone-700 mb-1.5';
const MAP_URL = HOSPITAL.mapsUrl;

export const ContactPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const phones = [
    { label: isMr ? 'मुख्य स्वागत कक्ष' : 'Reception', num: HOSPITAL.phones.reception.display, tel: HOSPITAL.phones.reception.tel },
    { label: isMr ? 'अ‍ॅम्ब्युलन्स' : 'Ambulance', num: HOSPITAL.phones.ambulance.display, tel: HOSPITAL.phones.ambulance.tel },
    { label: isMr ? 'MJPJAY (आरोग्य मित्र)' : 'MJPJAY (Arogya Mitra)', num: HOSPITAL.phones.mjpjay.display, tel: HOSPITAL.phones.mjpjay.tel },
    { label: isMr ? 'कॅशलेस विमा (TPA)' : 'Cashless insurance (TPA)', num: HOSPITAL.phones.tpa.display, tel: HOSPITAL.phones.tpa.tel },
    { label: isMr ? 'प्रशासन' : 'Administration', num: HOSPITAL.phones.admin.display, tel: HOSPITAL.phones.admin.tel },
  ];

  const hours = [
    { what: isMr ? 'आपत्कालीन विभाग व ICU' : 'Emergency and ICU', when: isMr ? HOSPITAL.opdHours.emergency.mr : HOSPITAL.opdHours.emergency.en },
    { what: isMr ? 'सकाळची ओपीडी' : 'Morning OPD', when: HOSPITAL.opdHours.contactMorning },
    { what: isMr ? 'संध्याकाळची ओपीडी' : 'Evening OPD', when: HOSPITAL.opdHours.contactEvening },
  ];

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'संपर्क' : 'Contact us'}
        intro={
          isMr
            ? `${HOSPITAL.nameMr}, ${HOSPITAL.locality.mr}. आपत्कालीन विभाग २४ तास सुरू असतो.`
            : `${HOSPITAL.name}, ${HOSPITAL.locality.en}. The emergency department is open 24 hours.`
        }
      >
        <p className="text-sm font-semibold text-[#8E1C1C]">{isMr ? 'आपत्कालीन स्थितीत' : 'In an emergency'}</p>
        <a
          href={`tel:${HOSPITAL.phones.emergency.tel}`}
          className="mt-1 inline-flex items-center gap-2 min-h-[44px] font-heading text-3xl sm:text-4xl text-[#C62828] hover:underline underline-offset-4"
        >
          <Phone className="w-7 h-7" />
          {HOSPITAL.phones.emergency.display}
        </a>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a href={`tel:${HOSPITAL.phones.emergency.tel}`} className="btn-emergency">
            <Phone className="w-4 h-4" />
            {isMr ? 'आत्ता फोन करा' : 'Call now'}
          </a>
          <Link to="/book" className="btn-secondary">
            {isMr ? 'अपॉइंटमेंट घ्या' : 'Book an appointment'}
          </Link>
        </div>
      </PageIntro>

      {/* Phone numbers, hours, address */}
      <section className={`${WRAP} py-12 sm:py-16`}>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionTitle title={isMr ? 'फोन नंबर' : 'Phone numbers'} />
            <ul className="divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
              {phones.map((p) => (
                <li key={p.tel} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <span className="text-stone-600">{p.label}</span>
                  <a
                    href={`tel:${p.tel}`}
                    className="inline-flex items-center min-h-[44px] font-semibold text-[#1C2321] hover:text-[#0F766E] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    {p.num}
                  </a>
                </li>
              ))}
              <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <span className="text-stone-600">{isMr ? 'ईमेल' : 'Email'}</span>
                <a
                  href={`mailto:${HOSPITAL.emails.main}`}
                  className="inline-flex items-center min-h-[44px] font-semibold text-[#1C2321] hover:text-[#0F766E] hover:underline underline-offset-4 break-all"
                >
                  {HOSPITAL.emails.main}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <SectionTitle title={isMr ? 'वेळ' : 'Opening hours'} />
            <table className="w-full text-left border-y border-[#E7E3DA]">
              <tbody className="divide-y divide-[#E7E3DA]">
                {hours.map((h) => (
                  <tr key={h.what}>
                    <th scope="row" className="py-3.5 pr-4 font-normal text-stone-600 align-top">
                      {h.what}
                    </th>
                    <td className="py-3.5 font-semibold text-[#1C2321] text-right">{h.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-stone-500">
              {isMr
                ? 'डॉक्टरांची वेळ वेगवेगळी असू शकते. येण्यापूर्वी स्वागत कक्षाला फोन करून खात्री करा.'
                : 'Individual doctors’ timings vary. Please call reception to confirm before you come.'}
            </p>
          </div>
        </div>
      </section>

      {/* Directions + map */}
      <section className="bg-white border-y border-[#E7E3DA]">
        <div className={`${WRAP} py-12 sm:py-16 grid lg:grid-cols-12 gap-8 items-start`}>
          <div className="lg:col-span-5">
            <SectionTitle title={isMr ? 'पत्ता व दिशा' : 'Address and directions'} />
            <address className="not-italic text-stone-700 leading-relaxed">
              {HOSPITAL.name}
              <br />
              {HOSPITAL.address.line1}
              <br />
              {HOSPITAL.address.line2}
            </address>
            <ul className="mt-4 list-disc pl-5 space-y-1 text-[15px] text-stone-600 marker:text-stone-400">
              <li>{isMr ? 'अंबड चौफुली चौकाजवळ' : 'Near the Ambad Choufuli junction'}</li>
              <li>{isMr ? 'जालना रेल्वे स्टेशनपासून सुमारे ३.५ किमी' : 'About 3.5 km from Jalna railway station'}</li>
              <li>{isMr ? 'बस स्टँडपासून सुमारे २.८ किमी' : 'About 2.8 km from the bus stand'}</li>
              <li>{isMr ? 'हॉस्पिटलमध्ये मोफत पार्किंग' : 'Free parking at the hospital'}</li>
            </ul>
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6">
              {isMr ? 'गुगल मॅपवर दिशा' : 'Get directions'}
            </a>
          </div>
          <div className="lg:col-span-7 rounded-lg overflow-hidden h-72 sm:h-96 bg-stone-100 border border-[#E7E3DA]">
            <iframe
              title={`${HOSPITAL.shortName} ${HOSPITAL.city} Location Map`}
              src={HOSPITAL.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className={`${WRAP} py-12 sm:py-16`}>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <SectionTitle
              title={isMr ? 'प्रश्न विचारा' : 'Send us a question'}
              sub={
                isMr
                  ? 'स्वागत कक्ष तुम्हाला फोन करेल. तातडीच्या उपचारासाठी हा अर्ज वापरू नका, थेट फोन करा.'
                  : 'Reception will call you back. Please do not use this form for anything urgent; call us instead.'
              }
            />
          </div>

          <div className="lg:col-span-8 card-clean p-6 sm:p-8">
            {formSubmitted ? (
              <div role="status">
                <p className="text-lg font-semibold text-[#0F766E]">
                  {isMr ? 'धन्यवाद. तुमचा संदेश मिळाला.' : 'Thank you. We have your message.'}
                </p>
                <p className="mt-1 text-stone-600">
                  {isMr ? 'आमचा स्वागत कक्ष लवकरच संपर्क करेल.' : 'Someone from reception will contact you soon.'}
                </p>
                <button type="button" onClick={() => setFormSubmitted(false)} className="btn-secondary mt-5">
                  {isMr ? 'दुसरा संदेश पाठवा' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="ct-name" className={LABEL}>
                      {isMr ? 'पूर्ण नाव' : 'Full name'} <span className="text-[#C62828]">*</span>
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className={LABEL}>
                      {isMr ? 'मोबाईल नंबर' : 'Mobile number'} <span className="text-[#C62828]">*</span>
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-dept" className={LABEL}>
                    {isMr ? 'विषय' : 'Subject'}
                  </label>
                  <select
                    id="ct-dept"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={INPUT}
                  >
                    <option value="general">{isMr ? 'ओपीडी व डॉक्टर सल्ला' : 'OPD and doctor consultation'}</option>
                    <option value="ortho">{isMr ? 'अस्थिरोग व सांधे प्रत्यारोपण' : 'Orthopaedics and joint replacement'}</option>
                    <option value="pediatrics">{isMr ? 'बालरोग व नवजात शिशु (NICU)' : 'Children and newborn care (NICU)'}</option>
                    <option value="icu">{isMr ? 'अतिदक्षता विभाग (ICU)' : 'ICU'}</option>
                    <option value="mjpjay">{isMr ? 'महात्मा फुले (MJPJAY) योजना' : 'MJPJAY scheme'}</option>
                    <option value="insurance">{isMr ? 'कॅशलेस विमा (TPA)' : 'Cashless insurance'}</option>
                    <option value="other">{isMr ? 'इतर' : 'Something else'}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ct-msg" className={LABEL}>
                    {isMr ? 'तुमचा संदेश' : 'Your message'} <span className="text-[#C62828]">*</span>
                  </label>
                  <textarea
                    id="ct-msg"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${INPUT} resize-y`}
                  />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {isMr ? 'संदेश पाठवा' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
