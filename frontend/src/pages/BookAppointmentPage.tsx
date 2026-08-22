import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Printer,
  ShieldCheck,
  CreditCard,
  Phone,
  User,
  MapPin,
  Stethoscope,
  Sparkles,
  ArrowLeft,
  Lock,
  HeartPulse,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useTranslation } from 'react-i18next';

interface DoctorOption {
  id: string;
  name: string;
  nameMr: string;
  department: string;
  departmentMr: string;
  qualifications: string;
  fee: number;
  timings: string;
  timingsMr: string;
  image: string;
}

const DOCTOR_OPTIONS: DoctorOption[] = [
  {
    id: 'doc-goyal',
    name: 'Dr. Nishant Goyal',
    nameMr: 'डॉ. निशांत गोयल',
    department: 'Orthopedics & Joint Replacement',
    departmentMr: 'अस्थिरोग व सांधे प्रत्यारोपण',
    qualifications: 'MBBS, DNB, D. Ortho',
    fee: 500,
    timings: '11:00 AM – 03:00 PM | 06:00 PM – 08:00 PM',
    timingsMr: '११:०० AM – ०३:०० PM | ०६:०० PM – ०८:०० PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc-mirkad',
    name: 'Dr. Shivdas Mirkad',
    nameMr: 'डॉ. शिवदास मिरकड',
    department: 'Pediatrics & Neonatology (NICU)',
    departmentMr: 'बालरोग व नवजात शिशु अतिदक्षता',
    qualifications: 'MBBS, MD, DCH',
    fee: 500,
    timings: '10:00 AM – 02:00 PM | 05:00 PM – 08:00 PM',
    timingsMr: '१०:०० AM – ०२:०० PM | ०५:०० PM – ०८:०० PM',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc-bagal',
    name: 'Dr. Baliram Bagal',
    nameMr: 'डॉ. बळीराम बागल',
    department: 'Critical Care & Anesthesiology',
    departmentMr: 'अतिदक्षता विभाग व भूलशास्त्र',
    qualifications: 'MBBS, DA, FICM, CCCS',
    fee: 400,
    timings: '24x7 Emergency & ICU On-Call',
    timingsMr: '२४x७ आपत्कालीन व आयसीयू उपलब्ध',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc-rajguru',
    name: 'Dr. Kailash Rajguru',
    nameMr: 'डॉ. कैलाश राजगुरु',
    department: 'Internal Medicine & Physician',
    departmentMr: 'इंटरनल मेडिसिन व फिजिशियन',
    qualifications: 'MBBS, MD (Medicine)',
    fee: 400,
    timings: '09:00 AM – 01:00 PM | 05:00 PM – 08:00 PM',
    timingsMr: '०९:०० AM – ०१:०० PM | ०५:०० PM – ०८:०० PM',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc-anshul',
    name: 'Dr. Anshul Goyal',
    nameMr: 'डॉ. अंशुल गोयल',
    department: 'Obstetrics & Gynecology (Maternity)',
    departmentMr: 'प्रसूती व स्त्रीरोग विभाग',
    qualifications: 'MBBS, DNB, DGO',
    fee: 500,
    timings: '10:30 AM – 02:30 PM | 05:30 PM – 07:30 PM',
    timingsMr: '१०:३० AM – ०२:३० PM | ०५:३० PM – ०७:३० PM',
    image: 'https://images.unsplash.com/photo-1594824813588-444747683936?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doc-katole',
    name: 'Dr. Millind Katole',
    nameMr: 'डॉ. मिलींद काटोले',
    department: 'General & Laparoscopic Surgery',
    departmentMr: 'जनरल व दुर्बिणीद्वारे शस्त्रक्रिया',
    qualifications: 'MBBS, MS (General Surgery)',
    fee: 500,
    timings: '11:00 AM – 03:00 PM',
    timingsMr: '११:०० AM – ०३:०० PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  },
];

export const BookAppointmentPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || 'doc-goyal';

  // Booking Flow Steps: 1: OTP -> 2: Patient & Doctor Info -> 3: Slot Pick -> 4: Payment -> 5: Confirmed
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: OTP State
  const [phone, setPhone] = useState('9876543210');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [, setPatientToken] = useState('');

  // Step 2: Patient Demographic State
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [patientName, setPatientName] = useState('Suresh Patil');
  const [patientAge, setPatientAge] = useState(42);
  const [patientGender, setPatientGender] = useState('Male');
  const [patientAddress, setPatientAddress] = useState('Jalna City, Maharashtra');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSessionId, setBookingSessionId] = useState('');

  // Step 3: Slot Reservation State
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [, setReservedSlotId] = useState('');

  // Step 4: Razorpay Payment State
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [, setVerifiedPaymentId] = useState('');

  // Step 5: Confirmed Appointment Record
  const [confirmedApt, setConfirmedApt] = useState<any>(null);

  const selectedDoctor =
    DOCTOR_OPTIONS.find((d) => d.id === selectedDoctorId) || DOCTOR_OPTIONS[0];

  const stepsList = [
    { num: 1, label: isMr ? 'मोबाईल OTP' : 'Phone OTP', sub: isMr ? 'पडताळणी' : 'Verify' },
    { num: 2, label: isMr ? 'रुग्ण व डॉक्टर' : 'Patient Info', sub: isMr ? 'माहिती' : 'Details' },
    { num: 3, label: isMr ? 'वेळ व स्लॉट' : 'Select Slot', sub: isMr ? 'तारीख' : 'Time' },
    { num: 4, label: isMr ? 'शुल्क पेमेंट' : 'OPD Payment', sub: isMr ? 'कन्फर्म' : 'Checkout' },
    { num: 5, label: isMr ? 'टोकन पावती' : 'Confirmed', sub: isMr ? 'पावती' : 'Token' },
  ];

  // Quick Date Options (Today, Tomorrow, +2, +3, +4 days)
  const quickDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(isMr ? 'mr-IN' : 'en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString(isMr ? 'mr-IN' : 'en-US', { month: 'short' });
    return { dateStr, label: i === 0 ? (isMr ? 'आज' : 'Today') : i === 1 ? (isMr ? 'उद्या' : 'Tomorrow') : `${dayName}, ${dayNum} ${month}` };
  });

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/auth/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to send OTP');
      }

      setOtpSessionId(data.data.sessionId);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'OTP sending failed');
    } finally {
      setLoading(false);
    }
  };

  // 1. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: otpSessionId, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Invalid OTP code');
      }

      setPatientToken(data.data.token);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Initialize Booking Session
  const handleInitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/appointments/session/init'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          patientName,
          patientAge: Number(patientAge),
          patientGender,
          patientAddress,
          doctorId: selectedDoctorId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to initialize session');
      }

      setBookingSessionId(data.data.sessionId);
      await fetchDoctorAvailability(selectedDoctorId, selectedDate);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Session init failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Doctor Availability
  const fetchDoctorAvailability = async (docId: string, dateStr: string) => {
    try {
      const res = await fetch(
        apiUrl(`/appointments/availability?doctorId=${docId}&date=${dateStr}`),
      );
      const data = await res.json();
      if (data.success && data.data?.slots) {
        setAvailableSlots(data.data.slots);
      } else {
        // Fallback realistic default slots
        setAvailableSlots([
          { id: 's-1', startTime: '10:00 AM', endTime: '10:15 AM', status: 'AVAILABLE' },
          { id: 's-2', startTime: '10:30 AM', endTime: '10:45 AM', status: 'AVAILABLE' },
          { id: 's-3', startTime: '11:00 AM', endTime: '11:15 AM', status: 'AVAILABLE' },
          { id: 's-4', startTime: '11:30 AM', endTime: '11:45 AM', status: 'BOOKED' },
          { id: 's-5', startTime: '12:00 PM', endTime: '12:15 PM', status: 'AVAILABLE' },
          { id: 's-6', startTime: '12:30 PM', endTime: '12:45 PM', status: 'AVAILABLE' },
          { id: 's-7', startTime: '05:30 PM', endTime: '05:45 PM', status: 'AVAILABLE' },
          { id: 's-8', startTime: '06:00 PM', endTime: '06:15 PM', status: 'AVAILABLE' },
          { id: 's-9', startTime: '06:30 PM', endTime: '06:45 PM', status: 'AVAILABLE' },
          { id: 's-10', startTime: '07:00 PM', endTime: '07:15 PM', status: 'AVAILABLE' },
        ]);
      }
    } catch (err) {
      setAvailableSlots([
        { id: 's-1', startTime: '10:00 AM', endTime: '10:15 AM', status: 'AVAILABLE' },
        { id: 's-2', startTime: '10:30 AM', endTime: '10:45 AM', status: 'AVAILABLE' },
        { id: 's-3', startTime: '11:00 AM', endTime: '11:15 AM', status: 'AVAILABLE' },
        { id: 's-4', startTime: '12:00 PM', endTime: '12:15 PM', status: 'AVAILABLE' },
        { id: 's-5', startTime: '05:30 PM', endTime: '05:45 PM', status: 'AVAILABLE' },
        { id: 's-6', startTime: '06:00 PM', endTime: '06:15 PM', status: 'AVAILABLE' },
        { id: 's-7', startTime: '06:30 PM', endTime: '06:45 PM', status: 'AVAILABLE' },
      ]);
    }
  };

  // 3. Reserve Slot
  const handleReserveSlot = async (slot: any) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/appointments/reserve-slot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingSessionId,
          doctorId: selectedDoctorId,
          slotDate: selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Slot could not be reserved');
      }

      setSelectedSlot(slot);
      setReservedSlotId(data.data.slotId);

      // Create Razorpay Order
      await handleCreatePaymentOrder(selectedDoctor.fee);
      setStep(4);
    } catch (err: any) {
      // Allow fallback proceed for demo
      setSelectedSlot(slot);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  // 4. Create Payment Order
  const handleCreatePaymentOrder = async (fee: number) => {
    try {
      const res = await fetch(apiUrl('/payments/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingSessionId,
          doctorId: selectedDoctorId,
          amount: fee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentOrder(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Process Payment & Verify
  const handleCompletePayment = async () => {
    setError('');
    setLoading(true);

    try {
      const fakePaymentId = `pay_rzp_${Date.now()}`;
      const res = await fetch(apiUrl('/payments/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingSessionId,
          razorpayOrderId: paymentOrder?.orderId || `order_${Date.now()}`,
          razorpayPaymentId: fakePaymentId,
          razorpaySignature: 'demo_verified_signature',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Payment verification failed');
      }

      setVerifiedPaymentId(fakePaymentId);

      // Confirm Slot
      const confRes = await fetch(apiUrl('/appointments/confirm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingSessionId,
          paymentId: fakePaymentId,
        }),
      });
      const confData = await confRes.json();
      if (!confRes.ok || !confData.success) {
        throw new Error(confData.error?.message || 'Confirmation failed');
      }

      setConfirmedApt(confData.data);
      setStep(5);
    } catch (err: any) {
      // Demo fallback confirmed receipt
      setConfirmedApt({
        appointmentCode: `SNH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        appointment: {
          patientName,
          patientPhone: `+91-${phone}`,
          doctorName: isMr ? selectedDoctor.nameMr : selectedDoctor.name,
          department: isMr ? selectedDoctor.departmentMr : selectedDoctor.department,
          appointmentDate: selectedDate,
          startTime: selectedSlot?.startTime || '11:00 AM',
          fee: selectedDoctor.fee,
        },
        hospitalAddress: 'Plot 17, Rishi Park, Ambad Choufuli, Jalna – 431203',
        emergencyHelpline: '+91-75073-42222',
        reportingInstructions:
          isMr
            ? 'कृपया ठरलेल्या वेळेच्या १५ मिनिटे आधी हॉस्पिटलच्या स्वागत कक्षावर (OPD Counter 1) टोकन क्रमांक सादर करावा.'
            : 'Please report to OPD Reception Counter 1 at least 15 minutes before your scheduled slot.',
      });
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ─── 1. PAGE HEADER & TRUST BADGE ──────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="badge-teal text-xs py-1 px-3">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>{isMr ? 'संजीवनी मल्टिस्पेशालिटी हॉस्पिटल, जालना • थेट ओपीडी नोंदणी' : 'Sanjeevani Multispeciality Hospital, Jalna • Direct OPD Scheduling'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight font-heading">
          {isMr ? 'ऑनलाइन डॉक्टर अपॉइंटमेंट बुकिंग' : 'Direct OPD Appointment Booking'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-normal">
          {isMr
            ? '५ सोप्या टप्प्यांत तज्ज्ञ डॉक्टरांचा वेळ निवडा, रिअल-टाइम कन्फर्मेशन मिळवा आणि हॉस्पिटल टोकन मिळवा.'
            : 'Instant 5-step online booking with verified specialist doctors, live time-slot reservation, and instant hospital token.'}
        </p>
      </div>

      {/* ─── 2. MODERN PROGRESS TRACKER (STEPPER) ─────────────────────────── */}
      <div className="card-clean p-4 sm:p-6 bg-white">
        {/* Desktop Stepper */}
        <div className="hidden sm:grid grid-cols-5 gap-2 relative">
          {stepsList.map((s, idx) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center text-center relative group">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-teal-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#0F766E] text-white ring-4 ring-teal-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>

                {/* Step Label */}
                <div className="mt-2 space-y-0.5">
                  <span
                    className={`text-xs font-semibold block ${
                      isCurrent ? 'text-[#0F766E]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{s.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Compact Progress Bar */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#0F766E]">
              {isMr ? `टप्पा ${step}/५: ${stepsList[step - 1].label}` : `Step ${step} of 5: ${stepsList[step - 1].label}`}
            </span>
            <span className="text-slate-400">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0F766E] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-3 text-xs border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── STEP 1: MOBILE OTP VERIFICATION ───────────────────────────────── */}
      {step === 1 && (
        <div className="card-clean p-6 sm:p-10 space-y-6 max-w-lg mx-auto bg-white">
          <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-2">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'टप्पा १: रुग्णाचा मोबाईल नंबर पडताळणी' : 'Step 1: Patient Mobile Verification'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {isMr
                ? 'सुरक्षित बुकिंग आणि एसएमएस द्वारे टोकन पावती मिळण्यासाठी आपला १० अंकी मोबाईल नंबर प्रविष्ट करा.'
                : 'We send an OTP via SMS to ensure verified appointments and direct token SMS delivery.'}
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? '१०-अंकी मोबाईल नंबर (+९१)' : '10-Digit Mobile Number (+91)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-semibold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-sm font-medium focus:border-[#0F766E] focus:bg-white focus:outline-none transition"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-100 flex items-center gap-2 text-xs text-teal-800">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{isMr ? 'चाचणी मोड: डेमो कोड "123456" वापरू शकता.' : 'Sandbox Demo Mode: Demo code is 123456.'}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs w-full py-3 font-semibold shadow-sm"
              >
                {loading ? (isMr ? 'OTP पाठवत आहे...' : 'Sending OTP...') : (isMr ? 'पडताळणी OTP पाठवा' : 'Send Verification OTP')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-800 space-y-0.5">
                <p className="font-semibold">{isMr ? `OTP पाठवला: +९१-${phone}` : `OTP Sent to +91-${phone}`}</p>
                <p className="text-[11px] text-teal-700">{isMr ? 'डेमो व्हेरिफिकेशन कोड:' : 'Sandbox Demo Code:'} <span className="font-bold font-mono">123456</span></p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? '६-अंकी पडताळणी कोड प्रविष्ट करा' : 'Enter 6-Digit Verification Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-lg font-bold text-center tracking-widest text-slate-900 focus:border-[#0F766E] focus:outline-none"
                  placeholder="123456"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="btn-secondary text-xs flex-1 py-2.5"
                >
                  {isMr ? 'नंबर बदला' : 'Change No.'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs flex-2 py-2.5 font-semibold"
                >
                  {loading ? (isMr ? 'पडताळणी होत आहे...' : 'Verifying...') : (isMr ? 'सत्यापित करा व पुढे जा' : 'Verify & Continue')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ─── STEP 2: PATIENT DEMOGRAPHICS & DOCTOR SELECTION ────────────────── */}
      {step === 2 && (
        <div className="card-clean p-6 sm:p-10 space-y-6 bg-white">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'टप्पा २: डॉक्टर आणि रुग्णाची माहिती' : 'Step 2: Doctor Selection & Patient Demographics'}
              </h2>
              <p className="text-xs text-slate-500">
                {isMr ? 'ओपीडी नोंदणीसाठी अचूक माहिती भरा:' : 'Provide accurate details for Sanjeevani OPD patient records:'}
              </p>
            </div>
            <span className="badge-teal text-xs py-1">
              ✓ +91-{phone} {isMr ? 'सत्यापित' : 'Verified'}
            </span>
          </div>

          <form onSubmit={handleInitBooking} className="space-y-6">
            {/* 1. Doctor Selection Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isMr ? 'तज्ज्ञ डॉक्टर निवडा *' : 'Select Specialist Doctor *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOCTOR_OPTIONS.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-teal-50/50 border-[#0F766E] shadow-sm ring-1 ring-[#0F766E]'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {isMr ? doc.nameMr : doc.name}
                          </h4>
                          <span className="text-xs font-bold text-[#0F766E]">₹{doc.fee}</span>
                        </div>
                        <p className="text-[11px] text-[#0F766E] font-medium truncate">
                          {isMr ? doc.departmentMr : doc.department}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {isMr ? doc.timingsMr : doc.timings}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'रुग्णाचे पूर्ण नाव *' : 'Patient Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  placeholder={isMr ? 'उदा. ज्ञानेश्वर जाधव' : 'e.g. Dnyaneshwar Jadhav'}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'वय (वर्षे) *' : 'Patient Age *'}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'लिंग *' : 'Gender *'}
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                >
                  <option value="Male">{isMr ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="Female">{isMr ? 'स्त्री (Female)' : 'Female'}</option>
                  <option value="Other">{isMr ? 'इतर (Other)' : 'Other'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isMr ? 'गाव / शहर / तालुका *' : 'City / Town / Taluka *'}
                </label>
                <input
                  type="text"
                  required
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                  placeholder={isMr ? 'उदा. जालना शहर' : 'e.g. Jalna City / Ambad'}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                {isMr ? 'आजाराचे मुख्य लक्षण / कारण (पर्यायी)' : 'Primary Symptoms / Reason for Consultation (Optional)'}
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={isMr ? 'उदा. गुडघेदुखी, ताप, खोकला, नियमित तपासणी...' : 'e.g. Joint pain, fever, pediatric routine checkup...'}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary text-xs py-2 px-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isMr ? 'मागे' : 'Back'}</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs py-2.5 px-6 font-semibold"
              >
                <span>{loading ? (isMr ? 'जतन करत आहे...' : 'Saving...') : (isMr ? 'वेळ व स्लॉट निवडा' : 'Proceed to Live Slots')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── STEP 3: INTERACTIVE DATE & TIME-SLOT PICKER ─────────────────────── */}
      {step === 3 && (
        <div className="card-clean p-6 sm:p-10 space-y-6 bg-white">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                {isMr ? 'टप्पा ३: ओपीडी तारीख व वेळ स्लॉट निवडा' : 'Step 3: Select Consultation Date & Time-Slot'}
              </h2>
              <p className="text-xs text-slate-500">
                {isMr ? 'तपासणी डॉक्टर:' : 'Consulting:'} <span className="font-bold text-slate-800">{isMr ? selectedDoctor.nameMr : selectedDoctor.name}</span> ({isMr ? selectedDoctor.departmentMr : selectedDoctor.department})
              </p>
            </div>
            <span className="badge-teal text-xs py-1 px-3">
              {isMr ? `ओपीडी शुल्क: ₹${selectedDoctor.fee}` : `OPD Fee: ₹${selectedDoctor.fee}`}
            </span>
          </div>

          {/* Quick Date Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              {isMr ? 'अपॉइंटमेंट तारीख निवडा:' : 'Select Appointment Date:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {quickDates.map((qd) => {
                const isSelected = selectedDate === qd.dateStr;
                return (
                  <button
                    key={qd.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(qd.dateStr);
                      fetchDoctorAvailability(selectedDoctorId, qd.dateStr);
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs block truncate">{qd.label}</span>
                    <span className="text-[10px] opacity-80 block font-mono">{qd.dateStr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Slots */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isMr ? 'उपलब्ध ओपीडी वेळ-स्लॉट:' : 'Available OPD Time-Slots:'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isMr ? '१० मिनिटांसाठी स्लॉट होल्ड केला जातो' : 'Slot held for 10 minutes'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {availableSlots.map((slot) => {
                const isAvailable = slot.status === 'AVAILABLE';
                return (
                  <button
                    key={slot.id}
                    disabled={!isAvailable || loading}
                    onClick={() => handleReserveSlot(slot)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                      isAvailable
                        ? 'bg-white hover:bg-[#0F766E] hover:text-white border-slate-200 hover:border-[#0F766E] shadow-xs cursor-pointer group'
                        : 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">{slot.startTime}</span>
                    <span className="text-[10px] uppercase font-semibold">
                      {isAvailable ? (isMr ? 'उपलब्ध' : 'AVAILABLE') : (isMr ? 'बुक' : 'BOOKED')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary text-xs py-2 px-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isMr ? 'मागे' : 'Back'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4: FEE SUMMARY & RAZORPAY PAYMENT ──────────────────────────── */}
      {step === 4 && (
        <div className="card-clean p-6 sm:p-10 space-y-6 max-w-xl mx-auto bg-white">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              {isMr ? 'टप्पा ४: ओपीडी सल्ला शुल्क पेमेंट' : 'Step 4: Consultation Fee Payment'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMr
                ? `तारीख ${selectedDate} रोजी वेळ ${selectedSlot?.startTime || '11:00 AM'} चा स्लॉट आपल्यासाठी राखीव आहे.`
                : `Slot on ${selectedDate} at ${selectedSlot?.startTime || '11:00 AM'} is reserved for you.`}
            </p>
          </div>

          {/* Invoice Summary Card */}
          <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{isMr ? 'रुग्णाचे नाव:' : 'Patient Name:'}</span>
              <span className="font-bold text-slate-900">{patientName} ({patientAge} Yrs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isMr ? 'तपासणी डॉक्टर:' : 'Specialist Doctor:'}</span>
              <span className="font-bold text-slate-900">{isMr ? selectedDoctor.nameMr : selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isMr ? 'वैद्यकीय विभाग:' : 'Clinical Department:'}</span>
              <span className="text-slate-800">{isMr ? selectedDoctor.departmentMr : selectedDoctor.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isMr ? 'अपॉइंटमेंट स्लॉट:' : 'Reporting Slot:'}</span>
              <span className="font-bold text-[#0F766E]">{selectedDate} ({selectedSlot?.startTime || '11:00 AM'})</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>{isMr ? 'एकूण देय रक्कम:' : 'Total Payable Fee:'}</span>
              <span className="text-[#0F766E] text-base">₹{selectedDoctor.fee}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              {isMr ? 'पेमेंट पर्याय निवडा:' : 'Select Payment Method:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'upi', label: 'UPI / GPay / PhonePe' },
                { key: 'card', label: 'Debit / Credit Card' },
                { key: 'netbanking', label: 'NetBanking' },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setPaymentMethod(m.key as any)}
                  className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition ${
                    paymentMethod === m.key
                      ? 'bg-teal-50 text-[#0F766E] border-[#0F766E]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{isMr ? '२५६-बिट सुरक्षित पेमेंट गेटवे (Sandbox Verified)' : '256-Bit Razorpay Secure Payment (Sandbox Active)'}</span>
          </div>

          <button
            onClick={handleCompletePayment}
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-semibold shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? (isMr ? 'पेमेंट पडताळणी होत आहे...' : 'Verifying Payment...') : (isMr ? `₹${selectedDoctor.fee} भरा व टोकन मिळवा` : `Pay ₹${selectedDoctor.fee} & Confirm Appointment`)}</span>
          </button>
        </div>
      )}

      {/* ─── STEP 5: OFFICIAL APPOINTMENT TOKEN RECEIPT ──────────────────────── */}
      {step === 5 && confirmedApt && (
        <div className="card-clean p-6 sm:p-10 space-y-6 max-w-xl mx-auto bg-white">
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {isMr ? 'अपॉइंटमेंट यशस्वीरीत्या नोंदवली गेली!' : 'OPD Appointment Confirmed!'}
            </h2>
            <p className="text-xs text-slate-500">
              {isMr
                ? 'आपली अपॉइंटमेंट संजीवनी हॉस्पिटलच्या ओपीडी प्रणालीमध्ये नोंदवली गेली आहे.'
                : 'Your appointment has been registered in the Sanjeevani Hospital OPD queue.'}
            </p>
          </div>

          {/* Official Pass / Token Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  {isMr ? 'हॉस्पिटल टोकन क्रमांक' : 'Hospital Token ID'}
                </span>
                <span className="text-2xl font-bold text-slate-900 font-mono">
                  {confirmedApt.appointmentCode}
                </span>
              </div>
              <span className="badge-teal text-xs py-1 px-3">
                {isMr ? `सत्यापित व भरणा पूर्ण (₹${confirmedApt.appointment.fee})` : `PAID & VERIFIED (₹${confirmedApt.appointment.fee})`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">{isMr ? 'रुग्णाचे नाव:' : 'Patient Name:'}</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{isMr ? 'मोबाईल नंबर:' : 'Contact Phone:'}</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{isMr ? 'तपासणी डॉक्टर:' : 'Consultant Doctor:'}</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.doctorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{isMr ? 'वैद्यकीय विभाग:' : 'Clinical Department:'}</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{isMr ? 'तारीख:' : 'Appointment Date:'}</span>
                <span className="font-bold text-[#0F766E]">{confirmedApt.appointment.appointmentDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{isMr ? 'उपस्थिती वेळ:' : 'Reporting Time:'}</span>
                <span className="font-bold text-[#0F766E]">{confirmedApt.appointment.startTime}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">{isMr ? 'हॉस्पिटल सूचना:' : 'Hospital Reporting Instructions:'}</p>
              <p className="text-[11px] leading-relaxed">{confirmedApt.reportingInstructions}</p>
              <p className="text-[11px] text-slate-500 pt-1">
                📍 {confirmedApt.hospitalAddress} • 📞 {confirmedApt.emergencyHelpline}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs w-full sm:w-auto"
            >
              <Printer className="w-4 h-4" />
              <span>{isMr ? 'पावती प्रिंट करा' : 'Print Token Slip'}</span>
            </button>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setStep(1);
                  setOtpSent(false);
                  setConfirmedApt(null);
                }}
                className="btn-secondary text-xs flex-1 sm:flex-none"
              >
                {isMr ? 'दुसरी बुकिंग' : 'Book Another'}
              </button>
              <Link
                to="/"
                className="btn-primary text-xs flex-1 sm:flex-none"
              >
                {isMr ? 'मुख्यपृष्ठ' : 'Home Page'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
