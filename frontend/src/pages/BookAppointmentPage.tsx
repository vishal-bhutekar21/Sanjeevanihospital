import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowLeft, Check, Phone, Printer, Search, CalendarPlus, Download } from 'lucide-react';
import { TokenSlip, downloadSlipPdf } from '../components/TokenSlip';
import { DoctorPhoto } from '../components/ui';
import { feeLabel, hasFee } from '../lib/fee';
import { DateCalendar } from '../components/DateCalendar';
import { apiUrl } from '../lib/api';
import { DOCTORS_DATA, DoctorItem } from '../data/doctorsData';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Slot {
  id: string;
  startTime: string; // "09:30 AM"
  endTime: string;
  status: 'AVAILABLE' | 'HELD' | 'CONFIRMED' | string;
}

interface Confirmation {
  appointmentCode: string;
  appointment: {
    patientName: string;
    patientPhone: string;
    doctorName: string;
    department: string;
    appointmentDate: string;
    startTime: string;
    endTime?: string;
    fee: number;
    paymentStatus: 'PAID' | 'PENDING';
  };
  reportingInstructions: string;
}

type Step = 'doctor' | 'time' | 'details' | 'confirm' | 'done';

const STEPS: Step[] = ['doctor', 'time', 'details', 'confirm'];

// ─── Helpers ────────────────────────────────────────────────────────────────

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call<T = any>(path: string, body?: unknown, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No internet connection. Please check your network and try again.', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.error?.message || json?.message || 'Something went wrong. Please try again.', res.status);
  }
  return json.data as T;
}

// Local calendar date as YYYY-MM-DD (not UTC, so late-night bookings get the right day)
const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const nextDays = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

const hour24 = (time: string) => {
  const [hm, period] = time.split(' ');
  let h = Number(hm.split(':')[0]);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h;
};

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const inputClass =
  'w-full px-3.5 py-3 bg-white border border-[#D8D3C8] rounded-md text-[15px] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none';

// ─── Page ───────────────────────────────────────────────────────────────────

