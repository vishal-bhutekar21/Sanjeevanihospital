import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Bell, CalendarDays, Download, FileText, FlaskConical, Home, LogOut, Pill, Phone, UserRound } from 'lucide-react';
import { apiUrl } from '../lib/api';
import { DOCTORS_DATA } from '../data/doctorsData';
import { HOSPITAL } from '../config/hospital';
import { downloadBillPdf, downloadMedicineListPdf } from '../lib/appointmentPdf';
import {
  DOSE_TIMES,
  LabResult,
  loadDoseTicks,
  notifyOncePerDay,
  parseDosage,
  saveDoseTicks,
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

type Tab = 'overview' | 'medicines' | 'bills' | 'reports' | 'visits' | 'profile';

const Portal: React.FC<{ token: string; isMr: boolean; L: LFn; onSignOut: () => void }> = ({ token, isMr, L, onSignOut }) => {
  const [data, setData] = useState<PatientRecord | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
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

  const followDays = data?.followUp?.date ? daysUntil(data.followUp.date) : null;

  useEffect(() => {
    const notices = alerts.map((a) => ({ key: `${a.med.id}:${a.kind}`, ...alertText(a) }));
    if (data?.followUp && followDays !== null && followDays >= 0 && followDays <= 2) {
      notices.push({
        key: `follow-up:${data.followUp.date}`,
        title: followDays === 0 ? L('Your follow-up visit is today', 'आपली पुढील भेट आज आहे') : L(`Follow-up visit in ${followDays} day${followDays === 1 ? '' : 's'}`, `पुढील भेट ${followDays} दिवसांत`),
        body: data.followUp.doctorName || HOSPITAL.shortName,
      });
    }
    notifyOncePerDay(notices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts, perm, data?.followUp?.date]);

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
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: L('Today', 'आज'), icon: Home },
    { key: 'medicines', label: L('Medicines', 'औषधे'), icon: Pill },
    { key: 'bills', label: L('Bills', 'बिले'), icon: FileText },
    { key: 'reports', label: L('Reports', 'रिपोर्ट'), icon: FlaskConical },
    { key: 'visits', label: L('Visits', 'भेटी'), icon: CalendarDays },
    { key: 'profile', label: L('Profile', 'प्रोफाइल'), icon: UserRound },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl">{d.name ? L(`Hello, ${d.name}`, `नमस्कार, ${d.name}`) : L('Your health records', 'आपली आरोग्य माहिती')}</h1>
          <p className="mt-1 text-stone-600">
            +91 {d.phone}
            {d.profile?.bloodGroup && ` · ${L('Blood group', 'रक्तगट')} ${d.profile.bloodGroup}`}
          </p>
        </div>
        <button type="button" onClick={onSignOut} className="btn-secondary">
          <LogOut className="w-4 h-4" /> {L('Sign out', 'लॉगआउट')}
        </button>
      </header>

      {/* Summary */}
      <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          [L('Medicines now', 'चालू औषधे'), String(d.medicines.filter((m) => medicineActive(m)).length), 'medicines'],
          [L('Amount due', 'बाकी रक्कम'), rupees(due), 'bills'],
          [L('Alerts', 'सूचना'), String(alerts.length), 'overview'],
        ].map(([k, v, t]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(t as Tab)}
            className="text-left bg-white border border-[#E7E3DA] rounded-xl p-3 sm:p-4 hover:border-[#0F766E]"
          >
            <dt className="text-xs sm:text-sm text-stone-500">{k}</dt>
            <dd className={`mt-1 text-xl sm:text-2xl font-semibold ${t === 'bills' && due > 0 ? 'text-amber-800' : ''}`}>{v}</dd>
          </button>
        ))}
      </dl>

      {perm === 'default' && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#E8F3F1] text-[#0B5D57] rounded-xl p-4 text-[15px]">
          <p>{L('Get a phone notification when a medicine is about to expire, a course is ending or a follow-up visit is near.', 'औषधाची मुदत संपत आल्यावर, कोर्स संपताना किंवा पुढील भेट जवळ आल्यावर फोनवर सूचना मिळवा.')}</p>
          <button type="button" className="btn-primary shrink-0" onClick={turnOnAlerts}>
            <Bell className="w-4 h-4" /> {L('Turn on reminders', 'आठवण सुरू करा')}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
        <div className="inline-flex min-w-full gap-1 rounded-lg border border-[#D8D3C8] bg-white p-1" role="tablist" aria-label={L('Your records', 'आपली माहिती')}>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 shrink-0 min-h-[44px] px-3.5 rounded-md text-sm sm:text-[15px] flex items-center justify-center gap-1.5 whitespace-nowrap ${
                tab === t.key ? 'bg-[#0F766E] text-white font-semibold' : 'text-stone-700 hover:text-[#1C2321]'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5" role="tabpanel">
        {tab === 'overview' && (
          <Overview d={d} alerts={alerts} alertText={alertText} isMr={isMr} L={L} onOpen={setTab} />
        )}
        {tab === 'medicines' && <Medicines meds={d.medicines} name={d.name} phone={d.phone} isMr={isMr} L={L} />}
        {tab === 'bills' && <Bills bills={d.bills} name={d.name} phone={d.phone} isMr={isMr} L={L} />}
        {tab === 'reports' && <Reports list={d.labResults || []} isMr={isMr} L={L} />}
        {tab === 'visits' && <Visits list={d.appointments || []} followUp={d.followUp || null} isMr={isMr} L={L} />}
        {tab === 'profile' && <Profile d={d} token={token} L={L} onSaved={(r) => setData((x) => (x ? { ...x, ...r } : r))} />}
      </div>

      <p className="mt-10 text-sm text-stone-600 flex items-center gap-2">
        <Phone className="w-4 h-4 shrink-0" />
        <span>
          {L('Something missing or wrong? Call', 'काही चुकले किंवा कमी आहे? कॉल करा')}{' '}
          <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] underline underline-offset-4">
            {HOSPITAL.phones.reception.short}
          </a>
        </span>
      </p>
    </div>
  );
};

