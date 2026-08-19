import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Stethoscope,
  Heart,
  Baby,
  Scissors,
  Activity,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

const categoryIcons: Record<string, React.ElementType> = {
  'Cardiac & Cardiovascular Surgery': Heart,
  'Orthopedics & Trauma': Activity,
  'General & Laparoscopic Surgery': Scissors,
  'Obstetrics & Gynecology': Baby,
  'Neonatal & Pediatric Care': Stethoscope,
  'Critical Care & Intensive Care': Activity,
};

export const MjpjayPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [info, setInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'procedures' | 'process' | 'documents' | 'register'>('procedures');
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    aadhaarLast4: '',
    rationCardNumber: '',
    diagnosisDescription: '',
    estimatedAmount: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/schemes/mjpjay/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => setInfo(null));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(apiUrl('/schemes/claims/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          schemeType: 'MJPJAY',
          patientAge: Number(formData.patientAge),
          estimatedAmount: Number(formData.estimatedAmount),
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'महाराष्ट्र शासन मान्यताप्राप्त मोफत आरोग्य योजना' : 'Government of Maharashtra Healthcare Scheme'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-heading">
          <span className="text-white drop-shadow-md">{isMr ? 'महात्मा ज्योतिराव फुले' : 'Mahatma Jyotirao Phule'}</span><br />
          <span className="text-[#FDE047] drop-shadow-md font-black">
            {isMr ? 'जन आरोग्य योजना (MJPJAY)' : 'Jan Arogya Yojana (MJPJAY)'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'महाराष्ट्रातील पिवळे व केशरी रेशन कार्डधारक कुटुंबांसाठी संजीवनी हॉस्पिटल, जालना येथे मोफत शस्त्रक्रिया व प्रगत उपचार उपलब्ध आहेत. आमचा समर्पित आरोग्य मित्र कक्ष आपणास तत्पर सहाय्य करतो.'
            : 'Providing completely cashless advanced surgical care and tertiary healthcare to eligible yellow and orange ration card families across Maharashtra at Sanjeevani Hospital, Jalna.'}
        </p>

        {/* Action Helpline & Scheme Details */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href="tel:+917507342222"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm sm:text-base font-black transition shadow-xl border-2 border-rose-400"
          >
            <Phone className="w-5 h-5 text-white" />
            <span>Arogya Mitra Helpline: +91-75073-42222</span>
          </a>

          <div className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white/20 border-2 border-amber-300/40 text-white text-xs sm:text-sm font-bold shadow-md">
            <span>Coverage: Up to ₹5,00,000 per family per year</span>
          </div>
        </div>

        {info?.schemeInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t-2 border-amber-300/30">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-xs text-amber-300 font-extrabold uppercase">Coverage Limit</p>
              <p className="font-black text-white text-lg mt-0.5">{info.schemeInfo.coverageLimit}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-xs text-amber-300 font-extrabold uppercase">Governing Authority</p>
              <p className="font-black text-white text-base mt-0.5">{info.schemeInfo.governingAuthority}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-xs text-amber-300 font-extrabold uppercase">Beneficiary Eligibility</p>
              <p className="font-black text-white text-base mt-0.5">{info.schemeInfo.eligibility}</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── SATURATED AMBER NOTICE CARD ────────────────────────────────────────── */}
      <div className="p-6 bg-gradient-to-r from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] border-3 border-[#F59E0B] rounded-3xl flex items-start gap-4 text-sm text-[#92400E] shadow-xl">
        <AlertCircle className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-base text-[#78350F]">
            {isMr ? 'शासकीय योजना मार्गदर्शक नियम' : 'Government Scheme Compliance Notice'}
          </p>
          <p className="leading-relaxed font-bold text-slate-900">
            {info?.schemeInfo?.disclaimer ||
              'Eligibility, coverage, and cashless treatment are subject to applicable government scheme rules and Arogya Mitra pre-authorization approval.'}
          </p>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST TAB SWITCHER ─────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-2 bg-white/80 p-2 rounded-2xl border-2 border-[#FDE68A] shadow-md">
        {([
          { key: 'procedures', label: isMr ? 'समाविष्ट शस्त्रक्रिया व उपचार' : 'Covered Procedures' },
          { key: 'process', label: isMr ? 'योजना प्रक्रिया पायऱ्या' : 'Step-by-Step Process' },
          { key: 'documents', label: isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required' },
          { key: 'register', label: isMr ? 'मदतीसाठी अर्ज करा' : 'Register Claim Assistance' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3.5 rounded-xl text-sm font-black whitespace-nowrap transition flex-1 ${
              activeTab === tab.key
                ? 'bg-[#002B5B] text-amber-300 shadow-md border-2 border-amber-400'
                : 'text-slate-800 hover:bg-[#FEF3C7] font-bold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: PROCEDURES ────────────────────────────────────────────────────── */}
      {activeTab === 'procedures' && info?.eligibleCategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {info.eligibleCategories.map((cat: any) => {
            const Icon = categoryIcons[cat.category] || Activity;
            return (
              <div
                key={cat.category}
                className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-7 shadow-xl space-y-4"
              >
                <div className="flex items-center gap-3.5 border-b-2 border-amber-200 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#002B5B] text-amber-300 flex items-center justify-center font-bold shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#002B5B] font-heading">{cat.category}</h3>
                </div>
                <ul className="space-y-2.5">
                  {cat.procedures.map((p: string) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-slate-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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
        <div className="space-y-5">
          {info.process.map((step: any) => (
            <div
              key={step.step}
              className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-6 sm:p-7 shadow-xl flex items-start gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#002B5B] text-amber-300 flex items-center justify-center font-black text-lg shrink-0 border-2 border-amber-400 shadow">
                {step.step}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#002B5B] font-heading">{step.title}</h3>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold">
                  {step.description}
                </p>
              </div>
            </div>
          ))}

          {/* Arogya Mitra Contact Box */}
          <div className="p-6 bg-[#002B5B] rounded-3xl text-white border-3 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-amber-300" />
              <div>
                <span className="text-xs font-bold text-amber-200 block">
                  Arogya Mitra Direct Desk (Sanjeevani Hospital Jalna)
                </span>
                <span className="text-xl font-black text-amber-300">+91-75073-42222</span>
              </div>
            </div>
            <span className="text-xs font-black bg-emerald-600 text-white px-4 py-2 rounded-xl border border-emerald-400">
              Mon–Sat: 09:00 AM – 06:00 PM
            </span>
          </div>
        </div>
      )}

      {/* ─── TAB: DOCUMENTS ─────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && info?.documentChecklist && (
        <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 sm:p-10 shadow-xl space-y-6">
          <div className="border-b-2 border-amber-200 pb-4">
            <h3 className="text-2xl font-black text-[#002B5B] font-heading">
              {isMr ? 'महात्मा फुले योजनेसाठी आवश्यक कागदपत्रे' : 'Documents Required for MJPJAY Admission'}
            </h3>
            <p className="text-sm text-slate-700 font-bold mt-1">
              {isMr
                ? 'कृपया रुग्णालयात दाखल होताना खालील मूळ कागदपत्रे सोबत ठेवावीत:'
                : 'Please bring the original physical copies of the following documents:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {info.documentChecklist.map((doc: any) => (
              <div
                key={doc.item}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-sm font-bold shadow-sm ${
                  doc.required
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-white border-amber-200 text-slate-900'
                }`}
              >
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                    doc.required ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {doc.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
                <span>{doc.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: REGISTER CLAIM ────────────────────────────────────────────────── */}
      {activeTab === 'register' && (
        <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 sm:p-10 shadow-xl">
          {submitted ? (
            <div className="text-center space-y-4 py-10">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                {isMr ? 'योजना सहाय्यता अर्ज नोंदवला गेला!' : 'MJPJAY Claim Registered!'}
              </h3>
              <p className="text-sm text-slate-700 max-w-md mx-auto font-bold">
                {isMr
                  ? 'आमचा आरोग्य मित्र प्रतिनिधी लवकरच आपल्याशी संपर्क करेल व कागदपत्रांची पडताळणी करेल.'
                  : 'Your request has been sent to our Arogya Mitra desk. They will contact you shortly to verify eligibility.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-3 rounded-xl text-sm font-black text-white bg-[#002B5B] hover:bg-slate-900 transition shadow-md"
              >
                {isMr ? 'दुसरा अर्ज नोंदवा' : 'Register Another Claim'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="border-b-2 border-amber-200 pb-4">
                <h3 className="text-2xl font-black text-[#002B5B] font-heading">
                  {isMr ? 'महात्मा फुले योजना सहाय्यता नोंदणी' : 'Register for MJPJAY Scheme Assistance'}
                </h3>
                <p className="text-sm text-slate-700 font-bold mt-1">
                  {isMr
                    ? 'आरोग्य मित्रांकडून त्वरित पडताळणीसाठी खालील माहिती भरा:'
                    : 'Fill this form to notify our hospital Arogya Mitra desk for direct assistance:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Patient Name *</label>
                  <input
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Ramesh Jadhav"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Patient Age *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={120}
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Aadhaar Last 4 Digits *</label>
                  <input
                    required
                    maxLength={4}
                    value={formData.aadhaarLast4}
                    onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                    placeholder="4567"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Ration Card Number (Yellow/Orange) *</label>
                  <input
                    required
                    value={formData.rationCardNumber}
                    onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
                    placeholder="MH/JLN/XXXXXXX"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Estimated Treatment Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedAmount}
                    onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">Diagnosis / Recommended Surgery *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.diagnosisDescription}
                  onChange={(e) => setFormData({ ...formData, diagnosisDescription: e.target.value })}
                  placeholder="Describe recommended surgical treatment or diagnosis..."
                  className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl text-sm font-semibold focus:border-[#002B5B] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#002B5B] to-[#007791] text-white font-black text-base shadow-xl hover:opacity-95 transition disabled:bg-slate-300 border-2 border-amber-400"
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