export const BookAppointmentPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const L = (en: string, mr: string) => (isMr ? mr : en);
  const [searchParams] = useSearchParams();

  const urlDoctor = DOCTORS_DATA.find((d) => d.id === searchParams.get('doctorId'));
  const [step, setStep] = useState<Step>(urlDoctor ? 'time' : 'doctor');
  const [doctor, setDoctor] = useState<DoctorItem | null>(urlDoctor || null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Time
  // Bookable range: today plus about two months
  const days = useMemo(() => nextDays(61), []);
  const minDateKey = toDateKey(days[0]);
  const maxDateKey = toDateKey(days[days.length - 1]);
  const urlDate = searchParams.get('date');
  const [date, setDate] = useState(
    urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate) && urlDate >= minDateKey && urlDate <= maxDateKey ? urlDate : minDateKey,
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsState, setSlotsState] = useState<'loading' | 'ready' | 'error' | 'not-bookable' | 'day-off'>('loading');
  const [slot, setSlot] = useState<Slot | null>(null);
  const userPickedDate = useRef(false);
  // Weekdays (0 = Sunday) on which the selected doctor holds OPD; null = not known yet
  const [opdWeekdays, setOpdWeekdays] = useState<number[] | null>(null);

  // Details
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [town, setTown] = useState('');
  const [reason, setReason] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otp, setOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);

  // Confirm
  const [bookingSessionId, setBookingSessionId] = useState('');
  const [heldSlotId, setHeldSlotId] = useState('');
  const [holdUntil, setHoldUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [order, setOrder] = useState<any>(null);
  const [payMode, setPayMode] = useState<'online' | 'counter'>('online');

  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const go = (next: Step) => {
    setError('');
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Load times whenever doctor or date changes
  const loadSlots = async () => {
    if (!doctor) return;
    setSlotsState('loading');
    try {
      const data = await call<{ bookable?: boolean; dayOff?: boolean; slots: Slot[] }>(
        `/appointments/availability?doctorId=${encodeURIComponent(doctor.id)}&date=${date}`,
      );
      if (data.bookable === false) {
        setSlotsState('not-bookable');
        setSlots([]);
      } else if (data.dayOff) {
        setSlotsState('day-off');
        setSlots([]);
      } else {
        const list = data.slots || [];
        // Today is fully past or booked and the patient hasn't chosen a date: move on to the next open day
        if (date === minDateKey && !userPickedDate.current && !list.some((x) => x.status === 'AVAILABLE')) {
          const next = days.slice(1).find((d) => !opdWeekdays || opdWeekdays.length === 0 || opdWeekdays.includes(d.getDay()));
          if (next) {
            setDate(toDateKey(next));
            return;
          }
        }
        setSlots(list);
        setSlotsState('ready');
      }
    } catch {
      setSlotsState('error');
    }
  };

  useEffect(() => {
    if (step === 'time') loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id, date, step]);

  // Learn which weekdays the doctor works, and jump to the first open day
  useEffect(() => {
    if (!doctor) return;
    setOpdWeekdays(null);
    call<{ schedule: { days: unknown[][] } }>(`/appointments/schedules/${encodeURIComponent(doctor.id)}`)
      .then((d) => {
        const open = d.schedule.days.map((x, i) => (x.length ? i : -1)).filter((i) => i >= 0);
        setOpdWeekdays(open);
        if (open.length && !open.includes(new Date(`${date}T00:00:00`).getDay())) {
          const first = days.find((x) => open.includes(x.getDay()));
          if (first) setDate(toDateKey(first));
        }
      })
      .catch(() => setOpdWeekdays(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id]);

  // Countdowns (OTP resend, slot hold)
  useEffect(() => {
    if (resendIn <= 0 && step !== 'confirm') return;
    const t = setInterval(() => {
      setResendIn((s) => (s > 0 ? s - 1 : 0));
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, [resendIn, step]);

  const holdLeft = Math.max(0, Math.floor((holdUntil - now) / 1000));

  // ─── Actions ───────────────────────────────────────────────────────────────

  const sendOtp = async () => {
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(L('Please enter a valid 10-digit mobile number.', 'कृपया योग्य १० अंकी मोबाईल नंबर टाका.'));
      return;
    }
    setBusy(true);
    try {
      const data = await call<{ sessionId: string }>('/auth/send-otp', { phone });
      setOtpSessionId(data.sessionId);
      setOtp('');
      setResendIn(30);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyAndHold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!doctor || !slot) return;
    if (!name.trim() || !age || !gender || !town.trim()) {
      setError(L('Please fill in the patient’s name, age, gender and town.', 'कृपया रुग्णाचे नाव, वय, लिंग व गाव भरा.'));
      return;
    }
    if (!otpSessionId) {
      await sendOtp();
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError(L('Enter the 6-digit code from the SMS.', 'एसएमएसमधील ६ अंकी कोड टाका.'));
      return;
    }

    setBusy(true);
    try {
      const verified = await call<{ token: string }>('/auth/verify-otp', { sessionId: otpSessionId, otp });
      const session = await call<{ sessionId: string }>(
        '/appointments/session/init',
        {
          phone,
          patientName: name.trim(),
          patientAge: Number(age),
          patientGender: gender,
          patientAddress: [town.trim(), reason.trim()].filter(Boolean).join(' · '),
          doctorId: doctor.id,
        },
        verified.token,
      );
      setBookingSessionId(session.sessionId);

      const hold = await call<{ slotId: string }>('/appointments/reserve-slot', {
        bookingSessionId: session.sessionId,
        doctorId: doctor.id,
        slotDate: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      setHeldSlotId(hold.slotId);
      setHoldUntil(Date.now() + 10 * 60 * 1000);

      const o = await call<any>('/payments/create-order', { bookingSessionId: session.sessionId });
      setOrder(o);
      setPayMode(o?.paymentsEnabled ? 'online' : 'counter');
      go('confirm');
    } catch (e: any) {
      if (e.status === 409) {
        setSlot(null);
        go('time');
        setError(L('Sorry, someone just booked that time. Please choose another.', 'माफ करा, ही वेळ नुकतीच बुक झाली. कृपया दुसरी वेळ निवडा.'));
      } else {
        setError(e.message);
        if (e.status === 401 || e.status === 400) setOtp('');
      }
    } finally {
      setBusy(false);
    }
  };

  const confirmBooking = async (payAtHospital: boolean) => {
    const data = await call<Confirmation>('/appointments/confirm-slot', {
      bookingSessionId,
      slotId: heldSlotId,
      payAtHospital,
    });
    setConfirmation(data);
    go('done');
  };

  const handleConfirm = async () => {
    setError('');
    setBusy(true);
    try {
      if (payMode === 'counter' || !order?.paymentsEnabled) {
        await confirmBooking(true);
        return;
      }

      const ready = await loadRazorpay();
      if (!ready) {
        throw new ApiError(
          L('Could not open the payment page. You can choose to pay at the hospital instead.', 'पेमेंट पेज उघडले नाही. आपण हॉस्पिटलमध्ये पैसे भरण्याचा पर्याय निवडू शकता.'),
          0,
        );
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: 'INR',
          name: 'Sanjeevani Hospital',
          description: `OPD consultation · ${doctor?.name}`,
          prefill: { name, contact: `+91${phone}` },
          theme: { color: '#0F766E' },
          handler: async (resp: any) => {
            try {
              await call('/payments/verify', {
                bookingSessionId,
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              });
              await confirmBooking(false);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () =>
              reject(
                new ApiError(
                  L('Payment was not completed. Your time is still held — you can try again.', 'पेमेंट पूर्ण झाले नाही. आपली वेळ अजून राखीव आहे, पुन्हा प्रयत्न करा.'),
                  0,
                ),
              ),
          },
        });
        rzp.on('payment.failed', (r: any) =>
          reject(new ApiError(r?.error?.description || L('Payment failed. Please try again.', 'पेमेंट अयशस्वी. पुन्हा प्रयत्न करा.'), 0)),
        );
        rzp.open();
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ─── Derived ─────────────────────────────────────────────────────────────

  const dateLabel = (key: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) =>
    new Date(`${key}T00:00:00`).toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', opts);

  const groupedSlots = useMemo(() => {
    const groups: { key: string; label: string; items: Slot[] }[] = [
      { key: 'm', label: L('Morning', 'सकाळ'), items: [] },
      { key: 'a', label: L('Afternoon', 'दुपार'), items: [] },
      { key: 'e', label: L('Evening', 'संध्याकाळ'), items: [] },
    ];
    slots.forEach((s) => {
      const h = hour24(s.startTime);
      groups[h < 12 ? 0 : h < 17 ? 1 : 2].items.push(s);
    });
    return groups.filter((g) => g.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, isMr]);

  const stepIndex = STEPS.indexOf(step);
  const stepTitles: Record<Step, string> = {
    doctor: L('Choose a doctor', 'डॉक्टर निवडा'),
    time: L('Choose a date and time', 'तारीख व वेळ निवडा'),
    details: L('Patient details', 'रुग्णाची माहिती'),
    confirm: L('Review and confirm', 'तपासा व निश्चित करा'),
    done: L('Booked', 'बुकिंग पूर्ण'),
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={topRef} className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      {step !== 'done' && (
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl">{L('Book an appointment', 'अपॉइंटमेंट बुक करा')}</h1>
          <p className="mt-2 text-stone-600">
            {L('Takes about 2 minutes. Need help? Call', 'सुमारे २ मिनिटे लागतात. मदत हवी? कॉल करा')}{' '}
            <a href="tel:+917507342222" className="font-semibold text-[#1C2321] underline underline-offset-4">
              75073 42222
            </a>
          </p>

          {/* Progress */}
          <ol className="mt-6 grid grid-cols-4 gap-2" aria-label={L('Booking progress', 'बुकिंग प्रगती')}>
            {STEPS.map((s, i) => (
              <li key={s} aria-current={i === stepIndex ? 'step' : undefined}>
                <div className={`h-1 rounded-full ${i <= stepIndex ? 'bg-[#0F766E]' : 'bg-stone-200'}`} />
                <p className={`mt-2 text-sm hidden sm:block ${i === stepIndex ? 'text-[#1C2321] font-semibold' : 'text-stone-500'}`}>
                  {stepTitles[s]}
                </p>
              </li>
            ))}
          </ol>
          <p className="sm:hidden mt-2 text-sm">
            <span className="text-stone-500">{L(`Step ${stepIndex + 1} of 4 · `, `टप्पा ${stepIndex + 1} / ४ · `)}</span>
            <span className="font-semibold">{stepTitles[step]}</span>
          </p>
        </header>
      )}

      {error && (
        <div role="alert" className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-800 flex gap-2.5 text-[15px]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className={step === 'done' ? '' : 'grid lg:grid-cols-12 gap-8 items-start'}>
        <div className={step === 'done' ? '' : 'lg:col-span-8 min-w-0'}>
          {/* ── Step 1: Doctor ─────────────────────────────────────────── */}
          {step === 'doctor' && (
            <DoctorStep
              isMr={isMr}
              selectedId={doctor?.id}
              onSelect={(d) => {
                setDoctor(d);
                setSlot(null);
                go('time');
              }}
            />
          )}

          {/* ── Step 2: Time ───────────────────────────────────────────── */}
          {step === 'time' && doctor && (
            <section>
              <h2 className="text-xl mb-3">{L('Which day?', 'कोणता दिवस?')}</h2>

              {/* Quick picks: the next few days this doctor holds OPD */}
              {(() => {
                const open = days
                  .filter((d) => !opdWeekdays || opdWeekdays.length === 0 || opdWeekdays.includes(d.getDay()))
                  .slice(0, 5);
                return (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mb-4" aria-label={L('Next available days', 'पुढील उपलब्ध दिवस')}>
                    {open.map((d) => {
                      const key = toDateKey(d);
                      const active = key === date;
                      const idx = days.indexOf(d);
                      return (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            userPickedDate.current = true;
                            setDate(key);
                            setSlot(null);
                          }}
                          className={`shrink-0 px-3.5 py-2 rounded-md border text-sm transition-colors ${
                            active ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold' : 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
                          }`}
                        >
                          {idx === 0 ? L('Today', 'आज') : idx === 1 ? L('Tomorrow', 'उद्या') : dateLabel(key)}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <DateCalendar
                  value={date}
                  minDate={minDateKey}
                  maxDate={maxDateKey}
                  isMr={isMr}
                  isUnavailable={(d) => !!opdWeekdays && opdWeekdays.length > 0 && !opdWeekdays.includes(d.getDay())}
                  onChange={(key) => {
                    userPickedDate.current = true;
                    setDate(key);
                    setSlot(null);
                  }}
                />
                <div>
              <h2 className="text-xl mb-1">{L('What time?', 'किती वाजता?')}</h2>
              <p className="text-sm text-stone-500 mb-4">{dateLabel(date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>

              {slotsState === 'loading' && (
                <div className="grid grid-cols-3 gap-2" aria-busy="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-md bg-stone-200/60 animate-pulse" />
                  ))}
                </div>
              )}

              {slotsState === 'error' && (
                <div className="card-clean p-5">
                  <p className="font-semibold">{L('Online booking isn’t available right now.', 'ऑनलाइन बुकिंग सध्या उपलब्ध नाही.')}</p>
                  <p className="mt-1 text-stone-600">
                    {L(`${doctor.name} usually sees patients: ${doctor.timings}.`, `${doctor.nameMr} यांची नेहमीची वेळ: ${doctor.timingsMr || doctor.timings}.`)}{' '}
                    {L('Call reception and we’ll book a time for you.', 'रिसेप्शनला कॉल करा, आम्ही वेळ बुक करून देऊ.')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="tel:+917507342222" className="btn-primary">
                      <Phone className="w-4 h-4" /> {L('Call 75073 42222', '७५०७३ ४२२२२ वर कॉल करा')}
                    </a>
                    <button type="button" onClick={loadSlots} className="btn-secondary">
                      {L('Try again', 'पुन्हा प्रयत्न करा')}
                    </button>
                  </div>
                </div>
              )}

              {slotsState === 'day-off' && (
                <p className="card-clean p-5 text-stone-600">
                  {L(
                    `${doctor.name} doesn’t hold OPD on ${dateLabel(date, { weekday: 'long' })}. Please pick another day.`,
                    `${doctor.nameMr} यांची ${dateLabel(date, { weekday: 'long' })} रोजी OPD नसते. कृपया दुसरा दिवस निवडा.`,
                  )}
                </p>
              )}

              {slotsState === 'not-bookable' && (
                <div className="card-clean p-5">
                  <p className="font-semibold">
                    {L(`Online booking isn’t open for ${doctor.name} yet.`, `${doctor.nameMr} यांच्यासाठी ऑनलाइन बुकिंग अद्याप सुरू नाही.`)}
                  </p>
                  <p className="mt-1 text-stone-600">
                    {L('Please call reception and we’ll book a time for you.', 'कृपया रिसेप्शनला कॉल करा, आम्ही वेळ बुक करून देऊ.')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="tel:+917507342222" className="btn-primary">
                      <Phone className="w-4 h-4" /> 75073 42222
                    </a>
                    <button type="button" className="btn-secondary" onClick={() => go('doctor')}>
                      {L('Choose another doctor', 'दुसरे डॉक्टर निवडा')}
                    </button>
                  </div>
                </div>
              )}

              {slotsState === 'ready' && groupedSlots.length === 0 && (
                <p className="card-clean p-5 text-stone-600">
                  {L('No times left on this day. Please pick another date.', 'या दिवशी वेळ उपलब्ध नाही. कृपया दुसरी तारीख निवडा.')}
                </p>
              )}

              {slotsState === 'ready' &&
                groupedSlots.map((g) => (
                  <div key={g.key} className="mb-6">
                    <p className="text-sm text-stone-500 mb-2">{g.label}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {g.items.map((s) => {
                        const free = s.status === 'AVAILABLE';
                        const active = slot?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            disabled={!free}
                            onClick={() => setSlot(s)}
                            aria-pressed={active}
                            aria-label={free ? s.startTime : `${s.startTime} ${L('(booked)', '(बुक)')}`}
                            className={`h-12 rounded-md border text-[15px] transition-colors ${
                              active
                                ? 'bg-[#0F766E] border-[#0F766E] text-white font-semibold'
                                : free
                                ? 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
                                : 'bg-stone-100 border-stone-100 text-stone-400 line-through cursor-not-allowed'
                            }`}
                          >
                            {s.startTime.replace(/^0/, '')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                </div>
              </div>

              <StepNav isMr={isMr} onBack={() => go('doctor')} nextLabel={L('Continue', 'पुढे')} nextDisabled={!slot} onNext={() => go('details')} />
            </section>
          )}

          {/* ── Step 3: Details + phone verification ───────────────────── */}
          {step === 'details' && (
            <form onSubmit={verifyAndHold} noValidate>
              <section className="space-y-5">
                <div>
                  <label htmlFor="pname" className="block font-medium mb-1.5">{L('Patient’s full name', 'रुग्णाचे पूर्ण नाव')}</label>
                  <input id="pname" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page" className="block font-medium mb-1.5">{L('Age', 'वय')}</label>
                    <input
                      id="page"
                      inputMode="numeric"
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className={inputClass}
                      placeholder={L('Years', 'वर्षे')}
                    />
                  </div>
                  <fieldset>
                    <legend className="block font-medium mb-1.5">{L('Gender', 'लिंग')}</legend>
                    <div className="grid grid-cols-3 rounded-md border border-[#D8D3C8] overflow-hidden bg-white">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          aria-pressed={gender === g}
                          onClick={() => setGender(g)}
                          className={`py-3 text-sm border-l first:border-l-0 border-[#D8D3C8] ${gender === g ? 'bg-[#0F766E] text-white font-semibold' : ''}`}
                        >
                          {g === 'Male' ? L('Male', 'पुरुष') : g === 'Female' ? L('Female', 'स्त्री') : L('Other', 'इतर')}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div>
                  <label htmlFor="ptown" className="block font-medium mb-1.5">{L('Town or village', 'गाव / शहर')}</label>
                  <input
                    id="ptown"
                    autoComplete="address-level2"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className={inputClass}
                    placeholder={L('e.g. Jalna, Ambad, Partur', 'उदा. जालना, अंबड, परतूर')}
                  />
                </div>

                <div>
                  <label htmlFor="preason" className="block font-medium mb-1.5">
                    {L('Reason for visit', 'भेटीचे कारण')} <span className="text-stone-500 font-normal">({L('optional', 'ऐच्छिक')})</span>
                  </label>
                  <input
                    id="preason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={inputClass}
                    placeholder={L('e.g. knee pain for 2 weeks', 'उदा. २ आठवड्यांपासून गुडघेदुखी')}
                  />
                </div>
              </section>

              <section className="mt-8 pt-6 border-t border-[#E7E3DA]">
                <h2 className="text-xl">{L('Mobile number', 'मोबाईल नंबर')}</h2>
                <p className="text-sm text-stone-600 mt-1">
                  {L('We’ll text a 6-digit code to confirm it’s your number. Reception may call you on it if a doctor’s timing changes.', 'हा नंबर आपलाच आहे हे तपासण्यासाठी ६ अंकी कोड पाठवू. डॉक्टरांची वेळ बदलल्यास रिसेप्शन या नंबरवर कॉल करू शकते.')}
                </p>

                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-label={L('10-digit mobile number', '१० अंकी मोबाईल नंबर')}
                      value={phone}
                      disabled={!!otpSessionId}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`${inputClass} pl-12 disabled:bg-stone-100 disabled:text-stone-600`}
                    />
                  </div>
                  {otpSessionId ? (
                    <button
                      type="button"
                      className="btn-secondary shrink-0"
                      onClick={() => {
                        setOtpSessionId('');
                        setOtp('');
                        setResendIn(0);
                      }}
                    >
                      {L('Change', 'बदला')}
                    </button>
                  ) : (
                    <button type="button" className="btn-secondary shrink-0" disabled={busy} onClick={sendOtp}>
                      {L('Send code', 'कोड पाठवा')}
                    </button>
                  )}
                </div>

                {otpSessionId && (
                  <div className="mt-5">
                    <label htmlFor="potp" className="block font-medium mb-1.5">
                      {L(`Enter the 6-digit code sent to +91 ${phone}`, `+91 ${phone} वर आलेला ६ अंकी कोड टाका`)}
                    </label>
                    <input
                      id="potp"
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
                        <button type="button" onClick={sendOtp} disabled={busy} className="font-semibold text-[#0F766E] underline underline-offset-4">
                          {L('Resend code', 'कोड पुन्हा पाठवा')}
                        </button>
                      )}
                    </p>
                  </div>
                )}
              </section>

              <StepNav
                isMr={isMr}
                onBack={() => go('time')}
                submit
                busy={busy}
                nextLabel={otpSessionId ? L('Verify and continue', 'तपासा व पुढे') : L('Send code', 'कोड पाठवा')}
              />
            </form>
          )}

          {/* ── Step 4: Confirm ────────────────────────────────────────── */}
          {step === 'confirm' && doctor && slot && (
            <section>
              <div className={`p-4 rounded-md text-[15px] ${holdLeft > 0 ? 'bg-[#E8F3F1] text-[#0B5D57]' : 'bg-amber-50 text-amber-900'}`}>
                {holdLeft > 0
                  ? L(
                      `We’re holding ${slot.startTime.replace(/^0/, '')} for you for ${Math.floor(holdLeft / 60)}:${String(holdLeft % 60).padStart(2, '0')} minutes.`,
                      `${slot.startTime.replace(/^0/, '')} ही वेळ आपल्यासाठी ${Math.floor(holdLeft / 60)}:${String(holdLeft % 60).padStart(2, '0')} मिनिटे राखीव आहे.`,
                    )
                  : L('Your hold has expired. Please choose the time again.', 'राखीव वेळ संपली. कृपया पुन्हा वेळ निवडा.')}
              </div>

              <h2 className="text-xl mt-8 mb-3">{L('How would you like to pay?', 'पैसे कसे भरणार?')}</h2>
              <div className="space-y-2" role="radiogroup">
                {order?.paymentsEnabled && (
                  <PayOption
                    checked={payMode === 'online'}
                    onSelect={() => setPayMode('online')}
                    title={L(`Pay ₹${doctor.fee} now`, `आत्ता ₹${doctor.fee} भरा`)}
                    sub={L('UPI, card or net banking. Skip the queue at the billing counter.', 'UPI, कार्ड किंवा नेट बँकिंग. बिलिंग काउंटरवर रांग नाही.')}
                  />
                )}
                <PayOption
                  checked={payMode === 'counter'}
                  onSelect={() => setPayMode('counter')}
                  title={L('Pay at the hospital', 'हॉस्पिटलमध्ये भरा')}
                  sub={L(`Pay ${hasFee(doctor.fee) ? `₹${doctor.fee}` : 'the consultation fee'} at the OPD counter when you arrive.`, `येताना OPD काउंटरवर ${hasFee(doctor.fee) ? `₹${doctor.fee}` : 'सल्ला शुल्क'} भरा.`)}
                />
              </div>

              {holdLeft > 0 ? (
                <StepNav
                  isMr={isMr}
                  busy={busy}
                  nextLabel={
                    payMode === 'online' && order?.paymentsEnabled
                      ? L(`Pay ₹${doctor.fee} and book`, `₹${doctor.fee} भरा व बुक करा`)
                      : L('Confirm booking', 'बुकिंग निश्चित करा')
                  }
                  onNext={handleConfirm}
                />
              ) : (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setSlot(null);
                      setOtpSessionId('');
                      go('time');
                    }}
                  >
                    {L('Choose a time again', 'पुन्हा वेळ निवडा')}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ── Done ───────────────────────────────────────────────────── */}
          {step === 'done' && confirmation && <DoneView isMr={isMr} c={confirmation} />}
        </div>

        {/* Summary */}
        {step !== 'done' && doctor && (
          <aside className="lg:col-span-4 lg:sticky lg:top-28 order-first lg:order-none min-w-0" aria-label={L('Your appointment', 'आपली अपॉइंटमेंट')}>
            <div className="card-clean p-4 sm:p-5">
              <p className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-stone-500">{L('Your appointment', 'आपली अपॉइंटमेंट')}</p>
              <div className="sm:mt-3 flex gap-3">
                <DoctorPhoto src={doctor.image} name={isMr ? doctor.nameMr : doctor.name} className="w-12 h-14 sm:w-14 sm:h-16 rounded-md shrink-0" textClass="text-lg" />
                <div className="min-w-0">
                  <p className="font-heading text-lg leading-tight">{isMr ? doctor.nameMr : doctor.name}</p>
                  <p className="text-sm text-stone-600">{isMr ? doctor.deptMr : doctor.dept}</p>
                  {(step === 'time' || step === 'details') && (
                    <button type="button" onClick={() => go('doctor')} className="text-sm text-[#0F766E] underline underline-offset-4 mt-1">
                      {L('Change doctor', 'डॉक्टर बदला')}
                    </button>
                  )}
                </div>
              </div>
              <dl className="mt-4 pt-4 border-t border-[#E7E3DA] text-sm space-y-2">
                <div className={`justify-between gap-4 ${slot ? 'flex' : 'hidden lg:flex'}`}>
                  <dt className="text-stone-500">{L('When', 'केव्हा')}</dt>
                  <dd className="text-right font-medium">
                    {slot ? `${dateLabel(date)}, ${slot.startTime.replace(/^0/, '')}` : L('Not chosen yet', 'अजून निवडले नाही')}
                  </dd>
                </div>
                {name && step === 'confirm' && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">{L('Patient', 'रुग्ण')}</dt>
                    <dd className="text-right font-medium">{name}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">{L('Consultation fee', 'सल्ला शुल्क')}</dt>
                  <dd className="text-right font-medium">{feeLabel(doctor.fee, isMr)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// ─── Pieces ─────────────────────────────────────────────────────────────────

const StepNav: React.FC<{
  isMr: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  busy?: boolean;
  submit?: boolean;
}> = ({ isMr, onBack, onNext, nextLabel, nextDisabled, busy, submit }) => (
  <div className="mt-8 flex items-center justify-between gap-3">
    {onBack ? (
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#1C2321] py-2">
        <ArrowLeft className="w-4 h-4" />
        {isMr ? 'मागे' : 'Back'}
      </button>
    ) : (
      <span />
    )}
    <button
      type={submit ? 'submit' : 'button'}
      onClick={submit ? undefined : onNext}
      disabled={nextDisabled || busy}
      className="btn-primary min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {busy ? (isMr ? 'कृपया थांबा…' : 'Please wait…') : nextLabel}
    </button>
  </div>
);

const PayOption: React.FC<{ checked: boolean; onSelect: () => void; title: string; sub: string }> = ({ checked, onSelect, title, sub }) => (
  <button
    type="button"
    role="radio"
    aria-checked={checked}
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-md border flex gap-3 items-start bg-white ${
      checked ? 'border-[#0F766E] ring-1 ring-[#0F766E]' : 'border-[#D8D3C8] hover:border-stone-400'
    }`}
  >
    <span className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${checked ? 'border-[#0F766E]' : 'border-stone-400'}`}>
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />}
    </span>
    <span>
      <span className="block font-semibold">{title}</span>
      <span className="block text-sm text-stone-600">{sub}</span>
    </span>
  </button>
);

const DoctorStep: React.FC<{ isMr: boolean; selectedId?: string; onSelect: (d: DoctorItem) => void }> = ({ isMr, selectedId, onSelect }) => {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const depts = useMemo(() => Array.from(new Set(DOCTORS_DATA.map((d) => d.dept))), []);
  const list = DOCTORS_DATA.filter((d) => {
    const s = q.toLowerCase().trim();
    const matchQ = !s || [d.name, d.nameMr, d.dept, d.deptMr, d.specialty].some((v) => v?.toLowerCase().includes(s));
    return matchQ && (!dept || d.dept === dept);
  });

  return (
    <section>
      <div className="relative">
        <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isMr ? 'डॉक्टर, विभाग किंवा त्रास शोधा' : 'Search a doctor, department or problem'}
          aria-label={isMr ? 'शोधा' : 'Search'}
          className={`${inputClass} pl-11`}
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {['', ...depts].map((d) => (
          <button
            key={d || 'all'}
            type="button"
            onClick={() => setDept(d)}
            aria-pressed={dept === d}
            className={`shrink-0 px-3 py-1.5 rounded-full border text-sm ${
              dept === d ? 'bg-[#1C2321] border-[#1C2321] text-white' : 'bg-white border-[#D8D3C8] text-stone-700'
            }`}
          >
            {d ? (isMr ? DOCTORS_DATA.find((x) => x.dept === d)?.deptMr : d) : isMr ? 'सर्व' : 'All'}
          </button>
        ))}
      </div>

      <ul className="mt-5 divide-y divide-[#E7E3DA] border-y border-[#E7E3DA]">
        {list.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => onSelect(d)}
              className={`w-full text-left py-4 flex gap-4 items-center hover:bg-white -mx-2 px-2 rounded ${selectedId === d.id ? 'bg-white' : ''}`}
            >
              <DoctorPhoto src={d.image} name={isMr ? d.nameMr : d.name} className="w-14 h-16 rounded-md shrink-0" textClass="text-lg" />
              <span className="flex-1 min-w-0">
                <span className="block font-heading text-lg leading-tight">{isMr ? d.nameMr : d.name}</span>
                <span className="block text-sm text-stone-600">{isMr ? d.deptMr : d.dept}</span>
                <span className="block text-xs text-stone-500 mt-0.5 truncate">{isMr ? d.timingsMr : d.timings}</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-semibold">{feeLabel(d.fee, isMr)}</span>
                <span className="block text-sm text-[#0F766E]">{isMr ? 'निवडा' : 'Select'} →</span>
              </span>
            </button>
          </li>
        ))}
        {list.length === 0 && (
          <li className="py-8 text-center text-stone-600">{isMr ? 'कोणी सापडले नाही. दुसरा शब्द वापरून पहा.' : 'No doctors found. Try a different word.'}</li>
        )}
      </ul>
    </section>
  );
};

const DoneView: React.FC<{ isMr: boolean; c: Confirmation }> = ({ isMr, c }) => {
  const a = c.appointment;
  const L = (en: string, mr: string) => (isMr ? mr : en);
  const when = new Date(`${a.appointmentDate}T00:00:00`).toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const phoneShown = a.patientPhone.startsWith('+') ? a.patientPhone : `+91 ${a.patientPhone}`;
  const slipRef = useRef<HTMLDivElement>(null);
  const [pdfState, setPdfState] = useState<'idle' | 'working' | 'error'>('idle');

  const savePdf = async () => {
    if (!slipRef.current) return;
    setPdfState('working');
    try {
      await downloadSlipPdf(slipRef.current, `Sanjeevani-OPD-${c.appointmentCode}.pdf`);
      setPdfState('idle');
    } catch {
      setPdfState('error');
    }
  };

  // Google Calendar link (appointment times are IST)
  const calendarUrl = (() => {
    const h = hour24(a.startTime);
    const m = Number(a.startTime.split(':')[1].slice(0, 2));
    const start = new Date(`${a.appointmentDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+05:30`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `OPD: ${a.doctorName} (${c.appointmentCode})`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Token ${c.appointmentCode}. Please arrive 15 minutes early.`,
      location: 'Sanjeevani Multispeciality Hospital, Ambad Choufuli, Jalna',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  return (
    <section className="max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#0F766E] text-white flex items-center justify-center print:hidden">
        <Check className="w-6 h-6" />
      </div>
      <h1 className="mt-5 text-3xl sm:text-4xl">{L('You’re booked', 'आपली अपॉइंटमेंट निश्चित झाली')}</h1>
      <p className="mt-2 text-stone-600">
        {L(`Booked for mobile number ${phoneShown}. Please keep this token number.`, `मोबाईल नंबर ${phoneShown} साठी बुकिंग झाली. कृपया हा टोकन क्रमांक जपून ठेवा.`)}
      </p>

      <div className="mt-8 card-clean p-6">
        <p className="text-sm text-stone-500">{L('Token number', 'टोकन क्रमांक')}</p>
        <p className="font-mono text-3xl font-semibold tracking-wide">{c.appointmentCode}</p>

        <dl className="mt-6 grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-[15px]">
          <dt className="text-stone-500">{L('Doctor', 'डॉक्टर')}</dt>
          <dd>{a.doctorName}</dd>
          <dt className="text-stone-500">{L('When', 'केव्हा')}</dt>
          <dd>
            {when}, {a.startTime.replace(/^0/, '')}
          </dd>
          <dt className="text-stone-500">{L('Patient', 'रुग्ण')}</dt>
          <dd>{a.patientName}</dd>
          <dt className="text-stone-500">{L('Fee', 'शुल्क')}</dt>
          <dd>
            {feeLabel(a.fee, isMr)} · {a.paymentStatus === 'PAID' ? L('paid online', 'ऑनलाइन भरले') : L('pay at the OPD counter', 'OPD काउंटरवर भरा')}
          </dd>
          <dt className="text-stone-500">{L('Where', 'कुठे')}</dt>
          <dd>Plot 17, Rishi Park, Ambad Choufuli, Jalna</dd>
        </dl>
      </div>

      <h2 className="mt-8 text-xl">{L('Before you come', 'येण्यापूर्वी')}</h2>
      <ul className="mt-3 space-y-2 text-[15px] text-stone-700 list-disc pl-5">
        <li>{L('Arrive 15 minutes early and show this token number at reception.', '१५ मिनिटे आधी या व रिसेप्शनला हा टोकन क्रमांक दाखवा.')}</li>
        <li>{L('Bring old prescriptions and test reports, if any.', 'जुनी प्रिस्क्रिप्शन व रिपोर्ट असल्यास सोबत आणा.')}</li>
        {a.paymentStatus !== 'PAID' && hasFee(a.fee) && <li>{L(`Keep ₹${a.fee} ready for the consultation fee.`, `सल्ला शुल्क ₹${a.fee} सोबत ठेवा.`)}</li>}
        <li>{L('To change or cancel, call 75073 42222.', 'बदल किंवा रद्द करण्यासाठी ७५०७३ ४२२२२ वर कॉल करा.')}</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={savePdf} disabled={pdfState === 'working'} className="btn-primary disabled:opacity-60">
          <Download className="w-4 h-4" />
          {pdfState === 'working' ? L('Preparing…', 'तयार होत आहे…') : L('Download slip (PDF)', 'पावती डाउनलोड करा (PDF)')}
        </button>
        <button type="button" onClick={() => window.print()} className="btn-secondary">
          <Printer className="w-4 h-4" /> {L('Print', 'प्रिंट')}
        </button>
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <CalendarPlus className="w-4 h-4" /> {L('Add to calendar', 'कॅलेंडरमध्ये जोडा')}
        </a>
        <Link to="/" className="btn-secondary">
          {L('Done', 'पूर्ण')}
        </Link>
      </div>
      {pdfState === 'error' && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {L('Could not create the PDF. Please use Print instead, or take a screenshot.', 'PDF तयार झाली नाही. कृपया प्रिंट वापरा किंवा स्क्रीनशॉट घ्या.')}
        </p>
      )}

      {/* Off-screen layout used for the PDF */}
      <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0 }}>
        <TokenSlip
          ref={slipRef}
          d={{
            appointmentCode: c.appointmentCode,
            patientName: a.patientName,
            patientPhone: phoneShown,
            doctorName: a.doctorName,
            department: a.department,
            dateLabel: new Date(`${a.appointmentDate}T00:00:00`).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            time: a.startTime,
            fee: a.fee,
            paid: a.paymentStatus === 'PAID',
          }}
        />
      </div>
    </section>
  );
};
