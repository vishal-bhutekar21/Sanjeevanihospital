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
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

export const InsurancePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [info, setInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'process' | 'documents' | 'insurers'>('process');

  useEffect(() => {
    fetch(apiUrl('/schemes/insurance/info'))
      .then((r) => r.json())
      .then((d) => setInfo(d.data))
      .catch(() => setInfo(null));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B5B] via-[#003B73] to-[#0A4D68] rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl border-3 border-amber-400">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <CreditCard className="w-4 h-4 text-slate-950" />
          <span>{isMr ? 'कॅशलेस मेडिक्लेम व इन्शुरन्स सेवा' : 'Cashless Mediclaim & Insurance Services'}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
          {isMr ? 'कॅशलेस मेडिक्लेम आणि' : 'Cashless Mediclaim &'}<br />
          <span className="text-[#FDE047] font-black">
            {isMr ? 'इन्शुरन्स टीपीए (TPA) सहाय्यता कक्ष' : 'Insurance TPA Help Desk'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100 max-w-3xl leading-relaxed font-medium">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल भारतातील सर्व प्रमुख आरोग्य विमा कंपन्या आणि टीपीए भागीदारांशी संलग्न आहे. आमचा इन्शुरन्स डेस्क रुग्णांसाठी अखंड कॅशलेस पूर्व-मंजुरी व क्लेम सेटलमेंटची सुविधा देतो.'
            : 'Sanjeevani Multispeciality Hospital is empanelled with all major insurance companies and TPA partners across India. Our dedicated Insurance Desk coordinates seamless pre-authorization and claim settlement for insured patients.'}
        </p>

        {/* Action Helpline Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-3">
          <a
            href="tel:+917507342222"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm sm:text-base font-black transition shadow-xl border-2 border-rose-400"
          >
            <Phone className="w-5 h-5 text-white" />
            <span>Insurance Helpline: +91-75073-42222</span>
          </a>

          <div className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white/20 border-2 border-amber-300/40 text-white text-xs sm:text-sm font-bold shadow-md">
            <Clock className="w-5 h-5 text-amber-300" />
            <span>{info?.tpaDeskTimings || 'Mon–Sat: 09:00 AM – 06:00 PM | Emergency: 24x7'}</span>
          </div>
        </div>
      </div>

      {/* ─── SATURATED AMBER DISCLAIMER NOTICE ──────────────────────────────────── */}
      <div className="p-6 bg-gradient-to-r from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] border-3 border-[#F59E0B] rounded-3xl flex items-start gap-4 text-sm text-[#92400E] shadow-xl">
        <AlertCircle className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-base text-[#78350F]">
            {isMr ? 'विमा पॉलिसी मार्गदर्शक सूचना' : 'Insurance Policy & Approval Notice'}
          </p>
          <p className="leading-relaxed font-bold text-slate-900">
            {info?.disclaimer ||
              'Coverage eligibility and cashless pre-authorization approval are governed solely by your health insurance policy terms, exclusions, and respective insurer/TPA decisions.'}
          </p>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST TAB SWITCHER ─────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-2 bg-white/80 p-2 rounded-2xl border-2 border-[#FDE68A] shadow-md">
        {([
          { key: 'process', label: isMr ? 'कॅशलेस प्रक्रिया पायऱ्या' : 'Cashless Process' },
          { key: 'documents', label: isMr ? 'आवश्यक मूळ कागदपत्रे' : 'Documents Required' },
          { key: 'insurers', label: isMr ? 'संलग्न विमा कंपन्या व TPA' : 'Panel Insurers & TPA Partners' },
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

      {/* ─── TAB: PROCESS ───────────────────────────────────────────────────────── */}
      {activeTab === 'process' && info?.cashlessProcess && (
        <div className="space-y-5">
          {info.cashlessProcess.map((step: any) => (
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
        </div>
      )}

      {/* ─── TAB: DOCUMENTS ─────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && info?.documentsRequired && (
        <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 sm:p-10 shadow-xl space-y-6">
          <div className="border-b-2 border-amber-200 pb-4">
            <h3 className="text-2xl font-black text-[#002B5B] font-heading">
              {isMr ? 'कॅशलेस प्रवेशासाठी आवश्यक मूळ कागदपत्रे' : 'Documents to Bring for Cashless Admission'}
            </h3>
            <p className="text-sm text-slate-700 font-bold mt-1">
              {isMr
                ? 'हॉस्पिटलमध्ये दाखल होताना खालील मूळ कागदपत्रे इन्शुरन्स डेस्कवर सादर करावीत:'
                : 'Please carry the following original documents to our Insurance Desk upon admission:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {info.documentsRequired.map((doc: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-amber-200 text-sm text-slate-900 font-bold shadow-sm"
              >
                <FileText className="w-5 h-5 text-[#007791] shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: INSURERS & TPA PARTNERS ───────────────────────────────────────── */}
      {activeTab === 'insurers' && info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Panel Insurers */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 shadow-xl space-y-5">
            <h3 className="text-xl font-black text-[#002B5B] font-heading border-b-2 border-amber-200 pb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>{isMr ? 'संलग्न विमा कंपन्या' : 'Panel Insurance Companies'}</span>
            </h3>
            <ul className="space-y-3">
              {info.panelInsurers.map((ins: string) => (
                <li
                  key={ins}
                  className="flex items-center gap-3 text-sm text-slate-900 font-bold p-2.5 rounded-xl bg-white border border-amber-200 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TPA Partners */}
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9ED] to-[#FEF3C7] rounded-3xl border-3 border-[#FDE68A] p-8 shadow-xl space-y-5">
            <h3 className="text-xl font-black text-[#002B5B] font-heading border-b-2 border-amber-200 pb-3 flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-[#007791]" />
              <span>{isMr ? 'टीपीए (TPA) भागीदार' : 'Third Party Administrators (TPA)'}</span>
            </h3>
            <ul className="space-y-3">
              {info.tpaPartners.map((tpa: string) => (
                <li
                  key={tpa}
                  className="flex items-center gap-3 text-sm text-slate-900 font-bold p-2.5 rounded-xl bg-white border border-amber-200 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
                  <span>{tpa}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};
