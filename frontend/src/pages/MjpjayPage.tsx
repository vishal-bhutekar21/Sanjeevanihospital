import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Phone,
  CheckCircle2,
  AlertCircle,
  HeartPulse,
  Scissors,
  Baby,
  Activity,
  Award,
  FileText,
  Clock,
  ArrowRight,
  UserCheck,
  Building2,
  CreditCard,
  Send,
  HelpCircle,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

export const MjpjayPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [info, setInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'procedures' | 'process' | 'documents' | 'register'>('procedures');
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

  useEffect(() => {
    fetch(apiUrl('/schemes/mjpjay/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch((err) => console.error('Failed to load MJPJAY info:', err));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      alert(isMr ? 'अर्ज सबमिट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' : 'Failed to submit MJPJAY claim request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive covered procedures dataset with full English and Marathi content
  const proceduresData = [
    {
      categoryEn: 'Orthopedics & Joint Replacement',
      categoryMr: 'अस्थिरोग आणि सांधे प्रत्यारोपण शस्त्रक्रिया',
      icon: Activity,
      doctor: 'Dr. Nishant Goyal (MBBS, DNB, D. Ortho)',
      coverageBadge: isMr ? '१००% मोफत पॅकेज' : '100% Cashless Package',
      procedures: [
        { en: 'Total Knee Replacement (TKR) Arthroplasty', mr: 'गुडघे प्रत्यारोपण (Total Knee Replacement)' },
        { en: 'Total Hip Replacement (THR) Arthroplasty', mr: 'खुबा प्रत्यारोपण (Total Hip Replacement)' },
        { en: 'Complex Fracture Trauma Internal Fixation (Plating & Nailing)', mr: 'गुंतागुंतीचे फ्रॅक्चर व हाडांचे ऑपरेशन' },
        { en: 'Spinal Disc Decompression & Spine Stabilization', mr: 'मणक्याचे आजार, स्लिप डिस्क व स्टेबिलायझेशन' },
        { en: 'Arthroscopic Ligament Reconstruction (ACL/PCL Repair)', mr: 'दुर्बिणीद्वारे लिगामेंट शस्त्रक्रिया (ACL/PCL)' },
        { en: 'Pediatric Bone Deformity & Fracture Realignment', mr: 'लहान मुलांच्या हाडांचे फ्रॅक्चर व विकृती निवारण' },
      ],
    },
    {
      categoryEn: 'General & Laparoscopic Surgeries',
      categoryMr: 'जनरल आणि लेप्रोस्कोपिक (दुर्बिणीच्या) शस्त्रक्रिया',
      icon: Scissors,
      doctor: 'Dr. Millind Katole (MBBS, MS)',
      coverageBadge: isMr ? '१००% मोफत पॅकेज' : '100% Cashless Package',
      procedures: [
        { en: 'Laparoscopic Cholecystectomy (Gallbladder Stones)', mr: 'दुर्बिणीद्वारे पित्ताशयातील खडे काढण्याची शस्त्रक्रिया' },
        { en: 'Laparoscopic Inguinal & Incisional Hernia Repair (Mesh Plasty)', mr: 'दुर्बिणीद्वारे हर्निया व जाळी बसविण्याची शस्त्रक्रिया' },
        { en: 'Laparoscopic Appendectomy (Acute Appendicitis)', mr: 'दुर्बिणीद्वारे अपेंडिक्स काढण्याची शस्त्रक्रिया' },
        { en: 'Advanced Laser Anorectal Surgery (Piles, Fissure, Fistula)', mr: 'लेझरद्वारे मूळव्याध, भगंदर व फिशर शस्त्रक्रिया' },
        { en: 'Emergency Abdominal Trauma & Bowel Perforation Surgery', mr: 'पोटातील गंभीर दुखापती व आपत्कालीन शस्त्रक्रिया' },
      ],
    },
    {
      categoryEn: 'Pediatrics & Neonatal Intensive Care (NICU)',
      categoryMr: 'बालरोग आणि नवजात शिशु अतिदक्षता विभाग (NICU)',
      icon: Baby,
      doctor: 'Dr. Shivdas Mirkad (MBBS, MD, DCH)',
      coverageBadge: isMr ? '२४ तास अतिदक्षता' : '24x7 Critical NICU',
      procedures: [
        { en: 'Level-II Neonatal ICU Care for Preterm & Low Birth Weight Babies', mr: 'अकाली जन्मलेली व कमी वजनाची बालके (NICU Care)' },
        { en: 'Neonatal Respiratory Distress Syndrome & Phototherapy for Jaundice', mr: 'नवजात बालकांमधील कावीळ (फोटोथेरपी) व श्वसन विकार' },
        { en: 'Severe Pediatric Pneumonia, Bronchiolitis & Asthma Management', mr: 'गंभीर न्यूमोनिया, दमा व श्वासनलिका संसर्ग' },
        { en: 'Pediatric Sepsis & Critical Infection Resuscitation', mr: 'गंभीर संसर्ग (Sepsis) व बालरोग अतिदक्षता' },
        { en: 'Congenital Deformity & Pediatric Surgical Recovery', mr: 'जन्मजात आजार व बालरोग शस्त्रक्रिया पश्चात देखभाल' },
      ],
    },
    {
      categoryEn: '21-Bed ICU & Critical Care Unit',
      categoryMr: '२१ खाटांचा अतिदक्षता विभाग (ICU) व व्हेंटिलेटर',
      icon: HeartPulse,
      doctor: 'Dr. Baliram Bagal (MBBS, DA, FICM, CCCS)',
      coverageBadge: isMr ? 'व्हेंटिलेटर व डायलिसिस' : 'Ventilator & Dialysis',
      procedures: [
        { en: 'Advanced Mechanical Ventilation & Invasive Arterial Line Care', mr: 'आधुनिक मेकॅनिकल व्हेंटिलेशन व आर्टेरियल मॉनिटरिंग' },
        { en: 'Septic Shock, Poisoning & Multi-Organ Failure Resuscitation', mr: 'सेप्टिक शॉक, विषबाधा व मल्टी-ऑर्गन फेल्युअर उपचार' },
        { en: 'Bedside Hemodialysis for Acute & Chronic Kidney Injury', mr: 'बेडसाइड डायलिसिस सपोर्ट व मूत्रपिंड निकामी रुग्ण' },
        { en: 'Severe Head Injury, Stroke & Coma Critical Triage', mr: 'डोक्याला गंभीर मार, मेंदूतील रक्तस्राव व स्ट्रोक केअर' },
      ],
    },
    {
      categoryEn: 'Obstetrics & Gynecology (Maternity)',
      categoryMr: 'प्रसूती आणि स्त्रीरोग विभाग',
      icon: Award,
      doctor: 'Dr. Anshul Goyal (MBBS, DNB, DGO)',
      coverageBadge: isMr ? 'सुरक्षित बाळंतपण' : 'Safe Delivery Care',
      procedures: [
        { en: 'High-Risk Normal Delivery & Emergency Lower Segment C-Section (LSCS)', mr: 'सुरक्षित सिझेरियन (LSCS) व गुंतागुंतीचे बाळंतपण' },
        { en: 'Ectopic Pregnancy Emergency Resection & Salpingectomy', mr: 'अस्थानिक गर्भधारणा (Ectopic Pregnancy) शस्त्रक्रिया' },
        { en: 'Laparoscopic Hysterectomy (Uterus Removal) & Myomectomy', mr: 'दुर्बिणीद्वारे गर्भाशय काढण्याची शस्त्रक्रिया (Hysterectomy)' },
        { en: 'Ovarian Cystectomy & Gynecological Emergency Bleeding Control', mr: 'अंडाशयातील गाठ (Ovarian Cyst) व रक्तस्राव नियंत्रण' },
      ],
    },
    {
      categoryEn: 'Internal Medicine & Physician Care',
      categoryMr: 'इंटरनल मेडिसिन व फिजिशियन उपचार',
      icon: ShieldCheck,
      doctor: 'Dr. Kailash Rajguru (MBBS, MD Medicine)',
      coverageBadge: isMr ? 'तज्ज्ञ वैद्यकीय निदान' : 'Specialist Medicine',
      procedures: [
        { en: 'Complicated Diabetes, Diabetic Ketoacidosis & Foot Ulcers', mr: 'मधुमेहाची गुंतागुंत, कीटोअ‍ॅसिडोसिस व डायबेटिक फूट' },
        { en: 'Hypertensive Crisis & Acute Cardiovascular Emergency Stabilization', mr: 'अति-उच्च रक्तदाब व आपत्कालीन हृदयविकार प्राथमिक उपचार' },
        { en: 'Dengue Hemorrhagic Fever, Malaria & Tropical Infectious Diseases', mr: 'डेंग्यू, मलेरिया, विषमज्वर व संसर्गजन्य ताप उपचार' },
        { en: 'Chronic Obstructive Pulmonary Disease (COPD) & Severe Asthma', mr: 'दमा, फुफ्फुसाचे आजार व श्वास लागणे' },
      ],
    },
  ];

  // Comprehensive Step-by-Step Process with Timeframes & Visual Infographic Steps
  const processSteps = [
    {
      step: '01',
      titleEn: 'Patient Walk-in & Arogya Mitra Helpdesk',
      titleMr: 'रुग्ण आगमन आणि आरोग्य मित्र कक्षात भेट',
      timeframe: '0–15 Mins',
      descEn: 'Visit the 24x7 MJPJAY Arogya Mitra Desk located at the ground floor entrance of Sanjeevani Hospital with your Ration Card and Aadhaar Card.',
      descMr: 'संजीवनी हॉस्पिटलच्या तळमजल्यावरील २४ तास सुरू असलेल्या आरोग्य मित्र कक्षाला भेट द्या आणि आपले मूळ रेशन कार्ड व आधार कार्ड सादर करा.',
      badge: isMr ? 'तत्पर नोंदणी' : 'Immediate Check-in',
    },
    {
      step: '02',
      titleEn: 'Digital Eligibility Verification & Portal Registration',
      titleMr: 'शासकीय पोर्टलवर ऑनलाइन पडताळणी',
      timeframe: '15–30 Mins',
      descEn: 'The Arogya Mitra verifies your family eligibility online on the State Health Assurance Society (SHAS) MJPJAY portal and creates an electronic registration token.',
      descMr: 'आरोग्य मित्र शासकीय MJPJAY पोर्टलवर आपल्या रेशन कार्डची पडताळणी करून तात्काळ ऑनलाइन रुग्ण नोंदणी आणि टोकन तयार करतात.',
      badge: isMr ? 'डिजिटल मंजुरी' : 'Portal Sync',
    },
    {
      step: '03',
      titleEn: 'Specialist Clinical Diagnosis & Pre-Authorization',
      titleMr: 'तज्ज्ञ डॉक्टरांकडून निदान व पूर्व-मंजुरी प्रस्ताव',
      timeframe: '1–2 Hours',
      descEn: 'Hospital specialist examines the patient, performs necessary diagnostic investigations (X-Ray, Sonography, Blood Tests), and submits pre-authorization package request.',
      descMr: 'तज्ज्ञ डॉक्टर रुग्णाची तपासणी करून आवश्यक चाचण्या (एक्स-रे, सोनोग्राफी, रक्त तपासणी) करतात आणि शासनाकडे पूर्व-मंजुरीसाठी प्रस्ताव पाठवतात.',
      badge: isMr ? 'वैद्यकीय तपासणी' : 'Doctor Evaluation',
    },
    {
      step: '04',
      titleEn: '100% Cashless Surgery, ICU & Inpatient Care',
      titleMr: '१००% मोफत शस्त्रक्रिया, ICU व औषधोपचार',
      timeframe: 'Inpatient Stay',
      descEn: 'Once approved by the government medical officer, the patient receives advanced surgery in modular OT, ICU observation, medicines, consumables, and nursing care at ₹0 cost.',
      descMr: 'शासकीय मंजुरीनंतर रुग्णावर मॉड्युलर ओटीमध्ये शस्त्रक्रिया, आयसीयू मुक्काम, सर्व प्रकारची औषधे व तपासण्या एकाही रुपयाच्या खर्चाशिवाय मोफत केल्या जातात.',
      badge: isMr ? 'शून्य खर्च' : 'Zero Out-of-Pocket',
    },
    {
      step: '05',
      titleEn: 'Discharge Summary & 10-Day Free Follow-up Medicines',
      titleMr: 'डिस्चार्ज, मोफत औषधे व १० दिवसांचे फॉलोअप',
      timeframe: 'On Discharge',
      descEn: 'At the time of discharge, the patient receives complete discharge documentation, 10 days of post-operative follow-up medicines pack, and free OPD follow-up consultation.',
      descMr: 'डिस्चार्जच्या वेळी रुग्णाला संपूर्ण डिस्चार्ज समरी, १० दिवसांचा मोफत औषध किट आणि पुढील तपासणीसाठी मार्गदर्शन मोफत दिले जाते.',
      badge: isMr ? 'फॉलोअप सहाय्य' : 'Post-Op Support',
    },
  ];

  // Comprehensive Document Checklist with Details
  const documentChecklist = [
    {
      categoryEn: 'Primary Scheme Eligibility Proof (Any One)',
      categoryMr: 'पात्रतेचा मुख्य पुरावा (कोणतेही एक)',
      items: [
        {
          nameEn: 'Yellow Ration Card (BPL - Below Poverty Line)',
          nameMr: 'पिवळे रेशन कार्ड (दारिद्र्यरेषेखालील - BPL)',
          required: true,
          tipEn: 'Must show patient name or head of family clearly with valid barcode.',
          tipMr: 'रेशन कार्डवर रुग्णाचे नाव किंवा कुटुंबप्रमुखाचे नाव स्पष्ट असणे आवश्यक.',
        },
        {
          nameEn: 'Orange Ration Card (APL - Above Poverty Line, Income < ₹1 Lakh)',
          nameMr: 'केशरी रेशन कार्ड (वार्षिक उत्पन्न मर्यादा ₹१ लाखापर्यंत)',
          required: true,
          tipEn: 'Active orange ration card issued by Maharashtra State Civil Supplies.',
          tipMr: 'महाराष्ट्र शासनाने दिलेले अधिकृत केशरी रेशन कार्ड.',
        },
        {
          nameEn: 'Antyodaya Anna Yojana (AAY) or Annapurna Ration Card',
          nameMr: 'अंत्योदय अन्न योजना (AAY) किंवा अन्नपूर्णा रेशन कार्ड',
          required: true,
          tipEn: 'Covers fully subsidized cashless medical benefits.',
          tipMr: 'शासकीय योजनेअंतर्गत १००% मोफत लाभासाठी पात्र.',
        },
      ],
    },
    {
      categoryEn: 'Patient Identity & Residence Proof (Mandatory)',
      categoryMr: 'रुग्णाची ओळख व पत्त्याचा पुरावा (अनिवार्य)',
      items: [
        {
          nameEn: 'Original Aadhaar Card of Patient & Attendant',
          nameMr: 'रुग्ण आणि नातेवाईकाचे मूळ आधार कार्ड',
          required: true,
          tipEn: 'Required for biometric/OTP authentication on SHAS portal.',
          tipMr: 'पोर्टलवर ई-केवायसी आणि बायोमेट्रिक पडताळणीसाठी आवश्यक.',
        },
        {
          nameEn: 'Secondary Photo ID (Voter ID Card / Driving License)',
          nameMr: 'मतदान ओळखपत्र किंवा ड्रायव्हिंग लायसन्स (पर्यायी)',
          required: false,
          tipEn: 'Helpful if Aadhaar address requires secondary verification.',
          tipMr: 'नाव किंवा पत्त्यात बदल असल्यास दुय्यम पुरावा म्हणून उपयुक्त.',
        },
      ],
    },
    {
      categoryEn: 'Medical & Clinical Documents',
      categoryMr: 'वैद्यकीय कागदपत्रे व तपासणी रिपोर्ट्स',
      items: [
        {
          nameEn: 'Doctor Referral Letter / Sanjeevani OPD Prescription',
          nameMr: 'संजीवनी हॉस्पिटलचे ओपीडी प्रिस्क्रिप्शन / डॉक्टरांचे निदान पत्र',
          required: true,
          tipEn: 'Issued directly by our specialist OPD doctors upon clinical evaluation.',
          tipMr: 'संजीवनी हॉस्पिटलमधील तज्ज्ञ डॉक्टरांकडून तपासणीनंतर तात्काळ दिले जाते.',
        },
        {
          nameEn: 'Diagnostic Investigation Reports (X-Ray, CT, Sonography, Blood Tests)',
          nameMr: 'मागील वैद्यकीय चाचण्यांचे रिपोर्ट्स (एक्स-रे, सोनोग्राफी, रक्त अहवाल)',
          required: false,
          tipEn: 'Carry existing diagnostic reports for expedited surgical pre-authorization.',
          tipMr: 'उपलब्ध असल्यास सोबत आणावेत, ज्यामुळे मंजुरी प्रक्रिया जलद होते.',
        },
        {
          nameEn: '2 Recent Passport Size Photographs of Patient',
          nameMr: 'रुग्णाचे २ पासपोर्ट आकाराचे फोटो',
          required: true,
          tipEn: 'Required for physical case sheet and government claim file.',
          tipMr: 'क्लेम फाइल आणि हॉस्पिटल रेकॉर्डसाठी आवश्यक.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* ─── 1. HERO BANNER (CLEAN HEALTHCARE STYLING) ───────────────────────── */}
      <div className="card-clean p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 border border-teal-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="badge-teal text-xs py-1 px-3">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>{isMr ? 'महाराष्ट्र शासन मान्यताप्राप्त महात्मा फुले जन आरोग्य योजना' : 'Govt. of Maharashtra Approved Scheme'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isMr ? 'संजीवनी हॉस्पिटल जालना अधिकृत केंद्र' : 'Empanelled Hospital Jalna'}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            {isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}<br />
            <span className="text-[#0F766E]">
              {isMr ? 'जन आरोग्य योजना (MJPJAY) कक्ष' : 'Jan Arogya Yojana (MJPJAY)'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {isMr
              ? 'महाराष्ट्रातील पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटल, जालना येथे सर्व प्रमुख शस्त्रक्रिया, अतिदक्षता विभाग (ICU) आणि तज्ज्ञ डॉक्टरांचे उपचार १००% मोफत उपलब्ध आहेत. आमचा समर्पित आरोग्य मित्र कक्ष आपणास तत्पर सहाय्य करतो.'
              : 'Sanjeevani Multispeciality Hospital, Jalna provides 100% cashless surgical care, 21-bed ICU, and specialist medical management for eligible yellow and orange ration card families under MJPJAY.'}
          </p>
        </div>

        {/* Action Helpline & Scheme Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="tel:+917507342222"
            className="btn-emergency text-xs py-2.5 px-4 shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>{isMr ? 'आरोग्य मित्र हेल्पलाईन: +91-75073-42222' : 'Arogya Mitra Helpline: +91-75073-42222'}</span>
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Award className="w-4 h-4 text-[#0F766E]" />
            <span>{isMr ? 'कौटुंबिक संरक्षण: ₹५,००,००० / वर्ष' : 'Annual Family Coverage: Up to ₹5,00,000'}</span>
          </div>
        </div>

        {/* 4 Standout Infographic Badges (Warm Yellow/Amber Styling) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-xs">
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'कॅशलेस उपचार' : 'Zero Expense'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '१००% मोफत शस्त्रक्रिया' : '100% Cashless'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'कोणतेही आगाऊ शुल्क नाही' : 'No advance deposit'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'अतिदक्षता विभाग' : 'Critical Care'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '२१ खाटांचा ICU' : '21-Bed ICU'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'व्हेंटिलेटर व डायलिसिस' : 'Ventilator & Dialysis'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'पात्रता' : 'Beneficiaries'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? 'पिवळे / केशरी कार्ड' : 'Yellow & Orange Cards'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'अन्नपूर्णा व अंत्योदय कार्ड' : 'AAY & Annapurna cards'}</p>
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 shadow-2xs">
            <p className="text-amber-800 font-bold uppercase text-[10px]">{isMr ? 'आरोग्य मित्र कक्ष' : 'Hospital Helpdesk'}</p>
            <p className="font-bold text-teal-700 text-base mt-0.5">{isMr ? '२४x७ सक्रिय' : '24x7 Active'}</p>
            <p className="text-[11px] text-amber-900/80 mt-0.5">{isMr ? 'कागदपत्र तपासणी कक्ष' : 'Fast-track approvals'}</p>
          </div>
        </div>
      </div>

      {/* ─── 2. GOVERNMENT SCHEME NOTICE (WARM AMBER STYLING) ─────────────────── */}
      <div className="card-notice-amber flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
            {isMr ? 'शासकीय योजना मार्गदर्शक नियम व माहिती' : 'Government Scheme Compliance Notice'}
          </h4>
          <p className="text-xs text-amber-900 leading-relaxed">
            {isMr
              ? 'महात्मा फुले जन आरोग्य योजनेअंतर्गत मोफत उपचारांसाठी रुग्णाचे वैध रेशन कार्ड, आधार कार्ड आणि शासकीय आरोग्य मित्र कक्षाकडून इलेक्ट्रॉनिक पूर्व-मंजुरी आवश्यक असते.'
              : 'Eligibility, coverage, and cashless treatment are subject to applicable government scheme rules and Arogya Mitra pre-authorization approval.'}
          </p>
        </div>
      </div>

      {/* ─── 3. TAB NAVIGATION (COMPACT SEGMENTED PILLS) ────────────────────── */}
      <div className="flex justify-start">
        <div className="inline-flex flex-wrap sm:flex-nowrap gap-1.5 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200/70 shadow-2xs">
          {([
            { key: 'procedures', label: isMr ? 'समाविष्ट शस्त्रक्रिया' : 'Covered Procedures', icon: Activity },
            { key: 'process', label: isMr ? 'योजना प्रक्रिया' : 'Step-by-Step Process', icon: ArrowRight },
            { key: 'documents', label: isMr ? 'आवश्यक कागदपत्रे' : 'Required Documents', icon: FileText },
            { key: 'register', label: isMr ? 'मदतीसाठी अर्ज' : 'Register / Inquire', icon: Send },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.key ? 'text-[#0F766E]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB 1: COVERED PROCEDURES (COMPREHENSIVE BILINGUAL INFOGRAPHIC) ───── */}
      {activeTab === 'procedures' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'महात्मा फुले योजनेअंतर्गत समाविष्ट प्रमुख शस्त्रक्रिया' : 'Covered Clinical Procedures & Surgeries'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'संजीवनी हॉस्पिटल, जालना येथे खालील सर्व वैद्यकीय व शस्त्रक्रिया विभाग १००% मोफत कॅशलेस पॅकेजमध्ये समाविष्ट आहेत:'
                : 'The following multispeciality surgeries and treatments are 100% cashless at Sanjeevani Hospital under MJPJAY:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proceduresData.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="card-clean p-6 flex flex-col justify-between space-y-4 hover:shadow-card-hover transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="badge-teal text-[11px] py-0.5">{cat.coverageBadge}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                      {isMr ? cat.categoryMr : cat.categoryEn}
                    </h3>
                    <p className="text-[11px] font-medium text-[#0F766E]">
                      {cat.doctor}
                    </p>

                    <ul className="space-y-2 pt-1">
                      {cat.procedures.map((proc, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{isMr ? proc.mr : proc.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isMr ? 'मोफत तपासणी व औषधे समाविष्ट' : 'Free diagnostics & meds'}
                    </span>
                    <a
                      href="tel:+917507342222"
                      className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
                    >
                      <span>{isMr ? 'माहिती विचारा' : 'Inquire'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scheme Inpatient Package Note */}
          <div className="card-clean p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold font-heading">
                {isMr ? 'तुमची शस्त्रक्रिया यादीत दिसत नाही का?' : 'Is your prescribed surgery not listed here?'}
              </h4>
              <p className="text-xs text-slate-300">
                {isMr
                  ? 'शासकीय MJPJAY योजनेअंतर्गत ९९६ हून अधिक शस्त्रक्रिया समाविष्ट आहेत. त्वरित पडताळणीसाठी आमच्या आरोग्य मित्रांशी संपर्क साधा.'
                  : 'Over 996+ medical & surgical procedures are empanelled under MJPJAY. Contact our Arogya Mitra desk for direct verification.'}
              </p>
            </div>
            <a
              href="tel:+917507342222"
              className="btn-primary text-xs py-2.5 px-4 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isMr ? 'आरोग्य मित्र कॉल: 7507342222' : 'Call Arogya Mitra'}</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── TAB 2: STEP-BY-STEP PROCESS (INFOGRAPHIC FLOWCHART) ──────────────── */}
      {activeTab === 'process' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'महात्मा फुले योजनेतून मोफत उपचार मिळवण्याची सोपी प्रक्रिया' : 'Step-by-Step MJPJAY Cashless Admission Process'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'हॉस्पिटलमध्ये दाखल झाल्यापासून डिस्चार्जपर्यंतची संपूर्ण पारदर्शक व जलद प्रक्रिया खालीलप्रमाणे आहे:'
                : 'Follow these 5 simple steps from hospital arrival to discharge with full cashless assistance:'}
            </p>
          </div>

          {/* 5-Step Visual Timeline */}
          <div className="space-y-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="card-clean p-5 sm:p-6 space-y-3 hover:shadow-card-hover hover:border-teal-300 transition-all bg-white"
              >
                {/* Step Top Bar with Step Number and Timeframe */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-[#0F766E] font-bold text-xs flex items-center justify-center font-mono">
                      0{step.step}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                      {isMr ? `पायरी ०${step.step}` : `Step 0${step.step}`}
                    </span>
                  </div>

                  {step.timeframe && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-md border border-teal-100">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>{step.timeframe}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="space-y-1.5 pt-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    {isMr ? step.titleMr : step.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {isMr ? step.descMr : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Arogya Mitra Helpdesk Direct Box */}
          <div className="card-clean p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-teal-300 block font-medium">
                  {isMr ? 'आरोग्य मित्र थेट सहाय्यता डेस्क (तळमजला, रूम १०२)' : 'Arogya Mitra Direct Desk (Ground Floor, Room 102)'}
                </span>
                <p className="text-base font-bold text-white">
                  Sanjeevani Multispeciality Hospital, Jalna
                </p>
                <p className="text-xs text-slate-400">
                  {isMr ? 'वेळ: सोमवार ते शनिवार: ०९:०० AM – ०६:०० PM (२४ तास आपत्कालीन चालू)' : 'Timings: Mon–Sat: 09:00 AM – 06:00 PM | Emergency: 24x7'}
                </p>
              </div>
            </div>

            <a
              href="tel:+917507342222"
              className="btn-emergency text-xs py-2.5 px-5 whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>+91-75073-42222</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── TAB 3: REQUIRED DOCUMENTS (DETAILED BILINGUAL CHECKLIST) ──────────── */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'महात्मा फुले योजनेसाठी आवश्यक कागदपत्रांची यादी' : 'Complete Document Checklist for MJPJAY Admission'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'कृपया रुग्णालयात दाखल होताना खालील मूळ कागदपत्रे आणि प्रत्येकी २ झेरॉक्स प्रती सोबत ठेवाव्यात:'
                : 'Please bring original physical documents along with 2 photocopies each at the time of admission:'}
            </p>
          </div>

          <div className="space-y-6">
            {documentChecklist.map((group, gIdx) => (
              <div key={gIdx} className="card-clean p-6 space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-2.5">
                  {isMr ? group.categoryMr : group.categoryEn}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {group.items.map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900">
                          {isMr ? doc.nameMr : doc.nameEn}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                            doc.required
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {doc.required ? (isMr ? 'अनिवार्य' : 'REQUIRED') : (isMr ? 'पर्यायी' : 'OPTIONAL')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {isMr ? doc.tipMr : doc.tipEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Helpful Document Advisory Tip */}
          <div className="card-clean p-5 bg-teal-50/60 border border-teal-200 flex items-start gap-3 text-xs sm:text-sm text-teal-900">
            <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-teal-950">
                {isMr ? 'रेशन कार्डवर नाव नसल्यास काय करावे?' : 'What if the patient name is missing from the Ration Card?'}
              </p>
              <p className="text-xs text-teal-900 leading-relaxed font-normal">
                {isMr
                  ? 'जर रुग्णाचे नाव रेशन कार्डवर नसेल, तर लग्न नोंदणी प्रमाणपत्र (विवाहित महिलांसाठी) किंवा तहसीलदार कार्यालयाचा उत्पन्नाचा दाखला/प्रतिज्ञापत्र सादर करून आरोग्य मित्र कक्षातून विशेष मंजुरी प्रक्रिया करता येते.'
                  : 'If the patient name is not yet updated on the ration card, carry a Marriage Certificate (for married females) or Tehsildar Residence Certificate for special manual desk authorization.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: REGISTER CLAIM & FAST-TRACK FORM ───────────────────────────── */}
      {activeTab === 'register' && (
        <div className="card-clean p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              {isMr ? 'महात्मा फुले योजना तात्काळ सहाय्यता नोंदणी' : 'Direct MJPJAY Fast-Track Claim Inquire Form'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isMr
                ? 'खालील फॉर्म भरा, आमचे आरोग्य मित्र प्रतिनिधी १५ मिनिटांत आपल्याशी संपर्क साधून पात्रतेची खात्री करतील.'
                : 'Fill this form to notify our hospital Arogya Mitra team for immediate pre-authorization assistance.'}
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-3 py-8">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'योजना सहाय्यता अर्ज यशस्वीरीत्या नोंदवला!' : 'MJPJAY Claim Registered Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {isMr
                  ? 'आपला अर्ज संजीवनी हॉस्पिटलच्या आरोग्य मित्र कक्षाकडे पाठवला गेला आहे. आमचा प्रतिनिधी लवकरच संपर्क करेल.'
                  : 'Your claim request has been dispatched to our Arogya Mitra desk. Our coordinator will contact you shortly.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-xs mt-2"
              >
                {isMr ? 'दुसरा अर्ज नोंदवा' : 'Register Another Claim'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'रुग्णाचे पूर्ण नाव *' : 'Patient Full Name *'}
                  </label>
                  <input
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder={isMr ? 'उदा. ज्ञानेश्वर जाधव' : 'e.g. Dnyaneshwar Jadhav'}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'मोबाईल नंबर (१० अंकी) *' : 'Mobile Number (10 Digits) *'}
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'रुग्णाचे वय (वर्षे) *' : 'Patient Age *'}
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={120}
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="45"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'आधार कार्ड शेवटचे ४ अंक *' : 'Aadhaar Card Last 4 Digits *'}
                  </label>
                  <input
                    required
                    maxLength={4}
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                    placeholder="4567"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'रेशन कार्ड नंबर (पिवळे / केशरी) *' : 'Ration Card Number (Yellow/Orange) *'}
                  </label>
                  <input
                    required
                    value={formData.rationCardNumber}
                    onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
                    placeholder="MH/JLN/1234567"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'अपेक्षित उपचार खर्च (पर्यायी ₹)' : 'Estimated Surgery / Treatment Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedAmount}
                    onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'आजाराचे नाव / आवश्यक शस्त्रक्रिया वर्णन *' : 'Diagnosis / Recommended Surgery Details *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.diagnosisDescription}
                  onChange={(e) => setFormData({ ...formData, diagnosisDescription: e.target.value })}
                  placeholder={
                    isMr
                      ? 'उदा. गुडघे प्रत्यारोपण (Knee Replacement) किंवा हर्निया शस्त्रक्रिया...'
                      : 'Describe the diagnosed ailment or proposed surgery (e.g. Knee Replacement, Hernia Repair, NICU admission)...'
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-semibold"
              >
                {loading
                  ? (isMr ? 'अर्ज सबमिट होत आहे...' : 'Submitting Request...')
                  : (isMr ? 'महात्मा फुले योजना मोफत उपचारासाठी नोंदणी करा' : 'Submit MJPJAY Claim Registration')}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
