import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Bell, CalendarDays, Download, FileText, LogOut, Pill, Phone } from 'lucide-react';
import { HOSPITAL } from '../config/hospital';
import { downloadBillPdf } from '../lib/appointmentPdf';
import {
  MedicineAlert,
  PatientBill,
  PatientMedicine,
  PatientRecord,
  PortalError,
  daysUntil,
  getPatientToken,
  medicineActive,
  medicineAlerts,
  notificationsSupported,
  notifyMedicineAlerts,
  portalCall,
  setPatientToken,
  todayKey,
} from '../lib/patientPortal';

const inputClass =
  'w-full px-3.5 py-3 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const PatientPortalPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const L = (en: string, mr: string) => (isMr ? mr : en);
  const [token, setToken] = useState<string | null>(getPatientToken());

  const signOut = () => {
    setPatientToken(null);
    setToken(null);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {token ? (
        <Portal token={token} isMr={isMr} L={L} onSignOut={signOut} />
      ) : (
        <SignIn
          isMr={isMr}
          L={L}
          onSignedIn={(t) => {
            setPatientToken(t);
            setToken(t);
          }}
        />
      )}
    </div>
  );
};

type LFn = (en: string, mr: string) => string;

// ─── Sign in ─────────────────────────────────────────────────────────────────

