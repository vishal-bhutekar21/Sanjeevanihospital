import React, { useEffect, useState } from 'react';
import { Phone, Star, ThumbsUp } from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';
import { AWARDS_DATA } from '../data/awardsData';
import { GALLERY, PHOTOS } from '../data/photos';
import { PageIntro, SectionTitle, Photo } from '../components/ui';

const WRAP = 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8';
const INPUT =
  'w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-[#D8D3C8] rounded-lg text-[15px] text-[#1C2321] placeholder:text-stone-400 focus:border-[#0F766E] focus:outline-none';
const LABEL = 'block text-sm font-semibold text-stone-700 mb-1.5';

export const EventsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  // Shown only until camps load from the hospital's records
  const defaultEvents = [
    {
      id: 'camp-1',
      title: 'Joint pain and bone health camp',
      titleMr: 'सांधेदुखी व हाडांची तपासणी शिबिर',
      category: 'Orthopedics & Spine',
      categoryMr: 'अस्थिरोग व मणके विकार',
      date: 'Every Sunday',
      dateMr: 'दर रविवारी',
      timings: '10:00 AM – 02:00 PM',
      location: 'OPD hall, Sanjeevani Hospital, Ambad Choufuli, Jalna',
      locationMr: 'ओपीडी हॉल, संजीवनी हॉस्पिटल, अंबड चौफुली, जालना',
      doctorInCharge: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      isFree: true,
      description:
        'Consultation for knee pain, hip arthritis, back pain, sciatica and stiffness after a fracture.',
      descriptionMr:
        'गुडघेदुखी, कंबरदुखी, मणक्याचे आजार, सांधेदुखी व जुन्या फ्रॅक्चरवर तज्ज्ञ डॉक्टरांचा सल्ला.',
      highlights: [
        isMr ? 'हाडांची घनता चाचणी (BMD)' : 'Bone density (BMD) test',
        isMr ? 'एक्स-रे वर ५०% सवलत' : '50% off digital X-rays',
        isMr ? 'अस्थिरोग तज्ज्ञांचा सल्ला' : 'Consultation with the orthopaedic surgeon',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-2',
      title: 'Child health check-up and vaccination',
      titleMr: 'बालरोग तपासणी व लसीकरण',
      category: 'Pediatrics & Neonatal',
      categoryMr: 'बालरोग व शिशु आरोग्य',
      date: 'Every Wednesday and Saturday',
      dateMr: 'दर बुधवारी व शनिवारी',
      timings: '11:00 AM – 03:00 PM',
      location: 'Paediatric wing, 1st floor, Sanjeevani Hospital, Jalna',
      locationMr: 'बालरोग विभाग (पहिला मजला), संजीवनी हॉस्पिटल, जालना',
      doctorInCharge: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      isFree: true,
      description:
        'Growth check, asthma and allergy screening, nutrition advice and vaccinations on the national schedule, for children up to 15 years.',
      descriptionMr:
        '० ते १५ वयोगटातील मुलांची वाढ तपासणी, दमा व अ‍ॅलर्जी तपासणी, पोषण सल्ला आणि राष्ट्रीय वेळापत्रकानुसार लसीकरण.',
      highlights: [
        isMr ? 'वजन व वाढ तपासणी' : 'Weight and growth check',
        isMr ? 'दमा व अ‍ॅलर्जी तपासणी' : 'Asthma and allergy screening',
        isMr ? 'बालरोगतज्ज्ञांचा सल्ला' : 'Consultation with the paediatrician',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-3',
      title: 'Diabetes, blood pressure and heart check-up',
      titleMr: 'मधुमेह, रक्तदाब व हृदय तपासणी',
      category: 'Internal Medicine & Cardiology',
      categoryMr: 'इंटरनल मेडिसिन व हृदय तपासणी',
      date: '1st and 3rd Friday of each month',
      dateMr: 'दर महिन्याचा पहिला व तिसरा शुक्रवार',
      timings: '09:00 AM – 01:00 PM',
      location: 'Ground floor, Sanjeevani Hospital, Jalna',
      locationMr: 'तळमजला, संजीवनी हॉस्पिटल, जालना',
      doctorInCharge: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      isFree: true,
      description:
        'Check-up for diabetes, high blood pressure, cholesterol and early signs of heart disease.',
      descriptionMr: 'मधुमेह, उच्च रक्तदाब, कोलेस्टेरॉल आणि हृदयविकाराची तपासणी.',
      highlights: [
        isMr ? 'रक्तातील साखर तपासणी' : 'Blood sugar test',
        isMr ? 'ईसीजी (ECG)' : 'ECG',
        isMr ? 'आहार व जीवनशैली सल्ला' : 'Diet and lifestyle advice',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-4',
      title: 'MJPJAY surgery screening and registration',
      titleMr: 'महात्मा फुले योजना शस्त्रक्रिया तपासणी व नोंदणी',
      category: 'Government Scheme Surgeries',
      categoryMr: 'शासकीय योजना शस्त्रक्रिया',
      date: 'Monday to Saturday',
      dateMr: 'सोमवार ते शनिवार',
      timings: '09:00 AM – 05:00 PM',
      location: 'Arogya Mitra desk, Room 102, Sanjeevani Hospital, Jalna',
      locationMr: 'आरोग्य मित्र कक्ष (रूम १०२), संजीवनी हॉस्पिटल, जालना',
      doctorInCharge: 'Surgical team and Arogya Mitra desk',
      isFree: true,
      description:
        'For yellow and orange ration card holders: we check if your operation (knee replacement, hernia, gallstones, appendix, C-section) is covered under MJPJAY and register you.',
      descriptionMr:
        'पिवळे व केशरी रेशन कार्डधारकांसाठी: गुडघे प्रत्यारोपण, हर्निया, पित्ताशयातील खडे, अपेंडिक्स, सिझेरियन या शस्त्रक्रियांची योजनेत पात्रता तपासणी व नोंदणी.',
      highlights: [
        isMr ? 'रेशन कार्ड ऑनलाइन पडताळणी' : 'Ration card checked online on the spot',
        isMr ? 'मंजूर शस्त्रक्रियेसाठी कॅशलेस नोंदणी' : 'Cashless registration for approved operations',
        isMr ? 'आणायची कागदपत्रे: रेशन कार्ड, आधार' : 'Bring: ration card and Aadhaar',
      ],
      contactPhone: '+917507342222',
    },
  ];

  // Shown only until approved reviews load from the hospital's records
  const defaultReviews = [
    {
      id: 'rev-1',
      patientName: 'Kailashnath Shinde',
      patientLocation: 'Jalna City',
      patientLocationMr: 'जालना शहर',
      treatmentType: 'Knee replacement',
      treatmentTypeMr: 'गुडघे प्रत्यारोपण',
      doctorName: 'Dr. Nishant Goyal',
      rating: 5,
      date: 'August 2026',
      helpfulCount: 42,
      reviewText:
        'My mother had knee pain for six years and could hardly walk. Dr. Nishant Goyal replaced her knee under the MJPJAY scheme, so we did not pay anything. She was walking on the second day. The nurses and doctors looked after her well.',
      reviewTextMr:
        'माझ्या आईला गेल्या ६ वर्षांपासून गुडघ्यांचा तीव्र त्रास होता. डॉ. निशांत गोयल सरांनी महात्मा फुले योजनेतून गुडघे प्रत्यारोपण केले. आम्हाला काहीही खर्च आला नाही. आई दुसऱ्या दिवशी चालू लागली. डॉक्टर व नर्सनी चांगली काळजी घेतली.',
    },
    {
      id: 'rev-2',
      patientName: 'Sunita & Rameshwar Solanke',
      patientLocation: 'Ambad, Jalna',
      patientLocationMr: 'अंबड, जालना',
      treatmentType: 'NICU care',
      treatmentTypeMr: 'नवजात शिशु अतिदक्षता (NICU)',
      doctorName: 'Dr. Shivdas Mirkad',
      rating: 5,
      date: 'July 2026',
      helpfulCount: 38,
      reviewText:
        'Our baby was born at seven months, weighing 1.2 kg, and had trouble breathing. Dr. Shivdas Mirkad and the NICU nurses looked after her for 18 days. She is healthy now.',
      reviewTextMr:
        'आमचे बाळ ७ व्या महिन्यात अवघ्या १.२ किलो वजनाचे जन्माला आले होते आणि श्वास घेण्यास त्रास होत होता. डॉ. शिवदास मिरकड सर आणि एनआयसीयू टीमने १८ दिवस काळजी घेतली. आज आमचे बाळ निरोगी आहे.',
    },
    {
      id: 'rev-3',
      patientName: 'Ganesh Deshmukh',
      patientLocation: 'Partur, Jalna',
      patientLocationMr: 'परतूर, जालना',
      treatmentType: 'Emergency and ICU care',
      treatmentTypeMr: 'आपत्कालीन व आयसीयू उपचार',
      doctorName: 'Dr. Baliram Bagal',
      rating: 5,
      date: 'August 2026',
      helpfulCount: 56,
      reviewText:
        'My brother had a serious road accident with a head injury and several fractures. Dr. Baliram Bagal and the ICU team put him on a ventilator within minutes and watched him day and night. He recovered.',
      reviewTextMr:
        'माझ्या भावाचा गंभीर अपघात झाला होता. डोक्याला जबर मार लागला होता. डॉ. बळीराम बागल सर आणि आयसीयू टीमने तात्काळ व्हेंटिलेटर लावले आणि दिवस-रात्र देखरेख केली. माझा भाऊ सुखरूप बरा झाला.',
    },
    {
      id: 'rev-4',
      patientName: 'Pooja Vijay Kulkarni',
      patientLocation: 'Bhokardan, Jalna',
      patientLocationMr: 'भोकरदन, जालना',
      treatmentType: 'Delivery',
      treatmentTypeMr: 'प्रसूती',
      doctorName: 'Dr. Anshul Goyal',
      rating: 5,
      date: 'June 2026',
      helpfulCount: 29,
      reviewText:
        'Dr. Anshul Goyal is gentle and explains everything. My delivery went smoothly. The maternity rooms were clean and private.',
      reviewTextMr:
        'डॉ. अंशुल गोयल मॅडम आपुलकीने सर्व समजावून सांगतात. माझी प्रसूती कोणत्याही त्रासाशिवाय झाली. प्रसूती कक्ष स्वच्छ होता.',
    },
  ];

  const [events, setEvents] = useState<any[]>(defaultEvents);
  const [reviews, setReviews] = useState<any[]>(defaultReviews);

  const [reviewForm, setReviewForm] = useState({
    patientName: '',
    patientLocation: '',
    rating: 5,
    reviewText: '',
    doctorName: '',
    treatmentType: '',
  });
  const [submittedReview, setSubmittedReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(apiUrl('/reviews-events/events'))
      .then((r) => r.json())
      .then((d) => {
        if (d?.data && d.data.length > 0) {
          setEvents(d.data);
        }
      })
      .catch(() => {});

    fetch(apiUrl('/reviews-events/reviews'))
      .then((r) => r.json())
      .then((d) => {
        if (d?.data && d.data.length > 0) {
          setReviews(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleMarkHelpful = async (id: string) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
    try {
      await fetch(apiUrl(`/reviews-events/reviews/${id}/helpful`), { method: 'PATCH' });
    } catch {}
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError(false);
    try {
      const res = await fetch(apiUrl('/reviews-events/reviews/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, source: 'DIRECT' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmittedReview(true);
    } catch {
      setReviewError(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  const resetReviewForm = () => {
    setReviewForm({ patientName: '', patientLocation: '', rating: 5, reviewText: '', doctorName: '', treatmentType: '' });
    setSubmittedReview(false);
    setReviewError(false);
  };

  // Camps come in two shapes: the hospital records (eventDate, venue, featuredDoctor…)
  // and the built-in fallback list (date, location, doctorInCharge…).
  const todayIso = new Date().toISOString().slice(0, 10);
  const formatDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  };
  const camps = events.map((e: any, i: number) => {
    const iso: string | undefined = typeof e.eventDate === 'string' ? e.eventDate.slice(0, 10) : undefined;
    const phone: string = e.registrationPhone || e.contactPhone || '+917507342222';
    return {
      id: String(e.id ?? i),
      iso,
      title: (isMr ? e.titleMr || e.title : e.title) as string,
      when: (iso ? formatDate(iso) : isMr ? e.dateMr || e.date : e.date) as string | undefined,
      time: (e.eventTime || e.timings) as string | undefined,
      where: (isMr ? e.venueMr || e.locationMr || e.venue || e.location : e.venue || e.location) as string | undefined,
      doctor: (e.featuredDoctor || e.doctorInCharge) as string | undefined,
      isFree: !!e.isFree,
      description: (isMr ? e.descriptionMr || e.description : e.description) as string | undefined,
      highlights: (Array.isArray(e.highlights) ? e.highlights : []) as string[],
      tel: phone.replace(/[^\d+]/g, ''),
      past: (!!iso && iso < todayIso) || e.status === 'COMPLETED',
    };
  });
  const upcomingCamps = camps
    .filter((c) => !c.past)
    .sort((a, b) => (a.iso || '').localeCompare(b.iso || ''));
  const pastCamps = camps.filter((c) => c.past).sort((a, b) => (b.iso || '').localeCompare(a.iso || ''));

  const sections = [
    { id: 'camps', label: isMr ? 'शिबिरे' : 'Camps' },
    { id: 'reviews', label: isMr ? 'अभिप्राय' : 'Reviews' },
    { id: 'awards', label: isMr ? 'पुरस्कार' : 'Awards' },
    { id: 'photos', label: isMr ? 'फोटो' : 'Photos' },
  ];

  return (
    <div className="pb-16">
      <PageIntro
        title={isMr ? 'आरोग्य शिबिरे आणि रुग्णांचे अनुभव' : 'Health camps and patient reviews'}
        intro={
          isMr
            ? 'हॉस्पिटलमध्ये नियमित होणारी मोफत तपासणी शिबिरे, रुग्णांनी लिहिलेले अनुभव, मिळालेले पुरस्कार आणि हॉस्पिटलचे फोटो.'
            : 'Free check-up camps held regularly at the hospital, what patients have written about their treatment, awards, and photos of the hospital.'
        }
      >
        <nav aria-label={isMr ? 'या पानावर' : 'On this page'} className="flex flex-wrap items-center gap-x-1 text-[15px]">
          {sections.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <span className="text-stone-300" aria-hidden="true">·</span>}
              <a
                href={`#${s.id}`}
                className="inline-flex items-center min-h-[44px] px-2 first:pl-0 font-semibold text-[#0F766E] hover:underline underline-offset-4"
              >
                {s.label}
              </a>
            </React.Fragment>
          ))}
        </nav>
      </PageIntro>

      {/* Camps */}
      <section id="camps" className={`${WRAP} py-12 sm:py-16 scroll-mt-20`}>
        <SectionTitle
          title={isMr ? 'मोफत आरोग्य शिबिरे' : 'Free health camps'}
          sub={
            isMr
              ? 'या शिबिरांमध्ये डॉक्टरांचा सल्ला मोफत आहे. जागा मर्यादित असल्याने आधी फोन करून नाव नोंदवा.'
              : 'Consultation at these camps is free. Places are limited, so please call ahead to register.'
          }
        />

        {upcomingCamps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingCamps.map((c) => (
              <article key={c.id} className="card-clean p-6 flex flex-col">
                <h3 className="text-xl leading-snug">{c.title}</h3>

                <dl className="mt-4 space-y-1.5 text-[15px]">
                  {c.when && (
                    <div className="flex gap-2">
                      <dt className="text-stone-500 w-16 shrink-0">{isMr ? 'केव्हा' : 'When'}</dt>
                      <dd className="text-[#1C2321]">
                        {c.when}
                        {c.time && <span className="text-stone-600">, {c.time}</span>}
                      </dd>
                    </div>
                  )}
                  {c.where && (
                    <div className="flex gap-2">
                      <dt className="text-stone-500 w-16 shrink-0">{isMr ? 'कुठे' : 'Where'}</dt>
                      <dd className="text-[#1C2321]">{c.where}</dd>
                    </div>
                  )}
                  {c.doctor && (
                    <div className="flex gap-2">
                      <dt className="text-stone-500 w-16 shrink-0">{isMr ? 'डॉक्टर' : 'Doctor'}</dt>
                      <dd className="text-[#1C2321]">{c.doctor}</dd>
                    </div>
                  )}
                  {c.isFree && (
                    <div className="flex gap-2">
                      <dt className="text-stone-500 w-16 shrink-0">{isMr ? 'शुल्क' : 'Cost'}</dt>
                      <dd className="text-[#1C2321]">{isMr ? 'मोफत' : 'Free'}</dd>
                    </div>
                  )}
                </dl>

                {c.description && <p className="mt-4 text-[15px] text-stone-600 leading-relaxed">{c.description}</p>}

                {c.highlights.length > 0 && (
                  <>
                    <p className="mt-4 text-sm font-semibold text-stone-700">{isMr ? 'यात समाविष्ट' : 'Includes'}</p>
                    <ul className="mt-1.5 list-disc pl-5 space-y-1 text-[15px] text-stone-700 marker:text-stone-400">
                      {c.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-auto pt-6">
                  <a href={`tel:${c.tel}`} className="btn-primary w-full sm:w-auto">
                    <Phone className="w-4 h-4" />
                    {isMr ? 'नोंदणीसाठी फोन करा' : 'Call to register'}
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="card-clean p-6 text-[15px] text-stone-700">
            {isMr
              ? 'सध्या कोणतेही शिबिर ठरलेले नाही. पुढील शिबिराबद्दल विचारण्यासाठी स्वागत कक्षाला फोन करा.'
              : 'No camps are scheduled right now. Call reception to ask about the next one.'}
          </p>
        )}

        {pastCamps.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg">{isMr ? 'अलीकडील शिबिरे' : 'Recent camps'}</h3>
            <ul className="mt-3 divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
              {pastCamps.map((c) => (
                <li key={c.id} className="py-3 flex flex-col sm:flex-row sm:gap-6">
                  <span className="text-stone-500 sm:w-40 shrink-0">{c.when}</span>
                  <span className="text-[#1C2321]">
                    {c.title}
                    {c.where && <span className="text-stone-500"> · {c.where}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 text-[15px] text-stone-600 max-w-2xl">
          {isMr
            ? 'तुमच्या गावात किंवा संस्थेत शिबिर घ्यायचे असल्यास स्वागत कक्षाला फोन करा: '
            : 'To hold a camp in your village or organisation, call reception on '}
          <a href="tel:+917507342222" className="font-semibold text-[#1C2321] hover:underline underline-offset-4 whitespace-nowrap">
            +91 75073 42222
          </a>
          .
        </p>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-white border-y border-[#E7E3DA] scroll-mt-20">
        <div className={`${WRAP} py-12 sm:py-16`}>
          <SectionTitle
            title={isMr ? 'रुग्णांचे अनुभव' : 'What patients say'}
            sub={isMr ? 'रुग्ण व त्यांच्या नातेवाईकांनी लिहिलेले अभिप्राय.' : 'Written by patients and their families.'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => {
              const rating = Math.max(0, Math.min(5, Number(rev.rating) || 0));
              const location = isMr ? rev.patientLocationMr || rev.patientLocation : rev.patientLocation;
              const treatment = isMr ? rev.treatmentTypeMr || rev.treatmentType : rev.treatmentType;
              return (
                <figure key={rev.id || idx} className="card-clean p-6 flex flex-col bg-[#FAF8F4]">
                  {rating > 0 && (
                    <div className="flex gap-0.5 text-[#C98A00]" aria-label={`${rating} / 5`}>
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 text-[15px] text-stone-700 leading-relaxed flex-1">
                    “{isMr ? rev.reviewTextMr || rev.reviewText : rev.reviewText}”
                  </blockquote>
                  <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <figcaption className="text-sm min-w-0">
                      <span className="font-semibold text-[#1C2321]">{rev.patientName}</span>
                      {location && <span className="text-stone-500">, {location}</span>}
                      {treatment && <span className="block text-stone-500">{treatment}</span>}
                      {rev.doctorName && <span className="block text-stone-500">{rev.doctorName}</span>}
                    </figcaption>
                    {rev.id && (
                      <button
                        type="button"
                        onClick={() => handleMarkHelpful(rev.id)}
                        disabled={!!helpfulClicked[rev.id]}
                        aria-pressed={!!helpfulClicked[rev.id]}
                        className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg border border-[#D8D3C8] bg-white text-sm text-stone-600 hover:border-[#BFB8A9] disabled:text-[#0F766E] disabled:border-[#0F766E]/40"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {isMr ? 'उपयुक्त' : 'Helpful'}
                        <span className="text-stone-500">({rev.helpfulCount || 0})</span>
                      </button>
                    )}
                  </div>
                </figure>
              );
            })}
          </div>

          {/* Review form */}
          <div className="mt-12 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h3 className="text-2xl leading-tight">{isMr ? 'तुमचा अनुभव लिहा' : 'Write a review'}</h3>
              <p className="mt-2 text-stone-600">
                {isMr
                  ? 'तुमचा अनुभव इतर रुग्णांना मदत करतो. हॉस्पिटलकडून तपासल्यानंतर अभिप्राय येथे दिसेल.'
                  : 'Your experience helps other patients. Reviews appear here after the hospital has checked them.'}
              </p>
            </div>

            <div className="lg:col-span-8 card-clean p-6 sm:p-8">
              {submittedReview ? (
                <div role="status" className="py-2">
                  <p className="text-lg font-semibold text-[#0F766E]">
                    {isMr ? 'धन्यवाद. तुमचा अभिप्राय मिळाला.' : 'Thank you. We have received your review.'}
                  </p>
                  <p className="mt-1 text-stone-600">
                    {isMr
                      ? 'तपासणीनंतर तो या पानावर दिसेल.'
                      : 'It will appear on this page once it has been checked.'}
                  </p>
                  <button type="button" onClick={resetReviewForm} className="btn-secondary mt-5">
                    {isMr ? 'दुसरा अभिप्राय लिहा' : 'Write another review'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="rv-name" className={LABEL}>
                        {isMr ? 'तुमचे नाव' : 'Your name'} <span className="text-[#C62828]">*</span>
                      </label>
                      <input
                        id="rv-name"
                        required
                        value={reviewForm.patientName}
                        onChange={(e) => setReviewForm({ ...reviewForm, patientName: e.target.value })}
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="rv-town" className={LABEL}>
                        {isMr ? 'शहर / गाव' : 'Town or village'}
                      </label>
                      <input
                        id="rv-town"
                        value={reviewForm.patientLocation}
                        onChange={(e) => setReviewForm({ ...reviewForm, patientLocation: e.target.value })}
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="rv-doctor" className={LABEL}>
                        {isMr ? 'डॉक्टरांचे नाव' : 'Doctor you saw'}
                      </label>
                      <input
                        id="rv-doctor"
                        value={reviewForm.doctorName}
                        onChange={(e) => setReviewForm({ ...reviewForm, doctorName: e.target.value })}
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="rv-treatment" className={LABEL}>
                        {isMr ? 'उपचार / शस्त्रक्रिया' : 'Treatment or operation'}
                      </label>
                      <input
                        id="rv-treatment"
                        value={reviewForm.treatmentType}
                        onChange={(e) => setReviewForm({ ...reviewForm, treatmentType: e.target.value })}
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div className="sm:max-w-xs">
                    <label htmlFor="rv-rating" className={LABEL}>
                      {isMr ? 'रेटिंग' : 'Rating'} <span className="text-[#C62828]">*</span>
                    </label>
                    <select
                      id="rv-rating"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className={INPUT}
                    >
                      <option value={5}>5 – {isMr ? 'उत्कृष्ट' : 'Excellent'}</option>
                      <option value={4}>4 – {isMr ? 'खूप चांगले' : 'Very good'}</option>
                      <option value={3}>3 – {isMr ? 'चांगले' : 'Good'}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rv-text" className={LABEL}>
                      {isMr ? 'तुमचा अनुभव' : 'Your review'} <span className="text-[#C62828]">*</span>
                    </label>
                    <textarea
                      id="rv-text"
                      required
                      rows={4}
                      value={reviewForm.reviewText}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                      className={`${INPUT} resize-y`}
                    />
                  </div>

                  {reviewError && (
                    <p role="alert" className="text-[15px] text-[#C62828]">
                      {isMr
                        ? 'अभिप्राय पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा किंवा +91 75073 42222 वर फोन करा.'
                        : 'Your review could not be sent. Please try again, or call +91 75073 42222.'}
                    </p>
                  )}

                  <button type="submit" disabled={submittingReview} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                    {submittingReview ? (isMr ? 'पाठवत आहे…' : 'Sending…') : isMr ? 'अभिप्राय पाठवा' : 'Send review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className={`${WRAP} py-12 sm:py-16 scroll-mt-20`}>
        <SectionTitle title={isMr ? 'पुरस्कार व सन्मान' : 'Awards and recognition'} />
        <ul className="grid md:grid-cols-2 gap-x-10 border-t border-[#E7E3DA] md:border-t-0">
          {AWARDS_DATA.map((item) => (
            <li key={item.id} className="py-5 border-b border-[#E7E3DA] md:first:border-t md:[&:nth-child(2)]:border-t flex gap-5">
              <span className="font-heading text-lg text-stone-500 w-12 shrink-0">{item.year}</span>
              <div className="min-w-0">
                <h3 className="text-lg leading-snug">{isMr ? item.titleMr : item.title}</h3>
                <p className="mt-0.5 text-sm text-stone-500">{isMr ? item.subtitleMr : item.subtitle}</p>
                <p className="mt-2 text-[15px] text-stone-600 leading-relaxed">
                  {isMr ? item.descriptionMr : item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Photos */}
      <section id="photos" className="bg-white border-t border-[#E7E3DA] scroll-mt-20">
        <div className={`${WRAP} py-12 sm:py-16`}>
          <SectionTitle
            title={isMr ? 'हॉस्पिटलचे फोटो' : 'Photos of the hospital'}
            sub={isMr ? 'अंबड चौफुली, जालना येथील आमचे विभाग आणि कर्मचारी.' : 'Our wards, theatres and staff at Ambad Choufuli, Jalna.'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {GALLERY.map((g) => (
              <figure key={g.key}>
                <Photo src={PHOTOS[g.key]} alt={isMr ? g.mr : g.en} className="w-full aspect-[4/3] rounded-lg" />
                <figcaption className="mt-2 text-sm text-stone-600">{isMr ? g.mr : g.en}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
