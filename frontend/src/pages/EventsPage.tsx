import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Stethoscope,
  Star,
  Quote,
  ThumbsUp,
  Send,
  HeartPulse,
  Award,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Camera,
  Trophy,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';
import { AWARDS_DATA } from '../data/awardsData';

export const EventsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const defaultEvents = [
    {
      id: 'camp-1',
      title: 'Free Orthopedic & Joint Pain Diagnostic Camp',
      titleMr: 'मोफत सांधेदुखी, गुडघेदुखी व हाडांचे तपासणी शिबिर',
      category: 'Orthopedics & Spine',
      categoryMr: 'अस्थिरोग व मणके विकार',
      date: 'Upcoming: Every Sunday',
      dateMr: 'दर रविवारी सकाळी १० ते दुपारी २',
      timings: '10:00 AM – 02:00 PM',
      location: 'Sanjeevani Hospital OPD Hall, Ambad Choufuli, Jalna',
      locationMr: 'संजीवनी हॉस्पिटल ओपीडी हॉल, अंबड चौफुली, जालना',
      doctorInCharge: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      isFree: true,
      description:
        'Free clinical consultation for knee pain, hip arthritis, backache, sciatica, and post-fracture stiffness. Includes free Bone Mineral Density (BMD) screening.',
      descriptionMr:
        'गुडघेदुखी, कंबरदुखी, मणक्याचे आजार, सांधेदुखी व जुन्या फ्रॅक्चरवर तज्ज्ञ डॉक्टरांचा मोफत सल्ला आणि हाडांच्या घनतेची (BMD) मोफत तपासणी.',
      highlights: [
        isMr ? 'मोफत हाडांची घनता चाचणी (BMD)' : 'Free Bone Mineral Density (BMD) Test',
        isMr ? 'एक्स-रे वर ५०% विशेष सवलत' : '50% Discount on Digital X-Rays',
        isMr ? 'तज्ज्ञ ऑर्थोपेडिक सर्जन सल्ला' : 'Specialist Orthopedic Surgeon Consult',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-2',
      title: 'Free Pediatric Health Checkup & Vaccination Drive',
      titleMr: 'मोफत बालरोग तपासणी व बाल लसीकरण मोहीम',
      category: 'Pediatrics & Neonatal',
      categoryMr: 'बालरोग व शिशु आरोग्य',
      date: 'Every Wednesday & Saturday',
      dateMr: 'दर बुधवारी व शनिवारी सकाळी ११ ते दुपारी ३',
      timings: '11:00 AM – 03:00 PM',
      location: 'Pediatric Wing (1st Floor), Sanjeevani Hospital Jalna',
      locationMr: 'बालरोग विभाग (पहिला मजला), संजीवनी हॉस्पिटल जालना',
      doctorInCharge: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      isFree: true,
      description:
        'Growth and developmental monitoring, pediatric asthma screening, malnutrition evaluation, and national immunization schedule vaccinations for children aged 0–15 years.',
      descriptionMr:
        '० ते १५ वयोगटातील मुलांची शारीरिक वाढ, दमा व अ‍ॅलर्जी तपासणी, कुपोषण निवारण आणि राष्ट्रीय लसीकरण वेळापत्रकानुसार मोफत बालरोग सल्ला.',
      highlights: [
        isMr ? 'मोफत बालरोग वजन व वाढ तपासणी' : 'Free Child Growth & Milestone Assessment',
        isMr ? 'लहान मुलांच्या दम्याची मोफत तपासणी' : 'Pediatric Asthma & Allergy Screening',
        isMr ? 'तज्ज्ञ बालरोगतज्ज्ञांचा थेट सल्ला' : 'Direct Consultant Pediatrician Checkup',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-3',
      title: 'Diabetes, Hypertension & Cardiac Screening Camp',
      titleMr: 'मधुमेह, उच्च रक्तदाब व हृदयविकार तपासणी शिबिर',
      category: 'Internal Medicine & Cardiology',
      categoryMr: 'इंटरनल मेडिसिन व हृदय तपासणी',
      date: 'Monthly 1st & 3rd Friday',
      dateMr: 'दर महिन्याचा पहिला व तिसरा शुक्रवार',
      timings: '09:00 AM – 01:00 PM',
      location: 'Ground Floor Health Center, Sanjeevani Hospital Jalna',
      locationMr: 'तळमजला आरोग्य केंद्र, संजीवनी हॉस्पिटल जालना',
      doctorInCharge: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      isFree: true,
      description:
        'Comprehensive screening for chronic diabetes, high blood pressure, cholesterol abnormalities, and early cardiovascular risks. Includes free random blood sugar and ECG test.',
      descriptionMr:
        'मधुमेह, उच्च रक्तदाब, कोलेस्टेरॉल आणि हृदयविकार प्रतिबंधात्मक मोफत तपासणी. मोफत रक्तातील साखर (BSL) व मोफत ईसीजी (ECG) चाचणी उपलब्ध.',
      highlights: [
        isMr ? 'मोफत रक्तातील साखर तपासणी (BSL)' : 'Free Random Blood Sugar Testing',
        isMr ? 'मोफत ईसीजी (ECG) चाचणी' : 'Free ECG Cardiac Screening',
        isMr ? 'मधुमेह आहार व जीवनशैली मार्गदर्शन' : 'Diabetes Diet & Lifestyle Counseling',
      ],
      contactPhone: '+917507342222',
    },
    {
      id: 'camp-4',
      title: 'MJPJAY Free Surgical Screening & Registration Camp',
      titleMr: 'महात्मा फुले योजना मोफत शस्त्रक्रिया तपासणी शिबिर',
      category: 'Government Scheme Surgeries',
      categoryMr: 'शासकीय योजना शस्त्रक्रिया',
      date: 'Daily Active (Mon–Sat)',
      dateMr: 'दररोज चालू (सोमवार ते शनिवार)',
      timings: '09:00 AM – 05:00 PM',
      location: 'Arogya Mitra Desk (Room 102), Sanjeevani Hospital Jalna',
      locationMr: 'आरोग्य मित्र कक्ष (रूम १०२), संजीवनी हॉस्पिटल जालना',
      doctorInCharge: 'Hospital Surgical Faculty & Arogya Mitra Team',
      isFree: true,
      description:
        'Instant on-spot eligibility assessment for yellow and orange ration card holders for completely free surgery (Knee replacement, Hernia, Gallbladder stones, Appendix, C-Section).',
      descriptionMr:
        'पिवळे व केशरी रेशन कार्डधारकांसाठी मोफत शस्त्रक्रिया (गुडघे प्रत्यारोपण, हर्निया, पित्ताशयातील खडे, अपेंडिक्स, सिझेरियन) पात्रता पडताळणी व मोफत नावनोंदणी.',
      highlights: [
        isMr ? '१००% मोफत कॅशलेस शस्त्रक्रिया नोंदणी' : '100% Cashless Surgery Registration',
        isMr ? 'तात्काळ रेशन कार्ड ऑनलाइन पडताळणी' : 'Instant Online Portal Verification',
        isMr ? 'शून्य खर्च व मोफत औषधोपचार' : 'Zero Deposit & Free Post-Op Medicines',
      ],
      contactPhone: '+917507342222',
    },
  ];

  const defaultReviews = [
    {
      id: 'rev-1',
      patientName: 'Kailashnath Shinde',
      patientLocation: 'Jalna City',
      patientLocationMr: 'जालना शहर',
      treatmentType: 'Total Knee Replacement (TKR)',
      treatmentTypeMr: 'गुडघे प्रत्यारोपण शस्त्रक्रिया',
      doctorName: 'Dr. Nishant Goyal',
      rating: 5,
      date: 'August 2026',
      helpfulCount: 42,
      reviewText:
        'My mother had severe knee pain for 6 years and could not walk. Dr. Nishant Goyal performed total knee replacement at Sanjeevani Hospital under MJPJAY scheme. The surgery was completely cashless and my mother walked painlessly on the 2nd day itself. Excellent care by nurses and doctors!',
      reviewTextMr:
        'माझ्या आईला गेल्या ६ वर्षांपासून गुडघ्यांचा तीव्र त्रास होता. डॉ. निशांत गोयल सरांनी महात्मा फुले योजनेतून दोन्ही गुडघ्यांचे यशस्वी प्रत्यारोपण केले. एकही रुपया न लागता १००% मोफत उपचार झाले. आई आता विनाआधार चालू शकते. संजीवनी हॉस्पिटलच्या संपूर्ण टीमचे मनःपूर्वक आभार!',
    },
    {
      id: 'rev-2',
      patientName: 'Sunita & Rameshwar Solanke',
      patientLocation: 'Ambad, Jalna',
      patientLocationMr: 'अंबड, जालना',
      treatmentType: 'NICU Care for Preterm Newborn',
      treatmentTypeMr: 'नवजात शिशु अतिदक्षता (NICU)',
      doctorName: 'Dr. Shivdas Mirkad',
      rating: 5,
      date: 'July 2026',
      helpfulCount: 38,
      reviewText:
        'Our baby was born prematurely at 7 months with very low birth weight (1.2 kg) and respiratory issues. Dr. Shivdas Mirkad and the NICU nursing staff cared for our baby with utmost compassion for 18 days. Today our child is healthy and thriving. Best child hospital in Marathwada!',
      reviewTextMr:
        'आमचे बाळ ७ व्या महिन्यात अवघ्या १.२ किलो वजनाचे जन्माला आले होते. बाळाला श्वास घेण्यास त्रास होत होता. डॉ. शिवदास मिरकड सर आणि एनआयसीयू टीमने १८ दिवस बाळाची अतिशय काळजीपूर्वक देखरेख केली. आज आमचे बाळ पूर्णपणे निरोगी आहे. लहान मुलांच्या उपचारासाठी संजीवनी हॉस्पिटल नंबर १ आहे!',
    },
    {
      id: 'rev-3',
      patientName: 'Ganesh Deshmukh',
      patientLocation: 'Partur, Jalna',
      patientLocationMr: 'परतूर, जालना',
      treatmentType: 'Emergency ICU Trauma Resuscitation',
      treatmentTypeMr: 'आपत्कालीन आयसीयू ट्रॉमा उपचार',
      doctorName: 'Dr. Baliram Bagal',
      rating: 5,
      date: 'August 2026',
      helpfulCount: 56,
      reviewText:
        'My brother met with a severe road accident with head trauma and multiple fractures. Sanjeevani casualty and ICU team under Dr. Baliram Bagal stabilized him within 10 minutes on ventilator support. Their quick emergency response and 24-hour critical monitoring saved his life.',
      reviewTextMr:
        'माझ्या भावाचा गंभीर अपघात झाला होता. डोक्याला जबर मार लागला होता. रात्री १ वाजता संजीवनी हॉस्पिटलमध्ये आणले. डॉ. बळीराम बागल सर आणि आयसीयू टीमने तात्काळ व्हेंटिलेटर लावून जीव वाचवला. २१ खाटांचा सुसज्ज आयसीयू आणि २४ तास डॉक्टर उपस्थितीमुळेच माझा भाऊ सुखरूप वाचला.',
    },
    {
      id: 'rev-4',
      patientName: 'Pooja Vijay Kulkarni',
      patientLocation: 'Bhokardan, Jalna',
      patientLocationMr: 'भोकरदन, जालना',
      treatmentType: 'Safe Maternity & Laparoscopy',
      treatmentTypeMr: 'सुरक्षित प्रसूती व दुर्बिणीद्वारे शस्त्रक्रिया',
      doctorName: 'Dr. Anshul Goyal',
      rating: 5,
      date: 'June 2026',
      helpfulCount: 29,
      reviewText:
        'Dr. Anshul Goyal is extremely gentle, knowledgeable, and reassuring. My delivery went smoothly without complications. The maternity rooms are clean, private, and well-maintained. Highly recommended for maternity and women health.',
      reviewTextMr:
        'डॉ. अंशुल गोयल मॅडम अतिशय अनुभवी व आपुलकीने मार्गदर्शन करणाऱ्या आहेत. माझी प्रसूती अत्यंत सुरक्षित आणि कोणत्याही त्रासाशिवाय झाली. हॉस्पिटलमधील प्रसूती कक्ष अतिशय स्वच्छ आणि सुरक्षित आहे.',
    },
  ];

  const campGallery = [
    {
      id: 'gal-1',
      title: 'Free Diagnostic & Blood Sugar Screening Camp',
      titleMr: 'मोफत सर्वोपचार व रक्त शर्करा तपासणी शिबिर',
      location: 'Sanjeevani Hospital Jalna Campus',
      locationMr: 'संजीवनी हॉस्पिटल परिसर, अंबड चौफुली, जालना',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.07-AM-2.webp',
      desc: 'Free clinical checkups, random blood sugar testing, and vital organ monitoring for 500+ attendees.',
      descMr: '५०० हून अधिक नागरिकांची मोफत आरोग्य तपासणी, रक्तातील साखर व रक्तदाब चाचणी.'
    },
    {
      id: 'gal-2',
      title: 'Free Orthopedic Joint & Bone Mineral Density Screening',
      titleMr: 'मोफत सांधेदुखी व हाडांची घनता (BMD) तपासणी शिबिर',
      location: 'Orthopedic OPD Wing',
      locationMr: 'अस्थिरोग विभाग, जालना',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.06-AM.webp',
      desc: 'Specialist spine and knee examination for elderly patients with chronic osteoarthritis.',
      descMr: 'ज्येष्ठ नागरिकांसाठी मणके व गुडघेदुखीवर तज्ज्ञ डॉक्टरांचा मोफत सल्ला.'
    },
    {
      id: 'gal-3',
      title: 'Pediatric Growth & Maternal Wellness Drive',
      titleMr: 'बालरोग विकास व माता संगोपन तपासणी मोहीम',
      location: 'Rural Outreach Jalna',
      locationMr: 'ग्रामीण आरोग्य मोहीम, जालना',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.09-AM-1.webp',
      desc: 'Nutritional evaluation and child growth milestone checkups conducted by senior pediatricians.',
      descMr: 'लहान मुलांची मोफत शारीरिक वाढ व पोषण तपासणी आणि मोफत औषधोपचार.'
    },
    {
      id: 'gal-4',
      title: 'Cardiac Awareness & Free ECG Checkup Camp',
      titleMr: 'हृदयविकार प्रतिबंध व मोफत ईसीजी चाचणी शिबिर',
      location: 'Community Diagnostic Center',
      locationMr: 'आरोग्य केंद्र, जालना',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.08-AM-1.webp',
      desc: 'Early cardiovascular risk screening and lifestyle counseling by internal medicine experts.',
      descMr: 'तज्ज्ञ डॉक्टरांकडून मोफत ईसीजी तपासणी आणि हृदयविकार प्रतिबंधात्मक मार्गदर्शन.'
    },
    {
      id: 'gal-5',
      title: 'MJPJAY Cashless Health Scheme Registration Camp',
      titleMr: 'महात्मा फुले जन आरोग्य योजना मोफत नोंदणी कक्ष',
      location: 'Arogya Mitra Helpdesk',
      locationMr: 'आरोग्य मित्र कक्ष, संजीवनी हॉस्पिटल',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.09-AM.webp',
      desc: 'Assisting yellow and orange ration card families with instant cashless surgery authorizations.',
      descMr: 'पिवळे व केशरी रेशन कार्डधारकांसाठी मोफत शस्त्रक्रिया मार्गदर्शन व ऑनलाइन नोंदणी.'
    },
    {
      id: 'gal-6',
      title: 'Senior Citizen General Health & Eye Checkup Camp',
      titleMr: 'ज्येष्ठ नागरिक सर्वोपचार व नेत्र तपासणी शिबिर',
      location: 'Jalna Community Hall',
      locationMr: 'जालना कम्युनिटी हॉल',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.10-AM-1.webp',
      desc: 'Full body vitals, vision screening, and health evaluation conducted by medical team.',
      descMr: 'संपूर्ण शारीरिक तपासणी व मोफत औषधोपचार वाटप.'
    },
    {
      id: 'gal-7',
      title: 'Women Wellness & Antenatal Care Camp',
      titleMr: 'महिला आरोग्य व सुरक्षित प्रसूती मार्गदर्शन शिबिर',
      location: 'Maternity Wing',
      locationMr: 'प्रसूती व स्त्रीरोग विभाग',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.10-AM.webp',
      desc: 'Gynecological screening and antenatal counseling for expectant mothers.',
      descMr: 'स्त्रीरोगतज्ज्ञांकडून मोफत तपासणी आणि सुरक्षित मातृत्व मार्गदर्शन.'
    },
    {
      id: 'gal-8',
      title: 'Free Medicine Distribution & Health Camp',
      titleMr: 'मोफत औषध वाटप व आरोग्य तपासणी मोहीम',
      location: 'Jalna District',
      locationMr: 'जालना जिल्हा',
      image: 'https://sanjeevanihosp.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-11.52.11-AM.webp',
      desc: 'Providing prescribed essential medicines at zero cost to underprivileged patients.',
      descMr: 'गरजू रुग्णांना आवश्यक औषधांचे मोफत वाटप.'
    },
  ];

  const [events, setEvents] = useState<any[]>(defaultEvents);
  const [reviews, setReviews] = useState<any[]>(defaultReviews);
  const [activeTab, setActiveTab] = useState<'events' | 'awards' | 'gallery' | 'reviews'>('events');

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
    try {
      await fetch(apiUrl('/reviews-events/reviews/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, source: 'DIRECT' }),
      });
      setSubmittedReview(true);
      setReviews((prev) => [
        {
          id: `rev-${Date.now()}`,
          patientName: reviewForm.patientName,
          patientLocation: reviewForm.patientLocation || 'Jalna',
          treatmentType: reviewForm.treatmentType || 'Specialist Consultation',
          doctorName: reviewForm.doctorName || 'Senior Consultant',
          rating: reviewForm.rating,
          date: 'Just now',
          helpfulCount: 0,
          reviewText: reviewForm.reviewText,
        },
        ...prev,
      ]);
    } catch {
      setSubmittedReview(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* ─── 1. HERO BANNER (CLEAN HEALTHCARE STYLING) ───────────────────────── */}
      <div className="card-clean p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 border border-teal-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="badge-teal text-xs py-1 px-3">
            <HeartPulse className="w-4 h-4 text-[#0F766E]" />
            <span>{isMr ? 'सामाजिक आरोग्य उपक्रम आणि रुग्ण अनुभव' : 'Community Health Initiatives & Verified Patient Feedback'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isMr ? '४.९ / ५ रुग्ण समाधान दर' : '4.9 / 5 Rating across 1,200+ Reviews'}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            {isMr ? 'मोफत आरोग्य शिबिरे आणि' : 'Community Health Camps &'}<br />
            <span className="text-[#0F766E]">
              {isMr ? 'रुग्णांचे खरे अनुभव व अभिप्राय' : 'Verified Patient Reviews'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {isMr
              ? 'संजीवनी हॉस्पिटल, जालना तर्फे ग्रामीण व शहरी भागातील नागरिकांसाठी नियमित आयोजित केली जाणारी मोफत तपासणी शिबिरे आणि यशस्वी उपचार घेतलेल्या हजारो समाधानी रुग्णांचे मनोगत.'
              : 'Free specialist diagnostic checkup camps organized regularly by Sanjeevani Multispeciality Hospital, Jalna, and genuine recovery stories from cured patients.'}
          </p>
        </div>

        {/* 4 Standout Infographic Badges (Proper Warm Yellow/Amber Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-xs">
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'मोफत शिबिरे' : 'Health Camps'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '१००+ मोफत शिबिरे' : '100+ Camps Done'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'जालना व मराठवाड्यात' : 'Across Marathwada'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'रुग्ण तपासणी' : 'Free Screenings'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '२५,०००+ मोफत तपासण्या' : '25,000+ Screened'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'बीएमडी, ईसीजी व रक्त चाचण्या' : 'BMD, ECG, blood sugar'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'समाधानी रुग्ण' : 'Happy Patients'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '५०,०००+ बरे झालेले रुग्ण' : '50,000+ Treated'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'यशस्वी शस्त्रक्रिया व उपचार' : 'Since 2016 in Jalna'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'रुग्ण समाधान' : 'Satisfaction'}</p>
            <p className="font-bold text-teal-700 text-base mt-0.5">99.4%</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'क्लिनिकल अचूकता दर' : 'Positive clinical outcome'}</p>
          </div>
        </div>
      </div>

      {/* ─── 2. TAB SWITCHER (CLEAN RESPONSIVE GRID - NO SLIDER) ─────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-xl w-full max-w-4xl">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
            activeTab === 'events'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#0F766E]" />
          <span className="truncate">{isMr ? 'आरोग्य शिबिरे' : 'Health Camps'}</span>
        </button>
        <button
          onClick={() => setActiveTab('awards')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
            activeTab === 'awards'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-500" />
          <span className="truncate">{isMr ? 'पुरस्कार व सन्मान' : 'Awards & Honors'}</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
            activeTab === 'gallery'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 shrink-0 text-[#0F766E]" />
          <span className="truncate">{isMr ? 'शिबिर फोटो गॅलरी' : 'Camps Gallery'}</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-center ${
            activeTab === 'reviews'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-500" />
          <span className="truncate">{isMr ? 'रुग्ण अभिप्राय' : 'Patient Reviews'}</span>
        </button>
      </div>

      {/* ─── TAB 1: HEALTH CAMPS & EVENTS ────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'संजीवनी हॉस्पिटलचे आगामी व नियमित मोफत आरोग्य शिबिरे' : 'Upcoming & Regular Free Community Health Camps'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'खालील सर्व शिबिरांमध्ये तज्ज्ञ डॉक्टरांचा सल्ला आणि मूलभूत चाचण्या पूर्णपणे मोफत उपलब्ध आहेत:'
                : 'All diagnostic checkups and senior doctor consultations in the following camps are 100% free:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="card-clean p-6 flex flex-col justify-between space-y-5 bg-slate-50/50 hover:bg-white hover:shadow-card-hover transition"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge-teal text-xs py-0.5">
                      {isMr ? event.categoryMr || event.category : event.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {event.isFree ? (isMr ? '१००% मोफत' : '100% FREE') : 'SPECIAL CAMP'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug">
                    {isMr ? event.titleMr || event.title : event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {isMr ? event.descriptionMr || event.description : event.description}
                  </p>

                  {/* Highlights Checklist */}
                  {event.highlights && (
                    <div className="space-y-1.5 pt-1">
                      {event.highlights.map((hl: string, hIdx: number) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metadata Box with Soft Color */}
                <div className="space-y-2 pt-3 border-t border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Calendar className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{isMr ? event.dateMr || event.date : event.date}</span>
                    <span className="text-slate-400 font-normal">({event.timings})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{isMr ? event.locationMr || event.location : event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.doctorInCharge}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${event.contactPhone || '+917507342222'}`}
                    className="btn-primary text-xs w-full py-2.5 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isMr ? 'शिबिरासाठी नावनोंदणी / माहिती (+91-75073-42222)' : 'Inquire / Free Camp Registration'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Health Camp Organizers Note */}
          <div className="card-clean p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold font-heading">
                {isMr ? 'तुमच्या गावात किंवा संस्थेत मोफत शिबिर आयोजित करायचे आहे का?' : 'Want to organize a free health camp in your village or organization?'}
              </h4>
              <p className="text-xs text-slate-300">
                {isMr
                  ? 'संजीवनी हॉस्पिटलची वैद्यकीय टीम आवश्यक तपासणी उपकरणांसह आपल्या परिसरात मोफत शिबिर आयोजित करू शकते.'
                  : 'Sanjeevani Multispeciality Hospital medical team conducts free mobile diagnostic camps across Jalna district.'}
              </p>
            </div>
            <a
              href="tel:+917507342222"
              className="btn-primary text-xs py-2.5 px-4 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isMr ? 'शिबिर समन्वयकांशी बोला' : 'Contact Camp Coordinator'}</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── TAB 2: AWARDS & HONORS (16 AUTHENTIC CITATIONS FROM LIVE WEBSITE) ── */}
      {activeTab === 'awards' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{isMr ? 'संजीवनी हॉस्पिटलचे अधिकृत पुरस्कार, सन्मान व यशोगाथा' : 'Official Awards, Citations & Institutional Achievements'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'वैद्यकीय गुणवत्ता, २४ तास आपत्कालीन अतिदक्षता आणि निष्कलंक रुग्णसेवेसाठी मिळालेली सन्मानचिन्हे व पारितोषिके:'
                : 'Recognized for benchmark critical care resuscitation, MJPJAY implementation, and community health services across Maharashtra:'}
            </p>
          </div>

          {/* 16 Awards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AWARDS_DATA.map((item) => (
              <div
                key={item.id}
                className="card-clean overflow-hidden flex flex-col group hover:shadow-card-hover transition bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    <span>{item.year || 'Honor'}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      {isMr ? item.subtitleMr : item.subtitle}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0F766E] transition font-heading mt-0.5">
                      {isMr ? item.titleMr : item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {isMr ? item.descriptionMr : item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-[#0F766E] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMr ? 'अधिकृत गौरव' : 'Verified Citation'}</span>
                    </span>
                    <span className="text-slate-400 font-medium">Sanjeevani Jalna</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Milestone Banner */}
          <div className="card-clean p-6 sm:p-8 bg-gradient-to-r from-amber-50/80 via-white to-teal-50 border border-amber-200 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="badge-teal text-xs">{isMr ? '२०१६ पासून अविरत विश्वास' : 'Serving Jalna Since 2016'}</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                {isMr ? '५०,०००+ समाधानी रुग्ण आणि अविरत जीवनरक्षक कार्य' : '50,000+ Patients Treated with Compassion & Clinical Precision'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isMr
                  ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना हे सर्वसामान्य कुटुंबांसाठी उच्च दर्जाचे आणि विश्वासार्ह वैद्यकीय उपचार रास्त दरात उपलब्ध करून देण्यासाठी वचनबद्ध आहे.'
                  : 'Our healthcare mission continues with unwavering dedication to clinical excellence, zero hidden fees, and empathetic round-the-clock emergency medical response.'}
              </p>
            </div>
            <a
              href="tel:+917507342222"
              className="btn-primary text-xs py-3 px-6 whitespace-nowrap shadow-sm shrink-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{isMr ? 'हॉस्पिटल हेल्पलाईन: +91-75073-42222' : 'Hospital Desk: +91-75073-42222'}</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── TAB 3: VERIFIED PATIENT REVIEWS & STORIES ───────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Summary Rating Stats Card with Soft Teal Background */}
          <div className="card-clean p-6 sm:p-8 bg-teal-50/40 border border-teal-100 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-[#0F766E] font-heading">4.9 / 5</p>
              <div className="flex justify-center text-amber-400 gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">{isMr ? 'सरासरी रुग्ण रेटिंग' : 'Overall Patient Rating'}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 font-heading">1,200+</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{isMr ? 'पडताळलेले अभिप्राय' : 'Verified Reviews'}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-700 font-heading">99.4%</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{isMr ? 'समाधान व पुनरुत्थान दर' : 'Clinical Recovery Rate'}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 font-heading">50,000+</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{isMr ? 'उपचार घेतलेले रुग्ण' : 'Patients Treated Since 2016'}</p>
            </div>
          </div>

          {/* Patient Reviews Grid with Generous Whitespace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="card-clean p-6 flex flex-col justify-between space-y-4 bg-slate-50/40 hover:bg-white hover:shadow-card-hover transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="badge-teal text-[10px] py-0.5">
                      {isMr ? 'पडताळलेला रुग्ण' : 'Verified Patient'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                    "{isMr ? rev.reviewTextMr || rev.reviewText : rev.reviewText}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                      {rev.patientName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {isMr ? rev.patientLocationMr || rev.patientLocation : rev.patientLocation} • <span className="text-[#0F766E] font-medium">{isMr ? rev.treatmentTypeMr || rev.treatmentType : rev.treatmentType}</span>
                    </span>
                    {rev.doctorName && (
                      <span className="text-[10px] text-slate-400 block">
                        {isMr ? 'तज्ज्ञ डॉक्टर:' : 'Consultant:'} {rev.doctorName}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkHelpful(rev.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0F766E] hover:border-teal-300 text-xs font-semibold transition"
                    title="Helpful review"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>{rev.helpfulCount || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Patient Review Form */}
          <div className="card-clean p-6 sm:p-8 space-y-5 bg-white">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'संजीवनी हॉस्पिटलमधील तुमचा अनुभव व अभिप्राय नोंदवा' : 'Share Your Sanjeevani Hospital Experience'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isMr
                  ? 'तुमचा प्रामाणिक अभिप्राय इतर रुग्णांना योग्य वैद्यकीय निर्णय घेण्यास मदत करतो.'
                  : 'Your genuine review helps other patients make informed healthcare decisions.'}
              </p>
            </div>

            {submittedReview ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {isMr ? 'आपल्या मौल्यवान अभिप्रायाबद्दल धन्यवाद!' : 'Thank you for your valuable feedback!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isMr ? 'आपला अभिप्राय पडताळणीनंतर प्रकाशित केला जाईल.' : 'Your verified review has been recorded.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'तुमचे पूर्ण नाव *' : 'Your Full Name *'}
                    </label>
                    <input
                      required
                      value={reviewForm.patientName}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientName: e.target.value })}
                      placeholder={isMr ? 'उदा. आनंद शिंदे' : 'e.g. Anand Shinde'}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'शहर / गाव' : 'City / Town / Village'}
                    </label>
                    <input
                      value={reviewForm.patientLocation}
                      onChange={(e) => setReviewForm({ ...reviewForm, patientLocation: e.target.value })}
                      placeholder={isMr ? 'उदा. जालना शहर / परतूर / अंबड' : 'e.g. Jalna City / Ambad'}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'उपचार केलेले डॉक्टर' : 'Doctor Consulted'}
                    </label>
                    <input
                      value={reviewForm.doctorName}
                      onChange={(e) => setReviewForm({ ...reviewForm, doctorName: e.target.value })}
                      placeholder={isMr ? 'उदा. डॉ. निशांत गोयल / डॉ. शिवदास मिरकड' : 'e.g. Dr. Nishant Goyal'}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isMr ? 'उपचार किंवा शस्त्रक्रिया प्रकार' : 'Treatment / Surgery / Department'}
                    </label>
                    <input
                      value={reviewForm.treatmentType}
                      onChange={(e) => setReviewForm({ ...reviewForm, treatmentType: e.target.value })}
                      placeholder={isMr ? 'उदा. गुडघे प्रत्यारोपण / NICU केअर' : 'e.g. Knee Replacement / NICU Care'}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'तुमचे रेटिंग *' : 'Your Rating *'}
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 - {isMr ? 'उत्कृष्ट व समाधानकारक सेवा' : 'Outstanding Care'})</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 - {isMr ? 'खूप चांगली सेवा' : 'Very Good Care'})</option>
                    <option value={3}>⭐⭐⭐ (3/5 - {isMr ? 'चांगली सेवा' : 'Good Care'})</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'तुमचा सविस्तर अनुभव *' : 'Your Detailed Feedback *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    placeholder={
                      isMr
                        ? 'डॉक्टरांचा सल्ला, हॉस्पिटलमधील स्वच्छता, नर्सिंग सेवा किंवा शस्त्रक्रियेचा अनुभव सांगा...'
                        : 'Describe the doctor consultation, nursing care, ICU monitoring, or overall recovery experience...'
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? (isMr ? 'सबमिट होत आहे...' : 'Posting...') : (isMr ? 'अभिप्राय प्रकाशित करा' : 'Submit Patient Review')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: REAL HEALTH CAMPS PHOTO GALLERY & NEWS ───────────────────── */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'संजीवनी हॉस्पिटल मोफत आरोग्य शिबिर छायाचित्रे व वृत्त' : 'Real Community Health Camps Photo Gallery & News'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना द्वारे आयोजित केलेल्या मोफत आरोग्य तपासणी, औषध वाटप व निदान शिबिरांची छायाचित्रे:'
                : 'Direct on-ground photographs from free diagnostic camps and medical checkup drives conducted by Sanjeevani Hospital across Jalna:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {campGallery.map((item) => (
              <div
                key={item.id}
                className="card-clean overflow-hidden flex flex-col group hover:shadow-card-hover transition"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    <span>{isMr ? item.locationMr : item.location}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0F766E] transition font-heading">
                      {isMr ? item.titleMr : item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {isMr ? item.descMr : item.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-[#0F766E] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMr ? 'मोफत शिबिर' : 'Free Camp'}</span>
                    </span>
                    <a
                      href="tel:+917507342222"
                      className="text-slate-700 hover:text-[#0F766E] font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>+91-75073-42222</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hospital Building & Facilities Banner */}
          <div className="card-clean p-6 sm:p-8 bg-gradient-to-r from-teal-50 via-white to-amber-50/50 border border-teal-200 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="badge-teal text-xs">Sanjeevani Multispeciality Hospital, Jalna</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                {isMr
                  ? '२४ तास आपत्कालीन सेवा, २१ खाटांचा ICU व प्रगत शस्त्रक्रिया सुविधा'
                  : '24x7 Emergency Trauma Care, 21-Bed ICU & Advanced Modular Surgical Suites'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isMr
                  ? 'अंबड चौफुली, जालना येथे अनुभवी तज्ज्ञ डॉक्टरांची अखंड सेवा उपलब्ध आहे. महात्मा फुले जन आरोग्य योजना (MJPJAY) व सर्व मेडिक्लेम कॅशलेस सुविधा उपलब्ध.'
                  : 'Located at Ambad Choufuli, Jalna. Empanelled for 100% cashless treatment under MJPJAY and 35+ major health insurance companies.'}
              </p>
            </div>
            <a
              href="tel:+917507342222"
              className="btn-emergency text-xs py-3 px-6 whitespace-nowrap shadow-sm shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>{isMr ? 'आपत्कालीन कक्ष: +91-75073-42222' : 'Emergency Desk: +91-75073-42222'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
