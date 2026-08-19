import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  Printer,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';
import { apiUrl } from '../lib/api';

interface DoctorOption {
  id: string;
  name: string;
  department: string;
  qualifications: string;
  fee: number;
}

const DOCTOR_OPTIONS: DoctorOption[] = [
  {
    id: 'doc-goyal',
    name: 'Dr. Nishant Goyal',
    department: 'Orthopedics & Joint Replacement',
    qualifications: 'MBBS, DNB, D. Ortho',
    fee: 500,
  },
  {
    id: 'doc-mirkad',
    name: 'Dr. Shivdas Mirkad',
    department: 'Pediatrics & Neonatology',
    qualifications: 'MBBS, MD, DCH',
    fee: 500,
  },
  {
    id: 'doc-bagal',
    name: 'Dr. Baliram Bagal',
    department: 'Critical Care & Anesthesiology',
    qualifications: 'MBBS, DA, FICM, CCCS',
    fee: 400,
  },
  {
    id: 'doc-rajguru',
    name: 'Dr. Kailash Rajguru',
    department: 'Internal Medicine',
    qualifications: 'MBBS, MD (Medicine)',
    fee: 400,
  },
  {
    id: 'doc-anshul',
    name: 'Dr. Anshul Goyal',
    department: 'Obstetrics & Gynecology',
    qualifications: 'MBBS, DNB, DGO',
    fee: 500,
  },
  {
    id: 'doc-katole',
    name: 'Dr. Millind Katole',
    department: 'General & Laparoscopic Surgery',
    qualifications: 'MBBS, MS',
    fee: 500,
  },
];

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || 'doc-goyal';

  // Booking Flow Steps: 1: Phone OTP -> 2: Patient Details -> 3: Slot Pick -> 4: Payment -> 5: Confirmed
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: OTP State
  const [phone, setPhone] = useState('9876543210');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [patientToken, setPatientToken] = useState('');

  // Step 2: Patient Demographic State
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [patientName, setPatientName] = useState('Suresh Patil');
  const [patientAge, setPatientAge] = useState(42);
  const [patientGender, setPatientGender] = useState('Male');
  const [patientAddress, setPatientAddress] = useState('Jalna City, Maharashtra');
  const [bookingSessionId, setBookingSessionId] = useState('');

  // Step 3: Slot Reservation State
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [reservedSlotId, setReservedSlotId] = useState('');
  const [holdTimer, setHoldTimer] = useState(600); // 10 minutes

  // Step 4: Razorpay Payment State
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [verifiedPaymentId, setVerifiedPaymentId] = useState('');

  // Step 5: Confirmed Appointment Record
  const [confirmedApt, setConfirmedApt] = useState<any>(null);

  const selectedDoctor =
    DOCTOR_OPTIONS.find((d) => d.id === selectedDoctorId) || DOCTOR_OPTIONS[0];

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
      setError(err.message);
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
      setError(err.message);
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
      setError(err.message);
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
      if (data.success) {
        setAvailableSlots(data.data.slots);
      }
    } catch (err) {
      console.error(err);
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
      setError(err.message);
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
          razorpayOrderId: paymentOrder.orderId,
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
      const confirmRes = await fetch(apiUrl('/appointments/confirm-slot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingSessionId,
          slotId: reservedSlotId,
          paymentId: fakePaymentId,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData.error?.message || 'Could not finalize appointment');
      }

      setConfirmedApt(confirmData.data);
      setStep(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hospital-soft text-hospital-teal text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Sanjeevani Multispeciality Hospital, Jalna</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Direct OPD Appointment Booking
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
          Fast 5-step booking with verified specialists, real-time availability, and instant confirmation token.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
        {[
          { num: 1, label: 'Phone OTP' },
          { num: 2, label: 'Patient Info' },
          { num: 3, label: 'Select Slot' },
          { num: 4, label: 'Payment' },
          { num: 5, label: 'Confirmed' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2 rounded-xl border transition ${
              step === s.num
                ? 'bg-hospital-teal text-white border-hospital-teal shadow-sm'
                : step > s.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <span className="block text-[10px] uppercase tracking-wider">Step {s.num}</span>
            <span className="truncate block mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Phone OTP Verification */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Patient Mobile Verification</h2>
            <p className="text-xs text-slate-500">
              We send an OTP via SMS to ensure secure appointments and instant SMS token delivery.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number (+91)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm disabled:bg-slate-300"
              >
                {loading ? 'Sending OTP via MSG91...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                OTP sent to +91-{phone}. (Sandbox Demo Code: <span className="font-bold">123456</span>)
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-center tracking-widest focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                  placeholder="123456"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Change No.
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 transition shadow-sm disabled:bg-slate-300"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* STEP 2: Patient Demographic Info */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Patient Details & Doctor Selection</h2>
              <p className="text-xs text-slate-500">Provide accurate patient information for OPD registration.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ +91-{phone} Verified
            </span>
          </div>

          <form onSubmit={handleInitBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Doctor & Specialty</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-hospital-teal focus:outline-none"
              >
                {DOCTOR_OPTIONS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.department} (₹{doc.fee} OPD)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Village / Taluka</label>
                <input
                  type="text"
                  required
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-hospital-teal focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 shadow-sm transition disabled:bg-slate-300"
              >
                <span>{loading ? 'Saving...' : 'Proceed to Live Slots'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Live Interactive Slot Picker */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Select Consultation Time-Slot</h2>
              <p className="text-xs text-slate-500">
                Consulting <span className="font-bold text-slate-800">{selectedDoctor.name}</span> ({selectedDoctor.department})
              </p>
            </div>
            <span className="text-xs font-bold text-hospital-teal bg-hospital-soft px-3 py-1 rounded-full">
              OPD Fee: ₹{selectedDoctor.fee}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-slate-700">Appointment Date:</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                fetchDoctorAvailability(selectedDoctorId, e.target.value);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-3">Available Time-Slots:</span>
            {availableSlots.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                No slots available on this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((slot) => {
                  const isAvailable = slot.status === 'AVAILABLE';
                  return (
                    <button
                      key={slot.id}
                      disabled={!isAvailable || loading}
                      onClick={() => handleReserveSlot(slot)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                        isAvailable
                          ? 'bg-hospital-soft/40 hover:bg-hospital-teal hover:text-white border-hospital-teal/30 hover:border-hospital-teal shadow-sm cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold">{slot.startTime}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {slot.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Razorpay Payment Checkout */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 4: Consultation Fee Payment</h2>
            <p className="text-xs text-slate-500">
              Slot <span className="font-bold text-hospital-teal">{selectedSlot?.startTime}</span> on <span className="font-bold text-slate-800">{selectedDate}</span> is held for you for 10 minutes.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Patient:</span>
              <span className="font-bold text-slate-900">{patientName} ({patientAge} Yrs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Specialist Doctor:</span>
              <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Department:</span>
              <span className="font-medium text-slate-800">{selectedDoctor.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Reporting Slot:</span>
              <span className="font-bold text-hospital-teal">{selectedDate} at {selectedSlot?.startTime}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable:</span>
              <span className="text-hospital-teal">₹{selectedDoctor.fee}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Test Gateway Active</span>
            </div>
            <p className="text-[11px]">
              Order ID: <code className="font-mono">{paymentOrder?.orderId}</code> (Key: <code className="font-mono">{paymentOrder?.keyId}</code>)
            </p>
          </div>

          <button
            onClick={handleCompletePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-hospital-teal text-white text-xs font-bold shadow-md hover:bg-hospital-teal/90 transition disabled:bg-slate-300"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? 'Verifying Razorpay Signature...' : `Pay ₹${selectedDoctor.fee} & Confirm Appointment`}</span>
          </button>
        </div>
      )}

      {/* STEP 5: Confirmed Token Slip */}
      {step === 5 && confirmedApt && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card-subtle space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-500">
              Your appointment has been registered and verified in Sanjeevani Hospital OPD queue.
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-hospital-soft/80 border-2 border-hospital-teal/30 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-hospital-teal/20 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-hospital-teal block">
                  Hospital Token ID
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {confirmedApt.appointmentCode}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PAID & VERIFIED (₹{confirmedApt.appointment.fee})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Phone:</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Specialist Doctor:</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.doctorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Clinical Department:</span>
                <span className="font-bold text-slate-900">{confirmedApt.appointment.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Appointment Date:</span>
                <span className="font-bold text-hospital-teal text-sm">{confirmedApt.appointment.appointmentDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reporting Time:</span>
                <span className="font-bold text-hospital-teal text-sm">{confirmedApt.appointment.startTime}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Hospital Reporting Instructions:</p>
              <p className="text-[11px] leading-relaxed">{confirmedApt.reportingInstructions}</p>
              <p className="text-[11px] font-semibold text-hospital-teal pt-1">
                📍 {confirmedApt.hospitalAddress} • 📞 {confirmedApt.emergencyHelpline}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm w-full sm:w-auto justify-center"
            >
              <Printer className="w-4 h-4" />
              <span>Print Token Slip</span>
            </button>

            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setStep(1);
                  setOtpSent(false);
                  setConfirmedApt(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                Book Another
              </button>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-hospital-teal text-white text-xs font-bold hover:bg-hospital-teal/90 shadow-sm transition"
              >
                Home Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
