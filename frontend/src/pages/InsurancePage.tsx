import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Phone,
  AlertCircle,
  Building2,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  Send,
  HelpCircle,
  Sparkles,
  Search,
  Calendar,
  HeartPulse,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

export const InsurancePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [info, setInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'process' | 'documents' | 'insurers' | 'inquiry'>('process');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    patientName: '',
    phone: '',
    insuranceCompany: '',
    policyNumber: '',
    plannedTreatment: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/schemes/insurance/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => setInfo(null));
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setTimeout(() => {
      setSubmittingInquiry(false);
      setInquirySubmitted(true);
    }, 600);
  };

  // Comprehensive Step-by-Step Cashless Workflow Dataset in Both Languages
  const cashlessSteps = [
    {
      step: '01',
      titleEn: 'Insurance Card & Government ID Submission',
      titleMr: 'इन्शुरन्स कार्ड आणि ओळखपत्र सादर करणे',
      timeframe: '0–30 Mins',
      descEn: 'Visit our 24x7 Insurance / TPA Helpdesk located in the hospital main lobby. Present your Health Insurance e-Card / Physical Card along with the patient’s Aadhaar Card & PAN Card.',
      descMr: 'हॉस्पिटलच्या मुख्य लॉबीतील २४ तास सुरू असलेल्या इन्शुरन्स / टीपीए कक्षाला भेट द्या. आपले आरोग्य विमा कार्ड, पॉलिसी नंबर आणि रुग्णाचे मूळ आधार कार्ड व पॅन कार्ड सादर करा.',
      badge: isMr ? 'दस्तऐवज पडताळणी' : 'ID & Card Check',
    },
    {
      step: '02',
      titleEn: 'Doctor Clinical Evaluation & Pre-Auth Form Filling',
      titleMr: 'तज्ज्ञ डॉक्टरांकडून पूर्व-मंजुरी फॉर्म (Pre-Auth) भरणे',
      timeframe: '30–60 Mins',
      descEn: 'The attending specialist doctor fills the Medical Section of the Pre-Authorization Request Form detailing the diagnosis, proposed surgery/treatment, and estimated hospitalization cost.',
      descMr: 'उपचार करणारे तज्ज्ञ डॉक्टर वैद्यकीय पूर्व-मंजुरी फॉर्ममध्ये आजाराचे अचूक निदान, आवश्यक शस्त्रक्रिया आणि उपचारांचा अंदाजित खर्च नमूद करून स्वाक्षरी करतात.',
      badge: isMr ? 'वैद्यकीय अंदाज' : 'Clinical Costing',
    },
    {
      step: '03',
      titleEn: 'Electronic Submission to Insurance / TPA Portal',
      titleMr: 'इन्शुरन्स कंपनी / टीपीए पोर्टलवर ऑनलाइन पाठवणे',
      timeframe: '1–2 Hours',
      descEn: 'Our Insurance Desk electronically submits the pre-authorization form along with initial diagnostic reports, doctor prescription, and ID proofs to your insurance company or TPA portal.',
      descMr: 'आमचा इन्शुरन्स डेस्क सर्व कागदपत्रे, तपासणी अहवाल आणि फॉर्म आपल्या विमा कंपनीच्या किंवा टीपीएच्या अधिकृत ऑनलाइन पोर्टलवर तात्काळ अपलोड करतो.',
      badge: isMr ? 'डिजिटल ट्रान्समिशन' : 'Instant E-Filing',
    },
    {
      step: '04',
      titleEn: 'Initial Approval & Cashless Hospitalization',
      titleMr: 'प्रारंभिक मंजुरी पत्र (Approval Letter) आणि कॅशलेस दाखल',
      timeframe: '2–4 Hours',
      descEn: 'Upon scrutiny, the insurance company/TPA issues an Initial Cashless Sanction Letter. The patient is admitted and receives surgical/medical care without any advance cash deposit.',
      descMr: 'विमा कंपनीकडून तपासणीनंतर प्रारंभिक कॅशलेस मंजुरी पत्र जारी केले जाते. रुग्णाला कोणतेही आगाऊ पैसे न भरता कॅशलेस पद्धतीने दाखल करून उपचार सुरू केले जातात.',
      badge: isMr ? 'शून्य डिपॉझिट' : 'Zero Cash Deposit',
    },
    {
      step: '05',
      titleEn: 'Final Billing, Claim Settlement & Smooth Discharge',
      titleMr: 'अंतिम बिल सेटलमेंट आणि डिस्चार्ज',
      timeframe: 'On Discharge',
      descEn: 'At the time of discharge, our hospital submits final itemized bills, pharmacy charges, and discharge summary for final authorization. The patient only pays non-medical deductible consumables.',
      descMr: 'डिस्चार्जच्या वेळी हॉस्पिटलकडून अंतिम बिल व डिस्चार्ज समरी पाठवली जाते. विमा कंपनीकडून अंतिम सेटलमेंट झाल्यानंतर रुग्ण केवळ नॉन-मेडिकल शुल्क देऊन सुखरूप घरी जाऊ शकतात.',
      badge: isMr ? 'अंतिम सेटलमेंट' : 'Discharge Complete',
    },
  ];

  // Comprehensive Required Documents Checklist
  const documentGroups = [
    {
      groupEn: 'Policy & Insurance Identification Proofs',
      groupMr: 'विमा पॉलिसी आणि ओळखपत्र पुरावे (अनिवार्य)',
      items: [
        {
          nameEn: 'Health Insurance Card / E-Card (Current Active Year)',
          nameMr: 'आरोग्य विमा कार्ड / ई-कार्ड (सध्याचे चालू वर्ष)',
          required: true,
          descEn: 'Shows policy number, member ID, validity period, and insured person name.',
          descMr: 'पॉलिसी नंबर, मेंबर आयडी, वैधता मुदत आणि विमित व्यक्तीचे नाव दर्शवणारे कार्ड.',
        },
        {
          nameEn: 'Latest Health Insurance Policy Schedule / Bond Document',
          nameMr: 'विमा पॉलिसी शेड्यूल / बॉण्ड प्रत (Policy Schedule)',
          required: true,
          descEn: 'Full schedule document indicating Sum Insured and family members covered.',
          descMr: 'विमा संरक्षण रक्कम (Sum Insured) आणि समाविष्ट सदस्यांची यादी दर्शवणारी प्रत.',
        },
        {
          nameEn: 'Original Government Photo ID of Patient (Aadhaar / Voter ID / Passport)',
          nameMr: 'रुग्णाचे मूळ सरकारी ओळखपत्र (आधार कार्ड / मतदान कार्ड)',
          required: true,
          descEn: 'Mandatory for patient identity verification against policy database.',
          descMr: 'विमा डेटाबेसमध्ये रुग्णाची ओळख पडताळणी करण्यासाठी अनिवार्य.',
        },
        {
          nameEn: 'PAN Card / Aadhaar Card of Proposer / Main Policyholder',
          nameMr: 'मुख्य विमाधारकाचे (Policyholder) पॅन कार्ड व आधार कार्ड',
          required: true,
          descEn: 'Required for claims exceeding ₹50,000 as per IRDAI compliance guidelines.',
          descMr: 'IRDAI नियमांनुसार क्लेम मंजुरीसाठी मुख्य विमाधारकाचे पॅन कार्ड आवश्यक.',
        },
      ],
    },
    {
      groupEn: 'Medical & Clinical Investigation Records',
      groupMr: 'वैद्यकीय प्रिस्क्रिप्शन आणि तपासणी अहवाल',
      items: [
        {
          nameEn: 'Sanjeevani Hospital OPD Consultation Paper & Doctor Prescription',
          nameMr: 'संजीवनी हॉस्पिटलचे ओपीडी प्रिस्क्रिप्शन व डॉक्टरांचा सल्ला कागद',
          required: true,
          descEn: 'Outlining symptoms, clinical diagnosis, and recommendation for admission.',
          descMr: 'आजार लक्षणे, वैद्यकीय निदान आणि हॉस्पिटलमध्ये दाखल होण्याचा डॉक्टरांचा सल्ला.',
        },
        {
          nameEn: 'Relevant Diagnostic Investigation Reports (Blood, X-Ray, CT, Sonography)',
          nameMr: 'सर्व संबंधित तपासणी अहवाल (रक्त चाचणी, एक्स-रे, सीटी स्कॅन, सोनोग्राफी)',
          required: true,
          descEn: 'Lab and imaging reports supporting the medical necessity of hospitalization.',
          descMr: 'उपचार व शस्त्रक्रियेची वैद्यकीय गरज सिद्ध करणारे चाचणी अहवाल.',
        },
        {
          nameEn: 'Past Medical History & Previous Hospital Discharge Summaries (If any)',
          nameMr: 'मागील आजारांचा इतिहास व पूर्वीचे डिस्चार्ज कार्ड (असल्यास)',
          required: false,
          descEn: 'Required by TPA if the treatment relates to pre-existing chronic conditions.',
          descMr: 'पूर्वीच्या जुनाट आजारांसाठी टीपीएकडून तपासणीसाठी मागितले जाऊ शकते.',
        },
        {
          nameEn: 'Corporate Employee Photo ID Card (For Corporate Group Insurance)',
          nameMr: 'कंपनीचे कर्मचारी ओळखपत्र (कॉर्पोरेट ग्रुप विमा पॉलिसीसाठी)',
          required: false,
          descEn: 'Required for employees insured under employer group mediclaim policies.',
          descMr: 'कंपनीद्वारे दिलेल्या ग्रुप मेडिक्लेम पॉलिसीधारकांसाठी आवश्यक.',
        },
      ],
    },
  ];

  // Comprehensive List of All 18 Panel Insurers & 11 TPAs with Details
  const panelInsurersList = [
    { name: 'Star Health & Allied Insurance', nameMr: 'स्टार हेल्थ अँड अलाईड इन्शुरन्स', type: 'Standalone Health', cashless: 'Fast-track 1-2 Hrs' },
    { name: 'HDFC ERGO General Insurance', nameMr: 'एचडीएफसी एर्गो जनरल इन्शुरन्स', type: 'General Insurer', cashless: 'Online Portal' },
    { name: 'ICICI Lombard General Insurance', nameMr: 'आयसीआयसीआय लोम्बार्ड', type: 'General Insurer', cashless: 'Instant Approval' },
    { name: 'Care Health Insurance (Religare)', nameMr: 'केअर हेल्थ इन्शुरन्स (रेलिगेअर)', type: 'Standalone Health', cashless: 'Fast-track' },
    { name: 'Niva Bupa Health Insurance (Max Bupa)', nameMr: 'निवा बुपा हेल्थ इन्शुरन्स', type: 'Standalone Health', cashless: 'Digital Auto-Auth' },
    { name: 'Bajaj Allianz General Insurance', nameMr: 'बजाज अलियान्झ जनरल इन्शुरन्स', type: 'General Insurer', cashless: '24x7 TPA Desk' },
    { name: 'Tata AIG General Insurance', nameMr: 'टाटा एआयजी जनरल इन्शुरन्स', type: 'General Insurer', cashless: 'Online Pre-Auth' },
    { name: 'SBI General Insurance', nameMr: 'एसबीआय जनरल इन्शुरन्स', type: 'Public-Private', cashless: 'Direct Cashless' },
    { name: 'Aditya Birla Health Insurance', nameMr: 'आदित्य बिर्ला हेल्थ इन्शुरन्स', type: 'Standalone Health', cashless: 'Fast-track' },
    { name: 'Reliance General Insurance', nameMr: 'रिलायन्स जनरल इन्शुरन्स', type: 'General Insurer', cashless: 'E-Approval' },
    { name: 'National Insurance Company Ltd.', nameMr: 'नॅशनल इन्शुरन्स कंपनी लि.', type: 'Public Sector (Govt)', cashless: 'Via Panel TPA' },
    { name: 'The New India Assurance Co. Ltd.', nameMr: 'द न्यू इंडिया अ‍ॅश्युरन्स कंपनी', type: 'Public Sector (Govt)', cashless: 'Via Panel TPA' },
    { name: 'The Oriental Insurance Co. Ltd.', nameMr: 'द ओरिएंटल इन्शुरन्स कंपनी', type: 'Public Sector (Govt)', cashless: 'Via Panel TPA' },
    { name: 'United India Insurance Co. Ltd.', nameMr: 'युनायटेड इंडिया इन्शुरन्स कंपनी', type: 'Public Sector (Govt)', cashless: 'Via Panel TPA' },
    { name: 'ManipalCigna Health Insurance', nameMr: 'मनिपाल सिगना हेल्थ इन्शुरन्स', type: 'Standalone Health', cashless: 'Online Portal' },
    { name: 'Future Generali India Insurance', nameMr: 'फ्युचर जनरली इंडिया इन्शुरन्स', type: 'General Insurer', cashless: 'Direct Desk' },
    { name: 'Go Digit General Insurance', nameMr: 'गो डिजिट जनरल इन्शुरन्स', type: 'Digital Insurer', cashless: 'Instant Paperless' },
    { name: 'Magma HDI General Insurance', nameMr: 'मॅग्मा एचडीआय जनरल इन्शुरन्स', type: 'General Insurer', cashless: 'Direct TPA' },
  ];

  const tpaPartnersList = [
    { name: 'Medi Assist Insurance TPA Pvt. Ltd.', nameMr: 'मेडी असिस्ट इन्शुरन्स टीपीए', code: 'TPA-001', support: '24x7 Desk Sync' },
    { name: 'Vidal Health Insurance TPA Pvt. Ltd.', nameMr: 'वि Vidal हेल्थ टीपीए', code: 'TPA-002', support: 'Instant E-Approval' },
    { name: 'Paramount Health Services & Insurance TPA', nameMr: 'पॅरामाउंट हेल्थ सर्व्हिसेस टीपीए', code: 'TPA-003', support: 'Fast Pre-Auth' },
    { name: 'MDIndia Health Insurance TPA Pvt. Ltd.', nameMr: 'एमडी इंडिया हेल्थ टीपीए', code: 'TPA-004', support: 'Public Sector Desk' },
    { name: 'Heritage Health Insurance TPA Pvt. Ltd.', nameMr: 'हेरिटेज हेल्थ टीपीए', code: 'TPA-005', support: 'Cashless Support' },
    { name: 'Raksha Health Insurance TPA Pvt. Ltd.', nameMr: 'रक्षा हेल्थ इन्शुरन्स टीपीए', code: 'TPA-006', support: 'Direct Coordination' },
    { name: 'Family Health Plan Insurance TPA (FHPL)', nameMr: 'फॅमिली हेल्थ प्लॅन टीपीए (FHPL)', code: 'TPA-007', support: 'Corporate & Retail' },
    { name: 'Health Insurance TPA of India (HITPA)', nameMr: 'हेल्थ इन्शुरन्स टीपीए ऑफ इंडिया', code: 'TPA-008', support: 'Govt PSU Companies' },
    { name: 'Park Mediclaim TPA Pvt. Ltd.', nameMr: 'पार्क मेडिक्लेम टीपीए', code: 'TPA-009', support: 'Direct Panel Desk' },
    { name: 'Genins India Insurance TPA Ltd.', nameMr: 'जेनइन्स इंडिया इन्शुरन्स टीपीए', code: 'TPA-010', support: 'Cashless Helpdesk' },
    { name: 'Dedicated Healthcare Services (DHS TPA)', nameMr: 'डेडिकेटेड हेल्थकेअर सर्व्हिसेस टीपीए', code: 'TPA-011', support: 'Specialized Claims' },
  ];

  const filteredInsurers = panelInsurersList.filter(
    (ins) =>
      ins.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.nameMr.includes(searchTerm)
  );

  const filteredTpas = tpaPartnersList.filter(
    (tpa) =>
      tpa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpa.nameMr.includes(searchTerm)
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* ─── 1. HERO BANNER (CLEAN HEALTHCARE STYLING) ───────────────────────── */}
      <div className="card-clean p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-teal-50/80 via-white to-blue-50/40 border border-teal-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="badge-teal text-xs py-1 px-3">
            <CreditCard className="w-4 h-4 text-[#0F766E]" />
            <span>{isMr ? 'कॅशलेस मेडिक्लेम व इन्शुरन्स टीपीए (TPA) सेवा' : 'Cashless Mediclaim & TPA Services'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isMr ? '३५+ आघाडीच्या विमा कंपन्यांशी संलग्न' : 'Empanelled with 35+ Insurers & TPAs'}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
            {isMr ? 'कॅशलेस मेडिक्लेम आणि' : 'Cashless Mediclaim &'}<br />
            <span className="text-[#0F766E]">
              {isMr ? 'इन्शुरन्स टीपीए (TPA) सहाय्यता कक्ष' : 'Insurance TPA Help Desk'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {isMr
              ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल भारतातील सर्व प्रमुख शासकीय व खाजगी आरोग्य विमा कंपन्या आणि टीपीए भागीदारांशी संलग्न आहे. आमचा समर्पित इन्शुरन्स डेस्क रुग्णांसाठी अखंड कॅशलेस पूर्व-मंजुरी, झिरो अ‍ॅडव्हान्स डिपॉझिट आणि सुलभ क्लेम सेटलमेंटची सुविधा देतो.'
              : 'Sanjeevani Multispeciality Hospital, Jalna coordinates seamless cashless pre-authorization, zero upfront deposit, and priority claim settlement with all major public and private insurance companies.'}
          </p>
        </div>

        {/* Action Helpline & Working Hours */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="tel:+917507342222"
            className="btn-emergency text-xs py-2.5 px-4 shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>{isMr ? 'इन्शुरन्स हेल्पलाईन: +91-75073-42222' : 'Insurance Helpline: +91-75073-42222'}</span>
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Clock className="w-4 h-4 text-[#0F766E]" />
            <span>{info?.tpaDeskTimings || (isMr ? 'वेळ: सोम-शनि ०९:०० AM – ०६:०० PM (२४ तास आपत्कालीन)' : 'Mon–Sat: 09:00 AM – 06:00 PM | Emergency 24x7')}</span>
          </div>
        </div>

        {/* 4 Standout Infographic Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 shadow-2xs">
            <p className="text-[#0F766E] font-bold uppercase text-[10px]">{isMr ? 'पूर्व-मंजुरी वेग' : 'Speed'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '२ ते ४ तासांत मंजुरी' : '2–4 Hour Turnaround'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{isMr ? 'डिजिटल ई-प्री-ऑथ' : 'Fast digital pre-auth'}</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 shadow-2xs">
            <p className="text-[#0F766E] font-bold uppercase text-[10px]">{isMr ? 'डिपॉझिट नियम' : 'Admission'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? 'शून्य अ‍ॅडव्हान्स कॅश' : 'Zero Advance Deposit'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{isMr ? 'मंजूर रकमेसाठी कॅशलेस' : 'For approved cashless limits'}</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 shadow-2xs">
            <p className="text-[#0F766E] font-bold uppercase text-[10px]">{isMr ? 'संलग्न नेटवर्क' : 'Network'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? '३५+ विमा कंपन्या' : '35+ Insurers & TPAs'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{isMr ? 'शासकीय व खाजगी कंपन्या' : 'PSU & Private Panels'}</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 shadow-2xs">
            <p className="text-[#0F766E] font-bold uppercase text-[10px]">{isMr ? 'समर्पित डेस्क' : 'Coordinator'}</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">{isMr ? 'तज्ज्ञ क्लेम समन्वयक' : 'Dedicated TPA Desk'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{isMr ? 'हॉस्पिटल तळमजला रूम १०३' : 'Lobby Helpdesk'}</p>
          </div>
        </div>
      </div>

      {/* ─── 2. PLANNED VS EMERGENCY ADMISSION INFOGRAPHIC ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-clean p-6 space-y-3 bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-[#0F766E]">
            <Calendar className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              {isMr ? 'नियोजित दाखल (Planned Hospitalization)' : 'Planned Hospitalization Workflow'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isMr
              ? 'शस्त्रक्रिया किंवा उपचारांच्या ४८ ते ७२ तास आधी हॉस्पिटलच्या इन्शुरन्स डेस्कवर येऊन प्री-ऑथ अर्ज सबमिट करा. दाखल होण्याच्या दिवशी प्रारंभिक मंजुरी पत्र तयार राहते.'
              : 'Submit pre-authorization documents 48 to 72 hours prior to scheduled surgery. Initial cashless approval is ready on the day of admission.'}
          </p>
          <span className="badge-teal text-[11px] py-0.5">{isMr ? '४८ तास आधी सूचना द्या' : '48 Hours Advance Notice'}</span>
        </div>

        <div className="card-clean p-6 space-y-3 bg-red-50/50 border border-red-200">
          <div className="flex items-center gap-2 text-red-600">
            <HeartPulse className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              {isMr ? 'आपत्कालीन दाखल (Emergency Hospitalization)' : 'Emergency Hospitalization Workflow'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isMr
              ? 'तातडीच्या आपत्कालीन किंवा अपघात प्रसंगी रुग्णाला त्वरित ICU/कॅज्युअल्टीमध्ये दाखल केले जाते आणि २४ तासांच्या आत इन्शुरन्स डेस्कद्वारे इमर्जन्सी प्री-ऑथ पाठवले जाते.'
              : 'In critical emergencies, patient is admitted immediately. Insurance Desk files emergency pre-authorization within 24 hours of hospital admission.'}
          </p>
          <span className="badge-slate text-[11px] py-0.5 text-red-700 bg-red-100">{isMr ? '२४ तासांत सूचना द्या' : 'Intimate within 24 Hours'}</span>
        </div>
      </div>

      {/* ─── GOVERNMENT & TPA COMPLIANCE NOTICE (WARM AMBER STYLING) ──────────── */}
      <div className="card-notice-amber flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
            {isMr ? 'कॅशलेस मेडिक्लेम व टीपीए मार्गदर्शक सूचना' : 'Mediclaim Cashless Settlement Notice'}
          </h4>
          <p className="text-xs text-amber-900 leading-relaxed">
            {isMr
              ? 'कॅशलेस मंजुरी आणि उपचारांची व्याप्ती संबंधित विमा कंपनी किंवा टीपीए (TPA) पॉलिसीच्या अटी, सह-पेमेंट आणि उप-मर्यादेनुसार ठरवली जाते.'
              : 'Cashless hospital admission, sum insured limits, and pre-authorization approvals are subject to policy terms, co-pay clauses, and TPA pre-authorization.'}
          </p>
        </div>
      </div>

      {/* ─── 3. TAB NAVIGATION WITH GENEROUS SPACING ────────────────────────────── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 p-1.5 rounded-xl max-w-2xl">
        {([
          { key: 'process', label: isMr ? 'कॅशलेस प्रक्रिया (Step-by-Step)' : 'Cashless Process', icon: ArrowRight },
          { key: 'documents', label: isMr ? 'आवश्यक कागदपत्रे' : 'Required Documents', icon: FileText },
          { key: 'insurers', label: isMr ? 'संलग्न विमा कंपन्या व टीपीए' : 'Panel Insurers & TPAs', icon: Building2 },
          { key: 'inquiry', label: isMr ? 'विमा पूर्व-तपासणी अर्ज' : 'Check Eligibility / Inquire', icon: Send },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: CASHLESS PROCESS (STEP-BY-STEP INFOGRAPHIC) ───────────────── */}
      {activeTab === 'process' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'कॅशलेस मेडिक्लेम मंजुरीची ५-टप्प्यांची सोपी प्रक्रिया' : 'Step-by-Step Cashless Mediclaim Approval Process'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'हॉस्पिटलमध्ये दाखल झाल्यापासून डिस्चार्जपर्यंतची पारदर्शक आणि जलद प्रक्रिया:'
                : 'Follow these 5 simple steps for seamless cashless hospitalization at Sanjeevani Hospital:'}
            </p>
          </div>

          <div className="space-y-4">
            {cashlessSteps.map((step) => (
              <div
                key={step.step}
                className="card-clean p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 hover:shadow-card-hover transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0F766E] text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium opacity-80">STEP</span>
                  <span className="text-base font-bold leading-none">{step.step}</span>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      {isMr ? step.titleMr : step.titleEn}
                    </h3>
                    <span className="badge-teal text-[10px] py-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{step.timeframe}</span>
                    </span>
                    <span className="badge-slate text-[10px] py-0.5">{step.badge}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {isMr ? step.descMr : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Helpdesk Box */}
          <div className="card-clean p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-teal-300 block font-medium">
                  {isMr ? 'इन्शुरन्स टीपीए सहाय्यता कक्ष (तळमजला)' : 'Insurance TPA Direct Desk (Lobby Level)'}
                </span>
                <p className="text-base font-bold text-white">
                  Sanjeevani Multispeciality Hospital, Jalna
                </p>
                <p className="text-xs text-slate-400">
                  {isMr ? 'वेळ: सोमवार ते शनिवार: ०९:०० AM – ०६:०० PM (२४ तास आपत्कालीन चालू)' : 'Mon–Sat: 09:00 AM – 06:00 PM | Emergency Desk: 24 Hours'}
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

      {/* ─── TAB 2: REQUIRED DOCUMENTS (DETAILED BILINGUAL CHECKLIST) ──────────── */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'कॅशलेस प्रवेशासाठी आवश्यक कागदपत्रांची तपशीलवार यादी' : 'Complete Document Checklist for Cashless Admission'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isMr
                ? 'हॉस्पिटलमध्ये दाखल होताना खालील मूळ कागदपत्रे आणि प्रत्येकी २ झेरॉक्स प्रती इन्शुरन्स डेस्कवर सादर कराव्यात:'
                : 'Please bring original physical documents along with 2 photocopies each to our Insurance Desk:'}
            </p>
          </div>

          <div className="space-y-6">
            {documentGroups.map((group, gIdx) => (
              <div key={gIdx} className="card-clean p-6 space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-2.5">
                  {isMr ? group.groupMr : group.groupEn}
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
                          {doc.required ? (isMr ? 'अनिवार्य' : 'MANDATORY') : (isMr ? 'लागू असल्यास' : 'IF APPLICABLE')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {isMr ? doc.descMr : doc.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Advisory Notice Card */}
          <div className="card-clean p-5 bg-amber-50/60 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">
                {isMr ? 'नॉन-मेडिकल खर्च व को-पेमेंट मार्गदर्शक सूचना' : 'Non-Medical Deductibles & Co-Pay Policy Notice'}
              </p>
              <p className="text-xs text-amber-900/90 leading-relaxed font-normal">
                {isMr
                  ? 'विमा पॉलिसीच्या अटींनुसार नॉन-मेडिकल वस्तू (उदा. ग्लोज, थर्मामीटर, डायपर्स, रजिस्ट्रेशन फी) आणि पॉलिसीतील को-पेमेंट (Co-pay) रक्कम रुग्णाला थेट डिस्चार्जच्या वेळी भरावी लागते.'
                  : 'As per IRDAI terms, non-medical consumables (gloves, administrative charges, registration fees) and co-pay percentages are payable by the patient at the time of discharge.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PANEL INSURERS & TPA PARTNERS (COMPREHENSIVE BILINGUAL) ───── */}
      {activeTab === 'insurers' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {isMr ? 'संलग्न विमा कंपन्या आणि टीपीए (TPA) भागीदार' : 'Panel Insurance Companies & Third Party Administrators'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isMr
                  ? 'संजीवनी हॉस्पिटलमध्ये खालील सर्व विमा कंपन्यांचे कॅशलेस उपचार उपलब्ध आहेत:'
                  : 'Sanjeevani Multispeciality Hospital provides cashless admissions for all listed insurers:'}
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isMr ? 'विमा कंपनी शोधा...' : 'Search insurer or TPA...'}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Panel Insurance Companies */}
            <div className="card-clean p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {isMr ? 'संलग्न विमा कंपन्या (१८)' : 'Panel Insurance Companies (18)'}
                  </h3>
                </div>
                <span className="badge-teal text-[11px] py-0.5">{isMr ? 'कॅशलेस अधिकृत' : 'Cashless Empanelled'}</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredInsurers.map((ins, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
                          {isMr ? ins.nameMr : ins.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{ins.type}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded shrink-0">
                      {ins.cashless}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Third Party Administrators (TPA) */}
            <div className="card-clean p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-[#0F766E]" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {isMr ? 'टीपीए (TPA) भागीदार (११)' : 'Third Party Administrators - TPA (11)'}
                  </h3>
                </div>
                <span className="badge-slate text-[11px] py-0.5">{isMr ? '२४ तास समन्वयक' : 'Direct Desk'}</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredTpas.map((tpa, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
                          {isMr ? tpa.nameMr : tpa.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{tpa.code}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded shrink-0">
                      {tpa.support}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: ADVANCE ELIGIBILITY INQUIRY FORM ───────────────────────────── */}
      {activeTab === 'inquiry' && (
        <div className="card-clean p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              {isMr ? 'कॅशलेस विमा पूर्व-पात्रता तपासणी अर्ज' : 'Pre-Admission Cashless Insurance Verification'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isMr
                ? 'आपल्या विमा पॉलिसीची माहिती सबमिट करा, आमचा इन्शुरन्स डेस्क तात्काळ पात्रता व कॅशलेस मर्यादा तपासून आपणास कळवेल.'
                : 'Submit your policy details below for fast pre-admission cashless verification and estimate support.'}
            </p>
          </div>

          {inquirySubmitted ? (
            <div className="text-center space-y-3 py-8">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'विमा चौकशी अर्ज नोंदवला गेला!' : 'Insurance Verification Request Submitted!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {isMr
                  ? 'आमचा इन्शुरन्स डेस्क आपल्या विमा कंपनीशी संपर्क साधून लवकरच आपल्याशी संपर्क करेल.'
                  : 'Our TPA coordinator will verify your policy coverage and contact you within 30 minutes.'}
              </p>
              <button
                onClick={() => setInquirySubmitted(false)}
                className="btn-secondary text-xs mt-2"
              >
                {isMr ? 'दुसरी चौकशी नोंदवा' : 'Check Another Policy'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'रुग्णाचे पूर्ण नाव *' : 'Patient Full Name *'}
                  </label>
                  <input
                    required
                    value={inquiryForm.patientName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, patientName: e.target.value })}
                    placeholder={isMr ? 'उदा. सुहास कुलकर्णी' : 'e.g. Suhas Kulkarni'}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'मोबाईल नंबर *' : 'Contact Phone Number *'}
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'विमा कंपनीचे नाव *' : 'Insurance Company / TPA Name *'}
                  </label>
                  <input
                    required
                    value={inquiryForm.insuranceCompany}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, insuranceCompany: e.target.value })}
                    placeholder={isMr ? 'उदा. Star Health / HDFC ERGO / Medi Assist' : 'e.g. Star Health / HDFC ERGO / Medi Assist'}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isMr ? 'पॉलिसी नंबर किंवा कार्ड नंबर *' : 'Policy / Member Card Number *'}
                  </label>
                  <input
                    required
                    value={inquiryForm.policyNumber}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, policyNumber: e.target.value })}
                    placeholder="P/123456/01/2026/000123"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'नियोजित उपचार / शस्त्रक्रिया वर्णन *' : 'Planned Surgery / Medical Diagnosis Details *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={inquiryForm.plannedTreatment}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, plannedTreatment: e.target.value })}
                  placeholder={
                    isMr
                      ? 'उदा. ऑर्थोपेडिक शस्त्रक्रिया, लेप्रोस्कोपी किंवा अतिदक्षता विभाग उपचार...'
                      : 'Describe the planned medical treatment or recommended surgery...'
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="btn-primary w-full py-3 text-sm font-semibold"
              >
                {submittingInquiry
                  ? (isMr ? 'चौकशी अर्ज पाठवत आहे...' : 'Submitting Inquiry...')
                  : (isMr ? 'कॅशलेस पूर्व-पात्रता तपासणीसाठी पाठवा' : 'Submit for Free Cashless Verification')}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
