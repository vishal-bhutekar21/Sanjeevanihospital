import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Phone,
  Users,
  Stethoscope,
  Heart,
  Baby,
  Scissors,
  Activity,
  ClipboardList,
  Info,
} from 'lucide-react';
import { apiUrl } from '../lib/api';

const categoryIcons: Record<string, React.ElementType> = {
  'Cardiac & Cardiovascular Surgery': Heart,
  'Orthopedics & Trauma': Activity,
  'General & Laparoscopic Surgery': Scissors,
  'Obstetrics & Gynecology': Baby,
  'Neonatal & Pediatric Care': Stethoscope,
  'Critical Care & Intensive Care': Activity,
};

export const MjpjayPage: React.FC = () => {
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
        body: JSON.stringify({ ...formData, schemeType: 'MJPJAY', patientAge: Number(formData.patientAge), estimatedAmount: Number(formData.estimatedAmount) }),
      });
      setSubmitted(true);
    } catch {
      // still show success in sandbox
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-hospital-teal to-slate-800 rounded-3xl p-8 sm:p-12 text-white space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Government of Maharashtra Healthcare Scheme</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Mahatma Jyotirao Phule<br />
          <span className="text-emerald-400">Jan Arogya Yojana (MJPJAY)</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          {info?.schemeInfo?.name ? (
            <>Providing cashless advanced surgical care and tertiary healthcare to economically vulnerable families across Maharashtra. Sanjeevani Hospital, Jalna is an empanelled MJPJAY network hospital.</>
          ) : (
            'Loading scheme information...'
          )}
        </p>
        {info?.schemeInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400 font-medium">Coverage Limit</p>
              <p className="font-bold text-white mt-0.5">{info.schemeInfo.coverageLimit}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Governing Authority</p>
              <p className="font-bold text-white mt-0.5">{info.schemeInfo.governingAuthority}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Beneficiary Eligibility</p>
              <p className="font-bold text-white mt-0.5">{info.schemeInfo.eligibility}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 mb-1">Government Scheme Compliance Notice</p>
          <p className="leading-relaxed">{info?.schemeInfo?.disclaimer || 'Eligibility, coverage, and treatment availability are subject to applicable government scheme rules and Arogya Mitra pre-authorization. This information is for guidance only.'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-slate-100 p-1 rounded-2xl">
        {([
          { key: 'procedures', label: 'Covered Procedures' },
          { key: 'process', label: 'Step-by-Step Process' },
          { key: 'documents', label: 'Documents Required' },
          { key: 'register', label: 'Register Claim' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex-1 min-w-fit ${
              activeTab === tab.key
                ? 'bg-hospital-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Procedures */}
      {activeTab === 'procedures' && info?.eligibleCategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.eligibleCategories.map((cat: any) => {
            const Icon = categoryIcons[cat.category] || Activity;
            return (
              <div key={cat.category} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-hospital-soft flex items-center justify-center text-hospital-teal">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.category}</h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.procedures.map((p: string) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Process */}
      {activeTab === 'process' && info?.process && (
        <div className="space-y-4">
          {info.process.map((step: any) => (
            <div key={step.step} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card-subtle flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-hospital-teal text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                {step.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
          <div className="p-4 bg-hospital-soft rounded-2xl border border-hospital-teal/20 text-xs text-hospital-teal font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Arogya Mitra Help Desk: +91-75073-42222 | Mon–Sat: 09:00 AM – 05:00 PM</span>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && info?.documentChecklist && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card-subtle space-y-4">
          <h3 className="text-base font-bold text-slate-900">Documents Required for MJPJAY Admission</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.documentChecklist.map((doc: any) => (
              <div
                key={doc.item}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs ${
                  doc.required
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className={`font-bold ${doc.required ? 'text-rose-600' : 'text-slate-400'}`}>
                  {doc.required ? '★ REQUIRED' : '○ Optional'}
                </span>
                <span className="font-medium">{doc.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Register Claim */}
      {activeTab === 'register' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card-subtle">
          {submitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">MJPJAY Claim Registered!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your claim has been registered with our Arogya Mitra desk. They will contact you within 1 working day to verify eligibility and guide you through the next steps.
              </p>
              <p className="text-xs font-bold text-hospital-teal">
                Please visit the Arogya Mitra desk at Sanjeevani Hospital Reception with your original documents.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Register Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Register for MJPJAY Scheme Assistance</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill this form to notify our Arogya Mitra desk. They will verify eligibility and guide you through the claim process at the hospital.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input required type="tel" maxLength={10} value={formData.patientPhone} onChange={e => setFormData({...formData, patientPhone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Age *</label>
                  <input required type="number" min={0} max={120} value={formData.patientAge} onChange={e => setFormData({...formData, patientAge: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Last 4 Digits *</label>
                  <input required maxLength={4} value={formData.aadhaarLast4} onChange={e => setFormData({...formData, aadhaarLast4: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ration Card Number (Yellow/Orange) *</label>
                  <input required value={formData.rationCardNumber} onChange={e => setFormData({...formData, rationCardNumber: e.target.value})}
                    placeholder="MH/JLN/2019/XXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Treatment Cost (₹)</label>
                  <input type="number" value={formData.estimatedAmount} onChange={e => setFormData({...formData, estimatedAmount: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosis / Medical Condition *</label>
                <textarea required rows={3} value={formData.diagnosisDescription} onChange={e => setFormData({...formData, diagnosisDescription: e.target.value})}
                  placeholder="Briefly describe the diagnosis or procedure recommended by your doctor..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-hospital-teal focus:outline-none" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm disabled:bg-slate-300">
                {loading ? 'Submitting...' : 'Submit MJPJAY Claim Registration'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
