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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="card-clean p-6 sm:p-10 bg-slate-900 text-white space-y-5">
        <div className="badge-teal text-xs">
          <CreditCard className="w-3.5 h-3.5" />
          <span>{isMr ? 'कॅशलेस मेडिक्लेम व इन्शुरन्स सेवा' : 'Cashless Mediclaim & Insurance Services'}</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-heading">
          {isMr ? 'कॅशलेस मेडिक्लेम आणि इन्शुरन्स टीपीए (TPA) कक्ष' : 'Cashless Mediclaim & Insurance TPA Help Desk'}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isMr
            ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल भारतातील सर्व प्रमुख आरोग्य विमा कंपन्या आणि टीपीए भागीदारांशी संलग्न आहे. आमचा इन्शुरन्स डेस्क रुग्णांसाठी अखंड कॅशलेस पूर्व-मंजुरी व क्लेम सेटलमेंटची सुविधा देतो.'
            : 'Sanjeevani Multispeciality Hospital is empanelled with all major insurance companies and TPA partners across India, coordinating seamless pre-authorization and claim settlement.'}
        </p>

        {/* Action Helpline Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <a
            href="tel:+917507342222"
            className="btn-emergency text-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Insurance Helpline: +91-75073-42222</span>
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>{info?.tpaDeskTimings || 'Mon–Sat: 09:00 AM – 06:00 PM | Emergency: 24x7'}</span>
          </div>
        </div>
      </div>

      {/* ─── NOTICE ───────────────────────────────────────────────────────────── */}
      <div className="card-clean p-4 sm:p-5 bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-900">
            {isMr ? 'विमा पॉलिसी मार्गदर्शक सूचना' : 'Insurance Policy & Approval Notice'}
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            {info?.disclaimer ||
              'Coverage eligibility and cashless pre-authorization approval are governed solely by your health insurance policy terms, exclusions, and respective insurer/TPA decisions.'}
          </p>
        </div>
      </div>

      {/* ─── TAB SWITCHER ─────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 p-1.5 rounded-lg max-w-md">
        {([
          { key: 'process', label: isMr ? 'कॅशलेस प्रक्रिया' : 'Cashless Process' },
          { key: 'documents', label: isMr ? 'आवश्यक कागदपत्रे' : 'Documents' },
          { key: 'insurers', label: isMr ? 'संलग्न विमा कंपन्या' : 'Panel Insurers & TPA' },
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

      {/* ─── TAB: PROCESS ───────────────────────────────────────────────────────── */}
      {activeTab === 'process' && info?.cashlessProcess && (
        <div className="space-y-4">
          {info.cashlessProcess.map((step: any) => (
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
        </div>
      )}

      {/* ─── TAB: DOCUMENTS ─────────────────────────────────────────────────────── */}
      {activeTab === 'documents' && info?.documentsRequired && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'कॅशलेस प्रवेशासाठी आवश्यक मूळ कागदपत्रे' : 'Documents to Bring for Cashless Admission'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMr
                ? 'हॉस्पिटलमध्ये दाखल होताना खालील मूळ कागदपत्रे इन्शुरन्स डेस्कवर सादर करावीत:'
                : 'Please carry original physical copies of the following documents to our Insurance Desk:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.documentsRequired.map((doc: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800"
              >
                <FileText className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: INSURERS & TPA PARTNERS ───────────────────────────────────────── */}
      {activeTab === 'insurers' && info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Panel Insurers */}
          <div className="card-clean p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
              <span>{isMr ? 'संलग्न विमा कंपन्या' : 'Panel Insurance Companies'}</span>
            </h3>
            <ul className="space-y-2.5">
              {info.panelInsurers.map((ins: string) => (
                <li
                  key={ins}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-2 rounded-md bg-slate-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TPA Partners */}
          <div className="card-clean p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F766E]" />
              <span>{isMr ? 'टीपीए (TPA) भागीदार' : 'Third Party Administrators (TPA)'}</span>
            </h3>
            <ul className="space-y-2.5">
              {info.tpaPartners.map((tpa: string) => (
                <li
                  key={tpa}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-2 rounded-md bg-slate-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
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
