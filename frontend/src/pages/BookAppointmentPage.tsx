import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowLeft, Check, Phone, Printer, Search, CalendarPlus, Download, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { downloadAppointmentPdf } from '../lib/appointmentPdf';
import { DoctorPhoto } from '../components/ui';
import { feeLabel, hasFee } from '../lib/fee';
import { DateCalendar } from '../components/DateCalendar';
import { offlineSlots, bookingHours, HOSPITAL_WHATSAPP } from '../lib/opdHours';
import { apiUrl } from '../lib/api';
import { DOCTORS_DATA, DoctorItem } from '../data/doctorsData';
import { HOSPITAL } from '../config/hospital';

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
    phoneVerified?: boolean;
    patientAge?: number;
    patientGender?: string;
    patientAddress?: string;
    paymentId?: string;
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
  // Booking server unreachable: times come from the doctor's published hours and the
  // final step sends a request to reception (WhatsApp / call) instead of confirming online
  const [offline, setOffline] = useState(false);
  const [dayView, setDayView] = useState<'days' | 'calendar'>('days');
  const [dayCounts, setDayCounts] = useState<Record<string, number>>({});
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
  // Set when the server books without SMS codes (SMS not set up yet): no code to enter
  const [directToken, setDirectToken] = useState('');
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
        setOffline(false);
        setSlots(list);
        setSlotsState('ready');
      }
    } catch (e: any) {
      // Server down or unreachable: fall back to the doctor's published hours
      if (!e?.status || e.status >= 500) {
        const list = offlineSlots(doctor.timings, date);
        if (list) {
          setOffline(true);
          if (list.length === 0) {
            const hours = bookingHours(doctor.timings)!;
            const worksThatDay = hours.weekdays.includes(new Date(`${date}T00:00:00`).getDay());
            // Today's times have passed: move to the next working day unless the patient chose today
            if (worksThatDay && date === minDateKey && !userPickedDate.current) {
              const next = days.slice(1).find((d) => hours.weekdays.includes(d.getDay()));
              if (next) {
                setDate(toDateKey(next));
                return;
              }
            }
            setSlots([]);
            setSlotsState(worksThatDay ? 'ready' : 'day-off');
            return;
          }
          setSlots(list);
          setSlotsState('ready');
          return;
        }
      }
      setSlotsState('error');
    }
  };

  // Free-time counts for the "next 7 days" columns
  const nextOpenDays = useMemo(
    () => days.filter((d) => !opdWeekdays || opdWeekdays.length === 0 || opdWeekdays.includes(d.getDay())).slice(0, 7),
    [days, opdWeekdays],
  );
  useEffect(() => {
    if (step !== 'time' || !doctor) return;
    let cancelled = false;
    Promise.all(
      nextOpenDays.map(async (d) => {
        const key = toDateKey(d);
        try {
          const data = await call<{ bookable?: boolean; dayOff?: boolean; slots: Slot[] }>(
            `/appointments/availability?doctorId=${encodeURIComponent(doctor.id)}&date=${key}`,
          );
          return [key, data.bookable === false || data.dayOff ? 0 : (data.slots || []).filter((x) => x.status === 'AVAILABLE').length] as const;
        } catch {
          return [key, offlineSlots(doctor.timings, key)?.length ?? -1] as const;
        }
      }),
    ).then((pairs) => {
      if (!cancelled) setDayCounts(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id, step, nextOpenDays.map(toDateKey).join(), confirmation]);

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
      .catch(() => {
        // Offline: use the published hours to know which weekdays have OPD
        const hours = bookingHours(doctor.timings);
        setOpdWeekdays(hours ? hours.weekdays : null);
        if (hours && !hours.weekdays.includes(new Date(`${date}T00:00:00`).getDay())) {
          const first = days.find((x) => hours.weekdays.includes(x.getDay()));
          if (first) setDate(toDateKey(first));
        }
      });
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
      const data = await call<{ sessionId: string; otpRequired?: boolean; token?: string }>('/auth/send-otp', { phone });
      setOtpSessionId(data.sessionId);
      if (data.otpRequired === false && data.token) {
        setDirectToken(data.token);
      } else {
        setOtp('');
        setResendIn(30);
      }
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
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
    if (offline) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        setError(L('Please enter a valid 10-digit mobile number.', 'कृपया योग्य १० अंकी मोबाईल नंबर टाका.'));
        return;
      }
      go('confirm');
      return;
    }
    let token = directToken;
    if (!otpSessionId) {
      const sent = await sendOtp();
      if (!sent) return;
      // SMS not set up on the server: continue straight away, reception confirms by phone
      if (sent.otpRequired === false && sent.token) token = sent.token;
      else return;
    }
    if (!token && !/^\d{6}$/.test(otp)) {
      setError(L('Enter the 6-digit code from the SMS.', 'एसएमएसमधील ६ अंकी कोड टाका.'));
      return;
    }

    setBusy(true);
    try {
      if (!token) {
        const verified = await call<{ token: string }>('/auth/verify-otp', { sessionId: otpSessionId, otp });
        token = verified.token;
      }
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
        token,
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
          name: HOSPITAL.shortName,
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

  const stepHints: Record<Step, string> = {
    doctor: L('Search by name, department or the problem you have.', 'नाव, विभाग किंवा त्रासानुसार शोधा.'),
    time: L('Pick a day, then a time. Numbers show how many times are free.', 'आधी दिवस, मग वेळ निवडा. आकडे मोकळ्या वेळा दाखवतात.'),
    details: L('Used only for this appointment and shared only with the hospital.', 'ही माहिती फक्त या अपॉइंटमेंटसाठी व फक्त हॉस्पिटलसोबत वापरली जाते.'),
    confirm: offline
      ? L('Send your request; reception will call to confirm.', 'विनंती पाठवा; रिसेप्शन कॉल करून वेळ निश्चित करेल.')
      : L('Check the details and choose how to pay.', 'माहिती तपासा व पैसे कसे भरायचे ते निवडा.'),
    done: '',
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div ref={topRef} className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      {step !== 'done' && (
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl">{L('Book an appointment', 'अपॉइंटमेंट बुक करा')}</h1>
          <p className="mt-2 text-stone-600">
            {L('Takes about 2 minutes. Need help? Call', 'सुमारे २ मिनिटे लागतात. मदत हवी? कॉल करा')}{' '}
            <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="font-semibold text-[#1C2321] underline underline-offset-4">
              {HOSPITAL.phones.reception.short}
            </a>
          </p>

          <Stepper
            isMr={isMr}
            current={stepIndex}
            titles={STEPS.map((x) => stepTitles[x])}
            // Going back is fine until a time is held on the server
            canJump={(i) => i < stepIndex && (step !== 'confirm' || offline) && (i !== 1 || !!doctor) && (i !== 2 || !!slot)}
            onJump={(i) => go(STEPS[i])}
          />
        </header>
      )}

      {error && (
        <div role="alert" className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-800 flex gap-2.5 text-[15px]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className={step === 'done' ? '' : 'grid lg:grid-cols-12 gap-8 items-start'}>
        <div className={step === 'done' ? '' : 'lg:col-span-8 min-w-0 bg-white border border-[#E7E3DA] rounded-xl shadow-xs p-4 sm:p-7'}>
          {step !== 'done' && (
            <div className="mb-6 pb-5 border-b border-[#E7E3DA]">
              <p className="text-sm text-stone-500">{L(`Step ${stepIndex + 1} of 4`, `टप्पा ${stepIndex + 1} / ४`)}</p>
              <h2 className="text-2xl mt-0.5">{stepTitles[step]}</h2>
              <p className="mt-1 text-[15px] text-stone-600">{stepHints[step]}</p>
            </div>
          )}
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold">{L('Which day?', 'कोणता दिवस?')}</h3>
                <div className="inline-flex rounded-md border border-[#D8D3C8] bg-white p-0.5 text-sm" role="tablist" aria-label={L('How to pick a day', 'दिवस कसा निवडायचा')}>
                  {([
                    ['days', L('Next 7 days', 'पुढील ७ दिवस')],
                    ['calendar', L('Calendar', 'कॅलेंडर')],
                  ] as const).map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={dayView === k}
                      onClick={() => setDayView(k)}
                      className={`px-3.5 py-1.5 rounded ${dayView === k ? 'bg-[#0F766E] text-white font-semibold' : 'text-stone-700 hover:text-[#1C2321]'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={dayView === 'calendar' ? 'grid md:grid-cols-2 gap-6 items-start' : 'space-y-8'}>
                {dayView === 'days' ? (
                  <div
                    className="grid grid-flow-col auto-cols-[minmax(84px,1fr)] gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
                    aria-label={L('Next available days', 'पुढील उपलब्ध दिवस')}
                  >
                    {nextOpenDays.map((d) => {
                      const key = toDateKey(d);
                      const active = key === date;
                      const idx = days.indexOf(d);
                      const count = dayCounts[key];
                      const full = count === 0;
                      return (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={active}
                          disabled={full}
                          onClick={() => {
                            userPickedDate.current = true;
                            setDate(key);
                            setSlot(null);
                          }}
                          className={`rounded-lg border px-2 py-3 text-center transition-colors ${
                            active
                              ? 'bg-[#0F766E] border-[#0F766E] text-white'
                              : full
                              ? 'bg-stone-100 border-stone-100 text-stone-400 cursor-not-allowed'
                              : 'bg-white border-[#D8D3C8] hover:border-[#0F766E]'
                          }`}
                        >
                          <span className={`block text-xs ${active ? 'text-teal-100' : 'text-stone-500'}`}>
                            {idx === 0 ? L('Today', 'आज') : idx === 1 ? L('Tomorrow', 'उद्या') : dateLabel(key, { weekday: 'short' })}
                          </span>
                          <span className="block text-2xl font-semibold leading-tight mt-0.5">{d.getDate()}</span>
                          <span className={`block text-xs ${active ? 'text-teal-100' : 'text-stone-500'}`}>{dateLabel(key, { month: 'short' })}</span>
                          <span className={`block mt-2 text-xs font-medium ${active ? 'text-white' : full ? 'text-stone-400' : 'text-[#0F766E]'}`}>
                            {count === undefined || count < 0 ? '\u00a0' : full ? L('Full', 'भरले') : L(`${count} free`, `${count} उपलब्ध`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
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
                )}
                <div>
              <h3 className="text-lg font-semibold mb-1">{L('What time?', 'किती वाजता?')}</h3>
              <p className="text-sm text-stone-500 mb-4">{dateLabel(date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>

              {slotsState === 'loading' && (
                <div className={`grid gap-2 ${dayView === 'days' ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-3'}`} aria-busy="true">
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
                    <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-primary">
                      <Phone className="w-4 h-4" /> {L(`Call ${HOSPITAL.phones.reception.short}`, `${HOSPITAL.phones.reception.shortMr} वर कॉल करा`)}
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
                    <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-primary">
                      <Phone className="w-4 h-4" /> {HOSPITAL.phones.reception.short}
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
                    <div className={`grid gap-2 ${dayView === 'days' ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-3'}`}>
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

              <StepNav isMr={isMr} onBack={() => go('doctor')} nextLabel={L('Continue', 'पुढे')} nextDisabled={!slot} onNext={() => go('details')} note={slot ? `${dateLabel(date, { day: 'numeric', month: 'short' })}, ${slot.startTime.replace(/^0/, '')}` : undefined} />
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
                <h3 className="text-lg font-semibold">{L('Mobile number', 'मोबाईल नंबर')}</h3>
                <p className="text-sm text-stone-600 mt-1">
                  {offline
                    ? L('Reception will call you on this number to confirm your time.', 'आपली वेळ निश्चित करण्यासाठी रिसेप्शन या नंबरवर कॉल करेल.')
                    : L('We’ll text a 6-digit code to confirm it’s your number. Reception may call you on it if a doctor’s timing changes.', 'हा नंबर आपलाच आहे हे तपासण्यासाठी ६ अंकी कोड पाठवू. डॉक्टरांची वेळ बदलल्यास रिसेप्शन या नंबरवर कॉल करू शकते.')}
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
                  {offline ? null : otpSessionId ? (
                    <button
                      type="button"
                      className="btn-secondary shrink-0"
                      onClick={() => {
                        setOtpSessionId('');
                        setOtp('');
                        setDirectToken('');
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

                {!offline && directToken && (
                  <p className="mt-4 p-3 rounded-md bg-[#E8F3F1] text-[#0B5D57] text-sm">
                    {L(
                      'No code is needed right now. Reception will call this number to confirm your booking.',
                      'सध्या कोडची गरज नाही. बुकिंग निश्चित करण्यासाठी रिसेप्शन या नंबरवर कॉल करेल.',
                    )}
                  </p>
                )}

                {!offline && otpSessionId && !directToken && (
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
                nextLabel={offline || directToken ? L('Continue', 'पुढे') : otpSessionId ? L('Verify and continue', 'तपासा व पुढे') : L('Send code', 'कोड पाठवा')}
              />
            </form>
          )}

          {/* ── Step 4: Confirm ────────────────────────────────────────── */}
          {/* ── Step 4 (server down): send the request to reception ───── */}
          {step === 'confirm' && offline && doctor && slot && (() => {
            const when = `${dateLabel(date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${slot.startTime.replace(/^0/, '')}`;
            const message = [
              `Appointment request – ${HOSPITAL.shortName}`,
              `Doctor: ${doctor.name}`,
              `Date and time: ${when}`,
              `Patient: ${name.trim()}, ${age} yrs, ${gender}`,
              `Town: ${town.trim()}`,
              `Mobile: +91 ${phone}`,
              reason.trim() ? `Reason: ${reason.trim()}` : '',
              'Please confirm this appointment.',
            ]
              .filter(Boolean)
              .join('\n');
            return (
              <section>
                <div className="card-notice-amber text-[15px]">
                  <p className="font-semibold">{L('Online booking is not available right now', 'ऑनलाइन बुकिंग सध्या उपलब्ध नाही')}</p>
                  <p className="mt-1">
                    {L(
                      'Send this request to the hospital. Reception will call you on +91 ' + phone + ' to confirm the time. Your appointment is confirmed only after that call.',
                      'ही विनंती हॉस्पिटलला पाठवा. वेळ निश्चित करण्यासाठी रिसेप्शन +91 ' + phone + ' वर कॉल करेल. त्या कॉलनंतरच अपॉइंटमेंट निश्चित होईल.',
                    )}
                  </p>
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-3">{L('Your request', 'आपली विनंती')}</h3>
                <dl className="divide-y divide-[#E7E3DA] border-y border-[#E7E3DA] text-[15px]">
                  {[
                    [L('Doctor', 'डॉक्टर'), isMr ? doctor.nameMr : doctor.name],
                    [L('When', 'केव्हा'), when],
                    [L('Patient', 'रुग्ण'), `${name.trim()}, ${age}`],
                    [L('Mobile', 'मोबाईल'), `+91 ${phone}`],
                  ].map(([k, v]) => (
                    <div key={k} className="py-3 flex justify-between gap-4">
                      <dt className="text-stone-500">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${HOSPITAL_WHATSAPP}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    {L('Send request on WhatsApp', 'व्हॉट्सॲपवर विनंती पाठवा')}
                  </a>
                  <a href={`tel:${HOSPITAL.phones.reception.tel}`} className="btn-secondary">
                    <Phone className="w-4 h-4" /> {L(`Call ${HOSPITAL.phones.reception.short} instead`, `त्याऐवजी ${HOSPITAL.phones.reception.shortMr} वर कॉल करा`)}
                  </a>
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 text-[#0F766E] font-semibold underline underline-offset-4 py-2"
                  onClick={() =>
                    downloadAppointmentPdf({
                      kind: 'request',
                      patientName: name.trim(),
                      patientAge: age,
                      patientGender: gender,
                      patientPhone: `+91 ${phone}`,
                      town: town.trim(),
                      doctorName: doctor.name,
                      department: doctor.dept,
                      date,
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      fee: doctor.fee,
                      paid: false,
                    }).catch(() => setError(L('Could not create the PDF. Please take a screenshot instead.', 'PDF तयार झाली नाही. कृपया स्क्रीनशॉट घ्या.')))
                  }
                >
                  <Download className="w-4 h-4" /> {L('Download request (PDF)', 'विनंती डाउनलोड करा (PDF)')}
                </button>
                <br />
                <button type="button" onClick={() => go('details')} className="mt-3 inline-flex items-center gap-1.5 text-stone-700 hover:text-[#1C2321] py-2">
                  <ArrowLeft className="w-4 h-4" /> {L('Back', 'मागे')}
                </button>
              </section>
            );
          })()}

          {step === 'confirm' && !offline && doctor && slot && (
            <section>
              <div className={`p-4 rounded-md text-[15px] ${holdLeft > 0 ? 'bg-[#E8F3F1] text-[#0B5D57]' : 'bg-amber-50 text-amber-900'}`}>
                {holdLeft > 0
                  ? L(
                      `We’re holding ${slot.startTime.replace(/^0/, '')} for you for ${Math.floor(holdLeft / 60)}:${String(holdLeft % 60).padStart(2, '0')} minutes.`,
                      `${slot.startTime.replace(/^0/, '')} ही वेळ आपल्यासाठी ${Math.floor(holdLeft / 60)}:${String(holdLeft % 60).padStart(2, '0')} मिनिटे राखीव आहे.`,
                    )
                  : L('Your hold has expired. Please choose the time again.', 'राखीव वेळ संपली. कृपया पुन्हा वेळ निवडा.')}
              </div>

              <h3 className="text-lg font-semibold mt-8 mb-3">{L('How would you like to pay?', 'पैसे कसे भरणार?')}</h3>
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
            <div className="bg-white border border-[#E7E3DA] rounded-xl shadow-xs p-4 sm:p-5">
              <p className="hidden sm:block text-sm font-semibold text-stone-700">{L('Your appointment', 'आपली अपॉइंटमेंट')}</p>
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
              <ul className="hidden lg:block mt-4 pt-4 border-t border-[#E7E3DA] space-y-2.5 text-sm text-stone-600">
                <li className="flex gap-2.5">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" />
                  {L('Your details go only to the hospital.', 'आपली माहिती फक्त हॉस्पिटलकडे जाते.')}
                </li>
                <li className="flex gap-2.5">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" />
                  {L('Your chosen time is held for 10 minutes while you confirm.', 'निश्चित करताना निवडलेली वेळ १० मिनिटे राखीव राहते.')}
                </li>
                <li className="flex gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" />
                  {isMr ? HOSPITAL.address.shortMr : HOSPITAL.address.short}
                </li>
              </ul>
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
  note?: string;
}> = ({ isMr, onBack, onNext, nextLabel, nextDisabled, busy, submit, note }) => (
  // Stays in view while scrolling long lists of times; sits above the phone action bar
  <div className="sticky bottom-[61px] sm:bottom-0 z-30 mt-8 -mx-4 sm:-mx-7 -mb-4 sm:-mb-7 px-4 sm:px-7 py-3 bg-white/95 backdrop-blur border-t border-[#E7E3DA] rounded-b-xl flex items-center justify-between gap-3">
    {onBack ? (
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#1C2321] py-2">
        <ArrowLeft className="w-4 h-4" />
        {isMr ? 'मागे' : 'Back'}
      </button>
    ) : (
      <span />
    )}
    {note && <span className="text-sm font-medium text-[#1C2321] truncate">{note}</span>}
    <button
      type={submit ? 'submit' : 'button'}
      onClick={submit ? undefined : onNext}
      disabled={nextDisabled || busy}
      className="btn-primary shrink-0 min-w-[132px] sm:min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [pdfState, setPdfState] = useState<'idle' | 'working' | 'error'>('idle');
  const [qr, setQr] = useState('');

  // Same QR as on the PDF: reception can scan it to find the token
  useEffect(() => {
    import('qrcode')
      .then((QR) => QR.toDataURL(`${c.appointmentCode}|${a.appointmentDate}|${a.startTime}`, { margin: 0, width: 240 }))
      .then(setQr)
      .catch(() => setQr(''));
  }, [c.appointmentCode, a.appointmentDate, a.startTime]);

  const savePdf = async () => {
    setPdfState('working');
    try {
      await downloadAppointmentPdf({
        kind: 'confirmed',
        appointmentCode: c.appointmentCode,
        patientName: a.patientName,
        patientAge: a.patientAge,
        patientGender: a.patientGender,
        patientPhone: phoneShown,
        phoneVerified: a.phoneVerified,
        town: a.patientAddress?.split(' · ')[0],
        doctorName: a.doctorName,
        department: a.department,
        date: a.appointmentDate,
        startTime: a.startTime,
        endTime: a.endTime,
        fee: a.fee,
        paid: a.paymentStatus === 'PAID',
        paymentId: a.paymentId,
      });
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
      location: `${HOSPITAL.name}, ${HOSPITAL.locality.en}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  const rows: [string, React.ReactNode][] = [
    [L('Doctor', 'डॉक्टर'), <><span className="font-semibold">{a.doctorName}</span><span className="block text-sm text-stone-500">{a.department}</span></>],
    [L('When', 'केव्हा'), <span className="font-semibold">{when}, {a.startTime.replace(/^0/, '')}</span>],
    [L('Patient', 'रुग्ण'), <>{a.patientName}<span className="block text-sm text-stone-500">{phoneShown}</span></>],
    [
      L('Fee', 'शुल्क'),
      <>
        {feeLabel(a.fee, isMr)}
        <span className={`block text-sm ${a.paymentStatus === 'PAID' ? 'text-[#0B5D57]' : 'text-amber-800'}`}>
          {a.paymentStatus === 'PAID' ? L('Paid online', 'ऑनलाइन भरले') : L('Pay at the OPD counter', 'OPD काउंटरवर भरा')}
        </span>
      </>,
    ],
    [L('Where', 'कुठे'), isMr ? HOSPITAL.address.shortMr : HOSPITAL.address.short],
  ];

  return (
    <section className="max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#E8F3F1] text-[#0F766E] flex items-center justify-center print:hidden">
          <Check className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl">{L('You’re booked', 'आपली अपॉइंटमेंट निश्चित झाली')}</h1>
        <p className="mt-2 text-stone-600">
          {L('Show the token number or the PDF slip at OPD reception.', 'OPD रिसेप्शनला टोकन क्रमांक किंवा PDF पावती दाखवा.')}
        </p>
      </div>

      {/* Ticket */}
      <div className="mt-8 bg-white border border-[#E7E3DA] rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between gap-4 bg-[#FAF8F4]">
          <div className="min-w-0">
            <p className="text-sm text-stone-500">{L('Token number', 'टोकन क्रमांक')}</p>
            <p className="font-mono text-[22px] sm:text-3xl font-semibold whitespace-nowrap">{c.appointmentCode}</p>
            <p className={`mt-1 text-sm font-medium ${a.phoneVerified === false ? 'text-amber-800' : 'text-[#0B5D57]'}`}>
              {a.phoneVerified === false ? L('Confirmed · reception will call', 'निश्चित · रिसेप्शन कॉल करेल') : L('Confirmed', 'निश्चित')}
            </p>
          </div>
          {qr && <img src={qr} alt={L('QR code for this token', 'या टोकनचा QR कोड')} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />}
        </div>
        <div className="relative h-0 border-t border-dashed border-[#CFC9BC]" aria-hidden="true">
          <span className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#FAF8F4] border border-[#E7E3DA]" />
          <span className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#FAF8F4] border border-[#E7E3DA]" />
        </div>
        <dl className="p-5 sm:p-6 grid grid-cols-[auto,1fr] gap-x-6 gap-y-3.5 text-[15px]">
          {rows.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="text-stone-500">{k}</dt>
              <dd>{v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>

      {a.phoneVerified === false && (
        <p className="mt-6 card-notice-amber text-[15px]">
          {L(
            `Reception will call ${phoneShown} to confirm this appointment. Please keep your phone on.`,
            `ही अपॉइंटमेंट निश्चित करण्यासाठी रिसेप्शन ${phoneShown} वर कॉल करेल. कृपया फोन चालू ठेवा.`,
          )}
        </p>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-3 print:hidden">
        <button type="button" onClick={savePdf} disabled={pdfState === 'working'} className="btn-primary disabled:opacity-60">
          <Download className="w-4 h-4" />
          {pdfState === 'working' ? L('Preparing…', 'तयार होत आहे…') : L('Download slip (PDF)', 'पावती डाउनलोड करा (PDF)')}
        </button>
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <CalendarPlus className="w-4 h-4" /> {L('Add to calendar', 'कॅलेंडरमध्ये जोडा')}
        </a>
        <button type="button" onClick={() => window.print()} className="btn-secondary">
          <Printer className="w-4 h-4" /> {L('Print', 'प्रिंट')}
        </button>
        <Link to="/" className="btn-secondary">
          {L('Back to home', 'मुख्य पानावर जा')}
        </Link>
      </div>
      {pdfState === 'error' && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {L('Could not create the PDF. Please use Print instead, or take a screenshot.', 'PDF तयार झाली नाही. कृपया प्रिंट वापरा किंवा स्क्रीनशॉट घ्या.')}
        </p>
      )}

      <div className="mt-8 bg-white border border-[#E7E3DA] rounded-xl p-5 sm:p-6">
        <h2 className="text-xl">{L('Before you come', 'येण्यापूर्वी')}</h2>
        <ol className="mt-3 space-y-2.5 text-[15px] text-stone-700">
          {[
            L('Arrive 15 minutes early and show this token number at reception.', '१५ मिनिटे आधी या व रिसेप्शनला हा टोकन क्रमांक दाखवा.'),
            L('Bring old prescriptions and test reports, if any.', 'जुनी प्रिस्क्रिप्शन व रिपोर्ट असल्यास सोबत आणा.'),
            ...(a.paymentStatus !== 'PAID' && hasFee(a.fee) ? [L(`Keep ₹${a.fee} ready for the consultation fee.`, `सल्ला शुल्क ₹${a.fee} सोबत ठेवा.`)] : []),
            L(`To change or cancel, call ${HOSPITAL.phones.reception.short}.`, `बदल किंवा रद्द करण्यासाठी ${HOSPITAL.phones.reception.shortMr} वर कॉल करा.`),
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8F3F1] text-[#0B5D57] text-sm font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const Stepper: React.FC<{
  isMr: boolean;
  current: number;
  titles: string[];
  canJump: (i: number) => boolean;
  onJump: (i: number) => void;
}> = ({ isMr, current, titles, canJump, onJump }) => (
  <nav className="mt-7" aria-label={isMr ? 'बुकिंग प्रगती' : 'Booking progress'}>
    <ol className="flex items-center">
      {titles.map((t, i) => {
        const done = i < current;
        const active = i === current;
        const jump = canJump(i);
        return (
          <li key={t} className="flex items-center flex-1 last:flex-none min-w-0" aria-current={active ? 'step' : undefined}>
            <button
              type="button"
              disabled={!jump}
              onClick={() => onJump(i)}
              className={`flex items-center gap-2.5 min-w-0 ${jump ? 'cursor-pointer group' : 'cursor-default'}`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0 transition-colors ${
                  done
                    ? 'bg-[#0F766E] border-[#0F766E] text-white group-hover:bg-[#0B5D57]'
                    : active
                    ? 'bg-white border-[#0F766E] text-[#0F766E] ring-4 ring-[#0F766E]/10'
                    : 'bg-white border-[#D8D3C8] text-stone-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`hidden md:block text-sm truncate ${active ? 'text-[#1C2321] font-semibold' : done ? 'text-stone-700 group-hover:underline' : 'text-stone-400'}`}
              >
                {t}
              </span>
            </button>
            {i < titles.length - 1 && <span className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full ${done ? 'bg-[#0F766E]' : 'bg-[#E7E3DA]'}`} />}
          </li>
        );
      })}
    </ol>
  </nav>
);
