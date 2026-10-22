import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Receipt as ReceiptIcon, Trash2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { PatientPicker } from '../../components/PatientPicker';
import { ReceiptLangToggle } from '../../components/ReceiptLangToggle';
import { Field, Notice, PageHeader, Step } from '../../components/adminUi';
import type { PaymentMode, Receipt, ReceiptKind, RegisteredPatient } from '../../lib/reception';
import { GST_RATES, PAYMENT_MODES, RECEIPT_KINDS, getReceiptLang, inputClass, inr, setReceiptLang } from '../../lib/reception';

interface Line {
  name: string;
  qty: string;
  rate: string;
  gst: number;
}

interface AptInfo {
  appointmentCode: string;
  doctorName: string;
  fee: number;
  patientPhone: string;
  patientName: string;
  paymentStatus: 'PAID' | 'PENDING';
}

const SUGGESTIONS: Record<ReceiptKind, string[]> = {
  CONSULTATION: ['OPD consultation', 'Follow-up consultation'],
  REGISTRATION: ['Registration fee', 'Case paper'],
  PROCEDURE: ['Dressing', 'Injection', 'Minor procedure', 'Bed charges'],
  LAB: ['Blood test', 'Urine test', 'X-ray', 'ECG', 'Ultrasound'],
  PHARMACY: ['Medicines'],
  ADVANCE: ['Advance payment'],
  OTHER: [],
};

const cents = (n: number) => Math.round((n + Number.EPSILON) * 100);

/** Same working as the server, to show the total while typing. The server's figures are the ones printed. */
function preview(lines: Line[], discountText: string) {
  const rows = lines
    .filter((l) => l.name.trim() && Number(l.rate) >= 0 && l.rate !== '')
    .map((l) => ({ amount: Math.max(1, Math.round(Number(l.qty) || 1)) * cents(Number(l.rate)), gst: l.gst }));
  const subtotal = rows.reduce((s, r) => s + r.amount, 0);
  const discount = Math.min(cents(Number(discountText) || 0), subtotal);
  let tax = 0;
  rows.forEach((r) => {
    const share = subtotal ? Math.floor((r.amount * discount) / subtotal) : 0;
    tax += Math.round(((r.amount - share) * r.gst) / 100);
  });
  return { subtotal: subtotal / 100, discount: discount / 100, tax: tax / 100, total: (subtotal - discount + tax) / 100 };
}