// ─── Today (overview) ────────────────────────────────────────────────────────

const bookLink = (doctorId: string, date?: string) => {
  const p = new URLSearchParams();
  if (doctorId && DOCTORS_DATA.some((x) => x.id === doctorId)) p.set('doctorId', doctorId);
  if (date && date >= todayKey()) p.set('date', date);
  const q = p.toString();
  return `/book${q ? `?${q}` : ''}`;
};

const Overview: React.FC<{
  d: PatientRecord;
  alerts: MedicineAlert[];
  alertText: (a: MedicineAlert) => { title: string; body: string };
  isMr: boolean;
  L: LFn;
  onOpen: (t: Tab) => void;
}> = ({ d, alerts, alertText, isMr, L, onOpen }) => {
  const today = todayKey();
  const [ticks, setTicks] = useState<Record<string, boolean>>(() => loadDoseTicks(today));
  const toggle = (key: string) =>
    setTicks((t) => {
      const next = { ...t, [key]: !t[key] };
      saveDoseTicks(next, today);
      return next;
    });

  const doses = DOSE_TIMES.map((time) => ({
    time,
    label: time === 'morning' ? L('Morning', 'सकाळ') : time === 'afternoon' ? L('Afternoon', 'दुपार') : L('Night', 'रात्र'),
    items: d.medicines
      .filter((m) => medicineActive(m, today) && m.startDate <= today)
      .map((m) => ({ m, qty: parseDosage(m.dosage)?.[time] || '' }))
      .filter((x) => x.qty),
  })).filter((g) => g.items.length > 0);
  const total = doses.reduce((s, g) => s + g.items.length, 0);
  const done = doses.reduce((s, g) => s + g.items.filter((x) => ticks[`${x.m.id}:${g.time}`]).length, 0);

  const upcoming = (d.appointments || [])
    .filter((a) => a.appointmentDate >= today && a.status === 'CONFIRMED')
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))[0];
  const fu = d.followUp;
  const fuDays = fu ? daysUntil(fu.date, today) : null;

  const nothing = !fu && !upcoming && total === 0 && alerts.length === 0;

  return (
    <div className="space-y-4">
      {nothing && (
        <Empty text={L('Nothing for today. Medicines, bills and reports from the hospital will appear here.', 'आज काही नाही. हॉस्पिटलकडून आलेली औषधे, बिले व रिपोर्ट येथे दिसतील.')} />
      )}

      {fu && fuDays !== null && (
        <section className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5">
          <p className="text-sm text-stone-500">{L('Next visit your doctor asked for', 'डॉक्टरांनी सांगितलेली पुढील भेट')}</p>
          <p className="mt-1 font-heading text-xl">
            {dateText(fu.date, isMr)}
            <span className={`ml-2 text-base font-sans font-medium ${fuDays < 0 ? 'text-red-700' : fuDays <= 2 ? 'text-amber-800' : 'text-[#0F766E]'}`}>
              {fuDays < 0
                ? L(`${-fuDays} days overdue`, `${-fuDays} दिवस उशीर`)
                : fuDays === 0
                ? L('today', 'आज')
                : L(`in ${fuDays} day${fuDays === 1 ? '' : 's'}`, `${fuDays} दिवसांत`)}
            </span>
          </p>
          {fu.doctorName && <p className="text-stone-700">{fu.doctorName}</p>}
          {fu.note && <p className="mt-1 text-sm text-stone-600">{fu.note}</p>}
          <Link to={bookLink(fu.doctorId, fu.date)} className="btn-primary mt-4">
            <CalendarDays className="w-4 h-4" /> {L('Book this visit', 'ही भेट बुक करा')}
          </Link>
        </section>
      )}

      {upcoming && (
        <section className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-stone-500">{L('Upcoming appointment', 'पुढील अपॉइंटमेंट')}</p>
            <p className="mt-1 font-heading text-lg leading-tight">{upcoming.doctorName}</p>
            <p className="text-stone-700">
              {dateText(upcoming.appointmentDate, isMr)}, {upcoming.startTime.replace(/^0/, '')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500">{L('Token', 'टोकन')}</p>
            <p className="font-mono font-semibold">{upcoming.appointmentCode}</p>
          </div>
        </section>
      )}

      {total > 0 && (
        <section className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg">{L('Today’s medicines', 'आजची औषधे')}</h2>
            <p className={`text-sm font-medium ${done === total ? 'text-[#0F766E]' : 'text-stone-600'}`}>
              {L(`${done} of ${total} taken`, `${total} पैकी ${done} घेतली`)}
            </p>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-stone-100 overflow-hidden" aria-hidden="true">
            <div className="h-full bg-[#0F766E] transition-all" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          {doses.map((g) => (
            <div key={g.time} className="mt-4">
              <p className="text-sm text-stone-500 mb-1.5">{g.label}</p>
              <ul className="space-y-1.5">
                {g.items.map(({ m, qty }) => {
                  const key = `${m.id}:${g.time}`;
                  const on = !!ticks[key];
                  return (
                    <li key={key}>
                      <label className={`flex items-center gap-3 min-h-[48px] px-3 rounded-lg border cursor-pointer ${on ? 'bg-[#E8F3F1] border-[#BFE3DD]' : 'bg-white border-[#E7E3DA]'}`}>
                        <input type="checkbox" checked={on} onChange={() => toggle(key)} className="w-5 h-5 accent-[#0F766E] shrink-0" />
                        <span className={`flex-1 min-w-0 ${on ? 'text-stone-500 line-through' : ''}`}>
                          {m.name} {m.strength}
                          <span className="text-stone-500"> · {qty === '1' ? L('1 tablet', '१ गोळी') : L(`${qty} tablets`, `${qty} गोळ्या`)}</span>
                          {m.instructions && <span className="block text-sm text-stone-500 no-underline">{m.instructions}</span>}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="mt-3 text-xs text-stone-500">{L('Ticks are saved on this phone only.', 'खुणा फक्त या फोनवर जतन होतात.')}</p>
        </section>
      )}

      {alerts.length > 0 && (
        <section className="bg-white border border-amber-200 rounded-xl p-4 sm:p-5" aria-label={L('Medicine alerts', 'औषध सूचना')}>
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

      {(d.labResults || []).length > 0 && (
        <button type="button" onClick={() => onOpen('reports')} className="w-full text-left bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-5 hover:border-[#0F766E]">
          <p className="text-sm text-stone-500">{L('Latest report', 'नवीन रिपोर्ट')}</p>
          <p className="mt-1 font-medium">
            {d.labResults![0].test}:{' '}
            <span className={d.labResults![0].flag === 'HIGH' ? 'text-red-700' : d.labResults![0].flag === 'LOW' ? 'text-amber-800' : ''}>
              {d.labResults![0].value} {d.labResults![0].unit}
              {d.labResults![0].flag === 'HIGH' ? ` (${L('high', 'जास्त')})` : d.labResults![0].flag === 'LOW' ? ` (${L('low', 'कमी')})` : ''}
            </span>
            <span className="text-stone-500"> · {dateText(d.labResults![0].date, isMr)}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0F766E]">{L('See all reports →', 'सर्व रिपोर्ट पहा →')}</p>
        </button>
      )}
    </div>
  );
};

// ─── Reports ─────────────────────────────────────────────────────────────────

const Reports: React.FC<{ list: LabResult[]; isMr: boolean; L: LFn }> = ({ list, isMr, L }) => {
  if (list.length === 0) return <Empty text={L('No test results shared by the hospital yet.', 'हॉस्पिटलने अजून कोणतेही रिपोर्ट शेअर केलेले नाहीत.')} />;
  const byDate = list.reduce<Record<string, LabResult[]>>((acc, r) => {
    (acc[r.date] = acc[r.date] || []).push(r);
    return acc;
  }, {});
  return (
    <div className="space-y-4">
      {Object.keys(byDate)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => (
          <section key={date} className="bg-white border border-[#E7E3DA] rounded-xl overflow-hidden">
            <h2 className="px-4 sm:px-5 py-3 bg-[#FAF8F4] border-b border-[#E7E3DA] text-base font-semibold font-sans">{dateText(date, isMr)}</h2>
            <ul className="divide-y divide-[#E7E3DA]">
              {byDate[date].map((r) => (
                <li key={r.id} className="px-4 sm:px-5 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{r.test}</p>
                    {r.range && <p className="text-sm text-stone-500">{L(`Normal: ${r.range}`, `सामान्य: ${r.range}`)} {r.unit}</p>}
                    {r.note && <p className="text-sm text-stone-600 mt-0.5">{r.note}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-semibold ${r.flag === 'HIGH' ? 'text-red-700' : r.flag === 'LOW' ? 'text-amber-800' : ''}`}>
                      {r.value} <span className="text-sm font-normal text-stone-500">{r.unit}</span>
                    </p>
                    {r.flag && (
                      <p className={`text-sm ${r.flag === 'HIGH' ? 'text-red-700' : r.flag === 'LOW' ? 'text-amber-800' : 'text-[#0B5D57]'}`}>
                        {r.flag === 'HIGH' ? L('High', 'जास्त') : r.flag === 'LOW' ? L('Low', 'कमी') : L('Normal', 'सामान्य')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      <p className="text-sm text-stone-500">{L('Please discuss your results with your doctor.', 'कृपया रिपोर्टबद्दल आपल्या डॉक्टरांशी बोला.')}</p>
    </div>
  );
};

// ─── Profile ─────────────────────────────────────────────────────────────────

const Profile: React.FC<{ d: PatientRecord; token: string; L: LFn; onSaved: (r: PatientRecord) => void }> = ({ d, token, L, onSaved }) => {
  const [f, setF] = useState({
    name: d.name,
    age: d.profile?.age || '',
    gender: d.profile?.gender || '',
    bloodGroup: d.profile?.bloodGroup || '',
    allergies: d.profile?.allergies || '',
    conditions: d.profile?.conditions || '',
    emergencyName: d.profile?.emergencyName || '',
    emergencyPhone: d.profile?.emergencyPhone || '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    setMsg(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.emergencyPhone && !/^[6-9]\d{9}$/.test(f.emergencyPhone)) {
      setMsg({ ok: false, text: L('Emergency contact number must be a 10-digit mobile number.', 'आपत्कालीन संपर्क क्रमांक १० अंकी मोबाईल नंबर असावा.') });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(apiUrl('/patient-portal/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(f),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message || L('Could not save. Please try again.', 'जतन झाले नाही. पुन्हा प्रयत्न करा.'));
      onSaved(json.data);
      setMsg({ ok: true, text: L('Saved. The hospital sees these details at your next visit.', 'जतन झाले. पुढील भेटीत हॉस्पिटलला ही माहिती दिसेल.') });
    } catch (err: any) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const label = 'block font-medium mb-1.5';
  return (
    <form onSubmit={save} className="bg-white border border-[#E7E3DA] rounded-xl p-4 sm:p-6 space-y-4">
      <p className="text-stone-600 text-[15px]">
        {L('Keep these up to date. They help the doctor in an emergency.', 'ही माहिती अद्ययावत ठेवा. आपत्कालीन वेळी डॉक्टरांना मदत होते.')}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pf-name" className={label}>{L('Full name', 'पूर्ण नाव')}</label>
          <input id="pf-name" value={f.name} onChange={set('name')} className={inputClass} autoComplete="name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pf-age" className={label}>{L('Age', 'वय')}</label>
            <input id="pf-age" inputMode="numeric" value={f.age} onChange={(e) => setF((x) => ({ ...x, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pf-gender" className={label}>{L('Gender', 'लिंग')}</label>
            <select id="pf-gender" value={f.gender} onChange={set('gender')} className={inputClass}>
              <option value="">—</option>
              <option value="Male">{L('Male', 'पुरुष')}</option>
              <option value="Female">{L('Female', 'स्त्री')}</option>
              <option value="Other">{L('Other', 'इतर')}</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="pf-blood" className={label}>{L('Blood group', 'रक्तगट')}</label>
          <select id="pf-blood" value={f.bloodGroup} onChange={set('bloodGroup')} className={inputClass}>
            <option value="">{L('Don’t know', 'माहीत नाही')}</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-allergies" className={label}>{L('Allergies', 'ॲलर्जी')}</label>
          <input id="pf-allergies" value={f.allergies} onChange={set('allergies')} className={inputClass} placeholder={L('e.g. penicillin, none', 'उदा. पेनिसिलिन, काही नाही')} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pf-cond" className={label}>{L('Long-term conditions', 'दीर्घकालीन आजार')}</label>
          <input id="pf-cond" value={f.conditions} onChange={set('conditions')} className={inputClass} placeholder={L('e.g. diabetes, BP', 'उदा. मधुमेह, बीपी')} />
        </div>
        <div>
          <label htmlFor="pf-ename" className={label}>{L('Emergency contact name', 'आपत्कालीन संपर्क व्यक्ती')}</label>
          <input id="pf-ename" value={f.emergencyName} onChange={set('emergencyName')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="pf-ephone" className={label}>{L('Emergency contact mobile', 'आपत्कालीन संपर्क मोबाईल')}</label>
          <input id="pf-ephone" type="tel" inputMode="numeric" value={f.emergencyPhone} onChange={(e) => setF((x) => ({ ...x, emergencyPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} className={inputClass} />
        </div>
      </div>
      {msg && (
        <p role={msg.ok ? 'status' : 'alert'} className={`p-3 rounded-md text-sm ${msg.ok ? 'bg-[#E8F3F1] text-[#0B5D57]' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </p>
      )}
      <div className="flex justify-end">
        <button type="submit" disabled={busy} className="btn-primary min-w-[140px] disabled:opacity-60">
          {busy ? L('Saving…', 'जतन होत आहे…') : L('Save', 'जतन करा')}
        </button>
      </div>
    </form>
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

const Medicines: React.FC<{ meds: PatientMedicine[]; name: string; phone: string; isMr: boolean; L: LFn }> = ({ meds, name, phone, isMr, L }) => {
  const [pdfFailed, setPdfFailed] = useState(false);
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
      {current.length > 0 && (
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              downloadMedicineListPdf({ patientName: name, patientPhone: `+91 ${phone}`, medicines: current }).catch(() => setPdfFailed(true))
            }
          >
            <Download className="w-4 h-4" /> {L('Download medicine list (PDF)', 'औषधांची यादी डाउनलोड करा (PDF)')}
          </button>
          <p className="mt-1.5 text-sm text-stone-500">{L('Show it at any pharmacy or to another doctor.', 'कोणत्याही फार्मसीत किंवा दुसऱ्या डॉक्टरांना दाखवा.')}</p>
          {pdfFailed && <p role="alert" className="mt-1 text-sm text-red-700">{L('Could not create the PDF. Please try again.', 'PDF तयार झाली नाही. पुन्हा प्रयत्न करा.')}</p>}
        </div>
      )}
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

const Visits: React.FC<{ list: NonNullable<PatientRecord['appointments']>; followUp: PatientRecord['followUp']; isMr: boolean; L: LFn }> = ({ list, followUp, isMr, L }) => {
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
      <Link to={followUp ? bookLink(followUp.doctorId, followUp.date) : '/book'} className="btn-primary">
        <CalendarDays className="w-4 h-4" /> {followUp ? L('Book your follow-up', 'पुढील भेट बुक करा') : L('Book a visit', 'भेट बुक करा')}
      </Link>
    </div>
  );
};
