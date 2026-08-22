import React, { useState } from 'react';
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
  const [, setVerifiedPaymentId] = useState('');

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
          razorpayOrderId: paymentOrder?.orderId || 'order_demo',
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="badge-teal text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sanjeevani Multispeciality Hospital, Jalna</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
          Direct OPD Appointment Booking
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          5-step online booking with verified specialist doctors and instant confirmation token.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-semibold">
        {[
          { num: 1, label: 'Phone OTP', short: 'OTP' },
          { num: 2, label: 'Patient Info', short: 'Info' },
          { num: 3, label: 'Select Slot', short: 'Slot' },
          { num: 4, label: 'Payment', short: 'Pay' },
          { num: 5, label: 'Confirmed', short: 'Done' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2 rounded-lg transition-colors ${
              step === s.num
                ? 'bg-[#0F766E] text-white shadow-sm'
                : step > s.num
                ? 'bg-teal-50 text-teal-800'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <span className="block text-[10px] uppercase">Step {s.num}</span>
            <span className="truncate block mt-0.5 sm:inline hidden">{s.label}</span>
            <span className="truncate block mt-0.5 sm:hidden">{s.short}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Phone OTP */}
      {step === 1 && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-heading">Step 1: Patient Mobile Verification</h2>
            <p className="text-xs text-slate-500">
              We send an OTP via SMS to ensure secure appointments and instant token delivery.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  10-Digit Mobile Number (+91)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-medium text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs w-full py-2.5"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md">
              <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-800">
                OTP sent to +91-{phone}. (Demo Code: <span className="font-bold">123456</span>)
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-center tracking-widest focus:border-[#0F766E] focus:outline-none"
                  placeholder="123456"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="btn-secondary text-xs flex-1"
                >
                  Change No.
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs flex-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* STEP 2: Patient Info */}
      {step === 2 && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Step 2: Patient Details & Doctor Selection</h2>
              <p className="text-xs text-slate-500">Provide accurate patient information for OPD registration.</p>
            </div>
            <span className="badge-teal text-xs">
              ✓ +91-{phone}
            </span>
          </div>

          <form onSubmit={handleInitBooking} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Select Doctor & Specialty</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
              >
                {DOCTOR_OPTIONS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.department} (₹{doc.fee} OPD)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Age (Years)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">City / Village / Taluka</label>
                <input
                  type="text"
                  required
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs py-2 px-4"
              >
                <span>{loading ? 'Saving...' : 'Proceed to Live Slots'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Slot Picker */}
      {step === 3 && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Step 3: Select Consultation Time-Slot</h2>
              <p className="text-xs text-slate-500">
                Consulting <span className="font-semibold text-slate-800">{selectedDoctor.name}</span> ({selectedDoctor.department})
              </p>
            </div>
            <span className="badge-teal text-xs">
              OPD Fee: ₹{selectedDoctor.fee}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-slate-700">Appointment Date:</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                fetchDoctorAvailability(selectedDoctorId, e.target.value);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:border-[#0F766E] focus:outline-none"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2.5">Available Time-Slots:</span>
            {availableSlots.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-lg text-center text-xs text-slate-500">
                No slots available on this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableSlots.map((slot) => {
                  const isAvailable = slot.status === 'AVAILABLE';
                  return (
                    <button
                      key={slot.id}
                      disabled={!isAvailable || loading}
                      onClick={() => handleReserveSlot(slot)}
                      className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-center space-y-1 ${
                        isAvailable
                          ? 'bg-white hover:bg-[#0F766E] hover:text-white border-slate-200 hover:border-[#0F766E] shadow-sm cursor-pointer'
                          : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{slot.startTime}</span>
                      <span className="text-[10px] uppercase">
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

      {/* STEP 4: Payment */}
      {step === 4 && (
        <div className="card-clean p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-heading">Step 4: Consultation Fee Payment</h2>
            <p className="text-xs text-slate-500">
              Slot <span className="font-semibold text-[#0F766E]">{selectedSlot?.startTime}</span> on <span className="font-semibold text-slate-800">{selectedDate}</span> is held for you for 10 minutes.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-semibold text-slate-900">{patientName} ({patientAge} Yrs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Specialist Doctor:</span>
              <span className="font-semibold text-slate-900">{selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-800">{selectedDoctor.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reporting Slot:</span>
              <span className="font-semibold text-[#0F766E]">{selectedDate} at {selectedSlot?.startTime}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable:</span>
              <span className="text-[#0F766E]">₹{selectedDoctor.fee}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50 rounded-lg text-xs text-teal-800 space-y-0.5">
            <div className="flex items-center space-x-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Razorpay Secure Payment Gateway</span>
            </div>
            <p className="text-[11px] text-teal-700">
              Order ID: <code className="font-mono">{paymentOrder?.orderId || 'order_demo'}</code>
            </p>
          </div>

          <button
            onClick={handleCompletePayment}
            disabled={loading}
            className="btn-primary w-full py-2.5 text-xs font-semibold"
          >
            <CreditCard className="w-4 h-4" />
            <span>{loading ? 'Verifying Payment...' : `Pay ₹${selectedDoctor.fee} & Confirm Appointment`}</span>
          </button>
        </div>
      )}

      {/* STEP 5: Confirmed Receipt */}
      {step === 5 && confirmedApt && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-500">
              Your appointment has been registered in the Sanjeevani Hospital OPD queue.
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-slate-50 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Hospital Token ID
                </span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {confirmedApt.appointmentCode}
                </span>
              </div>
              <span className="badge-teal text-xs">
                PAID & VERIFIED (₹{confirmedApt.appointment.fee})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-semibold text-slate-900">{confirmedApt.appointment.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Phone:</span>
                <span className="font-semibold text-slate-900">{confirmedApt.appointment.patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Specialist Doctor:</span>
                <span className="font-semibold text-slate-900">{confirmedApt.appointment.doctorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="font-semibold text-slate-900">{confirmedApt.appointment.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Appointment Date:</span>
                <span className="font-semibold text-[#0F766E]">{confirmedApt.appointment.appointmentDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reporting Time:</span>
                <span className="font-semibold text-[#0F766E]">{confirmedApt.appointment.startTime}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Hospital Instructions:</p>
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
              <span>Print Token Slip</span>
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
                Book Another
              </button>
              <Link
                to="/"
                className="btn-primary text-xs flex-1 sm:flex-none"
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