export const AdminReceiptFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [lang, setLang] = useState(getReceiptLang());
  const [patient, setPatient] = useState<RegisteredPatient | null>(null);
  const [walkIn, setWalkIn] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kind, setKind] = useState<ReceiptKind>('CONSULTATION');
  const [apt, setApt] = useState<AptInfo | null>(null);
  const [lines, setLines] = useState<Line[]>([{ name: '', qty: '1', rate: '', gst: 0 }]);
  const [discount, setDiscount] = useState('');
  const [paid, setPaid] = useState('');
  const [paidEdited, setPaidEdited] = useState(false);
  const [mode, setMode] = useState<PaymentMode>('CASH');
  const [ref, setRef] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.get('patientId');
    if (id) apiFetch<RegisteredPatient>(`/patients/${id}`).then((r) => setPatient(r.data)).catch(() => undefined);
    const code = params.get('appointmentCode');
    if (code) {
      apiFetch<AptInfo>(`/appointments/${encodeURIComponent(code)}`)
        .then((r) => {
          setApt(r.data);
          setLines([{ name: `OPD consultation - ${r.data.doctorName}`, qty: '1', rate: r.data.fee > 0 ? String(r.data.fee) : '', gst: 0 }]);
          // No registered patient given: fall back to the details on the booking
          if (!id) {
            setWalkIn(true);
            setName(r.data.patientName);
            setPhone(r.data.patientPhone);
          }
        })
        .catch(() => undefined);
    }
  }, [params]);

  const totals = useMemo(() => preview(lines, discount), [lines, discount]);
  // Until the receptionist types an amount, assume the full amount is being paid
  const paidNow = paidEdited ? Number(paid) || 0 : totals.total;
  const balance = Math.max(0, Math.round((totals.total - paidNow) * 100) / 100);

  const setLine = (i: number, patch: Partial<Line>) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!walkIn && !patient) return setError('Choose the patient, or tick “Patient is not registered”.');
    if (walkIn && (name.trim().length < 2 || !/^\d{10}$/.test(phone))) return setError('Enter the patient’s name and 10-digit mobile number.');
    const filled = lines.filter((l) => l.name.trim());
    if (filled.length === 0) return setError('Add at least one item.');
    if (filled.some((l) => l.rate === '' || Number(l.rate) < 0)) return setError('Every item needs an amount.');
    if (totals.total <= 0) return setError('The total must be more than ₹0.');
    if (paidNow > totals.total) return setError('The amount received is more than the total.');
    if (paidNow > 0 && ['UPI', 'CARD', 'ONLINE', 'CHEQUE'].includes(mode) && !ref.trim()) {
      return setError('Enter the transaction or cheque number for this payment.');
    }
    setBusy(true);
    try {
      const res = await apiFetch<Receipt>('/receipts', {
        method: 'POST',
        body: JSON.stringify({
          kind,
          ...(walkIn ? { patientName: name.trim(), patientPhone: phone } : { patientId: patient!.id }),
          appointmentCode: apt?.appointmentCode,
          doctorName: apt?.doctorName,
          items: filled.map((l) => ({ name: l.name.trim(), qty: Math.max(1, Math.round(Number(l.qty) || 1)), rate: Number(l.rate), gstPercent: l.gst })),
          discount: Number(discount) || 0,
          paid: paidNow,
          paymentMode: mode,
          paymentRef: ref.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });
      navigate(`/admin/receipts/${res.data.id}`);
    } catch (err: any) {
      setError(err?.message || 'Could not make the receipt.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-[860px] mx-auto space-y-5" noValidate>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <PageHeader icon={ReceiptIcon} title="Make a receipt" subtitle="Record money received from a patient." />
        <ReceiptLangToggle value={lang} onChange={(l) => { setLang(l); setReceiptLang(l); }} />
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {apt && <Notice kind="info">For token {apt.appointmentCode} with {apt.doctorName}.</Notice>}

      <Step n={1} title="Who is paying?" done={walkIn ? name.trim().length > 1 && phone.length === 10 : !!patient}>
        {!walkIn && <PatientPicker value={patient} onChange={setPatient} registerHint="receipt" />}
        <label className="mt-3 flex items-center gap-2.5 min-h-[44px] sm:min-h-0 text-sm cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#0F766E]" checked={walkIn} onChange={(e) => setWalkIn(e.target.checked)} />
          Patient is not registered
        </label>
        {walkIn && (
          <div className="mt-2 grid sm:grid-cols-2 gap-4">
            <Field label="Patient name" htmlFor="r-name"><input id="r-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" /></Field>
            <Field label="Mobile number" htmlFor="r-phone"><input id="r-phone" inputMode="numeric" maxLength={10} className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} autoComplete="off" /></Field>
          </div>
        )}
      </Step>

      <Step n={2} title="What is it for?" done={lines.some((l) => l.name.trim() && l.rate !== '')}>
        <Field label="Type of receipt" htmlFor="r-kind" className="sm:max-w-xs mb-4">
          <select id="r-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as ReceiptKind)}>
            {RECEIPT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </Field>

        <datalist id="r-items">{SUGGESTIONS[kind].map((s) => <option key={s} value={s} />)}</datalist>
        <div className="space-y-3">
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 items-end p-3 rounded-md bg-stone-50 border border-[#E7E3DA]">
              <Field label="Item" htmlFor={`l-name-${i}`} className="col-span-6 sm:col-span-3">
                <input id={`l-name-${i}`} list="r-items" className={inputClass} value={l.name} onChange={(e) => setLine(i, { name: e.target.value })} placeholder="e.g. OPD consultation" />
              </Field>
              <Field label="Qty" htmlFor={`l-qty-${i}`} className="col-span-2 sm:col-span-1">
                <input id={`l-qty-${i}`} inputMode="numeric" className={inputClass} value={l.qty} onChange={(e) => setLine(i, { qty: e.target.value.replace(/\D/g, '') })} />
              </Field>
              <Field label="Price (₹)" htmlFor={`l-rate-${i}`} className="col-span-3 sm:col-span-2">
                <input id={`l-rate-${i}`} inputMode="decimal" className={inputClass} value={l.rate} onChange={(e) => setLine(i, { rate: e.target.value.replace(/[^\d.]/g, '') })} />
              </Field>
              <div className="col-span-1 flex justify-end">
                {lines.length > 1 && (
                  <button type="button" aria-label={`Remove item ${i + 1}`} onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-stone-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Field label="GST on this item" htmlFor={`l-gst-${i}`} className="col-span-6 sm:col-span-3">
                <select id={`l-gst-${i}`} className={inputClass} value={l.gst} onChange={(e) => setLine(i, { gst: Number(e.target.value) })}>
                  {GST_RATES.map((g) => <option key={g} value={g}>{g === 0 ? 'No GST' : `${g}% GST`}</option>)}
                </select>
              </Field>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setLines((ls) => [...ls, { name: '', qty: '1', rate: '', gst: 0 }])} className="mt-3 inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-sm text-[#0F766E] font-semibold hover:underline underline-offset-4">
          <Plus className="w-4 h-4" /> Add another item
        </button>
        <p className="mt-1 text-sm text-stone-500">Most hospital services have no GST. Change it only for items where GST applies.</p>
      </Step>

      <Step n={3} title="Amount and payment">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Discount (₹)" htmlFor="r-disc" hint="Optional">
            <input id="r-disc" inputMode="decimal" className={inputClass} value={discount} onChange={(e) => setDiscount(e.target.value.replace(/[^\d.]/g, ''))} />
          </Field>
          <Field label="Amount received now (₹)" htmlFor="r-paid" hint={balance > 0 ? `₹${balance.toLocaleString('en-IN')} will stay as balance due.` : 'Full amount.'}>
            <input id="r-paid" inputMode="decimal" className={inputClass} value={paidEdited ? paid : totals.total ? String(totals.total) : ''} onChange={(e) => { setPaidEdited(true); setPaid(e.target.value.replace(/[^\d.]/g, '')); }} />
          </Field>
          <Field label="How was it paid?" htmlFor="r-mode">
            <select id="r-mode" className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as PaymentMode)}>
              {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </Field>
          <Field label={mode === 'CHEQUE' ? 'Cheque number' : 'Transaction or reference number'} htmlFor="r-ref" hint={mode === 'CASH' ? 'Not needed for cash' : undefined}>
            <input id="r-ref" className={inputClass} value={ref} onChange={(e) => setRef(e.target.value)} autoComplete="off" />
          </Field>
        </div>
        <Field label="Note (optional)" htmlFor="r-note" className="mt-4">
          <textarea id="r-note" rows={2} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        <dl className="mt-5 ml-auto max-w-xs space-y-1.5 text-[15px]">
          <div className="flex justify-between"><dt className="text-stone-600">Subtotal</dt><dd>{inr(totals.subtotal)}</dd></div>
          {totals.discount > 0 && <div className="flex justify-between"><dt className="text-stone-600">Discount</dt><dd>- {inr(totals.discount)}</dd></div>}
          {totals.tax > 0 && <div className="flex justify-between"><dt className="text-stone-600">GST</dt><dd>{inr(totals.tax)}</dd></div>}
          <div className="flex justify-between border-t border-[#E7E3DA] pt-2 text-lg font-semibold"><dt>Total</dt><dd>{inr(totals.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-600">Received</dt><dd>{inr(paidNow)}</dd></div>
          {balance > 0 && <div className="flex justify-between text-amber-800 font-medium"><dt>Balance due</dt><dd>{inr(balance)}</dd></div>}
        </dl>
      </Step>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Make receipt'}</button>
        <Link to="/admin/receipts" className="text-sm text-stone-600 hover:underline underline-offset-4">Cancel</Link>
      </div>
    </form>
  );
};
