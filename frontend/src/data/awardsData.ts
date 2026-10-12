export interface AwardItem {
  id: string;
  title: string;
  titleMr: string;
  subtitle: string;
  subtitleMr: string;
  image: string;
  year?: string;
  category: 'AWARD' | 'ACHIEVEMENT';
  description: string;
  descriptionMr: string;
}

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'award-1',
    title: 'Excellence in Multispeciality Healthcare & Critical Care',
    titleMr: 'उत्कृष्ट मल्टिस्पेशालिटी व अतिदक्षता रुग्णसेवा पुरस्कार',
    subtitle: 'Healthcare Excellence Recognition',
    subtitleMr: 'आरोग्य क्षेत्रातील विशेष सन्मान',
    image: '',
    year: '2023',
    category: 'AWARD',
    description:
      'Honored for outstanding patient outcomes in critical care, 24x7 trauma stabilization, and modern surgical facilities in Jalna district.',
    descriptionMr:
      'जालना जिल्ह्यातील २४ तास आपत्कालीन सेवा, २१ खाटांचा अद्ययावत ICU आणि अचूक उपचारांसाठी गौरव.',
  },
  {
    id: 'award-2',
    title: 'Pioneering Medical Leadership in Marathwada',
    titleMr: 'मराठवाड्यातील अग्रणी वैद्यकीय नेतृत्व सन्मान',
    subtitle: 'Distinguished Service Award',
    subtitleMr: 'वैद्यकीय क्षेत्रातील अग्रगण्य योगदान',
    image: '',
    year: '2023',
    category: 'AWARD',
    description:
      'Presented to the founding directors of Sanjeevani Hospital for high ethical standards and healthcare affordability.',
    descriptionMr:
      'संजीवनी हॉस्पिटलच्या संचालक मंडळाला उच्च नैतिक मूल्ये आणि दर्जेदार रुग्णसेवेसाठी प्रदान करण्यात आलेला पुरस्कार.',
  },
  {
    id: 'award-3',
    title: 'State Level Healthcare Felicitation',
    titleMr: 'राज्यस्तरीय आरोग्य गौरव पुरस्कार',
    subtitle: 'Excellence in Emergency Care',
    subtitleMr: 'आपत्कालीन सेवेतील विशेष कामगिरी',
    image: '',
    year: '2022',
    category: 'AWARD',
    description:
      'Recognized for exceptional community outreach, free health camps, and lifesaving ICU interventions.',
    descriptionMr:
      'ग्रामीण भागातील मोफत आरोग्य शिबिरे आणि अखंड आपत्कालीन सेवेसाठी राज्यस्तरीय सन्मान.',
  },
  {
    id: 'award-4',
    title: 'MJPJAY Cashless Scheme Implementation Honor',
    titleMr: 'महात्मा फुले जन आरोग्य योजना उत्कृष्ट अंमलबजावणी सन्मान',
    subtitle: 'Government Scheme Recognition',
    subtitleMr: 'शासकीय योजना प्रभावी अंमलबजावणी',
    image: '',
    year: '2022',
    category: 'AWARD',
    description:
      'Awarded for successfully conducting thousands of cashless surgeries for underprivileged families under MJPJAY.',
    descriptionMr:
      'हजारो गरजू रुग्णांना महात्मा फुले जन आरोग्य योजनेअंतर्गत मोफत शस्त्रक्रिया यशस्वीरीत्या उपलब्ध केल्याबद्दल सन्मान.',
  },
  {
    id: 'award-5',
    title: 'Best Critical Care Unit & ICU Setup Award',
    titleMr: 'सर्वोत्कृष्ट अतिदक्षता विभाग (ICU) पुरस्कार',
    subtitle: 'Hospital Infrastructure Benchmark',
    subtitleMr: 'वैद्यकीय पायाभूत सुविधा गौरव',
    image: '',
    year: '2022',
    category: 'AWARD',
    description:
      'Acknowledged for high clinical standards in mechanical ventilation, bedside hemodialysis, and zero surgical infection rate.',
    descriptionMr:
      'आधुनिक व्हेंटिलेटर्स, डायलिसिस सपोर्ट आणि निर्जंतुक अतिदक्षता विभागाच्या उच्च मानकांसाठी गौरव.',
  },
  {
    id: 'award-6',
    title: 'COVID-19 Frontline Warrior & Resuscitation Tribute',
    titleMr: 'कोरोना योद्धा व अविरत रुग्णसेवा विशेष सन्मान',
    subtitle: 'Pandemic Response Citation',
    subtitleMr: 'साथरोग काळात अखंड जीवनरक्षक कार्य',
    image: '',
    year: '2021',
    category: 'ACHIEVEMENT',
    description:
      'Honored by district administration for relentless frontline clinical duty and saving critical pneumonia cases during the pandemic.',
    descriptionMr:
      'साथरोगाच्या काळात अहोरात्र सेवा देऊन शेकडो गंभीर रुग्णांचे प्राण वाचवल्याबद्दल जिल्हा प्रशासनाकडून सन्मान.',
  },
  {
    id: 'award-7',
    title: 'Rotary & Lions Club Humanitarian Medical Trophy',
    titleMr: 'रोटरी व लायन्स क्लब मानवतावादी आरोग्य पुरस्कार',
    subtitle: 'Community Health Champion',
    subtitleMr: 'समाजहितासाठी आरोग्य सेवा सन्मान',
    image: '',
    year: '2021',
    category: 'AWARD',
    description:
      'Presented by civic bodies for organizing over 50+ free diagnostic camps and pediatric malnutrition drives.',
    descriptionMr:
      '५० हून अधिक मोफत आरोग्य शिबिरे व बाल पोषण मोहिमा राबवल्याबद्दल सामाजिक संस्थांकडून गौरव.',
  },
  {
    id: 'award-8',
    title: 'Excellence in Joint Replacement & Orthopedics',
    titleMr: 'अस्थिरोग व सांधे प्रत्यारोपण विशेष कामगिरी पुरस्कार',
    subtitle: 'Surgical Precision Award',
    subtitleMr: 'अचूक शस्त्रक्रिया तंत्रज्ञान सन्मान',
    image: '',
    year: '2020',
    category: 'ACHIEVEMENT',
    description:
      'Celebrating over 2,500+ successful total knee and total hip arthroplasty surgeries with rapid mobility recovery.',
    descriptionMr:
      '२,५०० हून अधिक यशस्वी गुडघे व नितंब प्रत्यारोपण शस्त्रक्रिया पूर्ण केल्याबद्दल विशेष सन्मान.',
  },
  {
    id: 'award-9',
    title: 'Maternal & Neonatal Child Safety Citation',
    titleMr: 'माता व नवजात बालक सुरक्षितता गौरव',
    subtitle: 'Pediatric Care Benchmark',
    subtitleMr: 'बालरोग व शिशु आरोग्य विशेष सन्मान',
    image: '',
    year: '2020',
    category: 'AWARD',
    description:
      'Recognized for exceptional neonatal survival rates and high-risk pregnancy management in Jalna.',
    descriptionMr:
      'अति-कमी वजनाच्या नवजात बालकांना सुरक्षित जीवन देणाऱ्या NICU सेवेसाठी विशेष गौरव.',
  },
  {
    id: 'award-10',
    title: 'District Healthcare Leadership Trophy',
    titleMr: 'जिल्हास्तरीय वैद्यकीय नेतृत्व करंडक',
    subtitle: 'Institutional Leadership',
    subtitleMr: 'संस्थात्मक उत्कृष्टता सन्मान',
    image: '',
    year: '2019',
    category: 'AWARD',
    description:
      'Awarded for establishing an integrated 24x7 trauma care ecosystem with advanced ambulance dispatch.',
    descriptionMr:
      'अद्ययावत अ‍ॅम्ब्युलन्स व २४ तास ट्रॉमा केअर नेटवर्क उभारल्याबद्दल जिल्हा स्तरावर सन्मान.',
  },
  {
    id: 'award-11',
    title: 'National Medical Conference Felicitations',
    titleMr: 'राष्ट्रीय वैद्यकीय परिषद सन्मानचिन्ह',
    subtitle: 'Clinical Paper & Case Presentation',
    subtitleMr: 'वैद्यकीय शोधनिबंध व सादरीकरण',
    image: '',
    year: '2019',
    category: 'ACHIEVEMENT',
    description:
      'Presented at state and national medical congresses for cutting-edge surgical cases and clinical case studies.',
    descriptionMr:
      'गुंतागुंतीच्या शस्त्रक्रियांच्या यशस्वी सादरीकरणासाठी राष्ट्रीय परिषदांमध्ये गौरव.',
  },
  {
    id: 'award-12',
    title: 'IMA Jalna Clinical Dedication Award',
    titleMr: 'आयएमए (IMA) जालना वैद्यकीय निष्ठा पुरस्कार',
    subtitle: 'Professional Excellence',
    subtitleMr: 'व्यावसायिक वैद्यकीय गौरव',
    image: '',
    year: '2018',
    category: 'AWARD',
    description:
      'Indian Medical Association recognition for unwavering commitment to evidence-based healthcare practices.',
    descriptionMr:
      'इंडियन मेडिकल असोसिएशनतर्फे अचूक आणि विश्वासार्ह रुग्णसेवेसाठी सन्मान.',
  },
  {
    id: 'award-14',
    title: 'Quality Healthcare & Hygiene Star Trophy',
    titleMr: 'दर्जेदार आरोग्यसेवा व स्वच्छता सन्मान',
    subtitle: 'Hospital Infection Control Protocol',
    subtitleMr: 'हॉस्पिटल स्वच्छता व संसर्ग नियंत्रण',
    image: '',
    year: '2018',
    category: 'ACHIEVEMENT',
    description:
      'Certified for stringent modular operation theatre sterilization, biomedical waste handling, and patient safety.',
    descriptionMr:
      'मॉड्युलर शस्त्रक्रिया गृहातील निर्जंतुकीकरण आणि उच्च दर्जाच्या स्वच्छतेसाठी विशेष प्रशस्तीपत्र.',
  },
  {
    id: 'award-16',
    title: 'Community Trust & Social Healthcare Award',
    titleMr: 'जनविश्वास व सामाजिक आरोग्य सन्मान',
    subtitle: 'Public Trust & Service Citation',
    subtitleMr: 'लोकविश्वास व समाजसेवा गौरव',
    image: '',
    year: '2017',
    category: 'AWARD',
    description:
      'Conferred by local civic leadership for making high-tech superspeciality treatments accessible to all strata of society.',
    descriptionMr:
      'सर्वसामान्य नागरिकांना अत्याधुनिक उपचार रास्त दरात उपलब्ध करून दिल्याबद्दल जनसन्मान.',
  },
  {
    id: 'award-17',
    title: 'Emergency Resuscitation Benchmark Trophy',
    titleMr: 'आपत्कालीन जीवनरक्षक मानके पुरस्कार',
    subtitle: 'Golden Hour Trauma Management',
    subtitleMr: 'गोल्डन अवर ट्रॉमा व्यवस्थापन',
    image: '',
    year: '2017',
    category: 'ACHIEVEMENT',
    description:
      'Recognized for saving critical polytrauma accident patients through swift "Golden Hour" medical triage.',
    descriptionMr:
      'अपघाती रुग्णांना पहिल्या सुवर्ण तासात (Golden Hour) तत्काळ उपचार देऊन वाचवल्याबद्दल गौरव.',
  },
  {
    id: 'award-18',
    title: 'Foundation Stone Milestone Honor',
    titleMr: 'संजीवनी हॉस्पिटल स्थापना गौरव सन्मान',
    subtitle: 'Serving Jalna Since 2016',
    subtitleMr: '२०१६ पासून अविरत रुग्णसेवा',
    image: '',
    year: '2016',
    category: 'AWARD',
    description:
      'Commemorating the inception of Sanjeevani Multispeciality Hospital with modern multi-disciplinary healthcare under one roof.',
    descriptionMr:
      'जालना शहरात एकाच छताखाली सर्व आधुनिक उपचार सुविधा सुरू केल्याबद्दल ऐतिहासिक गौरव.',
  },
];