const SignIn: React.FC<{ isMr: boolean; L: LFn; onSignedIn: (token: string) => void }> = ({ L, onSignedIn }) => {
  const [phone, setPhone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendCode = async () => {
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(L('Please enter a valid 10-digit mobile number.', 'कृपया योग्य १० अंकी मोबाईल नंबर टाका.'));
      return;
    }
    setBusy(true);
    try {
      const data = await portalCall<{ sessionId: string; otpRequired?: boolean }>('/auth/send-otp', { phone });
      if (data.otpRequired === false) {
        setError(
          L(
            'Patient login needs an SMS code, which the hospital has not switched on yet. Please ask reception for your bills and medicine details.',
            'पेशंट लॉगिनसाठी एसएमएस कोड लागतो, जो हॉस्पिटलने अजून सुरू केलेला नाही. कृपया बिल व औषधांची माहिती रिसेप्शनकडून घ्या.',
          ),
        );
        return;
      }
      setSessionId(data.sessionId);
      setOtp('');
      setResendIn(30);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return sendCode();
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError(L('Enter the 6-digit code from the SMS.', 'एसएमएसमधील ६ अंकी कोड टाका.'));
      return;
    }
    setBusy(true);
    try {
      const v = await portalCall<{ token: string }>('/auth/verify-otp', { sessionId, otp });
      const s = await portalCall<{ token: string }>('/patient-portal/session', {}, v.token);
      onSignedIn(s.token);
    } catch (err: any) {
      setError(err.message);
      if (err instanceof PortalError && err.status === 401) setOtp('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl">{L('Patient login', 'पेशंट लॉगिन')}</h1>
      <p className="mt-2 text-stone-600">
        {L(
          'See your bills, your medicines with expiry reminders, and your appointments. Use the mobile number you gave the hospital.',
          'आपली बिले, औषधे (एक्सपायरी आठवणीसह) व अपॉइंटमेंट पहा. हॉस्पिटलला दिलेला मोबाईल नंबर वापरा.',
        )}
      </p>

      <form onSubmit={verify} noValidate className="mt-8 bg-white border border-[#E7E3DA] rounded-xl shadow-xs p-5 sm:p-7 space-y-5">
        {error && (
          <div role="alert" className="p-3.5 rounded-md bg-red-50 border border-red-200 text-red-800 flex gap-2.5 text-[15px]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <div>
          <label htmlFor="pp-phone" className="block font-medium mb-1.5">
            {L('Mobile number', 'मोबाईल नंबर')}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">+91</span>
              <input
                id="pp-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                disabled={!!sessionId}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`${inputClass} pl-12 disabled:bg-stone-100 disabled:text-stone-600`}
              />
            </div>
            {sessionId && (
              <button
                type="button"
                className="btn-secondary shrink-0"
                onClick={() => {
                  setSessionId('');
                  setOtp('');
                  setResendIn(0);
                }}
              >
                {L('Change', 'बदला')}
              </button>
            )}
          </div>
        </div>

        {sessionId && (
          <div>
            <label htmlFor="pp-otp" className="block font-medium mb-1.5">
              {L(`Enter the 6-digit code sent to +91 ${phone}`, `+91 ${phone} वर आलेला ६ अंकी कोड टाका`)}
            </label>
            <input
              id="pp-otp"
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`${inputClass} max-w-[220px] text-center text-xl tracking-[0.4em] font-semibold`}
            />
            <p className="mt-2 text-sm text-stone-600">
              {resendIn > 0 ? (
                L(`Didn’t get it? You can resend in ${resendIn}s`, `कोड आला नाही? ${resendIn} सेकंदांनी पुन्हा पाठवा`)
              ) : (
                <button type="button" onClick={sendCode} disabled={busy} className="font-semibold text-[#0F766E] underline underline-offset-4 py-2">
                  {L('Resend code', 'कोड पुन्हा पाठवा')}
                </button>
              )}
            </p>
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? L('Please wait…', 'कृपया थांबा…') : sessionId ? L('Sign in', 'लॉगिन करा') : L('Send code', 'कोड पाठवा')}
        </button>
      </form>

      <p className="mt-6 text-sm text-stone-600">
        {L('Need help? Call reception on', 'मदत हवी? रिसेप्शनला कॉल करा')}{' '}
        <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] underline underline-offset-4">
          {HOSPITAL.phones.reception.short}
        </a>
      </p>
    </div>
  );
};

// ─── Portal ──────────────────────────────────────────────────────────────────

type Tab = 'medicines' | 'bills' | 'appointments';

const Portal: React.FC<{ token: string; isMr: boolean; L: LFn; onSignOut: () => void }> = ({ token, isMr, L, onSignOut }) => {
  const [data, setData] = useState<PatientRecord | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('medicines');
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>(
    notificationsSupported() ? Notification.permission : 'unsupported',
  );

  const load = async () => {
    setState('loading');
    try {
      const d = await portalCall<PatientRecord>('/patient-portal/me', undefined, token);
      setData(d);
      setState('ready');
    } catch (e: any) {
      if (e instanceof PortalError && e.status === 401) return onSignOut();
      setError(e.message);
      setState('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const alerts = useMemo(() => medicineAlerts(data?.medicines || []), [data]);

  const alertText = (a: MedicineAlert) => {
    const name = [a.med.name, a.med.strength].filter(Boolean).join(' ');
    if (a.kind === 'expired')
      return { title: L(`${name} has expired`, `${name} ची मुदत संपली`), body: L('Do not take it. Ask the hospital pharmacy for a new pack.', 'हे घेऊ नका. हॉस्पिटल फार्मसीकडून नवीन पाकीट घ्या.') };
    if (a.kind === 'expiring')
      return {
        title: a.days === 0 ? L(`${name} expires today`, `${name} ची मुदत आज संपते`) : L(`${name} expires in ${a.days} days`, `${name} ची मुदत ${a.days} दिवसांत संपते`),
        body: L('Plan a refill before it expires.', 'मुदत संपण्यापूर्वी नवीन औषध घ्या.'),
      };
    return {
      title: a.days === 0 ? L(`Last day of ${name}`, `${name} चा आज शेवटचा दिवस`) : L(`${name}: ${a.days} days left`, `${name}: ${a.days} दिवस बाकी`),
      body: L('Book a follow-up if your doctor asked you to.', 'डॉक्टरांनी सांगितले असल्यास पुढील भेट बुक करा.'),
    };
  };

  useEffect(() => {
    if (alerts.length) notifyMedicineAlerts(alerts, alertText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts, perm]);

  const turnOnAlerts = async () => {
    if (!notificationsSupported()) return;
    setPerm(await Notification.requestPermission());
  };

  if (state === 'loading' && !data) {
    return (
      <div aria-busy="true" className="space-y-4">
        <div className="h-10 w-64 rounded bg-stone-200/70 animate-pulse" />
        <div className="h-32 rounded-xl bg-stone-200/60 animate-pulse" />
        <div className="h-32 rounded-xl bg-stone-200/60 animate-pulse" />
      </div>
    );
  }

  if (state === 'error' && !data) {
    return (
      <div className="max-w-md mx-auto card-clean p-6">
        <p className="font-semibold">{L('Could not load your records.', 'आपली माहिती लोड झाली नाही.')}</p>
        <p className="mt-1 text-stone-600">{error}</p>
        <div className="mt-4 flex gap-3">
          <button type="button" className="btn-primary" onClick={load}>
            {L('Try again', 'पुन्हा प्रयत्न करा')}
          </button>
          <button type="button" className="btn-secondary" onClick={onSignOut}>
            {L('Sign out', 'लॉगआउट')}
          </button>
        </div>
      </div>
    );
  }

  const d = data!;
  const due = d.bills.reduce((s, b) => s + Math.max(0, b.total - b.paid), 0);
  const tabs: { key: Tab; label: string; count: number; icon: React.ElementType }[] = [
    { key: 'medicines', label: L('Medicines', 'औषधे'), count: d.medicines.length, icon: Pill },
    { key: 'bills', label: L('Bills', 'बिले'), count: d.bills.length, icon: FileText },
    { key: 'appointments', label: L('Visits', 'भेटी'), count: d.appointments?.length || 0, icon: CalendarDays },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl">{d.name ? L(`Hello, ${d.name}`, `नमस्कार, ${d.name}`) : L('Your health records', 'आपली आरोग्य माहिती')}</h1>
          <p className="mt-1 text-stone-600">+91 {d.phone}</p>
        </div>
        <button type="button" onClick={onSignOut} className="btn-secondary">
          <LogOut className="w-4 h-4" /> {L('Sign out', 'लॉगआउट')}
        </button>
      </header>

      {/* Summary */}
      <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          [L('Medicines now', 'चालू औषधे'), String(d.medicines.filter((m) => medicineActive(m)).length)],
          [L('Amount due', 'बाकी रक्कम'), rupees(due)],
          [L('Alerts', 'सूचना'), String(alerts.length)],
        ].map(([k, v]) => (
          <div key={k} className="bg-white border border-[#E7E3DA] rounded-xl p-3 sm:p-4">
            <dt className="text-xs sm:text-sm text-stone-500">{k}</dt>
            <dd className="mt-1 text-xl sm:text-2xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="mt-6 bg-white border border-amber-200 rounded-xl p-4 sm:p-5" aria-label={L('Medicine alerts', 'औषध सूचना')}>
          <h2 className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-700" /> {L('Needs your attention', 'लक्ष द्या')}
          </h2>
          <ul className="mt-3 divide-y divide-[#E7E3DA]">
            {alerts.map((a) => {
              const t = alertText(a);
              return (
                <li key={`${a.med.id}-${a.kind}`} className="py-2.5">
                  <p className={`font-semibold ${a.kind === 'expired' ? 'text-red-700' : 'text-amber-800'}`}>{t.title}</p>
                  <p className="text-sm text-stone-600">{t.body}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {perm === 'default' && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#E8F3F1] text-[#0B5D57] rounded-xl p-4 text-[15px]">
          <p>{L('Get a phone notification when a medicine is about to expire or a course is ending.', 'औषधाची मुदत संपत आल्यावर किंवा कोर्स संपताना फोनवर सूचना मिळवा.')}</p>
          <button type="button" className="btn-primary shrink-0" onClick={turnOnAlerts}>
            <Bell className="w-4 h-4" /> {L('Turn on reminders', 'आठवण सुरू करा')}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 grid grid-cols-3 rounded-lg border border-[#D8D3C8] bg-white p-1" role="tablist" aria-label={L('Your records', 'आपली माहिती')}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-[44px] rounded-md text-sm sm:text-[15px] flex items-center justify-center gap-1.5 ${
              tab === t.key ? 'bg-[#0F766E] text-white font-semibold' : 'text-stone-700 hover:text-[#1C2321]'
            }`}
          >
            <t.icon className="w-4 h-4 hidden sm:block" />
            {t.label} <span className={tab === t.key ? 'text-teal-100' : 'text-stone-400'}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-5" role="tabpanel">
        {tab === 'medicines' && <Medicines meds={d.medicines} isMr={isMr} L={L} />}
        {tab === 'bills' && <Bills bills={d.bills} name={d.name} phone={d.phone} isMr={isMr} L={L} />}
        {tab === 'appointments' && (
          <Visits list={d.appointments || []} isMr={isMr} L={L} />
        )}
      </div>

      <p className="mt-10 text-sm text-stone-600 flex items-center gap-2">
        <Phone className="w-4 h-4" />
        {L('Something missing or wrong? Call', 'काही चुकले किंवा कमी आहे? कॉल करा')}{' '}
        <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] underline underline-offset-4">
          {HOSPITAL.phones.reception.short}
        </a>
      </p>
    </div>
  );
};

const dateText = (key: string, isMr: boolean) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** "1-0-1" → "Morning 1 · Afternoon 0 · Night 1" */
const dosageText = (dosage: string, L: LFn) => {
  const m = dosage.match(/^\s*(\d+(?:\.\d+)?|½)\s*-\s*(\d+(?:\.\d+)?|½)\s*-\s*(\d+(?:\.\d+)?|½)\s*$/);
  if (!m) return dosage;
  return `${L('Morning', 'सकाळ')} ${m[1]} · ${L('Afternoon', 'दुपार')} ${m[2]} · ${L('Night', 'रात्र')} ${m[3]}`;
};

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <p className="bg-white border border-[#E7E3DA] rounded-xl p-6 text-center text-stone-600">{text}</p>
);

const Medicines: React.FC<{ meds: PatientMedicine[]; isMr: boolean; L: LFn }> = ({ meds, isMr, L }) => {
  const today = todayKey();
  const current = meds.filter((m) => medicineActive(m, today));
  const past = meds.filter((m) => !medicineActive(m, today));
  if (meds.length === 0) return <Empty text={L('No medicines shared by the hospital yet.', 'हॉस्पिटलने अजून कोणतीही औषधे शेअर केलेली नाहीत.')} />;

  const card = (m: PatientMedicine) => {
    const exp = m.expiryDate ? daysUntil(m.expiryDate, today) : null;
    return (
      <li key={m.id} className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-lg leading-tight">
              {m.name} {m.strength && <span className="text-stone-500 font-sans text-base">{m.strength}</span>}
            </p>
            {m.dosage && <p className="mt-1 font-medium">{dosageText(m.dosage, L)}</p>}
            {m.instructions && <p className="text-sm text-stone-600">{m.instructions}</p>}
          </div>
          <Pill className="w-5 h-5 text-[#0F766E] shrink-0" />
        </div>
        <dl className="mt-3 pt-3 border-t border-[#E7E3DA] grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-stone-500">{L('Course', 'कोर्स')}</dt>
            <dd>
              {dateText(m.startDate, isMr)} – {m.endDate ? dateText(m.endDate, isMr) : L('ongoing', 'चालू')}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">{L('Pack expiry', 'पाकिटाची मुदत')}</dt>
            <dd className={exp === null ? '' : exp < 0 ? 'text-red-700 font-semibold' : exp <= 30 ? 'text-amber-800 font-semibold' : ''}>
              {m.expiryDate ? dateText(m.expiryDate, isMr) : L('Not recorded', 'नोंद नाही')}
              {exp !== null && exp < 0 && ` · ${L('expired', 'मुदत संपली')}`}
            </dd>
          </div>
          {m.quantity > 0 && (
            <div>
              <dt className="text-stone-500">{L('Quantity', 'संख्या')}</dt>
              <dd>{m.quantity}</dd>
            </div>
          )}
          {m.doctorName && (
            <div>
              <dt className="text-stone-500">{L('Prescribed by', 'डॉक्टर')}</dt>
              <dd>{m.doctorName}</dd>
            </div>
          )}
        </dl>
        {m.note && <p className="mt-3 text-sm text-stone-700">{m.note}</p>}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {current.length > 0 && <ul className="grid sm:grid-cols-2 gap-3">{current.map(card)}</ul>}
      {past.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer py-2 font-semibold text-stone-700">
            {L(`Finished courses (${past.length})`, `संपलेले कोर्स (${past.length})`)}
          </summary>
          <ul className="mt-3 grid sm:grid-cols-2 gap-3 opacity-80">{past.map(card)}</ul>
        </details>
      )}
    </div>
  );
};

const Bills: React.FC<{ bills: PatientBill[]; name: string; phone: string; isMr: boolean; L: LFn }> = ({ bills, name, phone, isMr, L }) => {
  const [failed, setFailed] = useState('');
  if (bills.length === 0) return <Empty text={L('No bills shared by the hospital yet.', 'हॉस्पिटलने अजून कोणतेही बिल शेअर केलेले नाही.')} />;
  return (
    <ul className="space-y-3">
      {bills.map((b) => {
        const due = Math.max(0, b.total - b.paid);
        return (
          <li key={b.id} className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-lg leading-tight">{b.title}</p>
                <p className="text-sm text-stone-500">
                  {b.billNo} · {dateText(b.date, isMr)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">{rupees(b.total)}</p>
                <p className={`text-sm font-medium ${due > 0 ? 'text-amber-800' : 'text-[#0B5D57]'}`}>
                  {due > 0 ? L(`${rupees(due)} due`, `${rupees(due)} बाकी`) : L('Paid', 'भरले')}
                </p>
              </div>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-[#0F766E] py-1">
                {L(`${b.items.length} item${b.items.length === 1 ? '' : 's'}`, `${b.items.length} नोंदी`)}
              </summary>
              <table className="mt-2 w-full text-sm">
                <tbody className="divide-y divide-[#E7E3DA]">
                  {b.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-1.5 pr-3">{it.name}</td>
                      <td className="py-1.5 pr-3 text-stone-500 text-right whitespace-nowrap">× {it.qty}</td>
                      <td className="py-1.5 text-right whitespace-nowrap">{rupees(it.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {b.note && <p className="mt-2 text-sm text-stone-600">{b.note}</p>}
            </details>
            <button
              type="button"
              className="mt-3 btn-secondary"
              onClick={() =>
                downloadBillPdf({ ...b, patientName: name, patientPhone: `+91 ${phone}` }).catch(() =>
                  setFailed(b.id),
                )
              }
            >
              <Download className="w-4 h-4" /> {L('Download bill (PDF)', 'बिल डाउनलोड करा (PDF)')}
            </button>
            {failed === b.id && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {L('Could not create the PDF. Please try again.', 'PDF तयार झाली नाही. पुन्हा प्रयत्न करा.')}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Visits: React.FC<{ list: NonNullable<PatientRecord['appointments']>; isMr: boolean; L: LFn }> = ({ list, isMr, L }) => {
  const statusText: Record<string, string> = {
    CONFIRMED: L('Booked', 'बुक'),
    IN_CONSULTATION: L('With the doctor', 'डॉक्टरांकडे'),
    COMPLETED: L('Completed', 'पूर्ण'),
    CANCELLED: L('Cancelled', 'रद्द'),
    NO_SHOW: L('Missed', 'आले नाही'),
  };
  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <Empty text={L('No online bookings on this number yet.', 'या नंबरवर अजून ऑनलाइन बुकिंग नाही.')} />
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.appointmentCode} className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5 flex flex-wrap justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-lg leading-tight">{a.doctorName}</p>
                <p className="text-sm text-stone-600">{a.department}</p>
                <p className="mt-1 text-sm">
                  {dateText(a.appointmentDate, isMr)}, {a.startTime.replace(/^0/, '')} · <span className="font-mono">{a.appointmentCode}</span>
                </p>
              </div>
              <p className="text-sm font-medium text-stone-700">{statusText[a.status] || a.status}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to="/book" className="btn-primary">
        <CalendarDays className="w-4 h-4" /> {L('Book a visit', 'भेट बुक करा')}
      </Link>
    </div>
  );
};
