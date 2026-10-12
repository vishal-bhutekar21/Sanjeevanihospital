export interface DoctorItem {
  id: string;
  name: string;
  nameMr: string;
  role: string;
  roleMr: string;
  degree: string;
  dept: string;
  deptMr: string;
  specialty: string;
  specialtyMr: string;
  category: 'DIRECTOR' | 'INHOUSE' | 'VISITING';
  fee: number;
  image: string;
  timings: string;
  timingsMr: string;
  experienceYears?: number;
  about?: string;
  aboutMr?: string;
  procedures?: string[];
}

export const DOCTORS_DATA: DoctorItem[] = [
  // ─── 1. DIRECTORS & FOUNDING FACULTY ───────────────────────────────────────
  {
    id: 'doc-bagal',
    name: 'Dr. Baliram Bagal',
    nameMr: 'डॉ. बळीराम बागल',
    role: 'Director & Chief Intensivist / Anesthesiologist',
    roleMr: 'संचालक व मुख्य अतिदक्षतातज्ज्ञ / भूलतज्ज्ञ',
    degree: 'MBBS, DA, FICM, CCCS',
    dept: '21-Bed ICU & Critical Care',
    deptMr: '२१ खाटांचा अतिदक्षता विभाग (ICU)',
    specialty: 'Critical Care Resuscitation, Mechanical Ventilation & Emergency Triage',
    specialtyMr: 'अतिदक्षता जीवनरक्षक उपचार, मेकॅनिकल व्हेंटिलेटर व तातडीचे उपचार',
    category: 'DIRECTOR',
    fee: 400,
    image: '/images/doctors/doc-bagal.webp',
    timings: '24x7 On-Call & Emergency ICU Coverage',
    timingsMr: '२४ तास आपत्कालीन अतिदक्षता सेवा',
    experienceYears: 18,
    about:
      'Dr. Baliram Bagal is a founding Director at Sanjeevani Multispeciality Hospital with over 18 years of clinical expertise in emergency airway management, ICU hemodynamic stabilization, and family healthcare.',
    aboutMr:
      'डॉ. बळीराम बागल हे संजीवनी मल्टिस्पेशालिटी हॉस्पिटलचे संचालक असून त्यांना १८ वर्षांचा अतिदक्षता विभाग, भूलशास्त्र आणि आपत्कालीन जीवनरक्षक उपचारांचा प्रदीर्घ अनुभव आहे.',
    procedures: [
      'Advanced Mechanical Ventilation',
      'Invasive Central Line & Arterial Line Insertion',
      'Critical Sepsis & Multi-Organ Failure Management',
      'Surgical Anesthesia & Post-Operative Pain Relief',
    ],
  },
  {
    id: 'doc-mirkad',
    name: 'Dr. Shivdas Mirkad',
    nameMr: 'डॉ. शिवदास मिरकड',
    role: 'Director & Consultant Pediatrician',
    roleMr: 'संचालक व बालरोगतज्ज्ञ',
    degree: 'MBBS, MD, DCH',
    dept: 'Pediatrics & Neonatology (NICU)',
    deptMr: 'बालरोग व नवजात शिशु अतिदक्षता',
    specialty: 'Neonatal Critical Care (NICU), Pediatric Asthma & Immunization',
    specialtyMr: 'नवजात शिशु अतिदक्षता (NICU), बाल दमा, पोषण व संपूर्ण लसीकरण',
    category: 'DIRECTOR',
    fee: 500,
    image: '/images/doctors/doc-mirkad.webp',
    timings: 'Mon – Sat: 10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी १० ते दुपारी २ | संध्याकाळी ५ ते रात्री ८',
    experienceYears: 16,
    about:
      'Dr. Shivdas Mirkad leads the Neonatal and Pediatric Department at Sanjeevani Hospital, specializing in low-birth-weight neonatal care, pediatric asthma, developmental screening, and childhood immunization.',
    aboutMr:
      'डॉ. शिवदास मिरकड हे नवजात शिशु व बालरोग विभागाचे प्रमुख असून कमी वजनाच्या बाळांची विशेष काळजी, बालदमा, कुपोषण निवारण आणि लसीकरणात त्यांचा हातखंडा आहे.',
    procedures: [
      'Neonatal Resuscitation & NICU Care',
      'Childhood Asthma & Respiratory Allergy Clinics',
      'Pediatric Infectious Disease Management',
      'Pediatric Growth Monitoring',
    ],
  },
  {
    id: 'doc-rajguru',
    name: 'Dr. Kailash Rajguru',
    nameMr: 'डॉ. कैलाश राजगुरु',
    role: 'Director & Consultant Pediatrician / Intensivist',
    roleMr: 'संचालक व वरिष्ठ बालरोगतज्ज्ञ / फिजिशियन',
    degree: 'MBBS, DCH',
    dept: 'Pediatrics & Internal Medicine',
    deptMr: 'बालरोग व सामान्य औषधोपचार',
    specialty: 'Pediatric Care, Fever Management & Critical Triage',
    specialtyMr: 'बालरोग उपचार, तीव्र ताप व बालकांमधील संसर्गजन्य आजार',
    category: 'DIRECTOR',
    fee: 400,
    image: '/images/doctors/doc-rajguru.webp',
    timings: 'Mon – Sat: 09:00 AM – 01:00 PM | 05:00 PM – 08:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी ९ ते दुपारी १ | संध्याकाळी ५ ते रात्री ८',
    experienceYears: 15,
    about:
      'Dr. Kailash Rajguru is a Director with specialized focus on child wellness, acute infections, pediatric emergency stabilization, and adolescent health.',
    aboutMr:
      'डॉ. कैलाश राजगुरु हे बालरोगतज्ज्ञ असून लहान मुलांमधील संसर्ग, तीव्र ताप आणि बालकांमधील आणीबाणीच्या परिस्थितीतील उपचारात तज्ज्ञ आहेत.',
    procedures: [
      'Pediatric Emergency Triage',
      'Childhood Infectious Disease Care',
      'Neonatal Phototherapy & Jaundice Management',
      'Adolescent Health Counseling',
    ],
  },
  {
    id: 'doc-goyal',
    name: 'Dr. Nishant Goyal',
    nameMr: 'डॉ. निशांत गोयल',
    role: 'Director & Senior Orthopedic Surgeon',
    roleMr: 'संचालक व वरिष्ठ अस्थिरोग तज्ज्ञ',
    degree: 'MBBS, DNB, D. Ortho',
    dept: 'Orthopedics & Joint Replacement',
    deptMr: 'अस्थिरोग व सांधे प्रत्यारोपण',
    specialty: 'Total Knee & Hip Replacement, Trauma Fractures, Arthroscopy',
    specialtyMr: 'गुडघे व सांधे प्रत्यारोपण, फ्रॅक्चर शस्त्रक्रिया, मणक्याचे उपचार',
    category: 'DIRECTOR',
    fee: 500,
    image: '/images/doctors/doc-goyal.webp',
    timings: 'Mon – Sat: 11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी ११ ते दुपारी ३ | संध्याकाळी ६ ते रात्री ८',
    experienceYears: 15,
    about:
      'Dr. Nishant Goyal is a orthopaedic and joint replacement surgeon in Jalna, known for complex fracture trauma fixation, minimally invasive arthroscopic knee ligament repairs, and advanced total joint arthroplasty.',
    aboutMr:
      'डॉ. निशांत गोयल हे जालना जिल्ह्यातील ख्यातनाम अस्थिरोग सर्जन असून गुडघे व नितंब प्रत्यारोपण, गुंतागुंतीच्या फ्रॅक्चर शस्त्रक्रिया आणि मणक्याच्या उपचारात निष्णात आहेत.',
    procedures: [
      'Total Knee Replacement (TKR)',
      'Total Hip Replacement (THR)',
      'Complex Polytrauma & Fracture Plating',
      'Arthroscopic ACL Reconstruction & Meniscal Repair',
    ],
  },

  // ─── 2. IN-HOUSE CONSULTANTS ───────────────────────────────────────────────
  {
    id: 'doc-katole',
    name: 'Dr. Millind Katole',
    nameMr: 'डॉ. मिलींद काटोले',
    role: 'Consultant Pathologist & Laboratory Director',
    roleMr: 'वरिष्ठ पॅथॉलॉजिस्ट व लॅबोरेटरी संचालक',
    degree: 'MBBS, D.C.P',
    dept: 'Pathology & Diagnostic Laboratory',
    deptMr: 'पॅथॉलॉजी व अचूक निदान प्रयोगशाळा',
    specialty: 'Clinical Hematology, Biochemistry & Cytopathology',
    specialtyMr: 'रक्त, लघवी, बायोकेमिस्ट्री व सायटोपॅथॉलॉजी अचूक निदान',
    category: 'INHOUSE',
    fee: 300,
    image: '/images/doctors/doc-katole.webp',
    timings: 'Mon – Sat: 09:00 AM – 05:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी ९ ते संध्याकाळी ५',
    experienceYears: 14,
    about:
      'Dr. Millind Katole supervises the 24x7 automated laboratory services ensuring accurate STAT reporting for critical ICU cases and clinical diagnostics.',
    aboutMr:
      'डॉ. मिलींद काटोले यांच्या मार्गदर्शनाखाली हॉस्पिटलची आधुनिक स्वयंचलित लॅब २४ तास अचूक आणि जलद तपासणी अहवाल प्रदान करते.',
    procedures: [
      'Automated Hematology & Coagulation Studies',
      'Biochemistry & Cardiac Biomarkers (Trop-I)',
      'Cytology & Fine Needle Aspiration (FNAC)',
      'Arterial Blood Gas (ABG) & Electrolytes',
    ],
  },
  {
    id: 'doc-anshul',
    name: 'Dr. Anshul Pahawa Goyal',
    nameMr: 'डॉ. अंशुल पहवा गोयल',
    role: 'Consultant Obstetrician & Gynecologist',
    roleMr: 'वरिष्ठ प्रसूती व स्त्रीरोगतज्ज्ञ',
    degree: 'MBBS, DNB, D.G.O',
    dept: 'Obstetrics & Gynecology (Maternity)',
    deptMr: 'प्रसूती व स्त्रीरोग विभाग',
    specialty: 'High-Risk Pregnancy, Normal Delivery, C-Section & Laparoscopic Gyn Surgery',
    specialtyMr: 'सुरक्षित बाळंतपण, सिझेरियन, वंध्यत्व निवारण व दुर्बिणीद्वारे स्त्रीरोग शस्त्रक्रिया',
    category: 'INHOUSE',
    fee: 500,
    image: '/images/doctors/doc-anshul.webp',
    timings: 'Mon – Sat: 10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी १०:३० ते दुपारी २:३० | संध्याकाळी ५:३० ते ७:३०',
    experienceYears: 13,
    about:
      'Dr. Anshul Pahawa Goyal provides gentle and empathetic maternity care, specializing in painless normal deliveries, complex high-risk pregnancies, and minimally invasive gynecological surgeries.',
    aboutMr:
      'डॉ. अंशुल पहवा गोयल या अनुभवी स्त्रीरोगतज्ज्ञ असून नैसर्गिक प्रसूती, गुंतागुंतीची गर्भधारणा आणि दुर्बिणीद्वारे गर्भाशयाच्या शस्त्रक्रियांमध्ये तज्ज्ञ आहेत.',
    procedures: [
      'Safe Normal & Painless Delivery',
      'Laparoscopic Hysterectomy & Ovarian Cystectomy',
      'Infertility Evaluation & Follicular Monitoring',
      'High-Risk Pregnancy & Pre-eclampsia Care',
    ],
  },
  {
    id: 'doc-tushar',
    name: 'Dr. Tushar Agrawal',
    nameMr: 'डॉ. तुषार अग्रवाल',
    role: 'Consultant Urologist & Andrologist',
    roleMr: 'वरिष्ठ मूत्रविकार व किडनी खडे तज्ज्ञ (युरोलॉजिस्ट)',
    degree: 'MBBS, M.S, MCh (Urology)',
    dept: 'Urology & Kidney Stone Care',
    deptMr: 'मूत्ररोग व मुतखडा उपचार विभाग',
    specialty: 'Laser Kidney Stone Surgery (RIRS/PCNL), Prostate (TURP) & Uro-Oncology',
    specialtyMr: 'लेझर मुतखडा शस्त्रक्रिया (RIRS/PCNL), प्रोस्टेट व मूत्रमार्गाचे विकार',
    category: 'INHOUSE',
    fee: 600,
    image: '/images/doctors/doc-tushar.webp',
    timings: 'Mon – Sat: 11:00 AM – 03:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी ११ ते दुपारी ३',
    experienceYears: 12,
    about:
      'Dr. Tushar Agrawal is an MCh Urologist specializing in advanced laser procedures for kidney stones, enlarged prostate treatments, and reconstructive urology.',
    aboutMr:
      'डॉ. तुषार अग्रवाल हे किडनीचे खडे लेझरद्वारे काढणे (RIRS), दुर्बिणीद्वारे प्रोस्टेट शस्त्रक्रिया आणि मूत्रमार्गाच्या सर्व विकारांवर उपचार करणारे तज्ज्ञ आहेत.',
    procedures: [
      'Retrograde Intrarenal Surgery (RIRS)',
      'Mini PCNL for Large Kidney Stones',
      'Transurethral Resection of Prostate (TURP)',
      'Laser Ureteroscopy (URSL)',
    ],
  },
  {
    id: 'doc-avinash',
    name: 'Dr. Avinash Paul',
    nameMr: 'डॉ. अविनाश पॉल',
    role: 'Consultant Anesthesiologist & Critical Care',
    roleMr: 'कन्सल्टंट भूलतज्ज्ञ व अतिदक्षता विभाग',
    degree: 'MBBS, MD (Anesthesia)',
    dept: 'Anesthesiology & OT Complex',
    deptMr: 'भूलशास्त्र व शस्त्रक्रिया विभाग',
    specialty: 'Regional Nerve Blocks, Difficult Airway & Surgical Sedation',
    specialtyMr: 'शस्त्रक्रियेदरम्यान सुरक्षित भूल, पेन मॅनेजमेंट व अतिदक्षता',
    category: 'INHOUSE',
    fee: 400,
    image: '/images/doctors/doc-avinash.webp',
    timings: 'Daily OT & 24x7 Emergency Call',
    timingsMr: 'दररोज शस्त्रक्रिया गृह व २४ तास ऑन-कॉल',
    experienceYears: 11,
    about:
      'Dr. Avinash Paul ensures maximum surgical safety with modern anaesthesia and ultrasound-guided regional nerve blocks for rapid pain-free post-op recovery.',
    aboutMr:
      'डॉ. अविनाश पॉल हे मॉड्युलर शस्त्रक्रिया गृहात रुग्णांच्या सुरक्षित भुलेची आणि वेदनाशामक उपचारांची जबाबदारी सांभाळतात.',
    procedures: [
      'General & Spinal Anesthesia',
      'Ultrasound Guided Nerve Blocks',
      'Acute Trauma Sedation',
      'Post-Operative Analgesia',
    ],
  },
  {
    id: 'doc-shashikala',
    name: 'Dr. Shashikala Kale',
    nameMr: 'डॉ. शशिकला काळे',
    role: 'Consultant General & Laparoscopic Surgeon',
    roleMr: 'वरिष्ठ जनरल व दुर्बिणीद्वारे शस्त्रक्रिया तज्ज्ञ',
    degree: 'MBBS, M.S, DNB',
    dept: 'General & Minimally Invasive Surgery',
    deptMr: 'जनरल व दुर्बिणीद्वारे शस्त्रक्रिया',
    specialty: 'Laparoscopic Appendectomy, Hernia Repair, Gallbladder Stones & Breast Surgery',
    specialtyMr: 'दुर्बिणीद्वारे अपेंडिक्स, हर्निया, पित्ताशयाचे खडे व गाठींच्या शस्त्रक्रिया',
    category: 'INHOUSE',
    fee: 500,
    image: '/images/doctors/doc-shashikala.webp',
    timings: 'Mon – Sat: 11:00 AM – 03:00 PM',
    timingsMr: 'सोमवार ते शनिवार: सकाळी ११ ते दुपारी ३',
    experienceYears: 12,
    about:
      'Dr. Shashikala Kale is an accomplished general surgeon skilled in advanced laparoscopy, minimally invasive hernia repairs, and emergency abdominal surgeries.',
    aboutMr:
      'डॉ. शशिकला काळे या दुर्बिणीद्वारे पित्ताशय, हर्निया, अपेंडिक्स आणि इतर सर्व प्रकारच्या शस्त्रक्रिया करण्यात निष्णात आहेत.',
    procedures: [
      'Laparoscopic Cholecystectomy (Gallstones)',
      'Laparoscopic Inguinal & Ventral Hernia Fixation',
      'Emergency Abdominal Exploratory Surgery',
      'Thyroid & Benign Lump Surgeries',
    ],
  },
  {
    id: 'doc-atul',
    name: 'Dr. Atul Kale',
    nameMr: 'डॉ. अतुल काळे',
    role: 'Consultant Neurosurgeon & Spine Specialist (Gold Medalist)',
    roleMr: 'वरिष्ठ मेंदू व मणके शस्त्रक्रिया तज्ज्ञ (सुवर्णपदक विजेते)',
    degree: 'MBBS, MS (General Surgery), MCH Neurosurgery (Gold Medalist)',
    dept: 'Neurosurgery & Spine Surgery',
    deptMr: 'मेंदू व मणके विकार विभाग',
    specialty: 'Brain Tumor, Head Trauma, Microscopic Spine Surgery & Sciatica Relief',
    specialtyMr: 'मेंदूच्या गाठी, डोक्याला झालेली दुखापत (हेड इन्जुरी) व मणक्याचे मायक्रोस्कोपिक ऑपरेशन',
    category: 'INHOUSE',
    fee: 700,
    image: '/images/doctors/doc-atul.webp',
    timings: 'Mon – Sat: 12:00 PM – 04:00 PM (Prior Appointment)',
    timingsMr: 'सोमवार ते शनिवार: दुपारी १२ ते दुपारी ४ (पूर्वनोंदणी आवश्यक)',
    experienceYears: 13,
    about:
      'Dr. Atul Kale is a Gold Medalist MCH Neurosurgeon specializing in microscopic brain surgery, acute road accident head injury management, and endoscopic spine surgeries.',
    aboutMr:
      'डॉ. अतुल काळे हे मेंदू व मणक्याच्या अत्यंत गुंतागुंतीच्या शस्त्रक्रियांसाठी सुवर्णपदक विजेते न्यूरोसर्जन असून हेड इन्जुरी आणि स्लिप डिस्क उपचारात अग्रगण्य आहेत.',
    procedures: [
      'Craniotomy for Brain Trauma & Hematoma',
      'Microscopic Spine Decompression & Discectomy',
      'Endoscopic Pituitary & Brain Tumor Resection',
      'Spinal Fusion & Pedicle Screw Fixation',
    ],
  },

  // ─── 3. VISITING CONSULTANTS & SUPER-SPECIALISTS ───────────────────────────
  {
    id: 'doc-kalyansing',
    name: 'Dr. Kalyansing Gothwal Rajput',
    nameMr: 'डॉ. कल्याणसिंग गोठवाल राजपूत',
    role: 'Visiting Consultant Surgical Oncologist (Cancer Surgeon)',
    roleMr: 'व्हिजिटिंग वरिष्ठ कॅन्सर शस्त्रक्रिया तज्ज्ञ',
    degree: 'MBBS, MS, DrNB (Surgical Oncology)',
    dept: 'Surgical Oncology & Cancer Care',
    deptMr: 'कॅन्सर शस्त्रक्रिया विभाग',
    specialty: 'Head & Neck Oncology, Breast Cancer Surgery, Gastrointestinal & Thoracic Tumors',
    specialtyMr: 'तोंड, घसा, स्तन व पोटाच्या कॅन्सरवरील प्रगत शस्त्रक्रिया',
    category: 'VISITING',
    fee: 700,
    image: '/images/doctors/doc-kalyansing.webp',
    timings: 'Visiting: Alternate Thursdays & On-Call',
    timingsMr: 'दर पंधरवड्याला गुरुवार व ऑन-कॉल सल्ला',
    experienceYears: 14,
    about:
      'Dr. Kalyansing Gothwal Rajput is a dedicated Surgical Oncologist offering surgical treatment for oral, gastrointestinal, breast, and gynecological malignancies.',
    aboutMr:
      'डॉ. कल्याणसिंग गोठवाल राजपूत हे कर्करोगावरील अत्याधुनिक शस्त्रक्रियांसाठी प्रसिद्ध असून कॅन्सरच्या गाठी सुरक्षितपणे काढण्यात तज्ज्ञ आहेत.',
    procedures: [
      'Oncological Resection with Free Flap Reconstruction',
      'Modified Radical Mastectomy & Breast Conserving Surgery',
      'Gastrointestinal Tumor Resection',
      'Preventive Cancer Screening & Biopsy',
    ],
  },
  {
    id: 'doc-pole',
    name: 'Dr. Shivaji Pole',
    nameMr: 'डॉ. शिवाजी पोळे',
    role: 'Visiting Consultant Interventional Radiologist',
    roleMr: 'व्हिजिटिंग इंटरव्हेन्शनल रेडिओलॉजिस्ट',
    degree: 'MBBS, MD (Interventional Radiology)',
    dept: 'Interventional Radiology & Vascular Care',
    deptMr: 'रक्तवाहिन्या व सूक्ष्म कॅथेटर उपचार',
    specialty: 'Angiography, Embolization, Varicose Veins Laser & Image-Guided Interventions',
    specialtyMr: 'एंजियोग्राफी, व्हेरिरोज व्हेन्स लेझर उपचार व सूक्ष्म कॅथेटर तंत्रज्ञान',
    category: 'VISITING',
    fee: 600,
    image: '/images/doctors/doc-pole.webp',
    timings: 'Visiting: Scheduled Days & Interventional Procedures',
    timingsMr: 'नियोजित दिवशी व प्रक्रिया वेळी',
    experienceYears: 12,
    about:
      'Dr. Shivaji Pole performs pinhole vascular and non-vascular image-guided procedures under fluoroscopy and ultrasound guidance.',
    aboutMr:
      'डॉ. शिवाजी पोळे हे रक्तवाहिन्यांचे आजार आणि व्हेरिरोज व्हेन्सवर विना-शस्त्रक्रिया सूक्ष्म लेझर तंत्रज्ञानाने उपचार करतात.',
    procedures: [
      'Endovenous Laser Ablation for Varicose Veins',
      'Transarterial Embolization for Bleeding',
      'Image-Guided Drainage & Core Biopsies',
      'Vascular Access Line Placement',
    ],
  },
  {
    id: 'doc-annachhatre',
    name: 'Dr. Suhrad Annachhatre',
    nameMr: 'डॉ. सुहृद अण्णाछत्रे',
    role: 'Visiting Consultant Cardiothoracic & Vascular Surgeon (CVTS)',
    roleMr: 'व्हिजिटिंग हृदय व रक्तवाहिन्या शस्त्रक्रिया तज्ज्ञ (CVTS)',
    degree: 'MBBS, DNB, Fellowship Pediatric CVTS, Adult & Pediatric CVTS',
    dept: 'Cardiothoracic & Vascular Surgery (CVTS)',
    deptMr: 'हृदय व रक्तवाहिन्या शस्त्रक्रिया विभाग',
    specialty: 'Adult Bypass (CABG), Valve Replacement, Pediatric Congenital Heart Defect Surgery',
    specialtyMr: 'बायपास शस्त्रक्रिया (CABG), व्हॉल्व्ह बदलणे व बालकांमधील जन्मतः हृदयविकार शस्त्रक्रिया',
    category: 'VISITING',
    fee: 800,
    image: '/images/doctors/doc-annachhatre.webp',
    timings: 'Visiting: Scheduled Cardiac OPD & Planned Surgery',
    timingsMr: 'नियोजित कार्डियाक ओपीडी व शस्त्रक्रिया',
    experienceYears: 15,
    about:
      'Dr. Suhrad Annachhatre is a adult and paediatric cardiac surgeon with extensive fellowship training in congenital heart disease repairs and beating-heart coronary bypass surgeries.',
    aboutMr:
      'डॉ. सुहृद अण्णाछत्रे हे लहान मुलांच्या हृदयातील छिद्र आणि प्रौढांमधील बायपास शस्त्रक्रियांमध्ये आंतरराष्ट्रीय पातळीवर प्रशिक्षित हृदय शल्यचिकित्सक आहेत.',
    procedures: [
      'Coronary Artery Bypass Grafting (CABG)',
      'Aortic & Mitral Valve Replacement / Repair',
      'Pediatric ASD / VSD Congenital Heart Defect Closure',
      'Peripheral Vascular Bypass & Thrombectomy',
    ],
  },
  {
    id: 'doc-vanjari',
    name: 'Dr. Pranav Vanjari',
    nameMr: 'डॉ. प्रणव वंजारी',
    role: 'Visiting Consultant Neuro & Vascular Interventional Radiologist',
    roleMr: 'व्हिजिटिंग न्यूरो व व्हॅस्क्युलर इंटरव्हेन्शनल रेडिओलॉजिस्ट',
    degree: 'MBBS, MD, Neuro & Vascular Interventional Radiology',
    dept: 'Neurovascular Interventional Radiology',
    deptMr: 'मेंदू व रक्तवाहिन्या सूक्ष्म निदान विभाग',
    specialty: 'Brain Aneurysm Coiling, Acute Stroke Thrombectomy, Carotid Stenting & AVMs',
    specialtyMr: 'ब्रेन अन्यूरिज्म कॉइलिंग, पक्षाघात (स्ट्रोक) तातडीचे उपचार व स्टेंटिंग',
    category: 'VISITING',
    fee: 700,
    image: '/images/doctors/doc-vanjari.webp',
    timings: 'Visiting: Emergency Stroke & Scheduled Neurovascular Cases',
    timingsMr: 'तातडीचे पक्षाघात (स्ट्रोक) व पूर्वनोंदणीनुसार',
    experienceYears: 11,
    about:
      'Dr. Pranav Vanjari specializes in mechanical thrombectomy for acute ischemic stroke and endovascular coiling for cerebral aneurysms.',
    aboutMr:
      'डॉ. प्रणव वंजारी हे मेंदूतील रक्तस्त्राव आणि पक्षाघाताच्या झटक्यात तातडीने रक्तवाहिनी मोकळी करण्याच्या आधुनिक उपचारांचे तज्ज्ञ आहेत.',
    procedures: [
      'Mechanical Thrombectomy for Acute Stroke',
      'Endovascular Aneurysm Coiling',
      'Carotid Artery Angioplasty & Stenting',
      'AVM & AV Fistula Embolization',
    ],
  },
];
