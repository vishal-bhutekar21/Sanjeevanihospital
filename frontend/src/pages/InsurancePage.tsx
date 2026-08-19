import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Phone,
  AlertCircle,
  Building2,
  FileText,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { apiUrl } from '../lib/api';

export const InsurancePage: React.FC = () => {
  const [info, setInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'process' | 'documents' | 'insurers'>('process');

  useEffect(() => {
    fetch(apiUrl('/schemes/insurance/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => setInfo(null));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-hospital-teal rounded-3xl p-8 sm:p-12 text-white space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Cashless Mediclaim & Insurance Services</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Cashless Mediclaim &<br />
          <span className="text-emerald-400">Insurance TPA Desk</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Sanjeevani Multispeciality Hospital is empanelled with all major insurance companies and TPA partners across India. Our dedicated Insurance Desk coordinates seamless pre-authorization and claim settlement for insured patients.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a href="tel:+917507342222"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow">
            <Phone className="w-4 h-4" />
            <span>Insurance Helpline: +91-75073-42222</span>
          </a>
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{info?.tpaDeskTimings || 'Mon–Sat: 09:00 AM – 06:00 PM | Emergency: 24x7'}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-0.5">Insurance Policy Disclaimer</p>
          <p className="leading-relaxed">{info?.disclaimer || 'Coverage eligibility and claim approval are governed solely by your health insurance policy terms and insurer/TPA decisions.'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-slate-100 p-1 rounded-2xl">
        {([
          { key: 'process', label: 'Cashless Process' },
          { key: 'documents', label: 'Documents Required' },
          { key: 'insurers', label: 'Panel Insurers & TPA Partners' },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex-1 ${
              activeTab === tab.key ? 'bg-hospital-teal text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Process */}
      {activeTab === 'process' && info?.cashlessProcess && (
        <div className="space-y-4">
          {info.cashlessProcess.map((step: any) => (
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
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && info?.documentsRequired && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card-subtle space-y-4">
          <h3 className="text-base font-bold text-slate-900">Documents to Bring for Cashless Admission</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.documentsRequired.map((doc: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <FileText className="w-4 h-4 text-hospital-teal shrink-0 mt-0.5" />
                <span className="font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Insurers */}
      {activeTab === 'insurers' && info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-hospital-teal" />
              Panel Insurance Companies
            </h3>
            <ul className="space-y-2">
              {info.panelInsurers.map((ins: string) => (
                <li key={ins} className="flex items-center gap-2 text-xs text-slate-700 font-medium py-1.5 border-b border-slate-50 last:border-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {ins}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-hospital-teal" />
              TPA Partners
            </h3>
            <ul className="space-y-2">
              {info.tpaPartners.map((tpa: string) => (
                <li key={tpa} className="flex items-center gap-2 text-xs text-slate-700 font-medium py-1.5 border-b border-slate-50 last:border-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-hospital-cyan shrink-0" />
                  {tpa}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
