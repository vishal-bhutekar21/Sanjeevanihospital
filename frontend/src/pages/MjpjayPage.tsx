import React, { useEffect, useState } from 'react';
import { ShieldCheck, Phone, CheckCircle2, AlertCircle, HeartPulse, Scissors, Baby, Activity } from 'lucide-react';
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

  const categoryIcons: Record<string, any> = {
    'Orthopedic Surgeries': Activity,
    'Pediatric & Neonatal Procedures': Baby,
    'General & Laparoscopic Surgeries': Scissors,
    'ICU & Critical Care Interventions': HeartPulse,
  };

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
      alert('Failed to submit MJPJAY claim assistance request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-slate-900 text-white space-y-5">
        <div className="badge-teal text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isMr ? 'महाराष्ट्र शासन मान्यताप्राप्त मोफत आरोग्य योजना' : 'Government of Maharashtra Healthcare Scheme'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-heading">
          <span>{isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}</span><br />
          <span className="text-teal-400">
            {isMr ? 'जन आरोग्य योजना (MJPJAY)' : 'Jan Arogya Yojana (MJPJAY)'}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isMr
            ? 'महाराष्ट्रातील पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटल, जालना येथे मोफत शस्त्रक्रिया व प्रगत उपचार उपलब्ध आहेत. आमचा समर्पित आरोग्य मित्र कक्ष आपणास तत्पर सहाय्य करतो.'
            : 'Providing completely cashless advanced surgical care and tertiary healthcare to eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital, Jalna.'}
        </p>

        {/* Action Helpline */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <a
            href="tel:+917507342222"
            className="btn-emergency text-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Arogya Mitra Helpline: +91-75073-42222</span>
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">
            <span>Coverage: Up to ₹5,00,000 / family</span>
          </div>
        </div>

        {info?.schemeInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-lg">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Coverage Limit</p>
              <p className="font-bold text-white text-sm mt-0.5">{info.schemeInfo.coverageLimit}</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Governing Authority</p>
              <p className="font-bold text-white text-sm mt-0.5">{info.schemeInfo.governingAuthority}</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Beneficiary Eligibility</p>
              <p className="font-bold text-white text-sm mt-0.5">{info.schemeInfo.eligibility}</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── NOTICE CARD ──────────────────────────────────────────────────────── */}
      <div className="card-clean p-4 sm:p-5 bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-900">
            {isMr ? 'शासकीय योजना मार्गदर्शक नियम' : 'Government Scheme Compliance Notice'}
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            {info?.schemeInfo?.disclaimer ||
              'Eligibility, coverage, and cashless treatment are subject to applicable government scheme rules and Arogya Mitra pre-authorization approval.'}
          </p>
        </div>
      </div>

      {/* ─── TAB SWITCHER ─────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 p-1.5 rounded-lg max-w-lg">
        {([
          { key: 'procedures', label: isMr ? 'समाविष्ट उपचार' : 'Covered Procedures' },
          { key: 'process', label: isMr ? 'योजना प्रक्रिया' : 'Step-by-Step' },
          { key: 'documents', label: isMr ? 'आवश्यक कागदपत्रे' : 'Documents' },
          { key: 'register', label: isMr ? 'मदतीसाठी अर्ज' : 'Register Claim' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex-1 ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: PROCEDURES ────────────────────────────────────────────────────── */}
      {activeTab === 'procedures' && info?.eligibleCategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.eligibleCategories.map((cat: any) => {
            const Icon = categoryIcons[cat.category] || Activity;
            return (
              <div
                key={cat.category}
                className="card-clean p-6 space-y-3"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">{cat.category}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.procedures.map((p: string) => (
                    <li key={p} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB: PROCESS ───────────────────────────────────────────────────────── */}
      {activeTab === 'process' && info?.process && (
        <div className="space-y-4">
          {info.process.map((step: any) => (
            <div
              key={step.step}
              className="card-clean p-5 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step.step}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}

          {/* Arogya Mitra Contact Box */}
          <div className="card-clean p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-teal-400" />
              <div>
                <span className="text-xs text-slate-400 block">
                  Arogya Mitra Direct Desk (Sanjeevani Hospital Jalna)
                </span>
                <span className="text-base font-bold text-white">+91-75073-42222</span>
              </div>
            </div>
            <span className="badge-teal text-xs">
              Mon–Sat: 09:00 AM – 06:00 PM
            </span>
          </div>
        </div>
      )}

      {/* ─── TAB: DOCUMENTS ─────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && info?.documentChecklist && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'महात्मा फुले योजनेसाठी आवश्यक कागदपत्रे' : 'Documents Required for MJPJAY Admission'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMr
                ? 'कृपया रुग्णालयात दाखल होताना खालील मूळ कागदपत्रे सोबत ठेवावीत:'
                : 'Please bring original physical copies of the following documents:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.documentChecklist.map((doc: any) => (
              <div
                key={doc.item}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm"
              >
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    doc.required ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {doc.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
                <span className="text-slate-800 font-medium">{doc.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: REGISTER CLAIM ────────────────────────────────────────────────── */}
      {activeTab === 'register' && (
        <div className="card-clean p-6 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-3 py-8">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'योजना सहाय्यता अर्ज नोंदवला गेला!' : 'MJPJAY Claim Registered!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {isMr
                  ? 'आमचा आरोग्य मित्र प्रतिनिधी लवकरच आपल्याशी संपर्क करेल व कागदपत्रांची पडताळणी करेल.'
                  : 'Your request has been sent to our Arogya Mitra desk. They will contact you shortly to verify eligibility.'}
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
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {isMr ? 'महात्मा फुले योजना सहाय्यता नोंदणी' : 'Register for MJPJAY Scheme Assistance'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? 'आरोग्य मित्रांकडून त्वरित पडताळणीसाठी खालील माहिती भरा:'
                    : 'Fill this form to notify our hospital Arogya Mitra desk for direct assistance:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Patient Name *</label>
                  <input
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Ramesh Jadhav"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Patient Age *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={120}
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Aadhaar Last 4 Digits *</label>
                  <input
                    required
                    maxLength={4}
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                    placeholder="4567"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Ration Card Number (Yellow/Orange) *</label>
                  <input
                    required
                    value={formData.rationCardNumber}
                    onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
                    placeholder="MH/JLN/XXXXXXX"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Estimated Treatment Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedAmount}
                    onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Diagnosis / Recommended Surgery *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.diagnosisDescription}
                  onChange={(e) => setFormData({ ...formData, diagnosisDescription: e.target.value })}
                  placeholder="Describe recommended surgical treatment or diagnosis..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-sm"
              >
                {loading ? 'Submitting Claim...' : 'Submit MJPJAY Claim Registration'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
