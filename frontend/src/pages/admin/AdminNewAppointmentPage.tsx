import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarPlus, Download, Receipt, Phone, Footprints } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { DateCalendar } from '../../components/DateCalendar';
import { SlotPicker } from '../../components/SlotPicker';
import { PatientPicker } from '../../components/PatientPicker';
import { Field, Notice, PageHeader, Step } from '../../components/adminUi';
import type { RegisteredPatient } from '../../lib/reception';
import { addDays, inputClass, inr, todayIst } from '../../lib/reception';
import { downloadAppointmentPdf } from '../../lib/appointmentPdf';

interface Doc {
  id: string;
  name: string;
  department: string;
  fee: number;
}

interface Booked {
  appointmentCode: string;
  appointment: {
    id: string;
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: string;
    doctorName: string;
    department: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    fee: number;
    paymentStatus: 'PAID' | 'PENDING';
  };
}

export const AdminNewAppointmentPage: React.FC = () => {
  const [params] = useSearchParams();
  const today = todayIst();
  const [patient, setPatient] = useState<RegisteredPatient | null>(null);
  const [doctors, setDoctors] = useState<Doc[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [source, setSource] = useState<'WALK_IN' | 'PHONE'>('WALK_IN');
  const [fee, setFee] = useState('');
  const [payment, setPayment] = useState<'PAID' | 'PENDING'>('PENDING');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState<Booked | null>(null);

  useEffect(() => {
    apiFetch<Doc[]>('/appointments/staff/doctors')
      .then((r) => setDoctors(Array.isArray(r.data) ? r.data : []))
      .catch((e) => setError(e?.message || 'Could not load the doctors.'));
  }, []);

  useEffect(() => {
    const id = params.get('patientId');
    if (!id) return;
    apiFetch<RegisteredPatient>(`/patients/${id}`).then((r) => setPatient(r.data)).catch(() => undefined);
  }, [params]);

  const doctor = doctors.find((d) => d.id === doctorId);
  const needsFee = !!doctor && doctor.fee <= 0;
  const feeToCharge = doctor ? (doctor.fee > 0 ? doctor.fee : Number(fee) || 0) : 0;

  const byDept = useMemo(() => {
    const m = new Map<string, Doc[]>();
    doctors.forEach((d) => m.set(d.department, [...(m.get(d.department) || []), d]));
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [doctors]);

  const reset = () => {
    setBooked(null);
    setStartTime('');
    setPatient(null);
    setPayment('PENDING');
    setFee('');
    setError('');
  };

  const submit = async () => {
    setError('');
    if (!patient) return setError('Choose the patient first.');
    if (!doctor) return setError('Choose a doctor.');
    if (!startTime) return setError('Pick a time.');
    if (needsFee && !(Number(fee) > 0) && payment === 'PAID') return setError('Enter the fee that was collected.');
    setBusy(true);
    try {
      const res = await apiFetch<Booked>('/appointments/staff-book', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: doctor.id,
          date,
          startTime,
          patientName: patient.name,
          patientPhone: patient.phone,
          patientAge: patient.age ?? 0,
          patientGender: patient.gender || undefined,
          patientAddress: patient.address || undefined,
          patientId: patient.id,
          patientRegNo: patient.regNo,
          source,
          fee: needsFee && Number(fee) > 0 ? Math.round(Number(fee)) : undefined,
          paymentStatus: payment,
        }),
      });
      setBooked(res.data);
    } catch (e: any) {
      setError(e?.message || 'Could not book this visit.');
    } finally {
      setBusy(false);
    }
  };

  if (booked) {
    const a = booked.appointment;
    return (
      <div className="max-w-[720px] mx-auto space-y-6">
        <PageHeader icon={CalendarPlus} title="Visit booked" />
        <div className="bg-white border border-emerald-300 rounded-lg p-5 sm:p-6">
          <p className="text-sm text-stone-600">Token number</p>
          <p className="text-3xl font-semibold tracking-wide">{booked.appointmentCode}</p>
          <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px]">
            <div><dt className="text-sm text-stone-500">Patient</dt><dd className="font-medium">{a.patientName}</dd></div>
            <div><dt className="text-sm text-stone-500">Doctor</dt><dd className="font-medium">{a.doctorName}</dd></div>
            <div><dt className="text-sm text-stone-500">Date and time</dt><dd className="font-medium">{new Date(`${a.appointmentDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}, {a.startTime}</dd></div>
            <div><dt className="text-sm text-stone-500">Fee</dt><dd className="font-medium">{a.fee > 0 ? inr(a.fee) : 'Not set'} · {a.paymentStatus === 'PAID' ? 'paid' : 'to pay at the counter'}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/admin/receipts/new?patientId=${patient?.id || ''}&appointmentCode=${booked.appointmentCode}`} className="btn-primary">
              <Receipt className="w-4 h-4" /> Make a receipt
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                downloadAppointmentPdf({
                  kind: 'confirmed',
                  appointmentCode: booked.appointmentCode,
                  patientName: a.patientName,
                  patientAge: a.patientAge,
                  patientGender: a.patientGender,
                  patientPhone: `+91 ${a.patientPhone}`,
                  phoneVerified: true,
                  doctorName: a.doctorName,
                  department: a.department,
                  date: a.appointmentDate,
                  startTime: a.startTime,
                  endTime: a.endTime,
                  fee: a.fee,
                  paid: a.paymentStatus === 'PAID',
                })
              }
            >
              <Download className="w-4 h-4" /> Download token slip
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 text-sm">
            <button type="button" onClick={reset} className="min-h-[44px] sm:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">Book another visit</button>
            <Link to="/admin/appointments" className="inline-flex items-center min-h-[44px] sm:min-h-0 text-[#0F766E] font-semibold hover:underline underline-offset-4">See all appointments</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto space-y-5">
      <PageHeader icon={CalendarPlus} title="Book a visit" subtitle="For patients who walk in or call the hospital." />
      {error && <Notice kind="error">{error}</Notice>}

      <Step n={1} title="Who is the patient?" done={!!patient}>
        <PatientPicker value={patient} onChange={setPatient} registerHint="appointment" />
      </Step>

      <Step n={2} title="Which doctor?" done={!!doctor}>
        <Field label="Doctor" htmlFor="doc">
          <select id="doc" className={inputClass} value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setStartTime(''); }}>
            <option value="">Choose a doctor</option>
            {byDept.map(([dept, list]) => (
              <optgroup key={dept} label={dept}>
                {list.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}{d.fee > 0 ? ` · ${inr(d.fee)}` : ''}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
      </Step>

      <Step n={3} title="Which day and time?" done={!!startTime}>
        {!doctor ? (
          <p className="text-sm text-stone-500">Choose a doctor first.</p>
        ) : (
          <div className="space-y-4">
            <DateCalendar value={date} minDate={today} maxDate={addDays(today, 60)} note={null} onChange={(k) => { setDate(k); setStartTime(''); }} />
            <SlotPicker doctorId={doctor.id} date={date} value={startTime} onChange={setStartTime} />
          </div>
        )}
      </Step>

      <Step n={4} title="How did they book, and what about the fee?">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium mb-2">How did the patient book?</p>
            <div role="radiogroup" className="grid sm:grid-cols-2 gap-2">
              {([['WALK_IN', 'Walked in', Footprints], ['PHONE', 'Called on the phone', Phone]] as const).map(([v, label, Icon]) => (
                <button key={v} type="button" role="radio" aria-checked={source === v} onClick={() => setSource(v)} className={`min-h-[48px] px-4 rounded-md border text-left flex items-center gap-2.5 ${source === v ? 'border-[#0F766E] bg-[#F0F7F6] font-semibold' : 'border-[#D8D3C8] bg-white hover:border-[#0F766E]'}`}>
                  <Icon className="w-4 h-4 text-[#0F766E]" aria-hidden /> {label}
                </button>
              ))}
            </div>
          </div>

          {needsFee && (
            <Field label="Consultation fee (₹)" htmlFor="fee" hint="This doctor’s fee isn’t set yet. Enter the amount for this visit.">
              <input id="fee" inputMode="numeric" className={`${inputClass} sm:max-w-[200px]`} value={fee} onChange={(e) => setFee(e.target.value.replace(/\D/g, ''))} />
            </Field>
          )}

          <div>
            <p className="text-sm font-medium mb-2">
              Fee{doctor ? `: ${feeToCharge > 0 ? inr(feeToCharge) : 'not set'}` : ''}
            </p>
            <div role="radiogroup" className="grid sm:grid-cols-2 gap-2">
              {([['PENDING', 'Will pay at the counter'], ['PAID', 'Already paid']] as const).map(([v, label]) => (
                <button key={v} type="button" role="radio" aria-checked={payment === v} onClick={() => setPayment(v)} className={`min-h-[48px] px-4 rounded-md border text-left ${payment === v ? 'border-[#0F766E] bg-[#F0F7F6] font-semibold' : 'border-[#D8D3C8] bg-white hover:border-[#0F766E]'}`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-stone-500">You can make the receipt on the next screen.</p>
          </div>
        </div>
      </Step>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={submit} disabled={busy || !patient || !doctor || !startTime} className="btn-primary disabled:opacity-50">
          {busy ? 'Booking…' : 'Book this visit'}
        </button>
        <Link to="/admin/appointments" className="text-sm text-stone-600 hover:underline underline-offset-4">Cancel</Link>
      </div>
    </div>
  );
};
